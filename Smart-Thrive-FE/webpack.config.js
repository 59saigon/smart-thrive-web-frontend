const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const path = require('path');

module.exports = function (config) {
  // Your existing rules (example)
  config.module.rules.push(
    {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              // `style-loader` options here...
            }
          }
        ]
    }
  );
  
  // Exclude CKEditor files from all existing rules
  config.module.rules
    .filter((rule) => rule.test.test('.css') || rule.test.test('.svg'))
    .forEach((rule) => {
      rule.exclude = rule.exclude ?? [];
      rule.exclude.push(path.join(__dirname, 'node_modules', '@ckeditor'));
    });
  
  // CKEditor rules from the docs
  // https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/quick-start-other.html#building-the-editor-from-source
  config.module.rules.push(
    {
      test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
      use: ['raw-loader'],
    },
    {
      test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
      use: [
        {
          loader: 'style-loader',
          options: {
            injectType: 'singletonStyleTag',
            attributes: {
              'data-cke': true,
            },
          },
        },
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: styles.getPostCssConfig({
              themeImporter: {
                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
              },
              minify: false,
            }),
          },
        },
      ],
    }
  );
};