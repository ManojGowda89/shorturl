const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

try {
    const connect =mongoose.connect("mongodb+srv://ManojGowda:Manoj2002@cluster0.lqo2toa.mongodb.net//shorturl")
    if(connect){

        console.log("mongoose connected")
    }
} catch (error) {
    console.log("mongoose not connected")
}


app.set('views', path.join(__dirname, 'views'));
// middelwares
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.set('view engine', 'pug')


const userSchema  = new mongoose.Schema({

surl:{
    type: 'string',
    unique: true,
    required: true,
},
url: {
    type: 'string',
    required: true
}

})

const userData = mongoose.model('URLS',userSchema);


app.get("/:id", async (req, res) =>{

      
     
    const surl = await userData.findOne({surl: req.params.id})

    if(surl){
        return res.redirect(surl.url)
    }

    res.redirect("/")


 
    
})



app.post("/create", async (req, res) => {
    try {
        const baseUrl = req.protocol + '://' + req.get('host');
        const { surl, url } = req.body;
       const existing = await userData.findOne({surl: surl});

       if(existing){
           return res.render('exist',{url:`${existing.url}`,surl:`${baseUrl}/${existing.surl}`})
       }

       await userData.create(req.body);
       res.render('done',{url:`${req.body.url}`,surl:`${baseUrl}/${req.body.surl}`})
      

    } catch (error) {
        console.error("Error creating URL:", error);
        res.status(500).send("Error creating URL");
    }
});

app.get("/",(req, res) =>{

   res.render('create', { title: 'Create Link'})
})


app.listen(PORT, () => console.log("listening on port 3000"));
