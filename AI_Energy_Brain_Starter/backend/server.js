import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Reading from "./models/Reading.js";
dotenv.config();
const app=express(); app.use(cors({origin:"http://localhost:5173"})); app.use(express.json());
const RATE=Number(process.env.DEFAULT_RATE_PER_UNIT||7);
app.get("/api/health",(_,res)=>res.json({status:"ok"}));
app.get("/api/readings",async(_,res)=>res.json(await Reading.find().sort({createdAt:-1}).limit(100)));
app.post("/api/readings/manual",async(req,res)=>{
 const {appliance,watts,hoursPerDay,days=1}=req.body;
 const w=Number(watts),h=Number(hoursPerDay),d=Number(days);
 if(!appliance||!Number.isFinite(w)||!Number.isFinite(h)||!Number.isFinite(d)||w<=0||h<=0||h>24||d<=0||d>366)
  return res.status(400).json({message:"Enter valid appliance, watts, hours (max 24), and days."});
 const energyKwh=Number((w*h*d/1000).toFixed(3));
 res.status(201).json(await Reading.create({source:"manual",appliance,watts:w,hoursPerDay:h,days:d,energyKwh}));
});
app.post("/api/readings/iot",async(req,res)=>{
 if(!process.env.IOT_API_KEY||req.get("x-api-key")!==process.env.IOT_API_KEY) return res.status(401).json({message:"Invalid IoT API key"});
 const {deviceId="esp32",voltage=0,current=0,power=0,energyKwh}=req.body; const e=Number(energyKwh);
 if(!Number.isFinite(e)||e<0) return res.status(400).json({message:"energyKwh must be non-negative"});
 const record=await Reading.create({source:"iot",deviceId,voltage:Number(voltage),current:Number(current),power:Number(power),energyKwh:e});
 res.status(201).json({message:"IoT reading saved",record});
});
app.get("/api/summary",async(_,res)=>{
 const a=await Reading.find(); const sum=f=>a.filter(f).reduce((s,x)=>s+x.energyKwh,0);
 const total=a.reduce((s,x)=>s+x.energyKwh,0);
 res.json({totalKwh:+total.toFixed(3),estimatedCost:+(total*RATE).toFixed(2),manualKwh:+sum(x=>x.source==="manual").toFixed(3),iotKwh:+sum(x=>x.source==="iot").toFixed(3),records:a.length,ratePerUnit:RATE});
});
app.get("/api/recommendations",async(_,res)=>{
 const a=await Reading.find(), total=a.reduce((s,x)=>s+x.energyKwh,0), tips=[];
 if(!a.length) tips.push("Add appliance details or connect the ESP32 meter to begin.");
 if(total>10) tips.push("Recorded usage exceeds 10 kWh. Review high-wattage appliances and operating hours.");
 if(a.some(x=>x.source==="manual"&&x.hoursPerDay>=8)) tips.push("An appliance runs 8+ hours per day. Check whether its usage can be reduced.");
 if(a.some(x=>x.source==="iot")) tips.push("Compare readings by time of day to identify peak demand.");
 if(!tips.length) tips.push("Keep recording daily usage and compare weekly totals.");
 res.json({suggestions:tips,note:"Starter rule-based recommendations; not a trained AI diagnosis."});
});
mongoose.connect(process.env.MONGODB_URI).then(()=>app.listen(process.env.PORT||5000,()=>console.log("API running on port 5000"))).catch(e=>{console.error(e);process.exit(1)});
