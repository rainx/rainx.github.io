import { motion, useMotionValueEvent, useTransform } from 'motion/react';
import { useRef } from 'react';

import hometownImage from '../assets/story-section-hometown.webp';
import hometownImageBaby from '../assets/story-section-hometown-baby.webp';
import { useScrollSection } from '../hooks/use-scroll-section';
import styles from './story-section-hometown.module.css';

export function StorySectionHometown() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hometownImageRef = useRef<HTMLImageElement>(null);
  const bubbleWrapperRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
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

  const sectionHeadingX = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 1],
    ['-50%', '-50%', '0%', '0%'],
  );

  const sectionHeadingY = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 1],
    ['-50%', '-50%', '0%', '0%'],
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

  useMotionValueEvent(sectionImageOpacity, 'change', (latest) => {
    if (hometownImageRef.current) {
      hometownImageRef.current.style.opacity = String(latest);
    }
  });

  useMotionValueEvent(sectionSpeechBubbleOpacity, 'change', (latest) => {
    if (bubbleWrapperRef.current) {
      bubbleWrapperRef.current.style.opacity = String(latest);
    }
  });

  useMotionValueEvent(sectionParagraphOpacity, 'change', (latest) => {
    if (paragraphRef.current) {
      paragraphRef.current.style.opacity = String(latest);
    }
  });

  return (
    <motion.section
      className={styles.wrapperSection}
      ref={wrapperRef}
      id="hometown"
    >
      <motion.section className={styles.section} ref={sectionRef}>
        <div className={styles.sectionScene}>
          <div className={styles.sectionTypographyLayer}>
            <motion.h2
              style={{
                opacity: 1,
                left: sectionHeadingLeft,
                top: sectionHeadingTop,
                x: sectionHeadingX,
                y: sectionHeadingY,
              }}
            >
              Hometown
            </motion.h2>
            <motion.p
              ref={paragraphRef}
              style={{
                left: '10vw',
                opacity: 0,
                top: sectionParagraphTop,
              }}
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
              ref={bubbleWrapperRef}
              style={{
                opacity: 0,
              }}
            >
              <motion.div
                className={styles.speechBubble}
                animate={{ rotate: [10, -10] }}
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
              ref={hometownImageRef}
              className={styles.hometownImage}
              src={hometownImage}
              alt="Home Town"
              style={{
                width: sectionImageWidth,
                opacity: 0,
              }}
            />
          </div>
          <div className={styles.sectionBackgroundLayer} />
        </div>
      </motion.section>
    </motion.section>
  );
}
