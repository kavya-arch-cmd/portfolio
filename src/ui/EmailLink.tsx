import { useEffect, useRef, useState, type ReactNode } from 'react';

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / insecure contexts: fall back to a hidden textarea.
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/**
 * A mailto: link that also copies the address. Many computers have no email app set up
 * for mailto: links, so clicking would otherwise appear to do nothing; the visitor still
 * gets the address on their clipboard and a visible confirmation.
 */
export function EmailLink({ email, className, children }: { email: string; className?: string; children?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <span className="email-link">
      <a
        className={className}
        href={`mailto:${email}`}
        onClick={() => {
          void copy(email).then((ok) => {
            if (!ok) return;
            setCopied(true);
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setCopied(false), 4000);
          });
        }}
      >
        {children ?? email}
      </a>
      <span className="email-link__note" role="status" aria-live="polite">
        {copied ? `Copied ${email} — paste it into your email app.` : ''}
      </span>
    </span>
  );
}
