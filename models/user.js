
    // Definicion del modelo de User con validación y encriptación de passwords

    var crypto = require('crypto');
    var key = process.env.PASSWORD_ENCRYPTION_KEY;

    module.exports = function(sequelize, DataTypes) {
        var User = sequelize.define(
            'User', 
            {
                username: {
                    type: DataTypes.STRING,
                    unique: true,
                    validate: { 
                        notEmpty: {msg: "-> Falta username"},
                        isUnique: function (value, next) {                              // comprueba que username sea unico 
                            var self = this;
                            User.find({where: {username: value}})                       // busca username en la tabla User
                            .then(function (user) {
                                    if (user && self.id !== user.id) {
                                        return next('Username ya utilizado');           // devuelve un mensaje de error si el username ya existe
                                    }
                                    return next();
                            })
                            .catch(function (err) {
                                return next(err);
                            });
                        }
                    }
                },
                password: {                                                             // campo password
                    type: DataTypes.STRING,
                    validate: { notEmpty: {msg: "-> Falta password"}},
                    set: function(password) {                                           // set() cifra el password mediante algoritmo normalizado
                        var encripted = crypto.createHmac('sha1', key).update(password).digest('hex');
                        if (password === '') {                                          // evita passwords vacíos
                            encripted = '';
                        };
                        this.setDataValue('password', encripted);
                    }
                },
                isAdmin: {                                                              // indica si es administrador
                    type: DataTypes.BOOLEAN,
                    defaultValue: false
                },
                usertype: {
                    type: DataTypes.STRING
//                    validate: {notEmpty: {msg: "-> Falta tipo"}}
                }
            },
            {
                instanceMethods: {
                    verifyPassword: function(password) {
                        var encripted = crypto.createHmac('sha1', key).update(password).digest('hex');
                        return encripted === this.password;
                    }
                }    
            }
        );
        return User;
    };