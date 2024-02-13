const task_form = document.getElementById('task-form');

task_form.addEventListener('submit', (event) => {
    // Prevent default form submission
    event.preventDefault();

    // Retrieve form input values
    const task = document.getElementById("task").value;
    const points = document.getElementById("points").value;
    const period = document.getElementById("period").value;
    const user = document.getElementById("user").value;

    // Construct data object
    const formData = {
        task: task,
        points: points,
        period: period,
        user: user
    };

    // Add new task
    fetch('https://guts-69f13-default-rtdb.europe-west1.firebasedatabase.app/tasks.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
});