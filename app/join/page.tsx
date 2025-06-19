"use client";

import { HomeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/branding/logoomc.png";
import { useState } from "react";

export default function Page() {
  const [copied, setCopied] = useState(false);
  const serverIP = "play.openmc.fr";

  const handleCopy = () => {
    navigator.clipboard.writeText(serverIP).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Image
        src={Logo}
        alt="Logo du serveur"
        width={120}
        height={120}
        className="mb-6"
      />
      <h1 className="text-5xl font-extrabold text-center text-gray-800 dark:text-gray-100">
        Rejoindre le Serveur Minecraft
      </h1>
      <p className="mt-4 text-lg text-center text-gray-600 dark:text-gray-400">
        Connecte-toi et viens construire avec nous ! 🎮
      </p>

      <div className="mt-8 bg-primary/70 dark:bg-primary/10 text-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Adresse du serveur
        </h2>
        <div className="dark:bg-black bg-white rounded-md p-4 font-mono text-lg dark:text-white text-black text-left border border-gray-700 mb-4">
          {serverIP}
        </div>
        <button
          onClick={handleCopy}
          className="w-full bg-primary/100 hover:bg-primary/80 text-white font-semibold py-2 rounded transition"
        >
          {copied ? "Copié !" : "Copier l'IP"}
        </button>
      </div>
    </div>
  );
}
