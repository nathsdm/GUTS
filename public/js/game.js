// Define global variables
let commonArtists = [];
let songUrls = [];
let round = 1;

// Get DOM elements
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const nextButton = document.getElementById('next-button');
const audioPlayer = document.getElementById('audio-player');

// Hide default audio controls
audioPlayer.controls = false;

// Event listener for play button
playButton.addEventListener('click', function() {
  audioPlayer.play();
  playButton.style.display = 'none';
  pauseButton.style.display = 'block';
});

// Event listener for pause button
pauseButton.addEventListener('click', function() {
  audioPlayer.pause();
  pauseButton.style.display = 'none';
  playButton.style.display = 'block';
});

// Event listener for spacebar to play/pause
window.addEventListener('keydown', function(event) {
  if (event.code === 'Space') {
    event.preventDefault();
    if (audioPlayer.paused) {
      audioPlayer.play();
      playButton.style.display = 'none';
      pauseButton.style.display = 'block';
    } else {
      audioPlayer.pause();
      pauseButton.style.display = 'none';
      playButton.style.display = 'block';
    }
  }
});

// Event listener for next button
nextButton.addEventListener('click', function() {
  pauseButton.style.display = 'none';
  playButton.style.display = 'block';
  if (songUrls[round] !== '') {
    changeSong(songUrls[round]);
    round++;
  } else {
    alert('End of the game');
  }
});

// Check if song URLs are present in local storage
if (localStorage.getItem('song_urls') === 'undefined') {
  // Get common artists and replace unwanted characters
  commonArtists = localStorage.getItem('commonArtists').replace(/[\[\]"]/g, '').split(',');
  
  // Launch the first artist
  launchArtist(commonArtists[0]);
} else {
  // Parse song URLs from local storage
  songUrls = JSON.parse(localStorage.getItem('song_urls'));
  
  // Change song to the first one in the list
  changeSong(songUrls[0]);
}

// Launch artist and get song URL
function launchArtist(artistName) {
  const appId = '599484';
  const apiKey = 'd2e83b6af668d8f382ba6fcc10050921';
  const artistUrl = `https://api.deezer.com/search/artist?q=${artistName}&limit=1&index=0&output=jsonp&callback=?&app_id=${appId}&api_key=${apiKey}`;
  
  // Find artist
  $.getJSON(artistUrl, function(data) {
    const artist = data.data[0];
    if (artist) {
      const songsUrl = `${artist.tracklist}&limit=1&index=0&output=jsonp&callback=?&app_id=${appId}&api_key=${apiKey}`;
      
      // Find song
      $.getJSON(songsUrl, function(data) {
        const song = data.data[0];
        if (song) {
          const songUrl = song.preview;
          songUrls.push(songUrl);
          changeSong(songUrl);
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

// Change song URL and load new song
function changeSong(songUrl) {
  audioPlayer.src = songUrl;
}
