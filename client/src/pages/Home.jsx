import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const features = [
    { icon: "📊", title: "BMI & Health Analysis", desc: "Track your BMI, BMR and daily calorie requirements." },
    { icon: "🥗", title: "AI Diet Assistant", desc: "Get personalized diet plans according to your goals." },
    { icon: "💪", title: "Workout Planner", desc: "Create workout plans designed around your fitness goals." },
    { icon: "💧", title: "Water Tracker", desc: "Monitor your daily water intake and stay hydrated." },
    { icon: "😴", title: "Sleep Monitoring", desc: "Track your sleep habits and improve your routine." },
    { icon: "📈", title: "Health Analytics", desc: "Understand your progress through visual reports." },
  ];

  return (
    <div className="home-page">

      <nav className="home-navbar">
        <Link to="/" className="home-logo">
          🩺 HealKaro<span>AI</span>
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link to="/login" className="nav-login">Login</Link>
          <Link to="/register" className="nav-register">Get Started</Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            ✨ Smart Healthcare Powered by AI
          </div>

          <h1>
            Your Health,<br />
            <span>Smarter with AI.</span>
          </h1>

          <p>
            Take control of your health with intelligent health monitoring,
            personalized diet plans, workout recommendations and AI-powered insights.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Get Started →
            </Link>

            <Link to="/login" className="secondary-btn">
              Login to Account
            </Link>
          </div>

          <div className="hero-trust">
            <span>✓ Smart Health Tracking</span>
            <span>✓ AI-Powered Insights</span>
            <span>✓ Personalized Plans</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="health-circle">
            <div className="health-icon">🩺</div>
            <h2>HealKaroAI</h2>
            <p>Your Personal Health Companion</p>

            <div className="health-stats">
              <div>
                <strong>AI</strong>
                <small>Smart Assistant</small>
              </div>
              <div>
                <strong>24/7</strong>
                <small>Health Tracking</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <span>OUR FEATURES</span>
          <h2>Everything Your Health Needs</h2>
          <p>Smart tools to help you understand and improve your health.</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <div>
          <span>ABOUT HEALKAROAI</span>
          <h2>Make Better Health Decisions with AI</h2>
          <p>
            HealKaroAI is an AI-powered personal health monitoring system
            designed to help users track health activities, understand
            their progress and receive personalized recommendations.
          </p>
          <Link to="/register" className="primary-btn">
            Start Your Journey →
          </Link>
        </div>
      </section>

      <footer className="home-footer">
        <h3>🩺 HealKaroAI</h3>
        <p>AI-Powered Personal Health Monitoring System</p>
        <small>© {new Date().getFullYear()} HealKaroAI. All rights reserved.</small>
      </footer>

    </div>
  );
}

export default Home;