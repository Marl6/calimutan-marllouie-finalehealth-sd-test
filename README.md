## 📦 Project Structure

```
calimutan-marllouie-finalehealth-sd-test/
├── backend/       # NestJS server with MongoDB
├── frontend/      # Angular frontend
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* Yarn (`npm install -g yarn`)
* MongoDB running locally or on the cloud through MongoDB Atlas

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Marl6/calimutan-marllouie-finalehealth-sd-test.git
cd calimutan-marllouie-finalehealth-sd-test
```

---

## 📂 Backend Setup (NestJS)

```bash
cd backend
cp .env.example .env
# Update your MongoDB URI in the .env file

# Install dependencies
yarn install

# Start the server
yarn start
```

### `.env.example`

```env
MONGODB_URI='YOUR_MONGODB_URL'
PORT=3000
```

Once running, the backend should be accessible at `http://localhost:3000/`.

---

##⚠️ Note:
If you're using local MongoDB, ensure it's running on localhost:27017.
Otherwise, update the MONGO_URI in your .env file to use MongoDB Atlas credentials.

## 💻 Frontend Setup (Angular)

```bash
cd frontend

# Install dependencies
yarn install

# Start the frontend
yarn start
```

The frontend will be accessible at `http://localhost:4200`.

---

## ✨ Features

* Patient management (add/edit/delete/search)
* Visit records with history per patient
* MongoDB schema validation with class-validator
* Error routing & loading states

---
