const routesConfig = require('./routes');
const CommonController = require('./modules/controllers/common');
require('bdapp');
require('angular-jwt');
require('./styles/global.less');

window.BID = '5a280e2e4db0482b707b6f2d'; // Builder ID
window.APILOC = 'https://api.mybuildercloud.com/api/v1/';
window.LEADLOC = 'https://www.mybuildercloud.com/_admin/API/';

const app = angular.module('app', ['bdapp', 'angular-jwt']);
app.config(routesConfig);

app.controller('CommonController', CommonController);

window.ANGULAR_APP = app;

function requireAll(requireContext) {
  return requireContext
    .keys()
    .map(requireContext);
}

requireAll(require.context('./presentation/', true, /\.js$/));
