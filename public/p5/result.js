function setup() {
    createCanvas(200,200).parent('canv');
    console.log("hello");
    res=document.getElementById("Res").innerHTML;
    resSorted=res.split('').sort().join('');
    for(let i=res.length-1;i>0;i--){
        let c =getColor(res[i]);
        let diameter=i===res.length?width*2:((i*width)/res.length)*2;
        console.log(res[i]+' '+res.charCodeAt(i)+' '+diameter)
        noStroke();
        fill(c);
        circle(100,100,diameter);
    }
}

function getColor(n){
    console.log(n)
    let colors={
        '0':'lightseagreen',
        '1':'lightsalmon',
        '2':'lightcoral',
        '3':'lightblue',
        '4':'lightslategray',
        '5':'lightslategrey',
        '6':'lightpink',
        '7':'lightgrey',
        '8':'lightgreen',
        '9':'lightcyan',
        'a':'lightgoldenrodyellow',
        'b':'lightskyblue',
        'c':'lightsteelblue',
        'd':'lightyellow',
        'e':'peachpuff',
        'f':'black'
    }
    console.log(colors[n])
    return colors[n];
}

function draw(){
}

function mousePressed(){
    //save("generated rainbow.png"); 
}