import passport from 'passport';
//Midleware para verificar que el usuario este autenticado para pdoer entrar a las rutas restringidas
function isLoged(req, res, next) {
    if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

export default isLoged;
