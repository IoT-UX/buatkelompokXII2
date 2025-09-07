// script.js - Versi Final dengan Algoritma Pembagian Paling Adil
document.addEventListener('DOMContentLoaded', () => {

    const namaLakiLaki = ["Nathan Zachari", "Maulana Fajar", "Marsel Dwi Cesar S", "Hafiz Arfandaka Yettama", "Rehan Alkari", "Idhi Amin Akbar", "M Daffa Prayoga", "M Fathan Mutaqqin", "Haura Dipocakti", "Rasya Ichsan F", "Albertus Jonathan F", "Abi Nizar Sofyan"];
    const namaPerempuan = ["Finazla Satriani Putri", "Keisya Rajni", "Mutiara Assiva", "Nadea Adelia Alfa Putri", "Khanza Alixia", "Renaya Eka Rahayu", "Ghina Zhafiyyah", "Hana Elika Aura Sitorus", "Aurell Aini", "Regita Aulia", "Luna Belbina", "Sella Amanda", "Shofi Naila Irawati", "Rara Chika Pratiwi", "Luthfi Cayla Ayu Syifa", "Shofiya Ashyakira Daulay", "Raushan Minoo Juarsa", "Syifa Ramadhani", "Gresia Assyifa K", "Fina Zulfa Nabila", "Jolieka Nazara", "Marsilia Kiran Niar", "Remielle Lineng Suryadi", "Kayla Hanifaizha"];

    const generateBtn = document.getElementById('generate-btn');
    const clickSound = document.getElementById('click-sound');
    const exportContainer = document.getElementById('export-container');
    const exportWaBtn = document.getElementById('export-wa-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');

    let dataKelompokSaatIni = [];

    // --- LOGIKA KONTROL ANGKA KUSTOM ---
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const jumlahDisplay = document.getElementById('jumlah-kelompok-display');
    let jumlahKelompok = 6;
    const minKelompok = 2;
    const maxKelompok = 18;

    function updateJumlahDisplay() {
        jumlahDisplay.textContent = jumlahKelompok;
        btnMinus.disabled = jumlahKelompok <= minKelompok;
        btnPlus.disabled = jumlahKelompok >= maxKelompok;
    }
    updateJumlahDisplay();

    btnMinus.addEventListener('click', () => {
        if (jumlahKelompok > minKelompok) { jumlahKelompok--; updateJumlahDisplay(); }
    });
    btnPlus.addEventListener('click', () => {
        if (jumlahKelompok < maxKelompok) { jumlahKelompok++; updateJumlahDisplay(); }
    });

    // --- LOGIKA UTAMA GENERATE KELOMPOK ---
    generateBtn.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play();
        exportContainer.style.display = 'none';

        // ==========================================================
        // ALGORITMA PEMBAGIAN ADIL (VERSI BARU)
        // ==========================================================
        
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

        // 4. Buat kelompok dan distribusikan siswa
        const kelompokHasil = [];
        let indexSiswaSaatIni = 0;
        for (let i = 0; i < jumlahKelompok; i++) {
            // Kelompok awal akan mendapat 1 siswa tambahan dari sisa
            let ukuranKelompokIni = ukuranDasar + (i < sisaSiswa ? 1 : 0);
            
            // Ambil siswa dari array yang sudah diacak
            const kelompok = semuaSiswa.slice(indexSiswaSaatIni, indexSiswaSaatIni + ukuranKelompokIni);
            kelompokHasil.push(kelompok);
            
            // Pindahkan index untuk kelompok berikutnya
            indexSiswaSaatIni += ukuranKelompokIni;
        }
        // ==========================================================
        
        dataKelompokSaatIni = kelompokHasil; // Simpan hasilnya

        setTimeout(() => {
            tampilkanHasil(kelompokHasil);
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        }, 300);
    });

    function tampilkanHasil(kelompokHasil) {
        const hasilContainer = document.getElementById('hasil-kelompok');
        hasilContainer.innerHTML = '';
        let totalNama = 0;

        kelompokHasil.forEach((kelompok, index) => {
            const card = document.createElement('div');
            card.className = 'kelompok-card';
            card.style.animationDelay = `${index * 120}ms`;

            const title = document.createElement('h3');
            title.textContent = `Kelompok ${index + 1} (${kelompok.length} orang)`; // Tambahkan jumlah anggota
            card.appendChild(title);

            const list = document.createElement('ul');
            // Urutkan nama di dalam kelompok secara alfabetis
            kelompok.sort().forEach(nama => {
                const listItem = document.createElement('li');
                listItem.textContent = nama;
                listItem.style.animationDelay = `${totalNama * 50 + (index * 120)}ms`;
                list.appendChild(listItem);
                totalNama++;
            });

            card.appendChild(list);
            hasilContainer.appendChild(card);
        });
        
        setTimeout(() => {
            exportContainer.style.display = 'flex';
        }, kelompokHasil.length * 120 + 500);
    }

    // --- LOGIKA EKSPOR (TIDAK BERUBAH) ---
    exportWaBtn.addEventListener('click', () => {
        let waText = `*HASIL PEMBAGIAN KELOMPOK*\n\n`;
        dataKelompokSaatIni.forEach((kelompok, index) => {
            waText += `*Kelompok ${index + 1} (${kelompok.length} orang)*\n`;
            // Urutkan nama sebelum dibagikan
            kelompok.sort().forEach(nama => {
                waText += `- ${nama}\n`;
            });
            waText += `\n`;
        });
        const encodedText = encodeURIComponent(waText);
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    });

    exportPdfBtn.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont('helvetica', 'bold');
        doc.text('Hasil Pembagian Kelompok', 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Dibuat pada: ${new Date().toLocaleString('id-ID')}`, 105, 26, { align: 'center' });

        const tableData = [];
        dataKelompokSaatIni.forEach((kelompok, index) => {
            tableData.push([
                `Kelompok ${index + 1}`,
                // Urutkan nama sebelum dimasukkan ke PDF
                kelompok.sort().join('\n')
            ]);
        });

        doc.autoTable({
            head: [['No. Kelompok', 'Anggota']],
            body: tableData,
            startY: 35,
            theme: 'grid',
            headStyles: { fillColor: [29, 185, 84], halign: 'center' },
            styles: { valign: 'middle', cellPadding: 3 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
        });

        doc.save(`pembagian-kelompok-${Date.now()}.pdf`);
    });
});
