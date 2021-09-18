const router = require("express").Router();
const File = require("../models/file");


router.get("/:uuid", async (req, res) => {  //uuid keeps changing so /:uuid

    try{
        const file = await File.findOne({uuid: req.params.uuid});  //req.params.uuid is the dynamic parameter /:uuid
        if(!file){
            return res.render("download", {error: "Link has expired"});
        }

        return res.render("download", {
           uuid: file.uuid,           //name should be exactly same as in file.js (name after ".")
           fileName: file.filename,
           fileSize: file.size, 
           downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`   //downloadlink--> http:localhost:3000/files/download/swbvgfgf2322244-ee73
        })
    }
    catch(err){
        return res.render("download", {error: "Something went wrong"});
    }
    
})





module.exports = router
