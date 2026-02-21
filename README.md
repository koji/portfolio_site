# Portfolio Website

A modern, responsive portfolio website built with React and TypeScript. This project showcases my skills, projects, and experience in a clean, interactive interface.

## 🚀 Features

- **Responsive Design**: Looks great on all devices
- **Modern UI Components**: Built with Radix UI primitives
- **Interactive Elements**: Uses animations and transitions for an engaging user experience
- **3D Graphics**: Three.js integration for advanced visual effects
- **Dark/Light Mode**: Theme switching with next-themes
- **Form Handling**: Robust forms with react-hook-form and zod validation
- **Routing**: Client-side navigation with react-router-dom
- **Data Visualization**: Charts and graphs with recharts
- **Accessibility**: Built with accessibility in mind
- **Portfolio Chat**: RAG-style chat backed by a dedicated backend and Cerebras API

## 🛠️ Tech Stack

- **Core**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: Radix UI, shadcn/ui patterns


## 📦 Installation

Make sure you have [Node.js](https://nodejs.org/), [bun](https://bun.com/), and [pnpm](https://pnpm.io/) installed.

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio_site.git
cd portfolio_site

# Install dependencies
pnpm install

# Install backend dependencies
cd backend
pnpm install
cd ..
```

## 🧰 Available Scripts

```bash
# Start development server
bun run dev
pnpm dev

# Build for production
bun run build
pnpm build

# Build for development
bun run build:dev
pnpm build:dev

# Lint code
bun run lint
pnpm lint

# Preview production build
bun run preview
pnpm preview
```

## 🚧 Development

1. Start the development server:
   ```bash
   bun run dev
   pnpm dev
   ```

2. Start the chat backend in another terminal:
   ```bash
   cd backend
   cp .env.example .env.local
   # set CEREBRAS_API_KEY in backend/.env.local
   bun run dev
   ```

4. Open your browser and visit [http://localhost:8080/](http://localhost:8080/)

5. Make changes to files in the `src` directory to see live updates

## 🌐 Deployment

Build the project for production:

```bash
bun run build
pnpm build
```

The build artifacts will be stored in the `dist/` directory, ready to be deployed to your hosting provider of choice.

## 📝 License

[MIT](LICENSE)

---

Made with ❤️ by koji
