# Coach Muscu — versions personnelles Mathieu / Ryan

Code commun V1.2.1. Même moteur et même programme que V1.2. Deux builds Netlify indépendants.

## Builds

```bash
node scripts/build-variants.mjs
```

Produit :

- `dist-mathieu/` → ZIP Netlify Mathieu
- `dist-ryan/` → ZIP Netlify Ryan

Chaque ZIP se dépose tel quel sur un site Netlify (drag-and-drop).

Configuration : `window.COACH_APP_OWNER = "mathieu"` ou `"ryan"` dans `index.html` avant `app.js`.

- Mathieu → profil interne `moi`, stockage `coachMuscu.mathieu.*`
- Ryan → profil interne `pote`, stockage `coachMuscu.ryan.*`

## Programme (inchangé)

Lundi Haut A, mardi Haut B, jeudi futsal, vendredi Haut C Base 13, samedi jambes RETURN 12. Pas de Bas A.

## Tests

```bash
node tests/run-tests.js
```

Voir `TEST_REPORT.md`, `CHANGELOG.md`, `STORAGE_MIGRATION.md`.
