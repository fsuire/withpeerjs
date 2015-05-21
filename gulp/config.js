module.exports = {
  files: {
    client: [
      'src/client/**/*.{css,js,html}',
      '!src/client/**/*.spec.js'
    ],
    server: [
      'src/server/**/*',
      '!src/server/**/*.spec.js'
    ]
  },
  outputDir: 'dist/'
};
