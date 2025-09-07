// script.js - Versi Sempurna (Logika Sudut 100% Akurat & Warna Dinamis)
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // BAGIAN 1: MESIN RODA PEMUTAR BARU (DENGAN LOGIKA SUDUT AKURAT & WARNA DINAMIS)
    // ==========================================================

    // Palet warna gelap yang akan digunakan secara bergantian
    const DARK_COLOR_PALETTE = [
        '#34495E', '#2C3E50', '#16A085', '#27AE60', '#2ECC71', // Biru-Hijau
        '#8E44AD', '#9B59B6', '#3498DB', '#2980B9',           // Ungu-Biru
        '#E67E22', '#D35400', '#C0392B', '#E74C3C',           // Oranye-Merah
        '#F1C40F', '#F39C12'                                  // Kuning
    ];

    class Wheel {
        constructor(canvas, props) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.props = props;

            // Atur DPI untuk tampilan tajam di layar HiDPI/Retina
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = 500 * dpr;
            this.canvas.height = 500 * dpr;
            this.canvas.style.width = '450px';
            this.canvas.style.height = '450px';
            this.ctx.scale(dpr, dpr);

            this.radius = 250; // Setengah dari lebar canvas asli (500/2)
            this.arc = (2 * Math.PI) / this.props.items.length;
            this.currentAngle = 0;
            this.isSpinning = false;

            this.draw(); // Gambar roda saat pertama kali dibuat
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.save();
            this.ctx.translate(this.radius, this.radius);
            this.ctx.rotate(this.currentAngle);

            this.props.items.forEach((item, i) => {
                // Gambar segmen
                this.ctx.beginPath();
                this.ctx.arc(0, 0, this.radius - 5, -this.arc / 2, this.arc / 2);
                this.ctx.lineTo(0, 0);
                this.ctx.fillStyle = item.fillStyle;
                this.ctx.fill();

                // Gambar garis pemisah
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(this.radius, 0);
                this.ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                // Gambar teks
                this.ctx.save();
                this.ctx.fillStyle = item.textFillStyle || 'white';
                this.ctx.font = `600 ${this.radius * 0.08}px Poppins, sans-serif`;
                this.ctx.textAlign = 'right'; // Kanan agar teks tidak terpotong
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

            // --- LOGIKA SUDUT BARU YANG 100% AKURAT ---
            const segmentAngle = (2 * Math.PI) / this.props.items.length;
            // Posisi tengah segmen target (dalam radian, dimulai dari jam 3)
            const centerOfTarget = targetSegmentIndex * segmentAngle;
            
            // Posisi jarum (di jam 12 atau -90 derajat = -Math.PI / 2 radian)
            // Namun, karena canvas berputar searah jarum jam, kita ingin teksnya menghadap ke jarum.
            // Pointer ada di atas (0 derajat), teks diputar 90 derajat searah jarum jam relatif ke segmen.
            // Jadi target kita sebenarnya adalah menempatkan TULISAN di posisi jam 12.
            const targetPointerAngle = -Math.PI / 2; // Ini adalah posisi "jam 12" pada lingkaran matematis
            
            // Perlu menyesuaikan karena teks digambar dengan rotate(this.arc) dan then rotate(-90deg) for text
            // Jadi, jika teks menghadap ke kanan (0 radian), kita ingin dia diputar ke jam 12
            // Sudut yang dibutuhkan agar segmen target pas di bawah jarum
            const angleToAlign = targetPointerAngle - centerOfTarget;
            
            // Tambahkan sedikit acak agar tidak berhenti di tempat yang sama persis
            const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8);
            
            // Jumlah putaran penuh untuk efek dramatis (minimal 8 putaran)
            const fullSpins = 8 * (2 * Math.PI);

            // Perhitungan final angle harus mempertimbangkan currentAngle agar tidak "loncat"
            // Kita ingin memutar dari currentAngle menuju (fullSpins + angleToAlign + randomOffset)
            const totalRotationNeeded = fullSpins + angleToAlign + randomOffset;

            // Pastikan roda selalu berputar searah jarum jam
            let finalTargetAngle = this.currentAngle - (this.currentAngle % (2 * Math.PI)) + totalRotationNeeded;
            if (finalTargetAngle < this.currentAngle + fullSpins) { // Pastikan setidaknya ada fullSpins
                finalTargetAngle += (2 * Math.PI);
            }

            const duration = 7000; // 7 detik
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                if (elapsed >= duration) {
                    this.isSpinning = false;
                    this.currentAngle = finalTargetAngle; // Setel ke sudut akhir
                    this.draw();
                    if (this.props.onRest) this.props.onRest(this.props.items[targetSegmentIndex]);
                    return;
                }
                const t = elapsed / duration;
                const progress = 1 - Math.pow(1 - t, 4); // Efek perlambatan (Ease-out Quart)
                this.currentAngle = finalTargetAngle * progress;
                this.draw();
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }
    }


    // ==========================================================
    // BAGIAN 2: LOGIKA APLIKASI UTAMA
    // ==========================================================

    const namaLakiLaki = ["Nathan Zachari", "Maulana Fajar", "Marsel Dwi Cesar S", "Hafiz Arfandaka Yettama", "Rehan Alkari", "Idhi Amin Akbar", "Daffa Prayoga", "Fathan Mutaqqin", "Haura Dipocakti", "Rasya Ichsan F", "Albertus Jonathan F", "Abi Nizar Sofyan"];
    const namaPerempuan = ["Finazla Satriani Putri", "Keisya Rajni", "Mutiara Assiva", "Nadea Adelia Alfa Putri", "Khanza Alixia", "Renaya Eka Rahayu", "Ghina Zhafiyyah", "Hana Elika Aura Sitorus", "Aurell Aini", "Regita Aulia", "Luna Belbina", "Sella Amanda", "Shofi Naila Irawati", "Rara Chika Pratiwi", "Luthfi Cayla Ayu Syifa", "Shofiya Ashyakira Daulay", "Raushan Minoo Juarsa", "Syifa Ramadhani", "Gresia Assyifa K", "Fina Zulfa Nabila", "Jolieka Nazara", "Marsilia Kiran Niar", "Remielle Lineng Suryadi", "Kayla Hanifaizha"];
    let currentMode = 'cepat', jumlahKelompok = 6, hasilFinal = [], theWheel;
    
    const views = document.querySelectorAll('.view'), setupView = document.getElementById('setup-view'), spinView = document.getElementById('spin-view'), resultView = document.getElementById('result-view');
    const modeCepatBtn = document.getElementById('mode-cepat-btn'), modeSpinBtn = document.getElementById('mode-spin-btn'), generateBtn = document.getElementById('generate-btn'), resetBtn = document.getElementById('reset-btn'), spinBtn = document.getElementById('spin-btn');
    const clickSound = document.getElementById('click-sound'), wheelSound = document.getElementById('wheel-sound'), successSound = document.getElementById('success-sound');
    const spinStatus = document.getElementById('spin-status');

    // Mengambil palet warna dari CSS (seperti yang didefinisikan di :root)
    const style = getComputedStyle(document.body);
    const dynamicColorPalette = [];
    for (let i = 1; i <= 15; i++) { // Sesuaikan angka 15 dengan jumlah warna di CSS
        const color = style.getPropertyValue(`--color-palette-${i}`).trim();
        if (color) {
            dynamicColorPalette.push(color);
        }
    }


    // --- INISIALISASI ---
    modeCepatBtn.addEventListener('click', () => setMode('cepat'));
    modeSpinBtn.addEventListener('click', () => setMode('spin'));
    function setMode(mode) {
        currentMode = mode;
        modeCepatBtn.classList.toggle('active', mode === 'cepat');
        modeSpinBtn.classList.toggle('active', mode === 'spin');
    }
    const btnMinus = document.getElementById('btn-minus'), btnPlus = document.getElementById('btn-plus'), jumlahDisplay = document.getElementById('jumlah-kelompok-display');
    const minKelompok = 2, maxKelompok = 18;
    function updateJumlahDisplay() {
        jumlahDisplay.textContent = jumlahKelompok;
        btnMinus.disabled = jumlahKelompok <= minKelompok;
        btnPlus.disabled = jumlahKelompok >= maxKelompok;
    }
    btnMinus.addEventListener('click', () => { if (jumlahKelompok > minKelompok) { jumlahKelompok--; updateJumlahDisplay(); } });
    btnPlus.addEventListener('click', () => { if (jumlahKelompok < maxKelompok) { jumlahKelompok++; updateJumlahDisplay(); } });
    updateJumlahDisplay();
    generateBtn.addEventListener('click', () => { clickSound.play(); jalankanPembagian(); });
    resetBtn.addEventListener('click', () => {
        clickSound.play();
        switchView(setupView);
        document.getElementById('hasil-kelompok').innerHTML = '';
        document.getElementById('export-container').style.display = 'none';
    });

    // --- FUNGSI ALUR PROGRAM ---
    function switchView(activeView) {
        views.forEach(view => view.classList.remove('active'));
        activeView.classList.add('active');
    }
    
    function jalankanPembagian() {
        const semuaSiswa = [...namaLakiLaki, ...namaPerempuan].sort(() => Math.random() - 0.5);
        const ukuranDasar = Math.floor(semuaSiswa.length / jumlahKelompok);
        const sisaSiswa = semuaSiswa.length % jumlahKelompok;
        hasilFinal = [];
        let indexSiswaSaatIni = 0;
        for (let i = 0; i < jumlahKelompok; i++) {
            let ukuranKelompokIni = ukuranDasar + (i < sisaSiswa ? 1 : 0);
            hasilFinal.push(semuaSiswa.slice(indexSiswaSaatIni, indexSiswaSaatIni + ukuranKelompokIni));
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
            // Tambahkan kelas warna ke card untuk judul
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

    function initSpinMode() {
        sisaLaki = [...namaLakiLaki];
        sisaPerempuan = [...namaPerempuan];
        antrianPilihan = hasilFinal.flat();
        const spinResultsContainer = document.getElementById('spin-results');
        spinResultsContainer.innerHTML = '';
        hasilFinal.forEach((kelompok, index) => {
            const card = createGroupCard(index, kelompok.length);
            // Tambahkan kelas warna ke card untuk judul di mode spin
            card.classList.add(`color-${(index % dynamicColorPalette.length) + 1}`);
            spinResultsContainer.appendChild(card);
        });
        switchView(spinView);
        requestAnimationFrame(() => {
            setTimeout(siapkanPutaranBerikutnya, 50);
        });
    }
    
    function siapkanPutaranBerikutnya() {
        if (antrianPilihan.length === 0) {
            setTimeout(selesaikanPembagianSpin, 1000);
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
                // Gunakan palet warna gelap secara bergantian untuk segmen roda
                fillStyle: dynamicColorPalette[index % dynamicColorPalette.length]
            })),
            onRest: () => {
                wheelSound.pause();
                wheelSound.currentTime = 0;
                
                const namaLengkap = antrianPilihan.shift();
                if (namaLakiLaki.includes(namaLengkap)) {
                    sisaLaki = sisaLaki.filter(n => n !== namaLengkap);
                } else {
                    sisaPerempuan = sisaPerempuan.filter(n => n !== namaLengkap);
                }

                for(let i = 0; i < hasilFinal.length; i++) {
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
    function typewriterEffect(text) {
        spinStatus.textContent = '';
        spinStatus.classList.add('typing');
        spinStatus.style.width = `${text.length}ch`;
        setTimeout(() => {
            spinStatus.textContent = text;
            spinStatus.classList.remove('typing');
        }, 2000);
    }
    function createGroupCard(index, memberCount) {
        const card = document.createElement('div');
        card.className = 'kelompok-card';
        card.innerHTML = `<h3>Kelompok ${index + 1} <span>(${memberCount} orang)</span></h3><ul></ul>`;
        return card;
    }
    document.getElementById('export-wa-btn').addEventListener('click', () => {
        let waText = `*HASIL PEMBAGIAN KELOMPOK*\n\n`;
        hasilFinal.forEach((kelompok, index) => {
            waText += `*Kelompok ${index + 1} (${kelompok.length} orang)*\n`;
            kelompok.sort().forEach(nama => { waText += `- ${nama}\n`; });
            waText += `\n`;
        });
        window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, '_blank');
    });
    document.getElementById('export-pdf-btn').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFont('helvetica', 'bold');
        doc.text('Hasil Pembagian Kelompok', 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Dibuat pada: ${new Date().toLocaleString('id-ID')}`, 105, 26, { align: 'center' });
        const tableData = [];
        hasilFinal.forEach((kelompok, index) => {
            tableData.push([`Kelompok ${index + 1}`, kelompok.sort().join('\n')]);
        });
        doc.autoTable({
            head: [['No. Kelompok', 'Anggota']], body: tableData, startY: 35,
            theme: 'grid', headStyles: { fillColor: [29, 185, 84], halign: 'center' },
            styles: { valign: 'middle', cellPadding: 3 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
        });
        doc.save(`pembagian-kelompok-${Date.now()}.pdf`);
    });
});

