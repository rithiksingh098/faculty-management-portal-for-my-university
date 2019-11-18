const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
var app = express();
// const mod = require('./src/models/faculty')
require('dotenv').config();
console.log(process.env.MONGO)
const profile = new mongoose.Schema({
    title: String,
    val: String
});
const facultyschema = new mongoose.Schema({
    name: String,
    id: Number,
    pswd: String,
    profile: [profile]
});
var mod = mongoose.model('Faculty', facultyschema);

app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//process.env.MONGO

const dbOptions = { useNewUrlParser: true, reconnectTries: Number.MAX_VALUE, useUnifiedTopology: true, poolSize: 10 };
mongoose.connect(process.env.MONGO, dbOptions).then(
    () => {
        console.log('  >  Connection Established');
    },
    (e) => {
        console.log('  >  Connection Failed \n>  ' + e);
    }
);
app.post("/signup", (req, res) => {
    // console.log(req);
    var nam = req.body.name;
    var id = req.body.id;
    var pswd = req.body.pswd;
    console.log(" --------------- "+nam);
    // var put = new mod({
    //     name: nam,
    //     id: id,
    //     pswd: pswd,
    //     profile: []
    // })

    // put.save()
    //     .then(doc => {
    //         // console.log(doc)
    //     })
    //     .catch(err => {
    //         // console.error(err)
    //     })
    mod.create({
        name: nam,
        id: id,
        pswd: pswd,
        profile: []
    }, (e) => {
        if(e) res.send("0");
        else res.send("1");
    })
});
app.get('/signup',(req,res) => {
    res.render('signup');
});

app.post('/login', (req, res) => {
    const id = req.body.id,
        pswd = req.body.pswd;
        console.log(id+" - "+pswd);
    mod.find({id: id}).limit(1).then(facprofile => {
        if(facprofile.length!=0){
            facprofile = facprofile[0];
            if(pswd == facprofile.pswd){
                res.send("1");
            }
            else res.send("0");
        }
        else res.send("-1");
    });


    // console.log(arr);
    // res.json({
    //     status: "success",
    //     message: 'Contact deleted'
    // });


});
app.get('/login',(req,res) => {
    res.render('login');
});
app.post('/profile', (req, res) => {
    const id = req.body.id;
    mod.find({id: id}).limit(1).then(facprofile => {
        console.log(JSON.stringify(facprofile[0].profile));
        let title = "", val = "";
        facprofile[0].profile.forEach(pro=>{
            title += (pro.title + '[+]') ;
            val += (pro.val + '[+]');
        });
        res.render('profile',{
            name: facprofile[0].name,
            id: facprofile[0].id,
            title: title.substring(0,title.length-3),
            val: val.substring(0,val.length-3)
        });
    });
});

//what I did in this put is took whole of the object and then pushed in the array my new one
//what I can do in the cross one is take all of the object and delete the particular with that title
app.put("/add", (req, res) => {
    mod.find({
        id: req.body.id
    }).limit(1).then(facprofile => {
        console.log(facprofile);
        var newprofilearr = facprofile[0].profile;
        newprofilearr.push({ title: req.body.title, val: req.body.val })
        var newfacprofile = new mod({
            name: facprofile[0].name,
            id: facprofile[0].id,
            pswd: facprofile[0].pswd,
            profile: newprofilearr
        })
        // Convert the Model instance to a simple object using Model's 'toObject' function
        // to prevent weirdness like infinite looping...
        var upsertdata = newfacprofile.toObject();
        delete upsertdata._id;
        console.log(upsertdata)
        // mod.update()
        mod.updateOne({
            id: req.body.id
        }, upsertdata, { upsert: true }, (e)=>{
            if(e) res.send('0');
            else res.send('1');
        });
    });

});
app.put("/del", (req, res) => {
    const id = req.body.id,
        title = req.body.title;
    console.log(id+" - "+title);
    mod.find({
        id: id
    }).limit(1).then(facprofile => {
        console.log(facprofile);
        var newprofilearr = [];//= facprofile[0].profile;
        facprofile[0].profile.forEach(element => {
            if(element.title!=title)
            {
                newprofilearr.push(element);
            }
        });
        // var newprofilearr=_.remove(facprofile[0].profile,function(obj){
        //     return obj.title!=req.body.title;
        // })
        // newprofilearr.push({ title: req.body.title, val: req.body.val })
        var newfacprofile = new mod({
            name: facprofile[0].name,
            id: facprofile[0].id,
            pswd: facprofile[0].pswd,
            profile: newprofilearr
        })
        // Convert the Model instance to a simple object using Model's 'toObject' function
        // to prevent weirdness like infinite looping...
        var upsertdata = newfacprofile.toObject();
        delete upsertdata._id;
        console.log(upsertdata)
        // mod.update()
        mod.updateOne({
            id: req.body.id
        }, upsertdata, { upsert: true }, (e)=>{
            if(e) res.send('0');
            else res.send('1');
        });

    });

})
app.get('/*',(req,res) => {
    res.redirect('/login');
});
app.listen(process.env.PORT || 3000, () => {
    console.log("listening at 3000");
});
