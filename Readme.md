# SpendWise - MERN Expense Tracker

A production-quality MERN Stack Expense Tracker with JWT authentication, complete CRUD, pagination, filtering, sorting, and searching.

## Features

- **Authentication**: JWT-based Signup and Login.
- **Transactions**: Create, Read, Update, Delete (CRUD) for Income and Expenses.
- **Dashboard**: Visual summary of total balance, income, and expenses.
- **Advanced Features**:
    - Pagination
    - Searching (by description)
    - Filtering (by type and category)
    - Sorting (by date and amount)
- **Responsive Design**: Built with React, Vite, and Tailwind CSS.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs.
- **Frontend**: React, Vite, Axios, Tailwind CSS, Lucide React.

## Setup Instructions

### Prerequisites

- Node.js installed.
- MongoDB installed and running locally (or update `MONGO_URI` in `.env`).

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory with the following content:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/spendwise
    JWT_SECRET=supersecretkey123
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## API Documentation

### Auth

- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Login user.
- `GET /api/auth/me`: Get current user profile (Protected).

### Transactions

- `GET /api/transactions`: Get all transactions (Protected). Supports query params: `page`, `limit`, `search`, `type`, `category`, `sort`.
- `POST /api/transactions`: Create a new transaction (Protected).
- `GET /api/transactions/:id`: Get a single transaction (Protected).
- `PUT /api/transactions/:id`: Update a transaction (Protected).
- `DELETE /api/transactions/:id`: Delete a transaction (Protected).
