const adminService = require('../services/adminService.js');

module.exports = {
    login: async(req, res) => {
        const { username, password } = req.body;
        if (!username || !password ) return res.status(400).json({ error: 'username and password are required'});

        try {
            const data = await adminService.login(username, password);
            res.json({ message: 'Login Successfully!', token: data.token});
        } catch (error) {
            console.error("error: ", error)
            res.status(error.status || 500).json({ error: error.error || 'Server Error'});
        }
    },
    register: async(req, res) => {
        const { username, password} = req.body;
        if (!username || !password) return res.status(400).json({ error: 'username and password are required'});

        try {
            const data = await adminService.register(username, password) ;
            res.json(data);
        } catch(e) {
            res.status(e.status || 500).json({ error: e.error || 'Server Error'});
        }
    }
}