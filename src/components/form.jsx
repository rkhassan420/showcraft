import './portfolio.css';
import { useState }  from 'react';
import { motion }    from 'motion/react';

const Form = () => {
  const [result,      setResult]      = useState('');
  const [modalOpen,   setModalOpen]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult('Sending...');

    const fd = new FormData(e.target);
    fd.append('access_key', '58482ca7-f96f-4de1-b68c-479f9f529312');

    try {
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
      const data = await res.json();

      if (data.success) {
        setResult('');
        e.target.reset();
        setModalOpen(true);
      } else {
        setResult(data.message);
      }
    } catch {
      setResult('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="form" className="pf-form scroll-mt-20">
      <div className="pf-form-inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="p-tag">Contact</div>
          <h2 className="p-section-title">Let's Work Together</h2>
          <p className="p-section-sub">
            Have a project in mind or want to connect? I'd love to hear from you.
          </p>
        </motion.div>

        <motion.div
          className="pf-form-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
        >
          <form onSubmit={submit}>
            {/* Name + Email row */}
            <div className="pf-form-row">
              <div className="pf-form-field">
                <label className="pf-form-label">Your Name</label>
                <input
                  type="text"
                  name="name"
                  className="pf-form-input"
                  placeholder="John Doe"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="pf-form-field">
                <label className="pf-form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="pf-form-input"
                  placeholder="you@example.com"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {/* Message */}
            <div className="pf-form-field">
              <label className="pf-form-label">Message</label>
              <textarea
                name="summary"
                className="pf-form-textarea"
                placeholder="Tell me about your project or just say hello..."
                required
              />
            </div>

            <button
              type="submit"
              className="pf-form-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message →'}
            </button>

            {result && (
              <p style={{ marginTop: 12, textAlign: 'center', fontSize: 14, color: 'var(--p-text-3)' }}>
                {result}
              </p>
            )}
          </form>
        </motion.div>
      </div>

      {/* Success modal */}
      {modalOpen && (
        <div className="pf-modal-overlay" onClick={() => setModalOpen(false)}>
          <motion.div
            className="pf-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: 'spring' }}
          >
            <div className="pf-modal-icon">🎉</div>
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out. I'll get back to you within 24 hours.</p>
            <button className="pf-modal-btn" onClick={() => setModalOpen(false)}>
              Got it!
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Form;