export type DestinationId =
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'certificates';

export interface Destination {
  id: DestinationId;
  /** Exact section title (DESIGN_SYSTEM.md §3). */
  title: string;
  /** Lines as painted on the signboard. */
  sign: string[];
}

export const DESTINATIONS: Destination[] = [
  { id: 'about', title: 'About Me', sign: ['ABOUT ME'] },
  { id: 'projects', title: 'Projects', sign: ['PROJECTS'] },
  { id: 'skills', title: 'Skills & Technologies', sign: ['SKILLS &', 'TECHNOLOGIES'] },
  { id: 'experience', title: 'Experience & Education', sign: ['EXPERIENCE &', 'EDUCATION'] },
  { id: 'certificates', title: 'Certificates', sign: ['CERTIFICATES'] },
];

export const DESTINATION_BY_ID = Object.fromEntries(
  DESTINATIONS.map((d) => [d.id, d]),
) as Record<DestinationId, Destination>;
