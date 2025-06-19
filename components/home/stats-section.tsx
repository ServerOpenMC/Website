import { Gamepad2, Heart, Sparkles, Users } from "lucide-react";

export default function StatsSection() {
  const stats = [
    { number: "34+", label: "Contributeurs", icon: Users },
    { number: "7+", label: "Répertoires", icon: Gamepad2 },
    { number: "1M+", label: "Téléchargements", icon: Sparkles },
    { number: "99%", label: "Satisfaction", icon: Heart },
  ];

  return (
    <section className="flex flex-col items-center justify-center py-16 w-full px-4">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-center">
        Quelques Chiffres Clés
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10 w-full max-w-5xl">
        {stats.map((item, i) => (
          <div
            key={i}
            className="text-center group hover:scale-105 transition-transform duration-300"
          >
            <div className="flex justify-center mb-3">
              <item.icon className="w-8 h-8 text-primary group-hover:text-primary/80 transition-colors duration-300" />
            </div>
            <p className="text-4xl font-extrabold text-primary">
              {item.number}
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
