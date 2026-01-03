#!/bin/bash
set -e

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Generating Prisma client..."
python -m prisma generate

echo "Fetching Prisma binaries for debian-openssl-3.0.x..."
python -m prisma py fetch

echo "Verifying Prisma installation..."
python -c "from prisma import Prisma; print('Prisma imported successfully')"

echo "Build completed successfully!"
