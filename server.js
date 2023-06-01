const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

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

// Define a route for retrieving user playlists
app.get('/playlists/:userId', (req, res) => {
  const userId = req.params.userId;
  const playlistsRef = db.collection('users').doc(userId).collection('playlists');

  playlistsRef
    .get()
    .then((snapshot) => {
      const playlists = snapshot.docs.map((doc) => doc.data());
      res.json(playlists);
    })
    .catch((error) => {
      console.error('Error retrieving playlists:', error);
      res.status(500).send('Failed to retrieve playlists');
    });
});

// Define a route for adding a playlist to a user
app.post('/playlists/:userId', (req, res) => {
  const userId = req.params.userId;
  const playlist = req.body;

  const playlistsRef = db.collection('users').doc(userId).collection('playlists');

  playlistsRef
    .add(playlist)
    .then(() => {
      res.send('Playlist added successfully');
    })
    .catch((error) => {
      console.error('Error adding playlist:', error);
      res.status(500).send('Failed to add playlist');
    });
});

// Start the server
const port = 8080; // Specify the port you want the server to listen on
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
