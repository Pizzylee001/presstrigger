# Press Trigger

Two football pundits that have to be right in public.

Press Trigger is a commentary desk built for the Microsoft and Premier League "Inside the Game" developer hackathon. Two agents watch a simulated match, read it differently, and each one commits to a claim with a time horizon. The claim names its evidence. A deterministic resolver grades it hit, miss or void. The record keeps every call, including the ones that were wrong.

No Premier League data is used. The matches are synthetic and generated locally.

## Routes

| Route | What it is |
| --- | --- |
| `/match/m14` | The live desk. Rundown, monitor, open calls, and the record of both desks. |
| `/ledger` | The Record. Every call across three matches, with filters, marks and evidence. |
| `/recap/m14` | The full time read for one match, with the verdict and the two scorecards. |

`/` redirects to the live desk. The tally bar switches between the three. The sun and moon button switches theme, and the choice is remembered.

## What is actually happening

1. **The feed.** Each match is a seeded generator. Authored key moments carry the story, and the surrounding passes and turnovers are generated from the same seed. The same seed always produces the same match, which is what makes the ledger testable.
2. **Two desks.** *Front foot* calls when a team wins the ball in the final third twice in ten minutes. *Control block* refuses to call pressure alone and only commits when a shot worth 0.12 expected goals arrives. Each desk has a cooldown. Neither can hedge.
3. **The call.** A claim, a horizon, a team, and the ids of the events that triggered it. A call is written to the record the moment it is made, before the horizon arrives.
4. **The resolver.** It looks only at events between the call and its horizon, and only at events by the team the call named. A goal settles a goal call. A goal or a clear chance settles a chance call. If the feed delivered the same goal twice inside the window, the call is void, not guessed.
5. **The record.** The ledger and the recap are computed from the same state as the desk. Every number on those pages comes from the engine, not from a copy.

## Why this is not another match dashboard

Most entries to this brief put a chat box over event data and let it narrate. That is a viewer. Press Trigger is built around a commitment: a claim that can be proved wrong, a horizon that forces the proof, and a ledger that keeps the failures. The pressure ribbon is a signature, not the product. The product is the grade.

## Stack and layout

Next.js 16 (App Router), React 19, TypeScript. One hand written stylesheet, no UI framework and no charting library. No database, no external API, and no model call at runtime. Every route is prerendered.

```
app/
  app/            routes, layout and the global stylesheet
  components/     tally bar, theme switch, ribbon, desk, ledger
  lib/            match data, generator, pundits, resolver, engine
  tests/          engine tests
  docs/DESIGN.md  the design system this build implements
```

## Run it

```
npm install
npm test
npm run dev
```

Open http://localhost:3000. Node 20.9 or newer.

## The demo

The live desk starts at 63:13 and runs at one minute per 2.2 seconds.

- At **65:00** control block's goal call is graded a **miss**.
- At **68:15** front foot's chance call is graded a **hit**.
- At full time the desk is quiet, and the recap has the verdict.

The clock can be held with `?at=63.23&paused=1`. `Pause` and `Restart` are at the bottom right. `?theme=dark` forces dark for a screenshot.

## Tests

```
npm test
```

Fifteen tests cover the parts that would make every screen a lie if they broke:

- the same seed builds the same match
- events are chronological and ids are unique
- pressure has one value per three minute bucket and stays in range
- the score equals the number of goal events
- every call cites evidence that exists, with a horizon inside the match
- a hit has a qualifying event, and a miss has none
- a hit is settled only by the team the call was about
- a void happens only when the feed conflict is inside the window
- the desk never shows a call it has not made yet
- records add up, and every match has at least one hit and one miss

## Limits, stated plainly

- The pundits are rule based, not a language model. That was a deliberate choice: every claim is reproducible, and the resolver can be tested. The reads are written from the event data at call time.
- There is no live feed. The generator is local and the matches are synthetic.
- The replay clock is a demo device. A real desk would consume a live feed and hold the same ledger.
- One match at a time, preferences in local storage only, no accounts.

## Deploy

Import the repository into Vercel. No environment variables. Build command `npm run build`, output is handled by Next.js.
