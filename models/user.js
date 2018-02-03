/**
 * @class
 * @name User
 * @summary User controller.
 * @version 1.0.0
 */

class User {
    /**
     * @public
     * @function validateUser
     * @description validates user
     * @param {string} username
     * @param {string} password
     * @param {function} callback
     */
    validateUser(username, password, callback) {
        db.collection('users').findOne({
            username,
            password
        }, (err, user) => {
            if(err) return callback(null);
            if(user) {
                return callback({username, password});
            } else {
                return callback(null);
            }
        });
    }
}

module.exports = new User();