

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = async function(){

    var canvas = document.getElementById('canvas');
    
    var ctx = canvas.getContext('2d'); // devuelve un CanvasRenderingContext2D
    

    ctx.fillStyle = "black"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    
    ctx.lineWidth = 2;
    
    
    const MAX_REBOTES = 92;

    const VSPEED = 85;

    
    var newx = 0;
    var newy = 0;


    var izq_move = 1;
    var abajo_move = 1;

    var aux = 0;
    // tiene algunos errores cuando vspeed es mayor que 600 creo
    for(var i = 0; (i < MAX_REBOTES); i++){
        ctx.strokeStyle = `rgba(0,255,0, ${(MAX_REBOTES-i)/MAX_REBOTES})`;
        ctx.beginPath();
        ctx.moveTo(newx,newy);


        if (aux > 0){
            newy += abajo_move * aux;
            newx += aux/VSPEED*canvas.width*izq_move;
            izq_move = -izq_move;
            aux = 0;
        } else {
            newy += abajo_move*VSPEED;

            if (newy >= canvas.height){
                aux = newy - canvas.height;
                newy = canvas.height;
                newx += (VSPEED-aux)/VSPEED*canvas.width*izq_move;
                abajo_move = -abajo_move;
            } else if (newy <= 0) {
                aux = 0 - newy;
                newy = 0;
                newx += (VSPEED-aux)/VSPEED*canvas.width*izq_move;
                abajo_move = -abajo_move;
            } 
            else {
                newx += canvas.width * izq_move
                izq_move = -izq_move
            }
        }
        console.log(newx,newy)
        ctx.lineTo(newx,newy);


        ctx.stroke();

        await sleep(10);

        

    }


}