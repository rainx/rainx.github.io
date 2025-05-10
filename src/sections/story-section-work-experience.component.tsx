import { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValueEvent,
} from 'motion/react';
import styles from './story-section-work-experience.module.css';
import alibabaLogoOnWall from '../assets/alibaba-logo-on-wall.png';
import workOfficeBackground from '../assets/story-section-work-office-background.png';
import yahooLogoOnWall from '../assets/yahoo-logo-on-wall.png';
import { useScrollSection } from '../hooks/use-scroll-section';

const DOTS = [
  { left: 365, top: 480 },
  { left: 375, top: 476 },
  { left: 385, top: 472 },
  { left: 395, top: 468 },
  { left: 405, top: 464 },
];

export function StorySectionWorkExperience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScrollSection(sectionRef, wrapperRef);

  const [isYahooWordingVisible, setIsYahooWordingVisible] =
    useState<boolean>(true);
  const [isAlibabaWordingVisible, setIsAlibabaWordingVisible] =
    useState<boolean>(false);

  const getDotColor = (index: number) => {
    const progress = scrollYProgress.get();
    const threshold = (index + 1) * 0.2; // 20%, 40%, 60%, 80%, 100%
    return progress >= threshold ? '#FF4012' : 'white';
  };

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.2) {
      setIsYahooWordingVisible(false);
      setIsAlibabaWordingVisible(false);
    } else if (latest < 0.6) {
      setIsYahooWordingVisible(true);
      setIsAlibabaWordingVisible(false);
    } else {
      setIsYahooWordingVisible(false);
      setIsAlibabaWordingVisible(true);
    }
  });

  const yahooLogoX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.5, 0.6, 1],
    [
      '26.37%', // calc(270 / 1024 * 100%)
      '26.37%', // calc(114 / 1024 * 100%)
      '18.75%', // calc(114 / 1024 * 100%)
      '18.75%', // calc(114 / 1024 * 100%)
      '11.13%', // calc(114 / 1024 * 100%)
      '11.13%', // calc(114 / 1024 * 100%)
    ],
  );

  const yahooLogoY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.5, 0.6, 1],
    [
      '13.3%', // calc(133 / 1024 * 100%)
      '13.3%', // calc(133 / 1024 * 100%)
      '18.1%',
      '18.1%',
      '22.9%', // calc(229 / 1024 * 100%)
      '22.9%', // calc(229 / 1024 * 100%)
    ],
  );

  const alibabaLogoX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.6, 0.7, 0.9, 1],
    [
      '31.25%', // calc(319 / 1024 * 100%)
      '31.25%', // calc(319 / 1024 * 100%)
      '31.25%', // calc(319 / 1024 * 100%)
      '21.19%', //
      '21.19%', //
      '21.19%', // calc(114 / 1024 * 100%)
    ],
  );

  const alibabaLogoY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.6, 0.7, 0.9, 1],
    [
      '16.6%', // calc(166 / 1024 * 100%)
      '16.6%', // calc(166 / 1024 * 100%)
      '16.6%', // calc(166 / 1024 * 100%)
      '21.48%',
      '21.48%',
      '21.48%', // calc(266 / 1024 * 100%)
    ],
  );

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
                Worked at{' '}
                {!isYahooWordingVisible && !isAlibabaWordingVisible && (
                  <motion.span>...</motion.span>
                )}
                {isYahooWordingVisible && (
                  <motion.span
                    initial={{ opacity: 0, y: '0.5em' }}
                    animate={{ opacity: 1, y: '0' }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    className={styles.workCompanyYahoo}
                    key="yahoo"
                  >
                    Yahoo!
                  </motion.span>
                )}
                {isAlibabaWordingVisible && (
                  <motion.span
                    initial={{ opacity: 0, y: '0.5em' }}
                    animate={{ opacity: 1, y: '0' }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    className={styles.workCompanyAlibaba}
                    key="alibaba"
                  >
                    Alibaba
                  </motion.span>
                )}
              </motion.h2>
              <AnimatePresence>
                {isYahooWordingVisible && (
                  <motion.p
                    initial={{ opacity: 0, y: '5vh' }}
                    animate={{ opacity: 1, y: '0vh' }}
                    transition={{
                      duration: 1,
                      ease: 'easeInOut',
                    }}
                    key="yahoo-work-experience"
                  >
                    As a graduate, I joined Yahoo!, which was the largest
                    website in the world at that time (2004).
                  </motion.p>
                )}
                {isAlibabaWordingVisible && (
                  <motion.p
                    initial={{ opacity: 0, y: '5vh' }}
                    animate={{ opacity: 1, y: '0vh' }}
                    transition={{
                      duration: 1,
                      ease: 'easeInOut',
                    }}
                    key="alibaba-work-experience"
                  >
                    I worked for Alibaba Group, which is the largest e-commerce
                    website in China.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className={styles.sectionSpriteLayer}>
              <motion.div
                className={styles.workOfficeBackgroundWrapper}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{
                  duration: 1,
                  ease: 'easeInOut',
                }}
                exit={{ opacity: 0 }}
              >
                <img
                  src={workOfficeBackground}
                  alt="Work Experience"
                  className={styles.workImage}
                />
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
                {isYahooWordingVisible && (
                  <motion.img
                    layout
                    src={yahooLogoOnWall}
                    alt="Yahoo Logo"
                    className={styles.workCompanyLogoYahoo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ left: yahooLogoX, top: yahooLogoY }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                  />
                )}
                {isAlibabaWordingVisible && (
                  <motion.img
                    src={alibabaLogoOnWall}
                    alt="Alibaba Logo"
                    className={styles.workCompanyLogoAlibaba}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ left: alibabaLogoX, top: alibabaLogoY }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                  />
                )}
              </motion.div>
            </div>
            <div className={styles.sectionBackgroundLayer} />
          </div>
        </motion.section>
      </motion.section>
    </AnimatePresence>
  );
}
