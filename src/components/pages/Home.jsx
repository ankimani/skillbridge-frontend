import React, { useEffect, useState } from 'react';
import Footer from '../../features/shared/Footer';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  DollarSign, 
  MessageCircle, 
  Users, 
  GraduationCap, 
  UserCircle, 
  ArrowRight, 
  Star, 
  Award, 
  Briefcase,
  CheckCircle,
  Zap,
  Shield,
  Globe,
  Clock,
  TrendingUp,
  Heart,
  BookOpen,
  Lightbulb,
  Target,
  Rocket,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Add custom styles for animations
  const gradientAnimation = `
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient {
      background-size: 200% 200%;
      animation: gradient 3s ease infinite;
    }
  `;

  return (
    <>
      <style>{gradientAnimation}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="relative pt-12 pb-12 lg:pt-20 lg:pb-16">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Trust Badge */}
              <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full text-blue-700 text-base font-semibold mb-6 shadow-lg backdrop-blur-sm transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Sparkles className="w-5 h-5 mr-2 text-blue-500 animate-pulse" />
                Trusted by 50,000+ students & professionals worldwide
              </div>
              
              {/* Main Heading */}
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="block mb-4">Where Expertise Meets</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient">
                  Opportunity
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className={`text-lg lg:text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                SkillBridge revolutionizes how students connect with expert professionals. 
                Our innovative coin-based system ensures quality connections while building a sustainable platform for learning and growth.
              </p>
              
              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <Link 
                  to="/register" 
                  className="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-10 py-4 rounded-2xl font-bold text-base shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  Start Your Journey - Free
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link 
                  to="/how-it-works" 
                  className="px-10 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-600 rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  See How It Works
                </Link>
              </div>

              {/* Quick Stats */}
              <div className={`mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {[
                  { number: "50K+", label: "Active Users", icon: Users },
                  { number: "95%", label: "Success Rate", icon: Star },
                  { number: "24/7", label: "Support", icon: Clock }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl mb-3 mx-auto">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      {/* Features Section */}
      <div className="py-8 lg:py-16 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">SkillBridge</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the future of professional networking with our cutting-edge platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* For Professionals */}
            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-100 hover:border-blue-200 transform hover:-translate-y-2">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  For <span className="text-blue-600">Professionals</span>
                </h3>
                <p className="text-base text-gray-600 mb-6">
                  Build your client base and grow your practice with our innovative platform
                </p>
              </div>
              <ul className="space-y-4 text-gray-700 text-base">
                {[
                  "Showcase your expertise to a global audience",
                  "Use coins to initiate contact with potential clients",
                  "Negotiate terms directly with students",
                  "Build a sustainable practice with recurring clients"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start group/item">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 group-hover/item:scale-110 transition-transform" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link 
                  to="/register" 
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Join as Professional
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
            
            {/* For Students */}
            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-purple-100 hover:border-purple-200 transform hover:-translate-y-2">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  For <span className="text-purple-600">Students</span>
                </h3>
                <p className="text-base text-gray-600 mb-6">
                  Access expert help and accelerate your learning journey
                </p>
              </div>
              <ul className="space-y-4 text-gray-700 text-base">
                {[
                  "Find vetted professionals for your specific needs",
                  "Purchase coins to maintain platform quality",
                  "Connect directly with experts who can help you succeed",
                  "Get personalized guidance and mentorship"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start group/item">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 group-hover/item:scale-110 transition-transform" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link 
                  to="/register" 
                  className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                >
                  Join as Student
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-8 lg:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">SkillBridge</span> Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our innovative three-step process connects expertise with opportunity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: <UserPlus className="w-10 h-10 text-white" />,
                bg: "bg-gradient-to-br from-blue-500 to-blue-600",
                title: "1. Create Your Profile",
                description: "Join as a professional or student in minutes with our streamlined onboarding process"
              },
              {
                icon: <DollarSign className="w-10 h-10 text-white" />,
                bg: "bg-gradient-to-br from-purple-500 to-purple-600",
                title: "2. Get Coins",
                description: "Students purchase coins to contact professionals and maintain platform quality"
              },
              {
                icon: <MessageCircle className="w-10 h-10 text-white" />,
                bg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
                title: "3. Connect & Succeed",
                description: "Professionals use coins to respond and start meaningful conversations"
              }
            ].map((item, index) => (
              <div key={index} className={`${item.bg} p-8 rounded-3xl text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 group`}>
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">{item.title}</h3>
                <p className="text-base text-center leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Coin System Explanation */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-200 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Sustainable Coin System</h3>
              <p className="text-base text-gray-600 leading-relaxed max-w-4xl mx-auto">
                Coins are used to initiate contact between professionals and students. 
                This revenue model funds platform operations, ensuring we can continue providing 
                this valuable service while maintaining high quality standards for both professionals and students.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="py-8 lg:py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Success <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Stories</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real transformations from students and professionals who found success through SkillBridge
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Success */}
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Student Achievements</h3>
              </div>
              
              {[
                {
                  name: "Alex Chen, Computer Science",
                  quote: "I was struggling with advanced algorithms until I connected with a senior developer through SkillBridge. The personalized guidance helped me not only pass but excel in my course.",
                  benefit: "Achieved A+ in Advanced Algorithms",
                  avatar: "AC"
                },
                {
                  name: "Sarah Johnson, MBA Candidate",
                  quote: "The business strategy consultant I found helped me craft a winning case competition presentation. We won the national competition!",
                  benefit: "Won National Case Competition",
                  avatar: "SJ"
                }
              ].map((testimonial, index) => (
                <div key={`student-${index}`} className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{testimonial.name}</h4>
                      <div className="flex items-center text-purple-600 font-semibold text-sm">
                        <Award className="w-4 h-4 mr-2" />
                        {testimonial.benefit}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>

            {/* Professional Success */}
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-4">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Professional Growth</h3>
              </div>
              
              {[
                {
                  name: "Dr. Maria Rodriguez, Math Tutor",
                  quote: "SkillBridge helped me transition from classroom teaching to full-time tutoring. I now have a thriving practice with over 50 regular students.",
                  benefit: "Built 50+ Student Client Base",
                  avatar: "MR"
                },
                {
                  name: "Dr. James Lee, Research Consultant",
                  quote: "I've guided 12 students through successful thesis defenses using SkillBridge. The platform's quality control ensures meaningful connections.",
                  benefit: "100% Thesis Success Rate",
                  avatar: "JL"
                }
              ].map((testimonial, index) => (
                <div key={`pro-${index}`} className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{testimonial.name}</h4>
                      <div className="flex items-center text-blue-600 font-semibold text-sm">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {testimonial.benefit}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { number: "50,000+", label: "Active Members", icon: Users, color: "from-blue-500 to-blue-600" },
              { number: "100,000+", label: "Hours of Guidance", icon: Clock, color: "from-purple-500 to-purple-600" },
              { number: "95%", label: "Satisfaction Rate", icon: Heart, color: "from-green-500 to-green-600" },
              { number: "5,000+", label: "Successful Projects", icon: Target, color: "from-indigo-500 to-indigo-600" }
            ].map((stat, index) => (
              <div key={index} className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className={`text-3xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-2`}>{stat.number}</p>
                <p className="text-gray-600 text-base font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-8 lg:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Platform <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to succeed in your learning or professional journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Shield,
                title: "Verified Professionals",
                description: "All professionals are thoroughly vetted and background-checked for your safety"
              },
              {
                icon: Globe,
                title: "Global Network",
                description: "Connect with experts from around the world, breaking geographical barriers"
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                description: "Access help whenever you need it, with professionals available around the clock"
              },
              {
                icon: MessageCircle,
                title: "Direct Communication",
                description: "Chat directly with professionals through our secure messaging system"
              },
              {
                icon: BookOpen,
                title: "Specialized Expertise",
                description: "Find experts in any field, from academic subjects to professional skills"
              },
              {
                icon: Rocket,
                title: "Fast Results",
                description: "Get quick responses and see results faster than traditional methods"
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-8 lg:py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Future?
          </h2>
          <p className="text-lg lg:text-xl mb-8 max-w-4xl mx-auto opacity-90">
            Join thousands of students and professionals who are already succeeding with SkillBridge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="group bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 rounded-2xl font-bold text-base shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Briefcase className="w-5 h-5 mr-3" />
              Join as Professional
            </Link>
            <Link 
              to="/register" 
              className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-10 py-4 rounded-2xl font-bold text-base shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <GraduationCap className="w-5 h-5 mr-3" />
              Get Expert Help
            </Link>
          </div>
          <p className="mt-6 text-blue-100 text-base">
            Start your journey today - it's completely free to join!
          </p>
        </div>
      </div>

      <Footer />
      </div>
    </>
  );
}