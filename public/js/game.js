// Define global variables
let commonArtists = [];
let songUrls = [];
let Artists = [];
let Songs = [];
let players = JSON.parse(localStorage.getItem('players'));
if (players) {
  let Points = Array(players.length).fill(0); // Array to store player points
}
let mode = 'undefined';
let round = 0;
let playlistUrl = null;
let playlist_id = Math.floor(Math.random() * 1000000);

// Get DOM elements
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const nextButton = document.getElementById('next-button');
const audioPlayer = document.getElementById('audio-player');
const display = document.getElementById('display-button');
const playerList = document.getElementById('player-list');

// Hide default audio controls
audioPlayer.controls = false;

// Event listener for play button
playButton.addEventListener('click', function () {
  audioPlayer.volume = 1;
  audioPlayer.play();
  playButton.style.display = 'none';
  pauseButton.style.display = 'block';
  FadeAudio();
});

// Event listener for pause button
pauseButton.addEventListener('click', function () {
  audioPlayer.pause();
  pauseButton.style.display = 'none';
  playButton.style.display = 'block';
});

// Event listener for display button
display.addEventListener('click', function () {
  alert(Artists[round] + ' - ' + Songs[round]);
});

// Event listener for spacebar to play/pause
window.addEventListener('keydown', function (event) {
  if (event.code === 'Space') {
    event.preventDefault();
    if (audioPlayer.paused) {
      audioPlayer.volume = 1;
      audioPlayer.play();
      playButton.style.display = 'none';
      pauseButton.style.display = 'block';
      FadeAudio();
    } else {
      audioPlayer.pause();
      pauseButton.style.display = 'none';
      playButton.style.display = 'block';
    }
  }
});

// Function to store the playlist URL in localStorage
function storePlaylistUrl(playlistUrl) {
  return new Promise((resolve) => {
    localStorage.setItem('playlist_url', playlistUrl);
    resolve();
  });
}

function addPremadePlaylist(url) {
  return new Promise((resolve, reject) => {
    const appId = '599484';
    const apiKey = 'd2e83b6af668d8f382ba6fcc10050921';
    const playlist_url =
      url +
      '?output=jsonp&callback=?&app_id=' +
      appId +
      '&api_key=' +
      apiKey;

    $.getJSON(playlist_url, function (data) {
      let songs = [];
      let song_urls = [];
      let songNames = []; // Array to store song names
      let artistNames = []; // Array to store artist names
      if (data.error) {
        console.log('Error');
        playlist_id = Math.floor(Math.random() * 1000000);
        storePlaylistUrl('https://api.deezer.com/playlist/' + playlist_id);
        resolve([[], [], []]);
      } else {
        for (var i = 0; i < data.tracks.data.length; i++) {
          var song = data.tracks.data[i];
          if (song && song.preview) {
            songs.push([song.preview, song.title, song.artist.name]);
          } else {
            console.log('No song found');
          }
        }
        songs.sort(() => Math.random() - 0.5);
        for (const song of songs) {
          song_urls.push(song[0]);
          songNames.push(song[1]);
          artistNames.push(song[2]);
        }

        resolve([song_urls, songNames, artistNames]);
      }
    });
  });
}

// Event listener for next button
nextButton.addEventListener('click', function () {
  pauseButton.style.display = 'none';
  playButton.style.display = 'block';
  if (mode === 'custom') {
    if (commonArtists.length > round + 1) {
      launchArtist(commonArtists[round + 1]);
      round++;
    } else {
      alert('End of the game');
    }
  } else if (mode === 'premade') {
    if (songUrls[round + 1] !== '') {
      changeSong(songUrls[round + 1]);
      round++;
    } else {
      alert('End of the game');
    }
  } else if (mode === 'undefined') {
    alert('No songs to play');
  }
});

function retryFindPlaylist() {
  addPremadePlaylist(playlistUrl)
    .then((result) => {
      songUrls = result[0];
      Songs = result[1];
      Artists = result[2];
      console.log(result);
      // Check if the playlist contains any artists
      if (Artists.length === 0) {
        playlistUrl = localStorage.getItem('playlist_url');
        retryFindPlaylist();
      } else {
        // Change song to the first one in the list
        changeSong(songUrls[round]);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

playlistUrl = localStorage.getItem('playlist_url');
commonArtists = localStorage
  .getItem('commonArtists')
if(commonArtists) {
  commonArtists = commonArtists.split(',')
  .sort(() => Math.random() - 0.5);
}
if (playlistUrl === 'null') {
  if (commonArtists === 'null') {
    alert('No songs to play');
  } else {
    mode = 'custom';
    // Launch first artist
    launchArtist(commonArtists[round]);
  }
} else {
  mode = 'premade';
  retryFindPlaylist();
}

// Launch artist and get song URL
function launchArtist(artistName) {
  const appId = '599484';
  const apiKey = 'd2e83b6af668d8f382ba6fcc10050921';
  const artistUrl = `https://api.deezer.com/search/artist?q=${artistName}&limit=1&index=0&output=jsonp&callback=?&app_id=${appId}&api_key=${apiKey}`;

  // Find artist
  $.getJSON(artistUrl, function (data) {
    const artist = data.data[0];
    if (artist) {
      const songsUrl = `${artist.tracklist}?limit=1&index=0&output=jsonp&callback=?&app_id=${appId}&api_key=${apiKey}`;

      // Find song
      $.getJSON(songsUrl, function (data) {
        const song = data.data[0];
        if (song) {
          const songUrl = song.preview;
          const songName = song.title;
          const artistName = song.artist.name;
          Songs.push(songName);
          Artists.push(artistName);
          Points.push(0); // Initialize points for the player
          localStorage.setItem('artist_names', JSON.stringify(Artists));
          localStorage.setItem('song_names', JSON.stringify(Songs));
          localStorage.setItem('player_points', JSON.stringify(Points));
          songUrls.push(songUrl);
          changeSong(songUrl);
          updatePlayerList(); // Update the player list with points
        } else {
          console.log('No song found');
          // Handle error
        }
      });
    } else {
      console.log('No artist found');
      // Handle error
    }
  });
}

// Function to change the song in the audio player
function changeSong(songUrl) {
  audioPlayer.src = songUrl;
}

// Function to update the player list
function updatePlayerList() {
  playerList.innerHTML = ''; // Clear the player list
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const playerItem = document.createElement('li');
    playerItem.innerHTML = `
      <span>${player}</span>
      <span>Points: ${Points[i]}</span>
      <button onclick="addPoint(${i})">Add Point</button>
    `;
    playerList.appendChild(playerItem);
  }
}

// Function to add a point to a player's counter
function addPoint(index) {
  Points[index] += 1; // Increase the player's points by 1
  updatePlayerList(); // Update the player list with the new points
  localStorage.setItem('player_points', JSON.stringify(Points)); // Store the updated points in localStorage
}

function FadeAudio() {
  // Set the point in playback that fadeout begins. This is for a 2 second fade out.
  var fadePoint = audioPlayer.duration - 2;
  var endPoint = audioPlayer.duration;

  var fadeAudio = setInterval(function () {
    // Only fade if past the fade out point or not at zero already
    if (
      audioPlayer.currentTime >= fadePoint &&
      audioPlayer.volume - 0.01 > 0.0
    ) {
      audioPlayer.volume -= 0.01;
    }
    // When volume reaches zero, stop the interval
    else if (audioPlayer.currentTime >= fadePoint) {
      audioPlayer.pause();
      pauseButton.style.display = 'none';
      playButton.style.display = 'block';
      clearInterval(fadeAudio);
    }
  }, 20);
}

if(players) {
  updatePlayerList();
}