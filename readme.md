# Project Management Backend

This project provides a backend system for a project management application. It includes user authentication, task management, project management, notifications, and file attachments. The system is built with **Node.js**, **Express.js**, and **MongoDB**.

## Course Details

- **Course**: SE347.P12 - Công nghệ Web và ứng dụng
- **Instructor**: Nguyễn Tấn Toàn
- **Institution**: University of Information Technology (UIT), Ho Chi Minh City

## Group Members

- **19522283**: Nguyễn Ngọc Thịnh
- **21522679**: Trần Trung Tín
- **21521236**: Trần Thảo Nhi
- **20521353**: Nguyễn Văn Hoành
- **20521875**: Nguyễn Duy Tân

## Table of Contents

1. [Features](#features)
2. [Folder Structure](#folder-structure)
3. [API Documentation](#api-documentation)
4. [Setup Instructions](#setup-instructions)
5. [Models](#models)
6. [Middleware](#middleware)

## Features

- User authentication (register, login).
- Manage tasks and projects.
- Notifications for users.
- File attachments linked to tasks.
- User profile updates.
- Task filtering, sorting, and statistics.

## Folder Structure

```
project-management-backend/
├── controllers/       # Business logic
├── models/            # Mongoose schemas
├── routes/            # API routes
├── middlewares/       # Custom middleware
├── config/            # Configuration files
├── cron/              # Cron jobs for periodic tasks
├── uploads/           # Storage for uploaded files
├── app.js             # Entry point
```

## API Documentation

### Authentication

#### POST /api/auth/register

- **Description**: Register a new user.
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
- **Response**: 201 Created

#### POST /api/auth/login

- **Description**: Log in a user.
- **Body**:
  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
- **Response**: 200 OK

### Task Management

#### GET /api/task

- **Description**: Retrieve all tasks.

#### POST /api/task

- **Description**: Create a new task.
- **Body**:
  ```json
  {
    "title": "New Task",
    "description": "Task description",
    "priority": "High",
    "project": "projectId",
    "idUser": "userId"
  }
  ```

### Project Management

#### GET /api/project

- **Description**: Retrieve all projects.

#### POST /api/project

- **Description**: Create a new project.
- **Body**:
  ```json
  {
    "name": "New Project",
    "description": "Project description",
    "members": ["userId1", "userId2"]
  }
  ```

### Notifications

#### GET /api/notification

- **Description**: Retrieve all notifications.

#### POST /api/notification

- **Description**: Create a notification.

### User Management

#### GET /api/user

- **Description**: Retrieve all users.

#### PUT /api/user/:id/update

- **Description**: Update user details.

#### PUT /api/user/:id/changepassword

- **Description**: Change user password.

### Attachments

#### Schema Definition

- **taskId**: ObjectId (reference to Task).
- **fileUrl**: String (URL of the file).
- **uploadedBy**: ObjectId (reference to User).

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-url.git
   ```
2. Install dependencies:
   ```bash
   cd project-management-backend
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file:
     ```
     PORT=5000
     MONGO_URI=your-mongodb-uri
     JWT_SECRET=your-secret-key
     ```
4. Run the server:
   ```bash
   npm start
   ```

## Models

### User

- **Fields**:
  - `name`: String
  - `email`: String (unique)
  - `password`: String
  - `avatar`: String (optional)

### Task

- **Fields**:
  - `title`: String
  - `description`: String
  - `priority`: Enum (Low, Medium, High)
  - `status`: Enum (Not Started, In Progress, Completed)

### Project

- **Fields**:
  - `name`: String
  - `owner`: ObjectId (reference to User)
  - `members`: Array of ObjectIds (reference to User)

### Notification

- **Fields**:
  - `userId`: ObjectId (reference to User)
  - `content`: String
  - `isRead`: Boolean

### Attachment

- **Fields**:
  - `taskId`: ObjectId (reference to Task)
  - `fileUrl`: String
  - `uploadedBy`: ObjectId (reference to User)

## Middleware

### Authentication Middleware

- Verifies JWT tokens to authenticate users.

---

For further assistance, please refer to the source code or contact the development team.
