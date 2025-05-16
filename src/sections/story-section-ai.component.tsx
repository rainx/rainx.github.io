import { useEffect, useState } from 'react';
import styles from './story-section-ai.module.css';

export const StorySectionAI = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={styles.container} id="ai">
      <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
        <h1 className={styles.title}>♾️</h1>
        <p className={styles.description}>
          I am collaborating with AI to accomplish the dreams and goals I
          haven't yet achieved.
        </p>
      </div>
    </div>
  );
};

export default StorySectionAI;
