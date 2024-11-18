module.exports = {
  presets: [
    "@babel/preset-env", // Preset to support modern JavaScript
    ["@babel/preset-react", { runtime: "automatic" }] // React preset with automatic JSX runtime
  ],
  plugins: [
    "@babel/plugin-proposal-private-methods", // Plugin for private methods
    "@babel/plugin-proposal-private-property-in-object" // Plugin for private property in object
  ]
};
