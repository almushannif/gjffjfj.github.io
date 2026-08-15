import { ThemeFile } from '../types';

export const THEME_FILES_PART_2: ThemeFile[] = [
  {
    path: 'single.php',
    name: 'single.php',
    description: 'Template untuk membaca artikel hukum individual dengan sidebar dan navigasi',
    content: `<?php
/**
 * The template for displaying all single posts
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();
?>

<main id="primary" class="site-main py-12 bg-[#F8FAFC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <!-- Main Article Content -->
            <article class="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
                <?php while ( have_posts() ) : the_post(); ?>
                    <div class="space-y-4">
                        <div class="flex items-center space-x-3 text-xs text-[#C9A227] font-bold uppercase tracking-wider">
                            <?php the_category( ', ' ); ?>
                            <span class="text-slate-300">•</span>
                            <span class="text-slate-500 font-normal"><?php echo get_the_date( 'd F Y' ); ?></span>
                        </div>
                        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] font-serif-luxury leading-tight">
                            <?php the_title(); ?>
                        </h1>
                        <div class="flex items-center space-x-3 py-3 border-y border-slate-100 text-xs text-slate-500">
                            <span>Ditulis oleh: <strong class="text-slate-800"><?php the_author(); ?></strong></span>
                        </div>
                        <?php if ( has_post_thumbnail() ) : ?>
                            <div class="rounded-xl overflow-hidden my-6 border border-slate-100 shadow-sm">
                                <?php the_post_thumbnail( 'full', array( 'class' => 'w-full h-auto object-cover' ) ); ?>
                            </div>
                        <?php endif; ?>
                        <div class="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
                            <?php the_content(); ?>
                        </div>
                        <div class="pt-6 border-t border-slate-100">
                            <?php the_tags( '<div class="flex flex-wrap gap-2 text-xs"><span class="font-bold text-slate-600">Tag Terkait:</span> ', ' ', '</div>' ); ?>
                        </div>
                    </div>
                    <?php
                    if ( comments_open() || get_comments_number() ) :
                        comments_template();
                    endif;
                    ?>
                <?php endwhile; ?>
            </article>

            <!-- Sidebar -->
            <aside class="lg:col-span-4 space-y-6">
                <!-- Kontak Cepat Notaris Card -->
                <div class="bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-lg bg-[#C9A227]/20 border border-[#C9A227] flex items-center justify-center text-[#C9A227]">
                            <i class="fa-solid fa-scale-balanced"></i>
                        </div>
                        <div>
                            <div class="text-xs uppercase font-bold text-[#C9A227]">Konsultasi Notaris & PPAT</div>
                            <div class="text-sm font-bold font-serif-luxury"><?php echo esc_html( get_theme_mod('ldn_notary_name', 'Lalu Daud Nurjadi, M.Kn.') ); ?></div>
                        </div>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed">
                        Butuh bantuan penyusunan akta atau konsultasi hukum pertanahan? Hubungi tim legal kami langsung.
                    </p>
                    <a href="https://wa.me/<?php echo esc_attr( get_theme_mod('ldn_whatsapp', '6281234567890') ); ?>?text=Halo%20Notaris%20Lalu%20Daud%20Nurjadi" class="w-full py-3 rounded-lg bg-[#C9A227] hover:bg-[#D4AF37] text-[#0F172A] text-xs font-bold flex items-center justify-center space-x-2 transition">
                        <i class="fa-brands fa-whatsapp text-base"></i>
                        <span>WhatsApp Kantor</span>
                    </a>
                </div>

                <!-- Client Portal Banner -->
                <div class="bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-500/30 p-6 rounded-2xl text-white space-y-3">
                    <div class="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                        <i class="fa-solid fa-shield-halved"></i>
                        <span>Client Portal Terintegrasi</span>
                    </div>
                    <h3 class="text-base font-bold font-serif-luxury">Pantau Berkas Perkara Anda Secara Online</h3>
                    <p class="text-xs text-slate-300">Cek status verifikasi dokumen, progres BPN, dan unduh salinan akta otentik.</p>
                    <a href="<?php echo esc_url( home_url( '/client-portal' ) ); ?>" class="inline-block text-xs font-bold text-emerald-400 hover:text-emerald-300 underline">
                        Buka Client Portal &rarr;
                    </a>
                </div>
            </aside>
        </div>
    </div>
</main>

<?php
get_footer();
`
  },
  {
    path: 'page.php',
    name: 'page.php',
    description: 'Template umum untuk halaman statis WordPress',
    content: `<?php
/**
 * The template for displaying all pages
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();
?>

<main id="primary" class="site-main py-12 bg-[#F8FAFC]">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            <?php while ( have_posts() ) : the_post(); ?>
                <header class="mb-8 pb-4 border-b border-slate-100">
                    <h1 class="text-2xl sm:text-3xl font-bold text-[#0F172A] font-serif-luxury">
                        <?php the_title(); ?>
                    </h1>
                </header>
                <div class="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700">
                    <?php the_content(); ?>
                </div>
            <?php endwhile; ?>
        </div>
    </div>
</main>

<?php
get_footer();
`
  },
  {
    path: 'page-layanan.php',
    name: 'page-layanan.php',
    description: 'Halaman khusus direktori 19+ layanan Notaris dan PPAT lengkap dengan filter kategori dan modal',
    content: `<?php
/**
 * Template Name: Halaman Direktori Layanan
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();
?>

<main id="primary" class="site-main py-12 bg-[#F8FAFC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <!-- Header Section -->
        <div class="text-center max-w-3xl mx-auto space-y-3">
            <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F172A] text-[#C9A227] text-xs font-bold">
                <i class="fa-solid fa-scale-balanced"></i>
                <span>Direktori Lengkap Pelayanan Hukum</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-bold text-[#0F172A] font-serif-luxury">
                Layanan Notaris & Pejabat Pembuat Akta Tanah (PPAT)
            </h1>
            <p class="text-slate-600 text-sm leading-relaxed">
                Kami melayani seluruh kebutuhan perbuatan hukum perdata, pendirian badan usaha, kontrak bisnis, hingga peralihan hak atas tanah dengan kepastian hukum tertinggi.
            </p>
        </div>

        <!-- Render Services Part -->
        <?php get_template_part( 'template-parts/services' ); ?>
    </div>
</main>

<?php
get_footer();
`
  },
  {
    path: 'page-client-portal.php',
    name: 'page-client-portal.php',
    description: 'Halaman Client Portal untuk pelacakan perkara dan manajemen berkas',
    content: `<?php
/**
 * Template Name: Halaman Client Portal
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();
?>

<main id="primary" class="site-main py-12 bg-[#F8FAFC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <?php get_template_part( 'template-parts/client-portal-card' ); ?>
    </div>
</main>

<?php
get_footer();
`
  },
  {
    path: 'page-profil-notaris.php',
    name: 'page-profil-notaris.php',
    description: 'Halaman profil resmi Notaris & PPAT Lalu Daud Nurjadi, M.Kn. beserta visi misi dan komitmen',
    content: `<?php
/**
 * Template Name: Halaman Profil Notaris
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();
?>

<main id="primary" class="site-main py-12 bg-[#F8FAFC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <?php get_template_part( 'template-parts/hero' ); ?>
    </div>
</main>

<?php
get_footer();
`
  },
  {
    path: 'page-kontak.php',
    name: 'page-kontak.php',
    description: 'Halaman Kontak Kantor, Lokasi Maps Interaktif, dan Formulir Konsultasi',
    content: `<?php
/**
 * Template Name: Halaman Kontak Kantor
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();
?>

<main id="primary" class="site-main py-12 bg-[#F8FAFC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <?php get_template_part( 'template-parts/contact-form' ); ?>
    </div>
</main>

<?php
get_footer();
`
  },
  {
    path: '404.php',
    name: '404.php',
    description: 'Halaman Error 404 ketika tautan tidak ditemukan',
    content: `<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @package LaluDaudLegal
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();
?>

<main id="primary" class="site-main py-20 bg-[#F8FAFC] text-center">
    <div class="max-w-xl mx-auto px-4 space-y-6">
        <div class="w-20 h-20 mx-auto rounded-2xl bg-[#0F172A] text-[#C9A227] flex items-center justify-center text-3xl shadow-lg">
            <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h1 class="text-4xl font-bold text-[#0F172A] font-serif-luxury">404 - Halaman Tidak Ditemukan</h1>
        <p class="text-slate-600 text-sm leading-relaxed">
            Halaman atau berkas yang Anda tuju tidak tersedia atau telah dipindahkan. Silakan kembali ke beranda atau akses Client Portal.
        </p>
        <div class="flex justify-center space-x-4">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="px-6 py-3 rounded-lg bg-[#0F172A] text-[#C9A227] text-xs font-bold shadow transition hover:bg-[#1E293B]">
                Kembali ke Beranda
            </a>
            <a href="<?php echo esc_url( home_url( '/client-portal' ) ); ?>" class="px-6 py-3 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow transition hover:bg-emerald-700">
                Akses Client Portal
            </a>
        </div>
    </div>
</main>

<?php
get_footer();
`
  }
];
