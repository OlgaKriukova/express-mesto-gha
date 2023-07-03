class UniqueError extends Error {
  constructor(message) {
    const defaultMessage = 'Нарушена уникальность';
    super(message || defaultMessage);
    this.statusCode = 409;
  }
}

module.exports = UniqueError;
