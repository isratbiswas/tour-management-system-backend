/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userTokens";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = CatchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const loginInfo = await AuthServices.credentialsLogin(req.body)
    // res.cookie("accessToken", loginInfo.accessToken,{
    //     httpOnly: true,
    //     secure: false
    // })
    // res.cookie("refreshToken", loginInfo.refreshToken,{
    //     httpOnly: true,
    //     secure: false,

    // })

    setAuthCookie(res, loginInfo)
  
    sendResponse(res , {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged in Successfully",
        data: loginInfo
    })
})
const getNewAccessToken = CatchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const refreshToken = req.cookies.refreshToken;
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string )
  setAuthCookie(res, tokenInfo)
    sendResponse(res , {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrieved in Successfully",
        data: tokenInfo
    })
})
const logout = CatchAsync(async(req: Request, res: Response, next: NextFunction)=>{
  
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax" 
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax" 
    })
    sendResponse(res , {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged out Successfully",
        data: null
    })
})
const resetPassword = CatchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)

    sendResponse(res , {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null
    })
})
const googleCallBackController = CatchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const user = req.user;
    console.log("user", user);
    if(!user){
        throw new AppError(httpStatus.NOT_FOUND, "User not Found")
    }
    const tokenInfo= createUserTokens(user)
    setAuthCookie( res, tokenInfo)
    res.redirect(`${envVars.FRONTEND_URL}/booking`)
    
})

export const AuthControllers= {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallBackController
}