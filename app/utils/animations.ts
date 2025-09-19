// Enhanced animation utilities for improved UI animations
import { Variants } from "framer-motion";

// Easing curves for smoother animations
export const easing = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
  anticipate: [0.6, -0.28, 0.735, 0.045],
  custom: [0.4, 0, 0.2, 1],
} as const;

// Enhanced spring configurations
export const springConfig = {
  gentle: {
    type: "spring" as const,
    stiffness: 120,
    damping: 14,
    mass: 1,
  },
  bouncy: {
    type: "spring" as const,
    stiffness: 200,
    damping: 10,
    mass: 0.8,
  },
  snappy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25,
    mass: 0.5,
  },
  fluid: {
    type: "spring" as const,
    stiffness: 100,
    damping: 15,
    mass: 1.2,
  },
} as const;

// Enhanced animation variants
export const fadeInUpVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 60,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: easing.smooth,
    }
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: easing.smooth,
    }
  }
};

export const fadeInLeftVariants: Variants = {
  initial: { 
    opacity: 0, 
    x: -80,
    rotateY: -15
  },
  animate: { 
    opacity: 1, 
    x: 0,
    rotateY: 0,
    transition: springConfig.gentle
  }
};

export const fadeInRightVariants: Variants = {
  initial: { 
    opacity: 0, 
    x: 80,
    rotateY: 15
  },
  animate: { 
    opacity: 1, 
    x: 0,
    rotateY: 0,
    transition: springConfig.gentle
  }
};

export const scaleInVariants: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.8,
    rotateZ: -5
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    rotateZ: 0,
    transition: springConfig.bouncy
  }
};

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};

export const staggerItemVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 40,
    scale: 0.9
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      ...springConfig.gentle,
      duration: 0.6
    }
  }
};

// Enhanced hover animations
export const buttonHoverVariants: Variants = {
  initial: { 
    scale: 1,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  },
  hover: { 
    scale: 1.05,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: springConfig.snappy
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

export const cardHoverVariants: Variants = {
  initial: { 
    y: 0,
    scale: 1,
    rotateX: 0,
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
  },
  hover: { 
    y: -8,
    scale: 1.02,
    rotateX: 5,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: springConfig.gentle
  }
};

// Loading animations
export const loadingSpinVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Page transition animations
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easing.smooth
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    transition: {
      duration: 0.4,
      ease: easing.smooth
    }
  }
};

// Decorative line animations
export const lineGrowVariants: Variants = {
  initial: { width: 0, opacity: 0 },
  animate: { 
    width: "100%", 
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: easing.smooth,
      delay: 0.5
    }
  }
};

// Text reveal animations
export const textRevealVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)"
  },
  animate: {
    opacity: 1,
    y: 0,
    clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
    transition: {
      duration: 0.8,
      ease: easing.smooth
    }
  }
};

// Floating animation for decorative elements
export const floatingVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};