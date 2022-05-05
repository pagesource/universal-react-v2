/**
 * Import Global CSS files here that needs to be injected
 * Note: This is not a best practice to put global styles
 * This is a minimum Normalize css
 */

export const globalStyle = {
  /**
   * Correct the line height in all browsers.
   */
  html: {
    lineHeight: '1.15'
  },
  /**
   * Remove the margin in all browsers.
   */
  body: { margin: 0, lineHeight: 1 },
  /**
   * Correct the font size and margin on `h1` elements within `section` and
   * `article` contexts in Chrome, Firefox, and Safari.
   */
  h1: { fontSize: '2em', margin: '0.67em 0' },
  legend: { padding: 0 },
  ul: { padding: 0, margin: 0, listStyle: 'none' },
  ol: { padding: 0, margin: 0, listStyle: 'none' },
  /**
   * 1. Add the correct box sizing in Firefox.
   * 2. Show the overflow in Edge and IE.
   */
  hr: {
    boxSizing: 'content-box' /* 1 */,
    height: 0 /* 1 */,
    overflow: 'visible' /* 2 */
  },
  /**
   * Remove the gray background on active links in IE 10.
   */
  a: { backgroundColor: 'transparent', textDecoration: 'none' },
  /**
   * Add the correct font weight in Chrome, Edge, and Safari.
   */
  b: { fontWeight: 'bolder' },
  strong: { fontWeight: 'bolder' },
  /**
   * Remove the border on images inside links in IE 10.
   */
  img: { borderStyle: 'none' },

  /* Forms
   ========================================================================== */
  /**
   *
   * 1. Change the font styles in all browsers.
   * 2. Remove the margin in Firefox and Safari.
   */
  button: {
    fontFamily: 'inherit' /* 1 */,
    fontSize: '100%' /* 1 */,
    lineHeight: '1.15' /* 1 */,
    margin: '0' /* 2 */
  },
  input: {
    fontFamily: 'inherit' /* 1 */,
    fontSize: '100%' /* 1 */,
    lineHeight: '1.15' /* 1 */,
    margin: '0' /* 2 */
  },
  select: {
    fontFamily: 'inherit' /* 1 */,
    fontSize: '100%' /* 1 */,
    lineHeight: '1.15' /* 1 */,
    margin: '0' /* 2 */
  },
  textarea: {
    fontFamily: 'inherit' /* 1 */,
    fontSize: '100%' /* 1 */,
    lineHeight: '1.15' /* 1 */,
    margin: '0' /* 2 */,
    /**
     * Remove the default vertical scrollbar in IE 10+.
     */
    overflow: 'auto'
  },
  /**
   * Correct the padding in Firefox.
   */
  fieldset: {
    padding: '0.35em 0.75em 0.625em'
  }
};

export default globalStyle;
