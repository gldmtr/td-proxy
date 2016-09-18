const _ = require('lodash');

function modifyTime(req, body) {
  if (body.document) {
    body.document = _.map(body.document, () => '');
  }
  if (body.url) {
    body.url = _.map(body.url, () => '');
  }

  if (body.process_name) {
    body.process_name = _.map(body.process_name, () => 'vim');
  }
  if (body.window_title) {
    body.window_title = _.map(body.window_title, () => 'vim');
  }

  return body;
}

module.exports = modifyTime;

