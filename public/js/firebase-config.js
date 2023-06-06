// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAhsAUoBXrPqBclyC1o0ibwcKWApEaM8fo",
  authDomain: "west-acidic-rabbit.glitch.me",
  databaseURL: "https://bionic-tracer-358519-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bionic-tracer-358519",
  storageBucket: "bionic-tracer-358519.appspot.com",
  messagingSenderId: "936748069792",
  appId: "1:936748069792:web:55b7a61571fc0ecec92ac5",
  measurementId: "G-ELMSSN02VF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  
// Get elements
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const registerButton = document.getElementById('register-button');

if (registerButton) {
  // Add login event
  registerButton.addEventListener('click', (e) => {
    // Get email and password
    const email = emailInput.value;
    const password = passwordInput.value;
    const auth = firebase.auth();

    // Register
    const promise = auth.createUserWithEmailAndPassword(email, password);
    promise.then((userCredential) => {
      // Set display name to the beginning of the email address
      const user = userCredential.user;
      localStorage.setItem("user", user);
      const displayName = email.split('@')[0];
      user.updateProfile({
        displayName: displayName
      }).then(function() {
        console.log("Display name set successfully:", displayName);
      }).catch(function(error) {
        console.error("Error setting display name:", error);
      });
    }).catch(e => console.log(e.message));
  });
}

if(window.location === "register.html") {
  // Add a realtime listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      const registerLi = document.getElementById("registerLi");
      const registerLink = document.getElementById("registerLink");
      // User is logged in, change "Register" button to "Profile"
      registerLink.textContent = "Profile";
      registerLink.href = "connected.html";
      window.location = "connected.html";
    } else {
      console.log('not logged in');
    }
  });
}


// Get a reference to the sign in button
const signInButton = document.getElementById("sign-in-button");

if(signInButton) {
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
        localStorage.setItem("user", user);
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
}

