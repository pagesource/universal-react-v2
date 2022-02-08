/**
 * Returns whether the execution context is browser or not
 * @returns Boolean
 */
export const isCalledInBrowser = () => {
  return typeof window !== 'undefined';
};
