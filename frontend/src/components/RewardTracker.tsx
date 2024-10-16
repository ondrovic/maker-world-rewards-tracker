import React, { useCallback, useEffect } from 'react';
import { Card, Col, Container, Form, Row } from 'react-bootstrap';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RewardTrackerProps } from '../interfaces/RewardTrackerProps';
import { cardStyle, progressBarStyle } from '../styles/styles';

const RewardTracker: React.FC<RewardTrackerProps> = ({
  currentPoints,
  neededPoints,
  currentPercentage,
  progressBarColor,
  lastUpdate,
  setCurrentPoints,
  setLastUpdate,
  setError,
  setCurrentPercentage,
  setProgressBarColor,
}) => {
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
      if (neededPoints === 0) {
        throw new Error('Cannot calculate percentage when neededPoints is 0');
      }

      const percentage = (currentPoints / neededPoints) * 100;
      setCurrentPercentage(parseFloat(percentage.toFixed(2)));
      getProgressBarColor();
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);

        // Ensure the toast notification shows only once for the same error
        const toastId = `error-${err.message}`;
        if (!toast.isActive(toastId)) {
          toast.error(err.message, { toastId });
        }
      }
    }
  }, [currentPoints, neededPoints, setCurrentPercentage, setError, getProgressBarColor]);

  useEffect(() => {
    const fetchData = async () => {
      const pointsUrl = import.meta.env.VITE_APP_POINTS_ROUTE || '';
      const lastUpdatedUrl = import.meta.env.VITE_APP_UPDATED_ROUTE || '';
  
      const getEndpointFromUrl = (url: string) => {
        try {
          const parsedUrl = new URL(url);
          return parsedUrl.pathname.startsWith('/') ? parsedUrl.pathname.slice(1) : parsedUrl.pathname; 
        } catch {
          return url; // Fallback in case parsing fails
        }
      };
      
  
      try {
        const pointsResponse = await fetch(pointsUrl).catch(err => {
          // Add custom error with just the endpoint
          throw new Error(`${getEndpointFromUrl(pointsUrl)}: ${err.message}`);
        });
  
        if (!pointsResponse.ok) {
          throw new Error(`${getEndpointFromUrl(pointsUrl)} (Status: ${pointsResponse.status})`);
        }
  
        const lastUpdatedResponse = await fetch(lastUpdatedUrl).catch(err => {
          // Add custom error with just the endpoint
          throw new Error(`${getEndpointFromUrl(lastUpdatedUrl)}: ${err.message}`);
        });
  
        if (!lastUpdatedResponse.ok) {
          throw new Error(`${getEndpointFromUrl(lastUpdatedUrl)} (Status: ${lastUpdatedResponse.status})`);
        }
  
        const [pointsData, lastUpdatedData] = await Promise.all([
          pointsResponse.json(),
          lastUpdatedResponse.json(),
        ]);
  
        setCurrentPoints(pointsData.currentPoints);
        setLastUpdate(lastUpdatedData.lastUpdate);
      } catch (err) {
        if (err instanceof Error) {
          const errorMessage = err.message;
  
          // Handle network failure
          if (errorMessage.includes('Failed to fetch')) {
            setError(errorMessage);
  
            // Create a unique toastId based on the error message
            const toastId = `error-${errorMessage}`;
  
            // Prevent duplicate toasts for the same error message
            if (!toast.isActive(toastId)) {
              toast.error(errorMessage, { toastId });
            }
          }
        }
      }
    };
  
    fetchData();
  }, [setCurrentPoints, setLastUpdate, setError]);

  // Trigger calculatePercentage whenever currentPoints or neededPoints changes
  useEffect(() => {
    calculatePercentage();
  }, [currentPoints, neededPoints, calculatePercentage]);

  return (
    <Container className="flex">
      <Row>
        <Col>
          <Card style={cardStyle}>
            <Card.Header>
              Reward Progress
            </Card.Header>
            <Card.Body>
              <Card.Title />
              <ProgressBar
                style={progressBarStyle}
                now={currentPercentage}
                aria-valuenow={currentPercentage}
                label={`${currentPercentage}%`}
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

export default RewardTracker;
