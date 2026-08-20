const PROJECTS = [
  {
    num: '01',
    title: 'Jobify',
    desc: ' A full‑stack job board and management app built with Next.js and TypeScript. Implemented authenticated CRUD for job postings (create/edit/delete), responsive UI and forms with Tailwind CSS, Prisma‑backed database with seeded data, job listing/detail pages, and analytics dashboards with charts.',
    tags: ['Next.js', 'Supabase','Clerk'],
    url: 'https://jobify-j9xe0z09w-avii00723s-projects.vercel.app/',
  },
  {
    num: '02',
    title: 'NXT Store',
    desc: 'Implemented product management, shopping cart, orders, admin dashboard, user authentication, reviews system, and responsive UI with Tailwind CSS and shadcn/ui components.',
    tags: ['Next.js', 'TypeScript', 'Clerk'],
    url: 'https://nxtstore-three.vercel.app/',
  },
  {
    num: '03',
    title: 'Lucid – Full-Stack Blogging Platform',
    desc: 'A minimalist blogging platform built using Node.js, Express.js, EJS, and MongoDB. The application allows users to create and publish blog posts, view posts through a clean server-rendered interface, and manage blog content with MongoDB as the database.',
    tags: ['Node Js', 'Express JS', 'Mongo DB'],
    url: 'https://blogapp-n-seven.vercel.app/',
  },
]

export default function Projects() {
  return (
    <section id="projects">
      <div className="wrap flex">
        <div className="floating-panel section-card project-panel">
          <div className="section-head">
            <span className="node" />
            <span className="index mono">02</span>
            <h2>Selected Projects</h2>
          </div>
          <div className="project-list">
            {PROJECTS.map((p) => (
              <div className="project" key={p.num}>
                <div className="pnum mono">{p.num}</div>
                <div>
                  <h3>
                    <a href={p.url} target="_blank" rel="noreferrer">
                      {p.title} <span className="arrow">↗</span>
                    </a>
                  </h3>
                  <p className="pdesc">{p.desc}</p>
                </div>
                <div className="ptags">
                  {p.tags.map((t) => (
                    <span className="mono" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
