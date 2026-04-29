module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Replace import.meta with a safe object for Metro web bundles (non-module scripts)
      function ({ types: t }) {
        return {
          visitor: {
            MetaProperty(path) {
              if (
                path.node.meta.name === 'import' &&
                path.node.property.name === 'meta'
              ) {
                path.replaceWith(
                  t.objectExpression([
                    t.objectProperty(
                      t.identifier('env'),
                      t.objectExpression([
                        t.objectProperty(
                          t.identifier('MODE'),
                          t.stringLiteral(process.env.NODE_ENV ?? 'production')
                        ),
                      ])
                    ),
                  ])
                );
              }
            },
          },
        };
      },
    ],
  };
};
