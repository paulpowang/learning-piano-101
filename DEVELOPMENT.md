# Little Keys

A browser-local, English / Traditional Chinese piano game for children and beginners. Runtime uses plain JavaScript, CSS, SVG and Web Audio, without external fonts or runtime packages.

## Run

```powershell
npm install
npm run dev
```

Open http://localhost:5173. Restart any older dev server when its served-file list changes. To use a different local port, set `$env:PORT = '5174'` before running the command. The development server binds to this computer; a physical tablet needs a separately reachable host. No production hosting or backend is configured.

## Learning and feedback

Eight beginner lessons now have three rounds: follow along, find the notes with less guidance, and connect them into a musical phrase. Their lengths are 6, 12, 12, 15, 18, 18, 21 and 24 notes. The first lesson remains a short single-note introduction. Later rounds reuse learned notes instead of introducing everything at once. Only middle practice rounds of lessons 4–6 shuffle; introductions and musical phrases keep their order.

Every right note grows a flower, highlights the staff/key and gives Pip a larger reaction. Each round has its own flowerbed; completed rounds stay marked on the phase track and the overall meter retains all progress. Round-end feedback celebrates a whole bed. The result garden displays every completed note. Reduced-motion mode uses the same visible progress and text without animation.

No timer, lost lives, speed scoring or error penalties. Two errors reveal the name and key. Every round has a repeatable demonstration, which cannot score and respects mute. A held key cannot score multiple notes. Inputs are ignored behind modal dialogs or during the brief demonstration. A correct note has a 750 ms feedback interval before advancing.

Mouse, touch and computer keyboard are supported: A/S/D/F/G/H/J/K for C4–C5 white keys; W/E/T/Y/U for black keys. Lessons teach C4–G4. Free Play also explores other keys; black keys play and display their sharp names while retaining the last white-key staff image.

## Tokens, song library and garden shop

First-time lesson completions earn 160 tokens across the chapter. Replaying a completed lesson does not grant a duplicate reward. Tokens are spendable balances, not automatic decoration thresholds.

| Complete single-note song arrangement | Notes | Cost | First completion reward |
| --- | ---: | ---: | ---: |
| Hot Cross Buns | 17 | 8 | 12 |
| Mary Had a Little Lamb | 26 | 12 | 20 |
| Twinkle, Twinkle, Little Star | 42 | 20 | 30 |

Songs are permanently unlocked on purchase and may be replayed free. Each first completion gives its reward once; a replay does not repeatedly generate tokens. Starting with the first lesson's 10 tokens, the three song purchases and first completions can fund one another (balances: 14, 22, 32). A beginner can return to the lessons or use free hints. Twinkle introduces A4 with its staff position and a reminder that it is the white key to the right of G.

Song play is untimed and presents a whole tune phrase by phrase, never a random subset. Results include optional full-song listening with simple rhythm durations. Listening does not score and is stopped when leaving the results or starting another activity. This remains pitch-reading practice, not rhythm assessment or a two-hand piano arrangement.

Purchases require confirmation. The garden shop contains seven optional decorations, priced 8/16/24/32/40/20/20 tokens: flowerpot, butterfly, windmill, rainbow, crown, lantern and blue blossoms. Bought items are equipped immediately; put them away or bring them back without spending again. Items appear in both the home garden and the lesson companion:

- Flowerpot: warm pink flowers.
- Butterfly: flutters on correct notes.
- Windmill: spins on correct notes.
- Rainbow: shines and colors the growth meter.
- Crown: worn by Pip.
- Lantern: glows on correct notes.
- Blue blossoms: changes the flower palette, taking precedence over the pink flowerpot.

None of these items changes difficulty or locks access to the eight core lessons. Currency totals are derived from completed lessons/songs minus unique purchases. Insufficient funds, unknown items and duplicate purchases cannot spend tokens twice.

## Readability and navigation

Core reading text uses stronger weight, darker ink and more distinct card backgrounds; body explanatory text is generally 16 px, with compact but legible lesson layouts. Automated checks cover a representative body-text contrast ratio greater than 4.5:1 and minimum weight/size. This is not a claim that every possible accessibility scenario has been audited.

The entire result view fits the initial viewport. Desktop results use a wide two-column layout for the garden/learning summary and rewards, with next actions below both columns. On phones and short landscape screens, garden artwork opens in a keyboard-accessible dialog. No content is parked below a fixed action bar. Layout tests assert document height as well as button visibility, including the full two-verse song. Both languages retain the current question, current phrase, feedback and hints when switched. `AGENTS.md` records these product requirements.

## Local state

This test revision uses a fresh `little-keys-progress-v2` localStorage key, as requested. It does not migrate v1 progress. The old key is left untouched.

Saved fields: `completed`, `explored`, `sound`, `locale`, `purchased`, `equipped`, `purchasedSongs`, `completedSongs`. Available tokens are derived rather than stored separately. Data is normalized on load; invalid ownership/completions and unaffordable records are discarded. A completed chapter, language preferences, purchases and equipment survive reload. Unfinished sessions start again from their beginning.

One learner per browser profile; no login, emails, analytics or cloud saving. Clearing browser data loses the local save. Storage failures are disclosed without blocking play. Currency is local test-game state, not real money or competitive scoring. Google login and server-validated rewards are outside this revision.

## Verification

```powershell
npm run check
npm test
npx playwright test --workers=2
```

Playwright uses installed Microsoft Edge and an isolated server on port 5180. It covers complete lessons and songs, purchase confirmation/cancel, balances and one-time rewards, equip persistence, bilingual input, touch layouts, reduced motion, visible completion actions, staff/audio pitch agreement, storage failures and representative typography/contrast. Some full-flow tests advance the browser clock to exercise transition timers without waiting in real time. Screenshots are in ignored `test-results/`.

See `PLAYTEST.md` for actual user observations; no child playtest has been performed by automated tests. Touch emulation does not replace a physical iPad/Safari check.

Static hosting must serve `index.html`, `styles.css`, `app.js`, `curriculum.js`, `music.js` and `i18n.js` together.


Purchased songs now use a two-line scrolling score with duration symbols and bar lines. Wide layouts show two measures per line; narrow layouts show one. Correct notes advance immediately, while held keyboard input is still suppressed. Each arrangement contains two explicitly labeled complete verses (34/52/84 notes). Listening never completes notes. Keyboard labels can be hidden in Settings and persist locally. Free play can switch between C4–C5 and C3–C4; low notes use the bass staff and the same physical key mapping. This is single-hand pitch/score exploration, not a full two-hand technique or MIDI course.


The curriculum now has 16 lessons. Lessons 9–12 teach upper treble and bass reading with automatic keyboard-octave mapping. Lessons 13–16 introduce sharps, flats, enharmonic equivalents and naturals; isolated-note exercises explicitly explain measure-wide accidental scope. Original chapter rewards remain 160; the expanded course awards 400 total. Song ownership has both a purple play action and a text label. The score current-note marker uses Pip above the staff, with a brief hop and persistent flowers on completed notes, rather than an opaque rectangle across staff lines.


The song shop includes nine original eight-measure studies, three each for higher treble, bass and accidentals, alongside the original three tunes. Each has two complete verses, a suggested prerequisite lesson (advisory, not a purchase lock), and a first-completion reward larger than its price. Song metadata selects the keyboard octave and score clef. Explicit accidentals retain their written staff position; naturals cancel earlier alterations of the same written pitch within a measure. Saves restore songs in purchase order to preserve any valid user-selected purchase/reward sequence.
