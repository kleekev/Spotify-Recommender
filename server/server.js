const express = require('express');
const mysql = require('mysql');
var cors = require('cors')

const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

// TRACK ROUTES
// Search for tracks
app.get('/search/tracks', routes.tracks_search)
// Retrieve audio features for track with given id
app.get('/audio_features/:id', routes.audio_features)
// Retrieve track recommendations for track with given id
app.get('/track_recommend/:id', routes.track_recommend)
// Retrieve the top 100 most popular 
app.get('/top_tracks', routes.top_track)


// ARTIST ROUTES
// search artists by id
app.get('/artists/:id', routes.artists)
// Retrieve tracks by artist with specified id
app.get('/artist_tracks/:id', routes.artist_tracks)
// Retrieve albums by artist with specified id
app.get('/artist_albums/:id', routes.artist_albums)
// Search artists by their names
app.get('/search/artists', routes.artist_search)
// recommend artists in mutual playlists
app.get('/artists_recommend/:id', routes.artists_recommend)

// ALBUM ROUTES
app.get('/albums/:id', routes.albums)
app.get('/album_tracks/:id', routes.album_tracks)
app.get('/search/albums', routes.album_search)
app.get('/album_recommend/:id', routes.album_recommend)

// PLAYLIST ROUTES
app.get('/playlist_tracks', routes.playlist_tracks)
app.get('/search/playlist', routes.playlist_search)
app.get('/search/playlist_artist', routes.artists_playlists)

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
