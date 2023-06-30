import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";


import {
    Table,
    Pagination,
    Row,
    Col,
    Divider,

} from 'antd'
import { getArtist, recommendArtists, getArtistSearch, getArtistAlbums, getArtistTracks } from '../fetcher'


import MenuBar from '../components/MenuBar';

const { Column, ColumnGroup } = Table;


// function that converts milliseconds to minutes to seconds
function millisToMS(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// function that converts milliseconds to hours, minutes, and seconds
function millisToHMS(millis) {
var hours = Math.floor(millis / (60000 * 60))
millis -= hours * (60000 * 60)
var minutes_seconds = millisToMS(millis)
return hours + ":" + (minutes_seconds[1] === ':' ? '0' : '') + minutes_seconds 
}

// specify column details for artist table
const artistColumns = [
    {
        title: 'Name',
        dataIndex: 'Name',
        key: 'Name',
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        render: (text, row) => <a href={`spotify:artist:${row.Id}`}>{row.Name}</a>
    },
    {
        title: 'Popularity',
        dataIndex: 'Popularity',
        key: 'Popularity',
        sorter: (a, b) => a.Popularity - b.Popularity,
        render: (text, row) => row.Popularity.toFixed(2)
    },
];

// column details for album table
const albumColumns = [
    {
        title: 'Album Name',
        dataIndex: 'AlbumName',
        key: 'AlbumName',
        sorter: (a, b) => a.AlbumName.localeCompare(b.AlbumName),
        render: (text, row) => <a href={`spotify:album:${row.AlbumID}`}>{row.AlbumName}</a>
    },
    {
        title: 'Popularity',
        dataIndex: 'Popularity',
        key: 'Popularity',
        sorter: (a, b) => a.Popularity - b.Popularity,
        render: (text, row) => row.Popularity.toFixed(2)
    },
    {
        title: 'Total Duration',
        dataIndex: 'Duration',
        key: 'Duration',
        sorter: (a, b) => a.Duration - b.Duration,
        render: (text, row) => millisToHMS(row.Duration)
    },
];

// column details for track table
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
        sorter: (a, b) => a.Popularity - b.Popularity,
    },
    {
        title: 'Duration',
        dataIndex: 'Duration',
        key: 'Duration',
        sorter: (a, b) => a.Duration - b.Duration,
        render: (text, row) => millisToMS(row.Duration)
    },
];


class ArtistsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            artistQuery: "",
            artistsResults: [],
            selectedArtistId: window.location.search ? window.location.search.substring(1).split('=')[1] : '1uNFoZAHBGtllmzznpCI3s',
            selectedArtistDetails: null,
            artistMostPopularAlbums: null,
            artistMostPopularTracks: null,
            resultsType: 'search'
        }
        this.handleArtistQueryChange = this.handleArtistQueryChange.bind(this)
        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.updateRecommendations = this.updateRecommendations.bind(this)
        this.goToArtist = this.goToArtist.bind(this)
        this.showAlbums = this.showAlbums.bind(this)
    }

    // handlers for search parameters
    handleArtistQueryChange(event) {
        this.setState({ artistQuery: event.target.value })
    }

    // handlers for row clicks in the different tables
    goToArtist(artistId) {
        window.location = `/artists?id=${artistId}`
    }
    goToAlbum(albumId) {
        window.location = `/albums?id=${albumId}`
    }
    goToTrack(trackId) {
        window.location = `/tracks?id=${trackId}`
    }

    // handler for search button that populates the artist table
    updateSearchResults() {
        this.setState({ resultsType: 'search' })
        getArtistSearch(this.state.artistQuery, null, null).then(res => {
            this.setState({ artistsResults: res.results })
        })
    }

    // handler for recommendation button that populates the artist table
    updateRecommendations() {
        this.setState({ resultsType: 'recommendations' })
        recommendArtists(this.state.selectedArtistId).then(res => {
            this.setState({ artistsResults: res.results })
        })
    }

    // load in artists and tracks for the artist id specified in the route
    componentDidMount() {
        getArtist(this.state.selectedArtistId).then(res => {
            this.setState({ selectedArtistDetails: res.results[0] })
        })
        getArtistTracks(this.state.selectedArtistId).then(res => {
            this.setState({ artistMostPopularTracks: res.results })
        })
    }

    // display all the albums of the currently selected artist
    showAlbums() {
        getArtistAlbums(this.state.selectedArtistId).then(res => {
            this.setState({ artistMostPopularAlbums: res.results })
        })
    }

    render() {
        return (
            <div>
                <MenuBar />
                <h2 style={{textAlign: 'center', marginTop: 30}}>Search for an artist</h2>
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}>
                            <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                                <label>Artist Name</label>
                                <FormInput placeholder="Artist Name" value={this.state.artistQuery} onChange={this.handleArtistQueryChange} />
                            </FormGroup>
                        </Col>
                        <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                        <button type="button" className="btn btn-dark" style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</button>
                        </FormGroup></Col>
                    </Row>
                </Form>
                <Divider />
                
                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                        <h3>{this.state.resultsType === 'search' ? 'Artists' : 'Recommendations'}</h3>
                        <Table onRow={(record, rowIndex) => {
                            return {
                            onClick: event => {this.goToArtist(record.Id)}, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter  
                            };
                        }} dataSource={this.state.artistsResults} columns={artistColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
                        </Table>
                    </div>
                <Divider />
                {this.state.selectedArtistDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Card>
                        <CardBody>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col flex={2} style={{ textAlign: 'left' }}>
                                <h3>{this.state.selectedArtistDetails.Name}</h3>

                                </Col>

                                <Col flex={2} style={{ textAlign: 'right' }}>
                                <h3><a href={`spotify:artist:${this.state.selectedArtistDetails.Id}`}>Open on Spotify</a></h3>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <button type="button" className="btn btn-success" style={{ marginTop: '4vh' }} onClick={this.updateRecommendations} >Recommend Artists</button>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <button type="button" className="btn btn-success" style={{ marginTop: '4vh' }} onClick={this.showAlbums} >Show Albums</button>
                            </Row>
                            <br>
                            </br>
                        </CardBody>
                    </Card>
                </div> : <h4 style={{marginTop: 20, textAlign: 'center'}}>Loading Artist...</h4>}
                {this.state.artistMostPopularAlbums ? 
                <div style={{ width: '70vw', margin: '0 auto', marginTop: '8vh' }}>
                    <h3>Albums</h3>
                    <Table onRow={(record, rowIndex) => {
                            return {
                            onClick: event => {this.goToAlbum(record.AlbumID)}, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter  
                            };
                        }} dataSource={this.state.artistMostPopularAlbums} columns={albumColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
                    </Table>
                </div> : null}
                {this.state.artistMostPopularTracks ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '4vh' }}>
                    <h3>Tracks</h3>
                    <Table onRow={(record, rowIndex) => {
                            return {
                            onClick: event => {this.goToTrack(record.TrackID)}, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter  
                            };
                        }} dataSource={this.state.artistMostPopularTracks} columns={trackColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
                    </Table>
                </div> : null}
                <Divider />
            </div>
        )
    }
}

export default ArtistsPage

