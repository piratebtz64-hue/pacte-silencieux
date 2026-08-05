# Le Pacte silencieux - v0.1.0

## 🚀 Première version publique

### ✨ Fonctionnalités principales

- **Créer un pacte**: Choisir une durée (1, 3, ou 7 jours) et recevoir un lien magique
- **Authentification sécurisée**: Liens magiques via Supabase Auth (pas de mot de passe)
- **Appairage automatique**: Deux utilisateurs avec la même durée sont appairés
- **Gestes silencieux**: 4 gestes pour exprimer sa présence:
  - 🕯️ Je suis là
  - 🤝 Je tiens
  - 💔 Aujourd'hui c'est fragile
  - 👁️ Je veille avec toi

- **Aucun profil public**: Anonymat complet, pas de chat, pas de conversation
- **Protection de la vie privée**: Pas de tracking, données chiffrées

### 🛠️ Stack technique

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: PostgreSQL via Supabase
- **Authentification**: Supabase Auth (magic links)
- **Déploiement**: Vercel

### 📂 Structure du projet

```
src/
├── app/
│   ├── api/           # API Routes (start, pact, gesture, report)
│   ├── start/         # Page de création de pacte
│   ├── waiting/       # Page d'attente d'appairage
│   ├── pact/[id]/     # Détail du pacte actif
│   ├── privacy/       # Politique de confidentialité
│   ├── terms/         # Conditions d'utilisation
│   └── auth/callback/ # Callback OAuth
├── components/        # Composants réutilisables
└── lib/              # Utilitaires (Supabase, Prisma)
```

### 🔌 API Endpoints

- `POST /api/start` - Créer un pacte
- `GET /api/pact?pactId=...` - Récupérer les détails
- `POST /api/gesture` - Envoyer un geste
- `POST /api/report` - Signaler un abus

### 🚀 Déploiement

1. Cloner le repo
2. Configurer les variables d'environnement (Supabase, Vercel)
3. `npm install` et `npm run build`
4. Déployer sur Vercel

### 📝 Licence

MIT

### 💝 Soutenir le projet

Le Pacte silencieux est gratuit et open-source. Si tu aimes le concept, tu peux contribuer ou faire un don.

---

**Créé avec ❤️ pour les moments silencieux qui comptent.**
