var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var multer =require('multer');
var upload=multer({dest:'tmp/'});
var fs = require('fs');
var jimp = require('jimp');

router.get('/', function(req, res, next) {
    res.render('imageForm', { title: 'Image message',description:'Hide a text message inside an image' });
  });
  
router.post('/',upload.single('image'),function(req,res,next){
    //check file exist
    let messageFile;
    let supported=false;
    try{
      if(!req.file){
        next(createError(400,'No file in request'));
      }else{
        messageFile=req.file;
        fileType=req.file.mimetype.match(/\/.*/g)[0];
        console.log(fileType)
        switch(fileType){
          case '/png':
          case '/jpeg':
          case '/bmp':
          case '/tiff':
          case '/gif':
            supported=true;
            break;
        }
        if(!supported){
          next(createError(400,"File type not supported"));
        }else{
          let bodyCopy=new Object();
          Object.assign(bodyCopy,req.body);    
          if('saveOnImg' in bodyCopy){
                console.log('has save on img!')
            if(req.body.message){
              writeImage2(messageFile.filename,req.body.message,res);
            }else{
              next(createError(400,'Invalid input'));
            }
          }else{
            console.log('start read of message!')
            readImage2(messageFile.filename,res)
          }
        }
      }
    }catch(err){
      next(createError(500,err));
    }    
  })
  
  function writeImage2(imgName,rawMessage,res){
    let message=turnMsgToBin(rawMessage).split('');
    console.log(message);
    jimp.read('tmp/'+imgName,(err,img)=>{
      if(err) throw err;
      img.scan(0, 0, img.bitmap.width, img.bitmap.height, function(x, y, idx) {
        if(message.length){
          //write bits into img
          let binaryBit=this.bitmap.data[idx + 3].toString(2);
            binaryBit=binaryBit.substr(0,binaryBit.length-1)+message.shift();
            this.bitmap.data[idx + 3]=parseInt(binaryBit,2);
            if(message.length==0){
              this.write("public/images/"+imgName);
              res.render('result',{title: 'Image message',description:'Your message is now inside the image:',typeOfRes:'img-cipher',imageName:imgName});
            }
        }
      });
    })
  }
  
  function turnMsgToBin(rawMessage){
    let message=rawMessage+'-tophatend';
      console.log("this is ready!")
      message=message.split('');
      message=message.map(i=>{let bitChain =i.charCodeAt(0).toString(2);
        let ceros=7-bitChain.length;
        return ceros>0?'0'.repeat(ceros)+bitChain:bitChain;
      })
    return message.join('');
  }
  
  function readImage2(imgName,res){
    var message=''
    let currentByte='';
    let messageFound=false;
    jimp.read('tmp/'+imgName,(err,img)=>{
      if(err) throw err;
      img.scan(0, 0, img.bitmap.width, img.bitmap.height, function(x, y, idx) {
        if(message.includes('-tophatend')&&!messageFound){
          let resMessage=message.replace('-tophatend','')
          console.log(resMessage);
          res.render('result',{title: 'Image message',description:'This is the secret that was inside your image:',result:resMessage,typeOfRes:'img'});
          messageFound=true;
        }
        if(!messageFound){
          var binBit = this.bitmap.data[idx + 3].toString(2);
          currentByte=currentByte+binBit[binBit.length-1];
          if(currentByte.length===7){
            message=message+String.fromCharCode(parseInt(currentByte,2))
            currentByte='';
          }
        }
      })
    })
  }
  
module.exports = router;


