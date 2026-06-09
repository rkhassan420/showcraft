import { motion } from 'motion/react';
import { STEPS } from '../data';

const HowItWorks = () => (
  <section className="lp-section" id="how-it-works">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      style={{ textAlign: 'center' }}
    >
      <div className="lp-section-tag" style={{ justifyContent: 'center' }}>How It Works</div>
      <h2 className="lp-section-title" style={{ textAlign: 'center' }}>
        Three Steps to Your<br />Dream Portfolio
      </h2>
    </motion.div>

    <div className="lp-steps">
      {STEPS.map((s, i) => (
        <motion.div
          key={s.num}
          className="lp-step"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.15 }}
          viewport={{ once: true }}
        >
          <div className="lp-step-num">{s.num}</div>
          <div className="lp-step-title">{s.title}</div>
          <div className="lp-step-desc">{s.desc}</div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default HowItWorks;
