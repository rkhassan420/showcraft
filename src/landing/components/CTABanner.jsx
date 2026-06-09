import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const CTABanner = () => (
  <section className="lp-cta-section">
    <div className="lp-cta-bg" />
    <motion.div
      className="lp-cta-content"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="lp-cta-title">
        Ready to Build Your<br />Portfolio Today?
      </h2>
      <p className="lp-cta-sub">
        Join hundreds of developers who already use ShowCraft.
      </p>
      <Link to="/admin/register">
        <button className="lp-btn-hero">Start Building — It's Free</button>
      </Link>
    </motion.div>
  </section>
);

export default CTABanner;
