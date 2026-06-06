const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.getAllActive();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "El email ya existe o hubo un error interno." });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updated = await User.update(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const result = await User.softDelete(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const user = await User.login(req.body.email, req.body.password);
        if (!user) return res.status(401).json({ error: "Credenciales incorrectas" });
        res.json({ message: "Login exitoso", user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
