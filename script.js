const sendBtn = document.getElementById('sendBtn');
const progress = document.getElementById('shakeProgress');
const textarea = document.getElementById('messageInput');

let charge = 0;
const maxCharge = 100;

function handleMotion(event) {
    const acc = event.accelerationIncludingGravity;
    
    if (!acc) return;
    
    const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);

    if (force > 15) {
        charge += 2; 
        
        if (charge > maxCharge) {
            charge = maxCharge;
        }
        
        progress.style.width = charge + '%';

        if (charge === maxCharge && textarea.value.trim() !== '') {
            sendBtn.disabled = false;
            sendBtn.innerText = "Verzenden!";
        }
    }
}

window.addEventListener('devicemotion', handleMotion);

sendBtn.addEventListener('click', () => {
    alert('Bericht succesvol verstuurd met pure fysieke arbeid!');
    
    charge = 0;
    progress.style.width = '0%';
    sendBtn.disabled = true;
    sendBtn.innerText = "Verzenden (Schud om te activeren!)";
    textarea.value = '';
});

textarea.addEventListener('input', () => {
    if (charge === maxCharge && textarea.value.trim() !== '') {
        sendBtn.disabled = false;
    } else {
        sendBtn.disabled = true;
    }
});