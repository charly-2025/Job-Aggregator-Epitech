# Security Choices

## 1. Secret Management

### Why
The application uses sensitive credentials such as:
- database credentials;
- JWT signing secrets;
- refresh token secrets.

Hardcoding them inside the source code would expose critical information if the repository is leaked or shared.

### How
Secrets are stored in environment variables using `.env` files and loaded through `dotenv`.

Example:

```js
config({ path: ".env" });
```

Sensitive values include:

```env
DB_PASSWORD=***
JWT_SECRET=***
REFRESH_SECRET=***
```

The `.env` file is excluded from version control using `.gitignore`.

### Trade-off
Environment variables are simple and lightweight for a student project, but they are less secure than dedicated secret-management platforms such as:
- HashiCorp Vault;
- AWS Secrets Manager;
- Azure Key Vault.

Those alternatives were rejected due to unnecessary operational complexity for the project scope.

### Evidence
- `server.js`
- `.env`
- `.gitignore`

---

# 2. Injection Protection

## SQL Injection Protection

### Why
User-controlled input is used in database queries. Without protection, attackers could inject malicious SQL payloads such as:

```sql
' OR 1=1 --
```

which could bypass authentication or leak data.

### How
Prepared statements are used with parameterized queries through `mysql2`.

Example:

```js
db.execute(
  "SELECT * FROM users WHERE email = ?",
  [email]
);
```

This ensures user input is treated as data rather than executable SQL.

Input validation is also applied on authentication routes.

### Trade-off
Prepared statements slightly reduce query flexibility compared to raw SQL string construction, but provide significantly stronger security guarantees.

### Evidence
- `authController.js`
- database query layer
- login/register routes

---

# 3. Brute-Force Mitigation

### Why
Authentication endpoints are vulnerable to:
- brute-force attacks;
- credential stuffing;
- automated login attempts.

Without mitigation, attackers could repeatedly test passwords against user accounts.

### How
Rate limiting is implemented using `express-rate-limit`.

Example configuration:

```js
rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5
});
```

Limits are applied specifically on:
- `/login`
- `/register`

This restricts repeated authentication attempts from the same IP address.

### Trade-off
Strict rate limiting may occasionally impact legitimate users sharing the same IP address, but significantly improves resilience against automated attacks.

### Evidence
- `authRoutes.js`
- rate limiter middleware configuration

---

# 4. Route / Session / Token Security

### Why
Protected API routes must ensure that only authenticated users can access sensitive resources.

Session hijacking and token theft were considered major threats.

### How
Authentication is based on JWT access tokens stored in secure cookies.

Protected routes use middleware verification:

```js
jwt.verify(token, process.env.JWT_SECRET);
```

Security measures include:
- `httpOnly` cookies;
- `secure` cookies;
- `sameSite="strict"`;
- short-lived access tokens (1 hour);
- refresh tokens for persistent sessions.

### Trade-off
JWT-based authentication is stateless and lightweight, but token revocation is more complex than traditional server-side sessions.

A Redis-backed session store was considered but rejected to keep infrastructure lightweight.

### Evidence
- `authMiddleware.js`
- `authController.js`
- cookie configuration

---

# 5. Secure Authentication Flow

### Why
The authentication flow must balance:
- user experience;
- session persistence;
- token theft mitigation.

Long-lived access tokens were considered unsafe because stolen tokens remain valid for extended periods.

### How
A dual-token architecture is implemented:

| Token | Lifetime | Purpose |
|---|---|---|
| Access Token | 1 hour | API authentication |
| Refresh Token | 7 days | Session renewal |

Flow:

1. User logs in;
2. Access + refresh tokens are issued;
3. Access token expires after 1 hour;
4. Frontend calls `/refresh`;
5. Backend generates a new access token.

This limits the impact of token compromise while maintaining persistent sessions.

### Trade-off
The refresh mechanism introduces additional frontend complexity compared to a single long-lived token approach, but provides significantly better security.

A single 7-day JWT approach was rejected due to higher session hijacking risk.

### Evidence
- `Login controller`
- `Register controller`
- `/refresh` route
- frontend refresh handling

---

# 6. Secure Data Handling (In Transit and At Rest)

## In Transit

### Why
Sensitive data such as authentication tokens and credentials could be intercepted during transmission.

### How
HTTPS/TLS is required in production.

Cookies use:

```js
httpOnly: true
secure: true
sameSite: "strict"
```

This protects against:
- token theft;
- XSS-based cookie access;
- CSRF attacks.

### Trade-off
HTTPS introduces minimal operational overhead but is essential for secure deployment.

## At Rest

### Why
Passwords stored in plaintext would expose all users if the database were compromised.

### How
Passwords are hashed using `bcrypt` before storage.

Example:

```js
bcrypt.hash(password, 12);
```

Database credentials are also isolated through environment variables.

### Trade-off
Password hashing slightly increases authentication processing time, but dramatically improves password security.

### Evidence
- `authController.js`
- bcrypt hashing implementation
- cookie security configuration
- `.env` configuration
