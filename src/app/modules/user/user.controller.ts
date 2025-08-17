/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
// import AppError from "../../errorHelpers/AppError";
import { CatchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";


// const createUser = async(req: Request, res:Response, next:NextFunction) =>{
//     try{
//         throw new AppError(httpStatus.BAD_REQUEST, "fake error"); 
//         const user = await UserServices.createUser(req.body)
//         res.status(httpStatus.CREATED).json({
//             message: "User created successfully",
//             user
//         })

//     }
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     catch(err : any){
//         console.log(err);
//           next(err)
//     }

// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = CatchAsync(async(req: Request, res:Response, next:NextFunction)=>{
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
        success:true,
        statusCode: httpStatus.CREATED,
        message: "User created successfully",
        data: user
    })
})
const updateUser = CatchAsync(async(req: Request, res:Response, next:NextFunction)=>{
    const userId = req.params.id;
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    const verifiedToken = req.user;
    const payload = req.body;

    const user = await UserServices.updateUser(userId, payload, verifiedToken );

    sendResponse(res, {
        success:true,
        statusCode: httpStatus.CREATED,
        message: "User Updated successfully",
        data: user
    })
})



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUsers =  CatchAsync(async(req: Request, res:Response, next:NextFunction) => {
  const result= await UserServices.getAllUsers();
   sendResponse(res, {
        success:true,
        statusCode: httpStatus.OK,
        message: "All Users Retrieved successfully",
        data: result.data,
        meta: result.meta
    })

})
// const getAllUsers = async(req: Request, res:Response, next:NextFunction) => {
//     try{
//         const users= await UserServices.getAllUsers();
//         return users
//     }
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     catch(err : any){
//        console.log(err);
//           next(err)
//     }

// }

export const UserControllers = {
     createUser,
     getAllUsers,
     updateUser
}