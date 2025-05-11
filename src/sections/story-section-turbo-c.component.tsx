import { useRef, useState } from 'react';
import { useMediaQuery } from '@uidotdev/usehooks';
import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValueEvent,
} from 'motion/react';
import styles from './story-section-turbo-c.module.css';
import turboCLightImage from '../assets/story-section-turbo-c-light.svg';
import turboCImage from '../assets/story-section-turbo-c.webp';
import { Tetris } from '../components/tetris.component';
import { useScrollSection } from '../hooks/use-scroll-section';

const TURBO_C_PROGRAM = `
#include <stdio.h>
#include <conio.h>

void ClearWindow()
{
	window(1,1,80,25);
	textbackground(BLACK);
	textcolor(LIGHTGRAY);
	clrscr();
}
`;

const TURBO_C_PROGRAM_LENGTH = TURBO_C_PROGRAM.length;

export function StorySectionTurboC() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isAspectRatioLowerThan16By9 = useMediaQuery('(max-aspect-ratio: 16/9)');
  const { scrollYProgress } = useScrollSection(sectionRef, wrapperRef);
  const [isTurboCSpriteVisible, setIsTurboCSpriteVisible] =
    useState<boolean>(true);
  const [isScreenSpriteVisible, setIsScreenSpriteVisible] =
    useState<boolean>(true);
  const [typingCodeToDisplay, setTypingCodeToDisplay] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const screenSpriteWrapperOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [0, 0, 1, 1],
  );

  const screenSpriteWrapperX = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    ['20vw', '20vw', '0vw', '0vw'],
  );

  const typingProgress = useTransform(
    scrollYProgress,
    [0, 0.6, 0.9, 1],
    [0, 0, 1, 1],
  );

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (isAspectRatioLowerThan16By9) {
      if (latest > 0.3) {
        setIsTurboCSpriteVisible(false);
        setIsScreenSpriteVisible(true);
      } else {
        setIsTurboCSpriteVisible(true);
        setIsScreenSpriteVisible(false);
      }
    } else {
      setIsTurboCSpriteVisible(true);
      setIsScreenSpriteVisible(true);
    }
  });

  useMotionValueEvent(typingProgress, 'change', (latest) => {
    const partialCode = TURBO_C_PROGRAM.slice(
      0,
      Math.round(TURBO_C_PROGRAM_LENGTH * latest),
    );

    setTypingCodeToDisplay(partialCode);
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
                exit={{ opacity: 0.5 }}
              >
                Wrote Tetris in Turbo C
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: '5vh' }}
                whileInView={{ opacity: 1, y: '0vh' }}
                transition={{
                  duration: 1,
                  delay: 0.2,
                  ease: 'easeInOut',
                }}
                exit={{ opacity: 0 }}
              >
                During my university years, I wrote a Tetris game using Turbo C
                2.0
              </motion.p>
            </div>
            <motion.div
              className={styles.sectionSpriteLayer}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ amount: 0.5 }}
              transition={{
                duration: 1,
                ease: 'easeInOut',
              }}
            >
              <AnimatePresence>
                <motion.div
                  className={styles.screenSpriteWrapper}
                  style={{
                    opacity: screenSpriteWrapperOpacity,
                    x: screenSpriteWrapperX,
                    display: isScreenSpriteVisible ? 'flex' : 'none',
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
                  />
                  {isRunning ? (
                    <Tetris />
                  ) : (
                    <code>
                      <motion.span style={{ fontWeight: 'bold' }}>
                        {typingCodeToDisplay}
                      </motion.span>
                      <motion.span
                        style={{ fontWeight: 'bold', paddingLeft: '0.2em' }}
                        initial={{ color: '#fff' }}
                        animate={{ color: '#ccc' }}
                        transition={{
                          duration: 0.3,
                          ease: 'easeInOut',
                          repeat: Infinity,
                          repeatType: 'loop',
                        }}
                      >
                        ▌
                      </motion.span>
                    </code>
                  )}
                  <footer>
                    <ul>
                      <li>
                        {isRunning ? (
                          <a
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              setIsRunning(false);
                            }}
                          >
                            <i className="fa-solid fa-stop" />
                          </a>
                        ) : (
                          <a
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              setIsRunning(true);
                            }}
                          >
                            <i className="fa-solid fa-play" />
                          </a>
                        )}
                      </li>
                      <li>
                        <a
                          href="https://winworldpc.com/product/borland-turbo-c/2x"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Turbo C 2.0 Reference Manual"
                        >
                          <i className="fa-solid fa-book" />
                        </a>
                      </li>
                    </ul>
                  </footer>
                </motion.div>
                <motion.div
                  className={styles.turboCSpriteWrapper}
                  style={{
                    display: isTurboCSpriteVisible ? 'block' : 'none',
                  }}
                >
                  <motion.img
                    className={styles.turboCSpriteLight}
                    src={turboCLightImage}
                    alt="Turbo C Light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: 'loop',
                      ease: 'easeInOut',
                    }}
                  />
                  <img
                    className={styles.turboCSprite}
                    src={turboCImage}
                    alt="Turbo C"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
            <div className={styles.sectionBackgroundLayer} />
          </div>
        </motion.section>
      </motion.section>
    </AnimatePresence>
  );
}
