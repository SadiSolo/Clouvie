import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Target, Users, TrendingUp, Sparkles } from 'lucide-react';

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>About Clouvie | Revenue Optimization Platform</title>
        <meta
          name="description"
          content="Learn how Clouvie helps small and medium businesses use AI-driven pricing, forecasting, and inventory intelligence without needing a data science team."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      {/* Navigation Header */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-full border border-gray-200 px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left side: Logo and nav links */}
            <div className="flex items-center gap-10">
              <a href="/" className="flex items-center">
                <img src="/logo.png" alt="Clouvie" className="h-4 w-full" />
              </a>
              <div className="hidden md:flex items-center gap-8">
                <a 
                  href="/#features" 
                  className="text-gray-700 hover:text-[#8B1538] font-medium transition-colors text-base"
                >
                  Features
                </a>
                <a 
                  href="/#pricing" 
                  className="text-gray-700 hover:text-[#8B1538] font-medium transition-colors text-base"
                >
                  Pricing
                </a>
              </div>
            </div>

            {/* Right side: CTA buttons */}
            <div className="flex items-center gap-4">
              <a
                href="/dashboard"
                className="px-6 py-2.5 bg-gradient-to-r from-[#8B1538] to-[#A51A3F] text-white rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Try Demo
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Built for businesses,<br />
            <span className="text-[#8B1538]">powered by AI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The story behind the platform that helps you optimize yours
          </p>
        </div>
      </section>

      {/* What is Clouvie Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">What is Clouvie?</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Clouvie is an AI-powered revenue optimization platform that helps small and medium businesses make data-driven pricing, forecasting, and inventory decisions—without needing data scientists or expensive consultants.
          </p>
          <p className="text-xl text-gray-700 leading-relaxed">
            Upload your CSV, and Clouvie transforms your data into actionable insights. No technical know-how required. No complex integrations. Just results.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gradient-to-br from-[#8B1538] to-[#6B0F2A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
          <p className="text-2xl leading-relaxed font-light">
            At Clouvie, our mission is to democratize revenue intelligence. We believe every business deserves access to enterprise-grade optimization tools, not just Fortune 500 companies. We've created a space where optimizing revenue is as simple as connecting your data.
          </p>
        </div>
      </section>

      {/* Founding Story Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Story Header */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">It started with my own frustration</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              I was running my own retail brand, and pricing felt like throwing darts blindfolded. <em>Am I charging too much? Too little? How much money am I leaving on the table?</em>
            </p>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              I looked everywhere for answers. LLM tools? Wrong calculations. Prediction software? Either too expensive or completely inaccurate. And when I tried to simulate different scenarios before launching a campaign—forget it. Too many unpredictable market variables.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed font-semibold">
              That's when it hit me: <span className="text-[#8B1538]">If big companies have tools for this, why can't we?</span>
            </p>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet the Team</h2>
            
            {/* Founder */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img
                  src="/Asif.png"
                  alt="Asif Hasan"
                  className="w-48 h-48 rounded-full object-cover flex-shrink-0 shadow-lg"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Asif Hasan</h3>
                  <p className="text-gray-600 mb-4 font-semibold">Founder & CEO</p>
                  <p className="text-gray-700 leading-relaxed">
                    {/* TODO: Add short description about Asif's background and role */}
                    Leading the vision to democratize revenue intelligence for small businesses everywhere.
                  </p>
                </div>
              </div>
            </div>

            {/* Co-Founders Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Co-Founder 1 */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex flex-col items-center text-center">
                  <img
                    src="/Tanmoy.png"
                    alt="Tanmoy Dewanjee"
                    className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Tanmoy Dewanjee</h3>
                  <p className="text-gray-600 mb-4 font-semibold">Co-Founder & CTO</p>
                  <p className="text-gray-700 leading-relaxed">
                    {/* TODO: Add short description about Tanmoy's background and role */}
                    Building the technology that powers intelligent pricing decisions.
                  </p>
                </div>
              </div>

              {/* Co-Founder 2 */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex flex-col items-center text-center">
                  <img
                    src="/Nafis.png"
                    alt="Nafis-Al-Sayeed"
                    className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Nafis-Al-Sayeed</h3>
                  <p className="text-gray-600 mb-4 font-semibold">Co-Founder & COO</p>
                  <p className="text-gray-700 leading-relaxed">
                    {/* TODO: Add short description about Nafis's background and role */}
                    Ensuring businesses get actionable insights that drive real growth.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Problem Section */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">I wasn't alone in this struggle</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              I started talking to other business owners. Turns out, we were all fighting the same battle.
            </p>
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-[#8B1538]">
              <p className="text-2xl font-bold text-[#8B1538] mb-4">
                SMEs globally lose $1.2 trillion every year
              </p>
              <p className="text-xl text-gray-700">
                Because of wrong pricing and lack of insights. The tools that could help? Way too expensive for entrepreneurs like us.
              </p>
            </div>
            <p className="text-xl text-gray-700 leading-relaxed mt-6">
              That didn't sit right with me.
            </p>
          </div>

          {/* Solution Section */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">So I decided to build what we needed</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              With my co-founders Tanmoy Dewanjee and Nafis-Al-Sayeed, we built Clouvie. Enterprise-grade revenue optimization—at a price that makes sense for small businesses.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              No technical know-how required. No complex integrations. Just upload your CSV file, and Clouvie does its magic.
            </p>
            <div className="bg-gradient-to-r from-[#8B1538] to-[#A51A3F] text-white rounded-2xl p-8 text-center">
              <p className="text-3xl font-bold mb-2">Your own Chief Revenue Officer.</p>
              <p className="text-2xl">On autopilot.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Power Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Data gives you power</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            I believe that when you have data in your hands, you make better decisions. And better decisions mean more wins for your business.
          </p>
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            That's what we're building Clouvie for. To give every entrepreneur the same competitive advantage the big players have.
          </p>
          <p className="text-2xl font-bold text-[#8B1538]">
            More power to you. More wins for you.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">What drives us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8B1538] to-[#A51A3F] rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Simplicity</h3>
              <p className="text-gray-700">
                Complex problems deserve simple solutions. We strip away the complexity so you can focus on what matters.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-700">
                We're constantly pushing boundaries to bring enterprise-level AI capabilities to businesses of all sizes.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Success</h3>
              <p className="text-gray-700">
                Your wins are our wins. Every feature we build is designed to help you make better decisions and grow faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#8B1538] to-[#6B0F2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Join us on this journey
          </h2>
          <p className="text-2xl text-white/90 mb-6">
            We're democratizing data intelligence, one small business at a time.
          </p>
          <p className="text-xl text-white/80 mb-12">
            Try Clouvie today. See what you've been missing. I welcome you to join us on this journey to data democracy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-white text-[#8B1538] rounded-xl font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              Try the Demo
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="/#waitlist"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all inline-flex items-center justify-center"
            >
              Join Waitlist
            </a>
          </div>

          <div className="pt-12 border-t border-white/20">
            <p className="text-white/90 text-lg italic mb-2">
              — Asif Hasan
            </p>
            <p className="text-white/70">
              Just another entrepreneur like you
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">&copy; 2026 Clouvie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
