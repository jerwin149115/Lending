const express = require('express');
const mysql = require('mysql2')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express();
const PORT = 3000;
const SECRET_KEY = 'lendingNiBiboy'

app.use(express.json());
app.use(cors({ origin: '*'}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1145',
    database: 'lending'
})

db.connect((error) => {
    if (error) {
        console.error('Error in connecting the MySQL', error);
        process.exit(1);
    }
    console.log('MySQL Connected Succesfully!');
})

//ADMIN 
app.post('/api/login/admin', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required'});
    }

    const loginQuery = `SELECT * FROM admin_user WHERE username = ?`;
    db.query(loginQuery, [username], async (error, results) => {
        if (error) {
            console.error('Error in fetching the user:', error.message);
            return res.status(500).json({ error: 'Database Error'});
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password!'})
        }

        const user = results[0];
        try {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid username or password'})
            }

            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY,);
            res.json({ message: 'Login Successfully!', token});
        } catch (error) {
            console.error('Error during password comparison: ', error.message);
            res.status(500).json({ error: 'Server Error'})
        }
    })
})

app.post('/api/register/admin', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required'});
    }

    const checkUserQuery = `SELECT * FROM admin_user WHERE username = ?`;
    db.query(checkUserQuery, [username], async (error, result) => {
        if (error) {
            console.error('Error checking for existing user:', error.message);
            return res.status(500).json({ error: 'Database Error'});
        }

        if (result.length > 0) {
            return res.status(409).json({ error: 'Username already exists'});
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const registerQuery = `INSERT INTO admin_user (username, password) VALUES (?, ?)`
            db.query(registerQuery, [username, hashedPassword], (error) => {
                if (error) {
                    console.error('Error in registering the user', error.message);
                    return res.status(500).json({ error: 'Database Error'})
                }
                res.json({ message: 'Registered Successfully!'});
            })
        } catch(error) {
            console.error('Error in hashing the password: ', error.message);
            res.status(500).json({ error: 'Server Error'});
        }
    })
})

//Riders
app.post('/api/register/riders', async (req, res) => {
    const { username, password, lending_company, area } = req.body;

    if (!username || !password || !lending_company || !area) {
        return res.status(400).json({ error: 'All Fields are required'});
    }

    const checkUserQuery = `SELECT * FROM rider_user WHERE username = ?`;
    db.query(checkUserQuery, [username], async (error, result) => {
        if (error) {
            console.error('Error checking for existing user:', error.message);
            return res.status(500).json({ error: 'Database Error'});
        }

        if (result.length > 0) {
            return res.status(409).json({ error: 'Username already exists'});
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const registerQuery = `INSERT INTO rider_user (username, password, area, lending_company) VALUES (?, ?, ?, ?)`
            db.query(registerQuery, [username, hashedPassword, area, lending_company], (error) => {
                if (error) {
                    console.error('Error in registering the user', error.message);
                    return res.status(500).json({ error: 'Database Error'})
                }
                res.json({ message: 'Registered Successfully!'});
            })
        } catch(error) {
            console.error('Error in hashing the password: ', error.message);
            res.status(500).json({ error: 'Server Error'});
        }
    })
})

app.put('/api/update/riders/:id', async (req, res) => {
    const { username, password, area, lending_company } = req.body;
    const { id } = req.params;
    const updateQuery = `UPDATE rider_user SET username = ?, password = ?, area = ?, lending_company = ? WHERE rider_id = ?`;

    db.query(updateQuery, [ username, password, area, lending_company, id], (error, result) => {
        if (error) {
            console.error('Error in updating the riders', error);
            return res.status(500).json({ error: 'Server Error'});
        }

        res.status(200).json({ message: 'Rider updated successfully!'});
    })
})

app.delete('/api/delete/riders/:id', async (req, res) => {
    const { id } = req.params;
    const deleteQuery = `DELETE FROM rider_user WHERE rider_id = ?`;

    db.query(deleteQuery, [id], (error, result) => {
        if (error) {
            console.error('Error in deleting the rider', error);
            return res.status(500).json({ error: 'Server Error'});
        }

        res.status(200).json({ messasge: 'Rider has been deleted successfully!'})
    })
})

app.get('/api/get/riders/username', async (req, res) => {
    const { username } = req.query;
    const searchQuery = `SELECT * FROM rider_user WHERE username = ?`;
    db.query(searchQuery, [username], (error, result) => {
        if (error) {
            console.error('Error in fetching the Rider', error);
            return res.status(500).json({ error: 'Server Error'});
        }

        if (result.length > 0) {
            res.json({ success: true, result})
        }
    })
});

app.get('/api/get/riders', async (req, res) => {
    const searchQuery = `SELECT * FROM rider_user`;
    db.query(searchQuery, (error, result) => {
        if (error) {
            console.error('Error in fetching the rider', error);
            return res.status(500).json({ error: 'Server Error'});
        }

        res.json(result);
    })
})


//Customer
app.post('/api/register/customer', async (req, res) => {
    const { account_no, name, address, area, lending_company, amount, daily_pay, loan_date, terms } = req.body;

    try {
        const loanDate = new Date(loan_date);
        if (isNaN(loanDate)) {
            return res.status(400).json({ error: 'Invalid loan_date format. Expected YYYY-MM-DD.' });
        }
        const dueDate = new Date(loanDate);
        dueDate.setDate(loanDate.getDate() + parseInt(terms)); 
        const formattedDueDate = dueDate.toISOString().split('T')[0]; 

        const insertQuery = `INSERT INTO customer_user (account_no, name, address, area, lending_company, amount, daily_pay, loan_date, terms, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(
            insertQuery,
            [account_no, name, address, area, lending_company, amount, daily_pay, loan_date, terms, formattedDueDate],
            (error, result) => {
                if (error) {
                    console.error('Error inserting the customer', error);
                    return res.status(500).json({ error: 'Server Error' });
                }

                res.json({ success: true, result });
            }
        );
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.put('/api/update/customer/:id', async (req, res) => {
    const { account_no, name, address, area, lending_company, amount, daily_pay, loan_date, terms } = req.body;
    const { id } = req.params;

    try {
        const loanDate = new Date(loan_date);
        if (isNaN(loanDate)) {
            return res.status(400).json({ error: 'Invalid loan_date format. Expected YYYY-MM-DD.' });
        }
        const dueDate = new Date(loanDate);
        dueDate.setDate(loanDate.getDate() + parseInt(terms)); 
        const formattedDueDate = dueDate.toISOString().split('T')[0]; 

        const updateQuery = `UPDATE customer_user SET account_no = ?, name = ?, address = ?, area = ?, lending_company = ?,
        amount = ?, daily_pay = ?, loan_date = ?, terms = ?, due_date = ? WHERE customer_id = ?`;

        db.query(
            updateQuery,
            [account_no, name, address, area, lending_company, amount, daily_pay, loan_date, terms, formattedDueDate, id],
            (error, result) => {
                if (error) {
                    console.error('Error updating the customer', error);
                    return res.status(500).json({ error: 'Server Error' });
                }

                res.json({ message: 'Customer details successfully updated' });
            }
        );
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Server Error' });
    }
})

app.get('/api/get/customer', async (req, res) => {
    const searchQuery = `SELECT * FROM customer_user`;

    db.query(searchQuery, (error, result) => {
        if (error) {
            console.error('Error in fetching the customer', error);
            return res.status(500).json({ error: 'Server Error'});
        }

        res.json(result)
    })
});

app.get('/api/get/customer/:area/:lending_company', (req, res) => {
    const { area, lending_company } = req.params;

    const query = `
        SELECT *
        FROM customer_user
        WHERE lending_company = ? AND area = ?;
    `;

    db.query(query, [lending_company, area], (err, results) => {
        if (err) {
            console.error('Error fetching customers:', err);
            return res.status(500).json({ error: 'Server Error' });
        }
        res.json(results);
    });
});

app.get('/api/get/customer/:customer_id', async (req, res) => {
    const { customer_id } = req.params;
    const searchQuery = `SELECT * FROM customer_user WHERE customer_id = ?`;
    const paymentQuery = `SELECT * FROM payments WHERE customer_id = ?`;

    try {
        const customerResult = await new Promise((resolve, reject) => {
            db.query(searchQuery, [customer_id], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        const paymentResult = await new Promise((resolve, reject) => {
            db.query(paymentQuery, [customer_id], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        res.json({
            customer: customerResult,
            payments: paymentResult,
        });
    } catch (error) {
        console.error('Error in fetching data:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/delete/customer/:customer_id', async (req, res) => {
    const { customer_id } = req.params;
    const deleteQuery = `DELETE FROM customer_user WHERE customer_id = ?`;

    db.query(deleteQuery, [customer_id], (error, result) => {
        if (error) {
            console.error('Error in deleting the customer', error);
            return res.status(500).json({ error: 'Server Error'});
        }

        res.json(result);
    })
})

//Company
app.get('/api/company/get', async (req, res) => {
    const searchQuery = `SELECT * FROM company`;

    db.query(searchQuery, (error, result) => {
        if (error) {
            console.error('Error in fetching the company');
            return res.status(500).json({error: 'Server error'})
        }

        res.json(result);
    })
});

app.post('/api/company/add', async (req, res) => {
    const { name } = req.body;
    const addQuery = `INSERT INTO company (name) VALUES (?)`;

    db.query(addQuery, [name], (error, result) => {
        if (error) {
            console.error('Error in adding the company', error);
            return res.json(500).json({ error: 'Server error'});
        }

        res.json({success: true, result});
    })
})

app.put('/api/company/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const updateQuery = `UPDATE company SET name = ? WHERE company_id = ?`;

    db.query(updateQuery, [name, id], (error, result) => {
        if (error) {
            console.error('Error in updating the company', error);
            return res.json(500).json({ error: 'Server Error'});
        }

        res.json({ success: true, result });
    })
})

app.delete('/api/company/delete/:id', async (req, res) => {
    const { id } = req.params;
    const deleteQuery = `DELETE FROM company WHERE company_id = ?`;

    db.query(deleteQuery, [id], (error, result) => {
        if (error) {
            console.error('Error in deleting the company', error);
            return res.json(500).json({ error: 'Server Error'});
        }

        res.json({ success: true, result });
    })
})

//AREA
app.get('/api/area/get', async (req, res) => {
    const searchQuery = `SELECT * FROM area`;

    db.query(searchQuery, (error, result) => {
        if (error) {
            console.error('Error in fetching the area', error);
            return res.status(500).json({ error: 'Server Error'});
        }

        res.json(result);
    })
});

app.get('/api/area/get/company', async (req, res) => {
    const { company } = req.query;
    let searchQuery = `SELECT * FROM area`;
    const params = [];

    if (company) {
        searchQuery += ` WHERE company = ?`;
        params.push(company); 
    }

    db.query(searchQuery, params, (error, result) => {
        if (error) {
            console.error('Error fetching areas:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch areas.' });
        }

        res.status(200).json({ success: true, data: result });
    });
});


app.post('/api/area/add', async (req, res) => {
    const { name, lending_company } = req.body;
    const addQuery = `INSERT INTO area (name, lending_company) VALUES (?, ?)`;

    db.query(addQuery, [name, lending_company], (error, result) => {
        if (error) {
            console.error('Error in adding the area', error);
            res.status(500).json({ error: 'Server Error'});
        }

        res.json(result);
    })
})

app.put('/api/area/update/:id', async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    const updateQuery = `UPDATE area SET name = ? WHERE area_id = ?`;

    db.query(updateQuery, [name, id], (error, result) => {
        if (error) {
            console.error('Error in updating the area', error)
            return res.json(500).json({ error: 'Server Error'});
        }

        res.json(result);
    })
})

app.delete('/api/area/delete/:id', async (req, res) => {
    const { id } = req.params;
    const deleteQuery = `DELETE FROM area WHERE area_id = ?`;

    db.query(deleteQuery, [id], (error, result) => {
        if (error) {
            console.error('Error in deleting the area', error);
            return res.status(500).json({ error: 'Server Error'});
        }

        res.json(result);
    })
})

//Payment
app.post('/api/payment/multiple/:customer_id', (req, res) => {
    const { customer_id } = req.params;
    const { payment } = req.body;

    if (!payment || payment <= 0) {
        return res.status(400).json({ error: 'Invalid payment amount' });
    }

    const paymentQuery = `
        INSERT INTO payments (payment, payment_date, customer_id)
        VALUES (?, ?, ?)
    `;
    const updateLastPaymentQuery = `
        UPDATE customer_user SET last_payment_time = ?, last_payment_amount = ? WHERE customer_id = ?
    `;

    const now = new Date();
    db.query(paymentQuery, [payment, now, customer_id], (error) => {
        if (error) {
            console.error('Error saving payment:', error);
            return res.status(500).json({ error: 'Server Error' });
        }

        db.query(updateLastPaymentQuery, [now, payment, customer_id], (updateError) => {
            if (updateError) {
                console.error('Error updating last payment time:', updateError);
                return res.status(500).json({ error: 'Server Error' });
            }

            res.json({ message: 'Payment saved successfully' });
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})