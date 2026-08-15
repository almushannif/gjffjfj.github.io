import { PluginFile } from './pluginTypes';

export const PLUGIN_NOTARY_CORE_FILES: PluginFile[] = [
  // =========================================================================
  // 1. MAIN BOOTSTRAPPER FILE: lalu-daud-notary.php
  // =========================================================================
  {
    path: 'lalu-daud-notary.php',
    name: 'lalu-daud-notary.php',
    category: 'CORE',
    description: 'Main plugin bootstrap file. Registers constants, custom user roles, capabilities, database tables, and initializes the security-first notary system.',
    content: `<?php
/**
 * Plugin Name:       Lalu Daud Notary & PPAT System
 * Plugin URI:        https://notarislaludaud.com/system
 * Description:       Sistem Manajemen Digital Notaris & PPAT Lalu Daud Nurjadi, M.Kn. dengan Arsitektur Aman WordPress, Google Apps Script Middleware, Private Google Drive, & Google Sheets Database.
 * Version:           2.6.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Kantor Notaris & PPAT Lalu Daud Nurjadi, S.H., M.Kn.
 * Author URI:        https://notarislaludaud.com
 * License:           Proprietary / Enterprise Legal Suite
 * Text Domain:       lalu-daud-notary
 * Domain Path:       /languages
 *
 * @package           LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

// Core Plugin Constants
define( 'LDN_VERSION', '2.6.0' );
define( 'LDN_MIN_PHP_VER', '7.4.0' );
define( 'LDN_MIN_WP_VER', '6.0' );
define( 'LDN_PLUGIN_FILE', __FILE__ );
define( 'LDN_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'LDN_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'LDN_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Autoloader / Inclusion of Core Classes
 */
require_once LDN_PLUGIN_DIR . 'includes/class-plugin.php';
require_once LDN_PLUGIN_DIR . 'includes/class-security.php';
require_once LDN_PLUGIN_DIR . 'includes/class-auth.php';
require_once LDN_PLUGIN_DIR . 'includes/class-api.php';
require_once LDN_PLUGIN_DIR . 'includes/class-rest-api.php';
require_once LDN_PLUGIN_DIR . 'includes/class-google-bridge.php';
require_once LDN_PLUGIN_DIR . 'includes/class-case-manager.php';
require_once LDN_PLUGIN_DIR . 'includes/class-client-manager.php';
require_once LDN_PLUGIN_DIR . 'includes/class-document-manager.php';
require_once LDN_PLUGIN_DIR . 'includes/class-payment-manager.php';
require_once LDN_PLUGIN_DIR . 'includes/class-audit-log.php';
require_once LDN_PLUGIN_DIR . 'includes/class-rate-limit.php';

/**
 * Activation Hook: Setup Roles, Capabilities & Database Tables
 */
function ldn_activate_plugin() {
    // Check PHP & WP version compatibility
    if ( version_compare( PHP_VERSION, LDN_MIN_PHP_VER, '<' ) ) {
        deactivate_plugins( plugin_basename( __FILE__ ) );
        wp_die( esc_html__( 'Lalu Daud Notary System requires PHP 7.4 or higher.', 'lalu-daud-notary' ) );
    }

    // 1. Create Roles and Register Custom Capabilities
    LDN_Auth::setup_roles_and_capabilities();

    // 2. Setup Local WordPress Database Tables via dbDelta
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();

    // Table 1: Clients Local Cache & Mapping
    $sql_clients = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}ldn_clients (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        client_id varchar(50) NOT NULL,
        user_id bigint(20) unsigned NOT NULL DEFAULT 0,
        name varchar(191) NOT NULL,
        identity_type varchar(20) NOT NULL DEFAULT 'KTP',
        identity_masked varchar(50) NOT NULL,
        phone varchar(50) NOT NULL,
        email varchar(100) NOT NULL,
        address text NULL,
        status varchar(30) NOT NULL DEFAULT 'ACTIVE',
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY  (id),
        UNIQUE KEY client_id (client_id),
        KEY user_id (user_id),
        KEY email (email)
    ) $charset_collate;";

    // Table 2: Cases (Perkara Notaris / PPAT)
    $sql_cases = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}ldn_cases (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        case_id varchar(50) NOT NULL,
        case_number varchar(50) NOT NULL,
        client_id varchar(50) NOT NULL,
        owner_id bigint(20) unsigned NOT NULL DEFAULT 0,
        service_id varchar(50) NOT NULL,
        title varchar(255) NOT NULL,
        description text NULL,
        status varchar(50) NOT NULL DEFAULT 'SUBMITTED',
        assigned_staff bigint(20) unsigned NOT NULL DEFAULT 0,
        target_date date NULL,
        completion_date date NULL,
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY  (id),
        UNIQUE KEY case_id (case_id),
        UNIQUE KEY case_number (case_number),
        KEY client_id (client_id),
        KEY owner_id (owner_id),
        KEY status (status)
    ) $charset_collate;";

    // Table 3: Documents
    $sql_documents = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}ldn_documents (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        document_id varchar(50) NOT NULL,
        case_id varchar(50) NOT NULL,
        client_id varchar(50) NOT NULL,
        document_type varchar(50) NOT NULL,
        filename varchar(255) NOT NULL,
        mime_type varchar(100) NOT NULL,
        file_size bigint(20) unsigned NOT NULL DEFAULT 0,
        gas_drive_ref varchar(100) NULL,
        status varchar(30) NOT NULL DEFAULT 'PENDING_VERIFICATION',
        uploaded_by bigint(20) unsigned NOT NULL DEFAULT 0,
        uploaded_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id),
        UNIQUE KEY document_id (document_id),
        KEY case_id (case_id),
        KEY client_id (client_id)
    ) $charset_collate;";

    // Table 4: Payments & Invoices
    $sql_payments = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}ldn_payments (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        payment_id varchar(50) NOT NULL,
        case_id varchar(50) NOT NULL,
        client_id varchar(50) NOT NULL,
        invoice_number varchar(50) NOT NULL,
        description varchar(255) NOT NULL,
        amount decimal(15,2) NOT NULL DEFAULT 0.00,
        payment_status varchar(30) NOT NULL DEFAULT 'UNPAID',
        payment_method varchar(50) NULL,
        payment_date datetime NULL,
        proof_document_id varchar(50) NULL,
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id),
        UNIQUE KEY payment_id (payment_id),
        UNIQUE KEY invoice_number (invoice_number),
        KEY case_id (case_id),
        KEY client_id (client_id)
    ) $charset_collate;";

    // Table 5: Audit Log
    $sql_audit = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}ldn_audit_log (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        log_id varchar(50) NOT NULL,
        timestamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        user_id bigint(20) unsigned NOT NULL DEFAULT 0,
        role varchar(50) NOT NULL,
        action varchar(100) NOT NULL,
        case_id varchar(50) NULL,
        document_id varchar(50) NULL,
        ip_hash varchar(64) NOT NULL,
        user_agent_hash varchar(64) NOT NULL,
        result varchar(30) NOT NULL DEFAULT 'SUCCESS',
        PRIMARY KEY  (id),
        KEY log_id (log_id),
        KEY user_id (user_id),
        KEY action (action)
    ) $charset_collate;";

    // Table 6: Nonce Tracker (Replay Attack Protection)
    $sql_nonces = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}ldn_nonces (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        nonce varchar(64) NOT NULL,
        action varchar(100) NOT NULL,
        used_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id),
        UNIQUE KEY nonce_action (nonce, action),
        KEY used_at (used_at)
    ) $charset_collate;";

    dbDelta( $sql_clients );
    dbDelta( $sql_cases );
    dbDelta( $sql_documents );
    dbDelta( $sql_payments );
    dbDelta( $sql_audit );
    dbDelta( $sql_nonces );

    // 3. Set Default Options
    if ( ! get_option( 'ldn_google_settings' ) ) {
        update_option( 'ldn_google_settings', array(
            'gas_web_app_url'   => '',
            'hmac_secret'       => wp_generate_password( 48, true, true ),
            'timeout_seconds'   => 25,
            'max_file_size_mb'  => 10,
            'rate_limit_minute' => 30,
            'delete_on_uninstall' => 'no'
        ) );
    }

    flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'ldn_activate_plugin' );

/**
 * Deactivation Hook
 */
function ldn_deactivate_plugin() {
    flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'ldn_deactivate_plugin' );

/**
 * Main Instance Bootstrap
 */
function ldn_init_system() {
    LDN_Plugin::get_instance();
}
add_action( 'plugins_loaded', 'ldn_init_system' );
`
  },

  // =========================================================================
  // 2. UNINSTALL FILE: uninstall.php
  // =========================================================================
  {
    path: 'uninstall.php',
    name: 'uninstall.php',
    category: 'CORE',
    description: 'Safe uninstaller. Only purges tables and options if administrator explicitly configured "Delete plugin data on uninstall".',
    content: `<?php
/**
 * Uninstall File for Lalu Daud Notary System
 *
 * @package LaluDaudNotary
 */

// If uninstall not called from WordPress, exit.
defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

$settings = get_option( 'ldn_google_settings', array() );
$delete_data = isset( $settings['delete_on_uninstall'] ) && 'yes' === $settings['delete_on_uninstall'];

if ( $delete_data ) {
    global $wpdb;

    // Drop plugin custom tables safely
    $tables = array(
        "{$wpdb->prefix}ldn_clients",
        "{$wpdb->prefix}ldn_cases",
        "{$wpdb->prefix}ldn_documents",
        "{$wpdb->prefix}ldn_payments",
        "{$wpdb->prefix}ldn_audit_log",
        "{$wpdb->prefix}ldn_nonces"
    );

    foreach ( $tables as $table ) {
        $wpdb->query( "DROP TABLE IF EXISTS {$table}" );
    }

    // Delete options
    delete_option( 'ldn_google_settings' );
    delete_option( 'ldn_services_config' );
    delete_option( 'ldn_fee_calculator_config' );

    // Remove custom roles
    remove_role( 'notaris_staff' );
    remove_role( 'notaris_client' );
    remove_role( 'notaris_viewer' );
}
`
  },

  // =========================================================================
  // 3. DOCUMENTATION FILE: readme.txt
  // =========================================================================
  {
    path: 'readme.txt',
    name: 'readme.txt',
    category: 'DOCS',
    description: 'Complete production readme, architecture specification, security guarantees, setup guide, and REST API endpoint reference.',
    content: `=== Lalu Daud Notary & PPAT System ===
Contributors: laludaudnotary
Tags: notary, ppat, legal, google sheets, google drive, apps script, hmac, client portal
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 2.6.0
License: Proprietary / Enterprise Legal Suite

Enterprise Digital Management System for Kantor Notaris & PPAT Lalu Daud Nurjadi, S.H., M.Kn.

== DESCRIPTION ==

Lalu Daud Notary & PPAT System is an enterprise-grade digital office platform custom-engineered for notary and PPAT offices. It establishes a secure, zero-credential-exposure bridge connecting WordPress, Google Sheets (Administrative Database), Google Drive (Private Vault), and Google Apps Script (Serverless Middleware).

=== ZERO GOOGLE CREDENTIAL EXPOSURE ===
The client browser NEVER directly communicates with Google APIs. All transactions are proxied through WordPress Server -> HMAC-SHA256 Signed Request -> Google Apps Script Middleware -> Google Drive / Sheets.

== KEY SECURITY FEATURES ==
* **HMAC-SHA256 Authentication**: Every payload sent to Google Apps Script is digitally signed with a cryptographic HMAC secret, timestamp, and unique nonce.
* **5-Minute Replay Protection**: Nonces are stored and checked; duplicate or expired requests (> 5 mins) are rejected with HTTP 403.
* **Masked NIK / KTP**: Identity numbers are automatically masked (e.g., 5271********0001) in tables, logs, notifications, and client views.
* **Strict Ownership Isolation**: Clients can ONLY view their own cases, documents, and invoices. Unauthorized queries return generic ACCESS_DENIED.
* **Private Drive Document Streaming**: Google Drive documents are kept strictly private (No "Anyone with link"). Documents are streamed securely via authenticated WordPress endpoints.
* **LockService Concurrency**: Case numbers (LDN-2026-XXXXX) are generated using LockService to prevent race conditions.
* **MIME & Magic Byte Validation**: 10 MB limit for PDF, JPG, PNG, DOC, DOCX with executable script blocking.

== INSTALLATION ==

1. Upload the 'lalu-daud-notary' folder to the '/wp-content/plugins/' directory, or upload the ZIP file in WP Admin -> Plugins -> Add New -> Upload.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Deploy the Google Apps Script code from 'google-apps-script/Code.gs' as a Web App (Access: Anyone).
4. Configure Script Properties in Apps Script: SPREADSHEET_ID, DRIVE_ROOT_FOLDER_ID, HMAC_SECRET.
5. In WordPress Admin, navigate to **Notaris Lalu Daud -> Pengaturan** and enter the Apps Script Web App URL and HMAC Secret.

== ROLES & CAPABILITIES ==
* **notaris_admin**: Full administrative control, settings, audit logs, cases, clients, documents, and payments.
* **notaris_staff**: Manage assigned cases, verify documents, and update status.
* **notaris_client**: Access client portal, submit applications, view personal cases, upload documents, view invoices.
* **notaris_viewer**: Read-only oversight access for audits.

== REST API ENDPOINTS ==
Namespace: /wp-json/lalu-daud/v1/
* GET    /cases - List authenticated user cases (Permission checked)
* POST   /cases - Submit new legal application
* GET    /cases/{id} - View single case detail
* POST   /cases/{id}/documents - Upload supporting document (Max 10MB)
* GET    /documents/{id}/download - Stream authenticated private document
* GET    /payments - List personal invoices
* GET    /services - Get available notary/PPAT services & calculator formulas
`
  }
];
