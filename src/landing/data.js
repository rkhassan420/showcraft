export const FEATURES = [
  { icon: '⚡', key: 'feat1', title: 'Instant Setup',      desc: 'Create your portfolio in under 5 minutes. No coding knowledge required.' },
  { icon: '🎨', key: 'feat2', title: 'Beautiful Themes',   desc: 'Light & dark mode with smooth transitions. Looks stunning on every device.' },
  { icon: '🌍', key: 'feat3', title: 'Easy Editing',       desc: 'Update your details, projects, and links from one simple dashboard.' },
  { icon: '🔗', key: 'feat4', title: 'Shareable Link',     desc: 'Get a unique portfolio URL instantly. Share on LinkedIn, WhatsApp & more.' },
  { icon: '🔒', key: 'feat5', title: 'Secure & Private',   desc: 'JWT authentication, OTP verification, and auto-logout keep your data safe.' },
  { icon: '📱', key: 'feat6', title: 'Fully Responsive',   desc: 'Pixel-perfect on mobile, tablet and desktop. Every screen size covered.' },
];

export const STEPS = [
  { num: '01', title: 'Create Account',  desc: 'Register with email OTP verification. Takes less than 60 seconds.' },
  { num: '02', title: 'Fill Your Info',  desc: 'Add your bio, skills, projects, and social links in the dashboard.' },
  { num: '03', title: 'Share Your Link', desc: 'Generate your unique portfolio link and share it with the world.' },
];

export const PRICING = [
  {
    plan: 'Free', price: '$0', period: '/forever',
    desc: 'Perfect for getting started.',
    features: ['1 Portfolio', 'Up to 5 Projects', 'Shareable Link', 'Light & Dark Mode', 'Responsive Design'],
    featured: false,
  },
  {
    plan: 'Pro', price: '$5', period: '/month',
    desc: 'For serious professionals.',
    features: ['Unlimited Projects', 'Custom Slug URL', 'Portfolio Analytics', 'Priority Support', 'Export as PDF', 'Remove Branding'],
    featured: true,
    badge: 'Most Popular',
  },
];

export const TESTIMONIALS = [
  {
    stars: '★★★★★',
    text: 'ShowCraft helped me land my first developer job. My portfolio looks incredibly professional and I built it in minutes!',
    name: 'Areeb R.', role: 'Frontend Developer', initial: 'A',
  },
  {
    stars: '★★★★★',
    text: 'The dashboard makes updates simple. I can refresh my portfolio before sharing it with clients.',
    name: 'Maryam A.', role: 'UI/UX Designer', initial: 'S',
  },
  {
    stars: '★★★★★',
    text: 'Clean, fast, and easy to use. I love the dark mode and the link sharing feature. Highly recommend!',
    name: 'Salman V.', role: 'Full-Stack Developer', initial: 'C',
  },
];

export const STATS = [
  { num: '500+',  label: 'Portfolios Created' },
  { num: '4',     label: 'Dashboard Sections' },
  { num: '5 min', label: 'Average Setup Time' },
  { num: '100%',  label: 'Free to Start' },
];

export const NAV_LINKS = ['features', 'how-it-works', 'pricing', 'testimonials', 'contact'];
