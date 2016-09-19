function modufyPopupSettings(req, res, data) {
  const modifiedData = data.replace(/away_computer_work="\d+"/, 'away_computer_work="360"');

  return modifiedData;
}

module.exports = modufyPopupSettings;

