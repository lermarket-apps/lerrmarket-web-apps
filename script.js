try {
    const WA_NUMBER='6289509507883';
    let pendingOrder=null;
    let buyerData={name:'',wa:''};
    let countdownInterval;
    let tapCount = 0;
    let tapTimer;
    let isCheckoutActive = false; 
    let originalTitle = document.title;
    let titleInterval;

    // ==========================================
    // FITUR 1: ANTI DOUBLE-CLICK
    // ==========================================
    function lockButton(btnId, text = "MEMPROSES...") {
        const btn = document.getElementById(btnId);
        if(btn) {
            btn.disabled = true;
            btn.innerHTML = `<svg viewBox="0 0 24 24" style="animation: spin 1s linear infinite;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.3"/><path d="M12 2v4c4.41 0 8 3.59 8 8h4c0-6.63-5.37-12-12-12z"/></svg> ${text}`;
        }
    }
    function unlockButton(btnId, originalHTML) {
        const btn = document.getElementById(btnId);
        if(btn) {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    }

    const style = document.createElement('style');
    style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
    document.head.appendChild(style);

    // ==========================================
    // FITUR 2: JUDUL TAB DINAMIS
    // ==========================================
    function startTitleAnimation() {
        clearInterval(titleInterval);
        let showNotif = false;
        titleInterval = setInterval(() => {
            if (document.hidden) {
                document.title = showNotif ? "🔥 Ada yang Order Nih!" : "Hey, balik sini dong!";
                showNotif = !showNotif;
            } else {
                document.title = originalTitle;
            }
        }, 2000);
    }
    startTitleAnimation();

    // ==========================================
    // FITUR 3: ANTI CLOSE (PERINGATAN KELUAR)
    // ==========================================
    window.addEventListener('beforeunload', function (e) {
        if (isCheckoutActive) {
            e.preventDefault();
            e.returnValue = 'Pesanan kamu belum selesai. Yakin mau keluar?';
            return e.returnValue;
        }
    });

    // ==========================================
    // FITUR 4: JAM OPERASIONAL (07:00 - 23:00)
    // ==========================================
    function checkOperationalStatus() {
        const now = new Date();
        const hour = now.getHours();
        const statusEl = document.getElementById('statusOperational');
        const statusText = document.getElementById('statusText');
        
        if (statusEl && statusText) {
            if (hour >= 7 && hour < 23) {
                statusEl.className = 'status-operational online';
                statusText.textContent = 'Admin Online - Siap Bantu!';
            } else {
                statusEl.className = 'status-operational offline';
                statusText.textContent = 'Admin Off - Balas Pagi Jam 7';
            }
        }
    }
    checkOperationalStatus();
    setInterval(checkOperationalStatus, 60000);

    // ==========================================
    // SOCIAL PROOF
    // ==========================================
    let currentOrderCount = 124; 
    const orderCountEl = document.getElementById('orderCount');
    function updateOrderCount() {
        if (orderCountEl) {
            currentOrderCount += Math.floor(Math.random() * 2);
            orderCountEl.textContent = currentOrderCount;
        }
    }
    if(orderCountEl) orderCountEl.textContent = currentOrderCount;
    setInterval(updateOrderCount, Math.floor(Math.random() * 15000) + 15000);

    // DOWNLOAD QRIS
    function downloadQRIS() {
        const img = document.getElementById('qrisImage');
        if (!img || img.style.display === 'none' || img.naturalWidth === 0) {
            alert('Maaf, gambar QRIS belum tersedia. Silakan hubungi Admin untuk pembayaran manual.');
            return;
        }
        const link = document.createElement('a');
        link.href = img.src;
        link.download = 'QRIS_LerrMarket.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const toast = document.getElementById('toastCopy');
        toast.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> QRIS berhasil di-download!';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> Nominal berhasil disalin!';
            }, 500);
        }, 3000);
    }

    // SPLASH SCREEN
    const rainContainer = document.getElementById('splashRain');
    if(rainContainer) {
        const dropCount = 60;
        for (let i = 0; i < dropCount; i++) {
            let drop = document.createElement('div');
            drop.classList.add('drop');
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            drop.style.opacity = Math.random() * 0.4 + 0.1;
            drop.style.height = (Math.random() * 10 + 10) + 'px';
            rainContainer.appendChild(drop);
        }
    }

    const splashLightning = document.getElementById('splashLightning');
    function triggerSplashLightning() {
        if(splashLightning && document.getElementById('splash')) {
            splashLightning.classList.add('flash');
            setTimeout(() => { splashLightning.classList.remove('flash'); }, 600);
            const nextTime = Math.random() * 3000 + 2000;
            setTimeout(triggerSplashLightning, nextTime);
        }
    }
    setTimeout(triggerSplashLightning, 1000);

    window.addEventListener('load', function() {
        setTimeout(function() {
            const splash = document.getElementById('splash');
            if (splash) {
                splash.classList.add('hide');
                setTimeout(() => splash.remove(), 600);
            }
        }, 3500);
    });

    // EFEK HUJAN & PETIR GLOBAL
    const canvas = document.getElementById('rainCanvas');
    const ctx = canvas.getContext('2d');
    let raindrops = [];
    let lightningTimeout;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function initRain() {
        resizeCanvas();
        raindrops = [];
        const dropCount = Math.min(Math.floor(window.innerWidth / 10), 150);
        for (let i = 0; i < dropCount; i++) {
            raindrops.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 15 + 10,
                speed: Math.random() * 4 + 4,
                opacity: Math.random() * 0.3 + 0.2
            });
        }
    }

    function drawRain() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const isDark = document.body.classList.contains('dark-mode');
        ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(30, 64, 175, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';

        for (let i = 0; i < raindrops.length; i++) {
            const drop = raindrops[i];
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();

            drop.y += drop.speed;
            if (drop.y > canvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * canvas.width;
            }
        }
        requestAnimationFrame(drawRain);
    }

    function triggerLightning() {
        const overlay = document.getElementById('lightningOverlay');
        if(overlay) {
            overlay.style.opacity = '0.6';
            setTimeout(() => { overlay.style.opacity = '0'; }, 80);
            setTimeout(() => {
                overlay.style.opacity = '0.3';
                setTimeout(() => { overlay.style.opacity = '0'; }, 60);
            }, 150);

            const nextLightning = Math.random() * 10000 + 5000;
            clearTimeout(lightningTimeout);
            lightningTimeout = setTimeout(triggerLightning, nextLightning);
        }
    }

    window.addEventListener('load', function() {
        if(canvas) {
            initRain();
            drawRain();
            setTimeout(triggerLightning, 3000);
        }
    });

    window.addEventListener('resize', function() {
        if(canvas) {
            resizeCanvas();
            initRain();
        }
    });

    function openLink(url) {
        window.open(url, '_blank');
    }

    const secretTapArea = document.getElementById('secretTapArea');
    if(secretTapArea) {
        secretTapArea.addEventListener('click', function() {
            tapCount++;
            clearTimeout(tapTimer);
            if (tapCount >= 5) {
                document.getElementById('passwordScreen').classList.add('show');
                document.getElementById('secretPassword').value = '';
                tapCount = 0;
            } else {
                tapTimer = setTimeout(() => { tapCount = 0; }, 1000);
            }
        });
    }

    function checkPassword() {
        const pass = document.getElementById('secretPassword').value.toLowerCase();
        if (pass === 'wulann') {
            document.getElementById('passwordScreen').classList.remove('show');
            document.getElementById('secretMailBtn').classList.add('show');
            openModal('loveLetterModal');
            setTimeout(() => {
                document.getElementById('loveLetterModal').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } else {
            alert('Kata kunci salah! Coba lagi.');
            document.getElementById('secretPassword').value = '';
        }
    }

    function closePasswordScreen() {
        document.getElementById('passwordScreen').classList.remove('show');
        document.getElementById('secretPassword').value = '';
    }

    // TYPEWRITER
    const texts = [
        { text: "Halo, Selamat Datang!", color: "var(--text)" }, 
        { text: "Butuh Nokos? Di Sini Aja!", color: "var(--text)" }, 
        { text: "Bug WhatsApp Gacor? Bisa!", color: "var(--text)" }, 
        { text: "Jasa Vektor & Web? Amanah!", color: "var(--text)" },
        { text: "Love you wulann", color: "#ec4899" }
    ];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";
    let isDeleting = false;

    function typeWriter() {
        if (count === texts.length) { count = 0; }
        currentText = texts[count].text;
        const twText = document.getElementById('typewriter-text');
        if(twText) {
            twText.style.color = texts[count].color;
            if (isDeleting) {
                letter = currentText.slice(0, --index);
            } else {
                letter = currentText.slice(0, ++index);
            }
            twText.textContent = letter;

            let typeSpeed = 100;
            if (isDeleting) { typeSpeed /= 2; }

            if (!isDeleting && letter.length === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && letter.length === 0) {
                isDeleting = false;
                count++;
                typeSpeed = 500;
            }
            setTimeout(typeWriter, typeSpeed);
        }
    }
    typeWriter();

    // LIVE ORDER POPUP
    const fakeOrders = [
        { name: 'Andi', product: 'Nokos Indonesia' },
        { name: 'Budi', product: 'APK BUGXRAT' },
        { name: 'Rizky', product: 'Vektor Medium' },
        { name: 'Fajar', product: 'Nokos Hongkong' },
        { name: 'Dimas', product: 'APK DARKVERSE' },
        { name: 'Reza', product: 'Nokos Colombia' },
        { name: 'Adit', product: 'Nokos Zimbabwe' },
        { name: 'Rina', product: 'Nokos Indonesia' }
    ];

    function showLiveOrder() {
        const popup = document.getElementById('liveOrderPopup');
        const text = document.getElementById('liveOrderText');
        if(popup && text) {
            const order = fakeOrders[Math.floor(Math.random() * fakeOrders.length)];
            text.innerHTML = `<strong>${order.name}</strong> baru saja membeli <strong>${order.product}</strong>`;
            popup.classList.add('show');
            setTimeout(() => { popup.classList.remove('show'); }, 5000);
            const nextTime = Math.floor(Math.random() * 20000) + 25000;
            setTimeout(showLiveOrder, nextTime);
        }
    }
    setTimeout(showLiveOrder, 5000);

    // LACAK PESANAN
    function lacakPesanan() {
        const inputWA = document.getElementById('trackWA').value.trim();
        if (inputWA.length < 9) {
            alert('Masukkan nomor WhatsApp yang valid!');
            return;
        }
        let formatWA = inputWA.replace(/[^0-9]/g, '');
        if (formatWA.startsWith('0')) {
            formatWA = '62' + formatWA.substring(1);
        }
        const msg = `Halo Admin LerrMarket, saya mau cek status pesanan saya.\n\nNomor WA saya: ${formatWA}\n\nMohon dibantu dicek ya min, terima kasih.`;
        window.open('https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(msg),'_blank');
    }

    // DRAGGABLE WA BUTTON
    const floatingBtn = document.getElementById('floatingWA');
    let isDraggingBtn = false;
    let startXBtn, startYBtn, initialXBtn, initialYBtn;

    if(floatingBtn) {
        floatingBtn.addEventListener('mousedown', startDragBtn);
        floatingBtn.addEventListener('touchstart', startDragBtn, {passive: true});
    }

    function startDragBtn(e) {
        isDraggingBtn = false;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        startXBtn = clientX;
        startYBtn = clientY;
        const rect = floatingBtn.getBoundingClientRect();
        initialXBtn = rect.left;
        initialYBtn = rect.top;
        document.addEventListener('mousemove', dragBtn);
        document.addEventListener('touchmove', dragBtn, {passive: false});
        document.addEventListener('mouseup', stopDragBtn);
        document.addEventListener('touchend', stopDragBtn);
    }

    function dragBtn(e) {
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        const dx = clientX - startXBtn;
        const dy = clientY - startYBtn;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            isDraggingBtn = true;
            floatingBtn.style.animation = 'none';
            floatingBtn.style.bottom = 'auto';
            floatingBtn.style.right = 'auto';
            floatingBtn.style.left = (initialXBtn + dx) + 'px';
            floatingBtn.style.top = (initialYBtn + dy) + 'px';
            if (e.type === 'touchmove') e.preventDefault();
        }
    }

    function stopDragBtn() {
        document.removeEventListener('mousemove', dragBtn);
        document.removeEventListener('touchmove', dragBtn);
        document.removeEventListener('mouseup', stopDragBtn);
        document.removeEventListener('touchend', stopDragBtn);
        setTimeout(() => { floatingBtn.style.animation = 'floatBounce 3s ease-in-out infinite'; }, 100);
    }

    if(floatingBtn) {
        floatingBtn.addEventListener('click', function(e) {
            if (isDraggingBtn) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    // TEMA
    function toggleTheme() {
        const body = document.body;
        const icon = document.getElementById('themeIcon');
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            icon.innerHTML = '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm0-11c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1v1c0 .55.45 1 1 1zm0 18c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1s1-.45 1-1v-1c0-.55-.45-1-1-1zM4.22 4.22c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L4.22 4.22zm12.73 12.73c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.06-1.06zM2 13c0 .55.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1H3c-.55 0-1 .45-1 1zm18 0c0 .55.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1 .45-1 1zm-1.78-8.78c-.39-.39-1.02-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.06-1.06c.39-.39.39-1.02 0-1.41zm-12.73 12.73c-.39-.39-1.02-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.06-1.06c.39-.39.39-1.02 0-1.41z"/>';
        } else {
            icon.innerHTML = '<path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>';
        }
    }

    // NAVIGASI
    function showCatalog(tab) {
        document.getElementById('landing-page').style.display = 'none';
        document.getElementById('catalog-page').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.getElementById('tab-apps').style.display = 'none';
        document.getElementById('tab-nokos').style.display = 'none';
        document.getElementById('tab-vektor').style.display = 'none';
        document.getElementById('tab-web').style.display = 'none';
        document.getElementById('tab-' + tab).style.display = 'block';
    }

    function hideCatalog() {
        document.getElementById('catalog-page').style.display = 'none';
        document.getElementById('landing-page').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function openModal(id){ document.getElementById(id).classList.add('open'); }
    function closeModal(id){ document.getElementById(id).classList.remove('open'); }

    function formatRupiah(angka) {
        return 'Rp ' + angka.toLocaleString('id-ID');
    }

    function copyNominal() {
        const nominal = document.getElementById('payTotalPrice').innerText;
        navigator.clipboard.writeText(nominal).then(() => {
            const toast = document.getElementById('toastCopy');
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2500);
        }).catch(err => {
            alert('Gagal menyalin nominal: ' + err);
        });
    }

    function startTimer() {
        clearInterval(countdownInterval);
        let timeLeft = 15 * 60;
        const timerEl = document.getElementById('countdown');

        countdownInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                timerEl.innerText = "Waktu Habis";
                timerEl.style.color = "#dc2626";
                return;
            }
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerEl.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            if (timeLeft < 180) {
                timerEl.parentElement.style.background = "#fecaca";
                timerEl.parentElement.style.borderColor = "#b91c1c";
                timerEl.style.color = "#b91c1c";
            }
        }, 1000);
    }

    function buyTier(product, tier, priceString){
        let basePrice = parseInt(priceString.replace(/[^0-9]/g, ''));
        // Generate ID Pesanan baru di sini
        let orderId = 'LM-' + Math.floor(Math.random() * 89999 + 10000);
        
        pendingOrder = { product: product, tier: tier, basePrice: basePrice, orderId: orderId, totalPrice: basePrice };
        
        document.getElementById('sumProduct').textContent = product;
        document.getElementById('sumTier').textContent = tier;
        document.getElementById('sumPrice').textContent = formatRupiah(basePrice);
        document.getElementById('buyerName').value = buyerData.name || '';
        document.getElementById('buyerWA').value = buyerData.wa || '';
        
        unlockButton('btnSubmitForm', `LANJUT PEMBAYARAN <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>`);
        
        openModal('formModal');
    }

    function openNokosPicker(product, displayName, prices){
        document.getElementById('nokosPickerTitle').textContent = displayName;
        const container = document.getElementById('nokosPickerOptions');
        container.innerHTML = '';
        prices.forEach(p => {
            const btn = document.createElement('button');
            btn.className = 'btn-big';
            btn.style.marginBottom = '0';
            btn.innerHTML = formatRupiah(p) + ' <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:currentColor;"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';
            btn.onclick = function(){
                closeModal('nokosPickerModal');
                buyTier(product, displayName + ' — ' + formatRupiah(p), 'Rp' + p);
            };
            container.appendChild(btn);
        });
        openModal('nokosPickerModal');
    }

    function submitForm(){
        const n=document.getElementById('buyerName').value.trim();
        const w=document.getElementById('buyerWA').value.trim();
        if(n.length<2 || w.length<9){ alert('Lengkapi nama & nomor WA dengan benar!'); return; }
        
        lockButton('btnSubmitForm', 'MEMPROSES...');

        buyerData={name:n,wa:w};
        
        document.getElementById('payProductName').textContent = pendingOrder.product;
        document.getElementById('payProductTier').textContent = "Paket: " + pendingOrder.tier;
        document.getElementById('payOrderId').textContent = '#' + pendingOrder.orderId;
        document.getElementById('payTotalPrice').textContent = formatRupiah(pendingOrder.totalPrice);
        
        closeModal('formModal');
        setTimeout(()=>{
            openModal('paymentModal');
            startTimer();
            isCheckoutActive = true; 

            unlockButton('btnConfirmPaid', `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> SUDAH BAYAR`);

        }, 500); 
    }

    function confirmPaid(){
        if(!pendingOrder || !buyerData.name) return;

        lockButton('btnConfirmPaid', 'MEMPROSES...');

        const today = new Date();
        const dateStr = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
        document.getElementById('rcptId').textContent = '#' + pendingOrder.orderId;
        document.getElementById('rcptDate').textContent = dateStr;
        document.getElementById('rcptName').textContent = buyerData.name;
        document.getElementById('rcptProduct').textContent = pendingOrder.product;
        document.getElementById('rcptTier').textContent = pendingOrder.tier;
        document.getElementById('rcptTotal').textContent = formatRupiah(pendingOrder.totalPrice);
        
        closeModal('paymentModal');
        setTimeout(() => {
            openModal('receiptModal');
            isCheckoutActive = false; 
        }, 500);
    }

    function copyReceipt() {
        const id = document.getElementById('rcptId').innerText;
        const date = document.getElementById('rcptDate').innerText;
        const name = document.getElementById('rcptName').innerText;
        const product = document.getElementById('rcptProduct').innerText;
        const tier = document.getElementById('rcptTier').innerText;
        const total = document.getElementById('rcptTotal').innerText;
        const receiptText = `--- STRUK LERRMARKET ---\nID: ${id}\nTanggal: ${date}\nNama: ${name}\nProduk: ${product}\nPaket: ${tier}\nTOTAL: ${total}\n------------------------`;
        navigator.clipboard.writeText(receiptText).then(() => {
            const toast = document.getElementById('toastCopy');
            toast.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> Struk berhasil disalin!';
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> Nominal berhasil disalin!';
                }, 500);
            }, 2500);
        });
    }

    function goToWA() {
        let wa=buyerData.wa.replace(/[^0-9]/g,'');
        if(wa.startsWith('0')) wa='62'+wa.substring(1);
        
        const msg = `Halo Admin LerrMarket, saya mau konfirmasi pesanan saya ya.

🆔 Kode Pesanan: #${pendingOrder.orderId}
👤 Nama: ${buyerData.name}
📱 WA: ${wa}

📦 Produk: ${pendingOrder.product}
💳 Paket: ${pendingOrder.tier}

💰 Total: ${formatRupiah(pendingOrder.totalPrice)}

Ini bukti transfer & struk saya min, mohon segera diproses. Terima kasih! 🙏`;
        
        window.open('https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(msg),'_blank');
        closeModal('receiptModal');
        clearInterval(countdownInterval);
        isCheckoutActive = false;
    }

    function openWA(id,name){
        let msg=id ? `Halo Admin, saya mau beli:\n\nID: ${id}\nNama: ${name}` : `Halo Admin, ${name}`;
        window.open('https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(msg),'_blank');
    }

} catch (error) {
    console.error("Terjadi kesalahan pada script:", error);
    setTimeout(() => {
        const splash = document.getElementById('splash');
        if (splash) splash.classList.add('hide');
    }, 1000);
}
