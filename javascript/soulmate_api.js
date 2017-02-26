var UserStorage = (function(){
    var users = new Set();

    function load(){
        users = new Set();
        var rawData = localStorage.getItem("users");
        if(rawData) { // is not undefined
            var list = JSON.parse(rawData);
            for (var i = 0; i < list.length; i++) {
                var user = list[i];
                users.add(User.fromJson(user))
            }
        }
    }
    function save(){
        localStorage.setItem("users", JSON.stringify(Array.from(users)));
    }

    /**
     * @return {Set<User>}
     */
    function get(){
        return users;
    }
    return {
        save: save,
        load: load,
        get: get,
    }
})();

class User {
    constructor(username, password, email){
        /** @type string */ this.username = username;
        /** @type string */ this.password = password;
        /** @type string */ this.email = email;
    }
    static fromJson(json){
        return new User(json.username, json.password, json.email);
    }
}
var Soulmate = (function () {

    var SIMULATED_DELAY_MS = 1000;
    var SIMULATED_FAIL_PROBABILITY = 0.5;

    function todo(){
        throw new Error("Not implemented yet");
    }

    return {
        /*
         fakeExample: function(){
         return $.Deferred(function(D){
         setTimeout(function(){D.resolve(true)}, SIMULATED_DELAY_MS);
         }).promise()
         },
         realExample: function(){
         return $.post("index.html")
         }
         */
        /**
         * Attempts to register the given user
         * @param {User} user The user to register
         * @returns {User} the same user you just registered
         * @throws {String} an error message
         */
        register: function(user){
            return $.Deferred(function(D) {
                setTimeout(function () {
                    if(Math.random() < SIMULATED_FAIL_PROBABILITY){
                        D.reject("Pretend this is a server failure");
                        return;
                    }

                    UserStorage.get().add(user);
                    UserStorage.save();
                    D.resolve(user);


                }, SIMULATED_DELAY_MS);
            }).promise();
        },
        /**
         * Attempts to log in
         * @param {string} username The user to log on with
         * @param {string} password The password to log on with
         * @returns {User}
         * @throws {String} An error message
         */
        login: function(username, password){
            return $.Deferred(function(D){
                setTimeout(function(){
                    if(Math.random() < SIMULATED_FAIL_PROBABILITY){
                        D.reject("Pretend this is a server failure");
                        return;
                    }

                    /** @type Set<User> */
                    UserStorage.load();
                    var users = UserStorage.get();

                    var found;
                    users.forEach(u => {
                        if(u.username == username){
                            found = u;
                        }
                    });
                    if(!found){
                        D.reject("Invalid username")
                    } else if(found.password != password){
                        D.reject("Invalid password");
                    } else {
                        D.resolve(found);
                    }


                },SIMULATED_DELAY_MS)
            }).promise();
        },
        /**
         * Unregisters a user, forgetting it completely and enabling regisration of a new user with that name
         * @param {User} user the user to unregister
         * @return true if the user existed, false if it was already removed
         * @throws {String} an error message if the unregistration failed for some reason
         */
        unregisterUser: function(user){
            return $.Deferred(function(D){
                setTimeout(function(){
                    if(Math.random() < SIMULATED_FAIL_PROBABILITY){
                        D.reject("Pretend this is a server failure");
                        return;
                    }


                    /** @type Set<User> */
                    UserStorage.load();
                    var users = UserStorage.get();
                    if (users.has(user)) {
                        users.delete(user);
                        localStorage.setItem("users",JSON.stringify(users));
                        D.resolve(true);
                    } else {
                        D.resolve(false);
                    }


                },SIMULATED_DELAY_MS)
            }).promise();
        },
        checkLogin: todo,
        submitRating: todo,
        getPic: todo,
        getMatches: todo,
        getUserInfo: todo,
        submitUserInfo: todo,

    }
})();


localStorage.removeItem("users");
Soulmate.login("user","pass")
    .done(function(user){ console.warn("Logged on as user:pass, shouldn't have been able to =(", user) })
    .fail(function(message){ console.info("Failed to log on as user:pass, this is expected", message);

        Soulmate.register(new User("user","pass"))
            .fail(function(message){ console.warn("Failed to register user:pass", message); })
            .done(function(user){ console.info("Registered user:pass", user);

            Soulmate.login("user","pass")
                .fail(function(message){ console.warn("Failed to log in as user:pass", message)})
                .done(function(user) { console.info("Logged in as user:pass", user)})
            })
    })