module.exports = {
  presets: ["next/babel"],
  plugins: [],
  env: {
    test: {
      "plugins": ["transform-flow-strip-types"]
    }
  }
};
