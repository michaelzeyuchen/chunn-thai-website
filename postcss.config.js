module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      // Ensure webkit prefixes are properly handled
      overrideBrowserslist: [
        'last 2 versions',
        'Safari >= 12',
        'iOS >= 12',
        'not dead'
      ],
      // Don't remove webkit-text-fill-color
      remove: false,
      // Add grid support for older browsers
      grid: 'autoplace'
    },
  },
}