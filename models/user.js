class User {
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