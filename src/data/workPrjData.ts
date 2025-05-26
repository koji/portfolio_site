interface WorkProject {
  id: string
  title: string
  company: string
  description: string
  technologies: string[]
  period: string
  highlights: string[]
  link?: string
}

export const workProjects: WorkProject[] = [
  {
    id: '1',
    title: 'Opentrons Desktop App/Touchscreen App',
    company: 'Opentrons',
    description:
      'Led the complete redesign and development of a modern e-commerce platform serving 100k+ users',
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
      'Improved conversion rate by 35%',
      'Reduced page load time by 60%',
      'Implemented accessibility standards',
    ],
    link: 'https://github.com/Opentrons/opentrons',
  },
  {
    id: '2',
    title: 'Opentrons AI prototype',
    company: 'Opentrons',
    description: 'Developed Opentrons AI prototype frontend',
    technologies: [
      'React',
      'TypeScript',
      'Jotai',
      'styled-components',
      'vite',
      'vitest',
    ],
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
    technologies: [
      'React',
      'TypeScript',
      'Threejs',
      'Nodejs',
      'Python',
      'Home Assistant',
    ],
    period: '2028 - 2020',
    highlights: [
      'Allowed users to control IoT devices from a 3D model viewer',
      'Space recognition that was based on an object detection',
      'iOS object detection prototype app',
    ],
  },
]
