// Re-export from the JS file for TypeScript compatibility
import colorsJs from './colors.js';

export const colors: Record<string, string> = colorsJs;
export default colors;