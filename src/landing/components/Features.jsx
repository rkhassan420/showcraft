import { motion } from 'motion/react';
import { FEATURES } from '../data';

const Features = () => (
  <section className="lp-section-full" id="features">
    <div className="lp-section-inner">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="lp-section-tag">Features</div>
        <h2 className="lp-section-title">Everything You Need<br />to Stand Out</h2>
        <p className="lp-section-sub">
          Powerful features packed into a simple, elegant interface — built for professionals.
        </p>
      </motion.div>

      <div className="lp-features-grid">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.key}
            className="lp-feature-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            viewport={{ once: true }}
          >
            <div className="lp-feature-icon">{f.icon}</div>
            <div className="lp-feature-title">{f.title}</div>
            <div className="lp-feature-desc">{f.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
