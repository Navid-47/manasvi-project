import React, { useState, useEffect } from 'react';

const About = () => {
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

  const values = [
    {
      id: 1,
      title: 'Integrity',
      description: 'We believe in honest and transparent business practices in all our dealings. Our customers trust us because we always deliver on our promises and maintain the highest ethical standards.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Sustainability',
      description: 'We are committed to sustainable tourism practices that respect local cultures and environments. We partner with eco-friendly accommodations and support local communities in every destination we offer.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service to exceed our travelers\' expectations. From the initial consultation to the final farewell, we ensure every detail is perfect.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    },
    {
      id: 4,
      title: 'Innovation',
      description: 'We continuously innovate to provide the best travel experiences using cutting-edge technology. Our user-friendly platform and personalized recommendations make travel planning effortless.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      )
    }
  ];

  const milestones = [
    { year: '2010', event: 'Company founded with a vision to make travel accessible to everyone' },
    { year: '2012', event: 'Expanded to 15 international destinations' },
    { year: '2015', event: 'Launched our award-winning mobile app' },
    { year: '2017', event: 'Reached 50,000 happy travelers milestone' },
    { year: '2019', event: 'Introduced sustainable travel initiatives' },
    { year: '2021', event: 'Expanded to 50+ destinations across 6 continents' },
    { year: '2023', event: 'Launched virtual reality travel experiences' },
    { year: '2024', event: 'Celebrated 100,000+ satisfied customers' }
  ];

  return (
    <div className="py-16 bg-bg">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text">About Travel Manasvi</h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto mb-8">
            We are passionate about creating unforgettable travel experiences. Our mission is to connect travelers with the world's most beautiful destinations through expertly crafted journeys.
          </p>
        </div>

        {/* Company Introduction */}
        <section id="company" className={`mb-16 section-animate ${animatedSections.includes('company') ? 'animate' : ''}`}>
          <div className="bg-surface rounded-xl shadow-lg p-8 md:p-12 hover-card">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-in-left">
                <h2 className="text-3xl font-bold mb-6 text-text">Our Story</h2>
                <p className="text-text-muted mb-6">
                  Founded in 2010, Travel Manasvi began with a simple vision: to make travel accessible, enjoyable, and meaningful for everyone. What started as a small team of travel enthusiasts has grown into a trusted partner for thousands of travelers worldwide.
                </p>
                <p className="text-text-muted mb-6">
                  Our name "Manasvi" comes from the Sanskrit word meaning "imaginative" or "creative," reflecting our commitment to crafting unique and personalized travel experiences that go beyond the ordinary.
                </p>
                <p className="text-text-muted">
                  Today, we continue to uphold our founding principles while embracing innovation and sustainability to ensure that future generations can enjoy the same incredible destinations we cherish today.
                </p>
              </div>
              <div className="animate-slide-in-right">
                <img 
                  src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Travel Team" 
                  className="rounded-xl shadow-lg w-full img-hover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section id="mission" className={`mb-16 section-animate ${animatedSections.includes('mission') ? 'animate' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface rounded-xl shadow-lg p-8 hover-card animate-slide-in-left">
              <h3 className="text-2xl font-bold mb-4 text-text">Our Mission</h3>
              <p className="text-text-muted">
                To make the world more accessible by providing exceptional travel experiences that are both meaningful and memorable. We believe travel has the power to transform lives and create lasting connections between people and cultures.
              </p>
            </div>
            <div className="bg-surface rounded-xl shadow-lg p-8 hover-card animate-slide-in-right">
              <h3 className="text-2xl font-bold mb-4 text-text">Our Vision</h3>
              <p className="text-text-muted">
                To be the world's most trusted and innovative travel partner, known for our commitment to sustainability, authenticity, and unparalleled customer service. We envision a world where everyone can explore and appreciate the beauty of our planet.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section id="values" className={`mb-16 section-animate ${animatedSections.includes('values') ? 'animate' : ''}`}>
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-text">Our Core Values</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              These principles guide everything we do and define who we are as a company
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.id} className="text-center p-6 bg-surface rounded-xl shadow-md transition-all duration-300 hover-card animate-slide-in-up">
                <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-6 hover-scale">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-text">{value.title}</h3>
                <p className="text-text-muted">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Company Milestones */}
        <section id="milestones" className={`mb-16 section-animate ${animatedSections.includes('milestones') ? 'animate' : ''}`}>
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-text">Our Journey</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Key milestones in our company's growth and achievements
            </p>
          </div>
          <div className="bg-surface rounded-xl shadow-lg p-8 hover-card">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-brand hidden md:block"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} animate-slide-in-${index % 2 === 0 ? 'right' : 'left'}`}>
                    <div className="md:w-1/2 mb-4 md:mb-0 md:px-8">
                      <div className="bg-brand text-white rounded-full w-16 h-16 flex items-center justify-center font-bold mx-auto md:mx-0 hover-scale">
                        {milestone.year}
                      </div>
                    </div>
                    <div className="md:w-1/2 md:px-8">
                      <div className="bg-bg p-6 rounded-xl shadow-md hover-card">
                        <h3 className="text-xl font-bold text-text mb-2">{milestone.year}</h3>
                        <p className="text-text-muted">{milestone.event}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className={`mb-16 section-animate ${animatedSections.includes('stats') ? 'animate' : ''}`}>
          <div className="bg-surface rounded-xl shadow-lg p-8 hover-card">
            <h2 className="text-2xl font-bold text-center mb-12 text-text animate-fade-in">By The Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="p-6 animate-slide-in-up">
                <div className="text-4xl font-bold text-brand mb-2">100k+</div>
                <div className="text-text-muted">Happy Travelers</div>
              </div>
              <div className="p-6 animate-slide-in-up" style={{animationDelay: '0.2s'}}>
                <div className="text-4xl font-bold text-brand mb-2">50+</div>
                <div className="text-text-muted">Destinations</div>
              </div>
              <div className="p-6 animate-slide-in-up" style={{animationDelay: '0.4s'}}>
                <div className="text-4xl font-bold text-brand mb-2">15+</div>
                <div className="text-text-muted">Years Experience</div>
              </div>
              <div className="p-6 animate-slide-in-up" style={{animationDelay: '0.6s'}}>
                <div className="text-4xl font-bold text-brand mb-2">98%</div>
                <div className="text-text-muted">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center animate-fade-in">
          <div className="bg-brand rounded-xl p-12 hover-card">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
            <p className="text-brand-100 max-w-2xl mx-auto mb-8 text-xl">
              Join thousands of satisfied travelers and explore the world with us
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-brand hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-all duration-300 hover-brand">
                Explore Our Tours
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand font-bold py-3 px-8 rounded-lg transition-all duration-300 hover-brand">
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;