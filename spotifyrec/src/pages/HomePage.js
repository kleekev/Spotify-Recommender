import React from 'react';
import {
  Table,
  Pagination,
  Select,
  Divider,
  Carousel,
  Col,
  Row,
  Statistic,
  Rate
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getTopTracks } from '../fetcher';
const { Column, ColumnGroup } = Table;
const { Option } = Select;

const contentStyle = {
  height: '160px',
  color: 'black',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#17C671',
  borderRadius: '0.5',
  fontSize: 25,
};
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// specifies column details for the track table
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
      render: (text, row) => <a href={`/artists?id=${row.ArtistId}`}>{text}</a>
  },
  {
    title: 'Album',
    dataIndex: 'Album',
    key: 'Album',
    sorter: (a, b) => a.Album.localeCompare(b.Album),
    render: (text, row) => <a href={`/albums?id=${row.AlbumId}`}>{text}</a>
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


class HomePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      topTracks : [],
      pagination: null  
    }

  }

  componentDidMount() {
    getTopTracks().then(res => {
        this.setState({ topTracks: res.results })
    })
}




  render() {
    return (
      <div>
        <MenuBar />
        <h1 style={{textAlign: "center", marginTop: 50}}> Welcome to the Spotify Recommender </h1>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
          <Row>
            <Col flex={2} span={6}>
              <Statistic title="Number of Tracks" value={2262292} style={{ width: '20vw', margin: '0 auto' }}/>
            </Col>
            <Col flex={2} span={6}>
              <Statistic title="Number of Artists" value={295860} style={{ width: '20vw', margin: '0 auto' }}/>
            </Col>
            <Col flex={2} span={6}>
              <Statistic title="Number of Albums" value={734684} style={{ width: '20vw', margin: '0 auto' }}/>
            </Col>
            <Col flex={2} span={6}>
              <Statistic title="Number of Playlists" value={1000000} style={{ width: '20vw', margin: '0 auto' }}/>
            </Col>
            </Row>
        </div>
        <br></br>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
          <Carousel autoplay>
            <div>
              <h3 style={contentStyle}>This recommender is the best - Anonymous <Rate disabled defaultValue={5} /></h3>
            </div>
            <div>
              <h3 style={contentStyle}>I found my new favorite artist from using this - Anonymous <Rate disabled defaultValue={4.5} /></h3>
            </div>
            <div>
              <h3 style={contentStyle}>Works kinda slow - Hater <Rate disabled defaultValue={2.5} /></h3>
            </div>
            <div>
              <h3 style={contentStyle}>Loved it! - Anonymous <Rate disabled defaultValue={4.75}/> </h3>
            </div>
          </Carousel>
        </div>
        <Divider />
                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <h3>Top 100 Tracks</h3>
                    <Table dataSource={this.state.topTracks} columns={trackColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                    </div>
                <Divider />
      </div>
      

    )
  }

}

export default HomePage

