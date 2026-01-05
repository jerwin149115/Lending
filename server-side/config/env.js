const path = require('path');
const dotenv = require('dotenv');


const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });


module.exports = {
    PORT: process.env.PORT || 3000,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'lending',
    SECRET_KEY: process.env.SECRET_KEY || 'lendingNiBiboy'
};