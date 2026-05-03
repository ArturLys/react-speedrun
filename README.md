# ⚡ React Speedrun: Multiplayer Tic-Tac-Toe

A high-performance, real-time multiplayer Tic-Tac-Toe game built with **Next.js**, **Express**, and **Socket.io**. Designed for speed, scalability, and a premium user experience.

![Tic-Tac-Toe Demo](https://raw.githubusercontent.com/ArturLys/react-speedrun/master/client/public/screenshots/ttt_1.png)

## 🚀 Features

- **Real-time Gameplay:** Zero-latency moves powered by WebSockets (Socket.io).
- **Matchmaking:** Create or join rooms with unique IDs to play with friends.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop.
- **Modern Tech Stack:** 
  - **Frontend:** Next.js 15 (App Router), Tailwind CSS 4, Radix UI.
  - **Backend:** Node.js, Express, TypeScript.
  - **State Management:** React Hooks & Socket events.

## 🛠️ Tech Stack

| Frontend | Backend | DevOps |
| :--- | :--- | :--- |
| Next.js 15 | Node.js | Vercel (Client) |
| React 19 | Express | Render (Server) |
| Tailwind CSS 4 | Socket.io | GitHub Actions |
| TypeScript | TypeScript | Render Blueprints |

## 📦 Project Structure

```text
.
├── client/          # Next.js frontend application
├── server/          # Express + Socket.io backend
├── shared/          # Shared TypeScript types for Socket events
└── render.yaml      # Render Blueprint for one-click deployment
```

## 🔧 Local Development

1. **Clone the repo:**
   ```bash
   git clone https://github.com/ArturLys/react-speedrun.git
   cd react-speedrun
   ```

2. **Install dependencies:**
   ```bash
   # In root
   npm install
   # Or install separately in client/ and server/
   ```

3. **Start the Server:**
   ```bash
   cd server
   npm run dev
   ```

4. **Start the Client:**
   ```bash
   cd client
   npm run dev
   ```

## 🌍 Deployment

### Backend (Render)
This project includes a `render.yaml` Blueprint. To deploy:
1. Go to **Render Dashboard** > **Blueprints**.
2. Connect this repository.
3. Render will automatically detect the configuration and deploy the server.

### Frontend (Vercel)
1. Import the `client` directory to Vercel.
2. Add environment variable: `NEXT_PUBLIC_SOCKET_URL` = `https://your-render-url.com`.
3. Deploy!

---

Built with ❤️ by [Artur](https://github.com/ArturLys)
