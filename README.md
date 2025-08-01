# 🚀 Engineer Management System

A modern, full-stack web application for managing engineers, projects, and assignments with a beautiful UI and robust backend API.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- **Role-based Access Control**: Manager and Engineer roles
- **Secure Authentication**: JWT-based authentication
- **Protected Routes**: Role-specific access to features

### 👥 Engineer Management
- **Engineer Profiles**: Complete engineer information with skills and availability
- **Capacity Management**: Track engineer allocation and availability
- **Skill Management**: Add and manage engineer skills
- **Seniority Levels**: Junior, Mid, and Senior engineer classifications

### 📊 Project Management
- **Project Creation**: Create and manage projects with detailed information
- **Project Status**: Active, Planning, and Completed status tracking
- **Team Assignment**: Assign engineers to projects with specific roles
- **Timeline Management**: Start and end date tracking

### 🔗 Assignment System
- **Smart Assignments**: Assign engineers to projects with allocation percentages
- **Role Management**: Define specific roles for each assignment
- **Capacity Tracking**: Monitor engineer workload and availability
- **Assignment History**: Track all project assignments

### 📈 Dashboard & Analytics
- **Real-time Statistics**: Live updates of key metrics
- **Visual Analytics**: Beautiful charts and progress indicators
- **Performance Tracking**: Monitor project and engineer performance
- **Quick Actions**: Fast access to common tasks

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on all devices
- **Dark/Light Theme**: Beautiful gradient-based design
- **Interactive Elements**: Smooth animations and transitions
- **Intuitive Navigation**: Easy-to-use interface

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful and accessible UI components
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **React Hook Form** - Form management with validation
- **Yup** - Schema validation
- **Sonner** - Beautiful toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 📁 Project Structure

```
Engineer Management/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── screens/      # Page components
│   │   │   ├── ui/          # Shadcn/ui components
│   │   │   ├── layout/      # Layout components
│   │   │   └── context/     # React context providers
│   │   ├── services/        # API service functions
│   │   ├── utils/           # Utility functions
│   │   └── assets/          # Static assets
│   ├── public/              # Public assets
│   └── package.json         # Frontend dependencies
├── backend/                  # Node.js backend application
│   ├── config/              # Configuration files
│   ├── controller/          # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── server.js            # Main server file
│   ├── vercel.json          # Vercel deployment config
│   └── package.json         # Backend dependencies
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Engineer-Management
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**

   Create `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

   Create `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the development servers**

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/profile` - Get user profile

### Engineer Endpoints

- `GET /api/engineers` - Get all engineers
- `GET /api/engineers/:id` - Get engineer by ID
- `POST /api/engineers` - Create new engineer
- `PUT /api/engineers/:id` - Update engineer
- `DELETE /api/engineers/:id` - Delete engineer
- `GET /api/engineers/:id/capacity` - Get engineer capacity

### Project Endpoints

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Assignment Endpoints

- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:id` - Get assignment by ID
- `POST /api/assignments` - Create new assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment
