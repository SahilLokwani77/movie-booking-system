# Movie Booking Management System 🎬

A full-stack movie ticket booking application built with Spring Boot and React.

## Features ✨
- **User Authentication**: Secure user registration and login.
- **Movie Browsing**: View available movies, their posters, duration, and descriptions.
- **Show Selection**: Choose from available showtimes for any given movie.
- **Interactive Seat Layout**: Select your seats visually from an interactive grid.
- **Dummy Payment Integration**: Simulate payment processing during the booking confirmation.
- **Real-time Database**: Uses MySQL to store users, movies, shows, seats, and bookings securely.

## Tech Stack 💻
- **Backend**: Java 17, Spring Boot, Spring Data JPA, Hibernate, MySQL.
- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios.
- **Testing**: Postman for APIs, Local end-to-end testing.

## Prerequisites ⚙️
- **Java Development Kit (JDK) 17**
- **Node.js (v18+)**
- **MySQL Server** (running locally on default port 3306)

## Setup Instructions 🚀

### 1. Database Configuration
Ensure your MySQL server is running. 
You don't need to create the database manually. The application will automatically create a database named `movie_booking`.
By default, the backend expects MySQL credentials:
- Username: `root`
- Password: `root`
*(You can change these in `backend/src/main/resources/application.properties`)*

### 2. Running the Backend (Spring Boot)
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Start the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(The server will start on `http://localhost:8080`)*

### 3. Running the Frontend (React)
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The UI will run on `http://localhost:5173`)*

## Screenshots 📸
<img width="1405" height="902" alt="Screenshot 2026-05-12 135302" src="https://github.com/user-attachments/assets/fbec0223-80a8-4c52-af78-13a7c3bf1fac" />
<img width="1407" height="916" alt="Screenshot 2026-05-12 135330" src="https://github.com/user-attachments/assets/b964228f-7e35-4424-b2db-8e7a79bcefb3" />
<img width="1406" height="905" alt="Screenshot 2026-05-12 135345" src="https://github.com/user-attachments/assets/d26249c5-000e-43d0-b65d-cfd8d4ef6b59" />
<img width="1407" height="905" alt="Screenshot 2026-05-12 135351" src="https://github.com/user-attachments/assets/2dfeb7a1-3dc7-40dc-b310-55ef64cb55a6" />
<img width="1368" height="901" alt="Screenshot 2026-05-12 135403" src="https://github.com/user-attachments/assets/c5455628-e0fd-4980-a20b-37bfc33c0e40" />

