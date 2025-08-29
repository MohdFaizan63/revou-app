# 🚀 PRODUCTION DEPLOYMENT GUIDE

## 📋 **Prerequisites**

- Node.js 16+ and npm 8+
- MongoDB Atlas account (or self-hosted MongoDB)
- Cloudinary account (for image uploads)
- Domain name and SSL certificate
- Hosting platform (Vercel, Netlify, Heroku, DigitalOcean, etc.)

---

## 🔧 **Environment Setup**

### 1. **Backend Environment Variables**

Copy `server/env.production.example` to `server/.env` and configure:

```bash
# Required Variables
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/revuo
JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-characters
FRONTEND_URL=https://yourdomain.com

# Optional Variables
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2. **Frontend Environment Variables**

Create `client/.env.production`:

```bash
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=Revuo
VITE_APP_VERSION=1.0.0
```

---

## 🏗️ **Build Process**

### 1. **Install Dependencies**

```bash
# Install all dependencies
npm run install-all

# Or install separately
npm install
cd server && npm install
cd ../client && npm install
```

### 2. **Build for Production**

```bash
# Build frontend
npm run build

# Build backend (if needed)
npm run build:server
```

### 3. **Pre-deployment Checks**

```bash
# Run all checks
npm run deploy:check

# Individual checks
npm run lint
npm run test
npm run build
```

---

## 🌐 **Deployment Options**

### **Option 1: Vercel (Recommended for Frontend)**

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm run install-all`

3. **Environment Variables**
   - Add all variables from `client/.env.production`

### **Option 2: Netlify**

1. **Deploy Settings**
   ```bash
   # Build command
   npm run build
   
   # Publish directory
   client/dist
   ```

2. **Environment Variables**
   - Add in Netlify dashboard

### **Option 3: Heroku**

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Configure Buildpacks**
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### **Option 4: DigitalOcean App Platform**

1. **Create App**
   - Connect GitHub repository
   - Select Node.js environment

2. **Configure Build**
   - Build Command: `npm run build`
   - Run Command: `npm start`

3. **Environment Variables**
   - Add all required variables

---

## 🗄️ **Database Setup**

### **MongoDB Atlas**

1. **Create Cluster**
   - Choose M0 (free) or higher
   - Select region closest to users

2. **Configure Network Access**
   - Add IP: `0.0.0.0/0` (for all IPs)
   - Or specific IPs for security

3. **Create Database User**
   - Username and password
   - Read/Write permissions

4. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/revuo?retryWrites=true&w=majority
   ```

### **Seed Data (Optional)**

```bash
# Run seed script
npm run seed
```

---

## 🔒 **Security Configuration**

### 1. **SSL Certificate**
- Enable HTTPS on your domain
- Redirect HTTP to HTTPS

### 2. **CORS Configuration**
- Update `FRONTEND_URL` in backend
- Restrict origins in production

### 3. **Rate Limiting**
- Already configured in server
- Adjust limits as needed

### 4. **Environment Variables**
- Never commit `.env` files
- Use secure secret management

---

## 📊 **Monitoring & Analytics**

### 1. **Health Checks**
```bash
# Check server health
npm run health

# Or manually
curl https://your-api-domain.com/api/health
```

### 2. **Error Tracking**
- Set up Sentry for error monitoring
- Configure in environment variables

### 3. **Performance Monitoring**
- Use Vercel Analytics
- Set up Google Analytics
- Monitor Core Web Vitals

---

## 🚀 **Post-Deployment**

### 1. **Verify Deployment**
- [ ] Frontend loads correctly
- [ ] API endpoints respond
- [ ] Database connection works
- [ ] Authentication flows work
- [ ] File uploads work (if using Cloudinary)

### 2. **Performance Testing**
- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### 3. **Security Testing**
- [ ] HTTPS redirects work
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] No sensitive data exposed

---

## 🔧 **Maintenance**

### **Regular Tasks**
- Monitor error logs
- Update dependencies
- Backup database
- Check performance metrics

### **Updates**
```bash
# Update dependencies
npm update

# Rebuild and deploy
npm run build
# Deploy to your platform
```

### **Backup Strategy**
- MongoDB Atlas automatic backups
- Manual database exports
- Code repository backups

---

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Build Failures**
   ```bash
   # Clean and rebuild
   npm run clean:all
   npm run install-all
   npm run build
   ```

2. **Database Connection**
   - Check MongoDB URI
   - Verify network access
   - Check credentials

3. **CORS Errors**
   - Verify `FRONTEND_URL` setting
   - Check CORS configuration
   - Ensure HTTPS/HTTP consistency

4. **Environment Variables**
   - Verify all required variables set
   - Check variable names (case-sensitive)
   - Restart application after changes

### **Logs**
```bash
# View logs
npm run logs

# Or platform-specific
heroku logs --tail
vercel logs
```

---

## 📞 **Support**

For deployment issues:
1. Check platform documentation
2. Review error logs
3. Verify environment configuration
4. Test locally with production settings

---

## ✅ **Deployment Checklist**

- [ ] Environment variables configured
- [ ] Database connected and tested
- [ ] Frontend built successfully
- [ ] Backend deployed and running
- [ ] SSL certificate active
- [ ] CORS configured correctly
- [ ] Health checks passing
- [ ] Performance tested
- [ ] Security verified
- [ ] Monitoring set up
- [ ] Backup strategy in place

**🎉 Your Revuo application is now ready for production!**
