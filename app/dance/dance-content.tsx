"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import BackgroundAudio from "./backgroundaudio";

type GitHubUser = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
};


type DanceContentProps = {
  contributors: GitHubUser[];
};

export default function DanceContent({ contributors }: DanceContentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
      }
    };
  }, []);

  const handleAudioStateChange = useCallback((playing: boolean) => {
    setIsPlaying(playing);

    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }

    if (playing) {
      setIsStopping(false);
      return;
    }

    setIsStopping(true);
    stopTimeoutRef.current = setTimeout(() => {
      setIsStopping(false);
      stopTimeoutRef.current = null;
    }, 1200);
  }, []);

  return (
    <>
      <BackgroundAudio onStateChange={handleAudioStateChange} />

      <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
        {contributors.map((user, index) => {
          const delay = `${(index % 5) * 0.25}s`;

          return (
            <a
              key={user.id}
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`relative w-20 h-20 transition-transform ${
                  isPlaying
                    ? "animate-dance"
                    : isStopping
                      ? "animate-dance dance-stopping"
                      : ""
                }`}
                style={{ animationDelay: delay }}
              >
                <Image
                  src={user.avatar_url}
                  alt={user.login}
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-primary object-cover"
                  unoptimized
                />
              </div>
              <span className="text-xs mt-2 font-mono text-muted-foreground group-hover:text-primary transition-colors">
                {user.login}
              </span>
            </a>
          );
        })}
      </div>
    </>
  );
}