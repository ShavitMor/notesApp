import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/db'; 
import authRoutes from './routes/authRoutes'; 
import notesRoutes from './routes/notesRoutes'; 
const path = require('path');

dotenv.config();

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(express.json());

//routes
app.use('/auth', authRoutes);
app.use('/', notesRoutes);


app.get('/', (req, res) => {
  const clientHtmlPath = path.resolve(__dirname, '../client.html');
  res.sendFile(clientHtmlPath);

});
  

//initiate socket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Register the user with the server
  socket.on('register', (userId) => {
    console.log(`User ${userId} registered`);
    socket.join(userId);
  });

  // Listen for noteAdded events and broadcast to the specific user
  socket.on('noteAdded', (note) => {
    console.log(`Note added: ${note.title} by ${note.user}`);
    io.to(note.user).emit('noteAdded', note);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


//start the server
if (process.env.NODE_ENV !== 'test') {
const PORT = process.env.PORT || 3500;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export { app, io };
