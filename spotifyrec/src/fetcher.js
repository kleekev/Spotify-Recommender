import config from './config.json'


// ********************************************
//           Track Page API Calls
// ********************************************
const getTrackSearch = async (track_name, artist, popularity_low, popularity_high, explicit, 
                            danceability_low, danceability_high, 
                            energy_low, energy_high,
                            pitch_low, pitch_high,
                            loudness_low, loudness_high,
                            speechiness_low, speechiness_high,
                            acousticness_low, acousticness_high,
                            instrumentalness_low, instrumentalness_high,
                            liveness_low, liveness_high,
                            valence_low, valence_high,
                            tempo_low, tempo_high,
                            time_signature_low, time_signature_high,
                            page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/tracks?` +
                `name=${track_name}` +
                `&artist=${artist}` +
                `&popularity_low=${popularity_low}` +
                `&popularity_high=${popularity_high}` +
                `&explicit=${explicit}` +
                `&danceability_low=${danceability_low}` +
                `&danceability_high=${danceability_high}` +
                `&energy_low=${energy_low}` +
                `&energy_high=${energy_high}` +
                `&pitch_low=${pitch_low}` +
                `&pitch_high=${pitch_high}` +
                `&loudness_low=${loudness_low}` +
                `&loudness_high=${loudness_high}` +
                `&speechiness_low=${speechiness_low}` +
                `&speechiness_high=${speechiness_high}` +
                `&acousticness_low=${acousticness_low}` +
                `&acoutsticness_high=${acousticness_high}` +
                `&instrumentalness_low=${instrumentalness_low}` +
                `&instrumentalness_high=${instrumentalness_high}` +
                `&liveness_low=${liveness_low}` +
                `&liveness_high=${liveness_high}` +
                `&valence_low=${valence_low}` +
                `&valence_high=${valence_high}` +
                `&tempo_low=${tempo_low}` +
                `&tempo_high=${tempo_high}` +
                `&time_signature_low=${time_signature_low}` +
                `&time_signature_high=${time_signature_high}` +
                `&page=${page}` +
                `&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getAudioFeatures = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/audio_features/${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getTopTracks = async() => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/top_tracks`, {
        method: 'GET',
    })
    return res.json()
}

const getTrackRecommendation  = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/track_recommend/${id}`, {
        method: 'GET',
    })
    return res.json()
}


// ********************************************
//           Artist Page API Calls
// ********************************************
const getArtist = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/artists/${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getArtistSearch = async (name, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/artists?name=${name}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getArtistTracks = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/artist_tracks/${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getArtistAlbums = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/artist_albums/${id}`, {
        method: 'GET',
    })
    return res.json()
}

const recommendArtists = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/artists_recommend/${id}`, {
        method: 'GET',
    })
    return res.json()
}


// ********************************************
//            Album Page API Calls
// ********************************************

const getAlbum = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/albums/${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getAlbumSearch = async (album, artist, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/albums?album=${album}&artist=${artist}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getAlbumTracks = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/album_tracks/${id}`, {
        method: 'GET',
    })
    return res.json()
}

const recommendAlbums = async (album_id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/album_recommend/${album_id}`, {
        method: 'GET',
    })
    return res.json()
}

// ********************************************
//           Playlist Page API Calls
// ********************************************
const getPlaylistTracks = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/playlist_tracks?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getPlaylistSearch = async (name, followers, total_tracks) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/playlist?name=${name}&followers=${followers}&total_track=${total_tracks}`, {
        method: 'GET',
    })
    return res.json()
}

const getArtistsPlaylists = async(artist1, artist2) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/playlist_artist?artist1=${artist1}&artist2=${artist2}`, {
        method: 'GET',
    })
    return res.json()
}

export {
    getTrackSearch,
    getAudioFeatures,
    getTrackRecommendation,
    getTopTracks,
    getArtist,
    getArtistAlbums,
    getArtistTracks,
    getArtistSearch,
    recommendArtists,
    getAlbum,
    getAlbumSearch,
    getAlbumTracks,
    recommendAlbums,
    getPlaylistSearch,
    getArtistsPlaylists,
    getPlaylistTracks,
}