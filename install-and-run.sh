#!/bin/bash

echo "Installing Revuo dependencies..."

echo "Installing root dependencies..."
npm install

echo "Installing server dependencies..."
cd server
npm install
cd ..

echo "Installing client dependencies..."
cd client
npm install
cd ..

echo ""
echo "All dependencies installed successfully!"
echo ""
echo "To start the application:"
echo "1. Make sure MongoDB is running"
echo "2. Copy server/env.example to server/.env and configure it"
echo "3. Run: npm run dev"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:5173"
echo "- Backend: http://localhost:5000"
echo ""
