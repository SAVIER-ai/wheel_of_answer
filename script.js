const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const questionInput = document.getElementById("question");
const answersInput = document.getElementById("answers");
const generateButton = document.getElementById("generate-wheel");
const spinButton = document.getElementById("spin-wheel");
const selectedAnswerDiv = document.getElementById("selected-answer");

canvas.width = 300;
canvas.height = 300;

let answers = [];
let spinning = false;
let currentAngle = 0;

generateButton.addEventListener("click", () => {
    answers = answersInput.value.split(",").map(a => a.trim());
    if (answers.length < 2) {
        alert("Please enter at least two answers.");
        return;
    }
    drawWheel();
    spinButton.disabled = false;
    selectedAnswerDiv.textContent = ""; // Clear any previous result
});

spinButton.addEventListener("click", () => {
    if (spinning) return;
    spinning = true;
    spinButton.disabled = true;

    const spinDuration = Math.random() * 3 + 5; // Random spin duration (5-8 seconds)
    let remainingTime = spinDuration;
    const initialSpeed = Math.random() * 10 + 20; // Random initial speed
    const decelerationRate = initialSpeed / spinDuration / 20; // Gradual deceleration

    const spinInterval = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(spinInterval);
            spinning = false;
            spinButton.disabled = false;
            selectAnswer();
        } else {
            currentAngle += initialSpeed * remainingTime * decelerationRate; // Deceleration effect
            remainingTime -= 0.05; // Decrease time by 50ms interval
            drawWheel();
        }
    }, 50);
});

function drawWheel() {
    const sliceAngle = (2 * Math.PI) / answers.length;
    const gradientColors = ['#ff9a9e', '#fad0c4', '#fbc2eb', '#a6c1ee', '#fdcbf1'];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    answers.forEach((answer, index) => {
        const startAngle = index * sliceAngle + (currentAngle % (2 * Math.PI));
        const endAngle = startAngle + sliceAngle;

        // Draw gradient slice
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, gradientColors[index % gradientColors.length]);
        gradient.addColorStop(1, gradientColors[(index + 1) % gradientColors.length]);

        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.stroke();

        // Add text
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#333";
        ctx.font = "14px Arial";
        ctx.fillText(answer, canvas.width / 2 - 20, 10);
        ctx.restore();
    });
}


function selectAnswer() {
    const sliceAngle = (2 * Math.PI) / answers.length;
    const normalizedAngle = (currentAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI); // Normalize angle
    const selectedIndex = Math.floor((answers.length - (normalizedAngle / sliceAngle)) % answers.length);
    const selectedAnswer = answers[selectedIndex];
    selectedAnswerDiv.textContent = `Selected Answer: ${selectedAnswer}`;
}
