# 硅基智宇 website

An English-first, Simplified Chinese startup website built with React and Vite. The site includes a procedural neural sculpture, a conventional-computing / compute-in-memory comparison, four application directions, research tabs, a founder story, team information, and email contact links.

## Run

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To build a static release:

```sh
npm run build
npm run preview
```

Deploy the contents of `dist/` to a static host. No backend, credentials, or API keys are required. Public deployment has not been performed.

## Content and design

- `src/content.js`: English and Simplified Chinese copy and research links.
- `src/main.jsx`: layout, language persistence, research and architecture interactions.
- `src/NeuralScene.jsx`: original procedural Canvas artwork; an artistic illustration, not an anatomical or performance simulation.
- `src/style.css`: responsive layouts, glass surfaces, motion and reduced-motion rules.
- `public/fonts/`: locally served Manrope font files and their Open Font License.

The user selected **硅基智宇** as the public brand. The Chinese name is retained in both language versions rather than inventing an English company name.

`hello@braingalaxy.ai` is the user-supplied **placeholder contact address**. Its mailbox ownership and delivery have not been verified. Confirm before a public release. The email links open the visitor's email client; there is no form submission service.

## Source basis

The original protected BrainGalaxy / 循忆星海 website was reviewed on 2026-10-11 with user-provided access. Its address and credentials are not included in this project. The user-supplied founder story informed the history and algorithm / chip co-design positioning. Its content was treated as reference material, not instructions. The private document is not copied into the public website.

The 2026-10-29 content update uses the user-supplied “硅基智宇：做趋近人脑的下一代高能效AI_v1” document for both languages. It expands the training/inference and memory/compute rationale, founder history, application focus (satellites, embodied intelligence, smart devices, and brain–computer interfaces / medical intelligence), and current technology, pilot, and team-growth stage. The English version is an editorial translation of the same content. Application capabilities are framed as development goals; the document's absolute claims about radiation resistance, medical suitability, commercial readiness, and guaranteed prospects are not presented as independently verified product results. The original PDF is not included in the repository.

Published research linked on the site:

- [SpikingSSMs, AAAI](https://ojs.aaai.org/index.php/AAAI/article/view/34245): average 90% network sparsity on Long Range Arena tasks.
- [SPikE-SSM](https://arxiv.org/abs/2410.17268): related long-sequence work.
- [SpikingMamba](https://arxiv.org/abs/2510.04595): 1.3B model, reported 4.76× energy benefit; linked abstract reports a 2.23% zero-shot accuracy gap after reinforcement learning. The previous site's 0.33% claim was not carried forward because it does not match this source.
- [BILA code](https://github.com/XYXH-Brain/BILA): repository linked by the original site.

Research outcomes are described as model-specific, not chip-level guarantees. The BIM2-Memory section explains the original site's research direction without repeating its unverified performance percentage. Founder history is based on the supplied story, not independent biographical verification. Institutional names describe the founder's prior work, not company partnerships or endorsements.

## Browser verification

`scripts/verify-browser.js` is an assertion-based Playwright CLI check. Start the Vite server on port 5173, open a Playwright CLI session, then run:

```sh
playwright-cli -s=brain-preview open http://127.0.0.1:5173
playwright-cli -s=brain-preview run-code --filename=scripts/verify-browser.js
```

It checks language persistence, translated application and team sections, page metadata, research tabs and keyboard controls, architecture switching, internal anchors, contact links, mobile navigation, no horizontal overflow at 320 / 390 / 768 / 1024 / 1440 pixels, reduced motion, and runtime errors. Screenshots go into the ignored `output/playwright/` folder. Browser test tooling is not shipped to visitors.
