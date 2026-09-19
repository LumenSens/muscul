# STORAGE_MIGRATION.md

## Avant (V1.2 dual profils)

Origine unique, deux profils dans le même navigateur.

| Clé | Contenu |
|---|---|
| `coach_dataset_v2` | Jeu V2 complet, `profile_id` `moi` (Mathieu) et `pote` (Partenaire / Ryan) |
| `coach_dataset_v2_rollback` | Instantané précédent après import |
| `coach_v2_editor_lock` | Verrou d’édition multi-onglets |
| `coach_programs`, `coach_logs`, `coach_states`, `coach_course`, `coach_profile`, `coach_workoutDraft` | Ancien format LEGACY `v:2` |

Les identifiants métier internes restent `moi` et `pote`. Seul le libellé utilisateur de `pote` passe de « Partenaire » à « Ryan ».

## Après (deux apps personnelles)

Chaque build a son namespace, même sur un domaine Netlify différent et en test local.

### Mathieu

| Clé | Contenu |
|---|---|
| `coachMuscu.mathieu.dataset_v2` | Données **moi** uniquement |
| `coachMuscu.mathieu.dataset_v2_rollback` | Rollback Mathieu |
| `coachMuscu.mathieu.edit_lock` | Verrou Mathieu |

### Ryan

| Clé | Contenu |
|---|---|
| `coachMuscu.ryan.dataset_v2` | Données **pote** uniquement |
| `coachMuscu.ryan.dataset_v2_rollback` | Rollback Ryan |
| `coachMuscu.ryan.edit_lock` | Verrou Ryan |

Les anciennes clés ne sont **pas** effacées.

## Stratégie de migration au premier lancement

1. Lire le namespace propriétaire. S’il est déjà V2 valide et contient le bon profil → l’utiliser.
2. Sinon, si `coach_dataset_v2` existe :
   - Mathieu extrait `moi` via `restrictDatasetToProfile(data, "moi")`.
   - Ryan extrait `pote`.
   - Aucune copie croisée. La clé partagée reste intacte.
3. Sinon, si les clés LEGACY `coach_*` existent : migration V1.2 inchangée, puis extraction du profil de l’app.
4. Sinon : jeu neuf, un seul profil.

Marqueurs éventuels : `extensions.migrated_from_shared_v12`, `extensions.migrated_from_legacy_keys`, `extensions.owner_profile_id`.

## Import / export

- Export « profil uniquement » : inchangé, filtré sur le profil de l’app.
- Export « complet » d’une app personnelle : ne contient que ce profil (`scope: PROFILE`).
- Import d’une sauvegarde dual V1.2 : extraction du profil de l’app, rejet de l’autre (`IMPORT_MAUVAIS_PROFIL` si le fichier n’a que l’autre personne).
- Compatibilité des sauvegardes V1.2 (`format: coach-muscu-backup`, `schemaVersion: 2`) et LEGACY (`v: 2`) conservée.
- Un import identique reste un no-op. Un conflit conserve les deux versions.

## Ce qui n’est pas migré / copié

- Aucune séance, charge, mensuration, course ou sauvegarde de Mathieu n’est écrite dans le namespace Ryan, et inversement.
- L’archive brute LEGACY d’un export par profil reste omise (comportement V1.2) pour ne pas fuiter l’autre profil.
