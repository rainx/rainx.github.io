import { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent } from 'motion/react';
import styles from './story-section-startups.module.css';
import fintechImage from '../assets/story-section-startup-fintech.webp';
import mobileAppImage from '../assets/story-section-startup-mobile-app.webp';
import quantTradingImage from '../assets/story-section-startup-quant-trading.webp';
import { useScrollSection } from '../hooks/use-scroll-section';

enum StartupStage {
  MOBILE_INTERNET = 'MOBILE_INTERNET',
  QUANT_TRADING = 'QUANT_TRADING',
  FINTECH = 'FINTECH',
}

export function StorySectionStartups() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScrollSection(sectionRef, wrapperRef);

  const [currentStage, setCurrentStage] = useState<StartupStage>(
    StartupStage.MOBILE_INTERNET,
  );

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.33) {
      setCurrentStage(StartupStage.MOBILE_INTERNET);
    } else if (latest < 0.66) {
      setCurrentStage(StartupStage.QUANT_TRADING);
    } else {
      setCurrentStage(StartupStage.FINTECH);
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
                Worked in startups{' '}
                <AnimatePresence>
                  {currentStage === StartupStage.MOBILE_INTERNET && (
                    <motion.span
                      key="mobile-internet"
                      className={`${styles.subtitle} ${styles.mobileInternet}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      - Mobile internet
                    </motion.span>
                  )}
                  {currentStage === StartupStage.QUANT_TRADING && (
                    <motion.span
                      key="quant-trading"
                      className={`${styles.subtitle} ${styles.quantTrading}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      - Quantitative trading
                    </motion.span>
                  )}
                  {currentStage === StartupStage.FINTECH && (
                    <motion.span
                      key="fintech"
                      className={`${styles.subtitle} ${styles.fintech}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      - Fintech
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.h2>
              <AnimatePresence mode="wait">
                {currentStage === StartupStage.MOBILE_INTERNET && (
                  <motion.p
                    initial={{ opacity: 0, y: '5vh' }}
                    animate={{ opacity: 1, y: '0vh' }}
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
                {currentStage === StartupStage.QUANT_TRADING && (
                  <motion.p
                    initial={{ opacity: 0, y: '5vh' }}
                    animate={{ opacity: 1, y: '0vh' }}
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
                {currentStage === StartupStage.FINTECH && (
                  <motion.p
                    initial={{ opacity: 0, y: '5vh' }}
                    animate={{ opacity: 1, y: '0vh' }}
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
                <AnimatePresence mode="wait">
                  {currentStage === StartupStage.MOBILE_INTERNET && (
                    <motion.img
                      key="mobile-app"
                      src={mobileAppImage}
                      alt="Mobile App Development"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  {currentStage === StartupStage.QUANT_TRADING && (
                    <motion.img
                      key="quant-trading"
                      src={quantTradingImage}
                      alt="Quantitative Trading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  {currentStage === StartupStage.FINTECH && (
                    <motion.img
                      key="fintech"
                      src={fintechImage}
                      alt="Fintech"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
            <div className={styles.sectionBackgroundLayer} />
          </div>
        </motion.section>
      </motion.section>
    </AnimatePresence>
  );
}
