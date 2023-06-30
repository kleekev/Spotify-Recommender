const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


// ********************************************
//               Track ROUTES
// ********************************************

// Search for a track based on artist, name, popularity, duration, explicitness and audio features
async function tracks_search(req, res) {
    const artist = req.query.artist ? req.query.artist : ''
    const track_name = req.query.name ? req.query.name : ''
    const popularity_low = req.query.popularity_low ? parseFloat(req.query.popularity_low) : 0.0
    const popularity_high = req.query.popularity_high ? parseFloat(req.query.popularity_high) : 100
    const explicit = req.query.explicit ? req.query.explicit : ''
    const danceability_low = req.query.danceability_low ? parseFloat(req.query.danceability_low) : 0
    const danceability_high = req.query.danceability_high? parseFloat(req.query.danceability_high) : 1
    const energy_low = req.query.energy_low ? parseFloat(req.query.energy_low) : 0
    const energy_high = req.query.energy_high? parseFloat(req.query.energy_high) : 1
    const pitch_low = req.query.pitch_low ? parseFloat(req.query.pitch_low) : 0
    const pitch_high = req.query.pitch_high? parseFloat(req.query.pitch_high) : 11
    const loudness_low = req.query.loudless_low ? parseFloat(req.query.loudness_low) : -60
    const loudness_high = req.query.loudness_high? parseFloat(req.query.loudness_high) : 5
    const speechiness_low = req.query.speechiness_low ? parseFloat(req.query.speechiness_low) : 0
    const speechiness_high = req.query.speechiness_high? parseFloat(req.query.speechiness_high) : 1
    const acousticness_low = req.query.acousticness_low ? parseFloat(req.query.acousticness_low) : 0
    const acousticness_high = req.query.acousticness_high? parseFloat(req.query.acousticness_high) : 1
    const instrumentalness_low = req.query.instrumentalness_low ? parseFloat(req.query.instrumentalness_low) : 0
    const instrumentalness_high = req.query.instrumentalness_high? parseFloat(req.query.instrumentalness_high) : 1
    const liveness_low = req.query.liveness_low ? parseFloat(req.query.liveness_low) : 0
    const liveness_high = req.query.liveness_high? parseFloat(req.query.liveness_high) : 1
    const valence_low = req.query.valence_low ? parseFloat(req.query.valence_low) : 0
    const valence_high = req.query.valence_high? parseFloat(req.query.valence_high) : 1
    const tempo_low = req.query.tempo_low ? parseFloat(req.query.tempo_low) : 0
    const tempo_high = req.query.tempo_high? parseFloat(req.query.tempo_high) : 250
    const time_sig_low = req.query.time_signature_low ? parseFloat(req.query.time_signature_low) : 0
    const time_sig_high = req.query.time_siganture_high? parseFloat(req.query.time_signature_high) : 5

    if (req.query.page && !isNaN(req.query.page)) {
        const page = parseInt(req.query.page) - 1
        const page_size = req.query.pagesize && !isNaN(req.query.pagesize) ? parseInt(req.query.pagesize) : 10
        connection.query(`
        SELECT track_id as TrackId, Track.name as Name, duration_ms as Duration, explicit as Explicit, artist_id, Artist.name as Artist, Track.popularity as Popularity
        FROM Track, Artist, Track_Artist
        WHERE Track.id = track_id AND
            Artist.id = artist_id AND
            Artist.name LIKE '%${artist}%' AND
            Track.name LIKE '%${track_name}%' AND
            Track.popularity BETWEEN ${popularity_low} AND ${popularity_high} AND
            Track.explicit LIKE '${explicit}%' AND
            Track.danceability BETWEEN ${danceability_low} AND ${danceability_high} AND
            Track.energy BETWEEN ${energy_low} AND ${energy_high} AND
            Track.pitch_key BETWEEN ${pitch_low} AND ${pitch_high} AND
            Track.loudness BETWEEN ${loudness_low} AND ${loudness_high} AND
            Track.speechiness BETWEEN ${speechiness_low} AND ${speechiness_high} AND
            Track.acousticness BETWEEN ${acousticness_low} AND ${acousticness_high} AND
            Track.instrumentalness BETWEEN ${instrumentalness_low} AND ${instrumentalness_high} AND
            Track.liveness BETWEEN ${liveness_low} AND ${liveness_high} AND
            Track.valence BETWEEN ${valence_low} AND ${valence_high} AND
            Track.tempo BETWEEN ${tempo_low} AND ${tempo_high} AND
            Track.time_signature BETWEEN ${time_sig_low} AND ${time_sig_high}
        LIMIT ${page_size} OFFSET ${page_size * page}
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results})
            }
        });
   
    } else {
        connection.query(`
        SELECT track_id as TrackId, Track.name as Name, duration_ms as Duration, explicit as Explicit, artist_id, Artist.name as Artist, Track.popularity as Popularity
        FROM Track, Artist, Track_Artist
        WHERE Track.id = track_id AND
            Artist.id = artist_id AND
            Artist.name LIKE '%${artist}%' AND
            Track.name LIKE '%${track_name}%' AND
            Track.popularity BETWEEN ${popularity_low} AND ${popularity_high} AND
            Track.explicit LIKE '${explicit}%' AND
            Track.danceability BETWEEN ${danceability_low} AND ${danceability_high} AND
            Track.energy BETWEEN ${energy_low} AND ${energy_high} AND
            Track.pitch_key BETWEEN ${pitch_low} AND ${pitch_high} AND
            Track.loudness BETWEEN ${loudness_low} AND ${loudness_high} AND
            Track.speechiness BETWEEN ${speechiness_low} AND ${speechiness_high} AND
            Track.acousticness BETWEEN ${acousticness_low} AND ${acousticness_high} AND
            Track.instrumentalness BETWEEN ${instrumentalness_low} AND ${instrumentalness_high} AND
            Track.liveness BETWEEN ${liveness_low} AND ${liveness_high} AND
            Track.valence BETWEEN ${valence_low} AND ${valence_high} AND
            Track.tempo BETWEEN ${tempo_low} AND ${tempo_high} AND
            Track.time_signature BETWEEN ${time_sig_low} AND ${time_sig_high}
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// Searches for the top 10 similar tracks
async function track_recommend(req, res) {
    const id = req.params.id ? req.params.id : ''
    connection.query(`
    WITH AF AS (
        SELECT Track.id AS input_id,
               danceability AS input_danceability,
               energy AS input_energy,
               pitch_key AS input_pitch,
               loudness AS input_loudness,
               speechiness AS input_speechiness,
               acousticness AS input_acousticness,
               instrumentalness AS input_instrumentalness,
               liveness AS input_liveness,
               valence AS input_valence,
               time_signature AS input_time,
               tempo AS input_tempo
        FROM Track
        WHERE Track.id = '${id}'
    ), MutualPlaylist AS (
        SELECT DISTINCT Track_Playlist.playlist_id
        FROM Track_Playlist, Track
        WHERE Track_Playlist.track_id = Track.id AND Track.id = '${id}'
        ORDER BY RAND()
        LIMIT 2000
    ), MostSimilarTracks AS (
        SELECT Track.id
        FROM MutualPlaylist, Track_Playlist, Track, AF
        WHERE input_id <> Track.id AND
              MutualPlaylist.playlist_id = Track_Playlist.playlist_id AND
              Track_Playlist.track_id = Track.id AND
              ABS(AF.input_danceability - Track.danceability) < 0.2 AND
              ABS(AF.input_energy - Track.energy) < 0.2 AND
              ABS(AF.input_pitch - Track.pitch_key) < 5 AND
              ABS(AF.input_loudness - Track.loudness) < 8 AND
              ABS(AF.input_speechiness - Track.speechiness) < 0.2 AND
              ABS(AF.input_acousticness - Track.acousticness) < 0.2 AND
              ABS(AF.input_instrumentalness - Track.instrumentalness) < 0.2 AND
              ABS(AF.input_liveness - Track.liveness) < 0.2 AND
              ABS(AF.input_valence - Track.valence) < 0.2 AND
              ABS(AF.input_tempo - Track.tempo) < 25 AND
              ABS(AF.input_time - Track.time_signature) < 3
        GROUP BY Track.id
        ORDER BY COUNT(*) DESC
        LIMIT 10
    )
    SELECT Track.id as TrackId,
           Track.name as Name,
           duration_ms as Duration,
           explicit as Explicit,
           artist_id,
           Artist.name as Artist,
           Track.popularity as Popularity
    FROM MostSimilarTracks MST, Track, Track_Artist, Artist
    WHERE MST.id = Track.id AND
          Track.id = Track_Artist.track_id AND
          Artist.id = Track_Artist.artist_id    
    `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// Finds all audio features of a track
async function audio_features(req, res) {
    const track_id = req.params.id ? req.params.id : ''
    connection.query(`
        SELECT Track.*, Artist.name AS Artist, Artist.id AS Artist_Id
        FROM Track, Track_Artist, Artist
        WHERE Track.id = Track_Artist.track_id
                AND Track_Artist.artist_id = Artist.id
                AND Track.id = '${track_id}'
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
}

// Find most popular tracks to display on the home page
async function top_track(req, res) {
    connection.query(`
    SELECT Track.name AS Name,
        Track.id AS TrackId,
        Track.duration_ms AS Duration,
        explicit AS Explicit,
        popularity AS Popularity,
        Artist.name AS Artist,
        Artist.id AS ArtistId,
        Album.id AS AlbumId,
        Album.name AS Album
    FROM Track, Artist, Track_Artist, Album
    WHERE Track.id = Track_Artist.track_id AND Artist.id = Track_Artist.artist_id AND Track.album_id = Album.id
    ORDER BY popularity DESC
    LIMIT 100
    `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
    });
}

// ********************************************
//               Artist ROUTES
// ********************************************

// find artist with given id
async function artists(req, res) {
    const artist_id = req.params.id ? req.params.id : ''
    connection.query(`
        SELECT id as Id, name as Name
        FROM Artist
        WHERE id = '${artist_id}'
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
}

// recommend artists for artist with given id
async function artists_recommend(req, res) {
    const artist_id = req.params.id ? req.params.id : ''
    connection.query(`
        WITH Artists_To_Playlists AS (
            SELECT Artist.id, Artist.name, Track_Playlist.playlist_id
            FROM Artist
                JOIN Track_Artist
                    ON Artist.id = Track_Artist.artist_id
                JOIN Track
                    ON Track_Artist.track_id = Track.id
                JOIN Track_Playlist
                    ON Track.id = Track_Playlist.track_id
        ),
        Artist_Playlists AS (
            SELECT DISTINCT playlist_id
            FROM Artists_To_Playlists A2P
            WHERE A2P.id = '${artist_id}'
            ORDER BY RAND()
            LIMIT 1000
        ),
        Similar_Artists AS (
            SELECT A2P.*
            FROM Artists_To_Playlists A2P
            WHERE A2P.id != '${artist_id}' AND
                EXISTS (SELECT * FROM Artist_Playlists AP WHERE A2P.playlist_id = AP.playlist_id)
            GROUP BY id, name
            ORDER BY COUNT(playlist_id) DESC
            LIMIT 10
        )
        SELECT SA.id as Id, SA.name as Name, AVG(popularity) AS Popularity
        FROM Similar_Artists SA, Track_Artist, Track
        WHERE SA.id = Track_Artist.artist_id AND
            Track.id = Track_Artist.track_id
        GROUP BY SA.id, SA.name
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
}

// search for artists by their name
async function artist_search(req, res) {
    const artist_name = req.query.name ? req.query.name : ''
    if (req.query.page && !isNaN(req.query.page)) {
        const page = parseInt(req.query.page) - 1
        const page_size = req.query.pagesize && !isNaN(req.query.pagesize) ? parseInt(req.query.pagesize) : 10
        connection.query(`
        SELECT artist_id AS Id,
                A.name as Name,
                AVG(popularity) AS Popularity
        FROM Artist A, Track_Artist TA, Track T
        WHERE
            A.id = TA.artist_id AND
            T.id = TA.track_id AND
            A.name LIKE '%${artist_name}%'
        GROUP BY artist_id, A.name
        LIMIT ${page_size} OFFSET ${page_size * page}
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results})
            }
        });
   
    } else {
        connection.query(`
        SELECT artist_id AS Id,
                A.name as Name,
                AVG(popularity) AS Popularity
        FROM Artist A, Track_Artist TA, Track T
        WHERE
            A.id = TA.artist_id AND
            T.id = TA.track_id AND
            A.name LIKE '%${artist_name}%'
        GROUP BY artist_id, A.name
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// search for an artists tracks
async function artist_tracks(req, res) {
    const artist_id = req.params.id ? req.params.id : ''
    if (req.query.page && !isNaN(req.query.page)) {
        const page = parseInt(req.query.page) - 1
        const page_size = req.query.pagesize && !isNaN(req.query.pagesize) ? parseInt(req.query.pagesize) : 10
        connection.query(`
        SELECT
                track_id AS TrackID,
                Track.name AS TrackName,
                popularity as Popularity,
                duration_ms AS Duration
        FROM Track, Track_Artist, Artist
        WHERE Track.id = track_id AND
            Artist.id = artist_id AND
            Artist.id = '${artist_id}'
        ORDER BY popularity
        LIMIT ${page_size} OFFSET ${page_size * page}
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results})
            }
        });
   
    } else {
        connection.query(`
        SELECT
                track_id AS TrackID,
                Track.name AS TrackName,
                popularity as Popularity,
                duration_ms AS Duration
        FROM Track, Track_Artist, Artist
        WHERE Track.id = track_id AND
            Artist.id = artist_id AND
            Artist.id = '${artist_id}'
        ORDER BY popularity
        LIMIT 1000
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}


// search for an artist's albums with their average popularity
async function artist_albums(req, res) {
    const artist_id = req.params.id ? req.params.id : ''
    if (req.query.page && !isNaN(req.query.page)) {
        const page = parseInt(req.query.page) - 1
        const page_size = req.query.pagesize && !isNaN(req.query.pagesize) ? parseInt(req.query.pagesize) : 10
        connection.query(`
        WITH Curr_Artist_Albums AS(
            SELECT Album.id, Album.name
            FROM Album, Artist_Albums
            WHERE Album.id = album_id AND
                  artist_id = '${artist_id}'
        )
        SELECT Curr_Artist_Albums.id AS AlbumID,
               Curr_Artist_Albums.name AS AlbumName,
               AVG(Track.popularity) AS Popularity,
               SUM(duration_ms) AS Duration
        FROM Curr_Artist_Albums, Track
        WHERE Track.album_id = Curr_Artist_Albums.id
        GROUP BY Curr_Artist_Albums.id, Curr_Artist_Albums.name
        LIMIT ${page_size} OFFSET ${page_size * page}
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results})
            }
        });
   
    } else {
        connection.query(`
        WITH Curr_Artist_Albums AS(
            SELECT Album.id, Album.name
            FROM Album, Artist_Albums
            WHERE Album.id = album_id AND
                  artist_id = '${artist_id}'
        )
        SELECT Curr_Artist_Albums.id AS AlbumID,
               Curr_Artist_Albums.name AS AlbumName,
               AVG(Track.popularity) AS Popularity,
               SUM(duration_ms) AS Duration
        FROM Curr_Artist_Albums, Track
        WHERE Track.album_id = Curr_Artist_Albums.id
        GROUP BY Curr_Artist_Albums.id, Curr_Artist_Albums.name
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// ********************************************
//               Albums ROUTES
// ********************************************

// retrieve album with given id
async function albums(req, res) {
    const album_id = req.params.id ? req.params.id : ''
    connection.query(`
        SELECT id as Id, name as Name
        FROM Album
        WHERE id = '${album_id}'
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
}

// retrieve tracks in the specified album
async function album_tracks(req, res) {
    const album_id = req.params.id ? req.params.id : ''

    if (req.query.page && !isNaN(req.query.page)) {
        const page = parseInt(req.query.page) - 1
        const page_size = req.query.pagesize && !isNaN(req.query.pagesize) ? parseInt(req.query.pagesize) : 10
        connection.query(`
        SELECT album_id AS AlbumId, Track.id AS TrackID, Track.name AS TrackName, Track.duration_ms AS Duration, Track.explicit AS Explicit, Track.popularity AS Popularity
        FROM Track
        WHERE album_id = '${album_id}'
        LIMIT ${page_size} OFFSET ${page_size * page}
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results})
            }
        });

    } else {
        connection.query(`
        SELECT album_id AS AlbumId, Track.id AS TrackID, Track.name AS TrackName, Track.duration_ms AS Duration, Track.explicit AS Explicit, Track.popularity AS Popularity
        FROM Track
        WHERE album_id = '${album_id}'
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// search for albums with the album name and artist name
async function album_search(req, res) {
    const album = req.query.album ? req.query.album : ''
    const artist = req.query.artist ? req.query.artist : ''

    if (req.query.page && !isNaN(req.query.page)) {
        const page = parseInt(req.query.page) - 1
        const page_size = req.query.pagesize && !isNaN(req.query.pagesize) ? parseInt(req.query.pagesize) : 10
        connection.query(`
        SELECT alb.id AS AlbumID, art.id AS ArtistID, alb.name AS AlbumName, art.name AS ArtistName, AVG(t.popularity) AS AlbumPopularity
        FROM Album alb, Artist_Albums artalb, Artist art, Track t
        WHERE alb.id = artalb.album_id AND
            art.id = artalb.artist_id AND
            t.album_id = alb.id AND
            alb.name LIKE '%${album}%' AND
            art.name LIKE '%${artist}%'
        GROUP BY alb.id, art.id, alb.name, art.name
        LIMIT ${page_size} OFFSET ${page_size * page}
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results})
            }
        });

    } else {
        connection.query(`
        SELECT alb.id AS AlbumID, art.id AS ArtistID, alb.name AS AlbumName, art.name AS ArtistName, AVG(t.popularity) AS AlbumPopularity
        FROM Album alb, Artist_Albums artalb, Artist art, Track t
        WHERE alb.id = artalb.album_id AND
            art.id = artalb.artist_id AND
            t.album_id = alb.id AND
            alb.name LIKE '%${album}%' AND
            art.name LIKE '%${artist}%'
        GROUP BY alb.id, art.id, alb.name, art.name
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// recommend albums based on the specified album id
async function album_recommend(req, res) {
    const album_id = req.params.id ? req.params.id : ''
    connection.query(`
    WITH Albums_To_Playlists AS (
        SELECT Album.id, Album.name, Track_Playlist.playlist_id, Track.popularity
        FROM Album
            JOIN Track ON Album.id = Track.album_id
            JOIN Track_Playlist ON Track.id = Track_Playlist.track_id
    ),
    Album_Playlists AS (
        SELECT playlist_id
        FROM Albums_To_Playlists A2P
        WHERE A2P.id = '${album_id}'
        ORDER BY RAND()
        LIMIT 1000
    ),
    Top_Mutual_Albums AS (
        SELECT A2P.id, A2P.name, AVG(A2P.popularity) AS AlbumPopularity
        FROM Albums_To_Playlists A2P
            JOIN Album_Playlists AP ON A2P.playlist_id = AP.playlist_id
        WHERE A2P.id <> '${album_id}'
        GROUP BY id, name
        ORDER BY COUNT(DISTINCT A2P.playlist_id) DESC
        LIMIT 10
    )
    SELECT DISTINCT TMA.id AS AlbumID,
        TMA.name AS AlbumName,
        A.id AS ArtistId,
        A.name AS ArtistName,
        TMA.AlbumPopularity AS AlbumPopularity
    FROM Top_Mutual_Albums TMA
    JOIN Artist_Albums AA ON TMA.id = AA.album_id
    JOIN Artist A ON A.id = AA.artist_id;
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });

}


// ********************************************
//               Playlist ROUTES
// ********************************************

// Retrieve tracks in the playlist with specified playlist id
async function playlist_tracks(req, res) {
    const playlist_id = req.query.id ? req.query.id : -1
    
    if (req.query.page && !isNaN(req.query.page)) {
        const page = parseInt(req.query.page) - 1
        const page_size = req.query.pagesize && !isNaN(req.query.pagesize) ? parseInt(req.query.pagesize) : 10
        connection.query(`
        SELECT Track_Playlist.track_id as TrackID, Track.name as TrackName, Track.duration_ms as Duration, Track.explcit AS Explicit, Track.popularity AS Popularity
        FROM Track_Playlist JOIN Track ON Track_Playlist.track_id = Track.id
        WHERE Track_Playlist.playlist_id = ${playlist_id}
        LIMIT ${page_size} OFFSET ${page_size * page}
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });

    } else {
        connection.query(`
        SELECT Track_Playlist.track_id as TrackID, Track.name as TrackName, Track.duration_ms as Duration, Track.explicit AS Explicit, Track.popularity AS Popularity
        FROM Track_Playlist JOIN Track ON Track_Playlist.track_id = Track.id
        WHERE Track_Playlist.playlist_id = ${playlist_id}
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}


// retrieve playlists with the specified name, followers, and total_track
async function playlist_search(req, res) {
    const name = req.query.name ? req.query.name : ""
    const followers = req.query.followers ? req.query.followers : 0
    const total_tracks = req.query.total_tracks ? req.query.total_tracks : 0
    if (req.query.page && !isNaN(req.query.page)) {
        const page = parseInt(req.query.page) - 1
        const page_size = req.query.pagesize && !isNaN(req.query.pagesize) ? parseInt(req.query.pagesize) : 10
        connection.query(`
        SELECT name, id, followers, total_tracks
        FROM Playlist
        WHERE name LIKE '%${name}%' AND 
            followers >= ${followers} AND 
            total_tracks >= ${total_tracks}
        ORDER BY followers
        LIMIT ${page_size} OFFSET ${page_size * page}
        `, function (error, results, fields) {
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });

        } else {
        connection.query(`
        SELECT name, id, followers, total_tracks
        FROM Playlist
        WHERE name LIKE '%${name}%' AND 
            followers >= ${followers} AND 
            total_tracks >= ${total_tracks}
        ORDER BY followers
        `, function (error, results, fields) {
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
        }
}

// return an array of playlists that contains at least one song from artist 1 and artist 2
async function artists_playlists(req, res) {
    const artist1 = req.query.artist1 ? req.query.artist1 : ''
    const artist2 = req.query.artist2 ? req.query.artist2 : ''
    connection.query(`
    WITH Artist_1_Playlist AS (
        SELECT Playlist.id, Playlist.name, Playlist.followers, Playlist.total_tracks
        FROM Track_Playlist, Track_Artist, Artist, Playlist
        WHERE Track_Playlist.track_id = Track_Artist.track_id AND
                Track_Artist.artist_id = Artist.id AND
                Track_Playlist.playlist_id = Playlist.id AND
                Artist.name LIKE '%${artist1}%'
    ),
    Artist_2_Playlist AS (
        SELECT Playlist.id, Playlist.name, Playlist.followers, Playlist.total_tracks
        FROM Track_Playlist, Track_Artist, Artist, Playlist
        WHERE Track_Playlist.track_id = Track_Artist.track_id AND
                Track_Artist.artist_id = Artist.id AND
                Track_Playlist.playlist_id = Playlist.id AND
                Artist.name LIKE '%${artist2}%'
    )
    SELECT DISTINCT Artist_1_Playlist.id AS id, Artist_1_Playlist.name AS name, Artist_1_Playlist.followers AS followers, Artist_1_Playlist.total_tracks AS total_tracks
    FROM Artist_1_Playlist, Artist_2_Playlist
    WHERE Artist_1_Playlist.id = Artist_2_Playlist.id
    LIMIT 1000
    `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
    
}


module.exports = {
    tracks_search, audio_features, playlist_search, artists, artists_playlists, artists_recommend, 
    album_recommend, artist_tracks, artist_albums, album_search, album_tracks, artist_search, 
    track_recommend, playlist_tracks, top_track, albums
}