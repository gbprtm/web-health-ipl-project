# sinkron-rancangan.ps1
#
# Menyalin dokumen rancangan dari vault ke docs/rancangan/ di repo ini.
# Sumber kebenaran tetap vault; folder hasil salinan bersifat read-only.
#
# Pakai:
#   powershell -ExecutionPolicy Bypass -File .\scripts\sinkron-rancangan.ps1
#
# Setelah dokumen di vault berubah, jalankan ulang skrip ini lalu commit.

param(
    [string]$Vault = "C:\Users\HYPE AMD\Documents\brain-project",
    [string]$Tanggal = (Get-Date -Format "yyyy-MM-dd")
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$dest = Join-Path $root "docs\rancangan"
$utf8 = New-Object System.Text.UTF8Encoding($false)

if (-not (Test-Path -LiteralPath $Vault)) {
    throw "Vault tidak ditemukan: $Vault"
}

# sumber di vault -> tujuan di docs/rancangan
$files = @(
    @{ src = "docs\produk\ringkasan-proyek.md";    out = "ringkasan-proyek.md" },
    @{ src = "docs\produk\prd-v0.3.md";            out = "prd-v0.3.md" },
    @{ src = "docs\to-do\rencana-agen.md";         out = "rencana-agen.md" },
    @{ src = "docs\to-do\to-do.md";                out = "to-do.md" },
    @{ src = "hirarki\hirarki yang diusulkan.md";  out = "hirarki.md" },
    @{ src = "saran\yang-perlu-diinstal.md";       out = "yang-perlu-diinstal.md" },
    @{ src = "plan\03-fitur-dan-rencana-uji.md";   out = "rencana-uji.md" },
    @{ src = "plan\04-pembagian-tugas.md";         out = "peran.md" },
    @{ src = "plan\05-risiko-dan-tindak-lanjut.md"; out = "risiko.md" },
    @{ src = "design\01-peta-alur.md";             out = "design\01-peta-alur.md" },
    @{ src = "design\02-wireframe-pasien.md";      out = "design\02-wireframe-pasien.md" },
    @{ src = "design\03-wireframe-klinik.md";      out = "design\03-wireframe-klinik.md" },
    @{ src = "design\04-state-dan-copy.md";        out = "design\04-state-dan-copy.md" }
)

# nama berkas di vault -> letak salinan relatif terhadap docs/rancangan
$map = @{
    "prd-v0.3"                     = "prd-v0.3.md"
    "ringkasan-proyek"             = "ringkasan-proyek.md"
    "rencana-agen"                 = "rencana-agen.md"
    "to-do"                        = "to-do.md"
    "hirarki yang diusulkan"       = "hirarki.md"
    "yang-perlu-diinstal"          = "yang-perlu-diinstal.md"
    "03-fitur-dan-rencana-uji"     = "rencana-uji.md"
    "04-pembagian-tugas"           = "peran.md"
    "05-risiko-dan-tindak-lanjut"  = "risiko.md"
    "01-peta-alur"                 = "design/01-peta-alur.md"
    "02-wireframe-pasien"          = "design/02-wireframe-pasien.md"
    "03-wireframe-klinik"          = "design/03-wireframe-klinik.md"
    "04-state-dan-copy"            = "design/04-state-dan-copy.md"
}

function Buang-Frontmatter([string]$teks) {
    if ($teks -notmatch "^---\r?\n") { return $teks }
    $tutup = [regex]::Match($teks.Substring(4), "(?m)^---\s*$")
    if (-not $tutup.Success) { return $teks }
    return $teks.Substring(4 + $tutup.Index + $tutup.Length).TrimStart("`r", "`n")
}

function Ubah-Tautan([string]$teks, [string]$outRel) {
    $outRel = $outRel -replace "\\", "/"
    $curDir = ""
    $slash = $outRel.LastIndexOf("/")
    if ($slash -ge 0) { $curDir = $outRel.Substring(0, $slash + 1) }

    $sb = New-Object System.Text.StringBuilder
    $akhir = 0
    foreach ($m in [regex]::Matches($teks, "\[\[([^\]]+)\]\]")) {
        [void]$sb.Append($teks.Substring($akhir, $m.Index - $akhir))

        $isi = $m.Groups[1].Value
        $bagian = $isi -split "\|", 2
        $tujuan = ($bagian[0] -split "#")[0].Trim()
        $label = if ($bagian.Count -gt 1) { $bagian[1] } else { $tujuan }
        $kunci = $tujuan.ToLower()

        if ($map.ContainsKey($kunci)) {
            $lokasi = $map[$kunci]
            if ($curDir -eq "") {
                $rel = $lokasi
            } elseif ($lokasi.StartsWith($curDir)) {
                $rel = $lokasi.Substring($curDir.Length)
            } else {
                $rel = "../" + $lokasi
            }
            [void]$sb.Append("[$label]($rel)")
        } else {
            [void]$sb.Append($label)
        }
        $akhir = $m.Index + $m.Length
    }
    [void]$sb.Append($teks.Substring($akhir))
    $hasil = $sb.ToString()

    # tautan relatif yang sudah ditulis di vault (bukan wiki link) diarahkan ke salinan
    $hasil = $hasil.Replace("../docs/produk/prd-v0.3.md", "../prd-v0.3.md")
    $hasil = $hasil.Replace("](docs/produk/prd-v0.3.md)", "](prd-v0.3.md)")

    return $hasil
}

$catatan = "> **Salinan read-only.** Berkas ini disalin dari dokumen rancangan proyek pada $Tanggal. Jangan diubah di repo ini; usulkan perubahan ke pemilik proyek.`n`n"

$baris = @()
$jumlah = 0

foreach ($f in $files) {
    $sumber = Join-Path $Vault $f.src
    if (-not (Test-Path -LiteralPath $sumber)) {
        throw "Sumber tidak ada: $($f.src)"
    }

    $tujuan = Join-Path $dest $f.out
    $folder = Split-Path -Parent $tujuan
    if (-not (Test-Path -LiteralPath $folder)) {
        [void](New-Item -ItemType Directory -Path $folder -Force)
    }

    $teks = [System.IO.File]::ReadAllText($sumber, $utf8)
    $teks = Buang-Frontmatter $teks
    $teks = Ubah-Tautan $teks $f.out
    $teks = $catatan + $teks

    [System.IO.File]::WriteAllText($tujuan, $teks, $utf8)

    $sha = (Get-FileHash -LiteralPath $sumber -Algorithm SHA256).Hash.Substring(0, 12).ToLower()
    $ukuran = [math]::Round((Get-Item -LiteralPath $sumber).Length / 1KB, 1)
    $tautan = $f.out -replace "\\", "/"
    $baris += "| [$tautan]($tautan) | ``$($f.src -replace '\\', '/')`` | $ukuran KB | ``$sha`` |"
    $jumlah++
}

$manifest = @"
# Dokumen Rancangan

Salinan baca dari dokumen rancangan proyek. **Jangan edit berkas di folder ini.**
Sumber kebenarannya ada di luar repo; salinan ini dibuat otomatis supaya isi repo
bisa dipahami tanpa akses ke sana.

Untuk memperbarui: minta pemilik proyek menjalankan
``scripts/sinkron-rancangan.ps1``, lalu commit.

| Berkas | Sumber | Ukuran | SHA256 (12) |
|---|---|---|---|
$($baris -join "`n")

Disalin: $Tanggal - $jumlah berkas.

## Urutan baca yang disarankan

1. [ringkasan-proyek.md](ringkasan-proyek.md) - apa yang dibangun dan kenapa (7 menit)
2. [prd-v0.3.md](prd-v0.3.md) - kebutuhan lengkap dan kriteria terima
3. [rencana-agen.md](rencana-agen.md) - daftar pekerjaan per tugas
4. [to-do.md](to-do.md) - aturan, urutan, dan gerbang
5. [hirarki.md](hirarki.md) - letak berkas kode
6. [design/](design/) - tampilan tiap layar
7. [yang-perlu-diinstal.md](yang-perlu-diinstal.md) - paket dan layanan yang dipakai
"@

[System.IO.File]::WriteAllText((Join-Path $dest "README.md"), ($manifest + "`n"), $utf8)

Write-Output "Selesai: $jumlah berkas disalin ke docs/rancangan/"
Write-Output "Manifest: docs/rancangan/README.md"
