import mongoose from "mongoose";
const schema = new mongoose.Schema({
 source:{type:String,enum:["manual","iot"],required:true},
 appliance:{type:String,default:"Smart meter"}, deviceId:{type:String,default:""},
 watts:{type:Number,default:0}, hoursPerDay:{type:Number,default:0}, days:{type:Number,default:1},
 voltage:{type:Number,default:0}, current:{type:Number,default:0}, power:{type:Number,default:0},
 energyKwh:{type:Number,required:true,min:0}, createdAt:{type:Date,default:Date.now}
});
export default mongoose.model("Reading",schema);
