const sendBtn = document.getElementById('sendBtn');
const progress = document.getElementById('shakeProgress');
const textarea = document.getElementById('messageInput');
const chatWindow = document.getElementById('chatWindow');
const usernameDisplay = document.getElementById('usernameDisplay');

const myUsername = 'anon_' + Math.floor(Math.random() * 10000);
usernameDisplay.innerText = "Jouw naam: " + myUsername;

let charge = 0;
const maxCharge = 100;
let lastX = 0;
let lastY = 0;
let lastTime = Date.now();
let lastActivityTime = Date.now();
let lastMessageCount = 0;

function updateUI() {
    progress.style.width = charge + '%';

    if (charge >= maxCharge && textarea.value.trim() !== '') {
        sendBtn.disabled = false;
        sendBtn.innerText = "Verzenden!";
    } else {
        sendBtn.disabled = true;
        sendBtn.innerText = "Verzenden (Beweeg/Schud!)";
    }
}

window.addEventListener('devicemotion', (event) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;
    const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
    if (force > 15) {
        charge += 3; 
        if (charge > maxCharge) charge = maxCharge;
        lastActivityTime = Date.now(); 
        updateUI();
    }
});

window.addEventListener('mousemove', (event) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTime;
    
    if (timeDiff > 20) {
        const deltaX = Math.abs(event.clientX - lastX);
        const deltaY = Math.abs(event.clientY - lastY);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const speed = distance / timeDiff;

        if (speed > 4) { 
            charge += 4;
            if (charge > maxCharge) charge = maxCharge;
            lastActivityTime = Date.now(); 
            updateUI();
        }
        lastX = event.clientX;
        lastY = event.clientY;
        lastTime = currentTime;
    }
});

setInterval(() => {
    if (charge > 0 && (Date.now() - lastActivityTime > 1500)) {
        charge -= 2; 
        if (charge < 0) charge = 0;
        updateUI();
    }
}, 100);

function fetchMessages() {
    fetch('chat.php')
        .then(response => response.json())
        .then(data => {
            if (data.length > lastMessageCount) {
                chatWindow.innerHTML = '';
                data.forEach(msg => {
                    const msgDiv = document.createElement('div');
                    msgDiv.className = msg.user === myUsername ? 'message self' : 'message other';
                    msgDiv.innerText = msg.user + ': ' + msg.message;
                    chatWindow.appendChild(msgDiv);
                });
                chatWindow.scrollTop = chatWindow.scrollHeight;
                lastMessageCount = data.length;
            }
        });
}

setInterval(fetchMessages, 2000);
fetchMessages();

sendBtn.addEventListener('click', () => {
    const text = textarea.value.trim();
    if (text === '') return;

    fetch('chat.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: myUsername,
            message: text
        })
    }).then(() => {
        charge = 0;
        textarea.value = '';
        updateUI();
        fetchMessages();
    });
});

textarea.addEventListener('input', updateUI);