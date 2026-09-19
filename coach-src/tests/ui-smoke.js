"use strict";

const assert = require("assert");
const fs = require("fs");
const http = require("http");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const root = path.resolve(__dirname, "..");
const mime = { ".html": "text/html", ".js": "text/javascript", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml" };
const server = http.createServer((req, res) => {
  const clean = req.url.split("?")[0] === "/" ? "/index.html" : req.url.split("?")[0];
  const file = path.join(root, clean);
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); return res.end("not found"); }
  res.setHeader("content-type", mime[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
});
const activeDoms = [];

function wait(ms = 15) { return new Promise(resolve => setTimeout(resolve, ms)); }
function click(document, selector) { const el = document.querySelector(selector); assert(el, "élément absent: " + selector); el.click(); }

(async () => {
  const results = [];
  function check(name, fn) { fn(); results.push(name); console.log("PASS UI", name); }
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", error => { if (!/service worker|navigation/i.test(error.message)) errors.push(error.message); });
  virtualConsole.on("error", error => errors.push(String(error)));
  const dom = await JSDOM.fromURL(`http://127.0.0.1:${port}/index.html`, {
    resources: "usable", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole,
    beforeParse(window) { window.confirm = () => true; window.alert = () => {}; window.scrollTo = () => {}; Object.defineProperty(window, "innerWidth", { value: 375, configurable: true }); }
  });
  activeDoms.push(dom);
  await new Promise(resolve => dom.window.addEventListener("load", () => setTimeout(resolve, 100)));
  const d = dom.window.document;

  check("accueil et quatre séances", () => { assert.strictEqual(d.querySelector("h1").textContent, "Programme optimisé"); assert.strictEqual(d.querySelectorAll("[data-prepare]").length, 4); });
  click(d, '[data-prepare="HAUT_C"]'); await wait();
  check("Haut C Base 13 proposé", () => { assert(/Base 13/.test(d.querySelector(".ttl").textContent)); assert.strictEqual(d.querySelectorAll(".plan-row").length, 6); });
  click(d, "[data-start-workout]"); await wait();
  check("séance et chrono ouverts", () => { assert(d.querySelector("[data-session-clock]")); assert.strictEqual(d.querySelectorAll(".exercise-v2").length, 6); });
  click(d, "[data-start-set]"); await wait(); click(d, "[data-end-set]"); await wait();
  check("START/END ouvre saisie et repos", () => { assert.strictEqual(d.querySelectorAll("[data-result-form]").length, 1); assert(d.querySelector(".rest-card")); });
  const form = d.querySelector("[data-result-form]"); const id = form.getAttribute("data-result-form");
  d.querySelector("#result_" + id).value = "10"; d.querySelector("#load_" + id).value = "20"; d.querySelector("#rir_" + id).value = "VALUE:2"; d.querySelector("#pain_" + id).value = "VALUE:0"; d.querySelector("#tech_" + id).value = "VALUE:Propre";
  click(d, '[data-save-set="' + id + '"]'); await wait();
  check("série réelle enregistrée", () => { assert(/10 reps/.test(d.querySelector(".set-live.recorded small").textContent)); });
  click(d, '[data-edit-set="' + id + '"]'); await wait(); d.querySelector("#result_" + id).value = "11"; click(d, '[data-save-set="' + id + '"]'); await wait();
  check("correction visible sans nouvelle série", () => { assert(/11 reps/.test(d.querySelector(".set-live.recorded small").textContent)); assert.strictEqual(d.querySelectorAll(".set-live.recorded").length, 1); });
  click(d, "[data-cancel-workout]"); await wait();
  check("annulation conservée", () => { assert(/Séance annulée conservée/.test(d.body.textContent)); });
  click(d, '[data-view="history"]'); await wait(); click(d, '[data-view="home"]'); await wait(); click(d, '[data-view="options"]'); await wait();
  d.querySelector("#opt_c_variant").value = "WITH_COMPLEMENT"; d.querySelector("#opt_complement").value = "SHRUG"; click(d, "[data-save-options]"); await wait(); click(d, '[data-view="home"]'); await wait(); click(d, '[data-prepare="HAUT_C"]'); await wait();
  check("C15 ajoute seulement shrugs", () => { assert(/complément 15/.test(d.querySelector(".ttl").textContent)); assert.strictEqual(d.querySelectorAll(".plan-row").length, 7); assert(/Shrugs/.test(d.body.textContent)); assert(!/Oiseau poitrine/.test(d.body.textContent)); });
  click(d, '[data-view="home"]'); await wait(); click(d, '[data-view="measurements"]'); await wait();
  d.querySelector("#measure_body_weight_kg").value = "66,5"; click(d, "[data-save-measurement]"); await wait();
  check("mensuration partielle enregistrée", () => { assert(/66,5 kg/.test(d.body.textContent)); });
  click(d, '[data-profile="pote"]'); await wait();
  check("profil partenaire séparé", () => { assert(/Partenaire/.test(d.body.textContent)); assert(!/66,5 kg/.test(d.querySelector(".hist-row") ? d.querySelector(".hist-row").textContent : "")); });
  click(d, '[data-profile="moi"]'); await wait(); click(d, '[data-view="home"]'); await wait(); click(d, '[data-view="options"]'); await wait();
  check("limites wake lock visibles", () => assert(/ne sont pas garantis écran verrouillé/.test(d.body.textContent)));
  d.querySelector("#opt_wake").checked = true; click(d, "[data-save-options]"); await wait(); click(d, '[data-view="home"]'); await wait(); click(d, '[data-prepare="HAUT_A"]'); await wait(); click(d, "[data-start-workout]"); await wait(); click(d, "[data-start-interval]"); await wait();
  check("timer utilisable sans wake lock", () => { assert(d.querySelector("[data-session-clock]")); assert(/Maintien d’écran indisponible/.test(d.querySelector("#toast").textContent)); });
  check("UX-01 parcours mobile simulé", () => { assert.strictEqual(dom.window.innerWidth, 375); assert(d.querySelector("meta[name=viewport]")); assert(d.querySelectorAll("button").length > 5); });
  click(d, "[data-cancel-workout]"); await wait();
  check("aucune erreur JavaScript", () => assert.deepStrictEqual(errors, []));

  const legacy = JSON.parse(fs.readFileSync(path.resolve(root, "../source_data/coach-muscu-sauvegarde (7).json"), "utf8"));
  const legacyErrors = [];
  const legacyConsole = new VirtualConsole(); legacyConsole.on("jsdomError", error => legacyErrors.push(error.message)); legacyConsole.on("error", error => legacyErrors.push(String(error)));
  const legacyDom = await JSDOM.fromURL(`http://127.0.0.1:${port}/index.html`, {
    resources: "usable", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: legacyConsole,
    beforeParse(window) {
      window.confirm = () => true; window.alert = () => {}; window.scrollTo = () => {};
      ["programs", "logs", "states", "course", "profile", "workoutDraft"].forEach(key => window.localStorage.setItem("coach_" + key, JSON.stringify(legacy[key])));
    }
  });
  activeDoms.push(legacyDom);
  await new Promise(resolve => legacyDom.window.addEventListener("load", () => setTimeout(resolve, 250)));
  const ld = legacyDom.window.document; click(ld, '[data-view="history"]'); await wait(50);
  check("archive réelle migrée et consultable", () => { const stored = JSON.parse(legacyDom.window.localStorage.getItem("coach_dataset_v2")); assert.strictEqual(stored.migration_report.summary_entries, 199); assert(/résumés historiques conservés/.test(ld.body.textContent)); assert(ld.querySelector('[data-workout-detail]')); });
  click(ld, '[data-workout-detail]'); await wait(30);
  check("détail ancien honnête", () => { assert(/Séance historique/.test(ld.body.textContent)); assert(/Résumés anciens/.test(ld.body.textContent)); assert(/Détails de séries réellement présents/.test(ld.body.textContent)); });
  check("migration UI sans erreur JavaScript", () => assert.deepStrictEqual(legacyErrors, []));

  fs.writeFileSync(path.join(__dirname, "ui-smoke-results.json"), JSON.stringify({ generated_at: new Date().toISOString(), passed: results.length, failed: 0, checks: results }, null, 2));
  console.log(`RESULT UI ${results.length}/${results.length} passed`);
  legacyDom.window.close(); dom.window.close(); server.close();
})().catch(error => { console.error(error.stack || error); activeDoms.forEach(item => { try { item.window.close(); } catch (_) {} }); server.close(); process.exitCode = 1; });
