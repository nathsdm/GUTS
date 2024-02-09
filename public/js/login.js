localStorage.setItem('Account', 'Client')

fetch('https://guts-69f13-default-rtdb.europe-west1.firebasedatabase.app/users.json')
  .then(response => response.json())
  .then(data => {
    // Process the retrieved user data here
    console.log(data);
  })
  .catch(error => {
    // Handle any errors that occur during the request
    console.error('Error:', error);
});

/*
fetch('https://guts-69f13-default-rtdb.europe-west1.firebasedatabase.app/users.json', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: 'Alice',
        age: 25,
    }),
    })
    .then(response => response.json())
    .then(data => {
        // Process the response data here
        console.log(data);
    })
    .catch(error => {
        // Handle any errors that occur during the request
        console.error('Error:', error);
    });
*/

const form = document.getElementById('test-form');

form.addEventListener('submit', (event) => {
    // Prevent default form submission
    event.preventDefault();

    // Retrieve form input values
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    // Construct data object
    const formData = {
        name: name,
        password: password
    };

    // Check that the name exists and the password is correct
    fetch('https://guts-69f13-default-rtdb.europe-west1.firebasedatabase.app/users.json')
    .then(response => response.json())
    .then(data => {
        // Process the retrieved user data here
        const keys = Object.keys(data);
        for(const key of keys) {
            if(data[key].name === name && data[key].password === password) {
                localStorage.setItem('Account', "Admin")
                window.location.href = '/home.html';
                return;
            }
        }
        alert('Login failed');
    })
    .catch(error => {
        // Handle any errors that occur during the request
        console.error('Error:', error);
    });
});