import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { STATS } from '../data';

const Hero = ({ scrollTo }) => (
  <section className="lp-hero" id="home">
    {/* Background orbs */}
    <div className="lp-hero-bg">
      <div className="lp-hero-orb lp-hero-orb-1" />
      <div className="lp-hero-orb lp-hero-orb-2" />
      <div className="lp-hero-orb lp-hero-orb-3" />
    </div>

    <div className="lp-hero-content">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="lp-badge">Portfolio Builder Platform</div>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="lp-hero-title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Build Your Portfolio<br />
        <span className="gradient-text">In Minutes, Not Days</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="lp-hero-sub"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        ShowCraft is the all-in-one platform for developers and designers to create
        stunning portfolio websites — no code required.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="lp-hero-cta"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Link to="/admin">
          <button className="lp-btn-hero">Build Your Portfolio</button>
        </Link>
        <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>
          <button className="lp-btn-hero-outline">See Features ↓</button>
        </a>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="lp-hero-stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {STATS.map((s) => (
          <div className="lp-stat" key={s.label}>
            <div className="lp-stat-number">{s.num}</div>
            <div className="lp-stat-label">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Hero;
