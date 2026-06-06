const { check } = require('express-validator');

exports.validateUser = [
    check('name', 'El nombre es requerido (mínimo 3 caracteres)').isLength({ min: 3 }),
    check('email', 'Ingrese un correo electrónico válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
];

exports.validateLogin = [
    check('email', 'Ingrese un correo válido').isEmail(),
    check('password', 'La contraseña no puede estar vacía').notEmpty()
];
