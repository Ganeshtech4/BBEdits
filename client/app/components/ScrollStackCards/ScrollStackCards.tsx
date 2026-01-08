'use client';
import { ReactLenis } from 'lenis/react';
import { useTransform, motion, useScroll, MotionValue } from 'motion/react';
import { useRef } from 'react';
import Image from 'next/image';

// Use same cards data as before but adapted
const projects = [
  {
    title: 'Master Video Editing',
    description: 'Learn professional video editing techniques from industry experts',
    src: '/assets/img/hero/hero-bg.png', // Placeholder or use existing asset
    link: '#',
    color: '#1a1a2e', // Dark Purple/Blue
  },
  {
    title: 'Creative Effects',
    description: 'Create stunning visual effects and motion graphics',
    src: '/assets/img/hero/hero-bg.png',
    link: '#',
    color: '#4338ca', // Indigo
  },
  {
    title: 'Color Grading',
    description: 'Perfect your color grading skills for cinematic looks',
    src: '/assets/img/hero/hero-bg.png',
    link: '#',
    color: '#be185d', // Pink/Rose
  },
];

export default function ScrollStackCards(): JSX.Element {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <ReactLenis root>
      <main className='bg-black dark:bg-[#030014] w-full overflow-visible relative' ref={container}>
        <>
          <div className='text-white w-full bg-slate-950 pt-20'>
            {projects.map((project, i) => {
              const targetScale = 1 - (projects.length - i) * 0.05;
              return (
                <Card
                  key={`p_${i}`}
                  i={i}
                  url={project?.link}
                  src={project?.src}
                  title={project?.title}
                  color={project?.color}
                  description={project?.description}
                  progress={scrollYProgress}
                  range={[i * 0.25, 1]}
                  targetScale={targetScale}
                />
              );
            })}
          </div>
        </>
      </main>
    </ReactLenis>
  );
}

interface CardProps {
  i: number;
  title: string;
  description: string;
  src: string;
  url: string;
  color: string;
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
  color,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className='h-screen flex items-center justify-center sticky top-0 w-full overflow-hidden'
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(10vh + ${i * 25}px)`,
        }}
        className={`flex flex-col relative -top-[25%] h-[450px] w-[90%] md:w-[70%] rounded-3xl p-8 border border-white/10 shadow-2xl origin-top overflow-hidden`}
      >
        <h2 className='text-3xl md:text-4xl text-center font-bold mb-6'>{title}</h2>
        <div className={`flex flex-col md:flex-row h-full gap-8`}>
          <div className={`w-full md:w-[40%] flex flex-col justify-center`}>
            <p className='text-lg md:text-xl text-gray-200'>{description}</p>
            <span className='flex items-center gap-2 pt-6'>
              <a
                href={'#'}
                className='text-white border-b border-white pb-1 hover:text-purple-300 hover:border-purple-300 transition-colors cursor-pointer'
              >
                Learn more
              </a>
            </span>
          </div>

          <div
            className={`relative w-full md:w-[60%] h-[200px] md:h-full rounded-2xl overflow-hidden`}
          >
            <motion.div
              className={`w-full h-full`}
              style={{ scale: imageScale }}
            >
              {/* <Image fill src={src} alt='image' className='object-cover' /> */}
              <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
