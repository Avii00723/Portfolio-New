const LINKS = [
  { label: 'Email', href: 'mailto:wavinash.2003@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/Avii00723' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/avinash-wagh-628968239/' },
]

export default function Contact() {
  return (
    <section id="contact">
      <div className="wrap">
        <div className="floating-panel section-card contact-panel">
          <div className="section-head">
            <span className="node" />
            <span className="index mono">03</span>
            <h2>Contact</h2>
          </div>
          <div className="contact-inner">
            <div>
              <h2>
                Let's build
                <br />
                something.
              </h2>
              <p className="lead">
                Open to new projects, collaborations, and interesting problems. The fastest way to
                reach me is email — I usually reply within a day or two.
              </p>
            </div>
            <div className="contact-links">
              {LINKS.map((l) => (
                <a
                  href={l.href}
                  key={l.label}
                  target={l.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                >
                  {l.label} <span className="arrow">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
