// Get Firebase Auth and Firestore instances
var auth = firebase.auth();

// Get the authenticated user's unique identifier (UID)
const user = localStorage.getItem('user');

// Check if user is signed in
auth.onAuthStateChanged(function(user) {
    if (user) {
        // Get user data
        var email = user.email;
        var displayName = user.displayName;
        var uid = user.uid;
        localStorage.setItem("uid", uid);
        
        // Update DOM with user data
        document.getElementById('email').innerText = email;
        document.getElementById('display-name').innerText = displayName;
        document.getElementById('user-id').innerText = uid;

        // Handle change name button click
        var changeNameBtn = document.getElementById('change-name-btn');
        changeNameBtn.addEventListener('click', function() {
            var newName = prompt("Enter your new name");
            if (newName) {
                user.updateProfile({
                    displayName: newName
                }).then(function() {
                    // Update successful
                    console.log('Display name updated successfully:', newName);
                    document.getElementById('display-name').innerText = newName;
                }).catch(function(error) {
                    // An error happened
                    console.error('Error updating display name:', error);
                });
            }
        });

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
        localStorage.clear();
        window.location.replace('../index.html');
    }
});
