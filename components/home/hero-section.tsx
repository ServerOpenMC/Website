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
      <section className="flex flex-col items-center justify-center gap-8   sm:pb-28 md:pb-32 pt-10">
        <div className="w-full max-w-4xl">
          <div className="z-10 flex items-center justify-center mb-2">
            <div
              className={cn(
                "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              )}
            >
              <Link href="https://github.com/ServerOpenMC/" target="_blank">
                <span>✨ Open-Source</span>
                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
          <div className="text-center px-2">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-dark max-w-3xl mx-auto">
              Votre Serveur Minecraft Open-Source
            </h1>
            <p className="mt-4 leading-7 text-base sm:text-lg max-w-xl mx-auto tracking-tight text-muted-foreground">
              OpenMC est un projet communautaire open-source dédié à la création
              d&apos;un serveur Minecraft innovant et collaboratif.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/join" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">
                  Rejoindre le Serveur
                  <ArrowRightIcon
                    className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              </Link>
              <Link
                href="https://github.com/ServerOpenMC/"
                target="_blank"
                className="w-full sm:w-auto"
              >
                <Button variant="secondary" className="group w-full sm:w-auto">
                  Contribuer
                  <HeartIcon />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 w-full max-w-5xl relative rounded-4xl overflow-hidden">
          <Image
            src={homePageImage}
            alt="OpenMC Gameplay"
            width={1280}
            height={720}
            quality={100}
            className="w-full h-auto rounded-4xl object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
