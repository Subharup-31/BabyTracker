# Design Guidelines: Premium Pediatric Baby Tracker SaaS

## Design Approach

**Reference-Based Approach** drawing inspiration from:
- **Linear**: Clean typography, subtle gradients, generous spacing
- **Notion**: Card-based layouts, soft shadows, organized information hierarchy
- **Framer**: Smooth transitions, modern aesthetics, premium feel

Adapted with a **calm, nurturing baby-care aesthetic** - soft, approachable, trustworthy, and professional.

**Core Design Principles:**
1. Gentle professionalism - medical precision with parental warmth
2. Clarity and scannability - parents are busy, information must be instant
3. Touch-friendly - optimized for mobile-first interaction
4. Reassuring visual language - reduce anxiety, increase confidence

---

## Typography System

**Primary Font:** Inter (via Google Fonts CDN)
**Secondary Font:** Poppins for headings (rounded, friendly)

**Type Scale:**
- Hero Headline: `text-5xl md:text-6xl lg:text-7xl font-bold` (Poppins)
- Section Headings: `text-3xl md:text-4xl font-semibold` (Poppins)
- Card Titles: `text-xl font-semibold` (Inter)
- Body Text: `text-base leading-relaxed` (Inter)
- Small Text/Labels: `text-sm` (Inter)
- Micro Text: `text-xs` (Inter)

**Font Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

---

## Layout & Spacing System

**Spacing Primitives:** Use Tailwind units of **2, 4, 6, 8, 12, 16, 20, 24** for consistency
- Tight spacing: `gap-2`, `p-4`
- Standard spacing: `gap-6`, `p-8`
- Section spacing: `py-16 md:py-24`, `px-6 md:px-8`

**Container Strategy:**
- Landing page sections: `max-w-7xl mx-auto px-6`
- App pages: `max-w-6xl mx-auto px-4`
- Content cards: `max-w-4xl mx-auto`
- Form containers: `max-w-md mx-auto`

**Grid Systems:**
- Feature cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
- Dashboard cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- Two-column layouts: `grid grid-cols-1 lg:grid-cols-2 gap-12`

---

## Component Library

### Landing Page Components

**Hero Section** (80vh)
- Large headline with subheadline
- Two-button CTA group (primary + secondary)
- Soft gradient background with abstract baby-themed illustration/image
- Use hero image showing happy parent with baby using the app on tablet

**Feature Cards**
- Rounded corners: `rounded-2xl`
- Soft shadow: `shadow-lg hover:shadow-xl transition-shadow`
- Icon at top (Heroicons via CDN)
- Title + 2-3 line description
- Padding: `p-8`

**How It Works Section**
- Numbered steps (1-4) with large circular numbers
- Step title + description in vertical cards
- Connecting line/arrow between steps (decorative)

**Testimonials**
- Quote card with rounded avatar image (left or top)
- Name, role below quote
- Star rating using Heroicons
- Layout: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

**CTA Section**
- Full-width gradient container: `py-20`
- Centered content with large button
- Supporting text above button

**Footer**
- Three-column layout: Brand/Logo, Quick Links, Legal
- Social icons (Heroicons)
- Padding: `py-12`

### App Components

**Navigation**
- Bottom nav bar (mobile): Fixed position with 5 tabs
- Each tab: Icon + label, active state with indicator
- Height: `h-16`, icons at `w-6 h-6`

**Dashboard Cards**
- Stat cards: Icon + label + value + trend indicator
- Quick action buttons: Full-width with icon prefix
- Mini chart preview: Simple line chart component
- Card padding: `p-6`, rounded: `rounded-xl`

**Baby Profile Card**
- Avatar upload area: Circular, `w-24 h-24 md:w-32 md:h-32`
- Form fields: Stacked with labels above inputs
- Input styling: `rounded-lg border-2 px-4 py-3`
- Edit/Save buttons at bottom

**Vaccine Tracker**
- List view with cards for each vaccine
- Status badge: `rounded-full px-3 py-1 text-xs font-medium`
- Badge positions: Top-right of card
- Due date prominently displayed
- Add vaccine button: Floating action button (bottom-right) or top-right header button

**Growth Tracker**
- Data entry form: Two-column (height/weight) with date picker
- Table: Responsive with zebra striping
- Chart container: `h-96` with responsive scaling
- Download PDF button: Icon + text, prominent placement

**Chatbot Interface**
- Message bubbles: Different styling for user vs AI
- User messages: Align right, `rounded-2xl rounded-br-sm`
- AI messages: Align left, `rounded-2xl rounded-bl-sm`
- Input area: Fixed bottom with send button
- Bubble padding: `px-4 py-3`, max-width: `max-w-xs md:max-w-md`

**Form Elements**
- Input fields: `h-12`, `rounded-lg`, focus ring
- Labels: `text-sm font-medium mb-2`
- Error states: Red border with error text below
- Select dropdowns: Match input styling
- Date pickers: Native or calendar component

**Buttons**
- Primary: Large padding `px-8 py-3`, `rounded-lg`, bold text
- Secondary: Border style with transparent background
- Icon buttons: Square `w-10 h-10`, centered icon
- Disabled state: Reduced opacity

### Cards & Containers
- Standard card: `rounded-xl shadow-md p-6`
- Nested card: `rounded-lg p-4`
- All cards have subtle hover lift: `hover:shadow-lg transition-shadow`

---

## Images

**Landing Page Hero:** Large hero image (1200x800) showing happy parent holding baby while looking at tablet/phone with app interface visible. Warm, inviting, natural lighting. Position right side of hero section with text on left.

**Feature Section Icons:** Use Heroicons for vaccine, growth chart, document, and chat bubble icons. Size: `w-12 h-12`.

**Testimonial Avatars:** Circular placeholder images of parents (stock photos). Size: `w-16 h-16`.

**Dashboard:** Optional baby profile photo upload with placeholder (baby icon or silhouette).

**Growth Chart:** Dynamically generated chart visualization - no static image needed.

---

## Animations

Minimal animations for professional feel:
- Card hover: Shadow elevation only
- Button interactions: Built-in hover states
- Page transitions: None (instant navigation)
- Chart rendering: Simple fade-in on mount

---

## Accessibility

- All interactive elements have `min-h-11` for touch targets
- Form inputs with visible focus states
- Consistent label-input association
- Icon-only buttons include `aria-label`
- Sufficient contrast ratios maintained throughout
- Semantic HTML structure (headings hierarchy)