const routes = require('next-routes')();

routes
  .add('/projects', '/projects/all')
  .add('/adminfactory', '/adminfactory/show')
  .add('/projects/new', '/projects/new')
  .add('/projects/:address', '/projects/show')
  .add('/projects/:address/requests', '/projects/showrequest')
  .add('/projects/:address/requests/new', '/projects/newrequest')
  .add('/ngos', '/ngo/all')
  .add('/ngos/new', '/ngo/new')
  .add('/ngos/:address', '/ngo/show')
  .add('/ngos/:address/requests', '/ngo/showrequest')
  .add('/ngos/:address/requests/new', '/ngo/newrequest')
  .add('/npos', '/npo/all')
  .add('/npos/new', '/npo/new')
  .add('/npos/:address', '/npo/show')
  .add('/npos/:address/requests', '/npo/showrequest')
  .add('/npos/:address/requests/new', '/npo/newrequest')
  .add('/customercare', '/customercare/all')
  .add('/customercare/new', '/customercare/new')
  .add('/vote', '/vote/all');

module.exports = routes;
