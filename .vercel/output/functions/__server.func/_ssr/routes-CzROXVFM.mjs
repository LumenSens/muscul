import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CzROXVFM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	(0, import_react.useEffect)(() => {
		window.location.replace("/coach/index.html");
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-dvh items-center justify-center bg-bg p-6 text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
			title: "Coach Muscu — Mathieu",
			src: "/coach/index.html",
			className: "fixed inset-0 h-dvh w-full border-0",
			style: {
				position: "fixed",
				inset: 0,
				width: "100%",
				height: "100vh",
				border: 0,
				background: "#0E1116"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "relative z-10 text-sm text-muted",
			children: "Chargement de Coach Muscu — Mathieu…"
		})]
	});
}
//#endregion
export { Home as component };
