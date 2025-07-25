# Teammate

A blockchain-powered sports and social platform. there is option to connect your wallet its a demonstration project to connect 
different wallet with modal.

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-%23FFDD00.svg?style=flat-square&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/khemrregmii)

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (for backend)
- [Python](https://www.python.org/) (if any Python scripts are used)
- [Git](https://git-scm.com/)

## Project Structure

```
teammate/
  Backend/      # Node.js/Express backend
  Frontend/     # React frontend (Vite)
  README.md
```

## 1. Clone the Repository

```bash
git clone <your-repo-url>
cd teammate
```

## 2. Setup Environment Variables

### Backend

- Copy `.env.example` to `.env` in `Backend/` and fill in your values (MongoDB URL, JWT secret, etc).

### Frontend

- Copy `.env.example` to `.env` in `Frontend/` and set `VITE_API_BASE_URL` to your backend URL (e.g. `http://127.0.0.1:5000`).

## 3. Install Dependencies

### Backend

```bash
cd Backend
npm install
```

### Frontend

```bash
cd ../Frontend
npm install
```

## 4. Run the Project

### Start Backend

```bash
cd Backend
npm start
# or
node app.js
```

The backend will run on [http://127.0.0.1:8000](http://127.0.0.1:8000) by default.

### Start Frontend

```bash
cd ../Frontend
npm run dev
```

The frontend will run on [http://localhost:3001](http://localhost:3001) (Vite will automatically find an available port).

## 5. Open in Browser

Visit [http://localhost:3001](http://localhost:3001) to use the app, or [http://localhost:3001/login](http://localhost:3001/login) for the login page.



## Troubleshooting

- Ensure MongoDB is running and accessible.
- Make sure your `.env` files are configured correctly.
- If you encounter CORS issues, check backend CORS settings.
- For wallet integrations, ensure browser extensions (MetaMask, Phantom, etc.) are installed.

---

If you like this project, [buy me a coffee!](https://buymeacoffee.com/khemrregmii) ☕

## License

MIT

