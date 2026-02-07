import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook size={18} />, url: '#', name: 'Facebook' },
    { icon: <Twitter size={18} />, url: '#', name: 'Twitter' },
    { icon: <Instagram size={18} />, url: '#', name: 'Instagram' },
    { icon: <Linkedin size={18} />, url: '#', name: 'LinkedIn' },
    { icon: <Youtube size={18} />, url: '#', name: 'YouTube' }
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-xl shadow-brand/30 shadow-lg">
                TM
              </div>
              <span className="text-2xl font-display font-bold text-text-primary">Travel Manasvi</span>
            </Link>
            <p className="text-text-secondary leading-relaxed max-w-sm">
              Creating unforgettable travel experiences since 2010. We connect travelers with the world's most beautiful destinations through curated packages and expert guidance.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="w-10 h-10 rounded-full bg-gray-50 text-text-secondary flex items-center justify-center hover:bg-brand hover:text-white transition-all duration-300 hover:-translate-y-1"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg mb-6 text-text-primary">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Destinations', 'Tours', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-text-secondary hover:text-brand hover:pl-2 transition-all duration-300 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg mb-6 text-text-primary">Support</h4>
            <ul className="space-y-4">
              {['Help Center', 'FAQs', 'Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-text-secondary hover:text-brand hover:pl-2 transition-all duration-300 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4">
            <h4 className="font-bold text-lg mb-6 text-text-primary">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-text-secondary group">
                <MapPin className="mt-1 text-brand group-hover:animate-bounce" size={20} />
                <span>123 Travel Street, Solapur, Maharashtra 413001, India</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary">
                <Phone className="text-brand" size={20} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary">
                <Mail className="text-brand" size={20} />
                <span>info@travelmanasvi.com</span>
              </li>
              <li className="flex items-start gap-3 text-text-secondary">
                <Clock className="mt-1 text-brand" size={20} />
                <div className="text-sm">
                  <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
                  <p>Sat: 10:00 AM - 4:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-light">
          <p>&copy; {currentYear} Travel Manasvi. All rights reserved.</p>
          <div className="flex gap-8">
            <button className="hover:text-brand transition-colors">Sitemap</button>
            <button className="hover:text-brand transition-colors">Legal</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;