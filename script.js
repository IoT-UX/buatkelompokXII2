
// script.js - Versi Sempurna (Logika Super Adil & Spin Cerdas)
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // BAGIAN 1: MESIN RODA PEMUTAR (TIDAK BERUBAH)
    // ==========================================================
    class Wheel {
        constructor(canvas, props) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.props = props;
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = 500 * dpr;
            this.canvas.height = 500 * dpr;
            this.canvas.style.width = '450px';
            this.canvas.style.height = '450px';
            this.ctx.scale(dpr, dpr);
            this.radius = 250;
            this.arc = (2 * Math.PI) / this.props.items.length;
            this.currentAngle = 0;
            this.isSpinning = false;
            this.draw();
        }
        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.save();
            this.ctx.translate(this.radius, this.radius);
            this.ctx.rotate(this.currentAngle);
            this.props.items.forEach((item, i) => {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, this.radius - 5, -this.arc / 2, this.arc / 2);
                this.ctx.lineTo(0, 0);
                this.ctx.fillStyle = item.fillStyle;
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(this.radius, 0);
                this.ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.save();
                this.ctx.fillStyle = item.textFillStyle || 'white';
                this.ctx.font = `600 ${this.radius * 0.08}px Poppins, sans-serif`;
                this.ctx.textAlign = 'right';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(item.text, this.radius * 0.85, 0);
                this.ctx.restore();
                this.ctx.rotate(this.arc);
            });
            this.ctx.restore();
        }
        spinTo(targetSegmentIndex) {
            if (this.isSpinning) return;
            this.isSpinning = true;
            const segmentAngle = (2 * Math.PI) / this.props.items.length;
            const centerOfTarget = targetSegmentIndex * segmentAngle;
            const pointerPosition = -Math.PI / 2;
            const angleToAlign = pointerPosition - centerOfTarget;
            const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8);
            const fullSpins = 8 * (2 * Math.PI);
            const finalTargetAngle = this.currentAngle - (this.currentAngle % (2 * Math.PI)) + fullSpins + angleToAlign + randomOffset;
            const duration = 7000;
            const startTime = performance.now();
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                if (elapsed >= duration) {
                    this.isSpinning = false;
                    this.currentAngle = finalTargetAngle;
                    this.draw();
                    if (this.props.onRest) this.props.onRest(this.props.items[targetSegmentIndex]);
                    return;
                }
                const t = elapsed / duration;
                const progress = 1 - Math.pow(1 - t, 4);
                this.currentAngle = finalTargetAngle * progress;
                this.draw();
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }
    }

    // ==========================================================
    // BAGIAN 2: LOGIKA APLIKASI UTAMA (DENGAN PEMBARUAN)
    // ==========================================================
    const namaLakiLaki = ["Nathan Zachari", "Maulana Fajar", "Marsel Dwi Cesar S", "Hafiz Arfandaka Yettama", "Rehan Alkari", "Idhi Amin Akbar", "M Daffa Prayoga", "M Fathan Mutaqqin", "Haura Dipocakti", "Rasya Ichsan F", "Albertus Jonathan F", "Abi Nizar Sofyan"];
    const namaPerempuan = ["Finazla Satriani Putri", "Keisya Rajni", "Mutiara Assiva", "Nadea Adelia Alfa Putri", "Khanza Alixia", "Renaya Eka Rahayu", "Ghina Zhafiyyah BP", "Hana Elika Aura Sitorus", "Aurell Aini", "Regita Aulia", "Luna Belbina", "Sella Amanda", "Shofi Naila Irawati", "Rara Chika Pratiwi", "Luthfi Cayla Ayu Syifa", "Shofiya Ashyakira Daulay", "Raushan Minoo Juarsa", "Syifa Ramadhani", "Gresia Assyifa K", "Fina Zulfa Nabila", "Jolieka Nazara", "Marsilia Kiran Niar", "Remielle Lineng Suryadi", "Kayla Hanifaizha"];
    let currentMode = 'cepat', jumlahKelompok = 6, hasilFinal = [], theWheel;
    const views = document.querySelectorAll('.view'), setupView = document.getElementById('setup-view'), spinView = document.getElementById('spin-view'), resultView = document.getElementById('result-view');
    const modeCepatBtn = document.getElementById('mode-cepat-btn'), modeSpinBtn = document.getElementById('mode-spin-btn'), generateBtn = document.getElementById('generate-btn'), resetBtn = document.getElementById('reset-btn'), spinBtn = document.getElementById('spin-btn');
    const clickSound = document.getElementById('click-sound'), wheelSound = document.getElementById('wheel-sound'), successSound = document.getElementById('success-sound');
    const spinStatus = document.getElementById('spin-status');
    const style = getComputedStyle(document.body);
    const dynamicColorPalette = [];
    for (let i = 1; i <= 15; i++) {
        const color = style.getPropertyValue(`--color-palette-${i}`).trim();
        if (color) dynamicColorPalette.push(color);
    }

    // --- INISIALISASI ---
    modeCepatBtn.addEventListener('click', () => setMode('cepat'));
    modeSpinBtn.addEventListener('click', () => setMode('spin'));
    function setMode(mode) { currentMode = mode; modeCepatBtn.classList.toggle('active', mode === 'cepat'); modeSpinBtn.classList.toggle('active', mode === 'spin'); }
    const btnMinus = document.getElementById('btn-minus'), btnPlus = document.getElementById('btn-plus'), jumlahDisplay = document.getElementById('jumlah-kelompok-display');
    const minKelompok = 2, maxKelompok = 18;
    function updateJumlahDisplay() { jumlahDisplay.textContent = jumlahKelompok; btnMinus.disabled = jumlahKelompok <= minKelompok; btnPlus.disabled = jumlahKelompok >= maxKelompok; }
    btnMinus.addEventListener('click', () => { if (jumlahKelompok > minKelompok) { jumlahKelompok--; updateJumlahDisplay(); } });
    btnPlus.addEventListener('click', () => { if (jumlahKelompok < maxKelompok) { jumlahKelompok++; updateJumlahDisplay(); } });
    updateJumlahDisplay();
    generateBtn.addEventListener('click', () => { clickSound.play(); jalankanPembagian(); });
    resetBtn.addEventListener('click', () => { clickSound.play(); switchView(setupView); document.getElementById('hasil-kelompok').innerHTML = ''; document.getElementById('export-container').style.display = 'none'; });

    // --- FUNGSI ALUR PROGRAM ---
    function switchView(activeView) { views.forEach(view => view.classList.remove('active')); activeView.classList.add('active'); }
    
    // --- [PEMBARUAN] ALGORITMA SUPER ADIL (V2) ---
    function jalankanPembagian() {
        // 1. Gabungkan semua siswa menjadi satu array
        const semuaSiswa = [...namaLakiLaki, ...namaPerempuan];
        
        // 2. Acak total seluruh siswa
        for (let i = semuaSiswa.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [semuaSiswa[i], semuaSiswa[j]] = [semuaSiswa[j], semuaSiswa[i]];
        }

        // 3. Hitung ukuran dasar dan sisa pembagian
        const totalSiswa = semuaSiswa.length;
        const ukuranDasar = Math.floor(totalSiswa / jumlahKelompok);
        const sisaSiswa = totalSiswa % jumlahKelompok;

        // 4. Buat kelompok dan distribusikan siswa dengan presisi
        hasilFinal = [];
        let indexSiswaSaatIni = 0;
        for (let i = 0; i < jumlahKelompok; i++) {
            // Kelompok awal akan mendapat 1 siswa tambahan dari sisa
            let ukuranKelompokIni = ukuranDasar + (i < sisaSiswa ? 1 : 0);
            
            // Ambil siswa dari array yang sudah diacak
            const kelompok = semuaSiswa.slice(indexSiswaSaatIni, indexSiswaSaatIni + ukuranKelompokIni);
            hasilFinal.push(kelompok);
            
            // Pindahkan index untuk kelompok berikutnya
            indexSiswaSaatIni += ukuranKelompokIni;
        }

        if (currentMode === 'cepat') {
            tampilkanHasilCepat();
        } else {
            initSpinMode();
        }
    }

    // --- MODE CEPAT ---
    function tampilkanHasilCepat() {
        const hasilContainer = document.getElementById('hasil-kelompok');
        hasilContainer.innerHTML = '';
        hasilFinal.forEach((kelompok, index) => {
            const card = createGroupCard(index, kelompok.length);
            card.classList.add(`color-${(index % dynamicColorPalette.length) + 1}`);
            const list = card.querySelector('ul');
            kelompok.sort().forEach(nama => {
                const listItem = document.createElement('li');
                listItem.textContent = nama;
                list.appendChild(listItem);
            });
            hasilContainer.appendChild(card);
        });
        document.getElementById('export-container').style.display = 'flex';
        switchView(resultView);
        successSound.play();
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }

    // --- MODE SPIN ---
    let antrianPilihan = [], sisaLaki = [], sisaPerempuan = [];
    let ukuranGrupTerakhir = 0;

    function initSpinMode() {
        sisaLaki = [...namaLakiLaki];
        sisaPerempuan = [...namaPerempuan];
        antrianPilihan = hasilFinal.flat();
        ukuranGrupTerakhir = hasilFinal[hasilFinal.length - 1].length;

        const spinResultsContainer = document.getElementById('spin-results');
        spinResultsContainer.innerHTML = '';
        hasilFinal.forEach((kelompok, index) => {
            const card = createGroupCard(index, kelompok.length);
            card.classList.add(`color-${(index % dynamicColorPalette.length) + 1}`);
            spinResultsContainer.appendChild(card);
        });
        switchView(spinView);
        requestAnimationFrame(() => {
            setTimeout(siapkanPutaranBerikutnya, 50);
        });
    }
    
    function siapkanPutaranBerikutnya() {
        if (antrianPilihan.length <= ukuranGrupTerakhir) {
            selesaikanOtomatis();
            return;
        }

        const targetNama = antrianPilihan[0];
        const isLaki = namaLakiLaki.includes(targetNama);
        const pool = isLaki ? sisaLaki : sisaPerempuan;
        
        typewriterEffect(`Memilih ${isLaki ? 'Siswa' : 'Siswi'}...`);
        
        const wheelCanvas = document.getElementById('wheel-canvas');
        theWheel = new Wheel(wheelCanvas, {
            items: pool.map((nama, index) => ({
                text: nama.split(' ')[0],
                fillStyle: dynamicColorPalette[index % dynamicColorPalette.length]
            })),
            onRest: () => {
                wheelSound.pause(); wheelSound.currentTime = 0;
                const namaLengkap = antrianPilihan.shift();
                if (namaLakiLaki.includes(namaLengkap)) { sisaLaki = sisaLaki.filter(n => n !== namaLengkap); } 
                else { sisaPerempuan = sisaPerempuan.filter(n => n !== namaLengkap); }
                for (let i = 0; i < hasilFinal.length; i++) {
                    if (hasilFinal[i].includes(namaLengkap)) {
                        const card = document.querySelectorAll('#spin-results .kelompok-card')[i];
                        const listItem = document.createElement('li');
                        listItem.textContent = namaLengkap;
                        card.querySelector('ul').appendChild(listItem);
                        card.classList.add('highlight');
                        setTimeout(() => card.classList.remove('highlight'), 1500);
                        break;
                    }
                }
                successSound.play();
                confetti({ particleCount: 50, spread: 40, origin: { x: 0.5, y: 0.2 }, angle: 270, startVelocity: 40 });
                setTimeout(siapkanPutaranBerikutnya, 2000);
            }
        });
        spinBtn.disabled = false;
        spinBtn.textContent = 'PUTAR';
    }

    function selesaikanOtomatis() {
        typewriterEffect('Mengisi kelompok terakhir...');
        spinBtn.disabled = true;
        spinBtn.textContent = 'SELESAI';
        
        antrianPilihan.forEach((nama, i) => {
            setTimeout(() => {
                for (let j = 0; j < hasilFinal.length; j++) {
                    if (hasilFinal[j].includes(nama)) {
                        const card = document.querySelectorAll('#spin-results .kelompok-card')[j];
                        if (card.querySelector('ul').children.length < hasilFinal[j].length) {
                            const listItem = document.createElement('li');
                            listItem.textContent = nama;
                            card.querySelector('ul').appendChild(listItem);
                            card.classList.add('highlight');
                            successSound.currentTime = 0; successSound.play();
                            setTimeout(() => card.classList.remove('highlight'), 1500);
                        }
                        break;
                    }
                }
            }, i * 500);
        });

        setTimeout(selesaikanPembagianSpin, antrianPilihan.length * 500 + 1000);
    }

    spinBtn.addEventListener('click', () => {
        if (theWheel && !theWheel.isSpinning) {
            clickSound.play();
            wheelSound.play();
            spinBtn.disabled = true;
            spinBtn.textContent = 'BERPUTAR...';
            const targetNama = antrianPilihan[0];
            const pool = namaLakiLaki.includes(targetNama) ? sisaLaki : sisaPerempuan;
            const targetIndex = pool.indexOf(targetNama);
            theWheel.spinTo(targetIndex);
        }
    });
    
    function selesaikanPembagianSpin() {
        tampilkanHasilCepat();
    }

    // --- FUNGSI BANTU & EKSPOR ---
    function typewriterEffect(text) { spinStatus.textContent = ''; spinStatus.classList.add('typing'); spinStatus.style.width = `${text.length}ch`; setTimeout(() => { spinStatus.textContent = text; spinStatus.classList.remove('typing'); }, 2000); }
    function createGroupCard(index, memberCount) { const card = document.createElement('div'); card.className = 'kelompok-card'; card.innerHTML = `<h3>Kelompok ${index + 1} <span>(${memberCount} orang)</span></h3><ul></ul>`; return card; }
    document.getElementById('export-wa-btn').addEventListener('click', () => { let waText = `*HASIL PEMBAGIAN KELOMPOK*\n\n`; hasilFinal.forEach((kelompok, index) => { waText += `*Kelompok ${index + 1} (${kelompok.length} orang)*\n`; kelompok.sort().forEach(nama => { waText += `- ${nama}\n`; }); waText += `\n`; }); window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, '_blank'); });
    document.getElementById('export-pdf-btn').addEventListener('click', () => { const { jsPDF } = window.jspdf; const doc = new jsPDF(); doc.setFont('helvetica', 'bold'); doc.text('Hasil Pembagian Kelompok', 105, 20, { align: 'center' }); doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.text(`Dibuat pada: ${new Date().toLocaleString('id-ID')}`, 105, 26, { align: 'center' }); const tableData = []; hasilFinal.forEach((kelompok, index) => { tableData.push([`Kelompok ${index + 1}`, kelompok.sort().join('\n')]); }); doc.autoTable({ head: [['No. Kelompok', 'Anggota']], body: tableData, startY: 35, theme: 'grid', headStyles: { fillColor: [29, 185, 84], halign: 'center' }, styles: { valign: 'middle', cellPadding: 3 }, alternateRowStyles: { fillColor: [245, 245, 245] }, }); doc.save(`pembagian-kelompok-${Date.now()}.pdf`); });
});
