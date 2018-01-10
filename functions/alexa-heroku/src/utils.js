
module.exports.CustomError = class CustomError extends Error {
  constructor(displayMessage, message) {
    super(message);

    this.name = this.constructor.name;

    this.displayMessage = displayMessage;
  }
};
