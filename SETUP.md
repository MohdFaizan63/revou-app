# Revuo Setup Guide

This guide will help you set up and run the Revuo application locally.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (v4.4 or higher)
- **Git** (for version control)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd revuo
```

### 2. Install Dependencies

#### Option A: Using the provided scripts

**Windows:**
```bash
install-and-run.bat
```

**Unix/Linux/macOS:**
```bash
chmod +x install-and-run.sh
./install-and-run.sh
```

#### Option B: Manual installation

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp server/env.example server/.env
   ```

2. Edit `server/.env` with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/revuo

   # JWT
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   JWT_EXPIRE=30d

   # Cloudinary (for image uploads) - Optional for development
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # CORS
   CORS_ORIGIN=http://localhost:5173
   ```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# If installed as a service, it should start automatically
# Otherwise, start it manually
mongod
```

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 5. Start the Application

```bash
npm run dev
```

This will start both the backend server and frontend development server concurrently.

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Project Structure

```
revuo/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   └── index.css      # Global styles
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── index.js          # Server entry point
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run install-all` - Install dependencies for all packages

### Backend (server/)
- `npm run dev` - Start server with nodemon (auto-restart on changes)
- `npm start` - Start server in production mode

### Frontend (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features Implemented

### ✅ Completed Features
- **Authentication System**
  - User registration and login
  - JWT token-based authentication
  - Protected routes
  - User profile management

- **Entity Management**
  - Create, read, update, delete entities
  - Search functionality with real-time results
  - Category-based filtering
  - Rating and review system

- **Frontend**
  - Modern React 18 + Vite setup
  - Tailwind CSS for styling
  - Responsive design
  - Search bar with dropdown results
  - Entity cards with ratings
  - Category grid
  - Trending sidebar

- **Backend**
  - Express.js REST API
  - MongoDB with Mongoose ODM
  - JWT authentication
  - Input validation
  - Error handling
  - Rate limiting
  - Security middleware

### 🚧 In Progress / To Be Implemented
- **Review System**
  - Create and manage reviews
  - Rating with stars
  - Review voting (helpful/unhelpful)
  - Review moderation

- **Entity Detail Pages**
  - Detailed entity information
  - Review listing and pagination
  - Review submission form
  - Image upload functionality

- **Advanced Features**
  - Entity claiming system
  - User profile pages
  - Review analytics
  - Admin dashboard
  - Email notifications

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Entities
- `GET /api/entities` - Get all entities (with search/filters)
- `POST /api/entities` - Create new entity
- `GET /api/entities/:id` - Get entity by ID
- `PUT /api/entities/:id` - Update entity
- `DELETE /api/entities/:id` - Delete entity
- `POST /api/entities/:id/claim` - Claim entity
- `GET /api/entities/categories` - Get categories

### Reviews
- `GET /api/reviews/entity/:entityId` - Get reviews for entity
- `POST /api/reviews/entity/:entityId` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/vote` - Vote on review
- `POST /api/reviews/:id/report` - Report review

## Development

### Adding New Features

1. **Backend**: Add new routes in `server/routes/`, controllers in `server/controllers/`, and models in `server/models/`
2. **Frontend**: Add new components in `client/src/components/` and pages in `client/src/pages/`
3. **Styling**: Use Tailwind CSS classes for consistent styling

### Code Style

- Use ES6+ features
- Follow React hooks best practices
- Use async/await for API calls
- Implement proper error handling
- Add loading states for better UX

## Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Use a production MongoDB instance
3. Set up proper JWT secrets
4. Configure CORS for your domain
5. Set up rate limiting for production

### Frontend Deployment
1. Run `npm run build` in the client directory
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for API endpoints

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify MongoDB version compatibility

2. **Port Already in Use**
   - Change the port in `.env` file
   - Kill processes using the port

3. **CORS Errors**
   - Check CORS_ORIGIN in `.env`
   - Ensure frontend and backend ports match

4. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure environment variables are correctly set
4. Check MongoDB connection
5. Review the API documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
