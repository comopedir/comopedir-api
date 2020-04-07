function report(error) {
  console.error(error);
}

export class ValidationError extends Error {
  code = 400;
  state;

  constructor(errors) {
    super('The request is invalid.');
    this.state = errors.reduce((result, error) => {
      if (Object.prototype.hasOwnProperty.call(result, error.key)) {
        result[error.key].push(error.message);
      } else {
        Object.defineProperty(result, error.key, {
          value: [error.message],
          enumerable: true,
        });
      }
      return result;
    }, {});
  }
}

export class UnauthorizedError extends Error {
  code = 401;
  message = this.message || 'Unauthorized - Access is denied.';
}

export class ForbiddenError extends Error {
  code = 403;
  message = this.message || 'Access is denied.';
}

export default { report };
