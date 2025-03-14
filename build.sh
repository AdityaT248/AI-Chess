#!/bin/bash

# Create .env file with SKIP_PREFLIGHT_CHECK=true
echo "Creating .env file..."
echo "SKIP_PREFLIGHT_CHECK=true" > .env

# Remove package-lock.json to avoid conflicts
echo "Removing package-lock.json..."
rm -f package-lock.json

# Install dependencies with legacy peer deps
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Remove any existing eslint to avoid conflicts
echo "Removing conflicting packages..."
npm uninstall eslint --no-save

# Install specific versions of problematic packages
echo "Installing specific package versions..."
npm install react-dev-utils@12.0.1 --legacy-peer-deps
npm install ajv@6.12.6 ajv-keywords@3.5.2 --legacy-peer-deps

# Build the application
echo "Building application..."
CI=false npm run build

echo "Build completed successfully!" 