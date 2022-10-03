//Variables
const btnEnviar = document.querySelector('.button');
const tweet = document.querySelector('#tweet');
const zonaTweets = document.querySelector('#lista-tweets');
const formulario = document.querySelector('#formulario');

let tweetsTotales = [];


//Eventos
document.addEventListener('DOMContentLoaded', () => {
    cargarTweets();

    btnEnviar.addEventListener('click', enviarTweet);
    zonaTweets.addEventListener('click', borrarTweet);
})

//Funciones

//Sirve para cargar los tweets
function cargarTweets() {
    const tweets = JSON.parse(localStorage.getItem('tweets'));
    if (tweets) {
        tweets.forEach((item) => {
            addTweet(false, item);
        })

        //Metemos los tweets a la variable
        tweetsTotales = tweets;

    }
}

function enviarTweet(e) {
    e.preventDefault();
    addTweet(e.target.classList.contains('button'));

}

//Sirve para añadir un tweet
function addTweet(tipo, item) {
    //Si es un botón
    if (tipo) {
        if (tweet.value.length > 3) {

            const tweetHTML = document.createElement('p');
            const borrarTweetHTML = document.createElement('label');

            let id = "tweet_0".split("_");
            if (zonaTweets.childElementCount > 0) {
                id = zonaTweets.lastElementChild.id.split("_");
                id[1] = parseInt(id[1]) + 1;
            } else {
                //Si es id 0 transformamos a INT
                id[1] = parseInt(id[1]);
            }

            tweetHTML.textContent = `▪ ${tweet.value}`;
            borrarTweetHTML.textContent = '❌';
            tweetHTML.style.fontSize = '20px';


            tweetHTML.setAttribute('id', `${id[0]}_${id[1]}`);
            borrarTweetHTML.setAttribute('id', `${id[0]}_${id[1]}`);
            borrarTweetHTML.classList.add('borrar-tweet');

            zonaTweets.appendChild(borrarTweetHTML);
            zonaTweets.appendChild(tweetHTML);
            const object = { id: id[1], nombre: tweet.value }

            tweetsTotales.push(object);


            //Si hay tweets
            if (localStorage.getItem('tweets')) {
                const tweetsActuales = JSON.parse(localStorage.getItem('tweets'));

                tweetsActuales.push(object);

                localStorage.setItem('tweets', JSON.stringify(tweetsActuales));

            } else {
                localStorage.setItem('tweets', JSON.stringify(tweetsTotales));

            }
        } else {
            notificacion('error', 'Tweet demasiado corto...');
            return;
        }
        resetTweet();
    } else {
        //Esto es el inicializador del programa
        const tweetHTML = document.createElement('p');
        const borrarTweetHTML = document.createElement('label');

        tweetHTML.textContent = `▪ ${item.nombre}`;
        borrarTweetHTML.textContent = '❌';
        tweetHTML.style.fontSize = '20px';


        tweetHTML.setAttribute('id', `tweet_${item.id}`);
        borrarTweetHTML.setAttribute('id', `tweet_${item.id}`);
        borrarTweetHTML.classList.add('borrar-tweet');

        zonaTweets.appendChild(borrarTweetHTML);
        zonaTweets.appendChild(tweetHTML);
    }
}

//Borrar tweet en especifico
function borrarTweet(arg) {

    if (arg.target.classList.value == 'borrar-tweet') {
        const idHTML = parseInt(arg.target.id.split('_')[1]);

        const newID = tweetsTotales.find((objeto, index) => { if (objeto.id == idHTML) { objeto.idArray = index; return true } })

        const { idArray } = newID;
        //Hacer que se borre el html
        const tweetBorrar = document.querySelectorAll(`#${arg.target.id}`);

        for (let i = 0; i < tweetBorrar.length; i++) {
            tweetBorrar[i].remove();
        }

        //Borramos el tweet del array
        tweetsTotales.splice(idArray, 1);

        //Hacer que se borre el cache
        localStorage.setItem('tweets', JSON.stringify(tweetsTotales));

        notificacion('exito', 'Borrando tweet...');
    }
}



//Añadir una notificación
function notificacion(tipo, arg) {

    const notificacion = document.createElement('p');
    notificacion.textContent = arg;
    notificacion.classList.add('error');

    switch (tipo) {
        case "error":
            break;
        case 'exito':
            notificacion.style.backgroundColor = 'green';
            break;
        default:
            break;
    }
    //Después de 3 segundos la borramos
    setTimeout(() => { notificacion.remove() }, 3000);

    formulario.appendChild(notificacion)
    console.log(notificacion);
}

function resetTweet() {

    notificacion('exito', 'Enviando tweet...');
    tweet.value = '';
}