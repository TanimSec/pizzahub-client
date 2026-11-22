export const stagger = (index: number, step = 0.06, max = 6): number => Math.min(index, max) * step;
