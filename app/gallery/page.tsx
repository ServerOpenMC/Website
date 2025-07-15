"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const assetPrefix = process.env.NODE_ENV === 'production' ? '/Website' : '';

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  description: string;
  category: "builds" | "events" | "landscapes" | "community";
  date: string;
  author: string;
  location?: string;
  participants?: number;
}

const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: `${assetPrefix}/placeholder/homepage.webp`,
    title: "Château Medieval",
    description:
      "Une magnifique construction médiévale réalisée par la communauté lors de l'événement Build Battle.",
    category: "builds",
    date: "2024-12-15",
    author: "BuildMaster",
    location: "Spawn Nord",
  },
  {
    id: "2",
    src: `${assetPrefix}/placeholder/background_omc.png`,
    title: "Paysage de Montagne",
    description:
      "Vue panoramique depuis les montagnes du serveur, capturée au coucher du soleil.",
    category: "landscapes",
    date: "2024-12-10",
    author: "NatureExplorer",
    location: "Montagnes Est",
  },
  {
    id: "3",
    src: `${assetPrefix}/placeholder/homepage.webp`,
    title: "Événement Communautaire",
    description:
      "Grand rassemblement de la communauté pour célébrer l'anniversaire du serveur.",
    category: "events",
    date: "2024-12-01",
    author: "EventOrganizer",
    participants: 45,
  },
  {
    id: "4",
    src: `${assetPrefix}/placeholder/background_omc.png`,
    title: "Ville Moderne",
    description:
      "Centre-ville avec ses gratte-ciels et son architecture contemporaine.",
    category: "builds",
    date: "2024-11-28",
    author: "CityBuilder",
    location: "District Central",
  },
  {
    id: "5",
    src: `${assetPrefix}/placeholder/homepage.webp`,
    title: "Festival des Lumières",
    description:
      "Spectacle de feux d'artifice lors du festival annuel des lumières.",
    category: "events",
    date: "2024-11-20",
    author: "FestivalTeam",
    participants: 67,
  },
  {
    id: "6",
    src: `${assetPrefix}/placeholder/background_omc.png`,
    title: "Base Spatiale",
    description:
      "Complexe spatial futuriste avec station de lancement et laboratoires.",
    category: "builds",
    date: "2024-11-15",
    author: "SpaceArchitect",
    location: "Zone Technique",
  },
];

const categories = [
  { key: "all", label: "Tout", icon: "🏞️" },
  { key: "builds", label: "Constructions", icon: "🏗️" },
  { key: "events", label: "Événements", icon: "🎉" },
  { key: "landscapes", label: "Paysages", icon: "🌄" },
  { key: "community", label: "Communauté", icon: "👥" },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const openModal = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? (currentIndex - 1 + filteredImages.length) % filteredImages.length
        : (currentIndex + 1) % filteredImages.length;

    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      builds: "bg-blue-500/10 text-blue-600 border-blue-500",
      events: "bg-purple-500/10 text-purple-600 border-purple-500",
      landscapes: "bg-green-500/10 text-green-600 border-green-500",
      community: "bg-orange-500/10 text-orange-600 border-orange-500",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-500/10 text-gray-600 border-gray-500"
    );
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Galerie <span className="text-primary">OpenMC</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez les plus belles créations, événements et moments de
              notre communauté Minecraft
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={
                selectedCategory === category.key ? "default" : "outline"
              }
              size="sm"
              onClick={() => {
                setIsAnimating(true);
                setSelectedCategory(category.key);
                setTimeout(() => setIsAnimating(false), 500);
              }}
              className="gap-2"
            >
              <span>{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layoutId={`card-${image.id}`}
                className={`group cursor-pointer ${!isAnimating ? 'hover:-translate-y-2 transition-transform duration-200' : ''}`}
                onClick={() => openModal(image, index)}
              >
                <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg py-0">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110 "
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>

                  <CardContent className="p-4">
                    <Badge
                      className={`${getCategoryColor(
                        image.category
                      )} mb-2 w-fit`}
                    >
                      {
                        categories.find((cat) => cat.key === image.category)
                          ?.icon
                      }{" "}
                      {
                        categories.find((cat) => cat.key === image.category)
                          ?.label
                      }
                    </Badge>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {image.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {image.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(image.date).toLocaleDateString("fr-FR")}
                      </div>
                      <span className="font-medium">@{image.author}</span>
                    </div>

                    {image.location && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {image.location}
                      </div>
                    )}

                    {image.participants && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        {image.participants} participants
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground text-lg">
              Aucune image trouvée dans cette catégorie.
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full bg-background rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent z-10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(selectedImage.category)}>
                      {
                        categories.find(
                          (cat) => cat.key === selectedImage.category
                        )?.icon
                      }{" "}
                      {
                        categories.find(
                          (cat) => cat.key === selectedImage.category
                        )?.label
                      }
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={closeModal}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="relative aspect-video">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  fill
                  className="object-cover"
                />
              </div>

              {filteredImages.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={() => navigateImage("prev")}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={() => navigateImage("next")}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">
                  {selectedImage.title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {selectedImage.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedImage.date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div>
                    <span className="font-medium">
                      Par @{selectedImage.author}
                    </span>
                  </div>
                  {selectedImage.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedImage.location}
                    </div>
                  )}
                  {selectedImage.participants && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedImage.participants} participants
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
