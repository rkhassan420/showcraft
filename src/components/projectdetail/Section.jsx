import { motion } from 'motion/react';

const Section = ({ icon, title, children, delay = 0 }) => (
  <motion.div
    className="pd-section"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <div className="pd-section-header">
      {icon && <span className="pd-section-icon">{icon}</span>}
      <span className="pd-section-title">{title}</span>
    </div>
    <div className="pd-section-body">{children}</div>
  </motion.div>
);

export default Section;
