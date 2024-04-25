'use strict'

class Snake{
    constructor(idCanva, tamCanva, colorBackground, colorLineGrid){
        this.idCanva = idCanva;
        this.tamcanva = tamCanva;
        this.colorBackground = colorBackground;
        this.colorLineGrid = colorLineGrid;
    }

    gameComplete(){
        let canva = document.querySelector(`#${this.idCanva}`);
        let ctx = canva.getContext("2d");
        let gameOver;

            //Primero indicamos el tamaño del canva, sera el mismo de la pantalla
    canva.width =this.tamCanva;
    canva.height = this.tamCanva;

    //Dibujamos el fondo
    ctx.fillStyle = this.colorBackground;
    ctx.fillRect(0, 0, canva.width, canva.height);

    //No podemos dejar el tamaño estandar de un pixel ya que es muy grande, aqui dividiremos la pantalla por el tamaño del pixel que queremos
    let canvaX = Math.abs(canva.width / 10).toFixed(0);//10 es el tamaño de pixel que queremos
    let canvaY  = Math.abs(canva.height / 10).toFixed(0);
    let matrix = new Array();

    function randomMatrix(){
        //Bucle for que recorrera la matriz o nuestro canvaX en los pixeles que queremos
        for(let i = 0; i<canvaX; i++){
            matrix[i] = new Array();
            for(let j = 0; j<canvaY; j++){
                //Aqui le asignaremos a cada elemento de nuestra matrix un valor random
                console.log(Math.floor(Math.random() * 2));
                matrix[i][j] = Math.floor(Math.random() * 2);
            }
        }
    }

    function renderMatrix(){
        for(let i = 0; i<canvaX; i++){
            for(let j = 0; j<canvaY; j++){

                if(matrix[i][j] == 0){
                    ctx.fillStyle = "black";
                    //Pasamos como parametros los tamaños en X y en Y de nuestros pixeles luego el tamaño que va adquirir apartir de nuestro pixel
                    ctx.fillRect(i*10, j*10, 10, 10);
                }else{
                    //Aqui aquellos pixeles con valor de 1 se pintaran de blanco, mas adelante hare un metodo que limpie todos aquellos pixeles que se pinten de blanco
                    ctx.fillStyle = "white";
                    ctx.fillRect(i*10, j*10, 10, 10);
                }

            }
        }
    }

    function clearMatrix(){
        for(let i = 0; i<canvaX; i++){
            matrix[i] = new Array();
            for(let j = 0; j<canvaY; j++){
                //Aqui hacemos que todo sea negro, es decir limpiamos nuestra matrix
                matrix[i][j] = 0;
            }
        }
    }

    //Con esta funcion dibujaremos las lineas separadoras de cada pixel, en forma vertical y horizontal
    function renderGrid(){
        //Trazamos las lineas de manera vertical
        for(let i = 0; i<canva.width; i+=10){
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canva.height);
            ctx.strokeStyle = this.colorLineGrid;
            ctx.lineWidth = 0.1;
            ctx.stroke();
        }
        //Trazamos las lineas de manera horizontal
        for(let j = 0; j<canva.height; j+=10){
            ctx.beginPath();
            ctx.moveTo(0, j);
            ctx.lineTo(canva.width, j);
            ctx.strokeStyle = this.colorLineGrid;
            ctx.lineWidth = 0.1;
            ctx.stroke();
        }
    }

    let game = {
        level: 1
    }
    let player = {
        x: 50, 
        y: 60, 
        dir: 0, 
        dirAnt: 0,
        tam: 1,
        pts: 0, 
        vel: 20,
        tiempo:0,
        matrixComi: [],
        xAnt: 0, 
        yAnt: 0,
    }
    let pixelComida = {
        x: 0,
        y: 0, 
        comida: 1
    }

    function createFood(){
        //Aqui crearemos los puntos donde se creara la comida de manera aleatoria pero todavia falta renderizarla, ya que esto no le cambia el valor a la matrix por lo que su valor en ese punto sera 0 todo el tiempo y no podra pintarse de blanco
        pixelComida.x = Math.floor(Math.random() * canvaX);//Creamos un pixel de comida en un espacio de la matrix en el eje x
        pixelComida.y = Math.floor(Math.random() * canvaY);
    }

    //Aqui le asignamos el valor de 1 al pixel de la comida en la posicion ya creada para asi pintar ese pixel, para asi ser mostrado
    function renderFood(){
        if(pixelComida.comida == 1){
            matrix[pixelComida.x][pixelComida.y] = 1;
        }
    }

    function renderPlayer(){
        if(player.dir == 1){
            //Aqui verificamos si el jugador se quiere devolver no podra y se mantendra igual 
            if(player.dirAnt == 3){
                player.dir = 3;
            }else{
                player.x++;
            }
        }

        if(player.dir == 3){
            //Aqui indicamos igual si la posicion anterior del jugador es 2 no va a poder devolverse
            if(player.dirAnt == 1){
                player.dir = 1;
            }else{
                player.x--;
            }
        }

        if(player.dir == 0){
            if(player.dirAnt == 2){
                player.dir = 2;
            }else{
                player.y--;
            }
        }

        if(player.dir == 2){
            if(player.dirAnt == 0){
                player.dir = 0;
            }else{
                player.y++;
            }
        }

        player.dirAnt = player.dir;

        //Creando la cola de la serpiente al comer
        for(let i = 0; i<player.matrixComi.length ;i++){
            //Aqui vamos renderizando o pintando de blanco la cola
            let x = player.matrixComi[i][0];
            let y = player.matrixComi[i][1];

            //Aqui al comer o pasar en la posicion de la comida la pintamos de manera permanente en blanco pero no nos sigue para eso hay que recorrer las matrix de la comida
            matrix[x][y] = 1;
        }

        //Recorremos la matrixComi
        for(let i = 0; i<player.matrixComi.length; i++){
            //Con esta condicion hacemos que nos siga la cola cuando vayamos comiendo

            if(i == player.matrixComi.length-1){
                //En x, aqui con el xAnt hacemos que la ultima posicion de la cola tomara la ultima posicion del jugador
                player.matrixComi[i][0] = player.xAnt;
                //En y
                player.matrixComi[i][1] = player.yAnt;
            }else{
                player.matrixComi[i][0] = player.matrixComi[i+1][0];
                player.matrixComi[i][1] = player.matrixComi[i+1][1];
            }
        }




        //Dibujando al jugador dentro del canva(serpiente)

        //Aqui lo que estamos haciendo es crear la condicion que cuando llegue al final del canva se regrese al principio, efecto de teletransportacion

        if(player.x > canvaX-1){
            player.x = 0;
            // gameOver = true;
        }else if(player.x <= 0){
            player.x = canvaX - 1;
            // gameOver = true;
        }else if(player.y > canvaY-1){
            // gameOver = true;
            player.y = 0;
        }else if(player.y <= 0){
            player.y = canvaY-1;
            // gameOver = true;
        }

        // console.log(player.x, player.y)
        matrix[player.x][player.y] = 1;

        //Aqui vamos darle gameOver(true) si el jugador choca con la cola de la serpiente
        // for(let i = 0; i<player.matrixComi.length; i++){
        //     if(i !== 0 && player.matrixComi[0][1] === player.matrixComi[i][1] && player.matrixComi[0][0] === player.matrixComi[i][0]){
        //         gameOver = true
        //     }
        // }

        //Aqui codificamos la colision si el jugador y la comida coinciden que se sume a la cola y ademas cambie la posicion de la comida de manera aleatoria
        if(player.x == pixelComida.x && player.y == pixelComida.y){
            console.log("Comiendo");
            createFood();

            player.matrixComi.push([player.xAnt, player.yAnt])
            console.log(player.matrixComi)

            player.pts++;
            console.log(player.pts)



        }
        player.xAnt = player.x;
        player.yAnt = player.y;


    }

    function viewPoints(){
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Score:" +player.pts,20,30)


    }
    function endGame(){
        clearInterval(mySetInterval);
        alert("Game over!!")
        location.reload();


    }

    function gameSnake(){

        if(gameOver == true) return endGame();
        //Pone la matriz en 0
        clearMatrix();

        //Agrega un valor aleatoria a la comida
        // createFood();
        //Le asigna 1 a esa posicion
        renderFood();
        renderPlayer();

        //Renderiza la matrix en su capa
        renderMatrix();

        //Renderiza las lineas en la capa de los canva
        renderGrid();

        viewPoints();


        //Le damos movimiento a nuestra snake con teclas especificas
        window.addEventListener("keydown", (e)=>{
            // console.log(e);
            let press = e.code;

            if(press == "ArrowLeft"){//izquierda
                player.dir = 3;
            }else if(press == "ArrowUp"){//arriba
                player.dir = 0;
            }else if(press == "ArrowRight"){//derecha
                player.dir = 1;
            }else if(press == "ArrowDown"){//abajo
                player.dir = 2;
            }
        })


    }


    clearMatrix();
    createFood();

    let mySetInterval = setInterval(gameSnake, 125)


    }

}

let myGame = new Snake("miCanva", 800, "black", "white");
myGame.gameComplete();



