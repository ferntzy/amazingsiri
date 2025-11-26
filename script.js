// ====================== SONG SELECTOR (runs first) ======================
document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('songSelector');
    const audio = document.getElementById('bgMusic');

    if (selector) {
        document.querySelectorAll('.song-card').forEach(card => {
            card.addEventListener('click', () => {
                const songUrl = card.getAttribute('data-song');
                audio.src = songUrl;
                audio.volume = 0.35;
                audio.play().catch(e => console.log("Audio blocked until interaction:", e));

                // Fade out selector
                selector.style.opacity = '0';
                setTimeout(() => {
                    selector.style.display = 'none';
                }, 1800);
            });
        });
    }
});

// ====================== SCROLL REVEAL ======================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ====================== FIREWORKS CANVAS ======================
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let particles = [];
let fireworksActive = false;

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.alpha = 1;
        this.color = `hsl(${hue}, 100%, 65%)`;
        this.size = Math.random() * 3 + 2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.08;
        this.alpha -= 0.012;
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
}

function createFirework() {
    if (!fireworksActive) return;
    const x = canvas.width * (0.2 + Math.random() * 0.6);
    const y = canvas.height * (0.2 + Math.random() * 0.4);
    const hue = Math.random() * 360;

    for (let i = 0; i < 60; i++) {
        particles.push(new Particle(x, y, hue));
    }
}

function animateFireworks() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.alpha > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    if (fireworksActive && Math.random() < 0.09) createFirework();

    requestAnimationFrame(animateFireworks);
}
animateFireworks();

// ====================== FLOATING HEARTS (Section 3) ======================
function createHearts() {
    const container = document.querySelector('.section-3 .hearts-container');
    if (!container) return;

    for (let i = 0; i < 18; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = Math.random() > 0.5 ? '✨' : '✨';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 4 + 5) + 's';
            heart.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(heart);

            setTimeout(() => heart.remove(), 10000);
        }, i * 300);
    }
}

// ====================== SPARKLES (Section 4) ======================
function createSparkles() {
    const container = document.querySelector('.section-4 .sparkles');
    if (!container) return;

    for (let i = 0; i < 35; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        s.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(s);
    }
}

// ====================== LANTERNS (Celebration) ======================
function createLantern() {
    const lantern = document.createElement('div');
    lantern.className = 'lantern';
    lantern.style.left = Math.random() * 100 + 'vw';
    lantern.style.animationDuration = (Math.random() * 6 + 10) + 's';
    document.body.appendChild(lantern);
    setTimeout(() => lantern.remove(), 16000);
}

// ====================== SECTION OBSERVERS ======================
new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            createHearts();
            entry.target.removeEventListener; // run once
        }
    });
}, { threshold: 0.6 }).observe(document.querySelector('.section-3'));

new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) createSparkles();
    });
}, { threshold: 0.6 }).observe(document.querySelector('.section-4'));

// ====================== MODAL & YES/NO LOGIC ======================
const modal = document.getElementById('noModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalYesBtn = document.getElementById('modalYesBtn');
const modalNoBtn = document.getElementById('modalNoBtn');
let noCount = 0;

const noResponses = [
    { title: "Are you sure?", message: "namali kag pindot? HAHAHHAH... I promise to make you smile every day!" },
    { title: "Really?", message: "pero... I've been practicing my best jokes just for you!" },
    { title: "Di jod?", message: "I will treasure you like no one else ever could! Please say yes!" },
    { title: "Last chance na ni...", message: "say yes nalang oh HAHAHHAHHA" }
];

function showModal() {
    if (noCount < noResponses.length) {
        modalTitle.textContent = noResponses[noCount].title;
        modalMessage.textContent = noResponses[noCount].message;
        modal.classList.add('active');
    }
}

// All "No" buttons (including final one)
document.querySelectorAll('.no-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        noCount++;
        if (noCount >= 4) {
            forceYes();
        } else {
            showModal();
        }
    });
});

// All "Yes" buttons scroll to next or trigger celebration
document.querySelectorAll('.yes-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.id === 'finalYesBtn') {
            triggerCelebration();
        } else {
            const next = btn.closest('.section').nextElementSibling;
            if (next) next.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Modal Yes → celebration
modalYesBtn.onclick = () => {
    modal.classList.remove('active');
    triggerCelebration();
};

// Modal No → next message or force yes
modalNoBtn.onclick = () => {
    modal.classList.remove('active');
    noCount++;
    if (noCount >= 4) forceYes();
    else setTimeout(showModal, 400);
};

// Close modal on background click
modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('active');
});

function forceYes() {
    document.querySelectorAll('.no-btn').forEach(btn => {
        btn.textContent = 'Yes!';
        btn.classList.remove('no-btn');
        btn.classList.add('yes-btn');
        btn.onclick = triggerCelebration;
    });

    modalTitle.textContent = "HAHHAHAHHA";
    modalMessage.textContent = "bawal NO oy ";
    modalNoBtn.style.display = 'none';
    modalYesBtn.textContent = 'YES';
    modal.classList.add('active');
}

function triggerCelebration() {
    fireworksActive = true;
    canvas.classList.add('celebration');

    document.getElementById('celebrationSection').classList.add('active');
    document.getElementById('celebrationSection').scrollIntoView({ behavior: 'smooth' });

    // Big fireworks burst
    for (let i = 0; i < 20; i++) {
        setTimeout(createFirework, i * 150);
    }

    // Lantern shower
    for (let i = 0; i < 40; i++) {
        setTimeout(createLantern, i * 300);
    }
}
