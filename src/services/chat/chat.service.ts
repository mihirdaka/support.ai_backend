
// Utilities
import Encryption from '../../utilities/encryption.utility';
// import ApiUtility from '../../utilities/api.utility';
import DateTimeUtility from '../../utilities/date-time.utility';
// Errors
import { StringError } from '../../errors/string.error';
import { dataSource } from '../../configs/orm.config';
import exp from 'constants';
const fs = require('fs');

import OpenAI from "openai";
import constants from '../../constants';
import path from 'path';

const openai = new OpenAI({
  apiKey: constants.APPLICATION.openApi.key,
});


const chat = async (params: any) => {

  try {

    var message  = [];
    
   if (params.context.length > 0) {
      message = params.context.map((message: any) => ({
        role: message.role,
        content: message.content,
      }));
   }
    message.push(
      {
        role: "user",
        content: params.messageContent,
      }
    );
    

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful chatbot." },
        ...message,

      ],

      model: "gpt-3.5-turbo",
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    let response = completion.choices[0].message;

    return response;
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    throw new StringError("Error in chat endpoint");
  }
}

const talk = async (params: any) => {

  try {
    const response = await openai.audio.transcriptions.create(
      {
        file: fs.createReadStream(params.audio.path),
        model: "whisper-1",
        language: "en",
        response_format: "text",

      }
    ); 
    
    if(response){
      const chatParams: any = {
        messageContent: response,
        context:[]
      }
      var textResponse = await chat(chatParams);

      const params1 : any = {
        content: textResponse.content,
        // outputName : params.audio.originalname,
        audio : params.audio
      }
      var audioResponse = textToSpeech(params1);
      return audioResponse;
    }
    // return response;
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    throw new StringError("Error in chat endpoint");
  }
}


const textToSpeech = async (params: any) => {
const speechFile = path.resolve('uploads/output/' + params.audio.originalname );

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input: params.content,
  });

  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);

  // once the file is returned we can delete the file
  // delete the original audio file

  fs.unlink(params.audio.path, (err: any) => {
    if (err) {
      console.error(err)
    }
  })
  

  // cannot delete the output file as that has to be deliverd to user
  //#TODO: find a way to delete output file
  return speechFile;
  
}


export default {
  chat,
  talk,
}