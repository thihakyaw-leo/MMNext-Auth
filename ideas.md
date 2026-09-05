# MMNext POS Login — Design Direction

## Three stylistic approaches

### Theme Name: Green Ledger
Very Brief Intro: A calm, trustworthy business interface built from forest green, warm cream, and muted gold. It feels operational and dependable while retaining a distinctly Myanmar character.
Probability: 0.07

### Theme Name: Modern Pagoda
Very Brief Intro: A spacious editorial login composition using architectural silhouettes, soft paper texture, and restrained ornamental details. It connects local visual heritage with modern SaaS clarity.
Probability: 0.03

### Theme Name: Counter Light
Very Brief Intro: A bright, utility-first POS experience with a strong split layout, crisp controls, and subtle green status cues. It prioritizes speed and readability for daily store operations.
Probability: 0.08

## Selected approach: Green Ledger

### Design Movement
Contemporary Myanmar business modernism: a restrained blend of Swiss-style information hierarchy, premium editorial whitespace, and local ornamental cues.

### Core Principles
1. Make the login task immediate: identity, input, and next action must be obvious at a glance.
2. Use green as a signal of trust and operational readiness, not as decorative saturation.
3. Let warm cream and paper-like texture soften the interface without compromising contrast or accessibility.
4. Use Myanmar-inspired motifs sparingly as provenance and memory, never as visual clutter.

### Color Philosophy
Forest green communicates trust, continuity, and a healthy business ledger. Secondary green marks action and forward movement. Warm cream keeps the page welcoming and reduces the harshness of pure white. Muted gold is reserved for heritage details and small moments of emphasis; it should never compete with the login action. Text remains deep charcoal-green for strong readability.

### Layout Paradigm
A deliberate split composition: a narrow visual brand rail carries the emotional identity, while the larger cream work surface carries the form. The form is vertically balanced but not trapped in a generic centered card; it aligns to a quiet content column with a compact utility header and clear bottom reassurance.

### Signature Elements
- A small green-and-gold ornamental rule under the brand lockup.
- A soft paper grain with faint Myanmar-inspired linework around the visual rail.
- A mint checkmark motif repeated only in the app mark and success/action states.

### Interaction Philosophy
Interactions should feel like confident POS hardware: immediate, legible, and reassuring. Focus states use a visible green ring; submit feedback uses a short progress transition; errors explain the next action without alarmist language. Password visibility is available without moving the field or changing layout.

### Animation
Use a restrained 180–240ms ease-out entrance for the brand rail and form column. Inputs lift by one or two pixels on focus only when it improves clarity. The submit button responds with a subtle scale-down on press and a compact inline spinner while authenticating. Respect reduced-motion preferences and avoid continuous animation.

### Typography System
Use Poppins for wordmark-adjacent headings and controls, with a clean Burmese-capable sans-serif fallback for Myanmar copy. Headline hierarchy is compact and semibold; labels are 12–13px with generous tracking; body copy is 14–15px and never lower than the contrast needed for comfortable reading.

### Brand Essence
MMNext POS is a reliable, Myanmar-ready workspace for businesses that want everyday sales operations to feel simple and under control.
Personality: dependable, precise, welcoming.

### Brand Voice
Headlines are calm and action-oriented. CTAs are direct, never inflated. Microcopy gives the user confidence about what happens next.
Example headline: “Your counter, ready when you are.”
Example CTA: “Continue to POS”.

### Wordmark & Logo
Use the supplied MMNext POS logo where available. For compact contexts, use a bold geometric M-and-check mark with clear space and no added effects. Never typeset the brand name as a substitute for the supplied mark.

### Signature Brand Color
Primary Green — `#1B4332`.

## Implementation reminder
Every page, component, and stylesheet edited for this project must begin with a short comment naming the Green Ledger design direction and the file-specific styling responsibility. Ask before each choice: “Does this reinforce or dilute Green Ledger?”
