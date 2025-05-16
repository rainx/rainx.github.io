# Section

## Section template

### Title

For example: Story Section Hello World

### Filename

Using kebab case for file name

Component: story-section-hello-world.component.tsx
CSS module: story-section-hello-world.module.css

### Component

```TypeScript
import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollSection } from '../hooks/use-scroll-section';
import styles from './story-section-hello-world.module.css';

export function StorySectionHelloWorld() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScrollSection(sectionRef, wrapperRef);

  return (
    <AnimatePresence>
      <motion.section className={styles.wrapperSection} ref={wrapperRef}>
        <motion.section className={styles.section} ref={sectionRef}>
          <div className={styles.sectionScene}>
            <div className={styles.sectionTypographyLayer}>
            </div>
            <div className={styles.sectionSpriteLayer}>
            </div>
            <div className={styles.sectionBackgroundLayer}>
            </div>
          </div>
        </motion.section>
      </motion.section>
    </AnimatePresence>
  );
}
```

### CSS

```css
.wrapperSection {
  height: 400vh;
  position: relative;
  background-color: #fff;
}

.section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  top: 0;
}

.sectionScene {
  position: relative;
  width: 100%;
  height: 100%;
}

.sectionTypographyLayer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.sectionSpriteLayer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.sectionBackgroundLayer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```
