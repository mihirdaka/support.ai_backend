import express from "express";
import bodyParser from "body-parser";


import multer, {  StorageEngine } from 'multer';

// const upload = multer({ dest: 'uploads/audio/' ,});
const upload : StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/audio/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
const router = express.Router();
import chatController from '../../controllers/chat/chat.controller';

// router.get("/", (req, res) => {
//   res.send("Welcome to Custom ChatGPT...!");
// });

// router.post("/talk", async (req, res) => {

// });
router.post(
    '/text',
    chatController.chat,
);



router.put('/talk',multer({ storage : upload }).single('audio'), chatController.talk);
  


export default router;  