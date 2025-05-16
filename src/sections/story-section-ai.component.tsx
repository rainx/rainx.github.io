import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './story-section-ai.module.css';
import { useScrollSection } from '../hooks/use-scroll-section';

export function StorySectionAI() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useScrollSection(sectionRef, wrapperRef);

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
      </motion.section>
    </AnimatePresence>
  );
}

export default StorySectionAI;
