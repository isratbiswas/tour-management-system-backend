/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import  { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = (err: any , req:Request, res: Response, next: NextFunction) =>{
  /*
  * duplicate error 
   * cast error
   * validation error

  */

  const errorSources : any = [

  ]



           let statusCode =500
           let message =`something went wrong !!`
           
           //duplicate error
           if(err.code === 11000){
             console.log("Duplicate error", err.message); 
           const duplicate = err.message.match(/"([^"]*)"/ )
           console.log(duplicate);
             statusCode = 400;
             message = `${duplicate[1]} already exists !!!`;
           } 

           // Object Id error / cast error
            else if(err.name === "CastError"){
                  statusCode =400;
                  message = "Invalid Mongodb ObjectID. Please provide a valid id" 
            }
            // Zod error
            else if(err.name === "ZodError") {
                statusCode = 400
                message = "Zod Error" 
                console.log(err.issues);
                err.issues.forEach((issue : any) => {
                    
                })
            }
          // Mongoose Validation Error
            else if(err.name === "ValidationError"){
                statusCode = 400;
                const errors = Object.values(err.error )
                errors.forEach((errorObject: any) => errorSources.push({
                    path: errorObject.path,
                    message: errorObject.message
                }))
                message = "Validation Error"
            }

           
          else if(err instanceof AppError){
            statusCode =err.statusCode
            message = err.message
           }
           else if (err instanceof Error){
            statusCode = 500;
            message =err.message;

           }

           res.status(statusCode).json({
            success: false,
            message, 
            err,
            stack: envVars.NODE_ENV === "development" ? err.stack : null
        })
}