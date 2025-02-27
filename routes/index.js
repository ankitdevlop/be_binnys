
const users = require('./user.route');
const movies = require('./movie.route');


module.exports = (router) => {
    // router.use('/shareData', shareDataRoute);
    router.use('/user', users);
    router.use('/movies', movies);
    // router.use('/wrapper', wrapper);
};