export const SET_CURRENT_POINTS = 'SET_CURRENT_POINTS';
export const SET_LAST_UPDATE = 'SET_LAST_UPDATE';
export const SET_IS_DARK_MODE = 'SET_IS_DARK_MODE';
export const SET_ERROR = 'SET_ERROR';
export const SET_CURRENT_PERCENTAGE = 'SET_CURRENT_PERCENTAGE';
export const SET_PROGRESS_BAR_COLOR = 'SET_PROGRESS_BAR_COLOR';
export const SET_NEEDED_POINTS = 'SET_NEEDED_POINTS';
export const SET_POLLING_STATUS = 'SET_POLLING_STATUS';

export const setCurrentPoints = (points: number) => ({
  type: SET_CURRENT_POINTS as typeof SET_CURRENT_POINTS,
  payload: points,
});

export const setLastUpdate = (lastUpdate: string | null) => ({
  type: SET_LAST_UPDATE as typeof SET_LAST_UPDATE,
  payload: lastUpdate,
});

export const setIsDarkMode = (isDarkMode: boolean) => ({
  type: SET_IS_DARK_MODE as typeof SET_IS_DARK_MODE,
  payload: isDarkMode,
});

export const setError = (error: string | null) => ({
  type: SET_ERROR as typeof SET_ERROR,
  payload: error,
});

export const setCurrentPercentage = (percent: number) => ({
  type: SET_CURRENT_PERCENTAGE as typeof SET_CURRENT_PERCENTAGE,
  payload: percent,
});

export const setProgressBarColor = (color: string) => ({
  type: SET_PROGRESS_BAR_COLOR as typeof SET_PROGRESS_BAR_COLOR,
  payload: color,
});

export const setNeededPoints = (points: number) => ({
  type: SET_NEEDED_POINTS as typeof SET_NEEDED_POINTS,
  payload: points,
});

export const setPollingStatus = (status: string) => ({
  type: SET_POLLING_STATUS as typeof SET_POLLING_STATUS,
  payload: status,
});