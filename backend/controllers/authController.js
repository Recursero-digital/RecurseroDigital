
const login = async (req, res) => {
    const { user, password } = req.body;

    if(!user) {
        return res.status(400).json({ error: 'Falta el usuario' });
    } else if(!password) {
        return res.status(400).json({ error: 'Falta la contraseña' });
    } else {
        return res.status(200).json({ token: 'fake-jwt-token' });
    }
};

module.exports = { login };