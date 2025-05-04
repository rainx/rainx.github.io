import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollSection } from '../hooks/use-scroll-section';
import styles from './story-section-basic.module.css';
import basicSprite from '../assets/story-section-basic.png';
import basicSpriteLight from '../assets/story-section-basic-light.svg';

export function StorySectionBasic() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScrollSection(sectionRef, wrapperRef);

  return (
    <AnimatePresence>
      <motion.section className={styles.wrapperSection} ref={wrapperRef}>
        <motion.section className={styles.section} ref={sectionRef}>
          <div className={styles.sectionScene}>
            <div className={styles.sectionTypographyLayer}>
              <h2>It started with BASIC</h2>
              <p>
                As a primary school student, I started my programming career by
                using a machine with a 6502 chip and running BASIC.
              </p>
            </div>
            <div className={styles.sectionSpriteLayer}>
              <motion.div
                className={styles.screenSpriteWrapper}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 1,
                  ease: 'easeInOut',
                }}
              >
                <motion.div
                  className={styles.screenLightSprite}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 1,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                ></motion.div>
                <code>
                  10 REM BASIC PROGRAM
                  <br />
                  20 DIM A$(10)
                  <br />
                  30 FOR I=1 TO 10
                  <br />
                  40 A$(I)=CHR$(78+I)
                  <br />
                  50 NEXT I
                  <br />
                  60 PRINT "Hello, Rain" + A$(10)
                  <br />
                  70 END
                  <br />
                  <motion.span
                    style={{ fontWeight: 'bold' }}
                    initial={{ color: '#fff' }}
                    animate={{ color: '#ddd' }}
                    transition={{
                      duration: 1,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatType: 'loop',
                    }}
                  >
                    ▌
                  </motion.span>
                </code>
                <footer>
                  <ul>
                    <li>
                      <a>Help</a>
                    </li>
                    <li>
                      <a>Copy to clipboard</a>
                    </li>
                    <li>
                      <a>Run it</a>
                    </li>
                  </ul>
                </footer>
              </motion.div>
              <motion.div className={styles.basicSpriteWrapper}>
                <a
                  href="https://www.computinghistory.org.uk/det/69155/CEC-I-China-Education-Computer/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.img
                    className={styles.basicSpriteLight}
                    src={basicSpriteLight}
                    alt="BASIC"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: 'loop',
                      ease: 'easeInOut',
                    }}
                  />
                </a>
                <img
                  className={styles.basicSprite}
                  src={basicSprite}
                  alt="BASIC"
                />
              </motion.div>
            </div>
            <div className={styles.sectionBackgroundLayer}></div>
          </div>
        </motion.section>
      </motion.section>
    </AnimatePresence>
  );
}
