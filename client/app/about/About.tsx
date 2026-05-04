'use client';
import React from "react";
import { Sparkles, Video, Wand2, Users, Award, Target } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-32 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">About Us</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Meet the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600">
              Creative Minds
            </span>
            {" "}Behind BB Edits
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Two brothers united by passion, creativity, and the art of visual storytelling. 
            Together, we're transforming the way aspiring editors learn and grow.
          </p>
        </div>

        {/* Founders Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Anil Card */}
          <div className="group bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-black/40 backdrop-blur-md border border-purple-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(147,51,234,0.2)] hover:shadow-[0_0_60px_rgba(147,51,234,0.3)] transition-all duration-500">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 p-1 shadow-[0_0_40px_rgba(147,51,234,0.5)]">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <Video className="w-20 h-20 text-purple-400" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full p-3 shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600">
                Anil
              </h3>
              <p className="text-purple-300 font-semibold mb-4 text-lg">Premiere Pro Expert</p>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full mb-6"></div>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                Master video editor with years of experience in Adobe Premiere Pro. Anil specializes in 
                creating cinematic narratives, advanced color grading, and professional editing workflows. 
                His passion for storytelling through video has helped hundreds of students transform their 
                editing skills from basic cuts to professional productions.
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm">
                  Premiere Pro
                </span>
                <span className="px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm">
                  Color Grading
                </span>
                <span className="px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm">
                  Storytelling
                </span>
              </div>
            </div>
          </div>

          {/* Hemanth Card */}
          <div className="group bg-gradient-to-br from-violet-900/20 via-violet-800/10 to-black/40 backdrop-blur-md border border-violet-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.2)] hover:shadow-[0_0_60px_rgba(139,92,246,0.3)] transition-all duration-500">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 p-1 shadow-[0_0_40px_rgba(139,92,246,0.5)]">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <Wand2 className="w-20 h-20 text-violet-400" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full p-3 shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-600">
                Hemanth
              </h3>
              <p className="text-violet-300 font-semibold mb-4 text-lg">After Effects Specialist</p>
              <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full mb-6"></div>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                Creative motion graphics designer and visual effects artist extraordinaire. Hemanth brings 
                magic to every frame with After Effects, mastering everything from kinetic typography to 
                complex compositing. His brother to Anil, they form an unstoppable creative duo that delivers 
                comprehensive video editing education covering both editing and motion graphics.
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-4 py-2 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm">
                  After Effects
                </span>
                <span className="px-4 py-2 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm">
                  Motion Graphics
                </span>
                <span className="px-4 py-2 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm">
                  VFX
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BB Edits Story */}
        <div className="bg-gradient-to-br from-purple-900/20 via-black/40 to-violet-900/20 backdrop-blur-md border border-purple-500/20 rounded-3xl p-10 sm:p-12 lg:p-16 shadow-[0_0_60px_rgba(147,51,234,0.15)] mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600">
                BB Edits
              </span>
              {" "}Story
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full mx-auto mb-8"></div>
          </div>
          
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
            <p>
              BB Edits was born from a simple yet powerful vision: to democratize professional video editing 
              education and make it accessible to aspiring creators worldwide. What started as two brothers 
              sharing their passion for video editing has evolved into a thriving learning platform that 
              empowers thousands of students.
            </p>
            
            <p>
              Combining Anil&apos;s expertise in Premiere Pro with Hemanth&apos;s mastery of After Effects, 
              BB Edits offers a comprehensive learning experience that covers the entire spectrum of modern 
              video production. From basic cuts to Hollywood-level visual effects, our courses are designed 
              to take you from beginner to professional.
            </p>
            
            <p>
              We believe that financial constraints should never stand between talent and opportunity. 
              That&apos;s why our courses are priced affordably, ensuring that anyone with passion and 
              dedication can access world-class video editing education. Our community-driven approach 
              means you&apos;re not just learning skills—you&apos;re joining a family of creators who support 
              and inspire each other.
            </p>
            
            <p className="text-purple-300 font-semibold text-xl">
              Join us on this incredible journey and discover the editor within you. Together, let&apos;s 
              create stories that captivate, inspire, and leave a lasting impact.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-900/10 via-black/50 to-black/80 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed">
              To provide accessible, high-quality video editing education that transforms passionate 
              beginners into professional content creators.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/10 via-black/50 to-black/80 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Community First</h3>
            <p className="text-gray-400 leading-relaxed">
              We&apos;re more than a platform—we&apos;re a supportive family of creators helping each 
              other grow, learn, and succeed together.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/10 via-black/50 to-black/80 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 transition-all duration-300 group sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Innovation</h3>
            <p className="text-gray-400 leading-relaxed">
              Staying ahead with the latest AI tools, cutting-edge techniques, and industry-standard 
              practices to give you a competitive edge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
