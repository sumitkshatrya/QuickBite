const isAdmin = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  if (!req.user.isAdmin) {
    res.status(403);
    throw new Error('Admin access required');
  }

  return next();
};

export default isAdmin;
