import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";


import {
    Table,
    Pagination,
    Row,
    Col,
    Divider,

} from 'antd'

import { getAlbumSearch, getAlbumTracks, recommendAlbums, getAlbum } from '../fetcher'


import MenuBar from '../components/MenuBar';

const { Column, ColumnGroup } = Table;

// function that converts milliseconds to minutes, seconds
function millisToMS(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

class AlbumsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            albumQuery: "",
            artistQuery: "",
            albumsResults: [],
            selectedAlbumId: window.location.search ? window.location.search.substring(1).split('=')[1] : '0005lpYtyKk9B3e0mWjdem',
            selectedAlbumName: "",
            selectedAlbumArtist: "",
            selectedAlbumDetails: "",
            selectedAlbumTracks: null
        }
        this.handleAlbumQueryChange = this.handleAlbumQueryChange.bind(this)
        this.handleArtistQueryChange = this.handleArtistQueryChange.bind(this)
        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.handleRowClick = this.handleRowClick.bind(this)
        this.updateRecommendations = this.updateRecommendations.bind(this)
        this.goToAlbum = this.goToAlbum.bind(this)
        this.goToTrack = this.goToTrack.bind(this)
    }

    // handlers for search parameters
    handleAlbumQueryChange(event) {
        this.setState({ albumQuery: event.target.value })
    }
    handleArtistQueryChange(event) {
        this.setState({ artistQuery: event.target.value })
    }

    // handlers for button clicks
    goToAlbum(albumId) {
        window.location = `/albums?id=${albumId}`
    }
    goToTrack(trackId) {
        window.location = `/tracks?id=${trackId}`
    }
    handleRowClick(albumID, albumName, albumArtist) {
        this.setState({ selectedAlbumName: albumName, selectedAlbumArtist: albumArtist })
        this.goToAlbum(albumID)
    }
    updateRecommendations() {
        recommendAlbums(this.state.selectedAlbumId).then(res => {
            this.setState({ albumsResults: res.results })
        })
    }
    updateSearchResults() {
        getAlbumSearch(this.state.albumQuery, this.state.artistQuery, null, null).then(res => {
            this.setState({ albumsResults: res.results })
        })
    }

    // loads the album and tracks of album with specified id
    componentDidMount() {
        getAlbum(this.state.selectedAlbumId).then(res => {
            this.setState({ selectedAlbumDetails: res.results[0] })
        })

        getAlbumTracks(this.state.selectedAlbumId).then(res => {
            this.setState({ selectedAlbumTracks: res.results })
        })
    }

    render() {
        return (
            <div>
                <MenuBar />
                <div>
                    <h2 style={{textAlign: 'center', marginTop: 30}}>Search for an album</h2>
                    <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                        <Row>
                            <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                                <label>Album Name</label>
                                <FormInput placeholder="Album Name" value={this.state.albumQuery} onChange={this.handleAlbumQueryChange} />
                            </FormGroup></Col>
                            <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                                <label>Artist Name</label>
                                <FormInput placeholder="Artist Name" value={this.state.artistQuery} onChange={this.handleArtistQueryChange} />
                            </FormGroup></Col>
                            <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                                <button type="button" className="btn btn-dark" style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</button>
                            </FormGroup></Col>
                        </Row>
                    </Form>
                </div>
                <Divider />
                <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Table onRow={(record, rowIndex) => {
                        return {
                        onClick: event => {this.handleRowClick(record.AlbumID, record.AlbumName, record.Artistname)},  
                        };
                    }} dataSource={this.state.albumsResults} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
                        <Column title="Album" dataIndex="AlbumName" key="AlbumName" sorter= {(a, b) => a.AlbumName.localeCompare(b.AlbumName)} render={(text, row) => <a href={`spotify:album:${row.AlbumID}`}>{row.AlbumName}</a>}/>
                        <Column title="Artist" dataIndex="ArtistName" key="ArtistName" sorter= {(a, b) => a.ArtistName.localeCompare(b.ArtistName)} render={(text, row) => <a href={`spotify:artist:${row.ArtistID}`}>{row.ArtistName}</a>}/>
                        <Column title="Popularity" dataIndex="AlbumPopularity" key="AlbumPopularity" sorter= {(a, b) => a.AlbumPopularity - b.AlbumPopularity} render = {(text, row) => Math.floor(row.AlbumPopularity)}/>
                    </Table>
                </div>
                <Divider />
                {this.state.selectedAlbumTracks ? <div>
                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                        <Card>
                                <CardBody>
                                    <Row gutter='30' align='middle' justify='center'>
                                        <Col flex={2} style={{ textAlign: 'left' }}>
                                            <h4 style={{textAlign: 'center'}}><a href={`spotify:album:${this.state.selectedAlbumId}`}>{this.state.selectedAlbumDetails.Name}</a></h4>
                                        </Col>
                                    </Row>
                                    <Row gutter='30' align='middle' justify='center'>
                                        <Col flex={2} style={{ textAlign: 'center' }}>
                                        <button type="button" className="btn btn-success" style={{ marginTop: '4vh' }} onClick={this.updateRecommendations}>Recommend Albums</button>
                                        </Col>
                                    </Row>
                                </CardBody>
                        </Card>
                    </div>
                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                        <Table onRow={(record, rowIndex) => {
                                return {
                                onClick: event => {this.goToTrack(record.TrackID)},
                                };
                            }}
                        dataSource = {this.state.selectedAlbumTracks}>
                            <ColumnGroup title={"Album Tracks"}>
                                <Column title="Track Name" dataIndex="TrackName" key="TrackName" sorter= {(a, b) => a.TrackName.localeCompare(b.TrackName)} render={(text, row) => <a href={`spotify:track:${row.TrackID}`}>{row.TrackName}</a>}/>
                                <Column title="Explicit" dataIndex="Explicit" key="Explicit" sorter= {(a, b) => a.Explicit.localeCompare(b.Explicit)}/>
                                <Column title="Duration" dataIndex="Duration" key="Duration" sorter= {(a, b) => a.Duration - b.Duration} render = {(text, row) => millisToMS(row.Duration)}/>
                                <Column title="Popularity" dataIndex="Popularity" key="Popularity" sorter= {(a, b) => a.Popularity - b.Popularity}/>
                            </ColumnGroup>
                            </Table>
                    </div>
                </div>: null}
                <Divider />

            </div>
        )
    }
}

export default AlbumsPage


