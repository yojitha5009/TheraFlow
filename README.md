# TheraFlow — Therapist Practice Management Platform

## Overview

TheraFlow is a web application designed to simplify therapist profile management and professional practice workflows.

The current MVP provides account registration, login, profile editing, a dashboard, and publicly accessible therapist profiles.

## Features

* Therapist registration and login
* Password hashing using bcrypt
* JWT-based authentication
* MongoDB database integration
* Professional profile management
* Public therapist profile pages
* Public profile links
* React-based user interface

## Technology Stack

**Frontend**

* React
* Vite
* CSS

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* bcrypt
* JSON Web Tokens

## Project Structure

```text
TheraFlow/
├── backend/
└── frontend/
```

## Local Setup

### Prerequisites

* Node.js and npm
* MongoDB
* Git

### Backend

1. Open a terminal in the `backend` directory.

2. Install dependencies:

   `npm install`

3. Create a `.env` file containing the required configuration:

   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/theraflow
   JWT_SECRET=replace_with_a_long_random_secret
   ```

4. Start the backend:

   `node server.js`

### Frontend

1. Open another terminal in the `frontend` directory.

2. Install dependencies:

   `npm install`

3. Start the development server:

   `npm run dev`

4. Open `http://localhost:5173` in your browser.

## Current Scope

This submission represents the current MVP. Scheduling, client management, payments, clinical notes, messaging, subscriptions, and analytics may require further implementation.

## Security Notes

* Do not commit `.env` files or secrets.
* Use strong environment-specific credentials.
* Configure production security, database access, and deployment settings before public release.

## Status

MVP under development.
