
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import { apiRequest, getToken } from "../api.js";

export default function Intelligence() {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState("Java Backend Developer");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  const analyze = async () => {
    setError("");
    setResult(null);

    if (!getToken()) {
      navigate("/signin");
      return;
    }

    if (!file) {
      setError("Please choose a PDF, DOCX or TXT resume.");
      return;
    }

    const allowedTypes = [".pdf", ".docx", ".txt"];
    const extension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedTypes.includes(extension)) {
      setError("Only PDF, DOCX and TXT files are supported.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Resume file must be smaller than 8 MB.");
      return;
    }

    if (!target.trim()) {
      setError("Please enter your target career role.");
      return;
    }

    const form = new FormData();
    form.append("resume", file);
    form.append("target_role", target.trim());

    setBusy(true);

    try {
      const data = await apiRequest("/api/ml/analyze-resume", {
        method: "POST",
        body: form,
      });

      setResult(data);
    } catch (err) {
      setError(err.message || "Unable to analyze your resume. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const clearAnalysis = () => {
    setFile(null);
    setResult(null);
    setError("");

    const fileInput = document.getElementById("resume-upload");
    if (fileInput) fileInput.value = "";
  };

  const prediction = result?.predicted_role;
  const skills = result?.skills || [];
  const matches = result?.matches || [];
  const gaps = result?.skill_gaps || [];
  const weeks = result?.roadmap?.weeks || [];

  const confidence =
    typeof prediction?.confidence === "number"
      ? `${(prediction.confidence * 100).toFixed(1)}%`
      : "Not available";

  return (
    <main className="page resumePage">
      <div className="container resumeContainer">

        {/* HERO */}
        <section className="resumeHero">
          <div className="resumeHeroContent">
            <span className="resumeEyebrow">
              ✦ AVORA AI · INTELLIGENT RESUME ANALYSIS
            </span>

            <h1>
              Your Resume.
              <br />
              <span>Your Next Opportunity.</span>
            </h1>

            <p>
              Go beyond a traditional resume review. Discover your
              technical strengths, explore relevant sample career
              matches and build a focused learning roadmap.
            </p>

            <div className="resumeHeroPoints">
              <span>✓ Skill Extraction</span>
              <span>✓ Career Prediction</span>
              <span>✓ Learning Roadmap</span>
            </div>
          </div>

          <div className="resumeHeroVisual">
            <div className="resumeDocument">
              <div className="resumeDocIcon">▤</div>
              <div className="resumeDocLine long" />
              <div className="resumeDocLine" />
              <div className="resumeDocLine short" />
              <div className="resumeDocDivider" />
              <div className="resumeDocSkill">
                <span />
                <span />
                <span />
              </div>
              <div className="resumeDocSkill">
                <span />
                <span />
              </div>
              <div className="resumeDocCheck">✓</div>
            </div>

            <div className="resumeVisualCaption">
              <strong>Resume Intelligence</strong>
              <span>Understand your potential</span>
            </div>
          </div>
        </section>

        {/* UPLOAD SECTION */}
        <section className="resumeUploadSection">
          <div className="resumeSectionHeading">
            <div>
              <span className="resumeEyebrow">STEP 01 · UPLOAD</span>
              <h2>Let's Understand Your Resume</h2>
              <p>
                Upload your resume and select the career role you want
                to explore.
              </p>
            </div>

            <span className="resumeStepBadge">PDF · DOCX · TXT</span>
          </div>

          <Card className="resumeUploadCard">
            <label htmlFor="resume-upload" className="resumeDropzone">
              <div className="resumeUploadIcon">↑</div>

              <h3>
                {file ? "Resume Selected" : "Upload Your Resume"}
              </h3>

              <p>
                {file
                  ? file.name
                  : "Choose a resume file from your computer"}
              </p>

              <span className="resumeBrowseButton">
                {file ? "Choose Another File" : "Browse Files"}
              </span>

              <small>PDF, DOCX or TXT · Maximum 8 MB</small>
            </label>

            <input
              id="resume-upload"
              className="resumeFileInput"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setResult(null);
                setError("");
              }}
            />

            {file && (
              <div className="resumeSelectedFile">
                <span className="resumeFileIcon">▤</span>
                <div>
                  <strong>{file.name}</strong>
                  <small>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </small>
                </div>
                <button
                  type="button"
                  className="resumeRemoveFile"
                  onClick={clearAnalysis}
                  disabled={busy}
                  aria-label="Remove selected file"
                >
                  ×
                </button>
              </div>
            )}

            <div className="resumeTargetField">
              <label htmlFor="resume-target">Target Career Role</label>
              <input
                id="resume-target"
                className="input"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. Java Backend Developer"
              />
              <small>
                Choose the role you want your resume compared against.
              </small>
            </div>

            {error && (
              <div className="errorBox resumeError" role="alert">
                {error}
              </div>
            )}

            <div className="resumeUploadActions">
              <Button onClick={analyze} disabled={busy}>
                {busy ? "Analyzing Resume..." : "Analyze My Resume →"}
              </Button>

              <Button
                variant="ghost"
                onClick={clearAnalysis}
                disabled={busy}
              >
                Clear
              </Button>
            </div>

            {busy && (
              <div className="resumeLoading">
                <div className="resumeLoadingBar" />
                <span>Processing your resume and generating insights...</span>
              </div>
            )}
          </Card>
        </section>

        {/* RESULTS */}
        {result && (
          <section className="resumeResults">

            <div className="resumeResultHeading">
              <div>
                <span className="resumeEyebrow">STEP 02 · YOUR INSIGHTS</span>
                <h2>Your Resume Analysis</h2>
                <p>
                  Here is the information extracted and analyzed from
                  your uploaded resume.
                </p>
              </div>

              <span className="resumeSuccess">✓ Analysis Complete</span>
            </div>

            {/* CAREER PROFILE */}
            <Card className="resumePredictionCard">
              <div>
                <span className="resumePredictionLabel">
                  ✦ PREDICTED CAREER ROLE
                </span>

                <h2>{prediction?.role || "Career role unavailable"}</h2>

                <p>
                  Your predicted career category based on the
                  information extracted from your resume.
                </p>

                <div className="resumeCluster">
                  Career Cluster:
                  <strong>
                    {result.career_cluster?.label || "Not available"}
                  </strong>
                </div>
              </div>

              <div className="resumeConfidence">
                <span>Model Confidence</span>
                <strong>{confidence}</strong>
                <small>Prediction score</small>
              </div>
            </Card>

            {/* SKILLS */}
            <Card className="resumeResultCard">
              <div className="resumeResultCardHeader">
                <div className="resumeResultIcon">✧</div>
                <div>
                  <h3>Identified Technical Skills</h3>
                  <p>Technical skills detected in your resume.</p>
                </div>
              </div>

              {skills.length > 0 ? (
                <div className="resumeSkillList">
                  {skills.map((skill, index) => {
                    const skillName =
                      typeof skill === "string"
                        ? skill
                        : skill?.name || "Skill";

                    return (
                      <span className="resumeSkillTag" key={skillName + index}>
                        ✓ {skillName}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="muted">
                  No recognized technical skills were identified.
                </p>
              )}
            </Card>

            {/* JOB MATCHES */}
            <Card className="resumeResultCard">
              <div className="resumeResultCardHeader">
                <div className="resumeResultIcon">↗</div>
                <div>
                  <h3>Resume-to-Job Similarity</h3>
                  <p>
                    Comparison against the included sample job dataset.
                  </p>
                </div>
              </div>

              {matches.length > 0 ? (
                <div className="resumeMatchList">
                  {matches.map((job, index) => (
                    <div
                      className="resumeMatchItem"
                      key={job.id || index}
                    >
                      <div className="resumeMatchTop">
                        <div>
                          <h4>{job.title || "Sample role"}</h4>
                          <span>
                            {job.company || "Sample company"} ·{" "}
                            {job.location || "Location not available"}
                          </span>
                        </div>

                        <div className="resumeMatchScore">
                          {typeof job.match_score === "number"
                            ? `${job.match_score.toFixed(1)}%`
                            : "N/A"}
                          <small>Similarity</small>
                        </div>
                      </div>

                      <div className="resumeMatchDetails">
                        <div>
                          <strong>Matched Skills</strong>
                          <p>
                            {job.matched_skills?.join(", ") ||
                              "No exact skill phrases detected"}
                          </p>
                        </div>

                        <div>
                          <strong>Missing Skills</strong>
                          <p>
                            {job.missing_skills?.join(", ") ||
                              "No listed skill gaps"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted">
                  No matching sample roles were found.
                </p>
              )}

              <p className="resumeNote">
                Similarity score measures text similarity, not hiring
                probability. These are not live vacancies.
              </p>
            </Card>

            {/* SKILL GAPS */}
            <Card className="resumeResultCard">
              <div className="resumeResultCardHeader">
                <div className="resumeResultIcon">◎</div>
                <div>
                  <h3>Skills to Develop</h3>
                  <p>Potential skill gaps from the sample comparisons.</p>
                </div>
              </div>

              {gaps.length > 0 ? (
                <div className="resumeGapList">
                  {gaps.map((skill, index) => (
                    <span className="resumeGapTag" key={skill + index}>
                      + {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="muted">
                  No additional skill gaps were identified from
                  the sample comparisons.
                </p>
              )}
            </Card>

            {/* ROADMAP */}
            <Card className="resumeResultCard">
              <div className="resumeResultCardHeader">
                <div className="resumeResultIcon">✳</div>
                <div>
                  <h3>Your Learning Roadmap</h3>
                  <p>A structured plan to help develop relevant skills.</p>
                </div>
              </div>

              {weeks.length > 0 ? (
                <div className="resumeRoadmap">
                  {weeks.map((week, index) => (
                    <div className="resumeRoadmapItem" key={week.week || index}>
                      <div className="resumeRoadmapMarker">
                        {week.week || index + 1}
                      </div>

                      <div className="resumeRoadmapContent">
                        <span>WEEK {week.week || index + 1}</span>
                        <h4>{week.focus || "Learning objectives"}</h4>

                        <ul>
                          {(week.tasks || []).map((task, taskIndex) => (
                            <li key={taskIndex}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted">
                  No learning roadmap is available.
                </p>
              )}
            </Card>

            {/* NEXT ACTIONS */}
            <section className="resumeNextActions">
              <span className="resumeEyebrow">KEEP MOVING FORWARD</span>
              <h2>Your Next Career Step Starts Here</h2>
              <p>
                Explore your predicted career roles or analyze another
                resume to continue improving your profile.
              </p>

              <div className="resumeUploadActions">
                <Button onClick={() => navigate("/jobsearch")}>
                  Explore Career Matches →
                </Button>

                <Button variant="ghost" onClick={clearAnalysis}>
                  Analyze Another Resume
                </Button>
              </div>
            </section>

            <div className="resumeDisclaimer">
              ⓘ Model predictions and similarity scores are exploratory
              outputs based on the available training and sample datasets.
              They do not represent hiring decisions or guaranteed outcomes.
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
