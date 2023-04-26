// Get Firebase Auth and Firestore instances
var auth = firebase.auth();

// Check if user is signed in
auth.onAuthStateChanged(function(user) {

    // Add a click event listener to the submit button
    $("#submit-button").click(function() {
        // Get the values of the name and color inputs
        const name = $("#name-input").val();
        const color = $("#color-input").val();
        if(user) {
        // Set the user's display name and custom claims
        user.updateProfile({
            displayName: name
        }).then(function() {
            // Add the custom claims to the user's token
            return firebase.auth().currentUser.getIdTokenResult();
        }).then(function(idTokenResult) {
            // Add the custom claims to the user's token
            return firebase.auth().currentUser.getIdToken(true);
        }).then(function() {
            // Set the custom claims in the Firebase Authentication database
            return firebase.database().ref('users/' + user.uid).set({
                favoriteColor: color
            });
        }).then(function() {
            // Redirect the user to the game page
            window.location.href = "connected.html";
        }).catch(function(error) {
            // Handle errors here
            console.log(error);
        });
        } else {
            // No user is signed in.
            console.log('No user is signed in.');
        }
    });
});
