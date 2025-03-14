#!/bin/bash

# Clean install with legacy peer deps
echo "Installing dependencies..."
npm ci --legacy-peer-deps

# Install specific versions of problematic packages
echo "Installing specific package versions..."
npm install react-dev-utils@12.0.1 --legacy-peer-deps
npm install ajv@6.12.6 ajv-keywords@3.5.2 --legacy-peer-deps

# Build the application
echo "Building application..."
CI=false npm run build

echo "Build completed successfully!" 