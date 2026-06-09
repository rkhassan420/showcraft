import './portfolio.css';
import { ThemeContext } from '../page/ThemeContext';
import axios            from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useAuth }      from '../AuthContext';
import { motion }       from 'motion/react';

const Footer = (props) => {
  const auth                             = useAuth();
  const { theme }                        = useContext(ThemeContext);
  const [finalUsername, setFinalUsername] = useState(auth.username);
  const [footerInfo,    setFooterInfo]    = useState({});

  useEffect(() => {
    if (auth.isLoggedIn && !props.username) setFinalUsername(auth.username);
    else if (props.username) setFinalUsername(props.username);
  }, [auth.username, props.username]);

  useEffect(() => {
    if (!finalUsername) return;
    axios
      .get('https://portfolio-production-2376.up.railway.app/get-footer-info/', {
        params: { username: finalUsername },
      })
      .then((r) => setFooterInfo(r.data?.[0] || {}))
      .catch(() => {});
  }, [finalUsername]);

  const SOCIAL = [
    { label: 'LinkedIn',  href: footerInfo.linkedin },
    { label: 'GitHub',    href: footerInfo.github   },    
  ].filter((s) => s.href && s.href !== 'N/A');

  return (
    <footer id="contact" className="pf-footer">
      <div className="pf-footer-inner">

        {/* CTA block */}
        <motion.div
          className="pf-footer-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="pf-footer-cta-title">
            Have a project in mind?<br />
            <span className="p-gradient-text">Let's build it together.</span>
          </h2>
          <p className="pf-footer-cta-sub">
            I'm always open to new opportunities and interesting projects.
          </p>
          {footerInfo.email && (
            <a href={`mailto:${footerInfo.email}`} className="pf-footer-email-btn">
               {footerInfo.email}
            </a>
          )}
        </motion.div>

        {/* Bottom bar */}
        <div className="pf-footer-bottom">
          <p className="pf-footer-copy">
            © 2025 {footerInfo.c_title || footerInfo.full_name || 'Portfolio'}. All rights reserved.
          </p>

          <div className="pf-footer-links">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pf-footer-link"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;