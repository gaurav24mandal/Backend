import dotenv from "dotenv"


import connectDb from "./db/index.js"
dotenv.config({path: './.env'})
import app from "./app.js"

connectDb()
.then(( )=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`⚙️ Server is running at port :${process.env.PORT} `);
        
        
    } )
    
})
.catch((err)=>{
    console.log("MONGO DB connection failed !!!", err);
    
})

