# 🚀 Revuo - Universal Review Platform

A modern, responsive platform for rating and reviewing anything and everything - from apps to restaurants, movies to products, and beyond.

![Revuo Platform](https://img.shields.io/badge/Revuo-Universal%20Reviews-blue?style=for-the-badge&logo=star)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)

## ✨ **Features**

- 🔍 **Instant Search** - Real-time search with intelligent suggestions
- 📱 **Mobile-First** - Fully responsive design for all devices
- 🔐 **Secure Authentication** - JWT-based user authentication
- ⭐ **Rich Reviews** - Star ratings, text reviews, and photo uploads
- 📊 **Analytics** - View counts, rating distributions, and trends
- 🔄 **Compare Entities** - Side-by-side comparison of any items
- 📧 **Contact System** - Built-in help center and contact forms
- 🎨 **Modern UI** - Beautiful, intuitive interface with animations
- ⚡ **Performance Optimized** - Fast loading with React Query caching
- 🛡️ **Production Ready** - Security, error handling, and monitoring

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **React Hot Toast** - User notifications

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image storage

### **DevOps**
- **Helmet** - Security headers
- **Compression** - Response compression
- **Rate Limiting** - API protection
- **CORS** - Cross-origin resource sharing

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 16+ and npm 8+
- MongoDB Atlas account
- Git

### **Installation**

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/revuo.git
   cd revuo
   ```

2. **Install Dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp server/env.example server/.env
   cp client/.env.example client/.env.local
   
   # Configure your variables
   # See DEPLOYMENT.md for details
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

5. **Access Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5001
   - API Health: http://localhost:5001/api/health

## 📁 **Project Structure**

```
revuo/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   └── index.css      # Global styles
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── package.json      # Backend dependencies
├── package.json          # Root package.json
└── README.md            # This file
```

## 🔧 **Available Scripts**

### **Development**
```bash
npm run dev              # Start both frontend and backend
npm run server           # Start backend only
npm run client           # Start frontend only
```

### **Building**
```bash
npm run build            # Build frontend for production
npm run build:server     # Build backend (if needed)
```

### **Testing & Quality**
```bash
npm run test             # Run backend tests
npm run test:client      # Run frontend tests
npm run lint             # Lint frontend code
npm run lint:fix         # Fix linting issues
```

### **Deployment**
```bash
npm run deploy:check     # Pre-deployment checks
npm run start:prod       # Start production server
npm run health           # Check server health
```

### **Maintenance**
```bash
npm run clean            # Clean build files
npm run clean:all        # Clean all dependencies
npm run seed             # Seed database
```

## 🌐 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### **Entities**
- `GET /api/entities` - Get all entities
- `GET /api/entities/instant` - Instant search
- `GET /api/entities/:id` - Get single entity
- `POST /api/entities` - Create entity
- `PUT /api/entities/:id` - Update entity
- `DELETE /api/entities/:id` - Delete entity

### **Reviews**
- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### **Users**
- `GET /api/users/profile` - Get user profile
- `GET /api/users/activity` - Get user activity
- `GET /api/users/reviews` - Get user reviews
- `GET /api/users/bookmarks` - Get user bookmarks

### **Contact**
- `POST /api/contact/submit` - Submit contact form
- `GET /api/contact` - Get submissions (admin)
- `PUT /api/contact/:id` - Update submission (admin)

## 🔒 **Security Features**

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs for password security
- **Rate Limiting** - API protection against abuse
- **CORS Protection** - Cross-origin request security
- **Helmet Headers** - Security headers
- **Input Validation** - Server-side validation
- **Error Handling** - Secure error responses

## 📱 **Responsive Design**

- **Mobile-First** - Optimized for mobile devices
- **Touch-Friendly** - 44px minimum touch targets
- **Progressive Enhancement** - Works on all devices
- **Accessibility** - WCAG compliant
- **Performance** - Optimized loading times

## 🚀 **Deployment**

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### **Quick Deploy Options**

1. **Vercel** (Frontend)
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Heroku** (Backend)
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

3. **DigitalOcean App Platform**
   - Connect GitHub repository
   - Configure build settings
   - Deploy automatically

## 📊 **Performance**

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔧 **Configuration**

### **Environment Variables**

**Backend** (`server/.env`):
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://yourdomain.com
```

**Frontend** (`client/.env.local`):
```bash
VITE_API_URL=http://localhost:5001/api
VITE_APP_NAME=Revuo
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/revuo/issues)
- **Email**: support@revuo.com

## 🎉 **Acknowledgments**

- React team for the amazing framework
- Vercel for hosting and deployment
- MongoDB Atlas for database hosting
- Tailwind CSS for the utility-first approach
- All contributors and users

---

**Built with ❤️ by the Revuo Team**
