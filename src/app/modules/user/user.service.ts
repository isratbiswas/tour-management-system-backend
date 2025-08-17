import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// problem
const createUser = async(payload: Partial<IUser>) =>{
    const { email , password, ...rest} = payload;
    const isUserExist = await User.findOne({email})
    if(isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, 'user already exist ')
    }
    const hashedPassword = await bcryptjs.hash(password as string , Number(envVars.BCRYPT_SALT_ROUND))
    const authProvider : IAuthProvider= {provider : "credentials" , providerId: email as string}
    const user = await User.create({
    
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })
    return user
}


const updateUser = async(userId : string , payload: Partial<IUser>, decodedToken: JwtPayload)  =>{
    console.log(payload, " string");
    if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
        if(userId !== decodedToken.userId){
            throw new AppError(401, "You are not authorized");
            
        }
    }

    const isUserExist = await User.findById(userId);
    console.log(isUserExist, "user exist");
     if(!isUserExist) {
        throw new AppError( httpStatus.NOT_FOUND, "User not Found"); 
     }
     //problem
     if(decodedToken.role === Role.ADMIN && isUserExist.role === Role.SUPER_ADMIN){
        throw new AppError(401, "you are not authorized")
     }
    /**
     * email -can not update
      * name ,phone , password , address
      * password - re hashing
      * only admin superadmin -role, isDeleted ...
      * promoting to superadmin - superadmin
     */
    if(payload.role){
         if(decodedToken.role === Role.USER || decodedToken.role == Role.GUIDE){
            throw new AppError (httpStatus.FORBIDDEN, "You are not authorized")
         }
    }

    if(payload.isActive || payload.isDeleted || payload.isVerified){
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
            throw new AppError (httpStatus.FORBIDDEN, "You are not authorized")
        }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true})
    console.log(newUpdatedUser, "newUpdate user");
    return newUpdatedUser

}


const getAllUsers = async () =>{
    const users = await User.find();
 const totalUsers =await User.countDocuments();
  return {
    data: users,
    meta: {
       total: totalUsers
    }
  }
}


export const UserServices = {
    createUser,
    getAllUsers,
    updateUser
}

// routing matching -> controllers -> services -> models -> DB
//          4th             3rd         2nd        1st     