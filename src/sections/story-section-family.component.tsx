import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValueEvent } from 'motion/react';
import styles from './story-section-family.module.css';
import 'sakana-widget/lib/index.css';
import SakanaWidget, { type SakanaWidgetCharacter } from 'sakana-widget';
import { SakanaWidget as SakanaWidgetComponent } from 'sakana-widget-react';
import jingImage from '../assets/story-section-dad-jing.webp';
import janeImage from '../assets/story-section-daughter-jane.webp';
import titikakaImage from '../assets/story-section-mom-titikaka.webp';
import { ScreenHelpers } from '../helpers/screen-helpers';
import { useScrollSection } from '../hooks/use-scroll-section';

enum FamilyStage {
  STAGE_1 = 'STAGE_1',
  STAGE_2 = 'STAGE_2',
  STAGE_3 = 'STAGE_3',
}

const STAGE_3_TEXT = '';

// register sakana widget members
const sakanaWidgetMembers = [
  {
    name: 'Jing',
    image: jingImage,
  },
  {
    name: 'Titikaka',
    image: titikakaImage,
  },
  {
    name: 'Jane',
    image: janeImage,
  },
];

// You must call this function to get the character before set the characters
SakanaWidget.getCharacter('takina');

sakanaWidgetMembers.map((member) => {
  const character: SakanaWidgetCharacter = {
    image: member.image,
    initialState: {
      i: 0.08,
      s: 0.1,
      d: 0.988,
      r: 12,
      y: 2,
      t: 0,
      w: 0,
    },
  };
  return SakanaWidget.registerCharacter(member.name, character);
});

export function StorySectionFamily() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScrollSection(sectionRef, wrapperRef);

  const [currentStage, setCurrentStage] = useState<FamilyStage>(
    FamilyStage.STAGE_1,
  );
  const [typewriterText, setTypewriterText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.33) {
      setCurrentStage(FamilyStage.STAGE_1);
    } else if (latest < 0.66) {
      setCurrentStage(FamilyStage.STAGE_2);
    } else {
      setCurrentStage(FamilyStage.STAGE_3);
    }
  });

  return (
    <AnimatePresence>
      <motion.section className={styles.wrapperSection} ref={wrapperRef}>
        <motion.section className={styles.section} ref={sectionRef}>
          <div className={styles.sectionScene}>
            <div className={styles.sectionTypographyLayer}>
              <motion.h2
                initial={{ opacity: 0, y: '10vh' }}
                whileInView={{ opacity: 1, y: '0vh' }}
                transition={{
                  duration: 1,
                  ease: 'easeInOut',
                }}
              >
                My family
              </motion.h2>
              <p>
                <AnimatePresence>
                  {[FamilyStage.STAGE_2, FamilyStage.STAGE_3].includes(
                    currentStage,
                  ) && (
                    <motion.span
                      initial={{ opacity: 0, y: '5vh' }}
                      animate={{ opacity: 1, y: '0vh' }}
                      transition={{
                        duration: 1,
                        ease: 'easeInOut',
                      }}
                      key="stage-2"
                    >
                      I met and married my wife, Titikaka.{' '}
                    </motion.span>
                  )}
                  {currentStage === FamilyStage.STAGE_3 && (
                    <motion.span
                      initial={{ opacity: 0, y: '5vh' }}
                      animate={{ opacity: 1, y: '0vh' }}
                      transition={{
                        duration: 1,
                        ease: 'easeInOut',
                      }}
                      key="stage-3"
                    >
                      We welcomed the birth of our daughter, Jane, and we
                      accompanied her as she grew up.
                    </motion.span>
                  )}
                </AnimatePresence>
              </p>
            </div>
            <div className={styles.sectionSpriteLayer}>
              {/* Sprite layer will be added later */}
              <div className={styles.sakanaWidgetWrapper}>
                {[
                  FamilyStage.STAGE_1,
                  FamilyStage.STAGE_2,
                  FamilyStage.STAGE_3,
                ].includes(currentStage) && (
                  <SakanaWidgetComponent
                    options={{
                      title: true,
                      character: 'Jing',
                      size: ScreenHelpers.getPixelByVh(50),
                    }}
                  />
                )}
                {[FamilyStage.STAGE_2, FamilyStage.STAGE_3].includes(
                  currentStage,
                ) && (
                  <SakanaWidgetComponent
                    options={{
                      title: true,
                      character: 'Titikaka',
                      size: ScreenHelpers.getPixelByVh(50),
                    }}
                  />
                )}
                {currentStage === FamilyStage.STAGE_3 && (
                  <SakanaWidgetComponent
                    options={{
                      title: true,
                      character: 'Jane',
                      size: ScreenHelpers.getPixelByVh(50),
                    }}
                  />
                )}
              </div>
            </div>
            <div className={styles.sectionBackgroundLayer} />
          </div>
        </motion.section>
      </motion.section>
    </AnimatePresence>
  );
}
