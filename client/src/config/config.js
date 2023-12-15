const configs = {
  development: {
    SERVER_URI: 'http://localhost:5001',
  },
  production: {
    SERVER_URI: 'https://server-maps-travel-website2.onrender.com',
  },
};

export default configs[process.env['NODE_ENV']];

