module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    transformIgnorePatterns: [
      "/node_modules/(?!(@adobe/css-tools)/)", // Adjust for modern dependencies
    ],
    setupFilesAfterEnv: ["@testing-library/jest-dom"],
  };
  