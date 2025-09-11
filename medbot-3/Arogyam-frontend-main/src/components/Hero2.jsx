import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, QrCode, ArrowRight, Globe, Heart, Shield, Users, Zap, Phone, Mail, Play, Sparkles, Activity, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero2 = () => {
  const [showQR, setShowQR] = useState(false);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const graphicsRef = useRef(null);
  const floatingElementsRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    // Hero entrance animation
    const tl = {
      from: (element, options) => {
        if (element) {
          element.style.opacity = '0';
          element.style.transform = `translateY(${options.y || 0}px) scale(${options.scale || 1})`;

          setTimeout(() => {
            element.style.transition = `all ${options.duration || 0.8}s cubic-bezier(0.4, 0, 0.2, 1)`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1)';
          }, options.delay || 0);
        }
      }
    };

    tl.from(titleRef.current, { y: 50, duration: 1, delay: 200 });
    tl.from(subtitleRef.current, { y: 30, duration: 0.8, delay: 400 });
    tl.from(buttonsRef.current, { y: 30, duration: 0.8, delay: 600 });
    tl.from(graphicsRef.current, { scale: 0.8, duration: 1, delay: 300 });

    // Floating animations
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
      const animate = () => {
        if (element instanceof HTMLElement) {
          element.style.transform = `translateY(${Math.sin(Date.now() * 0.001 + index) * 10}px)`;
        }
        requestAnimationFrame(animate);
      };
      animate();
    });

    // Particle animation
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      const animate = () => {
        if (particle instanceof HTMLElement) {
          const x = Math.sin(Date.now() * 0.001 + index * 0.5) * 20;
          const y = Math.cos(Date.now() * 0.0015 + index * 0.7) * 15;
          particle.style.transform = `translate(${x}px, ${y}px)`;
        }
        requestAnimationFrame(animate);
      };
      animate();
    });
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Demo Button */}
      {/* <div className="absolute top-8 right-8 z-30">
        <button className="group bg-white/80 backdrop-blur-xl border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-white hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
          <Play className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
          <span>Demo</span>
        </button>
      </div> */}

      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-teal-200/30 to-green-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-pink-200/30 to-violet-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Floating Particles */}
        <div ref={particlesRef} className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`particle absolute w-1 h-1 bg-gray-400/60 rounded-full`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-full px-6 py-3 text-gray-700">
              <div className="relative">
                <MessageCircle className="h-6 w-6 text-blue-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <span className="font-semibold">Arogyam</span>
              <div className="flex items-center gap-1 ml-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-500">Powered by AI</span>
              </div>
            </div>

            <div ref={titleRef} className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gray-900 mb-2 block">Your Healthcare</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 animate-gradient-x">
                  Assistant
                </span>
                <span className="text-gray-700 block text-3xl md:text-4xl lg:text-5xl mt-2 font-light">
                  in Your Language
                </span>
              </h1>
            </div>

            <p ref={subtitleRef} className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Experience next-generation healthcare guidance with AI-powered symptom analysis,
              instant medical insights, and personalized care recommendations in over
              <span className="text-blue-400 font-semibold"> 50 languages</span>.
            </p>

            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* <button
                onClick={() => setShowQR(!showQR)}
                className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                <MessageCircle className="h-5 w-5 relative z-10" />
                <span className="relative z-10">Start on WhatsApp</span>
                <QrCode className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              </button> */}

              <Link to='/chatbot'>
              <button
                // onClick={() => setShowQR(!showQR)}
                className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                <MessageCircle className="h-5 w-5 relative z-10" />
                <span className="clsrelative z-10">Try with Arogyam</span>
                {/* <QrCode className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" /> */}
              </button>
              </Link>

              <Link to='/chatbot'>
                <button className="group bg-white/80 backdrop-blur-xl border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-white hover:border-gray-300 transition-all duration-300">
                  <span>Explore Features</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
            </div>

            {/* Enhanced QR Section */}
            {showQR && (
              <div className="mt-8 p-8 bg-white/90 backdrop-blur-2xl rounded-3xl border border-gray-200 max-w-sm mx-auto lg:mx-0 shadow-2xl">
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <QrCode className="h-32 w-32 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Access</h3>
                  <p className="text-sm text-gray-600 mb-4">Scan to start your health journey on WhatsApp</p>
                  <a href="#" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
                    <MessageCircle className="h-4 w-4" />
                    Open WhatsApp Web
                  </a>
                </div>
              </div>
            )}

            {/* Trust Indicators Enhanced */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-200">
              {[
                { icon: Phone, label: 'WhatsApp', desc: 'Instant chat', color: 'text-green-400' },
                { icon: Mail, label: 'SMS', desc: 'Text support', color: 'text-blue-400' },
                { icon: Globe, label: 'Web Chat', desc: 'Browser access', color: 'text-purple-400' },
                { icon: Shield, label: 'Secure', desc: 'HIPAA compliant', color: 'text-teal-400' }
              ].map((item, index) => (
                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className={`flex items-center justify-center mb-3 ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <p className="text-gray-900 font-medium text-sm">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Revolutionary Chat Interface */}
          <div ref={graphicsRef} className="relative">
            {/* Main Chat Container */}
            <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl p-8 border border-gray-200 shadow-2xl">
              {/* Chat Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Arogyam</h3>
                    <p className="text-xs text-gray-500">Your AI Health Assistant</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 mb-6 h-64 overflow-hidden">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 backdrop-blur-sm p-4 rounded-2xl rounded-tl-sm max-w-xs border border-gray-200">
                    <p className="text-gray-800 text-sm">Hello! I'm Arogyam. How are you feeling today?</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl rounded-tr-sm max-w-xs">
                    <p className="text-white text-sm">I've been having headaches and feeling tired lately</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 backdrop-blur-sm p-4 rounded-2xl rounded-tl-sm max-w-xs border border-gray-200">
                    <p className="text-gray-800 text-sm">I understand. Let me ask a few questions to better help you. On a scale of 1-10, how would you rate your headache intensity?</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl rounded-tr-sm max-w-xs">
                    <p className="text-white text-sm">About a 7</p>
                  </div>
                </div>

                {/* Typing Indicator */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-50 backdrop-blur-sm p-4 rounded-2xl rounded-tl-sm border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-500 text-xs">Analyzing symptoms...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Healthcare Elements */}
            <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
              <div className="floating-element absolute -top-8 -right-8 bg-gradient-to-br from-green-400 to-teal-500 p-4 rounded-2xl shadow-2xl border border-gray-200">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div className="floating-element absolute -bottom-8 -left-8 bg-gradient-to-br from-blue-400 to-purple-500 p-4 rounded-2xl shadow-2xl border border-gray-200">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="floating-element absolute top-1/2 -left-12 bg-gradient-to-br from-purple-400 to-pink-500 p-3 rounded-xl shadow-2xl border border-gray-200">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="floating-element absolute top-1/4 -right-12 bg-gradient-to-br from-teal-400 to-green-500 p-3 rounded-xl shadow-2xl border border-gray-200">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Stats Overlays */}
            <div className="absolute -top-6 left-6 bg-white/90 backdrop-blur-2xl p-4 rounded-xl border border-gray-200 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-900 text-sm font-medium">24/7 Available</span>
              </div>
              <p className="text-gray-500 text-xs mt-1">Always here to help</p>
            </div>

            <div className="floating-element absolute -bottom-6 right-6 bg-white/90 backdrop-blur-2xl p-4 rounded-xl border border-gray-200 shadow-xl">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-400" />
                <span className="text-gray-900 text-sm font-medium">50+ Languages</span>
              </div>
              <p className="text-gray-500 text-xs mt-1">Truly global support</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero2;