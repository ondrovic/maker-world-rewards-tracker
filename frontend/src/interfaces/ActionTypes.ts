export interface SetNeededPointsAction {
    type: 'SET_NEEDED_POINTS',
    payload: number
}
  
export interface SetCurrentPointsAction {
    type: 'SET_CURRENT_POINTS',
    payload: number
}
  
export interface SetLastUpdateAction {
    type: 'SET_LAST_UPDATE',
    payload: string | null
}
  
export interface SetIsDarkModeAction {
    type: 'SET_IS_DARK_MODE',
    payload: boolean
}
  
export interface SetErrorAction {
    type: 'SET_ERROR',
    payload: string | null
}

export interface SetProgressBarColorAction {
    type: 'SET_PROGRESS_BAR_COLOR',
    payload: string
}
  
export interface SetCurrentPercentageAction {
    type: 'SET_CURRENT_PERCENTAGE',
    payload: number
}


