const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(()=>{
    console.log('db is connected')
  })
  .catch((err)=>{
    console.log('db is not connected');
  })
 
module.exports = mongoose;