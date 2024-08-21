# Notes App

## Description

This project is a RESTful API for managing notes, with user authentication and real-time notifications. It includes integration with the MeaningCloud Sentiment Analysis API and uses MongoDB for data storage.

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (version 14 or later).
- **MongoDB**: Make sure MongoDB is installed and running on your machine, or use a cloud-based MongoDB service.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ShavitMor/notesapp.git
   cd notesapp
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory of the project and add your environment variables:

   ```env
   MONGO_URI=mongodb://localhost:27017/notesapp //or enter you atlas link
   JWT_SECRET=your_jwt_secret
   MEANINGCLOUD_API_KEY=your_meaningcloud_api_key
   ```

   - Replace `your_jwt_secret` with your chosen secret key for JWT authentication.
   - Replace `your_meaningcloud_api_key` with your MeaningCloud API key.

### Running the Application

1. **Start the server**

   ```bash
   npm run dev
   ```

### API Endpoints

- **User Authentication**
  - **POST** `/auth/register`: Register a new user. Body: `{ username, password }`
  - **POST** `/auth/login`: Login a user. Body: `{ username, password }`
  - **GET** `/auth/profile`: Retrieve user profile.

- **Notes Management**
  - **POST** `/notes`: Create a new note. Body: `{ title, body }`
  - **GET** `/notes`: Retrieve all notes of the user and his subscriptions.
  - **GET** `/notes/:id`: Retrieve a specific note of the user or his subscriptions by ID.
  - **GET** `/users`: List all users.
  - **POST** `/subscribe/:userId`: Subscribe to a user's notes.


### Running Tests

1. **Unit Tests**

   To run unit tests with Jest:

   ```bash
   npm test
   ```

### Using Real-Time Notifications

1. **Start the Server**

   Ensure the server is running.

2. **Open the Client**

   Open the `client.html` file in a web browser. This file is located in the root directory. (http://localhost:3500/client.html)

3. **Connect and Register**

   - You can for example:
   - Register a user, post some notes, register other user, subscribe to the first user.
   - Enter a User ID of the second user (you can see the ID in the db or in postman after registering) in the input field and click "Connect."
   - The application will establish a WebSocket connection to the server and register the user.

5. **Receive Notifications**

   - When a new note is added by the subscription user, the application will receive real-time notifications via WebSocket.
   - Notifications will be displayed in the list on the client.

