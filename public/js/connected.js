// Get Firebase Auth and Firestore instances
var auth = firebase.auth();
var firestore = firebase.firestore();





// Get the authenticated user's unique identifier (UID)
const user = firebase.auth().currentUser;
const uid = user.uid;

// Create a new playlist document in the database
const playlistData = {
  name: "My Playlist",
  songs: ["Song 1", "Song 2", "Song 3"]
};

// Save the playlist data under the user's unique identifier
firebase.database().ref('users/' + uid + '/playlists').push(playlistData)
  .then(() => {
    console.log("Playlist saved successfully!");
  })
  .catch((error) => {
    console.error("Error saving playlist:", error);
  });











// Check if user is signed in
auth.onAuthStateChanged(function(user) {
    if (user) {
        // Get user data
        var email = user.email;
        var displayName = user.displayName;
        var uid = user.uid;
        
        // Update DOM with user data
        document.getElementById('email').innerText = email;
        document.getElementById('display-name').innerText = displayName;
        document.getElementById('user-id').innerText = uid;
        
        // Handle sign out button click
        var signOutBtn = document.getElementById('sign-out-btn');
        signOutBtn.addEventListener('click', function() {
            auth.signOut().then(function() {
                // Sign-out successful.
                console.log('Sign-out successful.');
                window.location.replace('index.html');
            }).catch(function(error) {
                // An error happened.
                console.error(error);
            });
        });
    } else {
        // User is signed out.
        console.log('User is signed out.');
        window.location.replace('../index.html');
    }
});
