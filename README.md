# Event Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing events and bookings.

## Features

- User authentication (login/register)
- Admin dashboard for managing bookings
- Event browsing and details
- Booking management
- Receipt generation and download
- Responsive design for all devices

## Tech Stack

- **Frontend**: React.js, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/event-management-mern.git
   cd event-management-mern
   ```

2. Install dependencies for both frontend and backend
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file in the backend directory with the following variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. Start the development servers
   ```
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
event-management-mern/
├── backend/             # Backend code
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── server.js        # Entry point
├── frontend/            # Frontend code
│   ├── public/          # Static files
│   ├── src/             # Source files
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   └── App.js       # Main component
│   └── package.json     # Frontend dependencies
└── README.md            # Project documentation
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the UI components
- MongoDB for the database
- Express.js for the backend framework
- React.js for the frontend framework 
hi