import React from 'react';
import Footer from '../shared/Footer';
import { Link } from 'react-router-dom';
import { UserPlus, DollarSign, MessageCircle, Users, GraduationCap, UserCircle, ArrowRight, Star, Award, Briefcase } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-base font-medium mb-8 shadow-sm">
              <Star className="w-5 h-5 mr-2 text-blue-500" />
              Trusted by 10,000+ students & professionals
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="block mb-6">The Professional Network That</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Connects Expertise with Need
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              SkillBridge enables professionals to find clients and students to access expert help through our innovative coin-based system.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link 
                to="/register" 
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
              >
                Join Now - It's Free
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/how-it-works" 
                className="px-10 py-4 bg-white border border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 rounded-lg font-semibold text-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-blue-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            <div className="bg-white p-10 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-100">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-lg mb-6">
                  <Briefcase className="w-7 h-7 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  For Professionals: <span className="text-blue-600">Find Clients & Build Your Practice</span>
                </h2>
              </div>
              <ul className="space-y-5 text-gray-700 text-lg">
                <li className="flex items-start">
                  <Briefcase className="w-6 h-6 text-blue-500 mr-4 mt-1" />
                  <span>Showcase your expertise to potential clients</span>
                </li>
                <li className="flex items-start">
                  <Users className="w-6 h-6 text-blue-500 mr-4 mt-1" />
                  <span>Use coins to initiate contact with students needing your services</span>
                </li>
                <li className="flex items-start">
                  <DollarSign className="w-6 h-6 text-blue-500 mr-4 mt-1" />
                  <span>Negotiate service terms directly with clients</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-10 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-indigo-100">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-lg mb-6">
                  <GraduationCap className="w-7 h-7 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  For Students: <span className="text-indigo-600">Access Expert Help</span>
                </h2>
              </div>
              <ul className="space-y-5 text-gray-700 text-lg">
                <li className="flex items-start">
                  <GraduationCap className="w-6 h-6 text-indigo-500 mr-4 mt-1" />
                  <span>Find vetted professionals for your specific needs</span>
                </li>
                <li className="flex items-start">
                  <DollarSign className="w-6 h-6 text-indigo-500 mr-4 mt-1" />
                  <span>Purchase coins to maintain the platform and contact professionals</span>
                </li>
                <li className="flex items-start">
                  <MessageCircle className="w-6 h-6 text-indigo-500 mr-4 mt-1" />
                  <span>Connect directly with experts who can help you succeed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              The SkillBridge System
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our coin system funds platform operations while connecting professionals with clients
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <UserPlus className="w-10 h-10 text-white" />,
                bg: 'bg-blue-600',
                title: '1. Create Account',
                description: 'Join as a professional or student in minutes'
              },
              {
                icon: <DollarSign className="w-10 h-10 text-white" />,
                bg: 'bg-indigo-600',
                title: '2. Get Coins',
                description: 'Students purchase coins to contact professionals'
              },
              {
                icon: <MessageCircle className="w-10 h-10 text-white" />,
                bg: 'bg-blue-700',
                title: '3. Connect & Engage',
                description: 'Professionals use coins to respond and start conversations'
              }
            ].map((item, index) => (
              <div key={index} className={`${item.bg} p-10 rounded-xl text-white shadow-md hover:shadow-lg transition-shadow duration-300`}>
                <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center mb-6 mx-auto">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-center">{item.title}</h3>
                <p className="text-lg text-center">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-xl p-10 border border-blue-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">About Our Coin System</h3>
            <p className="text-lg text-gray-600 text-center">
              Coins are used to initiate contact between professionals and students. 
              The revenue from coin purchases funds platform operations, ensuring we can continue providing 
              this valuable service to both professionals and students.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How SkillBridge Transformed Learning & Careers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from students who found expert help and professionals who grew their practice
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Student Testimonials */}
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <GraduationCap className="w-8 h-8 text-indigo-600 mr-4" />
                <h3 className="text-2xl font-semibold text-gray-900">Student Success Stories</h3>
              </div>
              
              {[
                {
                  name: 'James, Computer Science Student',
                  quote: 'I was struggling with advanced algorithms until I connected with a senior developer through SkillBridge.',
                  benefit: 'Scored A+ in Algorithms course'
                },
                {
                  name: 'Emma, MBA Candidate',
                  quote: 'The business strategy consultant I found helped me craft a winning case competition presentation.',
                  benefit: 'Won national case competition'
                }
              ].map((testimonial, index) => (
                <div key={`student-${index}`} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <UserCircle className="w-8 h-8 text-indigo-600 mr-4" />
                    <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                  </div>
                  <p className="text-gray-700 mb-4 text-lg">"{testimonial.quote}"</p>
                  <div className="flex items-center text-base text-indigo-600 font-medium">
                    <Award className="w-5 h-5 mr-2" />
                    {testimonial.benefit}
                  </div>
                </div>
              ))}
            </div>

            {/* Professional Testimonials */}
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <Briefcase className="w-8 h-8 text-blue-600 mr-4" />
                <h3 className="text-2xl font-semibold text-gray-900">Professional Achievements</h3>
              </div>
              
              {[
                {
                  name: 'Sarah, Math Tutor',
                  quote: 'SkillBridge helped me transition from classroom teaching to full-time tutoring.',
                  benefit: 'Built 50+ student client base'
                },
                {
                  name: 'Dr. Lee, Research Consultant',
                  quote: "I've guided 12 students through successful thesis defenses using SkillBridge.",
                  benefit: '100% thesis success rate'
                }
              ].map((testimonial, index) => (
                <div key={`pro-${index}`} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <UserCircle className="w-8 h-8 text-blue-600 mr-4" />
                    <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                  </div>
                  <p className="text-gray-700 mb-4 text-lg">"{testimonial.quote}"</p>
                  <div className="flex items-center text-base text-blue-600 font-medium">
                    <DollarSign className="w-5 h-5 mr-2" />
                    {testimonial.benefit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: '10,000+', label: 'Active Members', color: 'text-blue-600' },
              { number: '50,000+', label: 'Hours of Guidance', color: 'text-indigo-600' },
              { number: '95%', label: 'Satisfaction Rate', color: 'text-blue-600' },
              { number: '2,000+', label: 'Successful Projects', color: 'text-indigo-600' }
            ].map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <p className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.number}</p>
                <p className="text-gray-600 text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Join SkillBridge?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Connect with clients or find expert help through our sustainable platform
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              I'm a Professional
            </Link>
            <Link 
              to="/register" 
              className="bg-indigo-800 hover:bg-indigo-900 text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              I Need Expert Help
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}