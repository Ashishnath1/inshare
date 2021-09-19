const router = require("express").Router();
const File = require("../models/file");


router.get("/:uuid", async (req, res) =>{

    try{
    const file = await File.findOne({uuid: req.params.uuid});

    if(!file){
        return res.render("download", {error: "Link has expired"});
    }
 
    const response = await file.save();
    const filePath = `${__dirname}/../${file.path}`;
        console.log(filePath);
    res.download(filePath);
    }
    catch(err){
        return res.render("download", {error: "Oops! something went wrong"});
        console.log(err);
    }
})

module.exports = router;
