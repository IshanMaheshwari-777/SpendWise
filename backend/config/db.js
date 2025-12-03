import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn=await mongoose.connect(process.env.Mongo_URI)
console.log(`MongoDB Connected`);
}catch(err){
    console.error(`Error: ${err.message}`);
    process.exit(1);
}}