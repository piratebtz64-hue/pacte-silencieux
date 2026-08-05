
# Le Pacte silencieux 🕯️

> Une présence douce entre deux inconnus, sans conversation, sans profil, sans bruit.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/piratebtz64-hue/pacte-silencieux&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,DATABASE_URL,DIRECT_URL&envDescription=Supabase%20credentials%20required%20for%20deployment)

## 🌟 Concept

**Le Pacte silencieux** est une application minimaliste permettant à deux inconnus de partager une présence discrète pendant 1, 3 ou 7 jours. C'est une alternative reposante aux réseaux sociaux bruyants.

### Principes clés

- ✨ **Aucun profil public** - Anonymat complet
- 🤐 **Pas de chat** - Uniquement 4 gestes silencieux
- 🕯️ **Présence simple** - Je suis là, Je tiens, C'est fragile, Je veille
- 🔒 **Respect total** - Pas de données vendues, pas de tracking
- ⏳ **Engagement limité** - 1, 3 ou 7 jours max

## 🚀 Features

- ✅ Authentification par lien magique (Supabase Auth)
- ✅ Appairage automatique entre deux utilisateurs
- ✅ 4 gestes silencieux pour communiquer
- ✅ Politique de confidentialité stricte
- ✅ Système de signalement des abus
- ✅ Interface minimaliste et apaisante
- ✅ Dark mode intégré

## 🛠️ Stack

```
Frontend:     Next.js 15 + TypeScript + Tailwind CSS
Backend:      Next.js API Routes
Database:     PostgreSQL (Supabase)
Auth:         Supabase Auth (magic links)
Deployment:   Vercel
```

## 📋 Installation locale

### Prérequis
- Node.js 18+
- PostgreSQL/Supabase
- npm ou yarn

### Setup

```bash
# Clone le repo
git clone https://github.com/piratebtz64-hue/pacte-silencieux.git
cd pacte-silencieux

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Édite .env.local avec tes credentials Supabase

# Setup database
npm run db:push

# Start dev server
npm run dev
```

L'app est disponible sur `http://localhost:3000`

## 🚀 Déploiement

### Vercel (Recommandé)

1. Push ton code sur GitHub
2. Va sur https://vercel.com
3. Clique "Add New Project" et sélectionne ton repo
4. Ajoute tes variables d'environnement
5. Click "Deploy" ✅

```bash
# Ou en CLI
npm install -g vercel
vercel --prod
```

### Docker

```bash
docker build -t pacte-silencieux .
docker run -p 3000:3000 -e DATABASE_URL=... pacte-silencieux
```

## 📁 Structure

```
src/
├── app/
│   ├── api/               # API routes
│   │   ├── start/        # Create pact
│   │   ├── pact/         # Get pact details
│   │   ├── gesture/      # Send gesture
│   │   └── report/       # Report abuse
│   ├── auth/
│   │   └── callback/     # OAuth callback
│   ├── start/            # Create pact page
│   ├── waiting/          # Pairing wait page
│   ├── pact/[id]/        # Active pact page
│   ├── privacy/          # Privacy policy
│   ├── terms/            # Terms of service
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ThemeToggle.tsx
│   └── DonationButton.tsx
└── lib/
    ├── supabase.ts       # Supabase client
    ├── prisma.ts         # Prisma instance
    └── utils.ts          # Utilities
```

## 🔌 API Endpoints

### POST /api/start
Crée un nouveau pacte et envoie un lien magique

```json
{
  "email": "user@example.com",
  "durationDays": 3
}
```

### GET /api/pact
Récupère les détails d'un pacte

```
?pactId=cuid
```

### POST /api/gesture
Envoie un geste dans un pacte actif

```json
{
  "pactId": "cuid",
  "gestureType": "JE_SUIS_LA"
}
```

### POST /api/report
Signale un comportement inapproprié

```json
{
  "pactId": "cuid",
  "userId": "cuid",
  "reason": "Description..."
}
```

## 🔐 Variables d'environnement

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_DONATION_LINK=https://buy.stripe.com/xxxxx
```

## 📝 Licence

MIT License - Libre d'utilisation et modification

## 💝 Support

Aime le projet? Tu peux:
- ⭐ Donner une star sur GitHub
- 🐛 Signaler les bugs
- 💡 Proposer des idées
- 💰 Faire un don (lien dans l'app)
- 🔄 Contribuer (PRs bienvenues!)

## 🤝 Contributing

Les contributions sont bienvenues!

1. Fork le repo
2. Crée une branche (`git checkout -b feature/amazing-feature`)
3. Commit tes changes (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvre une Pull Request

## 📧 Contact

Pour toute question ou suggestion:
- 📧 Email: contact@pacte-silencieux.fr
- 🐛 Issues: https://github.com/piratebtz64-hue/pacte-silencieux/issues
- 💬 Discussions: https://github.com/piratebtz64-hue/pacte-silencieux/discussions

---

**Créé avec ❤️ pour les moments silencieux qui comptent.**

*v0.1.0 - August 2026*
