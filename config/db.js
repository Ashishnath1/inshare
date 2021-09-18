const mongoose = require("mongoose");
require("dotenv").config()

function connectDB(){
    //Database connection

    mongoose.connect(process.env.MONGO_CONNECTION_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
      console.log("Database connected");
}).catch((e) =>{
    console.log(e);
})
   
}
module.exports = connectDB;



 





// try{
// mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:
//     true, useFindAndModify: true});
//     const connection = mongoose.connection;

//         connection.once("open", ()=>{
//             console.log("Databse connected");
//         });
//     }
//     catch(e){
//       console.log(e);
//     }