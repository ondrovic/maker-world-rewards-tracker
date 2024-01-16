export interface AppProps {
    currentPoints: number;
    neededPoints: number;
    currentPercentage: number;
    progressBarColor: string;
    lastUpdate: string | null;
    isDarkMode: boolean;
    error: string | null;
    setCurrentPoints: (points: number) => void;
    setLastUpdate: (lastRun: string | null) => void;
    setIsDarkMode: (isDarkMode: boolean) => void;
    setError: (error: string | null) => void;
    setCurrentPercentage: (percent: number) => void;
    setProgressBarColor: (color: string) => void;
  }