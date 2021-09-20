const router = require("express").Router();
const multer = require("multer");  //multer for storing file
const path = require("path");
const File = require("../models/file");
const {v4: uuid4} = require("uuid");
const file = require("../models/file");


let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "../uploads"),    //null for error
    filename: (req, file, cb) => {
         const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
         //path.extname gives the extension of a file like .png
         cb(null, uniqueName);
    }
})


let upload = multer({
    storage, //you can write storage: storage
    limit: {fileSize: 1000000 * 100}, //100 mb max size
}).single("myfile");


//routed from server.js(full url will look like http:localhost:3000/api/files/swdjwjdbj-12162716ydbvv b)
router.post("/", (req, res)=>{     

//Store file
upload(req, res, async (err)=>{

    //validate request
   if(!req.file){
    return res.json({error: "All fields are required"})
   } 

  if(err){
   return res.status(500).send({error: err.message})
  }

//Store in database
const file = new File({
    filename: req.file.filename,
    uuid: uuid4(),
    path: req.file.path,
    size: req.file.size
});

const response = await file.save();
return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});
//http:localhost:3000/files/12132edhjkd-234hjhjhff

})


})

//since first part(api/files) is same no need to create another route file for sending email
router.post("/send", async (req, res)=> {

    const {uuid, emailTo, emailFrom} = req.body;
    //Validate request
    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error: "All fields are required"});
    }

    //Get data from database
    const file = await File.findOne({uuid: uuid});
    if(file.sender){   //Checking if sender exists in database
        return res.status(422).send({error: "Email already sent"})
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();


    //Send email
    const sendMail = require("../services/emailService");
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: "Inshare file sharing",
        text: `${emailFrom} shared a file with you`,
        html: require("../services/emailTemplate")({   //this is how the receiver will get the email
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + " KB",
            expires: "24 hours"
        })
    });

    return res.send({success: true});

})
module.exports = router
