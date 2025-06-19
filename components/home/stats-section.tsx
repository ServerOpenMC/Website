import { Gamepad2, Heart, Sparkles, Users } from "lucide-react";

export default function StatsSection() {
  const stats = [
    { number: "34+", label: "Contributeurs", icon: Users },
    { number: "7+", label: "Répertoires", icon: Gamepad2 },
    { number: "1M+", label: "Téléchargements", icon: Sparkles },
    { number: "99%", label: "Satisfaction", icon: Heart },
  ];

  return (
    <section className="flex flex-col items-center justify-center py-20 w-full px-4">
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
          Quelques Chiffres Clés
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Découvrez les statistiques qui témoignent de notre engagement et de
          notre croissance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl">
        {stats.map((item, i) => (
          <div key={i} className="relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="unified-card-simple p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                  <item.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <p className="text-4xl lg:text-5xl font-extrabold text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                {item.number}
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
