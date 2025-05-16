import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from 'motion/react';
import styles from './progress-indicator.module.css';

const STORY_SECTIONS = [
  { id: 'hometown', label: 'Hometown' },
  { id: 'basic', label: 'Basic' },
  { id: 'turbo-c', label: 'Turbo C' },
  { id: 'work-experience', label: 'Work Experience' },
  { id: 'startups', label: 'Startups' },
  { id: 'family', label: 'Family' },
  { id: 'hobbies', label: 'Hobbies' },
  { id: 'ai', label: 'AI' },
];

export function ProgressIndicator() {
  const progress = useMotionValue(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressPercentage = useTransform(() => `${progress.get()}%`);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      const isNearBottom = documentHeight - scrollTop <= 10;

      if (scrollTop > 10 && !isNearBottom) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      const currentProgress = (scrollTop / documentHeight) * 100;
      progress.set(Math.min(100, Math.max(0, currentProgress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [progress]);

  const handleSectionClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
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
              {STORY_SECTIONS.map((section, index) => {
                const percentage = (index / (STORY_SECTIONS.length - 1)) * 100;
                return (
                  <button
                    type="button"
                    key={section.id}
                    className={styles.marker}
                    style={{ left: `${percentage}%` }}
                    onClick={() => handleSectionClick(section.id)}
                    aria-label={`Jump to ${section.label} section`}
                    data-tooltip-id="tooltip"
                    data-tooltip-content={section.label}
                  />
                );
              })}
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
