import { ThemeFile } from '../types';

export const THEME_FILES_PART_1: ThemeFile[] = [
  {
    path: 'style.css',
    name: 'style.css',
    description: 'Header metadata resmi tema WordPress Notaris & PPAT Lalu Daud Nurjadi',
    content: `/*
Theme Name: Lalu Daud Legal - Notaris & PPAT
Theme URI: https://notarisdaudnurjadi.co.id
Author: Tim Pengembang Notaris & PPAT
Author URI: https://notarisdaudnurjadi.co.id
Description: Tema WordPress Premium dan Resmi untuk Kantor Notaris & Pejabat Pembuat Akta Tanah (PPAT) Lalu Daud Nurjadi, S.H., M.Kn. Dilengkapi dengan sistem Client Portal pemantauan berkas perkara, integrasi Customizer API, optimasi SEO, keamanan tingkat tinggi, dan desain modern berbasis Tailwind CSS.
Version: 1.0.0
Tested up to: 6.7
Requires at least: 6.0
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: lalu-daud-legal
Tags: legal, notary, ppat, law-firm, client-portal, custom-header, custom-menu, featured-images, full-site-editing, rtl-language-support, translation-ready
*/

/* Custom Root Variables */
:root {
  --color-deep-navy: #0F172A;
  --color-navy: #1E293B;
  --color-gold: #C9A227;
  --color-gold-soft: #D4AF37;
  --color-slate: #475569;
  --color-light-gray: #F8FAFC;
  --color-border: #E2E8F0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  background-color: #F8FAFC;
  color: #0F172A;
}

.font-serif-luxury {
  font-family: 'Cormorant Garamond', Georgia, serif;
}
`
  },
  {
    path: 'functions.php',
    name: 'functions.php',
    description: 'Konfigurasi fungsional tema, enqueue scripts, custom post types, customizer, dan security',
    content: `<?php
/**
 * Lalu Daud Legal Theme Functions
 *
 * @package LaluDaudLegal
 * @version 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

define( 'LDN_THEME_VERSION', '1.0.0' );
define( 'LDN_THEME_DIR', get_template_directory() );
define( 'LDN_THEME_URI', get_template_directory_uri() );

/**
 * Setup Theme Supports
 */
function ldn_theme_setup() {
    // Make theme available for translation.
    load_theme_textdomain( 'lalu-daud-legal', LDN_THEME_DIR . '/languages' );

    // Add default posts and comments RSS feed links to head.
    add_theme_support( 'automatic-feed-links' );

    // Let WordPress manage the document title.
    add_theme_support( 'title-tag' );

    // Enable support for Post Thumbnails on posts and pages.
    add_theme_support( 'post-thumbnails' );
    set_post_thumbnail_size( 1200, 630, true );
    add_image_size( 'ldn-service-card', 600, 400, true );
    add_image_size( 'ldn-notary-profile', 800, 1000, true );

    // Register Navigation Menus
    register_nav_menus( array(
        'primary'   => esc_html__( 'Menu Utama (Header)', 'lalu-daud-legal' ),
        'mobile'    => esc_html__( 'Menu Mobile (Drawer)', 'lalu-daud-legal' ),
        'footer_1'  => esc_html__( 'Footer Layanan Notaris', 'lalu-daud-legal' ),
        'footer_2'  => esc_html__( 'Footer Layanan PPAT', 'lalu-daud-legal' ),
        'footer_3'  => esc_html__( 'Footer Informasi & Legal', 'lalu-daud-legal' ),
    ) );

    // Switch default core markup for search form, comment form, and comments to output valid HTML5.
    add_theme_support( 'html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ) );

    // Custom Logo Support
    add_theme_support( 'custom-logo', array(
        'height'      => 90,
        'width'       => 300,
        'flex-height' => true,
        'flex-width'  => true,
    ) );

    // Gutenberg align wide
    add_theme_support( 'align-wide' );
    add_theme_support( 'responsive-embeds' );
}
add_action( 'after_setup_theme', 'ldn_theme_setup' );

/**
 * Enqueue scripts and styles.
 */
function ldn_enqueue_assets() {
    // Google Fonts: Plus Jakarta Sans & Cormorant Garamond
    wp_enqueue_style(
        'ldn-google-fonts',
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap',
        array(),
        null
    );

    // Font Awesome 6
    wp_enqueue_style(
        'ldn-fontawesome',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
        array(),
        '6.5.1'
    );

    // Tailwind CSS via CDN
    wp_enqueue_script(
        'ldn-tailwind-cdn',
        'https://cdn.tailwindcss.com',
        array(),
        null,
        false
    );

    // Main Theme Stylesheet
    wp_enqueue_style( 'ldn-main-style', get_stylesheet_uri(), array(), LDN_THEME_VERSION );
    wp_enqueue_style( 'ldn-custom-css', LDN_THEME_URI . '/assets/css/custom.css', array(), LDN_THEME_VERSION );

    // Main JS Script
    wp_enqueue_script(
        'ldn-main-js',
        LDN_THEME_URI . '/assets/js/main.js',
        array( 'jquery' ),
        LDN_THEME_VERSION,
        true
    );

    // Localize AJAX script
    wp_localize_script( 'ldn-main-js', 'ldnAjax', array(
        'ajaxUrl' => admin_url( 'admin-ajax.php' ),
        'nonce'   => wp_create_nonce( 'ldn_case_tracking_nonce' ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'ldn_enqueue_assets' );

/**
 * Include Required Module Files
 */
require_once LDN_THEME_DIR . '/inc/helper.php';
require_once LDN_THEME_DIR . '/inc/customizer.php';
require_once LDN_THEME_DIR . '/inc/post-types.php';
require_once LDN_THEME_DIR . '/inc/client-portal.php';
require_once LDN_THEME_DIR . '/inc/security.php';
require_once LDN_THEME_DIR . '/inc/ajax.php';
require_once LDN_THEME_DIR . '/inc/seo.php';
`
  },
  {
    path: 'header.php',
    name: 'header.php',
    description: 'Header template dengan Top Bar, Logo Notaris & PPAT, Navigasi Utama, dan CTA Portal',
    content: `<?php
/**
 * Header Template
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$notary_name   = get_theme_mod( 'ldn_notary_name', 'Lalu Daud Nurjadi, M.Kn.' );
$office_name   = get_theme_mod( 'ldn_office_name', 'Kantor Notaris & PPAT' );
$office_addr   = get_theme_mod( 'ldn_office_address', 'Jl. Majapahit No. 88A, Kekalik Jaya, Kota Mataram' );
$office_phone  = get_theme_mod( 'ldn_phone', '(0370) 645-890' );
$office_wa     = get_theme_mod( 'ldn_whatsapp', '6281234567890' );
$office_email  = get_theme_mod( 'ldn_email', 'kontak@notarisdaudnurjadi.co.id' );
$working_hours = get_theme_mod( 'ldn_hours', 'Senin – Jumat | 08.00 – 16.00 WITA' );
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="scroll-smooth">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class( 'bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-[#C9A227] selection:text-[#0F172A]' ); ?>>
<?php wp_body_open(); ?>

<!-- TOP BAR -->
<div class="bg-[#0F172A] text-slate-300 text-xs border-b border-slate-800 py-2 hidden md:block">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div class="flex items-center space-x-6">
            <div class="flex items-center space-x-2">
                <i class="fa-solid fa-location-dot text-[#C9A227]"></i>
                <span><?php echo esc_html( $office_addr ); ?></span>
            </div>
            <div class="flex items-center space-x-2 border-l border-slate-700 pl-6">
                <i class="fa-solid fa-clock text-[#C9A227]"></i>
                <span><?php echo esc_html( $working_hours ); ?></span>
            </div>
        </div>
        <div class="flex items-center space-x-5">
            <a href="tel:<?php echo esc_attr( preg_replace('/[^0-9]/', '', $office_phone) ); ?>" class="hover:text-[#C9A227] transition flex items-center space-x-1.5">
                <i class="fa-solid fa-phone text-[#C9A227]"></i>
                <span><?php echo esc_html( $office_phone ); ?></span>
            </a>
            <a href="mailto:<?php echo esc_attr( $office_email ); ?>" class="hover:text-[#C9A227] transition flex items-center space-x-1.5">
                <i class="fa-solid fa-envelope text-[#C9A227]"></i>
                <span><?php echo esc_html( $office_email ); ?></span>
            </a>
            <div class="flex items-center space-x-3 border-l border-slate-700 pl-4">
                <a href="<?php echo esc_url( get_theme_mod('ldn_facebook_url', '#') ); ?>" target="_blank" rel="noopener" class="hover:text-[#C9A227]" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="<?php echo esc_url( get_theme_mod('ldn_instagram_url', '#') ); ?>" target="_blank" rel="noopener" class="hover:text-[#C9A227]" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                <a href="<?php echo esc_url( get_theme_mod('ldn_linkedin_url', '#') ); ?>" target="_blank" rel="noopener" class="hover:text-[#C9A227]" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
            </div>
        </div>
    </div>
</div>

<!-- MAIN HEADER -->
<header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300" id="mainHeader">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
            <!-- Brand Logo & Identity -->
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex items-center space-x-3.5 group">
                <div class="w-12 h-12 rounded-lg bg-[#0F172A] border-2 border-[#C9A227] flex items-center justify-center text-[#C9A227] shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <i class="fa-solid fa-scale-balanced text-xl"></i>
                </div>
                <div>
                    <div class="text-[10px] tracking-widest uppercase font-bold text-[#C9A227]"><?php echo esc_html( $office_name ); ?></div>
                    <div class="text-base sm:text-lg font-bold text-[#0F172A] leading-tight font-serif-luxury tracking-wide group-hover:text-[#C9A227] transition-colors">
                        <?php echo esc_html( $notary_name ); ?>
                    </div>
                    <div class="text-[11px] text-slate-500 font-medium">SK Kemenkumham & SK BPN Resmi</div>
                </div>
            </a>

            <!-- Desktop Navigation -->
            <nav class="hidden lg:flex items-center space-x-7">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="text-sm font-semibold text-[#0F172A] hover:text-[#C9A227] transition-colors">Beranda</a>
                <a href="<?php echo esc_url( home_url( '/profil-notaris' ) ); ?>" class="text-sm font-semibold text-slate-700 hover:text-[#C9A227] transition-colors">Profil Notaris</a>
                <div class="relative group">
                    <button class="flex items-center space-x-1 text-sm font-semibold text-slate-700 hover:text-[#C9A227] transition-colors py-2">
                        <span>Layanan</span>
                        <i class="fa-solid fa-chevron-down text-xs ml-1 group-hover:rotate-180 transition-transform duration-200"></i>
                    </button>
                    <div class="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div class="bg-white rounded-xl shadow-xl border border-slate-100 p-2 space-y-1">
                            <a href="<?php echo esc_url( home_url( '/layanan#notaris' ) ); ?>" class="flex items-center px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#C9A227] transition">
                                <i class="fa-solid fa-building-columns text-[#C9A227] w-6"></i>
                                <span>Layanan Kenotariatan</span>
                            </a>
                            <a href="<?php echo esc_url( home_url( '/layanan#ppat' ) ); ?>" class="flex items-center px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#C9A227] transition">
                                <i class="fa-solid fa-house-chimney-user text-[#C9A227] w-6"></i>
                                <span>Layanan PPAT (Tanah)</span>
                            </a>
                            <a href="<?php echo esc_url( home_url( '/layanan' ) ); ?>" class="flex items-center px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#C9A227] transition border-t border-slate-100 mt-1">
                                <i class="fa-solid fa-list-check text-slate-400 w-6"></i>
                                <span>Semua 19+ Layanan</span>
                            </a>
                        </div>
                    </div>
                </div>
                <a href="<?php echo esc_url( home_url( '/cara-kerja' ) ); ?>" class="text-sm font-semibold text-slate-700 hover:text-[#C9A227] transition-colors">Cara Kerja</a>
                <a href="<?php echo esc_url( home_url( '/client-portal' ) ); ?>" class="text-sm font-semibold text-slate-700 hover:text-[#C9A227] transition-colors flex items-center space-x-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Client Portal</span>
                </a>
                <a href="<?php echo esc_url( home_url( '/artikel' ) ); ?>" class="text-sm font-semibold text-slate-700 hover:text-[#C9A227] transition-colors">Artikel Hukum</a>
                <a href="<?php echo esc_url( home_url( '/kontak' ) ); ?>" class="text-sm font-semibold text-slate-700 hover:text-[#C9A227] transition-colors">Kontak</a>
            </nav>

            <!-- Desktop Action Buttons -->
            <div class="hidden lg:flex items-center space-x-3">
                <a href="<?php echo esc_url( home_url( '/client-portal' ) ); ?>" class="px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-[#0F172A] hover:bg-slate-50 hover:border-[#C9A227] transition-all flex items-center space-x-2">
                    <i class="fa-solid fa-lock text-[#C9A227]"></i>
                    <span>Portal Klien</span>
                </a>
                <a href="https://wa.me/<?php echo esc_attr( $office_wa ); ?>?text=Halo%20Notaris%20Lalu%20Daud%20Nurjadi,%20saya%20ingin%20konsultasi%20mengenai%20layanan%20hukum" target="_blank" rel="noopener" class="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-[#C9A227] border border-[#C9A227]/40 text-xs font-bold shadow-sm transition-all flex items-center space-x-2 hover:scale-[1.02]">
                    <i class="fa-brands fa-whatsapp text-sm text-emerald-400"></i>
                    <span>Konsultasi Cepat</span>
                </a>
            </div>

            <!-- Mobile Hamburger Button -->
            <div class="flex lg:hidden items-center space-x-2">
                <a href="<?php echo esc_url( home_url( '/client-portal' ) ); ?>" class="p-2 rounded-lg bg-slate-100 text-[#0F172A] text-xs font-bold" aria-label="Portal Klien">
                    <i class="fa-solid fa-lock text-[#C9A227]"></i>
                </a>
                <button type="button" id="mobileMenuBtn" class="p-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition" aria-label="Buka Menu">
                    <i class="fa-solid fa-bars text-lg" id="mobileMenuIcon"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <div id="mobileDrawer" class="hidden lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
        <div class="space-y-1">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-[#0F172A] hover:bg-slate-50">Beranda</a>
            <a href="<?php echo esc_url( home_url( '/profil-notaris' ) ); ?>" class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">Profil Notaris & PPAT</a>
            <a href="<?php echo esc_url( home_url( '/layanan' ) ); ?>" class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">Layanan Notaris & PPAT</a>
            <a href="<?php echo esc_url( home_url( '/cara-kerja' ) ); ?>" class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">Cara Kerja</a>
            <a href="<?php echo esc_url( home_url( '/client-portal' ) ); ?>" class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-emerald-600 bg-emerald-50">Client Portal (Pelacakan Berkas)</a>
            <a href="<?php echo esc_url( home_url( '/artikel' ) ); ?>" class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">Artikel Hukum</a>
            <a href="<?php echo esc_url( home_url( '/faq' ) ); ?>" class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">FAQ</a>
            <a href="<?php echo esc_url( home_url( '/kontak' ) ); ?>" class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">Kontak Kantor</a>
        </div>
        <div class="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            <a href="https://wa.me/<?php echo esc_attr( $office_wa ); ?>?text=Halo%20Notaris%20Lalu%20Daud%20Nurjadi" class="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-center text-xs font-bold flex items-center justify-center space-x-2">
                <i class="fa-brands fa-whatsapp text-base"></i>
                <span>Konsultasi via WhatsApp</span>
            </a>
        </div>
    </div>
</header>
`
  },
  {
    path: 'footer.php',
    name: 'footer.php',
    description: 'Footer template dengan 4 kolom informatif, legal disclaimer, dan navigasi footer',
    content: `<?php
/**
 * Footer Template
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$notary_name  = get_theme_mod( 'ldn_notary_name', 'Lalu Daud Nurjadi, M.Kn.' );
$sk_notary    = get_theme_mod( 'ldn_sk_notary', 'AHU-00342.AH.02.01.Tahun 2018' );
$sk_ppat      = get_theme_mod( 'ldn_sk_ppat', '248/KEP-400.17.3/IX/2019' );
$jurisdiction = get_theme_mod( 'ldn_jurisdiction', 'Kota Mataram & Seluruh Provinsi NTB' );
$office_addr  = get_theme_mod( 'ldn_office_address', 'Jl. Majapahit No. 88A, Kekalik Jaya, Kota Mataram' );
$office_phone = get_theme_mod( 'ldn_phone', '(0370) 645-890' );
$office_wa    = get_theme_mod( 'ldn_whatsapp', '6281234567890' );
$office_email = get_theme_mod( 'ldn_email', 'kontak@notarisdaudnurjadi.co.id' );
$hours        = get_theme_mod( 'ldn_hours', 'Senin – Jumat | 08.00 – 16.00 WITA' );
?>

<!-- FOOTER -->
<footer class="bg-[#0F172A] text-slate-300 border-t border-slate-800 pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            <!-- Kolom 1: Profil Kantor -->
            <div class="space-y-4">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-lg bg-slate-900 border border-[#C9A227] flex items-center justify-center text-[#C9A227]">
                        <i class="fa-solid fa-scale-balanced"></i>
                    </div>
                    <div>
                        <div class="text-xs uppercase tracking-wider font-bold text-[#C9A227]">Kantor Notaris & PPAT</div>
                        <div class="text-base font-bold text-white font-serif-luxury"><?php echo esc_html( $notary_name ); ?></div>
                    </div>
                </div>
                <p class="text-xs text-slate-400 leading-relaxed">
                    Memberikan pelayanan pembuatan akta otentik kenotariatan, akta pertanahan (PPAT), legalitas badan usaha, dan perjanjian bisnis dengan standar profesionalitas, akurasi, dan kepastian hukum tertinggi.
                </p>
                <div class="pt-2 text-xs space-y-1 text-slate-400">
                    <div><strong class="text-slate-200">SK Notaris:</strong> <?php echo esc_html( $sk_notary ); ?></div>
                    <div><strong class="text-slate-200">SK PPAT:</strong> <?php echo esc_html( $sk_ppat ); ?></div>
                    <div><strong class="text-slate-200">Wilayah Kerja:</strong> <?php echo esc_html( $jurisdiction ); ?></div>
                </div>
            </div>

            <!-- Kolom 2: Layanan Kenotariatan -->
            <div class="space-y-3">
                <h4 class="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-[#C9A227] pl-2.5">Layanan Notaris</h4>
                <ul class="text-xs space-y-2 text-slate-400">
                    <li><a href="<?php echo esc_url( home_url( '/layanan#akta-pendirian' ) ); ?>" class="hover:text-[#C9A227] transition">Pendirian PT, CV & Yayasan</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/layanan#perubahan-ad' ) ); ?>" class="hover:text-[#C9A227] transition">Perubahan Anggaran Dasar (RUPS)</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/layanan#pks' ) ); ?>" class="hover:text-[#C9A227] transition">Perjanjian Kerja Sama (PKS)</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/layanan#ppjb' ) ); ?>" class="hover:text-[#C9A227] transition">Pengikatan Jual Beli (PPJB)</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/layanan#legalisasi' ) ); ?>" class="hover:text-[#C9A227] transition">Legalisasi & Waarmerking</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/layanan#wasiat' ) ); ?>" class="hover:text-[#C9A227] transition">Akta Wasiat & Kuasa Otentik</a></li>
                </ul>
            </div>

            <!-- Kolom 3: Layanan PPAT -->
            <div class="space-y-3">
                <h4 class="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-[#C9A227] pl-2.5">Layanan PPAT (Tanah)</h4>
                <ul class="text-xs space-y-2 text-slate-400">
                    <li><a href="<?php echo esc_url( home_url( '/layanan#ajb' ) ); ?>" class="hover:text-[#C9A227] transition">Akta Jual Beli (AJB) Tanah</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/layanan#hibah' ) ); ?>" class="hover:text-[#C9A227] transition">Akta Hibah Tanah & Bangunan</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/layanan#aphb' ) ); ?>" class="hover:text-[#C9A227] transition">Pembagian Hak Bersama (APHB)</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/layanan#apht' ) ); ?>" class="hover:text-[#C9A227] transition">Hak Tanggungan (APHT & SKMHT)</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/layanan#roya' ) ); ?>" class="hover:text-[#C9A227] transition">Roya (Penghapusan Jaminan)</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/layanan#balik-nama' ) ); ?>" class="hover:text-[#C9A227] transition">Balik Nama & Cek Sertifikat BPN</a></li>
                </ul>
            </div>

            <!-- Kolom 4: Kontak & Jam Kerja -->
            <div class="space-y-3">
                <h4 class="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-[#C9A227] pl-2.5">Kontak & Pelayanan</h4>
                <div class="text-xs space-y-2.5 text-slate-400">
                    <div class="flex items-start space-x-2.5">
                        <i class="fa-solid fa-location-dot text-[#C9A227] mt-0.5"></i>
                        <span><?php echo esc_html( $office_addr ); ?></span>
                    </div>
                    <div class="flex items-center space-x-2.5">
                        <i class="fa-solid fa-phone text-[#C9A227]"></i>
                        <span><?php echo esc_html( $office_phone ); ?></span>
                    </div>
                    <div class="flex items-center space-x-2.5">
                        <i class="fa-brands fa-whatsapp text-emerald-400"></i>
                        <a href="https://wa.me/<?php echo esc_attr( $office_wa ); ?>" class="hover:text-emerald-300">WhatsApp: +<?php echo esc_html( $office_wa ); ?></a>
                    </div>
                    <div class="flex items-center space-x-2.5">
                        <i class="fa-solid fa-envelope text-[#C9A227]"></i>
                        <span><?php echo esc_html( $office_email ); ?></span>
                    </div>
                    <div class="flex items-center space-x-2.5">
                        <i class="fa-solid fa-clock text-[#C9A227]"></i>
                        <span><?php echo esc_html( $hours ); ?></span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Copyright & Disclaimer -->
        <div class="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
            <div>
                &copy; <?php echo date( 'Y' ); ?> <strong><?php echo esc_html( $notary_name ); ?></strong>. Seluruh hak cipta dilindungi undang-undang.
            </div>
            <div class="flex items-center space-x-6">
                <a href="<?php echo esc_url( home_url( '/client-portal' ) ); ?>" class="hover:text-[#C9A227]">Client Portal</a>
                <a href="<?php echo esc_url( home_url( '/kebijakan-privasi' ) ); ?>" class="hover:text-[#C9A227]">Kebijakan Privasi</a>
                <a href="<?php echo esc_url( home_url( '/syarat-ketentuan' ) ); ?>" class="hover:text-[#C9A227]">Ketentuan Layanan</a>
            </div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
`
  },
  {
    path: 'front-page.php',
    name: 'front-page.php',
    description: 'Halaman Beranda utama yang memuat Hero, Trust Indicators, Profil Notaris, Layanan, Cara Kerja, Client Portal Demo, Artikel, FAQ, Formulir Konsultasi, dan Maps',
    content: `<?php
/**
 * Front Page Template
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();

$notary_name   = get_theme_mod( 'ldn_notary_name', 'Lalu Daud Nurjadi, M.Kn.' );
$tagline       = get_theme_mod( 'ldn_tagline', 'Profesional, Terpercaya, dan Berintegritas' );
$motto         = get_theme_mod( 'ldn_motto', 'Menghadirkan kepastian hukum, transparansi administrasi, dan kenyamanan pelayanan bagi seluruh klien perorangan maupun korporasi.' );
$sk_notary     = get_theme_mod( 'ldn_sk_notary', 'AHU-00342.AH.02.01.Tahun 2018' );
$sk_ppat       = get_theme_mod( 'ldn_sk_ppat', '248/KEP-400.17.3/IX/2019' );
$jurisdiction  = get_theme_mod( 'ldn_jurisdiction', 'Kota Mataram & Seluruh Provinsi NTB' );
$office_wa     = get_theme_mod( 'ldn_whatsapp', '6281234567890' );
$notary_photo  = get_theme_mod( 'ldn_notary_photo', 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80' );
?>

<main id="primary" class="site-main">

    <!-- SECTION 1: HERO -->
    <section class="relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-20 lg:py-28 overflow-hidden border-b border-slate-800">
        <div class="absolute inset-0 bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div class="lg:col-span-7 space-y-6">
                    <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#C9A227] text-xs font-bold tracking-wide">
                        <i class="fa-solid fa-shield-halved"></i>
                        <span>Kantor Notaris & PPAT Resmi Berizin Kemenkumham & BPN</span>
                    </div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-serif-luxury">
                        Kepastian Hukum & Pelayanan Akta Otentik <span class="text-[#C9A227]">Profesional, Cepat, dan Berintegritas</span>
                    </h1>
                    <p class="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
                        <?php echo esc_html( $motto ); ?>
                    </p>
                    <div class="pt-2 flex flex-wrap gap-4 items-center">
                        <a href="https://wa.me/<?php echo esc_attr( $office_wa ); ?>?text=Halo%20Notaris%20Lalu%20Daud%20Nurjadi" target="_blank" rel="noopener" class="px-6 py-3.5 rounded-lg bg-[#C9A227] hover:bg-[#D4AF37] text-[#0F172A] text-sm font-bold shadow-lg shadow-[#C9A227]/20 transition-all flex items-center space-x-2 hover:scale-[1.02]">
                            <i class="fa-brands fa-whatsapp text-lg"></i>
                            <span>Konsultasi Sekarang</span>
                        </a>
                        <a href="<?php echo esc_url( home_url( '/client-portal' ) ); ?>" class="px-6 py-3.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-white text-sm font-bold transition-all flex items-center space-x-2">
                            <i class="fa-solid fa-laptop-file text-[#C9A227]"></i>
                            <span>Akses Client Portal</span>
                        </a>
                    </div>
                    <!-- Quick Badges -->
                    <div class="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                        <div class="flex items-center space-x-2">
                            <i class="fa-solid fa-check text-emerald-400"></i>
                            <span>19+ Layanan Notaris & PPAT</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <i class="fa-solid fa-check text-emerald-400"></i>
                            <span>Tracking Berkas Online 24/7</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <i class="fa-solid fa-check text-emerald-400"></i>
                            <span>Kerahasiaan Jabatan Terjamin</span>
                        </div>
                    </div>
                </div>

                <!-- Notary Card Hero Visual -->
                <div class="lg:col-span-5 flex justify-center">
                    <div class="relative w-full max-w-md">
                        <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#C9A227] to-amber-600 opacity-30 blur-lg"></div>
                        <div class="relative bg-slate-900 rounded-2xl border border-slate-700 p-6 shadow-2xl space-y-5">
                            <div class="flex items-center space-x-4">
                                <img src="<?php echo esc_url( $notary_photo ); ?>" alt="<?php echo esc_attr( $notary_name ); ?>" class="w-20 h-20 rounded-xl object-cover border-2 border-[#C9A227] shadow-md">
                                <div>
                                    <div class="text-xs uppercase font-bold tracking-wider text-[#C9A227]">Profil Notaris & PPAT</div>
                                    <h3 class="text-lg font-bold text-white font-serif-luxury"><?php echo esc_html( $notary_name ); ?></h3>
                                    <p class="text-xs text-slate-400">Notaris & Pejabat Pembuat Akta Tanah</p>
                                </div>
                            </div>
                            <div class="space-y-2.5 text-xs text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                <div class="flex justify-between pb-2 border-b border-slate-700/60">
                                    <span class="text-slate-400">SK Notaris:</span>
                                    <span class="font-semibold text-white"><?php echo esc_html( $sk_notary ); ?></span>
                                </div>
                                <div class="flex justify-between pb-2 border-b border-slate-700/60">
                                    <span class="text-slate-400">SK PPAT:</span>
                                    <span class="font-semibold text-white"><?php echo esc_html( $sk_ppat ); ?></span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Wilayah Kerja:</span>
                                    <span class="font-semibold text-[#C9A227]"><?php echo esc_html( $jurisdiction ); ?></span>
                                </div>
                            </div>
                            <div class="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex items-center space-x-3 text-xs text-emerald-300">
                                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                                <span>Pelayanan Aktif Hari Ini: 08.00 – 16.00 WITA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 2: TRUST INDICATORS -->
    <section class="py-12 bg-white border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="p-5 rounded-xl border border-slate-100 bg-slate-50 flex items-start space-x-4">
                    <div class="w-12 h-12 rounded-lg bg-[#0F172A] text-[#C9A227] flex items-center justify-center text-xl shrink-0">
                        <i class="fa-solid fa-scale-balanced"></i>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-[#0F172A]">Notaris & PPAT Resmi</h4>
                        <p class="text-xs text-slate-500 mt-1">Berizin SK Kemenkumham RI & SK Menteri ATR/BPN.</p>
                    </div>
                </div>
                <div class="p-5 rounded-xl border border-slate-100 bg-slate-50 flex items-start space-x-4">
                    <div class="w-12 h-12 rounded-lg bg-[#0F172A] text-[#C9A227] flex items-center justify-center text-xl shrink-0">
                        <i class="fa-solid fa-user-shield"></i>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-[#0F172A]">Kerahasiaan & Integritas</h4>
                        <p class="text-xs text-slate-500 mt-1">Menjunjung tinggi sumpah jabatan dan keamanan warkah.</p>
                    </div>
                </div>
                <div class="p-5 rounded-xl border border-slate-100 bg-slate-50 flex items-start space-x-4">
                    <div class="w-12 h-12 rounded-lg bg-[#0F172A] text-[#C9A227] flex items-center justify-center text-xl shrink-0">
                        <i class="fa-solid fa-desktop"></i>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-[#0F172A]">Client Portal Digital</h4>
                        <p class="text-xs text-slate-500 mt-1">Pantau timeline perkara dan dokumen secara transparan.</p>
                    </div>
                </div>
                <div class="p-5 rounded-xl border border-slate-100 bg-slate-50 flex items-start space-x-4">
                    <div class="w-12 h-12 rounded-lg bg-[#0F172A] text-[#C9A227] flex items-center justify-center text-xl shrink-0">
                        <i class="fa-solid fa-handshake-angle"></i>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-[#0F172A]">Pelayanan Cermat</h4>
                        <p class="text-xs text-slate-500 mt-1">Penyusunan akta tepat waktu dan berkepastian hukum.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 3: PROFIL NOTARIS -->
    <?php get_template_part( 'template-parts/hero' ); ?>

    <!-- SECTION 4: LAYANAN NOTARIS & PPAT -->
    <?php get_template_part( 'template-parts/services' ); ?>

    <!-- SECTION 5: CLIENT PORTAL PROMO & DEMO -->
    <?php get_template_part( 'template-parts/client-portal-card' ); ?>

    <!-- SECTION 6: FAQ ACCORDION -->
    <?php get_template_part( 'template-parts/faq' ); ?>

    <!-- SECTION 7: FORM KONSULTASI & KONTAK -->
    <?php get_template_part( 'template-parts/contact-form' ); ?>

</main>

<?php
get_footer();
`
  },
  {
    path: 'index.php',
    name: 'index.php',
    description: 'Fallback default template file untuk postingan dan halaman umum',
    content: `<?php
/**
 * The main template file
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();
?>

<main id="primary" class="site-main py-16 bg-[#F8FAFC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header class="mb-12 text-center">
            <h1 class="text-3xl font-bold text-[#0F172A] font-serif-luxury">
                <?php single_post_title(); ?>
            </h1>
        </header>

        <?php if ( have_posts() ) : ?>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <?php
                while ( have_posts() ) :
                    the_post();
                    get_template_part( 'template-parts/content', get_post_type() );
                endwhile;
                ?>
            </div>
            <div class="mt-12">
                <?php the_posts_pagination(); ?>
            </div>
        <?php else : ?>
            <?php get_template_part( 'template-parts/content', 'none' ); ?>
        <?php endif; ?>
    </div>
</main>

<?php
get_footer();
`
  },
  {
    path: 'theme.json',
    name: 'theme.json',
    description: 'Konfigurasi Gutenberg FSE, palet warna gold-navy, dan typography WordPress',
    content: `{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 2,
  "settings": {
    "appearanceTools": true,
    "color": {
      "palette": [
        {
          "slug": "deep-navy",
          "color": "#0F172A",
          "name": "Deep Navy"
        },
        {
          "slug": "navy",
          "color": "#1E293B",
          "name": "Navy"
        },
        {
          "slug": "gold",
          "color": "#C9A227",
          "name": "Gold Notaris"
        },
        {
          "slug": "gold-soft",
          "color": "#D4AF37",
          "name": "Soft Gold"
        },
        {
          "slug": "light-gray",
          "color": "#F8FAFC",
          "name": "Light Gray"
        },
        {
          "slug": "white",
          "color": "#FFFFFF",
          "name": "White"
        }
      ]
    },
    "typography": {
      "fontFamilies": [
        {
          "fontFamily": "'Plus Jakarta Sans', sans-serif",
          "slug": "body",
          "name": "Plus Jakarta Sans"
        },
        {
          "fontFamily": "'Cormorant Garamond', Georgia, serif",
          "slug": "serif-luxury",
          "name": "Cormorant Garamond"
        }
      ]
    }
  }
}`
  }
];
