// Load the players' names from local storage or initialize an empty array
let players = JSON.parse(localStorage.getItem('players')) || [];

document.getElementById("add-player-form").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission

  const playerNameInput = document.getElementById("player-name-input");
  const playerName = playerNameInput.value.trim();

  if (playerName !== "") {
    const playerItem = document.createElement("li");
    playerItem.textContent = playerName;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
      deletePlayer(playerName);
    });

    playerItem.appendChild(deleteButton);

    const playerList = document.getElementById("player-list");
    playerList.appendChild(playerItem);

    playerNameInput.value = ""; // Clear input field

    // Add the player's name to the array
    players.push(playerName);

    // Save the updated array in local storage
    localStorage.setItem('players', JSON.stringify(players));
  }
});

function updatePlayers() {
  // Remove all players displayed
  const playerList = document.getElementById("player-list");
  while (playerList.firstChild) {
    playerList.removeChild(playerList.firstChild);
  }

  // Display all updated players
  for (const playerName of players) {
    const playerItem = document.createElement("li");
    playerItem.textContent = playerName;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
      deletePlayer(playerName);
    });

    playerItem.appendChild(deleteButton);

    playerList.appendChild(playerItem);
  }
}

updatePlayers();

function deletePlayer(playerName) {
  // Find the index of the player in the array
  const index = players.indexOf(playerName);

  if (index !== -1) {
    // Remove the player from the array
    players.splice(index, 1);

    // Update the player list in the HTML
    const playerList = document.getElementById("player-list");
    const playerItems = playerList.getElementsByTagName("li");

    for (let i = 0; i < playerItems.length; i++) {
      const playerItem = playerItems[i];
      if (playerItem.textContent === playerName) {
        playerList.removeChild(playerItem);
        break;
      }
    }
    updatePlayers()
    // Save the updated array in local storage
    localStorage.setItem('players', JSON.stringify(players));
  }
}

document.getElementById("connect-button").addEventListener("click", function() {
  // Function to handle the connection logic
  function connect() {
    // Get user credentials
    const email = prompt("Enter your email");
    const password = prompt("Enter your password");

    // Authenticate user with Firebase
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Connection successful
        console.log("Connected successfully:", userCredential.user);

        const playerName = userCredential.user.displayName;
        
        // Check if the player is already in the players array
        if (!players.includes(playerName)) {
          const playerItem = document.createElement("li");
          playerItem.textContent = playerName;

          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", function() {
            deletePlayer(playerName);
          });

          playerItem.appendChild(deleteButton);

          const playerList = document.getElementById("player-list");
          playerList.appendChild(playerItem);

          // Add the player's name to the array
          players.push(playerName);

          // Save the updated array in local storage
          localStorage.setItem('players', JSON.stringify(players));
        } else {
          console.log("Player already exists:", playerName);
        }
      })
      .catch((error) => {
        // Connection failed
        console.error("Connection error:", error);
      });
  }

  connect(); // Call the connection function
});
