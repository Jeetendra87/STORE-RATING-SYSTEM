# Store Rating Platform

A full-stack web application that allows users to submit ratings (1-5) for stores registered on the platform. Built with Express.js, PostgreSQL, and React.js.

## Live Demo

- **Frontend:** https://store-rating-system-l9fx.vercel.app
- **Backend API:** https://store-rating-system-nine.vercel.app/api

## Tech Stack

- **Backend:** Express.js, Sequelize ORM
- **Database:** PostgreSQL
- **Frontend:** React.js
- **Authentication:** JWT (JSON Web Tokens)

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/    # Auth & validation middleware
│   │   ├── models/       # Sequelize models (User, Store, Rating)
│   │   ├── routes/       # API routes
│   │   ├── seeders/      # Database seed data
│   │   └── server.js     # Express server entry point
│   ├── .env              # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components (Auth, Admin, User, StoreOwner)
│   │   ├── context/      # Auth context provider
│   │   └── services/     # API service layer
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)

## Setup Instructions

### 1. Install PostgreSQL

```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
psql -U postgres
CREATE DATABASE store_rating_db;
\q
```

### 3. Configure Backend

Edit `backend/.env` with your PostgreSQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=store_rating_jwt_secret_key_2024
```

### 4. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 5. Seed Database

```bash
cd backend
npm run seed
```

This creates test users and stores. Credentials will be printed to the console.

### 6. Start the Application

```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm start

# Terminal 2 - Frontend (port 3000)
cd frontend
npm start
```

Visit **http://localhost:3000** in your browser.

## Default Login Credentials

| Role         | Email                     | Password     |
|-------------|---------------------------|-------------|
| Admin       | admin@storerating.com     | Admin@1234  |
| Store Owner | owner1@storerating.com    | Owner@1234  |
| Store Owner | owner2@storerating.com    | Owner@1234  |
| Normal User | user1@storerating.com     | User@12345  |
| Normal User | user2@storerating.com     | User@12345  |

## User Roles & Features

### System Administrator
- Dashboard with total users, stores, and ratings counts
- Add new stores, normal users, and admin users
- View/filter users list (Name, Email, Address, Role)
- View/filter stores list (Name, Email, Address, Rating)
- View user details (including store rating for store owners)

### Normal User
- Sign up and log in
- View all registered stores with ratings
- Search stores by Name and Address
- Submit/modify ratings (1-5 stars) for stores
- Update password

### Store Owner
- View dashboard with average store rating
- See list of users who rated their store
- Update password

## Form Validations

- **Name:** 20-60 characters
- **Address:** Max 400 characters
- **Password:** 8-16 characters, at least 1 uppercase letter, at least 1 special character
- **Email:** Standard email validation

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `PUT /api/auth/password` - Update password
- `GET /api/auth/me` - Get current user

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List users (with filters/sorting)
- `GET /api/admin/users/:id` - User details
- `POST /api/admin/users` - Create user
- `GET /api/admin/stores` - List stores (with filters/sorting)
- `POST /api/admin/stores` - Create store

### Stores (Normal User)
- `GET /api/stores` - List stores with ratings
- `POST /api/stores/:storeId/rating` - Submit/update rating

### Store Owner
- `GET /api/store-owner/dashboard` - Owner dashboard
