# MedEasy - E-Pharmacy Web Application

A complete production-ready Single Medical Store E-Pharmacy Web Application.

## Features
- **User Authentication**: Secure JWT-based login and registration.
- **Medicine Catalog**: Browse, search, and filter medicines by category.
- **Cart & Checkout**: Add items, adjust quantities, and checkout with Cash on Delivery or Online Payment options.
- **Prescription Uploads**: Automatically mandate image uploads for prescription-only medicines.
- **Order Management**: Track orders, view history.
- **Admin Dashboard**: Specialized dashboard for Store Admins to track sales, low stock alerts, manage medicines, and update order statuses.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, Context API, Lucide Icons, Chart.js.
- **Backend**: Node.js, Express.js, MongoDB + Mongoose, JWT, bcrypt, Multer.

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and put your MongoDB Atlas URI.
4. Run the seed script to populate sample data (including an admin user):
   `node seeder.js`
5. Start the server:
   `npm run start` Note: start command should be setup in package.json or use `nodemon server.js`

### 2. Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server:
   `npm run dev` (runs on `localhost:5173`)

### 3. Log In
Use the seeder data to log in as an admin for testing:
- **Email**: admin@medeasy.com
- **Password**: password123
