import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, LinkedIn, YouTube, LocationOn, Phone, Email, AccessTime } from '@mui/icons-material';

const Footer = () => {
  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'Destinations', path: '/destinations' },
    { text: 'Tours', path: '/tours' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' }
  ];

  const socialLinks = [
    { icon: <Facebook />, url: '#', name: 'Facebook' },
    { icon: <Twitter />, url: '#', name: 'Twitter' },
    { icon: <Instagram />, url: '#', name: 'Instagram' },
    { icon: <LinkedIn />, url: '#', name: 'LinkedIn' },
    { icon: <YouTube />, url: '#', name: 'YouTube' }
  ];

  const companyLinks = [
    { text: 'About Us', path: '/about' },
    { text: 'Careers', path: '#' },
    { text: 'Blog', path: '#' },
    { text: 'Press', path: '#' }
  ];

  const supportLinks = [
    { text: 'Help Center', path: '#' },
    { text: 'FAQ', path: '/contact' },
    { text: 'Booking Guide', path: '#' },
    { text: 'Contact Support', path: '/contact' }
  ];

  const legalLinks = [
    { text: 'Privacy Policy', path: '/privacy-policy' },
    { text: 'Terms of Service', path: '/terms-of-service' },
    { text: 'Cookie Policy', path: '/cookie-policy' }
  ];

  return (
    <footer className="bg-surface text-text border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1 animate-fade-in">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center mr-3 hover-scale">
                <span className="text-white font-bold text-lg">TM</span>
              </div>
              <h3 className="text-xl font-bold">Travel Manasvi</h3>
            </div>
            <p className="text-text-muted mb-6 text-sm">
              Creating unforgettable travel experiences since 2010. We connect travelers with the world's most beautiful destinations.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  className="text-text-muted hover:text-brand transition-colors duration-300 hover-scale"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-slide-in-up">
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-text-muted hover:text-brand transition-colors duration-300 hover-scale"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Support */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="animate-slide-in-up" style={{animationDelay: '0.2s'}}>
              <h4 className="text-lg font-bold mb-6">Company</h4>
              <ul className="space-y-3">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    {link.path === '#' ? (
                      <button 
                        onClick={() => console.log(`${link.text} clicked`)}
                        className="text-text-muted hover:text-brand transition-colors duration-300 text-left w-full hover-scale"
                      >
                        {link.text}
                      </button>
                    ) : (
                      <a 
                        href={link.path} 
                        className="text-text-muted hover:text-brand transition-colors duration-300 hover-scale"
                      >
                        {link.text}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="animate-slide-in-up" style={{animationDelay: '0.4s'}}>
              <h4 className="text-lg font-bold mb-6">Support</h4>
              <ul className="space-y-3">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    {link.path === '#' ? (
                      <button 
                        onClick={() => console.log(`${link.text} clicked`)}
                        className="text-text-muted hover:text-brand transition-colors duration-300 text-left w-full hover-scale"
                      >
                        {link.text}
                      </button>
                    ) : link.path.startsWith('/') ? (
                      <Link 
                        to={link.path} 
                        className="text-text-muted hover:text-brand transition-colors duration-300 hover-scale"
                      >
                        {link.text}
                      </Link>
                    ) : (
                      <a 
                        href={link.path} 
                        className="text-text-muted hover:text-brand transition-colors duration-300 hover-scale"
                      >
                        {link.text}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="animate-slide-in-up" style={{animationDelay: '0.6s'}}>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <LocationOn className="text-brand mr-3 mt-1 flex-shrink-0 hover-scale" />
                <span className="text-text-muted">123 Travel Street, Solapur, Maharashtra 413001, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-brand mr-3 flex-shrink-0 hover-scale" />
                <span className="text-text-muted">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Email className="text-brand mr-3 flex-shrink-0 hover-scale" />
                <span className="text-text-muted">info@travelmanasvi.com</span>
              </li>
              <li className="flex items-start">
                <AccessTime className="text-brand mr-3 mt-1 flex-shrink-0 hover-scale" />
                <div>
                  <span className="text-text-muted block">Mon-Fri: 9:00 AM - 6:00 PM</span>
                  <span className="text-text-muted block">Sat: 10:00 AM - 4:00 PM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center animate-fade-in">
          <p className="text-text-muted text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Travel Manasvi. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {legalLinks.map((link, index) => (
              <Link 
                key={index} 
                to={link.path} 
                className="text-text-muted hover:text-brand text-sm transition-colors duration-300 hover-scale"
              >
                {link.text}
              </Link>
            ))}
            <button 
              onClick={() => console.log('Sitemap clicked')}
              className="text-text-muted hover:text-brand text-sm transition-colors duration-300 hover-scale"
            >
              Sitemap
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;