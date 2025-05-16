import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './story-section-ai.module.css';
import { useScrollSection } from '../hooks/use-scroll-section';

export function StorySectionAI() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);

  useScrollSection(sectionRef, wrapperRef);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      setIsBackToTopVisible(documentHeight - scrollPosition < 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      <motion.section className={styles.wrapperSection} ref={wrapperRef}>
        <motion.section className={styles.section} ref={sectionRef}>
          <div className={styles.sectionScene}>
            <div className={styles.sectionTypographyLayer}>
              <motion.h2
                className={styles.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                ♾️
              </motion.h2>
              <motion.p
                className={styles.description}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              >
                I am collaborating with AI to accomplish the dreams and goals I
                haven&apos;t yet achieved.
              </motion.p>
            </div>
            <div className={styles.sectionSpriteLayer} />
            <div className={styles.sectionBackgroundLayer} />
          </div>
        </motion.section>

        <AnimatePresence>
          {isBackToTopVisible && (
            <motion.h2
              className={styles.backToTop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={scrollToTop}
              style={{ cursor: 'pointer' }}
            >
              Go back to the top{' '}
              <motion.span
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                }}
              >
                ↑
              </motion.span>
            </motion.h2>
          )}
        </AnimatePresence>
      </motion.section>
    </AnimatePresence>
  );
}

export default StorySectionAI;
