
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Hash, Type, AlignLeft, type LucideIcon, Pilcrow, Trophy, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import TestResults from './TestResults';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const COMMON_WORDS = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
    "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
    "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
    "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
    "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way"
];

const WORDS_EASY = [
    "cat", "dog", "run", "sky", "sun", "big", "red", "bad", "bed", "boy",
    "car", "cow", "day", "ear", "eat", "eye", "far", "fly", "fun", "god",
    "hat", "hen", "hot", "ice", "ink", "jar", "jet", "key", "kid", "kit",
    "leg", "let", "lip", "log", "man", "map", "net", "now", "oil", "old",
    "one", "owl", "pan", "pen", "pig", "pin", "pot", "rat", "row", "rub",
    "see", "set", "sit", "sky", "son", "sun", "tap", "tax", "tea", "ten"
];

const WORDS_HARD = [
    "juxtaposition", "encyclopedia", "schizophrenia", "hallucination", "unbelievable",
    "discrimination", "procrastination", "philosophical", "extraordinary", "configuration",
    "representative", "characteristic", "administration", "interpretation", "recommendation",
    "transportation", "responsibility", "communications", "investigation", "impossibility",
    "unconsciousness", "classification", "superintendent", "constellation", "transformation",
    "rehabilitation", "reconstruction", "sophisticated", "intellectual", "psychological",
    "environmental", "organizational", "constitutional", "identification", "understanding"
];

const SENTENCES_EASY = [
    "The sky is blue.",
    "I love to code.",
    "Cats are cute.",
    "Dogs like to run.",
    "The sun is hot.",
    "Read a good book.",
    "Walk in the park.",
    "Eat fresh fruit.",
    "Time flies fast.",
    "Be kind to all.",
    "Smile every day.",
    "Work hard now.",
    "Dream big dreams.",
    "Keep moving on.",
    "See the world."
];

const SENTENCES_MEDIUM = [
    "The sun rose gently over the horizon, painting the sky in hues of orange and pink.",
    "Technology has revolutionized the way we communicate and access information.",
    "Music has the power to heal the soul and bring people together.",
    "In the heart of the forest, ancient trees whispered secrets to the wind.",
    "The aroma of fresh coffee filled the air, signaling the start of a new day.",
    "Curiosity is the fuel that drives scientific discovery and innovation.",
    "A heavy silence hung in the room as everyone waited for the announcement.",
    "She walked along the beach, listening to the rhythmic crashing of the waves.",
    "Reading opens doors to new worlds and perspectives we might never otherwise encounter.",
    "The city skyline glittered at night, a testament to human engineering and ambition.",
    "Kindness is a language which the deaf can hear and the blind can see.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The majestic eagle soared high above the mountains, scanning the valley below.",
    "History often repeats itself for those who fail to learn from the past.",
    "Innovation distinguishes between a leader and a follower.",
    "The stars twinkled like diamonds scattered across the velvet canvas of the night.",
    "Patience is not simply the ability to wait - it's how we behave while we're waiting.",
    "Every great dream begins with a dreamer.",
    "Life is what happens when you're busy making other plans.",
    "The quick brown fox jumps over the lazy dog."
];

const SENTENCES_HARD = [
    "The juxtaposition of the two distinct ideologies created a palpable tension within the room.",
    "Photosynthesis is a process used by plants to convert light energy into chemical energy.",
    "The intricate mechanism of the antique clock fascinated the seasoned horologist.",
    "Quantum mechanics describes the physical properties of nature at the scale of atoms and subatomic particles.",
    "Her ephemeral presence left an indelible mark on the collective memory of the community.",
    "The protagonist's internal conflict was mirrored by the tumultuous weather in the novel.",
    "Cryptocurrency relies on decentralized networks and cryptographic techniques for security.",
    "Biodiversity is essential for the resilience of ecosystems against environmental changes.",
    "The philosophical debate centered around the concept of existentialism and free will.",
    "Architectural modernism emphasizes function and simplicity over ornamentation and decoration.",
    "The nuances of the diplomatic negotiations were lost in the translation process.",
    "Neuroplasticity refers to the brain's ability to reorganize itself by forming new neural connections.",
    "The exorbitant cost of living in the metropolis forced many residents to relocate.",
    "He meticulously scrutinized the manuscript for any grammatical or typographical errors.",
    "The cacophony of the bustling marketplace was overwhelming various sensory inputs."
];

const PARAGRAPHS_EASY = [
    "The sun is high in the sky. It is a warm day. Birds sing in the trees. I like to play outside. The grass is green and soft. We can run and jump. It is fun to be with friends.",
    "My cat is black and white. She likes to sleep on the bed. She purrs when I pet her. She likes to play with string. I love my cat very much.",
    "I have a red bike. It goes very fast. I ride it to the park. I wear a helmet to be safe. Riding my bike is my favorite thing to do.",
    "Apples are good to eat. They are red, green, or yellow. They grow on trees. I like apple pie. It is sweet and yummy."
];

const PARAGRAPHS_MEDIUM = [
    "Typing is a valuable skill that improves with regular practice and focused effort. A good typing test measures both speed and accuracy, helping users understand their strengths and areas for improvement. Staying calm, maintaining proper posture, and building muscle memory can significantly enhance performance. Over time, consistent practice leads to faster typing, fewer errors, and greater confidence while working or learning online.",
    "The concept of flow, often described as being 'in the zone', is a mental state of operation in which a person performing an activity is fully immersed in a feeling of energized focus, full involvement, and enjoyment in the process of the activity. In essence, flow is characterized by complete absorption in what one does, and a resulting loss in one's sense of space and time.",
    "Sustainable living is a lifestyle that attempts to reduce an individual's or society's use of the Earth's natural resources, and one's personal resources. It is often called as earth harmony living or net zero living. Practitioners of this lifestyle often attempt to reduce their carbon footprint by altering their methods of transportation, energy consumption, and diet."
];

const PARAGRAPHS_HARD = [
    "Artificial intelligence is rapidly transforming the world, influencing everything from healthcare to transportation. While it offers immense potential for efficiency and innovation, it also raises important ethical questions about privacy, employment, and the nature of intelligence itself. As we integrate AI deeper into our daily lives, striking a balance between technological advancement and human values becomes increasingly critical.",
    "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science.",
    "The Industrial Revolution was the transition to new manufacturing processes in Great Britain, continental Europe, and the United States, in the period from about 1760 to sometime between 1820 and 1840. This transition included going from hand production methods to machines, new chemical manufacturing and iron production processes, the increasing use of steam power and water power, the development of machine tools and the rise of the mechanized factory system."
];

const PUNCTUATION = [".", ",", "!", "?", ";", ":"];

type TypingMode = 'words' | 'sentences' | 'paragraphs';
type Difficulty = 'easy' | 'medium' | 'hard';

const generateWords = (count: number, includeNumbers: boolean, includePunctuation: boolean, difficulty: Difficulty) => {
    let sourceWords = COMMON_WORDS;
    if (difficulty === 'easy') sourceWords = WORDS_EASY;
    if (difficulty === 'hard') sourceWords = WORDS_HARD;

    const words = [];
    for (let i = 0; i < count; i++) {
        let word = sourceWords[Math.floor(Math.random() * sourceWords.length)];

        if (includeNumbers && Math.random() < 0.1) {
            word = Math.floor(Math.random() * 1000).toString();
        }

        if (includePunctuation && Math.random() < 0.2) {
            word += PUNCTUATION[Math.floor(Math.random() * PUNCTUATION.length)];
        }
        words.push(word);
    }
    return words.join(' ');
};

const generateSentences = (wordCountEstimate: number, difficulty: Difficulty) => {
    let text = "";
    let currentWordCount = 0;

    let sourceSentences = SENTENCES_MEDIUM;
    if (difficulty === 'easy') sourceSentences = SENTENCES_EASY;
    if (difficulty === 'hard') sourceSentences = SENTENCES_HARD;

    while (currentWordCount < wordCountEstimate) {
        const sentence = sourceSentences[Math.floor(Math.random() * sourceSentences.length)];
        text += (text ? " " : "") + sentence;
        currentWordCount += sentence.split(' ').length;
    }
    return text;
};

interface TypingTestProps {
    onComplete?: (stats: { wpm: number; accuracy: number; errorCount: number }) => void;
}

import MultiplayerModal from './MultiplayerModal';

const TypingTest = ({ onComplete }: TypingTestProps) => {
    const [targetText, setTargetText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isActive, setIsActive] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [errorCount, setErrorCount] = useState(0);

    // Config State
    const [mode, setMode] = useState<TypingMode>('words');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [selectedTime, setSelectedTime] = useState(30);
    const [includeNumbers, setIncludeNumbers] = useState(false);
    const [includePunctuation, setIncludePunctuation] = useState(false);

    const [isFinished, setIsFinished] = useState(false);
    const [isMultiplayerOpen, setIsMultiplayerOpen] = useState(false);
    const [history, setHistory] = useState<{ time: number; wpm: number; raw: number }[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize test
    useEffect(() => {
        resetTest();
    }, [selectedTime, includeNumbers, includePunctuation, mode, difficulty]);

    const resetTest = () => {
        let text = '';
        if (mode === 'words') {
            text = generateWords(100, includeNumbers, includePunctuation, difficulty);
        } else if (mode === 'sentences') {
            text = generateSentences(100, difficulty);
        } else {
            // Paragraph Mode
            let sourceParagraphs = PARAGRAPHS_MEDIUM;
            if (difficulty === 'easy') sourceParagraphs = PARAGRAPHS_EASY;
            if (difficulty === 'hard') sourceParagraphs = PARAGRAPHS_HARD;

            text = sourceParagraphs[Math.floor(Math.random() * sourceParagraphs.length)];
        }

        setTargetText(text);
        setUserInput('');
        setStartTime(null);
        setTimeLeft(selectedTime);
        setIsActive(false);
        setIsFinished(false);
        setWpm(0);
        setAccuracy(100);
        setErrorCount(0);
        setHistory([]);
        if (inputRef.current) inputRef.current.focus();
    };

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endTest();
                        return 0;
                    }
                    return prev - 1;
                });

                // Record history
                setHistory(prev => {
                    const timeElapsed = selectedTime - (timeLeft - 1);
                    return [...prev, { time: timeElapsed, wpm, raw: wpm }];
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    // Update WPM and Accuracy live
    useEffect(() => {
        if (isActive && startTime) {
            const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
            const wordsTyped = userInput.length / 5;
            const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;

            setWpm(currentWpm);

            // Calculate accuracy
            let errors = 0;
            for (let i = 0; i < userInput.length; i++) {
                if (userInput[i] !== targetText[i]) errors++;
            }
            const acc = Math.max(0, Math.round(((userInput.length - errors) / userInput.length) * 100));
            setAccuracy(acc || 100);
            setErrorCount(errors);
        }
    }, [userInput, startTime, isActive]);

    const { user } = useAuth(); // Get user from context

    const endTest = async () => {
        setIsActive(false);
        setIsFinished(true);

        // Save to Supabase if user is logged in
        console.log("EndTest called. User:", user);

        if (user?.id) {
            console.log("Attempting to save result to Supabase...", {
                user_id: user.id,
                wpm,
                accuracy,
                errorCount,
                time: selectedTime,
                mode
            });

            try {
                const { data, error } = await supabase
                    .from('test_results')
                    .insert({
                        user_id: user.id,
                        wpm: wpm,
                        accuracy: accuracy,
                        error_count: errorCount,
                        time_duration: selectedTime,
                        mode: mode
                    })
                    .select();

                if (error) {
                    console.error("Supabase SAVE ERROR:", error);
                } else {
                    console.log("Result saved successfully!", data);
                    toast.success("Result saved to history!");
                }
            } catch (err) {
                console.error("Unexpected error saving result:", err);
            }
        } else {
            console.warn("User ID missing, cannot save result. User object:", user);
            if (user) {
                toast.warning("Not connected to database (User ID missing).");
            }
        }

        if (onComplete) {
            onComplete({ wpm, accuracy, errorCount });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (!isActive && value.length === 1) {
            setStartTime(Date.now());
            setIsActive(true);
        }

        setUserInput(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
            inputRef.current.focus();
        }
        if (e.key === 'Tab') {
            e.preventDefault();
            resetTest();
        }
    };

    // Calculate active character position for auto-scroll
    const [activeCharIndex, setActiveCharIndex] = useState(0);
    const activeCharRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        setActiveCharIndex(userInput.length);

        // Scroll logic: Keep active line ~2nd line
        if (activeCharRef.current && containerRef.current) {
            const container = containerRef.current;
            const activeChar = activeCharRef.current;

            // Simple logic: Scroll active char into view with some padding
            const containerRect = container.getBoundingClientRect();
            const charRect = activeChar.getBoundingClientRect();

            const relativeTop = charRect.top - containerRect.top;
            const lineHeight = 64; // approx 4rem

            // If character is below the 2nd line, scroll
            if (relativeTop > lineHeight * 2) {
                container.scrollTo({
                    top: container.scrollTop + lineHeight,
                    behavior: 'smooth'
                });
            } else if (relativeTop < lineHeight) {
                // Check if we need to scroll up (backspacing)
                container.scrollTo({
                    top: container.scrollTop - lineHeight,
                    behavior: 'smooth'
                });
            }
        }
    }, [userInput]);

    // Render text with specific coloring
    const renderText = () => {
        return targetText.split('').map((char, index) => {
            // Colors: Untyped = very muted, Typed Correct = bright, Error = red
            let className = 'text-muted-foreground/40 transition-colors duration-200';

            if (index < userInput.length) {
                const isCorrect = char === userInput[index];
                className = isCorrect ? 'text-foreground' : 'text-red-500 bg-red-500/10';
            }

            const isCurrent = index === activeCharIndex;

            return (
                <span
                    key={index}
                    ref={isCurrent ? activeCharRef : null}
                    className={cn(className, "relative inline-block")}
                >
                    {isCurrent && (
                        <span className="absolute -left-[2px] top-1 bottom-1 w-[2px] bg-primary animate-pulse rounded-full shadow-[0_0_8px_rgba(45,212,191,0.5)]"></span>
                    )}
                    {char}
                </span>
            );
        });
    };

    return (
        <div
            className="w-full max-w-5xl mx-auto flex flex-col gap-8 outline-none relative justify-center"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            onClick={() => inputRef.current?.focus()}
        >
            {/* Website Branding */}
            <div className="absolute -top-32 left-0 flex items-center gap-3 select-none group cursor-default">
                <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 shadow-[0_0_15px_-3px_rgba(20,184,166,0.3)] group-hover:shadow-[0_0_20px_-3px_rgba(20,184,166,0.5)] transition-shadow duration-300">
                    <Type className="w-6 h-6 text-teal-400" />
                </div>
                <h1 className="font-bold text-2xl tracking-tighter text-white">
                    TypeSpeak<span className="text-teal-400">Pro</span>
                </h1>
            </div>

            {/* Controls Header - Fades out config, keeps stats */}
            <div
                className="flex items-center justify-between bg-transparent p-2 absolute -top-16 left-0 right-0 z-20"
            >
                {/* Left Side: Leaderboard Button */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => window.open('/leaderboard', '_blank')}
                                className="absolute -left-20 top-2 p-3 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/20 transition-all duration-300 group"
                            >
                                <Trophy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Leaderboard</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* Right Side: Invite / Multiplayer Button */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => setIsMultiplayerOpen(true)}
                                className="absolute -right-20 top-2 p-3 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-teal-400 hover:bg-teal-400/10 hover:border-teal-400/20 transition-all duration-300 group shadow-lg shadow-black/20"
                            >
                                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>Challenge a Friend</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* Config Options - Fade out when active */}
                <div className={cn(
                    "flex gap-2 bg-secondary/30 p-1 rounded-full backdrop-blur-md border border-white/5 transition-all duration-500 ease-in-out",
                    isActive ? "opacity-0 pointer-events-none translate-y-[-10px]" : "opacity-100 translate-y-0"
                )}>
                    {/* Mode Selector */}
                    <div className="flex items-center gap-1 pr-2 border-r border-white/10 mr-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => setMode('words')}
                                        className={cn(
                                            "flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1 rounded-full",
                                            mode === 'words' ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <Type className="w-3.5 h-3.5" />
                                        <span className="sr-only">words</span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Words</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => setMode('sentences')}
                                        className={cn(
                                            "flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1 rounded-full",
                                            mode === 'sentences' ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <AlignLeft className="w-3.5 h-3.5" />
                                        <span className="sr-only">sentences</span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Sentences</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={() => setMode('paragraphs')}
                                        className={cn(
                                            "flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1 rounded-full",
                                            mode === 'paragraphs' ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <span className="font-serif">¶</span>
                                        <span className="sr-only">paragraphs</span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Paragraphs</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {[15, 30, 60].map(time => (
                        <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                                "text-sm font-mono transition-all duration-200 px-3 py-1 rounded-full",
                                selectedTime === time ? "bg-primary/20 text-primary font-bold shadow-glow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {time}s
                        </button>
                    ))}
                    <div className="w-[1px] h-4 bg-white/10 mx-2 self-center" />

                    {/* Only show Punctuation/Numbers toggle in Words mode */}
                    {mode === 'words' && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIncludeNumbers(!includeNumbers)}
                                className={cn(
                                    "flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1 rounded-full",
                                    includeNumbers ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Hash className="w-3.5 h-3.5" />
                                <span className="sr-only">numbers</span>
                            </button>
                            <button
                                onClick={() => setIncludePunctuation(!includePunctuation)}
                                className={cn(
                                    "flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1 rounded-full",
                                    includePunctuation ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <span className="font-mono font-bold text-xs">@</span>
                                <span className="sr-only">punctuation</span>
                            </button>
                        </div>
                    )}

                    {/* Difficulty UI for All Modes */}
                    <div className="flex items-center gap-1">
                        {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                            <button
                                key={level}
                                onClick={() => setDifficulty(level)}
                                className={cn(
                                    "text-xs font-medium transition-colors px-2.5 py-1 rounded-full capitalize",
                                    difficulty === level ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Live Stats - ALWAYS VISIBLE (but subtle) */}
                <div className="flex items-center gap-6 text-xl font-mono transition-opacity duration-300">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50">Time</span>
                        <span className="text-primary font-bold text-2xl">{timeLeft}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50">WPM</span>
                        <span className="text-foreground font-bold text-2xl">{wpm}</span>
                    </div>
                </div>
            </div>

            {/* Results Modal */}
            <TestResults
                open={isFinished}
                onOpenChange={setIsFinished}
                stats={{
                    wpm,
                    accuracy,
                    errorCount,
                    time: selectedTime,
                    history
                }}
                onRestart={resetTest}
            />

            {/* Multiplayer Modal */}
            <MultiplayerModal open={isMultiplayerOpen} onOpenChange={setIsMultiplayerOpen} />

            {/* Typing Area - 5 Lines Fixed Height (approx 20rem/320px) with overflow-hidden */}
            <div
                ref={containerRef}
                className={cn(
                    "relative h-[280px] w-full overflow-hidden flex items-start justify-start text-3xl leading-[4rem] tracking-wide font-mono outline-none cursor-default rounded-xl bg-black/20 p-4 border border-white/5",
                    isFinished ? "blur-sm opacity-50 grayscale pointer-events-none" : ""
                )}
            >
                {/* Text Display */}
                <div
                    className="relative z-10 break-words pointer-events-none select-none w-full whitespace-pre-wrap tracking-wide"
                    style={{ wordSpacing: '0.1em' }}
                >
                    {renderText()}
                </div>

                {/* Hidden Input field to capture typing */}
                <input
                    ref={inputRef}
                    type="text"
                    className="absolute opacity-0 inset-0 cursor-default"
                    value={userInput}
                    onChange={handleInputChange}
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    disabled={isFinished}
                />
            </div>


            <div className="flex justify-center pt-8">
                <Button variant="ghost" size="lg" onClick={resetTest} className="opacity-50 hover:opacity-100 transition-opacity">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Restart Test
                </Button>
            </div>
        </div>
    );
};

export default TypingTest;