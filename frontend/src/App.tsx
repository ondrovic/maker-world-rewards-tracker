import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
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
  setProgressBarColor
} from './redux/actions';
import { RootState } from './redux/reducers';

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

  const navItems = [
    { name: "Reward Tracker", href: "/" },
    { name: "Filament Dry Times", href: "/filament-dry-times" },
  ];

  const siteTitle = import.meta.env.VITE_APP_TITLE || '';

  const error = null
  // Use useEffect to handle theme updates
  useEffect(() => {
    document.documentElement.dataset.bsTheme = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  return (
    <>
      <Helmet>
        <title>{siteTitle}</title>
      </Helmet>
      <Router>
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
            element={<RewardTracker
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
            />}
          />
          <Route
            path="/filament-dry-times"
            element={<FilamentDryTimes isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
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

const ReduxApp = connect(mapStateToProps, mapDispatchToProps)(App);
export default ReduxApp;
