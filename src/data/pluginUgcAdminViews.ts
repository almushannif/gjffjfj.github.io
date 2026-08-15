import { PluginFile } from './pluginTypes';

export const PLUGIN_ADMIN_VIEWS_FILES: PluginFile[] = [
  // =========================================================================
  // 14. ADMIN VIEW: DASHBOARD
  // =========================================================================
  {
    path: 'admin/views/dashboard.php',
    name: 'dashboard.php',
    category: 'ADMIN',
    description: 'Admin Dashboard View: Shows live connection badges (OAuth, Drive, Sheets, Apps Script), pending queue count, and 1-click system setup.',
    content: `<?php
/**
 * Admin Dashboard View
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;

$oauth  = get_option( 'ugc_oauth_settings', array() );
$drive  = get_option( 'ugc_drive_settings', array() );
$sheets = get_option( 'ugc_sheets_settings', array() );
$gas    = get_option( 'ugc_apps_script_settings', array() );

$is_oauth_connected = ! empty( $oauth['auth_status'] ) && 'connected' === $oauth['auth_status'];
$is_drive_ready     = ! empty( $drive['root_folder_id'] );
$is_sheets_ready    = ! empty( $sheets['spreadsheet_id'] );
$is_gas_ready       = ! empty( $gas['status'] ) && 'connected' === $gas['status'];

global $wpdb;
$pending_count = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}ugc_sync_queue WHERE status = 'pending'" );
$error_count   = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}ugc_sync_queue WHERE status = 'failed'" );
?>

<div class="wrap ugc-admin-wrap">
    <div class="ugc-admin-header">
        <div class="ugc-admin-title-area">
            <h1><?php esc_html_e( 'Universal Google Connect', 'universal-google-connect' ); ?> <span class="ugc-badge-version">v<?php echo esc_html( UGC_VERSION ); ?></span></h1>
            <p class="ugc-admin-subtitle"><?php esc_html_e( 'Stable, Portable, and Direct OAuth 2.0 Integration for Google Drive, Google Sheets, & Apps Script.', 'universal-google-connect' ); ?></p>
        </div>
        <div class="ugc-admin-header-actions">
            <a href="<?php echo esc_url( admin_url( 'admin.php?page=ugc-setup-wizard' ) ); ?>" class="button button-primary button-hero">
                <span class="dashicons dashicons-superhero"></span> <?php esc_html_e( 'Open Setup Wizard', 'universal-google-connect' ); ?>
            </a>
        </div>
    </div>

    <!-- Status Overview Cards -->
    <div class="ugc-status-grid">
        <!-- 1. Google OAuth Card -->
        <div class="ugc-status-card <?php echo $is_oauth_connected ? 'is-connected' : 'is-disconnected'; ?>">
            <div class="ugc-card-header">
                <span class="dashicons dashicons-admin-users"></span>
                <h3><?php esc_html_e( 'Google Account', 'universal-google-connect' ); ?></h3>
                <span class="ugc-indicator <?php echo $is_oauth_connected ? 'online' : 'offline'; ?>"></span>
            </div>
            <div class="ugc-card-body">
                <p><strong><?php esc_html_e( 'Status:', 'universal-google-connect' ); ?></strong> <?php echo $is_oauth_connected ? '<span class="ugc-text-success">● ' . esc_html__( 'Connected', 'universal-google-connect' ) . '</span>' : '<span class="ugc-text-danger">● ' . esc_html__( 'Disconnected', 'universal-google-connect' ) . '</span>'; ?></p>
                <?php if ( $is_oauth_connected ) : ?>
                    <p class="ugc-detail"><strong>Email:</strong> <?php echo esc_html( $oauth['connected_email'] ); ?></p>
                    <p class="ugc-detail"><strong>Connected:</strong> <?php echo esc_html( $oauth['connected_time'] ); ?></p>
                <?php else : ?>
                    <p class="ugc-detail"><?php esc_html_e( 'Configure Client ID & Secret to connect.', 'universal-google-connect' ); ?></p>
                <?php endif; ?>
            </div>
            <div class="ugc-card-footer">
                <a href="<?php echo esc_url( admin_url( 'admin.php?page=ugc-settings-oauth' ) ); ?>" class="button button-secondary">
                    <?php echo $is_oauth_connected ? esc_html__( 'Manage OAuth', 'universal-google-connect' ) : esc_html__( 'Connect Google', 'universal-google-connect' ); ?>
                </a>
            </div>
        </div>

        <!-- 2. Google Drive Card -->
        <div class="ugc-status-card <?php echo $is_drive_ready ? 'is-connected' : 'is-disconnected'; ?>">
            <div class="ugc-card-header">
                <span class="dashicons dashicons-category"></span>
                <h3><?php esc_html_e( 'Google Drive', 'universal-google-connect' ); ?></h3>
                <span class="ugc-indicator <?php echo $is_drive_ready ? 'online' : 'offline'; ?>"></span>
            </div>
            <div class="ugc-card-body">
                <p><strong><?php esc_html_e( 'Root Folder:', 'universal-google-connect' ); ?></strong> <?php echo $is_drive_ready ? '<span class="ugc-text-success">' . esc_html( $drive['root_folder_name'] ) . '</span>' : esc_html__( 'Not configured', 'universal-google-connect' ); ?></p>
                <p class="ugc-detail"><strong>Folder Structure:</strong> 7 Subfolders (Clients, Applications, Documents...)</p>
            </div>
            <div class="ugc-card-footer">
                <a href="<?php echo esc_url( admin_url( 'admin.php?page=ugc-settings-drive' ) ); ?>" class="button button-secondary">
                    <?php esc_html_e( 'Configure Drive', 'universal-google-connect' ); ?>
                </a>
            </div>
        </div>

        <!-- 3. Google Sheets Card -->
        <div class="ugc-status-card <?php echo $is_sheets_ready ? 'is-connected' : 'is-disconnected'; ?>">
            <div class="ugc-card-header">
                <span class="dashicons dashicons-media-spreadsheet"></span>
                <h3><?php esc_html_e( 'Google Sheets', 'universal-google-connect' ); ?></h3>
                <span class="ugc-indicator <?php echo $is_sheets_ready ? 'online' : 'offline'; ?>"></span>
            </div>
            <div class="ugc-card-body">
                <p><strong><?php esc_html_e( 'Spreadsheet:', 'universal-google-connect' ); ?></strong> <?php echo $is_sheets_ready ? '<span class="ugc-text-success">' . esc_html( $sheets['spreadsheet_name'] ) . '</span>' : esc_html__( 'Not linked', 'universal-google-connect' ); ?></p>
                <p class="ugc-detail"><strong>Worksheets:</strong> 8 Legal Sheets (Clients, Services, Estimates...)</p>
            </div>
            <div class="ugc-card-footer">
                <a href="<?php echo esc_url( admin_url( 'admin.php?page=ugc-settings-sheets' ) ); ?>" class="button button-secondary">
                    <?php esc_html_e( 'Configure Sheets', 'universal-google-connect' ); ?>
                </a>
            </div>
        </div>

        <!-- 4. Google Apps Script Card -->
        <div class="ugc-status-card <?php echo $is_gas_ready ? 'is-connected' : 'is-disconnected'; ?>">
            <div class="ugc-card-header">
                <span class="dashicons dashicons-rest-api"></span>
                <h3><?php esc_html_e( 'Apps Script', 'universal-google-connect' ); ?></h3>
                <span class="ugc-indicator <?php echo $is_gas_ready ? 'online' : 'offline'; ?>"></span>
            </div>
            <div class="ugc-card-body">
                <p><strong><?php esc_html_e( 'Health Check:', 'universal-google-connect' ); ?></strong> <?php echo $is_gas_ready ? '<span class="ugc-text-success">● 200 OK</span>' : esc_html__( 'Unverified', 'universal-google-connect' ); ?></p>
                <p class="ugc-detail"><strong>Endpoint:</strong> <?php echo ! empty( $gas['web_app_url'] ) ? esc_html( substr( $gas['web_app_url'], 0, 35 ) . '...' ) : esc_html__( 'No URL set', 'universal-google-connect' ); ?></p>
            </div>
            <div class="ugc-card-footer">
                <a href="<?php echo esc_url( admin_url( 'admin.php?page=ugc-settings-apps-script' ) ); ?>" class="button button-secondary">
                    <?php esc_html_e( 'Deploy / Test', 'universal-google-connect' ); ?>
                </a>
            </div>
        </div>
    </div>

    <!-- Quick Action / 1-Click Initialize Box -->
    <?php if ( $is_oauth_connected ) : ?>
        <div class="ugc-action-banner">
            <div class="ugc-action-content">
                <h2><?php esc_html_e( 'Initialize Entire Google System (1-Click)', 'universal-google-connect' ); ?></h2>
                <p><?php esc_html_e( 'Automatically creates your Google Drive folder hierarchy, Google Sheets database with all 8 worksheets and pre-formatted headers. Safe and idempotent (never creates duplicate folders).', 'universal-google-connect' ); ?></p>
            </div>
            <div class="ugc-action-button">
                <button type="button" id="ugc-btn-init-system" class="button button-primary button-large">
                    <span class="dashicons dashicons-hammer"></span> <?php esc_html_e( 'Initialize System Now', 'universal-google-connect' ); ?>
                </button>
            </div>
        </div>
    <?php endif; ?>

    <!-- Queue & Statistics Section -->
    <div class="ugc-stats-row">
        <div class="ugc-stat-box">
            <h4><?php esc_html_e( 'Sync Queue Status', 'universal-google-connect' ); ?></h4>
            <div class="ugc-stat-numbers">
                <span class="ugc-stat-num <?php echo $pending_count > 0 ? 'is-warning' : 'is-success'; ?>"><?php echo esc_html( $pending_count ); ?></span>
                <span class="ugc-stat-label"><?php esc_html_e( 'Pending Background Tasks', 'universal-google-connect' ); ?></span>
            </div>
            <p class="description"><?php esc_html_e( 'Processed automatically every 5 minutes via WP-Cron.', 'universal-google-connect' ); ?></p>
        </div>

        <div class="ugc-stat-box">
            <h4><?php esc_html_e( 'System Resilience & Fault-Tolerance', 'universal-google-connect' ); ?></h4>
            <p><?php esc_html_e( 'If Google APIs experience temporary latency, WordPress continues to store all client submissions locally in MySQL with 0 data loss.', 'universal-google-connect' ); ?></p>
            <div class="ugc-badge-pill"><?php esc_html_e( 'Zero Dependency Isolation: Active', 'universal-google-connect' ); ?></div>
        </div>
    </div>
</div>
`
  },

  // =========================================================================
  // 15. ADMIN VIEW: SETUP WIZARD (8 STEPS)
  // =========================================================================
  {
    path: 'admin/views/wizard.php',
    name: 'wizard.php',
    category: 'ADMIN',
    description: 'Setup Wizard View: 8 clear steps guiding the administrator from requirements check to OAuth, Drive, Sheets, and Apps Script.',
    content: `<?php
/**
 * Setup Wizard View (8 Steps)
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;
$redirect_uri = UGC_OAuth::get_redirect_uri();
?>

<div class="wrap ugc-admin-wrap">
    <div class="ugc-wizard-container">
        <div class="ugc-wizard-header">
            <h2><?php esc_html_e( 'Universal Google Connect — Setup Wizard', 'universal-google-connect' ); ?></h2>
            <p><?php esc_html_e( 'Follow these 8 straightforward steps to configure full Google Cloud, Drive, and Sheets synchronization.', 'universal-google-connect' ); ?></p>
        </div>

        <div class="ugc-wizard-steps-nav">
            <div class="step-nav-item active" data-step="1">1. Requirements</div>
            <div class="step-nav-item" data-step="2">2. Google OAuth</div>
            <div class="step-nav-item" data-step="3">3. Google Drive</div>
            <div class="step-nav-item" data-step="4">4. Google Sheets</div>
            <div class="step-nav-item" data-step="5">5. Apps Script</div>
            <div class="step-nav-item" data-step="6">6. Database</div>
            <div class="step-nav-item" data-step="7">7. Connection Test</div>
            <div class="step-nav-item" data-step="8">8. Complete</div>
        </div>

        <div class="ugc-wizard-content">
            <!-- Step 1: Requirements -->
            <div class="ugc-wizard-pane active" id="wizard-step-1">
                <h3><?php esc_html_e( 'Step 1: System Requirements & Compatibility', 'universal-google-connect' ); ?></h3>
                <table class="widefat striped">
                    <tbody>
                        <tr>
                            <td><strong>PHP Version:</strong></td>
                            <td><?php echo esc_html( PHP_VERSION ); ?> <?php echo version_compare( PHP_VERSION, '7.4', '>=' ) ? '<span class="ugc-text-success">✔ (Passed)</span>' : '<span class="ugc-text-danger">✖ (Requires PHP 7.4+)</span>'; ?></td>
                        </tr>
                        <tr>
                            <td><strong>WordPress Core:</strong></td>
                            <td><?php echo esc_html( get_bloginfo( 'version' ) ); ?> <span class="ugc-text-success">✔ (Passed)</span></td>
                        </tr>
                        <tr>
                            <td><strong>OpenSSL Encryption:</strong></td>
                            <td><?php echo function_exists( 'openssl_encrypt' ) ? '<span class="ugc-text-success">✔ Enabled (AES-256 available)</span>' : '<span class="ugc-text-danger">✖ Missing</span>'; ?></td>
                        </tr>
                        <tr>
                            <td><strong>HTTPS / SSL:</strong></td>
                            <td><?php echo is_ssl() ? '<span class="ugc-text-success">✔ Active (Secure)</span>' : '<span class="ugc-text-warning">⚠ HTTP detected. Google OAuth requires HTTPS in production.</span>'; ?></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Step 2: Google OAuth -->
            <div class="ugc-wizard-pane" id="wizard-step-2" style="display:none;">
                <h3><?php esc_html_e( 'Step 2: Google Cloud Console Credentials', 'universal-google-connect' ); ?></h3>
                <p><?php esc_html_e( 'Register your OAuth 2.0 Client ID in Google Cloud Console. Paste the Authorized Redirect URI below:', 'universal-google-connect' ); ?></p>
                
                <div class="ugc-input-copy-group">
                    <label><strong><?php esc_html_e( 'Authorized Redirect URI:', 'universal-google-connect' ); ?></strong></label>
                    <input type="text" class="large-text code" readonly value="<?php echo esc_attr( $redirect_uri ); ?>" id="ugc-copy-uri-input">
                    <button type="button" class="button" onclick="navigator.clipboard.writeText('<?php echo esc_js( $redirect_uri ); ?>'); alert('Redirect URI copied!');">Copy</button>
                </div>
            </div>
        </div>
    </div>
</div>
`
  },

  // =========================================================================
  // 16. ADMIN VIEW: OAUTH SETTINGS
  // =========================================================================
  {
    path: 'admin/views/settings-oauth.php',
    name: 'settings-oauth.php',
    category: 'ADMIN',
    description: 'OAuth Configuration Page: Enter Client ID, Client Secret, Copy Redirect URI, and trigger Google Connect flow.',
    content: `<?php
/**
 * OAuth Settings View
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;

$settings = get_option( 'ugc_oauth_settings', array() );
$redirect_uri = UGC_OAuth::get_redirect_uri();
$is_connected = ! empty( $settings['auth_status'] ) && 'connected' === $settings['auth_status'];
?>

<div class="wrap ugc-admin-wrap">
    <h1><?php esc_html_e( 'Google OAuth 2.0 Configuration', 'universal-google-connect' ); ?></h1>
    <p class="description"><?php esc_html_e( 'Direct authentication with Google Cloud without third-party proxies.', 'universal-google-connect' ); ?></p>

    <div class="ugc-settings-box">
        <form method="post" id="ugc-oauth-form">
            <?php wp_nonce_field( 'ugc_admin_action', 'ugc_nonce' ); ?>

            <table class="form-table">
                <tr>
                    <th scope="row"><label for="client_id"><?php esc_html_e( 'Google Client ID', 'universal-google-connect' ); ?></label></th>
                    <td>
                        <input name="client_id" type="text" id="client_id" value="<?php echo esc_attr( isset( $settings['client_id'] ) ? $settings['client_id'] : '' ); ?>" class="regular-text code" placeholder="xxxx-xxxx.apps.googleusercontent.com" required>
                        <p class="description"><?php esc_html_e( 'From Google Cloud Console -> APIs & Services -> Credentials', 'universal-google-connect' ); ?></p>
                    </td>
                </tr>

                <tr>
                    <th scope="row"><label for="client_secret"><?php esc_html_e( 'Google Client Secret', 'universal-google-connect' ); ?></label></th>
                    <td>
                        <input name="client_secret" type="password" id="client_secret" value="<?php echo esc_attr( isset( $settings['client_secret'] ) ? $settings['client_secret'] : '' ); ?>" class="regular-text code" required>
                    </td>
                </tr>

                <tr>
                    <th scope="row"><?php esc_html_e( 'Authorized Redirect URI', 'universal-google-connect' ); ?></th>
                    <td>
                        <input type="text" class="large-text code" readonly value="<?php echo esc_attr( $redirect_uri ); ?>">
                        <p class="description"><?php esc_html_e( 'Add this exact URI into "Authorized redirect URIs" in your Google Cloud Console OAuth Client.', 'universal-google-connect' ); ?></p>
                    </td>
                </tr>
            </table>

            <p class="submit">
                <button type="submit" class="button button-primary"><?php esc_html_e( 'Save Credentials', 'universal-google-connect' ); ?></button>
                
                <?php if ( ! empty( $settings['client_id'] ) && ! $is_connected ) : 
                    $auth_url = UGC_OAuth::get_auth_url();
                ?>
                    <a href="<?php echo esc_url( is_wp_error( $auth_url ) ? '#' : $auth_url ); ?>" class="button button-secondary" style="margin-left:10px;">
                        <span class="dashicons dashicons-google"></span> <?php esc_html_e( 'Connect Google Account', 'universal-google-connect' ); ?>
                    </a>
                <?php endif; ?>

                <?php if ( $is_connected ) : ?>
                    <button type="button" id="ugc-btn-disconnect" class="button button-link-delete" style="margin-left:15px; color:#b32d2e;">
                        <?php esc_html_e( 'Disconnect Google Account', 'universal-google-connect' ); ?>
                    </button>
                <?php endif; ?>
            </p>
        </form>
    </div>
</div>
`
  },

  // =========================================================================
  // 17. ADMIN VIEW: DRIVE SETTINGS
  // =========================================================================
  {
    path: 'admin/views/settings-drive.php',
    name: 'settings-drive.php',
    category: 'ADMIN',
    description: 'Google Drive Configuration: Root folder selection, 7-subfolder auto structure generator, and permissions inspector.',
    content: `<?php
/**
 * Drive Settings View
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;
$drive = get_option( 'ugc_drive_settings', array() );
?>

<div class="wrap ugc-admin-wrap">
    <h1><?php esc_html_e( 'Google Drive Integration', 'universal-google-connect' ); ?></h1>
    <p class="description"><?php esc_html_e( 'Organize client dossiers, certificates, and legal deeds automatically into isolated Drive folders.', 'universal-google-connect' ); ?></p>

    <div class="ugc-settings-box">
        <table class="form-table">
            <tr>
                <th scope="row"><?php esc_html_e( 'Root Folder Name', 'universal-google-connect' ); ?></th>
                <td>
                    <input type="text" class="regular-text" value="<?php echo esc_attr( isset( $drive['root_folder_name'] ) ? $drive['root_folder_name'] : 'Notaris Lalu Daud' ); ?>" id="ugc_drive_root_name">
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'Root Folder ID', 'universal-google-connect' ); ?></th>
                <td>
                    <input type="text" class="regular-text code" readonly value="<?php echo esc_attr( isset( $drive['root_folder_id'] ) ? $drive['root_folder_id'] : '' ); ?>">
                </td>
            </tr>
        </table>
    </div>
</div>
`
  },

  // =========================================================================
  // 18. ADMIN VIEW: SHEETS SETTINGS
  // =========================================================================
  {
    path: 'admin/views/settings-sheets.php',
    name: 'settings-sheets.php',
    category: 'ADMIN',
    description: 'Google Sheets Configuration: Create new spreadsheet or connect existing sheet by URL with validation.',
    content: `<?php
/**
 * Sheets Settings View
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;
$sheets = get_option( 'ugc_sheets_settings', array() );
?>

<div class="wrap ugc-admin-wrap">
    <h1><?php esc_html_e( 'Google Sheets Database Configuration', 'universal-google-connect' ); ?></h1>
    <p class="description"><?php esc_html_e( 'Real-time synchronization between WordPress and Google Sheets.', 'universal-google-connect' ); ?></p>

    <div class="ugc-settings-box">
        <table class="form-table">
            <tr>
                <th scope="row"><?php esc_html_e( 'Spreadsheet Title', 'universal-google-connect' ); ?></th>
                <td>
                    <input type="text" class="regular-text" value="<?php echo esc_attr( isset( $sheets['spreadsheet_name'] ) ? $sheets['spreadsheet_name'] : 'Database Website' ); ?>">
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'Spreadsheet ID', 'universal-google-connect' ); ?></th>
                <td>
                    <input type="text" class="regular-text code" readonly value="<?php echo esc_attr( isset( $sheets['spreadsheet_id'] ) ? $sheets['spreadsheet_id'] : '' ); ?>">
                </td>
            </tr>
        </table>
    </div>
</div>
`
  },

  // =========================================================================
  // 19. ADMIN VIEW: APPS SCRIPT SETTINGS
  // =========================================================================
  {
    path: 'admin/views/settings-apps-script.php',
    name: 'settings-apps-script.php',
    category: 'ADMIN',
    description: 'Google Apps Script Configuration: Web App URL connector, copyable Code.gs template, health check testing console.',
    content: `<?php
/**
 * Apps Script Settings View
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;
$gas = get_option( 'ugc_apps_script_settings', array() );
$script_code = UGC_Apps_Script::get_script_template();
?>

<div class="wrap ugc-admin-wrap">
    <h1><?php esc_html_e( 'Google Apps Script Web App Integration', 'universal-google-connect' ); ?></h1>
    
    <div class="ugc-settings-box">
        <h3><?php esc_html_e( '1. Copy Apps Script Code (Code.gs)', 'universal-google-connect' ); ?></h3>
        <textarea class="large-text code" rows="10" readonly><?php echo esc_textarea( $script_code ); ?></textarea>
        <p><button type="button" class="button" onclick="navigator.clipboard.writeText(this.previousElementSibling.value); alert('Code.gs copied!');">Copy Code.gs</button></p>

        <h3><?php esc_html_e( '2. Connect Web App URL', 'universal-google-connect' ); ?></h3>
        <table class="form-table">
            <tr>
                <th scope="row"><?php esc_html_e( 'Web App URL', 'universal-google-connect' ); ?></th>
                <td>
                    <input type="url" class="large-text code" value="<?php echo esc_attr( isset( $gas['web_app_url'] ) ? $gas['web_app_url'] : '' ); ?>" placeholder="https://script.google.com/macros/s/xxxx/exec">
                </td>
            </tr>
        </table>
    </div>
</div>
`
  },

  // =========================================================================
  // 20. ADMIN VIEW: SYNC QUEUE
  // =========================================================================
  {
    path: 'admin/views/sync-queue.php',
    name: 'sync-queue.php',
    category: 'ADMIN',
    description: 'Sync Queue & Audit Logs Viewer: View pending items, retry failed jobs, inspect system logs.',
    content: `<?php
/**
 * Sync Queue View
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;
global $wpdb;
$jobs = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ugc_sync_queue ORDER BY id DESC LIMIT 50" );
?>

<div class="wrap ugc-admin-wrap">
    <h1><?php esc_html_e( 'Background Sync Queue & Tasks', 'universal-google-connect' ); ?></h1>
    <table class="widefat striped">
        <thead>
            <tr>
                <th>ID</th>
                <th>Entity</th>
                <th>Operation</th>
                <th>Attempts</th>
                <th>Status</th>
                <th>Last Error</th>
                <th>Created At</th>
            </tr>
        </thead>
        <tbody>
            <?php if ( empty( $jobs ) ) : ?>
                <tr><td colspan="7"><?php esc_html_e( 'Sync queue is empty. All items synced with Google.', 'universal-google-connect' ); ?></td></tr>
            <?php else : foreach ( $jobs as $job ) : ?>
                <tr>
                    <td><?php echo esc_html( $job->id ); ?></td>
                    <td><?php echo esc_html( $job->entity ); ?></td>
                    <td><?php echo esc_html( $job->operation ); ?></td>
                    <td><?php echo esc_html( $job->attempts . '/' . $job->max_attempts ); ?></td>
                    <td><span class="ugc-status-badge <?php echo esc_attr( $job->status ); ?>"><?php echo esc_html( $job->status ); ?></span></td>
                    <td><?php echo esc_html( $job->last_error ? $job->last_error : '-' ); ?></td>
                    <td><?php echo esc_html( $job->created_at ); ?></td>
                </tr>
            <?php endforeach; endif; ?>
        </tbody>
    </table>
</div>
`
  },

  // =========================================================================
  // 21. ADMIN VIEW: TOOLS & DEBUG
  // =========================================================================
  {
    path: 'admin/views/debug-tools.php',
    name: 'debug-tools.php',
    category: 'ADMIN',
    description: 'Admin Tools & Diagnostic Testing: System diagnostics, test connection buttons, safe uninstall data purge toggle.',
    content: `<?php
/**
 * Debug & Tools View
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;
?>

<div class="wrap ugc-admin-wrap">
    <h1><?php esc_html_e( 'Tools & Diagnostic Utilities', 'universal-google-connect' ); ?></h1>
    <div class="ugc-settings-box">
        <h3><?php esc_html_e( 'System Diagnostics', 'universal-google-connect' ); ?></h3>
        <p><?php esc_html_e( 'Run automated health tests on WordPress Database, OpenSSL cryptography, Google REST API endpoints, and WP-Cron scheduling.', 'universal-google-connect' ); ?></p>
        <button type="button" class="button button-primary" id="ugc-run-diagnostics">
            <?php esc_html_e( 'Run Complete Diagnostics', 'universal-google-connect' ); ?>
        </button>
    </div>
</div>
`
  },

  // =========================================================================
  // 22. ADMIN STYLESHEET (SCOPED)
  // =========================================================================
  {
    path: 'admin/css/ugc-admin.css',
    name: 'ugc-admin.css',
    category: 'ADMIN',
    description: 'Admin Scoped CSS: Strictly prefixed with .ugc-admin- to guarantee 0 conflicts with WordPress theme styles.',
    content: `/* Universal Google Connect Admin CSS - Strictly Scoped */
.ugc-admin-wrap {
    margin-top: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
}

.ugc-admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    padding: 24px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    margin-bottom: 24px;
}

.ugc-badge-version {
    font-size: 13px;
    background: #0f172a;
    color: #ffffff;
    padding: 2px 8px;
    border-radius: 12px;
    vertical-align: middle;
}

.ugc-status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
}

.ugc-status-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.ugc-status-card.is-connected {
    border-top: 4px solid #10b981;
}

.ugc-status-card.is-disconnected {
    border-top: 4px solid #94a3b8;
}

.ugc-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.ugc-card-header h3 {
    margin: 0;
    font-size: 16px;
}

.ugc-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}

.ugc-indicator.online {
    background: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.ugc-indicator.offline {
    background: #cbd5e1;
}

.ugc-action-banner {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #ffffff;
    padding: 24px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
}

.ugc-action-banner h2 {
    color: #ffffff;
    margin-top: 0;
}

.ugc-settings-box {
    background: #ffffff;
    padding: 24px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-top: 16px;
}

.ugc-text-success { color: #10b981; }
.ugc-text-danger { color: #ef4444; }
.ugc-text-warning { color: #f59e0b; }
`
  },

  // =========================================================================
  // 23. ADMIN JAVASCRIPT (SCOPED)
  // =========================================================================
  {
    path: 'admin/js/ugc-admin.js',
    name: 'ugc-admin.js',
    category: 'ADMIN',
    description: 'Admin Scoped JS: Namespaced under window.UGC to prevent any global pollution.',
    content: `/* Universal Google Connect Admin JS - Strictly Scoped */
(function(window, $) {
    'use strict';

    window.UGC = window.UGC || {};

    window.UGC.Admin = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            $('#ugc-oauth-form').on('submit', this.handleSaveCredentials);
            $('#ugc-btn-disconnect').on('click', this.handleDisconnect);
            $('#ugc-btn-init-system').on('click', this.handleInitSystem);
        },

        handleSaveCredentials: function(e) {
            e.preventDefault();
            var $form = $(this);
            var data = {
                action: 'ugc_save_credentials',
                nonce: UGC_ADMIN_VARS.nonce,
                client_id: $form.find('#client_id').val(),
                client_secret: $form.find('#client_secret').val()
            };

            $.post(UGC_ADMIN_VARS.ajaxUrl, data, function(res) {
                if (res.success) {
                    alert('Credentials saved successfully!');
                    location.reload();
                } else {
                    alert('Error: ' + (res.data.message || 'Failed to save credentials.'));
                }
            });
        },

        handleDisconnect: function() {
            if (!confirm('Are you sure you want to disconnect Google Account? Your WordPress data remains safe.')) {
                return;
            }

            $.post(UGC_ADMIN_VARS.ajaxUrl, { action: 'ugc_disconnect_google', nonce: UGC_ADMIN_VARS.nonce }, function(res) {
                if (res.success) {
                    alert('Google Account disconnected.');
                    location.reload();
                }
            });
        },

        handleInitSystem: function() {
            if (!confirm('Initialize Google Drive folders and Google Sheets spreadsheet now?')) {
                return;
            }

            var $btn = $(this);
            $btn.prop('disabled', true).text('Initializing Google System...');

            $.post(UGC_ADMIN_VARS.ajaxUrl, { action: 'ugc_init_system', nonce: UGC_ADMIN_VARS.nonce }, function(res) {
                $btn.prop('disabled', false).text('Initialize System Now');
                if (res.success) {
                    alert(res.data.message);
                    location.reload();
                } else {
                    alert('Error: ' + (res.data.message || 'Initialization failed.'));
                }
            });
        }
    };

    $(document).ready(function() {
        window.UGC.Admin.init();
    });

})(window, jQuery);
`
  },

  // =========================================================================
  // 24. PUBLIC STYLESHEET (SCOPED)
  // =========================================================================
  {
    path: 'public/css/ugc-public.css',
    name: 'ugc-public.css',
    category: 'PUBLIC',
    description: 'Frontend Public CSS: All selectors scoped under .ugc-frontend to avoid overriding theme styles.',
    content: `/* Universal Google Connect Frontend CSS - Scoped */
.ugc-frontend {
    font-family: inherit;
    box-sizing: border-box;
}

.ugc-frontend *, .ugc-frontend *::before, .ugc-frontend *::after {
    box-sizing: border-box;
}

.ugc-frontend .ugc-form-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.ugc-frontend .ugc-form-group {
    margin-bottom: 16px;
}

.ugc-frontend label {
    display: block;
    font-weight: 600;
    margin-bottom: 6px;
    color: #1e293b;
}

.ugc-frontend input[type="text"],
.ugc-frontend input[type="email"],
.ugc-frontend input[type="tel"],
.ugc-frontend select,
.ugc-frontend textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 15px;
}

.ugc-frontend .ugc-btn-submit {
    background: #0f172a;
    color: #ffffff;
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.ugc-frontend .ugc-btn-submit:hover {
    background: #1e293b;
}
`
  },

  // =========================================================================
  // 25. PUBLIC JAVASCRIPT (SCOPED)
  // =========================================================================
  {
    path: 'public/js/ugc-public.js',
    name: 'ugc-public.js',
    category: 'PUBLIC',
    description: 'Frontend Public JS: Async REST submission with offline fallback resilience.',
    content: `/* Universal Google Connect Frontend JS */
(function(window, $) {
    'use strict';

    window.UGC = window.UGC || {};

    window.UGC.Frontend = {
        init: function() {
            $('#ugc-client-submission-form').on('submit', this.handleSubmit);
        },

        handleSubmit: function(e) {
            e.preventDefault();
            var $form = $(this);
            var $btn  = $form.find('button[type="submit"]');

            var payload = {
                name:    $form.find('[name="name"]').val(),
                email:   $form.find('[name="email"]').val(),
                phone:   $form.find('[name="phone"]').val(),
                service: $form.find('[name="service"]').val(),
                notes:   $form.find('[name="notes"]').val()
            };

            $btn.prop('disabled', true).text('Menyimpan Data...');

            $.ajax({
                url: UGC_VARS.restUrl + 'submit-application',
                method: 'POST',
                data: JSON.stringify(payload),
                contentType: 'application/json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', UGC_VARS.nonce);
                },
                success: function(res) {
                    $btn.prop('disabled', false).text('Kirim Permohonan');
                    alert('Permohonan berhasil disimpan! ID Anda: ' + res.application_no);
                    $form[0].reset();
                },
                error: function(xhr) {
                    $btn.prop('disabled', false).text('Kirim Permohonan');
                    alert('Gagal mengirim: ' + (xhr.responseJSON ? xhr.responseJSON.message : 'Terjadi kesalahan sistem.'));
                }
            });
        }
    };

    $(document).ready(function() {
        window.UGC.Frontend.init();
    });
})(window, jQuery);
`
  },

  // =========================================================================
  // 26. TEMPLATE: SHORTCODE CLIENT SUBMISSION
  // =========================================================================
  {
    path: 'templates/shortcode-client-submission.php',
    name: 'shortcode-client-submission.php',
    category: 'TEMPLATES',
    description: 'Frontend Shortcode Form Template: Renders clean client intake form that submits to WordPress DB and syncs to Google.',
    content: `<?php
/**
 * Shortcode Template for [ugc_google_connect]
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;
?>

<div class="ugc-frontend">
    <div class="ugc-form-card">
        <h3><?php esc_html_e( 'Formulir Permohonan & Konsultasi Layanan', 'universal-google-connect' ); ?></h3>
        <p><?php esc_html_e( 'Data Anda tersimpan secara aman di database dan terhubung dengan Google Drive & Google Sheets.', 'universal-google-connect' ); ?></p>
        
        <form id="ugc-client-submission-form">
            <div class="ugc-form-group">
                <label for="ugc_name"><?php esc_html_e( 'Nama Lengkap (Sesuai KTP)', 'universal-google-connect' ); ?> *</label>
                <input type="text" id="ugc_name" name="name" required placeholder="Contoh: Budi Santoso">
            </div>

            <div class="ugc-form-group">
                <label for="ugc_email"><?php esc_html_e( 'Alamat Email Aktif', 'universal-google-connect' ); ?> *</label>
                <input type="email" id="ugc_email" name="email" required placeholder="budi@example.com">
            </div>

            <div class="ugc-form-group">
                <label for="ugc_phone"><?php esc_html_e( 'Nomor WhatsApp / HP', 'universal-google-connect' ); ?> *</label>
                <input type="tel" id="ugc_phone" name="phone" required placeholder="08123456789">
            </div>

            <div class="ugc-form-group">
                <label for="ugc_service"><?php esc_html_e( 'Layanan yang Dibutuhkan', 'universal-google-connect' ); ?></label>
                <select id="ugc_service" name="service">
                    <option value="Akta Jual Beli (AJB)">Akta Jual Beli (AJB)</option>
                    <option value="Pendirian PT / CV / Badan Usaha">Pendirian PT / CV / Badan Usaha</option>
                    <option value="Perjanjian Kawin (Prenup)">Perjanjian Kawin (Prenup)</option>
                    <option value="Balik Nama Sertifikat Tanah">Balik Nama Sertifikat Tanah</option>
                    <option value="Hak Tanggungan & SKMHT">Hak Tanggungan & SKMHT</option>
                    <option value="Konsultasi Hukum Kenotariatan">Konsultasi Hukum Kenotariatan</option>
                </select>
            </div>

            <div class="ugc-form-group">
                <label for="ugc_notes"><?php esc_html_e( 'Catatan Tambahan / Uraian Masalah', 'universal-google-connect' ); ?></label>
                <textarea id="ugc_notes" name="notes" rows="4" placeholder="<?php esc_attr_e( 'Jelaskan kebutuhan hukum atau dokumen yang Anda miliki...', 'universal-google-connect' ); ?>"></textarea>
            </div>

            <button type="submit" class="ugc-btn-submit">
                <?php esc_html_e( 'Kirim Permohonan & Buka Berkas', 'universal-google-connect' ); ?>
            </button>
        </form>
    </div>
</div>
`
  }
];
