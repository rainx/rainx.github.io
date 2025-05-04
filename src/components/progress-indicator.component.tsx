import { useEffect, useRef, useState } from 'react';
import styles from './progress-indicator.module.css';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from 'motion/react';

export function ProgressIndicator() {
  const progress = useMotionValue(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressPercentage = useTransform(() => progress.get() + '%');

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      if (scrollTop > 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      const currentProgress = (scrollTop / documentHeight) * 100;
      progress.set(Math.min(100, Math.max(0, currentProgress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (percentage: number) => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const targetScroll = (percentage / 100) * documentHeight;
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.container}
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: isVisible ? 0.1 : 0.5,
            delay: isVisible ? 0 : 0.5,
          }}
        >
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              style={{ width: progressPercentage }}
            />
            <div className={styles.markers}>
              {[0, 25, 50, 75, 100].map((marker) => (
                <button
                  type="button"
                  key={marker}
                  className={styles.marker}
                  style={{ left: `${marker}%` }}
                  onClick={() => handleClick(marker)}
                  aria-label={`Jump to ${marker}% of the page`}
                />
              ))}
            </div>
            <motion.div
              className={styles.indicator}
              style={{ left: progressPercentage }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
