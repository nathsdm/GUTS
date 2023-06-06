var commonArtists = [];
let valid = true;
let playlists = [];

const uid = localStorage.getItem("uid");

if(uid) {
  const registerLi = document.getElementById("registerLi");
  const registerLink = document.getElementById("registerLink");
  // User is logged in, change "Register" button to "Profile"
  registerLink.textContent = "Profile";
  registerLink.href = "connected.html";
}

if (uid) {
  fetch("https://west-acidic-rabbit.glitch.me/playlists/" + uid)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error retrieving playlists");
      }
    })
    .then((datas) => {
      const table = document.getElementById("playlist-list");
      playlists = datas; // Store the retrieved playlists in the 'playlists' array
      for (const data of datas) {
        const row = document.createElement("tr");
        const titleCell = document.createElement("td");
        const artistCountCell = document.createElement("td");
        const editCell = document.createElement("td");
        const selectCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        const checkbox = document.createElement("input");

        titleCell.textContent = data.title;
        artistCountCell.textContent = data.artists.length;
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
          const rowIndex = this.parentNode.parentNode.rowIndex;
          table.deleteRow(rowIndex-1);
          playlists = playlists.filter((playlist) => playlist.title !== data.title);
          deletePlaylistFromDatabase(uid, data.title);
        });

        checkbox.type = "checkbox";
        checkbox.id = "select-" + data.title;
        checkbox.addEventListener("change", function () {
          if (checkbox.checked) {
            playlists.push(data);
          } else {
            playlists = playlists.filter((playlist) => playlist.title !== data.title);
          }
          commonArtists = findCommonArtists(playlists);
          if(commonArtists) {
            localStorage.setItem('playlist_url', null);
            localStorage.setItem('commonArtists', commonArtists);
          }
        });

        editCell.appendChild(deleteButton);
        selectCell.appendChild(checkbox);

        row.appendChild(titleCell);
        row.appendChild(artistCountCell);
        row.appendChild(editCell);
        row.appendChild(selectCell);

        table.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error retrieving playlists:", error);
    });
} else {
  console.log("User is not logged in");
}

function findCommonArtists(playlists) {
  // Get an array of all unique artists in all playlists
  const allArtists = Array.from(
    new Set(playlists.reduce((acc, playlist) => [...acc, ...playlist.artists], []))
  );

  // Filter the array to include only artists that appear in all playlists
  const commonArtists = allArtists.filter((artist) =>
    playlists.every((playlist) => playlist.artists.includes(artist))
  );

  return commonArtists;
}

function deletePlaylistFromDatabase(uid, playlistTitle) {
  fetch("https://west-acidic-rabbit.glitch.me/playlists/" + uid + "/" + playlistTitle, {
    method: "DELETE"
  })
    .then((response) => {
      if (response.ok) {
        console.log("Playlist deleted successfully");
      } else {
        console.error("Error deleting playlist");
      }
    })
    .catch((error) => {
      console.error("Error deleting playlist:", error);
    });
}

// Event listener for "Create Blind Test" button
document
  .getElementById("playlist-input")
  .addEventListener("change", function () {
    // Get the selected file
    const fileInput = document.getElementById("playlist-input");
    const files = fileInput.files;
    handleFiles(files);
  });

function select_button(button) {
  // Remove the 'selected' class from all buttons
  const buttons = document.getElementsByTagName("button");
  for (const button of buttons) {
    button.classList.remove("selected");
  }

  // Add the 'selected' class to the clicked button
  button.classList.add("selected");
}

const future_funk_button = document.getElementById("future-funk-button");
future_funk_button.addEventListener("click", async function () {
  if (!isStoring) {
    select_button(this);
    await storePlaylistUrl("https://api.deezer.com/playlist/7470091424");
    // Rest of the code that depends on the stored playlist URL
  }
});

const lofi_button = document.getElementById("lofi-button");
lofi_button.addEventListener("click", async function () {
  if (!isStoring) {
    select_button(this);
    await storePlaylistUrl("https://api.deezer.com/playlist/8323639942");
    // Rest of the code that depends on the stored playlist URL
  }
});

const jazz_button = document.getElementById("jazz-button");
jazz_button.addEventListener("click", async function () {
  if (!isStoring) {
    select_button(this);
    await storePlaylistUrl("https://api.deezer.com/playlist/5038751464");
    // Rest of the code that depends on the stored playlist URL
  }
});

const random_playlist_button = document.getElementById("random-playlist-button");
random_playlist_button.addEventListener("click", async function () {
  if (!isStoring) {
    const playlist_id = Math.floor(Math.random() * 1000000);
    select_button(this);
    await storePlaylistUrl("https://api.deezer.com/playlist/" + playlist_id);
    // Rest of the code that depends on the stored playlist URL
  }
});

function findUniqueArtists(artists) {
  const uniqueArtists = [];

  for (const artist of artists) {
    if (!uniqueArtists.includes(artist)) {
      uniqueArtists.push(artist);
    }
  }

  return uniqueArtists;
}

function retrieveArtistsFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const contents = event.target.result;
      const lines = contents.split("\n");
      const artists = [];

      lines.forEach((line) => {
        const artist = line.split(" - ")[0].trim();
        if (artist) {
          artists.push(artist);
        }
      });

      resolve(findUniqueArtists(artists));
    };

    reader.onerror = function (event) {
      reject(event.target.error);
    };

    reader.readAsText(file);
  });
}


// Variable to track if the storing process is ongoing
let isStoring = false;

async function handleFiles(files) {
  const table = document.getElementById("playlist-list");

  for (const file of files) {
    const playlistTitle = file.name.replace(/\.txt$/, "");
    const playlists_save = {
      title: playlistTitle,
      artists: await retrieveArtistsFromFile(file),
    };
    console.log(playlists_save);
    if (uid) {
    // Check if playlist with the same title already exists
    fetch("https://west-acidic-rabbit.glitch.me/playlists/" + uid)
      .then((response) => {
        if (response.ok) {
          console.log(response);
          return response.json();
        } else {
          throw new Error("Error retrieving playlists");
        }
      })
      .then((data) => {
        if (data) {
          // Disable all buttons during the storing process
          disableButtons();

          // Set the flag to indicate that storing is ongoing
          isStoring = true;

          const folderPath = `https://west-acidic-rabbit.glitch.me/playlists/${uid}/${playlistTitle}`;

          // Create the user's subfolder with the playlist title as the folder name
          fetch(folderPath, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(playlists_save),
          })
            .then((response) => {
              if (response.ok) {
                console.log("Playlist added successfully");
                
              } else {
                throw new Error("Error adding playlist");
              }
            })
            .catch((error) => {
              console.error("Error adding playlist:", error);
            })
            .finally(() => {
              // Enable the buttons after storing is completed
              enableButtons();

              // Reset the flag
              isStoring = false;
            });

          // Rest of the code for reading and processing the file
        } else {
          alert("The playlist is already there");
        }
      });
    }
      // Add the playlist to the local array for display
      playlists.push(playlists_save);

      // Create the table row and cells for the new playlist
      const row = document.createElement("tr");
      const titleCell = document.createElement("td");
      const artistCountCell = document.createElement("td");
      const editCell = document.createElement("td");
      const selectCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      const checkbox = document.createElement("input");

      titleCell.textContent = playlistTitle;
      artistCountCell.textContent = playlists_save.artists.length;
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        const rowIndex = this.parentNode.parentNode.rowIndex;
        table.deleteRow(rowIndex-1);
        playlists = playlists.filter((playlist) => playlist.title !== playlistTitle);
        deletePlaylistFromDatabase(uid, playlistTitle);
      });

      checkbox.type = "checkbox";
      checkbox.id = "select-" + playlistTitle;
      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          playlists.push(playlists_save);
        } else {
          playlists = playlists.filter((playlist) => playlist.title !== playlistTitle);
        }
        commonArtists = findCommonArtists(playlists);
        if(commonArtists) {
            localStorage.setItem('playlist_url', null);
            localStorage.setItem('commonArtists', commonArtists);
        }
      });

      editCell.appendChild(deleteButton);
      selectCell.appendChild(checkbox);

      row.appendChild(titleCell);
      row.appendChild(artistCountCell);
      row.appendChild(editCell);
      row.appendChild(selectCell);

      table.appendChild(row);
  }
}

// Function to store the playlist URL in localStorage
function storePlaylistUrl(playlistUrl) {
  return new Promise((resolve) => {
    localStorage.setItem("playlist_url", playlistUrl);
    resolve();
  });
}

// Function to disable all buttons
function disableButtons() {
  const buttons = document.getElementsByTagName("button");
  for (const button of buttons) {
    button.disabled = true;
  }
}

// Function to enable all buttons
function enableButtons() {
  const buttons = document.getElementsByTagName("button");
  for (const button of buttons) {
    button.disabled = false;
  }
}
