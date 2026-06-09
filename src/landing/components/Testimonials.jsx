import { motion } from 'motion/react';
import { TESTIMONIALS } from '../data';

const Testimonials = () => (
  <section className="lp-section" id="testimonials">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      style={{ textAlign: 'center' }}
    >
      <div className="lp-section-tag" style={{ justifyContent: 'center' }}>Testimonials</div>
      <h2 className="lp-section-title" style={{ textAlign: 'center' }}>Loved by Developers</h2>
    </motion.div>

    <div className="lp-testimonials-grid">
      {TESTIMONIALS.map((item, i) => (
        <motion.div
          key={item.name}
          className="lp-testimonial"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="lp-testimonial-stars">{item.stars}</div>
          <p className="lp-testimonial-text">"{item.text}"</p>
          <div className="lp-testimonial-author">
            <div className="lp-testimonial-avatar">{item.initial}</div>
            <div>
              <div className="lp-testimonial-name">{item.name}</div>
              <div className="lp-testimonial-role">{item.role}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Testimonials;
