# CHANGELOG — Coach Muscu personnel V1.2.1

Lot UX + séparation Mathieu / Ryan. Le programme d’entraînement (exercices, séries, plages, split) n’a pas été modifié.

## 1. Échauffement trop vague

- **Problème :** « 6–10 min » sans savoir quoi faire. Séries d’approche sans reps ni charge.
- **Fichiers :** `app.js` (`warmupText`, `warmupChecklist`, `warmupApproachHint`, `renderPrepare`, `exerciseCard`)
- **Correction :** checklist courte par séance (Haut A/B/C/Jambes). Guidage d’approche : 6–8 reps à ~50–70 % de la charge de travail, loin de l’échec. Pas de validation obligatoire de sous-étapes.

## 2. Repos et chronos ambigus

- **Problème :** « Repos cible » / « Repos personnel » ne disaient pas s’il s’agissait d’un repos entre séries ou d’une transition. Le chrono partait à `END_SET` avec le temps d’exercice même entre gauche et droite.
- **Fichiers :** `app.js` (`endSet`, `restKindAfterEndingSet`, `restTargetForKind`, `restCard`, `updateLiveUI`)
- **Audit de la formule (inchangée pour le repos réel) :**
  - Repos réel = `START_SET` suivant − `END_SET` précédent, même profil / séance / exercice / côté.
  - Si l’autre côté s’intercale : qualité `CAPTURED_LOCAL_WITH_OTHER_SIDE`.
  - Si un autre exercice s’intercale : `CAPTURED_INTERLEAVED_EXCLUDED`.
  - Identique pour inter-séries et inter-exercices au niveau de la mesure.
- **Correction UX minimale :**
  - Entre deux côtés de la même série : « Changement de côté » (pas le repos long de 90–180 s).
  - Entre deux séries du même exercice : « Repos avant la prochaine série ».
  - Après la dernière série d’un exercice : « Transition vers l’exercice suivant » (même durée prescrite, libellé différent).
  - Mode TEST : cible affichée 5 s, qualité `TEST_NOT_PERFORMANCE` — non utilisée comme perf.

## 3. Exercices unilatéraux trop cliqués

- **Problème :** Gauche 1, Droite 1, Gauche 2… comme des mini-exercices séparés.
- **Fichiers :** `app.js` (`exerciseCard`, `setRowHtml`)
- **Correction :** groupe « Série 1 → gauche puis droite ». Les deux côtés restent des observations distinctes en base.

## 4. Charges peu visibles au niveau de la série

- **Problème :** repère 20 kg en haut de carte, champ vide ; curl marteau et face pull sans guidage.
- **Fichiers :** `app.js` (`suggestedLoad`, `resultForm`, `exerciseCard`)
- **Correction :** préremplit le champ avec le repère ou la dernière charge TRAINING. Élastique : couleur/résistance, aucun kg inventé.

## 5. Jargon interne affiché

- **Problème :** KEEP, WARMUP_SET, WORK_SET, CAPTURED, UNKNOWN, « Base 13 » sans explication.
- **Fichiers :** `app.js` (helpers `french*` + rendus séance / bilan / options)
- **Correction :**
  - `KEEP` (statut scientifique) = masqué (signifie « exercice conservé tel quel par l’audit », pas une consigne utilisateur).
  - `KEEP_LOAD` → « Garder la charge ».
  - `WARMUP_SET` → « Échauffement » ; `WORK_SET` → « Série de travail ».
  - `CAPTURED` / `UNKNOWN` / `LEFT` / `RIGHT` retirés de l’UI normale.
  - Base 13 / Courte 11 expliqués (13 ou 11 séries de travail).

## 6. Blocs de séance perçus comme un menu

- **Problème :** « Bloc 1 — Échauffement » / « Bloc 2 — Musculation » ressemblait à un choix.
- **Fichiers :** `app.js` (`renderSession`, `renderSimpleBlock`, `renderStrengthBlock`)
- **Correction :** fil d’étapes « Échauffement → Corde → Musculation → Vélo → Retour au calme » et titres « 1. Échauffement ».

## 7. Vélo fractionné : deux efforts d’affilée

- **Problème observé :** après l’échauffement, deux phases « 2 min effort ».
- **Fichiers :** `app.js` (`BIKE_RECIPE` inchangée, `renderIntervalBlock`, `intervalStepTypes`, `hasConsecutiveEffort`)
- **Constat moteur :** la recette est déjà `Facile 5 min → Effort 2 → Facile 2 → Effort 2 ×4 → Retour 3 min`. Aucun couple EFFORT/EFFORT.
- **Correction :** timeline visible, libellés « Facile — récupération », couleurs effort/facile, « Ensuite : … ». Test déterministe de l’ordre.

## 8. Retour au calme trop maigre

- **Problème :** peu de guidage, pas assez évident de passer.
- **Fichiers :** `app.js` (`cooldownChecklist`, `renderSimpleBlock`)
- **Correction :** 3–4 étirements facultatifs 20–30 s + bouton **Passer** déjà présent, relabelisé.

## 9. Course / futsal trop « journal km »

- **Problème :** distance obligatoire visuellement pour un futsal.
- **Fichiers :** `app.js` (`addCourseEntry`, `renderCourse`)
- **Correction :** durée, RPE 1–10, jambes, genou, FC moy/max facultatives, distance facultative. **Le moteur de musculation n’utilise pas ces champs** : historique / récupération seulement.

## 10. Poids et mensurations trop formulaire

- **Problème :** long formulaire, peu d’historique visuel. Module Alana absent des ZIP fournis.
- **Fichiers :** `app.js` (`renderMeasurements`, `sparkBars`)
- **Correction :** hero poids + sparkline, deltas vs relevé précédent, champs préremplis par le dernier relevé. Pas de troisième modèle inventé.

## 11. Deux applications personnelles

- **Problème :** un sélecteur Mathieu / Partenaire dans la même app.
- **Fichiers :** `app.js` (UI), `index.html`, `scripts/build-variants.mjs`
- **Correction :** builds distincts `COACH_APP_OWNER=mathieu|ryan`. Aucun sélecteur croisé. Namespaces `coachMuscu.mathieu.*` / `coachMuscu.ryan.*`. Identifiants internes `moi` / `pote` conservés pour la migration.

## 12. Mode TEST et bilan

- **TEST :** conservé, bannière claire, chronos 5 s, repos `TEST_NOT_PERFORMANCE`.
- **Bilan :** rôles/côtés/blocs en français utilisateur ; TEST marqué.

## 13. Non-modifié (programme)

Exercices, nombres de séries, plages de reps, split, jours, prescriptions RIR, paliers haltères, recette vélo 1320 s, corde 270 s.

## 14. Ajustements après parcours réel

- **« Calibration »** encore en anglais dans le verdict → **Calibrage**.
- Compteur musculation **0/15** (côtés comptés) → **séries logiques** (Copenhagen = 2, pas 4).
- Accueil / préparation : « groupes » / « groupes/côté » → « séries » / « gauche + droite ».
- État du jour : option **Valeur** → **Saisir**.
- Repos inter-côtés : plus de « Cible 01:30 » pendant un simple changement de côté.
- Mensurations : note Alana retirée de l’écran utilisateur (reste dans le rapport).
