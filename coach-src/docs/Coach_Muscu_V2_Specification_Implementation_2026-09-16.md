# Coach Muscu V2 — Spécification finale d’implémentation V1.2

Consolidation du 17 septembre 2026 · Sources du 16 septembre 2026 · Conception produit et technique, sans développement de code applicatif

**Source de vérité unique pour Work.** Cette V1.2 complète consolide la spécification V1.1 et « Coach_Muscu_Audit_Scientifique_Final_2026-09-16.md ». Lors de la consolidation, le nouvel audit scientifique prime sur toute prescription incompatible de la V1.1. Toutes les décisions opérationnelles nécessaires à l’implémentation sont intégrées ci-dessous ; Work n’a pas à fusionner à nouveau les anciennes prescriptions.

Les sections A à T définissent les contrats à implémenter ; U fournit le prompt opérationnel cohérent avec ces contrats ; V liste uniquement les différences introduites par l’audit. Les tableaux M/N fixent les prescriptions, les variantes et leurs ordres. Les sources historiques servent à la traçabilité et à la migration, jamais à réactiver un ancien programme par défaut.

Les tests décrits sont des critères à exécuter pendant l’implémentation ; ils n’ont pas été exécutés sur une application V2. La présente livraison modifie uniquement cette spécification.

**Référence de programme :** A lundi ; nouveau B mardi ; futsal jeudi 19–20 h ; C vendredi ; une seule séance jambes samedi 13 h 30–15 h, aucun Bas A. C démarre sur BASE 13 ; AVEC COMPLÉMENT 15 exige un choix explicite et un besoin identifié ; COURTE 11 conserve le travail triceps. Développé serré initial, extension au-dessus de la tête en TEST de substitution uniquement.

**Acquis maintenus :** échauffements hauts 6–10 min approches comprises, référence terrain B 6–8 min ; corde et vélo séparés. Deux vélos disponibles permettent les 22 min de chacun en parallèle. Ces précisions ne changent ni les résultats passés ni les contrats de migration.

## A — Résumé exécutif

**Faire évoluer Coach Muscu en conservant la structure hebdomadaire, les deux profils et tout l’historique, avec les prescriptions corrigées par l’audit scientifique.** Les ajouts structurants sont les séries réelles, les blocs de séance, les horodatages fiables, les mesures corporelles et une progression explicable. Conserver la technologie et les écrans utiles de l’application actuelle ; ne pas créer une nouvelle application pour obtenir ces fonctions.

### Décisions à appliquer

1. **Semaine conservée :** Haut A lundi ; nouveau Haut B mardi ; futsal jeudi 19–20 h ; Haut C vendredi ; une seule séance Jambes samedi 13 h 30–15 h ; dimanche normalement libre. Aucun Bas A, aucun second jour jambes. Un report exceptionnel au dimanche ne remplace pas le planning normal et reste choisi par l’utilisateur.
2. **Lundi complet :** préparation initiale courte → corde 4×45 s avec trois récupérations de 30 s → Haut A avec approches distinctes → vélo fractionné → retour au calme éventuel. Préparation initiale et approches partagent l’enveloppe d’échauffement de 6–10 min ; la corde et le vélo s’y ajoutent séparément. Un seul chrono séance par personne couvre tout le créneau.
3. **Correction partenaire :** tractions classiques, repère déclaré **3×5**, à confirmer. Elles remplacent le tirage vertical élastique comme exercice principal dans les nouvelles séances ; l’ancienne variante et ses résultats restent intacts.
4. **Vélo : résoudre l’incohérence arithmétique.** La recette écrite « 5 min + 4×(2 min soutenues + 2 min faciles) + 3 min » dure **24 minutes**. La recette retenue ici pour respecter la demande de **22 minutes** conserve les quatre efforts de deux minutes, les cinq minutes initiales et les trois minutes finales ; elle comporte **trois** récupérations intermédiaires de deux minutes. Après le quatrième effort, les trois minutes de retour au calme tiennent lieu de récupération finale. Cette correction est explicite et versionnée, jamais masquée derrière une étiquette « 22 » sur 24 minutes.
5. **Format de sauvegarde sans ambiguïté :** l’export ancien porte déjà `v: 2`. Le nouveau format doit donc être identifié par `format: coach-muscu-backup` **et** `schemaVersion: 2`. Le vieux `v` seul n’identifie jamais la V2 cible.
6. **Séries canoniques pour les nouveaux entraînements ; anciens agrégats conservés comme agrégats.** Aucun 9/9/9 fabriqué à partir de « 9 reps × 3 ».
7. **Temps mesuré, temps déclaré et inconnu distincts.** Le bip, la cible et le compteur écoulé ne prouvent pas que l’effort a été réalisé. Le repos réel nécessite une fin de série et un début de série comparables.
8. **V2 locale et légère :** pas de serveur, de compte, de synchronisation duo en direct, de moteur d’IA ou de réécriture du stockage imposés par cette spécification.
9. **Échauffements hauts courts :** Haut B testé environ 6–8 min ; objectif Haut A/B/C environ 6–10 min avec approches incluses, ajustable au besoin du jour. Pas de bloc de 15–25 min imposé par défaut, ni de cardio structuré reclassé en échauffement.
10. **Audit scientifique appliqué :** C « Base 13 » au départ ; « Avec complément 15 » uniquement si besoin identifié ; « Courte 11 » enlève le curl supination, conserve le serré. A/B et les priorités presse/leg curl restent stables ; pas de gainage exigeant ou de jambes ajoutés vendredi.
11. **Deux vélos confirmés :** 22 min par personne en parallèle, pas 44 min ajoutées au créneau commun. Budget estimé du lundi complet environ 80–95 min, à valider au terrain ; viser 90 min avec échauffement court et transitions préparées.

### Sources et niveau de vérification

| Source | Usage | Vérification effectuée pour cette spécification |
|---|---|---|
| Message « VALIDATION TERRAIN DE L’ÉCHAUFFEMENT » et PDF « Prompt Astra — optimisation définitive Haut A - Haut B - Haut C.pdf » | Dernière précision prioritaire sur les échauffements hauts | Message lu ; PDF d’une page lu intégralement, reprenant cette même validation. Retour utilisateur, pas une mesure instrumentée ni une nouvelle prescription complète de Haut C |
| Spécification V1.1 du 16/09/2026 | Socle produit, contrats de données, migration, timers et progression | Texte complet conservé comme source de comparaison ; contrats techniques préservés |
| Coach_Muscu_Audit_Scientifique_Final_2026-09-16.md | Source prioritaire de la consolidation du programme : sélection, ordre, couverture, versions de C et récupération | Décisions intégrées en M/N, tests en Q et prompt en U ; aucune nouvelle séance C déclarée validée sur le terrain |
| Précision utilisateur « on a deux velo » | Organisation du lundi et estimation du créneau commun | Deux vélos confirmés ; résultat de chaque personne indépendant |
| Mission jointe « Fichier markdown(2).md collé » | Partenaire, corde, vélo, fonctions V2, complétés par la validation terrain ci-dessus | Lue intégralement |
| `Coach_Muscu_Audit_2026-09-15.md`, correction du 16/09, version corrigée en dix phases | Programme, doses, variantes courtes, RIR et règles de suivi | Document produit et vérifié dans ce travail ; référence antérieure aux corrections de cette mission |
| `coach-muscu-sauvegarde (7).json`, export du 15/09/2026 à 15:17:09.807Z | Contrat de migration réel | Structure, entrées, séries détaillées, états et programmes inspectés |
| `coach-muscu-journal (4).csv` | Contrôle historique | Rapprochement avec les 199 entrées du JSON conservé de l’audit ; ne pas importer une seconde fois les mêmes observations |
| Code Coach Muscu actuellement utilisé | Points d’intégration et stockage effectif | Non disponible dans les sources de code examinées ici ; Work dispose du projet selon la mission et doit l’inventorier avant modification |
| `Coach-Alana-Netlify-ajustements.zip` | Bibliothèque d’idées et de composants | Inspection statique ciblée de `enhancements.js` et de son chargement ; le bundle distribué n’a pas fait l’objet d’un audit complet |
| `Coach-Timeo-Netlify.zip` | Variantes, progression au poids du corps, saisie et timers | Inspection statique ciblée de `app.js`, des fonctions de séance/progression/timers et du README |
| Documentation des plateformes web | Limites de persistance, arrière-plan et écran verrouillé | Sources primaires citées dans les sections concernées |

**Priorité à l’implémentation : dernières instructions utilisateur → présente V1.2 consolidée.** M/N font foi pour le programme ; les autres sections dédiées font foi pour leurs contrats techniques ; U les reprend sans les remplacer. L’audit scientifique a primé sur V1.1 pendant la consolidation. Les anciens documents ne fournissent aucune prescription de secours incompatible avec cette V1.2.

La sauvegarde réelle et le code existant sont les sources factuelles de migration et d’intégration. Alana/Timéo servent uniquement de références de composants. Aucun résultat observé, programme historique, antécédent ou objectif d’un autre profil n’est réécrit à partir de la nouvelle prescription.

## B — Architecture cible

### Organisation logique, à adapter au dépôt réel

| Brique | Responsabilité | Limite |
|---|---|---|
| Écrans actuels et navigation | Accueil, séance, historique, progression, réglages | Conserver styles et parcours utilisables ; pas de framework nouveau par défaut |
| Catalogue et prescriptions versionnées | Exercices, variantes, configurations, plans des deux profils | Séparer cible de séance et résultat réalisé |
| État de séance | Session, blocs, exercice courant, séries, édition en cours | Un propriétaire explicite par donnée ; aucune dépendance au seul profil sélectionné à l’écran |
| Service de temps | Horodatages, compteurs dérivés, pauses des blocs, repos | Aucun compteur décrémenté chaque seconde comme source canonique |
| Règles de progression | Comparaison, calibration, recommandations et raisons | Calculs déterministes ; aucune modification cachée de l’historique ou de la prescription active |
| Mesures corporelles | Poids et mensurations datés, affichage par profil | Pas de calcul de kilos de muscle ou de taux de graisse |
| Accès aux données et migration | Lecture/écriture, export/import, version et reprise | Adaptateur au stockage existant ; cohérence des écritures et sauvegarde récupérable |

Ces briques peuvent rester dans peu de fichiers. Les noms décrivent des responsabilités, pas une arborescence imposée. Work doit donner les vrais fichiers/fonctions réutilisés après lecture du projet. Une interface ne doit pas contourner l’accès aux données pour écrire un deuxième journal concurrent.

### Données séparées, événements durables simples

Chaque action importante modifie un état validé et persisté : début/fin de session, début/fin de série, validation de résultat, pause/reprise/arrêt de bloc, changement de recette, mesure et import. Un petit historique des révisions/corrections suffit ; **pas d’architecture intégrale par journal d’événements** à ajouter.

Les commandes portent des identifiants stables et sont idempotentes : double clic ou restauration ne crée pas deux séries. Les fonctions de calcul ne doivent pas modifier les objets qu’elles lisent. Les recommandations et totaux sont dérivés des données enregistrées, avec une version de règle.

### Persistance

- Garder le stockage existant s’il permet les contrats décrits. S’il s’agit de `localStorage`, ne pas multiplier des copies divergentes de l’état dans de nouvelles clés indépendantes. Utiliser un jeu de données actif versionné et un candidat de migration, avec bascule seulement après vérification.
- Si le projet utilise déjà IndexedDB, conserver ses transactions. Une transition de stockage ne se justifie que par un problème concret observé de capacité, cohérence ou performance ; elle doit rester derrière l’adaptateur.
- Persister aux actions importantes, sans attendre la fermeture. Afficher un échec d’écriture et conserver l’édition en mémoire ; ne pas annoncer « sauvegardé » si l’écriture a échoué. La fermeture brutale reste une limite de la plateforme, d’où l’export et la reprise.
- Éviter deux onglets éditeurs concurrents : un onglet actif écrit, le second est informé et passe en lecture seule jusqu’au transfert. Utiliser les mécanismes compatibles déjà disponibles ; ne pas créer une synchronisation multiappareil pour résoudre ce cas local.
- Préserver l’adresse d’hébergement et l’origine de stockage lors de la mise à jour. Un changement d’adresse nécessite un export/import, pas la promesse que le navigateur transportera les données.

Avec IndexedDB, les transactions en cours peuvent être interrompues à la fermeture ; une écriture de sauvegarde lancée seulement dans un événement de sortie n’est pas fiable. C’est une limite à tester, pas une raison de réécrire toute l’application. [MDN — Using IndexedDB, fermeture et transactions](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB).

## C — Matrice KEEP / MODIFY / ADD / MIGRATE / DEPRECATE

Le statut d’un élément existant est une décision cible ; sa présence exacte dans Coach Muscu doit être confirmée par Work. Une fonctionnalité déjà correcte reçoit une adaptation minimale, pas une seconde implémentation.

| Grande brique | Décision | Travail attendu |
|---|---|---|
| Technologie, hébergement, navigation et identité visuelle | **KEEP** | Inventaire, puis évolutions locales |
| Profils `moi` et `pote` | **KEEP / MODIFY** | Identités conservées ; clés de lecture/écriture et timers explicitement rattachés au profil |
| Historique et anciens programmes | **KEEP / MIGRATE** | Conserver provenance, contenu brut, anciennes variantes et unités ambiguës |
| Plans Haut A/B/C/Jambes | **MODIFY** | Appliquer l’audit scientifique final : A/B conservés, C base 13 avec un seul complément éventuel de 2 et court 11 gardant le serré, jambes 18 après reprise/12 au retour ; tractions partenaire, échauffements courts et deux vélos |
| Échauffements Haut A/B/C | **MODIFY** | Objectif 6–10 min, approches incluses ; Haut B testé 6–8 min ; corde/vélo séparés ; aucune durée réalisée ou tolérance inventée |
| Journal agrégé | **DEPRECATE pour les nouvelles saisies / KEEP historique** | Remplacé comme source canonique par les séries ; résumés calculés pour l’affichage |
| Saisie des séries | **MODIFY / ADD** | Début, fin, résultat, charge réellement utilisée, RIR et inconnus |
| Exercices chronométrés | **MODIFY** | `duration_sec`, côtés, arrêt anticipé, confirmation du réalisé |
| SESSION TIMER | **ADD ou MODIFY** | Un chrono par séance couvrant tous ses blocs, persisté par horodatages |
| REST TIMER | **MODIFY** | Cible personnelle, délai réel indépendant, prolongation sans pénalité |
| Mesure du repos réel | **ADD** | Dérivée seulement de bornes valides et d’un contexte comparable |
| Progression automatique en pourcentage hebdomadaire | **DEPRECATE** | Recommandations expliquées selon calibration et paliers réels |
| Readiness préremplie | **DEPRECATE / MIGRATE** | Aucun défaut présenté comme réponse ; anciennes valeurs non vérifiées conservées et signalées |
| Poids et mensurations | **ADD ou MODIFY** | Relevés optionnels par champ, datés, séparés par profil |
| Corde et vélo fractionné | **ADD** | Blocs chronométrés indépendants du volume musculaire et de la réussite du bloc musculation |
| Mode essai / annulation | **MODIFY / ADD** | Essais conservés, exclusions explicites des records/assiduité |
| Sauvegarde/import | **MODIFY / MIGRATE** | Détection de format, validation, prévisualisation, idempotence et aller-retour sans perte |
| Course ou autres écrans déjà utiles | **KEEP** | Pas de retrait sans nécessité démontrée ; données conservées même si leur évolution attend |
| Moteur duo connecté, IA prédictive, nouveaux comptes | **DEFER** | Hors V2 légère ; le modèle laisse une place future sans les implémenter |

## D — Modèle de données V2

### D.1 Conventions et inconnus

La convention de champs proposée est `snake_case`, sauf les marqueurs de format `schemaVersion` et les noms demandés `dropOffPct` / `variationPct`. Work peut garder une convention homogène du projet via un adaptateur, mais les sémantiques ci-dessous sont obligatoires.

- Identifiants stables, indépendants des noms affichés. `workout_id` désigne **une séance réalisée/en cours**, jamais le type `HAUT_A`.
- Horodatages d’événements en millisecondes UTC ou ISO avec fuseau explicite, avec une seule convention interne. Durées en secondes numériques ; arrondi d’affichage séparé. Dates de mensuration en date civile locale, sans conversion silencieuse au jour UTC précédent.
- Toute observation facultative suit : `NOT_ENTERED` = pas de réponse ; `UNKNOWN` = réponse « je ne sais pas » ou impossibilité documentée ; `VALUE` = valeur disponible. Pour les deux premiers états, la valeur est nulle. **Zéro est une vraie valeur, jamais un substitut à l’inconnu.**
- Un champ importé peut avoir `VALUE` et une confiance `LEGACY_UNVERIFIED` : cela signifie « valeur présente dans le fichier », pas « réponse humaine certifiée ». Elle est exclue des décisions qui nécessitent une donnée confirmée.
- Les recommandations n’inventent ni RIR, ni sommeil, ni technique, ni douleur, ni charge réelle à partir d’une valeur de prescription.

### D.2 Enveloppe d’export

| Champ | Contenu / contrat |
|---|---|
| `format` | `coach-muscu-backup`, discriminant obligatoire |
| `schemaVersion` | `2` pour ce contrat ; distinct du vieux `v: 2` |
| `product_version`, `exported_at`, `export_id` | Version applicative, date d’export, identifiant de l’export |
| `dataset_id`, `dataset_revision` | Jeu de données et révision ; permet la détection des écritures/imports concurrents |
| `scope`, `profile_ids` | `FULL` ou `PROFILE`, avec les profils réellement inclus ; aucune fusion automatique par nom |
| `profiles`, `exercise_catalog`, `program_revisions` | Identités, variantes/configurations et prescriptions versionnées |
| `workouts`, `sets`, `blocks`, `interval_results` | Réalisé, sessions en cours comprises |
| `readiness`, `body_measurements`, `performance_references` | Observations datées et repères déclarés/calibrés |
| `legacy_archives`, `legacy_summaries`, `migration_report` | Source ancienne intacte, résumés sans détail, transformations et ambiguïtés |
| `extensions` | Champs inconnus/compatibilité future préservés ; pas de perte par filtrage silencieux |

Il est possible de stocker certains enfants dans la séance plutôt que dans des collections séparées, si leurs identifiants et contraintes restent identiques. L’export doit rétablir l’intégralité des relations ; ne pas maintenir simultanément deux sources canoniques des mêmes séries.

### D.3 Profil, exercice, variante et programme

| Objet | Champs indispensables | Règle |
|---|---|---|
| Profil | `profile_id`, nom, matériel déclaré, métadonnées facultatives datées | `moi` et `pote` conservés ou mappés explicitement ; profil actif = préférence d’interface uniquement |
| Exercice | `exercise_id`, nom, type de mesure, matériel admissible | Exemple : traction classique distincte d’un tirage vertical à bande |
| Variante | `variant_id`, `exercise_id`, définition technique | Assistance, prise, appuis/levier significatifs ; historique stable |
| Configuration personnelle | `configuration_id`, `profile_id`, `variant_id`, paramètres matériels | TRX, bande, machine, réglages, côté, amplitude ; instantané dans chaque séance |
| Révision de programme | `program_revision_id`, `profile_id`, date d’effet, provenance | N’écrase pas le programme ayant produit les anciennes séances |
| Modèle de séance | `workout_type`, version `NORMAL/COMPACT/SHORT/RETURN`, liste ordonnée de blocs | Les versions réellement prévues sont définies en M ; pas de variantes factices partout |
| Choix du complément de C | profile_id, program_revision_id, choix NONE/SHRUG/REAR_DELT, variante/configuration | Choix personnel stable ; la version de séance détermine s’il est activé. BASE et COURTE : aucun complément actif ; AVEC COMPLÉMENT : exactement SHRUG ou REAR_DELT, deux séries. NONE initial ; préférence conservée sans activation automatique ; instantané dans la séance |
| Prescription d’exercice | `exercise_occurrence_id`, variante/configuration, nombre de séries, plage ou cible, RIR cible, repos cible | Occurrence distincte si le même exercice apparaît deux fois ; charges proposées séparées des charges réalisées |

**Instantané à START_SESSION :** la séance conserve la révision, les exercices, l’ordre, les cibles et la recette cardio qui étaient proposés. Une modification du programme ultérieure ne change pas une séance ancienne ni celle déjà en cours. Une adaptation de séance est enregistrée comme changement explicite de cet instantané.

### D.4 Séance

| Champ | Contrat |
|---|---|
| `workout_id`, `profile_id`, `workout_type` | Identité, propriétaire et HAUT_A/HAUT_B/HAUT_C/LEGS |
| `mode` | `TRAINING` ou `TEST`, indépendant du cycle de vie |
| `lifecycle` | `DRAFT`, `IN_PROGRESS`, `COMPLETED`, `INTERRUPTED`, `CANCELLED` ; `UNKNOWN` uniquement pour l’historique dont l’état final est inconnu |
| `session_variant`, `plan_snapshot` | NORMAL/COMPACT/SHORT/RETURN et prescription retenue |
| `started_at`, `ended_at` | Événements réellement observés ; nuls si non connus dans l’historique |
| `occurred_at`, `local_date`, `time_zone` | Date historique ou civile séparée de START_SESSION ; fuseau inconnu autorisé |
| `session_elapsed_sec`, `timing_quality` | Valeur dérivée des bornes, ou inconnu ; qualité CAPTURED/DECLARED/UNKNOWN/CLOCK_ANOMALY |
| `strength_outcome` | `COMPLETED`, `PARTIAL`, `NOT_PERFORMED` ou `UNKNOWN`, indépendant du vélo |
| `blocks`, `adaptations`, `comment` | États détaillés, changements de version et raison facultative |
| `revision`, `provenance` | Correction/révision et source NATIVE/LEGACY/USER_DECLARED |

`COMPLETED` signifie séance clôturée volontairement, pas « toutes les options réalisées ». Une séance clôturée avec musculation partielle le dit. `TEST + COMPLETED` est possible : aucun besoin de placer TEST dans le même enum que COMPLETED.

### D.5 Série réelle et exercice chronométré

| Champ | Contrat |
|---|---|
| `set_id`, `workout_id`, `profile_id` | Clés stables ; vérification de cohérence du propriétaire à l’écriture |
| `exercise_id`, `variant_id`, `configuration_snapshot`, `exercise_occurrence_id` | Contexte réellement utilisé |
| `set_index`, `set_group_id`, `side` | Ordre dans l’occurrence ; groupe logique ; `BILATERAL/LEFT/RIGHT/NOT_APPLICABLE/UNKNOWN` |
| `role` | `WARMUP_SET` ou `WORK_SET` ; `UNKNOWN` pour l’ancien non classable |
| `state` | `PLANNED`, `IN_PROGRESS`, `ENDED_PENDING_RESULT`, `RECORDED`, `SKIPPED`, `CANCELLED` |
| `load` | Mode EXTERNAL/BODYWEIGHT/BAND/TRX/MACHINE/NONE ; valeur et unité compatibles, éventuellement inconnues |
| `result_kind` | `REPS`, `DURATION_SEC` ou `LEGACY_UNRESOLVED` |
| `reps` ou `duration_sec` | Résultat réellement saisi/confirmé, jamais rempli par la cible ; l’autre champ reste nul |
| `result_source` | USER_ENTERED, TIMER_CONFIRMED, LEGACY_DETAIL ou UNKNOWN |
| `rir`, `pain`, `technique` | Observations avec état et provenance ; RIR zéro autorisé ; douleur/technique facultatives |
| `started_at`, `ended_at`, `timing_quality` | START_SET et END_SET ; une fin sans début reste enregistrable |
| `recorded_at` | Validation de la saisie ; ne remplace pas END_SET |
| `rest_prescription_sec` | Cible recommandée avant/après la série selon la convention G ; instantané, pas résultat |
| `comment`, `revision`, `legacy_source_ref` | Commentaire, corrections et lien exact au brut si import |

Une série isométrique garde `result_kind = DURATION_SEC` et `duration_sec`. Le compteur peut proposer le temps chronométré ; la validation confirme ce qui a été réellement tenu. Une cible de 30 secondes et un arrêt à 18 enregistrent 18, pas 30. Les périodes de pause ne sont pas fusionnées en une tenue continue : conserver les segments ou noter l’interruption, et exclure cette tentative des comparaisons de tenue continue.

**Unilatéral :** une ligne par côté avec le même `set_group_id` pour la paire. Deux séries par côté produisent quatre observations de côté, mais deux groupes complets. Le volume affiché indique les deux côtés ; une paire incomplète reste « 1 série complète + 1 côté », pas deux séries complètes ni un côté inventé. Les données de côté restent disponibles pour les analyses individuelles. Le repos Copenhagen se mesure avant le **même côté**. Une validation groupée peut enregistrer les deux côtés si l’utilisateur les confirme explicitement ; ne pas copier le résultat du premier côté automatiquement. Si les côtés sont alternés dans une même série sans bornes séparées, conserver les bornes du groupe et laisser les horaires de chaque côté inconnus : pas de faux repos local calculé.

### D.6 Bloc de séance, corde et cardio/intervalles

| Objet | Champs | Contrat |
|---|---|---|
| Bloc | `block_id`, `workout_id`, `profile_id`, `kind`, `order`, `optional`, `plan_snapshot` | `WARMUP`, `ROPE`, `STRENGTH`, `BIKE_INTERVALS`, `COOLDOWN` ; ajouter une discipline future ne change pas l’historique |
| Exécution du bloc | `run_state`, `outcome`, début/fin, pauses, confirmation | `run_state = PLANNED/IN_PROGRESS/PAUSED/FINISHED` ; `outcome = PENDING/COMPLETED/SHORTENED/SKIPPED/UNKNOWN` |
| Recette temporelle | `recipe_id`, `recipe_revision`, étapes ordonnées, total dérivé | Ne jamais coder une durée totale indépendante des étapes |
| Étape prescrite | `step_id`, type WARMUP/EFFORT/RECOVERY/COOLDOWN, `duration_sec`, `interval_index`, intensité cible facultative | Les repos font partie de la durée de recette mais pas des minutes d’effort soutenu |
| Résultat d’étape | Identifiants, durée programmée, durée du timer, `performed_duration_sec`, `confirmation_state`, statut | Une progression du timer ne renseigne pas automatiquement le réalisé |
| État du timer de bloc | Position, temps actif cumulé, ancre temporelle persistée, pauses, révision | Recalcul à la reprise ; pas de tick nécessaire pour conserver la bonne position |

Corde et vélo produisent des résultats de bloc/étape. **Ils ne produisent pas de WORK_SET musculaire**, ni de tonnage, ni de série de jambes. Un type générique d’intervalle suffit ; distance, GPS, puissance et plans de course complets ne sont pas nécessaires à V2.

### D.7 États persistés des timers

| Timer | État minimal durable | Ce qui est calculé |
|---|---|---|
| Séance | workout/profile, START_SESSION, END_SESSION éventuel, qualité d’horloge | Temps total depuis le début ; toutes les pauses et attentes comprises |
| Repos | `rest_id`, `from_set_id`, `scope_key`, fin observée, cible initiale, cible ajustée et échéance | Reste avant la cible, puis dépassement positif ; le timer n’atteste pas de la reprise |
| Série au temps | set/profile, segments actifs, ancre, état, cible | Temps réellement chronométré à confirmer ; pas de durée infinie de fond après un arrêt |
| Corde/vélo | block/profile, recette figée, temps actif, ancre, pauses, position et confirmations | Étape courante et temps restant à partir des bornes, selon les règles L |

Les fonctions visuelles peuvent rafraîchir toutes les 200–1 000 ms. Le nombre de rafraîchissements n’entre jamais dans les calculs de vérité.

### D.8 Intégrité

- Toutes les données personnelles portent `profile_id`. Toutes les clés de requête, cache, calcul de record, recommandation, export et suppression l’incluent.
- Une seule série active par profil et une seule séance active par profil ; le second profil peut avoir sa séance personnelle sur le même appareil. Changer l’affichage ne change aucun propriétaire.
- Un END_SET répété ne duplique pas la série. Annuler/modifier une saisie conserve son identité et la trace de correction.
- Un résultat de type REPS n’est pas interprété en secondes sans transformation documentée ; une chaîne non numérique ne devient pas zéro.
- Toute relation manquante ou tout enum inconnu à l’import entraîne une conservation/alerte de compatibilité, pas un effacement silencieux.

## E — Migration V1 → V2

### E.1 Identifier les formats par leur structure

Le nom « V1 » désigne ici l’application avant cette refonte. Son export examiné possède : `v`, `exported`, `profile`, `programs`, `logs`, `states`, `course`, `workoutDraft`. **Il porte `v: 2` sans être le nouveau format.**

Détection :

1. Nouveau format uniquement si `format = coach-muscu-backup` et `schemaVersion` supportée ; vérifier ensuite sa structure.
2. Sinon, reconnaître le format ancien par ses champs et leur structure effective. Le champ `v` aide à sélectionner le lecteur ancien, sans suffire à reconnaître la V2 cible.
3. Autre format : erreur explicite et non destructive. Un fichier Alana/Timéo ne doit pas devenir un fichier Coach Muscu par simple ressemblance des champs.

### E.2 Référence réelle à préserver

| Inventaire de l’export examiné | Mathieu (`moi`) | Partenaire (`pote`) | Total |
|---|---:|---:|---:|
| Entrées exercice-séance | 95 | 104 | **199** |
| Entrées avec `setsDetail` non vide | 17 | 3 | **20** |
| Observations de séries présentes dans `setsDetail` | 45 | 9 | **54** |
| Entrées sans détail de séries | 78 | 101 | **179** |
| Groupes de séances par ancien `sessionId`, séparés par profil | 13 | 14 | **27** |
| États journaliers | 16 | 17 | **33** |
| Modèles de séance exportés | 4 | 4 | **8** |

`course` contient deux listes `runs` vides et `workoutDraft` est vide dans ce fichier. Le lecteur ne doit pas présumer que ces champs seront toujours vides dans d’autres exports.

Les **54 observations détaillées ne sont pas automatiquement 54 séries de travail comparables** : rôle approche/travail, unité ou variante peuvent rester inconnus. Les 179 agrégats ne deviennent pas de nouvelles observations de séries.

### E.3 Correspondances

| Ancien champ | Destination | Précaution |
|---|---|---|
| `profile: pote` à la racine | Préférence d’affichage | Ne signifie pas que tout le fichier appartient au partenaire |
| `programs.moi/pote.seances` | Révisions de programmes historiques | N’écraser ni le programme d’origine ni le futur plan corrigé |
| `logs.<profil>.<exId>[]` | Résumés historiques + groupes de séances | Chaque entrée possède une référence stable à son emplacement brut |
| `setsDetail[]` | Observations de séries importées | Préserver chaque poids/répétition réellement détaillé ; rôle/unité inconnus autorisés |
| `reps`, `sets`, `weight` agrégés | `legacy_summary` | Ne pas dérouler en séries identiques ; ne pas additionner le résumé et son détail dans les mêmes totaux |
| `date`, `sessionId` | Dates/identifiants historiques et références de groupement | Jamais START_SET, END_SET, START_SESSION ou END_SESSION mesurés |
| `unit`, `equipment`, `weightPerHand`, `totalWeight` | Charge structurée et brut conservé | Ne pas doubler une charge par main deux fois ; garder les ambiguïtés |
| `states.<profil>.<date>` | Readiness historique avec provenance non vérifiée | Ne pas utiliser les anciennes valeurs répétées comme valeurs du jour |
| `warmupDone`, `stretchDone` | Déclarations historiques conservées | Ne prouvent ni durée, ni corde, ni bloc complet détaillé |
| `reco`, `status`, `volumeTotal`, `dropOffPct`, `bestSet` | Résultats calculés anciens, marqués LEGACY_DERIVED | Consultables mais non recopiés comme calculs V2 fiables |
| `course`, `workoutDraft`, champs inconnus | Archivage intact + adaptateur si schéma reconnu | Ne pas jeter ce que la V2 n’affiche pas encore |

Groupement des séances : utiliser **profil + ancien sessionId** ; si absent, un groupement proposé reste incertain, sans fusion par simple date civile. Les groupes historiques gardent un état final `UNKNOWN` si l’export ne prouve pas leur complétion. Leur durée reste inconnue.

### E.4 Les ambiguïtés connues

| Cas | Décision de migration |
|---|---|
| Planche/latéral stockés dans `reps` | Garder `legacyValue` et `legacyUnit`; afficher l’ambiguïté. Conversion en secondes seulement après convention vérifiée, avec note de migration et brut récupérable |
| Copenhagen ancien | Distinguer dynamique/isométrique, côté et unité ; ne pas transformer automatiquement « 10 » en 10 s |
| Shrugs partenaire à 12 séries | Garder le 12 brut et une annotation de correction connue vers 2 séries voulues. Ne pas inventer deux séries exécutées ; le socle nouveau n’inclut pas les shrugs |
| Readiness répétée 7,5 h / 7 / 7 / 3 | Conserver comme valeurs historiques non vérifiées ; pas de préremplissage du jour ni d’analyse présentée comme certaine |
| Rowing `db_single` versus poitrine appuyée | `variant_resolution = UNRESOLVED` jusqu’à confirmation ; ne pas renommer silencieusement tous les résultats |
| Pallof 45–50 kg | Garder unité/valeur d’origine avec drapeau machine/montage à confirmer ; pas de conversion de poulie arbitraire |
| Bande portant une inscription en kg | Inscription dans les métadonnées du matériel ; pas une charge mesurée dans les résultats |
| Tractions partenaire 3×5 annoncées maintenant | Ajouter un **repère déclaré** distinct, pas trois séries datées inventées dans les logs importés |

Métadonnées nécessaires : `legacy_source_ref`, `legacyValue`, `legacyUnit`, `migrationStatus` (EXACT/ANNOTATED/NEEDS_REVIEW), `migrationNote`, `dataConfidence`, auteur/date d’une correction. Ces métadonnées peuvent être regroupées dans un objet de provenance.

### E.5 Procédure de migration non destructive

1. Lire le stockage réel et son export sans modifier la source. Conserver un instantané de retour et le texte brut de l’export, avec empreinte SHA-256. Une chaîne UTF-8 complète permet de reconstituer le fichier ; pas besoin de recopier le brut dans chaque série.
2. Valider la forme, les profils, les valeurs et les références. Produire l’inventaire ci-dessus pour la fixture connue, et un inventaire dynamique pour tout autre fichier.
3. Construire un jeu V2 **candidat séparé**. Importer 199 résumés et 54 observations de détail pour cette fixture, liés pour éviter un double comptage. Conserver aussi les huit plans anciens et les 33 états.
4. Attribuer des IDs déterministes aux éléments importés, avec profil et emplacement source ; préserver les doublons internes du brut tant qu’ils ne sont pas expliqués. Réimporter le même fichier identifié par son empreinte est un no-op.
5. Valider intégrité, totaux, inconnus et export/réimport du candidat. Générer un rapport des 179 agrégats sans détail et des ambiguïtés ; aucune « complétion » artificielle pour atteindre les totaux d’un plan.
6. Basculer le pointeur/transaction vers le candidat seulement après réussite. Une interruption avant la bascule laisse l’ancien jeu actif. Échec d’écriture : retour à l’ancien, message clair, aucune suppression préalable.
7. Installer les nouvelles révisions de programme pour les futures séances, séparément de l’import historique. La date d’effet ne redéfinit pas les séances passées.
8. Conserver l’export initial et une option de retour. Ne pas purger automatiquement l’archive V1 après la première ouverture.

### E.6 Imports ultérieurs et aller-retour

- **V2 → V2 vide :** mêmes IDs, profils, valeurs, inconnus, révisions, archives et relations ; seule la métadonnée du nouvel export peut changer. Les données métier doivent être sémantiquement identiques.
- **V2 → base déjà remplie :** fusion par identifiant stable et révision, jamais par nom. Même ID et même contenu = no-op. Même ID avec contenu contradictoire = conflit visible, aucune préférence automatique non justifiée ; préserver les deux versions jusqu’à résolution.
- **Nouvel export ancien qui chevauche l’historique :** détecter les candidats identiques dans le même profil/exercice/session. L’empreinte d’un fichier différent ne permet pas à elle seule de dédupliquer toutes les lignes. Prévisualiser les conflits et ne pas doubler automatiquement le journal. L’import initial et le réimport exact sont la priorité de V2 ; une fusion ambiguë peut rester à résoudre.
- **Export d’un profil :** exporter toutes ses dépendances et uniquement ses données personnelles. Réimport chez l’autre profil ne le renomme pas automatiquement. Export complet et export par profil doivent être explicitement distingués.
- **CSV correspondant au JSON :** usage de contrôle/export lisible ; ne pas l’importer en plus comme un second historique.

## F — SESSION TIMER

### Contrat

`START_SESSION` est déclenché avant le premier échauffement. `END_SESSION` est déclenché à la fermeture volontaire du créneau, après les derniers blocs effectivement effectués ou explicitement sautés. Le temps total est la différence entre ces bornes valides ; pour une séance en cours, utiliser maintenant à la place de la fin.

Il inclut préparation, corde, approches, séries, repos, réglages, attente du partenaire, vélo, transitions et retour au calme. Il continue lors d’une pause du vélo, d’un passage en arrière-plan ou d’une attente. Le bouton de pause visible dans le vélo concerne **le bloc vélo**, pas le temps total de séance.

Un chrono personnel ne devient pas automatiquement le chrono du duo. Les deux personnes peuvent commencer/finir à des moments différents. Ne pas additionner leurs durées pour afficher le temps passé ensemble ; une éventuelle vue duo future devra utiliser leurs bornes communes.

### Reprise et limites

- Persister immédiatement START_SESSION ; persister les étapes et les séries au fil de l’eau. À la réouverture, afficher la séance en cours avec le temps recalculé depuis l’horodatage.
- Ne pas réinitialiser le chrono sur un changement d’onglet ou de profil. Ne pas clôturer parce que le navigateur s’est fermé.
- Si la séance est restée ouverte par oubli, proposer « reprendre » ou « terminer à une heure déclarée ». Conserver la valeur originale et marquer une heure corrigée `DECLARED`; ne pas la présenter comme mesurée par bouton.
- Détecter les bornes inversées ou les incohérences d’horloge observables. En cas d’anomalie, conserver les données, afficher une durée à vérifier et exclure ce temps des analyses. Pas de correction silencieuse par `max(0, …)` qui masquerait une durée négative.
- La durée s’affiche à la seconde en séance, éventuellement arrondie dans l’historique ; les secondes enregistrées ne sont pas remplacées par un minimum d’une minute.

Les navigateurs peuvent ralentir les timers en arrière-plan. Les horodatages permettent de retrouver l’écoulement du temps au retour ; ils ne garantissent pas qu’un signal sonore ait été exécuté au moment voulu. [MDN — Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API).

Utiliser l’horloge monotone pour surveiller les intervalles dans une page active si utile, mais ne pas la supposer persistante entre redémarrages. Le comportement pendant le sommeil du système varie selon les plateformes ; les horodatages muraux restent nécessaires pour les longues reprises, avec signalement des anomalies détectables. [MDN — Performance.now et sommeil](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now).

### Mesurer avant d’optimiser

Afficher d’abord le total et les durées de blocs dont les bornes sont connues. Ne pas produire « travail 25 / repos 30 / attente 12 » en déduisant l’attente par différence d’estimations. Le temps entre blocs peut être affiché comme **temps interbloc non catégorisé**, si ses bornes sont disponibles. Attente et repos se chevauchent physiologiquement : pas de double addition.

Le budget de 60–90 min est un repère, pas une échéance qui termine automatiquement la séance. Deux vélos sont disponibles : les 22 min de chacun peuvent se dérouler en parallèle. Le lundi complet est estimé autour de 80–95 min, avec un objectif de 90 min à confirmer au terrain. Mesurer transitions, pauses et temps complet ; ne pas doubler artificiellement la durée du bloc vélo commun. Ne pas maintenir l’ancienne estimation fondée sur 15 min de vélo facile après modification du bloc.

## G — REST TIMER

Le repos conseillé commence à **END_SET**, avant que l’utilisateur ait fini de renseigner ses reps et son RIR. `recorded_at` peut être plus tard ; ce délai de saisie fait déjà partie de son repos. L’écran de validation ne bloque pas le calcul.

| Famille | Cible initiale par défaut | Priorité de la prescription |
|---|---|---|
| Gros développés, tractions, presse | 150–180 s ; configurable dans environ 120–180 s et au-delà si besoin | Prescription individuelle de N.2 avant défaut de famille |
| Rowing avec appui | 120 s, ajustable entre 90–180 s | Avant le même côté s’il est unilatéral |
| Leg curl, leg extension | 90–120 s | Possibilité de prolonger |
| Curls, latéraux, développé serré | 60–120 s selon exercice | Serré plutôt 90–120 s ; pas de défaut court imposé partout |
| Tronc | 45–90 s | Contrôle et respiration |
| Copenhagen | 60–120 s avant le même côté | Côté et dose personnels |

Ces cibles viennent du programme retenu et des plages validées dans la mission. Elles ne sont pas une preuve de récupération complète. Les repos assez longs peuvent aider à préserver la performance ; cela ne permet pas de déduire la durée parfaite pour une personne à partir du seul nom de l’exercice. [Schoenfeld et coll., essai de repos 2016](https://pubmed.ncbi.nlm.nih.gov/26605807/).

L’utilisateur peut ajouter 30 s, ajuster la cible ou commencer avant. Conserver la cible initiale et la cible modifiée pour éviter de réécrire le contexte après coup. À zéro, afficher « cible atteinte » puis le temps supplémentaire ; **ne jamais démarrer automatiquement la série suivante** ni enregistrer un START_SET au bip. Fermer le panneau de repos ne signifie pas avoir commencé à travailler.

Le changement de profil ne détruit pas le repos de l’autre. Un événement doit agir sur le `profile_id/workout_id/set_id` attaché au bouton, et non sur une variable globale qui aurait changé pendant une écriture.

## H — Vrai temps de repos et analyse du drop-off

### H.1 Mesure

Pour deux séries comparables d’un même exercice/contexte :

**actual_rest_sec = START_SET(suivante) − END_SET(précédente)**, en secondes.

Conditions : même profil et séance, bornes observées valides, ordre temporel cohérent, aucune confusion de variante ou de côté. Pour un exercice unilatéral, identifier la précédente série du **même côté**. Le temps passé à travailler l’autre côté peut constituer l’intervalle de récupération locale ; le libellé doit être « intervalle avant le même côté ».

| Situation | Résultat |
|---|---|
| END_SET 18:00:40, START_SET suivant 18:03:10 | 150 s mesurés |
| Seulement deux fins de séries | `actual_rest_sec = null`, état UNKNOWN, raison MISSING_START |
| START_SET renseigné rétrospectivement à une heure estimée | Intervalle déclaré/estimé, séparé du repos observé |
| Changement de profil, exercice ou variante | Ne pas raccorder les deux séries comme repos comparable |
| Autre exercice réalisé entre les deux | Conserver le délai entre séries et le contexte d’intercalage ; ne pas l’appeler repos passif. Pour l’analyse simple V2, exclure cette paire de l’analyse repos/performance |
| Autre côté du même exercice entre les deux | Mesure locale possible avec contexte explicite ; ne pas utiliser la fin du côté droit comme départ du repos gauche |
| Horodatage manquant, inversé ou anomalie d’horloge détectée | Inconnu avec raison ; aucun zéro fabriqué |
| Repos conseillé expiré mais personne n’a redémarré | Continuer le temps écoulé ; résultat final seulement au START_SET observé |

Stocker la paire `from_set_id/to_set_id`, la clé de contexte, les bornes et la version du calcul, ou les dériver sans duplication. Toute correction d’une borne invalide les calculs et recommandations concernés.

### H.2 Analyse simple, descriptive

Comparer seulement des séries dynamiques de même variante, charge/unité et contexte suffisamment stable, sans approche ni essai ; même côté pour l’unilatéral. Pour les exercices au temps, une durée n’a de sens comparatif qu’à levier et consigne comparables. Une charge différente, une série volontairement arrêtée plus tôt ou une prescription différente rend l’interprétation limitée.

Exemple autorisé : « Repos plus court que la cible et baisse de répétitions observés ensemble. Tu peux tester 30 secondes de plus. » Joindre les séries concernées et indiquer si le RIR manque. Ne pas affirmer une cause. Aucun changement automatique du programme après une seule baisse de reps.

### H.3 Définitions uniques des pourcentages

Pour la première et la dernière valeur **comparables et connues**, avec première valeur strictement positive :

- `variationPct = 100 × (dernière − première) / première` : signée.
- `dropOffPct = max(0, 100 × (première − dernière) / première)` : baisse seule.

| Valeurs | variationPct | dropOffPct | Lecture |
|---|---:|---:|---|
| Reps 10 → 9 → 8, même charge | −20 % | 20 % | Baisse entre première et dernière |
| Reps 10 → 10 → 11, même contexte | +10 % | 0 % | Hausse, pas drop-off de 9 % |
| Durées 70 → 90 s, même consigne | +28,6 % | 0 % | Hausse de durée, pas une baisse |
| Une seule série, première inconnue ou égale à zéro | Inconnu | Inconnu | Pas de division ni de score de remplacement |
| Charge, levier ou prescription modifiés | Non comparable par défaut | Non comparable | Pas de pourcentage global de force inventé |

Le choix première/dernière est un contrat explicite. Ne pas mélanger avec une ancienne formule maximum/dernière. Les anciennes valeurs `dropOffPct` sont conservées comme calculs hérités, pas recyclées comme indicateurs V2.

## I — Moteur de progression

### I.1 Cycle et provenance

**CALIBRATION → BASELINE_VALIDATED → PROGRESSION.** Un repère déclaré ou une première exposition peut porter le statut `BASELINE_CANDIDATE` pendant la calibration. Il ne devient pas validé parce qu’un nombre a été saisi deux fois.

Contexte de comparaison : profil, exercice, variante, configuration significative, unité de charge, côté, place du mouvement dans la séance et version de prescription. Les performances restent visibles si le contexte change, avec une mention de comparabilité limitée. La baseline ne migre pas automatiquement d’un tirage élastique vers une traction classique.

Règle initiale de validation : deux expositions suffisamment comparables, résultats réellement saisis, difficulté/technique cohérentes, réserve comprise et tolérance vérifiée. Prolonger la calibration si ces informations manquent. Deux expositions constituent un repère pratique du programme, pas une preuve scientifique de stabilité.

### I.2 Ordre des décisions

| Priorité | Situation | Décision proposée | Effet autorisé |
|---|---|---|---|
| 1 | Douleur nouvelle/croissante déclarée, technique dégradée | `TECHNIQUE_FIRST` | Suspendre la progression ; proposer adaptation ou arrêt du mouvement selon les règles déjà retenues |
| 2 | Variante/machine/configuration significativement différente, ancien repère non applicable | `RECALIBRATE` | Ouvrir un contexte de référence distinct, historique conservé |
| 3 | Séries absentes, RIR/technique clés inconnus, données incompatibles | `KEEP_LOAD` + motif données insuffisantes | Pas de hausse dite « validée » ; proposer de renseigner la donnée utile, sans bloquer la fin de séance |
| 4 | Plage en construction, série correcte et effort compatible | `ADD_REP` ou `KEEP_LOAD` | Exemple : une répétition propre de plus sur le total, sans promesse de gain chaque séance |
| 5 | Toutes les séries prévues comparables en haut de plage, réserve/technique/tolérance cohérentes, confirmation du repère | `ADD_LOAD` si le palier réel convient | Proposition réversible ; aucun saut matériel imaginaire |
| 6 | Haut de plage au poids du corps/TRX, difficulté devenue faible | `HARDER_VARIANT` | Une seule variable à la fois : assistance, levier, amplitude ou petit lest disponible |
| 7 | Nouvelle charge sous le bas de plage ou contrôle dégradé malgré repos adapté | `REDUCE_LOAD` | Retour au palier soutenable ; pas de séries forcées pour justifier le changement |
| 8 | Stagnation sur plusieurs expositions comparables, dose modeste, tolérance et temps disponibles | `ADD_SET` éventuellement | Une série ciblée, après vérification du repos, de la régularité et du contexte |
| 9 | Baisse sur plusieurs mouvements avec fatigue persistante réellement renseignée | `DELOAD` candidat | Proposition de réduction temporaire ; pas de diagnostic fondé sur un score de readiness |

Les priorités 8–9 requièrent des observations suffisantes ; une séance compacte ou de reprise ne doit pas déclencher artificiellement une alerte de baisse de volume. Aucun pourcentage de charge hebdomadaire automatique.

### I.3 Sortie explicable et application

Chaque recommandation conserve : `action`, raisons lisibles et codes de raison, `evidence_set_ids`, contexte, données manquantes, proposition précise, version de règle, date, statut proposée/acceptée/refusée. Une recommandation n’est pas un résultat d’entraînement.

L’application peut prévisualiser la prochaine cible, mais la modification retenue doit être visible. Elle s’applique aux futures séances, pas aux séries déjà réalisées. Ne pas multiplier les boîtes de confirmation pendant l’entraînement : une carte de bilan « Prochaine fois : … » avec possibilité de garder/adapter suffit.

**Exemples contractuels :**

- Mathieu, incliné 20 kg, 10/10/9 dans 8–12 : KEEP_LOAD, puis objectif possible 10/10/10. Sans RIR, conserver la tendance mais signaler que l’effort reste à confirmer.
- 20 kg, 12/12/12 avec effort connu et technique/tolérance cohérentes : considérer le prochain palier réellement disponible. 23 kg représente +15 % ; ce n’est pas une hausse automatique.
- Latéraux à 4 kg en haut de plage : ne pas prescrire 7 kg par simple dépassement. Le saut est +75 %. Conserver la charge, la plage ou proposer une autre difficulté documentée.
- Zéro série enregistrée : aucune baseline validée, aucun record, aucune augmentation.
- Douleur non renseignée : ne pas afficher « sans douleur ». Une hausse nécessitant une vérification de tolérance reste non validée si celle-ci est inconnue ; aucune demande forcée à chaque série pour terminer une séance.
- Partenaire, déclaration « 3×5 tractions » : repère candidat ; pas de recommandation de lest avant observation comparable.

Les mêmes règles peuvent servir aux deux profils ; les entrées, baselines, décisions et acceptations restent séparées.

## J — Progression selon le matériel

| Matériel / mesure | À enregistrer | Progression admise | À interdire |
|---|---|---|---|
| Haltères par paire | kg par main, palier effectif, éventuellement total dérivé explicitement libellé | Reps puis palier réel faisable | Confondre 20 kg/main avec 20 kg au total ; proposer 21 kg sans matériel correspondant |
| Haltère unique | Masse de l’unique haltère, côté et appui | Reps, palier, variante | Doubler automatiquement sa charge pour comparer au développé |
| Barre | Masse totale réellement assemblée, barre incluse si convention confirmée | Reps puis disques disponibles | Déduire toute la grille de charge du seul « plus de 50 kg » |
| Machine | Appareil, siège/appuis, affichage et unité, amplitude | Reps puis palier de cette machine | Comparer les kilos de deux presses comme une mesure uniforme de force |
| Tractions / pompes | Variante, assistance/appui, amplitude, répétitions, poids corporel daté si renseigné, lest externe séparé | Reps, assistance moindre, levier ou petit lest | Reconstituer le poids du jour depuis le profil ; tonnage exact fictif d’une pompe |
| TRX | Ancrage, longueur de sangle, repère pieds, variante, amplitude, reps/RIR | Reps puis un déplacement/configuration documenté | Transformer angle ou masse corporelle en kg de résistance précis |
| Élastiques | `band_id`, couleur, inscription commerciale, ancrage, distance et configuration | Reps puis modification d’un paramètre | Traiter « bande 25 kg » comme 25 kg mesurés |
| Gainages / Copenhagen iso | `duration_sec`, côté, levier, appui, tolérance | Durée dans la plage puis levier, si pertinent | Durée infinie ou cumul de pauses présenté comme tenue continue |
| Copenhagen dynamique | Reps par côté, levier et tolérance | Contrôle, reps puis difficulté | Convertir les reps en secondes |
| Ab wheel | Variante à genoux, amplitude/repère, contrôle | TEST avant remplacement d’un autre gainage | Ajout automatique au volume ou record basé sur une cambrure |

Grille connue des haltères : **2, 4, 7, 9, 11, 14, 16, 18, 20, 23 kg**. Maximum annoncé : 41 kg. La grille au-dessus de 23 reste inconnue ; les anciennes valeurs telles que 12 kg ne sont pas arrondies ni supprimées. Le paramétrage de la grille future n’altère pas les charges historiques.

Un éventuel indicateur de charge externe × répétitions reste un indicateur descriptif par exercice et unité compatibles. Il n’est ni un score d’hypertrophie ni un pourcentage de force gagné. Les comparaisons qui incluent bandes/TRX restent dans leurs propres configurations.

## K — Module PROGRESSION / MENSURATIONS

### K.1 Données et saisie

Un relevé contient : `measurement_id`, `profile_id`, date civile, heure/fuseau facultatifs, valeurs saisies, unités, conditions facultatives, méthode/repère facultatif, provenance, révision. Une seule mesure suffit à enregistrer ; aucune obligation de tout remplir.

| Clé proposée | Libellé / unité | Précaution |
|---|---|---|
| `body_weight_kg` | Poids, kg | Decimal français accepté ; aucune pesée d’aujourd’hui inventée depuis « environ 65/93 kg » |
| `waist_navel_cm` | Tour au nombril, cm | Distinct de la taille au point le plus creux |
| `abdomen_max_cm` | Tour de ventre au plus large, cm | Distinct du nombril |
| `chest_cm` | Tour de poitrine, cm | Conditions de respiration/position facultatives mais utiles |
| `shoulder_circumference_cm` | Carrure / tour d’épaules, cm | Préciser la méthode ; ne pas mélanger tour et largeur osseuse |
| `upper_arm_right_cm`, `upper_arm_left_cm` | Bras D/G, cm | État contracté/relâché et repère si connus |
| `forearm_right_cm`, `forearm_left_cm` | Avant-bras D/G, cm | Côtés séparés |
| `thigh_right_cm`, `thigh_left_cm` | Cuisse D/G, cm | Repère et côté stables |
| `calf_right_cm`, `calf_left_cm` | Mollet D/G, cm | Même méthode de mesure |

Validation : nombres finis strictement positifs pour poids/tours, zéro refusé comme mensuration, champ vide laissé vide. Accepter « 66,5 » comme 66.5 ; rejeter une chaîne incohérente au lieu d’en extraire silencieusement un début numérique. Une valeur inhabituelle invite à vérifier, sans imposer une prétendue norme corporelle.

Deux relevés le même jour ne se remplacent pas automatiquement. Modifier un relevé conserve son ID et sa révision ; créer un nouveau relevé est une action distincte. Une suppression demande une action explicite et peut être annulée tant que la version conservée le permet. Aucun historique de l’autre profil n’est affecté.

### K.2 Affichage

Afficher dernière valeur connue, date, historique et différence sur une période choisie. La différence se calcule entre deux valeurs présentes du même champ, même unité et méthode compatible. Les valeurs manquantes ne deviennent pas des zéros ; une courbe ne doit pas suggérer une mesure aux dates absentes.

Pas de « masse musculaire gagnée », de taux de graisse inféré ni de lien causal automatique entre un programme et une variation. Les rappels hebdomadaires/mensuels peuvent rester une aide discrète dans l’application ; aucune nouvelle automatisation externe n’est nécessaire à cette V2.

## L — Échauffements, corde, vélo et lundi complet

### L.0 Référence terrain et échauffements Haut A/B/C

**Observation utilisateur du 16/09/2026 :** l’échauffement court du nouveau Haut B a bien convenu aux deux pratiquants, sans fatigue notable rapportée ni rallongement inutile. Sa durée est estimée à **6–8 min**. Le format déclaré comprend mobilité épaules/omoplates, scapular pull-ups ou suspensions actives, tirage élastique léger, quelques tractions faciles et une ou deux séries d’approche du rowing. Conserver cette information comme retour terrain déclaré ; ne pas créer des séries, des horodatages ou une durée exacte de huit minutes dans le journal.

**Règle de programme : environ 6–10 min pour l’ensemble de la préparation des séances haut, approches comprises.** Ce budget comprend les petits repos et les réglages nécessaires à cette préparation ; ce n’est pas 6–10 min générales auxquelles on rajoute toutes les montées en charge. Certaines approches peuvent être distribuées juste avant le mouvement concerné pendant la séance. Ne pas interpréter l’enveloppe comme l’obligation de faire toutes les approches avant le premier exercice, ni comme un plafond rigide si la préparation du jour demande davantage.

| Séance | Préparation de référence | Durée cible et statut |
|---|---|---|
| Haut A | Préparation courte des épaules/omoplates, puis montée en charge progressive au développé incliné. Une approche du développé épaules, si utile, se fait avant cet exercice et appartient à la même enveloppe | Environ 6–10 min au total ; adaptation proposée de la philosophie testée, pas encore validée sur le terrain |
| Haut B | Format testé : mobilité épaules/omoplates → scapular pull-ups ou suspensions actives → tirage élastique léger → quelques tractions faciles ; une ou deux approches du rowing juste avant son travail | Environ 6–8 min déclarées lors de l’essai ; objectif général 6–10 min selon les besoins |
| Haut C | Préparation courte des épaules/omoplates, puis montée en charge progressive au développé couché. Préparation facile du premier tirage au moment nécessaire, en tenant compte du travail déjà effectué | Environ 6–10 min au total ; adaptation proposée, sans refaire toute la routine A puis toute la routine B |

La charge, la difficulté et les répétitions de préparation restent faciles pour **la personne concernée**. Le partenaire ayant un repère de travail à 3×5 tractions, « quelques tractions faciles » ne doit pas se transformer en une série supplémentaire de cinq imposée ; utiliser une assistance si nécessaire pour conserver la facilité. Aucune approche à l’échec, aucun circuit de préfatigue, aucun nombre de séries de préparation rajouté automatiquement à chaque accessoire. Le premier exercice, le contrôle et les besoins du jour guident l’ajustement.

**Comptage et interface :** afficher « Échauffement : environ 6–10 min, approches comprises », avec la référence 6–8 min sur Haut B. Distinguer ce texte de prescription du temps effectivement mesuré. Les segments du bloc WARMUP et les approches WARMUP_SET placées dans STRENGTH appartiennent à la préparation, mais un même intervalle ne doit être compté qu’une fois. Une addition de durées de séries seules n’est pas la durée totale de l’échauffement, car elle omet ses pauses et réglages ; si la ventilation n’est pas mesurable, afficher le total séance et laisser cette ventilation inconnue. Aucune nouvelle saisie chronométrée obligatoire à chaque petit mouvement de mobilité.

**Le conditionnement reste séparé.** ROPE est un bloc d’entraînement, même si placé avant la musculation. BIKE_INTERVALS en est un autre. Les cinq minutes faciles initiales du vélo préparent ses intervalles et restent comptées dans le vélo ; le type d’étape interne WARMUP ne les transfère pas vers l’échauffement musculaire. Les 4 min 30 de corde et les 22 min de vélo ne sont jamais incluses artificiellement dans la cible 6–10 min. Tous ces temps restent inclus une seule fois dans SESSION TIMER.

### L.1 Ordre et distinction des catégories

| Ordre | Bloc | Contenu | Comptage |
|---|---|---|---|
| 1 | WARMUP | Préparation initiale courte, épaules/omoplates ; chevilles si nécessaire avant la corde | Première partie de l’enveloppe 6–10 min ; temps séance, zéro série de travail |
| 2 | ROPE | 4×45 s, récupérations de 30 s entre passages | Bloc d’entraînement séparé de 4 min 30 ; temps séance/cardio, zéro WORK_SET |
| 3 | STRENGTH | Approches puis Haut A défini en M/N | Approches en WARMUP_SET, séries de travail en WORK_SET |
| 4 | BIKE_INTERVALS | Recette corrigée de 22 min | Temps cardio, durée soutenue distincte ; zéro série musculaire |
| 5 | COOLDOWN | Retour au calme/étirements éventuels après le vélo ou après la musculation si vélo sauté | Temps séance si effectivement effectué |

Les approches sont fonctionnellement de l’échauffement, mais s’affichent juste avant le mouvement concerné dans le bloc musculation : notamment avant le premier développé, après la corde. Elles partagent l’objectif de 6–10 min avec la préparation initiale ; ne pas les compter une seconde fois dans WARMUP ni dans le volume de travail. Les trois minutes faciles finales du vélo appartiennent **au bloc vélo** ; le COOLDOWN séparé ne les duplique pas. Conserver la durée réelle même si elle dépasse la cible ; ne pas allonger ou couper automatiquement l’échauffement pour atteindre un chiffre.

**Organisation confirmée : deux vélos disponibles.** Les 22 min de chacun peuvent être réalisées en parallèle, avec des résultats personnels. Ne pas ajouter 44 min au créneau commun ni développer une synchronisation obligatoire. Lundi complet estimé environ 80–95 min à deux, préparation/approches et fin incluses ; le temps réel prime. L’objectif de 90 min est plausible avec transitions préparées. Si la corde avant les développés dégrade la performance, son déplacement après la musculation est une adaptation explicite, sans changement de catégorie en échauffement.

### L.2 Recette corde

| Étape | Type | Durée |
|---|---|---:|
| 1 | Corde 1/4 | 45 s |
| 2 | Récupération | 30 s |
| 3 | Corde 2/4 | 45 s |
| 4 | Récupération | 30 s |
| 5 | Corde 3/4 | 45 s |
| 6 | Récupération | 30 s |
| 7 | Corde 4/4 | 45 s |
| **Total programmé** | **180 s de corde + 90 s de récupération** | **270 s = 4 min 30** |

Pas de quatrième repos ajouté automatiquement. Intensité cible facile à modérée, comme demandé. L’interface présente CORDE, passage x/4 et chrono ; pendant la récupération, REPOS et chrono. Actions : pause, reprendre, passer le passage, arrêter/raccourcir, signaler une gêne, terminer.

Les étapes passent automatiquement pendant le guidage actif. Un passage manqué reste SKIPPED ; un passage interrompu conserve sa durée réalisée confirmée. Un bloc de trois passages complets affiche 3/4, pas 4/4. On peut passer directement à la musculation sans marquer tout le lundi comme raté.

### L.3 Recette vélo de référence : `bike_monday_22_v1`

**Correction de calcul documentée :** l’ancienne description de la mission additionne 24 minutes. La recette ci-dessous respecte 22 minutes en remplaçant le dernier couple récupération 2 min + retour au calme 3 min par un seul retour au calme de 3 min. Elle ne retire aucun des quatre efforts soutenus. Si l’utilisateur souhaite finalement conserver littéralement les quatre récupérations de deux minutes, créer une recette **24 min** distincte ; ne pas changer celle-ci sans révision.

| Étape | Fenêtre depuis le départ | Type | Durée | Intensité cible |
|---|---|---|---:|---|
| 1 | 00:00–05:00 | Mise en route facile | 300 s | Facile |
| 2 | 05:00–07:00 | Effort 1/4 | 120 s | RPE indicatif 7–8/10 |
| 3 | 07:00–09:00 | Récupération 1 | 120 s | Facile, active |
| 4 | 09:00–11:00 | Effort 2/4 | 120 s | RPE indicatif 7–8/10 |
| 5 | 11:00–13:00 | Récupération 2 | 120 s | Facile, active |
| 6 | 13:00–15:00 | Effort 3/4 | 120 s | RPE indicatif 7–8/10 |
| 7 | 15:00–17:00 | Récupération 3 | 120 s | Facile, active |
| 8 | 17:00–19:00 | Effort 4/4 | 120 s | RPE indicatif 7–8/10 |
| 9 | 19:00–22:00 | Retour au calme, récupération finale incluse | 180 s | Facile |
| **Total** | **00:00–22:00** | **4 efforts ; 8 min soutenues, 14 min faciles** | **1 320 s** | **Pas un test maximal** |

RPE cardio et RIR musculaire sont deux champs différents ; ne pas les fusionner. Aucun watt, fréquence cardiaque, distance ou dépense calorique n’est déduit de ces durées. Le réalisé peut rester inférieur à la recette.

### L.4 Machine d’exécution minimale

Au lancement, figer la recette et persister l’ancre temporelle. Le temps actif du bloc est le cumul des segments réellement guidés hors pauses explicites. La position se déduit des étapes restantes à partir d’un curseur persistant ; ne pas ajouter une seconde par tick. Chaque transition automatique s’applique une seule fois par `block_id/step_id`.

État d’exécution suffisant : index de l’étape courante, temps déjà guidé dans cette étape avant la dernière ancre, ancre UTC, état pause/en cours, étapes explicitement sautées et résultats déjà enregistrés. À la reprise, distribuer le temps écoulé depuis l’ancre sur le reste de l’étape puis les étapes non sautées, avec bornes plafonnées aux durées prévues. Persister le nouveau curseur de façon idempotente. **Passer une étape déplace le curseur sans ajouter sa durée au temps guidé ni au temps réalisé.** Calculer la pause à l’instant du clic avant de figer cet état. Une durée d’étape négative ou une recette incohérente est refusée à la validation.

| Action | Timer de bloc | SESSION TIMER | Réalisé |
|---|---|---|---|
| Démarrer | Ancre créée, étape 1 | Continue | Rien crédité avant confirmation |
| Pause | Temps actif arrêté, état persisté | Continue | Durée déjà guidée conservée |
| Reprendre | Nouvelle ancre sur le temps actif cumulé | Continue | Pas de recommencement de la recette |
| Passer une étape | Étape marquée sautée, suite affichée | Continue | Zéro confirmé pour une étape explicitement non faite ; aucune durée nominale ajoutée |
| Raccourcir | Arrêt du guidage ou fin après un retour facile choisi | Continue jusqu’à END_SESSION | Durées réellement réalisées, état SHORTENED ; objectif initial conservé |
| Arrêter pour gêne | Timer arrêté et motif proposé | Continue jusqu’à la fermeture du créneau | Pas de travail supplémentaire prescrit automatiquement |
| Chrono arrivé au bout | Guidage FINISHED | Continue vers cooldown/fin | Demander une confirmation rapide du réalisé, pas créditer automatiquement 22 min |

L’édition d’une durée n’écrase pas l’objectif d’origine. Si 14 minutes sont confirmées sur une recette de 22, afficher **14/22 min, raccourci**. Un simple total de 14 min déclaré ne permet pas d’inventer les phases exactes : conserver la ventilation UNKNOWN si l’utilisateur ne confirme pas la chronologie proposée.

### L.5 Arrière-plan, verrouillage et confirmation

En arrière-plan, les callbacks peuvent être suspendus. Au retour : recalculer la position théorique depuis l’ancre et les pauses persistées, ne pas rejouer tous les bips manqués, afficher le contexte et demander « tu as suivi le bloc jusque-là ? ». La confirmation peut porter sur toutes les étapes théoriquement écoulées, ou permettre de raccourcir/saisir le réalisé. C’est une déclaration utilisateur, pas une mesure de mouvement.

Ne pas marquer une étape PENDING comme COMPLETED uniquement parce que l’horloge a avancé pendant que le téléphone était verrouillé. Ne pas prolonger une ancienne étape complète parce que son callback n’a pas tourné. Les minutes confirmées avant la fermeture restent confirmées ; seules les nouvelles périodes incertaines attendent une réponse.

Son et vibration sont facultatifs et soumis aux capacités/permissions du navigateur. Une option « garder l’écran allumé » peut demander un wake lock lorsqu’il est disponible ; son absence ou son refus ne bloque pas la séance. Il peut être relâché quand le document devient inactif, donc il ne garantit pas les alertes écran verrouillé. [MDN — Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API).

La V2 doit garantir la **reconstruction honnête de l’état au retour** dans les limites d’une écriture persistée et d’une horloge cohérente. Elle ne doit pas promettre une alarme native infaillible pendant la fermeture du navigateur. Le protocole de test réel note séparément reprise du chrono et réception des alertes.

### L.6 Statuts et résumé

| Exemple | Bloc musculation | Corde | Vélo | Résumé permis |
|---|---|---|---|---|
| Tous les blocs réalisés et confirmés | COMPLETED | COMPLETED | COMPLETED | Séance terminée, blocs détaillés |
| Haut A fait, vélo non commencé et explicitement sauté | COMPLETED | Selon réalisé | SKIPPED | **Musculation terminée · vélo sauté** |
| Trois passages de corde et 14 min de vélo | COMPLETED | SHORTENED, 3/4 | SHORTENED, 14/22 | **Musculation terminée · conditionnement partiel** |
| Guidage terminé, réalisation non confirmée | Selon réalisé | PENDING/UNKNOWN si concerné | UNKNOWN | **Temps du guidage écoulé · réalisé à confirmer** |
| Fermeture brutale avant clôture | État persisté | État persisté | État persisté | Séance à reprendre, pas séance complétée automatiquement |

Un vélo sauté ne réduit pas un record de développé et ne transforme pas une séance compacte réussie en échec. L’assiduité de musculation et la réalisation des blocs cardio sont deux indicateurs distincts.

## M — Séances normales, compactes, courtes et de reprise

### M.1 Répartition et règle de référence

**La répartition hebdomadaire est conservée :** lundi A ; mardi B ; jeudi futsal ; vendredi C ; samedi Jambes. Aucun Bas A ni deuxième jour jambes. Repos mercredi, dimanche normalement libre ; report exceptionnel choisi, sans dette de volume à rattraper.

Les contenus ci-dessous intègrent les décisions de l’audit scientifique et remplacent les prescriptions incompatibles pour les séances futures. Une nouvelle révision de programme préserve les anciennes séances et leurs instantanés. Une série unilatérale par côté constitue un groupe, pas deux séries à additionner au total de la séance ; le réalisé conserve néanmoins chaque côté séparément.

### M.2 Versions et ordre canonique

| Séance | Version / nom à afficher | Prescription de séries dans l’ordre | Total cible |
|---|---|---|---:|
| HAUT_A Mathieu | NORMAL | Incliné 3, épaules 2, pompes 3, latéraux 3, Copenhagen 2 par côté | 13 groupes |
| HAUT_A partenaire | NORMAL | Même répartition, Copenhagen 1 par côté | 12 groupes |
| HAUT_B chacun | NORMAL | Vertical 3, rowing appui 3 par côté si unilatéral, face pull 2, marteau 3, tronc 2 | 13 groupes |
| HAUT_C chacun, **défaut et premier essai** | COMPACT / **BASE 13** | Couché 3, vertical 2, TRX 2, serré 2, latéraux 2, supination 2 | 13 |
| HAUT_C chacun | NORMAL / **AVEC COMPLÉMENT 15** | Base 13, puis **un seul** complément de 2 : shrugs OU oiseau poitrine appuyée | 15 |
| HAUT_C chacun | SHORT / **COURTE 11** | Base 13 sans curl supination ; **serré conservé** | 11 |
| LEGS chacun | NORMAL, après reprise | Presse 4, curl 4, Glute Drive 2, extension 2, adducteurs 1, mollets 3, Pallof 2 par côté | 18 groupes |
| LEGS chacun | RETURN | Presse 2, curl 2, Glute Drive 2, extension 1, adducteurs 1 si toléré, mollets 2, Pallof 2 | 12 maximum |
| LEGS chacun | SHORT, après reprise | Presse 3, curl 3, Glute Drive 2, mollets 2 | 10 |

### M.3 Complément et substitution triceps

**Choix du complément :** NONE au premier essai. Shrugs proposés en premier si un ciblage des trapèzes supérieurs est souhaité ; oiseau à la place si un besoin arrière d’épaule est identifié. Jamais les deux ajoutés ensemble, jamais de complément automatique pour atteindre 15. Choix personnel stable sur plusieurs expositions, modifiable explicitement ; pas de rotation aléatoire. La base 13 est une séance complète. Les anciens identifiants internes ne doivent pas imposer NORMAL par défaut dans les nouvelles séances C.

La préférence de complément et son activation sont distinctes. Conserver SHRUG en préférence ne rajoute aucune série à BASE 13 ou COURTE 11. Pour AVEC COMPLÉMENT 15, un choix unique SHRUG ou REAR_DELT doit être explicite ; si le choix est NONE, revenir à BASE 13 ou demander ce choix dans l’interface, sans choisir un exercice à la place de l’utilisateur. Le besoin identifié peut être rappelé dans une note facultative ; aucun score automatique de « muscle en retard » ni questionnaire bloquant à développer. Garder le choix plusieurs expositions, par exemple 4–6, puis réévaluer : repère de suivi, pas durée biologique imposée.

Si le temps ou la récupération deviennent limitants, retirer d’abord le complément du restant. Le statut de séance décrit les séries réellement faites ; aucun rattrapage automatique dimanche.

**Triceps :** développé serré conservé. Extension triceps au-dessus de la tête avec haltère, assis et stable, disponible comme **TEST de substitution** à deux séries ; adoption explicite par profil si confortable, mesurable et préférée. Pas de cumul serré + extension. Variante et progression séparées, sans renommer l’historique. La substitution conserve **un seul emplacement triceps de deux séries**, y compris en COURTE 11 ; initialement cet emplacement contient le développé serré.

Le classement scientifique TEST d’un exercice ne change pas automatiquement le mode de la séance. Un essai de variante au sein d’une séance REAL est une adaptation explicite avec résultats réels. Une séance volontairement lancée en mode TEST conserve les exclusions prévues en D/P. Aucune adoption définitive ni baseline transférée depuis le serré sans décision explicite et calibration.

### M.4 Reprise et changement de version

La version courte jambes ne commande pas trois séries de presse à quelqu’un encore dans la reprise à deux. Au premier retour, RETURN prime. HAUT_A et HAUT_B n’ont pas besoin d’un modèle COMPACT inventé ; les adaptations ponctuelles restent possibles et tracées. Sauter le vélo ne change pas, à lui seul, HAUT_A NORMAL en HAUT_A SHORT.

Changer de version avant départ fige la bonne prescription. Changer pendant la séance produit une adaptation datée avec raison facultative, conserve ce qui a été effectué et recalcule seulement le restant. Un complément déjà réalisé ne disparaît pas en passant à Base 13 ; des séries supplémentaires déjà faites dans une ancienne révision restent historiques. Les séries supprimées du restant ne sont jamais comptées comme réalisées.

### M.5 Totaux de référence

| C et jambes retenus | Total hebdomadaire Mathieu / partenaire | Séries ciblant le haut, chacun |
|---|---:|---:|
| Base C 13 + jambes 18 | **57 / 56** | **35** |
| C avec complément 15 + jambes 18 | **59 / 58** | **37** |
| C court 11 + jambes 18 | **55 / 54** | **33** |
| Premier C base 13 + jambes RETURN 12 maximum | **51 / 50 maximum** | **35** |

Le haut exclut tronc et Copenhagen dans cette dernière colonne. Corde, vélo, futsal et approches ne s’ajoutent pas aux séries musculaires. Ces totaux sont des prescriptions, pas des preuves d’efficacité ni des résultats réalisés. Le tableau de bord compte le réel et indique les incertitudes historiques.

## N — Individualisation Mathieu / partenaire

### N.1 Nouvelles tractions du partenaire

Créer un `performance_reference` : profil `pote`, exercice traction classique, texte déclaré « 3×5 », provenance USER_DECLARED, date de déclaration connue si fournie, date de réalisation inconnue si absente, statut BASELINE_CANDIDATE. **Ne pas ajouter trois séries fictives à l’historique et ne pas déplacer les séries de bandes vers la traction.**

Pour la prescription initiale, viser cinq répétitions par série, avec une plage de calibration **4–6** plutôt que la plage 6–10 de Mathieu. C’est une adaptation explicite autour du nouveau repère, pas une nouvelle conclusion sur sa force. Mardi : trois séries ; vendredi : deux séries, conformément à M/N.2. RIR cible 2–3 pendant la calibration, à vérifier : la déclaration 3×5 ne prouve pas cette réserve.

Si cinq répétitions exigent l’échec ou une compensation, ne pas forcer la cible : enregistrer le résultat réel et proposer une variante assistée/régression identifiée si nécessaire. L’élastique demeure disponible et conserve sa baseline indépendante. Aucun lest automatique à partir de la seule déclaration.

### N.2 Prescriptions à initialiser

Les charges ci-dessous sont des repères historiques proposés, à confirmer ; aucune case « réalisé » n’est préremplie. Les unités des haltères sont par main, sauf rowing à un haltère. Les repos suivent G, avec les précisions du tableau.

| Séance / exercice | Mathieu | Partenaire | Repos et configuration |
|---|---|---|---|
| A — incliné | 3×8–12, RIR 1–2, repère 20 kg | 3×8–12, RIR 2–3, repère 23 kg | 150–180 s ; inclinaison stable |
| A — épaules | 2×8–12, RIR 2, repère 14 kg | 2×8–12, RIR 2–3, repère 16 kg | 120–180 s ; prise confortable |
| A — pompes | 3×8–15, RIR 2, poignées selon confort | 3×8–15, RIR 2–3, mains surélevées | 90–120 s ; support/hauteur notés |
| A — latéraux | 3×12–25, RIR 1–2, repère 4 kg | 3×12–25, RIR 2, repère 7 kg | 60–90 s |
| A — Copenhagen | 2×6–10/côté, dynamique, réserve technique | 1×15–25 s/côté, isométrique court, réserve technique | 60–90 s avant le même côté, prolongeable |
| B — vertical | 3×6–10 tractions, RIR 1–2 | 3×4–6 tractions, cible 5, RIR cible 2–3 à confirmer | **150–180 s pour les deux** ; ne pas garder le repos court de l’ancienne bande par erreur |
| B — rowing appui | 3×8–12/côté, RIR 1–2, repère 18 kg | 3×8–12/côté, RIR 2–3, repère 16 kg | Environ 120 s avant même côté ; variante réelle à confirmer |
| B — face pull | 2×15–20, RIR 2–3 | 2×15–20, RIR 2–3 | 60–90 s ; bande/configuration personnelles |
| B — marteau | 3×10–15, RIR 1–2 | 3×10–15, RIR 2–3 | 60–90 s ; charge personnelle |
| B — tronc | Planche 2×20–40 s, levier adapté | Dead bug 2×6–10/côté | Environ 60 s ; contrôle, sans RIR chiffré obligatoire |
| C — couché | 3×8–12, RIR 1–2, repère 20 kg | 3×8–12, RIR 2–3, repère 23 kg | 150–180 s ; trois séries dans la base stable |
| C — vertical | 2×6–10 tractions, RIR 2 | 2×4–6 tractions, cible 5, RIR 2–3 | 120–180 s ; résultats séparés du contexte B |
| C — TRX | 2×10–15, RIR 2 | 2×10–15, RIR 2–3 | 90–120 s ; repères de pieds personnels |
| C — serré, après TRX | 2×10–15, RIR 2 | 2×10–15, RIR 2–3 | 90–120 s ; charge distincte à calibrer ; conservé en SHORT |
| C — latéraux | 2×12–25, RIR 1–2 | 2×12–25, RIR 2 | 60–90 s ; repères de charge comme A, résultats distincts |
| C — supination | 2×10–15, RIR 1–2 | 2×10–15, RIR 2–3 | 60–90 s ; omis en SHORT |
| C — complément shrugs, si choisi | 2×10–15, RIR 2–3 | 2×10–15, RIR 2–3 | 90–120 s ; en dernier ; charge propre, pas d’élan ni rotations forcées |
| C — complément oiseau appuyé, à la place des shrugs | 2×12–20, RIR 2–3 | 2×12–20, RIR 2–3 | 60–90 s ; même slot de deux séries, réglage du banc stable |
| C — TEST extension triceps au-dessus de la tête | 2×10–15, RIR 2–3 | 2×10–15, RIR 2–3 | 90–120 s ; assis stable ; remplace le serré si adopté, jamais ajouté |
| J — presse | 4×8–12, RIR 2–3 | 4×8–12, RIR 2–3 | 150–180 s ou plus ; aucune ancienne charge imposée |
| J — leg curl | 4×10–15, RIR 2 | 4×10–15, RIR 2–3 | 90–120 s ; appareil/siège notés |
| J — Glute Drive | 2×8–12, RIR 2–3 | 2×10–15, RIR 2–3 | Environ 120 s |
| J — extension | 2×10–15, RIR 2 | 2×10–15, RIR 2–3 | 90–120 s |
| J — adducteurs | 1×12–20, RIR 3 | 1×12–20, RIR 3–4 | Une série : pas de repos intersérie inventé |
| J — mollets | 3×10–20, RIR 2 | 3×10–20, RIR 2–3 | 90–120 s ; genou presque tendu |
| J — Pallof | 2×8–12/côté, réserve technique | 2×8–12/côté, réserve technique | Environ 60 s avant le même côté ; unité/machine à confirmer |

Les nombres de séries des versions M font foi ; C utilise Base 13 par défaut et les deux lignes de compléments sont alternatives. Les plages et adaptations personnelles restent applicables. En RETURN, viser environ 3–4 répétitions en réserve sur les mouvements dynamiques. Le complément de C et les 18 séries jambes ne deviennent pas obligatoires au simple passage d’une semaine ; le couché reste à trois séries dans cette révision.

Aucun antécédent ne devient automatiquement une douleur actuelle. Les données du partenaire à 93 kg n’autorisent pas à calculer ses charges au prorata des 65 kg de Mathieu. Le nouveau contexte tractions impose de **réestimer** ses durées B/C au terrain : ne pas présenter les anciennes estimations avec bande comme des mesures validées.

### N.3 Sélection des exercices : décisions de l’audit à respecter

Les décisions ci-dessous décrivent le programme initial et les conditions d’une adaptation explicite. Elles n’autorisent pas un changement automatique d’exercice selon une seule mauvaise séance, une sensation de brûlure ou un signal EMG. Le confort, les acquis, la progression et le matériel priment sur une supériorité supposée issue d’un essai isolé.

| Séance / exercice | Statut scientifique | Décision concrète |
|---|---|---|
| A — incliné haltères | KEEP | Priorité de poussée ; angle de banc et amplitude constants, mise en place contrôlée ; conserver les acquis de Mathieu |
| A — développé épaules | KEEP | Deux séries, deuxième position ; prise confortable et contrôle lombaire ; pas de nouvelle poussée verticale ajoutée en C |
| A — pompes | MODIFY | Ajuster difficulté, hauteur et poignées, sans augmenter le volume ; hauteur propre au partenaire ; si les triceps limitent trop, revoir difficulté/repos avant toute addition |
| A/C — élévations latérales | KEEP | Trois séries lundi et deux vendredi ; progression en reps puis palier réel, sans élan ni variation gratuite chaque semaine |
| A — Copenhagen | MODIFY | Dynamique deux groupes/côté Mathieu ; isométrique court un groupe/côté partenaire ; réserve technique ; pas d’augmentation simultanée avec les adducteurs machine |
| B/C — tractions | KEEP | Principal vertical, avant curls ; trois séries B et deux C ; assistance calibrée si nécessaire ; contextes B/C et profils séparés |
| B — rowing avec appui | KEEP | Confirmer appui et uni/bilatéral avant renommage ; garder la variante habituelle, amplitude et trajectoire stables ; temps par côté conservé |
| B — face pull | MODIFY | Deux séries modérées, bande/ancrage/distance reproductibles ; ne pas en faire un second rowing lourd ni promettre une correction posturale |
| B — curl marteau | KEEP | Trois séries après les tirages ; charge individuelle et coude/poignet confortables |
| B — planche Mathieu / dead bug partenaire | KEEP | Deux groupes en fin de séance ; progression du levier/contrôle ; temps et reps séparés, sans durée infinie |
| C — couché | MODIFY | Trois séries, première position ; angle horizontal et contexte C identifiés |
| C — TRX | MODIFY | Deux séries ; repères de pieds, sangles et amplitude constants ; difficulté où dos/bras ne sont pas prématurément limités par jambes/tronc |
| C — serré | KEEP | Deux séries en quatrième position, avant latéraux/curl ; variante initiale pour les triceps, également en COURTE 11 |
| C — curl supination | MODIFY | Deux séries en BASE/AVEC COMPLÉMENT ; retirées en COURTE ; aucune série supplémentaire automatique |
| C — shrugs | TEST | Complément exclusif de deux séries si besoin trapèzes supérieurs, en dernier ; pas de rebonds ni rotations forcées ; vérifier grip et confort |
| C — oiseau poitrine appuyée | TEST | Autre choix du même complément ; cible arrière d’épaule, sans ajouter un deuxième complément ; banc et petite charge calibrés |
| C — extension triceps au-dessus de la tête | TEST puis REPLACE seulement si adoptée | Substitution du serré, deux séries au même emplacement, assis stable, amplitude tolérée ; confort et préférence vérifiés par profil ; jamais en supplément |
| J — presse | KEEP | Priorité samedi ; machine, siège, pieds et amplitude reproductibles ; bassin/dos contrôlés ; dose RETURN avant cible normale |
| J — leg curl | KEEP | Deuxième priorité et travail ciblé des ischios ; assis préférable si disponible et confortable, sans imposer un changement si la variante habituelle convient |
| J — Glute Drive | KEEP | Deux séries après leg curl ; extension de hanche sans sur-extension lombaire ; ne remplace ni presse ni curl |
| J — leg extension | KEEP | Complément quadriceps après presse, sans pré-fatigue ; réglages et tolérance du genou propres à chacun |
| J — adducteurs machine | MODIFY | Une série conditionnelle ; premier complément à retirer si fatigue locale ou durée contraignante ; pas de compensation par plus de Copenhagen |
| J — mollets | KEEP | Genou presque tendu, amplitude contrôlée, sans rebond ; tenir compte des mollets/Achille après futsal |
| J — Pallof | KEEP | Deux groupes/côté en dernier ; ancrage, distance et réserve technique personnels |

Si le maintien au TRX est limitant après futsal, un rowing avec appui peut le remplacer explicitement, avec variante et progression distinctes. Les exercices non retenus ne sont pas réintroduits par défaut : deuxième développé épaules en C, curls avant le dos, gainage exigeant vendredi, rowing lourd sans appui, charnière lourde ou transports chargés avant samedi. Aucun squat libre, RDL ou deuxième bas n’est requis pour « compléter » automatiquement les machines jambes.

### N.4 Ordres retenus et récupération sur la semaine

| Séance | Priorités et ordre à préserver | Justification utile pour Work |
|---|---|---|
| A lundi | Incliné → épaules → pompes → latéraux → Copenhagen | Préserver les deux développés chargés ; pompes ajustables ; pas de dos/biceps/arrière d’épaule ajoutés avant B |
| B mardi | Tractions → rowing appui → face pull → marteau → tronc | Aucun curl avant les tirages ; préserver la calibration des tractions ; garder le format apprécié |
| C vendredi | Couché → tractions → TRX → serré ou substitution adoptée → latéraux → supination → complément éventuel | Priorité couché, tirages avant curl, dernier développé avant isolations ; complément de deux séries en dernier |
| J samedi | Presse → leg curl → Glute Drive → extension → adducteurs → mollets → Pallof | Deux priorités préservées ; aucune pré-fatigue quadriceps ni tronc avant presse |

Un ordre différent réellement utilisé est une adaptation à enregistrer ; il ne réécrit pas l’ordre canonique. L’inversion adducteurs/mollets selon disponibilité des machines est acceptable. Donner une autre priorité entre poussées ou tirages exige un choix explicite et rend les comparaisons de performance moins directes.

| Enchaînement | Décision de programmation et limite |
|---|---|
| Lundi → mardi, environ 24 h | Split poussée/tirage conservé ; ceinture scapulaire et fatigue générale se recoupent. Pas de tirages/curls supplémentaires lundi. Examiner aussi corde/vélo si B baisse plusieurs fois |
| Mardi → jeudi futsal | Rowing avec appui et tronc modéré limitent les conflits ; aucune fatigue n’est déclarée nulle par principe |
| Jeudi fin 20 h → vendredi C | Garder mouvements avec appui et TRX adapté ; BASE 13, ou COURTE selon le jour ; pas de jambes ajoutées ni d’échec généralisé |
| Vendredi → samedi 13 h 30 | Le délai peut être inférieur à 24 h selon l’heure de vendredi. Pas de gainage exigeant ni de mouvement très systémique ajouté ; complément retiré en premier si nécessaire |
| Futsal jeudi → jambes samedi | **41 h 30 après la fin du match.** La cible 18 ne vaut pas preuve de récupération ; dose personnelle selon préparation, premières séries, contrôle et tolérance |
| Samedi → lundi | A avec appui reste compatible en principe ; Copenhagen, corde et vélo rechargent certaines zones des jambes. Adapter leur dose si fatigue résiduelle |
| Samedi manqué | Dimanche normalement libre ; report exceptionnel choisi, sans séance automatique ni compensation obligatoire des séries omises |

**Décision au retour jambes :** garder RETURN comme point de départ ; progression vers 18 sans échéance automatique et séparée pour chaque profil. Si fatigue avec geste confortable, adapter charge, réserve ou séries ; une douleur nouvelle/croissante ou un geste altéré appelle une adaptation du mouvement lui-même. Une dose omise n’est jamais transformée en dette. Ne pas augmenter simultanément Copenhagen, adducteurs machine et volume de football.

### N.5 Couverture musculaire et redondances : référence de conception

Ces tableaux vérifient que la sélection et les doses restent cohérentes. Ils ne demandent pas de construire un nouveau moteur anatomique, un score de récupération ou une estimation de croissance musculaire. Les contributions secondaires restent distinctes des séries ciblées ; aucun demi-crédit universel n’est imposé au calcul de volume.
#### Matrice haut du corps — base C à 13, sans complément

**D = séries volontairement ciblées ; S = contribution secondaire importante, non convertie en séries directes.** Pour le dos, un rowing peut cibler à la fois dorsaux et haut du dos selon sa trajectoire : les cinq séries horizontales restent cinq séries réellement faites, pas dix. Les nombres ci-dessous sont prescrits, pas déjà réalisés.

| Groupe | Haut A | Haut B | Haut C | Total / couverture |
|---|---|---|---|---|
| Pectoraux | D 6 : incliné 3 + pompes 3 | — | D 3 couché ; S serré 2 | **D 9**, deux expositions ; couverture solide de départ |
| Dorsaux | — | D vertical 3 ; horizontal 3 à contribution variable | D vertical 2 ; horizontal 2 à contribution variable | **5 verticales + participation aux 5 horizontales** ; dos entraîné deux fois, pas dix séries identiques de dorsaux |
| Haut du dos | — | D rowing 3 ; face pull 2 à rôle complémentaire ; S vertical | D TRX 2 ; S vertical | **5 horizontales + 2 face pull**, répartition mardi/vendredi |
| Deltoïdes latéraux | D 3 ; S épaules 2 | — | D 2 | **D 5**, deux expositions ; dose modérée et mesurable |
| Deltoïdes arrière | — | D face pull 2 sous condition d’exécution ; S rowing 3 | S TRX 2 | **D 2 + S sur 5 horizontales** ; couverture moins spécifique que les latéraux, à observer |
| Deltoïdes antérieurs | D épaules 2 ; S incliné/pompes 6 | — | S couché/serré 5 | **D 2 + 11 poussées secondaires**, deux expositions ; inutile d’ajouter des élévations frontales |
| Biceps / fléchisseurs du coude | — | D marteau 3 ; S tirages 6 | D supination 2 ; S tirages 4 | **D 5 + S sur 10 tirages** ; le marteau partage la cible avec brachial/brachio-radial |
| Triceps | S sur 8 poussées | — | D serré 2 ; S couché 3 | **D 2 + S sur 11 autres poussées** ; travail direct à dominante triceps une fois, contribution deux fois |
| Trapèzes | S développé épaules et stabilisation | Travail moyen/inférieur avec rowing/face pull ; contributions supérieures variables | Travail scapulaire sur tirages ; contributions supérieures variables | **Pas de séries dédiées aux trapèzes supérieurs dans la base**. Couverture du groupe présente, ciblage supérieur incomplet si objectif spécifique |
| Tronc | Copenhagen 2 Mathieu / 1 partenaire, rôle latéral | D planche/dead bug 2 | Stabilisation, sans série supplémentaire dédiée | Avec Pallof samedi : **4 groupes de tronc dédiés + Copenhagen 2/1** ; fonctions complémentaires |

**Effet du complément de C à 15 :** shrugs = deux séries directes pour trapèzes supérieurs ; oiseau = deux séries directes supplémentaires arrière d’épaule, soit quatre dédiées avec le face pull. Tous les autres chiffres sont identiques. Ces compléments sont alternatifs. L’extension triceps, si adoptée en remplacement du serré, conserve deux séries ciblées triceps et enlève sa contribution secondaire pectoraux/avant d’épaule.

#### Matrice jambes — cible après reprise

| Groupe | Haut A | Haut B / C | Jambes samedi | Total / couverture |
|---|---|---|---|---|
| Quadriceps | Corde/vélo non crédités comme séries | — | Presse 4 + extension 2 | **6 séries ciblées**, une séance de musculation ; dose modérée |
| Ischios | — | — | Leg curl 4 ; contribution des autres mouvements non assimilée | **4 séries ciblées**, une séance ; couverture réelle mais volume modeste |
| Fessiers | Stabilisation et conditionnement non crédités | Stabilisation | Glute Drive 2 + contribution importante de presse 4 | **2 ciblées Glute Drive + 4 séries composées pertinentes** ; importance réelle dépend de l’amplitude et des réglages |
| Adducteurs | Copenhagen 2/1 | — | Machine 1 ; contribution grand adducteur sur presse | **3 groupes Mathieu / 2 partenaire** de travail choisi, deux jours, plus contrainte sportive jeudi |
| Mollets | Corde/vélo non crédités | — | Mollets 3 | **3 séries ciblées**, une séance, avec charge sportive supplémentaire jeudi |

**Le futsal compte dans la fatigue et la pratique sportive ; il n’est pas transformé en séries équivalentes.** Une séance jambes suivie et progressive peut produire des résultats. Il serait en revanche abusif d’affirmer que quatre séries d’ischios ou trois de mollets constituent la dose maximale d’hypertrophie pour chacun. La priorité immédiate est une séance réellement effectuée et récupérée, avant d’en augmenter le volume.

#### Fréquence, effort, qualité probable et récupération

| Ensemble | Expositions et intervalle approximatif | Effort prévu | Qualité probable et limite |
|---|---|---|---|
| Pectoraux, latéraux | Lundi/vendredi : environ quatre jours puis trois | Mathieu 1–2 RIR, pompes plutôt 2 ; partenaire 2–3, latéraux 2 | Bonne si développés prioritaires et pompes ajustées ; vérifier la limitation par triceps |
| Dos, arrière d’épaule, bras fléchisseurs | Mardi/vendredi : environ trois jours puis quatre | Tirages B 1–2 Mathieu / 2–3 partenaire ; C plutôt 2 / 2–3 ; face pull 2–3 | Bonne probabilité si pas de curl avant tirage et repos suffisant ; RIR de traction partenaire encore à calibrer |
| Triceps, avant d’épaule | Contributions lundi/vendredi ; ciblage serré vendredi | Épaules/serré Mathieu environ 2, partenaire 2–3 | Recouvrement déjà important ; gains à suivre avant d’ajouter une isolation |
| Trapèzes supérieurs | Contributions ; une exposition ciblée si complément shrug | Complément 2–3 RIR | Dose petite ; cibler davantage seulement si priorité réelle et marge |
| Quadriceps, ischios, fessiers, mollets | Musculation samedi ; futsal jeudi, conditionnement lundi | Après reprise 2–3 RIR ; Mathieu curl/extension/mollets environ 2 ; reprise 3–4 | Incertitude plus forte après foot ; disponibilité réelle et progression priment sur le nombre inscrit |
| Adducteurs | Lundi/samedi + futsal jeudi | Copenhagen réserve technique ; machine 3 Mathieu / 3–4 partenaire | Pas nécessaire de chercher l’échec pour justifier le travail ; tolérance locale décisive |
| Tronc | B et samedi ; rôle latéral lundi | Réserve technique, pas de durée jusqu’à effondrement | Qualité de position, respiration, levier et progression comptent ; ne pas vendre ces séries comme une dose maximale d’hypertrophie abdominale |

Les RIR sont des cibles à estimer, non des faits déjà mesurés. « Qualité probable » n’est pas une validation terrain. Une progression en reps à charge, amplitude et réserve comparables est plus informative qu’un nombre brut de séries.

#### Interprétation des chevauchements

| Chevauchement | Décision |
|---|---|
| Incliné + couché ; tractions + rowing | Compléments utiles, avec recouvrement assumé ; pas besoin de multiplier encore les angles |
| Incliné + épaules + pompes | Redondance acceptable avec deux séries épaules et pompes ajustables ; surveiller limitation triceps |
| Rowing B + TRX C ; latéraux A + C | Répétitions utiles pour répartir la pratique et le volume ; pas de changement gratuit de mouvement |
| Rowing + face pull | Complément utile si face pull reste différent et modéré ; corriger sa technique s’il devient un rowing supplémentaire |
| Tractions + curls | Complément à petite dose ; biceps jamais pré-fatigués volontairement avant le dos |
| Développés + serré | Recouvrement acceptable à deux séries ; extension seulement en substitution si plus pertinente en pratique |
| Face pull + oiseau complémentaire | Choix conditionnel ; ne pas ajouter l’oiseau si la couverture arrière d’épaule est déjà satisfaisante |
| Copenhagen + machine adducteurs + futsal | Cumul local à surveiller ; sport compté dans la fatigue, pas converti en séries |
| Presse + extension ; presse + Glute Drive | Compléments utiles, fonctions et contraintes différentes ; aucune pré-fatigue imposée |
| Leg curl + autres mouvements jambes | Le leg curl reste le travail ciblé de flexion du genou ; presse/Glute Drive ne deviennent pas des séries équivalentes d’ischios |
| Planche/dead bug + Pallof + Copenhagen | Base complémentaire anti-extension/anti-rotation/latérale ; pas de gainage supplémentaire requis vendredi |

A+B ont été validés avant C. C apporte la deuxième exposition pectoraux/dos, deux séries de latéraux, deux de supination et le ciblage triceps. L’avant d’épaule est déjà fortement sollicité ; l’arrière d’épaule existe via face pull/rowings ; les trapèzes supérieurs peuvent justifier le complément sans être considérés comme totalement inactifs dans la base. La base est stable, pas une séance à reconstruire chaque semaine.

### N.6 Durées à deux et consignes de progression

| Séance | Budget pratique estimé, préparation et fin incluses |
|---|---:|
| A musculation et Copenhagen | 55–70 min |
| B | 55–75 min |
| C BASE 13 | 55–75 min |
| C AVEC COMPLÉMENT 15 | 60–80 min |
| Jambes cible 18 après reprise | 70–90 min |
| Jambes RETURN 12 maximum | 55–75 min |
| Lundi complet avec corde et vélo | **80–95 min avec deux vélos en parallèle**, objectif 90 min à confirmer |

Ce sont les estimations de planification de l’audit, pas des mesures historiques. Elles supposent une alternance en duo avec les vrais repos personnels, des changements de matériel préparés et des attentes limitées. La variante unilatérale prend plus de temps ; l’alternance du partenaire peut faire partie du repos sans le remplacer automatiquement. Les attentes, approches, changements de poids et éventuels étirements comptent dans le chrono complet.

Conserver les repos prioritaires plutôt que les raccourcir artificiellement pour respecter 90 min. Prévoir une marge de fin pour sortir samedi à 15 h ; utiliser une adaptation explicite du restant si nécessaire. La disponibilité de deux vélos ne nécessite aucune synchronisation logicielle obligatoire des deux profils.

Progression : mêmes technique, amplitude, variante et repos pour comparer ; reps puis palier réellement disponible ; une variable importante modifiée à la fois ; comparaison de plusieurs séances comparables avant de conclure. Si BASE 13 permet la progression et tient le budget, aucune incitation automatique à AVEC COMPLÉMENT 15. Les courbatures, la brûlure ou le nombre de jours écoulés ne valident pas à eux seuls une hausse. Aucune dose dite maximale récupérable n’est calculée depuis ces tableaux.

### N.7 Portée scientifique des décisions intégrées

L’audit est une recherche documentaire ciblée, pas un essai de votre programme ni une revue systématique exhaustive. L’ordre retenu privilégie la performance des priorités ; aucun ordre universel supérieur en hypertrophie n’est affirmé. [Nunes et coll., 2021](https://onlinelibrary.wiley.com/doi/abs/10.1080/17461391.2020.1733672).

Le volume et la fréquence servent à répartir un travail réalisable. Les rendements moyens décroissants et la distinction direct/indirect ne donnent ni seuil individuel obligatoire ni coefficient exact pour chaque muscle. [Pelland et coll., 2026](https://link.springer.com/article/10.1007/s40279-025-02344-w).

Le test d’extension triceps s’appuie notamment sur un essai d’extensions à la poulie ; il ne prouve pas que deux séries avec haltère sont supérieures à votre développé serré. D’où une substitution conditionnelle, personnelle et mesurable. [Maeo et coll., 2023](https://onlinelibrary.wiley.com/doi/full/10.1080/17461391.2022.2100279).

La compatibilité moyenne entre endurance et musculation ne certifie pas la récupération après un match précis. Les 41 h 30 sont un intervalle d’horloge, pas un feu vert physiologique. [Schumann et coll., 2022](https://link.springer.com/article/10.1007/s40279-021-01587-7).

Le verdict de conception est : programme cohérent et globalement complet pour une priorité haut avec futsal, récupérable et soutenable **sous réserve du terrain**. Les doses jambes sont modestes ; le complément cible un besoin précis. L’application aide à observer progression, tolérance et durée ; elle n’annonce ni résultat musculaire garanti ni protection chiffrée contre une blessure.

## O — Réutilisation Alana / Timéo

### Ce qui a été observé et comment le réutiliser

| Référence inspectée | Élément utile | Adaptation Coach Muscu | À ne pas recopier tel quel |
|---|---|---|---|
| Alana `enhancements.js`, formulaires et historique | Poids, mensurations, aides de mesure, export avec mesures | Champs de K, propriétaire explicite, dates, historique et révisions | Priorité fessiers obligatoire, clés de stockage Alana, remplacement automatique de toutes les valeurs du même jour |
| Alana, timer de gainage à deux côtés | États prêt/en cours/pause/entre côtés/terminé, consignes lisibles | Observation distincte par côté, `duration_sec`, confirmation, persistance | État uniquement local au composant, déduction d’une durée depuis le texte affiché comme source de vérité |
| Alana, repos de transition | Compte à rebours basé sur une échéance | Repos personnel configurable et horodatages de série | Constante générale de 180 s appliquée à chaque transition ; sélecteurs DOM supposés identiques entre apps |
| Alana, préparation et retour au calme | Explications courtes et ordre simple | Prescriptions intégrées en L/M/N et blocs du lundi | Programme, nutrition ou objectifs d’Alana transposés à deux hommes |
| Timéo `app.js`, niveaux d’exercices et analyse | Variantes, assistance/levier, changement après confirmations | Configurations individuelles, baselines et règles I/J | Augmentation de durée sans plafond propre au mouvement ; mutation directe de la progression avant validation |
| Timéo, mode réel/essai et brouillon | Différence essai/séance et reprise d’une séance réelle | `mode` séparé de `lifecycle`, essais conservables et annulation traçable | Essai simplement volatile s’il doit rester consultable ; nouvelle séance qui écrase le brouillon |
| Timéo, timers `endAt` | Échéance plutôt que décrément par tick | Persister les états de repos/tenue/bloc, restaurer après fermeture | `restState`/`holdState` seulement en mémoire et disparition à la fermeture du panneau |
| Timéo, validation rapide | Reps/durée, RIR, technique, douleur | Saisie rapide avec NOT_ENTERED/UNKNOWN | RIR de repli à 2, technique propre ou absence de douleur déduits du non-choix |

Il s’agit d’une **inspection statique ciblée**, pas d’une validation de ces applications sur téléphone. L’archive Alana distribue un bundle et des améliorations qui s’attachent à son DOM ; elle n’est pas une bibliothèque de composants indépendants importable sans adaptation. Réutiliser la logique ou le petit composant extrait après vérification, pas des hooks vers des classes d’écran étrangères.

Traçabilité des archives examinées : Alana `1adee2a10b0a94f059525f0aa6e06dcdaffcf4a5bde4e2938cad95f3fe89a84d` ; Timéo `f4895e587b73dd832c80050d5c2ca423222fed37b28e0dd36590a7e75d89a968` (SHA-256). Work doit vérifier si ses modules sources sont plus récents et identifier ce qu’il reprend réellement. Aucun test de Coach Muscu ne peut être déclaré réussi parce qu’un écran similaire existe chez Alana ou Timéo.

## P — Écran séance cible

### P.1 Musculation

Écran principal : profil visible ; nom de séance et version ; temps total discret ; exercice et variante ; série x/y et côté ; charge proposée clairement libellée ; plage de reps/RIR cible ; dernière performance du même profil/contexte avec sa date.

Au démarrage d’un Haut A/B/C, présenter une préparation courte adaptée au premier exercice : cible 6–10 min approches comprises, référence terrain 6–8 min pour B. La consigne est « se préparer progressivement sans se fatiguer ». Pas de routine de 15–25 min par défaut ni de compte à rebours obligeant à attendre dix minutes avant de commencer. Les approches restent identifiées lorsqu’elles apparaissent plus tard ; corde et vélo ont leurs propres blocs et durées.

Flux normal :

1. **« Démarrer la série »** capture START_SET et désactive le double démarrage.
2. **« Terminer la série »** capture END_SET immédiatement, démarre le repos et ouvre une saisie légère.
3. Saisir reps ou durée réellement faite ; RIR avec choix « inconnu » ; douleur facultative, technique facultative ; charge visible à confirmer ou corriger.
4. **« Enregistrer »** finalise le résultat. Aucun résultat ancien n’est recopié silencieusement. Les valeurs cibles restent des indications visuelles, pas des réponses déjà saisies.

Si START_SET a été oublié, permettre « enregistrer cette série sans début mesuré » : performance conservée, repos et temps actif inconnus. Ne pas imposer une heure inventée pour avancer. Si le résultat lui-même n’est plus connu, conserver l’événement avec résultat UNKNOWN et l’exclure des métriques qui nécessitent ce résultat.

Le repos affiche cible et temps écoulé, avec +30 s et reprise libre. Les corrections d’une série restent accessibles sans effacer toute la séance. Un long appui ou menu secondaire peut porter les actions rares, mais les commandes de base doivent rester visibles et utilisables à une main.

### P.2 Corde / vélo

Écran simplifié : nom du bloc, phase, passage/intervalle, grand chrono, intensité cible facultative, temps du bloc et temps total. Boutons pause/reprise, passer/raccourcir, gêne et terminer. Pas de formulaire charge/reps/RIR musculaire sur le vélo.

Une confirmation de fin de bloc peut valider les étapes guidées en un geste ou ouvrir le réalisé partiel. Le récapitulatif différencie toujours guidage écoulé et exercice confirmé. Les alertes et le maintien d’écran sont des options, pas des conditions de validation.

### P.3 Fin, annulation et essais

La fin montre les blocs : par exemple Haut A terminé, corde 3/4, vélo sauté, cooldown non fait, durée totale. Les blocs non visités ne deviennent pas COMPLETED. L’utilisateur peut les marquer sautés et terminer, ou garder une séance interrompue à reprendre.

`TEST` est visible pendant l’essai et dans l’historique. Les essais peuvent alimenter un repère de calibration après choix explicite, mais restent exclus par défaut des records et de l’assiduité. Annuler conserve le brouillon/résultat avec l’état CANCELLED ; ne pas effacer physiquement les données derrière un bouton d’annulation.

Pas de note globale de réussite scientifique, pas de badge rouge parce que le vélo prévu a été sauté, pas de pénalité de progression parce que la personne a utilisé COMPACT. La musculation partiellement réalisée se décrit comme telle, sans inventer les séries restantes.

## Q — Tests obligatoires pour Work

Prévoir tests unitaires sur les règles/horloges avec temps contrôlé, tests d’intégration sur la vraie sauvegarde et vérifications manuelles sur le navigateur/téléphone utilisé. Les 60 cas de cette table sont **des critères à exécuter lors du développement**, pas des résultats déjà acquis.

| ID | Cas | Résultat attendu / preuve |
|---|---|---|
| MIG-01 | Import du vrai fichier ancien portant `v:2` | Reconnu comme LEGACY, pas comme nouveau `schemaVersion:2` |
| MIG-02 | Inventaire après conversion | 199 résumés, 54 détails, 179 agrégats sans détail, 27 groupes profil/session, 33 états et huit plans historiques conservés |
| MIG-03 | Agrégat 9 reps ×3 sans détail | Zéro série 9/9/9 créée ; ancien résumé consultable |
| MIG-04 | Presse détaillée 42,5/53/66/73 kg | Quatre charges réelles préservées ; pas quatre séries à 73 kg |
| MIG-05 | Gainage/Copenhagen/Pallof/rowing ambigus | Brut récupérable, drapeau d’incertitude, aucune conversion silencieuse |
| MIG-06 | Shrugs partenaire 12 | 12 dans le brut, annotation vers 2 voulues ; pas de séries exécutées inventées |
| MIG-07 | Réimport du même fichier | Aucun doublon ; mêmes IDs métier |
| MIG-08 | Panne/erreur/quota pendant migration | Ancien jeu encore lisible ou candidat valide actif ; jamais base vidée à moitié |
| MIG-09 | Deux profils avec même ancien sessionId | Deux propriétaires conservés, aucun mélange |
| MIG-10 | Export V2 puis réimport sur base vide | Identité sémantique de toutes les données métier, inconnus, archives et relations ; empreinte du brut source inchangée |
| MIG-11 | Conflit même ID/données différentes ; champ futur inconnu | Pas d’écrasement silencieux ; conflit visible, donnée préservée |
| SET-01 | Deux clics START/END/SAVE et restauration | Une seule série et une seule transition |
| SET-02 | END_SET à 40 s, validation à 55 s | Fin conservée à 40 s ; repos commence à 40, pas à 55 |
| SET-03 | Série réelle 10/10/9 ; RIR 0, inconnu et absent | Résultats et états distincts, aucun RIR de repli |
| SET-04 | Approches et travail mélangés | Approches exclues des records/volume ; résultats conservés |
| SET-05 | Unilatéral deux groupes, un côté manquant | Côtés réels conservés, pas de double volume ni de paire complétée fictivement |
| SET-06 | Changement de profil pendant repos/saisie | Événements attachés au profil d’origine ; aucune fuite vers le profil affiché ensuite |
| TIME-01 | Session démarrée avant échauffement, puis corde/force/vélo/cooldown | Différence exacte START_SESSION→END_SESSION, à la résolution choisie |
| TIME-02 | Verrouillage cinq minutes puis retour | Temps reconstruit, pas de remise à zéro ni de dépendance au nombre de ticks |
| TIME-03 | Fermeture/rechargement après START_SET ou END_SET persisté | Même série/état retrouvé ; événement absent reste inconnu |
| TIME-04 | Pause vélo de 120 s | Temps vélo actif suspendu ; chrono total augmente de 120 s |
| TIME-05 | Cible repos 180 s, démarrage réel à 210 s | Repos réel 210 s ; bip à 180 ne crée pas START_SET |
| TIME-06 | Deux fins de séries sans début suivant | actual_rest inconnu ; aucune différence fin-fin étiquetée repos |
| TIME-07 | Même côté Copenhagen ; autre exercice intercalé | Côté apparié correctement ; contexte intercalé exclu de l’analyse simple |
| TIME-08 | Horloge inversée/anomalie détectée | Qualité CLOCK_ANOMALY, données conservées ; aucune durée négative cachée en zéro |
| TIME-09 | Signaux refusés ou wake lock indisponible | Flux utilisable ; limites de signalement visibles sans blocage |
| TIME-10 | Compteurs écran verrouillé sur appareil réel | Résultat de reprise et résultat des alertes consignés séparément, environnement indiqué |
| WARM-01 | Ouvrir Haut A, Haut B et Haut C | Cible 6–10 min approches comprises ; B mentionne le retour déclaré 6–8 min ; pas de routine de 15–25 min automatique ni d’attente forcée |
| WARM-02 | Préparation initiale puis approches distribuées ; ajouter corde et vélo | Préparation comptée une seule fois quand mesurable ; pauses/réglages non omis ; corde 270 s et vélo 1 320 s restent dans leurs blocs, y compris la mise en route du vélo |
| WARM-03 | Importer la précision terrain et enregistrer un échauffement de durée différente | Zéro séance/série/horodatage fabriqué depuis le retour déclaré ; temps réel conservé, cible non transformée en observation ; absence de mesure reste inconnue |
| CARD-01 | Corde complète | 7 étapes, 180 s actives, 90 s de récupération, total 270 s ; zéro série musculaire |
| CARD-02 | Corde 3/4, dernière passée | 3 passages confirmés, dernier sauté ; musculation accessible |
| CARD-03 | Vélo 22 min corrigé | 9 étapes, 4 efforts, 480 s soutenues + 840 s faciles = 1 320 s ; aucune dixième étape cachée |
| CARD-04 | Ancienne recette littérale 5+4×(2+2)+3 | Calcul 1 440 s ; impossible de l’étiqueter 22 min |
| CARD-05 | Arrêt confirmé à 14 min | 840 s/1 320 s, SHORTENED ; phases confirmées seulement, pas 22 minutes créditées |
| CARD-06 | Vélo sauté après Haut A complet | strength_outcome COMPLETED, vélo SKIPPED ; assiduité musculation et records inchangés |
| CARD-07 | Rechargement après plusieurs frontières d’intervalles | Position théorique juste, pas de doublons ni rafale de bips ; réalisé incertain à confirmer |
| CARD-08 | Timer arrivé à 22 min, réalisation non confirmée | Guidage fini, minutes faites non inventées |
| PROG-01 | 20 kg, 10/10/9 en 8–12 | KEEP_LOAD/ADD_REP expliqué, pas hausse automatique |
| PROG-02 | 20→23 et 4→7 | Paliers réels, +15 %/+75 % calculés, saut non forcé |
| PROG-03 | Données vides, absentes ou exercice en calibration | Aucune hausse ni baseline validée sans éléments suffisants |
| PROG-04 | 10→9→8 ; 10→10→11 ; 70→90 s | Respectivement variation/drop : −20/20 ; +10/0 ; +28,6/0 |
| PROG-05 | Changement de machine/bande/TRX/variante | Nouveau contexte ou RECALIBRATE ; aucun record en kg fictif |
| PROG-06 | Déclaration partenaire 3×5 | Référence candidate, zéro nouvelle série historique ; traction classique en B et C |
| PROG-07 | Partenaire première traction réelle trop difficile | Pas de lest automatique ; adaptation propre au profil, historique bandes conservé |
| PROG-08 | Passage NORMAL→COMPACT après des séries déjà faites | Résultats conservés ; restant adapté, pas de faux échec ni de séries supprimées du passé |
| PROG-09 | Révision scientifique C et trois versions | BASE 13 par défaut et au premier essai ; AVEC COMPLÉMENT 15 = base +2 ; COURTE 11 retire supination et conserve l’emplacement triceps de deux séries, serré initial |
| PLAN-01 | Ouvrir A/B/C/Jambes et leurs prescriptions personnelles | Ordres M/N respectés dans le modèle, l’écran et le prompt ; C serré après TRX, avant latéraux/curl ; aucun curl avant tirages ni Pallof avant presse |
| PLAN-02 | Calculer les quatre semaines de référence | Base 57/56 ; complément 59/58 ; C courte 55/54 ; C base + RETURN12 maximum 51/50. Haut hors tronc/Copenhagen 35/37/33/35 ; choix des profils indépendants ; aucune omission créditée |
| PLAN-03 | Choisir un complément puis changer de version | Deux séries d’un seul choix SHRUG ou REAR_DELT en AVEC COMPLÉMENT ; NONE initial ; préférence conservable mais inactive en BASE/COURTE ; jamais les deux ni ajout automatique |
| PLAN-04 | Tester puis adopter l’extension triceps pour un seul profil | Remplace les deux séries serré, ne s’ajoute pas ; même emplacement conservé en COURTE ; nouveau contexte/calibration ; classement exercice TEST distinct du mode global TEST |
| PLAN-05 | Charger une ancienne séance puis démarrer la nouvelle révision | Ancien contenu et ancien instantané intacts, même si enum NORMAL réutilisé ; nouvelle séance selon BASE 13 ; anciens volumes jamais réécrits pour correspondre au nouveau programme |
| PLAN-06 | Fatigue après futsal, RETURN et manque de temps | Une seule séance jambes samedi, aucun Bas A généré ; pas de passage automatique à18, pas de hausse de presse RETURN sous prétexte de SHORT ; adaptation personnelle et temps réel conservés, pas de compensation dimanche |
| BODY-01 | Relevé avec seulement poids ou un tour | Enregistrement valide, autres champs absents |
| BODY-02 | 66,5 ; champ vide ; zéro ; date civile ; D/G | Décimale acceptée, vide non changé en zéro, zéro refusé, date/côtés conservés |
| BODY-03 | Deux profils, deux relevés même jour, modification | Pas de remplacement de l’autre profil ni de suppression des champs non édités |
| MODE-01 | TEST terminé puis annulé | Consultable ; exclu records/assiduité ; calibration seulement explicitement utilisée |
| MODE-02 | Donnée de readiness non entrée, inconnue, zéro explicite | Trois états distincts ; pas de score global fabriqué |
| UX-01 | Séance complète puis courte sur téléphone | Série enregistrable rapidement, boutons lisibles, correction et reprise possibles |
| REG-01 | Parcours utiles existants après évolution | Historique, export, profils, programme et écrans conservés fonctionnent ; régressions documentées et corrigées |

L’aller-retour compare les objets canoniques, pas seulement le nombre de lignes ou une capture d’écran. La preuve attendue inclut les valeurs, unités, propriétaires, références et états inconnus. Les tests d’horloge doivent examiner les bornes, pas uniquement attendre qu’un affichage atteigne zéro.

## R — Critères d’acceptation

La V2 est prête pour un essai réel lorsque :

1. Le projet existant démarre avec sa procédure habituelle ; aucune nouvelle infrastructure n’est imposée sans motif documenté.
2. L’import réel passe les contrôles de E/Q et laisse une sauvegarde de retour exploitable. Aucun profil/historique n’est perdu ou mélangé.
3. Les quatre séances et leurs versions définies sont présentes, une seule séance jambes samedi et aucun Bas A, C BASE 13 par défaut, complément unique éventuel et COURTE 11 conservant les deux séries triceps, serré initial. Les ordres, plages, variantes personnelles et totaux concordent avec M/N ; partenaire aux tractions classiques, approches séparées. Les hauts ont une cible d’échauffement de 6–10 min approches comprises ; Haut B mentionne le format testé 6–8 min. Aucun échauffement haut de 15–25 min imposé par défaut.
4. Le lundi contient les cinq blocs, avec corde exacte à 4 min 30 et recette vélo corrigée à 22 min ; les étapes détaillées concordent avec les totaux affichés. Deux vélos disponibles permettent un bloc en parallèle ; pas de durée commune artificiellement doublée, résultats personnels conservés.
5. START/END_SET, résultats et inconnus sont enregistrés sans doublons ; les charges sont correctement libellées et confirmées.
6. Le chrono total traverse tous les blocs et toutes les attentes ; repos réel inconnu si une borne manque. Reprise après fermeture testée sur l’environnement cible.
7. Un bloc cardio sauté/raccourci reste distinct du résultat de la musculation. Une recette écoulée ne crée pas une performance confirmée automatiquement.
8. La progression respecte paliers, variantes, calibration et raisons lisibles ; pas de hausse forcée hebdomadaire, ni de RIR ou douleur fictifs.
9. Les mensurations/poids sont utilisables séparément pour chaque profil et inclus dans l’export/réimport.
10. Les tests essentiels automatisables passent ; les essais manuels réellement faits sont listés avec appareil/navigateur et limites. Un test non exécuté reste indiqué non exécuté.

**Critères qui ne sont pas exigés pour V2 :** synchronisation temps réel entre téléphones, reconnaissance automatique d’exercices, estimation de masse grasse, optimisation automatique des postes, notifications natives garanties navigateur fermé, preuve d’une prise de muscle supérieure.

## S — Plan d’implémentation Work

| Étape | Travail borné | Livrable / condition de passage |
|---|---|---|
| 0 — Inventaire du projet | Lire les instructions du dépôt, identifier framework, point d’entrée, stockage, export/import, exercices, journal, timers, tests et cache/service worker éventuel | Tableau des vrais fichiers et stratégie de modification minimale ; signaler une contradiction majeure avant de remplacer une brique |
| 1 — Protection et modèle | Sauvegarde actuelle, fixture réelle protégée, adaptateur de données, identités/états/valeurs inconnues et prescriptions versionnées | Contrats D et fixtures de migration définis ; app actuelle encore lisible |
| 2 — Migration/export | Lecteur du format ancien, candidat V2, rapport, bascule contrôlée, export/réimport et rollback | MIG-01 à MIG-11 adaptés au périmètre exécutés avant d’activer l’écriture V2 |
| 3 — Séance et séries | Réutiliser l’écran, ajouter START/END_SET, validation rapide, rôle des séries, mode/test et reprise | SET, MODE et tests de base de session réussis ; une séance de force réelle est exploitable |
| 4 — Timers et blocs | Service de temps, repos personnel, temps réel, corde, recette vélo, pauses et confirmations | TIME et CARD ; aucun calcul fondé sur le nombre de ticks |
| 5 — Progression et mesures | Règles explicables, configurations matérielles, repère partenaire, poids/mensurations | PROG et BODY ; pas de modification silencieuse des plans passés |
| 6 — Programme et variantes | Charger N/M, ordre du lundi, retours/versions courtes, cohérence des volumes et libellés | Nombre de séries et contenus conformes ; aucun programme Timéo ou Alana copié |
| 7 — Régression et essai | Tests ciblés, import de la vraie sauvegarde dans un environnement de test, téléphone/verrouillage, export final | Rapport des résultats, cas non testés, limites et fichiers modifiés ; parcours manuel court pour l’utilisateur |

Les étapes peuvent être organisées selon les dépendances du code réel, mais la sécurité de migration précède l’activation en écriture. Ne pas réécrire les fonctions utiles uniquement pour obtenir des noms de fichiers semblables à cette spécification. Réutiliser le cadre de tests présent ; si absent, ajouter seulement les tests nécessaires aux données, timers et règles à risque.

Le compte rendu final de Work doit expliquer ce qui a été gardé/modifié, quelles données ont été vérifiées, quels tests ont réellement tourné et ce qui reste limité sur le téléphone. Il doit fournir une version testable ou un patch adapté au projet, sans présenter le déploiement comme déjà effectué s’il ne l’est pas.

## T — Risques et décisions de maîtrise

| Risque concret | Décision de conception | Limite résiduelle à signaler |
|---|---|---|
| Confusion vieux `v:2` / nouveau format | Discriminant `format` + `schemaVersion`, reconnaissance structurelle | Autres vieux formats à identifier sur les fichiers réels, pas à inventer |
| Perte de données lors de migration | Archive brute, candidat séparé, validation puis bascule, rollback | Stockage navigateur effacé par l’utilisateur ou panne système : export externe nécessaire |
| Anciennes données plus précises en apparence qu’en réalité | Résumés séparés, provenance, inconnus, pas de bornes inventées | Les 179 agrégats ne permettront jamais de reconstruire leurs vraies séries sans nouvelles preuves |
| Fausse réussite de cardio après écran éteint | Séparer timer écoulé et réalisé confirmé | Pas de capteur : durée de mouvement déclarée, pas vérifiée physiquement |
| Alertes absentes écran verrouillé | Recalcul au retour, options son/vibration/wake lock et tests réels | Une app web ne garantit pas le comportement d’une alarme native fermée |
| Mélange des profils / deux onglets | Clés propriétaires, une écriture active, tests de changement de profil | Séparation de données dans l’app, pas système de comptes confidentiels distincts |
| Lundi dépassant 90 min | Inclure corde/vélo/attente dans le chrono ; comparaison des séances réellement mesurées | Ne pas tronquer le programme automatiquement pour rendre une estimation vraie |
| 22 min affichées pour 24 min d’étapes | Somme dérivée de la recette et test CARD-03/04 | Toute nouvelle recette doit avoir sa propre révision et son vrai total |
| RIR/douleur/readiness issus de valeurs par défaut | État NOT_ENTERED/UNKNOWN/VALUE et provenance | La qualité des recommandations dépend encore de réponses humaines |
| Ancien Haut C réactivé par l’enum NORMAL | Nouvelle révision avec mapping explicite BASE/AVEC COMPLÉMENT/COURTE ; instantanés historiques intacts ; cas PROG-09 et PLAN | Une étiquette seule ne suffit jamais à identifier l’ancien contenu |
| Complément ou substitution transformés en volume automatique | Choix explicite, un seul complément actif et un seul emplacement triceps de deux séries ; BASE au départ | Aucun diagnostic automatique de muscle en retard ni adoption forcée |
| Fatigue futsal interprétée comme récupération complète samedi | Intervalle 41 h 30 affichable comme contexte, dose personnelle et reprise sans échéance | Aucune mesure de récupération physiologique ni promesse de prévention des blessures |
| Programme modifié indirectement par une réutilisation | Catalogue et prescriptions Coach Muscu prioritaires, relecture de M/N | Modules de référence partiellement inspectés ; tests d’intégration indispensables |
| Trop de clics en salle | Deux boutons d’événements, saisie courte, inconnus possibles, confirmations groupées du cardio | Sans START_SET, certaines mesures restent inconnues ; le dire plutôt que tricher |
| Croissance du périmètre | Pas de backend, GPS, IA, gros moteur duo ou réécriture générale | Fonctions avancées reportées jusqu’à une utilité démontrée |

Les arbitrages non négociables sont la conservation du troisième contact haut, des profils et de l’historique, l’absence de données inventées, et un chrono qui décrit la séance réellement déroulée. L’effort d’implémentation porte sur ces contrats avant toute sophistication visuelle.

## U — Prompt final autonome prêt pour Work

Le texte ci-dessous peut être transmis tel quel. Cette V1.2 complète est le document de référence ; la sauvegarde réelle reste nécessaire aux contrôles de migration. Le prompt reprend les décisions essentielles. Les sections dédiées, notamment M/N, restent canoniques sans recours obligatoire aux anciens audits.

---

Tu es Work, chargé d’implémenter une évolution légère de l’application **Coach Muscu existante**. Tu dois préserver son identité, ses fonctions utiles, ses deux profils et tout l’historique. Ne recrée pas une nouvelle application et ne change pas de framework ou de stockage sans problème concret qui le justifie.

Commence par lire les instructions du dépôt et inspecter les vrais fichiers : point d’entrée, stockage, import/export, catalogue, programmes, journal, timers, tests et éventuel service worker. Réutilise ce qui fonctionne. Si le projet source annoncé n’est pas accessible, identifie précisément ce qui manque ; ne le remplace pas par une reconstruction supposée.

**Source de vérité :** les dernières instructions utilisateur, puis cette spécification complète V1.2 et ses sections dédiées. Le nouvel audit scientifique a déjà été intégré et a primé sur toute prescription incompatible de V1.1. Applique les tableaux M/N ; ce prompt les synthétise. Ne reconstruis pas le programme à partir des anciens rapports. La vraie sauvegarde et le code fournissent les faits de migration/intégration ; Alana et Timéo fournissent seulement des composants de référence. Aucune nouvelle prescription ne réécrit les faits historiques.

**1. Périmètre attendu**

Garder l’application simple pendant une vraie séance. Ajouter/adapter : vraies séries, RIR, inconnus, chrono de séance complet, chrono repos configurable et repos réel lorsque mesurable, gainages en secondes, corde/vélo intégrés, variantes selon matériel, progression expliquée, poids/mensurations, modes essai/annulation/reprise et migration/export fiables. Pas de serveur, compte, GPS, IA prédictive, gros moteur duo ou synchronisation temps réel à construire.

**2. Programme à respecter**

Lundi Haut A poussée + corde + vélo ; mardi Haut B tirage ; jeudi futsal 19–20 h ; vendredi Haut C ; samedi jambes 13 h 30–15 h ; dimanche normalement libre, déplacement exceptionnel seulement choisi par l’utilisateur. **Conserver trois séances haut et une seule séance jambes ; aucun Bas A.**

Deux vélos sont disponibles : 22 min chacun en parallèle, pas 44 min ajoutées au créneau commun. Estimation du lundi complet environ 80–95 min à deux, avec préparation/approches et fin incluses ; objectif 90 min à confirmer au terrain. Ne pas masquer le conditionnement dans l’échauffement.

Mathieu : environ 65 kg, 33 ans, 1,75 m ; priorité hypertrophie du haut, force, jambes et condition. Partenaire : environ 93 kg, antécédents d’aine/pubalgie et de dos, sans douleur actuelle présumée. Données et décisions totalement séparées.

Prescriptions cibles, séries de travail seulement, charges d’haltères par main :

- **Haut A :** incliné 3×8–12 ; épaules 2×8–12 ; pompes adaptées 3×8–15 ; latéraux 3×12–25 ; Copenhagen Mathieu dynamique 2×6–10/côté, partenaire isométrique levier court 1×15–25 s/côté. Totaux 13/12 groupes. Repères Mathieu : incliné 20 kg, épaules 14, latéraux 4 ; partenaire : 23, 16, 7 kg. Ce sont des charges à confirmer, pas des performances enregistrées. Pompes partenaire mains surélevées, hauteur notée.
- **Haut B :** vertical 3 séries ; rowing appui 3×8–12/côté si unilatéral ; face pull 2×15–20 ; marteau 3×10–15 ; tronc 2 séries. Mathieu : tractions 3×6–10, rowing repère 18 kg, planche 2×20–40 s. Partenaire : **tractions classiques**, cible initiale 3×5, plage de calibration 4–6 ; rowing repère 16 kg ; dead bug 2×6–10/côté. Total 13 chacun. Confirmer la variante réelle du rowing avant de changer son libellé historique.
- **Haut C Base 13, COMPACT interne, défaut et premier essai :** dans cet ordre, couché 3×8–12 → vertical 2 séries → TRX 2×10–15 → serré 2×10–15 → latéraux 2×12–25 → supination 2×10–15. Vertical Mathieu 2×6–10 ; partenaire 2×4–6, cible 5. Repères couché 20/23 kg, à confirmer. Ce même BASE 13 sert au premier essai et aux séances de référence.
- **Haut C Avec complément 15, NORMAL interne :** Base 13 puis un seul complément de deux séries. Choix personnel persistant : shrugs 2×10–15, 2–3 RIR, repos90–120 s si ciblage trapèzes souhaité ; OU oiseau poitrine appuyée 2×12–20, 2–3 RIR, repos60–90 s si besoin arrière d’épaule identifié. Aucun complément par défaut au premier essai, aucun cumul, aucune rotation aléatoire. Base 13 reste une séance complète.
- **Haut C Courte 11, SHORT interne :** base sans curl supination ; **serré conservé**. Pour les triceps, garder le serré ; proposer seulement un TEST de substitution par extension avec haltère au-dessus de la tête, assis stable, 2×10–15, 2–3 RIR, repos90–120 s. Adoption explicite par profil si confortable et mesurable ; jamais serré + extension, variante et historique indépendants.
- **Jambes NORMAL :** presse 4×8–12 ; leg curl 4×10–15 ; Glute Drive 2×8–12 Mathieu / 2×10–15 partenaire ; extension 2×10–15 ; adducteurs 1×12–20 ; mollets 3×10–20 ; Pallof 2×8–12/côté =18 groupes.
- **Jambes RETURN :** séries 2/2/2/1/1 si toléré/2/2 sur ces mêmes exercices =12 maximum, environ 3–4 RIR. **SHORT après reprise :** presse 3, curl 3, Glute Drive 2, mollets 2 =10. Ne pas augmenter de 2 à 3 séries de presse en pleine reprise sous prétexte de version courte.

RIR du haut : généralement 1–2 pour Mathieu, 2–3 pour le partenaire en calibration ; épaules, pompes, vertical/TRX du vendredi et serré Mathieu plutôt 2 ; face pull 2–3 pour chacun ; latéraux partenaire 2. Jambes après reprise : presse/Glute Drive 2–3 ; curl/extension/mollets Mathieu 2, partenaire 2–3 ; adducteurs 3 Mathieu, 3–4 partenaire. Tronc/Copenhagen : réserve technique. La douleur et le contrôle priment.

Ces valeurs sont des cibles à afficher, jamais des observations préremplies. Totaux après reprise : Base C13 + jambes18 =57/56 groupes, dont35 ciblant le haut chacun ; C avec complément15 =59/58, haut37 ; C court11 =55/54, haut33. Premier C base13 + jambes RETURN12 =51/50 maximum. Corde, cardio, approches et futsal ne sont pas des séries musculaires. Pour l’unilatéral, compter les groupes/côtés honnêtement, sans doubler le volume ni compléter un côté manquant.

**Arbitrages scientifiques à conserver :** A et B gardent leurs priorités et le format B apprécié. Pas de curls avant tirages, d’isolations triceps avant le premier développé ou de core exigeant avant les mouvements principaux. C comble les besoins A+B avec une base stable ; aucun développé épaules, gainage exigeant, travail jambes ou charnière lourde ajouté vendredi. Presse/leg curl restent les priorités samedi, Pallof en dernier.

**Récupération et adaptation :** jeudi fin20 h → samedi13 h30 =41 h30 ; vendredi soir → samedi peut être inférieur à24 h. Pas de dose jambes18 ou de complément C imposés par calendrier. Adapter personnellement selon préparation, premières séries, contrôle et tolérance, sans score fabriqué ni dette de volume. Copenhagen et machine adducteurs ne progressent pas simultanément. Rowing avec appui si le maintien au TRX devient limitant, en substitution explicite avec contexte distinct. Si la corde avant A dégrade les développés, déplacement après musculation possible et enregistré.

**Choix de C :** la préférence SHRUG/REAR_DELT peut rester enregistrée sans activation en BASE/COURTE. AVEC COMPLÉMENT exige exactement un choix actif et deux séries ; NONE ne déclenche aucun choix automatique. Le classement scientifique TEST d’une variante ne transforme pas toute la séance en mode TEST. Une substitution en séance REAL reste une adaptation réelle ; le mode TEST volontaire conserve ses exclusions. Préserver les anciens instantanés malgré la réutilisation des noms internes NORMAL/COMPACT/SHORT.

**Couverture et durée :** M.5/N.5 donnent les références à contrôler ; contributions secondaires distinctes, pas de conversion du futsal en séries, pas de nouveau moteur anatomique. N.6 contient les budgets estimés à deux, avec échauffement et fin ; ils ne sont pas des durées mesurées ni une raison d’écourter les repos prioritaires.

**3. Partenaire : nouvelle référence tractions**

Il réalise désormais **3×5 tractions classiques**. Créer une référence déclarée BASELINE_CANDIDATE à confirmer, pas trois nouvelles séries historiques datées. Garder tout l’historique du tirage élastique et sa variante comme assistance/régression. Pas de transfert de baseline bande→traction et pas de lest automatique. Ses repos passent à ceux d’une traction classique, environ 150–180 s en B. Une réalisation à l’échec ne valide pas un RIR cible de 2–3 : calibrer réellement.

**3 bis. Échauffement : validation terrain prioritaire du 16/09**

Le format court du nouveau Haut B a bien convenu aux deux pratiquants : durée déclarée approximative de **6–8 min**, préparation spécifique, progressive, sans fatigue notable. Format : mobilité épaules/omoplates, scapular pull-ups ou suspensions actives, tirage élastique léger, quelques tractions faciles, une ou deux séries d’approche du rowing au moment nécessaire. C’est un retour utilisateur ; ne pas fabriquer une durée exacte, des séries ou des horodatages historiques.

Appliquer cette philosophie à **Haut A/B/C : environ 6–10 min, séries de montée en charge comprises**. A prépare surtout le développé incliné, puis les épaules si nécessaire ; C prépare le couché puis le premier tirage au moment utile. A/C sont des adaptations proposées, pas des protocoles déjà testés. Les approches peuvent être distribuées avant leur exercice, sans ajouter une seconde enveloppe de 6–10 min. Ne pas imposer une routine générale de 15–25 min, des approches à chaque accessoire, une préfatigue ou un arrêt forcé à dix minutes. Avec le repère 3×5 du partenaire, ne pas prescrire cinq tractions supplémentaires comme échauffement automatique ; garder la préparation facile, assistance possible.

Afficher la cible et les consignes séparément du réalisé. Les petits repos/réglages de préparation font partie de cette enveloppe ; le cumul des seules durées de séries n’est pas un temps complet d’échauffement. Compter chaque intervalle une fois et laisser la ventilation inconnue sans mesure suffisante. **Corde et vélo sont des blocs d’entraînement séparés** : ni les 4 min 30 de corde ni les 22 min de vélo, y compris ses cinq minutes faciles initiales, ne rentrent dans l’échauffement musculaire de 6–10 min. SESSION TIMER inclut tout le créneau une seule fois.

**4. Lundi et correction explicite du vélo**

Blocs : WARMUP initial court → ROPE → STRENGTH avec approches distinctes juste avant le mouvement concerné → BIKE_INTERVALS → COOLDOWN éventuel. Préparation initiale + approches partagent la cible 6–10 min. Les approches sont WARMUP_SET, sans volume/record ; ne pas les compter deux fois. ROPE et BIKE_INTERVALS restent séparés de l’échauffement musculaire.

Corde : quatre efforts faciles/modérés de45 s, séparés par trois repos de30 s. Recette à sept étapes :45/30/45/30/45/30/45 =270 s, dont180 s de corde. Interface passage x/4, chrono, pause/reprise, passer, arrêter, gêne, terminer.

**Attention : la recette initialement écrite 5 min +4×(2 min soutenues +2 min faciles)+3 min dure24 min. La version retenue pour22 min est :**

5 min faciles →2 min soutenues →2 faciles →2 soutenues →2 faciles →2 soutenues →2 faciles →2 soutenues →3 min faciles finales.

Soit neuf étapes,1 320 s, quatre efforts soutenus totalisant8 min et14 min faciles. Les trois minutes finales remplacent la dernière récupération de deux minutes ; ne pas ajouter ensuite cette récupération. Versionner la recette `bike_monday_22_v1`. Si une recette avec les quatre récupérations de2 min est conservée, l’appeler24 min. Intensité indicative soutenue7–8/10 RPE, pas maximale ; RPE cardio distinct du RIR musculaire.

Le vélo est prévu mais adaptable/sautable. Statuts de résultat de bloc : PENDING, COMPLETED, SHORTENED, SKIPPED, UNKNOWN. Haut A terminé + vélo sauté = musculation terminée. Afficher corde3/4 ou vélo14/22 sans inventer le restant. Les trois minutes finales du vélo ne sont pas redoublées dans un cooldown séparé.

**5. Données et cycle de vie**

Séries nouvelles = source canonique. Préserver des identifiants stables : profil, séance réalisée, type de séance, bloc, occurrence d’exercice, variante/configuration, série/groupe/côté. Une séance fige sa révision de programme, sa version NORMAL/COMPACT/SHORT/RETURN et ses cibles. Les modifications futures ne réécrivent pas le passé.

Chaque série porte rôle WARMUP_SET/WORK_SET, charge/unité et configuration réellement utilisées, reps OU duration_sec, RIR, douleur/technique facultatives, START_SET, END_SET, date de validation distincte, commentaire et provenance. UNKNOWN est permis pour l’ancien rôle ou le résultat non connu. Double clic/idempotence : aucune série dupliquée. Les approches, essais et séries non confirmées ne créent pas de record.

Observations : NOT_ENTERED/UNKNOWN/VALUE ; nul pour les inconnus ; zéro réel conservé. Aucun RIR de repli à2, aucune douleur absente par défaut, aucun sommeil automatique de7,5 h. La charge peut être proposée mais doit être confirmée comme utilisée. Les reps de la dernière fois ne sont pas enregistrées comme celles du jour.

`mode = TRAINING/TEST`, séparé de `lifecycle = DRAFT/IN_PROGRESS/COMPLETED/INTERRUPTED/CANCELLED`. Historique ancien à état final inconnu : UNKNOWN. TEST terminé reste consultable, exclu par défaut des records/assiduité ; peut servir de référence de calibration après choix explicite. Annuler est traçable et ne supprime pas silencieusement les données. Le résultat du bloc musculation est distinct du statut du cardio et de la fermeture de la séance.

**6. Timers et vrai repos**

SESSION TIMER : START_SESSION avant échauffement, END_SESSION après le dernier bloc effectué/sauté. Inclure réglages, attente du partenaire, repos, corde, vélo et pauses. Un chrono par personne ; ne pas sommer les deux pour prétendre mesurer une durée commune. Pause du vélo ne pause pas la durée totale.

Persister les événements et les ancres, pas un compteur de ticks. Restaurer après arrière-plan, verrouillage et fermeture. Ne pas compter sur une sauvegarde lancée seulement à la sortie. Les anomalies d’horloge ou bornes manquantes restent signalées ; une fin de séance déclarée après oubli n’est pas une borne observée.

START_SET capture le début. END_SET capture la fin immédiatement et lance le repos avant la saisie des reps/RIR. La validation de formulaire ne redéfinit pas END_SET. Si début oublié, permettre la performance sans temps mesuré.

Repos cibles personnels et configurables : développés/tractions/presse environ150–180 s ; rowing120 s, ajustable90–180 ; curl jambes/extension90–120 ; curls/latéraux60–90, serré90–120 ; core45–90 ; Copenhagen60–120 avant même côté. Audit spécifique prioritaire sur défaut de famille. Ajouter30 s ou reprendre avant autorisé. Le bip ne démarre jamais la série suivante.

`actual_rest_sec = START_SET suivant − END_SET précédent` seulement avec bornes valides, même profil/séance/exercice/contexte, même côté si nécessaire. Sinon UNKNOWN. Une différence entre deux fins n’est jamais un repos réel. Si un autre exercice s’intercale, garder le délai comme tel et exclure la paire de l’analyse simple du repos. Un travail de l’autre côté se décrit comme intervalle local avant le même côté.

Une courte récupération et une baisse de reps peuvent être décrites ensemble : « Tester30 s de plus ». Ne pas affirmer la cause. `variationPct =100×(dernière−première)/première`; `dropOffPct =max(0,100×(première−dernière)/première)` sur valeurs comparables et première positive.10→9→8 :−20/+20 ;10→10→11 :+10/0 ;70→90 s :+28,6/0. Une seule série, un zéro de départ, une charge/variante modifiée : pourcentage inconnu/non comparable.

Pour corde/vélo : état durable avec recette, curseur d’étape, temps actif avant ancre, ancre, pauses, étapes sautées, résultats et confirmations. Distribuer le temps écoulé sur les étapes restantes ; sauter une étape n’ajoute jamais sa durée au guidage/au réalisé. Reprise idempotente sans rejouer les bips manqués. **L’horloge écoulée n’est pas la preuve que l’effort a été réalisé** : confirmation groupée possible en un geste, sinon réalisé partiel/inconnu. Son/vibration facultatifs ; wake lock si disponible. Ne pas promettre des alertes natives garanties navigateur fermé.

**7. Progression et matériel**

CALIBRATION → BASELINE_VALIDATED → PROGRESSION, références candidates séparées. Actions : KEEP_LOAD, ADD_REP, ADD_LOAD, ADD_SET, HARDER_VARIANT, REDUCE_LOAD, DELOAD, TECHNIQUE_FIRST, RECALIBRATE. Raisons, données utilisées et manquantes visibles. Pas de +2,5–5 % chaque semaine ni de score global de readiness.

Garder20 kg pour10/10/9 en8–12 ; construire les reps. Respecter les paliers connus2/4/7/9/11/14/16/18/20/23 kg, maximum annoncé41, suite inconnue.20→23 =+15 %,4→7 =+75 % : pas d’augmentation forcée. Ne pas réécrire les anciennes charges selon la grille actuelle.

TRX : ancrage, longueur, pieds, variante, amplitude, reps/RIR ; pas de kg fictifs. Bandes : ID/couleur/inscription commerciale/ancrage/distance ; inscription «25 kg» ≠ force mesurée. Poids du corps : reps/assistance/levier/amplitude/variante/lest externe séparé du poids du jour. Gainages en duration_sec, plafonds de plage puis levier ; ab wheel en TEST. Nouvelle machine/configuration significative = contexte distinct/recalibration. Les résultats d’un profil ne changent jamais la recommandation de l’autre.

**8. Mensurations**

Créer/adapter PROGRESSION/MENSURATIONS : poids, nombril, ventre au plus large, poitrine, carrure/tour d’épaules avec méthode, bras D/G, avant-bras D/G, cuisses D/G, mollets D/G. Champs facultatifs, date et conditions facultatives, unités claires, historique et différences sur données présentes. Valeur vide ≠0 ; accepter66,5 ; ne pas écraser tous les relevés du même jour ou ceux de l’autre profil. Pas de masse musculaire ou de taux de graisse inventé. Export/import inclus.

**9. Migration et sauvegarde — priorité avant activation**

L’export réel `coach-muscu-sauvegarde (7).json` du15/09/2026 porte déjà `v:2`. Nouveau format : discriminant `format: coach-muscu-backup` ET `schemaVersion:2`. Détecter l’ancien par sa structure : programs/logs/states/course/workoutDraft ; le profil actif `pote` ne signifie pas que toutes ses données sont celles du partenaire.

Fixture connue :95 entrées Mathieu et104 partenaire =199 ;17+3 entrées détaillées =20 ;45+9 observations de séries =54 ;179 agrégats sans détail ;13+14 groupes de séances par profil/session =27 ;16+17 états =33 ;4 plans par profil =8. Préserver199 résumés liés aux54 détails, sans compter les deux fois. Ne jamais créer9/9/9 depuis l’agrégat9×3. Une série détaillée ancienne n’est pas nécessairement classable en approche/travail.

Archiver le fichier brut récupérable avec empreinte, garder les champs inconnus, construire un candidat V2 séparé, valider les relations/totaux puis basculer. Panne avant bascule : ancien jeu conservé. IDs déterministes pour l’import exact ; réimport même fichier = aucun doublon. Anciennes dates/sessionId ne sont pas des bornes de série ou de séance mesurées.

Ambiguïtés à conserver et annoter : secondes dans reps ; Copenhagen ; shrugs partenaire12 bruts et correction vers2 voulues sans séries exécutées inventées ; readiness potentiellement par défaut ; rowing ; Pallof45–50 kg ; inscriptions des bandes. Les calculs anciens reco/status/volumeTotal/dropOffPct restent des calculs historiques non certifiés V2. Source brute, note de migration et confiance conservées. Ne pas importer le CSV correspondant au JSON comme un deuxième historique.

Export V2 complet et par profil clairement distingués ; aller-retour V2 sans perte de valeurs, inconnus, IDs, programmes, séances en cours, mesures, références, archives et relations. Conflit même ID/contenu différent : visible, pas d’écrasement silencieux. Les imports d’anciens fichiers différents qui se chevauchent exigent une prévisualisation des doublons/conflits, pas une fusion aveugle.

**10. Réutilisation et UX**

Alana sert pour formulaires/mesures, explications, gainages à côtés, préparation et retour au calme ; adapter ses composants et ses clés. Ne pas reprendre son repos global de180 s ni ses sélecteurs DOM/valeurs propres à Alana sans intégration. Timéo sert pour variantes et progression au poids du corps, distinction essai/réel et timers à échéance ; ne pas copier ses valeurs de repli RIR/technique/douleur ni des états de timer uniquement en mémoire. Vérifier les vrais modules disponibles et leurs versions.

Écran force : profil, exercice/variante, série x/y/côté, charge et unité, cible, dernière performance datée, deux chronos ; START SET, END SET, validation reps/durée/RIR, douleur facultative. Écran corde/vélo plus simple. Résumé par blocs, aucune pénalité automatique si cardio sauté. Préserver l’UX, ne pas exposer des champs techniques de migration pendant la séance.

**11. Tests et livraison**

Avant déclaration de réussite de l’implémentation, exécuter les cas de Q, dont : import fixture/format ancien v2, comptes ci-dessus, profils séparés, agrégats non reconstruits, série multi-charge, inconnus/readiness/RIR0, idempotence des clics/imports, START/END_SESSION complet, END_SET avant formulaire, actual_rest mesuré/inconnu, même côté, arrière-plan/verrouillage/rechargement, pauses de bloc, corde270 s et3/4, vélo1 320 s et refus d’appeler1 440 s «22 min»,14/22, vélo sauté avec Haut A terminé, absence de confirmation cardio, exercices au temps, tractions partenaire et historique bandes, versions compactes/reprise, mensurations, export/réimport sémantiquement identique et migration interrompue sans perte. Tester les bornes avec horloge contrôlée et la reprise sur appareil réel ; noter séparément les alertes reçues et les temps restaurés.

Vérifier PROG-09 et PLAN-01 à PLAN-06 : ordres, versions C13/15/11, quatre totaux hebdomadaires, complément unique non automatique, emplacement triceps conservé en court, substitution sans cumul, mode TEST distinct du classement d’exercice, anciens instantanés préservés et semaine sans Bas A. Deux vélos permettent des blocs de22 min en parallèle avec résultats individuels.

Vérifier aussi les trois cas WARM de la spécification : échauffements A/B/C courts et spécifiques avec approches incluses ; cardio séparé et absence de double comptage ; retour terrain déclaré conservé sans résultat exact inventé. Vérifier qu’une durée réelle différente de la cible est conservée et qu’aucune attente jusqu’à dix minutes n’est imposée.

Travaille par petites étapes : inventaire → protection/modèle → migration/export → séries/états → timers/blocs → progression/mesures/programme → régression et téléphone. Garde l’application fonctionnelle entre étapes. Donne les vrais fichiers modifiés, les fonctions conservées, les tests réellement exécutés et leurs résultats, les tests non exécutés et les limites. Fournis une version testable adaptée au projet. N’affirme pas une mise en production, une migration réelle ou une validation sur téléphone si elle n’a pas eu lieu.

Le but est une V2 simple, fiable et mesurable : **trois séances haut conservées, historique intact, lundi complet visible, données inconnues autorisées et aucune performance inventée.**

---

## V — Différences V1.1 → V1.2

- **Référence C remplacée par BASE 13** dès le premier essai : couché 3, tractions 2, TRX 2, serré 2, latéraux 2, supination 2 ; développé serré placé avant les isolations. Les anciennes doses automatiques de couché/curl et l’ancien premier essai sont retirés des prescriptions actives.
- **AVEC COMPLÉMENT 15 redéfini** : BASE 13 + deux séries de shrugs OU d’oiseau poitrine appuyée, selon un besoin identifié ; choix stable par profil, jamais deux compléments ni activation automatique.
- **COURTE 11 corrigée** : retrait des deux séries de curl supination ; conservation des deux séries ciblées triceps.
- **Extension triceps au-dessus de la tête introduite comme TEST de substitution** ; serré initial conservé, remplacement seulement adopté explicitement, jamais additionné.
- **Couverture et totaux recalculés** : base 57/56 ; complément 59/58 ; courte 55/54 ; premier C base + RETURN 12 maximum 51/50. Tableaux individuels, exemples, critères de contrôle et prompt alignés.
- **Arbitrages de l’audit intégrés au contrat d’implémentation** : complémentarités des exercices, raisons des ordres retenus, contraintes vendredi/samedi, intervalle futsal → jambes de 41 h 30 et budgets de durée ; contrôles PROG-09/PLAN associés aux nouvelles prescriptions.
