const riderModel = require('../model/riderModel.js');
const bcrypt = require('bcrypt');

module.exports = {
    register: (username, password, area, lending_company) => {
        return new Promise((resolve, reject) => {
            riderModel.findByUsername(username, async (err, results) => {
                if (err) return reject({ status: 500, error: 'Database Error' });
                if (results.length > 0)
                    return reject({ status: 409, error: 'Username already exists' });

                try {
                    const hashed = await bcrypt.hash(password, 10);

                    riderModel.create(
                        username,
                        hashed,
                        area,
                        lending_company,
                        (error) => {
                            if (error)
                                return reject({ status: 500, error: 'Database Error' });

                            resolve({ message: 'Registered Successfully!' });
                        }
                    );
                } catch {
                    reject({ status: 500, error: 'Server Error' });
                }
            });
        });
    },

    update: async (rider_id, username, password, area, lending_company) => {
        try {
            let hashedPassword = null;

            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            return new Promise((resolve, reject) => {
                riderModel.updateById(
                    rider_id,
                    username,
                    hashedPassword,
                    area,
                    lending_company,
                    (error) => {
                        if (error)
                            return reject({ status: 500, error: 'Database Error' });

                        resolve({ message: 'Rider updated successfully!' });
                    }
                );
            });
        } catch {
            return Promise.reject({ status: 500, error: 'Server Error' });
        }
    },

    delete: (rider_id) => {
        return new Promise((resolve, reject) => {
            riderModel.deleteById(rider_id, (error, result) => {
                if (error) return reject({ status: 500, error });

                if (result.affectedRows === 0) {
                    return resolve({ message: 'No rider deleted — ID not found.' });
                }

                resolve({ message: 'Rider Successfully Deleted!' });
            });
        });
    },

    findAll: () =>
        new Promise((resolve, reject) =>
            riderModel.findAll((err, res) => err ? reject(err) : resolve(res))
        ),

    findById: (id) =>
        new Promise((resolve, reject) =>
            riderModel.findById(id, (err, res) =>
                err ? reject(err) : resolve(res?.[0] || null)
            )
        ),

    getRiderProfile: (username) => {
        return new Promise((resolve, reject) => {
            riderModel.findByUsername(username, (err, res) => {
                if (err) return reject({ status: 500, error: 'Database Error' });
                if (!res.length)
                    return reject({ status: 404, error: 'User not found' });
                resolve(res[0]);
            });
        });
    },
    getRiderProfile: (username) => {
        return new Promise((resolve, reject) => {
            riderModel.findByUsername(username, (err, res) => {
                if (err) return reject({ status: 500, error: 'Database Error' });
                if (!res.length)
                    return reject({ status: 404, error: 'User not found' });
                resolve(res[0]);
            });
        });
    },
    getStats: (rider_id) => {
        return new Promise((resolve, reject) => {
            riderModel.getStats(rider_id, (err, stats) => {
                if (err)
                    return reject({ status: 500, error: 'Database Error' });
                resolve(stats);
            });
        });
    },
    getRecentPayments: (rider_id) => {
        return new Promise((resolve, reject) => {
            riderModel.getRecentPayments(rider_id, (err, res) => {
                if (err)
                    return reject({ status: 500, error: 'Database Error' });
                resolve(res);
            });
        });
    },
    getRecentPaymentsAll: () => {
        return new Promise((resolve, reject) => {
            riderModel.getRecentPaymentsAll((err, res) => {
                if (err) {
                    console.error('Service error:', err);
                    return reject({ status: 500, error: 'Database Error' });
                }
                resolve(res);
            });
        });
    },
    getMissedPayments: (rider_id) => {
        return new Promise((resolve, reject) => {
            riderModel.getMissedPayments(rider_id, (err, results) => {
                if (err) {
                    console.error('Service DB Error:', err);
                    return reject({
                        status: 500,
                        error: 'Database Error'
                    });
                }

                resolve(results);
            });
        });
    },
};
