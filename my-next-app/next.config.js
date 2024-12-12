// next.config.js
module.exports = {
    webpack(config, { isServer }) {
      // Solo en el cliente (navegador)
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback, // Mantener otras configuraciones de fallback
          stream: require.resolve('stream-browserify'),
          zlib: require.resolve('browserify-zlib'),
        };
      }
      return config;
    },
  };
  