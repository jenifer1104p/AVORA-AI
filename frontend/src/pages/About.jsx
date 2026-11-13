
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { useNavigate } from "react-router-dom";

const highlights = [
  {
    icon: "🎯",
    number: "01",
    title: "Our Mission",
    desc: "Help individuals understand their technical strengths and make informed career development decisions through accessible AI-powered insights.",
  },
  {
    icon: "🚀",
    number: "02",
    title: "Our Vision",
    desc: "Make career exploration more accessible by combining machine learning, skill intelligence and practical learning recommendations.",
  },
  {
    icon: "✦",
    number: "03",
    title: "Our Approach",
    desc: "Bring resume analysis, career prediction, skill matching and learning roadmaps together in one intelligent platform.",
  },
];

const capabilities = [
  {
    icon: "▤",
    title: "Resume Analysis",
    desc: "Extract technical skills and understand your professional profile.",
  },
  {
    icon: "↗",
    title: "Career Prediction",
    desc: "Explore career categories based on your skills and profile.",
  },
  {
    icon: "◎",
    title: "Skill Gap Analysis",
    desc: "Identify potential skills to develop for your target role.",
  },
  {
    icon: "✳",
    title: "Learning Roadmap",
    desc: "Explore structured weekly learning recommendations.",
  },
];

const technologyGroups = [
  {
    category: "Frontend",
    technologies: ["React.js", "JavaScript", "CSS3", "Vite"],
  },
  {
    category: "Backend",
    technologies: ["Python", "Flask", "REST API"],
  },
  {
    category: "Database",
    technologies: ["PostgreSQL", "SQLite"],
  },
  {
    category: "Machine Learning",
    technologies: [
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "TF-IDF",
      "Cosine Similarity",
      "K-Means Clustering",
    ],
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <main className="page aboutPage">
      <div className="container aboutContainer">

        {/* HERO */}
        <section className="aboutHeroNew">
          <div className="aboutHeroContent">
            <span className="aboutEyebrow">
              ✦ GET TO KNOW AVORA AI
            </span>

            <h1>
              Technology With
              <br />
              <span>A Career Purpose.</span>
            </h1>

            <p>
              AVORA AI is an AI-powered career intelligence platform
              designed to help individuals understand their technical
              skills, explore suitable career roles and discover
              opportunities for professional growth.
            </p>

            <div className="aboutHeroActions">
              <Button onClick={() => navigate("/intelligence")}>
                Explore Resume Intelligence →
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/jobsearch")}
              >
                Discover Career Matches
              </Button>
            </div>
          </div>

          <div className="aboutHeroVisual">
            <div className="aboutVisualCircle">
              <span>AV</span>
            </div>
            <div className="aboutVisualCaption">
              <strong>AVORA AI</strong>
              <span>Skills · Intelligence · Growth</span>
            </div>
            <div className="aboutVisualDecoration aboutDecorationOne">✦</div>
            <div className="aboutVisualDecoration aboutDecorationTwo">✧</div>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="aboutIntro">
          <span className="aboutEyebrow">WHY AVORA AI</span>
          <h2>Turning Skills Into Career Insights</h2>
          <p>
            Understanding your professional strengths is an important
            step towards career growth. AVORA AI brings together
            machine-learning techniques and practical career tools to
            help users explore their potential and plan their next steps.
          </p>
        </section>

        {/* MISSION / VISION */}
        <section className="aboutHighlights">
          {highlights.map((item) => (
            <Card className="aboutHighlightCard" key={item.title}>
              <div className="aboutHighlightTop">
                <div className="aboutHighlightIcon">{item.icon}</div>
                <span>{item.number}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </Card>
          ))}
        </section>

        {/* CAPABILITIES */}
        <section className="aboutCapabilities">
          <div className="aboutSectionHeading">
            <span className="aboutEyebrow">WHAT THE PLATFORM OFFERS</span>
            <h2>Explore the Intelligence Behind AVORA</h2>
            <p>
              A collection of tools designed to support career
              exploration and skill development.
            </p>
          </div>

          <div className="aboutCapabilityGrid">
            {capabilities.map((item, index) => (
              <Card className="aboutCapabilityCard" key={item.title}>
                <div className="aboutCapabilityTop">
                  <div className="aboutCapabilityIcon">{item.icon}</div>
                  <span>0{index + 1}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* TECHNOLOGY */}
        <section className="aboutTechnology">
          <div className="aboutSectionHeading">
            <span className="aboutEyebrow">BUILT WITH TECHNOLOGY</span>
            <h2>Our Technology Stack</h2>
            <p>
              AVORA AI combines modern web technologies and
              machine-learning tools to deliver its features.
            </p>
          </div>

          <div className="aboutTechnologyGrid">
            {technologyGroups.map((group) => (
              <Card className="aboutTechnologyCard" key={group.category}>
                <h3>{group.category}</h3>
                <div className="aboutTechnologyTags">
                  {group.technologies.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="aboutClosing">
          <span className="aboutEyebrow">YOUR CAREER JOURNEY</span>
          <h2>Understand Your Potential. Plan Your Next Step.</h2>
          <p>
            Start with your resume, discover your strengths and
            explore possible directions for your career.
          </p>

          <Button onClick={() => navigate("/intelligence")}>
            Get Started with AVORA AI →
          </Button>
        </section>

      </div>
    </main>
  );
}
