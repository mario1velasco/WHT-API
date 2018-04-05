const ApiError = require('../models/api-error.model');

module.exports.gotAccess = (req, res, next) => {
  const idParams = String(req.params.id);
  const idUser = String(req.user._id);
  console.log("AAAAA");
  

  if (idParams===idUser) {
    next();
  } else {
    next(new ApiError('Unauthorized, diferents ids', 403));
  }
};