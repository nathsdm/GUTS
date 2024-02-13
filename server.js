const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');

// Initialize Firebase Admin SDK
const serviceAccount = require('./key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Access Firestore
const db = admin.firestore();

// Create Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for retrieving user data
app.get('/users', async (req, res) => {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();
  const users = [];
  snapshot.forEach((doc) => {
    users.push(doc.data());
  });
  res.send(users);
});

// Define a route for adding a new user
app.post('/users', async (req, res) => {
  const user = req.body;
  const usersRef = db.collection('users');
  await usersRef.add(user);
  res.send('User added');
});

// Define a route for updating a user
app.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const user = req.body;
  const usersRef = db.collection('users');
  await usersRef.doc(id).update(user);
  res.send('User updated');
});

// Define a route to add a new task
app.post('/tasks', async (req, res) => {
  const task = req.body;
  const tasksRef = db.collection('tasks');
  await tasksRef.add(task);
  res.send('Task added');
});

// Define a route to retrieve tasks
app.get('/tasks', async (req, res) => {
  const tasksRef = db.collection('tasks');
  const snapshot = await tasksRef.get();
  const tasks = [];
  snapshot.forEach((doc) => {
    tasks.push(doc.data());
  });
  res.send(tasks);
});

// Start the server
const port = 8080; // Specify the port you want the server to listen on
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
