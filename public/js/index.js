const userAccount = localStorage.getItem('Account')

if(userAccount !== "Admin") {
    window.location.href = '/index.html';
}

var Nathan_card = document.getElementById("Nathan");

Nathan_card.addEventListener('click', function() {
    alert('test')
})

fetch('https://guts-69f13-default-rtdb.europe-west1.firebasedatabase.app/tasks.json')
    .then(response => response.json())
    .then(data => {
        // Process the retrieved user data here
        const keys = Object.keys(data);
        for(const key of keys) {
            const task = data[key].task;
            const points = data[key].points;
            const period = data[key].period;
            const user = data[key].user;
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h2>${task}</h2>
                <p>${points} points</p>
                <p>${period} days</p>
                <p>${user}</p>
            `;
            document.getElementById('tasks').appendChild(card);
        }
    })
    .catch(error => {
        // Handle any errors that occur during the request
        console.error('Error:', error);
    });