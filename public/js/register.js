// Get elements
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const registerButton = document.getElementById('register-button');

// Add login event
registerButton.addEventListener('click', (e) => {
  // Get email and password
  const email = emailInput.value;
  const password = passwordInput.value;
  const auth = firebase.auth();
  // Register
  const promise = auth.createUserWithEmailAndPassword(email, password);
  promise.catch(e => console.log(e.message));
});

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    console.log(firebaseUser);
    localStorage.setItem('user', firebaseUser);
    localStorage.setItem('uid', firebaseUser.uid);
    window.location = "connected.html";
  } else {
    console.log('not logged in');
  }
});

// Get a reference to the sign in button
const signInButton = document.getElementById("sign-in-button");

// Set up a click event listener for the sign in button
signInButton.addEventListener("click", function() {
  // Get the email and password values entered by the user
  const email = emailInput.value;
  const password = passwordInput.value;

  // Sign in the user with Firebase Auth
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(userCredential) {
      // User signed in successfully
      const user = userCredential.user;
      console.log("User signed in:", user);
      // Redirect to the connected.html page or do something else
      window.location.href = "connected.html";
    })
    .catch(function(error) {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing in:", errorCode, errorMessage);
      alert("Error signing in: " + errorMessage);
    });
});
