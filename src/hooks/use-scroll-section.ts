import type { RefObject } from 'react';
import { useMotionValue, useMotionValueEvent, useScroll } from 'motion/react';
import { ElementHelpers } from '../helpers/element-helpers';

export function useScrollSection(
  sectionRef: RefObject<HTMLDivElement>,
  wrapperRef: RefObject<HTMLDivElement>,
) {
  const isSectionFixed = useMotionValue<boolean>(true);
  const isInView = useMotionValue<boolean>(false);
  const { scrollY, scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (sectionRef.current && wrapperRef.current) {
      if (!ElementHelpers.isVisibleInViewportVertically(wrapperRef.current)) {
        isInView.set(false);
        return;
      }

      isInView.set(true);
      const offsetY = latest * wrapperRef.current.clientHeight;

      const sectionHeight = sectionRef.current.clientHeight;
      const wrapperHeight = wrapperRef.current.clientHeight;

      if (offsetY > 0 && offsetY < wrapperHeight) {
        isSectionFixed.set(true);
        // eslint-disable-next-line no-param-reassign
        sectionRef.current.style.position = 'fixed';
        // eslint-disable-next-line no-param-reassign
        sectionRef.current.style.top = '0px';
      } else {
        isSectionFixed.set(false);
        // eslint-disable-next-line no-param-reassign
        sectionRef.current.style.position = 'absolute';
        if (offsetY >= wrapperHeight) {
          // eslint-disable-next-line no-param-reassign
          sectionRef.current.style.top = `${wrapperHeight - sectionHeight}px`;
        } else if (offsetY < 0) {
          // eslint-disable-next-line no-param-reassign
          sectionRef.current.style.top = '0px';
        }
      }
    }
  });

  return {
    isSectionFixed,
    scrollY,
    scrollYProgress,
    isInView,
  };
}
