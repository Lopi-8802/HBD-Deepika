// --- CONFIGURATIONS ---
const CORRECT_PASSCODE = "1234"; // Set your secret code here!
let currentInput = "";
let countdownInterval;

// --- DYNAMIC CONTENT PRELOADER (Fixes the visual screen flashing completely) ---
function loadScreenAssets(screenId) {
    const activeScreen = document.getElementById(screenId);
    if (!activeScreen) return;

    // Scan the newly opened screen for any image placeholders using data-src
    const images = activeScreen.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src'); // Remove placeholder so it only runs once
    });
}

// --- MAIN TRANSITION FLOW ENGINE ---
function nextScreen(currentId, nextId) {
    const currentScreen = document.getElementById(currentId);
    const nextScreen = document.getElementById(nextId);
    
    if (currentScreen && nextScreen) {
        currentScreen.classList.remove('active');
        
        // Safety lock: Preload images for the upcoming screen right before showing it
        loadScreenAssets(nextId);
        
        nextScreen.classList.add('active');
        
        // Custom Hook: Trigger typewriter letter if moving onto the letter window
        if (nextId === 'screen-letter') {
            startTypewriterMessage();
        }
    }
}

// --- LOCK SCREEN LOGIC ---
function pressKey(key) {
    const dots = document.querySelectorAll('.dot');
    
    if (key === 'C') {
        currentInput = "";
    } else if (key === 'D') {
        currentInput = currentInput.slice(0, -1);
    } else if (currentInput.length < 4) {
        currentInput += key;
    }
    
    // Update visual dot styling indicators
    dots.forEach((dot, index) => {
        if (index < currentInput.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
    
    // Process full passcode evaluations
    if (currentInput.length === 4) {
        if (currentInput === CORRECT_PASSCODE) {
            // Unlocked! Drop down notification banner
            const popup = document.getElementById('popup-notification');
            popup.classList.add('show');
            
            setTimeout(() => {
                popup.classList.remove('show');
                nextScreen('screen-lock', 'screen-countdown');
                startCountdownTimer();
            }, 2200);
        } else {
            // Reset input values and push error dashboard window
            setTimeout(() => {
                currentInput = "";
                dots.forEach(dot => dot.classList.remove('filled'));
                nextScreen('screen-lock', 'screen-wrong-passcode');
            }, 250);
        }
    }
}

// --- COUNTDOWN TIMING SIMULATOR ---
function startCountdownTimer() {
    // Target date set for testing parameters. Adjust manually if needed.
    const targetDate = new Date().getTime() + 10000; // 10 seconds default for immediate demo
    const unlockBtn = document.getElementById('unlock-btn');
    
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;
        
        if (difference <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('days').textContent = "00";
            document.getElementById('hours').textContent = "00";
            document.getElementById('minutes').textContent = "00";
            document.getElementById('seconds').textContent = "00";
            
            // Activate button triggers
            unlockBtn.classList.remove('disabled');
            unlockBtn.removeAttribute('disabled');
            return;
        }
        
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(d).padStart(2, '0');
        document.getElementById('hours').textContent = String(h).padStart(2, '0');
        document.getElementById('minutes').textContent = String(m).padStart(2, '0');
        document.getElementById('seconds').textContent = String(s).padStart(2, '0');
    }, 1000);
}

// --- WRITER STREAM ANIMATIONS (Screen 5) ---
function startTypewriterMessage() {
    const birthdayMessage = `Dear Divya,\n\nHappy Birthday to someone incredibly special! 🎂🎈\n\nYou are sweet, loving, and my true rock. I am so lucky and grateful to have you in my life. Every single moment spent with you is pure magic.\n\nOn your special day, I wish you all the joy, love, and infinite happiness that you deserve. Here is to celebrating you today and forever!\n\nWith all my love,\nYour Best Friend ❤️`;
    
    const container = document.getElementById('typewriter-text');
    container.textContent = ""; 
    let index = 0;
    
    const typingInterval = setInterval(() => {
        if (index < birthdayMessage.length) {
            container.textContent += birthdayMessage.charAt(index);
            index++;
            
            const letterDiv = document.querySelector('.letter-box');
            letterDiv.scrollTop = letterDiv.scrollHeight;
        } else {
            clearInterval(typingInterval);
            document.getElementById('letter-next-btn').style.display = 'inline-block';
        }
    }, 35);
}

// --- CONSTANT BACKGROUND FALLING HEARTS ---
function generateFallingHearts() {
    const container = document.getElementById('phone-app');
    setInterval(() => {
        // Only generate falling items if app window is operational
        if (document.hidden) return;
        
        const heart = document.createElement('div');
        heart.className = 'clear-heart';
        
        // Random horizontal positions inside mobile layout bounds
        heart.style.left = Math.random() * 360 + 'px';
        
        // Variable size values
        const size = Math.random() * 12 + 8;
        heart.style.width = size + 'px';
        heart.style.height = size + 'px';
        
        // Randomized slow flight speeds
        heart.style.animationDuration = Math.random() * 3 + 4 + 's';
        
        container.appendChild(heart);
        
        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }, 450);
}

// --- INTERACTIVE TAP FINGER BURSTS ---
function createHeartBurst(e) {
    const activeScreen = document.querySelector('.screen.active');
    if (!activeScreen || activeScreen.id === 'screen-countdown') return;

    const posX = e.clientX || (e.touches && e.touches[0].clientX);
    const posY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (!posX || !posY) return;

    const container = document.getElementById('phone-app');
    const rect = container.getBoundingClientRect();
    
    // Relative target calculation boundaries inside mobile elements frame
    const relativeX = posX - rect.left;
    const relativeY = posY - rect.top;

    const heartCount = 4;
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'clear-heart burst-heart';
        heart.style.left = (relativeX - 8) + 'px';
        heart.style.top = (relativeY - 8) + 'px';
        
        const size = Math.floor(Math.random() * 6) + 10;
        heart.style.width = size + 'px';
        heart.style.height = size + 'px';

        const angle = (i * (360 / heartCount)) + (Math.random() * 25);
        const distance = Math.floor(Math.random() * 30) + 25;
        const moveX = Math.cos(angle * Math.PI / 180) * distance;
        const moveY = Math.sin(angle * Math.PI / 180) * distance - 30;

        const uniqueAnim = `burst-${Math.random().toString(36).substr(2, 9)}`;
        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(`
            @keyframes ${uniqueAnim} {
                0% { transform: translate3d(0, 0, 0) rotate(-45deg) scale(0.4); opacity: 0; }
                20% { opacity: 0.9; }
                100% { transform: translate3d(${moveX}px, ${moveY}px, 0) rotate(${Math.random() * 120}deg) scale(1); opacity: 0; }
            }
        `, styleSheet.cssRules.length);

        heart.style.animation = `${uniqueAnim} 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
        container.appendChild(heart);

        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }
}

// --- SYSTEM BOOT LOAD ENGINE ---
window.addEventListener('DOMContentLoaded', () => {
    generateFallingHearts();
    
    const appContainer = document.getElementById('phone-app');
    appContainer.addEventListener('click', createHeartBurst);
    appContainer.addEventListener('touchstart', createHeartBurst, { passive: true });
    
    // Initial startup check to see if screen 1 has an asset to load
    loadScreenAssets('screen-lock');
});