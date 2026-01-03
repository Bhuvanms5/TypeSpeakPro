import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Loader2, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MultiplayerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const MultiplayerModal = ({ open, onOpenChange }: MultiplayerModalProps) => {
    const [roomCode, setRoomCode] = useState<string>("");
    const [generatedCode, setGeneratedCode] = useState<string>("");
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [activeTab, setActiveTab] = useState("create");

    // Mock function to generate code
    const handleCreateRoom = () => {
        setIsCreating(true);
        // Simulate API call delay
        setTimeout(() => {
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            setGeneratedCode(code);
            setIsCreating(false);
            toast.success("Room created! Share the code.");
        }, 1000);
    };

    const handleJoinRoom = () => {
        if (!roomCode || roomCode.length < 4) {
            toast.error("Please enter a valid room code");
            return;
        }
        setIsJoining(true);
        // Simulate join delay
        setTimeout(() => {
            setIsJoining(false);
            toast.success("Joined room successfully!");
            onOpenChange(false);
            // TODO: Navigate or setup game state
        }, 1500);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCode);
        toast.success("Room code copied!");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-[#0f172a] border-white/10 p-0 overflow-hidden gap-0">
                {/* Header Section with Gradient */}
                <div className="relative p-6 bg-gradient-to-b from-primary/10 to-transparent">
                    <DialogHeader className="relative z-10">
                        <div className="mx-auto bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-primary/20 shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <DialogTitle className="text-center text-xl font-bold tracking-tight">Multiplayer Arena</DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground">
                            Challenge your friends to a real-time typing race.
                        </DialogDescription>
                    </DialogHeader>
                    {/* Background blob */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="p-6 pt-2">
                    <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
                            <TabsTrigger value="create">Create Room</TabsTrigger>
                            <TabsTrigger value="join">Join Room</TabsTrigger>
                        </TabsList>

                        {/* Create Room Tab */}
                        <TabsContent value="create" className="space-y-4 focus-visible:ring-0 outline-none">
                            <div className="flex flex-col items-center justify-center space-y-4 min-h-[200px] border border-dashed border-white/10 rounded-xl bg-black/20 p-6">
                                {!generatedCode ? (
                                    <div className="text-center space-y-4">
                                        <p className="text-sm text-muted-foreground">Generate a unique code to invite your friend.</p>
                                        <Button
                                            onClick={handleCreateRoom}
                                            disabled={isCreating}
                                            className="min-w-[140px]"
                                        >
                                            {isCreating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                "Generate Code"
                                            )}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="w-full space-y-6 animate-in fade-in zoom-in duration-300">
                                        <div className="text-center">
                                            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Room Code</p>
                                            <div
                                                className="flex items-center justify-center gap-3 bg-secondary/50 border border-primary/20 rounded-xl p-4 cursor-pointer hover:bg-secondary/70 transition-colors group"
                                                onClick={copyToClipboard}
                                            >
                                                <span className="text-3xl font-mono font-bold text-primary tracking-[0.2em]">{generatedCode}</span>
                                                <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mt-2">Click to copy</p>
                                        </div>

                                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-yellow-500/5 p-3 rounded-lg border border-yellow-500/10">
                                            <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
                                            <span>Waiting for opponent to join...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Join Room Tab */}
                        <TabsContent value="join" className="space-y-4 focus-visible:ring-0 outline-none">
                            <div className="flex flex-col space-y-4 min-h-[200px] justify-center">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground pl-1">Room Code</label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Ex: X7K9P2"
                                            value={roomCode}
                                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                            className="text-center font-mono text-xl tracking-widest uppercase h-14 bg-secondary/30 border-white/10 focus:border-primary/50"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>
                                <Button
                                    className="w-full h-12 text-lg font-medium"
                                    onClick={handleJoinRoom}
                                    disabled={isJoining || roomCode.length < 3}
                                >
                                    {isJoining ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            Join Match
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MultiplayerModal;
