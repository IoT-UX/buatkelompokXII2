// script.js - Versi Pro dengan Ekspor
document.addEventListener('DOMContentLoaded', () => {

    const namaLakiLaki = ["Nathan Zachari", "Maulana Fajar", "Marsel Dwi Cesar S", "Hafiz Arfandaka Yettama", "Rehan Alkari", "Idhi Amin Akbar", "M Daffa Prayoga", "M Fathan Mutaqqin", "Haura Dipocakti", "Rasya Ichsan F", "Albertus Jonathan F", "Abi Nizar Sofyan"];
    const namaPerempuan = ["Finazla Satriani Putri", "Keisya Rajni", "Mutiara Assiva", "Nadea Adelia Alfa Putri", "Khanza Alixia", "Renaya Eka Rahayu", "Ghina Zhafiyyah", "Hana Elika Aura Sitorus", "Aurell Aini", "Regita Aulia", "Luna Belbina", "Sella Amanda", "Shofi Naila Irawati", "Rara Chika Pratiwi", "Luthfi Cayla Ayu Syifa", "Shofiya Ashyakira Daulay", "Raushan Minoo Juarsa", "Syifa Ramadhani", "Gresia Assyifa K", "Fina Zulfa Nabila", "Jolieka Nazara", "Marsilia Kiran Niar", "Remielle Linageng Suryadi", "Kayla Hanifaizha"];

    const generateBtn = document.getElementById('generate-btn');
    const clickSound = document.getElementById('click-sound');
    const exportContainer = document.getElementById('export-container');
    const exportWaBtn = document.getElementById('export-wa-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');

    let dataKelompokSaatIni = []; // Menyimpan hasil kelompok terakhir

    // --- LOGIKA KONTROL ANGKA KUSTOM ---
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const jumlahDisplay = document.getElementById('jumlah-kelompok-display');
    let jumlahKelompok = 6;
    const minKelompok = 2;
    const maxKelompok = 18; // Maksimal 2 orang per kelompok

    function updateJumlahDisplay() {
        jumlahDisplay.textContent = jumlahKelompok;
        btnMinus.disabled = jumlahKelompok <= minKelompok;
        btnPlus.disabled = jumlahKelompok >= maxKelompok;
    }
    updateJumlahDisplay(); // Panggil saat awal

    btnMinus.addEventListener('click', () => {
        if (jumlahKelompok > minKelompok) {
            jumlahKelompok--;
            updateJumlahDisplay();
        }
    });

    btnPlus.addEventListener('click', () => {
        if (jumlahKelompok < maxKelompok) {
            jumlahKelompok++;
            updateJumlahDisplay();
        }
    });

    // --- LOGIKA UTAMA GENERATE KELOMPOK ---
    generateBtn.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play();
        exportContainer.style.display = 'none'; // Sembunyikan tombol ekspor saat generate baru

        let lakiLakiShuffled = [...namaLakiLaki].sort(() => Math.random() - 0.5);
        let perempuanShuffled = [...namaPerempuan].sort(() => Math.random() - 0.5);

        const kelompokHasil = Array.from({ length: jumlahKelompok }, () => []);

        lakiLakiShuffled.forEach((nama, index) => kelompokHasil[index % jumlahKelompok].push(nama));
        perempuanShuffled.forEach((nama, index) => kelompokHasil[index % jumlahKelompok].push(nama));
        
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
            title.textContent = `Kelompok ${index + 1}`;
            card.appendChild(title);

            const list = document.createElement('ul');
            kelompok.sort(() => Math.random() - 0.5).forEach(nama => {
                const listItem = document.createElement('li');
                listItem.textContent = nama;
                listItem.style.animationDelay = `${totalNama * 50 + (index * 120)}ms`;
                list.appendChild(listItem);
                totalNama++;
            });

            card.appendChild(list);
            hasilContainer.appendChild(card);
        });
        
        // Tampilkan tombol ekspor setelah animasi selesai
        setTimeout(() => {
            exportContainer.style.display = 'flex';
        }, kelompokHasil.length * 120 + 500);
    }

    // --- LOGIKA EKSPOR ---
    exportWaBtn.addEventListener('click', () => {
        let waText = `*HASIL PEMBAGIAN KELOMPOK*\n\n`;
        dataKelompokSaatIni.forEach((kelompok, index) => {
            waText += `*Kelompok ${index + 1}*\n`;
            kelompok.forEach(nama => {
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
                kelompok.join('\n')
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