import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";

const sampleText = "The quick brown fox jumps over the lazy dog. Practice makes perfect.";

const TypingPreviewSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTime, setStartTime] = useState<number | null>(null);

  const handleStartFullTest = () => {
    if (isAuthenticated) {
      navigate('/practice');
    } else {
      openLoginModal();
    }
  };

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex >= sampleText.length) return;

      // Prevent spacebar from scrolling the page while the test is active
      if (e.key === ' ') {
        e.preventDefault();
      }

      if (e.key === sampleText[currentIndex]) {
        setCurrentIndex(prev => prev + 1);

        // Calculate WPM
        if (startTime) {
          const elapsedMinutes = (Date.now() - startTime) / 60000;
          const words = (currentIndex + 1) / 5;
          setWpm(Math.round(words / elapsedMinutes) || 0);
        }
      } else if (e.key.length === 1) {
        setAccuracy(prev => Math.max(0, prev - 2));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, currentIndex, startTime]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentIndex(0);
    setWpm(0);
    setAccuracy(100);
    setStartTime(Date.now());
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentIndex(0);
    setWpm(0);
    setAccuracy(100);
    setStartTime(null);
  };

  const progress = (currentIndex / sampleText.length) * 100;

  return (
    <section id="typing" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,hsl(186_100%_50%/0.08)_0%,transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Content */}
          <div>
            <span className="text-primary font-mono text-sm tracking-wider uppercase mb-4 block">
              Typing Test
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Test Your{' '}
              <span className="gradient-text">Speed</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Challenge yourself with our real-time typing test. Track your words per minute, accuracy, and watch your keyboard skills improve with every session.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" onClick={handleStartFullTest}>
                Start Full Test
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/leaderboard')}>
                View Leaderboard
              </Button>
            </div>
          </div>

          {/* Interactive Preview */}
          <div className="glass rounded-2xl p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-orange-accent/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">WPM:</span>
                  <span className="text-primary font-mono font-bold text-xl">{wpm}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className={`font-mono font-bold text-xl ${accuracy > 80 ? 'text-success' : accuracy > 60 ? 'text-orange-accent' : 'text-destructive'}`}>
                    {accuracy}%
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-secondary rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-cyan-glow transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Typing Area */}
            <div className="font-mono text-lg md:text-xl leading-relaxed mb-6 min-h-[80px]">
              {sampleText.split('').map((char, index) => (
                <span
                  key={index}
                  className={`${index < currentIndex
                    ? 'text-success'
                    : index === currentIndex
                      ? 'bg-primary/30 text-foreground'
                      : 'text-muted-foreground'
                    }`}
                >
                  {char}
                </span>
              ))}
              {isActive && currentIndex < sampleText.length && (
                <span className="typing-cursor" />
              )}
            </div>

            {/* Keyboard Preview */}
            <div className="flex justify-center gap-1 mb-6">
              {['Q', 'W', 'E', 'R', 'T', 'Y'].map((key, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm transition-all ${sampleText[currentIndex]?.toUpperCase() === key
                    ? 'bg-primary text-primary-foreground scale-110'
                    : 'bg-secondary text-muted-foreground'
                    }`}
                >
                  {key}
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3">
              {!isActive ? (
                <Button onClick={handleStart} variant="default" size="lg">
                  <Play className="w-4 h-4" />
                  Start Typing
                </Button>
              ) : (
                <Button onClick={handleReset} variant="outline" size="lg">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              )}
            </div>

            {isActive && (
              <p className="text-center text-muted-foreground text-sm mt-4">
                Start typing to begin the test...
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TypingPreviewSection;
