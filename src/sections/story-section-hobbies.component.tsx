import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValueEvent } from 'motion/react';
import styles from './story-section-hobbies.module.css';
import hobbyBasket from '../assets/hobby-basket.webp';
import hobbyCycling from '../assets/hobby-cycling.webp';
import hobbyKpop from '../assets/hobby-kpop.webp';
import hobbyPingpong from '../assets/hobby-pingpong.webp';
import { useScrollSection } from '../hooks/use-scroll-section';

interface IHobbyCard {
  id: number;
  name: string;
  description: string;
  backgroundColor: string;
  image: string;
}

const hobbies: IHobbyCard[] = [
  {
    id: 1,
    name: 'K-pop',
    description:
      "🎵 I am into K-pop culture. I like K-pop girl groups like NewJeans, BLACKPINK, i-dle, ive, aespa, LE SSERAFIM, Twice, Girls Generation, Red Velvet, F(x), miss A, Kara, T-ara, AOA, Girl's Day, Apink, Sistar, 2NE1, 4Minute, Crayon Pop, ILLIT, SES, Fin.K.L, Baby V.O.X, and more.",
    backgroundColor: '#F7F2ED',
    image: hobbyKpop,
  },
  {
    id: 2,
    name: 'Cycling',
    description:
      '🚲 It took 12 days for me to ride from Beijing to Hangzhou, covering a distance of approximately 1400km.',
    backgroundColor: '#F7F2E9',
    image: hobbyCycling,
  },
  {
    id: 3,
    name: 'Basketball',
    description:
      '🏀 I really enjoy watching the NBA as a way to relax, and I occasionally play basketball with my friends as well.',
    backgroundColor: '#F7F3ED',
    image: hobbyBasket,
  },
  {
    id: 4,
    name: 'Pingpong',
    description:
      '🏓 I am practicing table tennis and, despite my limited skill, I thoroughly enjoy playing it.',
    backgroundColor: '#F5F1ED',
    image: hobbyPingpong,
  },
];

const StorySectionHobbies: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScrollSection(sectionRef, wrapperRef);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | undefined>(undefined);

  const activeHobby = hobbies.find(
    (hobby) => hobby.id === (hoveredCard ?? selectedCard),
  );

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest >= 0 && latest < 0.375) {
      setHoveredCard(1);
    } else if (latest >= 0.375 && latest < 0.5) {
      setHoveredCard(2);
    } else if (latest >= 0.5 && latest < 0.625) {
      setHoveredCard(3);
    } else if (latest >= 0.625 && latest <= 0.75) {
      setHoveredCard(4);
    }
  });

  return (
    <AnimatePresence>
      <motion.section
        className={styles.wrapperSection}
        ref={wrapperRef}
        id="hobbies"
      >
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
                My hobbies
              </motion.h2>
              <AnimatePresence mode="wait">
                {activeHobby && (
                  <motion.p
                    key={activeHobby.id}
                    initial={{ opacity: 0, y: '5vh' }}
                    animate={{ opacity: 1, y: '0vh' }}
                    exit={{ opacity: 0, y: '-5vh' }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeInOut',
                    }}
                  >
                    {activeHobby.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className={styles.sectionSpriteLayer}>
              {hobbies.map((hobby, index) => (
                <motion.div
                  key={hobby.id}
                  className={`${styles.card} ${
                    selectedCard === hobby.id ? styles.selected : ''
                  }`}
                  style={
                    {
                      '--card-index': index,
                      '--total-cards': hobbies.length,
                      '--card-bg-color': hobby.backgroundColor,
                      '--card-z-index': index + 1,
                      '--card-hovered': hoveredCard === hobby.id ? 1 : 0,
                    } as React.CSSProperties
                  }
                  // onClick={() => setSelectedCard(hobby.id)}
                  onMouseEnter={() => setHoveredCard(hobby.id)}
                  onMouseLeave={() => setHoveredCard(undefined)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedCard(hobby.id);
                    }
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{
                    duration: 1,
                    delay: index * 0.2,
                    ease: 'easeInOut',
                  }}
                >
                  <div className={styles.cardContent}>
                    <img
                      src={hobby.image}
                      alt={hobby.name}
                      className={styles.cardImage}
                    />
                    <h3 className={styles.cardTitle}>{hobby.name}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className={styles.sectionBackgroundLayer} />
          </div>
        </motion.section>
      </motion.section>
    </AnimatePresence>
  );
};

export default StorySectionHobbies;
