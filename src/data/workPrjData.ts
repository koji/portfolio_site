interface WorkProject {
  id: number;
  title: string;
  company: string;
  description: string;
  technologies: string[];
  period: string;
  highlights: string[];
  link?: string;
}

export const workProjects: WorkProject[] = [
  {
    id: 1,
    title: 'Unify Home - IoT hub system',
    company: 'Ubiquiti Networks',
    description:
      'Developed an IoT hub system that was based on Home Assistant. The system allowed users to control their home devices from a web app.',
    technologies: ['React', 'TypeScript', 'Threejs', 'Nodejs', 'Python', 'Home Assistant'],
    period: '2018 - 2020',
    highlights: [
      'Allowed users to control IoT devices from a 3D model viewer',
      'Space recognition that was based on an object detection',
      'iOS object detection prototype app',
    ],
  },
  {
    id: 2,
    title: 'Opentrons Desktop App/Touchscreen App',
    company: 'Opentrons',
    description:
      "Develop Opentrons Desktop App and Touchscreen App and maintain Opentrons' UI components",
    technologies: [
      'React',
      'TypeScript',
      'Electron',
      'Redux',
      'styled-components',
      'vite',
      'vitest',
    ],
    period: '2022 - Present',
    highlights: [
      'Led migration from styled-components to CSS Modules',
      'Switched the node package manager from yarn v1 to pnpm',
      'Added a new feature when re-designing the Desktop app',
      'Setup touchscreen app dev environment and developed 40% of touch screen app UI',
      'Increased test coverage by 5%',
      'Protocol Visualization',
      'ODD external keyboard support',
    ],
    link: 'https://github.com/Opentrons/opentrons',
  },
  {
    id: 3,
    title: 'Opentrons AI prototype',
    company: 'Opentrons',
    description: 'Designed frontend architecture and built Opentrons AI prototype frontend',
    technologies: ['React', 'TypeScript', 'Jotai', 'styled-components', 'vite', 'vitest'],
    period: '2024 - 2024',
    highlights: ['Design frontend architecture', 'Opentrons first AI app'],
    link: 'https://github.com/Opentrons/opentrons',
  },
  {
    id: 4,
    title: 'Internal tools',
    company: 'Opentrons',
    description: 'Building internal tools to support software team. Dashboard app, chrome extension for debugging, and VSCode extension',
    technologies: ['React', 'TypeScript', 'vite', 'vitest', 'chrome-extension', 'Cursor'],
    period: '2025 - Present',
    highlights: ['Building internal tools'],
    link: '',
  },
  {
    id: 5,
    title: 'New application',
    company: 'Opentrons',
    description: 'Building new application',
    technologies: [],
    period: '2026 - Present',
    highlights: ['Building internal tools'],
    link: '',
  },
];
