# Coach Muscu V2 — Compte rendu d’implémentation V1.2

## Résultat

La V1.2 a été appliquée à l’application Coach Muscu existante : son interface mobile sombre, son fonctionnement local et son approche PWA ont été conservés, tandis que l’ancien journal agrégé a été remplacé par un modèle canonique de séances, blocs et séries réelles.

La livraison est testable immédiatement comme application statique. Elle n’est pas présentée comme déjà déployée.

## Décisions scientifiques intégrées

- semaine fixe : Haut A lundi, Haut B mardi, futsal jeudi, Haut C vendredi, une seule séance jambes samedi ;
- aucun Bas A et aucun report automatique au dimanche ;
- Haut C Base 13 par défaut, Complément 15 exclusivement shrugs **ou** oiseau, Courte 11 sans supination mais avec les deux séries triceps ;
- développé serré initial ; extension au-dessus de la tête uniquement comme substitution TEST personnelle ;
- ordres A, B, C et Jambes conformes à l’audit ;
- Jambes RETURN 12 au départ, puis choix explicite de 18 ou de la courte 10 ;
- échauffements haut 6–10 min approches comprises, référence terrain 6–8 min pour B ;
- corde 4 × 45 s = 270 s et vélo corrigé = 1 320 s, séparés de l’échauffement ;
- deux vélos en parallèle, jamais 44 min ajoutées au temps commun ;
- totaux vérifiés : 57/56, 59/58, 55/54 et 51/50 maximum.

## Fonctions réalisées

- profils Mathieu/Partenaire propriétaires de chaque donnée ;
- START/END SESSION, START/END SET, repos cible et repos réel lorsque les bornes sont comparables ;
- côtés unilatéraux séparés, groupes complets et côtés incomplets distingués ;
- états `NOT_ENTERED`, `UNKNOWN` et `VALUE`, dont RIR 0 ;
- séries d’approche séparées des séries de travail ;
- correction d’une série avec même identifiant et révision antérieure conservée ;
- mode TRAINING/TEST distinct du cycle de vie et annulation non destructive ;
- timers corde/vélo persistants, pause/reprise, saut, raccourcissement et confirmation du réalisé ;
- progression CALIBRATION → BASELINE → PROGRESSION, paliers haltères réels jusqu’à 23 kg seulement, aucun palier machine inventé ;
- configurations bandes/TRX/machines enregistrables sans convertir une inscription de bande en force mesurée ;
- adaptation explicite du restant de C ou Jambes en cours de séance, sans effacer les séries déjà faites ;
- révisions de programme immuables : changer une option crée une nouvelle révision active ;
- poids et mensurations partiels, décimales françaises, côtés séparés, historique et delta avec le relevé précédent ;
- export complet, export par profil, CSV, import LEGACY/V2, retour arrière et conflits non écrasés ;
- PWA hors ligne avec icônes 192/512 et verrou d’édition entre onglets.

## Migration vérifiée sur la sauvegarde réelle

La sauvegarde `v:2` a été reconnue comme LEGACY et non comme V2 cible. Résultat contrôlé :

| Élément | Résultat |
|---|---:|
| Résumés historiques | 199 |
| Observations détaillées réelles | 54 |
| Agrégats sans détail | 179 |
| Groupes profil/session | 27 |
| États historiques | 33 |
| Modèles historiques | 8 |

Les agrégats n’ont pas été déroulés en séries identiques. Les quatre charges détaillées de presse 42,5/53/66/73 kg sont préservées. Gainages, Copenhagen, Pallof et ancienne variante de rowing restent explicitement non résolus. Le `12` des shrugs partenaire reste dans le brut avec annotation, sans créer deux séries fictives. Le repère traction partenaire 3 × 5 est un candidat déclaré, pas trois séries historiques.

## Tests réellement exécutés

| Niveau | Résultat | Portée |
|---|---:|---|
| Tests métier Node | **59/59** | 58 identifiants de la matrice V1.2 + 1 test explicite de correction/révision |
| Contrôles d’interface DOM | **17/17** | parcours série/correction/annulation, C15, mensurations, profils, wake lock absent, vue mobile simulée, migration et consultation de l’archive réelle |
| Matrice V1.2 couverte automatiquement ou simulée | **59/60** | tous les cas sauf TIME-10 sur appareil physique |

Les fichiers de résultats horodatés sont `tests/test-results.json` et `tests/ui-smoke-results.json`.

## Limites assumées

- **TIME-10 non exécuté** : aucun téléphone physique n’était disponible pour verrouiller réellement l’écran et distinguer reprise du chrono et alertes reçues.
- UX-01 a été exercé à largeur mobile simulée, pas validé tactilement sur votre téléphone.
- Un rendu Chromium complet n’a pas pu être lancé dans l’environnement ; la syntaxe, le DOM chargé, les interactions et les actifs ont néanmoins été contrôlés.
- Les sons, vibrations et wake lock dépendent du navigateur ; aucune alerte n’est promise navigateur fermé.
- Aucun déploiement n’a été effectué.
- Aucune synchronisation temps réel entre deux téléphones n’a été ajoutée, conformément au périmètre V2 légère.
- Les durées de 80–95 min et la récupération après futsal restent à confirmer au terrain ; l’application mesure le réel sans forcer l’estimation.

## Recommandation de mise en service

1. Déployer le dossier complet sur l’origine habituelle en HTTPS.
2. Exporter l’ancienne sauvegarde avant remplacement.
3. Importer et vérifier les compteurs de migration.
4. Garder C Base 13 et Jambes RETURN 12 pour les premiers essais.
5. Exécuter `MANUAL_PHONE_TEST.md`.
6. Exporter une sauvegarde complète V2 après chaque première séance validée.

