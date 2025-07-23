## 🚀 Quick Start

### ✅ Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## 🐳 Run the App

To start everything (app, DB, QStash) in one go:

```bash
docker compose up --build
```

This will:
- 🔧 Build the Next.js app
- 🐘 Start PostgreSQL (port `5432`)
- 💬 Start QStash Dev Server (port `3002`)
- ⚙️ Run DB migrations
- 🧠 Start the dev server with hot reload

🌐 App available at:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **QStash Dev Server**: [http://localhost:3002](http://localhost:3002)

## 💡 Notes

### 🧪 Demo Mode (current)
- Uses **client-side polling** to check PDF status.

### 🚀 Production Mode (Recommended)
- Replace polling with **WebSocket** for real-time updates.
