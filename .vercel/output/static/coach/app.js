(function (root) {
  "use strict";

  var PRODUCT_VERSION = "2.0.1-v1.2-perso";
  var FORMAT = "coach-muscu-backup";
  var SCHEMA_VERSION = 2;
  var STORAGE_KEY = "coach_dataset_v2";
  var ROLLBACK_KEY = "coach_dataset_v2_rollback";
  var LEGACY_DATASET_KEY = "coach_dataset_v2";
  var TEST_REST_SEC = 5;
  var TEST_INTERVAL_STEP_SEC = 5;
  var PROFILES = [
    { profile_id: "moi", name: "Mathieu" },
    { profile_id: "pote", name: "Ryan" }
  ];
  var DB_STEPS = [2, 4, 7, 9, 11, 14, 16, 18, 20, 23];

  function exercise(id, name, category, resultKind, loadMode, options) {
    var out = {
      exercise_id: id,
      name: name,
      category: category,
      result_kind: resultKind || "REPS",
      load_mode: loadMode || "NONE",
      default_rest_sec: 90,
      unilateral: false,
      legacy_ambiguity: false
    };
    Object.keys(options || {}).forEach(function (key) { out[key] = options[key]; });
    return out;
  }

  var EXERCISES = {
    dev_incline: exercise("dev_incline", "Développé incliné haltères", "Pectoraux", "REPS", "EXTERNAL", { equipment: "db_pair", default_rest_sec: 180 }),
    dev_plat: exercise("dev_plat", "Développé couché haltères", "Pectoraux", "REPS", "EXTERNAL", { equipment: "db_pair", default_rest_sec: 180 }),
    dev_epaules: exercise("dev_epaules", "Développé épaules haltères", "Épaules", "REPS", "EXTERNAL", { equipment: "db_pair", default_rest_sec: 150 }),
    pompes_poignees: exercise("pompes_poignees", "Pompes sur poignées", "Pectoraux", "REPS", "BODYWEIGHT", { equipment: "bodyweight", default_rest_sec: 120 }),
    pompes_inclinees: exercise("pompes_inclinees", "Pompes inclinées", "Pectoraux", "REPS", "BODYWEIGHT", { equipment: "bodyweight", default_rest_sec: 120 }),
    elev_lat: exercise("elev_lat", "Élévations latérales", "Deltoïdes latéraux", "REPS", "EXTERNAL", { equipment: "small_db", default_rest_sec: 90 }),
    copenhagen_dyn: exercise("copenhagen_dyn", "Copenhagen dynamique", "Adducteurs / tronc", "REPS", "BODYWEIGHT", { equipment: "bodyweight", default_rest_sec: 90, unilateral: true, legacy_ambiguity: true }),
    copenhagen_iso: exercise("copenhagen_iso", "Copenhagen isométrique court", "Adducteurs / tronc", "DURATION_SEC", "BODYWEIGHT", { equipment: "bodyweight", default_rest_sec: 90, unilateral: true, legacy_ambiguity: true }),
    traction: exercise("traction", "Tractions classiques", "Dorsaux", "REPS", "BODYWEIGHT", { equipment: "bodyweight", default_rest_sec: 180 }),
    traction_assist: exercise("traction_assist", "Tractions assistées", "Dorsaux", "REPS", "BAND", { equipment: "band", default_rest_sec: 180 }),
    tir_v_elast: exercise("tir_v_elast", "Tirage vertical élastique", "Dorsaux", "REPS", "BAND", { equipment: "band", default_rest_sec: 120 }),
    row_appui: exercise("row_appui", "Rowing haltère avec appui", "Haut du dos", "REPS", "EXTERNAL", { equipment: "db_single", default_rest_sec: 120, unilateral: true, legacy_ambiguity: true }),
    row_trx: exercise("row_trx", "Rowing TRX", "Haut du dos", "REPS", "TRX", { equipment: "trx", default_rest_sec: 120 }),
    face_pull: exercise("face_pull", "Face pull élastique", "Deltoïdes arrière", "REPS", "BAND", { equipment: "band", default_rest_sec: 90 }),
    curl_marteau: exercise("curl_marteau", "Curl marteau", "Biceps", "REPS", "EXTERNAL", { equipment: "db_pair", default_rest_sec: 90 }),
    curl_supination: exercise("curl_supination", "Curl supination", "Biceps", "REPS", "EXTERNAL", { equipment: "db_pair", default_rest_sec: 90 }),
    planche: exercise("planche", "Planche", "Tronc", "DURATION_SEC", "BODYWEIGHT", { equipment: "bodyweight", default_rest_sec: 60, legacy_ambiguity: true }),
    dead_bug: exercise("dead_bug", "Dead bug", "Tronc", "REPS", "BODYWEIGHT", { equipment: "bodyweight", default_rest_sec: 60, unilateral: true }),
    dev_serre: exercise("dev_serre", "Développé serré", "Triceps", "REPS", "EXTERNAL", { equipment: "db_pair", default_rest_sec: 120 }),
    ext_triceps_overhead: exercise("ext_triceps_overhead", "Extension triceps au-dessus de la tête", "Triceps", "REPS", "EXTERNAL", { equipment: "db_single", default_rest_sec: 120, scientific_status: "TEST" }),
    shrugs: exercise("shrugs", "Shrugs", "Trapèzes supérieurs", "REPS", "EXTERNAL", { equipment: "db_pair", default_rest_sec: 120, scientific_status: "TEST" }),
    oiseau_appui: exercise("oiseau_appui", "Oiseau poitrine appuyée", "Deltoïdes arrière", "REPS", "EXTERNAL", { equipment: "db_pair", default_rest_sec: 90, scientific_status: "TEST" }),
    leg_press_h: exercise("leg_press_h", "Presse à cuisses", "Quadriceps / fessiers", "REPS", "MACHINE", { equipment: "machine", default_rest_sec: 180 }),
    leg_curl_machine: exercise("leg_curl_machine", "Leg curl machine", "Ischios", "REPS", "MACHINE", { equipment: "machine", default_rest_sec: 120 }),
    glute_drive: exercise("glute_drive", "Glute Drive", "Fessiers", "REPS", "MACHINE", { equipment: "machine", default_rest_sec: 120 }),
    leg_extension: exercise("leg_extension", "Leg extension", "Quadriceps", "REPS", "MACHINE", { equipment: "machine", default_rest_sec: 120 }),
    adducteurs_machine: exercise("adducteurs_machine", "Adducteurs machine", "Adducteurs", "REPS", "MACHINE", { equipment: "machine", default_rest_sec: 90 }),
    calf_machine: exercise("calf_machine", "Mollets machine", "Mollets", "REPS", "MACHINE", { equipment: "machine", default_rest_sec: 120 }),
    pallof: exercise("pallof", "Pallof press", "Tronc", "REPS", "MACHINE", { equipment: "machine", default_rest_sec: 60, unilateral: true, legacy_ambiguity: true }),
    ecarte_halt: exercise("ecarte_halt", "Écarté haltères", "Pectoraux", "REPS", "EXTERNAL", { equipment: "db_pair", default_rest_sec: 90 }),
    rappel_incline: exercise("rappel_incline", "Rappel incliné léger", "Pectoraux", "REPS", "EXTERNAL", { equipment: "db_pair", default_rest_sec: 90 }),
    planche_lat: exercise("planche_lat", "Planche latérale", "Tronc", "DURATION_SEC", "BODYWEIGHT", { equipment: "bodyweight", default_rest_sec: 60, unilateral: true, legacy_ambiguity: true }),
    abducteurs_machine: exercise("abducteurs_machine", "Abducteurs machine", "Fessiers", "REPS", "MACHINE", { equipment: "machine", default_rest_sec: 90 })
  };

  var ROPE_RECIPE = {
    recipe_id: "rope_4x45_v1",
    recipe_revision: 1,
    name: "Corde 4 × 45 s",
    steps: [
      { step_id: "rope-1", type: "EFFORT", label: "Corde 1/4", duration_sec: 45, interval_index: 1 },
      { step_id: "rope-r1", type: "RECOVERY", label: "Récupération", duration_sec: 30, interval_index: 1 },
      { step_id: "rope-2", type: "EFFORT", label: "Corde 2/4", duration_sec: 45, interval_index: 2 },
      { step_id: "rope-r2", type: "RECOVERY", label: "Récupération", duration_sec: 30, interval_index: 2 },
      { step_id: "rope-3", type: "EFFORT", label: "Corde 3/4", duration_sec: 45, interval_index: 3 },
      { step_id: "rope-r3", type: "RECOVERY", label: "Récupération", duration_sec: 30, interval_index: 3 },
      { step_id: "rope-4", type: "EFFORT", label: "Corde 4/4", duration_sec: 45, interval_index: 4 }
    ]
  };

  var BIKE_RECIPE = {
    recipe_id: "bike_monday_22_v1",
    recipe_revision: 1,
    name: "Vélo fractionné 22 min",
    steps: [
      { step_id: "bike-warm", type: "WARMUP", label: "Mise en route facile", duration_sec: 300 },
      { step_id: "bike-e1", type: "EFFORT", label: "Effort 1/4", duration_sec: 120, interval_index: 1, intensity: "RPE 7–8/10" },
      { step_id: "bike-r1", type: "RECOVERY", label: "Récupération 1", duration_sec: 120, interval_index: 1, intensity: "Facile" },
      { step_id: "bike-e2", type: "EFFORT", label: "Effort 2/4", duration_sec: 120, interval_index: 2, intensity: "RPE 7–8/10" },
      { step_id: "bike-r2", type: "RECOVERY", label: "Récupération 2", duration_sec: 120, interval_index: 2, intensity: "Facile" },
      { step_id: "bike-e3", type: "EFFORT", label: "Effort 3/4", duration_sec: 120, interval_index: 3, intensity: "RPE 7–8/10" },
      { step_id: "bike-r3", type: "RECOVERY", label: "Récupération 3", duration_sec: 120, interval_index: 3, intensity: "Facile" },
      { step_id: "bike-e4", type: "EFFORT", label: "Effort 4/4", duration_sec: 120, interval_index: 4, intensity: "RPE 7–8/10" },
      { step_id: "bike-cool", type: "COOLDOWN", label: "Retour au calme", duration_sec: 180, intensity: "Facile" }
    ]
  };

  function recipeTotal(recipe) {
    return (recipe.steps || []).reduce(function (sum, step) { return sum + Number(step.duration_sec || 0); }, 0);
  }

  function deepClone(value) { return JSON.parse(JSON.stringify(value)); }
  function stableStringify(value) {
    function sortValue(input) {
      if (Array.isArray(input)) return input.map(sortValue);
      if (input && typeof input === "object") {
        var out = {};
        Object.keys(input).sort().forEach(function (key) { out[key] = sortValue(input[key]); });
        return out;
      }
      return input;
    }
    return JSON.stringify(sortValue(value));
  }
  function nowIso() { return new Date().toISOString(); }
  function uid(prefix) {
    if (root.crypto && typeof root.crypto.randomUUID === "function") return prefix + "-" + root.crypto.randomUUID();
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }
  function safeId(value) { return String(value == null ? "unknown" : value).replace(/[^a-zA-Z0-9_-]+/g, "_"); }
  function detId() { return Array.prototype.slice.call(arguments).map(safeId).join("-"); }
  function finiteNumber(value) {
    if (value == null || value === "") return null;
    if (typeof value === "string") {
      var trimmed = value.trim().replace(",", ".");
      if (!/^-?(?:\d+|\d*\.\d+)$/.test(trimmed)) return null;
      value = Number(trimmed);
    }
    return typeof value === "number" && isFinite(value) ? value : null;
  }
  function positiveNumber(value) { var n = finiteNumber(value); return n != null && n > 0 ? n : null; }
  function obs(state, value, provenance, confidence) {
    state = state || "NOT_ENTERED";
    return { state: state, value: state === "VALUE" ? value : null, provenance: provenance || "USER_ENTERED", confidence: confidence || "CONFIRMED" };
  }
  function wrapLegacyObservation(value) {
    return value == null || value === "" ? obs("NOT_ENTERED", null, "LEGACY", "LEGACY_UNVERIFIED") : obs("VALUE", value, "LEGACY", "LEGACY_UNVERIFIED");
  }
  function localDateFromIso(value) {
    if (!value) return null;
    var d = new Date(value);
    if (isNaN(d.getTime())) return String(value).slice(0, 10) || null;
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function profileName(profileId) { return profileId === "moi" ? "Mathieu" : profileId === "pote" ? "Ryan" : String(profileId || ""); }
  function ownerProfileIds(data) {
    return data && Array.isArray(data.profile_ids) && data.profile_ids.length ? data.profile_ids.slice() : ["moi", "pote"];
  }
  function loadUnitLabel(unit) {
    if (unit === "kg_per_hand") return "kg / main";
    if (unit === "kg_single") return "kg";
    if (unit === "machine_display_kg") return "kg machine";
    return unit || "kg";
  }
  function frenchSetRole(role) {
    if (role === "WARMUP_SET") return "Échauffement";
    if (role === "WORK_SET") return "Série de travail";
    return "Série";
  }
  function frenchSide(side) {
    if (side === "LEFT") return "Gauche";
    if (side === "RIGHT") return "Droite";
    if (side === "BILATERAL") return "";
    return "";
  }
  function frenchPhase(phase) {
    return { CALIBRATION: "Calibrage", BASELINE_VALIDATED: "Repère confirmé", PROGRESSION: "Progression" }[phase] || phase;
  }
  function frenchAction(action) {
    return {
      KEEP_LOAD: "Garder la charge",
      ADD_REP: "Ajouter une répétition",
      ADD_LOAD: "Augmenter la charge",
      ADD_SET: "Ajouter une série",
      HARDER_VARIANT: "Variante un peu plus difficile",
      REDUCE_LOAD: "Réduire la charge",
      DELOAD: "Alléger",
      TECHNIQUE_FIRST: "Priorité technique",
      RECALIBRATE: "Reconstruire un repère"
    }[action] || action;
  }
  function frenchBlockKind(kind) {
    return { WARMUP: "Échauffement", ROPE: "Corde", STRENGTH: "Musculation", BIKE_INTERVALS: "Vélo fractionné", COOLDOWN: "Retour au calme" }[kind] || kind;
  }
  function frenchOutcome(outcome) {
    return { COMPLETED: "réalisé", SHORTENED: "raccourci", SKIPPED: "passé", UNKNOWN: "à confirmer", PENDING: "prévu", NOT_PERFORMED: "non fait", PARTIAL: "partiel" }[outcome] || outcome;
  }
  function frenchMode(mode) {
    return mode === "TEST" ? "Essai TEST" : "Entraînement";
  }
  function frenchLifecycle(lifecycle) {
    return { IN_PROGRESS: "en cours", COMPLETED: "terminée", CANCELLED: "annulée", INTERRUPTED: "interrompue", DRAFT: "brouillon", UNKNOWN: "à confirmer" }[lifecycle] || lifecycle;
  }
  function frenchScientificStatus(status) {
    if (!status || status === "KEEP") return "";
    if (status === "TEST_SUBSTITUTION") return "Substitution d’essai";
    if (status === "TEST_COMPLEMENT") return "Complément d’essai";
    if (status === "TEST") return "En essai";
    return "";
  }
  function frenchRestKind(kind) {
    if (kind === "INTER_SIDE") return "Changement de côté";
    if (kind === "INTER_EXERCISE") return "Transition vers l’exercice suivant";
    if (kind === "WARMUP") return "Repos avant l’approche suivante";
    return "Repos avant la prochaine série";
  }
  function intervalStepTypes(recipe) {
    return (recipe && recipe.steps || []).map(function (step) { return step.type; });
  }
  function hasConsecutiveEffort(recipe) {
    var types = intervalStepTypes(recipe);
    for (var i = 1; i < types.length; i++) {
      if (types[i] === "EFFORT" && types[i - 1] === "EFFORT") return true;
    }
    return false;
  }
  function intervalPhaseLabel(step) {
    if (!step) return "Terminé";
    if (step.type === "WARMUP") return step.label || "Mise en route facile";
    if (step.type === "EFFORT") return step.label || "Effort";
    if (step.type === "RECOVERY") return "Facile — récupération";
    if (step.type === "COOLDOWN") return step.label || "Retour au calme";
    return step.label || "Phase";
  }
  function intervalPhaseHint(step) {
    if (!step) return "";
    if (step.type === "EFFORT") return step.intensity || "Effort soutenu";
    if (step.type === "RECOVERY") return "Pédale facile, souffle qui redescend";
    if (step.type === "WARMUP") return "Facile, juste pour démarrer";
    if (step.type === "COOLDOWN") return "Facile, relâchement";
    return step.intensity || "";
  }

  function slot(id, sets, lo, hi, rirMin, rirMax, options) {
    var ex = EXERCISES[id];
    var out = {
      exercise_occurrence_id: id + "-main",
      exercise_id: id,
      variant_id: id + "-standard",
      sets: sets,
      reps_min: ex && ex.result_kind === "DURATION_SEC" ? null : lo,
      reps_max: ex && ex.result_kind === "DURATION_SEC" ? null : hi,
      duration_min_sec: ex && ex.result_kind === "DURATION_SEC" ? lo : null,
      duration_max_sec: ex && ex.result_kind === "DURATION_SEC" ? hi : null,
      rir_target_min: rirMin,
      rir_target_max: rirMax,
      rest_target_sec: ex ? ex.default_rest_sec : 90,
      role: "WORK_SET",
      configuration: {},
      reference_load: null,
      reference_unit: null
    };
    Object.keys(options || {}).forEach(function (key) { out[key] = options[key]; });
    return out;
  }

  function defaultSettings(profileId) {
    return {
      c_variant: "BASE",
      c_complement_preference: "NONE",
      triceps_exercise: "dev_serre",
      legs_variant: "RETURN",
      sound_enabled: true,
      wake_lock_enabled: false,
      profile_id: profileId
    };
  }

  function programSettingsKey(settings) {
    settings = settings || {};
    return [
      settings.c_variant || "BASE",
      settings.c_complement_preference || "NONE",
      settings.triceps_exercise || "dev_serre",
      settings.legs_variant || "RETURN"
    ].map(safeId).join("-").toLowerCase();
  }

  function programRevisionId(profileId, settings) {
    var defaults = defaultSettings(profileId);
    return programSettingsKey(settings) === programSettingsKey(defaults)
      ? "coach-v1.2-" + profileId
      : "coach-v1.2-" + profileId + "-" + programSettingsKey(settings);
  }

  function planFor(profileId, workoutType, settings) {
    settings = Object.assign(defaultSettings(profileId), settings || {});
    var isMe = profileId === "moi";
    var plan = { workout_type: workoutType, session_variant: "NORMAL", display_name: "", occurrences: [], blocks: [], scientific_revision: "audit-2026-09-16-v1.2" };
    if (workoutType === "HAUT_A") {
      plan.display_name = "Haut A";
      plan.occurrences = [
        slot("dev_incline", 3, 8, 12, isMe ? 1 : 2, isMe ? 2 : 3, { reference_load: isMe ? 20 : 23, reference_unit: "kg_per_hand", rest_target_sec: 180 }),
        slot("dev_epaules", 2, 8, 12, 2, isMe ? 2 : 3, { reference_load: isMe ? 14 : 16, reference_unit: "kg_per_hand", rest_target_sec: 150 }),
        slot(isMe ? "pompes_poignees" : "pompes_inclinees", 3, 8, 15, 2, isMe ? 2 : 3, { configuration: { note: isMe ? "Poignées selon confort" : "Hauteur personnelle reproductible" }, rest_target_sec: 120 }),
        slot("elev_lat", 3, 12, 25, isMe ? 1 : 2, 2, { reference_load: isMe ? 4 : 7, reference_unit: "kg_per_hand", rest_target_sec: 90 }),
        slot(isMe ? "copenhagen_dyn" : "copenhagen_iso", isMe ? 2 : 1, isMe ? 6 : 15, isMe ? 10 : 25, null, null, { sets_per_side: true, configuration: { reserve_technique: true }, rest_target_sec: 90 })
      ];
      plan.blocks = ["WARMUP", "ROPE", "STRENGTH", "BIKE_INTERVALS", "COOLDOWN"];
    } else if (workoutType === "HAUT_B") {
      plan.display_name = "Haut B";
      plan.occurrences = [
        slot("traction", 3, isMe ? 6 : 4, isMe ? 10 : 6, isMe ? 1 : 2, isMe ? 2 : 3, { reference_reps: isMe ? null : 5, rest_target_sec: 180 }),
        slot("row_appui", 3, 8, 12, isMe ? 1 : 2, isMe ? 2 : 3, { sets_per_side: true, reference_load: isMe ? 18 : 16, reference_unit: "kg_single", rest_target_sec: 120 }),
        slot("face_pull", 2, 15, 20, 2, 3, { rest_target_sec: 90 }),
        slot("curl_marteau", 3, 10, 15, isMe ? 1 : 2, isMe ? 2 : 3, { rest_target_sec: 90 }),
        slot(isMe ? "planche" : "dead_bug", 2, isMe ? 20 : 6, isMe ? 40 : 10, null, null, { sets_per_side: !isMe, rest_target_sec: 60 })
      ];
      plan.blocks = ["WARMUP", "STRENGTH", "COOLDOWN"];
    } else if (workoutType === "HAUT_C") {
      var requested = settings.c_variant;
      if (requested === "WITH_COMPLEMENT" && ["SHRUG", "REAR_DELT"].indexOf(settings.c_complement_preference) < 0) requested = "BASE";
      plan.session_variant = requested === "SHORT" ? "SHORT" : (requested === "WITH_COMPLEMENT" ? "NORMAL" : "COMPACT");
      plan.display_name = requested === "SHORT" ? "Haut C — Courte 11" : (requested === "WITH_COMPLEMENT" ? "Haut C — Avec complément 15" : "Haut C — Base 13");
      var tri = settings.triceps_exercise === "ext_triceps_overhead" ? "ext_triceps_overhead" : "dev_serre";
      plan.occurrences = [
        slot("dev_plat", 3, 8, 12, isMe ? 1 : 2, isMe ? 2 : 3, { reference_load: isMe ? 20 : 23, reference_unit: "kg_per_hand", rest_target_sec: 180 }),
        slot("traction", 2, isMe ? 6 : 4, isMe ? 10 : 6, 2, isMe ? 2 : 3, { reference_reps: isMe ? null : 5, rest_target_sec: 150 }),
        slot("row_trx", 2, 10, 15, 2, isMe ? 2 : 3, { rest_target_sec: 120 }),
        slot(tri, 2, 10, 15, 2, isMe ? 2 : 3, { rest_target_sec: 120, scientific_status: tri === "ext_triceps_overhead" ? "TEST_SUBSTITUTION" : "KEEP" }),
        slot("elev_lat", 2, 12, 25, isMe ? 1 : 2, 2, { reference_load: isMe ? 4 : 7, reference_unit: "kg_per_hand", rest_target_sec: 90 })
      ];
      if (requested !== "SHORT") plan.occurrences.push(slot("curl_supination", 2, 10, 15, isMe ? 1 : 2, isMe ? 2 : 3, { rest_target_sec: 90 }));
      if (requested === "WITH_COMPLEMENT") {
        var comp = settings.c_complement_preference === "REAR_DELT" ? "oiseau_appui" : "shrugs";
        plan.occurrences.push(slot(comp, 2, comp === "shrugs" ? 10 : 12, comp === "shrugs" ? 15 : 20, 2, 3, { rest_target_sec: comp === "shrugs" ? 120 : 90, scientific_status: "TEST_COMPLEMENT" }));
      }
      plan.blocks = ["WARMUP", "STRENGTH", "COOLDOWN"];
    } else if (workoutType === "LEGS") {
      var v = settings.legs_variant || "RETURN";
      plan.session_variant = v;
      plan.display_name = v === "RETURN" ? "Jambes — Reprise 12 max" : (v === "SHORT" ? "Jambes — Courte 10" : "Jambes — Normale 18");
      if (v === "SHORT") {
        plan.occurrences = [slot("leg_press_h", 3, 8, 12, 2, 3, { rest_target_sec: 180 }), slot("leg_curl_machine", 3, 10, 15, isMe ? 2 : 2, isMe ? 2 : 3, { rest_target_sec: 120 }), slot("glute_drive", 2, isMe ? 8 : 10, isMe ? 12 : 15, 2, 3, { rest_target_sec: 120 }), slot("calf_machine", 2, 10, 20, 2, isMe ? 2 : 3, { rest_target_sec: 120 })];
      } else if (v === "NORMAL") {
        plan.occurrences = [
          slot("leg_press_h", 4, 8, 12, 2, 3, { rest_target_sec: 180 }),
          slot("leg_curl_machine", 4, 10, 15, isMe ? 2 : 2, isMe ? 2 : 3, { rest_target_sec: 120 }),
          slot("glute_drive", 2, isMe ? 8 : 10, isMe ? 12 : 15, 2, 3, { rest_target_sec: 120 }),
          slot("leg_extension", 2, 10, 15, isMe ? 2 : 2, isMe ? 2 : 3, { rest_target_sec: 120 }),
          slot("adducteurs_machine", 1, 12, 20, isMe ? 3 : 3, isMe ? 3 : 4, { conditional: true, rest_target_sec: 90 }),
          slot("calf_machine", 3, 10, 20, isMe ? 2 : 2, isMe ? 2 : 3, { rest_target_sec: 120 }),
          slot("pallof", 2, 8, 12, null, null, { sets_per_side: true, rest_target_sec: 60 })
        ];
      } else {
        plan.occurrences = [
          slot("leg_press_h", 2, 8, 12, 3, 4, { rest_target_sec: 180 }),
          slot("leg_curl_machine", 2, 10, 15, 3, 4, { rest_target_sec: 120 }),
          slot("glute_drive", 2, isMe ? 8 : 10, isMe ? 12 : 15, 3, 4, { rest_target_sec: 120 }),
          slot("leg_extension", 1, 10, 15, 3, 4, { rest_target_sec: 120 }),
          slot("adducteurs_machine", 1, 12, 20, 3, 4, { conditional: true, rest_target_sec: 90 }),
          slot("calf_machine", 2, 10, 20, 3, 4, { rest_target_sec: 120 }),
          slot("pallof", 2, 8, 12, null, null, { sets_per_side: true, rest_target_sec: 60 })
        ];
      }
      plan.blocks = ["WARMUP", "STRENGTH", "COOLDOWN"];
    }
    plan.target_groups = plan.occurrences.reduce(function (sum, item) { return sum + item.sets; }, 0);
    return plan;
  }

  function buildProgramRevision(profileId, settings) {
    return {
      program_revision_id: programRevisionId(profileId, settings),
      profile_id: profileId,
      effective_date: "2026-09-17",
      provenance: "SCIENTIFIC_AUDIT_2026_09_16",
      schedule: [
        { day: "LUNDI", workout_type: "HAUT_A" },
        { day: "MARDI", workout_type: "HAUT_B" },
        { day: "JEUDI_19H", workout_type: "FUTSAL", note: "5 vs 5 · 1 h" },
        { day: "VENDREDI", workout_type: "HAUT_C" },
        { day: "SAMEDI_13H30", workout_type: "LEGS", note: "Une seule séance jambes" }
      ],
      plans: ["HAUT_A", "HAUT_B", "HAUT_C", "LEGS"].map(function (type) { return planFor(profileId, type, settings); })
    };
  }

  function createDataset(options) {
    var id = uid("dataset");
    var settings = { moi: defaultSettings("moi"), pote: defaultSettings("pote") };
    var moiRevision = buildProgramRevision("moi", settings.moi);
    var poteRevision = buildProgramRevision("pote", settings.pote);
    var data = {
      format: FORMAT,
      schemaVersion: SCHEMA_VERSION,
      product_version: PRODUCT_VERSION,
      exported_at: null,
      export_id: null,
      dataset_id: id,
      dataset_revision: 1,
      scope: "FULL",
      profile_ids: ["moi", "pote"],
      profiles: deepClone(PROFILES),
      exercise_catalog: Object.keys(EXERCISES).map(function (id2) { return deepClone(EXERCISES[id2]); }),
      program_revisions: [moiRevision, poteRevision],
      active_program_revision_by_profile: { moi: moiRevision.program_revision_id, pote: poteRevision.program_revision_id },
      profile_settings: settings,
      workouts: [],
      sets: [],
      blocks: [],
      interval_results: [],
      readiness: [],
      body_measurements: [],
      performance_references: [{
        performance_reference_id: "pote-traction-3x5-declared",
        profile_id: "pote",
        exercise_id: "traction",
        value: { sets: 3, reps: 5, text: "3×5" },
        provenance: "USER_DECLARED",
        declared_at: "2026-09-16",
        performed_at: null,
        status: "BASELINE_CANDIDATE"
      }],
      legacy_archives: [],
      legacy_summaries: [],
      migration_report: null,
      courses: { moi: { runs: [] }, pote: { runs: [] } },
      extensions: { corrections: [], import_conflicts: [], last_active_profile: "moi" }
    };
    var only = options && options.profileId;
    if (only === "moi" || only === "pote") return restrictDatasetToProfile(data, only);
    return data;
  }

  function isV2(value) { return !!(value && value.format === FORMAT && value.schemaVersion === SCHEMA_VERSION && Array.isArray(value.workouts) && Array.isArray(value.sets)); }
  function isLegacy(value) { return !!(value && value.v != null && value.programs && value.logs && value.states && Object.prototype.hasOwnProperty.call(value, "course")); }

  async function sha256Text(text) {
    text = String(text);
    try {
      if (root.crypto && root.crypto.subtle && typeof TextEncoder !== "undefined") {
        var digest = await root.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
        return Array.prototype.map.call(new Uint8Array(digest), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
      }
    } catch (ignore) {}
    if (typeof require === "function") {
      try { return require("crypto").createHash("sha256").update(text, "utf8").digest("hex"); } catch (ignore2) {}
    }
    var h = 2166136261;
    for (var i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return "fallback-fnv1a-" + (h >>> 0).toString(16).padStart(8, "0");
  }

  function legacyProgramModels(legacy) {
    var revisions = [];
    ["moi", "pote"].forEach(function (profileId) {
      var source = legacy.programs && legacy.programs[profileId];
      revisions.push({
        program_revision_id: "legacy-program-" + profileId + "-" + safeId(legacy.exported || "unknown"),
        profile_id: profileId,
        effective_date: localDateFromIso(legacy.exported),
        provenance: "LEGACY_IMPORT",
        historical_only: true,
        plans: deepClone(source && source.seances ? source.seances : [])
      });
    });
    return revisions;
  }

  async function migrateLegacy(legacy, rawText) {
    if (!isLegacy(legacy)) throw new Error("FORMAT_LEGACY_NON_RECONNU");
    rawText = rawText == null ? JSON.stringify(legacy) : String(rawText);
    var hash = await sha256Text(rawText);
    var data = createDataset();
    data.legacy_archives.push({
      archive_id: "legacy-" + hash.slice(0, 20),
      source_format: "coach-muscu-legacy-v" + String(legacy.v),
      imported_at: nowIso(),
      exported_at: legacy.exported || null,
      sha256: hash,
      raw_utf8: rawText,
      active_profile_preference: legacy.profile || null
    });
    data.program_revisions = legacyProgramModels(legacy).concat(data.program_revisions);
    data.extensions.last_active_profile = legacy.profile === "pote" ? "pote" : "moi";
    data.courses = deepClone(legacy.course || { moi: { runs: [] }, pote: { runs: [] } });
    ["moi", "pote"].forEach(function (profileId) {
      if (!data.courses[profileId]) data.courses[profileId] = { runs: [] };
      if (!Array.isArray(data.courses[profileId].runs)) {
        var runs = [];
        ["montee", "footing"].forEach(function (kind) { (data.courses[profileId][kind] || []).forEach(function (r) { runs.push(deepClone(r)); }); });
        data.courses[profileId] = { runs: runs };
      }
    });

    var workoutMap = {};
    var summaryCount = 0;
    var detailEntryCount = 0;
    var detailSetCount = 0;
    var aggregateOnlyCount = 0;
    var ambiguityCount = 0;
    ["moi", "pote"].forEach(function (profileId) {
      var byExercise = legacy.logs && legacy.logs[profileId] ? legacy.logs[profileId] : {};
      Object.keys(byExercise).forEach(function (exerciseId) {
        (byExercise[exerciseId] || []).forEach(function (entry, index) {
          var sessionKey = entry.sessionId != null ? String(entry.sessionId) : "ungrouped-" + exerciseId + "-" + index;
          var mapKey = profileId + "|" + sessionKey;
          if (!workoutMap[mapKey]) {
            var wid = detId("legacy-workout", profileId, sessionKey);
            workoutMap[mapKey] = wid;
            data.workouts.push({
              workout_id: wid,
              profile_id: profileId,
              workout_type: entry.seance ? safeId(String(entry.seance).toUpperCase().replace(/\s+/g, "_")) : "UNKNOWN",
              mode: "TRAINING",
              lifecycle: "UNKNOWN",
              session_variant: "LEGACY",
              plan_snapshot: null,
              started_at: null,
              ended_at: null,
              occurred_at: entry.date || null,
              local_date: localDateFromIso(entry.date),
              time_zone: null,
              session_elapsed_sec: null,
              timing_quality: "UNKNOWN",
              strength_outcome: "UNKNOWN",
              block_ids: [],
              adaptations: [],
              comment: "Groupe historique importé",
              revision: 1,
              provenance: "LEGACY",
              legacy_session_id: entry.sessionId == null ? null : entry.sessionId
            });
          }
          var summaryId = detId("legacy-summary", profileId, exerciseId, index);
          var details = Array.isArray(entry.setsDetail) ? entry.setsDetail : [];
          var ambiguity = !!(EXERCISES[exerciseId] && EXERCISES[exerciseId].legacy_ambiguity) || exerciseId === "shrugs" && Number(entry.sets) === 12 || exerciseId === "row_appui" || exerciseId === "pallof";
          if (ambiguity) ambiguityCount++;
          data.legacy_summaries.push({
            legacy_summary_id: summaryId,
            workout_id: workoutMap[mapKey],
            profile_id: profileId,
            exercise_id: exerciseId,
            occurred_at: entry.date || null,
            aggregate: deepClone(entry),
            detail_set_ids: [],
            migrationStatus: ambiguity ? "NEEDS_REVIEW" : "EXACT",
            migrationNote: exerciseId === "shrugs" && Number(entry.sets) === 12 ? "12 séries conservées dans le brut ; correction connue vers 2 prévues, sans série exécutée inventée." : (ambiguity ? "Contexte, unité, variante ou rôle à confirmer." : null),
            dataConfidence: "LEGACY_UNVERIFIED",
            legacy_source_ref: "logs." + profileId + "." + exerciseId + "[" + index + "]"
          });
          summaryCount++;
          if (details.length) detailEntryCount++; else aggregateOnlyCount++;
          details.forEach(function (detail, detailIndex) {
            var setId = detId("legacy-set", profileId, exerciseId, index, detailIndex);
            var ex = EXERCISES[exerciseId];
            var unresolved = !!(ex && ex.legacy_ambiguity);
            var rawResult = detail.reps != null ? detail.reps : (detail.duration_sec != null ? detail.duration_sec : null);
            data.sets.push({
              set_id: setId,
              workout_id: workoutMap[mapKey],
              profile_id: profileId,
              exercise_id: exerciseId,
              variant_id: exerciseId + "-legacy-unresolved",
              configuration_snapshot: null,
              exercise_occurrence_id: exerciseId + "-legacy",
              set_index: detail.set != null ? detail.set : detailIndex + 1,
              set_group_id: detId("legacy-group", profileId, exerciseId, index, detailIndex),
              side: "UNKNOWN",
              role: "UNKNOWN",
              state: "RECORDED",
              load: { mode: ex ? ex.load_mode : "UNKNOWN", value: detail.weight != null ? detail.weight : entry.weight != null ? entry.weight : null, unit: entry.unit || "LEGACY_UNKNOWN", state: detail.weight != null || entry.weight != null ? "VALUE" : "UNKNOWN" },
              result_kind: unresolved ? "LEGACY_UNRESOLVED" : "REPS",
              reps: unresolved ? null : rawResult,
              duration_sec: null,
              legacyValue: rawResult,
              legacyUnit: entry.unit || (ex && ex.result_kind === "DURATION_SEC" ? "AMBIGUOUS_REPS_OR_SECONDS" : "reps"),
              result_source: "LEGACY_DETAIL",
              rir: wrapLegacyObservation(entry.rir),
              pain: wrapLegacyObservation(entry.douleur),
              technique: wrapLegacyObservation(entry.technique),
              started_at: null,
              ended_at: null,
              timing_quality: "UNKNOWN",
              recorded_at: entry.date || null,
              rest_prescription_sec: null,
              actual_rest_sec: null,
              comment: entry.comment || "",
              revision: 1,
              legacy_source_ref: "logs." + profileId + "." + exerciseId + "[" + index + "].setsDetail[" + detailIndex + "]",
              source_summary_id: summaryId
            });
            data.legacy_summaries[data.legacy_summaries.length - 1].detail_set_ids.push(setId);
            detailSetCount++;
          });
        });
      });
      var states = legacy.states && legacy.states[profileId] ? legacy.states[profileId] : {};
      Object.keys(states).forEach(function (dateKey) {
        var s = states[dateKey] || {};
        data.readiness.push({
          readiness_id: detId("legacy-readiness", profileId, dateKey),
          profile_id: profileId,
          local_date: dateKey,
          recorded_at: null,
          sleep_hours: wrapLegacyObservation(s.sommeilH),
          sleep_quality: wrapLegacyObservation(s.sommeilQ),
          energy: wrapLegacyObservation(s.energie),
          fatigue: wrapLegacyObservation(s.fatigue),
          knee_pain: wrapLegacyObservation(s.dGenou),
          shoulder_pain: wrapLegacyObservation(s.dEpaule),
          back_pain: wrapLegacyObservation(s.dDos),
          motivation: wrapLegacyObservation(s.motivation),
          comment: s.comment || "",
          provenance: "LEGACY_UNVERIFIED"
        });
      });
    });
    data.migration_report = {
      source_sha256: hash,
      source_format: "LEGACY",
      migrated_at: nowIso(),
      summary_entries: summaryCount,
      entries_with_set_detail: detailEntryCount,
      detailed_set_observations: detailSetCount,
      aggregate_entries_without_detail: aggregateOnlyCount,
      workout_groups: data.workouts.length,
      readiness_entries: data.readiness.length,
      historical_plan_models: legacyProgramModels(legacy).reduce(function (sum, rev) { return sum + rev.plans.length; }, 0),
      ambiguity_entries: ambiguityCount,
      duplicate_import: false,
      warnings: [
        "Les agrégats sans détail restent des résumés et ne sont pas déroulés en séries.",
        "Les horaires historiques restent inconnus.",
        "Les anciennes réponses de readiness restent LEGACY_UNVERIFIED."
      ]
    };
    validateDataset(data);
    return data;
  }

  function validateDataset(data) {
    if (!isV2(data)) throw new Error("FORMAT_V2_INVALIDE");
    var profileIds = {};
    (data.profiles || []).forEach(function (p) { profileIds[p.profile_id] = true; });
    var workoutIds = {};
    (data.workouts || []).forEach(function (w) {
      if (!profileIds[w.profile_id]) throw new Error("PROFIL_SEANCE_INVALIDE");
      if (workoutIds[w.workout_id]) throw new Error("WORKOUT_ID_DUPLIQUE");
      workoutIds[w.workout_id] = w.profile_id;
    });
    var setIds = {};
    (data.sets || []).forEach(function (s) {
      if (setIds[s.set_id]) throw new Error("SET_ID_DUPLIQUE");
      setIds[s.set_id] = true;
      if (!profileIds[s.profile_id]) throw new Error("PROFIL_SERIE_INVALIDE");
      if (!workoutIds[s.workout_id]) throw new Error("SEANCE_SERIE_MANQUANTE");
      if (workoutIds[s.workout_id] !== s.profile_id) throw new Error("MELANGE_PROFILS");
    });
    var blockIds = {};
    (data.blocks || []).forEach(function (b) {
      if (blockIds[b.block_id]) throw new Error("BLOCK_ID_DUPLIQUE");
      blockIds[b.block_id] = b.profile_id;
      if (!workoutIds[b.workout_id] || workoutIds[b.workout_id] !== b.profile_id) throw new Error("BLOC_ORPHELIN_OU_PROFIL");
      if (b.plan_snapshot && b.plan_snapshot.recipe) {
        var total = recipeTotal(b.plan_snapshot.recipe);
        if (!(total > 0)) throw new Error("RECETTE_INVALIDE");
      }
    });
    var intervalIds = {};
    (data.interval_results || []).forEach(function (result) {
      if (intervalIds[result.interval_result_id]) throw new Error("INTERVAL_RESULT_ID_DUPLIQUE");
      intervalIds[result.interval_result_id] = true;
      if (!blockIds[result.block_id] || blockIds[result.block_id] !== result.profile_id || workoutIds[result.workout_id] !== result.profile_id) throw new Error("RESULTAT_INTERVALLE_ORPHELIN_OU_PROFIL");
    });
    [
      ["readiness", "readiness_id"], ["body_measurements", "measurement_id"], ["performance_references", "performance_reference_id"]
    ].forEach(function (definition) {
      var seen = {};
      (data[definition[0]] || []).forEach(function (record) {
        if (!profileIds[record.profile_id]) throw new Error("OBJET_PROFIL_INVALIDE");
        if (seen[record[definition[1]]]) throw new Error("OBJET_ID_DUPLIQUE");
        seen[record[definition[1]]] = true;
      });
    });
    var summaryIds = {};
    (data.legacy_summaries || []).forEach(function (summary) {
      if (summaryIds[summary.legacy_summary_id]) throw new Error("LEGACY_SUMMARY_ID_DUPLIQUE");
      summaryIds[summary.legacy_summary_id] = true;
      if (!workoutIds[summary.workout_id] || workoutIds[summary.workout_id] !== summary.profile_id) throw new Error("LEGACY_SUMMARY_ORPHELIN_OU_PROFIL");
    });
    return true;
  }

  function refreshPrograms(data) {
    ownerProfileIds(data).forEach(function (profileId) {
      if (!data.profile_settings[profileId]) data.profile_settings[profileId] = defaultSettings(profileId);
      var settings = data.profile_settings[profileId] || defaultSettings(profileId);
      var next = buildProgramRevision(profileId, settings);
      var index = data.program_revisions.findIndex(function (r) { return r.program_revision_id === next.program_revision_id; });
      if (index < 0) data.program_revisions.push(next);
      if (!data.active_program_revision_by_profile) data.active_program_revision_by_profile = {};
      data.active_program_revision_by_profile[profileId] = next.program_revision_id;
    });
  }

  function activeRevision(data, profileId) {
    var id = data.active_program_revision_by_profile[profileId];
    return data.program_revisions.find(function (r) { return r.program_revision_id === id; }) || buildProgramRevision(profileId, data.profile_settings[profileId]);
  }
  function activePlan(data, profileId, workoutType) {
    var rev = activeRevision(data, profileId);
    return rev.plans.find(function (p) { return p.workout_type === workoutType; }) || planFor(profileId, workoutType, data.profile_settings[profileId]);
  }

  function adaptWorkoutPlan(data, workoutId, requestedVariant, reason, atMs) {
    var workout = workoutById(data, workoutId);
    if (!workout || workout.lifecycle !== "IN_PROGRESS") throw new Error("SEANCE_NON_ACTIVE");
    if (workout.active_set_id) throw new Error("TERMINER_SERIE_AVANT_ADAPTATION");
    if (["HAUT_C", "LEGS"].indexOf(workout.workout_type) < 0) throw new Error("ADAPTATION_NON_DISPONIBLE");
    var strength = blocksFor(data, workoutId).find(function (block) { return block.kind === "STRENGTH"; });
    if (strength && strength.run_state === "FINISHED") throw new Error("BLOC_FORCE_DEJA_TERMINE");
    var settings = Object.assign({}, defaultSettings(workout.profile_id), data.profile_settings[workout.profile_id] || {});
    if (workout.workout_type === "HAUT_C") {
      if (["BASE", "WITH_COMPLEMENT", "SHORT"].indexOf(requestedVariant) < 0) throw new Error("VARIANTE_INVALIDE");
      if (requestedVariant === "WITH_COMPLEMENT" && settings.c_complement_preference === "NONE") throw new Error("COMPLEMENT_REQUIS");
      settings.c_variant = requestedVariant;
    } else {
      if (["RETURN", "NORMAL", "SHORT"].indexOf(requestedVariant) < 0) throw new Error("VARIANTE_INVALIDE");
      settings.legs_variant = requestedVariant;
    }
    var next = planFor(workout.profile_id, workout.workout_type, settings);
    if (next.session_variant === workout.session_variant && next.target_groups === workout.plan_snapshot.target_groups) return workout;
    var at = new Date(atMs == null ? Date.now() : atMs).toISOString();
    workout.adaptations.push({
      adaptation_id: uid("adaptation"),
      adapted_at: at,
      reason: reason || "USER_SELECTED",
      from_variant: workout.session_variant,
      to_variant: next.session_variant,
      from_plan_snapshot: deepClone(workout.plan_snapshot),
      to_plan_snapshot: deepClone(next),
      preserved_set_ids: setsFor(data, workoutId).map(function (set) { return set.set_id; })
    });
    workout.plan_snapshot = deepClone(next);
    workout.session_variant = next.session_variant;
    workout.revision = Number(workout.revision || 1) + 1;
    touch(data);
    return workout;
  }

  function createBlocks(workoutId, profileId, plan, mode) {
    return plan.blocks.map(function (kind, index) {
      var recipe = kind === "ROPE" ? ROPE_RECIPE : kind === "BIKE_INTERVALS" ? BIKE_RECIPE : null;
      if (recipe) {
        recipe = deepClone(recipe);
        if (mode === "TEST") {
          recipe.test_compressed = true;
          recipe.steps = recipe.steps.map(function (step) {
            var copy = deepClone(step);
            copy.programmed_duration_sec = copy.duration_sec;
            copy.duration_sec = TEST_INTERVAL_STEP_SEC;
            return copy;
          });
        }
      }
      return {
        block_id: workoutId + "-block-" + (index + 1) + "-" + kind.toLowerCase(),
        workout_id: workoutId,
        profile_id: profileId,
        kind: kind,
        order: index + 1,
        optional: kind === "COOLDOWN" || kind === "ROPE" || kind === "BIKE_INTERVALS",
        plan_snapshot: recipe ? { recipe: recipe, total_sec: recipeTotal(recipe), original_total_sec: kind === "ROPE" ? 270 : kind === "BIKE_INTERVALS" ? 1320 : recipeTotal(recipe) } : {},
        run_state: "PLANNED",
        outcome: "PENDING",
        started_at: null,
        ended_at: null,
        marked_at: null,
        timing_quality: "UNKNOWN",
        pauses: [],
        confirmation_state: "NOT_ENTERED",
        timer_state: null
      };
    });
  }

  function observationFromInput(state, value) {
    if (state === "UNKNOWN") return obs("UNKNOWN", null, "USER_ENTERED", "CONFIRMED");
    if (state !== "VALUE") return obs("NOT_ENTERED", null, "USER_ENTERED", "CONFIRMED");
    var n = finiteNumber(value);
    return n == null ? obs("NOT_ENTERED", null, "USER_ENTERED", "CONFIRMED") : obs("VALUE", n, "USER_ENTERED", "CONFIRMED");
  }

  function startWorkout(data, profileId, workoutType, mode, readinessValues, atMs) {
    if (activeWorkout(data, profileId)) throw new Error("SEANCE_DEJA_ACTIVE");
    refreshPrograms(data);
    var plan = deepClone(activePlan(data, profileId, workoutType));
    var workoutId = uid("workout");
    var at = atMs == null ? Date.now() : atMs;
    var startedIso = new Date(at).toISOString();
    var workout = {
      workout_id: workoutId,
      profile_id: profileId,
      workout_type: workoutType,
      mode: mode === "TEST" ? "TEST" : "TRAINING",
      lifecycle: "IN_PROGRESS",
      session_variant: plan.session_variant,
      plan_snapshot: plan,
      program_revision_id: activeRevision(data, profileId).program_revision_id,
      started_at: startedIso,
      ended_at: null,
      occurred_at: startedIso,
      local_date: localDateFromIso(startedIso),
      time_zone: typeof Intl !== "undefined" && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone || null : null,
      session_elapsed_sec: null,
      timing_quality: "CAPTURED",
      strength_outcome: "UNKNOWN",
      block_ids: [],
      adaptations: [],
      comment: "",
      revision: 1,
      provenance: "NATIVE",
      active_set_id: null,
      active_rest: null,
      rest_intervals: []
    };
    var blocks = createBlocks(workoutId, profileId, plan, workout.mode);
    workout.block_ids = blocks.map(function (b) { return b.block_id; });
    data.workouts.push(workout);
    Array.prototype.push.apply(data.blocks, blocks);
    if (readinessValues) {
      data.readiness.push({
        readiness_id: uid("readiness"), profile_id: profileId, workout_id: workoutId,
        local_date: workout.local_date, recorded_at: startedIso,
        sleep_hours: readinessValues.sleep_hours || obs("NOT_ENTERED"),
        sleep_quality: readinessValues.sleep_quality || obs("NOT_ENTERED"),
        energy: readinessValues.energy || obs("NOT_ENTERED"),
        fatigue: readinessValues.fatigue || obs("NOT_ENTERED"),
        knee_pain: readinessValues.knee_pain || obs("NOT_ENTERED"),
        shoulder_pain: readinessValues.shoulder_pain || obs("NOT_ENTERED"),
        back_pain: readinessValues.back_pain || obs("NOT_ENTERED"),
        motivation: readinessValues.motivation || obs("NOT_ENTERED"),
        comment: readinessValues.comment || "", provenance: "NATIVE"
      });
    }
    touch(data);
    return workout;
  }

  function activeWorkout(data, profileId) {
    for (var i = data.workouts.length - 1; i >= 0; i--) {
      var w = data.workouts[i];
      if (w.profile_id === profileId && w.lifecycle === "IN_PROGRESS") return w;
    }
    return null;
  }
  function workoutById(data, id) { return data.workouts.find(function (w) { return w.workout_id === id; }) || null; }
  function blockById(data, id) { return data.blocks.find(function (b) { return b.block_id === id; }) || null; }
  function blocksFor(data, workoutId) { return data.blocks.filter(function (b) { return b.workout_id === workoutId; }).sort(function (a, b) { return a.order - b.order; }); }
  function setsFor(data, workoutId) { return data.sets.filter(function (s) { return s.workout_id === workoutId; }); }

  function plannedSetSlots(plan) {
    var out = [];
    plan.occurrences.forEach(function (occurrence) {
      for (var group = 1; group <= occurrence.sets; group++) {
        if (occurrence.sets_per_side || (EXERCISES[occurrence.exercise_id] && EXERCISES[occurrence.exercise_id].unilateral && occurrence.sets_per_side !== false)) {
          ["LEFT", "RIGHT"].forEach(function (side) { out.push({ occurrence: occurrence, group: group, side: side, key: occurrence.exercise_occurrence_id + "|" + group + "|" + side }); });
        } else out.push({ occurrence: occurrence, group: group, side: "BILATERAL", key: occurrence.exercise_occurrence_id + "|" + group + "|BILATERAL" });
      }
    });
    return out;
  }

  function setMatchesPlannedSlot(set, slot) {
    if (!set || set.role !== "WORK_SET" || set.state !== "RECORDED") return false;
    if (set.exercise_occurrence_id !== slot.occurrence.exercise_occurrence_id || set.side !== slot.side) return false;
    var expectedSuffix = "-" + slot.occurrence.exercise_occurrence_id + "-group-" + slot.group;
    return set.group_index === slot.group || String(set.set_group_id || "").slice(-expectedSuffix.length) === expectedSuffix;
  }

  function completedPlannedSlots(data, workout) {
    var sets = setsFor(data, workout.workout_id);
    return plannedSetSlots(workout.plan_snapshot).filter(function (slot) {
      return sets.some(function (set) { return setMatchesPlannedSlot(set, slot); });
    });
  }

  function logicalGroupSummary(sets) {
    var groups = {};
    (sets || []).filter(function (set) { return set.role === "WORK_SET" && set.state === "RECORDED"; }).forEach(function (set) {
      var key = set.set_group_id || set.set_id;
      if (!groups[key]) groups[key] = [];
      groups[key].push(set);
    });
    var complete = 0, partial = 0;
    Object.keys(groups).forEach(function (key) {
      var observations = groups[key], ex = EXERCISES[observations[0].exercise_id] || {};
      if (!ex.unilateral || observations.some(function (set) { return set.side === "BILATERAL" || set.side === "NOT_APPLICABLE"; })) complete++;
      else {
        var sides = {};
        observations.forEach(function (set) { sides[set.side] = true; });
        if (sides.LEFT && sides.RIGHT) complete++; else partial++;
      }
    });
    return { complete_groups: complete, partial_groups: partial, recorded_observations: (sets || []).filter(function (set) { return set.role === "WORK_SET" && set.state === "RECORDED"; }).length };
  }

  function setContextKey(set) { return [set.profile_id, set.workout_id, set.exercise_id, set.variant_id, set.exercise_occurrence_id, set.side].join("|"); }

  function startSet(data, workoutId, occurrence, setIndex, groupIndex, side, role, atMs) {
    var workout = workoutById(data, workoutId);
    if (!workout || workout.lifecycle !== "IN_PROGRESS") throw new Error("SEANCE_NON_ACTIVE");
    if (workout.active_set_id) {
      var already = data.sets.find(function (s) { return s.set_id === workout.active_set_id; });
      if (already && already.state === "IN_PROGRESS") return already;
      workout.active_set_id = null;
    }
    var at = atMs == null ? Date.now() : atMs;
    var setId = uid("set");
    var set = {
      set_id: setId, workout_id: workoutId, profile_id: workout.profile_id,
      exercise_id: occurrence.exercise_id, variant_id: occurrence.variant_id,
      configuration_snapshot: deepClone(occurrence.configuration || {}),
      exercise_occurrence_id: occurrence.exercise_occurrence_id,
      set_index: setIndex, group_index: groupIndex, set_group_id: workoutId + "-" + occurrence.exercise_occurrence_id + "-group-" + groupIndex,
      side: side || "BILATERAL", role: role || "WORK_SET", state: "IN_PROGRESS",
      load: { mode: EXERCISES[occurrence.exercise_id].load_mode, value: null, unit: null, state: "NOT_ENTERED" },
      result_kind: EXERCISES[occurrence.exercise_id].result_kind,
      reps: null, duration_sec: null, result_source: "UNKNOWN",
      rir: obs("NOT_ENTERED"), pain: obs("NOT_ENTERED"), technique: obs("NOT_ENTERED"),
      started_at: new Date(at).toISOString(), ended_at: null, timing_quality: "CAPTURED", recorded_at: null,
      rest_prescription_sec: occurrence.rest_target_sec || EXERCISES[occurrence.exercise_id].default_rest_sec,
      actual_rest_sec: null, actual_rest_quality: "UNKNOWN", comment: "", revision: 1, legacy_source_ref: null
    };
    var previousComparable = null;
    for (var p = data.sets.length - 1; p >= 0; p--) {
      var candidate = data.sets[p];
      if (candidate.workout_id === workoutId && candidate.ended_at && candidate.role === set.role && setContextKey(candidate) === setContextKey(set)) { previousComparable = candidate; break; }
    }
    if (previousComparable) {
      var restSec = Math.round((at - new Date(previousComparable.ended_at).getTime()) / 1000);
      var between = data.sets.filter(function (candidate2) {
        if (candidate2.workout_id !== workoutId || candidate2.set_id === previousComparable.set_id || !candidate2.started_at) return false;
        var t = new Date(candidate2.started_at).getTime();
        return t > new Date(previousComparable.ended_at).getTime() && t < at;
      });
      var otherExerciseBetween = between.some(function (candidate3) { return candidate3.exercise_id !== set.exercise_id || candidate3.variant_id !== set.variant_id; });
      var interval = {
        rest_id: uid("rest"), from_set_id: previousComparable.set_id, to_set_id: setId,
        started_at: previousComparable.ended_at, ended_at: set.started_at,
        target_initial_sec: previousComparable.rest_prescription_sec,
        target_adjusted_sec: previousComparable.rest_prescription_sec,
        scope_key: setContextKey(set), actual_rest_sec: null, quality: "UNKNOWN", reason: null
      };
      if (restSec < 0) { interval.quality = "CLOCK_ANOMALY"; interval.reason = "NEGATIVE_INTERVAL"; }
      else {
        interval.actual_rest_sec = restSec;
        interval.quality = otherExerciseBetween ? "CAPTURED_INTERLEAVED_EXCLUDED" : (between.length ? "CAPTURED_LOCAL_WITH_OTHER_SIDE" : "CAPTURED");
        interval.reason = otherExerciseBetween ? "OTHER_EXERCISE_INTERLEAVED" : (between.length ? "OTHER_SIDE_INTERLEAVED" : null);
        set.actual_rest_sec = restSec;
        set.actual_rest_quality = workout.mode === "TEST" ? "TEST_NOT_PERFORMANCE" : interval.quality;
      }
      workout.rest_intervals.push(interval);
    }
    workout.active_rest = null;
    data.sets.push(set);
    workout.active_set_id = setId;
    touch(data);
    return set;
  }

  function restKindAfterEndingSet(data, set) {
    if (!set) return "INTER_SET";
    if (set.role === "WARMUP_SET") return "WARMUP";
    var workout = workoutById(data, set.workout_id);
    if (!workout || !workout.plan_snapshot) return "INTER_SET";
    var occurrence = (workout.plan_snapshot.occurrences || []).find(function (item) { return item.exercise_occurrence_id === set.exercise_occurrence_id; });
    if (!occurrence) return "INTER_SET";
    if (occurrence.sets_per_side && (set.side === "LEFT" || set.side === "RIGHT")) {
      var otherSide = set.side === "LEFT" ? "RIGHT" : "LEFT";
      var otherDone = data.sets.some(function (candidate) {
        return candidate.workout_id === set.workout_id
          && candidate.exercise_occurrence_id === set.exercise_occurrence_id
          && String(candidate.group_index) === String(set.group_index)
          && candidate.side === otherSide
          && candidate.role === "WORK_SET"
          && candidate.state !== "CANCELLED"
          && (candidate.state === "RECORDED" || candidate.state === "ENDED_PENDING_RESULT" || candidate.state === "IN_PROGRESS");
      });
      if (!otherDone) return "INTER_SIDE";
    }
    var lastGroup = Number(occurrence.sets) || 1;
    var groupIndex = Number(set.group_index) || 1;
    if (groupIndex < lastGroup) return "INTER_SET";
    return "INTER_EXERCISE";
  }

  function restTargetForKind(workout, set, kind) {
    var testMode = workout && workout.mode === "TEST";
    var prescription = set.rest_prescription_sec || 90;
    if (kind === "INTER_SIDE" || kind === "WARMUP") return testMode ? 3 : 0;
    return testMode ? TEST_REST_SEC : prescription;
  }

  function endSet(data, setId, atMs) {
    var set = data.sets.find(function (s) { return s.set_id === setId; });
    if (!set) throw new Error("SERIE_INTROUVABLE");
    if (set.state === "ENDED_PENDING_RESULT" || set.state === "RECORDED") return set;
    if (set.state !== "IN_PROGRESS") throw new Error("SERIE_NON_ACTIVE");
    var at = atMs == null ? Date.now() : atMs;
    set.ended_at = new Date(at).toISOString();
    set.state = "ENDED_PENDING_RESULT";
    var workout = workoutById(data, set.workout_id);
    if (workout) {
      workout.active_set_id = null;
      var kind = restKindAfterEndingSet(data, set);
      var target = restTargetForKind(workout, set, kind);
      workout.active_rest = {
        rest_id: uid("rest"),
        from_set_id: setId,
        scope_key: setContextKey(set),
        started_at: set.ended_at,
        kind: kind,
        target_initial_sec: set.rest_prescription_sec,
        target_adjusted_sec: target,
        test_shortened: workout.mode === "TEST"
      };
    }
    touch(data);
    return set;
  }

  function addRestTime(data, workoutId, seconds) {
    var workout = workoutById(data, workoutId);
    if (!workout || !workout.active_rest) return null;
    workout.active_rest.target_adjusted_sec += seconds;
    touch(data);
    return workout.active_rest;
  }

  function recordSet(data, setId, result, atMs) {
    var set = data.sets.find(function (s) { return s.set_id === setId; });
    if (!set) throw new Error("SERIE_INTROUVABLE");
    if (set.state === "RECORDED" && result && result.idempotency_key && set.idempotency_key === result.idempotency_key) return set;
    if (set.state === "RECORDED") {
      if (!set.corrections) set.corrections = [];
      set.corrections.push({
        corrected_at: new Date(atMs == null ? Date.now() : atMs).toISOString(),
        previous: { reps: set.reps, duration_sec: set.duration_sec, load: deepClone(set.load), configuration_snapshot: deepClone(set.configuration_snapshot), rir: deepClone(set.rir), pain: deepClone(set.pain), technique: deepClone(set.technique), comment: set.comment, recorded_at: set.recorded_at }
      });
      set.revision = Number(set.revision || 1) + 1;
    }
    var ex = EXERCISES[set.exercise_id] || {};
    if (!set.configuration_snapshot || typeof set.configuration_snapshot !== "object") set.configuration_snapshot = {};
    if (result && Object.prototype.hasOwnProperty.call(result, "configuration_note")) {
      var configurationNote = String(result.configuration_note || "").trim();
      if (configurationNote) set.configuration_snapshot.user_note = configurationNote;
      else delete set.configuration_snapshot.user_note;
    }
    var value = positiveNumber(result && result.value);
    if (value == null && !(result && result.result_unknown)) throw new Error("RESULTAT_REQUIS");
    set.result_kind = result && result.result_unknown ? ex.result_kind || set.result_kind : set.result_kind;
    if (result && result.result_unknown) {
      set.reps = null; set.duration_sec = null; set.result_source = "UNKNOWN";
    } else if (set.result_kind === "DURATION_SEC") {
      set.duration_sec = Math.round(value); set.reps = null; set.result_source = result.result_source || "USER_ENTERED";
    } else {
      set.reps = Math.round(value); set.duration_sec = null; set.result_source = result.result_source || "USER_ENTERED";
    }
    var loadValue = ex.load_mode === "BAND" ? null : positiveNumber(result && result.load_value);
    set.load = {
      mode: ex.load_mode || "NONE",
      value: loadValue,
      unit: result && result.load_unit ? result.load_unit : (ex.equipment === "db_pair" || ex.equipment === "small_db" ? "kg_per_hand" : ex.equipment === "db_single" ? "kg_single" : ex.equipment === "machine" ? "machine_display_kg" : null),
      state: loadValue != null ? "VALUE" : (["BODYWEIGHT", "TRX", "BAND"].indexOf(ex.load_mode) >= 0 ? "NOT_APPLICABLE" : "NOT_ENTERED")
    };
    set.rir = result && result.rir ? result.rir : obs("NOT_ENTERED");
    set.pain = result && result.pain ? result.pain : obs("NOT_ENTERED");
    set.technique = result && result.technique ? result.technique : obs("NOT_ENTERED");
    set.comment = result && result.comment ? String(result.comment) : "";
    set.recorded_at = new Date(atMs == null ? Date.now() : atMs).toISOString();
    set.state = "RECORDED";
    set.idempotency_key = result && result.idempotency_key ? result.idempotency_key : null;
    touch(data);
    return set;
  }

  function addUnmeasuredSet(data, workoutId, occurrence, setIndex, groupIndex, side, role, result, atMs) {
    var at = atMs == null ? Date.now() : atMs;
    var set = startSet(data, workoutId, occurrence, setIndex, groupIndex, side, role, at);
    set.started_at = null;
    set.ended_at = null;
    set.timing_quality = "UNKNOWN";
    set.state = "ENDED_PENDING_RESULT";
    var workout = workoutById(data, workoutId);
    if (workout) { workout.active_set_id = null; workout.active_rest = null; }
    return recordSet(data, set.set_id, result, at);
  }

  function completeSimpleBlock(data, blockId, outcome, atMs) {
    var block = blockById(data, blockId);
    if (!block) throw new Error("BLOC_INTROUVABLE");
    var at = atMs == null ? Date.now() : atMs;
    if (!block.started_at && outcome !== "SKIPPED") {
      block.marked_at = new Date(at).toISOString();
      block.timing_quality = "UNKNOWN";
      block.ended_at = null;
    } else {
      block.ended_at = new Date(at).toISOString();
      block.timing_quality = outcome === "SKIPPED" ? "NOT_APPLICABLE" : "CAPTURED";
    }
    block.run_state = "FINISHED";
    block.outcome = outcome || "COMPLETED";
    block.confirmation_state = "VALUE";
    touch(data);
    return block;
  }

  function beginIntervalBlock(data, blockId, atMs) {
    var block = blockById(data, blockId);
    if (!block || !block.plan_snapshot || !block.plan_snapshot.recipe) throw new Error("BLOC_INTERVALLE_INVALIDE");
    if (block.run_state === "IN_PROGRESS") return block;
    var at = atMs == null ? Date.now() : atMs;
    if (!block.started_at) block.started_at = new Date(at).toISOString();
    block.timing_quality = "CAPTURED";
    block.run_state = "IN_PROGRESS";
    block.outcome = "PENDING";
    if (!block.timer_state) block.timer_state = { step_index: 0, step_elapsed_sec: 0, guided_elapsed_sec: 0, anchor_at_ms: at, paused: false, finished: false, needs_confirmation: false, skipped_step_ids: [], step_results: [] };
    else { block.timer_state.anchor_at_ms = at; block.timer_state.paused = false; }
    touch(data);
    return block;
  }

  function advanceIntervalState(timer, recipe, atMs) {
    if (!timer || timer.paused || timer.finished || timer.anchor_at_ms == null) return timer;
    var rawDelta = Math.floor((atMs - timer.anchor_at_ms) / 1000);
    if (rawDelta < 0) { timer.clock_anomaly = true; timer.needs_confirmation = true; return timer; }
    var delta = rawDelta;
    if (!delta) return timer;
    timer.anchor_at_ms += delta * 1000;
    while (delta > 0 && timer.step_index < recipe.steps.length) {
      var step = recipe.steps[timer.step_index];
      var remaining = step.duration_sec - timer.step_elapsed_sec;
      var used = Math.min(remaining, delta);
      timer.step_elapsed_sec += used;
      timer.guided_elapsed_sec += used;
      delta -= used;
      if (timer.step_elapsed_sec >= step.duration_sec) {
        if (!timer.step_results.some(function (r) { return r.step_id === step.step_id; })) {
          timer.step_results.push({ step_id: step.step_id, programmed_duration_sec: step.duration_sec, timer_duration_sec: step.duration_sec, performed_duration_sec: null, confirmation_state: "NOT_ENTERED", status: "GUIDED_FINISHED" });
        }
        timer.step_index++;
        timer.step_elapsed_sec = 0;
      }
    }
    if (timer.step_index >= recipe.steps.length) { timer.finished = true; timer.anchor_at_ms = null; }
    return timer;
  }

  function syncIntervalBlock(data, blockId, atMs, persist) {
    var block = blockById(data, blockId);
    if (!block || !block.timer_state) return block;
    advanceIntervalState(block.timer_state, block.plan_snapshot.recipe, atMs == null ? Date.now() : atMs);
    if (block.timer_state.finished) block.run_state = "FINISHED";
    if (persist) touch(data);
    return block;
  }

  function pauseIntervalBlock(data, blockId, atMs) {
    var block = syncIntervalBlock(data, blockId, atMs, false);
    if (!block || !block.timer_state) return null;
    block.timer_state.paused = true;
    block.timer_state.anchor_at_ms = null;
    block.run_state = "PAUSED";
    block.pauses.push({ started_at: new Date(atMs == null ? Date.now() : atMs).toISOString(), ended_at: null });
    touch(data);
    return block;
  }

  function resumeIntervalBlock(data, blockId, atMs) {
    var block = blockById(data, blockId);
    if (!block || !block.timer_state) return null;
    var at = atMs == null ? Date.now() : atMs;
    var pause = block.pauses[block.pauses.length - 1];
    if (pause && !pause.ended_at) pause.ended_at = new Date(at).toISOString();
    block.timer_state.paused = false;
    block.timer_state.anchor_at_ms = at;
    block.run_state = "IN_PROGRESS";
    touch(data);
    return block;
  }

  function skipIntervalStep(data, blockId, atMs) {
    var block = syncIntervalBlock(data, blockId, atMs, false);
    if (!block || !block.timer_state || block.timer_state.finished) return block;
    var recipe = block.plan_snapshot.recipe;
    var timer = block.timer_state;
    var step = recipe.steps[timer.step_index];
    timer.skipped_step_ids.push(step.step_id);
    timer.step_results.push({ step_id: step.step_id, programmed_duration_sec: step.duration_sec, timer_duration_sec: timer.step_elapsed_sec, performed_duration_sec: 0, confirmation_state: "VALUE", status: "SKIPPED" });
    timer.step_index++;
    timer.step_elapsed_sec = 0;
    timer.anchor_at_ms = atMs == null ? Date.now() : atMs;
    if (timer.step_index >= recipe.steps.length) { timer.finished = true; timer.anchor_at_ms = null; block.run_state = "FINISHED"; }
    touch(data);
    return block;
  }

  function finishIntervalBlock(data, blockId, confirmation, atMs) {
    var at = atMs == null ? Date.now() : atMs;
    var block = syncIntervalBlock(data, blockId, at, false);
    if (!block || !block.timer_state) throw new Error("BLOC_NON_DEMARRE");
    var timer = block.timer_state;
    if (timer.step_index < block.plan_snapshot.recipe.steps.length && timer.step_elapsed_sec > 0) {
      var step = block.plan_snapshot.recipe.steps[timer.step_index];
      var existing = timer.step_results.find(function (r) { return r.step_id === step.step_id; });
      if (!existing) timer.step_results.push({ step_id: step.step_id, programmed_duration_sec: step.duration_sec, timer_duration_sec: timer.step_elapsed_sec, performed_duration_sec: null, confirmation_state: "NOT_ENTERED", status: "GUIDED_PARTIAL" });
    }
    if (confirmation === "CONFIRMED") {
      timer.step_results.forEach(function (r) { if (r.confirmation_state === "NOT_ENTERED") { r.confirmation_state = "VALUE"; r.performed_duration_sec = r.timer_duration_sec; r.status = r.timer_duration_sec >= r.programmed_duration_sec ? "COMPLETED" : "SHORTENED"; } });
      block.confirmation_state = "VALUE";
    } else block.confirmation_state = confirmation === "UNKNOWN" ? "UNKNOWN" : "NOT_ENTERED";
    timer.paused = true;
    timer.anchor_at_ms = null;
    timer.finished = true;
    block.run_state = "FINISHED";
    block.ended_at = new Date(at).toISOString();
    var confirmed = timer.step_results.reduce(function (sum, r) { return sum + (r.confirmation_state === "VALUE" ? Number(r.performed_duration_sec || 0) : 0); }, 0);
    var total = recipeTotal(block.plan_snapshot.recipe);
    block.outcome = block.confirmation_state !== "VALUE" ? "UNKNOWN" : (confirmed >= total ? "COMPLETED" : "SHORTENED");
    timer.step_results.forEach(function (r) {
      var existingResult = data.interval_results.find(function (x) { return x.block_id === block.block_id && x.step_id === r.step_id; });
      if (!existingResult) data.interval_results.push(Object.assign({ interval_result_id: block.block_id + "-" + r.step_id, block_id: block.block_id, workout_id: block.workout_id, profile_id: block.profile_id }, deepClone(r)));
    });
    touch(data);
    return block;
  }

  function finishWorkout(data, workoutId, lifecycle, atMs) {
    var workout = workoutById(data, workoutId);
    if (!workout) throw new Error("SEANCE_INTROUVABLE");
    var at = atMs == null ? Date.now() : atMs;
    if (workout.active_set_id) {
      var active = data.sets.find(function (s) { return s.set_id === workout.active_set_id; });
      if (active && active.state === "IN_PROGRESS") { active.state = "CANCELLED"; active.ended_at = new Date(at).toISOString(); }
      workout.active_set_id = null;
    }
    var cancelling = lifecycle === "CANCELLED";
    blocksFor(data, workoutId).forEach(function (block) {
      if (block.run_state === "PLANNED") { block.run_state = "FINISHED"; block.outcome = cancelling ? "UNKNOWN" : "SKIPPED"; block.ended_at = new Date(at).toISOString(); block.confirmation_state = cancelling ? "UNKNOWN" : "VALUE"; }
      else if (block.run_state === "FINISHED" && block.outcome === "PENDING" && block.plan_snapshot && block.plan_snapshot.recipe) {
        finishIntervalBlock(data, block.block_id, "UNKNOWN", at);
      }
      else if (block.run_state === "IN_PROGRESS" || block.run_state === "PAUSED") {
        if (block.plan_snapshot && block.plan_snapshot.recipe) finishIntervalBlock(data, block.block_id, "UNKNOWN", at);
        else { block.run_state = "FINISHED"; block.outcome = "SHORTENED"; block.ended_at = new Date(at).toISOString(); }
      }
    });
    workout.ended_at = new Date(at).toISOString();
    workout.lifecycle = lifecycle === "CANCELLED" ? "CANCELLED" : lifecycle === "INTERRUPTED" ? "INTERRUPTED" : "COMPLETED";
    var elapsed = Math.round((at - new Date(workout.started_at).getTime()) / 1000);
    if (elapsed < 0) { workout.session_elapsed_sec = null; workout.timing_quality = "CLOCK_ANOMALY"; }
    else workout.session_elapsed_sec = elapsed;
    var planned = plannedSetSlots(workout.plan_snapshot).length;
    var recordedAll = setsFor(data, workoutId).filter(function (s) { return s.role === "WORK_SET" && s.state === "RECORDED"; }).length;
    var completed = completedPlannedSlots(data, workout).length;
    workout.strength_outcome = recordedAll === 0 ? "NOT_PERFORMED" : completed >= planned ? "COMPLETED" : "PARTIAL";
    workout.active_rest = null;
    touch(data);
    return workout;
  }

  function sessionElapsed(workout, atMs) {
    if (!workout || !workout.started_at) return null;
    var end = workout.ended_at ? new Date(workout.ended_at).getTime() : (atMs == null ? Date.now() : atMs);
    var start = new Date(workout.started_at).getTime();
    if (!isFinite(end) || !isFinite(start) || end < start) return null;
    return Math.floor((end - start) / 1000);
  }

  function variation(values) {
    if (!values || values.length < 2) return { variationPct: null, dropOffPct: null };
    var first = finiteNumber(values[0]);
    var last = finiteNumber(values[values.length - 1]);
    if (first == null || last == null || first <= 0) return { variationPct: null, dropOffPct: null };
    var signed = 100 * (last - first) / first;
    return { variationPct: signed, dropOffPct: Math.max(0, -signed) };
  }

  function nextStep(steps, current) {
    current = finiteNumber(current);
    if (current == null) return null;
    for (var i = 0; i < steps.length; i++) if (steps[i] > current) return steps[i];
    return null;
  }

  function comparableExposureGroups(data, profileId, occurrence, workoutType) {
    var workouts = {};
    data.workouts.forEach(function (w) {
      if (w.profile_id === profileId && w.workout_type === workoutType && w.lifecycle === "COMPLETED" && w.mode === "TRAINING" && w.provenance === "NATIVE") workouts[w.workout_id] = w;
    });
    var groups = {};
    data.sets.forEach(function (s) {
      if (!workouts[s.workout_id] || s.exercise_id !== occurrence.exercise_id || s.variant_id !== occurrence.variant_id || s.role !== "WORK_SET" || s.state !== "RECORDED") return;
      if (!groups[s.workout_id]) groups[s.workout_id] = [];
      groups[s.workout_id].push(s);
    });
    return Object.keys(groups).sort(function (a, b) { return new Date(workouts[a].started_at) - new Date(workouts[b].started_at); }).map(function (id) { return { workout: workouts[id], sets: groups[id] }; });
  }

  function exposureConfigurationKey(exposure) {
    var keys = Array.from(new Set((exposure.sets || []).map(function (set) { return stableStringify(set.configuration_snapshot || {}); })));
    return keys.length === 1 ? keys[0] : "MIXED:" + keys.sort().join("|");
  }

  function progressionRecommendation(data, profileId, occurrence, workoutType) {
    var exposures = comparableExposureGroups(data, profileId, occurrence, workoutType);
    var ex = EXERCISES[occurrence.exercise_id];
    if (!exposures.length) return { phase: "CALIBRATION", action: "KEEP_LOAD", reason_codes: ["NO_NATIVE_EXPOSURE"], text: "Calibrage : réalise et renseigne les vraies séries avant toute hausse.", missing: ["performance"] };
    var latest = exposures[exposures.length - 1];
    if (exposures.length >= 2 && ["BAND", "TRX", "MACHINE"].indexOf(ex.load_mode) >= 0) {
      var previous = exposures[exposures.length - 2];
      if (exposureConfigurationKey(previous) !== exposureConfigurationKey(latest)) {
        return { phase: "CALIBRATION", action: "RECALIBRATE", reason_codes: ["CONFIGURATION_CHANGED"], text: "Réglage ou matériel différent : garde ce contexte séparé et reconstruis un repère avant de progresser.", evidence_set_ids: latest.sets.map(function (s) { return s.set_id; }) };
      }
    }
    var painHigh = latest.sets.some(function (s) { return s.pain && s.pain.state === "VALUE" && Number(s.pain.value) >= 3; });
    var techniqueBad = latest.sets.some(function (s) { return s.technique && s.technique.state === "VALUE" && ["dégradée", "sale", "degradee"].indexOf(String(s.technique.value).toLowerCase()) >= 0; });
    if (painHigh || techniqueBad) return { phase: exposures.length >= 2 ? "BASELINE_VALIDATED" : "CALIBRATION", action: "TECHNIQUE_FIRST", reason_codes: [painHigh ? "PAIN" : "TECHNIQUE"], text: "Priorité technique/tolérance : ne monte pas la charge pour l’instant.", evidence_set_ids: latest.sets.map(function (s) { return s.set_id; }) };
    if (exposures.length < 2) return { phase: "CALIBRATION", action: "KEEP_LOAD", reason_codes: ["ONE_EXPOSURE_ONLY"], text: "Repère candidat : confirme-le sur une deuxième exposition comparable.", evidence_set_ids: latest.sets.map(function (s) { return s.set_id; }) };
    var values = latest.sets.map(function (s) { return s.result_kind === "DURATION_SEC" ? s.duration_sec : s.reps; }).filter(function (v) { return v != null; });
    if (!values.length) return { phase: "BASELINE_VALIDATED", action: "KEEP_LOAD", reason_codes: ["MISSING_RESULT"], text: "Résultats insuffisants : garde la difficulté et renseigne le réalisé.", missing: ["result"] };
    var min = Math.min.apply(null, values);
    var maxTarget = occurrence.reps_max != null ? occurrence.reps_max : occurrence.duration_max_sec;
    var minTarget = occurrence.reps_min != null ? occurrence.reps_min : occurrence.duration_min_sec;
    var rirKnown = latest.sets.every(function (s) { return s.rir && s.rir.state === "VALUE"; });
    var loadValues = latest.sets.map(function (s) { return s.load && s.load.state === "VALUE" ? finiteNumber(s.load.value) : null; }).filter(function (v) { return v != null; });
    var currentLoad = loadValues.length ? loadValues[0] : null;
    if (min >= maxTarget) {
      if (!rirKnown) return { phase: "PROGRESSION", action: "KEEP_LOAD", reason_codes: ["TOP_RANGE", "RIR_UNKNOWN"], text: "Haut de plage atteint, mais la réserve reste inconnue : consolide avant de valider une hausse.", missing: ["rir"] };
      if (["BODYWEIGHT", "TRX", "BAND"].indexOf(ex.load_mode) >= 0) return { phase: "PROGRESSION", action: "HARDER_VARIANT", reason_codes: ["TOP_RANGE"], text: "Haut de plage confirmé : ajoute d’abord une petite difficulté de variante ou de configuration, une seule variable à la fois." };
      if (ex.load_mode === "MACHINE") return { phase: "PROGRESSION", action: "ADD_REP", reason_codes: ["TOP_RANGE", "MACHINE_STEP_UNKNOWN"], text: "Haut de plage confirmé, mais le prochain palier de cette machine n’est pas renseigné : garde le réglage ou saisis le palier réel avant toute hausse." };
      var step = nextStep(DB_STEPS, currentLoad);
      if (step != null) {
        var jump = currentLoad > 0 ? 100 * (step - currentLoad) / currentLoad : null;
        return { phase: "PROGRESSION", action: "ADD_LOAD", reason_codes: ["TOP_RANGE", jump != null && jump > 20 ? "LARGE_REAL_STEP" : "REAL_STEP"], proposed_load: step, jump_pct: jump, text: jump != null && jump > 20 ? "Prochain palier réel : " + step + " kg. Le saut est important (" + Math.round(jump) + " %) : confirme encore la maîtrise avant de l’accepter." : "Haut de plage confirmé : prochain palier réel proposé, " + step + " kg." };
      }
      return { phase: "PROGRESSION", action: "ADD_REP", reason_codes: ["NO_KNOWN_NEXT_STEP"], text: "Aucun palier matériel supérieur confirmé : garde la charge et progresse en répétitions ou contrôle." };
    }
    if (min < minTarget) return { phase: "PROGRESSION", action: "KEEP_LOAD", reason_codes: ["BELOW_RANGE"], text: "Sous le bas de plage : conserve ou réduis proprement selon la technique, sans forcer la hausse." };
    return { phase: "PROGRESSION", action: "ADD_REP", reason_codes: ["WITHIN_RANGE"], text: "Dans la plage : garde la difficulté et vise une répétition propre de plus sur le total." };
  }

  var MEASUREMENT_FIELDS = [
    ["body_weight_kg", "Poids", "kg"], ["waist_navel_cm", "Tour au nombril", "cm"], ["abdomen_max_cm", "Ventre au plus large", "cm"],
    ["chest_cm", "Poitrine", "cm"], ["shoulder_circumference_cm", "Carrure / épaules", "cm"], ["upper_arm_right_cm", "Bras droit", "cm"],
    ["upper_arm_left_cm", "Bras gauche", "cm"], ["forearm_right_cm", "Avant-bras droit", "cm"], ["forearm_left_cm", "Avant-bras gauche", "cm"],
    ["thigh_right_cm", "Cuisse droite", "cm"], ["thigh_left_cm", "Cuisse gauche", "cm"], ["calf_right_cm", "Mollet droit", "cm"], ["calf_left_cm", "Mollet gauche", "cm"]
  ];

  function validateMeasurementInput(input) {
    var values = {};
    var invalid = [];
    MEASUREMENT_FIELDS.forEach(function (field) {
      var raw = input[field[0]];
      if (raw == null || String(raw).trim() === "") return;
      var value = positiveNumber(raw);
      if (value == null) invalid.push(field[0]); else values[field[0]] = { value: value, unit: field[2] };
    });
    return { valid: invalid.length === 0 && Object.keys(values).length > 0, values: values, invalid_fields: invalid };
  }

  function addMeasurement(data, profileId, localDate, input, notes) {
    var check = validateMeasurementInput(input);
    if (!check.valid) throw new Error(check.invalid_fields.length ? "MESURE_INVALIDE" : "MESURE_VIDE");
    var m = { measurement_id: uid("measurement"), profile_id: profileId, local_date: localDate, recorded_at: nowIso(), time_zone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone || null : null, values: check.values, conditions: notes || "", provenance: "USER_ENTERED", revision: 1 };
    data.body_measurements.push(m); touch(data); return m;
  }

  function restrictDatasetToProfile(data, profileId) {
    var out = exportDataset(data, "PROFILE", profileId);
    out.exported_at = data.exported_at || null;
    out.export_id = data.export_id || null;
    out.scope = "PROFILE";
    out.extensions = out.extensions || {};
    out.extensions.owner_profile_id = profileId;
    out.extensions.last_active_profile = profileId;
    return out;
  }

  function incomingMatchesProfile(data, profileId) {
    var ids = ownerProfileIds(data);
    return ids.indexOf(profileId) >= 0;
  }

  function prepareIncomingForProfile(data, profileId) {
    if (!incomingMatchesProfile(data, profileId)) throw new Error("IMPORT_MAUVAIS_PROFIL");
    if (ownerProfileIds(data).length === 1 && ownerProfileIds(data)[0] === profileId) return data;
    return restrictDatasetToProfile(data, profileId);
  }

  function suggestedLoad(data, profileId, occurrence, workoutType) {
    var ex = EXERCISES[occurrence.exercise_id] || {};
    if (occurrence.reference_load != null) {
      return {
        value: occurrence.reference_load,
        unit: occurrence.reference_unit || (ex.equipment === "db_pair" || ex.equipment === "small_db" ? "kg_per_hand" : ex.equipment === "db_single" ? "kg_single" : null),
        source: "REFERENCE",
        configuration_note: null
      };
    }
    var lastNative = null;
    (data.sets || []).forEach(function (set) {
      if (set.profile_id !== profileId || set.exercise_id !== occurrence.exercise_id || set.role !== "WORK_SET" || set.state !== "RECORDED") return;
      var workout = workoutById(data, set.workout_id);
      if (!workout || workout.mode === "TEST") return;
      if (workoutType && workout.workout_type !== workoutType) return;
      if (ex.load_mode === "BAND" || ex.load_mode === "TRX") {
        lastNative = { value: null, unit: null, source: "HISTORY", configuration_note: set.configuration_snapshot && set.configuration_snapshot.user_note || null, recorded_at: set.recorded_at };
      } else if (set.load && set.load.state === "VALUE" && set.load.value != null) {
        lastNative = { value: set.load.value, unit: set.load.unit, source: "HISTORY", configuration_note: set.configuration_snapshot && set.configuration_snapshot.user_note || null, recorded_at: set.recorded_at };
      }
    });
    if (lastNative) return lastNative;
    var lastLegacy = null;
    (data.legacy_summaries || []).forEach(function (summary) {
      if (summary.profile_id !== profileId || summary.exercise_id !== occurrence.exercise_id) return;
      var weight = summary.aggregate && summary.aggregate.weight;
      if (weight == null) return;
      lastLegacy = { value: weight, unit: summary.aggregate.unit || "kg", source: "LEGACY", configuration_note: null };
    });
    return lastLegacy;
  }

  function warmupApproachHint(occurrence, suggested) {
    var ex = EXERCISES[occurrence.exercise_id] || {};
    if (ex.result_kind === "DURATION_SEC") return "Série d’approche : 8–15 s faciles, loin de l’échec. Ce n’est pas une série de travail.";
    if (ex.load_mode === "BAND") return "Série d’approche : 8–10 reps, élastique plus facile ou moins de tension. Ce n’est pas une série de travail.";
    if (ex.load_mode === "BODYWEIGHT") return "Série d’approche : 5–8 reps faciles, ou version allégée. Ce n’est pas une série de travail.";
    if (suggested && suggested.value != null) {
      var lo = Math.round(Number(suggested.value) * 0.5 * 2) / 2;
      var hi = Math.round(Number(suggested.value) * 0.7 * 2) / 2;
      return "Série d’approche : 6–8 reps à environ " + lo + "–" + hi + " " + loadUnitLabel(suggested.unit) + " (50–70 % de la charge de travail), loin de l’échec.";
    }
    return "Série d’approche : 6–8 répétitions plus légères que les séries de travail, loin de l’échec.";
  }

  function addCourseEntry(data, profileId, input) {
    if (!data.courses[profileId]) data.courses[profileId] = { runs: [] };
    var terrain = input.terrain || "futsal";
    var entry = {
      run_id: uid("activity"),
      profile_id: profileId,
      date: input.date,
      terrain: terrain,
      mode: terrain === "futsal" ? "futsal_5v5" : "simple",
      duree: input.duration != null ? input.duration : null,
      distance: input.distance != null ? input.distance : null,
      rpe: input.rpe != null ? input.rpe : null,
      jambes: input.legs != null ? input.legs : null,
      genou: input.knee != null ? input.knee : null,
      hr_avg: input.hr_avg != null ? input.hr_avg : null,
      hr_max: input.hr_max != null ? input.hr_max : null,
      comment: input.comment || "",
      recorded_at: nowIso()
    };
    data.courses[profileId].runs.push(entry);
    touch(data);
    return entry;
  }

  function touch(data) { data.dataset_revision = Number(data.dataset_revision || 0) + 1; data.product_version = PRODUCT_VERSION; }
  function exportDataset(data, scope, profileId) {
    validateDataset(data);
    var out = deepClone(data);
    out.exported_at = nowIso(); out.export_id = uid("export");
    out.scope = scope === "PROFILE" ? "PROFILE" : "FULL";
    if (out.scope === "PROFILE") {
      out.profile_ids = [profileId];
      out.profiles = out.profiles.filter(function (p) { return p.profile_id === profileId; });
      out.program_revisions = out.program_revisions.filter(function (r) { return r.profile_id === profileId; });
      out.workouts = out.workouts.filter(function (x) { return x.profile_id === profileId; });
      out.sets = out.sets.filter(function (x) { return x.profile_id === profileId; });
      out.blocks = out.blocks.filter(function (x) { return x.profile_id === profileId; });
      out.interval_results = out.interval_results.filter(function (x) { return x.profile_id === profileId; });
      out.readiness = out.readiness.filter(function (x) { return x.profile_id === profileId; });
      out.body_measurements = out.body_measurements.filter(function (x) { return x.profile_id === profileId; });
      out.performance_references = out.performance_references.filter(function (x) { return x.profile_id === profileId; });
      out.legacy_summaries = out.legacy_summaries.filter(function (x) { return x.profile_id === profileId; });
      out.legacy_archives = out.legacy_archives.map(function (archive) {
        return { archive_id: archive.archive_id, source_format: archive.source_format, imported_at: archive.imported_at, exported_at: archive.exported_at, sha256: archive.sha256, raw_utf8: null, note: "Archive brute complète omise de l’export par profil pour ne pas inclure l’autre profil." };
      });
      if (out.migration_report) {
        out.migration_report = deepClone(out.migration_report);
        out.migration_report.scope_note = "Les compteurs du rapport original décrivent l’import complet ; seules les données du profil demandé sont incluses.";
      }
      out.courses = {}; out.courses[profileId] = deepClone(data.courses[profileId] || { runs: [] });
      out.profile_settings = {}; out.profile_settings[profileId] = deepClone(data.profile_settings[profileId]);
      out.active_program_revision_by_profile = {}; out.active_program_revision_by_profile[profileId] = data.active_program_revision_by_profile[profileId];
      if (out.extensions && Array.isArray(out.extensions.import_conflicts)) {
        out.extensions.import_conflicts = out.extensions.import_conflicts.map(function (conflict) {
          return {
            conflict_id: conflict.conflict_id,
            detected_at: conflict.detected_at,
            collection: conflict.collection,
            record_id: conflict.record_id,
            status: conflict.status,
            note: "Contenu contradictoire omis de l’export par profil pour éviter une fuite interprofil. Utiliser l’export complet pour le résoudre."
          };
        });
      }
      if (out.extensions && Array.isArray(out.extensions.corrections)) out.extensions.corrections = out.extensions.corrections.filter(function (correction) { return correction.profile_id === profileId; });
      if (out.extensions) out.extensions.last_active_profile = profileId;
    }
    return out;
  }

  function isPristineDataset(data) {
    if (!isV2(data)) return false;
    var hasCourse = Object.keys(data.courses || {}).some(function (profileId) { return ((data.courses[profileId] || {}).runs || []).length > 0; });
    var settingsChanged = ownerProfileIds(data).some(function (profileId) {
      return data.profile_settings && data.profile_settings[profileId] && stableStringify(data.profile_settings[profileId]) !== stableStringify(defaultSettings(profileId));
    });
    var extensionsChanged = Object.keys(data.extensions || {}).some(function (key) {
      if (key === "last_active_profile") return false;
      if (key === "corrections" || key === "import_conflicts") return (data.extensions[key] || []).length > 0;
      return true;
    });
    var extraReferences = (data.performance_references || []).some(function (reference) { return reference.performance_reference_id !== "pote-traction-3x5-declared"; });
    var extraPrograms = (data.program_revisions || []).filter(function (revision) { return !revision.historical_only; }).length > 2 || (data.program_revisions || []).some(function (revision) { return revision.historical_only; });
    return !hasCourse && !settingsChanged && !extensionsChanged && !extraReferences && !extraPrograms && ["workouts", "sets", "blocks", "interval_results", "readiness", "body_measurements", "legacy_archives", "legacy_summaries"].every(function (key) { return !(data[key] || []).length; });
  }

  function mergeV2Dataset(active, incoming) {
    validateDataset(active); validateDataset(incoming);
    var merged = deepClone(active);
    if (!merged.extensions) merged.extensions = {};
    if (!Array.isArray(merged.extensions.import_conflicts)) merged.extensions.import_conflicts = [];
    if (!Array.isArray(merged.extensions.corrections)) merged.extensions.corrections = [];
    var stats = { added: 0, identical: 0, conflicts: 0, conflict_ids: [] };

    function conflict(collection, recordId, currentValue, incomingValue) {
      var signature = stableStringify({ collection: collection, record_id: recordId, active_record: currentValue, incoming_record: incomingValue });
      var existing = merged.extensions.import_conflicts.find(function (item) { return item.signature === signature; });
      if (existing) { stats.identical++; return existing; }
      var item = {
        conflict_id: uid("conflict"), signature: signature, detected_at: nowIso(), status: "UNRESOLVED",
        collection: collection, record_id: String(recordId), active_record: deepClone(currentValue), incoming_record: deepClone(incomingValue),
        incoming_dataset_id: incoming.dataset_id, incoming_dataset_revision: incoming.dataset_revision
      };
      merged.extensions.import_conflicts.push(item); stats.conflicts++; stats.conflict_ids.push(item.conflict_id); return item;
    }

    function mergeArray(collection, idKey) {
      if (!Array.isArray(merged[collection])) merged[collection] = [];
      (incoming[collection] || []).forEach(function (record) {
        var id = record && record[idKey];
        if (id == null) { conflict(collection, "MISSING_ID", null, record); return; }
        var current = merged[collection].find(function (candidate) { return candidate && candidate[idKey] === id; });
        if (!current) { merged[collection].push(deepClone(record)); stats.added++; }
        else if (stableStringify(current) === stableStringify(record)) stats.identical++;
        else conflict(collection, id, current, record);
      });
    }

    [
      ["profiles", "profile_id"], ["exercise_catalog", "exercise_id"], ["program_revisions", "program_revision_id"],
      ["workouts", "workout_id"], ["sets", "set_id"], ["blocks", "block_id"], ["interval_results", "interval_result_id"],
      ["readiness", "readiness_id"], ["body_measurements", "measurement_id"], ["performance_references", "performance_reference_id"],
      ["legacy_archives", "archive_id"], ["legacy_summaries", "legacy_summary_id"]
    ].forEach(function (definition) { mergeArray(definition[0], definition[1]); });

    merged.profile_ids = Array.from(new Set((merged.profiles || []).map(function (profile) { return profile.profile_id; })));
    if (!merged.profile_settings) merged.profile_settings = {};
    Object.keys(incoming.profile_settings || {}).forEach(function (profileId) {
      if (!merged.profile_settings[profileId]) { merged.profile_settings[profileId] = deepClone(incoming.profile_settings[profileId]); stats.added++; }
      else if (stableStringify(merged.profile_settings[profileId]) === stableStringify(incoming.profile_settings[profileId])) stats.identical++;
      else conflict("profile_settings", profileId, merged.profile_settings[profileId], incoming.profile_settings[profileId]);
    });
    if (!merged.active_program_revision_by_profile) merged.active_program_revision_by_profile = {};
    Object.keys(incoming.active_program_revision_by_profile || {}).forEach(function (profileId) {
      var incomingRevision = incoming.active_program_revision_by_profile[profileId];
      if (!merged.active_program_revision_by_profile[profileId]) { merged.active_program_revision_by_profile[profileId] = incomingRevision; stats.added++; }
      else if (merged.active_program_revision_by_profile[profileId] === incomingRevision) stats.identical++;
      else conflict("active_program_revision_by_profile", profileId, merged.active_program_revision_by_profile[profileId], incomingRevision);
    });

    if (!merged.courses) merged.courses = {};
    Object.keys(incoming.courses || {}).forEach(function (profileId) {
      if (!merged.courses[profileId]) { merged.courses[profileId] = deepClone(incoming.courses[profileId]); stats.added++; return; }
      var targetRuns = merged.courses[profileId].runs || (merged.courses[profileId].runs = []);
      ((incoming.courses[profileId] || {}).runs || []).forEach(function (run) {
        var runKey = run.run_id || stableStringify(run);
        var current = targetRuns.find(function (candidate) { return (candidate.run_id || stableStringify(candidate)) === runKey; });
        if (!current) { targetRuns.push(deepClone(run)); stats.added++; }
        else if (stableStringify(current) === stableStringify(run)) stats.identical++;
        else conflict("courses." + profileId + ".runs", runKey, current, run);
      });
    });

    if (!merged.migration_report && incoming.migration_report) { merged.migration_report = deepClone(incoming.migration_report); stats.added++; }
    else if (merged.migration_report && incoming.migration_report && stableStringify(merged.migration_report) !== stableStringify(incoming.migration_report)) conflict("migration_report", incoming.migration_report.source_sha256 || "report", merged.migration_report, incoming.migration_report);

    (incoming.extensions && incoming.extensions.corrections || []).forEach(function (correction) {
      if (!merged.extensions.corrections.some(function (current) { return stableStringify(current) === stableStringify(correction); })) { merged.extensions.corrections.push(deepClone(correction)); stats.added++; }
      else stats.identical++;
    });
    (incoming.extensions && incoming.extensions.import_conflicts || []).forEach(function (incomingConflict) {
      var key = incomingConflict.conflict_id || incomingConflict.signature || stableStringify(incomingConflict);
      if (!merged.extensions.import_conflicts.some(function (current) { return (current.conflict_id || current.signature || stableStringify(current)) === key; })) { merged.extensions.import_conflicts.push(deepClone(incomingConflict)); stats.added++; }
      else stats.identical++;
    });
    Object.keys(incoming.extensions || {}).forEach(function (key) {
      if (["corrections", "import_conflicts", "last_active_profile"].indexOf(key) >= 0) return;
      if (!Object.prototype.hasOwnProperty.call(merged.extensions, key)) { merged.extensions[key] = deepClone(incoming.extensions[key]); stats.added++; }
      else if (stableStringify(merged.extensions[key]) === stableStringify(incoming.extensions[key])) stats.identical++;
      else conflict("extensions", key, merged.extensions[key], incoming.extensions[key]);
    });

    if (stats.added || stats.conflicts) touch(merged);
    validateDataset(merged);
    return { data: merged, stats: stats };
  }

  var Engine = {
    PRODUCT_VERSION: PRODUCT_VERSION, FORMAT: FORMAT, SCHEMA_VERSION: SCHEMA_VERSION, EXERCISES: EXERCISES, DB_STEPS: DB_STEPS,
    ROPE_RECIPE: ROPE_RECIPE, BIKE_RECIPE: BIKE_RECIPE, recipeTotal: recipeTotal, createDataset: createDataset,
    isV2: isV2, isLegacy: isLegacy, migrateLegacy: migrateLegacy, validateDataset: validateDataset,
    defaultSettings: defaultSettings, planFor: planFor, buildProgramRevision: buildProgramRevision, activePlan: activePlan, refreshPrograms: refreshPrograms, adaptWorkoutPlan: adaptWorkoutPlan,
    startWorkout: startWorkout, activeWorkout: activeWorkout, workoutById: workoutById, blocksFor: blocksFor, setsFor: setsFor, plannedSetSlots: plannedSetSlots, completedPlannedSlots: completedPlannedSlots, logicalGroupSummary: logicalGroupSummary,
    startSet: startSet, endSet: endSet, recordSet: recordSet, addUnmeasuredSet: addUnmeasuredSet, addRestTime: addRestTime,
    completeSimpleBlock: completeSimpleBlock, beginIntervalBlock: beginIntervalBlock, advanceIntervalState: advanceIntervalState,
    syncIntervalBlock: syncIntervalBlock, pauseIntervalBlock: pauseIntervalBlock, resumeIntervalBlock: resumeIntervalBlock,
    skipIntervalStep: skipIntervalStep, finishIntervalBlock: finishIntervalBlock, finishWorkout: finishWorkout, sessionElapsed: sessionElapsed,
    variation: variation, nextStep: nextStep, progressionRecommendation: progressionRecommendation,
    observationFromInput: observationFromInput, obs: obs, finiteNumber: finiteNumber, positiveNumber: positiveNumber,
    MEASUREMENT_FIELDS: MEASUREMENT_FIELDS, validateMeasurementInput: validateMeasurementInput, addMeasurement: addMeasurement,
    exportDataset: exportDataset, mergeV2Dataset: mergeV2Dataset, isPristineDataset: isPristineDataset, stableStringify: stableStringify, sha256Text: sha256Text, deepClone: deepClone, localDateFromIso: localDateFromIso,
    profileName: profileName, restrictDatasetToProfile: restrictDatasetToProfile, prepareIncomingForProfile: prepareIncomingForProfile,
    suggestedLoad: suggestedLoad, warmupApproachHint: warmupApproachHint, restKindAfterEndingSet: restKindAfterEndingSet,
    restTargetForKind: restTargetForKind, intervalStepTypes: intervalStepTypes, hasConsecutiveEffort: hasConsecutiveEffort,
    frenchSetRole: frenchSetRole, frenchSide: frenchSide, frenchPhase: frenchPhase, frenchAction: frenchAction,
    frenchBlockKind: frenchBlockKind, frenchOutcome: frenchOutcome, frenchMode: frenchMode, frenchRestKind: frenchRestKind,
    addCourseEntry: addCourseEntry, TEST_REST_SEC: TEST_REST_SEC, TEST_INTERVAL_STEP_SEC: TEST_INTERVAL_STEP_SEC,
    ownerProfileIds: ownerProfileIds, incomingMatchesProfile: incomingMatchesProfile
  };

  if (typeof module !== "undefined" && module.exports) module.exports = Engine;
  root.CoachMuscuV2 = Engine;

  if (typeof document === "undefined") return;

  /* ========================= UI ========================= */
  var APP_OWNER = root.COACH_APP_OWNER === "ryan" ? "ryan" : "mathieu";
  var APP_PROFILE_ID = APP_OWNER === "ryan" ? "pote" : "moi";
  var APP_DISPLAY_NAME = APP_OWNER === "ryan" ? "Ryan" : "Mathieu";
  var STORAGE_NS = "coachMuscu." + APP_OWNER;
  var DATASET_KEY = STORAGE_NS + ".dataset_v2";
  var DATASET_ROLLBACK_KEY = STORAGE_NS + ".dataset_v2_rollback";
  var app = document.getElementById("app");
  var toastEl = document.getElementById("toast");
  var DATA = null;
  var PROFILE = APP_PROFILE_ID;
  var VIEW = "home";
  var SELECTED_TYPE = null;
  var DETAIL_WORKOUT_ID = null;
  var EDIT_SET_ID = null;
  var LAST_FINISHED_ID = null;
  var DATA_TEXT = "";
  var toastTimer = null;
  var tickTimer = null;
  var hiddenAt = null;
  var wakeLock = null;
  var lastAudibleStep = {};
  var TAB_ID = uid("tab");
  var LOCK_KEY = STORAGE_NS + ".edit_lock";
  var READ_ONLY = false;

  function html(value) { return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function $(selector, parent) { return (parent || document).querySelector(selector); }
  function $all(selector, parent) { return Array.prototype.slice.call((parent || document).querySelectorAll(selector)); }
  function fmt(value, digits) {
    if (value == null || value === "") return "—";
    var n = Number(value); if (!isFinite(n)) return String(value);
    return n.toLocaleString("fr-FR", { maximumFractionDigits: digits == null ? 1 : digits });
  }
  function formatClock(seconds) {
    if (seconds == null || !isFinite(seconds)) return "—:—";
    seconds = Math.max(0, Math.floor(seconds));
    var h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = seconds % 60;
    return (h ? String(h).padStart(2, "0") + ":" : "") + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }
  function dateFr(value) {
    if (!value) return "date inconnue";
    var d = new Date(value); if (isNaN(d.getTime())) return String(value).slice(0, 10);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  function todayLocal() {
    var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function toast(message, error) {
    toastEl.textContent = message; toastEl.className = "show" + (error ? " error" : "");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.className = ""; }, 2600);
  }
  function backButton(target) { return '<button class="icon-btn" data-view="' + (target || "home") + '" aria-label="Retour">‹</button>'; }
  function topBar(title, subtitle, back) {
    return '<div class="top">' + (back === false ? "" : backButton(back)) + '<div style="flex:1;min-width:0"><div class="ttl">' + html(title) + '</div>' + (subtitle ? '<div class="sub">' + html(subtitle) + '</div>' : "") + '</div></div>';
  }
  function profileToggle() { return ""; }
  function profileLabel() { return APP_DISPLAY_NAME; }
  function appTitle() { return "Coach Muscu — " + APP_DISPLAY_NAME; }
  function ensureEditable() { if (READ_ONLY) { toast("Cet onglet est en lecture seule : ferme l’autre onglet ou attends le transfert.", true); return false; } return true; }

  function acquireEditorLock() {
    try {
      var now = Date.now();
      var old = JSON.parse(localStorage.getItem(LOCK_KEY) || "null");
      if (old && old.tab_id !== TAB_ID && now - old.at < 15000) READ_ONLY = true;
      else { READ_ONLY = false; localStorage.setItem(LOCK_KEY, JSON.stringify({ tab_id: TAB_ID, at: now })); }
    } catch (ignore) { READ_ONLY = false; }
  }
  function refreshEditorLock() {
    try {
      var now = Date.now(); var old = JSON.parse(localStorage.getItem(LOCK_KEY) || "null");
      if (READ_ONLY) {
        if (!old || now - old.at >= 15000) { READ_ONLY = false; localStorage.setItem(LOCK_KEY, JSON.stringify({ tab_id: TAB_ID, at: now })); render(); }
      } else if (old && old.tab_id !== TAB_ID && now - old.at < 15000) { READ_ONLY = true; render(); }
      else localStorage.setItem(LOCK_KEY, JSON.stringify({ tab_id: TAB_ID, at: now }));
    } catch (ignore) {}
  }

  function saveDataset(silent) {
    try {
      validateDataset(DATA);
      localStorage.setItem(DATASET_KEY, JSON.stringify(DATA));
      return true;
    } catch (err) {
      if (!silent) toast("Échec d’écriture : les modifications restent en mémoire. Exporte une sauvegarde.", true);
      return false;
    }
  }

  function legacyFromLocalStorage() {
    function get(key, fallback) { try { var raw = localStorage.getItem("coach_" + key); return raw ? JSON.parse(raw) : fallback; } catch (ignore) { return fallback; } }
    var programs = get("programs", null), logs = get("logs", null), states = get("states", null);
    if (!programs || !logs || !states) return null;
    var count = ["moi", "pote"].reduce(function (sum, p) { var lp = logs[p] || {}; return sum + Object.keys(lp).reduce(function (n, id) { return n + (lp[id] || []).length; }, 0); }, 0);
    if (!count) return null;
    return { v: 2, exported: nowIso(), profile: get("profile", "moi"), programs: programs, logs: logs, states: states, course: get("course", { moi: { runs: [] }, pote: { runs: [] } }), workoutDraft: get("workoutDraft", {}) };
  }

  async function bootData() {
    PROFILE = APP_PROFILE_ID;
    var stored = null;
    try { stored = JSON.parse(localStorage.getItem(DATASET_KEY) || "null"); } catch (ignore) {}
    if (stored && isV2(stored)) {
      try {
        validateDataset(stored);
        DATA = prepareIncomingForProfile(stored, APP_PROFILE_ID);
        PROFILE = APP_PROFILE_ID;
        if (DATA.extensions) DATA.extensions.last_active_profile = APP_PROFILE_ID;
      } catch (err) { toast("La base V2 stockée est invalide. Utilise Importer ou le retour arrière.", true); }
    }
    if (!DATA) {
      var inherited = null;
      try { inherited = JSON.parse(localStorage.getItem(LEGACY_DATASET_KEY) || "null"); } catch (ignore3) {}
      if (inherited && isV2(inherited)) {
        try {
          validateDataset(inherited);
          DATA = restrictDatasetToProfile(inherited, APP_PROFILE_ID);
          DATA.extensions = DATA.extensions || {};
          DATA.extensions.migrated_from_shared_v12 = true;
          DATA.extensions.owner_profile_id = APP_PROFILE_ID;
          DATA.extensions.last_active_profile = APP_PROFILE_ID;
          saveDataset(true);
        } catch (errInherit) { inherited = null; }
      }
    }
    if (!DATA) {
      var legacy = legacyFromLocalStorage();
      if (legacy) {
        var raw = JSON.stringify(legacy);
        try {
          var migrated = await migrateLegacy(legacy, raw);
          DATA = restrictDatasetToProfile(migrated, APP_PROFILE_ID);
          DATA.extensions = DATA.extensions || {};
          DATA.extensions.migrated_from_legacy_keys = true;
          DATA.extensions.last_active_profile = APP_PROFILE_ID;
          saveDataset(true);
        } catch (err2) { DATA = createDataset({ profileId: APP_PROFILE_ID }); toast("Migration locale impossible : ancienne base laissée intacte.", true); }
      } else { DATA = createDataset({ profileId: APP_PROFILE_ID }); saveDataset(true); }
    }
    if (!DATA.extensions) DATA.extensions = { corrections: [], import_conflicts: [], last_active_profile: APP_PROFILE_ID };
    DATA.extensions.last_active_profile = APP_PROFILE_ID;
    DATA.extensions.owner_profile_id = APP_PROFILE_ID;
    PROFILE = APP_PROFILE_ID;
    refreshPrograms(DATA);
  }

  function mutate(fn, options) {
    if (!ensureEditable()) return;
    try {
      var result = fn();
      saveDataset(options && options.silent);
      if (!(options && options.noRender)) render();
      return result;
    } catch (err) {
      toast(humanError(err), true);
      return null;
    }
  }
  function humanError(err) {
    var code = err && err.message ? err.message : String(err);
    var labels = {
      SEANCE_DEJA_ACTIVE: "Une séance est déjà en cours pour ce profil.", RESULTAT_REQUIS: "Saisis le résultat réel ou choisis « résultat oublié ».",
      MESURE_INVALIDE: "Une mesure est invalide : utilise un nombre positif.", MESURE_VIDE: "Renseigne au moins une mesure.",
      FORMAT_V2_INVALIDE: "Sauvegarde V2 invalide.", FORMAT_LEGACY_NON_RECONNU: "Ce format de sauvegarde n’est pas reconnu.",
      IMPORT_MAUVAIS_PROFIL: "Cette sauvegarde appartient à l’autre application personnelle. Elle n’a pas été importée.",
      SERIE_NON_ACTIVE: "Cette série n’est plus active.", SEANCE_NON_ACTIVE: "Cette séance n’est plus active.",
      TERMINER_SERIE_AVANT_ADAPTATION: "Termine la série en cours avant d’adapter le programme.", BLOC_FORCE_DEJA_TERMINE: "Le bloc musculaire est déjà terminé.",
      COMPLEMENT_REQUIS: "Choisis d’abord shrugs ou oiseau dans les options du programme.", VARIANTE_INVALIDE: "Cette variante n’est pas disponible."
    };
    return labels[code] || "Action impossible : " + code;
  }

  function render() {
    clearInterval(tickTimer); tickTimer = null;
    var renders = { home: renderHome, prepare: renderPrepare, session: renderSession, summary: renderSummary, history: renderHistory, workout_detail: renderWorkoutDetail, measurements: renderMeasurements, options: renderOptions, data: renderData, course: renderCourse };
    (renders[VIEW] || renderHome)();
    bindCommon();
    if (VIEW === "session") { updateLiveUI(); tickTimer = setInterval(updateLiveUI, 500); }
  }

  function renderHome() {
    var active = activeWorkout(DATA, PROFILE);
    var types = ["HAUT_A", "HAUT_B", "HAUT_C", "LEGS"];
    var colors = { HAUT_A: "#F59E0B", HAUT_B: "#34D399", HAUT_C: "#C084FC", LEGS: "#60A5FA" };
    var days = { HAUT_A: "Lundi", HAUT_B: "Mardi", HAUT_C: "Vendredi", LEGS: "Samedi 13 h 30" };
    var cards = types.map(function (type) {
      var plan = activePlan(DATA, PROFILE, type);
      var last = DATA.workouts.filter(function (w) { return w.profile_id === PROFILE && w.workout_type === type && w.lifecycle === "COMPLETED"; }).slice(-1)[0];
      return '<button class="scard" data-prepare="' + type + '"><span class="tag" style="background:' + colors[type] + '">' + type.replace("HAUT_", "H") .replace("LEGS", "J") + '</span><span class="body"><span class="name">' + html(plan.display_name) + '</span><span class="meta">' + days[type] + ' · ' + plan.target_groups + ' séries' + (last ? ' · dernière ' + dateFr(last.started_at) : ' · jamais en V2') + '</span></span><span class="chev">›</span></button>';
    }).join("");
    var activeCard = active ? '<button class="scard active-session" data-resume="1"><span class="tag" style="background:var(--go)">▶</span><span class="body"><span class="name">Reprendre ' + html(active.plan_snapshot.display_name) + '</span><span class="meta">Chrono en cours · <span data-session-clock>' + formatClock(sessionElapsed(active)) + '</span></span></span><span class="chev">›</span></button>' : "";
    app.innerHTML = '<div class="pad"><div class="eyebrow">' + html(appTitle()) + '</div><h1>Séances de ' + html(APP_DISPLAY_NAME) + '</h1>' +
      (READ_ONLY ? '<div class="notice warn">Lecture seule : un autre onglet édite actuellement les données.</div>' : "") +
      '<div class="schedule"><span>Lun A</span><span>Mar B</span><span>Jeu foot</span><span>Ven C</span><span>Sam jambes</span></div>' +
      (activeCard ? '<h2>Séance en cours</h2>' + activeCard : "") + '<h2>Séances</h2>' + cards +
      '<div class="notice"><b>Récupération :</b> mercredi et dimanche normalement libres. Le report jambes au dimanche reste exceptionnel et volontaire.</div>' +
      '<h2>Suivi</h2>' +
      '<button class="lcard" data-view="summary"><span>Tableau de bord réel</span><span class="chev">›</span></button>' +
      '<button class="lcard" data-view="history"><span>Historique des séances</span><span class="chev">›</span></button>' +
      '<button class="lcard" data-view="measurements"><span>Poids et mensurations</span><span class="chev">›</span></button>' +
      '<button class="lcard" data-view="course"><span>Course / futsal</span><span class="chev">›</span></button>' +
      '<h2>Réglages</h2>' +
      '<button class="lcard" data-view="options"><span>Versions et options du programme</span><span class="chev">›</span></button>' +
      '<button class="lcard" data-view="data"><span>Sauvegarde · import / export</span><span class="chev">›</span></button>' +
      '<p class="note">Données locales de ' + html(APP_DISPLAY_NAME) + ' uniquement · aucune synchro avec l’autre application personnelle</p></div>';
  }

  function observationField(id, label, unit, max) {
    return '<div class="obs-field"><label>' + html(label) + '</label><div class="obs-line"><select id="' + id + '_state"><option value="NOT_ENTERED">Non renseigné</option><option value="UNKNOWN">Je ne sais pas</option><option value="VALUE">Saisir</option></select><input id="' + id + '_value" inputmode="decimal" placeholder="' + (unit || "") + '"' + (max ? ' max="' + max + '"' : "") + '></div></div>';
  }

  function renderPrepare() {
    var plan = activePlan(DATA, PROFILE, SELECTED_TYPE);
    if (!plan) { VIEW = "home"; return render(); }
    var rows = plan.occurrences.map(function (o, i) {
      var ex = EXERCISES[o.exercise_id];
      var range = ex.result_kind === "DURATION_SEC" ? o.duration_min_sec + "–" + o.duration_max_sec + " s" : o.reps_min + "–" + o.reps_max + " reps";
      var setsLabel = o.sets_per_side ? (o.sets + " série" + (o.sets > 1 ? "s" : "") + " · gauche + droite") : (o.sets + " série" + (o.sets > 1 ? "s" : ""));
      return '<div class="plan-row"><span class="order">' + (i + 1) + '</span><span><b>' + html(ex.name) + '</b><small>' + setsLabel + ' · ' + range + ' · repos ' + formatClock(o.rest_target_sec) + '</small></span></div>';
    }).join("");
    var warm = SELECTED_TYPE === "HAUT_B"
      ? "6–8 min, approches comprises : 2 min épaules/omoplates, 1 min suspensions actives, 1 tirage léger, tractions faciles, puis 1 série d’approche du rowing."
      : SELECTED_TYPE === "HAUT_A"
        ? "6–10 min, approches comprises : 2 min mobilité épaules/poignets, 1 min pompes faciles, puis 1–2 séries d’approche du développé incliné (6–8 reps, 50–70 % de la charge de travail)."
        : SELECTED_TYPE === "HAUT_C"
          ? "6–10 min, approches comprises : 2 min mobilité d’épaules, 1 min pompes ou développé léger, puis 1 série d’approche du développé couché."
          : "3–5 min marche ou vélo facile, mobilité hanches/genoux, puis 1 série légère de presse et de curl. Pas de pré-fatigue.";
    app.innerHTML = topBar(plan.display_name, profileLabel(), "home") + '<div class="pad"><div class="notice"><b>Échauffement :</b> ' + html(warm) + '</div>' +
      (SELECTED_TYPE === "HAUT_A" ? '<div class="notice info"><b>Lundi complet :</b> préparation → corde 4×45 s → musculation → vélo 22 min sur deux vélos en parallèle → retour au calme.</div>' : "") +
      '<h2>Ordre retenu</h2><div class="plan-list">' + rows + '</div>' +
      '<h2>Mode</h2><div class="chips mode-choice"><button data-mode-choice="TRAINING" aria-pressed="true">Entraînement</button><button data-mode-choice="TEST" aria-pressed="false">Essai TEST</button></div>' +
      '<p class="sethint">TEST reste consultable mais est exclu par défaut des records et de l’assiduité.</p>' +
      '<h2>État du jour — facultatif</h2><p class="sethint">Vide, inconnu et zéro sont trois états distincts. Aucune réponse n’est préremplie.</p>' +
      observationField("sleep_hours", "Sommeil", "heures", 24) + observationField("fatigue", "Fatigue /10", "0–10", 10) + observationField("energy", "Énergie /10", "0–10", 10) +
      observationField("knee_pain", "Douleur genou /10", "0–10", 10) + observationField("shoulder_pain", "Douleur épaule /10", "0–10", 10) + observationField("back_pain", "Douleur dos /10", "0–10", 10) +
      '<div class="field"><label>Commentaire facultatif</label><input id="readiness_comment" placeholder="Contexte du jour"></div></div>' +
      '<div class="bar"><button class="btn primary" data-start-workout="1">Démarrer le chrono séance</button></div>';
  }

  function warmupText(workout) {
    if (workout.workout_type === "HAUT_B") return "6–8 min · épaules, suspensions, tirage léger, tractions faciles, approche rowing";
    if (workout.workout_type === "HAUT_A") return "6–10 min · mobilité épaules, pompes faciles, approches développé incliné / épaules";
    if (workout.workout_type === "HAUT_C") return "6–10 min · mobilité épaules, pompes ou développé léger, approche couché";
    return "Marche ou vélo facile, mobilité hanches/genoux, 1 série légère de presse et de curl";
  }
  function warmupChecklist(workout) {
    var items = workout.workout_type === "HAUT_B"
      ? ["2 min épaules / omoplates", "1 min suspensions actives", "1 tirage léger ou élastique facile", "Tractions faciles (assistées si besoin)", "1 série d’approche du rowing"]
      : workout.workout_type === "HAUT_A"
        ? ["2 min cercles d’épaules, omoplates, poignets", "1 min pompes inclinées ou genoux, faciles", "1–2 séries d’approche du développé incliné (6–8 reps, 50–70 %)", "1 série d’approche du développé épaules si besoin"]
        : workout.workout_type === "HAUT_C"
          ? ["2 min mobilité d’épaules", "1 min pompes ou développé léger", "1 série d’approche du développé couché"]
          : ["3 min marche ou vélo facile", "Mobilité hanches / genoux", "1 série presse légère (~50 %, 8–10 reps)", "1 série curl légère"];
    return '<ul class="warm-check">' + items.map(function (item) { return "<li>" + html(item) + "</li>"; }).join("") + '</ul><p class="sethint">C’est un guidage, pas une liste à valider. Quand tu es chaud, passe à la musculation.</p>';
  }
  function cooldownChecklist(workout) {
    var items = workout.workout_type === "LEGS"
      ? ["Ischios 20–30 s / jambe", "Quad / hanche 20–30 s / jambe", "Mollets si ça tire, 20–30 s", "1 min de respiration calme, optionnel"]
      : ["Pectoraux / avant d’épaule 20–30 s / côté", "Dorsal 20–30 s / côté", "Épaules si ça tire, 20–30 s", "1 min de respiration calme, optionnel"];
    return '<ul class="warm-check">' + items.map(function (item) { return "<li>" + html(item) + "</li>"; }).join("") + '</ul><p class="sethint">Tout est facultatif. Tu peux passer sans étirements.</p>';
  }
  function blockStatus(block) {
    if (block.outcome === "COMPLETED") return "✓ réalisé";
    if (block.outcome === "SHORTENED") return "partiel";
    if (block.outcome === "SKIPPED") return "passé";
    if (block.outcome === "UNKNOWN") return "à confirmer";
    if (block.run_state === "IN_PROGRESS") return "en cours";
    if (block.run_state === "PAUSED") return "pause";
    return "prévu";
  }

  function restCard(workout) {
    if (!workout.active_rest) return "";
    var start = new Date(workout.active_rest.started_at).getTime();
    var elapsed = Math.max(0, Math.floor((Date.now() - start) / 1000));
    var target = Number(workout.active_rest.target_adjusted_sec || 0);
    var kind = workout.active_rest.kind || "INTER_SET";
    var title = frenchRestKind(kind);
    var klass = kind === "INTER_EXERCISE" ? " rest-card transition" : kind === "INTER_SIDE" || kind === "WARMUP" ? " rest-card sidechange" : " rest-card";
    var testNote = workout.active_rest.test_shortened ? '<small>Mode TEST : chrono raccourci, non compté comme un vrai repos</small>' : "";
    var clock;
    if (target <= 0) {
      clock = kind === "INTER_SIDE" ? "Change de côté, puis enchaîne" : "Tu peux enchaîner";
    } else {
      clock = elapsed < target ? formatClock(target - elapsed) + " restant" : "+" + formatClock(elapsed - target) + " après cible";
    }
    var sub;
    if (kind === "INTER_SIDE") {
      sub = "Le repos long se prend après les deux côtés";
    } else if (target > 0) {
      sub = "Cible " + formatClock(workout.active_rest.target_initial_sec) + (workout.active_rest.test_shortened ? " · affichée " + formatClock(target) + " en TEST" : "");
    } else {
      sub = "Pas de repos long ici";
    }
    return '<div class="' + klass.trim() + '"><div><span class="eyebrow">' + html(title) + '</span><strong data-rest-clock>' + html(clock) + '</strong><small>' + html(sub) + '</small>' + testNote + '</div>' + (target > 0 ? '<button class="mini-action" data-add-rest="30">+30 s</button>' : "") + '</div>';
  }

  function renderSimpleBlock(block, workout) {
    var title = frenchBlockKind(block.kind);
    var stepLabel = (block.order || 1) + ". " + title;
    var text = block.kind === "WARMUP" ? warmupText(workout) : "Étirements facultatifs, 20–30 s par posture. Aucune durée n’est inventée.";
    var extra = block.kind === "WARMUP" ? warmupChecklist(workout) : block.kind === "COOLDOWN" ? cooldownChecklist(workout) : "";
    var controls = block.run_state === "PLANNED"
      ? '<button class="small primary" data-complete-block="' + block.block_id + '">' + (block.kind === "WARMUP" ? "Échauffement terminé" : "Retour au calme fait") + '</button><button class="small" data-skip-block="' + block.block_id + '">Passer</button>'
      : "";
    return '<section class="block-card ' + String(block.outcome || "").toLowerCase() + '"><div class="block-head"><div><span class="eyebrow">Étape ' + block.order + ' / séance</span><h3>' + html(stepLabel) + '</h3></div><span class="block-state">' + blockStatus(block) + '</span></div><p>' + html(text) + '</p>' + extra + controls + '</section>';
  }

  function intervalPosition(block) {
    if (!block.timer_state) return null;
    var clone = deepClone(block.timer_state);
    advanceIntervalState(clone, block.plan_snapshot.recipe, Date.now());
    var step = block.plan_snapshot.recipe.steps[clone.step_index] || null;
    return { timer: clone, step: step };
  }
  function confirmedIntervalSec(block) {
    return (block.timer_state && block.timer_state.step_results || []).reduce(function (sum, r) { return sum + (r.confirmation_state === "VALUE" ? Number(r.performed_duration_sec || 0) : 0); }, 0);
  }
  function renderIntervalBlock(block) {
    var recipe = block.plan_snapshot.recipe, total = recipeTotal(recipe), pos = intervalPosition(block);
    var controls = "", center = "";
    var timeline = '<ol class="phase-list">' + recipe.steps.map(function (step, idx) {
      var current = pos && pos.timer && !pos.timer.finished && pos.timer.step_index === idx;
      var done = pos && pos.timer && (pos.timer.finished || pos.timer.step_index > idx);
      var kindClass = step.type === "EFFORT" ? "effort" : "easy";
      return '<li class="' + kindClass + (current ? " current" : "") + (done ? " done" : "") + '"><b>' + html(intervalPhaseLabel(step)) + '</b><span>' + formatClock(step.programmed_duration_sec || step.duration_sec) + (recipe.test_compressed ? " · TEST " + formatClock(step.duration_sec) : "") + '</span></li>';
    }).join("") + '</ol>';
    if (block.run_state === "PLANNED") {
      center = '<div class="big-time">' + formatClock(block.plan_snapshot.original_total_sec || total) + '</div><p>' + (block.kind === "ROPE" ? "4 passages de 45 s, 30 s de récupération entre chaque." : "5 min facile, puis 2 min effort / 2 min facile en alternance, sans deux efforts d’affilée.") + '</p>' + timeline;
      controls = '<button class="small primary" data-start-interval="' + block.block_id + '">Démarrer</button><button class="small" data-skip-block="' + block.block_id + '">Passer</button>';
    } else if (block.run_state === "IN_PROGRESS" || block.run_state === "PAUSED") {
      var remain = pos && pos.step ? Math.max(0, pos.step.duration_sec - pos.timer.step_elapsed_sec) : 0;
      var nextStep = pos && pos.timer ? recipe.steps[pos.timer.step_index + 1] : null;
      var nextHint = nextStep ? '<p class="sethint">Ensuite : ' + html(intervalPhaseLabel(nextStep)) + '</p>' : "";
      var phaseClass = pos && pos.step && pos.step.type === "EFFORT" ? "phase effort" : "phase easy";
      center = '<div class="' + phaseClass + '">' + html(pos && pos.step ? intervalPhaseLabel(pos.step) : "Terminé") + '</div><div class="big-time" data-block-clock="' + block.block_id + '">' + formatClock(remain) + '</div><p>' + html(pos && pos.step ? intervalPhaseHint(pos.step) : "Guidage terminé") + '</p>' + nextHint + (block.timer_state.needs_confirmation ? '<div class="notice warn">Le chrono a été recalculé après arrière-plan. Confirme ce que tu as réellement suivi.</div>' : "") + timeline;
      controls = block.run_state === "PAUSED" ? '<button class="small primary" data-resume-interval="' + block.block_id + '">Reprendre</button>' : '<button class="small" data-pause-interval="' + block.block_id + '">Pause</button>';
      controls += '<button class="small" data-skip-step="' + block.block_id + '">Passer cette phase</button><button class="small danger" data-stop-interval="' + block.block_id + '">Raccourcir / gêne</button>';
    } else {
      var confirmed = confirmedIntervalSec(block);
      center = '<div class="big-time">' + formatClock(confirmed) + ' / ' + formatClock(block.plan_snapshot.original_total_sec || total) + '</div><p>' + (block.confirmation_state === "VALUE" ? "Réalisé confirmé" : "Guidage écoulé · réalisé non confirmé") + '</p>' + timeline;
      if (block.confirmation_state !== "VALUE") controls = '<button class="small primary" data-confirm-interval="' + block.block_id + '">Confirmer le suivi</button><button class="small" data-unknown-interval="' + block.block_id + '">Laisser inconnu</button>';
    }
    return '<section class="block-card interval"><div class="block-head"><div><span class="eyebrow">Étape ' + block.order + ' / séance</span><h3>' + html(recipe.name) + '</h3></div><span class="block-state">' + blockStatus(block) + '</span></div>' + center + '<div class="block-actions">' + controls + '</div></section>';
  }

  function setResultText(set) {
    var ex = EXERCISES[set.exercise_id] || {};
    var result = set.result_source === "UNKNOWN"
      ? "résultat inconnu"
      : set.result_kind === "LEGACY_UNRESOLVED"
        ? "valeur ancienne " + fmt(set.legacyValue) + (set.legacyUnit ? " " + set.legacyUnit : "")
        : set.result_kind === "DURATION_SEC"
          ? fmt(set.duration_sec, 0) + " s"
          : fmt(set.reps, 0) + " reps";
    var load = set.load && set.load.state === "VALUE" ? " · " + fmt(set.load.value) + " " + loadUnitLabel(set.load.unit) : "";
    var realRest = set.actual_rest_quality && (set.actual_rest_quality.indexOf("CAPTURED") === 0 || set.actual_rest_quality === "TEST_NOT_PERFORMANCE")
      ? (set.actual_rest_quality === "TEST_NOT_PERFORMANCE" ? " · repos TEST " + formatClock(set.actual_rest_sec) : " · repos réel " + formatClock(set.actual_rest_sec))
      : "";
    var configuration = set.configuration_snapshot && set.configuration_snapshot.user_note
      ? " · réglage " + set.configuration_snapshot.user_note
      : "";
    return result + load + configuration + realRest;
  }

  function observationSelect(id, current, kind) {
    current = current || obs("NOT_ENTERED");
    var opts = '<option value="NOT_ENTERED">Non renseigné</option><option value="UNKNOWN"' + (current.state === "UNKNOWN" ? " selected" : "") + '>Je ne sais pas</option>';
    if (kind === "technique") ["Propre", "Moyenne", "Dégradée"].forEach(function (v) { opts += '<option value="VALUE:' + v + '"' + (current.state === "VALUE" && current.value === v ? " selected" : "") + '>' + v + '</option>'; });
    else {
      var max = kind === "rir" ? 5 : 10;
      for (var i = 0; i <= max; i++) opts += '<option value="VALUE:' + i + '"' + (current.state === "VALUE" && Number(current.value) === i ? " selected" : "") + '>' + i + '</option>';
    }
    return '<select id="' + id + '">' + opts + '</select>';
  }

  function resultForm(set, occurrence) {
    var ex = EXERCISES[set.exercise_id], existing = set.state === "RECORDED";
    var value = ex.result_kind === "DURATION_SEC" ? set.duration_sec : set.reps;
    var range = ex.result_kind === "DURATION_SEC" ? occurrence.duration_min_sec + "–" + occurrence.duration_max_sec + " s" : occurrence.reps_min + "–" + occurrence.reps_max + " reps";
    var loadNeeded = ["EXTERNAL", "MACHINE"].indexOf(ex.load_mode) >= 0;
    var configurationNeeded = ["BAND", "TRX", "MACHINE", "BODYWEIGHT"].indexOf(ex.load_mode) >= 0;
    var suggested = suggestedLoad(DATA, PROFILE, occurrence, activeWorkout(DATA, PROFILE) ? activeWorkout(DATA, PROFILE).workout_type : null);
    var prefilledLoad = set.load && set.load.state === "VALUE" ? String(set.load.value).replace(".", ",") : (suggested && suggested.value != null && set.state !== "RECORDED" ? String(suggested.value).replace(".", ",") : "");
    var loadLabel = suggested && suggested.value != null
      ? "Charge conseillée : " + fmt(suggested.value) + " " + loadUnitLabel(suggested.unit)
      : (ex.load_mode === "BAND" ? "Pas de poids inventé pour l’élastique" : "Charge réellement utilisée");
    var configurationPlaceholder = ex.load_mode === "BAND" ? "couleur, résistance, ancrage, distance" : ex.load_mode === "TRX" ? "longueur, pieds, amplitude" : ex.load_mode === "MACHINE" ? "machine, siège, pieds/amplitude" : "assistance, appui, levier ou variante";
    var prefilledConfig = set.configuration_snapshot && set.configuration_snapshot.user_note || (suggested && suggested.configuration_note && set.state !== "RECORDED" ? suggested.configuration_note : "");
    return '<div class="result-form" data-result-form="' + set.set_id + '">' +
      (suggested && suggested.value != null ? '<div class="load-hint">Charge conseillée : <b>' + html(fmt(suggested.value) + " " + loadUnitLabel(suggested.unit)) + '</b>' + (suggested.source === "HISTORY" ? " (dernière séance)" : " (repère de départ)") + ' — tu peux modifier.</div>' : "") +
      (ex.load_mode === "BAND" ? '<div class="load-hint">Élastique : indique la couleur / résistance. Aucun kilo n’est inventé.</div>' : "") +
      '<div class="inputs">' +
      (loadNeeded ? '<div class="field"><label>' + html(loadLabel) + '</label><input id="load_' + set.set_id + '" inputmode="decimal" value="' + html(prefilledLoad) + '" placeholder="' + (suggested && suggested.value != null ? html(String(suggested.value)) : "saisis la charge") + '"></div>' : "") +
      '<div class="field"><label>' + (ex.result_kind === "DURATION_SEC" ? "Secondes réellement tenues" : "Répétitions réelles") + '</label><input id="result_' + set.set_id + '" inputmode="numeric" value="' + (value != null ? html(value) : "") + '" placeholder="cible ' + range + '"></div></div>' +
      (configurationNeeded ? '<div class="field"><label>Réglage / variante réellement utilisé(e)</label><input id="config_' + set.set_id + '" value="' + html(prefilledConfig) + '" placeholder="' + html(configurationPlaceholder) + '"></div>' : '') +
      '<div class="inputs"><div class="field"><label>RIR</label>' + observationSelect("rir_" + set.set_id, set.rir, "rir") + '</div><div class="field"><label>Douleur /10</label>' + observationSelect("pain_" + set.set_id, set.pain, "pain") + '</div><div class="field"><label>Technique</label>' + observationSelect("tech_" + set.set_id, set.technique, "technique") + '</div></div>' +
      '<div class="field"><label>Commentaire facultatif</label><input id="comment_' + set.set_id + '" value="' + html(set.comment || "") + '" placeholder="variante, réglage, gêne…"></div>' +
      '<div class="block-actions"><button class="small primary" data-save-set="' + set.set_id + '">' + (existing ? "Enregistrer la correction" : "Enregistrer") + '</button><button class="small" data-save-set-unknown="' + set.set_id + '">Résultat oublié</button>' + (existing ? '<button class="small" data-cancel-edit-set="1">Annuler</button>' : "") + '</div></div>';
  }

  function findSetForSlot(sets, occurrence, group, side) {
    var suffix = "-" + occurrence.exercise_occurrence_id + "-group-" + group;
    for (var i = sets.length - 1; i >= 0; i--) {
      var s = sets[i];
      if (s.role === "WORK_SET" && s.exercise_occurrence_id === occurrence.exercise_occurrence_id && String(s.set_group_id).slice(-suffix.length) === suffix && s.side === side && s.state !== "CANCELLED") return s;
    }
    return null;
  }

  function setRowHtml(workout, occurrence, occurrenceIndex, item, slotIndex) {
    var sideLabel = item.side === "LEFT" ? "Gauche" : item.side === "RIGHT" ? "Droite" : "";
    var label = sideLabel || ("Série " + item.group);
    var set = item.set;
    var startKey = occurrenceIndex + "|" + slotIndex + "|" + item.group + "|" + item.side;
    if (!set) return '<div class="set-live"><span><b>' + html(label) + '</b><small>pas encore démarré</small></span><span class="set-buttons"><button class="small primary" data-start-set="' + startKey + '">Démarrer</button><button class="small" data-unmeasured-set="' + startKey + '">Sans chrono</button></span></div>';
    if (set.state === "IN_PROGRESS") return '<div class="set-live running"><span><b>' + html(label) + '</b><small>Série en cours · ' + new Date(set.started_at).toLocaleTimeString("fr-FR") + '</small></span><button class="small danger" data-end-set="' + set.set_id + '">Terminer</button></div>';
    if (set.state === "ENDED_PENDING_RESULT" || EDIT_SET_ID === set.set_id) return '<div class="set-live pending"><span><b>' + html(label) + '</b><small>' + (set.timing_quality === "UNKNOWN" ? "début non mesuré" : "Série terminée · saisie du résultat") + '</small></span></div>' + resultForm(set, occurrence);
    return '<div class="set-live recorded"><span><b>' + html(label) + '</b><small>' + html(setResultText(set)) + '</small></span><button class="small" data-edit-set="' + set.set_id + '">Corriger</button></div>';
  }

  function exerciseCard(workout, occurrence, occurrenceIndex, allSets) {
    var ex = EXERCISES[occurrence.exercise_id];
    var unilateral = !!occurrence.sets_per_side;
    var groupsHtml = "";
    var slotIndex = 0;
    for (var group = 1; group <= occurrence.sets; group++) {
      if (unilateral) {
        var left = { group: group, side: "LEFT", set: findSetForSlot(allSets, occurrence, group, "LEFT") };
        var right = { group: group, side: "RIGHT", set: findSetForSlot(allSets, occurrence, group, "RIGHT") };
        var leftHtml = setRowHtml(workout, occurrence, occurrenceIndex, left, slotIndex + 1);
        var rightHtml = setRowHtml(workout, occurrence, occurrenceIndex, right, slotIndex + 2);
        slotIndex += 2;
        groupsHtml += '<div class="set-group" data-set-group="' + group + '"><div class="set-group-title">Série ' + group + ' <small>gauche puis droite</small></div>' + leftHtml + rightHtml + '</div>';
      } else {
        var item = { group: group, side: "BILATERAL", set: findSetForSlot(allSets, occurrence, group, "BILATERAL") };
        slotIndex += 1;
        groupsHtml += setRowHtml(workout, occurrence, occurrenceIndex, item, slotIndex);
      }
    }
    var warmups = allSets.filter(function (s) { return s.exercise_occurrence_id === occurrence.exercise_occurrence_id && s.role === "WARMUP_SET" && s.state !== "CANCELLED"; });
    var warmRows = warmups.map(function (s, i) { return '<div class="warm-row">Approche ' + (i + 1) + ' · ' + (s.state === "RECORDED" ? html(setResultText(s)) : s.state === "IN_PROGRESS" ? '<button class="small danger" data-end-set="' + s.set_id + '">Terminer</button>' : resultForm(s, occurrence)) + '</div>'; }).join("");
    var recommendation = progressionRecommendation(DATA, PROFILE, occurrence, workout.workout_type);
    var suggested = suggestedLoad(DATA, PROFILE, occurrence, workout.workout_type);
    var range = ex.result_kind === "DURATION_SEC" ? occurrence.duration_min_sec + "–" + occurrence.duration_max_sec + " s" : occurrence.reps_min + "–" + occurrence.reps_max + " reps";
    var sci = frenchScientificStatus(occurrence.scientific_status);
    var loadLine = suggested && suggested.value != null
      ? "Charge conseillée " + fmt(suggested.value) + " " + loadUnitLabel(suggested.unit)
      : (ex.load_mode === "BAND" ? (suggested && suggested.configuration_note ? "Dernier élastique : " + suggested.configuration_note : "Élastique : couleur / résistance à saisir, pas de kg inventé") : "Aucune charge de départ enregistrée — saisis-la à la première série");
    return '<div class="ex exercise-v2"><div class="head"><span class="exname">' + (occurrenceIndex + 1) + '. ' + html(ex.name) + (sci ? ' <em>' + html(sci) + '</em>' : '') + '</span><span class="target">' + occurrence.sets + (unilateral ? " séries · gauche + droite" : " séries") + ' · ' + range + '</span></div>' +
      '<div class="last">' + html(loadLine) + ' · repos entre séries ' + formatClock(occurrence.rest_target_sec) + (unilateral ? " (après les deux côtés)" : "") + '</div>' +
      '<div class="verdict ' + (recommendation.action === "TECHNIQUE_FIRST" ? "back" : recommendation.action === "ADD_LOAD" || recommendation.action === "ADD_REP" ? "go" : "keep") + '"><span class="dot"></span><span><b>' + html(frenchPhase(recommendation.phase)) + " · " + html(frenchAction(recommendation.action)) + '</b> · ' + html(recommendation.text) + '</span></div>' +
      '<p class="sethint">' + html(warmupApproachHint(occurrence, suggested)) + '</p>' +
      (warmRows ? '<div class="warm-list">' + warmRows + '</div>' : '') + '<button class="more" data-add-warmup="' + occurrenceIndex + '">+ série d’approche</button><div class="live-sets">' + groupsHtml + '</div></div>';
  }

  function renderStrengthBlock(block, workout) {
    var allSets = setsFor(DATA, workout.workout_id);
    var cards = workout.plan_snapshot.occurrences.map(function (o, i) { return exerciseCard(workout, o, i, allSets); }).join("");
    var plannedGroups = Number(workout.plan_snapshot.target_groups) || plannedSetSlots(workout.plan_snapshot).length;
    var logical = logicalGroupSummary(allSets);
    var extra = Math.max(0, logical.recorded_observations - plannedSetSlots(workout.plan_snapshot).length);
    var controls = block.run_state !== "FINISHED" ? '<button class="btn ghost" data-finish-strength="' + block.block_id + '">' + (logical.complete_groups >= plannedGroups ? "Terminer le bloc musculaire" : "Terminer le bloc partiellement") + '</button>' : "";
    return '<section class="block-card strength"><div class="block-head"><div><span class="eyebrow">Étape ' + block.order + ' / séance</span><h3>' + block.order + '. Musculation</h3></div><span class="block-state">' + logical.complete_groups + '/' + plannedGroups + ' séries' + (logical.partial_groups ? ' · ' + logical.partial_groups + ' côté incomplet' : '') + (extra > 0 ? ' · ' + extra + ' hors plan actuel' : '') + '</span></div><p>Les approches sont de l’échauffement spécifique. Les séries de travail comptent dans le volume. Pour un exercice unilatéral, gauche et droite forment une seule série.</p>' + cards + controls + '</section>';
  }

  function adaptationControls(workout) {
    if (["HAUT_C", "LEGS"].indexOf(workout.workout_type) < 0) return "";
    var settings = DATA.profile_settings[PROFILE] || defaultSettings(PROFILE);
    var choices = workout.workout_type === "HAUT_C"
      ? [{ id: "BASE", label: "Base 13 — 13 séries, version de départ" }, { id: "SHORT", label: "Courte 11 — curl retiré, triceps conservé" }].concat(settings.c_complement_preference !== "NONE" ? [{ id: "WITH_COMPLEMENT", label: "Complément 15 — shrugs ou oiseau" }] : [])
      : [{ id: "RETURN", label: "Reprise 12" }, { id: "NORMAL", label: "Normale 18" }, { id: "SHORT", label: "Courte 10" }];
    var current = workout.workout_type === "HAUT_C" ? (workout.session_variant === "SHORT" ? "SHORT" : workout.session_variant === "NORMAL" ? "WITH_COMPLEMENT" : "BASE") : workout.session_variant;
    var buttons = choices.map(function (choice) {
      return '<button class="small' + (choice.id === current ? ' primary' : '') + '" data-adapt-workout="' + choice.id + '"' + (choice.id === current ? ' disabled' : '') + '>' + choice.label + '</button>';
    }).join("");
    return '<div class="notice"><b>Adapter explicitement le restant :</b><div class="block-actions">' + buttons + '</div><small>Les séries déjà faites restent conservées ; seules les séries encore prévues changent.</small></div>';
  }

  function renderSession() {
    var workout = activeWorkout(DATA, PROFILE);
    if (!workout) {
      if (LAST_FINISHED_ID) { DETAIL_WORKOUT_ID = LAST_FINISHED_ID; VIEW = "workout_detail"; return renderWorkoutDetail(); }
      VIEW = "home"; return renderHome();
    }
    var blocks = blocksFor(DATA, workout.workout_id);
    var content = blocks.map(function (block) {
      if (block.kind === "STRENGTH") return renderStrengthBlock(block, workout);
      if (block.kind === "ROPE" || block.kind === "BIKE_INTERVALS") return renderIntervalBlock(block);
      return renderSimpleBlock(block, workout);
    }).join("");
    var steps = blocks.map(function (block) { return frenchBlockKind(block.kind); }).join(" → ");
    var testBanner = workout.mode === "TEST" ? '<div class="notice warn test-banner"><b>Essai TEST</b> — séance identifiée comme TEST. Les chronos raccourcis ne comptent pas comme de vraies performances.</div>' : "";
    app.innerHTML = '<div class="top session-top"><button class="icon-btn" data-view="home">‹</button><div style="flex:1;min-width:0"><div class="ttl">' + html(workout.plan_snapshot.display_name) + ' · ' + profileLabel() + '</div><div class="sub">' + html(frenchMode(workout.mode)) + ' · ' + html(frenchLifecycle(workout.lifecycle)) + '</div></div><div class="session-clock" data-session-clock>' + formatClock(sessionElapsed(workout)) + '</div></div>' +
      '<div class="pad session-pad">' + testBanner + '<p class="session-steps">' + html(steps) + '</p>' + restCard(workout) + adaptationControls(workout) + content +
      '<button class="btn primary" data-finish-workout="' + workout.workout_id + '">Terminer la séance</button><button class="btn ghost danger" style="margin-top:10px" data-cancel-workout="' + workout.workout_id + '">Annuler en conservant le brouillon</button></div>';
  }

  function workoutSummary(workout) {
    var sets = setsFor(DATA, workout.workout_id), blocks = blocksFor(DATA, workout.workout_id);
    var logical = logicalGroupSummary(sets);
    return { groups: logical.complete_groups, partial_groups: logical.partial_groups, observations: sets.filter(function (s) { return s.state === "RECORDED"; }).length, blocks: blocks };
  }

  function renderSummary() {
    var cutoff = Date.now() - 7 * 86400000;
    var workouts = DATA.workouts.filter(function (w) { return w.profile_id === PROFILE && w.provenance === "NATIVE" && w.lifecycle === "COMPLETED" && new Date(w.started_at).getTime() >= cutoff; });
    var training = workouts.filter(function (w) { return w.mode === "TRAINING"; });
    var testCount = workouts.length - training.length;
    var groups = training.reduce(function (sum, w) { return sum + workoutSummary(w).groups; }, 0);
    var cardio = { rope: 0, bike: 0 };
    training.forEach(function (w) { blocksFor(DATA, w.workout_id).forEach(function (b) { if (b.outcome === "COMPLETED" || b.outcome === "SHORTENED") { var sec = confirmedIntervalSec(b); if (b.kind === "ROPE") cardio.rope += sec; if (b.kind === "BIKE_INTERVALS") cardio.bike += sec; } }); });
    var rows = ["HAUT_A", "HAUT_B", "HAUT_C", "LEGS"].map(function (type) { var list = training.filter(function (w) { return w.workout_type === type; }); return '<div class="sumrow"><span class="k">' + html(type.replace("HAUT_", "Haut ").replace("LEGS", "Jambes")) + '</span><span class="v">' + list.length + ' séance' + (list.length > 1 ? "s" : "") + '</span></div>'; }).join("");
    app.innerHTML = topBar("Tableau de bord réel", profileLabel(), "home") + '<div class="pad"><div class="metric-grid"><div><strong>' + training.length + '</strong><span>séances d’entraînement</span></div><div><strong>' + groups + '</strong><span>séries validées</span></div><div><strong>' + formatClock(cardio.rope) + '</strong><span>corde confirmée</span></div><div><strong>' + formatClock(cardio.bike) + '</strong><span>vélo confirmé</span></div></div>' +
      '<p class="sethint">Fenêtre 7 jours. Les essais TEST (' + testCount + ') et les séries d’approche sont exclus. Le futsal n’est pas converti en séries et n’adapte pas le programme.</p><h2>Répartition</h2>' + rows +
      '<div class="notice info">Les totaux prescrits de référence restent 57/56 avec C Base 13 + jambes 18. Ici, seul le réellement enregistré est compté.</div></div>';
  }

  function renderHistory() {
    var native = DATA.workouts.filter(function (w) { return w.profile_id === PROFILE && w.provenance === "NATIVE"; }).sort(function (a, b) { return new Date(b.started_at) - new Date(a.started_at); });
    var rows = native.length ? native.map(function (w) { var s = workoutSummary(w); return '<button class="lcard" data-workout-detail="' + w.workout_id + '"><span><b>' + html(w.plan_snapshot ? w.plan_snapshot.display_name : w.workout_type) + (w.mode === "TEST" ? " · TEST" : "") + '</b><br><small>' + dateFr(w.started_at) + ' · ' + html(frenchMode(w.mode)) + ' · ' + html(frenchLifecycle(w.lifecycle)) + ' · ' + s.groups + ' séries complètes' + (s.partial_groups ? ' + ' + s.partial_groups + ' côté(s) incomplet(s)' : '') + '</small></span><span class="chev">›</span></button>'; }).join("") : '<div class="empty">Aucune séance V2 pour ' + html(APP_DISPLAY_NAME) + '.</div>';
    var legacyWorkouts = DATA.workouts.filter(function (w) { return w.profile_id === PROFILE && w.provenance === "LEGACY"; }).sort(function (a, b) { return String(b.occurred_at || b.local_date).localeCompare(String(a.occurred_at || a.local_date)); });
    var legacyCount = DATA.legacy_summaries.filter(function (x) { return x.profile_id === PROFILE; }).length;
    var legacyRows = legacyWorkouts.length ? legacyWorkouts.map(function (w) {
      var n = DATA.legacy_summaries.filter(function (s) { return s.workout_id === w.workout_id; }).length;
      return '<button class="lcard" data-workout-detail="' + w.workout_id + '"><span><b>' + html(String(w.workout_type || "Séance").replace(/_/g, " ")) + '</b><br><small>' + dateFr(w.occurred_at || w.local_date) + ' · historique · ' + n + ' résumés</small></span><span class="chev">›</span></button>';
    }).join("") : '<div class="empty">Aucune archive antérieure.</div>';
    app.innerHTML = topBar("Historique", profileLabel(), "home") + '<div class="pad"><h2>Séances V2</h2>' + rows + '<h2>Archive antérieure</h2><div class="notice">' + legacyCount + ' résumés historiques conservés sans fabriquer de séries. Les détails réellement présents restent visibles ; horaires et complétion demeurent inconnus.</div>' + legacyRows + '</div>';
  }

  function renderWorkoutDetail() {
    var workout = workoutById(DATA, DETAIL_WORKOUT_ID);
    if (!workout) { VIEW = "history"; return renderHistory(); }
    var sets = setsFor(DATA, workout.workout_id), blocks = blocksFor(DATA, workout.workout_id), sum = workoutSummary(workout);
    var setRows = sets.length ? sets.map(function (s) {
      var ex = EXERCISES[s.exercise_id] || { name: s.exercise_id };
      var side = frenchSide(s.side);
      return '<div class="hist-row"><span><b>' + html(ex.name) + '</b><br><small>' + html(frenchSetRole(s.role)) + (side ? ' · ' + html(side) : '') + (s.group_index ? ' · série ' + s.group_index : '') + '</small></span><span class="v">' + html(s.state === "RECORDED" ? setResultText(s) : (s.state === "CANCELLED" ? "annulée" : "en attente")) + '</span></div>';
    }).join("") : '<div class="empty">Aucune série détaillée enregistrée.</div>';
    var blockRows = blocks.map(function (b) { return '<div class="sumrow"><span class="k">' + html(frenchBlockKind(b.kind)) + '</span><span class="v">' + html(frenchOutcome(b.outcome)) + (b.plan_snapshot && b.plan_snapshot.recipe ? ' · ' + formatClock(confirmedIntervalSec(b)) : '') + '</span></div>'; }).join("");
    var legacySummaries = DATA.legacy_summaries.filter(function (s) { return s.workout_id === workout.workout_id; });
    var legacyRows = legacySummaries.map(function (s) {
      var a = s.aggregate || {}, ex = EXERCISES[s.exercise_id] || { name: s.exercise_id };
      var result = (a.sets != null ? a.sets + ' séries' : 'séries inconnues') + (a.reps != null ? ' · ' + a.reps + ' ' + (ex.result_kind === "DURATION_SEC" ? 'valeur ancienne ambiguë' : 'reps agrégées') : '') + (a.weight != null ? ' · ' + a.weight + ' ' + (a.unit || 'unité ancienne') : '');
      return '<div class="hist-row"><span><b>' + html(ex.name) + '</b><br><small>' + html(s.migrationStatus) + (s.migrationNote ? ' · ' + html(s.migrationNote) : '') + '</small></span><span class="v">' + html(result) + '</span></div>';
    }).join("");
    var isLegacyWorkout = workout.provenance === "LEGACY";
    app.innerHTML = topBar(workout.plan_snapshot ? workout.plan_snapshot.display_name : String(workout.workout_type || "Séance").replace(/_/g, " "), dateFr(workout.started_at || workout.occurred_at || workout.local_date) + " · " + profileName(workout.profile_id), "history") + '<div class="pad">' + (workout.mode === "TEST" ? '<div class="notice warn"><b>Essai TEST</b> — non compté dans les records ni comme repos réel.</div>' : "") + '<div class="metric-grid"><div><strong>' + formatClock(sessionElapsed(workout)) + '</strong><span>durée totale</span></div><div><strong>' + (isLegacyWorkout ? legacySummaries.length : sum.groups) + '</strong><span>' + (isLegacyWorkout ? 'résumés' : 'séries') + '</span></div><div><strong>' + html(frenchMode(workout.mode)) + '</strong><span>mode</span></div><div><strong>' + html(frenchOutcome(workout.strength_outcome)) + '</strong><span>musculation</span></div></div>' +
      (isLegacyWorkout ? '<div class="notice warn">Séance historique : durée, complétion, rôle approche/travail et certaines unités restent inconnus. Le brut est conservé.</div><h2>Résumés anciens</h2>' + legacyRows : '<h2>Blocs</h2>' + blockRows) +
      '<h2>' + (isLegacyWorkout ? 'Détails de séries réellement présents' : 'Séries') + '</h2>' + setRows + (workout.lifecycle === "CANCELLED" ? '<div class="notice warn">Séance annulée conservée : exclue des records et de l’assiduité.</div>' : "") + '</div>';
  }

  function sparkBars(list) {
    if (!list || list.length < 2) return "";
    var max = Math.max.apply(null, list.map(function (item) { return Number(item.value); }));
    var min = Math.min.apply(null, list.map(function (item) { return Number(item.value); }));
    var span = Math.max(0.1, max - min);
    return '<div class="spark" aria-hidden="true">' + list.slice(-12).map(function (item, idx, arr) {
      var h = 8 + Math.round(44 * (Number(item.value) - min) / span);
      return '<div class="b' + (idx === arr.length - 1 ? " lastb" : "") + '" style="height:' + h + 'px" title="' + html(item.date + " · " + item.value) + '"></div>';
    }).join("") + "</div>";
  }

  function renderMeasurements() {
    var rows = DATA.body_measurements.filter(function (m) { return m.profile_id === PROFILE; }).sort(function (a, b) { return b.local_date.localeCompare(a.local_date) || b.recorded_at.localeCompare(a.recorded_at); });
    var series = {}, latest = {};
    rows.slice().reverse().forEach(function (m) { Object.keys(m.values || {}).forEach(function (key) { if (!series[key]) series[key] = []; series[key].push({ value: m.values[key].value, unit: m.values[key].unit, date: m.local_date }); }); });
    Object.keys(series).forEach(function (key) { var list = series[key], last = list[list.length - 1]; latest[key] = Object.assign({}, last, { delta: list.length > 1 && list[list.length - 2].unit === last.unit ? Number(last.value) - Number(list[list.length - 2].value) : null }); });
    var weightSeries = series.body_weight_kg || [];
    var lastWeight = latest.body_weight_kg;
    var weightCard = lastWeight
      ? '<div class="measure-hero"><div><span class="eyebrow">Poids</span><strong>' + fmt(lastWeight.value) + ' kg</strong><small>' + html(lastWeight.date) + (lastWeight.delta != null ? " · " + (lastWeight.delta > 0 ? "+" : "") + fmt(lastWeight.delta) + " kg vs précédent" : "") + '</small></div>' + sparkBars(weightSeries) + '</div>'
      : '<div class="notice">Pas encore de poids enregistré. Un relevé hebdo suffit.</div>';
    var compareKeys = ["waist_navel_cm", "chest_cm", "upper_arm_right_cm", "thigh_right_cm"];
    var compare = compareKeys.map(function (key) {
      var def = MEASUREMENT_FIELDS.find(function (f) { return f[0] === key; });
      var last = latest[key];
      if (!last) return "";
      return '<div class="sumrow"><span class="k">' + html(def[1]) + '</span><span class="v">' + fmt(last.value) + " " + last.unit + (last.delta != null ? " · " + (last.delta > 0 ? "+" : "") + fmt(last.delta) : "") + "</span></div>";
    }).join("");
    var fields = MEASUREMENT_FIELDS.map(function (f) { var last = latest[f[0]], delta = last && last.delta != null ? ' · Δ ' + (last.delta > 0 ? '+' : '') + fmt(last.delta) + ' depuis le relevé précédent' : ''; return '<div class="field"><label>' + html(f[1]) + ' (' + f[2] + ')' + (last ? ' · dernier ' + fmt(last.value) + ' le ' + html(last.date) + delta : '') + '</label><input id="measure_' + f[0] + '" inputmode="decimal" placeholder="' + (last ? fmt(last.value) : "facultatif") + '"></div>'; }).join("");
    var history = rows.length ? rows.map(function (m) { var values = Object.keys(m.values).map(function (key) { var def = MEASUREMENT_FIELDS.find(function (f) { return f[0] === key; }); return (def ? def[1] : key) + ' ' + fmt(m.values[key].value) + ' ' + m.values[key].unit; }).join(" · "); return '<div class="hist-row"><span><b>' + html(m.local_date) + '</b><br><small>' + html(m.conditions || "Conditions non précisées") + '</small></span><span class="v measure-values">' + html(values) + '</span></div>'; }).join("") : '<div class="empty">Aucune mesure.</div>';
    app.innerHTML = topBar("Poids et mensurations", profileLabel(), "home") + '<div class="pad">' + weightCard + (compare ? '<h2>Évolution visible</h2>' + compare : "") + '<p class="sethint">Saisie simple : une seule valeur suffit. Vide n’est pas zéro. Deux relevés le même jour restent distincts.</p><h2>Nouveau relevé</h2><div class="field"><label>Date civile</label><input type="date" id="measurement_date" value="' + todayLocal() + '"></div>' + fields + '<div class="field"><label>Conditions / repère facultatif</label><input id="measurement_notes" placeholder="matin, à jeun, bras relâché…"></div><button class="btn primary" data-save-measurement="1">Enregistrer ce relevé</button><h2>Historique</h2>' + history + '<div class="notice">Aucune masse musculaire ni masse grasse n’est inférée automatiquement.</div></div>';
  }

  function weeklyTargets(settings) {
    settings = settings || {};
    function one(p) {
      var s = settings[p] || defaultSettings(p);
      return planFor(p, "HAUT_A", s).target_groups + planFor(p, "HAUT_B", s).target_groups + planFor(p, "HAUT_C", s).target_groups + planFor(p, "LEGS", s).target_groups;
    }
    return { moi: one("moi"), pote: one("pote") };
  }

  function renderOptions() {
    var s = DATA.profile_settings[PROFILE] || defaultSettings(PROFILE), totals = weeklyTargets(DATA.profile_settings);
    app.innerHTML = topBar("Options du programme", profileLabel(), "home") + '<div class="pad">' +
      '<div class="notice info"><b>Référence stable :</b> Haut C Base 13 (13 séries de travail). Le complément n’est jamais automatique. Jambes reste en reprise tant que tu n’as pas explicitement choisi la cible suivante.</div>' +
      '<h2>Haut C</h2><div class="field"><label>Version</label><select id="opt_c_variant"><option value="BASE"' + (s.c_variant === "BASE" ? " selected" : "") + '>Base 13 — recommandée au départ</option><option value="WITH_COMPLEMENT"' + (s.c_variant === "WITH_COMPLEMENT" ? " selected" : "") + '>Avec complément 15</option><option value="SHORT"' + (s.c_variant === "SHORT" ? " selected" : "") + '>Courte 11 — curl retiré, triceps conservé</option></select></div>' +
      '<div class="field"><label>Complément personnel (actif seulement en C15)</label><select id="opt_complement"><option value="NONE"' + (s.c_complement_preference === "NONE" ? " selected" : "") + '>Aucun</option><option value="SHRUG"' + (s.c_complement_preference === "SHRUG" ? " selected" : "") + '>Shrugs · trapèzes supérieurs</option><option value="REAR_DELT"' + (s.c_complement_preference === "REAR_DELT" ? " selected" : "") + '>Oiseau appuyé · deltoïdes arrière</option></select></div>' +
      '<div class="field"><label>Emplacement triceps — substitution, jamais ajout</label><select id="opt_triceps"><option value="dev_serre"' + (s.triceps_exercise === "dev_serre" ? " selected" : "") + '>Développé serré · référence initiale</option><option value="ext_triceps_overhead"' + (s.triceps_exercise === "ext_triceps_overhead" ? " selected" : "") + '>Extension au-dessus de la tête · TEST</option></select></div>' +
      '<h2>Jambes</h2><div class="field"><label>Version du samedi</label><select id="opt_legs"><option value="RETURN"' + (s.legs_variant === "RETURN" ? " selected" : "") + '>Reprise · 12 maximum</option><option value="NORMAL"' + (s.legs_variant === "NORMAL" ? " selected" : "") + '>Normale · 18</option><option value="SHORT"' + (s.legs_variant === "SHORT" ? " selected" : "") + '>Courte · 10 (après reprise)</option></select></div>' +
      '<h2>Timers</h2><label class="toggle-row"><input type="checkbox" id="opt_sound"' + (s.sound_enabled ? " checked" : "") + '> Son léger aux transitions</label><label class="toggle-row"><input type="checkbox" id="opt_wake"' + (s.wake_lock_enabled ? " checked" : "") + '> Demander à garder l’écran allumé</label>' +
      '<div class="notice warn">Le chrono se reconstruit avec les horodatages après arrière-plan. Le son, la vibration et le maintien d’écran dépendent du navigateur et ne sont pas garantis écran verrouillé ou navigateur fermé.</div>' +
      '<div class="notice"><b>Total actuel :</b> ' + (PROFILE === "moi" ? totals.moi : totals.pote) + ' séries prescrites. Référence après reprise : 57 pour Mathieu, 56 pour Ryan.</div><button class="btn primary" data-save-options="1">Appliquer aux futures séances</button>' +
      '<p class="sethint">Une séance déjà démarrée conserve son instantané. L’extension triceps ouvre un nouveau contexte de calibration.</p></div>';
  }

  function migrationReportHtml() {
    var r = DATA.migration_report;
    if (!r) return '<div class="notice">Aucune archive historique importée dans ce jeu de données.</div>';
    return '<div class="metric-grid"><div><strong>' + r.summary_entries + '</strong><span>résumés</span></div><div><strong>' + r.detailed_set_observations + '</strong><span>détails de séries</span></div><div><strong>' + r.aggregate_entries_without_detail + '</strong><span>agrégats seuls</span></div><div><strong>' + r.workout_groups + '</strong><span>groupes séance</span></div></div><p class="sethint">' + r.readiness_entries + ' états historiques · ' + r.historical_plan_models + ' modèles de séance · empreinte ' + html(String(r.source_sha256).slice(0, 12)) + '…</p>';
  }
  function renderData() {
    var hasRollback = !!localStorage.getItem(DATASET_ROLLBACK_KEY);
    var conflicts = DATA.extensions && DATA.extensions.import_conflicts || [];
    var conflictRows = conflicts.length ? conflicts.slice(-10).reverse().map(function (conflict) { return '<div class="hist-row"><span><b>' + html(conflict.collection) + '</b><br><small>' + html(conflict.record_id) + ' · ' + html(conflict.status || "UNRESOLVED") + '</small></span><span class="v">conservé</span></div>'; }).join("") : '<div class="empty">Aucun conflit d’import.</div>';
    app.innerHTML = topBar("Sauvegarde", "Format V2 non ambigu", "home") + '<div class="pad"><div class="notice info"><b>Format actuel :</b> <code>format: coach-muscu-backup</code> + <code>schemaVersion: 2</code>. L’ancien <code>v:2</code> reste reconnu comme LEGACY.</div><h2>Exporter</h2>' +
      '<button class="lcard" data-export="FULL"><span>Sauvegarde complète V2</span><span class="chev">↓</span></button><button class="lcard" data-export="PROFILE"><span>Profil ' + profileLabel() + ' uniquement</span><span class="chev">↓</span></button><button class="lcard" data-export-csv="1"><span>Journal des séries réelles (.csv)</span><span class="chev">↓</span></button>' +
      '<textarea id="data_text" readonly placeholder="Le dernier export ou rapport apparaît ici…">' + html(DATA_TEXT) + '</textarea><h2>Importer</h2><input type="file" id="import_file" accept="application/json,.json"><textarea id="import_text" placeholder="Ou colle une sauvegarde JSON ici…"></textarea><button class="btn ghost" data-import="1">Analyser puis importer</button>' +
      (hasRollback ? '<button class="btn ghost danger" style="margin-top:10px" data-rollback="1">Restaurer le jeu précédent</button>' : "") + '<h2>Rapport de migration</h2>' + migrationReportHtml() + '<div class="notice warn">L’archive brute ancienne reste dans l’export V2. Les 179 agrégats sans détail ne deviennent jamais des séries fictives.</div><h2>Conflits d’import (' + conflicts.length + ')</h2><p class="sethint">Un même identifiant avec deux contenus différents n’est jamais écrasé silencieusement. Les deux versions restent dans l’export complet jusqu’à résolution.</p>' + conflictRows + '</div>';
  }

  function exportCsv() {
    var rows = [["profil", "workout_id", "date", "seance", "mode", "exercice", "variante", "configuration", "role", "groupe", "cote", "charge", "unite", "type_resultat", "reps", "duree_sec", "valeur_ancienne", "unite_ancienne", "RIR_etat", "RIR", "douleur_etat", "douleur", "debut", "fin", "repos_reel_sec", "qualite_repos"]];
    DATA.sets.forEach(function (s) { var w = workoutById(DATA, s.workout_id); if (!w || s.profile_id !== PROFILE) return; rows.push([s.profile_id, s.workout_id, w.local_date || "", w.workout_type, w.mode, s.exercise_id, s.variant_id || "", s.configuration_snapshot ? stableStringify(s.configuration_snapshot) : "", s.role, s.set_group_id, s.side, s.load && s.load.value != null ? s.load.value : "", s.load ? s.load.unit || "" : "", s.result_kind || "", s.reps == null ? "" : s.reps, s.duration_sec == null ? "" : s.duration_sec, s.legacyValue == null ? "" : s.legacyValue, s.legacyUnit || "", s.rir ? s.rir.state : "", s.rir && s.rir.state === "VALUE" ? s.rir.value : "", s.pain ? s.pain.state : "", s.pain && s.pain.state === "VALUE" ? s.pain.value : "", s.started_at || "", s.ended_at || "", s.actual_rest_sec == null ? "" : s.actual_rest_sec, s.actual_rest_quality || ""]); });
    return rows.map(function (row) { return row.map(function (cell) { return '"' + String(cell == null ? "" : cell).replace(/"/g, '""') + '"'; }).join(";"); }).join("\n");
  }
  function download(name, text, type) {
    var blob = new Blob([text], { type: type || "text/plain" }); var url = URL.createObjectURL(blob); var a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1000);
  }

  function renderCourse() {
    var runs = (DATA.courses[PROFILE] && DATA.courses[PROFILE].runs || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    var history = runs.length ? runs.map(function (r) {
      var bits = [];
      if (r.duree) bits.push(fmt(r.duree) + " min");
      if (r.distance) bits.push(fmt(r.distance) + " km");
      if (r.rpe != null) bits.push("RPE " + fmt(r.rpe, 0));
      if (r.hr_avg) bits.push("FC moy. " + fmt(r.hr_avg, 0));
      return '<div class="hist-row"><span><b>' + html(r.terrain === "futsal" ? "Futsal 5 vs 5" : (r.terrain || r.mode || "Activité")) + '</b><br><small>' + html(String(r.date || "").slice(0, 10)) + (r.jambes != null ? " · jambes " + fmt(r.jambes, 0) + "/10" : "") + (r.genou != null ? " · genou " + fmt(r.genou, 0) + "/10" : "") + (r.comment ? " · " + html(r.comment) : "") + '</small></span><span class="v">' + html(bits.join(" · ") || "sans distance") + '</span></div>';
    }).join("") : '<div class="empty">Aucune activité enregistrée.</div>';
    app.innerHTML = topBar("Course / futsal", profileLabel(), "home") + '<div class="pad"><div class="notice">Le futsal et la course sont un journal de récupération. Ils n’adaptent pas automatiquement le programme de musculation.</div>' +
      '<div class="field"><label>Date</label><input type="date" id="course_date" value="' + todayLocal() + '"></div>' +
      '<div class="field"><label>Activité</label><select id="course_terrain"><option value="futsal">Futsal 5 vs 5</option><option value="plat">Course plate</option><option value="vallonné">Course vallonnée</option><option value="montée">Montée</option></select></div>' +
      '<div class="inputs"><div class="field"><label>Durée min</label><input id="course_duration" inputmode="decimal" placeholder="ex. 60"></div><div class="field"><label>Intensité ressentie /10</label><input id="course_rpe" inputmode="numeric" placeholder="1–10"></div></div>' +
      '<div class="inputs"><div class="field"><label>Jambes lourdes /10</label><input id="course_legs" inputmode="numeric" placeholder="0–10"></div><div class="field"><label>Douleur genou /10</label><input id="course_knee" inputmode="numeric" placeholder="0–10"></div></div>' +
      '<div class="inputs"><div class="field"><label>FC moyenne (facultatif)</label><input id="course_hr_avg" inputmode="numeric" placeholder="bpm"></div><div class="field"><label>FC max (facultatif)</label><input id="course_hr_max" inputmode="numeric" placeholder="bpm"></div></div>' +
      '<div class="field"><label>Distance km (facultatif — jamais obligatoire pour un futsal)</label><input id="course_distance" inputmode="decimal" placeholder="laisser vide si inconnu"></div>' +
      '<div class="field"><label>Commentaire</label><input id="course_comment" placeholder="facultatif"></div>' +
      '<button class="btn primary" data-save-course="1">Enregistrer l’activité</button><h2>Historique</h2>' + history + '</div>';
  }

  function parseObservationSelect(value) {
    if (!value || value === "NOT_ENTERED") return obs("NOT_ENTERED");
    if (value === "UNKNOWN") return obs("UNKNOWN");
    var parts = value.split(":"); var v = parts.slice(1).join(":"); var n = finiteNumber(v);
    return obs("VALUE", n == null ? v : n);
  }
  function occurrenceByIndex(workout, index) { return workout.plan_snapshot.occurrences[Number(index)]; }
  function parseSetKey(raw) { var p = String(raw).split("|"); return { occurrenceIndex: Number(p[0]), setIndex: Number(p[1]), group: Number(p[2]), side: p[3] }; }
  function ensureStrengthRunning(workout) {
    var block = blocksFor(DATA, workout.workout_id).find(function (b) { return b.kind === "STRENGTH"; });
    if (block && block.run_state === "PLANNED") { block.run_state = "IN_PROGRESS"; block.started_at = nowIso(); }
  }

  async function requestWakeLock() {
    var settings = DATA.profile_settings[PROFILE];
    if (!settings || !settings.wake_lock_enabled || wakeLock) return;
    if (!navigator.wakeLock) { toast("Maintien d’écran indisponible ; le chrono restera reconstructible.", true); return; }
    try { wakeLock = await navigator.wakeLock.request("screen"); wakeLock.addEventListener("release", function () { wakeLock = null; }); }
    catch (ignore) { toast("Maintien d’écran indisponible ; le chrono restera reconstructible.", true); }
  }
  function releaseWakeLock() { if (wakeLock) { try { wakeLock.release(); } catch (ignore) {} wakeLock = null; } }
  function beep() {
    if (!(DATA.profile_settings[PROFILE] || {}).sound_enabled) return;
    try { var Ctx = window.AudioContext || window.webkitAudioContext; var ctx = new Ctx(); var osc = ctx.createOscillator(), gain = ctx.createGain(); osc.frequency.value = 880; gain.gain.value = 0.04; osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.12); } catch (ignore) {}
  }

  function updateLiveUI() {
    var workout = activeWorkout(DATA, PROFILE); if (!workout) return;
    $all("[data-session-clock]").forEach(function (el) { el.textContent = formatClock(sessionElapsed(workout)); });
    if (workout.active_rest) {
      var elapsed = Math.max(0, Math.floor((Date.now() - new Date(workout.active_rest.started_at).getTime()) / 1000)); var target = Number(workout.active_rest.target_adjusted_sec || 0); var el = $("[data-rest-clock]");
      if (el) {
        if (target <= 0) el.textContent = (workout.active_rest.kind === "INTER_SIDE") ? "Change de côté, puis enchaîne" : "Tu peux enchaîner";
        else el.textContent = elapsed < target ? formatClock(target - elapsed) + " restant" : "+" + formatClock(elapsed - target) + " après cible";
      }
    }
    blocksFor(DATA, workout.workout_id).forEach(function (block) {
      if ((block.kind !== "ROPE" && block.kind !== "BIKE_INTERVALS") || block.run_state !== "IN_PROGRESS") return;
      var pos = intervalPosition(block), el = $('[data-block-clock="' + block.block_id + '"]');
      if (el && pos && pos.step) el.textContent = formatClock(Math.max(0, pos.step.duration_sec - pos.timer.step_elapsed_sec));
      if (pos && lastAudibleStep[block.block_id] != null && lastAudibleStep[block.block_id] !== pos.timer.step_index) beep();
      if (pos) lastAudibleStep[block.block_id] = pos.timer.step_index;
      if (pos && pos.timer.finished) { syncIntervalBlock(DATA, block.block_id, Date.now(), true); saveDataset(true); render(); }
    });
  }

  function bindCommon() {
    $all("[data-view]").forEach(function (el) { el.onclick = function () { VIEW = el.getAttribute("data-view"); EDIT_SET_ID = null; render(); window.scrollTo(0, 0); }; });
    $all("[data-profile]").forEach(function (el) { el.onclick = function () { toast("Cette application est réservée à " + APP_DISPLAY_NAME + ".", true); }; });
    $all("[data-prepare]").forEach(function (el) { el.onclick = function () { if (activeWorkout(DATA, PROFILE)) { toast("Termine ou reprends d’abord la séance en cours.", true); return; } SELECTED_TYPE = el.getAttribute("data-prepare"); VIEW = "prepare"; render(); window.scrollTo(0, 0); }; });
    $all("[data-resume]").forEach(function (el) { el.onclick = function () { VIEW = "session"; render(); }; });
    $all("[data-adapt-workout]").forEach(function (el) { el.onclick = function () { var variant = el.getAttribute("data-adapt-workout"), w = activeWorkout(DATA, PROFILE); if (!w) return; if (!confirm("Adapter seulement le restant de cette séance ? Les séries déjà enregistrées seront conservées.")) return; mutate(function () { adaptWorkoutPlan(DATA, w.workout_id, variant, "USER_SELECTED_IN_SESSION", Date.now()); }); }; });
    $all("[data-mode-choice]").forEach(function (el) { el.onclick = function () { $all("[data-mode-choice]").forEach(function (b) { b.setAttribute("aria-pressed", b === el ? "true" : "false"); }); }; });
    var startWorkoutBtn = $("[data-start-workout]"); if (startWorkoutBtn) startWorkoutBtn.onclick = function () {
      var readiness = {}, valid = true;
      ["sleep_hours", "fatigue", "energy", "knee_pain", "shoulder_pain", "back_pain"].forEach(function (id) { var state = $("#" + id + "_state").value, value = $("#" + id + "_value").value, number = finiteNumber(value), max = id === "sleep_hours" ? 24 : 10; if (state === "VALUE" && (number == null || number < 0 || number > max)) { valid = false; return; } readiness[id] = observationFromInput(state, value); });
      if (!valid) { toast("Une valeur d’état est invalide.", true); return; }
      readiness.comment = $("#readiness_comment").value || "";
      var modeBtn = $('[data-mode-choice][aria-pressed="true"]'); var mode = modeBtn ? modeBtn.getAttribute("data-mode-choice") : "TRAINING";
      var w = mutate(function () { return startWorkout(DATA, PROFILE, SELECTED_TYPE, mode, readiness); }, { noRender: true });
      if (w) { VIEW = "session"; render(); window.scrollTo(0, 0); }
    };
    $all("[data-complete-block]").forEach(function (el) { el.onclick = function () { mutate(function () { completeSimpleBlock(DATA, el.getAttribute("data-complete-block"), "COMPLETED"); }); }; });
    $all("[data-skip-block]").forEach(function (el) { el.onclick = function () { mutate(function () { completeSimpleBlock(DATA, el.getAttribute("data-skip-block"), "SKIPPED"); }); }; });
    $all("[data-start-interval]").forEach(function (el) { el.onclick = function () { mutate(function () { beginIntervalBlock(DATA, el.getAttribute("data-start-interval")); requestWakeLock(); }); }; });
    $all("[data-pause-interval]").forEach(function (el) { el.onclick = function () { mutate(function () { pauseIntervalBlock(DATA, el.getAttribute("data-pause-interval"), Date.now()); }); }; });
    $all("[data-resume-interval]").forEach(function (el) { el.onclick = function () { mutate(function () { resumeIntervalBlock(DATA, el.getAttribute("data-resume-interval"), Date.now()); requestWakeLock(); }); }; });
    $all("[data-skip-step]").forEach(function (el) { el.onclick = function () { mutate(function () { skipIntervalStep(DATA, el.getAttribute("data-skip-step"), Date.now()); }); }; });
    $all("[data-stop-interval]").forEach(function (el) { el.onclick = function () { if (!confirm("Raccourcir ce bloc ? Le temps guidé sera conservé et le réalisé devra être confirmé.")) return; mutate(function () { var b = finishIntervalBlock(DATA, el.getAttribute("data-stop-interval"), "CONFIRMED", Date.now()); b.stop_reason = "USER_SHORTENED_OR_DISCOMFORT"; releaseWakeLock(); }); }; });
    $all("[data-confirm-interval]").forEach(function (el) { el.onclick = function () { mutate(function () { finishIntervalBlock(DATA, el.getAttribute("data-confirm-interval"), "CONFIRMED", Date.now()); releaseWakeLock(); }); }; });
    $all("[data-unknown-interval]").forEach(function (el) { el.onclick = function () { mutate(function () { finishIntervalBlock(DATA, el.getAttribute("data-unknown-interval"), "UNKNOWN", Date.now()); releaseWakeLock(); }); }; });
    $all("[data-add-rest]").forEach(function (el) { el.onclick = function () { var w = activeWorkout(DATA, PROFILE); if (w) mutate(function () { addRestTime(DATA, w.workout_id, Number(el.getAttribute("data-add-rest"))); }); }; });
    $all("[data-start-set]").forEach(function (el) { el.onclick = function () { var w = activeWorkout(DATA, PROFILE), key = parseSetKey(el.getAttribute("data-start-set")), occurrence = occurrenceByIndex(w, key.occurrenceIndex); mutate(function () { ensureStrengthRunning(w); startSet(DATA, w.workout_id, occurrence, key.setIndex, key.group, key.side, "WORK_SET", Date.now()); }); }; });
    $all("[data-unmeasured-set]").forEach(function (el) { el.onclick = function () { var w = activeWorkout(DATA, PROFILE), key = parseSetKey(el.getAttribute("data-unmeasured-set")), occurrence = occurrenceByIndex(w, key.occurrenceIndex); mutate(function () { ensureStrengthRunning(w); var s = startSet(DATA, w.workout_id, occurrence, key.setIndex, key.group, key.side, "WORK_SET", Date.now()); s.started_at = null; s.ended_at = null; s.timing_quality = "UNKNOWN"; s.state = "ENDED_PENDING_RESULT"; w.active_set_id = null; w.active_rest = null; }); }; });
    $all("[data-add-warmup]").forEach(function (el) { el.onclick = function () { var w = activeWorkout(DATA, PROFILE), index = Number(el.getAttribute("data-add-warmup")), occurrence = occurrenceByIndex(w, index), existing = setsFor(DATA, w.workout_id).filter(function (s) { return s.exercise_occurrence_id === occurrence.exercise_occurrence_id && s.role === "WARMUP_SET"; }); mutate(function () { ensureStrengthRunning(w); startSet(DATA, w.workout_id, occurrence, existing.length + 1, "warmup-" + (existing.length + 1), "NOT_APPLICABLE", "WARMUP_SET", Date.now()); }); }; });
    $all("[data-end-set]").forEach(function (el) { el.onclick = function () { mutate(function () { endSet(DATA, el.getAttribute("data-end-set"), Date.now()); }); }; });
    $all("[data-edit-set]").forEach(function (el) { el.onclick = function () { EDIT_SET_ID = el.getAttribute("data-edit-set"); render(); }; });
    $all("[data-cancel-edit-set]").forEach(function (el) { el.onclick = function () { EDIT_SET_ID = null; render(); }; });
    function saveSetFromButton(el, unknown) {
      var id = el.getAttribute(unknown ? "data-save-set-unknown" : "data-save-set"), set = DATA.sets.find(function (s) { return s.set_id === id; }); if (!set) return;
      var value = $("#result_" + id).value, loadValue = $("#load_" + id) ? $("#load_" + id).value : null;
      var configurationNote = $("#config_" + id) ? $("#config_" + id).value : null;
      var rir = parseObservationSelect($("#rir_" + id).value), pain = parseObservationSelect($("#pain_" + id).value), technique = parseObservationSelect($("#tech_" + id).value), comment = $("#comment_" + id).value;
      var result = { value: value, load_value: loadValue, configuration_note: configurationNote, result_unknown: unknown, rir: rir, pain: pain, technique: technique, comment: comment, idempotency_key: [id, unknown, value, loadValue, configurationNote, rir.state, rir.value, pain.state, pain.value, technique.state, technique.value, comment].join("|") };
      var saved = mutate(function () { return recordSet(DATA, id, result, Date.now()); }, { noRender: true }); if (saved) { EDIT_SET_ID = null; render(); }
    }
    $all("[data-save-set]").forEach(function (el) { el.onclick = function () { saveSetFromButton(el, false); }; });
    $all("[data-save-set-unknown]").forEach(function (el) { el.onclick = function () { saveSetFromButton(el, true); }; });
    $all("[data-finish-strength]").forEach(function (el) { el.onclick = function () { var w = activeWorkout(DATA, PROFILE), planned = plannedSetSlots(w.plan_snapshot).length, recorded = completedPlannedSlots(DATA, w).length; if (recorded < planned && !confirm("Terminer le bloc musculaire partiellement ? Les séries restantes ne seront pas comptées.")) return; mutate(function () { completeSimpleBlock(DATA, el.getAttribute("data-finish-strength"), recorded >= planned ? "COMPLETED" : "SHORTENED"); }); }; });
    $all("[data-finish-workout]").forEach(function (el) { el.onclick = function () { if (!confirm("Terminer la séance maintenant ? Les blocs non visités seront marqués passés.")) return; var w = mutate(function () { return finishWorkout(DATA, el.getAttribute("data-finish-workout"), "COMPLETED", Date.now()); }, { noRender: true }); if (w) { LAST_FINISHED_ID = w.workout_id; DETAIL_WORKOUT_ID = w.workout_id; VIEW = "workout_detail"; releaseWakeLock(); render(); window.scrollTo(0, 0); } }; });
    $all("[data-cancel-workout]").forEach(function (el) { el.onclick = function () { if (!confirm("Annuler la séance ? Les données restent conservées avec le statut CANCELLED.")) return; var w = mutate(function () { return finishWorkout(DATA, el.getAttribute("data-cancel-workout"), "CANCELLED", Date.now()); }, { noRender: true }); if (w) { DETAIL_WORKOUT_ID = w.workout_id; VIEW = "workout_detail"; releaseWakeLock(); render(); } }; });
    $all("[data-workout-detail]").forEach(function (el) { el.onclick = function () { DETAIL_WORKOUT_ID = el.getAttribute("data-workout-detail"); VIEW = "workout_detail"; render(); window.scrollTo(0, 0); }; });
    var saveMeasurement = $("[data-save-measurement]"); if (saveMeasurement) saveMeasurement.onclick = function () { var input = {}; MEASUREMENT_FIELDS.forEach(function (f) { input[f[0]] = $("#measure_" + f[0]).value; }); var m = mutate(function () { return addMeasurement(DATA, PROFILE, $("#measurement_date").value || todayLocal(), input, $("#measurement_notes").value); }, { noRender: true }); if (m) { toast("Relevé enregistré ✓"); render(); } };
    var saveOptions = $("[data-save-options]"); if (saveOptions) saveOptions.onclick = function () { var c = $("#opt_c_variant").value, comp = $("#opt_complement").value; if (c === "WITH_COMPLEMENT" && comp === "NONE") { toast("Choisis shrugs ou oiseau pour activer C15.", true); return; } mutate(function () { DATA.profile_settings[PROFILE] = Object.assign({}, DATA.profile_settings[PROFILE] || {}, { profile_id: PROFILE, c_variant: c, c_complement_preference: comp, triceps_exercise: $("#opt_triceps").value, legs_variant: $("#opt_legs").value, sound_enabled: $("#opt_sound").checked, wake_lock_enabled: $("#opt_wake").checked }); refreshPrograms(DATA); touch(DATA); }); toast("Options appliquées aux futures séances ✓"); };
    $all("[data-export]").forEach(function (el) { el.onclick = function () { var scope = el.getAttribute("data-export"), out = exportDataset(DATA, scope, PROFILE), text = JSON.stringify(out, null, 2); DATA_TEXT = text; download("coach-muscu-v2-" + scope.toLowerCase() + ".json", text, "application/json"); toast("Sauvegarde V2 exportée ✓"); render(); }; });
    var exportCsvBtn = $("[data-export-csv]"); if (exportCsvBtn) exportCsvBtn.onclick = function () { var csv = exportCsv(); DATA_TEXT = csv; download("coach-muscu-v2-series-" + PROFILE + ".csv", "\ufeff" + csv, "text/csv"); toast("CSV exporté ✓"); render(); };
    var fileInput = $("#import_file"); if (fileInput) fileInput.onchange = function () { var file = fileInput.files && fileInput.files[0]; if (!file) return; var reader = new FileReader(); reader.onload = function () { $("#import_text").value = String(reader.result || ""); }; reader.readAsText(file); };
    var importBtn = $("[data-import]"); if (importBtn) importBtn.onclick = async function () { if (!ensureEditable()) return; var raw = $("#import_text").value.trim(); if (!raw) { toast("Choisis un fichier ou colle le JSON.", true); return; } var parsed; try { parsed = JSON.parse(raw); } catch (err) { toast("JSON invalide.", true); return; } try {
      var candidate;
      if (isV2(parsed)) { validateDataset(parsed); candidate = parsed; }
      else if (isLegacy(parsed)) { candidate = await migrateLegacy(parsed, raw); var hash = candidate.migration_report.source_sha256; if (DATA.legacy_archives.some(function (a) { return a.sha256 === hash; })) { toast("Cette archive a déjà été importée : aucun doublon."); return; } }
      else throw new Error("FORMAT_LEGACY_NON_RECONNU");
      candidate = prepareIncomingForProfile(candidate, APP_PROFILE_ID);
      var report = candidate.migration_report, initialReplace = isPristineDataset(DATA);
      var mergedResult = initialReplace ? { data: deepClone(candidate), stats: { added: 0, identical: 0, conflicts: 0 } } : mergeV2Dataset(DATA, candidate);
      if (!initialReplace && !mergedResult.stats.added && !mergedResult.stats.conflicts) { toast("Import identique : aucun doublon ajouté."); return; }
      var message = report ? "Archive LEGACY reconnue : " + report.summary_entries + " résumés, " + report.detailed_set_observations + " détails, " + report.aggregate_entries_without_detail + " agrégats sans détail. " : "Sauvegarde V2 valide. ";
      message += initialReplace ? "Installer ce jeu après création d’un retour arrière ?" : "Fusionner " + mergedResult.stats.added + " élément(s) et conserver " + mergedResult.stats.conflicts + " conflit(s) visible(s), après création d’un retour arrière ?";
      if (!confirm(message)) return;
      localStorage.setItem(DATASET_ROLLBACK_KEY, JSON.stringify(DATA)); DATA = mergedResult.data; if (!DATA.extensions) DATA.extensions = { last_active_profile: APP_PROFILE_ID }; DATA.extensions.last_active_profile = APP_PROFILE_ID; DATA.extensions.owner_profile_id = APP_PROFILE_ID; refreshPrograms(DATA); PROFILE = APP_PROFILE_ID; saveDataset(); DATA_TEXT = JSON.stringify({ mode: initialReplace ? "INITIAL_REPLACE" : "MERGE", migration_report: report || null, merge: mergedResult.stats }, null, 2); toast(mergedResult.stats.conflicts ? "Import terminé avec conflits conservés" : "Import terminé ✓", !!mergedResult.stats.conflicts); render();
    } catch (err2) { toast(humanError(err2), true); } };
    var rollback = $("[data-rollback]"); if (rollback) rollback.onclick = function () { if (!confirm("Restaurer le jeu de données précédent ?")) return; try { var old = JSON.parse(localStorage.getItem(DATASET_ROLLBACK_KEY)); validateDataset(old); old = prepareIncomingForProfile(old, APP_PROFILE_ID); var current = JSON.stringify(DATA); DATA = old; localStorage.setItem(DATASET_ROLLBACK_KEY, current); saveDataset(); PROFILE = APP_PROFILE_ID; toast("Jeu précédent restauré ✓"); render(); } catch (err) { toast("Retour arrière indisponible.", true); } };
    var saveCourse = $("[data-save-course]"); if (saveCourse) saveCourse.onclick = function () {
      var duration = positiveNumber($("#course_duration").value), distance = positiveNumber($("#course_distance").value);
      var legs = finiteNumber($("#course_legs").value), knee = finiteNumber($("#course_knee").value), rpe = finiteNumber($("#course_rpe").value);
      var hrAvg = positiveNumber($("#course_hr_avg") ? $("#course_hr_avg").value : ""), hrMax = positiveNumber($("#course_hr_max") ? $("#course_hr_max").value : "");
      if ([legs, knee, rpe].some(function (n) { return n != null && (n < 0 || n > 10); })) { toast("RPE, douleur et jambes lourdes doivent rester entre 0 et 10.", true); return; }
      if (!duration && !rpe && legs == null && knee == null) { toast("Indique au moins la durée, l’intensité ou une sensation.", true); return; }
      mutate(function () {
        addCourseEntry(DATA, PROFILE, {
          date: $("#course_date").value || todayLocal(),
          terrain: $("#course_terrain").value,
          duration: duration,
          distance: distance,
          rpe: rpe,
          legs: legs,
          knee: knee,
          hr_avg: hrAvg,
          hr_max: hrMax,
          comment: $("#course_comment").value || ""
        });
      });
      toast("Activité enregistrée ✓");
    };
  }

  document.addEventListener("visibilitychange", function () {
    if (!DATA) return;
    var workout = activeWorkout(DATA, PROFILE);
    if (document.hidden) {
      hiddenAt = Date.now();
      if (workout) blocksFor(DATA, workout.workout_id).forEach(function (b) { if ((b.kind === "ROPE" || b.kind === "BIKE_INTERVALS") && b.run_state === "IN_PROGRESS") syncIntervalBlock(DATA, b.block_id, hiddenAt, false); });
      saveDataset(true);
    } else if (hiddenAt && workout) {
      blocksFor(DATA, workout.workout_id).forEach(function (b) { if ((b.kind === "ROPE" || b.kind === "BIKE_INTERVALS") && b.run_state === "IN_PROGRESS" && b.timer_state) { advanceIntervalState(b.timer_state, b.plan_snapshot.recipe, Date.now()); b.timer_state.needs_confirmation = true; } });
      hiddenAt = null; saveDataset(true); if (VIEW === "session") render();
    }
  });
  window.addEventListener("storage", function (event) { if (event.key === LOCK_KEY) refreshEditorLock(); });
  window.addEventListener("beforeunload", function () { if (DATA) saveDataset(true); try { var lock = JSON.parse(localStorage.getItem(LOCK_KEY) || "null"); if (lock && lock.tab_id === TAB_ID) localStorage.removeItem(LOCK_KEY); } catch (ignore) {} });

  (async function init() {
    acquireEditorLock();
    await bootData();
    render();
    setInterval(refreshEditorLock, 5000);
  })();

})(typeof globalThis !== "undefined" ? globalThis : this);
