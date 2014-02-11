/**
 * GET /
 * Home page.
 */

var render = require('./render');

exports.index = function *home() {
	this.body = yield render('home', {
		secrets: {
			localAuth : 'test'
		},
		messages: {
			errors: '',
		},
		title: 'Home'
	});
};