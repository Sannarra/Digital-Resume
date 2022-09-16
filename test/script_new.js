const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = canvas.width / 6;

// Write a a large "Lisa Bourdon" in the center of the canvas and make a particle version of it
let particlesArray = [];
let hue = 0;

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = canvas.width / 6;
});

const mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
};

ctx.font = 'bold 90px Arial';
ctx.fillStyle = 'white';
ctx.fillText('Lisa Bourdon', 0, 90);
const data = ctx.getImageData(0, 0, 300, 150);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }
    draw() {
        ctx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}

function init() {
    particlesArray = [];
    for (let y = 0, y2 = data.height; y < y2; y++) {
        for (let x = 0, x2 = data.width; x < x2; x++) {
            if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                let positionX = x;
                let positionY = y;
                particlesArray.push(new Particle(positionX * 10, positionY * 10));
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

init();
animate();

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', function () {
    mouse.x = undefined;
    mouse.y = undefined;
});

setInterval(function () {
    hue += 0.5;
}, 50);

// const canvas = document.getElementById('canvas1');
// const ctx = canvas.getContext('2d');
// // à changer pour la taille : 100%

// // const initialWidth = window.innerWidth;
// // const referenceWidth = 1440;
// // let ratio = initialWidth / referenceWidth;
// canvas.width = window.innerWidth;
// canvas.height = canvas.width / 6;

// // window.addEventListener('resize', function () {
// //     ratio = window.innerWidth / referenceWidth;
// //     canvas.width = window.innerWidth;
// //     canvas.height = window.innerHeight;
// // });

// let particleArray = [];
// let adjustX = 30;
// let adjustY = -10;

// const mouse = {
//     x: null,
//     y: null,
//     radius: 120 //radius du mouvement des particule par rapport à la souris
// }

// window.addEventListener('mousemove', function (event) {
//     let offset = canvas.getBoundingClientRect();
//     mouse.x = event.x - offset.left;
//     mouse.y = event.y - offset.top;
//     // mouse.x /= ratio;
//     // mouse.y /= ratio;
//     // console.log(mouse.x, mouse.y);
// });

// ctx.fillStyle = "white";
// ctx.font = '20px Verdana'; //font-size
// // Write "Lisa Bourdon" in the middle of the canvas
// ctx.fillText('Lisa Bourdon', 100, 100);

// const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height); //scan

// class Particle {
//     constructor(x, y) {
//         this.x = x;
//         this.y = y;
//         this.size = 1; // taille des points
//         this.baseX = this.x;
//         this.baseY = this.y;
//         this.density = (Math.random() * 40) + 5; // fait varier la vitesse
//     }
//     draw() {
//         ctx.fillStyle = 'white'; // couleur de la particule
//         ctx.beginPath();
//         ctx.arc(this.x /* ratio */, this.y /* ratio */, this.size /* ratio */, 0, Math.PI * 2); // faire un cercle
//         ctx.closePath();
//         ctx.fill();
//     }
//     update() {
//         let dx = mouse.x - this.x;
//         let dy = mouse.y - this.y;
//         let distance = Math.sqrt(dx * dx + dy * dy); // des maths
//         let forceDirectionX = dx / distance;
//         let forceDirectionY = dy / distance;
//         let maxDistance = mouse.radius;
//         let force = (maxDistance - distance) / maxDistance;
//         let directionX = forceDirectionX * force * this.density;
//         let directionY = forceDirectionY * force * this.density;
//         if (distance < mouse.radius) { // taille de l'ère d'influence de la souris
//             this.x -= directionX;
//             this.y -= directionY; // attire les particules sur la souris = vitesse
//         } else {
//             if (this.x !== this.baseX) { // sinon faire revenir la particule à sa place
//                 let dx = this.x - this.baseX;
//                 this.x -= dx / 10; // vitesse à laquel elle se replace
//             }
//             if (this.x !== this.baseY) {
//                 let dy = this.y - this.baseY;
//                 this.y -= dy / 10;
//             }
//         }
//     }
// }

// function init() {
//     particleArray = [];
//     for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
//         for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
//             if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
//                 let positionX = x + adjustX;
//                 let positionY = y + adjustY;
//                 particleArray.push(new Particle(positionX * 8, positionY * 8));
//             }
//         }
//     }
//     // pour generer des particule de maniere aléatoire dans tout le canvas
//     // for (var i = 0; i < 1000; i++){ //nombre de particule
//     //   let x = Math.random() * canvas.width;
//     //   let y = Math.random() * canvas.height;
//     //   particleArray.push(new Particle(x, y));
//     // }

// }
// init();
// console.log(particleArray);

// function animate() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     for (let i = 0; i < particleArray.length; i++) {
//         particleArray[i].draw();
//         particleArray[i].update();
//     }
//     connect();
//     requestAnimationFrame(animate);
// }
// animate();

// function connect() {
//     let opacityValue = 1;
//     for (let a = 0; a < particleArray.length; a++) {
//         for (let b = a; b < particleArray.length; b++) {
//             // let dx = mouse.x - this.x;
//             // let dy = mouse.y - this.y;
//             // let distance = Math.sqrt(dx * dx + dy * dy);
//             let dx = particleArray[a].x - particleArray[b].x;
//             let dy = particleArray[a].y - particleArray[b].y;
//             let distance = Math.sqrt(dx * dx + dy * dy);


//             if (distance < 18) { // distance ds lesquel les traits se creer
//                 opacityValue = 1 - (distance / 18);
//                 ctx.strokeStyle = "rgba(255,255,255," + opacityValue + ")";
//                 ctx.strokeStyle = "lightblue";
//                 ctx.lineWidth = 1;
//                 ctx.beginPath();
//                 ctx.moveTo(particleArray[a].x /* ratio */, particleArray[a].y /* ratio */);
//                 ctx.lineTo(particleArray[b].x /* ratio */, particleArray[b].y /* ratio */);
//                 ctx.stroke();
//             }
//         }
//     }
// }

// ///////////////////navbar///////////////////////////

// let mainNav = document.getElementById("js-menu");
// let navBarToggle = document.getElementById("js-navbar-toggle");

// navBarToggle.addEventListener("click", function () {
//     mainNav.classList.toggle("active");
// });

