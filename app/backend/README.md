# Job Aggregator Backend

The backend of the job aggregator project contains all the routes necessary for the frontend to function properly. Its purpose is to act as a bridge between the frontend and the database. It fulfills this purpose by enabling interaction with job listings and users through various routes.

---

##  Requirements

- NodeJS 22.20.0+
- Npm 11.13+
- Espress 5.2.1+
- Install required dependencies ( see `package.json`)

---

## Configuration

Create a `.env` file in **this folder** of the project with the following variables:

```env

JWT_SECRET=your_secret_jwt_key
MYSQL_PASSWORD=your_password
PORT=backend_port

```

---

## Project Structure

```
job-aggregator/
|--/app/backend/
	|-- config/ # Swagger and Database connection
	|-- controllers/ # Request handlers
	|-- middleware/ # Token verification
	|-- routes/ # Express routes
	|-- services/ # AI services
	|-- .env # Environment configuration (not committed)
	|-- index.js
	|-- package.json
	|-- package-lock.json
	|-- Dockerfile
```

---

## Running Backend

To start the backend normally :

```bash
npm start
```

To start the backend in dev mode :
```bash
npm run dev
```


If the launch goes well, you'll see:

```bash
> backend@1.0.0 start
> node index.js

Server is runnong on port 3000
MySQL pool connected successfully
```
