"use client";

import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroSection() {
  const { scrollY } = useScroll();

  const textScale = useTransform(scrollY, [0, 400], [1, 0.8]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0.6]);
  const textY = useTransform(scrollY, [0, 400], [0, -20]);

  return (
    <motion.div
      className="w-full max-w-4xl"
      style={{
        scale: textScale,
        opacity: textOpacity,
        y: textY,
      }}
    >
      <motion.div
        className="z-10 flex items-center justify-center mb-2"
        style={{
          scale: textScale,
        }}
      >
        <div
          className={cn(
            "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-card dark:hover:bg-bg-card/50"
          )}
        >
          <Link href="https://github.com/ServerOpenMC/" target="_blank">
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span>Open-Source</span>
              <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedShinyText>
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="text-center px-2"
        style={{
          scale: textScale,
        }}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-dark max-w-3xl mx-auto">
          Votre Serveur Minecraft Open-Source
        </h1>
        <p className="mt-4 leading-7 text-base sm:text-lg max-w-xl mx-auto tracking-tight text-muted-foreground">
          OpenMC est un projet communautaire open-source dédié à la création
          d&apos;un serveur Minecraft innovant et collaboratif auquel vous pouvez jouer avec vos amis.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button className="group w-full sm:w-auto" asChild>
            <Link href="/join">
              Rejoindre le Serveur
              <ArrowRightIcon
                className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                size={16}
                aria-hidden="true"
              />
            </Link>
          </Button>
          <Button
            variant="secondary"
            className="group w-full sm:w-auto"
            asChild
          >
            <Link
              href="https://github.com/ServerOpenMC/"
              target="_blank"
              className="flex items-center"
            >
              Contribuer
              <Heart className="ml-1 w-4 h-4 opacity-60 transition-transform heart-icon" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
