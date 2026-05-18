# Job Aggregator Backend

The backend of the job aggregator project contains all the routes necessary for the frontend to function properly. Its purpose is to act as a bridge between the frontend and the database. It fulfills this purpose by enabling interaction with job listings and users through various routes.

---

## Requirements

- NodeJS 22.20.0+
- Npm 11.13+
- Espress 5.2.1+
- Install required dependencies ( see `package.json`)

## Database Setup

### 1.Create the Database Schema
```bash
cd ../database
mysql -u root -p < jobagg.sql
```
---

### 2.Populate the Database
Read the `filling_database` README and create `.env` file with Environment Variables

```bash
cd ../../filling_databse
python3 run_pipeline.py
```
---

## Configuration

Create a `.env` file in **app** folder with the following variables:

```env

JWT_SECRET=your_secret_jwt_key

MYSQL_PASSWORD=your_password
MYSQL_USER=myour_user
MYSQL_HOST=your_host
MYSQL_DATABASE=your_datbase

BACKEND_PORT=backend_port
FRONTEND_PORT=forntend_port

```

---

## Project Structure

```
job-aggregator/
|--/app
	|--.env # Environment configuration (not committed)
	|--/backend/
		|-- config/ # Swagger and Database connection
		|-- controllers/ # Request handlers
		|-- middleware/ # Token verification
		|-- routes/ # Express routes
		|-- services/ # AI services
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

## Routes Desription

Find descriptions of all routes at : http://localhost:3000/api-docs/
