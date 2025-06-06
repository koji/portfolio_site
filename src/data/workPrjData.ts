interface WorkProject {
  id: string;
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
    id: '1',
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
      'Added a new feature when re-designing the Desktop app',
      'Setup touchscreen app dev environment and developed 40% of touch screen app UI',
      'Increased test coverage by 5%',
    ],
    link: 'https://github.com/Opentrons/opentrons',
  },
  {
    id: '2',
    title: 'Opentrons AI prototype',
    company: 'Opentrons',
    description: 'Designed frontend architecture and built Opentrons AI prototype frontend',
    technologies: ['React', 'TypeScript', 'Jotai', 'styled-components', 'vite', 'vitest'],
    period: '2024 - 2024',
    highlights: ['Design frontend architecture', 'Opentrons first AI app'],
    link: 'https://github.com/Opentrons/opentrons',
  },
  {
    id: '3',
    title: 'Unify Home - IoT hub system',
    company: 'Ubiquiti Networks',
    description:
      'Developed an IoT hub system that was based on Home Assistant. The system allowed users to control their home devices from a web app.',
    technologies: ['React', 'TypeScript', 'Threejs', 'Nodejs', 'Python', 'Home Assistant'],
    period: '2028 - 2020',
    highlights: [
      'Allowed users to control IoT devices from a 3D model viewer',
      'Space recognition that was based on an object detection',
      'iOS object detection prototype app',
    ],
  },
];
