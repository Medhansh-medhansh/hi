export interface HistoryItem {
  id: string;
  text: string;
  voice: string;
  language: string;
  timestamp: Date;
  settings: {
    speed: number;
    pitch: number;
    volume: number;
  };
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}