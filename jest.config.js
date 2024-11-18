module.exports = {
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest',  // Make sure Babel is used to transform files
    },
    testEnvironment: 'jsdom', // Default environment for React testing
  };
  