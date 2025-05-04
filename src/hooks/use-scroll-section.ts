import { useMotionValue, useMotionValueEvent, useScroll } from 'motion/react';
import { RefObject } from 'react';
import { ElementHelpers } from '../helpers/element-helpers';

export function useScrollSection(
  sectionRef: RefObject<HTMLDivElement>,
  wrapperRef: RefObject<HTMLDivElement>,
) {
  const isSectionFixed = useMotionValue<boolean>(true);
  const { scrollY, scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (sectionRef.current && wrapperRef.current) {
      if (!ElementHelpers.isVisibleInViewportVertically(wrapperRef.current)) {
        return;
      }

      const offsetY = latest * wrapperRef.current.clientHeight;

      const sectionHeight = sectionRef.current.clientHeight;
      const wrapperHeight = wrapperRef.current.clientHeight;
      // console.log(
      //   latest,
      //   offsetY,
      //   sectionHeight,
      //   wrapperHeight,
      //   offsetY >= 0 && offsetY < wrapperHeight - sectionHeight,
      // );
      if (offsetY > 0 && offsetY < wrapperHeight) {
        isSectionFixed.set(true);
        sectionRef.current.style.position = 'fixed';
        sectionRef.current.style.top = '0px';
      } else {
        isSectionFixed.set(false);
        sectionRef.current.style.position = 'absolute';
        if (offsetY >= wrapperHeight) {
          sectionRef.current.style.top = `${wrapperHeight - sectionHeight}px`;
        } else if (offsetY < 0) {
          sectionRef.current.style.top = '0px';
        }
      }
    }
  });

  return {
    isSectionFixed,
    scrollY,
    scrollYProgress,
  };
}
