'use client';
import { useTransform, motion, useScroll, MotionValue } from 'motion/react';
import { useRef } from 'react';
import Image from 'next/image';

// Use same cards data as before but adapted
const projects = [
  {
    title: 'Premiere Pro',
    description: 'Master Adobe Premiere Pro with our comprehensive course designed for aspiring video editors and content creators. Learn professional video editing techniques, advanced workflows, and industry-standard practices to create stunning videos. Dive deep into color correction, audio mixing, multi-cam editing, and advanced effects. Whether you\'re creating content for YouTube, films, or corporate videos, this course covers everything from basic cuts to complex storytelling techniques. Build a strong foundation and develop the skills needed to compete in the professional video editing industry.',
    src: '/home/cards/pr.png',
    link: '#',
  },
  {
    title: 'AI in Editing',
    description: 'Harness the power of cutting-edge AI tools in video editing to revolutionize your workflow and creativity. Discover how artificial intelligence is transforming the editing landscape with automated color grading, intelligent object removal, smart reframing, and voice synthesis. Learn to integrate AI-powered plugins and tools that save hours of manual work while maintaining creative control. Explore auto-captioning, scene detection, content-aware fill, and neural filters that bring professional-grade results in a fraction of the time. Stay ahead of the curve and unlock new creative possibilities that were impossible just a few years ago.',
    src: '/home/cards/ai.jpg',
    link: '#',
  },
  {
    title: 'After Effects',
    description: 'Create breathtaking motion graphics and visual effects with Adobe After Effects, the industry standard for animation and compositing. Learn advanced techniques in kinetic typography, 3D camera tracking, rotoscoping, keying, and particle systems. Master the art of creating professional title sequences, logo animations, and complex visual effects that elevate your video projects to cinematic levels. Understand expression-based animation, motion tracking, and how to seamlessly integrate CG elements with live footage. From explainer videos to Hollywood-style effects, develop the skills to bring any creative vision to life with stunning motion graphics.',
    src: '/home/cards/ae.jpg',
    link: '#',
  },
];

export default function ScrollStackCards(): JSX.Element {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <main className='bg-black dark:bg-[#030014] w-full overflow-visible relative pt-6 sm:pt-12 md:pt-16 lg:pt-20' ref={container} style={{ contain: 'layout style paint' }}>
      <div className='text-white w-full bg-slate-950 pt-8'>
        {projects.map((project, i) => {
          const targetScale = 1 - (projects.length - i) * 0.05;
          return (
            <Card
              key={`p_${i}`}
              i={i}
              url={project?.link}
              src={project?.src}
              title={project?.title}
              description={project?.description}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </main>
  );
}

interface CardProps {
  i: number;
  title: string;
  description: string;
  src: string;
  url: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

export const Card: React.FC<CardProps> = ({
  i,
  title,
  description,
  src,
  url,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className='h-screen flex items-center justify-center sticky top-0 w-full overflow-hidden py-8 sm:py-10 md:py-12'
      style={{ contain: 'layout style paint', willChange: i < 2 ? 'transform' : 'auto' }}
    >
      <motion.div
        style={{
          scale,
          top: `calc(0vh + ${i * 25}px)`,
          transform: 'translateZ(0)',
        }}
        className={`flex flex-col h-auto min-h-[500px] sm:min-h-[550px] md:h-[600px] w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] xl:w-[70%] rounded-2xl sm:rounded-3xl pt-4 sm:pt-6 pb-6 sm:pb-8 md:pb-10 px-4 sm:px-6 md:px-8 
                    bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-black/40 
                    backdrop-blur-md border border-purple-500/30 
                    shadow-[0_0_40px_rgba(147,51,234,0.3)] 
                    origin-top overflow-hidden`}
      >
        <div className={`flex flex-col md:flex-row flex-1 gap-4 sm:gap-6 md:gap-8`}>
          <div
            className={`relative w-full md:w-[50%] h-[200px] sm:h-[250px] md:h-full rounded-xl sm:rounded-2xl overflow-hidden`}
          >
            <div className={`w-full h-full`}>
              <Image fill src={src} alt={title} className='object-cover' />
            </div>
          </div>

          <div className={`w-full md:w-[50%] flex flex-col justify-start md:justify-center gap-3 sm:gap-4 md:gap-5 py-2`}>
            <div className="flex justify-start">
              <button className="px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 bg-purple-600/80 hover:bg-purple-600 rounded-full text-white font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg">
                {title}
              </button>
            </div>
            <p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed'>{description}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
