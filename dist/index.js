/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 617:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 442:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 454:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ }),

/***/ 195:
/***/ ((module) => {

module.exports = eval("require")("js-yaml");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(617);
const github = __nccwpck_require__(442);
const yaml = __nccwpck_require__(195);
const axios = __nccwpck_require__(454);

try {
  const { getInput } = core;
  const {
    titleInput,
    jobStatusInput,
    lastCommitInput,
    sectionsInput,
    factsTitleInput,
    factsInput,
    webhookInput,
    buttonsInput,
    dry_runInput,
  } = {
    titleInput: getInput("title"),
    jobStatusInput: getInput("jobStatus"),
    lastCommitInput: getInput("lastCommit"),
    sectionsInput: getInput("sections"),
    factsTitle: getInput("factsTitle"),
    factsInput: getInput("facts"),
    webhookInput: getInput("webhook"),
    buttonsInput: getInput("buttons"),
    dry_runInput: getInput("dry_run"),
  };

  let stepsInput = core.getInput("steps");

  const { owner: repoOwner, repo: repoName } = github.context.repo;
  const { sha: commitSHA } = github.context;

  let json = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    summary:
      "MS Teams JSON Payload from GitHub Action https://github.com/sergioaten/msteams-notifications",
    sections: [],
    potentialAction: [],
  };

  var arrayJson = Array.from(Object.entries(json));
  const title = { title: titleInput };
  const themeColor = {
    themeColor: jobStatusInput === "success" ? "00FF00" : "FF0000",
  };
  arrayJson.splice(
    2,
    0,
    ...Object.entries(title),
    ...Object.entries(themeColor)
  );
  json = Object.fromEntries(arrayJson);

  if (sectionsInput) {
    json.sections = yaml.load(sectionsInput);
  } else {
    json.sections.push(
      { text: "<h1><strong>Changelog</strong></h1>" },
      {
        text: `Last commit: <a href="https://github.com/${repoOwner}/${repoName}/commit/${commitSHA}">${lastCommitInput}</a>`,
      }
    );

    if (factsInput) {
      const facts = yaml.load(factsInput);
      if (factsTitleInput) {
        const factsTitle = yaml.load(factsTitleInput);
        json.sections.push({ text: `<h1><strong>${factsTitle}</strong></h1>` });
      } else {
        json.sections.push({ text: "<h1><strong>Facts</strong></h1>" });
      }
      json.sections.push({
        facts: facts.map((fact) => {
          const name = Object.keys(fact)[0];
          return { name, value: fact[name] };
        }),
      });
    }

    if (stepsInput) {
      stepsInput = JSON.parse(stepsInput);
      const steps = Object.entries(stepsInput).map(([key, value]) => ({
        name: key,
        value: value.outcome
          .replace("success", "✅ OK")
          .replace("failure", "❌ FAIL")
          .replace("skipped", "🐇 SKIP"),
      }));
      json.sections.push({ text: "<h1><strong>Workflow Steps</strong></h1>" });
      json.sections.push({ facts: steps });
    }
  }

  if (buttonsInput) {
    const buttons = yaml.load(buttonsInput);
    json.potentialAction = buttons.map((button) => ({
      "@type": button.type,
      name: button.name,
      targets: button.targets,
    }));
  }

  if (dry_runInput !== "true") {
    axios
      .post(webhookInput, json, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("Request sent successfully");
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error sending request:", error);
      });
  } else {
    console.log("Dry run: yes. Not sending msg");
  }

  core.setOutput("jsonPayload", JSON.stringify(json, null, 2));
} catch (error) {
  core.setFailed(error.message);
}

})();

module.exports = __webpack_exports__;
/******/ })()
;