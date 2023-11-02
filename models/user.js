import mongoose from 'mongoose';
const {Schema}=mongoose;
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const userSchema= new Schema({
    name:{
        type:String,
        trim: true,
        required:true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        trim: true,
        required:true,
        min:8,
        max:25,
    },
},
{timestamp:true}
);
export default mongoose.model("User", userSchema);