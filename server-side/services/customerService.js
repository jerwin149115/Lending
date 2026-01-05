const customerModel = require('../model/customerModel.js');

module.exports = {
    createCustomer: (payload) => {
        return new Promise((resolve, reject) => {
            customerModel.create(payload, (err, res) => {
                if (err) return reject({ status: 500, error: 'Server Error'});
                resolve(res);
            });
        });
    },
    updateCustomer: (id, payload) => new Promise((resolve, reject) => {
        customerModel.updateById(id, payload, (err, res) ? reject({ status: 500, error: 'Server Error'}): resolve(res));
    }),
    delete: (customer_id) => {
        return new Promise((resolve, reject) => {
            customerModel.deleteById(customer_id, (err, res) => {
                if (err) {
                    console.log("Delete From: ", err);
                    return reject({ status: 500, err});
                }

                if (result.affectedRows === 0) {
                    return resolve({ message: 'No customer deleted - ID not found'});
                }

                resolve({ message: 'Customer Deleted Successfully!'});
            })
        })
    },
    findAll: () => new Promise((resolve, reject) => customerModel.findAll((err, res) => err ? reject(err): resolve(res))),
    findById: (id) => new Promise((resolve, reject) => customerModel.findById(id, (err, res) => err ? reject(err) : resolve(res[0] || null))),
    findByRiderId: (rider_id) => new Promise((resolve, reject) => customerModel.findByRiderId(rider_id, (err, res) => err ? reject(err) : resolve(res)))
}