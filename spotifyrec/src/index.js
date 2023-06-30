import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import TracksPage from './pages/TracksPage';
import ArtistsPage from './pages/ArtistsPage';
import AlbumsPage from './pages/AlbumsPage';
import PlaylistsPage from './pages/PlaylistsPage';

import 'antd/dist/antd.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

// setup routes for our different pages
ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact
			path="/"
			render={() => (
				<HomePage />
			)}/>
        <Route exact
			path="/tracks"
			render={() => (
				<TracksPage />
			)}/>
        <Route exact
			path="/artists"
			render={() => (
				<ArtistsPage />
			)}/>
		<Route exact
			path="/albums"
			render={() => (
				<AlbumsPage />
			)} />
		<Route exact
			path="/playlists"
			render={() => (
				<PlaylistsPage />
			)} />
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);

