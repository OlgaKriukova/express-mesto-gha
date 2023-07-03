class WrongData extends Error {
  constructor(message) {
    const defaultMessage = 'Переданы некорректные данные';
    super(message || defaultMessage);
    this.statusCode = 400;
  }
}

module.exports = WrongData;
