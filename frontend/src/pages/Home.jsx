
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { apiRequest } from "../api.js";

const modules = [
  {
    icon: "◈",
    title: "Resume Intelligence",
    text: "Analyze your resume, identify technical skills and discover career opportunities.",
    path: "/intelligence",
    tag: "ML + NLP",
  },
  {
    icon: "↗",
    title: "Career Match Explorer",
    text: "Discover suitable career roles using your technical skills and profile.",
    path: "/jobsearch",
    tag: "Machine Learning",
  },
  {
    icon: "✳",
    title: "Learning Roadmap",
    text: "Identify skill gaps and explore a structured learning plan.",
    path: "/intelligence",
    tag: "Skill Development",
  },
  {
    icon: "◎",
    title: "My Account",
    text: "View your AVORA AI account information.",
    path: "/profile",
    tag: "Profile",
  },
];

const technologies = [
  "Python",
  "Flask",
  "React",
  "PostgreSQL",
  "Scikit-learn",
  "TF-IDF",
  "Cosine Similarity",
  "K-Means",
];

export default function Home() {
  const navigate = useNavigate();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    let active = true;

    const loadHealth = async () => {
      try {
        const data = await apiRequest("/api/health");
        if (active) setHealth(data);
      } catch {
        if (active) setHealth({ status: "unavailable" });
      }
    };

    loadHealth();

    return () => {
      active = false;
    };
  }, []);

  const backendOnline = health?.status === "ok";

  return (
    <main className="page homePage">
      <div className="container homeContainer">

        {/* HERO */}
        <section className="homeHero">
          <div className="homeHeroContent">
            <div className="badge">
              <span className="dot" />
              AI-POWERED CAREER INTELLIGENCE
            </div>

            <h1 className="homeHeroTitle">
              Build Your Skills.
              <br />
              Discover Your Potential.
              <br />
              <span>Shape Your Future.</span>
            </h1>

            <p className="homeHeroText">
              Turn your skills and experience into meaningful career
              insights. Analyze your resume, discover suitable roles
              and build your next learning path with AVORA AI.
            </p>

            <div className="homeHeroActions">
              <Button onClick={() => navigate("/intelligence")}>
                Analyze My Resume
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/jobsearch")}
              >
                Explore Career Matches
              </Button>
            </div>
          </div>

          <div className="homeHeroVisual">
            <div className="heroVisualOrb">
              <span>AI</span>
            </div>
            <div className="heroVisualLabel">
              <strong>Career Intelligence</strong>
              <span>Skills • Insights • Growth</span>
            </div>
          </div>
        </section>

        {/* SYSTEM STATUS */}
        <section className="homeStatusSection">
          <div className="homeStatusHeader">
            <div>
              <span className="homeEyebrow">LIVE PLATFORM STATUS</span>
              <h2>System Overview</h2>
            </div>
            <span className="homeStatusIndicator">
              <span className="dot" />
              {backendOnline ? "System Online" : health ? "Offline" : "Checking"}
            </span>
          </div>

          <div className="homeStatusGrid">
            <div className="homeStatusItem">
              <span className="homeStatusIcon">⌘</span>
              <div>
                <span>Backend</span>
                <strong>
                  {health ? (backendOnline ? "Online" : "Unavailable") : "Checking..."}
                </strong>
              </div>
            </div>

            <div className="homeStatusItem">
              <span className="homeStatusIcon">▤</span>
              <div>
                <span>Database</span>
                <strong>{health?.database || "Checking..."}</strong>
              </div>
            </div>

            <div className="homeStatusItem">
              <span className="homeStatusIcon">✧</span>
              <div>
                <span>ML Models</span>
                <strong>
                  {health
                    ? health.ml_artifacts
                      ? "Available"
                      : "Not trained"
                    : "Checking..."}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="homeFeatures">
          <div className="homeSectionHeading">
            <div>
              <span className="homeEyebrow">EXPLORE THE PLATFORM</span>
              <h2>Everything You Need to Grow</h2>
              <p>
                Practical tools to understand your skills and plan
                your next career move.
              </p>
            </div>
          </div>

          <div className="moduleGrid">
            {modules.map((item, index) => (
              <Card className="moduleCard homeFeatureCard" key={item.title}>
                <div className="homeFeatureTop">
                  <div className="moduleIcon">{item.icon}</div>
                  <span className="homeFeatureNumber">
                    0{index + 1}
                  </span>
                </div>

                <span className="tag">{item.tag}</span>

                <h3>{item.title}</h3>
                <p>{item.text}</p>

                <button
                  className="homeFeatureLink"
                  onClick={() => navigate(item.path)}
                >
                  Explore feature <span>↗</span>
                </button>
              </Card>
            ))}
          </div>
        </section>

        {/* TECHNOLOGY */}
        <section className="homeTechnology">
          <div className="homeTechnologyContent">
            <span className="homeEyebrow">THE TECHNOLOGY</span>
            <h2>Powered by Machine Learning</h2>
            <p>
              AVORA AI combines machine learning, natural language
              processing and modern web technologies to provide
              career insights.
            </p>
          </div>

          <div className="homeTechnologyTags">
            {technologies.map((tech) => (
              <span className="homeTechTag" key={tech}>
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* CLOSING MESSAGE */}
        <section className="homeClosing">
          <span className="homeEyebrow">YOUR NEXT STEP STARTS HERE</span>
          <h2>Evidence First. Recommendations Second.</h2>
          <p>
            Understand where you stand, identify what you need to
            improve and take your next career step with clarity.
          </p>
          <Button onClick={() => navigate("/intelligence")}>
            Start Your Analysis →
          </Button>
        </section>

      </div>
    </main>
  );
}
