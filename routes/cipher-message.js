var express = require('express');
var router = express.Router();
const crypto = require('crypto');
var checkInput=require('../scripts/utils')
var createError = require('http-errors');
//configuration to cipher or decipher messages
const config=require('../config.json')
const {algorithm,password,salt}= config.cipherVariables.standard;
const key = crypto.scryptSync(password, salt, 24);
const iv = Buffer.alloc(16, 0);

function cipher(message){
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decipher(encrypted){
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

router.get('/', function(req, res, next) {
    res.render('cipherForm', { title: 'Cipher message',description:'Cipher a text message' });
});

router.post('/',function(req,res,next){
    //TO-DO validate input
    let message;
    let typeOfRes;
    if(!checkInput(req.body.myMessage)){
      next(createError(400,'Invalid input'))
    }else{
      if(req.body.hasOwnProperty('cipher')){
          message=cipher(req.body.myMessage);
          typeOfRes='text-cipher'
      } else {
          message=decipher(req.body.myMessage);
          typeOfRes='text-decipher'
      }
      res.render('result',{ title: 'Cipher message',typeOfRes,description:'Here is your secret and a design made with it:',result:message})
    }
});
  
  module.exports = router;