import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilamentDryTimes from './components/FilamentDryTimes';
import NavBar from './components/NavBar';
import RewardTracker from './components/RewardTracker';
import { AppProps } from './interfaces/AppProps';
import {
  setCurrentPercentage,
  setCurrentPoints,
  setError,
  setIsDarkMode,
  setLastUpdate,
  setNeededPoints,
  setPollingStatus,
  setProgressBarColor
} from './redux/actions';
import { RootState } from './redux/reducers';

const App: React.FC<AppProps & { pollingStatus: string; setPollingStatus: (status: string) => void }> = ({
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
  pollingStatus,
  setPollingStatus,
  error,
}) => {

  const navItems = [
    { name: "Reward Tracker", href: "/" },
    { name: "Filament Dry Times", href: "/filament-dry-times" },
  ];

  const siteTitle = import.meta.env.VITE_APP_TITLE || '';

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (error) {
      // Dynamically import toast to avoid SSR issues
      import('react-toastify').then(({ toast }) => {
        toast.error(error);
      });
    }
  }, [error]);

  return (
    <>
      <Helmet>
        <title>{siteTitle}</title>
      </Helmet>
      <Router basename='/'>
        <NavBar
          title={siteTitle}
          navItems={navItems}
          isDarkMode={isDarkMode}
          collapseOnSelect={true}
          setIsDarkMode={setIsDarkMode}
        />
        <br />
        <Routes>
          <Route
            path="/"
            element={<>
              <RewardTracker
                error={error}
                currentPoints={currentPoints}
                neededPoints={neededPoints}
                currentPercentage={currentPercentage}
                progressBarColor={progressBarColor}
                lastUpdate={lastUpdate}
                setCurrentPoints={setCurrentPoints}
                setCurrentPercentage={setCurrentPercentage}
                setError={setError}
                setProgressBarColor={setProgressBarColor}
                setLastUpdate={setLastUpdate}
                pollingStatus={pollingStatus}
                setPollingStatus={setPollingStatus}
              />
              {/* <div style={{ marginTop: 10, fontSize: '0.9em', color: '#888' }}>
                <strong>Polling Status:</strong> {pollingStatus}
              </div> */}
            </>}
          />
          <Route
            path="/filament-dry-times"
            element={<FilamentDryTimes />}
          />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? 'dark' : 'light'}
      />
    </>
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
  pollingStatus: state.pollingStatus,
});

const mapDispatchToProps = {
  setNeededPoints,
  setCurrentPoints,
  setLastUpdate,
  setIsDarkMode,
  setError,
  setCurrentPercentage,
  setProgressBarColor,
  setPollingStatus,
};

const ReduxApp = connect(mapStateToProps, mapDispatchToProps)(App);
export default ReduxApp;
