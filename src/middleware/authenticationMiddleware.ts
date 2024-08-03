import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/authentication.service";
import CustomRequest from "../types/CustomRequest.type";


const protect = async (req: Request, res: Response, next:NextFunction) =>{
  let token;

  if(!(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))) return res.status(401).send('Not authorized');

  token = req.headers.authorization.split(' ')[1];

  if(!token) return res.status(401).send('Not authorized');

  try{
    const user = await verifyToken(token);

    if(!user) {
      throw new Error('Authentication service is offline.');
    }

    (req as CustomRequest).user = user;
    next();
  }catch(err){
    console.log(err);
    res.status(401).send('Not authorized');
  }
}


export default protect;