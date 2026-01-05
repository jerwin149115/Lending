const paymentModel = require('../model/paymentModel.js');
const notificationModel = require('../model/notificationModel.js')
const db = require('../config/db.js')

module.exports = {
    addPayment: (customer_id, payment, payment_date, payment_status) => {
        return new Promise((resolve, reject) => {
            paymentModel.insert(payment, payment_date, customer_id, payment_status, (err, res) => {
                if (err) return reject({ status: 500, error: 'Server Error' });

                const paymentId = res.insertId;

                const updateCustomerQuery = `
                    UPDATE customer_user
                    SET last_payment_time = ?, last_payment_amount = ?
                    WHERE customer_id = ?
                `;

                db.query(
                    updateCustomerQuery,
                    [payment_date, payment, customer_id],
                    (error) => {
                        if (error) {
                            console.error('Error updating customer:', error);
                        }

                        resolve({
                            message: 'Payment saved',
                            payment_id: paymentId
                        });
                    }
                );
            });
        });
    },
    addMultiple: (customer_id, payments) => {
        return new Promise((resolve, reject) => {

            const values = payments.map(p => [
                customer_id,
                p.rider_id,
                p.payment,
                p.payment_date,
                p.payment_status
            ]);

            paymentModel.insertMultiple(values, async (err, result) => {
                if (err) {
                    console.error(err);
                    return reject({ status: 500, error: "Server Error" });
                }

                const last = payments[payments.length - 1];

                const updateCustomerQuery = `
                    UPDATE customer_user
                    SET last_payment_time = ?, last_payment_amount = ?
                    WHERE customer_id = ?
                `;

                db.query(
                    updateCustomerQuery,
                    [last.payment_date, last.payment, customer_id],
                    async () => {

                        try {
                            const riderId = last.rider_id;

                            const totalPaid = payments.reduce(
                                (sum, p) => sum + Number(p.payment),
                                0
                            );

                            const notifications = [
                                [
                                    1, 
                                    null,
                                    'New Payment Received',
                                    `Customer #${customer_id} paid ₱${totalPaid.toLocaleString()}`
                                ]
                            ];

                            await notificationModel.insertMultiple(notifications);
                        } catch (notifErr) {
                            console.error('Notification error:', notifErr);
                        }

                        resolve({
                            message: "Multiple payments saved",
                            inserted: result.affectedRows
                        });

                    }
                );
            });
        });
    },
    getPaymentsByCustomer: (customer_id) => new Promise((resolve, reject) => paymentModel.findByCustomerId(customer_id, (err, res) => err ? reject(err): resolve(res))),
    deletePayment: (payment_id) => new Promise((resolve, reject) => paymentModel.deleteById(payment_id, (err, res) => err ? reject(err): resolve(res)))
}