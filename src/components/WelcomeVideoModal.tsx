import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Play, Youtube } from 'lucide-react';

const WelcomeVideoModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeVideo');
        if (!hasSeenWelcome) {
            // Small delay for better UX on initial load
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem('hasSeenWelcomeVideo', 'true');
        }
        setIsOpen(false);
    };

    const handleWatchVideo = () => {
        window.open('https://youtu.be/qbzuCuDgluw?si=QNimHI4rgWQLAngr', '_blank');
        handleClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-neutral-900/90 border-white/10 backdrop-blur-xl text-white p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 [&>button]:hidden">
                {/* Visual Header */}
                <div className="relative h-48 bg-gradient-to-br from-teal-500/20 via-purple-500/20 to-neutral-900 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 filter blur-sm"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>

                    <div className="relative z-10 flex flex-col items-center animate-bounce-slow">
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-3 shadow-[0_0_30px_rgba(20,184,166,0.3)]">
                            <Play className="w-6 h-6 text-white ml-1 fill-current" />
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                            Welcome to TypeSpeak
                        </h2>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Watch our quick demo to see how you can master typing and communication skills in one platform.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            className="w-full bg-[#FF0000] hover:bg-[#D90000] text-white border-none shadow-lg shadow-red-900/20 group h-12 text-base"
                            onClick={handleWatchVideo}
                        >
                            <Youtube className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            Watch Demo Video
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full text-neutral-400 hover:text-white hover:bg-white/5"
                            onClick={handleClose}
                        >
                            Maybe Later
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/5">
                        <Checkbox
                            id="dont-show"
                            checked={dontShowAgain}
                            onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                            className="border-white/20 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                        />
                        <label
                            htmlFor="dont-show"
                            className="text-xs text-neutral-500 cursor-pointer select-none hover:text-neutral-400 transition-colors"
                        >
                            Don't show this again
                        </label>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WelcomeVideoModal;
