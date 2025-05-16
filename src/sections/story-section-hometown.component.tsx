import { useRef } from 'react';
import { AnimatePresence, motion, useTransform } from 'motion/react';
import styles from './story-section-hometown.module.css';
import hometownImageBaby from '../assets/story-section-hometown-baby.webp';
import hometownImage from '../assets/story-section-hometown.webp';
import { useScrollSection } from '../hooks/use-scroll-section';

export function StorySectionHometown() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScrollSection(sectionRef, wrapperRef);

  const sectionImageWidth = useTransform(
    scrollYProgress,
    [0, 0.3, 0.85, 1],
    ['60vw', '60vw', '80vw', '80vw'],
  );

  const sectionImageOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 0, 1, 1],
  );

  const sectionHeadingTransform = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 1],
    [
      'translate(-50%, -50%)',
      'translate(-50%, -50%)',
      'translate(0%, 0%)',
      'translate(0%, 0%)',
    ],
  );

  const sectionHeadingLeft = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    ['50vw', '50vw', '10vw', '10vw'],
  );

  const sectionHeadingTop = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    ['50vh', '50vh', '0vh', '0vh'],
  );

  const sectionParagraphTop = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    ['40vw', '40vw', '20vh', '20vh'],
  );

  const sectionParagraphOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 0, 1, 1],
  );

  const sectionSpeechBubbleOpacity = useTransform(
    scrollYProgress,
    [0, 0, 0.7, 0.8, 1],
    [0, 0, 0, 1, 1],
  );

  return (
    <AnimatePresence>
      <motion.section
        className={styles.wrapperSection}
        ref={wrapperRef}
        id="hometown"
      >
        <motion.section className={styles.section} ref={sectionRef}>
          <div className={styles.sectionScene}>
            <div className={styles.sectionTypographyLayer}>
              <motion.h2
                initial={{
                  opacity: 1,
                  left: '50vw',
                  top: '50vh',
                  transform: 'translate(-50%, -50%)',
                }}
                style={{
                  opacity: 1,
                  left: sectionHeadingLeft,
                  top: sectionHeadingTop,
                  transform: sectionHeadingTransform,
                }}
                exit={{ opacity: 0 }}
              >
                Hometown
              </motion.h2>
              <motion.p
                initial={{
                  left: '10vw',
                  top: '40vh',
                }}
                style={{
                  opacity: sectionParagraphOpacity,
                  top: sectionParagraphTop,
                }}
                exit={{ opacity: 0 }}
              >
                I was born in Shanhaiguan, a beautiful coastal town in China,
                where the Great Wall meets the sea. It&apos;s a charming place
                nestled between mountains and ocean, offering a comfortable and
                peaceful way of life.
              </motion.p>
            </div>
            <div className={styles.sectionSpriteLayer}>
              <motion.div
                className={styles.bubbleWrapper}
                style={{
                  opacity: sectionSpeechBubbleOpacity,
                }}
              >
                <motion.div
                  className={styles.speechBubble}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [10, -10] }}
                  exit={{ rotate: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                >
                  <motion.img
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Jing Xu (RainX)"
                    src={hometownImageBaby}
                    alt="Home Town Baby"
                    className={styles.speechBubbleImage}
                  />
                </motion.div>
              </motion.div>

              <motion.img
                className={styles.hometownImage}
                src={hometownImage}
                alt="Home Town"
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
                style={{
                  width: sectionImageWidth,
                  opacity: sectionImageOpacity,
                }}
              />
            </div>
            <div className={styles.sectionBackgroundLayer} />
          </div>
        </motion.section>
      </motion.section>
    </AnimatePresence>
  );
}
