const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
// à changer pour la taille : 100%

const initialWidth = window.innerWidth;
const referenceWidth = 1440;
let ratio = initialWidth / referenceWidth;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// window.addEventListener('resize', function () {
//     ratio = window.innerWidth / referenceWidth;
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
// });

let particleArray = [];
let adjustX = 30; //placer le texte dans la page
let adjustY = -10;

const mouse = {
    x: null,
    y: null,
    radius: 120 //radius du mouvement des particule par rapport à la souris
}

window.addEventListener('mousemove', function (event) {
    let offset = canvas.getBoundingClientRect();
    mouse.x = event.x - offset.left;
    mouse.y = event.y - offset.top;
    mouse.x /= ratio;
    mouse.y /= ratio;
    // console.log(mouse.x, mouse.y);
});

ctx.fillStyle = "white";
ctx.font = '20px Verdana'; //font-size
ctx.fillText('My skills 🎵', 0, 40); //size
const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height); //scan

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 1; // taille des points
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 40) + 5; // fait varier la vitesse
    }
    draw() {
        ctx.fillStyle = 'white'; // couleur de la particule
        ctx.beginPath();
        ctx.arc(this.x * ratio, this.y * ratio, this.size * ratio, 0, Math.PI * 2); // faire un cercle
        ctx.closePath();
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy); // des maths
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        if (distance < mouse.radius) { // taille de l'ère d'influence de la souris
            this.x -= directionX;
            this.y -= directionY; // attire les particules sur la souris = vitesse
        } else {
            if (this.x !== this.baseX) { // sinon faire revenir la particule à sa place
                let dx = this.x - this.baseX;
                this.x -= dx / 10; // vitesse à laquel elle se replace
            }
            if (this.x !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}

function init() {
    particleArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX * 8, positionY * 8));
            }
        }
    }
    // pour generer des particule de maniere aléatoire dans tout le canvas
    // for (var i = 0; i < 1000; i++){ //nombre de particule
    //   let x = Math.random() * canvas.width;
    //   let y = Math.random() * canvas.height;
    //   particleArray.push(new Particle(x, y));
    // }

}
init();
console.log(particleArray);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}
animate();

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
            // let dx = mouse.x - this.x;
            // let dy = mouse.y - this.y;
            // let distance = Math.sqrt(dx * dx + dy * dy);
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);


            if (distance < 18) { // distance ds lesquel les traits se creer
                opacityValue = 1 - (distance / 18);
                ctx.strokeStyle = "rgba(255,255,255," + opacityValue + ")";
                ctx.strokeStyle = "lightblue";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x * ratio, particleArray[a].y * ratio);
                ctx.lineTo(particleArray[b].x * ratio, particleArray[b].y * ratio);
                ctx.stroke();
            }
        }
    }
}


/////////////////////////////////


let mainNav = document.getElementById("js-menu");
let navBarToggle = document.getElementById("js-navbar-toggle");

navBarToggle.addEventListener("click", function () {
    mainNav.classList.toggle("active");
});

