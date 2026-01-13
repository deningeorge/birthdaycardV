"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Gift, Loader2, RotateCcw, PartyPopper } from "lucide-react";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";

const ConfettiFall = () => {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            duration: 5 + Math.random() * 5,
            delay: Math.random() * 5,
            size: 4 + Math.random() * 6,
            color: ["#FF69B4", "#FFD700", "#FFFDD0"][Math.floor(Math.random() * 3)]
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full opacity-60"
                    style={{
                        backgroundColor: p.color,
                        width: p.size,
                        height: p.size,
                        left: p.left
                    }}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: "110vh", opacity: [0, 0.8, 0] }}
                    transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
                />
            ))}
        </div>
    );
};

export default function CardClientContent() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const [isVideoLoaded, setIsVideoLoaded] = useState(true);
    const [isAudioLoaded, setIsAudioLoaded] = useState(true);
    const [recipientName, setRecipientName] = useState("Valeria");

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const searchParams = useSearchParams();
    const userId = searchParams.get("id");

    useEffect(() => {
        if (userId) {
            setRecipientName(userId.charAt(0).toUpperCase() + userId.slice(1));
        }
    }, [userId]);

    useEffect(() => {
        const playAudio = async () => {
            if (audioRef.current) {
                audioRef.current.volume = 0.5;
                try {
                    await audioRef.current.play();
                    setIsMuted(false);
                } catch (error) {
                    console.log("Auto-play failed:", error);
                    setIsMuted(true);
                }
            }
        };
        playAudio();
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
        setIsMuted(false);

        const colors = ["#FF69B4", "#FFD700", "#4169E1"];
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors });
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            audioRef.current.play().catch(() => console.log("Audio play failed"));
        }
    };

    const handleReplay = () => {
        setIsOpen(false);
        setIsMuted(true);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isMuted) audioRef.current.play();
            else audioRef.current.pause();
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="relative h-[100dvh] w-full flex items-center justify-center bg-party-blue overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/background.jpg"
                    alt="Birthday Background"
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-party-blue via-purple-500 to-party-pink opacity-50 z-0" />

            <audio ref={audioRef} loop src="/music/music.mp3" />
            <ConfettiFall />

            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.div
                        key="cover"
                        className="z-30 flex flex-col items-center justify-center h-full w-full p-8 text-center"
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Main Curvy Box */}
                        <div className="flex flex-col items-center gap-6 p-10 bg-white/5 rounded-[2rem] border border-white/20 shadow-2xl">
                            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                                <Gift className="w-16 h-16 text-party-yellow drop-shadow-lg" />
                            </motion.div>

                            <h1 className="font-serif text-5xl text-party-cream font-bold">A Special<br />Birthday Wish</h1>
                            <p className="font-serif text-xl text-party-yellow">for {recipientName}</p>

                            <button
                                onClick={handleOpen}
                                className="mt-4 px-10 py-4 rounded-full font-bold text-lg text-white bg-party-pink hover:bg-pink-500 shadow-lg animate-partyPulse transition-all"
                            >
                                OPEN CARD
                            </button>
                        </div>

                        {/* Handcrafted Signature */}
                        <motion.p className="mt-6 text-white/60 text-xs tracking-[0.2em] uppercase font-light"
                        >
                            Handcrafted & Coded with Love
                        </motion.p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="message"
                        className="z-30 flex flex-col items-center max-w-md p-8 text-center bg-white/5 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button onClick={handleReplay} className="text-white/70 hover:text-white">
                                <RotateCcw />
                            </button>
                            <button onClick={toggleAudio} className="text-white/70 hover:text-white">
                                {isMuted ? <VolumeX /> : <Volume2 />}
                            </button>
                        </div>
                        <PartyPopper className="w-12 h-12 text-party-yellow mb-4" />
                        <h2 className="font-serif text-3xl text-party-cream mb-2">Happy Birthday,</h2>
                        <h2 className="font-serif text-5xl text-party-yellow font-bold mb-6">{recipientName}!</h2>

                        <p className="text-white/90 italic leading-relaxed mb-6">
                            You are truly the most beautiful, sweet, joyful person I know 💕🌸 You have such a unique, interesting, and delightful personality—it really stands out ✨😊
                            <br /><br />
                            Wishing you a year filled with laughter, love, and all your favorite things 🎉💖 May it bring new adventures, lasting joy, and wonderful moments ahead 🌍✨ May God bless you with everything your heart desires 🙏
                        </p>

                        {/* Bible Verse Section */}
                        <div className="mb-8 px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-party-yellow font-serif italic text-sm leading-relaxed">
                                "The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you; the Lord turn his face toward you and give you peace."
                            </p>
                            <p className="text-white/80 text-[10px] mt-2 uppercase tracking-tighter">— Numbers 6:24-26</p>
                        </div>

                        <div className="text-sm text-white/50 tracking-widest uppercase">— Sent with Love ❤️ </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}