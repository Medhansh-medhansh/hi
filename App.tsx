import React, { useState, useCallback } from 'react';
import TextInput from './components/TextInput';
import VoiceControls from './components/VoiceControls';
import AudioControls from './components/AudioControls';
import HistoryPanel from './components/HistoryPanel';
import ThemeToggle from './components/ThemeToggle';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { HistoryItem } from './types';
import { Volume2, Headphones } from 'lucide-react';

function App() {
  const [text, setText] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('voicecaster-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    language,
    setLanguage,
    speed,
    setSpeed,
    pitch,
    setPitch,
    volume,
    setVolume,
    isPlaying,
    isPaused,
    speak,
    pause,
    resume,
    stop,
    previewVoice,
    downloadAudio,
    estimatedDuration,
  } = useSpeechSynthesis();

  const handleSpeak = useCallback(() => {
    if (!text.trim()) return;
    
    speak(text);
    
    // Add to history
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      text: text.trim(),
      voice: selectedVoice?.name || 'Default',
      language,
      timestamp: new Date(),
      settings: { speed, pitch, volume }
    };
    
    setHistory(prev => [historyItem, ...prev.slice(0, 4)]);
  }, [text, speak, selectedVoice, language, speed, pitch, volume]);

  const handleHistoryPlay = useCallback((item: HistoryItem) => {
    setText(item.text);
    setLanguage(item.language);
    setSpeed(item.settings.speed);
    setPitch(item.settings.pitch);
    setVolume(item.settings.volume);
    speak(item.text);
  }, [speak, setLanguage, setSpeed, setPitch, setVolume]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleDeleteHistoryItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('voicecaster-theme', newTheme ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`${
        isDark ? 'bg-black/20' : 'bg-white/20'
      } backdrop-blur-sm border-b ${
        isDark ? 'border-white/10' : 'border-black/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${
                isDark 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }`}>
                <Volume2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VoiceCaster
              </h1>
            </div>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Text Input Section */}
            <div className={`p-6 rounded-2xl shadow-xl ${
              isDark 
                ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50' 
                : 'bg-white/70 backdrop-blur-sm border border-gray-200/50'
            }`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'
                }`}>
                  <Headphones className={`h-5 w-5 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <h2 className="text-xl font-semibold">Text to Speech</h2>
              </div>
              
              <TextInput 
                text={text} 
                setText={setText} 
                isDark={isDark}
                estimatedDuration={estimatedDuration}
              />
            </div>

            {/* Voice Controls */}
            <VoiceControls
              voices={voices}
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
              language={language}
              setLanguage={setLanguage}
              speed={speed}
              setSpeed={setSpeed}
              pitch={pitch}
              setPitch={setPitch}
              volume={volume}
              setVolume={setVolume}
              previewVoice={previewVoice}
              isDark={isDark}
            />

            {/* Audio Controls */}
            <AudioControls
              text={text}
              isPlaying={isPlaying}
              isPaused={isPaused}
              onSpeak={handleSpeak}
              onPause={pause}
              onResume={resume}
              onStop={stop}
              onDownload={() => downloadAudio(text)}
              isDark={isDark}
            />
          </div>

          {/* History Panel */}
          <div className="xl:col-span-1">
            <HistoryPanel
              history={history}
              onHistoryPlay={handleHistoryPlay}
              onDownload={(item) => downloadAudio(item.text)}
              onDeleteItem={handleDeleteHistoryItem}
              onClearHistory={handleClearHistory}
              isDark={isDark}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;