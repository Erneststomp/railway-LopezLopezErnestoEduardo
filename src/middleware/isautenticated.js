import passport from 'passport';
//Midleware para verificar que el usuario este autenticado para pdoer entrar a las rutas restringidas
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send({ status:"Unauthorized", message: "Please login in order to access to this information" });
}

export default isAuthenticated;
