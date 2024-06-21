module.exports = (req, res, next) => {
    if (req.session && req.session.user_id) {
        return next();
    } else {
        console.log('User is not authenticated'); // Log pentru autentificare
        return res.status(401).json({ message: 'Not authenticated' });
    }
};
