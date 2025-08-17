import {Server} from "http";

import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;
const port = 5000;



const startServer = async () => {
   try{
      await mongoose.connect(envVars.DB_URL);
    console.log("Connected to DB!!!")

   server = app.listen(port, ()=>{
         console.log("server  is listening to port 5000")
    })
   }
   catch (error){
    console.log(error)
   }
};
(
   async() => {
  await  startServer()
   await seedSuperAdmin()
}
)()




// *  signal termination sigterm
 process.on("SIGTERM", ()=>{
   console.log("uncaught exception  detected... Server shutting down ");
   if(server){
      server.close (()=>{
         process.exit(1)
      })
   }
   process.exit(1)
  })
 process.on("SIGINT", ()=>{
   console.log("sigint signal detected... Server shutting down ");
   if(server){
      server.close (()=>{
         process.exit(1)
      })
   }
   process.exit(1)
  })


// unhandled rejection error
  process.on("unhandledRejection", (err)=>{
   console.log("unhandled Rejection detected... Server shutting down ", err);
   if(server){
      server.close (()=>{
         process.exit(1)
      })
   }
   process.exit(1)
  })
//   Promise.reject(new Error("I forgot to catch this promise"))

  //uncaught rejection error

    process.on("uncaughtException", (err)=>{
   console.log("uncaught exception  detected... Server shutting down ", err);
   if(server){
      server.close (()=>{
         process.exit(1)
      })
   }
   process.exit(1)
  })

// throw new Error("I forgot to catch this promise")






/**
 * unhandled rejection error
 * uncaught rejection error
 *  signal termination sigterm 
 */