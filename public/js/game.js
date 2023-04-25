document.addEventListener("DOMContentLoaded", function() {
  const commonArtists = localStorage.getItem('commonArtists').replace(/[\[\]"]/g, '').split(',');
  console.log(commonArtists);
  var playButton = document.getElementById('play-button');
  var pauseButton = document.getElementById('pause-button');
  let round = 1;
  const next_btn = document.getElementById('next-button');
  
  // hide default audio controls
  var audio = document.getElementById('audio-player');
  audio.controls = false;
  
  // toggle play/pause button display
  playButton.addEventListener('click', function() {
    audio.play();
    playButton.style.display = 'none';
    pauseButton.style.display = 'block';
  });
  pauseButton.addEventListener('click', function() {
    audio.pause();
    pauseButton.style.display = 'none';
    playButton.style.display = 'block';
  });
  
  // bind play/pause to spacebar
  window.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
      event.preventDefault();
      if (audio.paused) {
        audio.play();
        playButton.style.display = 'none';
        pauseButton.style.display = 'block';
      } else {
        audio.pause();
        pauseButton.style.display = 'none';
        playButton.style.display = 'block';
      }
    }
  });
  launch(commonArtists[0]);
  next_btn.addEventListener('click', function() {
    pauseButton.style.display = 'none';
    playButton.style.display = 'block';
    if(commonArtists[round] !== '') {
      launch(commonArtists[round]);
      round++;
    } else {
      alert('End of the game');
    }
  });
});

function launch(artistName) {
    let songs_url = "";
    let song_url = "";
    var appId = '599484'; // Replace with your app ID
    var apiKey = 'd2e83b6af668d8f382ba6fcc10050921'; // Replace with your API key
    var artistUrl = 'https://api.deezer.com/search/artist?q=' + artistName + '&limit=1&index=0&output=jsonp&callback=?&app_id=' + appId + '&api_key=' + apiKey;
    
    // find artist
    $.getJSON(artistUrl, function(data) {
      var artist = data.data[0];
      if (artist) {
        console.log(artist);
        songs_url = artist.tracklist + '&limit=1&index=0&output=jsonp&callback=?&app_id=' + appId + '&api_key=' + apiKey;
        console.log(songs_url);
        
        // find song
        $.getJSON(songs_url, function(data) {
          var song = data.data[0];
          if (song) {
            song_url = song.preview;
            console.log(song_url);
            
            // set audio src
            var audio = document.getElementById('audio-player');
            audio.src = song_url;
          } else {
            console.log('No song found');
            // handle error
          }
        });
      } else {
        console.log('No artist found');
        // handle error
      }
    });
    }
