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

function addPremadePlaylist(url, button) {
  var appId = '599484';
  var apiKey = 'd2e83b6af668d8f382ba6fcc10050921';
  const playlist_url = url + '&output=jsonp&callback=?&app_id=' + appId + '&api_key=' + apiKey;;
  
  // Remove the 'selected' class from all buttons
  const buttons = document.getElementsByTagName('button');
  for (const button of buttons) {
    button.classList.remove('selected');
  }
  
  // Add the 'selected' class to the clicked button
  button.classList.add('selected');
  
  $.getJSON(playlist_url, function(data) {
    let song_urls = [];
    let songNames = []; // Array to store song names
    let artistNames = []; // Array to store artist names
    
    for (var i = 0; i < data.tracks.data.length; i++) {
      var song = data.tracks.data[i];
      if (song && song.preview) {
        song_urls.push(song.preview);
        songNames.push(song.title); // Save song name
        artistNames.push(song.artist.name); // Save artist name
      } else {
        console.log('No song found');
      }
    }
    
    // Save the arrays in local storage
    localStorage.setItem('song_urls', JSON.stringify(song_urls));
    localStorage.setItem('song_names', JSON.stringify(songNames));
    localStorage.setItem('artist_names', JSON.stringify(artistNames));
  });
}

const future_funk_button = document.getElementById('future-funk-button');
future_funk_button.addEventListener('click', function() {
  addPremadePlaylist('https://api.deezer.com/playlist/7470091424', this);
});

const lofi_button = document.getElementById('lofi-button');
lofi_button.addEventListener('click', function() {
  addPremadePlaylist('https://api.deezer.com/playlist/8323639942', this);
});

const jazz_button = document.getElementById('jazz-button');
jazz_button.addEventListener('click', function() {
  addPremadePlaylist('https://api.deezer.com/playlist/5038751464', this);
});

const random_playlist_button = document.getElementById('random-playlist-button');
random_playlist_button.addEventListener('click', function() {
  playlist_id = Math.floor(Math.random() * 100000000);
  addPremadePlaylist('https://api.deezer.com/playlist/' + playlist_id, this);
});

function handleFiles(files) {
  const playlists = [];
  const table = document.getElementById('playlist-list');
  table.innerHTML = ''; // clear existing rows
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
          lines.splice(lines.indexOf(line), 1);
        }
      }

      // Extract the list of artists from the playlist
      const artists = lines.map((line) => line.split(' - ')[0]);

      // Store the artists in the array
      playlists.push(artists);

      // Find the common artists and display them
      commonArtists = findCommonArtists(playlists);
      // Shuffling the array of common artists
      commonArtists.sort(() => Math.random() - 0.5);
      if(commonArtists.length > 0) {
        localStorage.setItem('commonArtists', commonArtists);
      } else {
        localStorage.setItem('commonArtists', null);
        alert('No common artists found');
      }
      
      table.innerHTML += '<tr><td>' + file.name.replace(/\.txt$/, "") + '</td><td>' + artists.length + '</td><td><button id=' + file.name.replace(/\.txt$/, "") +'>Edit</button></td></tr>';
      const editButton = document.getElementById(file.name.replace(/\.txt$/, ""));
      editButton.addEventListener('click', function() {
        table.deleteRow(editButton.parentNode.parentNode.rowIndex);
        playlists.splice(playlists.indexOf(artists), 1);}
      );
    }
  }
}

// Event listener for "Reset Playlists" button
document.getElementById('reset-button').addEventListener('click', function() {
  // Clear the playlists array and the list of shared artists
  const playlistList = document.getElementById('playlist-list');
  playlistList.innerHTML = '';
  localStorage.clear();
});
