#!/bin/bash

echo "🔧 Setting up environment for Revuo..."

# Create server/.env file
cat > server/.env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Configuration (replace with your actual connection string)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/revuo?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_123456789

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
EOF

echo "✅ Environment file created at server/.env"
echo ""
echo "📝 Next steps:"
echo "1. Edit server/.env and replace the MONGODB_URI with your actual Atlas connection string"
echo "2. Or leave it as is for testing without database"
echo "3. Run: npm run dev"
echo ""
echo "🔗 To get your MongoDB Atlas connection string:"
echo "   - Go to https://cloud.mongodb.com"
echo "   - Create a free cluster"
echo "   - Click 'Connect' → 'Connect your application'"
echo "   - Copy the connection string and replace the placeholders"