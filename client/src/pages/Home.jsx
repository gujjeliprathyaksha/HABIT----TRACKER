import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './home.css';

const habits = [
  { label: 'Morning walk', detail: '20 min outside', color: 'coral', done: true },
  { label: 'Read a chapter', detail: 'Make space to learn', color: 'teal', done: true },
  { label: 'Evening reset', detail: 'Close the day gently', color: 'gold', done: false }
];

export default function Home() {
  const { user } = useAuth();

  return <main className="home-page">
    <nav className="home-nav" aria-label="Main navigation">
      <Link className="home-brand" to="/" aria-label="Habitual home"><span className="brand-mark">H</span><span>Habitual</span></Link>
      <div className="home-nav-links">
        <a href="#why">Why Habitual</a>
        <a href="#rhythm">Your rhythm</a>
      </div>
      <Link className="home-login" to={user ? '/dashboard' : '/login'}>{user ? 'Open dashboard' : 'Sign in'} <span>↗</span></Link>
    </nav>

    <section className="home-hero">
      <div className="hero-copy">
        <p className="home-kicker"><span></span> A softer way to stay consistent</p>
        <h1>Small promises.<br /><em>Beautifully kept.</em></h1>
        <p className="hero-lede">Habitual turns the things you want to do into a calm, visible rhythm you can return to every day.</p>
        <div className="hero-actions">
          <Link className="hero-primary" to={user ? '/dashboard' : '/register'}>{user ? 'Go to your rhythm' : 'Start your rhythm'} <span>→</span></Link>
          <a className="hero-secondary" href="#why">See how it feels <span>↓</span></a>
        </div>
        <div className="hero-proof"><div className="proof-avatars"><span>J</span><span>M</span><span>A</span></div><p><strong>Made for steady progress</strong><br />One day at a time, without the noise.</p></div>
      </div>

      <div className="rhythm-stage" id="rhythm" aria-label="Habitual dashboard preview">
        <div className="stage-sun"></div>
        <div className="stage-note note-top">YOUR DAILY RHYTHM <span>✦</span></div>
        <div className="rhythm-window">
          <div className="window-top"><span>Tuesday, September 23</span><span className="window-dot">●</span></div>
          <div className="window-heading"><div><span className="window-eyebrow">A LITTLE FURTHER</span><h2>Good morning<span>✦</span></h2></div><div className="window-progress"><strong>67%</strong><small>today</small></div></div>
          <div className="window-line"><span>Today’s habits</span><span>2 of 3 done</span></div>
          <div className="preview-habits">{habits.map((habit) => <div className={`preview-habit ${habit.done ? 'is-done' : ''}`} key={habit.label}><span className={`habit-bullet ${habit.color}`}>{habit.done ? '✓' : ''}</span><span><strong>{habit.label}</strong><small>{habit.detail}</small></span><span className="habit-state">{habit.done ? 'Done' : 'Next'}</span></div>)}</div>
          <div className="window-footer"><span>✦ 12 day streak</span><span>Keep building</span></div>
        </div>
        <div className="stage-note note-bottom"><span>CONSISTENCY</span><strong>is a quiet superpower.</strong></div>
      </div>
    </section>

    <section className="home-intro" id="why"><div className="intro-rule"></div><p className="home-kicker">THE HABITUAL APPROACH</p><h2>Progress should feel like <em>coming home.</em></h2><p className="intro-copy">No guilt loops. No noisy dashboards. Just a thoughtful place to notice what matters and make it part of your days.</p></section>

    <section className="home-features"><article><span className="feature-number">01</span><h3>Make it visible</h3><p>See your promises at a glance, with just enough detail to keep moving.</p></article><article><span className="feature-number">02</span><h3>Keep it human</h3><p>Celebrate the small wins and begin again whenever the day asks you to.</p></article><article><span className="feature-number">03</span><h3>Build your rhythm</h3><p>Let a collection of ordinary days become something that feels like yours.</p></article></section>

    <footer className="home-footer"><Link className="home-brand" to="/"><span className="brand-mark">H</span><span>Habitual</span></Link><p>For the days you want to remember.</p><Link className="footer-arrow" to={user ? '/dashboard' : '/register'} aria-label="Get started">↗</Link></footer>
  </main>;
}
