# Project memory — Little Keys

## Learner-facing navigation

- User requirement (2026-10-19): after completing a lesson, the learner must see and be able to press “Next little adventure” immediately, without scrolling down. On the final lesson, the collection action must be equally accessible.
- Keep result actions visible in the initial viewport on desktop, phone, and tablet in portrait and landscape, in both English and Traditional Chinese. Rewards, badges, decorations, and celebration artwork must not push the next action off screen.
- The entire result screen must fit the initial viewport, not just a fixed next button. Use available desktop width for a side-by-side garden/summary and reward panel. On small or short screens, move secondary artwork into an accessible dialog rather than below the fold. Do not hide overflow to conceal content; verify actual document height and readable controls.
- When changing result layouts, verify a real first completion with newly awarded badges/decorations as well as the final lesson. Check initial visibility and clickability, not merely whether the button exists in the DOM.

## Readability, engagement and rewards

- User feedback (2026-10-19): light, thin type and similar foreground/background colors were tiring to read. Prioritize readable text weight, adequate size and contrast over a low-contrast pastel appearance.
- Low frustration is necessary but insufficient: provide noticeable success feedback and enough varied practice to build a feeling of progress. Preserve a short first introduction; subsequent lessons have three rounds with gradually reduced guidance and musical phrases.
- Tokens must have an actual use. The user specifically requested buying complete song lessons, earning more tokens upon completion, and using those earnings toward further songs. Preserve this loop when extending content.
- Decorations are optional purchasable/equippable effects that appear in the garden and lessons; they must not be granted automatically just because a token threshold is reached.
- User explicitly waived compatibility with old test saves. This revision uses the v2 storage key and leaves v1 untouched.

## Song performance (2026-10-19)

- Purchased songs must feel like performances, not isolated note quizzes. Keep at least two score lines visible, follow completed lines within the score pane, and keep piano controls in place.
- Song input advances immediately without the teaching-mode success delay. Preserve forgiving wrong-note handling and full rewards with hints.
- Explicitly label repeated complete verses; do not present repetitions as newly composed sections. Show note durations and allow listening before playing without awarding progress.
- Computer-keyboard letter labels are a persistent optional setting. Hiding them must not disable keyboard input.
- Free play includes C3–C4 with bass clef. Computer key layouts do not teach real piano fingering; do not require simultaneous two-hand chords for beginners.

## Score feedback and curriculum extension (2026-10-19)

- Never obscure staff lines with an opaque current-note highlight. Pip hops above the current note; completed notes leave flowers above the staff. Respect reduced-motion settings.
- Purchased songs need a visibly distinct play button and an explicit ownership label, not only a changed action string.
- Curriculum continues beyond lesson 8: lessons 9–12 cover A4/B4/C5, C5–G5, and bass C3–A3; lessons 13–16 introduce sharps, flats, enharmonic spellings and naturals. Keep these gentle, single-hand and three-stage.
- Lesson keyboards switch to the required octave. Flats and their sharp equivalents must sound and score identically while retaining their correct written staff position. A semitone is the adjacent key, not always a black key.
- The original chapter still earns 160 tokens and its badge at lesson 8. Eight additional lessons earn 30 each (400 total); chapter-one badges must stay earned after continuing.

- The shop has three practice songs per new learning category (upper treble, bass, accidentals), in addition to the original three. New studies are labeled original, contain eight measures played twice, and display suggested lesson prerequisites without blocking purchases. Preserve arbitrary purchase order in local saves.
