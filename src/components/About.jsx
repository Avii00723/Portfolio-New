const SKILLS = [
  'TypeScript',
  'React',
  'Node.js',
  'Next.js',
  'Java',
  'Flutter',
  'Kotlin',
  'CSS / Design Systems',
  'PostgreSQL',
  'Figma',
  'Python',

]

export default function About() {
  return (
    <section id="about">
      <div className="wrap">
        <div className="floating-panel section-card about-panel">
          <div className="section-head">
            <span className="node" />
            <span className="index mono">01</span>
            <h2>About</h2>
          </div>
          <div className="about-grid">
            <div>
              <p>
               I'm Avinash Wagh, a software developer who enjoys building modern, responsive, and user-focused applications. I specialize in frontend development with React and TypeScript, while also working with Node.js, NestJS, and PostgreSQL on the backend.
              </p>
              <p>
                I also have experience with Flutter, Java, and Kotlin, giving me a broader perspective across web and mobile development. I enjoy solving problems, learning new technologies, and turning ideas into clean, functional digital experiences.
              </p>
              <p>
                Currently, I'm focused on improving my skills in modern web development, interactive UI, animations, and building products that are both technically solid and visually engaging.
              </p>
            </div>
            <div className="tag-cloud">
              {SKILLS.map((skill) => (
                <span className="tag mono" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
