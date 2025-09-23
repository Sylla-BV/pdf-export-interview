#!/bin/bash

echo "🚀 Setting up PDF Export Database..."

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    echo "📄 Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
fi

# Set default values if not provided in env
DATABASE_URL=${DATABASE_URL:-"postgresql://postgres:password@localhost:5432/pdf_export_db"}
QSTASH_TOKEN=${QSTASH_TOKEN:-"your_qstash_token_here"}
QSTASH_CURRENT_SIGNING_KEY=${QSTASH_CURRENT_SIGNING_KEY:-"your_current_signing_key_here"}
QSTASH_NEXT_SIGNING_KEY=${QSTASH_NEXT_SIGNING_KEY:-"your_next_signing_key_here"}
NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL:-"http://localhost:3000"}

# Create .env.local file with loaded/default values
cat > .env.local << EOF
# Database configuration
DATABASE_URL=${DATABASE_URL}

# QStash configuration (optional for development)
QSTASH_TOKEN=${QSTASH_TOKEN}
QSTASH_CURRENT_SIGNING_KEY=${QSTASH_CURRENT_SIGNING_KEY}
QSTASH_NEXT_SIGNING_KEY=${QSTASH_NEXT_SIGNING_KEY}

# Base URL for webhooks
NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
EOF

echo "✅ Created .env.local file with environment variables"

# Start PostgreSQL with Docker
echo "🐳 Starting PostgreSQL with Docker..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Push database schema
echo "📊 Pushing database schema..."
npm run db:push

echo "🎉 Setup complete! You can now run 'npm run dev'"
echo "📝 Database URL: ${DATABASE_URL}"
echo "🌐 Application will run on: ${NEXT_PUBLIC_BASE_URL}"
