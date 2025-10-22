# Peephole

Application Node.js avec Express

## Installation

```bash
npm install
```

## Configuration

Copier le fichier `.env.example` en `.env` et ajuster les variables d'environnement :

```bash
cp .env.example .env
```

## Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

## Tests

```bash
npm test
```

## Structure du projet

```
peephole/
├── src/
│   ├── controllers/    # Contrôleurs
│   ├── models/         # Modèles de données
│   ├── routes/         # Routes de l'API
│   ├── middleware/     # Middlewares personnalisés
│   ├── config/         # Configuration
│   ├── utils/          # Utilitaires
│   ├── app.js          # Configuration de l'application Express
│   └── index.js        # Point d'entrée
├── tests/              # Tests
└── package.json
```

## API Endpoints

- `GET /` - Page d'accueil de l'API
- `GET /health` - Vérification de l'état du serveur
