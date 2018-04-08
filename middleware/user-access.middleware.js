const ApiError = require('../models/api-error.model');

module.exports.gotAccess = (req, res, next) => {
  let idParams = "";
  (!req.params.id) ? idParams = String(req.params.idUser): idParams = String(req.params.idUser);
  const idUser = String(req.user._id);
  console.log("USER ID = " + req.user._id);
  console.log("PARAMS ID = " + idParams);

  if (idParams === idUser) {
    next();
  } else {
    next(new ApiError('Unauthorized, diferents ids', 403));
  }
};