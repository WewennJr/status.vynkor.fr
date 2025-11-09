# 📊 status.vynkor.fr

> Page de statut en temps réel pour surveiller tous les services de vynkor.fr

🔗 **[Voir le statut](https://status.vynkor.fr)**

## Fonctionnalités

- ✅ Vérification en temps réel de tous les services
- ⚡ Temps de réponse et uptime pour chaque service
- 🔄 Auto-refresh toutes les 2 minutes
- 📱 Responsive

## Services surveillés

- 🏠 [vynkor.fr](https://vynkor.fr) - Site principal
- 👔 [cv.vynkor.fr](https://cv.vynkor.fr) - Portfolio & CV
- 🎮 [zeta.vynkor.fr](https://zeta.vynkor.fr) - Jeux et projets
- 🔧 [convertisseur.vynkor.fr](https://convertisseur.vynkor.fr) - Outils

## Utiliser cette page pour vos services

### 1. Cloner le projet

```bash
git clone https://github.com/vynkor/status.vynkor.fr.git
cd status.vynkor.fr
```

### 2. Modifier les services

Ouvrez `index.html` et trouvez le tableau `services` (ligne ~230) :

```javascript
const services = [
    {
        name: 'Votre service',
        icon: '🌐',  // Émoji de votre choix
        url: 'https://votresite.com',
        description: 'Description de votre service'
    },
    {
        name: 'Autre service',
        icon: '⚡',
        url: 'https://api.votresite.com',
        description: 'Votre API'
    }
    // Ajoutez autant de services que vous voulez
];
```

### 3. Personnaliser (optionnel)

- **Titre** : Ligne ~87, modifiez `<h1>📊 Status des Services</h1>`
- **Couleurs** : Cherchez les codes couleur dans le CSS (`#8b5cf6`, `#ec4899`, etc.)
- **Interval de refresh** : Ligne ~397, modifiez `120000` (en millisecondes)

### 4. Déployer

Uploadez le fichier `index.html` sur votre hébergeur ou utilisez :
- Netlify / Vercel (gratuit)
- GitHub Pages
- Votre serveur web

## Technologies

- HTML/CSS/JavaScript vanilla
- Aucune dépendance
- 100% statique

## License

MIT

---

<div align="center">

**[Voir la page](https://status.vynkor.fr)** • **[Signaler un problème](https://github.com/vynkor/status.vynkor.fr/issues)** • **[Me contacter](mailto:contact@vynkor.fr)**

Made with ❤️ by Vynkor

</div>