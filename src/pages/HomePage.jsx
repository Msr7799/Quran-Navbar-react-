import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = ({ language }) => {
  const [recentReciters, setRecentReciters] = useState([]);
  const [radios, setRadios] = useState([]);
  const [liveTv, setLiveTv] = useState([]);

  useEffect(() => {
    fetchRecentReciters();
    fetchRadios();
    fetchLiveTv();
  }, [language]);

  const fetchRecentReciters = async () => {
    try {
      const response = await fetch(
        `https://mp3quran.net/api/v3/recent_reads?language=${language}`
      );
      const data = await response.json();
      if (data && data.reciters) {
        setRecentReciters(data.reciters.slice(0, 6)); // Get only first 6 reciters
      }
    } catch (error) {
      console.error('Error fetching recent reciters:', error);
    }
  };

  const fetchRadios = async () => {
    try {
      const response = await fetch(
        `https://mp3quran.net/api/v3/radios?language=${language}`
      );
      const data = await response.json();
      if (data && data.radios) {
        setRadios(data.radios.slice(0, 4)); // Get only first 4 radios
      }
    } catch (error) {
      console.error('Error fetching radios:', error);
    }
  };

  const fetchLiveTv = async () => {
    try {
      const response = await fetch(
        `https://mp3quran.net/api/v3/live-tv?language=${language}`
      );
      const data = await response.json();
      if (data && data.channels) {
        setLiveTv(data.channels);
      }
    } catch (error) {
      console.error('Error fetching live TV:', error);
    }
  };

  return (
    <div className='home-page'>
      <Row className='mb-4'>
        <Col>
          <h1 className='text-center'>Welcome to Quran App</h1>
          <p className='text-center lead'>
            Listen to Quran recitations, explore different reciters, search for
            verses, and read tafsir.
          </p>
        </Col>
      </Row>

      <Row className='mb-4'>
        <Col>
          <h2>Recent Reciters</h2>
          <Row xs={1} md={2} lg={3} className='g-4'>
            {recentReciters.map(reciter => (
              <Col key={reciter.id}>
                <Card className='h-100'>
                  <Card.Body>
                    <Card.Title>{reciter.name}</Card.Title>
                    <Card.Text>{reciter.rewaya_name}</Card.Text>
                    <Link
                      to={`/player?reciter=${reciter.id}&rewaya=${reciter.rewaya}&surah=${reciter.surah_id}`}
                    >
                      <Button variant='primary'>Listen</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <Row className='mb-4'>
        <Col md={8}>
          <h2>Quran Radios</h2>
          <Row xs={1} md={2} className='g-4'>
            {radios.map(radio => (
              <Col key={radio.id}>
                <Card className='h-100'>
                  <Card.Body>
                    <Card.Title>{radio.name}</Card.Title>
                    <audio controls className='w-100 mt-2' src={radio.url}>
                      Your browser does not support the audio element.
                    </audio>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        <Col md={4}>
          <h2>Live TV</h2>
          {liveTv.map(channel => (
            <Card key={channel.id} className='mb-3'>
              <Card.Body>
                <Card.Title>{channel.name}</Card.Title>
                <Button
                  variant='success'
                  href={channel.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-100'
                >
                  Watch Live
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
