# IF3250_K01_G04_IOM-02

## Deskripsi

OTA-ku adalah sistem berbasis web yang dirancang untuk mengelola program Orang Tua Asuh (OTA) di Institut Teknologi Bandung (ITB), yang merupakan salah satu bentuk bantuan dari Ikatan Orang Tua Mahasiswa ITB (IOM-ITB). Sistem ini memfasilitasi proses pencocokan antara Orang Tua Mahasiswa (OTM) yang ingin menjadi donatur dengan mahasiswa ITB yang membutuhkan dukungan finansial. Mahasiswa yang membutuhkan bantuan dapat mendaftar dengan mengisi formulir pengajuan, sementara OTM yang ingin menjadi Orang Tua Asuh dapat mendaftar melalui formulir khusus dan mendapatkan akses ke dashboard untuk memilih mahasiswa yang akan diasuh. Sistem ini memiliki tiga jenis pengguna utama, yaitu Mahasiswa, Orang Tua Asuh, dan Pengurus. Aplikasi ini bekerja secara online sehingga pengguna perlu melakukan login untuk melakukan autentikasi terlebih dahulu untuk menjalankan website.

## Instalasi dan Cara Menjalankan Program

### Windows

1. Tambahkan file `.env` dan `.env.local` pada folder backend dengan isi seperti pada `.env.example`. Tambahkan juga file `.env` pada folder frontend dengan isi seperti pada `.env.example`.

2. Jalankan command berikut pada terminal:

    ```bash
    # Command untuk instalasi, pilih 1 untuk instalasi environment development, pilih 2 untuk instalasi environment production
    ./setup.bat

    # Command untuk melakukan migrasi database
    ./migrate.bat
    ```

3. Untuk melakukan development, jalankan command berikut pada terminal:

    ```bash
    # Command untuk menjalankan database
    docker-compose up -d db

    # Command untuk menjalankan backend
    cd backend
    npm run dev:local

    # Command untuk menjalankan frontend
    cd frontend
    npm run dev
    ```

4. Jika pada langkah ke 2 memilih environment production, maka program sudah bisa diakses pada `http://localhost:5173`.

### Linux

1. Tambahkan file `.env` dan `.env.local` pada folder backend dengan isi seperti pada `.env.example`. Tambahkan juga file `.env` pada folder frontend dengan isi seperti pada `.env.example`.

2. Jalankan command berikut pada terminal:

    ```bash
    # Command untuk instalasi, pilih 1 untuk instalasi environment development, pilih 2 untuk instalasi environment production
    ./setup.sh

    # Command untuk melakukan migrasi database
    ./migrate.sh
    ```

3. Untuk melakukan development, jalankan command berikut pada terminal:

    ```bash
    # Command untuk menjalankan database
    docker-compose up -d db

    # Command untuk menjalankan backend
    cd backend
    npm run dev:local

    # Command untuk menjalankan frontend
    cd frontend
    npm run dev
    ```

4. Jika pada langkah ke 2 memilih environment production, maka program sudah bisa diakses pada `http://localhost:5173`.

## Anggota

| Nama                             | NIM      |
|----------------------------------|----------|
| Shafiq Irvansyah                 | 13522003 |
| Ahmad Naufal Ramadan             | 13522005 |
| Yusuf Ardian Sandi               | 13522015 |
| Randy Verdian                    | 13522067 |
| Ellijah Darrellshane Suryanegara | 13522097 |
