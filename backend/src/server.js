const express = require('express');
const cors = require('cors');
const { getUsers, createUser, updateUser, deleteUser, loginUser } = require('./controllers/userController');
const { validateUser, validateLogin } = require('./validators/userValidator');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/users', getUsers);
app.post('/api/users', validateUser, createUser);
app.put('/api/users/:id', updateUser);
app.delete('/api/users/:id', deleteUser);
app.post('/api/auth/login', validateLogin, loginUser);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor API corriendo en puerto ${PORT}`));
