# Site Web OpenMC 🔗

OpenMC est un projet communautaire open-source dédié à la création d'un serveur Minecraft innovant et collaboratif.

<a href="https://github.com/ServerOpenMC/Website/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ServerOpenMC/Website" alt="Contributeurs" />
</a>

## 🤝 Comment contribuer

1. Forkez ce dépôt en cliquant sur le bouton "Fork" en haut à droite de la page GitHub.
2. Forkez le dépôt et rejoignez la [communauté Discord](https://discord.gg/aywen-communaute-1161296442577653802).
3. Suivez les directives dans [CONTRIBUTING.md](https://github.com/ServerOpenMC/Website/blob/main/CONTRIBUTING.md).
4. Avant de créer une pull request, vérifiez que le code se build correctement :
   ```bash
   $ npm run build
   ```
   Si des erreurs ou des warnings apparaissent, corrigez-les.
5. Une fois une fonctionnalité implémentée et fonctionnelle, créez une pull request.
6. Après approbation, la fonctionnalité sera disponible sur le serveur de développement pour des tests.

- **IP du serveur** : `play.openmc.fr` (Minecraft Java Edition 26.2)
- **Site web** : [openmc.fr](https://openmc.fr)

## 🚧 Démarrage

### Prérequis

- **Node.js >20** est requis.

### Étapes

1. Cloner ce répo :
   ```bash
   $ git clone https://github.com/ServerOpenMC/Website.git
   ```
2. Installez les dépendances :
   ```bash
   $ cd Website
   $ npm install
   ```
3. Lancez le serveur de développement :
   ```bash
   $ npm run dev
   ```

## 🛠️ Technologies utilisées

- **Next.js** : Framework React pour le rendu côté serveur et la génération de sites statiques.
- **Tailwind CSS** : Framework CSS utilitaire pour un design rapide et réactif.
- **Shadcn UI** : Primitives UI pour des composants accessibles et stylisés.
- **TypeScript** : Superset de JavaScript pour un typage statique.
- **ESLint** : Linter pour maintenir un code propre et cohérent.

## 📃 Licence

Ce projet est sous licence [GPL-3.0 License](https://choosealicense.com/licenses/gpl-3.0/).
