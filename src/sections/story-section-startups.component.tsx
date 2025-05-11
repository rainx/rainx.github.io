import { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent } from 'motion/react';
import styles from './story-section-startups.module.css';
import { useScrollSection } from '../hooks/use-scroll-section';

const DOTS = [
  { left: 365, top: 480 },
  { left: 375, top: 476 },
  { left: 385, top: 472 },
];

export function StorySectionStartups() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScrollSection(sectionRef, wrapperRef);

  const [currentStage, setCurrentStage] = useState<number>(0);

  const getDotColor = (index: number) => {
    const progress = scrollYProgress.get();
    const threshold = (index + 1) * 0.33; // 33%, 66%, 100%
    return progress >= threshold ? '#FF4012' : 'white';
  };

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.33) {
      setCurrentStage(0);
    } else if (latest < 0.66) {
      setCurrentStage(1);
    } else {
      setCurrentStage(2);
    }
  });

  return (
    <AnimatePresence>
      <motion.section className={styles.wrapperSection} ref={wrapperRef}>
        <motion.section className={styles.section} ref={sectionRef}>
          <div className={styles.sectionScene}>
            <div className={styles.sectionTypographyLayer}>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{
                  duration: 1,
                  ease: 'easeInOut',
                }}
              >
                Worked in startups
              </motion.h2>
              <AnimatePresence mode="wait">
                {currentStage === 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: '5vh' }}
                    animate={{ opacity: 1, y: '0vh' }}
                    exit={{ opacity: 0, y: '-5vh' }}
                    transition={{
                      duration: 1,
                      ease: 'easeInOut',
                    }}
                    key="stage-1"
                  >
                    Towards the end of 2010, I left Alibaba Group and joined the
                    boom of the mobile internet industry.
                  </motion.p>
                )}
                {currentStage === 1 && (
                  <motion.p
                    initial={{ opacity: 0, y: '5vh' }}
                    animate={{ opacity: 1, y: '0vh' }}
                    exit={{ opacity: 0, y: '-5vh' }}
                    transition={{
                      duration: 1,
                      ease: 'easeInOut',
                    }}
                    key="stage-2"
                  >
                    I researched and developed a Python project on quantitative
                    trading, which was (once) well-known by many people. (In
                    fact, I intended to learn Python development through this
                    project)
                  </motion.p>
                )}
                {currentStage === 2 && (
                  <motion.p
                    initial={{ opacity: 0, y: '5vh' }}
                    animate={{ opacity: 1, y: '0vh' }}
                    exit={{ opacity: 0, y: '-5vh' }}
                    transition={{
                      duration: 1,
                      ease: 'easeInOut',
                    }}
                    key="stage-3"
                  >
                    I joined the startup company RightCapital and continued my
                    career in the fintech industry.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className={styles.sectionSpriteLayer}>
              <motion.div
                className={styles.startupBackgroundWrapper}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{
                  duration: 1,
                  ease: 'easeInOut',
                }}
                exit={{ opacity: 0 }}
              >
                {DOTS.map((dot, index) => (
                  <motion.div
                    key={`dot-${dot.left}-${dot.top}`}
                    style={{
                      position: 'absolute',
                      width: '2px',
                      height: '2px',
                      backgroundColor: getDotColor(index),
                      borderRadius: '50%',
                      left: `calc(${dot.left} / 1024 * 100%)`,
                      top: `calc(${dot.top} / 1024 * 100%)`,
                      zIndex: 3,
                    }}
                    animate={{
                      backgroundColor: getDotColor(index),
                    }}
                    transition={{
                      duration: 0.3,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </motion.div>
            </div>
            <div className={styles.sectionBackgroundLayer} />
          </div>
        </motion.section>
      </motion.section>
    </AnimatePresence>
  );
}
