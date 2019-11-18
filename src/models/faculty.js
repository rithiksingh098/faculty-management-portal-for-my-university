const mongoose=require('mongoose');
//first we create the schema
const profile=new mongoose.Schema({
    title : String,
    val : String
});
const facultyschema=new mongoose.Schema({
    name : String,
    id : Number,
    pswd : String,
    profile: [profile]
});
mongoose.exports= mongoose.model('Faculty',facultyschema);