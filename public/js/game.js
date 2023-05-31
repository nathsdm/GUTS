// Define global variables
let commonArtists = [];
let songUrls = [];
let Artists = [];
let Songs = [];
let mode = 'undefined';
let round = 0;

// Get DOM elements
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const nextButton = document.getElementById('next-button');
const audioPlayer = document.getElementById('audio-player');
const display = document.getElementById('display-button');

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

// Event listener for display button
display.addEventListener('click', function() {
  alert(Artists[round] + ' - ' + Songs[round]);
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
  if(mode === 'custom') {
    if (commonArtists.length > round+1) {
      launchArtist(commonArtists[round+1]);
      round++;
    } else {
      alert('End of the game');
    }
  } else if(mode === 'premade') {
    if (songUrls[round+1] !== '') {
      changeSong(songUrls[round+1]);
      round++;
    } else {
      alert('End of the game');
    }
  } else if(mode === 'undefined') {
    alert('No songs to play');
  }
});

// Check if song URLs are present in local storage
if (localStorage.getItem('song_urls') === null) {
  if(localStorage.getItem('commonArtists') === null) {
    alert('No songs to play');
  } else {
  // Get common artists and replace unwanted characters
  commonArtists = localStorage.getItem('commonArtists').replace(/[\[\]"]/g, '').split(',');
  mode = 'custom';
  // Launch first artist
  launchArtist(commonArtists[round]);
  }
} else {
  // Parse song URLs from local storage
  songUrls = JSON.parse(localStorage.getItem('song_urls'));
  Artists = JSON.parse(localStorage.getItem('artist_names'));
  Songs = JSON.parse(localStorage.getItem('song_names'));
  mode = 'premade';
  // Change song to the first one in the list
  changeSong(songUrls[round]);
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
          const songName = song.title;
          const artistName = song.artist.name;
          Songs.push(songName);
          Artists.push(artistName);
          localStorage.setItem('artist_names', JSON.stringify(Artists));
          localStorage.setItem('song_names', JSON.stringify(Songs));
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
