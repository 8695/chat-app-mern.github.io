
const mongoose = require('mongoose');
require('dotenv').config();



    const connection = async()=>{
        try{
          await mongoose.connect(process.env.MONGOOSE_URL);
          console.log("connections successfull to database");
        }
        catch(error){
           console.log("error",error)
        }
    }

    connection();


module.exports =connection;