import type { ReactNode } from 'react';
import { DESTINATION_BY_ID, type DestinationId } from '../content/destinations';
import {
  certificates,
  contact,
  education,
  experience,
  isTodo,
  otherProjects,
  profile,
  projects,
  resumeUrl,
  skillGroups,
  type Field,
  type LinkField,
  type TimelineEntry,
} from '../content/portfolio';
import { EmailLink } from './EmailLink';

/** Renders `**bold**` spans inside a plain string. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
      )}
    </>
  );
}

/** Renders a value, or a clearly marked placeholder when it has not been supplied. */
export function F({ v }: { v: Field }) {
  if (isTodo(v)) {
    return (
      <span className="todo">
        <span className="todo__tag">To add</span>
        {v.todo}
      </span>
    );
  }
  return <>{v}</>;
}

function Links({ links }: { links: LinkField[] }) {
  return (
    <ul className="links">
      {links.map((l) => (
        <li key={l.label}>
          <span className="meta">{l.label}</span>{' '}
          {isTodo(l.href) ? (
            <F v={l.href} />
          ) : l.href.startsWith('mailto:') ? (
            <EmailLink email={l.href.slice(7)} />
          ) : (
            // mailto:/tel: must not open an empty new tab
            <a href={l.href} {...(/^https?:/.test(l.href) ? { target: '_blank', rel: 'noreferrer' } : {})}>
              {l.href.replace(/^(https?:\/\/|mailto:|tel:)/, '').replace(/\/$/, '')}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="timeline">
      {entries.map((e, i) => (
        <li key={i}>
          <h4>
            <F v={e.title} />
          </h4>
          <p className="meta">
            <F v={e.organisation} />
            {e.period && (
              <>
                {' · '}
                <F v={e.period} />
              </>
            )}
          </p>
          <ul>
            {e.details.map((d, j) => (
              <li key={j}>
                <F v={d} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

/** Project links as compact labelled links ("Live demo ↗"). */
function LinkRow({ links }: { links: LinkField[] }) {
  return (
    <p className="link-row">
      {links.map((l) =>
        isTodo(l.href) ? (
          <F key={l.label} v={l.href} />
        ) : (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
            {l.label} <span aria-hidden="true">↗</span>
          </a>
        ),
      )}
    </p>
  );
}

const SECTIONS: Record<DestinationId, () => ReactNode> = {
  about: () => (
    <>
      {profile.about.map((sec, i) => (
        <section key={i} className="prose-section">
          {sec.title && <h3>{sec.title}</h3>}
          {sec.paragraphs.map((p, j) => (
            <p key={j} className={i === 0 && j === 0 ? 'lead' : undefined}>
              <Rich text={p} />
            </p>
          ))}
        </section>
      ))}
    </>
  ),
  projects: () => (
    <>
      <ol className="entries">
        {projects.map((p) => (
          <li key={p.title} className="project">
            <h3>
              {p.title} <span className="project__tagline">— {p.tagline}</span>
            </h3>
            {(p.context || p.status) && (
              <p className="meta">
                {p.context}
                {p.status && <span className="status-tag">{p.status}</span>}
              </p>
            )}
            {p.image && (
              <img className="project__shot" src={p.image.src} alt={p.image.alt} loading="lazy" width={1280} height={800} />
            )}
            <p>{p.summary}</p>
            <ul className="project__points">
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <p>
              {p.technologies.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </p>
            {p.links.length > 0 && <LinkRow links={p.links} />}
          </li>
        ))}
      </ol>
      <h3>Other projects</h3>
      <ul className="other-projects">
        {otherProjects.map((p) => (
          <li key={p.title}>
            <strong>{p.title}</strong>
            {p.status && <span className="status-tag">{p.status}</span>}
            <br />
            <span className="meta">{p.summary}</span>
            {p.link && <LinkRow links={[p.link]} />}
          </li>
        ))}
      </ul>
    </>
  ),
  skills: () => (
    <dl className="skills">
      {skillGroups.map((g) => (
        <div key={g.name}>
          <dt>{g.name}</dt>
          <dd>
            {g.items.map((s, j) =>
              isTodo(s) ? <F key={j} v={s} /> : <span key={j} className="chip">{s}</span>,
            )}
          </dd>
        </div>
      ))}
    </dl>
  ),
  experience: () => (
    <>
      <h3>Experience</h3>
      <Timeline entries={experience} />
      <h3>Education</h3>
      <Timeline entries={education} />
    </>
  ),
  certificates: () => (
    <ol className="entries">
      {certificates.map((c) => (
        <li key={c.name}>
          <h4>{c.name}</h4>
          <p className="meta">
            <F v={c.issuer} />
            {c.date && <> · {c.date}</>}
          </p>
          {(c.verifyUrl || c.file) && (
            <LinkRow
              links={[
                ...(c.verifyUrl ? [{ label: 'Verify', href: c.verifyUrl }] : []),
                ...(c.file ? [{ label: 'View certificate', href: c.file }] : []),
              ]}
            />
          )}
        </li>
      ))}
    </ol>
  ),
};

export function SectionBody({ id }: { id: DestinationId }) {
  return <>{SECTIONS[id]()}</>;
}

export function ContactBody() {
  return (
    <>
      <p>
        Get in touch with {profile.name} — open to opportunities in data science, data analytics and AI-driven development.
      </p>
      <p className="meta">{contact.location}</p>
      <Links
        links={[
          { label: 'Email', href: `mailto:${contact.email}` },
          { label: 'Phone', href: `tel:${contact.phone.replace(/\s/g, '')}` },
          ...contact.links,
        ]}
      />
    </>
  );
}

export function ResumeBody() {
  return isTodo(resumeUrl) ? (
    <p>
      <F v={resumeUrl} />
    </p>
  ) : (
    <p>
      <a className="button" href={resumeUrl} target="_blank" rel="noreferrer">
        Open résumé (PDF)
      </a>
    </p>
  );
}

/** Small heading row for a Quick view block, with a link to the full section. */
function QuickHead({ title, full, onOpen }: { title: string; full?: DestinationId; onOpen: (id: DestinationId) => void }) {
  return (
    <div className="quick__head">
      <h3>{title}</h3>
      {full && (
        <button type="button" className="quick__more" onClick={() => onOpen(full)}>
          Full {DESTINATION_BY_ID[full].title.toLowerCase()} <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}

/**
 * Everything on one page for recruiters in a hurry: summary, experience, projects,
 * skills, education, certificates and contact. Built only from portfolio.ts.
 */
export function QuickViewBody({ onOpen }: { onOpen: (id: DestinationId) => void }) {
  const intro = profile.about[0].paragraphs[0];
  return (
    <div className="quick">
      <p className="lead">
        <Rich text={intro} />
      </p>
      <div className="quick__actions">
        {!isTodo(resumeUrl) && (
          <a className="button" href={resumeUrl} target="_blank" rel="noreferrer">
            Download résumé (PDF)
          </a>
        )}
        <EmailLink className="button button--ghost" email={contact.email}>
          Email
        </EmailLink>
        {contact.links.map((l) =>
          isTodo(l.href) ? null : (
            <a key={l.label} className="button button--ghost" href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ),
        )}
      </div>

      <section className="quick__block">
        <QuickHead title="Experience" full="experience" onOpen={onOpen} />
        <Timeline entries={experience} />
      </section>

      <section className="quick__block">
        <QuickHead title="Projects" full="projects" onOpen={onOpen} />
        <ul className="quick__projects">
          {projects.map((p) => (
            <li key={p.title}>
              <h4>
                {p.title} <span className="project__tagline">— {p.tagline}</span>
              </h4>
              {(p.context || p.status) && (
                <p className="meta">
                  {p.context}
                  {p.status && <span className="status-tag">{p.status}</span>}
                </p>
              )}
              <p>{p.summary}</p>
              <p>
                {p.technologies.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </p>
              {p.links.length > 0 && <LinkRow links={p.links} />}
            </li>
          ))}
        </ul>
        <p className="meta">Also: {otherProjects.map((p) => p.title).join(' · ')}</p>
      </section>

      <section className="quick__block">
        <QuickHead title="Skills" full="skills" onOpen={onOpen} />
        {SECTIONS.skills()}
      </section>

      <section className="quick__block">
        <QuickHead title="Education" onOpen={onOpen} />
        <ul className="quick__list">
          {education.map((e, i) => (
            <li key={i}>
              <strong>
                <F v={e.title} />
              </strong>
              <span className="meta">
                {' · '}
                <F v={e.organisation} />
                {e.period && (
                  <>
                    {' · '}
                    <F v={e.period} />
                  </>
                )}
                {e.details.map((d, j) => (
                  <span key={j}>
                    {' · '}
                    <F v={d} />
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="quick__block">
        <QuickHead title="Certificates" full="certificates" onOpen={onOpen} />
        <ul className="quick__list">
          {certificates.map((c) => (
            <li key={c.name}>
              <strong>{c.name}</strong>
              <span className="meta">
                {' · '}
                <F v={c.issuer} />
                {c.date && <> · {c.date}</>}
              </span>
              {c.verifyUrl && (
                <>
                  {' '}
                  <a className="quick__verify" href={c.verifyUrl} target="_blank" rel="noreferrer">
                    Verify <span aria-hidden="true">↗</span>
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="quick__block">
        <QuickHead title="Contact" onOpen={onOpen} />
        <ContactBody />
      </section>
    </div>
  );
}
