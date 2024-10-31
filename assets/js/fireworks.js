document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");
    const heading = document.querySelector("main h1");
    const paragraph = document.querySelector("main p");
    let firstClick = false;

    //const welcomeMessage = document.getElementById("welcomeMessage");

    const explosionCounterContainer = document.createElement("div");
    explosionCounterContainer.classList.add("explosion-counter");
    document.body.appendChild(explosionCounterContainer);

    for (let i = 1; i <= 10; i++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.id = `square-${i}`;
        explosionCounterContainer.appendChild(square);
    }


    // const squareStyles = document.createElement("style");
    // squareStyles.innerHTML = `
    //     .square {
    //         width: 20px;
    //         height: 20px;
    //         background-color: #ddd;
    //         border: 1px solid #444;
    //         border-radius:5px;
    //         transition: background-color 0.3s;
    //     }
    //     .square-1 { background-color: #39FF14; }    /* Bright Neon Green */
    //     .square-2 { background-color: #66FF66; }    /* Medium Green */
    //     .square-3 { background-color: #BFFF00; }    /* Light Greenish-Yellow */
    //     .square-4 { background-color: #DFFF80; }    /* Very Light Greenish-Yellow */
    //     .square-5 { background-color: #FFFF99; }    /* Light Yellowish */
    //     .square-6 { background-color: #FFD700; }    /* Bright Neon Yellow */
    //     .square-7 { background-color: #FFB347; }    /* Light Yellowish-Red */
    //     .square-8 { background-color: #FF8C42; }    /* Light Orangeish */
    //     .square-9 { background-coloxr: #FF6347; }    /* Medium Reddish */
    //     .square-10 { background-color: #FF2400; }   /* Dark Neon Reddish */
    // `;
    // document.head.appendChild(squareStyles);


     // Style explosion counter
     //explosionCounterContainer.style.opacity = "0";
    //  explosionCounterContainer.style.position = "fixed";
    //  explosionCounterContainer.style.top = "20px";
    //  explosionCounterContainer.style.right = "20px";
    //  explosionCounterContainer.style.display = "flex";
    //  explosionCounterContainer.style.gap = "5px";
     explosionCounterContainer.style.zIndex = "100";


    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let fireworks = [];
    const particles = [];
    let confettiParticles = [];
    let explosionCounter = 0;
    let displayMessage = false;
    let messageTimeout;
    //let isFirstClick = true;

    const launchSound = new Audio("assets/sounds/launch.mp3");
    const explosionSound = new Audio("assets/sounds/explosion.mp3");
    const specialLaunchSound = new Audio("assets/sounds/special_launch.mp3");
    const specialExplosionSound = new Audio("assets/sounds/special_explosion.mp3");
    const specialMessageSound = new Audio("assets/sounds/special_message.mp3");
    

    



    class Firework {
        constructor(x, y, targetX, targetY, isSpecial = false) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.trail = [];
            this.exploded = false;
            this.isSpecial = isSpecial;
            
            launchSound.currentTime = 0;
            launchSound.play();

            if (this.isSpecial) {
                specialLaunchSound.currentTime = 0;
                specialLaunchSound.play();
            }

        }

        update() {
            if (!this.exploded) {
                // Slow down movement for special firework
                const speedFactor = this.isSpecial ? 0.02 : 0.1; // Slower for special firework
                this.x += (this.targetX - this.x) * speedFactor;
                this.y += (this.targetY - this.y) * speedFactor;
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > 5) this.trail.shift();
        
                if (Math.abs(this.x - this.targetX) < 5 && Math.abs(this.y - this.targetY) < 5) {
                    this.explode();
                }
            }
        }

        draw() {
            ctx.fillStyle = "rgba(255, 165, 0, 0.6)";
            this.trail.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, this.isSpecial ? 5 : 3, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        explode() {
            this.exploded = true;
        
            if (this.isSpecial) {
                // Stop any regular launch sound
                launchSound.pause();
                launchSound.currentTime = 0;
        
                // Play the special launch sound immediately
                specialLaunchSound.currentTime = 0;
                specialLaunchSound.play();
        
                // Delay the special explosion sound and visuals for sync with the launch sound
                setTimeout(() => {
                    specialLaunchSound.pause();
                    specialExplosionSound.currentTime = 0;
                    specialExplosionSound.play();
        
                    // Create the explosion and confetti effects
                    createExplosion(this.x, this.y, "starburst", true);
                    createConfetti();
        
                    // Delay message display slightly to ensure it's in sync with the explosion
                    setTimeout(() => {
                        displayMessage = true;
        
                        // Play message sound after explosion starts
                        specialMessageSound.currentTime = 0;
                        specialMessageSound.play();
        
                        // Clear the message after 6 seconds
                        clearTimeout(messageTimeout);
                        messageTimeout = setTimeout(() => {
                            displayMessage = false;
                            specialMessageSound.pause();
                        }, 6000);
                    }, 500); // Show message 500ms after explosion for synchronization
        
                }, 50); // 3-second delay to sync launch sound and explosion
        
            } else {
                // Regular explosion sound and visuals for non-special fireworks
                launchSound.pause();
                launchSound.currentTime = 0;
                explosionSound.currentTime = 0;
                explosionSound.play();
        
                // Trigger a random explosion effect
                const explosionTypes = ["circular", "starburst", "ring", "randomSpread"];
                const type = explosionTypes[Math.floor(Math.random() * explosionTypes.length)];
                createExplosion(this.x, this.y, type);
            }
        }
    }

    class Particle {
        constructor(x, y, color, size, speedX, speedY) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = size;
            this.speedX = speedX;
            this.speedY = speedY;
            this.alpha = 1;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= 0.02;
        }
    }

    class ConfettiParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            this.size = Math.random() * 3 + 2;
            this.speedX = (Math.random() - 0.5) * 6;
            this.speedY = (Math.random() - 0.5) * 6;
            this.alpha = 1;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= 0.02;
        }
    }

    function createExplosion(x, y, explosionType, isSpecial = false) {
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        const numParticles = isSpecial ? 80 : 30 + Math.random() * 20;

        for (let i = 0; i < numParticles; i++) {
            let speedX, speedY;
            const size = isSpecial ? Math.random() * 5 + 2 : Math.random() * 3 + 1;

            switch (explosionType) {
                case "circular":
                    const angle = Math.random() * Math.PI * 2;
                    speedX = Math.cos(angle) * (Math.random() * 4 + 1);
                    speedY = Math.sin(angle) * (Math.random() * 4 + 1);
                    break;
                case "starburst":
                    const spikeAngle = (i % 5) * (Math.PI / 2.5);
                    speedX = Math.cos(spikeAngle) * (Math.random() * 4 + 1);
                    speedY = Math.sin(spikeAngle) * (Math.random() * 4 + 1);
                    break;
                case "ring":
                    const ringAngle = (Math.PI * 2) * (i / numParticles);
                    speedX = Math.cos(ringAngle) * (Math.random() * 2 + 2);
                    speedY = Math.sin(ringAngle) * (Math.random() * 2 + 2);
                    break;
                case "randomSpread":
                    speedX = (Math.random() - 0.5) * 8;
                    speedY = (Math.random() - 0.5) * 8;
                    break;
                default:
                    speedX = (Math.random() - 0.5) * 6;
                    speedY = (Math.random() - 0.5) * 6;
            }

            particles.push(new Particle(x, y, color, size, speedX, speedY));
        }
    }

    function createConfetti() {
        const textX = canvas.width / 2;
        const textY = canvas.height / 2;
        for (let i = 0; i < 20; i++) {
            confettiParticles.push(new ConfettiParticle(textX - 150, textY));
            confettiParticles.push(new ConfettiParticle(textX + 150, textY));
        }
    }


    function updateExplosionCounter() {
        // Increment the counter and loop it back to 1 after reaching 10
        explosionCounter = (explosionCounter % 10) + 1;

        // Clear all color classes from squares
        for (let i = 1; i <= 10; i++) {
            const square = document.getElementById(`square-${i}`);
            square.className = "square"; // Reset classes
        }

        // Apply gradient color classes up to the current explosion count
        for (let i = 1; i <= explosionCounter; i++) {
            const square = document.getElementById(`square-${i}`);
            square.classList.add(`square-${i}`);
        }

        // If it's the 10th explosion, trigger the fade-out
        if (explosionCounter === 10) {
            // displayMessage = true;
            // explosionCounterContainer.style.opacity = "1"; // Ensure visibility for the message
            
            // // Set a timeout to fade out the explosion counter
            // setTimeout(() => {
            //     explosionCounterContainer.style.opacity = "0"; // Trigger fade-out
            // }, 3000); // Delay to match message display time

            // Reset after fade-out completes
            setTimeout(() => {
                explosionCounterContainer.style.opacity = "1"; // Restore visibility for the next cycle
                resetSquares(); // Reset squares for next cycle
                displayMessage = false;
            }, 4000); // Adjust based on fade-out transition duration
        }
    }

    function resetSquares() {
        // Reset the squares to initial state
        for (let i = 1; i <= 10; i++) {
            const square = document.getElementById(`square-${i}`);
            square.classList.remove(`square-${i}`);
        }
    }




    function animate() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        fireworks.forEach((firework, index) => {
            firework.update();
            firework.draw();
            if (firework.exploded) fireworks.splice(index, 1);
        });
    
        particles.forEach((particle, index) => {
            particle.update();
            particle.draw();
            if (particle.alpha <= 0) particles.splice(index, 1);
        });
    
        confettiParticles.forEach((particle, index) => {
            particle.update();
            particle.draw();
            if (particle.alpha <= 0) confettiParticles.splice(index, 1);
        });
    
        if (displayMessage) {
            // Text styling variables
            ctx.font = "bold 60px Poppins";
            ctx.textAlign = "center";
    
            // Random sparkle effect functions
            const randomOpacity = () => Math.random() * 0.5 + 0.5; // Opacity between 0.5 and 1
            const randomShadowBlur = () => Math.floor(Math.random() * 10) + 10; // Random blur [10, 20]
            const randomShadowOffset = () => Math.random() * 4 - 2; // Offset [-2, 2]
    
            // Display base X and Y coordinates for the message
            const textX = canvas.width / 2;
            const textY = canvas.height / 2;
            const lineHeight = 70;
    
            // Sparkling white glow effect for "Masai" with black text
            ctx.fillStyle = "black";
            ctx.shadowColor = `rgba(255, 255, 255, ${randomOpacity()})`;
            ctx.shadowBlur = randomShadowBlur();
            ctx.shadowOffsetX = randomShadowOffset();
            ctx.shadowOffsetY = randomShadowOffset();
            ctx.fillText("Masa", textX, textY - lineHeight);
    
            // "i" with angled red/black styling and sparkling white glow
            const stemX = textX + 91;
            const stemY = textY - lineHeight - 40;
            const stemHeight = 40;
            const stemWidth = 10;
    
            // Red half of the stem with glow
            ctx.fillStyle = "red"; // Keeping the base as black with a sparkle around
            ctx.beginPath();
            ctx.moveTo(stemX, stemY); // Top-left corner
            ctx.lineTo(stemX + stemWidth, stemY); // Top-right corner
            ctx.lineTo(stemX + stemWidth, stemY + stemHeight / 2); // Middle-right corner (angle cut)
            ctx.lineTo(stemX, stemY + stemHeight - 10); // Bottom-left corner
            ctx.closePath();
            ctx.fill();
    
            // Black half of the "i" stem with sparkle effect
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.moveTo(stemX + stemWidth, stemY + stemHeight / 2 - 10); // Middle-right corner (angle cut)
            ctx.lineTo(stemX + stemWidth, stemY + stemHeight); // Bottom-right corner
            ctx.lineTo(stemX, stemY + stemHeight); // Bottom-left corner
            ctx.lineTo(stemX, stemY + stemHeight / 2);  // Middle-left corner
            ctx.closePath();
            ctx.fill();
    
            // Draw the black circular dot above the "i"
            ctx.fillStyle = "black";
            const dotX = stemX + stemWidth / 2;  // Center the dot over the stem
            const dotY = stemY - 15;  // Position above the stem
            ctx.beginPath();
            ctx.arc(dotX, dotY, 5, 0, Math.PI * 2); // Adjust radius if necessary
            ctx.fill();
            ctx.closePath();
    
            // Reset shadow effect for the next line
            ctx.shadowColor = "transparent";
    
            // Sparkling text for "Wishes You" with yellow glow
            ctx.fillStyle = `rgba(255, 215, 0, ${randomOpacity()})`;
            ctx.shadowColor = `rgba(255, 165, 0, ${randomOpacity()})`;
            ctx.shadowBlur = randomShadowBlur();
            ctx.shadowOffsetX = randomShadowOffset();
            ctx.shadowOffsetY = randomShadowOffset();
            ctx.fillText("Wishes You", textX, textY);
    
            // Sparkling text for "Happy Diwali" with golden glow
            ctx.fillStyle = `rgba(255, 255, 0, ${randomOpacity()})`;
            ctx.shadowColor = `rgba(255, 223, 0, ${randomOpacity()})`;
            ctx.shadowBlur = randomShadowBlur();
            ctx.shadowOffsetX = randomShadowOffset();
            ctx.shadowOffsetY = randomShadowOffset();
            ctx.fillText("Happy Diwali", textX, textY + lineHeight);
    
            // Ensure shadow effects are cleared after drawing
            ctx.shadowColor = "transparent";
        }
    
        requestAnimationFrame(animate);
    }

    canvas.addEventListener("click", (event) => {

        // if (isFirstClick) {
        //     welcomeMessage.style.display = "none"; // Hide welcome message
        //     isFirstClick = false; // Set the flag to false
        // }
        if (!firstClick) {
            heading.style.zIndex = "-1";
            paragraph.style.zIndex = "-1";
            firstClick = true;
        }
        updateExplosionCounter();

       
        if (explosionCounter % 10 === 0) {
            const firework = new Firework(canvas.width / 2, canvas.height, canvas.width / 2, canvas.height / 4, true);
            fireworks.push(firework);
        } else {
            const firework = new Firework(canvas.width / 2, canvas.height, event.clientX, event.clientY);
            fireworks.push(firework);
        }
    });

    animate();
});