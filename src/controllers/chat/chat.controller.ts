import IController from "IController";
// import ApiResponse from "src/utilities/api-response.utility";

import httpStatusCodes from 'http-status-codes';

import { StringError } from '../../errors/string.error';

const fs = require('fs');
// Services
import chatService from '../../services/chat/chat.service';

// Utilities
import ApiResponse from '../../utilities/api-response.utility';


const chat: IController = async (req, res) => {
    try {
      
      const params: any = {
        messageContent: req.body.messageContent,
        context: req.body.context,
      }
      const data = await chatService.chat(params);

      return ApiResponse.result(res, data, httpStatusCodes.OK);
    } catch (e) {
    return ApiResponse.error(res, httpStatusCodes.BAD_REQUEST, e.message);
      // console.log(e);
    }
  };

  const talk: IController = async ( req: any,res:any) => {
    //  console.log(req.file);
   try {
     const params : any= {
       audio: req.file,
     }
     const data = await chatService.talk(params);
 
 
     
    fs.readFile(data, function(err : any, result : any) {
      res.contentType("audio/mp3");
        
       res.send(result);
    });
    
   } catch (error) {
    return ApiResponse.error(res, httpStatusCodes.BAD_REQUEST, error.message);
    
   }
    
};

  export default {
    chat,
    talk,
  }