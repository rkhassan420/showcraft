import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PRICING } from '../data';

const Pricing = () => (
  <section className="lp-section-full" id="pricing">
    <div className="lp-section-inner">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center' }}
      >
        <div className="lp-section-tag" style={{ justifyContent: 'center' }}>💎 Pricing</div>
        <h2 className="lp-section-title" style={{ textAlign: 'center' }}>
          Simple, Transparent Pricing
        </h2>
        <p className="lp-section-sub" style={{ margin: '0 auto' }}>
          Start for free. Upgrade when you're ready.
        </p>
      </motion.div>

      <div className="lp-pricing-grid">
        {PRICING.map((p, i) => (
          <motion.div
            key={p.plan}
            className={`lp-pricing-card ${p.featured ? 'featured' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            {p.badge && <div className="lp-pricing-badge">{p.badge}</div>}
            <div className="lp-pricing-plan">{p.plan}</div>
            <div className="lp-pricing-price">
              {p.price}<span>{p.period}</span>
            </div>
            <div className="lp-pricing-desc">{p.desc}</div>
            <ul className="lp-pricing-features">
              {p.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <Link to="/admin">
              <button className={`lp-pricing-btn ${p.featured ? 'featured' : ''}`}>
                {p.featured ? 'Get Pro →' : 'Get Started Free'}
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
