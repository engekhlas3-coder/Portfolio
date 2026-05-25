document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.getElementById('closeBtn');

    if(menuBtn && sidebar && closeBtn) {
        menuBtn.addEventListener('click', () => { sidebar.classList.add('open'); });
        closeBtn.addEventListener('click', () => { sidebar.classList.remove('open'); });
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuBtn.contains(e.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    }

    const canvas = document.getElementById('spaceCanvas');
    const ctx = canvas.getContext('2d');

    let stars = [];
    let meteors = [];
    let nebulae = [];
    const starCount = 150; 

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initSpaceElements();
    }

    function initSpaceElements() {
        stars = []; meteors = []; nebulae = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                opacity: Math.random(),
                twinkleSpeed: 0.005 + Math.random() * 0.015,
                vx: (Math.random() - 0.5) * 0.12,
                vy: 0.05 + Math.random() * 0.18
            });
        }
        nebulae.push({
            x: canvas.width * 0.3,
            y: canvas.height * 0.4,
            radius: Math.max(canvas.width, canvas.height) * 0.4,
            color: 'rgba(0, 90, 160, 0.15)', angle: 0, speed: 0.0002
        });
    }

    function createMeteor() {
        if (meteors.length < 8 && Math.random() < 0.06) {
            const colors = ['rgba(210, 219, 235, ', 'rgba(135, 206, 250, ', 'rgba(255, 215, 0, '];
            meteors.push({
                x: Math.random() * canvas.width * 0.8,
                y: Math.random() * canvas.height * 0.75 - 30,
                length: 50 + Math.random() * 60, speed: 5 + Math.random() * 3,
                angle: 0.5 + Math.random() * 0.2, opacity: 0.9,
                colorBase: colors[Math.floor(Math.random() * colors.length)], lineWidth: 1 + Math.random() * 1.2
            });
        }
    }

    function animate() {
        ctx.fillStyle = '#01162B'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'screen';
        nebulae.forEach(n => {
            n.angle += n.speed; let grad = ctx.createRadialGradient(n.x + Math.sin(n.angle)*20, n.y + Math.cos(n.angle)*20, 0, n.x + Math.sin(n.angle)*20, n.y + Math.cos(n.angle)*20, n.radius);
            grad.addColorStop(0, n.color); grad.addColorStop(1, 'rgba(1, 22, 43, 0)');
            ctx.beginPath(); ctx.arc(n.x + Math.sin(n.angle)*20, n.y + Math.cos(n.angle)*20, n.radius, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
        });
        ctx.globalCompositeOperation = 'source-over';

        stars.forEach(s => {
            s.opacity += s.twinkleSpeed; if (s.opacity > 1 || s.opacity < 0.1) s.twinkleSpeed = -s.twinkleSpeed;
            s.x += s.vx; s.y += s.vy;
            if (s.x < 0) s.x = canvas.width; if (s.x > canvas.width) s.x = 0; if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
            ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(210, 219, 235, ${Math.abs(s.opacity)})`; ctx.fill();
        });

        createMeteor();
        meteors.forEach((m, idx) => {
            m.x += m.speed; m.y += m.speed * m.angle; m.opacity -= 0.012;
            if (m.opacity <= 0 || m.x > canvas.width || m.y > canvas.height) { meteors.splice(idx, 1); } 
            else {
                ctx.beginPath(); let grad = ctx.createLinearGradient(m.x, m.y, m.x - m.length, m.y - m.length * m.angle);
                grad.addColorStop(0, `${m.colorBase}${m.opacity})`); grad.addColorStop(1, 'rgba(1, 22, 43, 0)');
                ctx.strokeStyle = grad; ctx.lineWidth = m.lineWidth; ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.length, m.y - m.length * m.angle); ctx.stroke();
            }
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); animate();

    const qrContainer = document.getElementById("qrcode");
    if (qrContainer) {
        new QRCode(qrContainer, {
            text: window.location.href, 
            width: 95,
            height: 95,
            colorDark : "#4dd0e1",      
            colorLight : "#01162B"      
        });
    }
});