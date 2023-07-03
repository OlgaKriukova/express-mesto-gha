class Forbidden extends Error {
  constructor(message) {
    const defaultMessage = 'Нет доступа';
    super(message || defaultMessage);
    this.statusCode = 403;
  }
}

module.exports = Forbidden;
