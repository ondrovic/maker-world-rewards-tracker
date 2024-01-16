import { Card, Col, Container, Form, Row } from 'react-bootstrap';
import React, { useCallback, useEffect } from 'react';
import { cardStyle, containerStyle, iconStyle, progressBarStyle } from './styles/styles'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';


import { AppProps } from './interfaces/AppProps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet-async';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { RootState } from './redux/reducers';
import { connect } from 'react-redux';
import { 
  setNeededPoints, 
  setCurrentPoints, 
  setLastUpdate, 
  setIsDarkMode, 
  setError, 
  setCurrentPercentage,
  setProgressBarColor 
} from './redux/actions';

const App: React.FC<AppProps> = ({
  currentPoints,
  neededPoints,
  currentPercentage,
  progressBarColor,
  lastUpdate,
  isDarkMode,
  setCurrentPoints,
  setLastUpdate,
  setIsDarkMode,
  setError,
  setCurrentPercentage,
  setProgressBarColor,
}) => {
  const handleThemeToggle = (): void => {
    setIsDarkMode(!isDarkMode);
  };

  const getProgressBarColor = useCallback(() => {
    if (currentPercentage <= 33) {
      setProgressBarColor('info');
    } else if (currentPercentage <= 90) {
      setProgressBarColor('danger');
    } else {
      setProgressBarColor('success');
    }
  }, [currentPercentage, setProgressBarColor]);

  const calculatePercentage = useCallback(() => {
    try {
      const error: string | null = null;

      if (neededPoints === 0) {
        throw new Error("Cannot calculate percentage when neededPoints is 0");
      }

      const percentage = (currentPoints / neededPoints) * 100;

      setCurrentPercentage(parseFloat(percentage.toFixed(2)));
      getProgressBarColor();

      if (error !== null && error !== undefined) setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }, [currentPoints, neededPoints, setCurrentPercentage, setError, getProgressBarColor]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pointsResponse, lastUpdatedResponse] = await Promise.all([
          fetch(import.meta.env.VITE_APP_POINTS_ROUTE || ''),
          fetch(import.meta.env.VITE_APP_UPDATED_ROUTE || ''),
        ]);

        if (!pointsResponse.ok) {
          throw new Error(`HTTP error! Points Status: ${pointsResponse.status}`);
        }
        if (!lastUpdatedResponse.ok) {
          throw new Error(`HTTP error! Last Updated Status: ${lastUpdatedResponse.status}`);
        }

        const [pointsData, lastUpdatedData] = await Promise.all([
          pointsResponse.json(),
          lastUpdatedResponse.json(),
        ]);

        setCurrentPoints(pointsData.currentPoints);
        setLastUpdate(lastUpdatedData.lastUpdate);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    };

    fetchData();
  }, [
    setCurrentPoints, setLastUpdate, setError
  ]);

  // set theme based on isDarkMode
  document.documentElement.dataset.bsTheme = isDarkMode ? 'dark' : 'light';

  // calculate the percentage 
  calculatePercentage();

  return (
    <Container className='flex' style={containerStyle}>
      <Helmet>
        <title>{import.meta.env.VITE_APP_TITLE || ''}</title>
      </Helmet>
      <Row>
        <Col>
          <Card style={cardStyle}>
            <Card.Header>
              <FontAwesomeIcon
                icon={isDarkMode ? faSun : faMoon}
                onClick={handleThemeToggle}
                style={iconStyle}
              />
            </Card.Header>
            <Card.Body>
              <Card.Title>Maker World Reward Tracker</Card.Title>
              <ProgressBar
                style={progressBarStyle}
                now={currentPercentage}
                aria-valuenow={currentPercentage}
                label={currentPercentage + '%'}
                variant={progressBarColor}
                animated
              />

              <br />
              <Form>
                <Form.Group>
                  <Form.Label>Percentage: {currentPercentage}%</Form.Label>
                </Form.Group>
                <Form.Group>
                  <Form.Label>
                    Points: {currentPoints} / {neededPoints}
                  </Form.Label>
                </Form.Group>
              </Form>
            </Card.Body>
            <Card.Footer>Last Updated: {lastUpdate}</Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentPoints: state.currentPoints,
  neededPoints: state.neededPoints,
  currentPercentage: state.currentPercentage,
  progressBarColor: state.progressBarColor,
  lastUpdate: state.lastUpdate,
  isDarkMode: state.isDarkMode,
  error: state.error,
});

const mapDispatchToProps = {
  setNeededPoints,
  setCurrentPoints,
  setLastUpdate,
  setIsDarkMode,
  setError,
  setCurrentPercentage,
  setProgressBarColor,
};


const ReduxApp =  connect(mapStateToProps, mapDispatchToProps)(App);
export default ReduxApp;
