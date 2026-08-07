# AI-first onboarding prototype for WordPress.com

A clickable, coded prototype of an onboarding flow: someone describes what they want, an assistant asks a few short questions, a site draft is generated, they edit it, and they publish. Built using WordPress.com's design language.

**Live demo:** https://prototype-three-lyart.vercel.app

---

## Read this first

**This is a design prototype, not a product.** It exists to argue for an interaction design, not to ship one. Specifically:

- **There is no AI.** No model, no API, no request that carries anything you type. Everything that looks like intelligence is keyword matching against hardcoded lists plus pre-written responses on a timer. See [How the "AI" works](#how-the-ai-works). The one network call the page makes is to Google Fonts, for the display typeface.
- **There is one hardcoded output.** Whatever you type, the generated site is always the same yoga studio. Five blocks render: hero, about, classes, schedule, contact. Two further block types exist — testimonials, which the assistant adds on request, and subscribe, which nothing in this build can reach.
- **Nothing persists.** No storage, no backend. Refresh and you are back at the start.
- **Many controls are deliberately inert.** They are drawn so the surface reads correctly, but they do nothing. [The full list is below](#what-is-real-and-what-is-not) — check it before filing a bug.
- **Desktop only.** No responsive design exists.

If you are evaluating whether this design can be built, read [Architecture](#architecture) and [Constraints](#constraints-and-known-issues). If you are picking up the code, read [Repo map](#repo-map) first.

---

## Run it

Requires Node 20.19+ or 22.12+ (verified on Node 26). No environment variables, no services, no accounts.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Typecheck, then production bundle into `dist/` |
| `npm run preview` | Serve the built bundle |
| `npm run lint` | Lint. Note this is a two-rule check, not a full lint pass |

The build is fully static. Any static host will serve it. Routing uses query strings rather than paths, so no SPA rewrite rule is needed.

---

## Entry points

There is no router library. `src/main.tsx` reads `?view` and `?step` at startup; `Publish.tsx` reads `?intent` separately when it renders.

| URL | What you get |
|---|---|
| `/` | The main flow, from the start |
| `/?step=editor` | Straight into the editor with a draft |
| `/?step=publish` | Straight to the publish screen |
| `/?step=publish&intent=newsletter` | The publish screen in its newsletter variant |
| `/?view=diagrams` | Explanatory diagrams of the flow |
| `/?view=lofi` | An earlier greyscale prototype, kept for reference |
| `/?view=smoke` | A design-language smoke test |

`?view` takes priority over `?step`. Any unknown `?step` falls back to the start.

---

## The flow

```
intake ──submit──► discovery ──done──► generating ──done──► editor ──Launch──► publish
   │                                                          ▲                   │
   └─"Pick what you're building"──► type picker ──website─────┘        Back ──────┘
                                        │
                                        └─store / newsletter / blog / portfolio──► labelled stub

The WordPress logo, top left, returns to intake from any screen. It is the only way back.
```

1. **Intake** — the person types what they want to make.
2. **Discovery** — a full-screen chat asks four questions, one at a time, with a visible counter. Answers that were already implied by the prompt are pre-filled and marked "from your description". Each answer is appended to the thread.
3. **Generating** — a full-screen blocking state, five stages of 1.1 seconds, about 5.5 seconds in total.
4. **Editor** — the draft opens in an editor built from the component library. The same thread continues in the sidebar. Blocks are marked as AI drafts until edited.
5. **Publish** — publishing for free on a `*.wordpress.com` address is the working path; the paid domain paths are stubs.

The **thread** is the continuity mechanism: one object, created at intake, appended to at every step, rendered full-screen during discovery and in the sidebar afterwards. It is never reset between steps.

---

## Repo map

### Start here

| File | What it is |
|---|---|
| `src/main.tsx` | The entry point, and the whole of the routing. 27 lines. Read first. |
| `src/hifi/Flow.tsx` | The state machine for the whole demo. Every step transition is decided here. |
| `src/hifi/content.ts` | Most user-facing copy, all the draft data, and the fake-AI keyword matchers. The most important file. Two traps: the hero kicker and both hero buttons are hardcoded in `Canvas.tsx` and shadow the same fields in `HERO_BY_TONE`, which only the publish thumbnail reads. |
| `src/hifi/state.ts` | The editable document and the undo history, as pure functions. No React. |
| `src/hifi/useEditor.ts` | All editor state and handlers. Produces the canned assistant replies. |

### `src/hifi/` — the prototype being demoed

Screens, in flow order:

| File | What |
|---|---|
| `Intake.tsx` | The first screen: prompt entry |
| `TypePicker.tsx` | The non-AI path: "What are you building?" plus its per-type dead ends |
| `Discovery.tsx` | The full-screen question chat. The largest screen file |
| `Generating.tsx` | The blocking loader |
| `Shell.tsx` | The editor frame: top bar, canvas slot, sidebar, ⌘K listener |
| `Canvas.tsx` | The rendered draft — one renderer per block type |
| `SubPage.tsx` | The Contact page, and the stub for the pages that are not built |
| `Publish.tsx` | Paywall, plan grid, checkout stub and confirmation |

Editor parts:

| File | What |
|---|---|
| `TopBar.tsx` | The top bar. Only undo, redo, Launch, the logo and the command palette are wired |
| `Sidebar.tsx` | The three sidebar tabs and the static Design panel |
| `AssistantPanel.tsx` | The chat: thread, suggestion chips, composer |
| `BlockFrame.tsx` | Block wrapper: hover, selection, provenance chip, block toolbar |
| `BlockPanel.tsx` | The Block tab inspector. Static mock |
| `CommandPalette.tsx` | The ⌘K command palette, hand-assembled from component-library primitives |
| `Message.tsx` | The two chat message renderers |
| `SiteNav.tsx` | The rendered site's own navigation |
| `chatThread.ts` | The thread type and its immutable append helpers |
| `useAutoGrow.ts` | Textarea auto-height |
| `icons.tsx` | Six glyphs with no equivalent in the icon package |
| `hifi.css` | Every style for every screen. 3,500 lines, navigated by section banner comments |

### Other directories

| Path | What |
|---|---|
| `src/theme/tokens.css` | Design tokens as CSS variables. Everything else consumes these |
| `src/index.css` | Global entry stylesheet. Order matters — see [Traps](#traps) |
| `src/diagrams/` | Static diagrams for the write-up. Not product UI |
| `src/lofi/` | An earlier greyscale prototype. Shares no code with `src/hifi/` |
| `src/App.tsx` | A design-language smoke test. Not part of the flow |

---

## Architecture

### State

Three tiers, all plain React state. No store, no context, no state library.

- **`Flow.tsx`** holds what crosses steps: the thread, the prompt, the detected goals, the chosen type, and a key used to force a clean remount on "start over".
- **`useEditor.ts`** holds the editor: document, history, selection, current page, sidebar tab, toasts. This dies if you leave the editor.
- **Components** hold their own local UI state.

### The document and undo

`state.ts` defines the editable page: tone, four editable strings, block order, deleted blocks, and a provenance flag per block. Every change goes through a pure reducer that returns a new object; nothing is mutated in place.

Undo history stores **full document snapshots**, not diffs. That is fine at this size and wrong at real scale.

Page navigation is deliberately kept out of the history, so undo does not rewind which page you are looking at.

### How the "AI" works

Four mechanisms, all synchronous and deterministic, all in `content.ts` and `useEditor.ts`:

1. **`detectGoals(prompt)`** — lowercases the prompt and tests it against five keyword lists, then filters the result to the goals this build actually wires. In practice it returns `['website']` or nothing. No default: an unmatched prompt returns nothing, which is why the first question has a separate heading for that case.
2. **`detectMissing(prompt)`** — the same technique for the three follow-up questions, producing the "from your description" pre-fills.
3. **`matchIntent(text)`** — the editor chat. An if-chain over keyword groups returning a fixed reply and one of four actions. `useEditor` waits 700 ms to simulate thinking, applies the action, and posts the reply.
4. **Pre-written variant tables** — "rewrite in a different tone" is a lookup. Five hand-written variants exist for the hero and the About block. No other block reacts to tone.

---

## Design system

| Package | Role |
|---|---|
| `@wordpress/components` | The Gutenberg component library the real edit surface is built on. Supplies buttons, cards, toolbars, menus, tabs, modals, popovers, snackbars and progress bars |
| `@wordpress/icons` | All standard glyphs |
| `@automattic/color-studio` | The colour palette's provenance. **Installed but never imported** — the hex values were copied into the tokens by hand |

Everything else is custom CSS. The component library supplies components; layout, spacing, colour and motion are hand-written.

Tokens work in two layers: a global set in `src/theme/tokens.css`, then a local set redeclared on each prototype's root element. Components consume variables, not raw hex.

### Traps

These will cost you an afternoon if nobody warns you.

1. **Two different blues.** The tokens say the brand blue is `#3858e9`; the prototype overrides it to `#2d5af2` in four places, to match the design file. Know which one you are changing.
2. **React is pinned to 18 on purpose.** The component library's peer range allows 19, but mixing versions produced a duplicate-React "invalid hook call" white screen. `vite.config.ts` also forces a single copy through `dedupe`. Do not bump React casually.
3. **A required stylesheet import.** `src/index.css` imports the component library's stylesheet. Without it, every component renders unstyled.
4. **CSS `@import` must come first.** Put any rule above those imports and the imports are silently dropped, taking every token with them.
5. **A global focus-ring override** strips the library's mouse-click focus ring app-wide. Deliberate.
6. **The tab component reads its initial tab only at mount.** The sidebar works around this with a remount key and keeps its own panels below so the chat is never unmounted on a tab switch. Both are load-bearing.
7. **Toolbar internals are fragile.** The mover buttons must sit inside a toolbar group; a plain wrapper breaks the library's roving focus and kills the dropdowns.
8. **Two packages and one component were deliberately not used**, each documented in a code comment: the block editor package (needs a full editor store, and a 143 KB stylesheet that collides with ours), the commands package (needs a data store), and the search control inside the command palette (its chrome could not be stripped without fighting the library).

---

## Fonts and images

**The display typeface is Recoleta**, which is what WordPress.com uses. It is a licensed commercial font from Latinotype and is **not redistributed here**.

The font stack is `'Recoleta', 'Fraunces', ui-serif, Georgia, serif`:

- If Recoleta is available — installed on the machine, or added under your own licence — it is used automatically. Put the files in `public/fonts/` and add the `@font-face` rules back to `src/index.css`; nothing else needs to change.
- Otherwise **Fraunces** loads from Google Fonts as a stand-in. It is licensed under the SIL Open Font License and is free to redistribute. It is close enough in character that layout and sizing hold.

**The hero photograph is not included** either, for the same reason. The code points to `public/hero-yoga.svg`, an illustration made for this prototype. Swap in a real photograph and the layout is unchanged.

---

## What is real and what is not

### Wired and working

Typing and submitting on intake. The type picker, with keyboard navigation. All four discovery questions, including the multi-select, the inline free-text row on the main-goal question, skip, the counter, the pre-fill notes and the animations. The generation sequence. In the editor: inline editing of the hero headline and the About body, block selection and hover, undo and redo, moving and deleting blocks, page switching, the ⌘K command palette with search and keyboard navigation, sidebar tabs, and "start over". On the block toolbar: change tone, rewrite (About only), delete, move. In the chat: sending messages, the suggestion chips, the thinking state, and the document changes for tone, shortening About, and adding testimonials. On publish: going live for free, the confirmation, and copy link.

### Drawn but inert

**Top bar:** add block, list view, view site, preview device, Jetpack, help, toggle sidebar, options. Save is permanently disabled.

**Sidebar:** the close button. The whole Design tab. The whole Block inspector.

**Block toolbar:** the drag handle — there is no drag and drop anywhere. In the overflow menu: copy, add before, add after, add note, rename. Only delete works.

**Canvas:** the between-blocks inserter opens, but its suggestions are decorative. Inside the rendered site, every button, form and navigation link is inert by design.

**Chat:** the attach button, and the thumbs-up/down/copy row on each message.

**Intake:** the "already have a site elsewhere" card. No migration flow exists.

**Publish:** claim a domain, connect a domain, and search for a different domain.

### Fake in a way that looks real

- **"Edit with AI"** on a block posts a reply claiming the block was updated. The document is not touched.
- **"Rewrite"** on any block other than About shows a toast saying it is not wired.
- The confirmation screen links to a real external address that is not this prototype's output.
- Changing tone marks the block as edited by the person, although the assistant made the change. The provenance flag and the intent behind it disagree here.
- "Edit with AI" also announces "block updated" to screen readers while changing nothing, so an assistive-technology user is told something a sighted user is not shown.
- The discovery composer looks like a chat input. Text typed there is posted to the thread as if it answered the current question, and moves you on — but it never sets the recorded value, so that answer ends up blank in the intent.
- The thumbnail on the publish screen always renders the original draft. Tone changes and inline edits made in the editor do not appear in it.

### Honest, labelled stubs

The four non-website type destinations, the three unbuilt pages, and the publish checkout each say plainly that they are not built.

### Built but unreachable

- **The plan grid and checkout screen** exist in `Publish.tsx` but nothing navigates to them.
- **An alternative hero style variant** has a reducer and a stylesheet rule, but no control calls it.
- Several unused constants in `content.ts`, and one unused SVG (`blankstate-compass.svg`, left over with the empty-state CSS).
- **The Subscribe block** and the greeting branches that would introduce it. Both need a `newsletter` goal, which the disabled goal rows make unselectable.

---

## Constraints and known issues

### Deliberate simplifications

None of these would survive production. Each was a conscious trade-off for demo speed.

1. One hardcoded generated site, in literals.
2. No backend, no model, no network.
3. No persistence — refresh loses everything.
4. No routing: a one-shot query-string read, no history API, no browser back.
5. Full-snapshot undo, unbounded.
6. `contentEditable` for text editing, with no sanitisation.
7. Only two of seven blocks are editable; only two react to tone.
8. Only two of five pages are built.
9. Desktop only. The editor is a fixed 100vh frame with a 322px sidebar and has no breakpoints. Three of the standalone screens carry a small-screen breakpoint; nothing was laid out for mobile.
10. All timings are fixed constants, not measured.
11. Message IDs come from the clock and would collide under fast programmatic input.

### Known defects

1. **Only the website path is selectable**, on the discovery question. The type picker still offers and routes all five. As a result, the newsletter variant of the publish screen is reachable only through `?intent=newsletter`, and when reached it promises a subscribe form that the previewed draft does not contain.
2. **Comments and CSS lag the code.** Roughly a dozen comments still describe an earlier architecture in which one editor shell persisted across discovery and generation; those are standalone screens now. Two leftovers are live code rather than prose: `useEditor`'s `active` flag is always true, so its re-seed effect can never fire. `hifi.css` also still carries rules for two screens that no longer exist (`.gl__*`, `.hf-blankstate`).
3. **One lint warning** in `main.tsx`, which degrades hot reload for that one file. Harmless.
4. **Two `eslint-disable` comments do nothing.** ESLint is not installed, and the linter that is installed has no such rule. Do not trust those suppressions.
5. **The bundle is over 500 kB**, so the build prints a chunk-size warning. Nothing is code-split.

### Not addressed at all

No tests, and no test runner installed. No error boundaries. No loading or error states outside the earlier greyscale prototype. No internationalisation, analytics or auth. Accessibility was handled in places — roving focus, ARIA states, live regions, reduced-motion support — but has not been audited.

---

## If you were to build this for real

The three things to settle first, in order:

1. **Does intent survive across entry points today?** The whole proposal rests on one small intent object, created at whichever entry point the person arrives through and carried to launch. Within a session that is trivial. Across surfaces it is the assumption to confirm before anything else.
2. **Can the AI path publish for free on a subdomain?** The design treats publishing as free and charges for the upgrade — a domain, a plan. That is a pricing decision, not a design one.
3. **Is the builder's post-generation surface the same one the in-editor assistant runs on?** The prototype treats them as one continuous experience. In the product they are distinct.

---

## Licence and attribution

The code in this repository is a design artefact, shared for review.

- **Recoleta** is a commercial typeface by Latinotype and is not included. See [Fonts and images](#fonts-and-images).
- **Fraunces** is used under the SIL Open Font License.
- `@wordpress/components`, `@wordpress/icons` and `@automattic/color-studio` are installed from npm under their own licences and are not vendored here.
- The WordPress logo mark in `public/` is a trademark of the WordPress Foundation and is used only to make the prototype read as WordPress.com.
