function modifyTime(req, body) {
  body.sub_category = ['0'];
  body.work_mode = ['0'];

  console.log(body);

  return body;
}

module.exports = modifyTime;

