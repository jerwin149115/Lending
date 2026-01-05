const adminModel = require('../model/adminModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/jwt.js');

module.exports = {
    login: (username, password) => {
        return new Promise((resolve, reject) => {
            adminModel.findByUsername(username, async (err, results) => {
                if (err) return reject({ status: 500, error: 'Database Error'});
                if (!results || results.length === 0) return reject({ status: 401, error: 'Invalid username or password'});

                const user = results[0];
                try {
                    const valid = await bcrypt.compare(password, user.password);
                    if (!valid) return reject({ status: 401, error: 'Invalid username or password'});
                    
                    const token = jwt.sign({ admid: user.admin_id, username: user.username}, SECRET_KEY);
                    resolve({token});
                } catch (e) {
                    console.error("error: ", e)
                    reject({ status: 500, error: 'Server Error'});
                }
            });
        });
    },
    register: (username, password) => {
        return new Promise((resolve, reject) => {
            adminModel.findByUsername(username, async(err, results) => {
                if (err) return reject({ status: 500, error: 'Database Error'});
                if (results && results.length > 0) return reject({ status: 409, error: 'Username already Exist!'});

                try {
                    const hashed = await bcrypt.hash(password, 10);
                    adminModel.create(username, hashed, (error, result) => {
                        if (error) return reject({ status: 500, error: 'Database Error'});
                        resolve({ message: 'User Registered Successfully!'});
                    });
                } catch (e) {
                    reject({ status:500, error: 'Server Error'});
                }
            })
        })
    }
}