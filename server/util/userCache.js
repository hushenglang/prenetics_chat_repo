
const users = {}

exports.getUserById = function(id){
    return users[id]
}

exports.cacheUserById = function(id, user){
    return users[id] = user;
}

exports.removeUserById = function(id){
    return delete users[id];
}