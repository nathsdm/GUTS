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
app.post('/playlists/:userId/:playlistName', (req, res) => {
  const userId = req.params.userId;
  const playlistName = req.params.playlistName;
  const playlist = req.body;

  const playlistRef = db.collection('users').doc(userId).collection('playlists').doc(playlistName);

  playlistRef
    .set(playlist)
    .then(() => {
      res.send('Playlist added successfully');
    })
    .catch((error) => {
      console.error('Error adding playlist:', error);
      res.status(500).send('Failed to add playlist');
    });
});

// Define a route for deleting a playlist from a user
app.delete('/playlists/:userId/:playlistName', (req, res) => {
  const userId = req.params.userId;
  const playlistName = req.params.playlistName;

  const playlistRef = db.collection('users').doc(userId).collection('playlists').doc(playlistName);

  playlistRef
    .delete()
    .then(() => {
      res.send('Playlist deleted successfully');
    })
    .catch((error) => {
      console.error('Error deleting playlist:', error);
      res.status(500).send('Failed to delete playlist');
    });
});

// Start the server
const port = 8080; // Specify the port you want the server to listen on
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
