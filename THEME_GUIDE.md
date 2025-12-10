# Travel App Theme Guide

## 🎨 Color Palette

### Primary Colors
- **Teal** (`--brand`): `#0D9488` - Used for primary buttons, links, and important actions.
- **Teal Light** (`--brand-light`): `#14B8A6` - Hover/focus states.
- **Teal Dark** (`--brand-dark`): `#0F766E` - Active/pressed states.

### Accent Colors
- **Coral** (`--accent`): `#F97316` - Secondary buttons, highlights.
- **Coral Light** (`--accent-light`): `#FB923C` - Hover states.
- **Coral Dark** (`--accent-dark`): `#EA580C` - Active states.

### Neutrals
- **Text** (`--text`): `#1E293B` - Primary text.
- **Text Muted** (`--text-muted`): `#64748B` - Secondary text.
- **Background** (`--bg`): `#F5F7FB` - Page background.
- **Surface** (`--surface`): `#FFFFFF` - Cards/containers.
- **Border** (`--border`): `#E2E8F0` - Dividers/borders.

## 🖋 Typography

### Font Families
- **Headings**: `Poppins` (600 weight)
- **Body**: `Inter` (400/500 weight)

### Usage
```css
/* In CSS */
.heading {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.body-text {
  font-family: 'Inter', sans-serif;
}

/* In Tailwind */
<h1 className="font-heading text-2xl font-semibold">