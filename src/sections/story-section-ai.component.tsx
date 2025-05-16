import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './story-section-ai.module.css';

export function StorySectionAI() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      <motion.section className={styles.wrapperSection} ref={wrapperRef}>
        <motion.section className={styles.section} ref={sectionRef}>
          <div className={styles.sectionScene}>
            <div className={styles.sectionTypographyLayer}>
              <h1 className={styles.title}>♾️</h1>
              <p className={styles.description}>
                I am collaborating with AI to accomplish the dreams and goals I
                haven&apos;t yet achieved.
              </p>
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
