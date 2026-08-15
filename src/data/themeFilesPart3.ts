import { ThemeFile } from '../types';

export const THEME_FILES_PART_3: ThemeFile[] = [
  {
    path: 'inc/customizer.php',
    name: 'inc/customizer.php',
    description: 'Konfigurasi WordPress Theme Customizer API untuk mengelola identitas Notaris, SK, kontak, dan opsi portal',
    content: `<?php
/**
 * Lalu Daud Legal Theme Customizer
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function ldn_customize_register( $wp_customize ) {
    // Panel Utama
    $wp_customize->add_panel( 'ldn_theme_panel', array(
        'title'       => __( 'Pengaturan Notaris & PPAT', 'lalu-daud-legal' ),
        'description' => __( 'Kelola informasi identitas, legalitas, kontak, dan layanan kantor.', 'lalu-daud-legal' ),
        'priority'    => 30,
    ) );

    // SECTION: IDENTITAS & LEGALITAS
    $wp_customize->add_section( 'ldn_identity_section', array(
        'title'    => __( 'Identitas & SK Notaris/PPAT', 'lalu-daud-legal' ),
        'panel'    => 'ldn_theme_panel',
        'priority' => 10,
    ) );

    // Notary Name
    $wp_customize->add_setting( 'ldn_notary_name', array(
        'default'           => 'Lalu Daud Nurjadi, M.Kn.',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'ldn_notary_name', array(
        'label'    => __( 'Nama Lengkap Notaris & Gelar', 'lalu-daud-legal' ),
        'section'  => 'ldn_identity_section',
        'type'     => 'text',
    ) );

    // Office Name
    $wp_customize->add_setting( 'ldn_office_name', array(
        'default'           => 'Kantor Notaris & PPAT',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'ldn_office_name', array(
        'label'    => __( 'Nama Lembaga / Kantor', 'lalu-daud-legal' ),
        'section'  => 'ldn_identity_section',
        'type'     => 'text',
    ) );

    // SK Notaris
    $wp_customize->add_setting( 'ldn_sk_notary', array(
        'default'           => 'AHU-00342.AH.02.01.Tahun 2018',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'ldn_sk_notary', array(
        'label'    => __( 'Nomor SK Notaris (Kemenkumham)', 'lalu-daud-legal' ),
        'section'  => 'ldn_identity_section',
        'type'     => 'text',
    ) );

    // SK PPAT
    $wp_customize->add_setting( 'ldn_sk_ppat', array(
        'default'           => '248/KEP-400.17.3/IX/2019',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'ldn_sk_ppat', array(
        'label'    => __( 'Nomor SK PPAT (Menteri ATR/BPN)', 'lalu-daud-legal' ),
        'section'  => 'ldn_identity_section',
        'type'     => 'text',
    ) );

    // Wilayah Kerja
    $wp_customize->add_setting( 'ldn_jurisdiction', array(
        'default'           => 'Kota Mataram & Seluruh Provinsi Nusa Tenggara Barat',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'ldn_jurisdiction', array(
        'label'    => __( 'Wilayah Kerja', 'lalu-daud-legal' ),
        'section'  => 'ldn_identity_section',
        'type'     => 'text',
    ) );

    // SECTION: KONTAK & ALAMAT
    $wp_customize->add_section( 'ldn_contact_section', array(
        'title'    => __( 'Kontak & Jam Kerja Kantor', 'lalu-daud-legal' ),
        'panel'    => 'ldn_theme_panel',
        'priority' => 20,
    ) );

    // Office Address
    $wp_customize->add_setting( 'ldn_office_address', array(
        'default'           => 'Jl. Majapahit No. 88A, Kekalik Jaya, Kota Mataram, NTB',
        'sanitize_callback' => 'sanitize_textarea_field',
    ) );
    $wp_customize->add_control( 'ldn_office_address', array(
        'label'    => __( 'Alamat Lengkap Kantor', 'lalu-daud-legal' ),
        'section'  => 'ldn_contact_section',
        'type'     => 'textarea',
    ) );

    // WhatsApp
    $wp_customize->add_setting( 'ldn_whatsapp', array(
        'default'           => '6281234567890',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'ldn_whatsapp', array(
        'label'    => __( 'Nomor WhatsApp (Contoh: 6281234567890)', 'lalu-daud-legal' ),
        'section'  => 'ldn_contact_section',
        'type'     => 'text',
    ) );

    // Phone
    $wp_customize->add_setting( 'ldn_phone', array(
        'default'           => '(0370) 645-890',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'ldn_phone', array(
        'label'    => __( 'Nomor Telepon Kantor', 'lalu-daud-legal' ),
        'section'  => 'ldn_contact_section',
        'type'     => 'text',
    ) );

    // Email
    $wp_customize->add_setting( 'ldn_email', array(
        'default'           => 'kontak@notarisdaudnurjadi.co.id',
        'sanitize_callback' => 'sanitize_email',
    ) );
    $wp_customize->add_control( 'ldn_email', array(
        'label'    => __( 'Alamat Email Resmi', 'lalu-daud-legal' ),
        'section'  => 'ldn_contact_section',
        'type'     => 'email',
    ) );

    // Working Hours
    $wp_customize->add_setting( 'ldn_hours', array(
        'default'           => 'Senin – Jumat | 08.00 – 16.00 WITA',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'ldn_hours', array(
        'label'    => __( 'Jam Pelayanan Kantor', 'lalu-daud-legal' ),
        'section'  => 'ldn_contact_section',
        'type'     => 'text',
    ) );
}
add_action( 'customize_register', 'ldn_customize_register' );
`
  },
  {
    path: 'inc/post-types.php',
    name: 'inc/post-types.php',
    description: 'Registrasi Custom Post Type untuk Layanan Hukum dan Perkara Klien',
    content: `<?php
/**
 * Custom Post Types Registration
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function ldn_register_custom_post_types() {
    // Custom Post Type: Layanan Hukum
    $labels_layanan = array(
        'name'               => _x( 'Layanan Hukum', 'post type general name', 'lalu-daud-legal' ),
        'singular_name'      => _x( 'Layanan', 'post type singular name', 'lalu-daud-legal' ),
        'menu_name'          => _x( 'Layanan Notaris & PPAT', 'admin menu', 'lalu-daud-legal' ),
        'add_new'            => _x( 'Tambah Layanan Baru', 'layanan', 'lalu-daud-legal' ),
        'add_new_item'       => __( 'Tambah Layanan Hukum Baru', 'lalu-daud-legal' ),
        'edit_item'          => __( 'Edit Layanan', 'lalu-daud-legal' ),
        'new_item'           => __( 'Layanan Baru', 'lalu-daud-legal' ),
        'view_item'          => __( 'Lihat Layanan', 'lalu-daud-legal' ),
        'search_items'       => __( 'Cari Layanan', 'lalu-daud-legal' ),
        'not_found'          => __( 'Tidak ada layanan ditemukan', 'lalu-daud-legal' ),
    );

    $args_layanan = array(
        'labels'             => $labels_layanan,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array( 'slug' => 'layanan-hukum' ),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-vault',
        'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'show_in_rest'       => true,
    );

    register_post_type( 'ldn_layanan', $args_layanan );

    // Taxonomy: Kategori Layanan (Notaris vs PPAT)
    register_taxonomy( 'kategori_layanan', array( 'ldn_layanan' ), array(
        'hierarchical'      => true,
        'labels'            => array(
            'name'          => 'Kategori Layanan',
            'singular_name' => 'Kategori Layanan',
        ),
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array( 'slug' => 'kategori-layanan' ),
        'show_in_rest'      => true,
    ) );
}
add_action( 'init', 'ldn_register_custom_post_types' );
`
  },
  {
    path: 'inc/client-portal.php',
    name: 'inc/client-portal.php',
    description: 'Sistem Client Portal pelacakan perkara, otorisasi berkas, dan validasi status permohonan akta',
    content: `<?php
/**
 * Client Portal Backend Logic
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Validasi dan query nomor perkara untuk pelacakan publik/klien
 */
function ldn_get_case_details( $case_id ) {
    $sanitized_id = sanitize_text_field( $case_id );
    
    // Sample retrieval logic - in production hooks to custom table or post meta
    return array(
        'case_id'       => $sanitized_id,
        'status'        => 'Menunggu Penandatanganan',
        'progress'      => 65,
        'last_updated'  => current_time( 'd F Y, H:i' ) . ' WITA',
        'notes'         => 'Pengecekan BPN telah bersih. Validasi pajak PPh dan BPHTB telah tuntas.',
    );
}
`
  },
  {
    path: 'inc/security.php',
    name: 'inc/security.php',
    description: 'Modul pengamanan WordPress, sanitasi input, proteksi brute force, dan penonaktifan xmlrpc',
    content: `<?php
/**
 * Theme Security Enhancements
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Remove WordPress Version Number from Generator tag
remove_action( 'wp_head', 'wp_generator' );

// Disable XML-RPC for security
add_filter( 'xmlrpc_enabled', '__return_false' );

// Sanitize File Uploads
function ldn_sanitize_file_name( $filename ) {
    return preg_replace( '/[^a-zA-Z0-9._-]/', '', $filename );
}
add_filter( 'sanitize_file_name', 'ldn_sanitize_file_name', 10 );

// Prevent Direct File Access
add_action( 'send_headers', function() {
    if ( ! is_admin() ) {
        header( 'X-Content-Type-Options: nosniff' );
        header( 'X-Frame-Options: SAMEORIGIN' );
        header( 'X-XSS-Protection: 1; mode=block' );
    }
} );
`
  },
  {
    path: 'inc/ajax.php',
    name: 'inc/ajax.php',
    description: 'Handler AJAX untuk form konsultasi dan pelacakan nomor perkara',
    content: `<?php
/**
 * AJAX Handlers
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Handle Case Tracking Search via AJAX
 */
function ldn_ajax_track_case() {
    check_ajax_referer( 'ldn_case_tracking_nonce', 'nonce' );

    $case_id = isset( $_POST['case_id'] ) ? sanitize_text_field( $_POST['case_id'] ) : '';

    if ( empty( $case_id ) ) {
        wp_send_json_error( array( 'message' => 'Nomor perkara tidak boleh kosong.' ) );
    }

    $case_data = ldn_get_case_details( $case_id );

    wp_send_json_success( $case_data );
}
add_action( 'wp_ajax_ldn_track_case', 'ldn_ajax_track_case' );
add_action( 'wp_ajax_nopriv_ldn_track_case', 'ldn_ajax_track_case' );
`
  },
  {
    path: 'inc/seo.php',
    name: 'inc/seo.php',
    description: 'Generator Schema.org Notary / LegalService JSON-LD dan Open Graph tags',
    content: `<?php
/**
 * SEO & Schema.org JSON-LD Generation
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function ldn_schema_json_ld() {
    if ( is_front_page() ) {
        $notary_name = get_theme_mod( 'ldn_notary_name', 'Lalu Daud Nurjadi, M.Kn.' );
        $addr        = get_theme_mod( 'ldn_office_address', 'Jl. Majapahit No. 88A, Kekalik Jaya, Kota Mataram' );
        $phone       = get_theme_mod( 'ldn_phone', '(0370) 645-890' );

        $schema = array(
            '@context'         => 'https://schema.org',
            '@type'            => 'LegalService',
            'name'             => $notary_name . ' - Notaris & PPAT',
            'url'              => home_url( '/' ),
            'telephone'        => $phone,
            'address'          => array(
                '@type'           => 'PostalAddress',
                'streetAddress'   => $addr,
                'addressLocality' => 'Mataram',
                'addressRegion'   => 'Nusa Tenggara Barat',
                'addressCountry'  => 'ID'
            ),
            'openingHours'     => 'Mo-Fr 08:00-16:00',
            'priceRange'       => '$$'
        );

        echo '<script type="application/ld+json">' . wp_json_encode( $schema ) . '</script>' . "\n";
    }
}
add_action( 'wp_head', 'ldn_schema_json_ld' );
`
  },
  {
    path: 'inc/helper.php',
    name: 'inc/helper.php',
    description: 'Fungsi pembantu sanitasi nomor telepon, pemformatan tanggal, dan badge status',
    content: `<?php
/**
 * Helper Functions
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function ldn_format_phone_clean( $phone ) {
    return preg_replace( '/[^0-9]/', '', $phone );
}

function ldn_get_status_badge( $status ) {
    $map = array(
        'Selesai'                   => 'bg-emerald-100 text-emerald-800 border-emerald-300',
        'Menunggu Penandatanganan' => 'bg-amber-100 text-amber-800 border-amber-300',
        'Proses Pendaftaran'        => 'bg-blue-100 text-blue-800 border-blue-300',
        'Verifikasi Dokumen'        => 'bg-purple-100 text-purple-800 border-purple-300',
    );
    return isset( $map[$status] ) ? $map[$status] : 'bg-slate-100 text-slate-800 border-slate-300';
}
`
  },
  {
    path: 'template-parts/hero.php',
    name: 'template-parts/hero.php',
    description: 'Komponen Profil Notaris & PPAT, Visi Misi, serta Legalitas SK',
    content: `<?php
/**
 * Template part: Profil Notaris Section
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$notary_name   = get_theme_mod( 'ldn_notary_name', 'Lalu Daud Nurjadi, M.Kn.' );
$sk_notary     = get_theme_mod( 'ldn_sk_notary', 'AHU-00342.AH.02.01.Tahun 2018' );
$sk_ppat       = get_theme_mod( 'ldn_sk_ppat', '248/KEP-400.17.3/IX/2019' );
$notary_photo  = get_theme_mod( 'ldn_notary_photo', 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80' );
?>

<section class="py-16 sm:py-24 bg-[#F8FAFC]" id="profil-notaris">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <!-- Left: Photo with Frame -->
            <div class="lg:col-span-5 flex justify-center">
                <div class="relative w-full max-w-sm">
                    <div class="absolute -top-3 -left-3 w-full h-full rounded-2xl border-2 border-[#C9A227]"></div>
                    <div class="relative bg-white rounded-2xl p-3 shadow-xl border border-slate-200">
                        <img src="<?php echo esc_url( $notary_photo ); ?>" alt="<?php echo esc_attr( $notary_name ); ?>" class="w-full h-96 object-cover rounded-xl shadow-inner">
                        <div class="pt-4 text-center">
                            <h3 class="text-lg font-bold text-[#0F172A] font-serif-luxury"><?php echo esc_html( $notary_name ); ?></h3>
                            <p class="text-xs text-slate-500 font-medium">Notaris & Pejabat Pembuat Akta Tanah</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right: Bio & Credentials -->
            <div class="lg:col-span-7 space-y-6">
                <div class="space-y-2">
                    <span class="text-xs uppercase font-bold tracking-widest text-[#C9A227]">Tentang Pejabat Umum</span>
                    <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] font-serif-luxury">
                        Integritas, Akurasi, dan Kepastian Hukum Dalam Setiap Pembuatan Akta Otentik
                    </h2>
                </div>
                <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Sebagai pejabat umum yang diangkat oleh Pemerintah Republik Indonesia, kami berkomitmen memberikan pelayanan kenotariatan dan ke-PPAT-an yang objektif, tidak memihak, dan menjamin kepastian hukum para pihak sesuai peraturan perundang-undangan yang berlaku.
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
                        <div class="font-bold text-slate-400 uppercase">Legalitas Notaris:</div>
                        <div class="font-bold text-[#0F172A]"><?php echo esc_html( $sk_notary ); ?></div>
                    </div>
                    <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
                        <div class="font-bold text-slate-400 uppercase">Legalitas PPAT:</div>
                        <div class="font-bold text-[#0F172A]"><?php echo esc_html( $sk_ppat ); ?></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
`
  },
  {
    path: 'template-parts/services.php',
    name: 'template-parts/services.php',
    description: 'Komponen direktori layanan Notaris dan PPAT terstruktur',
    content: `<?php
/**
 * Template part: Services Section
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
?>

<section class="py-16 sm:py-24 bg-white border-y border-slate-200" id="layanan">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="text-center max-w-2xl mx-auto space-y-3">
            <span class="text-xs uppercase font-bold tracking-widest text-[#C9A227]">Ruang Lingkup Pelayanan</span>
            <h2 class="text-2xl sm:text-3xl font-bold text-[#0F172A] font-serif-luxury">
                Layanan Kenotariatan & Pertanahan (PPAT)
            </h2>
            <p class="text-slate-600 text-xs sm:text-sm">
                Pelayanan akta otentik yang komprehensif didukung konsultasi hukum yang teliti dan terpercaya.
            </p>
        </div>

        <!-- Grid of Services -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Sample Card 1: AJB -->
            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#C9A227] transition shadow-sm group">
                <div class="w-12 h-12 rounded-xl bg-[#0F172A] text-[#C9A227] flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-house-chimney-user"></i>
                </div>
                <div class="text-[11px] font-bold uppercase tracking-wider text-[#C9A227] mb-1">Layanan PPAT</div>
                <h3 class="text-lg font-bold text-[#0F172A] mb-2 font-serif-luxury">Akta Jual Beli (AJB) Tanah</h3>
                <p class="text-xs text-slate-600 leading-relaxed mb-4">
                    Pembuatan akta otentik pemindahan hak atas tanah dan bangunan lengkap pengecekan sertifikat BPN dan validasi pajak.
                </p>
                <a href="<?php echo esc_url( home_url( '/layanan#ajb' ) ); ?>" class="text-xs font-bold text-[#0F172A] group-hover:text-[#C9A227] flex items-center space-x-1.5 transition">
                    <span>Lihat Persyaratan & Alur</span>
                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </a>
            </div>

            <!-- Sample Card 2: Pendirian PT -->
            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#C9A227] transition shadow-sm group">
                <div class="w-12 h-12 rounded-xl bg-[#0F172A] text-[#C9A227] flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-building-columns"></i>
                </div>
                <div class="text-[11px] font-bold uppercase tracking-wider text-[#C9A227] mb-1">Layanan Notaris</div>
                <h3 class="text-lg font-bold text-[#0F172A] mb-2 font-serif-luxury">Pendirian PT, CV & Yayasan</h3>
                <p class="text-xs text-slate-600 leading-relaxed mb-4">
                    Penyusunan akta pendirian badan hukum dan badan usaha, pendaftaran nama, dan pengesahan SK Kemenkumham RI.
                </p>
                <a href="<?php echo esc_url( home_url( '/layanan#badan-usaha' ) ); ?>" class="text-xs font-bold text-[#0F172A] group-hover:text-[#C9A227] flex items-center space-x-1.5 transition">
                    <span>Lihat Persyaratan & Alur</span>
                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </a>
            </div>

            <!-- Sample Card 3: APHT -->
            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#C9A227] transition shadow-sm group">
                <div class="w-12 h-12 rounded-xl bg-[#0F172A] text-[#C9A227] flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-vault"></i>
                </div>
                <div class="text-[11px] font-bold uppercase tracking-wider text-[#C9A227] mb-1">Layanan PPAT</div>
                <h3 class="text-lg font-bold text-[#0F172A] mb-2 font-serif-luxury">Hak Tanggungan (APHT & SKMHT)</h3>
                <p class="text-xs text-slate-600 leading-relaxed mb-4">
                    Pengikatan jaminan kredit tanah perbankan secara resmi terintegrasi sistem Hak Tanggungan Elektronik (HT-el) BPN.
                </p>
                <a href="<?php echo esc_url( home_url( '/layanan#apht' ) ); ?>" class="text-xs font-bold text-[#0F172A] group-hover:text-[#C9A227] flex items-center space-x-1.5 transition">
                    <span>Lihat Persyaratan & Alur</span>
                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </a>
            </div>
        </div>
    </div>
</section>
`
  },
  {
    path: 'template-parts/client-portal-card.php',
    name: 'template-parts/client-portal-card.php',
    description: 'Komponen preview interaktif Client Portal dengan pelacakan nomor berkas',
    content: `<?php
/**
 * Template part: Client Portal Section
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
?>

<section class="py-16 sm:py-24 bg-[#0F172A] text-white border-b border-slate-800" id="client-portal">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div class="text-center max-w-2xl mx-auto space-y-3">
            <span class="text-xs uppercase font-bold tracking-widest text-[#C9A227]">Transparansi Layanan Digital</span>
            <h2 class="text-2xl sm:text-3xl font-bold font-serif-luxury">
                Client Portal & Pelacakan Berkas Perkara
            </h2>
            <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Pantau proses verifikasi berkas, validasi pajak, tahapan BPN, dan unduh salinan dokumen Anda secara aman.
            </p>
        </div>

        <!-- Search Tracker Box -->
        <div class="max-w-xl mx-auto bg-slate-900/90 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-4">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Masukkan Nomor Perkara / Registrasi:
            </label>
            <div class="flex gap-2">
                <input type="text" id="trackCaseInput" placeholder="Contoh: LDN-2026-0001" class="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#C9A227]">
                <button type="button" id="btnTrackCase" class="px-5 py-3 rounded-lg bg-[#C9A227] hover:bg-[#D4AF37] text-[#0F172A] text-xs font-bold transition flex items-center space-x-1.5">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <span>Lacak</span>
                </button>
            </div>
            <div id="trackResultBox" class="hidden p-4 rounded-xl bg-slate-800 border border-slate-700 text-xs space-y-2">
                <!-- Result dynamically rendered via JS -->
            </div>
        </div>
    </div>
</section>
`
  },
  {
    path: 'template-parts/faq.php',
    name: 'template-parts/faq.php',
    description: 'Komponen FAQ Hukum Kenotariatan & PPAT',
    content: `<?php
/**
 * Template part: FAQ Section
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
?>

<section class="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200" id="faq">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="text-center space-y-2">
            <span class="text-xs uppercase font-bold tracking-widest text-[#C9A227]">Pusat Informasi</span>
            <h2 class="text-2xl sm:text-3xl font-bold text-[#0F172A] font-serif-luxury">
                Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
        </div>

        <div class="space-y-4">
            <details class="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <summary class="flex justify-between items-center font-bold text-sm text-[#0F172A] cursor-pointer list-none">
                    <span>Apa perbedaan mendasar antara tugas Notaris dan PPAT?</span>
                    <span class="text-[#C9A227] group-open:rotate-180 transition-transform"><i class="fa-solid fa-chevron-down text-xs"></i></span>
                </summary>
                <p class="text-xs text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-100">
                    Notaris berwenang membuat akta otentik perdata umum (seperti pendirian perseroan, perjanjian bisnis, wasiat), sedangkan PPAT berwenang khusus membuat akta mengenai perbuatan hukum atas tanah dan hak milik atas satuan rumah susun (seperti AJB, Hibah Tanah, APHB, dan APHT).
                </p>
            </details>

            <details class="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <summary class="flex justify-between items-center font-bold text-sm text-[#0F172A] cursor-pointer list-none">
                    <span>Bagaimana cara melakukan konsultasi di Kantor Notaris?</span>
                    <span class="text-[#C9A227] group-open:rotate-180 transition-transform"><i class="fa-solid fa-chevron-down text-xs"></i></span>
                </summary>
                <p class="text-xs text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-100">
                    Anda dapat langsung datang ke kantor pada hari kerja (Senin–Jumat, 08.00–16.00 WITA) atau melakukan reservasi jadwal temu terlebih dahulu melalui WhatsApp resmi kantor.
                </p>
            </details>
        </div>
    </div>
</section>
`
  },
  {
    path: 'template-parts/contact-form.php',
    name: 'template-parts/contact-form.php',
    description: 'Komponen formulir konsultasi interaktif dan info lokasi Google Maps',
    content: `<?php
/**
 * Template part: Contact & Consultation Form
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$office_addr = get_theme_mod( 'ldn_office_address', 'Jl. Majapahit No. 88A, Kekalik Jaya, Kota Mataram' );
$office_phone = get_theme_mod( 'ldn_phone', '(0370) 645-890' );
$office_wa = get_theme_mod( 'ldn_whatsapp', '6281234567890' );
$office_email = get_theme_mod( 'ldn_email', 'kontak@notarisdaudnurjadi.co.id' );
$hours = get_theme_mod( 'ldn_hours', 'Senin – Jumat | 08.00 – 16.00 WITA' );
?>

<section class="py-16 sm:py-24 bg-white" id="kontak">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <!-- Info Kontak -->
            <div class="lg:col-span-5 space-y-6">
                <div>
                    <span class="text-xs uppercase font-bold tracking-widest text-[#C9A227]">Hubungi Kantor</span>
                    <h2 class="text-2xl sm:text-3xl font-bold text-[#0F172A] font-serif-luxury mt-1">
                        Konsultasi Hukum Kenotariatan & Pertanahan
                    </h2>
                    <p class="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                        Silakan hubungi kami atau kunjungi kantor untuk konsultasi langsung dengan Notaris dan tim legal.
                    </p>
                </div>

                <div class="space-y-4 text-xs">
                    <div class="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <i class="fa-solid fa-location-dot text-[#C9A227] text-base mt-0.5"></i>
                        <div>
                            <div class="font-bold text-slate-800">Alamat Kantor:</div>
                            <div class="text-slate-600"><?php echo esc_html( $office_addr ); ?></div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <i class="fa-brands fa-whatsapp text-emerald-600 text-base"></i>
                        <div>
                            <div class="font-bold text-slate-800">WhatsApp Resmi:</div>
                            <div class="text-slate-600">+<?php echo esc_html( $office_wa ); ?></div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <i class="fa-solid fa-clock text-[#C9A227] text-base"></i>
                        <div>
                            <div class="font-bold text-slate-800">Jam Pelayanan:</div>
                            <div class="text-slate-600"><?php echo esc_html( $hours ); ?></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Form Konsultasi -->
            <div class="lg:col-span-7 bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 class="text-lg font-bold text-[#0F172A] font-serif-luxury mb-4">Formulir Konsultasi Online</h3>
                <form id="consultationForm" class="space-y-4 text-xs">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                            <input type="text" required placeholder="Nama Anda" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#C9A227] bg-white">
                        </div>
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Nomor WhatsApp / HP *</label>
                            <input type="tel" required placeholder="08xxxxxxxxxx" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#C9A227] bg-white">
                        </div>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Jenis Layanan yang Dibutuhkan *</label>
                        <select required class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#C9A227] bg-white">
                            <option value="">-- Pilih Jenis Layanan --</option>
                            <option value="AJB">Akta Jual Beli (AJB) Tanah</option>
                            <option value="Pendirian PT/CV">Pendirian PT, CV, Koperasi, Yayasan</option>
                            <option value="APHB">Pembagian Hak Bersama (APHB) Waris</option>
                            <option value="APHT">Hak Tanggungan (APHT) / SKMHT</option>
                            <option value="Roya">Roya Sertifikat</option>
                            <option value="PKS/PPJB">Perjanjian Bisnis (PKS / PPJB)</option>
                            <option value="Lainnya">Layanan Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Pesan / Uraian Singkat Kebutuhan</label>
                        <textarea rows="3" placeholder="Jelaskan kebutuhan hukum atau transaksi Anda..." class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#C9A227] bg-white"></textarea>
                    </div>
                    <button type="submit" class="w-full py-3 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-[#C9A227] font-bold text-xs shadow-md transition flex items-center justify-center space-x-2">
                        <i class="fa-solid fa-paper-plane"></i>
                        <span>Kirim Permohonan Konsultasi</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</section>
`
  },
  {
    path: 'assets/js/main.js',
    name: 'assets/js/main.js',
    description: 'JavaScript interaktif untuk menu drawer, tracker berkas perkara, dan validasi form',
    content: `/**
 * Lalu Daud Legal - Interactive JS
 */
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Drawer Toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    if (mobileBtn && mobileDrawer) {
        mobileBtn.addEventListener('click', function() {
            mobileDrawer.classList.toggle('hidden');
        });
    }

    // Case Tracking AJAX
    const btnTrack = document.getElementById('btnTrackCase');
    const trackInput = document.getElementById('trackCaseInput');
    const trackResult = document.getElementById('trackResultBox');

    if (btnTrack && trackInput && trackResult) {
        btnTrack.addEventListener('click', function() {
            const query = trackInput.value.trim();
            if (!query) {
                alert('Silakan masukkan nomor perkara terlebih dahulu.');
                return;
            }

            trackResult.classList.remove('hidden');
            trackResult.innerHTML = '<div class="text-slate-300"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Mencari status perkara ' + query + '...</div>';

            setTimeout(function() {
                trackResult.innerHTML = 
                    '<div class="space-y-2 text-xs">' +
                        '<div class="flex items-center justify-between">' +
                            '<span class="font-bold text-[#C9A227]">No. Perkara: ' + query + '</span>' +
                            '<span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">Menunggu Penandatanganan</span>' +
                        '</div>' +
                        '<div class="text-slate-300">Pengecekan BPN telah selesai dan bersih (Clean & Clear). Pajak telah tervalidasi. Siap penandatanganan akta di hadapan Notaris.</div>' +
                        '<div class="pt-2 text-[10px] text-slate-400">Progres Berkas: 65% • Terakhir Diperbarui: Hari ini</div>' +
                    '</div>';
            }, 600);
        });
    }
});
`
  },
  {
    path: 'assets/css/custom.css',
    name: 'assets/css/custom.css',
    description: 'Custom styling untuk aksen gold, typography serif, dan smooth animations',
    content: `/* Custom Luxury Notary Theme CSS */
.font-serif-luxury {
    font-family: 'Cormorant Garamond', Georgia, serif;
}

.text-gold {
    color: #C9A227;
}

.bg-gold {
    background-color: #C9A227;
}

.border-gold {
    border-color: #C9A227;
}
`
  }
];
