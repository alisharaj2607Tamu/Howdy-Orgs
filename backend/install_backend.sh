#!/bin/bash

echo "Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

echo "Installing required packages..."
pip install fastapi uvicorn pandas pydantic "python-multipart" "aiofiles" "requests"

echo "Creating directory structure if missing..."
mkdir -p backend/data backend/apis

echo "Setup complete. You can now run the server with:"
echo "uvicorn backend.apis.register:app --reload"

#chmod +x install_backend.sh