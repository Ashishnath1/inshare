
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");


const PORT = process.env.PORT || 3000;
app.use(express.static("public"));  //To coonect download.ejs with css in public
app.use(express.json());  //to parse json data(emailsender and receiver)

const connectDB = require("./config/db");
connectDB();

//Cors
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(",")   //who can access my website
}

app.use(cors(corsOptions));  
//Template engine
app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "ejs")

//Routes
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));

app.listen(PORT, ()=>{
    console.log(`Listening to port ${PORT}`);
})
