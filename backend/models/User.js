import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    password:{
        type:String,
        required:true,
    },
    profileImageUrl:{
        type:String,
        default:null
    }
},{timestamps:true});

UserSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password=await bcrypt.hash(this.password,10);
    next();
});

UserSchema.methods.comparePassword=async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
};
export const User = mongoose.model('User', UserSchema);