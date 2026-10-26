---
project: Press Trigger
surface: Live Desk (Operate), Record (Read), Recap (Read)
status: three routes built as previews, light and dark, checked at 1440 and 492 CSS px
supersedes: v1 dark control room, rejected by Lee on 2026-10-26
---

# Press Trigger, DESIGN.md

## 1. Visual theme and atmosphere

**Surface mode:** Operate. The Live Desk is used live, under time pressure, by one person watching a match. The Record and the Recap are Read surfaces and inherit the same system with less density.

**Design read:** a printed match supplement that happens to be live. Ink on paper, hairline rules, one ink blue, a Didone for the things that matter and a neutral grotesk for the things that must be scanned. The page should feel like it came off a press, not out of a monitoring console.

**Why not the obvious:** the first direction was a dark control room with tally red and condensed type. Lee rejected it. It was also the exact look of the other entries in this hackathon, so the rejection and the convergence check agreed.

**Atmosphere rules:**

- Paper is the ground in the default theme. Dark is an inverse of the same system, switched by the reader, never a second design.
- Rules carry structure. Shadows are rare and one is allowed.
- Colour is functional. Blue means on air or on top. Green means hit. Amber means pending. Grey means miss. Nothing is coloured for decoration.
- The one authored 3D moment is the rhythm ribbon. Everything else is flat by choice, so the ribbon reads as deliberate.

## 2. Colour palette and roles

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F6F5F1` | Page ground |
| `--paper-2` | `#FFFFFF` | Monitor card only |
| `--ink` | `#15171A` | Primary text, strong rules, live chip fill |
| `--ink-2` | `#4C5257` | Body text, secondary labels |
| `--ink-3` | `#6B7276` | Meta, timestamps, evidence ids. 4.53 to 1 on paper, passes AA |
| `--rule` | `#DCDAD3` | Hairline dividers |
| `--rule-strong` | `#15171A` | Section rules, column heads |
| `--blue` | `#1B3A8C` | On air, open call, active tab, selected row edge |
| `--blue-soft` | `#E9EDF8` | Selected row fill |
| `--green` | `#1F6B4A` | Hit, verified evidence |
| `--amber` | `#946200` | Pending, queued, horizon |
| `--grey` | `#8A9095` | Miss |

**Ribbon shades (3D faces, blue):** front `#1B3A8C`, top `#3E60BE`, side `#12295F`.
**Ribbon shades (3D faces, grey):** front `#B3B7B0`, top `#CDD0C9`, side `#8E938C`.

**Palette family:** ink blue editorial, from `09-ledger.md` section C, WIRED brand world. Paper white with a single ink blue accent and functional state colours.

**Banned here:** red as a general accent, gradients as fills, glow, purple, glass blur, more than one saturated hue in a component.

## 3. Typography

**Pairing:** Magazine Style, Libre Bodoni plus Public Sans, from `09-ledger.md` section B. Loaded as:

```
https://fonts.googleapis.com/css2?family=Libre+Bodoni:ital,wght@0,400;0,700;1,400&family=Public+Sans:wght@400;500;600;700&display=swap
```

**Libre Bodoni** is the display voice and only that. Clock, scoreline, wordmark, pundit names, call claims, lower third lines. Never used for body copy, never below 16px, never all caps.

**Public Sans** carries every operational element: rows, labels, metadata, evidence ids, buttons, tables. All numerals are `font-variant-numeric: tabular-nums`, including the clock. There is no monospace font in this system. The tabular grotesk does the job that mono usually gets hired for, without the terminal costume.

| Role | Font | Size | Weight | Tracking |
|---|---|---|---|---|
| Clock | Bodoni | 37px | 700 | -0.02em |
| Wordmark | Bodoni | 25px | 700 | -0.015em |
| Scoreline | Bodoni | 23px | 700 | -0.015em |
| Section label | Public Sans | 9.5px | 700 | 0.17em, upper |
| Pundit name | Bodoni | 21px | 700 | -0.008em |
| Call claim | Bodoni | 19px | 400 | -0.005em |
| Lower third line | Bodoni | 19px | 700 | -0.012em |
| On-air sentence | Public Sans | 15.5px | 500 | normal |
| Rundown row | Public Sans | 13.5px | 400 | normal |
| Pundit read | Public Sans | 13px | 400 | normal |
| Meta and evidence | Public Sans | 9.5 to 10px | 600 | 0.03 to 0.11em |

**Rules:** sentence case everywhere except 9 to 10px labels and the LIVE chip. No text-transform on body copy. Numbers are tabular in every table, clock and timestamp. Maximum three weights of Public Sans per screen.

## 4. Component styling

**Tally bar.** 76px tall on paper, 2px black bottom rule. Wordmark left with the second word in italic ink blue. Three tabs, active tab underlined in ink blue at 2px. Scoreline right in Bodoni with the match meta beneath in 9.5px caps. Clock at 37px with a hairline left border, period label, and a solid ink LIVE chip with a white dot. No rounded corners anywhere in this bar.

**Rhythm ribbon (signature, 3D).** Full width under the tally bar. Thirty buckets of three minutes. Each bucket is an extruded block with a front face, a top face and a right side wall, so it reads as a physical object rather than a bar. Height is pressure intensity. Blue is the home side on top, grey is the away side. Call pins stand on top of their bucket: green hit, grey miss, ink open, amber pending. Minute labels 15 to 90 sit under the baseline. The ribbon is an image of the match state, not an ornament: it answers "when was this game loud, and where did our calls land".

**Rundown row.** Five tracks: minute, type chip, text, evidence ids, result. 16px vertical padding, hairline bottom border. Selected row gets `--blue-soft` fill and a 2px ink blue left edge with 13px left padding. Type chips are 9px caps. Result is right aligned: `HIT` in green, `MISS` in grey with a strikethrough.

**Monitor card.** White panel with a 1px black border and one soft shadow. Header strip in 9px caps with safe area on the right. Inside, a perspective stage holds the screen at `rotateY(-7deg) rotateX(4deg)` with its own cast shadow, so the preview reads as a physical monitor on the desk. The lower third sits inside a dashed safe-area frame: blue rule, ink block, blue name, white Bodoni line. Below the screen, the on-air sentence in Public Sans with the pundit, timestamp and a green verified count. Footer strip carries duration, priority and next item.

**Pundit block.** Bodoni name, one line of bias in 11.5px grey, the read in 13px, then a record line of called, right and percentage, then the open call in ink blue. No avatar, no bubble, no chat styling. These are two desks with records, not two chatbots.

**Call block.** 1px black top rule, section label and horizon on one line, the claim in 19px Bodoni, then meta. Used for the open call and the next in queue.

**Record table (Read surface).** Same row tracks as the rundown, with the result column and a resolution timestamp. No chips except the state.

**Buttons.** Square, 1px ink border, 13px Public Sans 600, 10px by 16px padding. Primary fills ink with white text. Hover darkens the border only. Focus is a 2px ink blue outline with a 2px offset. No pills, no rounded corners, no shadows.

## 5. Layout principles

- Max width 1600px, centred, 28px side padding.
- The desk is a 5 / 4 / 3 column split with 46 to 48px gutters: rundown (read the match), monitor (see what goes out), desk (who is talking).
- Everything above the fold sits inside one 900px tall viewport at 1440 wide. An operator surface that needs scrolling to reach the open call is broken. This is a hard rule, not a preference.
- Section heads are a 9.5px label left and a count or source right, above a 1px black rule.
- Vertical rhythm: 16px inside rows, 22 to 30px between blocks, 46px between columns. When in doubt add air, never density. The first pass was dialled to density 8 and Lee called it jammed. It is now 5.
- Background: paper with a 1px column guide at 3 percent ink every 112px, so the page has the grain of a printed grid without a texture image.

## 6. Depth and elevation

- Exactly one soft shadow in the system: the monitor card, `0 26px 48px -30px rgba(21,23,26,.55)`.
- The screen preview carries a second, tighter shadow because it sits inside the first.
- The ribbon gets its depth from geometry, not shadow: three faces per block, top lightest, side darkest.
- Borders do the structural work. Nothing floats.
- No glassmorphism, no neumorphism, no glow, no backdrop blur, no gradient fills.

## 7. Do and do not

**Do**

- Keep the ribbon driven by match state, generated from the same data the desk reads.
- Keep every number tabular and every timestamp in minutes and seconds.
- Let paper and rules carry the page.
- Use ink blue for exactly one thing per screen region.
- Say what the desk does in plain words: called, right, open, clears at.

**Do not**

- Do not add a second accent hue.
- Do not round corners on panels, chips or buttons.
- Do not use Bodoni below 16px or for paragraphs.
- Do not animate the ribbon bars on every tick. It is a record, not a visualiser.
- Do not put a chart anywhere that a sentence would do.
- Do not invent a second palette for dark. Use the inverse tokens in section 10.

## 8. Responsive behaviour

| Width | Behaviour |
|---|---|
| 1180 and up | Full 5/4/3 desk, 46px gutters |
| 980 to 1179 | Same split, gutters drop to 30px, padding to 22px |
| 980 and below | Single column, order becomes monitor, open call, rundown, desk, pundits. Ribbon becomes a horizontal scroll region with a 680px minimum width so the blocks stay legible |
| 640 and below | Tally reflows to wordmark on its own line, scoreline and clock share the next. Tabs hidden. Evidence ids hidden, four row tracks. Monitor header drops the safe area label. Footer stacks |

The page scrolls below 980. Above it, it does not.

## 9. Signature, motion, and depth

**Signature: the rhythm ribbon.** One element a reader would recognise from a screenshot: fifteen extruded blue and grey blocks with pins standing in them, running the length of the page under the score. It is the only place the system uses perspective, and it is the only element that is not flat.

**Motion tier: Standard.**

- LIVE dot pulses at 2s, opacity only, and stops under `prefers-reduced-motion`.
- A new rundown row fades and slides 6px over 160ms.
- The result stamp on a resolved call fades in over 120ms.
- No parallax, no scroll effects, no hover lift, no animated counters.

**Geometry spec for the ribbon, so the build matches the preview:**

- 30 buckets, 3 minutes each, in a 1360 by 142 viewBox.
- Bar width 28, gap 15, start x 22, baseline y 114, max height 64.
- Extrusion 9px up and to the right. Top face is the lightest shade, the right side wall the darkest, the front face the base.
- Paint order per block: side wall, top face, front face.
- Pin: 2px stem 26px above the block, 4px radius head in the state colour.
- Minute ticks at 15, 30, 45, 60, 75 and 90 with 10px labels.

## Rotation record

| Axis | This project | Previous project (Untangled) |
|---|---|---|
| Style | Data-Dense Dashboard, printed supplement execution | Swiss Modernism 2.0 |
| Palette | Ink blue editorial, paper white | Warm paper, near black |
| Fonts | Libre Bodoni plus Public Sans | Archivo plus JetBrains Mono |
| Theme | Light | Light |
| Signature | 3D rhythm ribbon with call pins | Overdue row promotion |
| Dials | VARIANCE 6, MOTION 3, DENSITY 5 | VARIANCE 5, MOTION 3, DENSITY 6 |

Theme repeats light against Untangled. That is allowed because the palette, fonts, signature and density all rotate, and because the alternative on the table was the rejected dark direction.

## 10. Theme switch, the Record and the Recap

**Theme switch.** A 34px square button at the far right of the tally bar with a 1px rule border. It shows a moon in light and a sun in dark, carries `aria-pressed`, and its label names the next theme. The theme is decided in this order: the stored choice, then the system preference, then light. The choice is stored under `pt-theme` and applied before first paint so the page never flashes.

**Dark is an inverse, not a second design.** Same type, same rules, same single accent. Only tokens flip.

| Token | Light | Dark |
|---|---|---|
| paper | #F6F5F1 | #14161A |
| paper-2 | #FFFFFF | #1B1E22 |
| ink | #15171A | #F2F0EA |
| ink-2 | #4C5257 | #B9BEC2 |
| ink-3 | #6B7276 | #8A9095 |
| rule | #DCDAD3 | #2C3036 |
| rule-strong | #15171A | #5A6166 |
| blue | #1B3A8C | #93A9E8 |
| blue-soft | #E9EDF8 | #1E2740 |
| green | #1F6B4A | #5FD3A0 |
| amber | #946200 | #E8B44A |
| grey | #8A9095 | #7E858A |

The ribbon exists in four generated files because its faces are baked geometry: `ribbon.svg` and `ribbon-dark.svg` for the live match, `ribbon-recap.svg` and `ribbon-recap-dark.svg` for the recap. The live ribbon carries five pins including the open and pending calls. The recap ribbon carries only the four graded calls. Never reuse the live ribbon on the recap.

**The Record.** A read surface for proof. Page title in Bodoni at 44px, one sentence of explanation, four stats, a filter row, the tally strip, then a table grouped by match, newest first. The tally strip is one 3px mark per call: green hit, grey miss, blue open, outline void. It gives the shape of the record before a single row is read. The table never hides a miss, and a void is shown as a void with its reason.

**The Recap.** A read surface for one match. Score block, the full-match ribbon, the verdict in Bodoni at 29px, three key moments, the four calls, and a scorecard for each desk. The verdict is written from the ledger, never from memory.

**Read surface rules.** Pages scroll, the desk does not. Content runs to the same 28px edge as the tally bar. Tables use tabular numerals and right-aligned results. No cards, no rounded corners, no colour that is not in the state set.

## 11. In the build

The Next.js app in this repository implements this system. `app/globals.css` holds the tokens and the components. There is one tally bar, one ribbon component, one table style.

- `/match/m14` is the live desk. It replays match 014 from 63:13 at one minute per 2.2 seconds, and calls are graded as the clock passes their horizon.
- `/ledger` is the record. Every call across three matches, with filters, marks and evidence.
- `/recap/m14` is the full time read.

The ribbon is drawn inline as SVG, not shipped as image files. Its faces read from `--rib-*` tokens, so one component serves both themes. Call pins stand on the bar for the bucket the call was made in, and take their colour from the state of the call.

The theme switch writes `pt-theme` to local storage, accepts `?theme=dark` as an override, and falls back to the system preference. The no flash script sits in the document head.

Every number on the record and recap pages is computed from the same match state the desk uses. Nothing is typed in by hand.
