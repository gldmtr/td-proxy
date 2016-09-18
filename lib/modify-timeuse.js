function modifyTime(req, body) {
  body.document = body.document.map(() => '');
  body.url = body.url.map(() => '');

  body.process_name = body.process_name.map(() => 'vim');
  body.window_title = body.window_title.map(() => 'vim');

  return body;
}

module.exports = modifyTime;

