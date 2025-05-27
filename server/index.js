const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('./dbConnecttion');
const PORT = process.env.PORT || 3000
const cors = require("cors");
const { urlencoded } = require('body-parser');
const authRouter = require('./routes/authRoutes');

app.use(cors({
    origin: process.env.ClientURL,
    methood: ["get","post","delete","put"],
    allowedHeaders: ["Content-Type","Authorization"]
}))
app.use(express.json());

//@Route ./api/auth , ./api/user ,  ./api/task , ./api/reports
app.use('/api/user',authRouter);

app.listen(3000,()=>{
    console.log(urlencoded);
    console.log('server is running on ',PORT); 
})