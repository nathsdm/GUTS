document.addEventListener("DOMContentLoaded", function() {
  var commonArtists = [];

  function findCommonArtists(playlists) {
    // Get an array of all unique artists in all playlists
    const allArtists = Array.from(
      new Set(playlists.reduce((acc, artists) => [...acc, ...artists], []))
    );

    // Filter the array to include only artists that appear in all playlists
    commonArtists = allArtists.filter((artist) =>
      playlists.every((playlist) => playlist.includes(artist))
    );

    return commonArtists;
  }

  // Add event listener for drag and drop
  const dropZone = document.getElementById('dropZone');
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFiles(files);
  });

  // Event listener for "Create Blind Test" button
  document.getElementById('playlist-input').addEventListener('change', function() {
    // Get the selected file
    const fileInput = document.getElementById('playlist-input');
    const files = fileInput.files;
    handleFiles(files);
  });

  function handleFiles(files) {
    const playlists = [];
    for(const file of files) {

      // Read the contents of the file
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function() {
        const playlist = reader.result;

        // Validate the format of the playlist
        const lines = playlist.split('\n');
        for (const line of lines) {
          if (line.split(' - ').length < 2 && line !== '') {
            alert('Invalid playlist format: ' + line);
            return;
          }
        }

        // Extract the list of artists from the playlist
        const artists = lines.map((line) => line.split(' - ')[0]);

        // Store the artists in the array
        playlists.push(artists);

        // Find the common artists and display them
        commonArtists = findCommonArtists(playlists);
        const artistList = document.getElementById('artist-list');
        artistList.innerHTML = '';
        for (const artist of commonArtists) {
          const listItem = document.createElement('li');
          listItem.textContent = artist;
          artistList.appendChild(listItem);
        }
        localStorage.setItem('commonArtists', commonArtists);
      }
    }
  }

  // Event listener for "Reset Playlists" button
  document.getElementById('reset-button').addEventListener('click', function() {
    // Clear the playlists array and the list of shared artists
    const artistList = document.getElementById('artist-list');
    artistList.innerHTML = '';
    localStorage.setItem('commonArtists', JSON.stringify([]));
  });
});
