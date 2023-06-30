import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";


import {
    Table,
    Pagination,
    Row,
    Col,
    Divider,

} from 'antd'


import MenuBar from '../components/MenuBar';
import { getPlaylistSearch, getArtistsPlaylists, getPlaylistTracks } from '../fetcher'

const { Column, ColumnGroup } = Table;


// function for converting millseconds to minutes and seconds
function millisToMS(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// specify columns for playlist table
const playlistsColumns = [
    {
        title: 'Playlist Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: 'Followers',
        dataIndex: 'followers',
        key: 'followers',
        sorter: (a, b) => a.followers - b.followers
    }, 
    {
        title: 'Total Tracks',
        dataIndex: 'total_tracks',
        key: 'total_tracks',
        sorter: (a, b) => a.total_tracks - b.total_tracks
    }
];

// specify columns for track table
const trackColumns = [
    {
        title: 'Track Name',
        dataIndex: 'TrackName',
        key: 'TrackName',
        sorter: (a, b) => a.TrackName.localeCompare(b.TrackName),
        render: (text, row) => <a href={`spotify:track:${row.TrackID}`}>{row.TrackName}</a>
    },
    {
        title: 'Popularity',
        dataIndex: 'Popularity',
        key: 'Popularity',
        sorter: (a, b) => a.Popularity - b.Popularity
    },
    {
        title: 'Explicit',
        dataIndex: 'Explicit',
        key: 'Explicit',
        sorter: (a, b) => a.Explicit.localeCompare(b.Explicit)
    },
    {
        title: 'Duration',
        dataIndex: 'Duration',
        key: 'Duration',
        sorter: (a, b) => a.Duration - b.Duration,
        render: (text, row) => millisToMS(row.Duration)
    }
];


class PlaylistsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            followers: 0,
            tracks: 0,
            playlistname: "",
            artist1: "",
            artist2: "",
            playlistResults: [],
            selectedPlaylistDetails: null,
            selectedPlaylistName: "",
            selectedPlaylistId: window.location.search ? window.location.search.substring(1).split('=')[1] : -1,
        }

        this.handleFollowerChange = this.handleFollowerChange.bind(this)
        this.handleTrackChange = this.handleTrackChange.bind(this)
        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.handlePlaylistNameChange = this.handlePlaylistNameChange.bind(this)
        this.handleArtist1Change = this.handleArtist1Change.bind(this)
        this.handleArtist2Change = this.handleArtist2Change.bind(this)
        this.handleRowClick = this.handleRowClick.bind(this)
        this.goToTrack = this.goToTrack.bind(this)
    }

    // handlers for search options
    handleFollowerChange(event) {
        this.setState({ followers: event.target.value })
    }
    handleTrackChange(event) {
        this.setState({ tracks: event.target.value })
    }
    handlePlaylistNameChange(event) {
        this.setState({ playlistname: event.target.value })
    }
    handleArtist1Change(event) {
        this.setState({artist1: event.target.value})
    }
    handleArtist2Change(event) {
        this.setState({ artist2: event.target.value })
    }

    // handlers for button clicks
    goToTrack(trackId) {
        window.location = `/tracks?id=${trackId}`
    }
    handleRowClick(playlist_id, playlist_name) {
        getPlaylistTracks(playlist_id).then(res => {
            this.setState({ selectedPlaylistDetails: res.results })
        })
        this.setState({ selectedPlaylistId: playlist_id})
        this.setState({ selectedPlaylistName: playlist_name })
    }
    updateSearchResults() {
        if (this.state.artist1 === "" && this.state.artist2 === "") {
            getPlaylistSearch(this.state.playlistname, this.state.followers, this.state.tracks).then(res => {
                this.setState({ playlistResults: res.results, followers: 0, tracks: 0, playlistname: ""})
            })
        }
        else {

            getArtistsPlaylists(this.state.artist1, this.state.artist2).then(res => {
                    this.setState({ playlistResults: res.results, artist1: "", artist2: "" })
                })
        }
    }
    // renders tracks in playlist with specified id in route
    componentDidMount() {
        getPlaylistTracks(this.state.selectedPlaylistId).then(res => {
            this.setState({ selectedPlaylistDetails: res.results })
        })
    }


    render() {
        return (
            <div>
                <MenuBar />
                <h2 style={{textAlign: 'center', marginTop: 30}}>Search for an playlist</h2>
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Playlist Name</label>
                            <FormInput placeholder="Playlist Name" value={this.state.playlistname} onChange={this.handlePlaylistNameChange} />
                        </FormGroup></Col>
                        
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Number of Tracks</label>
                            <FormInput placeholder="Number of Tracks" value={this.state.tracks} onChange={this.handleTrackChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Number of Followers</label>
                            <FormInput placeholder="Number of Followers" value={this.state.followers} onChange={this.handleFollowerChange} />
                        </FormGroup></Col>
                    </Row>
                    <Row style={{marginTop: 20}}>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Artist 1</label>
                            <FormInput placeholder="Artist 1" value={this.state.artist1} onChange={this.handleArtist1Change} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: 'auto'}}>
                            <button type="button" className="btn btn-dark" style={{ margin: 'auto', marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</button>
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Artist 2</label>
                            <FormInput placeholder="Artist 2" value={this.state.artist2} onChange={this.handleArtist2Change} />
                        </FormGroup></Col>
                    </Row>
                </Form>
                <Divider />
                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                        <Table onRow={(record, rowIndex) => {
                            return {
                                onClick: event => { this.handleRowClick(record.id, record.name) },  
                            };
                        }} dataSource={this.state.playlistResults} columns={playlistsColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
                        </Table>
                    <Divider />
                    {this.state.selectedPlaylistDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                        <h3>{this.state.selectedPlaylistName}</h3>
                        <Table onRow={(record, rowIndex) => {
                            return {
                                onClick: event => {this.goToTrack(record.TrackID)},  
                            };
                        }}
                            dataSource={this.state.selectedPlaylistDetails} columns={trackColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
                        </Table>
                    </div> : null}
                    <Divider />
                    </div>
                <Divider />
                <Divider />
            </div>
        )
    }
}

export default PlaylistsPage

