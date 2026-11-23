let selectedType = "icon"; 
let selectedIcon = "🪷";
const MAX_KRATHONG = 6;
let launchCount = parseInt(localStorage.getItem('t2_krathong_count')) || 0;

const canvas = document.getElementById('krathongCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let isDrawing = false;
let currentColor = '#16a34a';
let hasDrawn = false; 

if (canvas && ctx) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function startDraw(e) {
        isDrawing = true;
        hasDrawn = true;
        const pos = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    function draw(e) {
        if (!isDrawing) return;
        if (e.cancelable) e.preventDefault(); 
        const pos = getCoordinates(e);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = document.getElementById('brushSize').value;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }

    function stopDraw() {
        isDrawing = false;
        ctx.closePath();
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDraw);
}

document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', function() {
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        this.classList.add('active');
        currentColor = this.getAttribute('data-color');
    });
});

function clearCanvas() {
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hasDrawn = false;
    }
}

document.querySelectorAll('.krathong-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.krathong-option').forEach(el => el.classList.remove('active'));
        this.classList.add('active');
        
        selectedType = this.getAttribute('data-type');
        const drawArea = document.getElementById('drawArea');

        if (selectedType === 'draw') {
            drawArea.style.display = 'flex';
        } else {
            drawArea.style.display = 'none';
            selectedIcon = this.getAttribute('data-icon');
        }
    });
});

function updateQuotaDisplay() {
    const btn = document.querySelector('.launch-btn');
    if (!btn) return;
    
    let quotaText = document.getElementById('quotaInfo');
    if (!quotaText) {
        quotaText = document.createElement('div');
        quotaText.id = 'quotaInfo';
        quotaText.style.marginTop = '6px';
        quotaText.style.fontSize = '0.75rem';
        quotaText.style.textAlign = 'center';
        btn.parentNode.appendChild(quotaText);
    }

    const remaining = MAX_KRATHONG - launchCount;

    if (remaining > 0) {
        quotaText.style.color = '#ffea9f';
        quotaText.innerText = `✨ สามารถลอยได้อีก ${remaining} ใบ (จากทั้งหมด ${MAX_KRATHONG} ใบ)`;
    } else {
        quotaText.style.color = '#ff7b7b';
        quotaText.innerText = `🚫 คุณใช้สิทธิ์ลอยกระทงครบ ${MAX_KRATHONG} ใบแล้ว`;
        btn.disabled = true;
        btn.style.background = '#555';
        btn.style.color = '#aaa';
        btn.style.cursor = 'not-allowed';
        btn.style.boxShadow = 'none';
        btn.innerText = 'ลอยครบโควตาแล้ว';
    }
}

function createFirework() {
    const container = document.getElementById('fireworksContainer');
    if (!container) return;

    const firework = document.createElement('div');
    firework.className = 'firework';

    const randomX = Math.floor(Math.random() * 85) + 8;
    const randomY = Math.floor(Math.random() * 45) + 10;
    const colors = ['#ff4d4d', '#ffdf00', '#00ffcc', '#ff66b2', '#9933ff', '#ffffff', '#ff9900'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    firework.style.left = randomX + '%';
    firework.style.top = randomY + '%';
    firework.style.setProperty('--firework-color', randomColor);

    container.appendChild(firework);
    setTimeout(() => firework.remove(), 1600);
}

function createKrathongElement(name, wish, visualContent, isCustomDrawing = false) {
    const river = document.getElementById('river');
    if (!river) return;

    const item = document.createElement('div');
    item.className = 'floating-item';

    const randomTop = Math.floor(Math.random() * 40) + 10;
    const randomDuration = Math.floor(Math.random() * 8) + 16;

    item.style.position = 'absolute';
    item.style.top = randomTop + '%';
    item.style.display = 'flex';
    item.style.flexDirection = 'column';
    item.style.alignItems = 'center';
    item.style.animation = `floatLeft ${randomDuration}s linear forwards, bobbing 2.5s ease-in-out infinite`;
    item.style.zIndex = '6';

    const krathongVisualHTML = isCustomDrawing 
        ? `<img src="${visualContent}" style="width:100px; height:70px; object-fit:contain; filter:drop-shadow(0 6px 10px rgba(0,0,0,0.9)); background:rgba(255,255,255,0.12); padding:2px; border-radius:8px;" alt="กระทงวาดเอง">`
        : `<div style="font-size:2.5rem; filter:drop-shadow(0 4px 8px rgba(0,0,0,0.8));">${visualContent}</div>`;

    item.innerHTML = `
        <div style="background:rgba(10,15,35,0.85); border:1px solid #ffd700; padding:5px 8px; border-radius:8px; font-size:0.7rem; text-align:center; margin-bottom:3px; max-width:160px; word-wrap:break-word;">
            <span style="color:#ffd700; font-weight:600; display:block;">${escapeHtml(name)}</span>
            <span style="color:#f0f0f0; font-weight:300;">${escapeHtml(wish)}</span>
        </div>
        ${krathongVisualHTML}
        <div style="width:50px; height:10px; background:radial-gradient(ellipse at center, rgba(255,200,50,0.8) 0%, transparent 70%); border-radius:50%; margin-top:-3px;"></div>
    `;

    river.appendChild(item);
    setTimeout(() => item.remove(), randomDuration * 1000);
}

function launchKrathong() {
    if (launchCount >= MAX_KRATHONG) {
        alert(`จำกัดการลอยกระทงไม่เกิน ${MAX_KRATHONG} ครั้งต่อคนครับ`);
        return;
    }

    if (selectedType === 'draw' && !hasDrawn) {
        alert("กรุณาวาดรูปกระทงก่อนปล่อยลงน้ำนะครับ 🎨");
        return;
    }

    const nameInput = document.getElementById('userName');
    const wishInput = document.getElementById('userWish');

    const name = nameInput.value.trim() || "นักเรียน ท.๒";
    const wish = wishInput.value.trim() || "ขอให้มีความสุข สุขภาพแข็งแรง";

    let visualContent = selectedIcon;
    let isCustom = false;

    if (selectedType === 'draw') {
        visualContent = canvas.toDataURL('image/png');
        isCustom = true;
        clearCanvas();
    }

    // ส่งข้อมูลขึ้น Firebase Real-time Database (ถ้ามีการเชื่อมต่อใน HTML) หรือแสดงผลในเครื่องทันที
    if (typeof window.sendKrathongToFirebase === 'function') {
        window.sendKrathongToFirebase(name, wish, visualContent, isCustom);
    } else {
        createKrathongElement(name, wish, visualContent, isCustom);
    }

    wishInput.value = "";
    launchCount++;
    localStorage.setItem('t2_krathong_count', launchCount);
    updateQuotaDisplay();
}

// ป้องกัน XSS เบื้องต้น
function escapeHtml(text) {
    const map = {
        '&': '&',
        '<': '<',
        '>': '>',
        '"': '"',
        "'": '''
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

window.onload = () => {
    updateQuotaDisplay(); 
    setInterval(createFirework, 1500);
};