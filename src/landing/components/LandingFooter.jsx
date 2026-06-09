import { Link } from 'react-router-dom';

const LandingFooter = ({ scrollTo }) => (
  <footer className="lp-footer">
    <div className="lp-footer-inner">
      <div className="lp-footer-top">
        {/* Brand */}
        <div className="lp-footer-brand">
          <div className="lp-logo" style={{ fontSize: '22px' }}>ShowCraft</div>
          <p>The simplest way to build and share a professional portfolio.</p>
        </div>

        {/* Product */}
        <div className="lp-footer-col">
          <h4>Product</h4>
          <ul>
            <li><a href="#features"    onClick={(e) => { e.preventDefault(); scrollTo('features');    }}>Features</a></li>
            <li><a href="#pricing"     onClick={(e) => { e.preventDefault(); scrollTo('pricing');     }}>Pricing</a></li>
            <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }}>How It Works</a></li>
          </ul>
        </div>

        {/* Company */}
        <div className="lp-footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Contact</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
          </ul>
        </div>

        {/* Get Started */}
        <div className="lp-footer-col">
          <h4>Get Started</h4>
          <ul>
            <li><Link to="/admin/register">Create Account</Link></li>
            <li><Link to="/admin/login">Login</Link></li>
            <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollTo('testimonials'); }}>Reviews</a></li>
          </ul>
        </div>
      </div>

      <div className="lp-footer-bottom">
        <span>© 2025 ShowCraft. All rights reserved.</span>
        <div className="lp-footer-social">
          <a target='blank' href="https://www.linkedin.com/in/ali-hassan-dev01/">LinkedIn</a>
          <a target='blank' href="https://github.com/rkhassan420">GitHub</a>          
          <a href="mailto:alihassandev01@gmail.com">Email</a>
        </div>
      </div>
    </div>
  </footer>
);

export default LandingFooter;
