const proxy = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(proxy('/api', {
        //target: 'http://localhost:1337',
        target: 'http://18.144.133.201:1337',
    }));
};
