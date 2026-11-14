/**
 * Kavya Wani's portfolio content.
 *
 * Sources: "Personal INFO.txt" (Kavya's notes, newest), Kavya's answers in chat,
 * the appointment letter (current role) and Kavya_Wani_Resume.docx (older).
 *
 * Content integrity (DESIGN_SYSTEM.md §13): nothing here may be invented.
 * Every value that has not been supplied is a `todo(...)` placeholder, which renders
 * as a clearly marked "To add" note — never as a real claim. Optional fields that
 * were not supplied are simply left out.
 */

export interface Todo {
  todo: string;
}
export type Field = string | Todo;

export const todo = (hint: string): Todo => ({ todo: hint });
export const isTodo = (v: unknown): v is Todo =>
  typeof v === 'object' && v !== null && 'todo' in v;

export interface LinkField {
  label: string;
  href: Field;
}

/** A titled block of paragraphs. `**text**` marks bold. Written by Kavya. */
export interface ProseSection {
  title?: string;
  paragraphs: string[];
}

export const profile = {
  name: 'Kavya Wani',
  location: 'Mumbai, India',
  about: [
    {
      paragraphs: [
        "I'm **Kavya Wani**, an aspiring Data Scientist with a background in full-stack development, data analytics, and AI-driven development, based in Mumbai, India.",
        'I enjoy building practical web applications and transforming raw data into meaningful insights. Using technologies such as JavaScript, Node.js, MongoDB, SQL, Excel, and Python, I work across both software development and data analysis to solve real-world problems.',
      ],
    },
    {
      title: 'My Journey',
      paragraphs: [
        'I graduated in 2026 with a **Bachelor of Computer Applications (BCA)** from K P B Hinduja College of Commerce. During my academic journey, I collaborated with a teammate to develop **OppHub**, a full-stack platform for discovering scholarships and other opportunities. I later built **Vibe Analysis**, an end-to-end e-commerce analytics project focused on exploring transaction data, identifying trends, and presenting insights through an interactive dashboard.',
        'Since October 2026, I have been working as a **Junior Analyst – AI Automation at Prophetic Business Solutions**. In this role, I work on AI automation and MIS reporting in collaboration with the accounting team, gaining practical experience in business reporting and data-driven workflows.',
      ],
    },
    {
      title: "Where I'm Heading",
      paragraphs: [
        'My long-term goal is to grow into a **Data Scientist**, strengthening my skills in Python, statistics, data analysis, and machine learning. At the same time, I want to continue exploring AI-driven development and building useful applications that combine technology with practical problem-solving.',
      ],
    },
    {
      title: 'Beyond Technology',
      paragraphs: [
        'Outside of work, I enjoy playing games, listening to music, editing videos, and creating digital content. These interests give me another way to explore creativity and learn new skills.',
      ],
    },
  ] as ProseSection[],
};

export interface Project {
  title: string;
  tagline: string;
  /** e.g. "Final-year group project · 2024 – 2025" */
  context?: string;
  /** Only set for work that is not finished, e.g. "In development". */
  status?: string;
  /** Screenshot in /public (real captures of the live project only). */
  image?: { src: string; alt: string };
  summary: string;
  highlights: string[];
  technologies: string[];
  links: LinkField[];
}

export const projects: Project[] = [
  {
    title: 'Interactive 3D Portfolio',
    tagline: 'This website — a miniature village you explore by car',
    context: 'Personal project · 2026',
    image: {
      src: '/projects/portfolio.jpg',
      alt: 'The portfolio world: a red SUV on a winding road linking five destinations in a meadow village with a windmill and farm field',
    },
    summary:
      'A portfolio you explore instead of scroll: a red SUV drives along a winding road to five destinations in a small 3D village, and each stop opens a section of the portfolio.',
    highlights: [
      'Planned the concept, layout, content and design decisions, and directed the build through AI-driven development.',
      'Real-time 3D in the browser: a free-orbit camera, a chase view while driving, close-ups on arrival, and gentle ambient motion such as swaying trees and a turning windmill.',
      'Accessible by design: a Destinations menu for direct navigation, keyboard support, and a reduced-motion mode that keeps the scene still.',
      'Quick first load: the page appears at once and the 3D scene loads behind a loading screen.',
    ],
    technologies: ['React', 'TypeScript', 'Vite', 'Three.js', 'React Three Fiber'],
    links: [
      { label: 'Live site', href: 'https://www.kavyawani.indevs.in/' },
      { label: 'GitHub', href: 'https://github.com/kavya-arch-cmd/portfolio' },
    ],
  },
  {
    title: 'Vibe Analysis',
    tagline: 'E-commerce data analytics',
    context: 'Personal portfolio project · 2026',
    image: {
      src: '/projects/vibe-analysis.jpg',
      alt: 'Vibe Analysis dashboard with KPI cards, filters and revenue charts',
    },
    summary:
      'An end-to-end analytics project on a raw e-commerce dataset of about 25,000 transactions, from data cleaning and modelling to an interactive dashboard.',
    highlights: [
      'Planned the analysis and directed the build through AI-driven development.',
      'Dataset: four raw CSV files (~25,000 transactions, 2,000 customers, 100 products, 20 regions), cleaned to fix duplicate IDs, invalid dates and inconsistent product categories, with returns flagged.',
      'Data structured as a star schema — a fact_orders table with customer, product, region and date dimensions.',
      'Interactive dashboard with KPI cards and filters: revenue ($29.5M), profit ($6.76M), average order value, monthly trends, revenue by category and profit by region.',
    ],
    technologies: ['Python (Pandas)', 'SQL', 'HTML', 'CSS', 'JavaScript', 'Chart.js'],
    links: [
      { label: 'Live dashboard', href: 'https://kavya-arch-cmd.github.io/vibe-analysis/' },
      { label: 'GitHub', href: 'https://github.com/kavya-arch-cmd/vibe-analysis' },
    ],
  },
  {
    title: 'OppHub',
    tagline: 'Scholarship & opportunity aggregator platform',
    context: 'Final-year project with a teammate · 2024 – 2025',
    image: {
      src: '/projects/opphub.jpg',
      alt: 'OppHub landing page with sign-up and feature sections',
    },
    summary:
      'A full-stack web platform that brings six kinds of opportunities — scholarships, internships, fellowships, grants, competitions and training programmes — into one place to discover and track.',
    highlights: [
      'Built together with a teammate — we both worked across the frontend, backend and database.',
      'Registration and authentication, profile management, search and filtering, and application tracking.',
      'Framework-free frontend in HTML, CSS and JavaScript, with a Node.js and Express.js backend.',
      'Configured a MongoDB Atlas database for user profiles, opportunity records and preferences.',
      'Built CRUD functionality for the admin panel and integrated the Google Gemini API.',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB Atlas', 'Gemini API'],
    links: [
      { label: 'Live demo', href: 'https://kavya-arch-cmd.github.io/OppHub' },
      { label: 'GitHub', href: 'https://github.com/kavya-arch-cmd/OppHub' },
    ],
  },
];

export interface SmallProject {
  title: string;
  summary: string;
  status?: string;
  link?: LinkField;
}

export const otherProjects: SmallProject[] = [
  { title: 'Travel Agent Booking Application', summary: 'A booking application built with Google Apps Script.' },
  {
    title: 'Question Paper Scanner',
    summary: 'Scans question papers with OCR and converts them into editable DOCX files.',
    status: 'In development',
  },
  {
    title: 'Festival invitation websites',
    summary: 'Interactive invitation websites for Ganpati and Diwali, including one for a 25th-year Ganpati celebration.',
    link: { label: 'Ganpati invitation', href: 'https://kavya-arch-cmd.github.io/ganpati-invitation/' },
  },
];

export interface SkillGroup {
  name: string;
  items: Field[];
}

export const skillGroups: SkillGroup[] = [
  {
    name: 'Programming & Web Development',
    items: ['HTML', 'CSS', 'JavaScript', 'Python', 'Node.js', 'Express.js'],
  },
  {
    name: 'Databases & Database Management',
    items: ['MySQL', 'MySQL Workbench', 'PostgreSQL', 'MongoDB Atlas', 'Mongoose', 'DBMS'],
  },
  {
    name: 'Data Analytics & Business Intelligence',
    items: ['SQL', 'Microsoft Excel', 'Data analysis', 'KPI reporting', 'Financial and MIS reporting'],
  },
  {
    name: 'AI-Driven Development & Productivity',
    items: ['AI-driven development', 'AI-assisted productivity', 'Prompt engineering', 'Visual Studio Code', 'GitHub'],
  },
];

export interface TimelineEntry {
  title: Field;
  organisation: Field;
  /** Left out when not supplied. */
  period?: Field;
  details: Field[];
}

export const experience: TimelineEntry[] = [
  {
    title: 'Junior Analyst – AI Automation',
    organisation: 'Prophetic Business Solutions (PBS) / PROSOL.AI, Mumbai',
    period: 'October 2026 – Present',
    details: [
      'Work on AI automation with the accounting team, and help enhance and test the company’s software products.',
      'Built an MIS web application through AI-driven development that turns Tally Trial Balances into monthly P&L, EBITDA, working capital and budget-variance reports.',
      'Build Excel-based reports and dashboards.',
    ],
  },
];

export const education: TimelineEntry[] = [
  {
    title: 'Bachelor of Computer Applications (BCA)',
    organisation: 'K P B Hinduja College of Commerce',
    period: '2023 – 2026',
    details: ['CGPA: 7.72'],
  },
  {
    title: 'HSC (Commerce)',
    organisation: 'S. K. Somaiya Vinay Mandir Junior College',
    period: '2021 – 2023',
    details: ['72.67%'],
  },
  {
    title: 'SSC',
    organisation: 'M. D. Bhatia English Medium High School',
    period: '2021',
    details: ['70.40%'],
  },
];

export interface Certificate {
  name: string;
  issuer: Field;
  date?: string;
  /** Issuer's public verification page. */
  verifyUrl?: string;
  /** Copy of the certificate in /public/certificates. */
  file?: string;
}

/** Newest first. Dates, issuers and links are taken from the certificate files. */
export const certificates: Certificate[] = [
  {
    name: 'Claude 101',
    issuer: 'Anthropic · Claude Academy',
    date: 'November 2026',
    verifyUrl: 'https://academy.claude.com/verify/3460dbf0259965bc6c5badb0afb3a741',
    file: '/certificates/claude-101.pdf',
  },
  {
    name: 'AI Capabilities and Limitations',
    issuer: 'Anthropic · Claude Academy',
    date: 'November 2026',
    verifyUrl: 'https://academy.claude.com/verify/0e19ccc85d7ef24a0a7e7a3451a56ffa',
    file: '/certificates/ai-capabilities-and-limitations.pdf',
  },
  {
    name: 'Data Literacy',
    issuer: 'IBM SkillsBuild',
    date: 'November 2026',
    verifyUrl: 'https://www.credly.com/go/qSKnqGQT',
    file: '/certificates/ibm-data-literacy.pdf',
  },
  {
    name: 'Essentials of Prompt Engineering',
    issuer: 'AWS Training & Certification',
    date: 'September 2026',
    file: '/certificates/aws-essentials-of-prompt-engineering.pdf',
  },
  {
    name: 'Pre Security Learning Path',
    issuer: 'TryHackMe',
    date: 'April 2026',
    file: '/certificates/tryhackme-pre-security.pdf',
  },
  { name: 'Microsoft Excel', issuer: 'SkillCourse', date: '2026' },
  { name: 'Web Designing & PHP Development', issuer: 'Asterix Solution', date: '2024' },
];

export const contact = {
  email: 'kavyawani98@gmail.com',
  phone: '+91 88790 15066',
  location: profile.location,
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kavya-wani-319014360/' },
    { label: 'GitHub', href: 'https://github.com/kavya-arch-cmd' },
  ] as LinkField[],
};

/** Path or URL to the résumé PDF (e.g. '/resume.pdf' placed in /public). */
export const resumeUrl: Field = '/Kavya_Wani_Resume.pdf';
