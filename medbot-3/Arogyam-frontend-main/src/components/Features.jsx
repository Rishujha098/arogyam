import React from 'react';
import { useEffect, useRef } from 'react';
import { Globe, Lightbulb, Shield, Stethoscope, MessageSquare, Smartphone } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 75%",
          end: "bottom 25%",
        }
      });

      // Icon hover animations
      gsap.set(".feature-icon", { transformOrigin: "center" });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Globe,
      title: 'Multilingual Support',
      description: 'Communicate in over 50 languages with real-time translation and culturally-aware responses',
      color: 'blue'
    },
    {
      icon: Lightbulb,
      title: 'Health Tips & Education',
      description: 'Receive personalized health tips, wellness advice, and educational content tailored to your needs',
      color: 'green'
    },
    {
      icon: Shield,
      title: 'Vaccination Alerts',
      description: 'Stay updated with vaccination schedules, reminders, and location-based availability information',
      color: 'teal'
    },
    {
      icon: Stethoscope,
      title: 'Symptom Checker',
      description: 'Intelligent symptom assessment with guided questions and appropriate care recommendations',
      color: 'blue'
    },
    {
      icon: MessageSquare,
      title: 'Government Health Scheme',
      description: 'Provides personalized recommendations for relevant government health schemes.',
      color: 'green'
    },
    {
      icon: Smartphone,
      title: 'Disease Accuracy',
      description: 'Uses curated medical datasets and AI-powered retrieval-based Q&A to provide 85% + accurate responses for symptom queries and first-aid guidance.',
      color: 'teal'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100',
          icon: 'text-blue-600',
          gradient: 'from-blue-500 to-blue-600'
        };
      case 'green':
        return {
          bg: 'bg-green-100',
          icon: 'text-green-600',
          gradient: 'from-green-500 to-green-600'
        };
      case 'teal':
        return {
          bg: 'bg-teal-100',
          icon: 'text-teal-600',
          gradient: 'from-teal-500 to-teal-600'
        };
      default:
        return {
          bg: 'bg-blue-100',
          icon: 'text-blue-600',
          gradient: 'from-blue-500 to-blue-600'
        };
    }
  };

  return (
    <section 
    id='feature'
    //  ref={sectionRef} 
     className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Arogyam Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform provides accessible, multilingual healthcare support 
            designed to bridge gaps in healthcare access worldwide.
          </p>
        </div>
        
        <div
         ref={cardsRef} 
         className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            return (
              <div
                key={index}
                className="feature-card group bg-white p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="mb-6 flex flex-col items-center text-center">
                  <div className={`feature-icon w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                    <feature.icon className={`h-8 w-8 ${colors.icon}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${colors.gradient} rounded-full transition-all duration-500`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features