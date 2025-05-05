import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import styles from './first-section.module.css';
import { Logo } from '../components/logo.component';

export function FirstSection() {
  const [isSeeMoreVisible, setIsSeeMoreVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsSeeMoreVisible(window.scrollY < 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <Logo />
      </header>
      <footer>
        <ul className={styles.footer}>
          <li>
            <a
              href="https://github.com/rainx"
              title="GitHub"
              className="github"
            >
              <i className="fa-brands fa-github" />
            </a>
          </li>
          <li>
            <a
              href="https://weibo.com/102068233"
              title="Weibo"
              className="weibo"
            >
              <i className="fa-brands fa-weibo" />
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/rainx"
              title="𝕏 - Twitter"
              className="twitter"
            >
              <i className="fa-brands fa-x-twitter" />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/jing-xu-rainx"
              title="Linked In"
              className="linked-in"
            >
              <i className="fa-brands fa-linkedin-in" />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/rainx1982/"
              title="Instagram"
              className="instagram"
            >
              <i className="fa-brands fa-instagram" />
            </a>
          </li>
          <li>
            <a
              href="https://unsplash.com/@rainx1982"
              title="Unsplash"
              className="unsplash"
            >
              <i className="fa-brands fa-unsplash" />
            </a>
          </li>
        </ul>
      </footer>

      <AnimatePresence>
        {isSeeMoreVisible && (
          <motion.h2
            className={styles.seeMore}
            initial={{ opacity: 1 }}
            animate={{ opacity: isSeeMoreVisible ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            Scroll down to get to know me{' '}
            <motion.span
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }}
            >
              ↓
            </motion.span>
          </motion.h2>
        )}
      </AnimatePresence>
    </section>
  );
}
