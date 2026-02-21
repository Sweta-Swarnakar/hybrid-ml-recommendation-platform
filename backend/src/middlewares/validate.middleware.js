const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error(
      errors.array().map(e => e.msg).join(", ")
    );
    err.statusCode = 400;
    return next(err);
  }

  next();
};

module.exports = validate;