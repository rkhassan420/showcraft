import { useState, useContext } from 'react';
import { motion } from 'motion/react';
import { toast } from 'react-toastify';
import { ThemeContext } from '../../page/ThemeContext';
import emailIcon from '../../assets/email_icon.png';
import emailIconWhite from '../../assets/email_icon_white.png';
import linkedinIcon from '../../assets/linkedin.png';
import linkedinIconwhite from '../../assets/linkedinWhite.png';
import github from '../../assets/github.png';
import githubWhite from '../../assets/githubWhite.png';


const Contact = () => {
  const { theme, handleTheme } = useContext(ThemeContext);
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const CONTACT_LINKS = [
  {
     icon:  theme === 'dark-theme' ? emailIconWhite : emailIcon,
     label: 'alihassandev01@gmail.com',
     href: 'mailto:alihassandev01@gmail.com'
  },

  { icon:  theme === 'dark-theme' ? linkedinIconwhite : linkedinIcon,
    label: 'LinkedIn', 
    href: 'https://www.linkedin.com/in/ali-hassan-dev01/' 
  },
  { icon:  theme === 'dark-theme' ? githubWhite : github,
    label: 'GitHub',
    href: 'https://github.com/rkhassan420' },  
];

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all fields');
      return;
    }
    setSending(true);
    try {
      const fd = new FormData();
      fd.append('name',       form.name);
      fd.append('email',      form.email);
      fd.append('message',    form.message);
      fd.append('access_key', '58482ca7-f96f-4de1-b68c-479f9f529312');

      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
      const data = await res.json();

      if (data.success) {
        toast.success("Message sent! I'll get back to you soon.");
        setForm({ name: '', email: '', message: '' });
      } else {
        toast.error('Failed to send. Please try again.');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="lp-section-full" id="contact">
      <div className="lp-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="lp-section-tag">Contact</div>
          <h2 className="lp-section-title">Get In Touch</h2>
          <p className="lp-section-sub">Have a question or feedback? I'd love to hear from you.</p>
        </motion.div>

        <div className="lp-contact-grid">
          {/* Left — info */}
          <motion.div
            className="lp-contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Let's talk about ShowCraft</h3>
            <p>
              Whether you have a feature request, found a bug, or just want to say hello —
              I'm always happy to chat. I typically respond within 24 hours.
            </p>
            <div className="lp-contact-links">
              {CONTACT_LINKS.map((l) => (
                <a key={l.label} href={l.href} className="lp-contact-link">
                  {/* <div className="lp-contact-link-icon">{l.icon}</div> */}
                  <div className="lp-contact-link-icon">
  <img src={l.icon} alt={l.label} />
</div>
                  <span>{l.label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form className="lp-contact-form" onSubmit={handleSubmit}>
              <div className="lp-form-group">
                <label>Your Name</label>
                <input
                  type="text" name="name" placeholder="John Doe"
                  value={form.name} onChange={handleChange} required
                />
              </div>
              <div className="lp-form-group">
                <label>Email Address</label>
                <input
                  type="email" name="email" placeholder="john@example.com"
                  value={form.email} onChange={handleChange} required
                />
              </div>
              <div className="lp-form-group">
                <label>Message</label>
                <textarea
                  name="message" placeholder="Tell me about your project or question..."
                  value={form.message} onChange={handleChange} required
                />
              </div>
              <button
                type="submit"
                className="lp-btn-primary"
                disabled={sending}
                style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '10px' }}
              >
                {sending ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
