# Spotify Recommender
Website can be found on https://spotify-recommend.herokuapp.com.
Backend can be found on https://spotify-recommend-backend.herokuapp.com.
# Update 
The datebase is no longer up and thus the recommender will no longer work. However, the website can still be acessed locally.
## How to run application locally

- Once you pull the repository, cd into the ```server``` folder and run 

    - ```npm install``` to install necessary dependencies. The list of dependencies can be found in our package.json files.

    - ```npm start``` to start the server

    - Open http://localhost:8080 and try out the routes specfied in server.js. For example: http://localhost:8080/top_tracks returns the top 100 tracks in our system.

- Next, cd into the ```spotifyrec``` folder and run 

    ```npm install``` to install dependencies for the frontend. The list of dependencies can be found in our package.json files.

    ```npm start``` to start the client in browser on http://localhost:3000

## Application Pages
### HomePage.js
As soon as you load the page, you will see a collection of impressive statistics highlighting the vast amount of data we have available. Just below that, you can browse through a slideshow of reviews from users who have used our website before. Right below we have a handy table featuring the 100 most popular songs on the site. Simply click on the track name, artist, or album to be taken to the corresponding page.

### TracksPage.js
Upon visiting the page, the user is immediately treated to a visual representation of the track's audio features in the form of a radar chart. Upon their first click, the classic "All I Want for Christmas is You" is presented until a different track is selected. An interactive search allows the user to filter tracks based on a range of attributes, including the track's name, artist, popularity, and audio features. With a simple click on a button, the user is able to access the top 10 recommended tracks with ease.

### AlbumsPage.js
The AlbumsPage.js allows users to search for an album based on a variety of parameters as follows: album name and artist name. Once an album has been searched and selected by the user, a table containing all of the tracks in the selected album will be displayed. A button will also appear to allow the user to get recommendations of new albums based on the album they have selected. On top of all this, the page adds links to Spotify for all the albums so users can begin listening immediately.

### ArtistsPage.js
The ArtistsPage.js allows users to search for an artist based on an inputted artist name. Once an artist has been searched and selected by the user, a table containing all of the tracks in the selected artist will be displayed as well as a table containing all of the albums in the selected artist . A button will also appear to allow the user to get recommendations of new artists based on the artist they have selected. On top of all this, the page adds links to Spotify for all the artists so users can begin listening immediately.

### PlaylistPage.js
The PlaylistPage.js allows users to search for a playlist based on a variety of parameters as follows: Playlist name, minimum number of followers (default 0), and minimum number of tracks (default 0). In addition to this, users can search for playlists that contain at least one song from one artist or two artists. Once a user performs a search, they are returned a set of playlists below and they can click on the individual playlist row in order to go to the tracks contained in it.
