export class ElementHelpers {
  static isVisibleInViewportVertically(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const innerHeight =
      window.innerHeight || document.documentElement.clientHeight;
    return rect.top <= innerHeight && rect.bottom >= 0;
  }
}
