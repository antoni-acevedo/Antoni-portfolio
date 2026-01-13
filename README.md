# Portfolio Template built with Astro & Tailwind CSS

This is a modern, high-performance portfolio template built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

## Features

- **⚡️ Super Fast**: Built with Astro for zero-JS by default.
- **🎨 Tailwind CSS v4**: Using the latest CSS-first configuration.
- **💎 Premium Design**: Glassmorphism, smooth gradients, and micro-animations.
- **📱 Responsive**: Fully optimized for mobile, tablet, and desktop.
- **🌗 Dark Mode**: Built with a dark theme by default.
- **🔒 TypeScript**: Type-safe development.

## Project Structure

```text
/
├── src/
│   ├── components/
│   ├── layouts/
│   │   └── Layout.astro      # Main layout with SEO & Fonts
│   ├── pages/
│   │   └── index.astro       # Landing page
│   └── styles/
│       └── global.css        # Tailwind imports & custom styles
├── public/
└── package.json
```

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Customization

- Edit `src/pages/index.astro` to update your Content, Skills, and Projects.
- Edit `src/layouts/Layout.astro` to update the global `<head>`, fonts, or background.
