import { ArrowRightIcon, HeartIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/magicui/dot-pattern";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import homePageImage from "@/public/placeholder/homepage.webp";

export default function HeroSection() {
  return (
    <div className="relative px-4 sm:px-6 lg:px-8">
      <DotPattern
        className={cn(
          "absolute inset-0 -z-10 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        )}
      />
      <section className="flex flex-col items-center justify-center gap-8 sm:pb-28 md:pb-32 pt-10">
        <div className="w-full max-w-4xl">
          <div className="z-10 flex items-center justify-center mb-8">
            <div
              className={cn(
                "group inline-flex items-center gap-2 rounded-full glass-effect px-6 py-3 text-sm font-medium transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-background hover:scale-105 hover:border-primary/40"
              )}
            >
              <Link
                href="https://github.com/ServerOpenMC/"
                target="_blank"
                className="flex items-center gap-2"
              >
                <span className="text-lg">✨</span>
                <span>Open-Source</span>
                <ArrowRightIcon className="size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="text-center px-2">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto mb-6">
              Votre Serveur Minecraft Open-Source
            </h1>
            <p className="text-base sm:text-lg max-w-xl mx-auto tracking-tight text-muted-foreground mb-8">
              OpenMC est un projet communautaire open-source dédié à la création
              d&apos;un serveur Minecraft innovant et collaboratif.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="unified-button-primary group"
                asChild
              >
                <Link href="/join">
                  Rejoindre le Serveur
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="unified-button-secondary group"
                asChild
              >
                <Link href="https://github.com/ServerOpenMC/" target="_blank">
                  Contribuer
                  <HeartIcon className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 w-full max-w-5xl relative">
          <div className="relative rounded-3xl overflow-hidden shadow-light-2xl hover:shadow-light-2xl transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            <Image
              src={homePageImage}
              alt="OpenMC Gameplay"
              width={1280}
              height={720}
              quality={100}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none" />
          </div>
        </div>
      </section>
    </div>
  );
}
