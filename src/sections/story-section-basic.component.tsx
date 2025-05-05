import { useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useMediaQuery } from '@uidotdev/usehooks';
import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValueEvent,
} from 'motion/react';
import styles from './story-section-basic.module.css';
import basicSpriteLight from '../assets/story-section-basic-light.svg';
import basicSprite from '../assets/story-section-basic.png';
import { useScrollSection } from '../hooks/use-scroll-section';

const BASIC_PROGRAM = `
10 REM BASIC PROGRAM
20 DIM A$(10)
30 FOR I=1 TO 10
40 A$(I)=CHR$(78+I)
50 NEXT I
60 PRINT "Hello, Rain" + A$(10)
70 END`;

const BASIC_PROGRAM_LENGTH = BASIC_PROGRAM.length;

const BASIC_PROGRAM_OUTPUT = `
Hello, RainX
`;

/**
 * Animation Storybook
 *
 * 1. Section heading fade in, delay 0, duration 1
 * 2. Section paragraph fade and slide up, delay 0.8, duration 1
 * 3. Section sprite layer fade in, whileInView (amount 0.8), opacity 0 -> 1
 * 4. BASIC program output fade in and slide left,
 * 5. Typing code animation with scroll linked progress
 */

export function StorySectionBasic() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const isAspectRatioLowerThan16By9 = useMediaQuery('(max-aspect-ratio: 16/9)');
  const { scrollYProgress } = useScrollSection(sectionRef, wrapperRef);
  const [isBasicSpriteVisible, setIsBasicSpriteVisible] =
    useState<boolean>(true);
  const [isScreenSpriteVisible, setIsScreenSpriteVisible] =
    useState<boolean>(true);

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

  const [typingCodeToDisplay, setTypingCodeToDisplay] = useState<string>('');

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // for the narrower screen, we will hide the basic sprite and show the screen sprite when the progress is larger than 0.3, and then hide the screen sprite and show the basic sprite when the progress is less than 0.3
    if (isAspectRatioLowerThan16By9) {
      if (latest > 0.3) {
        setIsBasicSpriteVisible(false);
        setIsScreenSpriteVisible(true);
      } else {
        setIsBasicSpriteVisible(true);
        setIsScreenSpriteVisible(false);
      }
    } else {
      setIsBasicSpriteVisible(true);
      setIsScreenSpriteVisible(true);
    }
  });

  useMotionValueEvent(typingProgress, 'change', (latest) => {
    const partialCode = BASIC_PROGRAM.slice(
      0,
      Math.round(BASIC_PROGRAM_LENGTH * latest),
    );

    setTypingCodeToDisplay(partialCode);
  });

  const codeToDisplay: string = useMemo(() => {
    return isRunning ? BASIC_PROGRAM_OUTPUT : typingCodeToDisplay;
  }, [isRunning, typingCodeToDisplay]);

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
                It started with BASIC
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
                As a primary school student, I started my programming career by
                using a machine with a 6502 chip and running BASIC.
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
                    display: isScreenSpriteVisible ? 'block' : 'none',
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
                  <code>
                    <motion.span style={{ fontWeight: 'bold' }}>
                      {codeToDisplay}
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
                          href="https://www.calormen.com/jsbasic/"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Online BASIC emulator"
                        >
                          <i className="fa-solid fa-square-arrow-up-right" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="http://cini.classiccmp.org/pdf/Apple/Apple%20II%20Basic%20Programming%20Manual.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Apple II Basic Programming Manual"
                        >
                          <i className="fa-solid fa-book" />
                        </a>
                      </li>
                      <li>
                        <a
                          role="button"
                          tabIndex={0}
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onClick={async () => {
                            await navigator.clipboard.writeText(BASIC_PROGRAM);
                            toast.success(
                              <span>
                                Copied to clipboard, paste it into this{' '}
                                <a
                                  href="https://www.calormen.com/jsbasic/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Online BASIC emulator"
                                >
                                  online BASIC emulator
                                </a>
                              </span>,
                            );
                          }}
                        >
                          <i className="fa-solid fa-copy" />
                        </a>
                      </li>
                    </ul>
                  </footer>
                </motion.div>
                <motion.div
                  className={styles.basicSpriteWrapper}
                  style={{
                    display: isBasicSpriteVisible ? 'block' : 'none',
                  }}
                >
                  <a
                    href="https://www.computinghistory.org.uk/det/69155/CEC-I-China-Education-Computer/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="CEC-I China Education Computer"
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
              </AnimatePresence>
            </motion.div>
            <div className={styles.sectionBackgroundLayer} />
          </div>
        </motion.section>
      </motion.section>
    </AnimatePresence>
  );
}
