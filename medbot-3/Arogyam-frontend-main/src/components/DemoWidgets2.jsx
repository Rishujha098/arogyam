import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { Send, MessageCircle, Mic, X, Sparkles, Bot, User } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DemoWidget2 = () => {
    const sectionRef = useRef(null);
    const phoneRef = useRef(null);
    const chatButtonRef = useRef(null);
    const featuresRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! I\'m Arogyam. How can I help you today?', time: '2:30 PM' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Enhanced phone mockup animation
            gsap.from(phoneRef.current, {
                y: 120,
                opacity: 0,
                scale: 0.9,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: phoneRef.current,
                    start: "top 80%",
                }
            });

            // Features animation
            //   gsap.from(".feature-item", {
            //     y: 60,
            //     opacity: 0,
            //     duration: 1,
            //     stagger: 0.2,
            //     ease: "power3.out",
            //     scrollTrigger: {
            //       trigger: featuresRef.current,
            //       start: "top 85%",
            //     }
            //   });

            // Floating chat button animation with more sophisticated movement
            gsap.to(chatButtonRef.current, {
                y: -8,
                rotation: 5,
                duration: 3,
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1
            });

            // Message animations with better stagger
            gsap.from(".demo-message", {
                x: (index) => index % 2 === 0 ? -60 : 60,
                opacity: 0,
                scale: 0.9,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: phoneRef.current,
                    start: "top 70%",
                }
            });

            // Sparkle animation
            gsap.to(".sparkle", {
                rotation: 360,
                duration: 4,
                ease: "none",
                repeat: -1
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMessage = { type: 'user', text: inputValue, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate bot response with typing indicator
        setTimeout(() => {
            const responses = [
                'Thank you for reaching out. Can you tell me more about your symptoms? I\'m here to provide personalized guidance.',
                'I understand your concern. Let me help you with some evidence-based health information and next steps.',
                'Based on what you\'ve shared, I recommend consulting with a healthcare professional. Here\'s what you should know...',
                'Here are some clinically-backed wellness tips that might help improve your situation...'
            ];
            const botResponse = {
                type: 'bot',
                text: responses[Math.floor(Math.random() * responses.length)],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 2000);
    };

    const quickQuestions = [
        "I have a headache",
        "Feeling tired lately",
        "Need vaccination info",
        "Healthy diet tips"
    ];

    return (
        <section
            ref={sectionRef}
            className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl mr-4">
                            <Sparkles className="sparkle h-8 w-8 text-white" />
                        </div>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-lg">
                            Arogyam
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        Experience Our
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600"> Smart Assistant</span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Get instant, personalized healthcare guidance powered by advanced AI.
                        Try our interactive demo and see how we can help you make informed health decisions.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Enhanced Phone Mockup */}
                    <div ref={phoneRef} className="relative max-w-sm mx-auto lg:mx-0">
                        {/* Decorative background elements */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 rounded-3xl blur-xl"></div>

                        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 rounded-[2.5rem] shadow-2xl">
                            {/* Phone bezel */}
                            <div className="bg-black rounded-[2.25rem] p-1">
                                <div className="bg-white rounded-[2rem] overflow-hidden">
                                    {/* Enhanced Header */}
                                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 p-6 text-white relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                                        <div className="relative flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                                <Bot className="h-7 w-7 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg">Arogyam</h3>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                    <p className="text-sm text-white/90">Online</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-white/80">85% Accuracy</div>
                                                <div className="text-xs text-white/60">Clinically Validated</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Messages */}
                                    <div className="h-80 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                                        {messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`demo-message flex items-end gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {message.type === 'bot' && (
                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <Bot className="h-4 w-4 text-white" />
                                                    </div>
                                                )}
                                                <div
                                                    className={`max-w-xs p-4 rounded-2xl shadow-sm ${message.type === 'user'
                                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md'
                                                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md'
                                                        }`}
                                                >
                                                    <p className="text-sm leading-relaxed">{message.text}</p>
                                                    <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                                                        }`}>
                                                        {message.time}
                                                    </p>
                                                </div>
                                                {message.type === 'user' && (
                                                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <User className="h-4 w-4 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Typing indicator */}
                                        {isTyping && (
                                            <div className="flex items-end gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                    <Bot className="h-4 w-4 text-white" />
                                                </div>
                                                <div className="bg-white p-4 rounded-2xl rounded-bl-md border border-slate-200 shadow-sm">
                                                    <div className="flex gap-1">
                                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Enhanced Input */}
                                    <div className="p-6 bg-white border-t border-slate-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <input
                                                type="text"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Ask about your health..."
                                                className="flex-1 p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-800 placeholder-slate-500"
                                            />
                                            <button className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all duration-200 hover:scale-105">
                                                <Mic className="h-5 w-5 text-slate-600" />
                                            </button>
                                            <button
                                                onClick={handleSendMessage}
                                                className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg"
                                            >
                                                <Send className="h-5 w-5 text-white" />
                                            </button>
                                        </div>

                                        {/* Quick questions */}
                                        <div className="flex flex-wrap gap-2">
                                            {quickQuestions.map((question, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setInputValue(question)}
                                                    className="px-3 py-2 text-xs bg-slate-100 text-slate-600 rounded-full hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 hover:text-slate-800 transition-all duration-200"
                                                >
                                                    {question}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Features */}
                    <div
                        //   ref={featuresRef}
                        className="space-y-8">
                        <div className="feature-item bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                                    <Sparkles className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Instant AI Analysis</h3>
                                    <p className="text-slate-600">Get immediate health insights</p>
                                </div>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                                Our advanced AI processes your symptoms and provides personalized recommendations in seconds,
                                backed by medical knowledge and clinical guidelines.
                            </p>
                        </div>

                        <div className="feature-item bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-teal-500 rounded-2xl flex items-center justify-center">
                                    <MessageCircle className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Natural Conversation</h3>
                                    <p className="text-slate-600">Chat like with a real doctor</p>
                                </div>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                                Experience natural, empathetic conversations in your preferred language.
                                Our AI understands context and provides thoughtful, personalized responses.
                            </p>
                        </div>

                        <div className="feature-item bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center">
                                    <Bot className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">24/7 Availability</h3>
                                    <p className="text-slate-600">Always here when you need us</p>
                                </div>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                                Access healthcare guidance anytime, anywhere. No appointments needed,
                                no waiting rooms - just instant, reliable health support.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Floating Chat Button */}
                <div className="fixed bottom-8 right-8 z-50">
                    <button
                        ref={chatButtonRef}
                        onClick={() => setIsOpen(!isOpen)}
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white p-5 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                        <div className="relative">
                            {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
                        </div>
                    </button>
                </div>

                {/* Enhanced Floating Chat Widget */}
                {isOpen && (
                    <div className="fixed bottom-28 right-8 w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 z-40 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 p-6 text-white rounded-t-3xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                            <div className="relative">
                                <h3 className="font-bold text-lg">Quick Health Chat</h3>
                                <p className="text-sm text-white/90">Try our AI assistant now</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl mb-6 border border-blue-100">
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    Hi! I'm Aroygyam. I can help with symptoms, health questions,
                                    and provide personalized guidance. What's on your mind?
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Type your health question..."
                                    className="flex-1 p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800 placeholder-slate-500"
                                />
                                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg">
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DemoWidget2;