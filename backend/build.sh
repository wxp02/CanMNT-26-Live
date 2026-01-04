#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Running Prisma migrations..."
prisma migrate deploy

echo "Generating Prisma client..."
prisma generate

# Ensure the Prisma binary cache directory exists
echo "Setting up Prisma binary cache..."
mkdir -p $PRISMA_BINARY_CACHE_DIR

# Copy Prisma binaries to runtime location
if [ -d "$XDG_CACHE_HOME/prisma-python/binaries" ]; then
  echo "Copying Prisma binaries from build cache..."
  cp -R $XDG_CACHE_HOME/prisma-python/binaries/* $PRISMA_BINARY_CACHE_DIR/
else
  echo "No existing Prisma binary cache found, will be created on first run"
fi

echo "Build completed successfully!"
