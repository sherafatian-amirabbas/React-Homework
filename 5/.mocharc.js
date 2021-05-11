const chai = require('chai');
global.expect = chai.expect;

const {JSDOM} = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const {window} = jsdom;
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};

module.exports = {
  require: [
    '@babel/register'
  ],
  recursive: true
};