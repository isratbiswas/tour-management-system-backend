/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import  { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { handlerDuplicateError } from "../helpers/handleDuplicateError";
import { handleValidationError } from "../helpers/handleValidation";
import { handlerCastError } from "../helpers/handleCastError";
import { handlerZodError } from "../helpers/handleZodError";
import { TErrorSources } from "../interfaces/error.types";


export const globalErrorHandler = (err: any , req:Request, res: Response, next: NextFunction) =>{
  /*
  * duplicate error 
   * cast error
   * validation error

  */

  if(envVars.NODE_ENV !== "development"){
    console.log(err);
  }

  let  errorSources : TErrorSources[] = [

  ]

           let statusCode =500
           let message =`something went wrong !!`


       //duplicate error

           if(err.code === 11000){
             console.log("Duplicate error", err.message); 
            const simplifiedError  = handlerDuplicateError(err)
             statusCode = simplifiedError.statusCode;
             message =  simplifiedError.message
           } 

           // Object Id error / cast error
            else if(err.name === "CastError"){
              const simplifiedError = handlerCastError(err)
                  statusCode =simplifiedError.statusCode;
                  message = simplifiedError.message;
            }
            // Zod error
            else if(err.name === "ZodError") {
              const simplifiedError = handlerZodError(err)
              statusCode = simplifiedError.statusCode
              message =  simplifiedError.message
              errorSources = simplifiedError.errorSources as TErrorSources[]  
            }
            

          // Mongoose Validation Error

            else if(err.name === "ValidationError"){
              const simplifiedError = handleValidationError(err)
                statusCode = simplifiedError.statusCode;
                errorSources = simplifiedError.errorSources as TErrorSources[];
                message = simplifiedError.message
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
            errorSources, 
            err : envVars.NODE_ENV === "development" ? err:null,
            stack: envVars.NODE_ENV === "development" ? err.stack : null
        })
}