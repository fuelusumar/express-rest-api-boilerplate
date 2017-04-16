const validateRequest = schema => (req, res, next) => {
  req.check(schema);

  req.getValidationResult()
      .then((result) => {
        if (!result.isEmpty()) {
          res.status(400).json({ status: 'error', error: result.mapped() });
          return;
          // result.throw(result.array);
        }
        next();
      })
      .catch(r => next(r.mapped()));
};

export default validateRequest;
