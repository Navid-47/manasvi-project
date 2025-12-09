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
    <footer className="bg-surface text-text border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Contact Info */}
          <div className="animate-slide-in-up">
            <h4 className="text-lg font-bold mb-6 text-gray-800 pl-0">Contact Us</h4>
            <ul className="space-y-3 pl-0">
              <li className="pl-0 ml-0">
                <div className="flex items-start">
                  <LocationOn className="text-brand mr-3 mt-1 flex-shrink-0" />
                  <span className="text-text-muted hover:text-brand transition-colors duration-300 block">
                    123 Travel Street, Solapur, Maharashtra 413001, India
                  </span>
                </div>
              </li>
              <li className="pl-0 ml-0">
                <div className="flex items-center">
                  <Phone className="text-brand mr-3 flex-shrink-0" />
                  <a href="tel:+919876543210" className="text-text-muted hover:text-brand transition-colors duration-300">
                    +91 98765 43210
                  </a>
                </div>
              </li>
              <li className="pl-0 ml-0">
                <div className="flex items-center">
                  <Email className="text-brand mr-3 flex-shrink-0" />
                  <a href="mailto:info@travelmanasvi.com" className="text-text-muted hover:text-brand transition-colors duration-300">
                    info@travelmanasvi.com
                  </a>
                </div>
              </li>
              <li className="pl-0 ml-0">
                <div className="flex items-start">
                  <AccessTime className="text-brand mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-text-muted hover:text-brand transition-colors duration-300 block">Mon-Fri: 9:00 AM - 6:00 PM</span>
                    <span className="text-text-muted hover:text-brand transition-colors duration-300 block">Sat: 10:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="animate-slide-in-up" style={{animationDelay: '0.2s'}}>
            <h4 className="text-lg font-bold mb-6 text-gray-800 pl-0">Quick Links</h4>
            <ul className="space-y-3 pl-0">
              {navLinks.map((link, index) => (
                <li key={index} className="pl-0 ml-0">
                  <Link 
                    to={link.path} 
                    className="text-text-muted hover:text-brand transition-colors duration-300 hover-scale block pl-0 ml-0"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="animate-slide-in-up" style={{animationDelay: '0.4s'}}>
            <h4 className="text-lg font-bold mb-6 text-gray-800 pl-0">Company</h4>
            <ul className="space-y-3 pl-0">
              {companyLinks.map((link, index) => (
                <li key={index} className="pl-0 ml-0">
                  <Link 
                    to={link.path} 
                    className="text-text-muted hover:text-brand transition-colors duration-300 hover-scale block pl-0 ml-0"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="animate-slide-in-up" style={{animationDelay: '0.6s'}}>
            <h4 className="text-lg font-bold mb-6 text-gray-800 pl-0">Support</h4>
            <ul className="space-y-3 pl-0">
              {supportLinks.map((link, index) => (
                <li key={index} className="pl-0 ml-0">
                  <Link 
                    to={link.path} 
                    className="text-text-muted hover:text-brand transition-colors duration-300 hover-scale block pl-0 ml-0"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Company Info - Moved down with black background */}
        <div className="bg-black text-white p-8 rounded-lg">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center mr-4 hover-scale">
                    <span className="text-white font-bold text-xl">TM</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Travel Manasvi</h3>
                </div>
                <p className="text-gray-300 text-base leading-relaxed max-w-xl">
                  Creating unforgettable travel experiences since 2010. We connect travelers with the world's most beautiful destinations.
                </p>
              </div>
              <div className="flex space-x-5">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index} 
                    href={social.url} 
                    className="text-gray-300 hover:text-white transition-colors duration-300 hover-scale text-2xl"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center animate-fade-in">
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