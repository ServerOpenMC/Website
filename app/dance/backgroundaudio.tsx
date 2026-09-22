"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

type BackgroundAudioProps = {
  onStateChange: (isPlaying: boolean) => void;
};

export default function BackgroundAudio({
  onStateChange,
}: BackgroundAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);

  const audioSrc = `./songs/jonasblakewood-dance-pop.mp3`;

  const setPlaying = (playing: boolean) => {
    setIsPlaying(playing);
    onStateChange(playing);
  };

  const play = async () => {
    try {
      await audioRef.current?.play();
      setPlaying(true);
    } catch {}
  }

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      play();
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  const toggleMute = () => {
    setVolume(volume === 0 ? 0.4 : 0);
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  useEffect(() => {
    const handleInteraction = () => {
      play();
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };

    play();

    window.addEventListener("pointerdown", handleInteraction);
    window.addEventListener("keydown", handleInteraction);

    return () => {
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />

      <div className="fixed bottom-20 right-4 z-50 flex items-center gap-3 bg-background/80 backdrop-blur-md border border-border p-2 px-4 rounded-full shadow-lg text-foreground text-sm">

        <button
          onClick={togglePlay}
          className="inline-flex items-center gap-2 hover:text-primary transition-colors focus:outline-none"
          title={isPlaying ? "Mettre en pause" : "Lancer la musique"}
          aria-label={isPlaying ? "Mettre en pause" : "Lancer la musique"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span>{isPlaying ? "Pause" : "Jouer"}</span>
        </button>

        <span className="text-border">|</span>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="hover:text-primary transition-colors focus:outline-none"
            title={volume === 0 ? "Activer le son" : "Coupure du son"}
            aria-label={volume === 0 ? "Activer le son" : "Coupure du son"}
          >
            {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            title="Ajuster le volume"
          />
        </div>
      </div>
    </>
  );
}