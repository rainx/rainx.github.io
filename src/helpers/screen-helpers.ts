export class ScreenHelpers {
  static getPixelByVh(percent: number) {
    const h = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0,
    );
    return (percent * h) / 100;
  }

  static getPixelByVw(percent: number) {
    const w = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0,
    );
    return (percent * w) / 100;
  }
}
