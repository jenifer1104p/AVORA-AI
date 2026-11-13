
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { apiRequest, getToken } from "../api.js";

export default function JobSearch() {
  const navigate = useNavigate();

  const [profileText, setProfileText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeProfile = async () => {
    setError("");
    setResult(null);

    if (!getToken()) {
      navigate("/signin");
      return;
    }

    if (profileText.trim().length < 20) {
      setError("Please enter at least 20 characters about your skills and experience.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/api/ml/predict-role", {
        method: "POST",
        body: JSON.stringify({
          profile_text: profileText.trim(),
        }),
      });

      setResult(data);
    } catch (err) {
      setError(err.message || "Unable to analyze your career profile.");
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setProfileText("");
    setResult(null);
    setError("");
  };

  const prediction = result?.prediction || {};
  const alternatives = prediction.alternatives || [];
  const skills = result?.skills || [];

  const clusterLabel =
    typeof result?.cluster === "object"
      ? result?.cluster?.label
      : result?.cluster;

  const confidence =
    typeof prediction.confidence === "number"
      ? `${(prediction.confidence * 100).toFixed(1)}%`
      : "N/A";

  return (
    <main className="page careerPage">
      <div className="container careerContainer">

        {/* HERO */}
        <section className="careerHero">
          <div className="careerHeroContent">
            <span className="careerEyebrow">
              <span>✦</span> AI-POWERED CAREER DISCOVERY
            </span>

            <h1>
              Discover Your
              <br />
              <span>Career Potential.</span>
            </h1>

            <p>
              Your skills have a direction. Explore suitable career
              paths using machine learning and discover where your
              technical strengths can take you.
            </p>

            <div className="careerHeroPoints">
              <span>✦ Role Prediction</span>
              <span>✦ Skill Identification</span>
              <span>✦ Career Insights</span>
            </div>
          </div>

          <div className="careerHeroVisual">
            <div className="careerOrb">
              <span>✧</span>
            </div>
            <div className="careerFloatingCard careerFloatOne">
              <span>01</span>
              Career Discovery
            </div>
            <div className="careerFloatingCard careerFloatTwo">
              <span>02</span>
              Skill Analysis
            </div>
          </div>
        </section>

        {/* INPUT */}
        <section className="careerInputSection">
          <div className="careerSectionHeading">
            <div>
              <span className="careerEyebrow">START YOUR JOURNEY</span>
              <h2>Tell Us About Your Skills</h2>
              <p>
                Add your technical knowledge, education, projects
                and experience to explore career matches.
              </p>
            </div>
            <div className="careerStep">01 / 02</div>
          </div>

          <Card className="careerInputCard">
            <div className="careerInputHeader">
              <div className="careerInputIcon">⌘</div>
              <div>
                <h3>Your Professional Profile</h3>
                <p>Describe what you know and what you have built.</p>
              </div>
            </div>

            <textarea
              className="input careerTextarea"
              rows={7}
              value={profileText}
              onChange={(e) => setProfileText(e.target.value)}
              placeholder="Example: I have knowledge of Python, Java, SQL, React and Flask. I have developed REST APIs and worked on machine learning projects..."
            />

            <div className="careerInputFooter">
              <span>
                {profileText.trim().length} characters · Minimum 20
              </span>
              <span>
                {profileText.trim().length >= 20 ? "Ready to analyze" : "Add more details"}
              </span>
            </div>

            {error && (
              <div className="errorBox careerError" role="alert">
                {error}
              </div>
            )}

            <div className="careerActions">
              <Button onClick={analyzeProfile} disabled={loading}>
                {loading ? "Analyzing Profile..." : "Discover My Career Match →"}
              </Button>

              <Button
                variant="ghost"
                onClick={clearResults}
                disabled={loading}
              >
                Clear
              </Button>
            </div>
          </Card>
        </section>

        {/* RESULTS */}
        {result && (
          <section className="careerResults">

            <div className="careerResultHeading">
              <div>
                <span className="careerEyebrow">YOUR ANALYSIS</span>
                <h2>Your Career Insights</h2>
                <p>Here is what the model identified from your profile.</p>
              </div>
              <span className="careerCompleted">✓ Analysis Complete</span>
            </div>

            {/* PRIMARY MATCH */}
            <Card className="careerPrimaryCard">
              <div className="careerPrimaryContent">
                <span className="careerPrimaryLabel">
                  ✦ PRIMARY CAREER MATCH
                </span>
                <h2>{prediction.role || "Career role unavailable"}</h2>
                <p>
                  Your strongest predicted career category based on
                  the information you provided.
                </p>
              </div>

              <div className="careerConfidence">
                <span>Model Confidence</span>
                <strong>{confidence}</strong>
                <small>Prediction score</small>
              </div>
            </Card>

            {/* RESULT GRID */}
            <div className="careerResultGrid">

              <Card className="careerResultCard">
                <div className="careerCardIcon">↗</div>
                <h3>Alternative Career Roles</h3>

                {alternatives.length > 0 ? (
                  <div className="careerAlternativeList">
                    {alternatives.map((item, index) => (
                      <div className="careerAlternative" key={item.role || index}>
                        <span className="careerAlternativeNumber">
                          0{index + 1}
                        </span>
                        <div>
                          <strong>
                            {item.role || item.label || "Alternative role"}
                          </strong>
                          {typeof item.confidence === "number" && (
                            <small>
                              {(item.confidence * 100).toFixed(1)}% model confidence
                            </small>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="muted">No alternative roles available.</p>
                )}
              </Card>

              <Card className="careerResultCard">
                <div className="careerCardIcon">✧</div>
                <h3>Identified Technical Skills</h3>
                <p className="careerCardDescription">
                  Skills recognized from your profile.
                </p>

                {skills.length > 0 ? (
                  <div className="careerSkillList">
                    {skills.map((skill, index) => (
                      <span className="careerSkill" key={skill.name || index}>
                        {skill.name || skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="muted">No recognized technical skills found.</p>
                )}
              </Card>

              <Card className="careerResultCard careerClusterCard">
                <div className="careerCardIcon">◎</div>
                <h3>Your Career Cluster</h3>
                <p className="careerClusterValue">
                  {clusterLabel || "Not available"}
                </p>
                <p className="careerCardDescription">
                  A broad career grouping identified by the model.
                </p>
              </Card>

              <Card className="careerResultCard careerNextCard">
                <div className="careerCardIcon">→</div>
                <h3>Take the Next Step</h3>
                <p className="careerCardDescription">
                  Upload your resume to explore sample job matches,
                  identify skill gaps and receive a learning roadmap.
                </p>
                <Button onClick={() => navigate("/intelligence")}>
                  Analyze My Resume →
                </Button>
              </Card>

            </div>

            <div className="careerDisclaimer">
              <span>ⓘ</span>
              Results are exploratory machine-learning predictions
              based on the included training dataset. They are not
              verified job recommendations or hiring predictions.
              Model confidence is not a probability of getting hired.
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
