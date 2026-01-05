const areaModel = require('../model/areaModel.js');
module.exports = {
    findAll: () => new Promise((resolve, reject) => areaModel.findAll((err, res) => err ? reject(err): resolve(res))),
    findByCompany: (company) => new Promise((resolve, reject) => areaModel.findByCompany(company, (err, res) => err ? reject(err): resolve(res))),
    create: (name, lending_company) => new Promise((resolve, reject) => areaModel.create(name, lending_company, (err, res) => err ? reject(err): resolve(res))),
    update: (id, name) => new Promise((resolve, reject) => areaModel.update(id, name, (err, res) => err ? reject(err): resolve(res))),
    delete: (id) => new Promise((resolve, reject) => areaModel.delete(id, (err, res) => err ? reject(err): resolve(res)))
}