const express = require('express');
const cors = require('cors');
const app = express();
const { PORT } = require('./config/index.js');
const path = require('path')

app.use(express.json());
app.use(cors({ origin: '*'}));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use('/api', require('./routes/adminRoute.js'));
app.use('/api', require('./routes/riderRoute.js'))
app.use('/api', require('./routes/customerRoute.js'))
app.use('/api', require('./routes/areaRoute.js'));
app.use('/api', require('./routes/companyRoute.js'))
app.use('/api', require('./routes/paymentRoute.js'));
app.use('/api', require('./routes/analyticsRoute.js'));
app.use('/api', require('./routes/notificationRoute.js'))
app.use('/api', require("./routes/documentRoute.js"));


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})