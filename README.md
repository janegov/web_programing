# web_programing
# Note-Taking Application

A full-stack note-taking application built with React, .NET, and MySQL. The application allows users to create, read, update, and delete notes with authentication and authorization features.

## Features

- User Authentication (Login/Register)
- Create, Read, Update, and Delete Notes
- Search functionality for notes
- Date filtering for notes
- Responsive design
- Secure API endpoints
- JWT-based authentication

### Frontend
- React
- Material-UI
- Axios
- React Router
- Formik & Yup (form validation)

### Backend
- .NET Core
- Entity Framework Core
- MySQL
- JWT Authentication
- ASP.NET Core Identity

## Prerequisites

- Node.js (v14)
- .NET SDK (v8.0)
- MySQL Server
- npm

## Installation

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd note-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd NotesApi
   ```

3. Apply database migrations:
   ```bash
   dotnet ef database update
   ```

4. Start the backend server:
   ```bash
   dotnet run
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Notes
- `GET /api/notes` - Get all notes (with optional search and date filters)
- `GET /api/notes/{id}` - Get a specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/{id}` - Update a note
- `DELETE /api/notes/{id}` - Delete a note

## Environment Variables

### Frontend
Create a `.env` file in the note-app directory:
```
VITE_API_URL=http://localhost:5162/api
```

### Backend
Update `appsettings.json` with your configuration:
```json
{
  "Jwt": {
    "Key": "your-secret-key",
    "Issuer": "your-issuer",
    "Audience": "your-audience"
  }
}
```
