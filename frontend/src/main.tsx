import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.tsx'
import { HelmetProvider } from 'react-helmet-async';
import {
  Provider
} from 'react-redux';
import React from 'react'
import ReactDOM from 'react-dom/client'
import store from './redux/store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>,
)
