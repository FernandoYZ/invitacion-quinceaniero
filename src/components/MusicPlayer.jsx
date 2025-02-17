import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';

const PRELOAD_DELAY = 300;
const formatTime = (time) => {
    const mins = Math.floor(time / 60) || 0;
    const secs = Math.floor(time % 60) || 0;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const MusicPlayer = React.memo(({ audioUrl, songTitle = 'Canción', artist = 'Artista' }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    
    const audioRef = useRef(null);
    const rafId = useRef(null);
    const duration = useRef(0);
    const isDragging = useRef(false);
    
    const updateTime = useCallback(() => {
        if (isDragging.current || !audioRef.current) return;
        
        if (!rafId.current) {
            rafId.current = requestAnimationFrame(() => {
                setCurrentTime(audioRef.current?.currentTime || 0);
                rafId.current = null;
            });
        }
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedData = () => {
            duration.current = audio.duration;
            audio.playbackRate = 1.0;
        };
        
        audio.addEventListener('loadeddata', handleLoadedData);
        audio.addEventListener('timeupdate', updateTime);
        
        audio.preload = 'metadata';
        const loadTimer = setTimeout(() => audio.load(), PRELOAD_DELAY);

        return () => {
            audio.removeEventListener('loadeddata', handleLoadedData);
            audio.removeEventListener('timeupdate', updateTime);
            if (rafId.current) cancelAnimationFrame(rafId.current);
            clearTimeout(loadTimer);
            audio.pause();
        };
    }, [audioUrl, updateTime]);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            requestAnimationFrame(() => {
                audio.play().catch(() => {});
            });
        }
        setIsPlaying(p => !p);
    }, [isPlaying]);

    const handleTimeChange = useCallback((e) => {
        const audio = audioRef.current;
        if (!audio) return;
        
        const time = Number(e.target.value);
        isDragging.current = true;
        
        requestAnimationFrame(() => {
            audio.currentTime = time;
            setCurrentTime(time);
            isDragging.current = false;
        });
    }, []);

    const progress = (currentTime / (duration.current || 1)) * 100;

    return (
        <section className="flex flex-col items-center justify-center min-h-[200px] w-full px-4 bg-transparent">
            <div className="max-w-md w-full rounded-2xl p-4">
                <audio ref={audioRef} src={audioUrl} />
                
                <div className="flex flex-col items-center text-center mb-12">
                    <h2 className="text-2xl font-light text-gray-800 mb-1">
                        {songTitle}
                    </h2>
                    <p className="text-lg uppercase font-light text-gray-500">
                        {artist}
                    </p>
                </div>

                <div className="space-y-2 mb-4"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}>
                    <div className="relative h-1.5 bg-primary/20 rounded-full overflow-hidden">
                        <div 
                            className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary transition-[width] duration-150"
                            style={{ width: `${progress}%` }}
                        />
                        <input
                            type="range"
                            min="0"
                            max={duration.current || 0}
                            value={currentTime}
                            onChange={handleTimeChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            aria-label="Barra de progreso"
                        />
                    </div>

                    <div className={`flex justify-between text-sm text-primary/90 transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-60'}`}>
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration.current)}</span>
                    </div>
                </div>

                <div className="flex justify-center -mt-6">
                    <button 
                        onClick={togglePlay}
                        className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white hover:scale-105 transition-all duration-200 shadow-md"
                        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                    >
                        {isPlaying ? <Pause size={42} /> : <Play size={42} />}
                    </button>
                </div>
            </div>
        </section>
    );
});

MusicPlayer.displayName = 'MusicPlayer';

export default MusicPlayer;