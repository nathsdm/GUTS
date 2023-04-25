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


document.addEventListener("DOMContentLoaded", function() {
  const playlists = [];

  // Event listener for "Create Blind Test" button
  document.getElementById('playlist-button').addEventListener('click', function() {
    // Get the selected file
    const fileInput = document.getElementById('playlist-input');
    const file = fileInput.files[0];

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

      // Display the list of artists
      const artistList = document.getElementById('artist-list');
      artistList.innerHTML = '';
      for (const artist of artists) {
        const listItem = document.createElement('li');
        listItem.textContent = artist;
        artistList.appendChild(listItem);
      }
    };
  });



  // Event listener for "Reset Playlists" button
  document.getElementById('reset-button').addEventListener('click', function() {
    // Clear the playlists array
    playlists.length = 0;

    // Clear the list of artists displayed on the page
    const artistList = document.getElementById('artist-list');
    artistList.innerHTML = '';
  });







  // Event listener for "Compare Playlists" button
  document.getElementById('compare-button').addEventListener('click', function() {
    commonArtists = findCommonArtists(playlists);

    // Display the list of shared artists
    const artistList = document.getElementById('artist-list');
    artistList.innerHTML = '';
    for (const artist of commonArtists) {
      const listItem = document.createElement('li');
      listItem.textContent = artist;
      artistList.appendChild(listItem);
    }
    localStorage.setItem('commonArtists', commonArtists);
  });

});