module.exports = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ error: "Acceso denegado. Se requieren privilegios de administrador." });
  };
  