const users = require('../database/user')
const ipFilter = require('express-ipfilter').IpFilter;
const ips = ['::1','127.0.0.1'];

module.exports = (app) => {
  app.use(ipFilter(ips, {mode: 'allow'}));
  app.use('/users', users);
}