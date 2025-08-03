const mongoose=require("mongoose")
const {Schema}=require("mongoose")
const TechShop=require("./techshopModel")

const userSchema=new Schema({
    username:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,enum:["owner","customer","technician"],required:true,default:"customer"}
},{timestamps:true})

userSchema.post("findOneAndDelete",async function (user){
    if(user && user.role==="owner"){
        const res=await TechShop.deleteMany({owner:user._id})
        console.log(res)
    }
})

const User=mongoose.model("User",userSchema)

module.exports=User