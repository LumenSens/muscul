"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const E = require("../app.js");

const fixturePath = path.resolve(__dirname, "../../source_data/coach-muscu-sauvegarde (7).json");
const hasFixture = fs.existsSync(fixturePath);
const fixtureRaw = hasFixture ? fs.readFileSync(fixturePath, "utf8") : null;
const fixture = hasFixture ? JSON.parse(fixtureRaw) : null;
const results = [];

async function test(id, name, fn) {
  try {
    await fn();
    results.push({ id, name, status: "PASS" });
    console.log("PASS", id, name);
  } catch (error) {
    results.push({ id, name, status: "FAIL", error: error.stack || String(error) });
    console.error("FAIL", id, name, "\n", error.stack || error);
  }
}

function observation(value) { return E.obs("VALUE", value); }

function plan(data, profile, type) { return E.activePlan(data, profile, type); }

function findOccurrence(data, profile, type, exerciseId) {
  return plan(data, profile, type).occurrences.find(o => o.exercise_id === exerciseId);
}

function startAndFinishRecordedExposure(data, profile, type, exerciseId, values, load, rirValues, startMs) {
  const workout = E.startWorkout(data, profile, type, "TRAINING", null, startMs);
  const occurrence = workout.plan_snapshot.occurrences.find(o => o.exercise_id === exerciseId);
  values.forEach((value, index) => {
    const start = startMs + 1000 + index * 200000;
    const set = E.startSet(data, workout.workout_id, occurrence, index + 1, index + 1, "BILATERAL", "WORK_SET", start);
    E.endSet(data, set.set_id, start + 40000);
    E.recordSet(data, set.set_id, {
      value,
      load_value: load,
      rir: rirValues && rirValues[index] != null ? observation(rirValues[index]) : E.obs("NOT_ENTERED"),
      pain: observation(0),
      technique: E.obs("VALUE", "Propre")
    }, start + 55000);
  });
  E.finishWorkout(data, workout.workout_id, "COMPLETED", startMs + 1200000);
  return workout;
}

(async () => {
  const migrated = hasFixture ? await E.migrateLegacy(fixture, fixtureRaw) : null;

  async function mig(id, name, fn) {
    if (!hasFixture) {
      results.push({ id, name, status: "SKIP", error: "fixture historique absente du paquet" });
      console.log("SKIP", id, name);
      return;
    }
    await test(id, name, fn);
  }

  await mig("MIG-01", "v:2 historique n'est pas la V2 cible", () => {
    assert(E.isLegacy(fixture));
    assert(!E.isV2(fixture));
  });

  await mig("MIG-02", "inventaire réel entièrement conservé", () => {
    assert.deepStrictEqual({
      summaries: migrated.migration_report.summary_entries,
      details: migrated.migration_report.detailed_set_observations,
      aggregates: migrated.migration_report.aggregate_entries_without_detail,
      workouts: migrated.migration_report.workout_groups,
      readiness: migrated.migration_report.readiness_entries,
      plans: migrated.migration_report.historical_plan_models
    }, { summaries: 199, details: 54, aggregates: 179, workouts: 27, readiness: 33, plans: 8 });
  });

  await mig("MIG-03", "un agrégat 3 séries ne fabrique aucune série détaillée", () => {
    const summary = migrated.legacy_summaries.find(s => s.detail_set_ids.length === 0 && Number(s.aggregate.sets) === 3);
    assert(summary);
    assert.strictEqual(migrated.sets.filter(s => s.source_summary_id === summary.legacy_summary_id).length, 0);
  });

  await mig("MIG-04", "les quatre charges réelles de presse sont préservées", () => {
    const sets = migrated.sets.filter(s => s.profile_id === "moi" && s.exercise_id === "leg_press_h" && s.load && [42.5, 53, 66, 73].includes(s.load.value));
    assert.deepStrictEqual(sets.map(s => s.load.value), [42.5, 53, 66, 73]);
  });

  await mig("MIG-05", "les exercices historiquement ambigus restent non résolus", () => {
    const ambiguous = migrated.sets.filter(s => ["planche", "planche_lat", "copenhagen_dyn", "copenhagen_iso", "pallof", "row_appui"].includes(s.exercise_id));
    assert(ambiguous.length > 0);
    ambiguous.forEach(s => assert.strictEqual(s.result_kind, "LEGACY_UNRESOLVED"));
  });

  await mig("MIG-06", "shrugs partenaire à 12 reste brut et annoté", () => {
    const summary = migrated.legacy_summaries.find(s => s.profile_id === "pote" && s.exercise_id === "shrugs" && Number(s.aggregate.sets) === 12);
    assert(summary);
    assert.strictEqual(summary.aggregate.sets, 12);
    assert(/2 prévues/.test(summary.migrationNote));
    assert.strictEqual(summary.detail_set_ids.length, 0);
  });

  await mig("MIG-07", "réimport identique produit les mêmes identifiants métier", async () => {
    const again = await E.migrateLegacy(fixture, fixtureRaw);
    assert.strictEqual(again.migration_report.source_sha256, migrated.migration_report.source_sha256);
    assert.deepStrictEqual(again.legacy_summaries.map(s => s.legacy_summary_id), migrated.legacy_summaries.map(s => s.legacy_summary_id));
    assert.deepStrictEqual(again.sets.map(s => s.set_id), migrated.sets.map(s => s.set_id));
  });

  await test("MIG-08", "une migration invalide ne modifie pas le jeu actif", async () => {
    const active = E.createDataset();
    const before = JSON.stringify(active);
    await assert.rejects(() => E.migrateLegacy({ v: 2 }, "{}"));
    assert.strictEqual(JSON.stringify(active), before);
  });

  await test("MIG-09", "même sessionId ancien reste séparé par profil", async () => {
    const mini = { v: 2, exported: "2026-01-01T00:00:00Z", profile: "moi", programs: { moi: { seances: [] }, pote: { seances: [] } }, logs: { moi: { traction: [{ sessionId: "same", date: "2026-01-01", reps: 5, sets: 1 }] }, pote: { traction: [{ sessionId: "same", date: "2026-01-01", reps: 5, sets: 1 }] } }, states: { moi: {}, pote: {} }, course: {}, workoutDraft: {} };
    const out = await E.migrateLegacy(mini, JSON.stringify(mini));
    assert.strictEqual(out.workouts.length, 2);
    assert.notStrictEqual(out.workouts[0].workout_id, out.workouts[1].workout_id);
  });

  await mig("MIG-10", "export V2 conserve l'identité canonique", () => {
    const exported = E.exportDataset(migrated, "FULL");
    assert(E.isV2(exported));
    assert(E.validateDataset(exported));
    assert.strictEqual(exported.legacy_archives[0].sha256, migrated.legacy_archives[0].sha256);
    assert.deepStrictEqual(exported.sets, migrated.sets);
  });

  await test("MIG-11", "conflit visible et champ futur inconnu préservé", () => {
    const data = E.createDataset();
    data.extensions.future_field = { hello: "world" };
    assert.deepStrictEqual(E.exportDataset(data, "FULL").extensions.future_field, { hello: "world" });
    const w = E.startWorkout(data, "moi", "HAUT_C", "TRAINING", null, 1000);
    const incoming = E.deepClone(data); incoming.workouts.find(x => x.workout_id === w.workout_id).comment = "version contradictoire";
    const before = JSON.stringify(data), merged = E.mergeV2Dataset(data, incoming);
    assert.strictEqual(JSON.stringify(data), before, "la fusion doit construire un candidat séparé");
    assert.strictEqual(merged.stats.conflicts, 1);
    const conflict = merged.data.extensions.import_conflicts[0];
    assert.strictEqual(conflict.active_record.comment, ""); assert.strictEqual(conflict.incoming_record.comment, "version contradictoire");
  });

  await test("SET-01", "START/END répétés restent idempotents", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_C", "TRAINING", null, 1000000), o = w.plan_snapshot.occurrences[0];
    const a = E.startSet(data, w.workout_id, o, 1, 1, "BILATERAL", "WORK_SET", 1001000);
    const b = E.startSet(data, w.workout_id, o, 1, 1, "BILATERAL", "WORK_SET", 1002000);
    assert.strictEqual(a.set_id, b.set_id);
    E.endSet(data, a.set_id, 1041000); E.endSet(data, a.set_id, 1051000);
    assert.strictEqual(data.sets.length, 1);
    assert.strictEqual(new Date(a.ended_at).getTime(), 1041000);
  });

  await test("SET-02", "END_SET reste distinct de recorded_at", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_C", "TRAINING", null, 1000000), o = w.plan_snapshot.occurrences[0];
    const s = E.startSet(data, w.workout_id, o, 1, 1, "BILATERAL", "WORK_SET", 1000000);
    E.endSet(data, s.set_id, 1040000);
    E.recordSet(data, s.set_id, { value: 10, load_value: 20 }, 1055000);
    assert.strictEqual(new Date(s.ended_at).getTime(), 1040000);
    assert.strictEqual(new Date(s.recorded_at).getTime(), 1055000);
  });

  await test("SET-03", "RIR zéro, inconnu et absent sont distincts", () => {
    assert.deepStrictEqual(E.obs("VALUE", 0), { state: "VALUE", value: 0, provenance: "USER_ENTERED", confidence: "CONFIRMED" });
    assert.strictEqual(E.obs("UNKNOWN").value, null);
    assert.strictEqual(E.obs("NOT_ENTERED").state, "NOT_ENTERED");
  });

  await test("SET-04", "approches et travail gardent des rôles séparés", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_A", "TRAINING", null, 1000), o = w.plan_snapshot.occurrences[0];
    const warm = E.startSet(data, w.workout_id, o, 1, "warmup-1", "NOT_APPLICABLE", "WARMUP_SET", 2000);
    E.endSet(data, warm.set_id, 3000); E.recordSet(data, warm.set_id, { value: 10, load_value: 7 }, 4000);
    assert.strictEqual(warm.role, "WARMUP_SET");
    assert.strictEqual(E.plannedSetSlots(w.plan_snapshot).length, 15);
  });

  await test("SET-05", "unilatéral crée deux observations par groupe sans doubler la cible", () => {
    const data = E.createDataset(), p = plan(data, "moi", "HAUT_B"), row = p.occurrences.find(o => o.exercise_id === "row_appui");
    const slots = E.plannedSetSlots({ occurrences: [row] });
    assert.strictEqual(row.sets, 3);
    assert.strictEqual(slots.length, 6);
    assert.strictEqual(new Set(slots.map(s => s.group)).size, 3);
    const w = E.startWorkout(data, "moi", "HAUT_B", "TRAINING", null, 1000);
    const occurrence = w.plan_snapshot.occurrences.find(o => o.exercise_id === "row_appui");
    [[1, "LEFT"], [1, "RIGHT"], [2, "LEFT"]].forEach((item, i) => E.addUnmeasuredSet(data, w.workout_id, occurrence, i + 1, item[0], item[1], "WORK_SET", { value: 10, load_value: 18 }, 2000 + i));
    assert.deepStrictEqual(E.logicalGroupSummary(E.setsFor(data, w.workout_id)), { complete_groups: 1, partial_groups: 1, recorded_observations: 3 });
  });

  await test("SET-06", "événements restent attachés au profil d'origine", () => {
    const data = E.createDataset();
    const wm = E.startWorkout(data, "moi", "HAUT_C", "TRAINING", null, 1000);
    const wp = E.startWorkout(data, "pote", "HAUT_C", "TRAINING", null, 2000);
    const s = E.startSet(data, wm.workout_id, wm.plan_snapshot.occurrences[0], 1, 1, "BILATERAL", "WORK_SET", 3000);
    assert.strictEqual(s.profile_id, "moi"); assert.notStrictEqual(s.workout_id, wp.workout_id);
  });

  await test("SET-CORRECTION", "une correction garde l'identité et une trace de révision", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_C", "TRAINING", null, 1000), o = w.plan_snapshot.occurrences[0];
    const s = E.startSet(data, w.workout_id, o, 1, 1, "BILATERAL", "WORK_SET", 2000); E.endSet(data, s.set_id, 3000);
    E.recordSet(data, s.set_id, { value: 10, load_value: 20, idempotency_key: "a" }, 4000);
    E.recordSet(data, s.set_id, { value: 11, load_value: 20, idempotency_key: "b" }, 5000);
    assert.strictEqual(s.reps, 11); assert.strictEqual(s.revision, 2); assert.strictEqual(s.corrections[0].previous.reps, 10);
  });

  await test("TIME-01", "durée séance exacte entre START et END", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_A", "TRAINING", null, 1000000);
    E.finishWorkout(data, w.workout_id, "COMPLETED", 1000000 + 5432 * 1000);
    assert.strictEqual(w.session_elapsed_sec, 5432);
  });

  await test("TIME-02", "reprise dérive le temps de l'horodatage", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_A", "TRAINING", null, 1000000);
    assert.strictEqual(E.sessionElapsed(w, 1300000), 300);
  });

  await test("TIME-03", "série active survit à une sérialisation", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_C", "TRAINING", null, 1000), o = w.plan_snapshot.occurrences[0];
    E.startSet(data, w.workout_id, o, 1, 1, "BILATERAL", "WORK_SET", 2000);
    const restored = JSON.parse(JSON.stringify(data));
    assert.strictEqual(E.activeWorkout(restored, "moi").active_set_id, restored.sets[0].set_id);
    assert.strictEqual(restored.sets[0].state, "IN_PROGRESS");
  });

  await test("TIME-04", "pause vélo suspend le bloc mais pas le chrono séance", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_A", "TRAINING", null, 1000000), bike = E.blocksFor(data, w.workout_id).find(b => b.kind === "BIKE_INTERVALS");
    E.beginIntervalBlock(data, bike.block_id, 1100000); E.pauseIntervalBlock(data, bike.block_id, 1220000);
    const guided = bike.timer_state.guided_elapsed_sec; E.syncIntervalBlock(data, bike.block_id, 1500000, false);
    assert.strictEqual(bike.timer_state.guided_elapsed_sec, guided);
    assert.strictEqual(E.sessionElapsed(w, 1500000), 500);
  });

  await test("TIME-05", "repos réel commence à END_SET et peut dépasser la cible", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_C", "TRAINING", null, 1000000), o = w.plan_snapshot.occurrences[0];
    const a = E.startSet(data, w.workout_id, o, 1, 1, "BILATERAL", "WORK_SET", 1000000); E.endSet(data, a.set_id, 1040000); E.recordSet(data, a.set_id, { value: 10, load_value: 20 }, 1055000);
    const b = E.startSet(data, w.workout_id, o, 2, 2, "BILATERAL", "WORK_SET", 1250000);
    assert.strictEqual(b.actual_rest_sec, 210);
  });

  await test("TIME-06", "deux fins sans début suivant ne donnent aucun repos réel", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_C", "TRAINING", null, 1000), o = w.plan_snapshot.occurrences[0];
    const a = E.startSet(data, w.workout_id, o, 1, 1, "BILATERAL", "WORK_SET", 2000); E.endSet(data, a.set_id, 4000);
    assert.strictEqual(a.actual_rest_sec, null);
  });

  await test("TIME-07", "Copenhagen apparie le même côté malgré l'autre côté intercalé", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_A", "TRAINING", null, 1000000), o = w.plan_snapshot.occurrences.find(x => x.exercise_id === "copenhagen_dyn");
    const left1 = E.startSet(data, w.workout_id, o, 1, 1, "LEFT", "WORK_SET", 1000000); E.endSet(data, left1.set_id, 1010000); E.recordSet(data, left1.set_id, { value: 8 }, 1011000);
    const right1 = E.startSet(data, w.workout_id, o, 2, 1, "RIGHT", "WORK_SET", 1020000); E.endSet(data, right1.set_id, 1030000); E.recordSet(data, right1.set_id, { value: 8 }, 1031000);
    const left2 = E.startSet(data, w.workout_id, o, 3, 2, "LEFT", "WORK_SET", 1070000);
    assert.strictEqual(left2.actual_rest_sec, 60);
    assert.strictEqual(left2.actual_rest_quality, "CAPTURED_LOCAL_WITH_OTHER_SIDE");
  });

  await test("TIME-08", "horloge inversée devient CLOCK_ANOMALY", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_C", "TRAINING", null, 1000000), o = w.plan_snapshot.occurrences[0];
    const a = E.startSet(data, w.workout_id, o, 1, 1, "BILATERAL", "WORK_SET", 1100000); E.endSet(data, a.set_id, 1150000); E.recordSet(data, a.set_id, { value: 10, load_value: 20 }, 1160000);
    const b = E.startSet(data, w.workout_id, o, 2, 2, "BILATERAL", "WORK_SET", 1140000);
    assert.strictEqual(b.actual_rest_sec, null);
    assert.strictEqual(w.rest_intervals.at(-1).quality, "CLOCK_ANOMALY");
    const timer = { step_index: 0, step_elapsed_sec: 0, guided_elapsed_sec: 0, anchor_at_ms: 2000, paused: false, finished: false, needs_confirmation: false, skipped_step_ids: [], step_results: [] };
    E.advanceIntervalState(timer, E.ROPE_RECIPE, 1000); assert.strictEqual(timer.clock_anomaly, true); assert.strictEqual(timer.guided_elapsed_sec, 0);
  });

  await test("TIME-09", "les timers restent utilisables sans API de signal ou wake lock", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_A", "TRAINING", null, 1000000);
    const rope = E.blocksFor(data, w.workout_id).find(b => b.kind === "ROPE");
    E.beginIntervalBlock(data, rope.block_id, 1010000);
    E.syncIntervalBlock(data, rope.block_id, 1055000, true);
    assert.strictEqual(rope.timer_state.guided_elapsed_sec, 45);
    assert.strictEqual(E.sessionElapsed(w, 1055000), 55);
  });

  await test("CARD-01", "corde = 7 étapes et 270 secondes", () => {
    assert.strictEqual(E.ROPE_RECIPE.steps.length, 7); assert.strictEqual(E.recipeTotal(E.ROPE_RECIPE), 270);
    assert.strictEqual(E.ROPE_RECIPE.steps.filter(s => s.type === "EFFORT").reduce((a, s) => a + s.duration_sec, 0), 180);
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_A", "TRAINING", null, 0), rope = E.blocksFor(data, w.workout_id).find(b => b.kind === "ROPE");
    E.beginIntervalBlock(data, rope.block_id, 0); E.syncIntervalBlock(data, rope.block_id, 270000, false); E.finishIntervalBlock(data, rope.block_id, "CONFIRMED", 270000);
    assert.strictEqual(E.setsFor(data, w.workout_id).length, 0);
  });

  await test("CARD-02", "une phase corde passée n'est pas créditée", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_A", "TRAINING", null, 0), rope = E.blocksFor(data, w.workout_id).find(b => b.kind === "ROPE");
    E.beginIntervalBlock(data, rope.block_id, 0); E.skipIntervalStep(data, rope.block_id, 0);
    assert.strictEqual(rope.timer_state.step_results[0].performed_duration_sec, 0);
    assert.strictEqual(rope.timer_state.step_results[0].status, "SKIPPED");
  });

  await test("CARD-03", "vélo V1 = 9 étapes, 4 efforts et 1320 secondes", () => {
    assert.strictEqual(E.BIKE_RECIPE.steps.length, 9); assert.strictEqual(E.recipeTotal(E.BIKE_RECIPE), 1320);
    assert.strictEqual(E.BIKE_RECIPE.steps.filter(s => s.type === "EFFORT").reduce((a, s) => a + s.duration_sec, 0), 480);
  });

  await test("CARD-04", "ancienne recette littérale vaut 1440 secondes", () => {
    assert.strictEqual(300 + 4 * (120 + 120) + 180, 1440);
  });

  await test("CARD-05", "arrêt à 14 minutes reste SHORTENED", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_A", "TRAINING", null, 0), bike = E.blocksFor(data, w.workout_id).find(b => b.kind === "BIKE_INTERVALS");
    E.beginIntervalBlock(data, bike.block_id, 0); E.finishIntervalBlock(data, bike.block_id, "CONFIRMED", 840000);
    assert.strictEqual(bike.outcome, "SHORTENED"); assert.strictEqual(bike.timer_state.guided_elapsed_sec, 840);
  });

  await test("CARD-06", "vélo passé ne modifie pas le résultat musculation", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_A", "TRAINING", null, 0), bike = E.blocksFor(data, w.workout_id).find(b => b.kind === "BIKE_INTERVALS");
    E.completeSimpleBlock(data, bike.block_id, "SKIPPED", 1000);
    assert.strictEqual(bike.outcome, "SKIPPED"); assert.strictEqual(w.strength_outcome, "UNKNOWN");
  });

  await test("CARD-07", "avance après plusieurs frontières ne duplique pas les phases", () => {
    const timer = { step_index: 0, step_elapsed_sec: 0, guided_elapsed_sec: 0, anchor_at_ms: 0, paused: false, finished: false, skipped_step_ids: [], step_results: [] };
    E.advanceIntervalState(timer, E.ROPE_RECIPE, 200000); E.advanceIntervalState(timer, E.ROPE_RECIPE, 240000);
    assert.strictEqual(new Set(timer.step_results.map(r => r.step_id)).size, timer.step_results.length);
    assert.strictEqual(timer.guided_elapsed_sec, 240);
  });

  await test("CARD-08", "fin du guidage ne confirme pas automatiquement le réalisé", () => {
    const timer = { step_index: 0, step_elapsed_sec: 0, guided_elapsed_sec: 0, anchor_at_ms: 0, paused: false, finished: false, skipped_step_ids: [], step_results: [] };
    E.advanceIntervalState(timer, E.BIKE_RECIPE, 1320000);
    assert(timer.finished); assert(timer.step_results.every(r => r.confirmation_state === "NOT_ENTERED" && r.performed_duration_sec === null));
  });

  await test("PROG-01", "20 kg 10/10/9 propose ADD_REP", () => {
    const data = E.createDataset(); startAndFinishRecordedExposure(data, "moi", "HAUT_C", "dev_plat", [10, 10, 9], 20, [2, 2, 1], 1000000); startAndFinishRecordedExposure(data, "moi", "HAUT_C", "dev_plat", [10, 10, 9], 20, [2, 2, 1], 3000000);
    const r = E.progressionRecommendation(data, "moi", findOccurrence(data, "moi", "HAUT_C", "dev_plat"), "HAUT_C");
    assert.strictEqual(r.action, "ADD_REP");
  });

  await test("PROG-02", "paliers 20→23 et 4→7 sont réels", () => {
    assert.strictEqual(E.nextStep(E.DB_STEPS, 20), 23); assert.strictEqual(E.nextStep(E.DB_STEPS, 4), 7);
    assert.strictEqual(Math.round((23 - 20) / 20 * 100), 15); assert.strictEqual(Math.round((7 - 4) / 4 * 100), 75);
    const data = E.createDataset(); startAndFinishRecordedExposure(data, "moi", "LEGS", "leg_press_h", [12, 12], 20, [3, 3], 1000000); startAndFinishRecordedExposure(data, "moi", "LEGS", "leg_press_h", [12, 12], 20, [3, 3], 3000000);
    const machine = E.progressionRecommendation(data, "moi", findOccurrence(data, "moi", "LEGS", "leg_press_h"), "LEGS");
    assert(machine.reason_codes.includes("MACHINE_STEP_UNKNOWN")); assert.notStrictEqual(machine.action, "ADD_LOAD");
  });

  await test("PROG-03", "aucune donnée = calibration sans hausse", () => {
    const data = E.createDataset(); const r = E.progressionRecommendation(data, "moi", findOccurrence(data, "moi", "HAUT_A", "dev_incline"), "HAUT_A");
    assert.strictEqual(r.phase, "CALIBRATION"); assert.strictEqual(r.action, "KEEP_LOAD");
  });

  await test("PROG-04", "variation et drop-off utilisent première/dernière", () => {
    assert.deepStrictEqual(E.variation([10, 9, 8]), { variationPct: -20, dropOffPct: 20 });
    assert.deepStrictEqual(E.variation([10, 10, 11]), { variationPct: 10, dropOffPct: 0 });
    const d = E.variation([70, 90]); assert(Math.abs(d.variationPct - 28.571428) < 0.001); assert.strictEqual(d.dropOffPct, 0);
  });

  await test("PROG-05", "variantes et bandes gardent des contextes distincts sans kg fictif", () => {
    const data = E.createDataset(); const a = findOccurrence(data, "moi", "HAUT_B", "traction"); const b = E.deepClone(a); b.variant_id = "traction-assisted";
    assert.notStrictEqual(a.variant_id, b.variant_id);
    const w = E.startWorkout(data, "moi", "HAUT_B", "TRAINING", null, 1000), face = w.plan_snapshot.occurrences.find(o => o.exercise_id === "face_pull");
    const set = E.addUnmeasuredSet(data, w.workout_id, face, 1, 1, "BILATERAL", "WORK_SET", { value: 18, load_value: 25, configuration_note: "bande rouge 25 kg · ancrage haut" }, 2000);
    assert.strictEqual(set.load.value, null); assert.strictEqual(set.load.state, "NOT_APPLICABLE"); assert(/bande rouge/.test(set.configuration_snapshot.user_note));
  });

  await test("PROG-06", "repère partenaire 3×5 ne crée aucune série", () => {
    const data = E.createDataset(), ref = data.performance_references.find(r => r.profile_id === "pote" && r.exercise_id === "traction");
    assert.deepStrictEqual(ref.value, { sets: 3, reps: 5, text: "3×5" }); assert.strictEqual(data.sets.length, 0);
  });

  await test("PROG-07", "première traction partenaire ne propose pas de lest", () => {
    const data = E.createDataset(); startAndFinishRecordedExposure(data, "pote", "HAUT_B", "traction", [4, 4, 3], null, [0, 0, 0], 1000000);
    const r = E.progressionRecommendation(data, "pote", findOccurrence(data, "pote", "HAUT_B", "traction"), "HAUT_B");
    assert.strictEqual(r.phase, "CALIBRATION"); assert.notStrictEqual(r.action, "ADD_LOAD");
  });

  await test("PROG-08", "adaptation Base vers Courte conserve le réalisé sans faux crédit", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_C", "TRAINING", null, 1000);
    const curl = w.plan_snapshot.occurrences.find(o => o.exercise_id === "curl_supination");
    const performed = E.addUnmeasuredSet(data, w.workout_id, curl, 1, 1, "BILATERAL", "WORK_SET", { value: 12, load_value: 9 }, 2000);
    E.adaptWorkoutPlan(data, w.workout_id, "SHORT", "RECUPERATION", 3000);
    assert.strictEqual(w.plan_snapshot.target_groups, 11); assert(!w.plan_snapshot.occurrences.some(o => o.exercise_id === "curl_supination"));
    assert(E.setsFor(data, w.workout_id).some(s => s.set_id === performed.set_id)); assert.strictEqual(w.adaptations.length, 1);
    assert.strictEqual(E.completedPlannedSlots(data, w).length, 0, "la série retirée du restant ne complète aucune série du plan court");
  });

  await test("PROG-09", "C Base/15/11 et triceps conservé", () => {
    const base = E.planFor("moi", "HAUT_C", { c_variant: "BASE", c_complement_preference: "NONE", triceps_exercise: "dev_serre" });
    const withC = E.planFor("moi", "HAUT_C", { c_variant: "WITH_COMPLEMENT", c_complement_preference: "SHRUG", triceps_exercise: "dev_serre" });
    const short = E.planFor("moi", "HAUT_C", { c_variant: "SHORT", c_complement_preference: "NONE", triceps_exercise: "dev_serre" });
    assert.strictEqual(base.target_groups, 13); assert.strictEqual(withC.target_groups, 15); assert.strictEqual(short.target_groups, 11);
    assert(short.occurrences.some(o => o.exercise_id === "dev_serre")); assert(!short.occurrences.some(o => o.exercise_id === "curl_supination"));
  });

  await test("PLAN-01", "ordres A/B/C/Jambes conformes", () => {
    const data = E.createDataset();
    assert.deepStrictEqual(plan(data, "moi", "HAUT_A").occurrences.map(o => o.exercise_id), ["dev_incline", "dev_epaules", "pompes_poignees", "elev_lat", "copenhagen_dyn"]);
    assert.deepStrictEqual(plan(data, "moi", "HAUT_B").occurrences.map(o => o.exercise_id), ["traction", "row_appui", "face_pull", "curl_marteau", "planche"]);
    assert.deepStrictEqual(plan(data, "moi", "HAUT_C").occurrences.map(o => o.exercise_id), ["dev_plat", "traction", "row_trx", "dev_serre", "elev_lat", "curl_supination"]);
    assert.deepStrictEqual(plan(data, "moi", "LEGS").occurrences.map(o => o.exercise_id), ["leg_press_h", "leg_curl_machine", "glute_drive", "leg_extension", "adducteurs_machine", "calf_machine", "pallof"]);
  });

  await test("PLAN-02", "totaux hebdomadaires de référence", () => {
    function total(profile, c, legs) { const settings = { c_variant: c, c_complement_preference: c === "WITH_COMPLEMENT" ? "SHRUG" : "NONE", triceps_exercise: "dev_serre", legs_variant: legs }; return E.planFor(profile, "HAUT_A", settings).target_groups + E.planFor(profile, "HAUT_B", settings).target_groups + E.planFor(profile, "HAUT_C", settings).target_groups + E.planFor(profile, "LEGS", settings).target_groups; }
    assert.deepStrictEqual([total("moi", "BASE", "NORMAL"), total("pote", "BASE", "NORMAL")], [57, 56]);
    assert.deepStrictEqual([total("moi", "WITH_COMPLEMENT", "NORMAL"), total("pote", "WITH_COMPLEMENT", "NORMAL")], [59, 58]);
    assert.deepStrictEqual([total("moi", "SHORT", "NORMAL"), total("pote", "SHORT", "NORMAL")], [55, 54]);
    assert.deepStrictEqual([total("moi", "BASE", "RETURN"), total("pote", "BASE", "RETURN")], [51, 50]);
  });

  await test("PLAN-03", "un seul complément C à la fois", () => {
    const shrug = E.planFor("moi", "HAUT_C", { c_variant: "WITH_COMPLEMENT", c_complement_preference: "SHRUG" });
    const rear = E.planFor("moi", "HAUT_C", { c_variant: "WITH_COMPLEMENT", c_complement_preference: "REAR_DELT" });
    assert(shrug.occurrences.some(o => o.exercise_id === "shrugs")); assert(!shrug.occurrences.some(o => o.exercise_id === "oiseau_appui"));
    assert(rear.occurrences.some(o => o.exercise_id === "oiseau_appui")); assert(!rear.occurrences.some(o => o.exercise_id === "shrugs"));
  });

  await test("PLAN-04", "extension triceps remplace sans s'ajouter", () => {
    const p = E.planFor("moi", "HAUT_C", { c_variant: "BASE", c_complement_preference: "NONE", triceps_exercise: "ext_triceps_overhead" });
    assert.strictEqual(p.target_groups, 13); assert(p.occurrences.some(o => o.exercise_id === "ext_triceps_overhead")); assert(!p.occurrences.some(o => o.exercise_id === "dev_serre"));
  });

  await test("PLAN-05", "instantané de séance ne change pas après réglage", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_C", "TRAINING", null, 1000);
    const originalRevision = w.program_revision_id;
    data.profile_settings.moi.c_variant = "SHORT"; E.refreshPrograms(data);
    assert.strictEqual(w.plan_snapshot.target_groups, 13); assert.strictEqual(E.activePlan(data, "moi", "HAUT_C").target_groups, 11);
    assert.notStrictEqual(data.active_program_revision_by_profile.moi, originalRevision); assert(data.program_revisions.some(r => r.program_revision_id === originalRevision));
  });

  await test("PLAN-06", "une seule jambes et RETURN sans Bas A", () => {
    const data = E.createDataset(), rev = data.program_revisions.find(r => r.program_revision_id === "coach-v1.2-moi");
    assert.strictEqual(rev.schedule.filter(x => x.workout_type === "LEGS").length, 1); assert(!rev.schedule.some(x => /BAS_A/.test(x.workout_type)));
    assert.strictEqual(E.activePlan(data, "moi", "LEGS").target_groups, 12);
  });

  await test("BODY-01", "un relevé partiel est valide", () => {
    const data = E.createDataset(), m = E.addMeasurement(data, "moi", "2026-09-17", { body_weight_kg: "66,5" }, "matin");
    assert.strictEqual(m.values.body_weight_kg.value, 66.5); assert.strictEqual(Object.keys(m.values).length, 1);
  });

  await test("BODY-02", "vide, zéro et décimale française sont traités honnêtement", () => {
    const ok = E.validateMeasurementInput({ body_weight_kg: "66,5", chest_cm: "" }); assert(ok.valid); assert.strictEqual(ok.values.body_weight_kg.value, 66.5); assert(!ok.values.chest_cm);
    const bad = E.validateMeasurementInput({ body_weight_kg: "0" }); assert(!bad.valid); assert.deepStrictEqual(bad.invalid_fields, ["body_weight_kg"]);
  });

  await test("BODY-03", "les deux profils et deux relevés du même jour restent séparés", () => {
    const data = E.createDataset(); E.addMeasurement(data, "moi", "2026-09-17", { body_weight_kg: 66.5 }); E.addMeasurement(data, "moi", "2026-09-17", { chest_cm: 94 }); E.addMeasurement(data, "pote", "2026-09-17", { body_weight_kg: 95 });
    assert.strictEqual(data.body_measurements.length, 3); assert.strictEqual(data.body_measurements.filter(m => m.profile_id === "moi").length, 2);
  });

  await test("MODE-01", "TEST annulé reste conservé et identifiable", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_C", "TEST", null, 1000); E.finishWorkout(data, w.workout_id, "CANCELLED", 5000);
    assert.strictEqual(data.workouts.length, 1); assert.strictEqual(w.mode, "TEST"); assert.strictEqual(w.lifecycle, "CANCELLED");
    assert(E.blocksFor(data, w.workout_id).every(b => b.outcome === "UNKNOWN"), "annuler ne prétend pas que chaque bloc a été explicitement sauté");
  });

  await test("MODE-02", "readiness non entré, inconnu et zéro restent distincts", () => {
    assert.strictEqual(E.observationFromInput("NOT_ENTERED", "").state, "NOT_ENTERED");
    assert.strictEqual(E.observationFromInput("UNKNOWN", "").state, "UNKNOWN");
    const zero = E.observationFromInput("VALUE", "0"); assert.strictEqual(zero.state, "VALUE"); assert.strictEqual(zero.value, 0);
  });

  await test("WARM-01", "blocs hauts gardent échauffement sans cardio déguisé", () => {
    const data = E.createDataset();
    assert.deepStrictEqual(plan(data, "moi", "HAUT_A").blocks, ["WARMUP", "ROPE", "STRENGTH", "BIKE_INTERVALS", "COOLDOWN"]);
    assert.deepStrictEqual(plan(data, "moi", "HAUT_B").blocks, ["WARMUP", "STRENGTH", "COOLDOWN"]);
    assert.deepStrictEqual(plan(data, "moi", "HAUT_C").blocks, ["WARMUP", "STRENGTH", "COOLDOWN"]);
  });

  await test("WARM-02", "préparation, approches, corde et vélo restent des catégories séparées", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_A", "TRAINING", null, 1000);
    const blocks = E.blocksFor(data, w.workout_id);
    const rope = blocks.find(b => b.kind === "ROPE"), bike = blocks.find(b => b.kind === "BIKE_INTERVALS");
    const occurrence = w.plan_snapshot.occurrences[0];
    E.addUnmeasuredSet(data, w.workout_id, occurrence, 1, "warmup-1", "NOT_APPLICABLE", "WARMUP_SET", { value: 8, load_value: 7 }, 2000);
    assert.strictEqual(E.recipeTotal(rope.plan_snapshot.recipe), 270); assert.strictEqual(E.recipeTotal(bike.plan_snapshot.recipe), 1320);
    assert.strictEqual(E.logicalGroupSummary(E.setsFor(data, w.workout_id)).complete_groups, 0, "une approche ne devient pas du volume de travail");
  });

  await test("WARM-03", "retour terrain ne fabrique aucune durée d'échauffement", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_B", "TRAINING", null, 1000);
    const warm = E.blocksFor(data, w.workout_id).find(b => b.kind === "WARMUP");
    E.completeSimpleBlock(data, warm.block_id, "COMPLETED", 500000);
    assert.strictEqual(warm.timing_quality, "UNKNOWN"); assert.strictEqual(warm.started_at, null); assert.strictEqual(warm.ended_at, null);
    assert.strictEqual(E.setsFor(data, w.workout_id).length, 0); assert.strictEqual(E.sessionElapsed(w, 500000), 499);
  });

  await test("UX-BIKE-01", "vélo n'a jamais deux efforts consécutifs", () => {
    assert.strictEqual(E.hasConsecutiveEffort(E.BIKE_RECIPE), false);
    assert.deepStrictEqual(E.intervalStepTypes(E.BIKE_RECIPE), ["WARMUP", "EFFORT", "RECOVERY", "EFFORT", "RECOVERY", "EFFORT", "RECOVERY", "EFFORT", "COOLDOWN"]);
  });

  await test("UX-BIKE-02", "après 5 min facile la phase suivante est un effort puis une récupération", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_A", "TRAINING", null, 0);
    const bike = E.blocksFor(data, w.workout_id).find(b => b.kind === "BIKE_INTERVALS");
    E.beginIntervalBlock(data, bike.block_id, 0);
    E.syncIntervalBlock(data, bike.block_id, 300000, false);
    assert.strictEqual(bike.timer_state.step_index, 1);
    assert.strictEqual(E.BIKE_RECIPE.steps[bike.timer_state.step_index].type, "EFFORT");
    E.syncIntervalBlock(data, bike.block_id, 420000, false);
    assert.strictEqual(E.BIKE_RECIPE.steps[bike.timer_state.step_index].type, "RECOVERY");
    E.syncIntervalBlock(data, bike.block_id, 540000, false);
    assert.strictEqual(E.BIKE_RECIPE.steps[bike.timer_state.step_index].type, "EFFORT");
    const typesSeen = [];
    for (let t = 0; t <= 1320; t += 30) {
      const timer = { step_index: 0, step_elapsed_sec: 0, guided_elapsed_sec: 0, anchor_at_ms: 0, paused: false, finished: false, skipped_step_ids: [], step_results: [] };
      E.advanceIntervalState(timer, E.BIKE_RECIPE, t * 1000);
      const step = E.BIKE_RECIPE.steps[Math.min(timer.step_index, E.BIKE_RECIPE.steps.length - 1)];
      if (step && typesSeen[typesSeen.length - 1] !== step.step_id) typesSeen.push(step.step_id);
    }
    const types = typesSeen.map(id => E.BIKE_RECIPE.steps.find(s => s.step_id === id).type);
    for (let i = 1; i < types.length; i++) assert.notStrictEqual(types[i] === "EFFORT" && types[i - 1] === "EFFORT", true);
  });

  await test("UX-REST-01", "unilatéral : pas de repos long entre gauche et droite de la même série", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_A", "TRAINING", null, 1000000);
    const o = w.plan_snapshot.occurrences.find(x => x.exercise_id === "copenhagen_dyn");
    const left1 = E.startSet(data, w.workout_id, o, 1, 1, "LEFT", "WORK_SET", 1000000);
    E.endSet(data, left1.set_id, 1010000);
    assert.strictEqual(E.restKindAfterEndingSet(data, left1), "INTER_SIDE");
    assert.strictEqual(w.active_rest.kind, "INTER_SIDE");
    assert.strictEqual(w.active_rest.target_adjusted_sec, 0);
    assert.strictEqual(E.frenchRestKind("INTER_SIDE"), "Changement de côté");
    E.recordSet(data, left1.set_id, { value: 8 }, 1011000);
    const right1 = E.startSet(data, w.workout_id, o, 2, 1, "RIGHT", "WORK_SET", 1020000);
    E.endSet(data, right1.set_id, 1030000);
    assert.strictEqual(w.active_rest.kind, "INTER_SET");
    assert.strictEqual(w.active_rest.target_adjusted_sec, o.rest_target_sec);
  });

  await test("UX-REST-02", "dernière série d'un exercice = transition vers l'exercice suivant", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_C", "TRAINING", null, 1000000);
    const o = w.plan_snapshot.occurrences[0];
    const last = E.startSet(data, w.workout_id, o, o.sets, o.sets, "BILATERAL", "WORK_SET", 1000000);
    E.endSet(data, last.set_id, 1040000);
    assert.strictEqual(w.active_rest.kind, "INTER_EXERCISE");
    assert.strictEqual(E.frenchRestKind("INTER_EXERCISE"), "Transition vers l’exercice suivant");
    assert.strictEqual(E.frenchRestKind("INTER_SET"), "Repos avant la prochaine série");
  });

  await test("UX-TEST-01", "mode TEST raccourcit le repos affiché sans en faire une perf", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_C", "TEST", null, 1000000);
    const o = w.plan_snapshot.occurrences[0];
    const a = E.startSet(data, w.workout_id, o, 1, 1, "BILATERAL", "WORK_SET", 1000000);
    E.endSet(data, a.set_id, 1040000);
    assert.strictEqual(w.active_rest.test_shortened, true);
    assert.strictEqual(w.active_rest.target_adjusted_sec, E.TEST_REST_SEC);
    E.recordSet(data, a.set_id, { value: 10, load_value: 20 }, 1045000);
    const b = E.startSet(data, w.workout_id, o, 2, 2, "BILATERAL", "WORK_SET", 1050000);
    assert.strictEqual(b.actual_rest_quality, "TEST_NOT_PERFORMANCE");
  });

  await test("UX-TEST-02", "vélo TEST compresse les phases à 5 s sans changer la recette TRAINING", () => {
    const data = E.createDataset();
    const training = E.startWorkout(data, "moi", "HAUT_A", "TRAINING", null, 0);
    const testW = E.startWorkout(data, "pote", "HAUT_A", "TEST", null, 0);
    const bikeT = E.blocksFor(data, training.workout_id).find(b => b.kind === "BIKE_INTERVALS");
    const bikeTest = E.blocksFor(data, testW.workout_id).find(b => b.kind === "BIKE_INTERVALS");
    assert.strictEqual(E.recipeTotal(bikeT.plan_snapshot.recipe), 1320);
    assert.strictEqual(E.recipeTotal(bikeTest.plan_snapshot.recipe), 9 * E.TEST_INTERVAL_STEP_SEC);
    assert.strictEqual(E.hasConsecutiveEffort(bikeTest.plan_snapshot.recipe), false);
    assert.strictEqual(E.intervalStepTypes(bikeTest.plan_snapshot.recipe)[0], "WARMUP");
    assert.strictEqual(E.intervalStepTypes(bikeTest.plan_snapshot.recipe)[1], "EFFORT");
    assert.strictEqual(E.intervalStepTypes(bikeTest.plan_snapshot.recipe)[2], "RECOVERY");
  });

  await test("UX-LOAD-01", "repère historique 20 kg apparaît pour l'incliné Mathieu", () => {
    const data = E.createDataset();
    const occ = E.activePlan(data, "moi", "HAUT_A").occurrences.find(o => o.exercise_id === "dev_incline");
    const s = E.suggestedLoad(data, "moi", occ, "HAUT_A");
    assert.strictEqual(s.value, 20);
    assert.strictEqual(s.unit, "kg_per_hand");
    assert.strictEqual(s.source, "REFERENCE");
  });

  await test("UX-LOAD-02", "charge saisie manuellement reste enregistrée", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_B", "TRAINING", null, 1000);
    const curl = w.plan_snapshot.occurrences.find(o => o.exercise_id === "curl_marteau");
    const set = E.addUnmeasuredSet(data, w.workout_id, curl, 1, 1, "BILATERAL", "WORK_SET", { value: 12, load_value: 9 }, 2000);
    assert.strictEqual(set.load.value, 9);
    assert.strictEqual(set.reps, 12);
    const suggested = E.suggestedLoad(data, "moi", curl, "HAUT_B");
    assert.strictEqual(suggested.value, 9);
    assert.strictEqual(suggested.source, "HISTORY");
  });

  await test("UX-UNI-01", "gauche et droite d'une série restent sauvegardés séparément", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_B", "TRAINING", null, 1000);
    const row = w.plan_snapshot.occurrences.find(o => o.exercise_id === "row_appui");
    E.addUnmeasuredSet(data, w.workout_id, row, 1, 1, "LEFT", "WORK_SET", { value: 10, load_value: 18 }, 2000);
    E.addUnmeasuredSet(data, w.workout_id, row, 2, 1, "RIGHT", "WORK_SET", { value: 9, load_value: 18 }, 3000);
    const sets = E.setsFor(data, w.workout_id);
    assert.strictEqual(sets.filter(s => s.side === "LEFT")[0].reps, 10);
    assert.strictEqual(sets.filter(s => s.side === "RIGHT")[0].reps, 9);
    assert.strictEqual(E.logicalGroupSummary(sets).complete_groups, 1);
  });

  await test("UX-SEP-01", "dataset Mathieu ne contient pas Ryan", () => {
    const data = E.createDataset({ profileId: "moi" });
    assert.deepStrictEqual(data.profile_ids, ["moi"]);
    assert.strictEqual(data.workouts.filter(w => w.profile_id === "pote").length, 0);
    assert.strictEqual(data.body_measurements.filter(m => m.profile_id === "pote").length, 0);
    E.addMeasurement(data, "moi", "2026-09-19", { body_weight_kg: 80 });
    const ryan = E.createDataset({ profileId: "pote" });
    assert.strictEqual(ryan.body_measurements.length, 0);
    assert.throws(() => E.prepareIncomingForProfile(data, "pote"), /IMPORT_MAUVAIS_PROFIL/);
  });

  await test("UX-SEP-02", "extract dual → Mathieu ne copie pas Ryan", () => {
    const dual = E.createDataset();
    E.addMeasurement(dual, "moi", "2026-09-19", { body_weight_kg: 80 });
    E.addMeasurement(dual, "pote", "2026-09-19", { body_weight_kg: 95 });
    const mathieu = E.restrictDatasetToProfile(dual, "moi");
    const ryan = E.restrictDatasetToProfile(dual, "pote");
    assert.strictEqual(mathieu.body_measurements.length, 1);
    assert.strictEqual(mathieu.body_measurements[0].values.body_weight_kg.value, 80);
    assert.strictEqual(ryan.body_measurements[0].values.body_weight_kg.value, 95);
    assert.deepStrictEqual(mathieu.profile_ids, ["moi"]);
    assert.deepStrictEqual(ryan.profile_ids, ["pote"]);
  });

  await test("UX-COURSE-01", "futsal enregistrable sans distance", () => {
    const data = E.createDataset();
    const entry = E.addCourseEntry(data, "moi", { date: "2026-09-18", terrain: "futsal", duration: 60, rpe: 7, legs: 4, knee: 1, distance: null });
    assert.strictEqual(entry.distance, null);
    assert.strictEqual(entry.duree, 60);
    assert.strictEqual(entry.rpe, 7);
    assert.strictEqual(entry.mode, "futsal_5v5");
  });

  await test("UX-LABELS-01", "jargon interne traduit", () => {
    assert.strictEqual(E.frenchSetRole("WARMUP_SET"), "Échauffement");
    assert.strictEqual(E.frenchSetRole("WORK_SET"), "Série de travail");
    assert.strictEqual(E.frenchAction("KEEP_LOAD"), "Garder la charge");
    assert.strictEqual(E.frenchPhase("CALIBRATION"), "Calibrage");
    assert.strictEqual(E.profileName("pote"), "Ryan");
  });

  await test("UX-HAUTA-01", "une séance Haut A se démarre et se termine", () => {
    const data = E.createDataset(), w = E.startWorkout(data, "moi", "HAUT_A", "TRAINING", null, 1000);
    assert.strictEqual(w.lifecycle, "IN_PROGRESS");
    assert.deepStrictEqual(E.blocksFor(data, w.workout_id).map(b => b.kind), ["WARMUP", "ROPE", "STRENGTH", "BIKE_INTERVALS", "COOLDOWN"]);
    E.finishWorkout(data, w.workout_id, "COMPLETED", 5000);
    assert.strictEqual(w.lifecycle, "COMPLETED");
    assert.strictEqual(w.mode, "TRAINING");
  });

  await test("REG-01", "export, profils, programmes et données principales valident ensemble", () => {
    const data = E.createDataset();
    assert.strictEqual(data.profiles.length, 2); assert.strictEqual(data.program_revisions.filter(r => !r.historical_only).length, 2);
    assert(E.validateDataset(E.exportDataset(data, "FULL")));
  });

  const failed = results.filter(r => r.status === "FAIL");
  const skipped = results.filter(r => r.status === "SKIP");
  const passed = results.filter(r => r.status === "PASS");
  const report = { generated_at: new Date().toISOString(), total: results.length, passed: passed.length, failed: failed.length, skipped: skipped.length, results };
  fs.writeFileSync(path.resolve(__dirname, "test-results.json"), JSON.stringify(report, null, 2));
  console.log("\nRESULT", report.passed + "/" + report.total, "passed", skipped.length ? "(" + skipped.length + " skipped)" : "");
  if (failed.length) process.exitCode = 1;
})();
