class NotFoundError extends Error {
  constructor(message) {
    const defaultMessage = 'Объект по указанному _id не найден';
    super(message || defaultMessage);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
