import { combineReducers } from 'redux';

import { 
  SetCurrentPointsAction,
  SetNeededPointsAction,
  SetLastUpdateAction,
  SetIsDarkModeAction,
  SetErrorAction,
  SetProgressBarColorAction,
  SetCurrentPercentageAction 
} from '../interfaces/ActionTypes';

const neededPoints = (state = parseInt(import.meta.env.VITE_APP_NEEDED_POINTS), action: SetNeededPointsAction) => {
  switch(action.type) {
    case 'SET_NEEDED_POINTS':
      return action.payload;
    default:
      return state;
  }
}

const currentPoints = (state = 0, action: SetCurrentPointsAction) => {
  switch (action.type) {
    case 'SET_CURRENT_POINTS':
      return action.payload;
    default:
      return state;
  }
};

const lastUpdate = (state = null, action: SetLastUpdateAction) => {
  switch (action.type) {
    case 'SET_LAST_UPDATE':
      return action.payload;
    default:
      return state;
  }
};

const isDarkMode = (state = true, action: SetIsDarkModeAction) => {
  switch (action.type) {
    case 'SET_IS_DARK_MODE':
      return action.payload;
    default:
      return state;
  }
};

const error = (state = null, action: SetErrorAction) => {
  switch (action.type) {
    case 'SET_ERROR':
      return action.payload;
    default:
      return state;
  }
};

const progressBarColor = (state = 'info', action: SetProgressBarColorAction) => {
  switch(action.type) {
    case 'SET_PROGRESS_BAR_COLOR':
      return action.payload
    default: return state;
  }
};

const currentPercentage = (state = 0, action: SetCurrentPercentageAction) => {
  switch(action.type) {
    case 'SET_CURRENT_PERCENTAGE':
      return action.payload
    default: return state;
  }
};

const rootReducer = combineReducers({
  currentPercentage,
  progressBarColor,
  neededPoints,
  currentPoints,
  lastUpdate,
  isDarkMode,
  error,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;