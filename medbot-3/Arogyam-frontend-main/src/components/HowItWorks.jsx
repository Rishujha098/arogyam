import React from 'react';
import { useEffect, useRef } from 'react';
import { MessageCircle, Brain, CheckCircle, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const stepsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate timeline line
      gsap.from(".timeline-line", {
        scaleX: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 70%",
        }
      });

      // Animate steps
      gsap.from(".step-card", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 75%",
        }
      });

      // Animate step numbers
      gsap.from(".step-number", {
        scale: 0,
        rotation: 180,
        duration: 0.8,
        stagger: 0.3,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 75%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      number: '01',
      icon: MessageCircle,
      title: 'Start Conversation',
      description: 'Send a message via WhatsApp, SMS, or web chat in your preferred language'
    },
    {
      number: '02',
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our AI processes your query using medical knowledge and multilingual understanding'
    },
    {
      number: '03',
      icon: CheckCircle,
      title: 'Get Guidance',
      description: 'Receive personalized health advice, resources, and next steps in your language'
    }
  ];

  return (
    <section
    //  ref={sectionRef} 
     className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting healthcare guidance is simple and takes less than 2 minutes
          </p>
        </div>
        
        <div ref={timelineRef} className="relative">
          {/* Desktop Timeline */}
          <div className="hidden lg:block absolute top-32 left-1/2 transform -translate-x-1/2 w-full">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <div className="timeline-line flex-1 h-0.5 bg-gradient-to-r from-blue-600 to-green-600 mx-8"></div>
              <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-full"></div>
              <div className="timeline-line flex-1 h-0.5 bg-gradient-to-r from-blue-600 to-green-600 mx-8"></div>
              <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            </div>
          </div>
          
          <div ref={stepsRef} className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="step-card bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:scale-110 transition-transform duration-300">
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                    <span className="step-number text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                      {step.number}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-8">
                    <ArrowRight className="h-6 w-6 text-blue-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks