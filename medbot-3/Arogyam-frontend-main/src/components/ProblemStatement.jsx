import React from 'react';
import { useEffect, useRef } from 'react';
import { Clock, MapPin, Languages, AlertCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProblemStatement = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".problem-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          end: "bottom 20%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const problems = [
    {
      icon: Clock,
      title: 'Long Wait Times',
      description: 'Average wait time for medical advice is 2-4 weeks in many regions'
    },
    {
      icon: MapPin,
      title: 'Limited Access',
      description: 'Rural and underserved communities lack immediate healthcare guidance'
    },
    {
      icon: Languages,
      title: 'Language Barriers',
      description: 'Medical information often unavailable in native languages'
    },
    {
      icon: AlertCircle,
      title: 'Emergency Delays',
      description: 'Critical time lost when people need immediate health guidance'
    }
  ];

  return (
    <section
    //  ref={sectionRef} 
     className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Healthcare Challenges We Address
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Millions face barriers to accessing timely, understandable healthcare information. 
            Our AI assistant breaks down these barriers.
          </p>
        </div>
        
        <div 
        ref={cardsRef} 
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="problem-card bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-2"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4">
                  <problem.icon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {problem.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;