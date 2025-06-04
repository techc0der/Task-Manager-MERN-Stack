const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('./dbConnecttion');
const PORT = process.env.PORT || 3000
const cors = require("cors");
const { urlencoded } = require('body-parser');
const authRouter = require('./routes/authRoutes');
const reportRouter = require('./routes/reportRoutes');
const taskRouter = require('./routes/tasksRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

app.use(cors({
    origin: process.env.ClientURL,
    methood: ["get","post","delete","put"],
    allowedHeaders: ["Content-Type","Authorization"]
}))

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//@Route ./api/auth , ./api/user ,  ./api/task , ./api/reports
app.use('/api/auth',authRouter);
//app.use('/api/report',reportRouter);
app.use('/api/users',userRoutes);
app.use('/api/tasks',taskRouter);



app.listen(3000,()=>{
    console.log(urlencoded);
    console.log('server is running on ',PORT); 
})