exports.user = (req, res, next) => {
    const user = req.user;

    // Go home if user doesn't exist
    if (!user) res.redirect('/');

    // Render account template if user does exist
    res.render('account', {user: user});
};