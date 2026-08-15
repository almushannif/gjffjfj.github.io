import { PluginFile } from './pluginTypes';

export const PLUGIN_NOTARY_CLIENT_FILES: PluginFile[] = [
  // =========================================================================
  // 1. CLIENT DASHBOARD: client/dashboard.php
  // =========================================================================
  {
    path: 'client/dashboard.php',
    name: 'dashboard.php',
    category: 'CLIENT',
    description: 'Client Portal Dashboard: Secure user view with active case summaries, personal documents, and fee status.',
    content: `<?php
/**
 * Client Portal Dashboard
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

if ( ! is_user_logged_in() ) {
    ?>
    <div class="ldn-client-wrap">
        <div class="ldn-auth-box">
            <h2><?php esc_html_e( 'Portal Klien — Notaris & PPAT Lalu Daud', 'lalu-daud-notary' ); ?></h2>
            <p><?php esc_html_e( 'Silakan login untuk memantau perkembangan perkara, mengunggah dokumen, dan mengunduh akta resmi.', 'lalu-daud-notary' ); ?></p>
            <a href="<?php echo esc_url( wp_login_url( get_permalink() ) ); ?>" class="ldn-btn-primary"><?php esc_html_e( 'Masuk ke Portal Klien', 'lalu-daud-notary' ); ?></a>
        </div>
    </div>
    <?php
    return;
}

$user_id = get_current_user_id();
$user    = wp_get_current_user();
global $wpdb;

$my_cases = $wpdb->get_results( $wpdb->prepare(
    "SELECT * FROM {$wpdb->prefix}ldn_cases WHERE owner_id = %d ORDER BY id DESC",
    $user_id
) );
?>

<div class="ldn-client-wrap">
    <!-- Welcome Header -->
    <div class="ldn-client-header">
        <div>
            <h2>Selamat Datang, <?php echo esc_html( $user->display_name ); ?></h2>
            <p>Portal Resmi Pelayanan Hukum Kantor Notaris & PPAT Lalu Daud Nurjadi, S.H., M.Kn.</p>
        </div>
        <div class="ldn-client-nav-pills">
            <a href="#tab-cases" class="active">Perkara Saya (<?php echo count( $my_cases ); ?>)</a>
            <a href="<?php echo esc_url( home_url( '/pengajuan-layanan' ) ); ?>" class="ldn-btn-new-case">+ Ajukan Perkara Baru</a>
        </div>
    </div>

    <!-- Active Cases Grid -->
    <div class="ldn-client-cases-section" id="tab-cases">
        <?php if ( empty( $my_cases ) ) : ?>
            <div class="ldn-empty-state">
                <p>Anda belum memiliki permohonan perkara aktif.</p>
                <a href="<?php echo esc_url( home_url( '/pengajuan-layanan' ) ); ?>" class="ldn-btn-primary">Ajukan Layanan Sekarang</a>
            </div>
        <?php else : foreach ( $my_cases as $c ) : ?>
            <div class="ldn-case-card">
                <div class="ldn-case-card-header">
                    <div>
                        <span class="ldn-case-number"><?php echo esc_html( $c->case_number ); ?></span>
                        <h3 class="ldn-case-title"><?php echo esc_html( $c->title ); ?></h3>
                    </div>
                    <span class="ldn-status-pill status-<?php echo esc_attr( strtolower( $c->status ) ); ?>"><?php echo esc_html( $c->status ); ?></span>
                </div>

                <!-- 6-Stage Visual Progress Bar -->
                <div class="ldn-progress-timeline">
                    <?php
                    $stages = array(
                        'SUBMITTED'           => 'Pengajuan',
                        'VERIFICATION'        => 'Verifikasi',
                        'DOCUMENT_INCOMPLETE' => 'Dokumen',
                        'PROCESSING'          => 'Proses Akta',
                        'WAITING_SIGNATURE'   => 'Tanda Tangan',
                        'COMPLETED'           => 'Selesai'
                    );
                    $current_status = $c->status;
                    $stage_keys = array_keys( $stages );
                    $current_idx = array_search( $current_status, $stage_keys, true );
                    if ( false === $current_idx ) $current_idx = 0;

                    $idx = 0;
                    foreach ( $stages as $st_key => $st_name ) :
                        $is_done    = $idx < $current_idx;
                        $is_current = $idx === $current_idx;
                        $cls = $is_done ? 'is-done' : ( $is_current ? 'is-active' : '' );
                    ?>
                        <div class="ldn-step-item <?php echo esc_attr( $cls ); ?>">
                            <div class="ldn-step-dot"><?php echo $is_done ? '✔' : ( $idx + 1 ); ?></div>
                            <span class="ldn-step-label"><?php echo esc_html( $st_name ); ?></span>
                        </div>
                    <?php $idx++; endforeach; ?>
                </div>

                <div class="ldn-case-card-footer">
                    <span class="ldn-case-date">Diajukan: <?php echo esc_html( date( 'd M Y', strtotime( $c->created_at ) ) ); ?></span>
                    <a href="<?php echo esc_url( add_query_arg( array( 'view_case' => $c->case_id ), get_permalink() ) ); ?>" class="ldn-btn-detail">Lihat Detail & Berkas →</a>
                </div>
            </div>
        <?php endforeach; endif; ?>
    </div>
</div>
`
  },

  // =========================================================================
  // 2. CLIENT CASES & DOCUMENTS & PAYMENTS VIEWS
  // =========================================================================
  {
    path: 'client/cases.php',
    name: 'cases.php',
    category: 'CLIENT',
    description: 'Detailed single case viewer for clients with progress timeline, document upload dropzone, and secure streaming download.',
    content: `<?php
/**
 * Single Case Detailed View for Clients
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;
$case_id = isset( $_GET['view_case'] ) ? sanitize_text_field( $_GET['view_case'] ) : '';
$user_id = get_current_user_id();

if ( ! LDN_Auth::can_access_case( $user_id, $case_id ) ) {
    ?>
    <div class="ldn-error-box">
        <h3>Akses Ditolak</h3>
        <p>Anda tidak memiliki hak untuk melihat berkas perkara ini.</p>
    </div>
    <?php
    return;
}

global $wpdb;
$case = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}ldn_cases WHERE case_id = %s", $case_id ) );
$docs = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}ldn_documents WHERE case_id = %s", $case_id ) );
?>

<div class="ldn-client-wrap">
    <a href="<?php echo esc_url( remove_query_arg( 'view_case' ) ); ?>" class="ldn-back-link">← Kembali ke Daftar Perkara</a>
    
    <div class="ldn-detail-header">
        <span class="ldn-badge-gold"><?php echo esc_html( $case->case_number ); ?></span>
        <h2><?php echo esc_html( $case->title ); ?></h2>
        <p>Status Saat Ini: <strong><?php echo esc_html( $case->status ); ?></strong></p>
    </div>

    <!-- Upload Document Form -->
    <div class="ldn-upload-box">
        <h4>Unggah Dokumen Pendukung (Maksimal 10 MB - PDF, JPG, PNG, DOCX)</h4>
        <form id="ldn-client-upload-form" enctype="multipart/form-data">
            <input type="hidden" name="case_id" value="<?php echo esc_attr( $case_id ); ?>">
            <div class="ldn-form-row">
                <select name="document_type" required>
                    <option value="KTP_IDENTITAS">KTP / Identitas</option>
                    <option value="NPWP">Kartu NPWP</option>
                    <option value="SERTIFIKAT_TANAH">Sertifikat Tanah / Hak Milik</option>
                    <option value="BUKTI_PEMBAYARAN_PBB">Bukti Lunas PBB Terbaru</option>
                    <option value="DOKUMEN_PENDUKUNG">Dokumen Pendukung Lainnya</option>
                </select>
                <input type="file" name="document_file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" required>
                <button type="submit" class="ldn-btn-primary">Upload ke Google Drive Privat</button>
            </div>
        </form>
    </div>

    <!-- Documents List -->
    <div class="ldn-docs-list">
        <h4>Daftar Berkas Terlampir</h4>
        <table class="ldn-table">
            <thead>
                <tr>
                    <th>Nama Dokumen</th>
                    <th>Jenis</th>
                    <th>Ukuran</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( empty( $docs ) ) : ?>
                    <tr><td colspan="5">Belum ada dokumen yang diunggah.</td></tr>
                <?php else : foreach ( $docs as $d ) : ?>
                    <tr>
                        <td><strong><?php echo esc_html( $d->filename ); ?></strong></td>
                        <td><?php echo esc_html( $d->document_type ); ?></td>
                        <td><?php echo esc_html( round( $d->file_size / 1024, 1 ) . ' KB' ); ?></td>
                        <td><span class="ldn-status-pill status-<?php echo esc_attr( strtolower( $d->status ) ); ?>"><?php echo esc_html( $d->status ); ?></span></td>
                        <td>
                            <a href="<?php echo esc_url( rest_url( 'lalu-daud/v1/documents/' . $d->document_id . '/download' ) ); ?>" class="ldn-btn-download">Unduh File</a>
                        </td>
                    </tr>
                <?php endforeach; endif; ?>
            </tbody>
        </table>
    </div>
</div>
`
  },
  {
    path: 'client/documents.php',
    name: 'documents.php',
    category: 'CLIENT',
    description: 'Client Documents Center: Dedicated view for all personal legal files and deed drafts.',
    content: `<?php
/**
 * Client Documents Directory
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;
?>
<div class="ldn-client-wrap">
    <h2>Dokumen & Warkah Hukum Saya</h2>
    <p>Semua dokumen yang Anda unggah disimpan dalam repositori Google Drive privat berstandar enkripsi.</p>
</div>
`
  },
  {
    path: 'client/payments.php',
    name: 'payments.php',
    category: 'CLIENT',
    description: 'Client Invoices & Fee Reconciliation View.',
    content: `<?php
/**
 * Client Payments View
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;
?>
<div class="ldn-client-wrap">
    <h2>Tagihan & Riwayat Pembayaran</h2>
    <p>Lihat status invoice dan rincian biaya administrasi, materai, dan jasa kenotariatan.</p>
</div>
`
  }
];
