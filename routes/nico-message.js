var express = require('express');
var router=express.Router();

router.get('/',function(req,res,next){
    res.render('nicoForm',{ title: 'Nico message',description:'Resort your message with a key' })
})

router.post('/',function(req,res,next){
    let typeOfRes='nico',myNicoResult,{myKey:key,myMessage:message}=req.body;
    if(req.body.hasOwnProperty('nico')){
        myNicoResult=nico(key,message);
    }else{
        myNicoResult=deNico(key,message);
    }
    console.log(req.body);
    console.log(myNicoResult+'.');
    res.render('result',{ title: 'Nico message',typeOfRes,description:'Here is your message:',result:`"${myNicoResult}".`})
})

function nico(key, m)  {
    var messageMatr=[]
    for(var j=0;j<Math.ceil(m.length/key.length);j++)
       for(var i=0;i<key.length;i++)
         messageMatr[i]?messageMatr[i].value+=m[(j*key.length)+i]||' ':
          messageMatr[i]={key:key[i],value:m[(j*key.length)+i]||' '};  
    messageMatr=messageMatr.sort((a,b)=>a.key.charCodeAt()-b.key.charCodeAt())
    m=''
    for(var k = 0;k<messageMatr[0].value.length;k++)
      for(var h =0; h<key.length;h++)
          m+=messageMatr[h].value[k]
    return m;
}

function deNico(key, m){ 
    var messageMatr=[],sortedK=key.split('').sort().join('')
    for(var j=0;j<Math.ceil(m.length/key.length);j++)
       for(var i=0;i<key.length;i++)
         messageMatr[i]?messageMatr[i].value+=m[(j*key.length)+i]||' ':
          messageMatr[i]={key:key.indexOf(sortedK[i]),value:m[(j*key.length)+i]||' '};
    messageMatr=messageMatr.sort((a,b)=>a.key-b.key)
    m=''
    for(var k = 0;k<messageMatr[0].value.length;k++)
      for(var h =0; h<key.length;h++)
          m+=messageMatr[h].value[k]
    m=m.replace(/\s+$/g,'')    
    return m;
}

module.exports= router;