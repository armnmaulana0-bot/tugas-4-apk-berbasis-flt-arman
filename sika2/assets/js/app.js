/* SIKA 2 - app.js (Bab 4)
   Struktur: 1 seleksi elemen, 2 fungsi, 3 event.
   Catatan keamanan: tanpa secret, tanpa eval, teks pengguna lewat textContent.
   Validasi di sini hanya untuk UX; validasi server (PHP) tetap wajib pada Bab 6. */
'use strict';

console.log('JavaScript SIKA 2 aktif');

/* ---------- 1. Seleksi elemen (null-safe: file dipakai semua halaman) ---------- */
const formMahasiswa = document.getElementById('formMahasiswa');
const nim = document.getElementById('nim');
const nama = document.getElementById('nama');
const email = document.getElementById('email');
const prodi = document.getElementById('prodi');
const angkatan = document.getElementById('angkatan');
const errorNim = document.getElementById('errorNim');
const errorNama = document.getElementById('errorNama');
const errorEmail = document.getElementById('errorEmail');
const errorProdi = document.getElementById('errorProdi');
const errorAngkatan = document.getElementById('errorAngkatan');
const statusForm = document.getElementById('statusForm');
const hitungNama = document.getElementById('hitungNama');
const previewNama = document.getElementById('previewNama');
const btnResetPesan = document.getElementById('btnResetPesan');
const btnBersihkan = document.getElementById('btnBersihkan');

const btnCek = document.getElementById('btnCek');
const statusAplikasi = document.getElementById('statusAplikasi');

const cari = document.getElementById('cariMahasiswa');
const filterProdi = document.getElementById('filterProdi');
const pesanKosong = document.getElementById('pesanKosong');
const rows = document.querySelectorAll('#tabelMahasiswa tbody tr');

/* ---------- 2. Fungsi ---------- */
function setError(input, errorEl, message) {
  errorEl.textContent = message;
  input.classList.add('input-error');
  input.classList.remove('input-ok');
  input.setAttribute('aria-invalid', 'true');
}

function clearError(input, errorEl) {
  errorEl.textContent = '';
  input.classList.remove('input-error');
  input.classList.add('input-ok');
  input.removeAttribute('aria-invalid');
}

function validateNim() {
  const value = nim.value.trim();
  if (!/^\d{8}$/.test(value)) {
    setError(nim, errorNim, 'NIM harus terdiri dari 8 digit angka.');
    return false;
  }
  clearError(nim, errorNim);
  return true;
}

function validateNama() {
  const value = nama.value.trim();
  if (value.length < 3) {
    setError(nama, errorNama, 'Nama minimal 3 karakter.');
    return false;
  }
  clearError(nama, errorNama);
  return true;
}

function validateEmail() {
  const value = email.value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(value)) {
    setError(email, errorEmail, 'Format email tidak valid.');
    return false;
  }
  clearError(email, errorEmail);
  return true;
}

function validateProdi() {
  if (prodi.value === '') {
    setError(prodi, errorProdi, 'Program studi wajib dipilih.');
    return false;
  }
  clearError(prodi, errorProdi);
  return true;
}

function validateAngkatan() {
  const value = Number(angkatan.value);
  const min = Number(angkatan.min) || 2020;
  const max = Number(angkatan.max) || 2030;
  if (angkatan.value === '' || !Number.isInteger(value) || value < min || value > max) {
    setError(angkatan, errorAngkatan, 'Angkatan harus berupa tahun ' + min + ' sampai ' + max + '.');
    return false;
  }
  clearError(angkatan, errorAngkatan);
  return true;
}

function resetPesanValidasi() {
  const pairs = [
    [nim, errorNim], [nama, errorNama], [email, errorEmail],
    [prodi, errorProdi], [angkatan, errorAngkatan]
  ];
  pairs.forEach(function (pair) {
    pair[1].textContent = '';
    pair[0].classList.remove('input-error', 'input-ok');
    pair[0].removeAttribute('aria-invalid');
  });
  statusForm.textContent = '';
  statusForm.classList.remove('success', 'error');
}

function updateNamaInfo() {
  hitungNama.textContent = nama.value.length + ' karakter';
  previewNama.textContent = nama.value.trim() === '' ? '-' : nama.value;
}

function tampilkanStatus(el, pesan, tipe) {
  el.textContent = pesan;
  el.classList.remove('success', 'error');
  el.classList.add(tipe);
}

function filterMahasiswa() {
  const keyword = cari.value.trim().toLowerCase();
  const prodiDipilih = filterProdi ? filterProdi.value.toLowerCase() : '';
  let terlihat = 0;
  rows.forEach(function (row) {
    const text = row.textContent.toLowerCase();
    const cocokKeyword = text.includes(keyword);
    const cocokProdi = prodiDipilih === '' || text.includes(prodiDipilih);
    row.hidden = !(cocokKeyword && cocokProdi);
    if (!row.hidden) terlihat++;
  });
  if (pesanKosong) pesanKosong.hidden = terlihat !== 0;
}

/* ---------- 3 tomol status. Event ---------- */
if (btnCek && statusAplikasi) {
  btnCek.addEventListener('click', function () {
    tampilkanStatus(statusAplikasi, 'SIKA 2 aktif dan JavaScript berjalan.', 'success');
  });
}

if (formMahasiswa && nim && nama && email && prodi && angkatan) {
  nim.addEventListener('blur', validateNim);
  nama.addEventListener('blur', validateNama);
  email.addEventListener('blur', validateEmail);
  prodi.addEventListener('change', validateProdi);
  angkatan.addEventListener('blur', validateAngkatan);
  nama.addEventListener('input', updateNamaInfo);

  formMahasiswa.addEventListener('submit', function (event) {
    // Semua validasi dijalankan agar semua pesan error tampil sekaligus.
    const hasil = [validateNim(), validateNama(), validateEmail(),
                   validateProdi(), validateAngkatan()];
    event.preventDefault(); // Bab 4: belum ada backend, data tidak dikirim
    if (hasil.includes(false)) {
      tampilkanStatus(statusForm, 'Periksa kembali isian yang bertanda kesalahan.', 'error');
      return;
    }
    tampilkanStatus(statusForm, 'Validasi berhasil. Data siap diproses pada tahap PHP.', 'success');
  });

  if (btnResetPesan) btnResetPesan.addEventListener('click', resetPesanValidasi);

  if (btnBersihkan) {
    btnBersihkan.addEventListener('click', function () {
      if (confirm('Bersihkan seluruh isian form?')) {
        formMahasiswa.reset();
        resetPesanValidasi();
        updateNamaInfo();
      }
    });
  }
}

if (cari && rows.length > 0) {
  cari.addEventListener('input', filterMahasiswa);
  if (filterProdi) filterProdi.addEventListener('change', filterMahasiswa);
}
