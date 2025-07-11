import React, { useEffect, useMemo, useRef } from 'react';
import { Card, Col, Container, /*Form,*/ Row } from 'react-bootstrap';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'react-toastify/dist/ReactToastify.css';
import { RewardTrackerProps } from '../interfaces/RewardTrackerProps';
import { cardStyle, progressBarStyle } from '../styles/styles';

// Centralized config and types
const pointsUrl = import.meta.env.VITE_APP_POINTS_ROUTE || '';
const lastUpdatedUrl = import.meta.env.VITE_APP_UPDATED_ROUTE || '';
const updatedStreamUrl = import.meta.env.VITE_APP_UPDATED_STREAM_ROUTE || '/last-updated/stream';

type PointsResponse = { currentPoints: number };
type LastUpdatedResponse = { lastUpdate: string };

// DRY fetch helper
const fetchJson = async <T,>(url: string): Promise<T | null> => {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.debug('Fetch error:', e);
    return null;
  }
};

const RewardTracker: React.FC<RewardTrackerProps & { pollingStatus?: string; setPollingStatus?: (status: string) => void }> = ({
  currentPoints,
  neededPoints,
  // currentPercentage,
  // progressBarColor,
  lastUpdate,
  setCurrentPoints,
  setLastUpdate,
  setError,
  setCurrentPercentage,
  setProgressBarColor,
  // pollingStatus,
  setPollingStatus,
}) => {
  const lastUpdateRef = useRef<string | null>(null);

  // Memoized progress percentage
  const progressPercent = useMemo(() => {
    if (neededPoints === 0) return 0;
    return parseFloat(((currentPoints / neededPoints) * 100).toFixed(2));
  }, [currentPoints, neededPoints]);

  // Memoized progress bar color logic
  const progressColor = useMemo(() => {
    if (progressPercent <= 33) return 'info';
    if (progressPercent <= 90) return 'danger';
    return 'success';
  }, [progressPercent]);

  // Initial fetch
  useEffect(() => {
    const fetchData = async () => {
      const pointsData = await fetchJson<PointsResponse>(pointsUrl);
      const lastUpdatedData = await fetchJson<LastUpdatedResponse>(lastUpdatedUrl);
      if (pointsData) setCurrentPoints(pointsData.currentPoints);
      if (lastUpdatedData) setLastUpdate(lastUpdatedData.lastUpdate);
    };
    fetchData();
  }, [setCurrentPoints, setLastUpdate]);

  // SSE for last update
  useEffect(() => {
    if (!setPollingStatus) return;
    setPollingStatus('SSE: Listening for updates');
    const evtSource = new window.EventSource(updatedStreamUrl);
    evtSource.onmessage = async (event) => {
      setPollingStatus('SSE: Update received');
      try {
        const data = JSON.parse(event.data);
        if (data.lastUpdate && data.lastUpdate !== lastUpdateRef.current) {
          lastUpdateRef.current = data.lastUpdate;
          setLastUpdate(data.lastUpdate);
          // Optionally, fetch points data as well
          const pointsData = await fetchJson<PointsResponse>(pointsUrl);
          if (pointsData) setCurrentPoints(pointsData.currentPoints);
        }
      } catch (e) {
        setPollingStatus('SSE: Error parsing event');
      }
    };
    evtSource.onerror = () => {
      setPollingStatus('SSE: Connection error');
    };
    return () => {
      evtSource.close();
      setPollingStatus('SSE: Disconnected');
    };
  }, [setLastUpdate, setCurrentPoints, setPollingStatus]);

  // Update progress bar color and percentage in Redux if needed
  useEffect(() => {
    setCurrentPercentage(progressPercent);
    setProgressBarColor(progressColor);
    setError(null);
  }, [progressPercent, progressColor, setCurrentPercentage, setProgressBarColor, setError]);

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
              <div style={{ position: 'relative', width: '100%' }}>
                <ProgressBar
                  style={progressBarStyle}
                  now={progressPercent}
                  aria-valuenow={progressPercent}
                  aria-label="current-progress"
                  variant={progressColor}
                  animated
                  label=""
                  title={`${currentPoints} of ${neededPoints} points earned`}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bolder',
                    pointerEvents: 'none',
                    color: 'white',
                  }}
                >
                  {`${progressPercent.toFixed(2)} %`}
                </div>
              </div>
              <br />
            </Card.Body>
            <Card.Footer>Last Updated: {lastUpdate}</Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RewardTracker;
