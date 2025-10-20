import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animatedSections, setAnimatedSections] = useState([]);

  useEffect(() => {
    // Animate sections on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimatedSections(prev => [...prev, entry.target.id]);
        }
      });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('.section-animate');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, you would send the message here
    console.log('Message sent:', { name, email, subject, message });
    
    // Simulate API call
    setTimeout(() => {
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
      alert('Thank you for your message! We will get back to you soon.');
    }, 1000);
  };

  // Position for the map (Solapur as an example)
  const position = [17.6599, 75.9064];

  const faqs = [
    {
      question: "How do I book a tour?",
      answer: "You can book a tour directly through our website by selecting your desired destination and package. Simply click on the 'Book Now' button on any tour or destination page, and follow the easy booking process. Alternatively, you can contact our customer service team for personalized assistance."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards including Visa, Mastercard, and American Express. We also accept bank transfers and PayPal payments. All transactions are secured with 256-bit SSL encryption for your protection."
    },
    {
      question: "Can I cancel or modify my booking?",
      answer: "Yes, cancellations and modifications are possible depending on the package and timing. Our flexible cancellation policy allows for full refunds if canceled 30 days before departure, 50% refund if canceled 15 days before departure, and no refund within 14 days of departure. Please refer to our cancellation policy or contact our support team for more information."
    },
    {
      question: "Do you offer travel insurance?",
      answer: "Yes, we offer comprehensive travel insurance for all our packages. Our insurance covers trip cancellations, medical emergencies, lost baggage, and travel delays. We highly recommend purchasing travel insurance to protect your investment and ensure peace of mind during your journey."
    },
    {
      question: "What is your refund policy?",
      answer: "Our refund policy varies depending on the package and timing of cancellation. Generally, we offer full refunds for cancellations made 30 days prior to departure, partial refunds for cancellations made 15 days prior, and no refunds within 14 days of departure. Special packages may have different policies, so please check the specific terms or contact our support team for details."
    },
    {
      question: "Do you provide visa assistance?",
      answer: "Yes, we provide visa assistance for most destinations. Our team can help you with visa requirements, application processes, and necessary documentation. Please contact us at least 60 days before your departure date to ensure sufficient time for visa processing."
    }
  ];

  const contactMethods = [
    {
      title: "Head Office",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      ),
      details: [
        "123 Travel Street",
        "Solapur, Maharashtra 413001, India"
  
      ]
    },
    {
      title: "Phone Support",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
        </svg>
      ),
      details: [
        "+91 98765 43210",
        "+91 87654 32109"
      ]
    },
    {
      title: "Email Support",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      ),
      details: [
        "info@travelmanasvi.com",
        "support@travelmanasvi.com"
      ]
    },
    {
      title: "Working Hours",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 4:00 PM",
        "Sunday: Closed"
      ]
    }
  ];

  const supportChannels = [
    {
      title: "24/7 Customer Support",
      description: "Our dedicated support team is available around the clock to assist you with any travel-related queries or emergencies during your journey.",
      icon: (
        <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      )
    },
    {
      title: "Live Chat",
      description: "Connect instantly with our travel experts through our website's live chat feature for real-time assistance with bookings and inquiries.",
      icon: (
        <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
      )
    },
    {
      title: "Social Media",
      description: "Follow us on social media for travel inspiration, updates, and special offers. Our team regularly shares travel tips and destination highlights.",
      icon: (
        <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="py-16 bg-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-text">Contact Us</h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            Have questions or need assistance? Our team is here to help you plan your perfect journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div id="contact-form" className={`bg-surface rounded-xl shadow-lg p-8 hover-card section-animate ${animatedSections.includes('contact-form') ? 'animate' : ''}`}>
            <h2 className="text-2xl font-bold mb-6 text-text animate-fade-in">Send us a message</h2>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="animate-slide-in-left"
                />
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="animate-slide-in-left"
                />
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="animate-slide-in-left"
                />
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Message"
                  multiline
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="animate-slide-in-left"
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: 'var(--brand)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'var(--brand-dark)',
                    },
                    '&:disabled': {
                      backgroundColor: 'var(--brand)',
                      opacity: 0.7,
                    },
                    transition: 'all 0.3s ease'
                  }}
                  className="animate-slide-in-left hover-brand"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </form>
          </div>

          {/* Map and Contact Info */}
          <div>
            <div id="contact-info" className={`bg-surface rounded-xl shadow-lg p-8 mb-8 hover-card section-animate ${animatedSections.includes('contact-info') ? 'animate' : ''}`}>
              <h2 className="text-2xl font-bold mb-6 text-text animate-fade-in">Our Office</h2>
              <div className="h-80 rounded-lg overflow-hidden mb-6 animate-slide-in-right">
                <MapContainer 
                  center={position} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }} 
                  whenCreated={map => {
                    // Fix for Leaflet map not updating properly
                    setTimeout(() => {
                      map.invalidateSize();
                    }, 100);
                  }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={position}>
                    <Popup>
                      Travel Manasvi Head Office
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start animate-slide-in-right hover-scale">
                    <div className="bg-brand rounded-full p-3 mr-4 hover-scale">
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-text">{method.title}</h3>
                      {method.details.map((detail, idx) => (
                        <p key={idx} className="text-text-muted">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Support Channels */}
        <div id="support" className={`mt-16 section-animate ${animatedSections.includes('support') ? 'animate' : ''}`}>
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-text">Our Support Channels</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              We offer multiple ways to get in touch with our travel experts
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <div key={index} className="bg-surface rounded-xl shadow-lg p-6 text-center hover-card animate-slide-in-up" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="flex justify-center mb-4 hover-scale">
                  {channel.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-text">{channel.title}</h3>
                <p className="text-text-muted">{channel.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className={`mt-16 section-animate ${animatedSections.includes('faq') ? 'animate' : ''}`}>
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-text">Frequently Asked Questions</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Find answers to common questions about our services and travel packages
            </p>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Accordion key={index} className="animate-slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography className="font-bold">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography className="text-text-muted">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;