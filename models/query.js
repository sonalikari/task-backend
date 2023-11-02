import mongoose from 'mongoose';
const {Schema}=mongoose;
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const querySchema= new Schema({
    name:{
        type:String,
        trim: true,
        required:true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid Email'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid Email']
    },
    contact:{
        type:Number,
        trim: true,
        required:true,
    },
    address:{
        type:String,
        trim: true,
        required:true,
    },
    message:{
        type:String,
        trim: true,
        required:true,
    },
},
{timestamp:true}
);
export default mongoose.model("Query", querySchema);