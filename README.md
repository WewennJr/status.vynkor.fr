# 📊 status.vynkor.fr

> Page de statut en temps réel avec graphiques et historique pour surveiller tous les services de vynkor.fr

🔗 **[Voir le statut](https://status.vynkor.fr)**

## ✨ Fonctionnalités

- ✅ **Vérification en temps réel** de tous les services
- ⚡ **Temps de réponse** et disponibilité pour chaque service
- 📈 **Graphique Chart.js** avec historique des 20 derniers pings
- 🔄 **Auto-refresh** configurable (30s par défaut)
- 💾 **Historique persistant** sauvegardé en localStorage
- 🛠️ **Détection de maintenance** pour les services configurés
- 📊 **Barre de progression globale** de disponibilité
- 📱 **Responsive** mobile & desktop

## 🎯 Services surveillés

- 🏠 [vynkor.fr](https://vynkor.fr) - Site principal
- 👔 [cv.vynkor.fr](https://cv.vynkor.fr) - Portfolio & CV
- 🍽️ [resto.vynkor.fr](https://resto.vynkor.fr) - Site restaurant CTP1 R1.02
- 🎮 [zeta.vynkor.fr](https://zeta.vynkor.fr) - Jeux et projets
- 🔧 [convertisseur.vynkor.fr](https://convertisseur.vynkor.fr) - Outils

## 🚀 Utiliser cette page pour vos services

### 1. Cloner le projet

```bash
git clone https://github.com/vynkor/status.vynkor.fr.git
cd status.vynkor.fr
```

### 2. Modifier les services

Ouvrez `services.json` à la racine du projet :

```json
{
  "config": {
    "pingIntervalMs": 30000,
    "maxHistoryPoints": 20
  },
  "services": [
    {
      "name": "Votre service",
      "icon": "🌐",
      "url": "https://votresite.com",
      "color": "#10b981",
      "checkMaintenance": false
    },
    {
      "name": "Autre service",
      "icon": "⚡",
      "url": "https://api.votresite.com",
      "color": "#3b82f6",
      "checkMaintenance": true
    }
  ]
}
```

**Paramètres disponibles :**
- `name` : Nom affiché du service
- `icon` : Émoji représentant le service
- `url` : URL complète à surveiller
- `color` : Couleur hexadécimale pour le graphique
- `checkMaintenance` : `true` pour vérifier `/status/maintenance`

### 3. Configuration globale

Dans `services.json`, section `config` :

```json
{
  "config": {
    "pingIntervalMs": 30000,    // Intervalle entre pings (ms)
    "maxHistoryPoints": 20      // Points affichés sur le graphique
  }
}
```

### 5. Personnaliser le style (optionnel)

Dans `assets/style.css`, modifiez les couleurs principales :

```css
/* Couleur principale (violet) */
#8b5cf6

/* Couleur secondaire (rose) */
#ec4899

/* Statuts */
.operational { color: #10b981; }  /* Vert */
.degraded { color: #f59e0b; }     /* Orange */
.down { color: #ef4444; }         /* Rouge */
.maintenance { color: #3b82f6; }  /* Bleu */
```

### 6. Déployer

Uploadez tous les fichiers sur votre hébergeur :
- **Netlify / Vercel** (recommandé - gratuit)
- **GitHub Pages**
- **Cloudflare Pages**
- Votre serveur web classique

## 📁 Structure du projet

```
status.vynkor.fr/
├── index.html              # Page principale
├── assets/
│   ├── style.css          # Styles
│   └── script.js          # Logique et Chart.js
├── services.json          # Fichier de configuration
└── README.md              # Ce fichier
```

## 🎨 Statuts possibles

| Statut | Icône | Condition |
|--------|-------|-----------|
| ✅ **Opérationnel** | 🟢 | Temps de réponse < 5s |
| ⚠️ **Dégradé** | 🟠 | Temps de réponse > 5s |
| ❌ **Hors ligne** | 🔴 | Service inaccessible |
| 🛠️ **Maintenance** | 🔵 | Maintenance planifiée |

## 📊 Fonctionnement du graphique

- Affiche les **20 derniers pings** pour chaque service
- Calcule et affiche la **moyenne** (ligne pointillée blanche)
- Données sauvegardées en **localStorage** (persistance entre sessions)
- Animation fluide lors des mises à jour

## 🔧 Technologies

- **HTML5** - Structure
- **CSS3** - Design moderne
- **JavaScript Vanilla** - Logique
- **Chart.js** - Graphiques temps réel
- **LocalStorage** - Persistance des données

**Aucune dépendance serveur** - 100% statique et client-side

## ⚙️ Configuration avancée

### Changer les seuils de détection

Dans `assets/script.js`, fonction `checkService()` :

```javascript
// Ligne ~38
if (responseTime > 5000) {
    status = 'degraded';  // Modifier ce seuil (actuellement 5s)
}
```

### Désactiver l'historique localStorage

Commentez les lignes de sauvegarde :

```javascript
// localStorage.setItem('pingHistory', JSON.stringify(pingHistory));
// localStorage.setItem('timeLabels', JSON.stringify(timeLabels));
```

## 🐛 Dépannage

**Le graphique ne s'affiche pas ?**
- Vérifiez que Chart.js est bien chargé (CDN dans le HTML)
- Ouvrez la console navigateur pour voir les erreurs

**Les services apparaissent toujours "down" ?**
- C'est normal à cause des restrictions CORS en mode `no-cors`
- Le ping fonctionne quand même, mais impossible de lire la vraie réponse HTTP

**L'historique ne persiste pas ?**
- Vérifiez que localStorage est activé dans votre navigateur
- Certains modes privés bloquent localStorage

## 📝 License

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

<div align="center">

**[Voir la page](https://status.vynkor.fr)** • **[Signaler un problème](https://github.com/vynkor/status.vynkor.fr/issues)** • **[Me contacter](mailto:contact@vynkor.fr)**

Made with ❤️ by [Vynkor](https://vynkor.fr)

</div>