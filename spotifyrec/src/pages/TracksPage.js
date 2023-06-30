import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";

import {
    Table,
    Pagination,
    Select,
    Row,
    Col,
    Divider,
    Slider,
    Rate,
    Switch
} from 'antd'
import { RadarChart } from 'react-vis';
import { format } from 'd3-format';
import MenuBar from '../components/MenuBar';
import { getTrackSearch, getAudioFeatures, getTrackRecommendation } from '../fetcher'
const wideFormat = format('.3r');

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// specify column details for the track table
const trackColumns = [
    {
        title: 'Name',
        dataIndex: 'Name',
        key: 'Name',
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        render: (text, row) => <a href={`/tracks?id=${row.TrackId}`}>{text}</a>
    },
    {
        title: 'Artist',
        dataIndex: 'Artist',
        key: 'Artist',
        sorter: (a, b) => a.Artist.localeCompare(b.Artist),
        render: (text, row) => <a href={`/artists?id=${row.artist_id}`}>{text}</a>
    },
    {
        title: 'Duration',
        dataIndex: 'Duration',
        key: 'Duration',
        sorter: (a, b) => a.Duration - (b.Duration),
        render: (text, row) => millisToMinutesAndSeconds(row.Duration)
    },
    {
        title: 'Explicit',
        dataIndex: 'Explicit',
        key: 'Explicit',

    }, 
    {
        title: 'Popularity',
        dataIndex: 'Popularity',
        key: 'Popularity',
        sorter: (a, b) => a.Popularity - b.Popularity
    }
];

class TracksPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // search parameters for tracks
            nameQuery: '',
            artistQuery: '',
            explicitQuery: 'False',
            popularityLowQuery: 0,
            popularityHighQuery: 100,
            danceabilityLowQuery  : 0,
            danceabilityHighQuery : 1,
            energyLowQuery : 0,
            energyHighQuery  : 1,
            pitchLowQuery : 0,
            pitchHighQuery  : 11,
            loudnessLowQuery : -60,
            loudnessHighQuery : 5,
            speechinessLowQuery : 0,
            speechinessHighQuery : 1,
            acousticnessLowQuery : 0,
            acousticnessHighQuery : 1,
            instrumentalnessLowQuery : 0,
            instrumentalnessHighQuery : 1,
            livenessLowQuery : 0,
            livenessHighQuery : 1,
            valenceLowQuery : 0,
            valenceHighQuery : 1,
            tempoLowQuery : 0,
            tempoHighQuery : 250,
            timeSigLowQuery : 0,
            timeSigHighQuery : 5,
            selectedTrackId: window.location.search ? window.location.search.substring(1).split('=')[1] : '0bYg9bo50gSsH3LtXe2SQn',
            selectedTrackDetails: null,
            trackResults: [],
            recommendedResults: null

        }

        // bind handlers for track search
        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.handleNameQueryChange = this.handleNameQueryChange.bind(this)
        this.handleExplicitQueryChange = this.handleExplicitQueryChange.bind(this)
        this.handleDanceabilityQueryChange = this.handleDanceabilityQueryChange.bind(this)
        this.handleEneryQueryChange = this.handleEneryQueryChange.bind(this)
        this.handlePitchQueryChange = this.handlePitchQueryChange.bind(this)
        this.handleLoudnessQueryChange = this.handleLivenessQueryChange.bind(this)
        this.handleSpeechinessQueryChange = this.handleSpeechinessQueryChange.bind(this)
        this.handleAcousticnessQueryChange = this.handleAcousticnessQueryChange.bind(this)
        this.handleInstrumentalnessQueryChange = this.handleInstrumentalnessQueryChange.bind(this)
        this.handleLivenessQueryChange = this.handleLivenessQueryChange.bind(this)
        this.handleValenceQueryChange = this.handleValenceQueryChange.bind(this)
        this.handleTempoQueryChange = this.handleTempoQueryChange.bind(this)
        this.handleTimeSigQueryChange = this.handleTimeSigQueryChange.bind(this)
        this.handlePopularityQueryChange = this.handlePopularityQueryChange.bind(this)
        this.handleArtistQueryChange = this.handleArtistQueryChange.bind(this)
        this.updateRecommend = this.updateRecommend.bind(this)
    }

    // handlers for track parameters
    handleNameQueryChange(event) {
        this.setState({ nameQuery: event.target.value })
    }
    
    handleArtistQueryChange(event) {
        this.setState({ artistQuery: event.target.value })
    }
    
    handleExplicitQueryChange(checked) {
        if (checked) {
            this.setState({ explicitQuery : 'True'})
        } else {
            this.setState({ explicitQuery: 'False' })
        }
    }
    handlePopularityQueryChange(value) {
        this.setState( { popularityLowQuery: value[0] })
        this.setState( { popularityHighQuery: value[1] })
    }
    handleDanceabilityQueryChange(value) {
        this.setState({ danceabilityLowQuery: value[0] })
        this.setState({ danceabilityHighQuery: value[1] })
    }
    handleEneryQueryChange(value) {
        this.setState({ energyLowQuery: value[0] })
        this.setState({ energyHighQuery: value[1] })
    }
    handlePitchQueryChange(value) {
        this.setState({ pitchLowQuery: value[0] })
        this.setState({ pitchHighQuery: value[1] })
    }
    handleLoudnessQueryChange(value) {
        this.setState({ loudnessLowQuery: value[0] })
        this.setState({ loudnessHighQuery: value[1] })
    }
    handleSpeechinessQueryChange(value) {
        this.setState({ speechinessLowQuery: value[0] })
        this.setState({ speechinessHighQuery: value[1] })
    }
    handleAcousticnessQueryChange(value) {
        this.setState({ acousticnessLowQuery: value[0] })
        this.setState({ acousticnessHighQuery: value[1] })
    }
    handleInstrumentalnessQueryChange(value) {
        this.setState({ instrumentalnessLowQuery: value[0] })
        this.setState({ instrumentalnessHighQuery: value[1] })
    }
    handleLivenessQueryChange(value) {
        this.setState({ livenessLowQuery: value[0] })
        this.setState({ livenessHighQuery: value[1] })
    }
    handleValenceQueryChange(value) {
        this.setState({ valenceLowQuery: value[0] })
        this.setState({ valenceHighQuery: value[1] })
    }
    handleTempoQueryChange(value) {
        this.setState({ tempoLowQuery: value[0] })
        this.setState({ tempoHighQuery: value[1] })
    }
    handleTimeSigQueryChange(value) {
        this.setState({ timeSigLowQuery: value[0] })
        this.setState({ timeSigHighQuery: value[1] })
    }

    // handler for track search
    updateSearchResults() {
        getTrackSearch(this.state.nameQuery, this.state.artistQuery, this.state.popularityLowQuery, this.state.popularityHighQuery, this.state.explicitQuery, 
                    this.state.danceabilityLowQuery, this.state.danceabilityHighQuery,
                    this.state.energyLowQuery, this.state.energyHighQuery,
                    this.state.pitchLowQuery, this.state.pitchHighQuery,
                    this.state.loudnessLowQuery, this.state.loudnessHighQuery,
                    this.state.speechinessLowQuery, this.state.speechinessHighQuery,
                    this.state.acousticnessLowQuery, this.state.acousticnessHighQuery,
                    this.state.instrumentalnessLowQuery, this.state.instrumentalnessHighQuery,
                    this.state.livenessLowQuery, this.state.livenessHighQuery,
                    this.state.valenceLowQuery, this.state.valenceHighQuery,
                    this.state.tempoLowQuery, this.state.tempoHighQuery,
                    this.state.timeSigLowQuery, this.state.timeSigHighQuery,
                    null, null).then(res => {
            this.setState({ trackResults: res.results })
        })
    
    }

    // handler for track recommendations
    updateRecommend() {
        getTrackRecommendation(this.state.selectedTrackId).then(res => {
            this.setState({ recommendedResults: res.results })
        })
    }

    // load audio features for track specified in the url
    componentDidMount() {
        getAudioFeatures(this.state.selectedTrackId).then(res => {
            this.setState({ selectedTrackDetails: res.results[0] })
        })
    }
    render() {
        return (
            <div>
                <MenuBar />
                <h2 style={{textAlign: 'center', marginTop: 30}}>Search for a track</h2>
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Track Name</label>
                            <FormInput placeholder="Track Name" value={this.state.nameQuery} onChange={this.handleNameQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Artist Name</label>
                            <FormInput placeholder="Artist Name" value={this.state.artistQuery} onChange={this.handleArtistQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Popularity</label>
                            <Slider range defaultValue={[0, 100]} onChange={this.handlePopularityQueryChange} />
                        </FormGroup></Col>
                        <Col flex={1}><FormGroup style={{ width: '10vw', margin: '0 auto' }}>
                            <label>Explicit</label>
                            <br></br>
                            <Switch defaultChecked checked={this.state.explicitQuery === 'True'} onChange={this.handleExplicitQueryChange}/>
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                            <button type="button" className="btn btn-dark" style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</button>
                        </FormGroup></Col>
                        
                    
                        
                    </Row>
                <h3 style={{textAlign: 'center', marginTop: 30}}>Audio Features</h3>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                            <label>Danceability</label>
                            <Slider range min={0} max={1} step={0.01} defaultValue={[0, 1]}  onChange={this.handleDanceabilityQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                            <label>Energy</label>
                            <Slider range min={0} max={1} step={0.01} defaultValue={[0, 1]} onChange={this.handleEneryQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                            <label>Pitch</label>
                            <Slider range min={0} max={11} step={1} defaultValue={[0, 11]} onChange={this.handlePitchQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                            <label>Loudness</label>
                            <Slider range min={-60} max={5} step={0.01} defaultValue={[-60, 5]} nChange={this.handleLoudnessQueryChange} />
                        </FormGroup></Col>

                    </Row>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                            <label>Speechiness</label>
                            <Slider range min={0} max={1} step={0.01} defaultValue={[0, 1]} onChange={this.handleSpeechinessQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                            <label>Acousticness</label>
                            <Slider range min={0} max={1} step={0.01} defaultValue={[0, 1]} onChange={this.handleAcousticnessQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                            <label>Instrumentalness</label>
                            <Slider range min={0} max={1} step={0.01} defaultValue={[0, 1]} onChange={this.handleInstrumentalnessQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                            <label>Liveness</label>
                            <Slider range min={0} max={1} step={0.01} defaultValue={[0, 1]} onChange={this.handleLivenessQueryChange} />
                        </FormGroup></Col>
                    </Row>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                            <label>Valence</label>
                            <Slider range min={0} max={1} step={0.01} defaultValue={[0, 1]} onChange={this.handleValenceQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                            <label>Tempo</label>
                            <Slider range min={0} max={250} step={0.1} defaultValue={[0, 250]} onChange={this.handleTempoQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                            <label>Time Signature</label>
                            <Slider range min={0} max={5} step={1} defaultValue={[0, 5]} onChange={this.handleTimeSigQueryChange} />
                        </FormGroup></Col>
                        
                    </Row>
                    <br></br>
                </Form>
                <Divider />
                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <h3>Tracks</h3>
                    <Table dataSource={this.state.trackResults} columns={trackColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                    </div>
                <Divider />

                {this.state.selectedTrackDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Card>
                    
                        <CardBody>
                        <Row gutter='30' align='middle' justify='center'>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            <h3>{this.state.selectedTrackDetails.name}</h3>

                            </Col>

                            <Col flex={2} style={{ textAlign: 'right' }}>
                            <h3><a href={`spotify:track:${this.state.selectedTrackDetails.id}`}>Open on Spotify</a></h3>
                            </Col>
                        </Row>
                            <Row gutter='30' align='middle' justify='left'>
                                <Col>
                                <h5><a href={`/artists/?id=${this.state.selectedTrackDetails.Artist_Id}`}>by {this.state.selectedTrackDetails.Artist}</a></h5>
                                </Col>
                                <Col>
                                <h5>Duration {millisToMinutesAndSeconds(this.state.selectedTrackDetails.duration_ms)}</h5>
                                </Col>
                                <Col>
                                <h5>Popularity {this.state.selectedTrackDetails.popularity}</h5>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col  push={2} flex={2}>
                                    {<RadarChart
                                data={[this.state.selectedTrackDetails]}
                                tickFormat={t => wideFormat(t)}
                                startingAngle={0}
                                margin={{left: 70, right: 70, top: 70, bottom: 40}}
                                style={{ 
                                    axes: { ticks: { fillOpacity: 0, strokeOpacity: 0 },
                                            text: { display: 'none' } ,
                                            line: {}
                                        },
                                        labels: {
                                        fontSize: 12.5
                                        },
                                        polygons: {
                                        strokeWidth: 0.5,
                                        strokeOpacity: 1,
                                        fillOpacity: 0.1
                                        }
                                
                                }}
                                domains={[
                                    { name: 'Danceability', domain: [0, 1], getValue: d=> d.danceability},
                                    { name: 'Energy', domain: [0, 1], getValue: d=> d.energy},
                                    { name: 'Pitch', domain: [0, 11], getValue: d=> d.pitch_key},
                                    { name: 'Loudness', domain: [-60, 5], getValue: d=> d.loudness},
                                    { name: 'Speechiness', domain: [0, 1], getValue: d=> d.speechiness},
                                    { name: 'Acousticness', domain: [0, 1], getValue: d=> d.acousticness},
                                    { name: 'Instrumentalness', domain: [0, 1], getValue: d=> d.instrumentalness},
                                    { name: 'Liveness', domain: [0, 1], getValue: d=> d.liveness},
                                    { name: 'Valence', domain: [0, 1], getValue: d=> d.valence},
                                    { name: 'Tempo', domain: [0, 250], getValue: d=> d.tempo},
                                    { name: 'Time Signature', domain: [0, 5], getValue: d=> d.time_signature}

                                    
                                ]}
                                
                                width={500}
                                height={450}
                                
                            />}
                                
                                </Col>
                                <Col flex={2}>
                            <button type="button" className="btn btn-success"  onClick={this.updateRecommend}>Recommend Tracks</button>
                        </Col>
                            </Row>
                            <br>
                            </br>
                        </CardBody>

                    </Card>
                    {this.state.recommendedResults ?
                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '8vh' }}>
                        <h3> Recommendations </h3>
                        <Table dataSource={this.state.recommendedResults} columns={trackColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                    </div>
                    : null}

                </div> : null}

            </div>
        )
    }
}

export default TracksPage

