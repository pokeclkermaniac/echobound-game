# King Squashbuckler — Production Encounter Specification

## Purpose

King Squashbuckler is the first full-run boss. He tests three skills introduced across the Fizzlefruit Isles:

1. Reading enemy intents.
2. Guarding before large attacks.
3. Altering a plan to control an accumulating threat.

The fight is deterministic. A loss should feel attributable to a decision rather than hidden randomness.

## Core statistics

| Property | Value |
| --- | ---: |
| Health | 210 |
| Phase 2 threshold | 140 HP |
| Phase 3 threshold | 70 HP |
| Maximum Seedlings | 4 |
| Seedling cannon bonus | 3 damage each |
| Initial Power | 0 |

Crossing a threshold immediately changes the displayed phase, clears Squashbuckler’s Guard, resets his intent sequence, and presents a phase banner.

## Phase 1 — The Royal Court

| Order | Intent | Result |
| ---: | --- | --- |
| 1 | Royal Wallop | 9 damage |
| 2 | Call the Court | Summon 2 Seedlings |
| 3 | Seed Cannonade | 8 damage + 3 per active Seedling |

This phase teaches the boss’s unique resource. Quickstep removes one active Seedling in addition to its normal effect.

## Phase 2 — The Court Gets Rowdy

| Order | Intent | Result |
| ---: | --- | --- |
| 1 | Rind Parry | Gain 13 Guard |
| 2 | More Minions! | Summon 1 Seedling |
| 3 | Royal Ricochet | 11 damage + 3 per active Seedling |
| 4 | Booted Boogie | 13 damage |

The phase begins defensively and pressures the player to decide between clearing Guard, controlling Seedlings, and preparing their own Guard.

## Phase 3 — Mustache Tantrum

| Order | Intent | Result |
| ---: | --- | --- |
| 1 | Mustache Tantrum | Gain 2 permanent Power |
| 2 | Crown Pound | 12 damage + Power |
| 3 | Grand Finale | 13 damage + Power + 3 per active Seedling |

Power accumulates each time the sequence repeats, preventing indefinite defensive play.

## Production assets

- `assets/creatures.svg#king-squashbuckler` — scalable layered boss rig.
- `assets/creatures.svg#royal-seedling` — scalable summoned-unit rig.
- `assets/boss-icons.svg` — six boss-specific intent symbols.
- `styles/game.css` — three arena palettes, boss sizing, phase pips, Seedling court, phase splash, and responsive treatments.

The boss rig keeps arms, legs, cape, body, mustache, trumpet, crown, hands, and boots as separate named SVG groups or paths where practical. These can be targeted by later CSS or Web Animations API sequences without replacing the asset.

## Animation contract

Future multi-pose animation should target:

- `.arm-upper-left`, `.arm-lower-left`, `.arm-upper-right`, `.arm-lower-right`
- `.leg-left`, `.leg-right`
- `.mustache`
- `.seed-trumpet`
- `.cape`
- `.body`

Required animation states for the full production pass:

- Idle
- Royal Wallop
- Call the Court
- Cannonade
- Rind Parry
- Booted Boogie
- Mustache Tantrum
- Crown Pound
- Hurt
- Phase transition
- Defeat

## Audio direction

No audio files are included yet. Intended cues:

- Muted brass “wah” for intent changes.
- Seed shaker percussion for summoned Seedlings.
- Comedic compressed trumpet blast for Cannonade.
- Boot taps for Booted Boogie.
- Ascending kazoo/brass sting for phase transitions.
- Deflating brass slide for defeat.

All gameplay information remains visually available; audio must never be required to read an intent.

## Accessibility

- Every incoming move is named and described before execution.
- Phase is represented by text, color, and pips.
- Seedling quantity is represented by character icons and an accessible count.
- `prefers-reduced-motion` disables phase and Seedling animations.
- Color is never the only indicator of a state change.

## Balance acceptance criteria

- A healthy, unmodified Generation 1 Bop can win through correct Guard and Seedling control.
- Ignoring Seedlings meaningfully increases Cannonade damage.
- Phase 3 cannot loop forever because Power is permanent.
- Winning opens inheritance and does not increment the normal-encounter win counter.
- The full first-region route ends at node 5 with exactly three normal wins.
