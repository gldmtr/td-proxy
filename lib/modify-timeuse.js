function modifyTime(req, body) {
  if (body.document) {
    body.document = body.document.map(() => '');
  }
  if (body.url) {
    body.url = body.url.map(() => '');
  }

  if (body.process_name) {
    body.process_name = body.process_name.map(() => 'vim');
  }
  if (body.window_title) {
    body.window_title = body.window_title.map(() => 'vim');
  }

  return body;
}

module.exports = modifyTime;

