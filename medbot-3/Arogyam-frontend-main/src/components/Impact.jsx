import React from 'react';
import { useEffect, useRef } from 'react';
import { Users, MessageSquare, Globe, Clock } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Impact = () => {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stats animation
      gsap.from(".stat-card", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        }
      });

      // Number counter animation
      gsap.from(".stat-number", {
        textContent: 0,
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 },
        stagger: 0.2,
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 70%",
        }
      });

      // CTA animation
      gsap.from(ctaRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 85%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    {
      icon: Users,
      number: '500K+',
      label: 'Users Helped',
      description: 'People worldwide have received healthcare guidance'
    },
    {
      icon: MessageSquare,
      number: '2M+',
      label: 'Conversations',
      description: 'Healthcare conversations across all platforms'
    },
    {
      icon: Globe,
      number: '50+',
      label: 'Languages',
      description: 'Supported languages for global accessibility'
    },
    {
      icon: Clock,
      number: '<30s',
      label: 'Response Time',
      description: 'Average time to receive healthcare guidance'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-blue-600 to-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Real Impact, Real Results
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Our healthcare AI assistant is making a difference in communities worldwide, 
            providing accessible healthcare information when and where it's needed most.
          </p>
        </div>
        
        <div ref={statsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card text-center group"
            >
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-3 hover:scale-105">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="stat-number text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {stat.label}
                  </h3>
                  <p className="text-blue-100 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <div ref={ctaRef} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto hover:bg-white/15 transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join Our Healthcare Revolution
            </h3>
            <p className="text-blue-100 mb-6">
              Start getting instant healthcare guidance in your language today
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact