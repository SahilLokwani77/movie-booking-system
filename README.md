#  CineBook – Movie Booking System

CineBook is a frontend movie ticket booking web application made using React, Node.js, Express.

This project allows users to browse movies, select theatres and seats, make bookings, and view booking history in a modern UI.

---

##  Features

* User Login & Register UI
* Browse Movies
* Theatre Selection
* Seat Booking System
* Payment UI
* Booking Confirmation
* My Bookings Section
* MongoDB Database Integration
* Responsive Dark Theme UI

---

##  Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS Inline Styling

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

---

## 📂 Project Structure

```bash
movie-app/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
├── src/
│   ├── App.jsx
│   └── components/
│
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/SahilLokwani77/movie-booking-system.git
```

---

### 2. Frontend Setup

```bash
cd movie-app
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

### 3. Backend Setup

Open another terminal:

```bash
cd backend
npm install
npx nodemon server.js
```

Backend runs on:

```bash
http://localhost:5000
```

---

##  Environment Variables

Create `.env` file inside backend folder:

```env
MONGO_URI=your_mongodb_connection_string
```

---

## 💾 Database

MongoDB Atlas is used for storing booking data.

Collections:

* bookings

---

##  Future Improvements

* Real Authentication
* Razorpay/Stripe Payment Integration
* Admin Dashboard
* Movie API Integration
* Email Ticket Confirmation

---

## Screenshots 📸
<img width="1405" height="902" alt="Screenshot 2026-05-12 135302" src="https://github.com/user-attachments/assets/fbec0223-80a8-4c52-af78-13a7c3bf1fac" />
<img width="1407" height="916" alt="Screenshot 2026-05-12 135330" src="https://github.com/user-attachments/assets/b964228f-7e35-4424-b2db-8e7a79bcefb3" />
<img width="1406" height="905" alt="Screenshot 2026-05-12 135345" src="https://github.com/user-attachments/assets/d26249c5-000e-43d0-b65d-cfd8d4ef6b59" />
<img width="1407" height="905" alt="Screenshot 2026-05-12 135351" src="https://github.com/user-attachments/assets/2dfeb7a1-3dc7-40dc-b310-55ef64cb55a6" />
<img width="1368" height="901" alt="Screenshot 2026-05-12 135403" src="https://github.com/user-attachments/assets/c5455628-e0fd-4980-a20b-37bfc33c0e40" />

Made by Sahil Lokwani

GitHub:
https://github.com/SahilLokwani77
