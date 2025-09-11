import React from 'react';
import { useEffect, useRef } from 'react';
import { MessageCircle, QrCode, Shield, Mail, Phone, MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-section", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 85%",
        }
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div ref={contentRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & QR */}
          <div className="footer-section lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Arogyam</span>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted multilingual healthcare assistant, available 24/7 across multiple platforms.
            </p>
            
            <div className="bg-white p-4 rounded-xl max-w-xs">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm font-medium">
                  Scan for WhatsApp
                </p>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {/* <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li> */}
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Languages</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              {/* <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Report Issue</a></li> */}
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Feedback</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">support@arogyam.ai</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">+1 (555) 123-HEALTH</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">Global Service</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Medical Disclaimer */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-red-400 font-semibold mb-2">Medical Disclaimer</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This AI assistant provides general health information only and is not a substitute for professional medical advice, 
                  diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any 
                  questions you may have regarding a medical condition. Never disregard professional medical advice or delay 
                  seeking it because of something you have read from this AI assistant. In case of emergency, contact your local 
                  emergency services immediately.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Arogyam. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer