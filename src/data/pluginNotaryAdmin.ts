import { PluginFile } from './pluginTypes';

export const PLUGIN_NOTARY_ADMIN_FILES: PluginFile[] = [
  // =========================================================================
  // 1. ADMIN DASHBOARD: admin/dashboard.php
  // =========================================================================
  {
    path: 'admin/dashboard.php',
    name: 'dashboard.php',
    category: 'ADMIN',
    description: 'Admin Executive Overview: Real-time metric cards (Total Klien, Perkara Aktif, Menunggu Verifikasi, Selesai), recent cases list, and system health.',
    content: `<?php
/**
 * Admin Executive Dashboard
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

global $wpdb;
$total_clients  = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}ldn_clients" );
$active_cases   = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}ldn_cases WHERE status NOT IN ('COMPLETED', 'CANCELLED', 'REJECTED')" );
$pending_verify = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}ldn_cases WHERE status = 'VERIFICATION'" );
$waiting_sign   = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}ldn_cases WHERE status = 'WAITING_SIGNATURE'" );
$completed      = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}ldn_cases WHERE status = 'COMPLETED'" );

$recent_cases = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ldn_cases ORDER BY id DESC LIMIT 5" );
?>

<div class="wrap ldn-admin-wrap">
    <div class="ldn-admin-header">
        <div class="ldn-header-branding">
            <h1><?php esc_html_e( 'Notaris & PPAT Lalu Daud — Sistem Manajemen', 'lalu-daud-notary' ); ?> <span class="ldn-badge-version">v<?php echo esc_html( LDN_VERSION ); ?></span></h1>
            <p class="ldn-subtitle"><?php esc_html_e( 'Kantor Notaris & PPAT Lalu Daud Nurjadi, S.H., M.Kn. (Arsitektur Aman Google Apps Script Middleware & Private Vault)', 'lalu-daud-notary' ); ?></p>
        </div>
        <div class="ldn-header-actions">
            <a href="<?php echo esc_url( admin_url( 'admin.php?page=ldn-cases' ) ); ?>" class="button button-primary">
                <span class="dashicons dashicons-plus-alt"></span> <?php esc_html_e( 'Kelola Perkara', 'lalu-daud-notary' ); ?>
            </a>
            <button type="button" class="button button-secondary" id="ldn-btn-test-gas">
                <span class="dashicons dashicons-cloud"></span> <?php esc_html_e( 'Test Google Apps Script', 'lalu-daud-notary' ); ?>
            </button>
        </div>
    </div>

    <!-- Executive Metric Cards -->
    <div class="ldn-metric-grid">
        <div class="ldn-metric-card">
            <span class="ldn-metric-icon dashicons dashicons-id"></span>
            <div class="ldn-metric-data">
                <h3><?php echo esc_html( $total_clients ); ?></h3>
                <p><?php esc_html_e( 'Total Klien Terdaftar', 'lalu-daud-notary' ); ?></p>
            </div>
        </div>

        <div class="ldn-metric-card is-highlight">
            <span class="ldn-metric-icon dashicons dashicons-portfolio"></span>
            <div class="ldn-metric-data">
                <h3><?php echo esc_html( $active_cases ); ?></h3>
                <p><?php esc_html_e( 'Perkara Aktif', 'lalu-daud-notary' ); ?></p>
            </div>
        </div>

        <div class="ldn-metric-card is-warning">
            <span class="ldn-metric-icon dashicons dashicons-search"></span>
            <div class="ldn-metric-data">
                <h3><?php echo esc_html( $pending_verify ); ?></h3>
                <p><?php esc_html_e( 'Menunggu Verifikasi', 'lalu-daud-notary' ); ?></p>
            </div>
        </div>

        <div class="ldn-metric-card is-gold">
            <span class="ldn-metric-icon dashicons dashicons-edit"></span>
            <div class="ldn-metric-data">
                <h3><?php echo esc_html( $waiting_sign ); ?></h3>
                <p><?php esc_html_e( 'Menunggu Tanda Tangan', 'lalu-daud-notary' ); ?></p>
            </div>
        </div>

        <div class="ldn-metric-card is-success">
            <span class="ldn-metric-icon dashicons dashicons-yes-alt"></span>
            <div class="ldn-metric-data">
                <h3><?php echo esc_html( $completed ); ?></h3>
                <p><?php esc_html_e( 'Perkara Selesai (Akta Terbit)', 'lalu-daud-notary' ); ?></p>
            </div>
        </div>
    </div>

    <!-- Recent Cases Table -->
    <div class="ldn-panel">
        <div class="ldn-panel-header">
            <h2><?php esc_html_e( 'Perkara Terbaru Masuk', 'lalu-daud-notary' ); ?></h2>
            <a href="<?php echo esc_url( admin_url( 'admin.php?page=ldn-cases' ) ); ?>"><?php esc_html_e( 'Lihat Semua →', 'lalu-daud-notary' ); ?></a>
        </div>
        <table class="widefat striped">
            <thead>
                <tr>
                    <th><?php esc_html_e( 'Nomor Perkara', 'lalu-daud-notary' ); ?></th>
                    <th><?php esc_html_e( 'Layanan & Judul', 'lalu-daud-notary' ); ?></th>
                    <th><?php esc_html_e( 'Klien ID', 'lalu-daud-notary' ); ?></th>
                    <th><?php esc_html_e( 'Status', 'lalu-daud-notary' ); ?></th>
                    <th><?php esc_html_e( 'Tanggal Masuk', 'lalu-daud-notary' ); ?></th>
                    <th><?php esc_html_e( 'Aksi', 'lalu-daud-notary' ); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php if ( empty( $recent_cases ) ) : ?>
                    <tr><td colspan="6"><?php esc_html_e( 'Belum ada perkara dalam sistem.', 'lalu-daud-notary' ); ?></td></tr>
                <?php else : foreach ( $recent_cases as $c ) : ?>
                    <tr>
                        <td><strong><?php echo esc_html( $c->case_number ); ?></strong></td>
                        <td><?php echo esc_html( $c->title ); ?></td>
                        <td><code><?php echo esc_html( $c->client_id ); ?></code></td>
                        <td><span class="ldn-status-badge status-<?php echo esc_attr( strtolower( $c->status ) ); ?>"><?php echo esc_html( $c->status ); ?></span></td>
                        <td><?php echo esc_html( $c->created_at ); ?></td>
                        <td>
                            <a href="<?php echo esc_url( admin_url( 'admin.php?page=ldn-cases&case_id=' . $c->case_id ) ); ?>" class="button button-small"><?php esc_html_e( 'Detail Perkara', 'lalu-daud-notary' ); ?></a>
                        </td>
                    </tr>
                <?php endforeach; endif; ?>
            </tbody>
        </table>
    </div>
</div>
`
  },

  // =========================================================================
  // 2. ADMIN CASES: admin/cases.php
  // =========================================================================
  {
    path: 'admin/cases.php',
    name: 'cases.php',
    category: 'ADMIN',
    description: 'Case & Matter Management: 6-stage lifecycle updater, staff assignment, document inspector, and Google Sheets synchronization.',
    content: `<?php
/**
 * Admin Cases Management
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;
global $wpdb;

$cases = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ldn_cases ORDER BY id DESC LIMIT 50" );
?>

<div class="wrap ldn-admin-wrap">
    <h1><?php esc_html_e( 'Daftar Perkara Notaris & PPAT', 'lalu-daud-notary' ); ?></h1>
    <p class="description"><?php esc_html_e( 'Kelola tahapan perkara dari permohonan masuk, verifikasi dokumen, proses pengetikan akta, tanda tangan, hingga selesai.', 'lalu-daud-notary' ); ?></p>

    <div class="ldn-panel">
        <table class="widefat striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nomor Perkara</th>
                    <th>Judul Perkara</th>
                    <th>Klien ID</th>
                    <th>Layanan</th>
                    <th>Status Tahapan</th>
                    <th>Tanggal Masuk</th>
                    <th>Update Status</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( empty( $cases ) ) : ?>
                    <tr><td colspan="8"><?php esc_html_e( 'Belum ada perkara.', 'lalu-daud-notary' ); ?></td></tr>
                <?php else : foreach ( $cases as $c ) : ?>
                    <tr>
                        <td><?php echo esc_html( $c->id ); ?></td>
                        <td><strong><?php echo esc_html( $c->case_number ); ?></strong></td>
                        <td><?php echo esc_html( $c->title ); ?></td>
                        <td><code><?php echo esc_html( $c->client_id ); ?></code></td>
                        <td><?php echo esc_html( $c->service_id ); ?></td>
                        <td><span class="ldn-status-badge status-<?php echo esc_attr( strtolower( $c->status ) ); ?>"><?php echo esc_html( $c->status ); ?></span></td>
                        <td><?php echo esc_html( $c->created_at ); ?></td>
                        <td>
                            <select class="ldn-quick-status-change" data-case-id="<?php echo esc_attr( $c->case_id ); ?>">
                                <?php foreach ( LDN_Case_Manager::$valid_statuses as $st_key => $st_lbl ) : ?>
                                    <option value="<?php echo esc_attr( $st_key ); ?>" <?php selected( $c->status, $st_key ); ?>><?php echo esc_html( $st_lbl ); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </td>
                    </tr>
                <?php endforeach; endif; ?>
            </tbody>
        </table>
    </div>
</div>
`
  },

  // =========================================================================
  // 3. ADMIN CLIENTS: admin/clients.php
  // =========================================================================
  {
    path: 'admin/clients.php',
    name: 'clients.php',
    category: 'ADMIN',
    description: 'Client Dossier Directory: Displays client profiles with automatic NIK/KTP masking (e.g. 5271********0001) for strict privacy compliance.',
    content: `<?php
/**
 * Admin Clients Directory (Masked NIK)
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;
global $wpdb;

$clients = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ldn_clients ORDER BY id DESC LIMIT 50" );
?>

<div class="wrap ldn-admin-wrap">
    <h1><?php esc_html_e( 'Direktori Klien & Berkas Identitas', 'lalu-daud-notary' ); ?></h1>
    <p class="description"><?php esc_html_e( 'Data identitas (NIK) disamarkan secara otomatis demi kepatuhan perlindungan data pribadi hukum.', 'lalu-daud-notary' ); ?></p>

    <div class="ldn-panel">
        <table class="widefat striped">
            <thead>
                <tr>
                    <th>Klien ID</th>
                    <th>Nama Lengkap</th>
                    <th>Nomor Identitas (Masked)</th>
                    <th>Nomor WhatsApp</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Terdaftar</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( empty( $clients ) ) : ?>
                    <tr><td colspan="7"><?php esc_html_e( 'Belum ada klien terdaftar.', 'lalu-daud-notary' ); ?></td></tr>
                <?php else : foreach ( $clients as $cl ) : ?>
                    <tr>
                        <td><code><?php echo esc_html( $cl->client_id ); ?></code></td>
                        <td><strong><?php echo esc_html( $cl->name ); ?></strong></td>
                        <td><span class="ldn-masked-pill"><?php echo esc_html( $cl->identity_masked ); ?></span></td>
                        <td><?php echo esc_html( $cl->phone ); ?></td>
                        <td><?php echo esc_html( $cl->email ); ?></td>
                        <td><span class="ldn-status-badge status-active"><?php echo esc_html( $cl->status ); ?></span></td>
                        <td><?php echo esc_html( $cl->created_at ); ?></td>
                    </tr>
                <?php endforeach; endif; ?>
            </tbody>
        </table>
    </div>
</div>
`
  },

  // =========================================================================
  // 4. ADMIN SETTINGS: admin/settings.php
  // =========================================================================
  {
    path: 'admin/settings.php',
    name: 'settings.php',
    category: 'ADMIN',
    description: 'System Settings: Google Apps Script Web App URL, HMAC Secret, Timeout, and Data Retention options.',
    content: `<?php
/**
 * Admin System Settings
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

$settings = get_option( 'ldn_google_settings', array() );
$gas_url  = isset( $settings['gas_web_app_url'] ) ? $settings['gas_web_app_url'] : '';
$secret   = isset( $settings['hmac_secret'] ) ? $settings['hmac_secret'] : '';
$timeout  = isset( $settings['timeout_seconds'] ) ? $settings['timeout_seconds'] : 25;
$max_mb   = isset( $settings['max_file_size_mb'] ) ? $settings['max_file_size_mb'] : 10;
$delete   = isset( $settings['delete_on_uninstall'] ) && 'yes' === $settings['delete_on_uninstall'];
?>

<div class="wrap ldn-admin-wrap">
    <h1><?php esc_html_e( 'Pengaturan Sistem & Integrasi Google', 'lalu-daud-notary' ); ?></h1>
    <p class="description"><?php esc_html_e( 'Konfigurasi Google Apps Script Middleware (Zero Google Credential Exposure ke browser).', 'lalu-daud-notary' ); ?></p>

    <div class="ldn-panel">
        <form id="ldn-settings-form">
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="gas_web_app_url"><?php esc_html_e( 'Google Apps Script Web App URL', 'lalu-daud-notary' ); ?></label></th>
                    <td>
                        <input type="url" class="large-text code" id="gas_web_app_url" name="gas_web_app_url" value="<?php echo esc_attr( $gas_url ); ?>" placeholder="https://script.google.com/macros/s/xxxx/exec" required>
                        <p class="description"><?php esc_html_e( 'URL Web App hasil Deploy Google Apps Script (Execute as: Me, Access: Anyone).', 'lalu-daud-notary' ); ?></p>
                    </td>
                </tr>

                <tr>
                    <th scope="row"><label for="hmac_secret"><?php esc_html_e( 'HMAC Secret Key', 'lalu-daud-notary' ); ?></label></th>
                    <td>
                        <input type="password" class="large-text code" id="hmac_secret" name="hmac_secret" value="<?php echo esc_attr( $secret ); ?>" required>
                        <p class="description"><?php esc_html_e( 'Kunci rahasia bersama untuk menandatangani request HMAC-SHA256 (harus sama dengan nilai HMAC_SECRET di Script Properties Apps Script).', 'lalu-daud-notary' ); ?></p>
                    </td>
                </tr>

                <tr>
                    <th scope="row"><label for="timeout_seconds"><?php esc_html_e( 'API Timeout (Detik)', 'lalu-daud-notary' ); ?></label></th>
                    <td>
                        <input type="number" min="5" max="60" class="small-text" id="timeout_seconds" name="timeout_seconds" value="<?php echo esc_attr( $timeout ); ?>">
                    </td>
                </tr>

                <tr>
                    <th scope="row"><label for="max_file_size_mb"><?php esc_html_e( 'Max Ukuran File Upload (MB)', 'lalu-daud-notary' ); ?></label></th>
                    <td>
                        <input type="number" min="1" max="25" class="small-text" id="max_file_size_mb" name="max_file_size_mb" value="<?php echo esc_attr( $max_mb ); ?>">
                    </td>
                </tr>

                <tr>
                    <th scope="row"><?php esc_html_e( 'Uninstall Protection', 'lalu-daud-notary' ); ?></th>
                    <td>
                        <label>
                            <input type="checkbox" name="delete_on_uninstall" value="yes" <?php checked( $delete ); ?>>
                            <?php esc_html_e( 'Hapus seluruh data tabel & konfigurasi saat plugin di-uninstall (Default: Tidak).', 'lalu-daud-notary' ); ?>
                        </label>
                    </td>
                </tr>
            </table>

            <p class="submit">
                <button type="submit" class="button button-primary"><?php esc_html_e( 'Simpan Konfigurasi', 'lalu-daud-notary' ); ?></button>
                <button type="button" class="button button-secondary" id="ldn-btn-test-conn"><?php esc_html_e( 'Uji Koneksi Apps Script (HMAC)', 'lalu-daud-notary' ); ?></button>
            </p>
        </form>
    </div>
</div>
`
  },

  // =========================================================================
  // 5. ADMIN AUDIT & DOCUMENTS & PAYMENTS & SERVICES
  // =========================================================================
  {
    path: 'admin/audit.php',
    name: 'audit.php',
    category: 'ADMIN',
    description: 'Audit Log Trail: Immutable record of system actions with hashed IPs and zero credential exposure.',
    content: `<?php
/**
 * Admin Audit Trail
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;
global $wpdb;

$logs = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ldn_audit_log ORDER BY id DESC LIMIT 50" );
?>

<div class="wrap ldn-admin-wrap">
    <h1><?php esc_html_e( 'Audit Trail & Log Keamanan Sistem', 'lalu-daud-notary' ); ?></h1>
    <div class="ldn-panel">
        <table class="widefat striped">
            <thead>
                <tr>
                    <th>Log ID</th>
                    <th>Waktu</th>
                    <th>User ID / Role</th>
                    <th>Aksi</th>
                    <th>Kasus ID</th>
                    <th>IP Hash</th>
                    <th>Hasil</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( empty( $logs ) ) : ?>
                    <tr><td colspan="7"><?php esc_html_e( 'Belum ada log tercatat.', 'lalu-daud-notary' ); ?></td></tr>
                <?php else : foreach ( $logs as $l ) : ?>
                    <tr>
                        <td><code><?php echo esc_html( $l->log_id ); ?></code></td>
                        <td><?php echo esc_html( $l->timestamp ); ?></td>
                        <td>User #<?php echo esc_html( $l->user_id ); ?> (<?php echo esc_html( $l->role ); ?>)</td>
                        <td><strong><?php echo esc_html( $l->action ); ?></strong></td>
                        <td><?php echo esc_html( $l->case_id ? $l->case_id : '-' ); ?></td>
                        <td><code><?php echo esc_html( substr( $l->ip_hash, 0, 12 ) . '...' ); ?></code></td>
                        <td><span class="ldn-status-badge status-<?php echo 'SUCCESS' === $l->result ? 'completed' : 'rejected'; ?>"><?php echo esc_html( $l->result ); ?></span></td>
                    </tr>
                <?php endforeach; endif; ?>
            </tbody>
        </table>
    </div>
</div>
`
  },
  {
    path: 'admin/documents.php',
    name: 'documents.php',
    category: 'ADMIN',
    description: 'Document Repository: Manage case documents, verify status, and trigger authenticated streaming downloads.',
    content: `<?php
/**
 * Admin Documents Manager
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;
global $wpdb;

$docs = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ldn_documents ORDER BY id DESC LIMIT 50" );
?>

<div class="wrap ldn-admin-wrap">
    <h1><?php esc_html_e( 'Dokumen Berkas & Warkah Perkara', 'lalu-daud-notary' ); ?></h1>
    <p class="description"><?php esc_html_e( 'Semua dokumen tersimpan secara privat di Google Drive tanpa tautan publik ("Anyone with the link").', 'lalu-daud-notary' ); ?></p>
    <div class="ldn-panel">
        <table class="widefat striped">
            <thead>
                <tr>
                    <th>Doc ID</th>
                    <th>Nama File</th>
                    <th>Perkara ID</th>
                    <th>Klien ID</th>
                    <th>Ukuran</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( empty( $docs ) ) : ?>
                    <tr><td colspan="7"><?php esc_html_e( 'Belum ada dokumen.', 'lalu-daud-notary' ); ?></td></tr>
                <?php else : foreach ( $docs as $d ) : ?>
                    <tr>
                        <td><code><?php echo esc_html( $d->document_id ); ?></code></td>
                        <td><strong><?php echo esc_html( $d->filename ); ?></strong></td>
                        <td><?php echo esc_html( $d->case_id ); ?></td>
                        <td><code><?php echo esc_html( $d->client_id ); ?></code></td>
                        <td><?php echo esc_html( round( $d->file_size / 1024, 1 ) . ' KB' ); ?></td>
                        <td><span class="ldn-status-badge status-<?php echo esc_attr( strtolower( $d->status ) ); ?>"><?php echo esc_html( $d->status ); ?></span></td>
                        <td>
                            <a href="<?php echo esc_url( rest_url( 'lalu-daud/v1/documents/' . $d->document_id . '/download' ) ); ?>" class="button button-small">Download Stream</a>
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
    path: 'admin/payments.php',
    name: 'payments.php',
    category: 'ADMIN',
    description: 'Payments & Billing: Manage client invoices and payment reconciliations.',
    content: `<?php
/**
 * Admin Payments
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;
global $wpdb;

$payments = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ldn_payments ORDER BY id DESC LIMIT 50" );
?>

<div class="wrap ldn-admin-wrap">
    <h1><?php esc_html_e( 'Invoice & Pembayaran Layanan', 'lalu-daud-notary' ); ?></h1>
    <div class="ldn-panel">
        <table class="widefat striped">
            <thead>
                <tr>
                    <th>Invoice No</th>
                    <th>Perkara ID</th>
                    <th>Deskripsi</th>
                    <th>Nominal</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( empty( $payments ) ) : ?>
                    <tr><td colspan="6"><?php esc_html_e( 'Belum ada data pembayaran.', 'lalu-daud-notary' ); ?></td></tr>
                <?php else : foreach ( $payments as $p ) : ?>
                    <tr>
                        <td><strong><?php echo esc_html( $p->invoice_number ); ?></strong></td>
                        <td><?php echo esc_html( $p->case_id ); ?></td>
                        <td><?php echo esc_html( $p->description ); ?></td>
                        <td>Rp <?php echo esc_html( number_format( $p->amount, 0, ',', '.' ) ); ?></td>
                        <td><span class="ldn-status-badge status-<?php echo esc_attr( strtolower( $p->payment_status ) ); ?>"><?php echo esc_html( $p->payment_status ); ?></span></td>
                        <td><?php echo esc_html( $p->created_at ); ?></td>
                    </tr>
                <?php endforeach; endif; ?>
            </tbody>
        </table>
    </div>
</div>
`
  },
  {
    path: 'admin/services.php',
    name: 'services.php',
    category: 'ADMIN',
    description: 'Services Master: Define notary & PPAT service types, default fees, and requirements checklist.',
    content: `<?php
/**
 * Admin Services
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;
?>

<div class="wrap ldn-admin-wrap">
    <h1><?php esc_html_e( 'Katalog Layanan Kenotariatan & PPAT', 'lalu-daud-notary' ); ?></h1>
    <p class="description"><?php esc_html_e( 'Konfigurasi jenis layanan hukum, estimasi waktu pengerjaan, dan formula kalkulator biaya.', 'lalu-daud-notary' ); ?></p>
    <div class="ldn-panel">
        <table class="widefat striped">
            <thead>
                <tr>
                    <th>Kode Layanan</th>
                    <th>Nama Layanan</th>
                    <th>Biaya Dasar Standar</th>
                    <th>Estimasi Waktu</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>AJB</code></td>
                    <td><strong>Akta Jual Beli (AJB Tanah & Bangunan)</strong></td>
                    <td>Rp 3.500.000 / 1% Nilai Transaksi</td>
                    <td>7-14 Hari Kerja</td>
                    <td><span class="ldn-status-badge status-completed">Aktif</span></td>
                </tr>
                <tr>
                    <td><code>PENDIRIAN_PT</code></td>
                    <td><strong>Pendirian PT / CV / Badan Usaha</strong></td>
                    <td>Rp 5.000.000</td>
                    <td>5-7 Hari Kerja</td>
                    <td><span class="ldn-status-badge status-completed">Aktif</span></td>
                </tr>
                <tr>
                    <td><code>WARIS_HIBAH</code></td>
                    <td><strong>Akta Pembagian Hak Bersama (APHB) / Waris / Hibah</strong></td>
                    <td>Rp 4.000.000</td>
                    <td>10-14 Hari Kerja</td>
                    <td><span class="ldn-status-badge status-completed">Aktif</span></td>
                </tr>
                <tr>
                    <td><code>PRENUP</code></td>
                    <td><strong>Perjanjian Perkawinan (Prenuptial Agreement)</strong></td>
                    <td>Rp 3.000.000</td>
                    <td>3-5 Hari Kerja</td>
                    <td><span class="ldn-status-badge status-completed">Aktif</span></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
`
  }
];
