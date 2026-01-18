const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const getWindowSize = () => {
  if (typeof window === "undefined") {
    // SSR fallback
    return { width: 1440, height: 900 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const normalizeX = (size: number) => {
  const { width } = getWindowSize();
  return Math.round((width / guidelineBaseWidth) * size);
};

export const normalizeY = (size: number) => {
  const { height } = getWindowSize();
  return Math.round((height / guidelineBaseHeight) * size);
};
