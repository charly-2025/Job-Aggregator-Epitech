# Security Measures Documentation

## 1. Secret Management

### Why
Sensitive credentials such as database passwords and JWT secrets must not be exposed inside the source code repository.

### How
Secrets are stored inside environment variables using `.env` files and loaded with `dotenv`.

Example:

```js
config({ path: ".env" });
```

The `.env` file is excluded from version control using `.gitignore`.

### What
This protects:
- database credentials;
- JWT signing secrets;
- refresh token secrets.

---

# 2. SQL Injection Protection

### Why
User-controlled input could be used to inject malicious SQL queries and bypass authentication or access unauthorized data.

### How
Prepared statements and parameterized queries are used with `mysql2`.

Example:

```js
db.execute(
  "SELECT * FROM users WHERE email = ?",
  [email]
);
```

### What
This prevents attackers from injecting SQL payloads such as:

```sql
' OR 1=1 --
```

and protects database queries from SQL injection attacks.

---

# 3. Brute-Force Mitigation

### Why
Authentication endpoints are common targets for brute-force and credential stuffing attacks.

### How
Rate limiting is implemented with `express-rate-limit`.

Example:

```js
rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5
});
```

Limits are applied on:
- `/login`
- `/register`

### What
This limits repeated authentication attempts from the same IP address and reduces automated attacks.

---

# 4. Route / Session / Token Security

### Why
Protected routes must only be accessible to authenticated users.

### How
JWT access tokens are verified using middleware.

Example:

```js
jwt.verify(token, process.env.JWT_SECRET);
```

Cookies are configured with:
- `httpOnly`
- `secure`
- `sameSite: "strict"`

### What
This protects against:
- unauthorized route access;
- token theft;
- XSS cookie access;
- CSRF attacks.

---

# 5. Secure Authentication Flow

### Why
Long-lived authentication tokens increase the impact of token theft.

### How
A dual-token authentication architecture is implemented:

| Token | Lifetime |
|---|---|
| Access Token | 1 hour |
| Refresh Token | 7 days |

When the access token expires:
1. frontend receives `401 Unauthorized`;
2. frontend calls `/refresh`;
3. backend generates a new access token.

### What
This limits the impact of stolen tokens while maintaining persistent user sessions.

---

# 6. Secure Data Handling (In Transit)

### Why
Sensitive data could be intercepted during network transmission.

### How
HTTPS/TLS is required in production.

Cookies use:

```js
httpOnly: true
secure: true
sameSite: "strict"
```

### What
This protects:
- authentication tokens;
- user credentials;
- session cookies.

It also mitigates:
- man-in-the-middle attacks;
- XSS-based cookie theft;
- CSRF attacks.

---

# 7. Secure Data Handling (At Rest)

### Why
Passwords stored in plaintext would expose all users if the database were compromised.

### How
Passwords are hashed using `bcrypt` before storage.

Example:

```js
bcrypt.hash(password, 12);
```

### What
Even if the database is leaked, passwords remain unreadable and significantly harder to crack.

---

# 8. Authentication Middleware

### Why
API endpoints containing sensitive data must verify user identity before granting access.

### How
An authentication middleware checks the validity of the JWT access token stored in cookies.

Example:

```js
const token = req.cookies.accessToken;

const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET
);
```

### What
Unauthorized or expired tokens are rejected with HTTP 401 responses, preventing unauthorized access to protected resources.
