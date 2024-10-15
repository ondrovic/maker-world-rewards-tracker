export interface RewardTrackerProps {
    currentPoints: number;
    neededPoints: number;
    currentPercentage: number;
    progressBarColor: string;
    lastUpdate: string | null;
    error: string | null;
    setCurrentPoints: (points: number) => void;
    setLastUpdate: (lastRun: string | null) => void;
    setError: (error: string | null) => void;
    setCurrentPercentage: (percent: number) => void;
    setProgressBarColor: (color: string) => void;
  }