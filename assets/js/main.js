
// Variables
let deck                = [];
const palos             = ['D','C','H','S'];
const especiales        = ['A','J','Q','K'];
let puntosJugadores     = [];
let ganadasJugador      = localStorage.getItem('historialjugador')*1||0;
let ganadasComputadora  = localStorage.getItem('historialcomputadora')*1||0;
let tJugador        = 0;
let tComputadora    = 1;

//Referencias 
const btnPedir                  = document.querySelector('#btnPedir');
const btnDetener                = document.querySelector('#btnDetener');
const btnNuevo                  = document.querySelector('#btnNuevo');
const btnReglas                 = document.querySelector('#btnReglas');
const puntosHTML                = document.querySelectorAll('small');
const ganadasHTML               = document.querySelectorAll('b');
const reglasHTML                = document.querySelector('#reglas');
const divCartasJugadores        = document.querySelectorAll('.divCartas');


ganadasHTML[0].innerText         = ganadasJugador;
ganadasHTML[1].innerText         = ganadasComputadora;


const comenzarJuego = () => {
    deck = crearMazo();
    puntosJugadores=[0,0];
    divCartasJugadores[0].innerHTML = '';
    divCartasJugadores[1].innerHTML = '';
    reglasHTML.innerHTML = '';
    puntosHTML[0].innerText = 0;
    puntosHTML[1].innerText = 0;
}

//Crear Mazo 
const crearMazo = () => {

    deck=[];
    for(let i = 2; i<=10; i+=1){
        for(let palo of palos){
            deck.push(i + palo)
        }
    }
    for(let palo of palos){
        for(let especial of especiales){
            deck.push(especial + palo)
        }
    }

    return     mezclarCartas(deck);
    
}

//Mezclar las cartas
const mezclarCartas = (arr) =>{
    for(let i =arr.length-1 ; i>0 ;i-=1){
        let j = Math.floor( Math.random() * (i + 1) ); 
        [arr[i],arr[j]]=[arr[j],arr[i]]; 
    }
    return arr;
}

//Pedir una carta del Mazo
const pedirCarta = () =>{
    return  deck.pop();    
}

// Calcula el valor de una carta. 
const valorCarta= (carta) => {
    const valor = carta.substring(0, carta.length-1);
    let puntos = 0;
    if(isNaN(valor)){
        if(valor === 'A'){
            puntos = 11;
        }else{
            puntos = 10;
        }
    } else{
        puntos =+ valor;
    }
    return puntos;
}

const acumularPuntos = (carta, turno) => {
    puntosJugadores[turno]= puntosJugadores[turno]+valorCarta(carta);
    puntosHTML[turno].innerText = puntosJugadores[turno];
    return puntosJugadores[turno];
}


const crearCarta = (carta, turno) => {
    const imgCarta = document.createElement('img');
    imgCarta.src = `assets/cartas/${carta}.png`;
    divCartasJugadores[turno].append(imgCarta);
}

//  Turno computadora

const turnoComputadora = (puntosMinimos) => {
    let puntosComputadora = 0;
    do{
        const carta = pedirCarta();
        puntosComputadora = acumularPuntos(carta,tComputadora);
        crearCarta(carta,tComputadora);

        if(puntosMinimos > 21){
            break;
        }
    } while((puntosComputadora <= puntosMinimos) && (puntosMinimos <= 21) );

    determinaGanador();
}

const determinaGanador = () =>{
   const [puntosMinimos, puntosComputadora] = puntosJugadores;
   
   setTimeout(()=>{
    if (puntosComputadora === puntosMinimos){
        alert('Empate');

    } else if ( puntosMinimos > 21){
        ganadasComputadora += 1;
        ganadasHTML[1].innerText = ganadasComputadora;
        localStorage.setItem('historialcomputadora', ganadasComputadora);
        Swal.fire({
            icon: 'error',
            title: 'Gana la computadora'
        });


    }else if (puntosComputadora >21){
        ganadasJugador +=1;
        ganadasHTML[0].innerText = ganadasJugador;
        localStorage.setItem('historialjugador', ganadasJugador);
        Swal.fire({
            icon: 'success',
            title: 'Muy Bien! Ganaste'
        });

    }else{
        console.log(ganadasComputadora)
        ganadasComputadora += 1;
        ganadasHTML[1].innerText = ganadasComputadora;
        localStorage.setItem('historialcomputadora', ganadasComputadora);
        Swal.fire({
            icon: 'error',
            title: 'Gana la computadora'
        });
        
    }
}, 100); 
}




const mostrarReglasTXT = ()=>{
    fetch("assets/data/reglas.txt")
        .then((res)=>           
            res.text()
        )    
        .then((res)=>{
            reglasHTML.innerHTML = `<p class="tarjeta">${res}</p>`
        })

}

// Eventos
//Boton pedir Carta
btnPedir.addEventListener('click', () => {
    
    const carta = pedirCarta();
    const puntosJugador = acumularPuntos(carta,tJugador);
    crearCarta(carta,tJugador);

    

    if(puntosJugador > 21){
        console.warn('Lo siento mucho perdiste');
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugador);

    } else if (puntosJugador === 21){
        console.warn('21, Muy Bien');
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugador);
    }
});

//Boton detener
btnDetener.addEventListener('click', ()=>{

    btnPedir.disabled = true;
    btnDetener.disabled = true;
    turnoComputadora(puntosJugadores[0]);
});


// Boton Nuevo Juego
btnNuevo.addEventListener('click', ()=>{
    console.clear();
    comenzarJuego();
    btnPedir.disabled = false;
    btnDetener.disabled = false;
});


btnReglas.addEventListener('click', mostrarReglasTXT)


