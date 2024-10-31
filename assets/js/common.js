document.addEventListener("DOMContentLoaded", () => {
    const starsContainer = document.getElementById("stars-container");
    const starCount = 50; // Number of stars

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        // Random horizontal position within the viewport width
        star.style.left = `${Math.random() * 100}vw`;

        // Random size between 8px and 16px
        const size = Math.random() * 8 + 8;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Random animation duration between 5s and 15s
        const duration = Math.random() * 100 + 5;
        star.style.animationDuration = `${duration}s`;

        // Random delay to stagger the start times
        const delay = Math.random() * 5;
        star.style.animationDelay = `${delay}s`;

        // Append star to container
        starsContainer.appendChild(star);
    }
});


