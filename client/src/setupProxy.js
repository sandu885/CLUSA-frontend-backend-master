<<<<<<< HEAD
const proxy = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(proxy('/api', {
        target: 'http://localhost:1337'
    }));
};
=======
const proxy = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(proxy('/api', {
        target: 'http://localhost:1337'
    }));
};
>>>>>>> 2ad42567dec29b84b0adf7b24fd6e92910ee9b4f
