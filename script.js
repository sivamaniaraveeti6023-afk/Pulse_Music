const audio = document.getElementById('audioPlayer');
const playlistEl = document.getElementById('playlist');
const songLibraryEl = document.getElementById('songLibrary');
const albumArt = document.getElementById('albumArt');
const artFallback = document.getElementById('artFallback');
const songTitleEl = document.getElementById('songTitle');
const songArtistEl = document.getElementById('songArtist');
const songAlbumEl = document.getElementById('songAlbum');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
const volumeIcon = document.getElementById('volumeIcon');
const playPauseButton = document.getElementById('playPauseButton');
const playPauseIcon = document.getElementById('playPauseIcon');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const shuffleButton = document.getElementById('shuffleButton');
const repeatButton = document.getElementById('repeatButton');
const autoplayButton = document.getElementById('autoplayButton');
const muteButton = document.getElementById('muteButton');
const statusMessage = document.getElementById('statusMessage');
const playlistCount = document.getElementById('playlistCount');
const playlistSelect = document.getElementById('playlistSelect');
const playlistNameInput = document.getElementById('playlistNameInput');
const createPlaylistBtn = document.getElementById('createPlaylistBtn');
const addCurrentSongBtn = document.getElementById('addCurrentSongBtn');
const activePlaylistName = document.getElementById('activePlaylistName');

const librarySongs = [
  {
    id: 1,
    title: 'Nuvvu Naa Pranam',
    artist: 'Armaan & Jahnavi',
    album: 'Suryodaya',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Maa Bhoomi',
    artist: 'Karthik',
    album: 'Namaari',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Siri Siri Muvva',
    artist: 'Sahithi',
    album: 'Monsoon Echoes',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 4,
    title: 'Rangula Ratnam',
    artist: 'Harshita',
    album: 'Rainbow Road',
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: 5,
    title: 'Oohale Oohale',
    artist: 'Rohit',
    album: 'Midnight Lights',
    cover: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=800&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
  {
    id: 6,
    title: 'Aakasha Megham',
    artist: 'Vishal',
    album: 'Sky Notes',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  },
  {
    id: 7,
    title: 'Velugu Vela',
    artist: 'Anusha',
    album: 'Sunset Avenue',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  },
];

const playlists = [
  { id: 1, name: 'My Favorites', songs: [1, 2, 3] },
  { id: 2, name: 'Night Drive', songs: [4, 5] },
];

const state = {
  activePlaylistId: 1,
  activeTrackIndex: 0,
  isPlaying: false,
  shuffle: false,
  autoplay: true,
  repeatMode: 'off',
  volume: 0.7,
  isMuted: false,
};

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function getCurrentPlaylist() {
  return playlists.find((playlist) => playlist.id === state.activePlaylistId) || playlists[0];
}

function getPlaylistSongs() {
  const playlist = getCurrentPlaylist();
  return (playlist.songs || [])
    .map((songId) => librarySongs.find((song) => song.id === songId))
    .filter(Boolean);
}

function getFallbackText(songTitle) {
  return songTitle
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle('error', isError);
}

function updatePlayButton() {
  playPauseIcon.innerHTML = state.isPlaying
    ? '<path d="M7 5h3v14H7zm7 0h3v14h-3z"/>'
    : '<path d="M8 5v14l11-7z"/>';
  document.body.classList.toggle('playing', state.isPlaying);
}

function updateVolumeUI() {
  const muted = state.isMuted || state.volume === 0;
  volumeBar.value = state.volume;
  volumeIcon.innerHTML = muted
    ? '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.05-.2.05-.41.05-.63Zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.7 8.7 0 0 0 21 12c0-4.28-2.99-7.86-7-8.8v2.06c2.89.86 5 3.54 5 6.74Zm-7-6.77L7.5 9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4.5l4.88 4.55A1 1 0 0 0 14 19.77V4.23a1 1 0 0 0-1.62-.78ZM9.5 9.63 12 7.1v9.8L9.5 14.37 7.5 12 9.5 9.63Z"/>'
    : '<path d="M14 3.23v17.54a1 1 0 0 1-1.62.78L7.5 17H3a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h4.5l4.88-4.55A1 1 0 0 0 14 3.23Zm2.5 6.27 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5-1.5-1.5-1.5 1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5-1.5Zm3.5 1.5h2v2h-2v-2Z"/>';
}

function updateRepeatButton() {
  const map = { off: 'Repeat off', track: 'Repeat track', list: 'Repeat list' };
  repeatButton.classList.toggle('active', state.repeatMode !== 'off');
  repeatButton.title = map[state.repeatMode];
}

function updateAutoplayButton() {
  autoplayButton.classList.toggle('active', state.autoplay);
  autoplayButton.title = state.autoplay ? 'Autoplay on' : 'Autoplay off';
}

function updateShuffleButton() {
  shuffleButton.classList.toggle('active', state.shuffle);
  shuffleButton.title = state.shuffle ? 'Shuffle on' : 'Shuffle off';
}

function renderPlaylistSelector() {
  playlistSelect.innerHTML = playlists
    .map((playlist) => `<option value="${playlist.id}">${playlist.name}</option>`)
    .join('');
  playlistSelect.value = String(state.activePlaylistId);
  activePlaylistName.textContent = getCurrentPlaylist().name;
}

function renderCurrentPlaylist() {
  const songs = getPlaylistSongs();
  playlistEl.innerHTML = '';

  if (!songs.length) {
    playlistEl.innerHTML = '<li class="empty-state">No songs yet. Add a few from the library.</li>';
    playlistCount.textContent = '0';
    return;
  }

  playlistCount.textContent = String(songs.length);

  songs.forEach((song, index) => {
    const item = document.createElement('li');
    item.className = 'playlist-item';
    if (state.activeTrackIndex === index) item.classList.add('active');

    item.innerHTML = `
      <img class="playlist-art" src="${song.cover}" alt="${song.title} artwork" />
      <div class="playlist-meta">
        <h4>${song.title}</h4>
        <p>${song.artist}</p>
      </div>
      <span class="tag">Play</span>
    `;

    item.addEventListener('click', () => {
      state.activeTrackIndex = index;
      loadSelectedSong(index, true);
    });

    const playlistArt = item.querySelector('.playlist-art');
    if (playlistArt) {
      playlistArt.addEventListener('error', (event) => {
        event.target.style.display = 'none';
        event.target.parentElement.insertAdjacentHTML(
          'beforeend',
          `<div class="playlist-art" style="display:grid;place-items:center;background:linear-gradient(135deg,#1d2d40,#452d5a);color:#fff;font-weight:700;font-size:0.72rem;">${getFallbackText(song.title)}</div>`
        );
      });
    }

    playlistEl.appendChild(item);
  });
}

function renderSongLibrary() {
  songLibraryEl.innerHTML = librarySongs
    .map(
      (song) => `
        <li class="song-item">
          <img class="song-art" src="${song.cover}" alt="${song.title} artwork" />
          <div class="song-meta">
            <h4>${song.title}</h4>
            <p>${song.artist}</p>
          </div>
          <button class="add-btn" data-song-id="${song.id}">Add</button>
        </li>
      `
    )
    .join('');

  songLibraryEl.querySelectorAll('.add-btn').forEach((button) => {
    button.addEventListener('click', () => {
      addSongToActivePlaylist(Number(button.dataset.songId));
    });

    const img = button.parentElement.querySelector('.song-art');
    if (img) {
      img.addEventListener('error', (event) => {
        event.target.style.display = 'none';
        const songTitle = librarySongs.find((song) => song.id === Number(button.dataset.songId))?.title || 'Song';
        event.target.parentElement.insertAdjacentHTML(
          'beforeend',
          `<div class="song-art" style="display:grid;place-items:center;background:linear-gradient(135deg,#1d2d40,#452d5a);color:#fff;font-weight:700;font-size:0.72rem;">${getFallbackText(songTitle)}</div>`
        );
      });
    }
  });
}

function updateAlbumArt(song) {
  albumArt.src = song.cover;
  albumArt.style.display = 'block';
  artFallback.classList.remove('visible');
  artFallback.textContent = getFallbackText(song.title);

  albumArt.onerror = () => {
    albumArt.style.display = 'none';
    artFallback.classList.add('visible');
  };

  albumArt.onload = () => {
    albumArt.style.display = 'block';
    artFallback.classList.remove('visible');
  };
}

function loadSelectedSong(index, autoPlay = false) {
  const queue = getPlaylistSongs();
  const song = queue[index];
  if (!song) return;

  state.activeTrackIndex = index;
  songTitleEl.textContent = song.title;
  songArtistEl.textContent = song.artist;
  songAlbumEl.textContent = song.album;
  audio.src = song.src;
  audio.load();
  updateAlbumArt(song);
  renderCurrentPlaylist();
  showStatus('Loading track...');

  if (autoPlay) {
    audio.play().then(() => {
      state.isPlaying = true;
      updatePlayButton();
      showStatus(`Now playing: ${song.title}`);
    }).catch(() => {
      state.isPlaying = false;
      updatePlayButton();
      showStatus('Audio blocked until user interaction. Click play to begin.', true);
    });
  }
}

function togglePlayPause() {
  const queue = getPlaylistSongs();
  if (!queue.length) {
    showStatus('Your playlist is empty. Add songs first.', true);
    return;
  }

  if (state.isPlaying) {
    audio.pause();
    state.isPlaying = false;
    updatePlayButton();
    showStatus('Paused');
    return;
  }

  if (!audio.src) {
    loadSelectedSong(state.activeTrackIndex, true);
    return;
  }

  audio.play().then(() => {
    state.isPlaying = true;
    updatePlayButton();
    showStatus(`Now playing: ${queue[state.activeTrackIndex].title}`);
  }).catch(() => {
    showStatus('Audio could not start. Please try again.', true);
  });
}

function playPreviousSong() {
  const queue = getPlaylistSongs();
  if (!queue.length) return;

  if (state.shuffle) {
    let newIndex = state.activeTrackIndex;
    while (newIndex === state.activeTrackIndex) {
      newIndex = Math.floor(Math.random() * queue.length);
    }
    loadSelectedSong(newIndex, true);
    return;
  }

  const prevIndex = (state.activeTrackIndex - 1 + queue.length) % queue.length;
  loadSelectedSong(prevIndex, true);
}

function playNextSong() {
  const queue = getPlaylistSongs();
  if (!queue.length) return;

  if (state.repeatMode === 'track') {
    audio.currentTime = 0;
    audio.play();
    return;
  }

  let nextIndex = state.activeTrackIndex;
  if (state.shuffle) {
    while (nextIndex === state.activeTrackIndex) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }
  } else {
    nextIndex = (state.activeTrackIndex + 1) % queue.length;
  }

  loadSelectedSong(nextIndex, true);
}

function handleTrackEnd() {
  const queue = getPlaylistSongs();
  if (!queue.length) return;

  if (state.repeatMode === 'track') {
    audio.currentTime = 0;
    audio.play();
    return;
  }

  if (state.repeatMode === 'list') {
    playNextSong();
    return;
  }

  if (state.autoplay) {
    playNextSong();
  } else {
    state.isPlaying = false;
    updatePlayButton();
    showStatus('Playback ended. Autoplay is off.', true);
  }
}

function updateProgressBar() {
  if (!audio.duration || Number.isNaN(audio.duration)) return;

  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  totalTimeEl.textContent = formatTime(audio.duration);
}

function seekAudio(event) {
  const value = Number(event.target.value);
  if (!audio.duration) return;
  audio.currentTime = (value / 100) * audio.duration;
}

function setVolume(value) {
  const safeValue = Number(value);
  audio.volume = safeValue;
  state.volume = safeValue;
  state.isMuted = safeValue === 0;
  updateVolumeUI();
}

function toggleMute() {
  if (state.isMuted || audio.volume === 0) {
    state.isMuted = false;
    audio.volume = state.volume || 0.7;
    state.volume = audio.volume;
  } else {
    state.isMuted = true;
    state.volume = audio.volume;
    audio.volume = 0;
  }
  updateVolumeUI();
}

function cycleRepeatMode() {
  const modes = ['off', 'track', 'list'];
  const currentIndex = modes.indexOf(state.repeatMode);
  state.repeatMode = modes[(currentIndex + 1) % modes.length];
  updateRepeatButton();
  showStatus(`Repeat: ${state.repeatMode}`);
}

function toggleAutoplay() {
  state.autoplay = !state.autoplay;
  updateAutoplayButton();
  showStatus(`Autoplay ${state.autoplay ? 'on' : 'off'}`);
}

function toggleShuffle() {
  state.shuffle = !state.shuffle;
  updateShuffleButton();
  showStatus(`Shuffle ${state.shuffle ? 'on' : 'off'}`);
}

function addSongToActivePlaylist(songId) {
  const current = getCurrentPlaylist();
  if (!current.songs.includes(songId)) {
    current.songs.push(songId);
    showStatus(`Added to ${current.name}`);
  } else {
    showStatus('This song is already in the playlist.');
  }

  renderCurrentPlaylist();
  renderPlaylistSelector();
}

function createPlaylist() {
  const name = playlistNameInput.value.trim();
  if (!name) {
    showStatus('Please enter a playlist name first.', true);
    return;
  }

  const newPlaylist = {
    id: Date.now(),
    name,
    songs: [],
  };

  playlists.push(newPlaylist);
  state.activePlaylistId = newPlaylist.id;
  playlistNameInput.value = '';
  renderPlaylistSelector();
  renderCurrentPlaylist();
  showStatus(`Created playlist: ${newPlaylist.name}`);
}

function bindEvents() {
  playPauseButton.addEventListener('click', togglePlayPause);
  prevButton.addEventListener('click', playPreviousSong);
  nextButton.addEventListener('click', playNextSong);
  shuffleButton.addEventListener('click', toggleShuffle);
  repeatButton.addEventListener('click', cycleRepeatMode);
  autoplayButton.addEventListener('click', toggleAutoplay);
  muteButton.addEventListener('click', toggleMute);
  progressBar.addEventListener('input', seekAudio);
  volumeBar.addEventListener('input', (event) => setVolume(event.target.value));
  createPlaylistBtn.addEventListener('click', createPlaylist);
  playlistNameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') createPlaylist();
  });

  playlistSelect.addEventListener('change', (event) => {
    state.activePlaylistId = Number(event.target.value);
    state.activeTrackIndex = 0;
    const firstSong = getPlaylistSongs()[0];
    if (firstSong) {
      loadSelectedSong(0, false);
    } else {
      songTitleEl.textContent = 'No song selected';
      songArtistEl.textContent = 'Choose a track';
      songAlbumEl.textContent = 'Playlist is empty';
      artFallback.classList.add('visible');
      albumArt.style.display = 'none';
    }
    renderCurrentPlaylist();
    renderPlaylistSelector();
  });

  addCurrentSongBtn.addEventListener('click', () => {
    const queue = getPlaylistSongs();
    if (!queue.length) {
      showStatus('Select a song to add first.', true);
      return;
    }
    const currentSong = queue[state.activeTrackIndex];
    if (currentSong) {
      addSongToActivePlaylist(currentSong.id);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
    updateProgressBar();
  });

  audio.addEventListener('timeupdate', updateProgressBar);
  audio.addEventListener('play', () => {
    state.isPlaying = true;
    updatePlayButton();
  });

  audio.addEventListener('pause', () => {
    state.isPlaying = false;
    updatePlayButton();
  });

  audio.addEventListener('ended', handleTrackEnd);

  audio.addEventListener('error', () => {
    state.isPlaying = false;
    updatePlayButton();
    showStatus('Unable to load this audio file. Please check the file source.', true);
  });
}

function initializePlayer() {
  updatePlayButton();
  updateRepeatButton();
  updateAutoplayButton();
  updateShuffleButton();
  setVolume(state.volume);
  updateVolumeUI();
  renderPlaylistSelector();
  renderSongLibrary();
  renderCurrentPlaylist();
  bindEvents();

  const firstSong = getPlaylistSongs()[0];
  if (firstSong) {
    loadSelectedSong(0, false);
  }
}

initializePlayer();
