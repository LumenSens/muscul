# Tests

- `run-tests.js` : règles métier, horloges, programmes et migration.
- `ui-smoke.js` : parcours DOM et migration visible dans l’interface.
- `test-results.json` et `ui-smoke-results.json` : derniers résultats réellement produits.

Le test d’intégration MIG utilise la sauvegarde réelle située hors du paquet à l’emplacement de travail `../source_data/coach-muscu-sauvegarde (7).json`. Elle n’est volontairement pas incluse dans la livraison afin de ne pas distribuer de données personnelles.

Pour réexécuter ailleurs, fournir une fixture autorisée équivalente et adapter `fixturePath`. Le test TIME-10 reste manuel et suit `../MANUAL_PHONE_TEST.md`.
