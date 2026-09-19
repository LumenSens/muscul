# TEST_REPORT.md

Date : 2026-09-19. Cible : Coach Muscu personnel V1.2.1.

## Tests métier Node (`tests/run-tests.js`)

Exécutés dans le dossier source personnel.

| Résultat | Détail |
|---|---|
| **65 PASS** | Matrice V1.2 historique + tests UX ajoutés |
| **0 FAIL** | |
| **8 SKIP** | MIG-01 à MIG-07 et MIG-10 : la sauvegarde personnelle `coach-muscu-sauvegarde (7).json` n’est pas dans le paquet (volontaire, données personnelles) |

Nouveaux tests :

| ID | Couverture demandée |
|---|---|
| UX-HAUTA-01 | TEST 1 — séance Haut A démarrée et terminée |
| UX-REST-01 / UX-REST-02 | TEST 2–3 — repos au bon moment, libellés inter-série vs transition, pas de repos long inter-côtés |
| UX-BIKE-01 / UX-BIKE-02 | TEST 4 — jamais deux efforts consécutifs, ordre après 5 min facile |
| UX-UNI-01 | TEST 5–6 — flux unilatéral et sauvegarde G/D |
| UX-LOAD-01 / UX-LOAD-02 | TEST 7–8 — charge historique visible, saisie manuelle conservée |
| UX-TEST-01 / UX-TEST-02 | TEST 9 — mode TEST, repos non-perf, vélo compressé |
| finishWorkout dans UX-HAUTA-01 | TEST 10 — bilan / clôture |
| UX-SEP-01 / UX-SEP-02 | TEST 11–14 — isolation Mathieu/Ryan et extract |
| BODY-* existants | TEST 15 — poids/mensurations |
| UX-COURSE-01 | TEST 16 — futsal sans distance |
| Builds Netlify zip | TEST 17 — deux zips distincts |
| UX-LABELS-01 | jargon KEEP / WARMUP_SET / WORK_SET masqué / traduit |

## Parcours navigateur réel (preview Mathieu)

Exécuté le 2026-09-19 en mode **Essai TEST** sur Haut A.

| Contrôle | Résultat |
|---|---|
| Accueil Mathieu, 4 séances, pas de sélecteur Ryan | OK |
| Échauffement concret + checklist + Passer | OK |
| Charge conseillée 20 kg / main préremplie, saisie 10 reps conservée | OK |
| « Repos avant la prochaine série » en TEST 5 s, non-perf | OK |
| Copenhagen « Série 1 gauche puis droite », repos « Changement de côté » | OK |
| Vélo : Facile 5 → Effort 1 → Facile récup → Effort 2… jamais deux efforts d’affilée | OK |
| Bilan : TEST, français, Gauche / Série de travail, pas de KEEP/WORK_SET | OK |
| Historique « Haut A · TEST » | OK |
| Poids 82,4 kg persisté, hero visible | OK |
| Futsal 60 min / RPE 7 / FC 148 **sans distance** | OK |

## Tests d’interface DOM (`tests/ui-smoke.js`)

**Non exécutés ici.** Ils requièrent `jsdom` (dépendance de l’environnement d’origine, absente de ce workspace) et la fixture historique personnelle.

À réexécuter ailleurs : `npm i jsdom` puis `node tests/ui-smoke.js` après un build Mathieu dans le même dossier que `index.html`.

## TIME-10 (téléphone, écran verrouillé)

**Non exécuté.** Aucun appareil physique. Inchangé vs V1.2.

## Limites restantes

- Le bug « deux efforts d’affilée » n’était pas dans la recette : c’était un problème de lecture (récupération 2 min mal distinguée). La recette 1320 s n’a pas été altérée.
- Course/futsal = journal. Pas d’adaptation automatique du programme.
- Module Alana absent des ZIP : suivi poids amélioré sur le modèle V1.2, pas une copie Alana.
- Preview live = build **Mathieu**. Ryan est le second ZIP Netlify.
- Import d’une sauvegarde Ryan dans l’app Mathieu est rejeté (et inversement).
