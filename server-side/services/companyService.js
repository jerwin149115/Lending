const companyModel = require('../model/companyModel.js');

module.exports = {
    findAll: () => new Promise((resolve, reject) => companyModel.findAll((err, res) => err ? reject(err): resolve(res))),
    create: (name) => new Promise((resolve, reject) => companyModel.create(name, (err, res) => err ? reject(err): resolve(res))),
    update: (id, name) => new Promise((resolve, reject) => companyModel.update(id, name, (err, res) => err ? reject(err): resolve(res))),
    delete: (id) => new Promise((resolve, reject) => companyModel.delete(id, (err, res) => err ? reject(err): resolve(res))),
}