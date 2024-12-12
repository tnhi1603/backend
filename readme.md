# Task Management System

## Overview

This project is a backend application for a Task Management System. It allows users to register, log in, and manage tasks within projects. The backend is built using **Node.js** and **Express**, with **MongoDB** as the database.

---

## Features

### User Management

- **Register**: Users can create an account with their name, email, and password.
- **Login**: Authenticate using email and password to receive a JWT token.

### Task Management

- **Create Task**: Add new tasks to a project.
- **View Tasks**: Retrieve all tasks or a specific task by ID.
- **Update Task**: Modify the details of an existing task.
- **Delete Task**: Remove a task from the system.

### Additional Features

- **Project Management**: Organize tasks under specific projects.
- **Notifications**: Send and manage user-specific notifications.
- **File Attachments**: Attach files to tasks for better organization.

---

## Technologies Used

### Backend

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building RESTful APIs.
- **Mongoose**: MongoDB object modeling for Node.js.

### Database

- **MongoDB**: NoSQL database for storing users, tasks, projects, notifications, and attachments.

### Libraries

- **bcryptjs**: Hash passwords for secure storage.
- **jsonwebtoken**: Generate and validate JWT tokens.
- **dotenv**: Load environment variables from `.env` file.
- **cors**: Enable cross-origin requests.

---

## Installation

### Prerequisites

- **Node.js** and **npm** installed.
- MongoDB connection string (e.g., from MongoDB Atlas).

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add:
   ```env
   MONGO_URI=<your-mongo-db-connection-string>
   JWT_SECRET=<your-jwt-secret>
   PORT=3001
   ```
5. Start the server:
   ```bash
   npm start
   ```
6. Open your browser and go to `http://localhost:3001`.

---

## API Endpoints

### Authentication

- `POST /api/auth/register`:

  - **Body**: `{ name, email, password }`
  - **Description**: Register a new user.

- `POST /api/auth/login`:
  - **Body**: `{ email, password }`
  - **Description**: Log in and receive a JWT token.

### Task Management

- `GET /api/task/`:

  - **Description**: Retrieve all tasks.

- `GET /api/task/:id`:

  - **Params**: `id` (Task ID)
  - **Description**: Retrieve a specific task by ID.

- `POST /api/task/`:

  - **Body**: Task details (e.g., title, description, project, etc.)
  - **Description**: Create a new task.

- `PUT /api/task/:id`:

  - **Params**: `id` (Task ID)
  - **Body**: Updated task details.
  - **Description**: Update an existing task.

- `DELETE /api/task/:id`:
  - **Params**: `id` (Task ID)
  - **Description**: Delete a task.

---

## Project Structure

```
backend/
├── config/
│   └── db.js           # MongoDB connection setup
├── controllers/
│   ├── authController.js  # Authentication logic
│   └── taskController.js  # Task management logic
├── models/
│   ├── User.js         # User model
│   ├── Task.js         # Task model
│   ├── Project.js      # Project model
│   ├── Notification.js # Notification model
│   └── Attachment.js   # Attachment model
├── routes/
│   ├── authRoutes.js   # Authentication routes
│   └── taskRoutes.js   # Task routes
├── app.js              # Main application file
├── package.json        # Project metadata and dependencies
└── .env                # Environment variables
```

---

## Future Improvements

- Role-based access control (e.g., admin, user roles).
- Advanced project analytics.
- Integration with frontend frameworks like React or Angular.
- Real-time updates using WebSocket or Socket.io.

---

## Contributing

Feel free to submit issues or pull requests. Contributions are welcome!

---

## License

This project is licensed under the MIT License.
