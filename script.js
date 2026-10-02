// ======================================================
// ================= PAGE NAVIGATION ====================
// ======================================================

function showPage(pageNumber) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const selectedPage =
        document.getElementById("page" + pageNumber);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    // Prepare scratch card when Page 4 opens
    if (pageNumber === 4) {

        setTimeout(() => {
            setupScratchCard();
        }, 100);

    }
}


// ======================================================
// ============== BIRTHDAY CELEBRATION ==================
// ======================================================

function celebrate() {

    const reveal =
        document.getElementById("birthdayReveal");

    const message =
        document.getElementById("birthdayMessage");


    // Hide the wish box
    if (reveal) {
        reveal.style.display = "none";
    }


    // Show birthday message
    if (message) {
        message.classList.add("show");
    }


    // Create ribbon / sparkle explosion
    for (let i = 0; i < 70; i++) {

        const ribbon =
            document.createElement("div");


        ribbon.innerHTML =
            ["🎀", "✨", "🎉", "💖", "⭐"][
                Math.floor(Math.random() * 5)
            ];


        ribbon.style.position = "fixed";

        ribbon.style.left = "50%";

        ribbon.style.top = "50%";

        ribbon.style.fontSize =
            (12 + Math.random() * 18) + "px";

        ribbon.style.zIndex = "9999";

        ribbon.style.pointerEvents = "none";


        document.body.appendChild(ribbon);


        // Random direction
        const angle =
            Math.random() * Math.PI * 2;

        const distance =
            150 + Math.random() * 400;


        const x =
            Math.cos(angle) * distance;

        const y =
            Math.sin(angle) * distance;


        ribbon.animate(

            [
                {
                    transform:
                        "translate(-50%, -50%) scale(0)",

                    opacity: 1
                },

                {
                    transform:
                        `translate(
                            calc(-50% + ${x}px),
                            calc(-50% + ${y}px)
                        )
                        rotate(${Math.random() * 720}deg)
                        scale(1.2)`,

                    opacity: 0
                }
            ],

            {
                duration:
                    1000 + Math.random() * 900,

                easing:
                    "cubic-bezier(.17,.67,.32,1.3)"
            }

        );


        setTimeout(() => {
            ribbon.remove();
        }, 2200);

    }

}


// ======================================================
// ==================== FLIP CARDS ======================
// ======================================================

function flipCard(card) {

    card.classList.toggle("flipped");

}


// ======================================================
// ==================== SCRATCH CARD =====================
// ======================================================

let scratchContext;

let isScratching = false;

let scratchRevealed = false;


// ======================================================
// ================ SETUP SCRATCH CARD ==================
// ======================================================

function setupScratchCard() {

    const canvas =
        document.getElementById("scratchCanvas");

    const card =
        document.querySelector(".scratch-card");


    // Safety check
    if (!canvas || !card) {
        return;
    }


    scratchContext =
        canvas.getContext("2d");


    // Get actual card size
    const width =
        card.offsetWidth;

    const height =
        card.offsetHeight;


    // Set canvas size
    canvas.width = width;

    canvas.height = height;


    // Reset state
    scratchRevealed = false;

    isScratching = false;

    canvas.style.pointerEvents = "auto";


    // ==================================================
    // Scratch surface gradient
    // ==================================================

    const gradient =
        scratchContext.createLinearGradient(
            0,
            0,
            width,
            height
        );


    gradient.addColorStop(
        0,
        "#b8862c"
    );

    gradient.addColorStop(
        0.5,
        "#f3d27a"
    );

    gradient.addColorStop(
        1,
        "#a87520"
    );


    // Fill scratch surface
    scratchContext.globalCompositeOperation =
        "source-over";

    scratchContext.fillStyle =
        gradient;


    scratchContext.fillRect(
        0,
        0,
        width,
        height
    );


    // ==================================================
    // Text on scratch surface
    // ==================================================

    scratchContext.fillStyle =
        "#5b4320";

    scratchContext.textAlign =
        "center";


    scratchContext.font =
        "bold 20px Arial";


    scratchContext.fillText(
        "SCRATCH HERE",
        width / 2,
        height / 2 - 5
    );


    scratchContext.font =
        "14px Arial";


    scratchContext.fillText(
        "✨ reveal your message ✨",
        width / 2,
        height / 2 + 25
    );


    // Set erasing mode
    scratchContext.globalCompositeOperation =
        "destination-out";

}


// ======================================================
// ================= START SCRATCHING ====================
// ======================================================

function startScratch(event) {

    if (scratchRevealed) {
        return;
    }


    isScratching = true;

    scratch(event);

}


// ======================================================
// ================= STOP SCRATCHING =====================
// ======================================================

function stopScratch() {

    isScratching = false;

}


// ======================================================
// ===================== SCRATCH =========================
// ======================================================

function scratch(event) {

    if (!isScratching) {
        return;
    }


    if (!scratchContext) {
        return;
    }


    const canvas =
        document.getElementById("scratchCanvas");


    if (!canvas) {
        return;
    }


    const rect =
        canvas.getBoundingClientRect();


    let clientX;

    let clientY;


    // Touch
    if (
        event.touches &&
        event.touches.length > 0
    ) {

        clientX =
            event.touches[0].clientX;

        clientY =
            event.touches[0].clientY;

    }

    // Mouse
    else {

        clientX =
            event.clientX;

        clientY =
            event.clientY;

    }


    const x =
        clientX - rect.left;

    const y =
        clientY - rect.top;


    // Erase scratch surface
    scratchContext.globalCompositeOperation =
        "destination-out";


    scratchContext.beginPath();


    scratchContext.arc(
        x,
        y,
        28,
        0,
        Math.PI * 2
    );


    scratchContext.fill();


    // Check progress
    checkScratchProgress();

}


// ======================================================
// ================ CHECK SCRATCH PROGRESS ==============
// ======================================================

function checkScratchProgress() {

    if (scratchRevealed) {
        return;
    }


    if (!scratchContext) {
        return;
    }


    const canvas =
        document.getElementById("scratchCanvas");


    if (!canvas) {
        return;
    }


    const width =
        canvas.width;

    const height =
        canvas.height;


    const imageData =
        scratchContext.getImageData(
            0,
            0,
            width,
            height
        );


    const pixels =
        imageData.data;


    let transparentPixels = 0;


    // Check transparent pixels
    for (
        let i = 3;
        i < pixels.length;
        i += 4
    ) {

        if (pixels[i] < 20) {

            transparentPixels++;

        }

    }


    const totalPixels =
        width * height;


    const percentage =
        (transparentPixels / totalPixels) * 100;


    // Reveal after 45%
    if (percentage >= 45) {

        revealScratch();

    }

}


// ======================================================
// ================== REVEAL SCRATCH =====================
// ======================================================

function revealScratch() {

    if (scratchRevealed) {
        return;
    }


    scratchRevealed = true;

    isScratching = false;


    const canvas =
        document.getElementById("scratchCanvas");


    if (!canvas) {
        return;
    }


    // Remove remaining scratch layer
    scratchContext.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    canvas.style.pointerEvents =
        "none";


    // Celebration
    createScratchCelebration();

}


// ======================================================
// ============= SCRATCH CELEBRATION ====================
// ======================================================

function createScratchCelebration() {

    for (let i = 0; i < 35; i++) {

        const sparkle =
            document.createElement("div");


        sparkle.innerHTML =
            ["✨", "💖", "🎉", "⭐", "🎀"][
                Math.floor(Math.random() * 5)
            ];


        sparkle.style.position =
            "fixed";


        sparkle.style.left =
            "50%";


        sparkle.style.top =
            "50%";


        sparkle.style.fontSize =
            (12 + Math.random() * 15) + "px";


        sparkle.style.pointerEvents =
            "none";


        sparkle.style.zIndex =
            "9999";


        document.body.appendChild(
            sparkle
        );


        const x =
            (Math.random() - 0.5) * 500;


        const y =
            (Math.random() - 0.5) * 400;


        sparkle.animate(

            [
                {
                    transform:
                        "translate(-50%, -50%) scale(0)",

                    opacity: 1
                },

                {
                    transform:
                        `translate(
                            calc(-50% + ${x}px),
                            calc(-50% + ${y}px)
                        )
                        scale(1.2)`,

                    opacity: 0
                }
            ],

            {
                duration: 1200,

                easing: "ease-out"
            }

        );


        setTimeout(() => {

            sparkle.remove();

        }, 1300);

    }

}


// ======================================================
// ==================== MOUSE EVENTS =====================
// ======================================================

document.addEventListener(
    "mousedown",
    function(event) {

        if (
            event.target.id ===
            "scratchCanvas"
        ) {

            startScratch(event);

        }

    }
);


document.addEventListener(
    "mousemove",
    function(event) {

        if (isScratching) {

            scratch(event);

        }

    }
);


document.addEventListener(
    "mouseup",
    function() {

        stopScratch();

    }
);


// ======================================================
// ==================== TOUCH EVENTS =====================
// ======================================================

document.addEventListener(
    "touchstart",
    function(event) {

        if (
            event.target.id ===
            "scratchCanvas"
        ) {

            event.preventDefault();

            startScratch(event);

        }

    },
    {
        passive: false
    }
);


document.addEventListener(
    "touchmove",
    function(event) {

        if (isScratching) {

            event.preventDefault();

            scratch(event);

        }

    },
    {
        passive: false
    }
);


document.addEventListener(
    "touchend",
    function() {

        stopScratch();

    }
);


// ======================================================
// ==================== WINDOW EVENTS ====================
// ======================================================

window.addEventListener(
    "load",
    function() {

        if (
            document.getElementById(
                "scratchCanvas"
            )
        ) {

            setupScratchCard();

        }

    }
);


window.addEventListener(
    "resize",
    function() {

        if (!isScratching) {

            const page4 =
                document.getElementById("page4");


            if (
                page4 &&
                page4.classList.contains("active")
            ) {

                setupScratchCard();

            }

        }

    }
);