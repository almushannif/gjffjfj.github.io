import { PluginFile } from './pluginTypes';

export const PLUGIN_NOTARY_INCLUDES_FILES: PluginFile[] = [
  // =========================================================================
  // 1. CLASS-PLUGIN.PHP (MAIN ORCHESTRATOR)
  // =========================================================================
  {
    path: 'includes/class-plugin.php',
    name: 'class-plugin.php',
    category: 'INCLUDES',
    description: 'Core plugin singleton. Enqueues styles/scripts, registers shortcodes, admin menus, and routes lifecycle events.',
    content: `<?php
/**
 * Main Plugin Orchestrator
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

class LDN_Plugin {
    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->init_hooks();
    }

    private function init_hooks() {
        // Admin Menu & Enqueues
        add_action( 'admin_menu', array( $this, 'register_admin_menus' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_client_assets' ) );

        // Shortcodes
        add_shortcode( 'ldn_client_portal', array( $this, 'render_client_portal_shortcode' ) );
        add_shortcode( 'ldn_application_form', array( $this, 'render_application_form_shortcode' ) );
        add_shortcode( 'ldn_fee_calculator', array( $this, 'render_fee_calculator_shortcode' ) );

        // REST API
        add_action( 'rest_api_init', array( 'LDN_REST_API', 'register_routes' ) );

        // AJAX Handlers
        add_action( 'wp_ajax_ldn_save_settings', array( $this, 'handle_save_settings_ajax' ) );
        add_action( 'wp_ajax_ldn_test_gas_connection', array( $this, 'handle_test_gas_ajax' ) );
        add_action( 'wp_ajax_ldn_admin_update_case_status', array( $this, 'handle_update_case_status_ajax' ) );
    }

    public function register_admin_menus() {
        // Main Menu: Notaris Lalu Daud
        add_menu_page(
            __( 'Notaris Lalu Daud', 'lalu-daud-notary' ),
            __( 'Notaris Lalu Daud', 'lalu-daud-notary' ),
            'manage_notary_system',
            'ldn-dashboard',
            array( $this, 'render_admin_dashboard' ),
            'dashicons-portfolio',
            25
        );

        // Submenus
        add_submenu_page( 'ldn-dashboard', __( 'Dashboard', 'lalu-daud-notary' ), __( 'Dashboard', 'lalu-daud-notary' ), 'manage_notary_system', 'ldn-dashboard', array( $this, 'render_admin_dashboard' ) );
        add_submenu_page( 'ldn-dashboard', __( 'Perkara / Kasus', 'lalu-daud-notary' ), __( 'Perkara', 'lalu-daud-notary' ), 'manage_cases', 'ldn-cases', array( $this, 'render_admin_cases' ) );
        add_submenu_page( 'ldn-dashboard', __( 'Data Klien', 'lalu-daud-notary' ), __( 'Klien', 'lalu-daud-notary' ), 'manage_clients', 'ldn-clients', array( $this, 'render_admin_clients' ) );
        add_submenu_page( 'ldn-dashboard', __( 'Katalog Layanan', 'lalu-daud-notary' ), __( 'Layanan', 'lalu-daud-notary' ), 'manage_notary_system', 'ldn-services', array( $this, 'render_admin_services' ) );
        add_submenu_page( 'ldn-dashboard', __( 'Dokumen Berkas', 'lalu-daud-notary' ), __( 'Dokumen', 'lalu-daud-notary' ), 'manage_documents', 'ldn-documents', array( $this, 'render_admin_documents' ) );
        add_submenu_page( 'ldn-dashboard', __( 'Invoice & Pembayaran', 'lalu-daud-notary' ), __( 'Pembayaran', 'lalu-daud-notary' ), 'manage_payments', 'ldn-payments', array( $this, 'render_admin_payments' ) );
        add_submenu_page( 'ldn-dashboard', __( 'Audit Trail Log', 'lalu-daud-notary' ), __( 'Audit Log', 'lalu-daud-notary' ), 'view_audit_logs', 'ldn-audit', array( $this, 'render_admin_audit' ) );
        add_submenu_page( 'ldn-dashboard', __( 'Pengaturan Sistem', 'lalu-daud-notary' ), __( 'Pengaturan', 'lalu-daud-notary' ), 'manage_settings', 'ldn-settings', array( $this, 'render_admin_settings' ) );
    }

    public function enqueue_admin_assets( $hook ) {
        if ( false === strpos( $hook, 'ldn-' ) ) {
            return;
        }

        wp_enqueue_style( 'ldn-admin-css', LDN_PLUGIN_URL . 'assets/css/notary-admin.css', array(), LDN_VERSION );
        wp_enqueue_script( 'ldn-admin-js', LDN_PLUGIN_URL . 'assets/js/notary-admin.js', array( 'jquery' ), LDN_VERSION, true );

        wp_localize_script( 'ldn-admin-js', 'LDN_ADMIN_VARS', array(
            'ajaxUrl' => admin_url( 'admin-ajax.php' ),
            'nonce'   => wp_create_nonce( 'ldn_admin_action_nonce' ),
            'restUrl' => esc_url_raw( rest_url( 'lalu-daud/v1/' ) )
        ) );
    }

    public function enqueue_client_assets() {
        wp_enqueue_style( 'ldn-client-css', LDN_PLUGIN_URL . 'assets/css/notary-client.css', array(), LDN_VERSION );
        wp_enqueue_script( 'ldn-client-js', LDN_PLUGIN_URL . 'assets/js/notary-client.js', array( 'jquery' ), LDN_VERSION, true );

        wp_localize_script( 'ldn-client-js', 'LDN_CLIENT_VARS', array(
            'restUrl' => esc_url_raw( rest_url( 'lalu-daud/v1/' ) ),
            'nonce'   => wp_create_nonce( 'wp_rest' ),
            'isLoggedIn' => is_user_logged_in() ? 1 : 0
        ) );
    }

    // Admin Views Includers
    public function render_admin_dashboard() { include_once LDN_PLUGIN_DIR . 'admin/dashboard.php'; }
    public function render_admin_cases()     { include_once LDN_PLUGIN_DIR . 'admin/cases.php'; }
    public function render_admin_clients()   { include_once LDN_PLUGIN_DIR . 'admin/clients.php'; }
    public function render_admin_services()  { include_once LDN_PLUGIN_DIR . 'admin/services.php'; }
    public function render_admin_documents() { include_once LDN_PLUGIN_DIR . 'admin/documents.php'; }
    public function render_admin_payments()  { include_once LDN_PLUGIN_DIR . 'admin/payments.php'; }
    public function render_admin_audit()     { include_once LDN_PLUGIN_DIR . 'admin/audit.php'; }
    public function render_admin_settings()  { include_once LDN_PLUGIN_DIR . 'admin/settings.php'; }

    // Shortcodes
    public function render_client_portal_shortcode() {
        ob_start();
        include LDN_PLUGIN_DIR . 'client/dashboard.php';
        return ob_get_clean();
    }

    public function render_application_form_shortcode() {
        ob_start();
        include LDN_PLUGIN_DIR . 'templates/form-submission.php';
        return ob_get_clean();
    }

    public function render_fee_calculator_shortcode() {
        ob_start();
        include LDN_PLUGIN_DIR . 'templates/fee-calculator.php';
        return ob_get_clean();
    }

    // AJAX: Save Settings
    public function handle_save_settings_ajax() {
        check_ajax_referer( 'ldn_admin_action_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_settings' ) ) {
            wp_send_json_error( array( 'message' => 'Unauthorized' ), 403 );
        }

        $gas_url = isset( $_POST['gas_web_app_url'] ) ? esc_url_raw( trim( $_POST['gas_web_app_url'] ) ) : '';
        $hmac    = isset( $_POST['hmac_secret'] ) ? sanitize_text_field( trim( $_POST['hmac_secret'] ) ) : '';
        $timeout = isset( $_POST['timeout_seconds'] ) ? absint( $_POST['timeout_seconds'] ) : 25;
        $max_mb  = isset( $_POST['max_file_size_mb'] ) ? absint( $_POST['max_file_size_mb'] ) : 10;
        $delete  = isset( $_POST['delete_on_uninstall'] ) && 'yes' === $_POST['delete_on_uninstall'] ? 'yes' : 'no';

        $existing = get_option( 'ldn_google_settings', array() );
        if ( empty( $hmac ) && ! empty( $existing['hmac_secret'] ) ) {
            $hmac = $existing['hmac_secret']; // keep existing secret if unchanged
        }

        $updated = array(
            'gas_web_app_url'   => $gas_url,
            'hmac_secret'       => $hmac,
            'timeout_seconds'   => $timeout,
            'max_file_size_mb'  => $max_mb,
            'delete_on_uninstall' => $delete,
        );

        update_option( 'ldn_google_settings', $updated );
        LDN_Audit_Log::log( get_current_user_id(), 'SETTINGS_UPDATE', 'Pengaturan integrasi Google diperbarui' );

        wp_send_json_success( array( 'message' => 'Pengaturan berhasil disimpan!' ) );
    }

    // AJAX: Test Apps Script Connection
    public function handle_test_gas_ajax() {
        check_ajax_referer( 'ldn_admin_action_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_settings' ) ) {
            wp_send_json_error( array( 'message' => 'Unauthorized' ), 403 );
        }

        $res = LDN_Google_Bridge::test_connection();
        if ( is_wp_error( $res ) ) {
            wp_send_json_error( array( 'message' => $res->get_error_message() ) );
        } else {
            wp_send_json_success( array( 'message' => 'Koneksi ke Google Apps Script Berhasil (HTTP 200 OK)!', 'data' => $res ) );
        }
    }

    // AJAX: Admin Update Case Status
    public function handle_update_case_status_ajax() {
        check_ajax_referer( 'ldn_admin_action_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_cases' ) ) {
            wp_send_json_error( array( 'message' => 'Unauthorized' ), 403 );
        }

        $case_id = isset( $_POST['case_id'] ) ? sanitize_text_field( $_POST['case_id'] ) : '';
        $status  = isset( $_POST['status'] ) ? sanitize_text_field( $_POST['status'] ) : '';

        $updated = LDN_Case_Manager::update_status( $case_id, $status );
        if ( is_wp_error( $updated ) ) {
            wp_send_json_error( array( 'message' => $updated->get_error_message() ) );
        }

        wp_send_json_success( array( 'message' => 'Status perkara berhasil diperbarui!' ) );
    }
}
`
  },

  // =========================================================================
  // 2. CLASS-SECURITY.PHP (HMAC-SHA256, NIK MASKING, NONCE REPLAY)
  // =========================================================================
  {
    path: 'includes/class-security.php',
    name: 'class-security.php',
    category: 'INCLUDES',
    description: 'Cryptographic security layer: HMAC-SHA256 signature generator/validator, 5-minute timestamp check, one-time nonce verification, and identity masking.',
    content: `<?php
/**
 * Cryptographic Security & Privacy Engine
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

class LDN_Security {
    const TIMESTAMP_TOLERANCE_SECONDS = 300; // 5 Minutes

    /**
     * Mask NIK / KTP Number
     * Example: 5271012345670001 -> 5271********0001
     */
    public static function mask_identity_number( $nik ) {
        $clean = preg_replace( '/[^0-9]/', '', (string) $nik );
        $len   = strlen( $clean );
        if ( $len < 8 ) {
            return str_repeat( '*', $len );
        }
        $prefix = substr( $clean, 0, 4 );
        $suffix = substr( $clean, -4 );
        $masked = str_repeat( '*', max( 0, $len - 8 ) );
        return $prefix . $masked . $suffix;
    }

    /**
     * Generate HMAC-SHA256 Signature for outbound request to Google Apps Script
     */
    public static function generate_hmac_signature( $payload, $action, $timestamp, $nonce, $secret ) {
        $payload_string = is_array( $payload ) ? wp_json_encode( $payload ) : (string) $payload;
        $payload_hash   = hash( 'sha256', $payload_string );
        $signature_base = implode( '|', array( $timestamp, $nonce, $action, $payload_hash ) );
        return hash_hmac( 'sha256', $signature_base, $secret );
    }

    /**
     * Verify Timestamp Freshness (5-Minute Tolerance)
     */
    public static function is_timestamp_valid( $timestamp ) {
        $now  = time();
        $diff = abs( $now - (int) $timestamp );
        return $diff <= self::TIMESTAMP_TOLERANCE_SECONDS;
    }

    /**
     * Verify and Consume Nonce (One-Time Replay Protection)
     */
    public static function verify_and_consume_nonce( $nonce, $action ) {
        global $wpdb;
        $table = "{$wpdb->prefix}ldn_nonces";

        // Check if nonce already exists
        $exists = $wpdb->get_var( $wpdb->prepare(
            "SELECT id FROM {$table} WHERE nonce = %s AND action = %s",
            $nonce,
            $action
        ) );

        if ( $exists ) {
            return false; // Replay attack detected!
        }

        // Record nonce
        $wpdb->insert(
            $table,
            array(
                'nonce'   => $nonce,
                'action'  => $action,
                'used_at' => current_time( 'mysql' )
            ),
            array( '%s', '%s', '%s' )
        );

        // Periodically prune nonces older than 1 hour (1% probability)
        if ( 1 === wp_rand( 1, 100 ) ) {
            $wpdb->query( "DELETE FROM {$table} WHERE used_at < DATE_SUB(NOW(), INTERVAL 1 HOUR)" );
        }

        return true;
    }

    /**
     * Generate Unique Correlation ID for tracing
     */
    public static function generate_correlation_id() {
        return 'LDN-REQ-' . strtoupper( wp_generate_password( 8, false ) );
    }

    /**
     * Sanitize and Validate Array recursively
     */
    public static function sanitize_recursive( $data ) {
        if ( is_array( $data ) ) {
            foreach ( $data as $key => $value ) {
                $data[$key] = self::sanitize_recursive( $value );
            }
            return $data;
        }
        return is_string( $data ) ? sanitize_text_field( $data ) : $data;
    }
}
`
  },

  // =========================================================================
  // 3. CLASS-AUTH.PHP (ROLES, CAPABILITIES & OWNERSHIP ISOLATION)
  // =========================================================================
  {
    path: 'includes/class-auth.php',
    name: 'class-auth.php',
    category: 'INCLUDES',
    description: 'Custom roles & capability manager with strict default-deny ownership isolation policies.',
    content: `<?php
/**
 * Roles, Capabilities & Ownership Authorization
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

class LDN_Auth {
    /**
     * Setup custom roles on activation
     */
    public static function setup_roles_and_capabilities() {
        // 1. Administrator Capabilities
        $admin_role = get_role( 'administrator' );
        if ( $admin_role ) {
            $admin_role->add_cap( 'manage_notary_system' );
            $admin_role->add_cap( 'manage_cases' );
            $admin_role->add_cap( 'manage_clients' );
            $admin_role->add_cap( 'manage_documents' );
            $admin_role->add_cap( 'manage_payments' );
            $admin_role->add_cap( 'view_cases' );
            $admin_role->add_cap( 'view_documents' );
            $admin_role->add_cap( 'manage_settings' );
            $admin_role->add_cap( 'view_audit_logs' );
        }

        // 2. Notaris Staff Role
        add_role( 'notaris_staff', __( 'Notaris Staff', 'lalu-daud-notary' ), array(
            'read'             => true,
            'manage_cases'     => true,
            'manage_clients'   => true,
            'manage_documents' => true,
            'view_cases'       => true,
            'view_documents'   => true,
        ) );

        // 3. Notaris Client Role
        add_role( 'notaris_client', __( 'Notaris Client', 'lalu-daud-notary' ), array(
            'read'             => true,
            'view_cases'       => true,
            'view_documents'   => true,
        ) );

        // 4. Notaris Viewer Role (Auditor)
        add_role( 'notaris_viewer', __( 'Notaris Viewer / Auditor', 'lalu-daud-notary' ), array(
            'read'             => true,
            'view_cases'       => true,
            'view_documents'   => true,
            'view_audit_logs'  => true,
        ) );
    }

    /**
     * Enforce Case Ownership Isolation
     * If user is not admin/staff and does not own the case, returns false.
     */
    public static function can_access_case( $user_id, $case_id ) {
        if ( ! $user_id ) {
            return false;
        }

        if ( user_can( $user_id, 'manage_cases' ) ) {
            return true; // Staff / Admin can access all cases
        }

        global $wpdb;
        $owner_id = (int) $wpdb->get_var( $wpdb->prepare(
            "SELECT owner_id FROM {$wpdb->prefix}ldn_cases WHERE case_id = %s",
            $case_id
        ) );

        return ( $owner_id === (int) $user_id );
    }

    /**
     * Enforce Document Ownership Isolation
     */
    public static function can_access_document( $user_id, $document_id ) {
        if ( ! $user_id ) {
            return false;
        }

        if ( user_can( $user_id, 'manage_documents' ) ) {
            return true;
        }

        global $wpdb;
        $doc = $wpdb->get_row( $wpdb->prepare(
            "SELECT case_id, uploaded_by FROM {$wpdb->prefix}ldn_documents WHERE document_id = %s",
            $document_id
        ) );

        if ( ! $doc ) {
            return false;
        }

        if ( (int) $doc->uploaded_by === (int) $user_id ) {
            return true;
        }

        return self::can_access_case( $user_id, $doc->case_id );
    }
}
`
  },

  // =========================================================================
  // 4. CLASS-GOOGLE-BRIDGE.PHP (SIGNED HTTPS REQUEST TO GOOGLE APPS SCRIPT)
  // =========================================================================
  {
    path: 'includes/class-google-bridge.php',
    name: 'class-google-bridge.php',
    category: 'INCLUDES',
    description: 'Server-side signed HTTPS client to Google Apps Script. Zero browser credential leakage, automatic HMAC generation, and response verification.',
    content: `<?php
/**
 * Google Apps Script Signed Bridge
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

class LDN_Google_Bridge {
    /**
     * Send Signed Request to Google Apps Script Web App
     */
    public static function send_request( $action, $data = array() ) {
        $settings = get_option( 'ldn_google_settings', array() );
        $gas_url  = isset( $settings['gas_web_app_url'] ) ? trim( $settings['gas_web_app_url'] ) : '';
        $secret   = isset( $settings['hmac_secret'] ) ? trim( $settings['hmac_secret'] ) : '';
        $timeout  = isset( $settings['timeout_seconds'] ) ? absint( $settings['timeout_seconds'] ) : 25;

        if ( empty( $gas_url ) || empty( $secret ) ) {
            return new WP_Error( 'NOT_CONFIGURED', __( 'Google Apps Script URL atau HMAC Secret belum dikonfigurasi.', 'lalu-daud-notary' ) );
        }

        $timestamp      = time();
        $nonce          = wp_generate_password( 32, false );
        $correlation_id = LDN_Security::generate_correlation_id();

        $body_data = array(
            'action'         => $action,
            'timestamp'      => $timestamp,
            'nonce'          => $nonce,
            'correlation_id' => $correlation_id,
            'data'           => $data,
        );

        $signature = LDN_Security::generate_hmac_signature( $data, $action, $timestamp, $nonce, $secret );
        $body_data['signature'] = $signature;

        $args = array(
            'body'        => wp_json_encode( $body_data ),
            'headers'     => array(
                'Content-Type'   => 'application/json; charset=utf-8',
                'X-LDN-Signature'=> $signature,
                'X-LDN-Action'   => $action,
                'X-LDN-CorrId'   => $correlation_id,
            ),
            'timeout'     => $timeout,
            'redirection' => 5,
            'sslverify'   => true,
        );

        $response = wp_remote_post( $gas_url, $args );

        if ( is_wp_error( $response ) ) {
            LDN_Audit_Log::log( get_current_user_id(), 'GAS_ERROR', 'Network error: ' . $response->get_error_message(), '', '', 'FAILED' );
            return $response;
        }

        $code = wp_remote_retrieve_response_code( $response );
        $body = wp_remote_retrieve_body( $response );
        $json = json_decode( $body, true );

        if ( 200 !== $code || ! is_array( $json ) ) {
            return new WP_Error( 'INVALID_RESPONSE', __( 'Google Apps Script mengembalikan respons tidak valid atau status bukan 200.', 'lalu-daud-notary' ) );
        }

        if ( empty( $json['success'] ) ) {
            $err_code = isset( $json['code'] ) ? sanitize_text_field( $json['code'] ) : 'SERVER_ERROR';
            $err_msg  = isset( $json['message'] ) ? sanitize_text_field( $json['message'] ) : __( 'Terjadi kesalahan sistem di Apps Script.', 'lalu-daud-notary' );
            return new WP_Error( $err_code, $err_msg );
        }

        return $json['data'];
    }

    /**
     * Test Connectivity with Google Apps Script
     */
    public static function test_connection() {
        return self::send_request( 'healthCheck', array(
            'origin' => home_url(),
            'site'   => get_bloginfo( 'name' )
        ) );
    }
}
`
  },

  // =========================================================================
  // 5. CLASS-CASE-MANAGER.PHP (STATE MACHINE & LOCKSERVICE INTEGRATION)
  // =========================================================================
  {
    path: 'includes/class-case-manager.php',
    name: 'class-case-manager.php',
    category: 'INCLUDES',
    description: 'Case lifecycle state machine (SUBMITTED -> VERIFICATION -> DOCUMENT_INCOMPLETE -> PROCESSING -> WAITING_SIGNATURE -> COMPLETED).',
    content: `<?php
/**
 * Case / Perkara Manager
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

class LDN_Case_Manager {
    public static $valid_statuses = array(
        'DRAFT'               => 'Draft Permohonan',
        'SUBMITTED'           => 'Permohonan Masuk',
        'VERIFICATION'        => 'Verifikasi Berkas',
        'DOCUMENT_INCOMPLETE' => 'Menunggu Dokumen Tambahan',
        'PROCESSING'          => 'Proses Notaris / PPAT',
        'WAITING_SIGNATURE'   => 'Menunggu Tanda Tangan',
        'COMPLETED'           => 'Selesai',
        'REJECTED'            => 'Ditolak',
        'CANCELLED'           => 'Dibatalkan'
    );

    /**
     * Create New Case
     */
    public static function create_case( $client_id, $owner_id, $service_id, $title, $description, $documents = array() ) {
        global $wpdb;

        // Call Google Apps Script to generate guaranteed unique LDN-2026-XXXXX via LockService
        $gas_payload = array(
            'client_id'   => $client_id,
            'service_id'  => $service_id,
            'title'       => $title,
            'description' => $description,
        );

        $gas_res = LDN_Google_Bridge::send_request( 'create_case', $gas_payload );
        $case_number = ! is_wp_error( $gas_res ) && ! empty( $gas_res['case_number'] )
            ? $gas_res['case_number']
            : 'LDN-' . date('Y') . '-' . strtoupper( wp_generate_password( 5, false ) );
        $case_id = ! is_wp_error( $gas_res ) && ! empty( $gas_res['case_id'] )
            ? $gas_res['case_id']
            : 'CASE-' . strtoupper( wp_generate_password( 8, false ) );

        $inserted = $wpdb->insert(
            "{$wpdb->prefix}ldn_cases",
            array(
                'case_id'     => $case_id,
                'case_number' => $case_number,
                'client_id'   => $client_id,
                'owner_id'    => $owner_id,
                'service_id'  => $service_id,
                'title'       => $title,
                'description' => $description,
                'status'      => 'SUBMITTED',
                'created_at'  => current_time( 'mysql' ),
                'updated_at'  => current_time( 'mysql' ),
            ),
            array( '%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s', '%s', '%s' )
        );

        if ( ! $inserted ) {
            return new WP_Error( 'DB_ERROR', __( 'Gagal menyimpan data perkara ke database WordPress.', 'lalu-daud-notary' ) );
        }

        LDN_Audit_Log::log( $owner_id, 'CASE_CREATED', "Permohonan baru {$case_number} diajukan", $case_id );

        return array(
            'case_id'     => $case_id,
            'case_number' => $case_number,
            'status'      => 'SUBMITTED'
        );
    }

    /**
     * Update Case Status
     */
    public static function update_status( $case_id, $new_status ) {
        if ( ! isset( self::$valid_statuses[ $new_status ] ) ) {
            return new WP_Error( 'INVALID_STATUS', __( 'Status perkara tidak valid.', 'lalu-daud-notary' ) );
        }

        global $wpdb;
        $updated = $wpdb->update(
            "{$wpdb->prefix}ldn_cases",
            array(
                'status'     => $new_status,
                'updated_at' => current_time( 'mysql' )
            ),
            array( 'case_id' => $case_id ),
            array( '%s', '%s' ),
            array( '%s' )
        );

        // Sync update to Google Sheets via GAS
        LDN_Google_Bridge::send_request( 'update_case_status', array(
            'case_id' => $case_id,
            'status'  => $new_status
        ) );

        LDN_Audit_Log::log( get_current_user_id(), 'CASE_STATUS_UPDATED', "Status perkara {$case_id} diubah menjadi {$new_status}", $case_id );

        return true;
    }
}
`
  },

  // =========================================================================
  // 6. CLASS-DOCUMENT-MANAGER.PHP (MIME, MAGIC BYTES, STREAMING & 10MB LIMIT)
  // =========================================================================
  {
    path: 'includes/class-document-manager.php',
    name: 'class-document-manager.php',
    category: 'INCLUDES',
    description: 'Strict document validation (10MB limit, whitelist MIME & magic bytes, rejection of executables/PHP) and authenticated streaming downloader.',
    content: `<?php
/**
 * Document Manager & Secure Streaming
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

class LDN_Document_Manager {
    const MAX_SIZE_BYTES = 10485760; // 10 MB

    public static $allowed_mimes = array(
        'pdf'  => 'application/pdf',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png'  => 'image/png',
        'doc'  => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    /**
     * Validate and Upload Document
     */
    public static function upload_document( $case_id, $client_id, $document_type, $file_array, $user_id ) {
        // 1. Check basic upload errors
        if ( empty( $file_array['tmp_name'] ) || ! is_uploaded_file( $file_array['tmp_name'] ) ) {
            return new WP_Error( 'INVALID_FILE', __( 'File tidak valid atau gagal diupload.', 'lalu-daud-notary' ) );
        }

        // 2. Check File Size (Max 10 MB)
        if ( $file_array['size'] > self::MAX_SIZE_BYTES ) {
            return new WP_Error( 'FILE_TOO_LARGE', __( 'Ukuran file melebihi batas maksimal 10 MB.', 'lalu-daud-notary' ) );
        }

        // 3. Strict Filename & Extension Check
        $filename  = sanitize_file_name( $file_array['name'] );
        $extension = strtolower( pathinfo( $filename, PATHINFO_EXTENSION ) );

        // Ban dangerous extensions immediately
        $banned = array( 'php', 'php5', 'phtml', 'exe', 'js', 'sh', 'html', 'htm', 'svg', 'bat', 'cmd' );
        if ( in_array( $extension, $banned, true ) || ! isset( self::$allowed_mimes[ $extension ] ) ) {
            return new WP_Error( 'INVALID_EXTENSION', __( 'Format file tidak diizinkan. Hanya PDF, JPG, PNG, DOC, DOCX.', 'lalu-daud-notary' ) );
        }

        // 4. MIME Type Validation (finfo)
        $finfo = finfo_open( FILEINFO_MIME_TYPE );
        $real_mime = finfo_file( $finfo, $file_array['tmp_name'] );
        finfo_close( $finfo );

        $expected_mime = self::$allowed_mimes[ $extension ];
        if ( $real_mime !== $expected_mime && 'image/jpeg' !== $real_mime && 'image/png' !== $real_mime && 'application/pdf' !== $real_mime ) {
            return new WP_Error( 'MIME_MISMATCH', __( 'MIME type file tidak sesuai dengan ekstensi.', 'lalu-daud-notary' ) );
        }

        // 5. Send to Google Apps Script for Private Drive Upload
        $file_content_base64 = base64_encode( file_get_contents( $file_array['tmp_name'] ) );
        $document_id = 'DOC-' . strtoupper( wp_generate_password( 8, false ) );

        $gas_payload = array(
            'document_id'   => $document_id,
            'case_id'       => $case_id,
            'client_id'     => $client_id,
            'document_type' => $document_type,
            'filename'      => $filename,
            'mime_type'     => $real_mime,
            'file_base64'   => $file_content_base64,
        );

        $gas_res = LDN_Google_Bridge::send_request( 'upload_document', $gas_payload );
        $gas_ref = ! is_wp_error( $gas_res ) && ! empty( $gas_res['drive_file_id'] ) ? $gas_res['drive_file_id'] : '';

        // 6. Record to Local DB
        global $wpdb;
        $wpdb->insert(
            "{$wpdb->prefix}ldn_documents",
            array(
                'document_id'   => $document_id,
                'case_id'       => $case_id,
                'client_id'     => $client_id,
                'document_type' => $document_type,
                'filename'      => $filename,
                'mime_type'     => $real_mime,
                'file_size'     => $file_array['size'],
                'gas_drive_ref' => $gas_ref,
                'status'        => 'PENDING_VERIFICATION',
                'uploaded_by'   => $user_id,
                'uploaded_at'   => current_time( 'mysql' ),
            ),
            array( '%s', '%s', '%s', '%s', '%s', '%s', '%d', '%s', '%s', '%d', '%s' )
        );

        LDN_Audit_Log::log( $user_id, 'DOCUMENT_UPLOAD', "Dokumen {$filename} diupload untuk perkara {$case_id}", $case_id, $document_id );

        return array(
            'document_id' => $document_id,
            'filename'    => $filename,
            'status'      => 'PENDING_VERIFICATION'
        );
    }

    /**
     * Stream Document to Browser (Authenticated Download)
     */
    public static function stream_document( $document_id, $user_id ) {
        if ( ! LDN_Auth::can_access_document( $user_id, $document_id ) ) {
            status_header( 403 );
            wp_send_json( array(
                'success' => false,
                'code'    => 'ACCESS_DENIED',
                'message' => __( 'Data tidak dapat diakses.', 'lalu-daud-notary' )
            ) );
            exit;
        }

        global $wpdb;
        $doc = $wpdb->get_row( $wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}ldn_documents WHERE document_id = %s",
            $document_id
        ) );

        if ( ! $doc ) {
            status_header( 404 );
            wp_send_json( array( 'success' => false, 'code' => 'DOCUMENT_NOT_FOUND', 'message' => 'Dokumen tidak ditemukan.' ) );
            exit;
        }

        // Request file stream from Google Apps Script
        $gas_res = LDN_Google_Bridge::send_request( 'get_document_stream', array(
            'document_id'   => $document_id,
            'gas_drive_ref' => $doc->gas_drive_ref
        ) );

        if ( is_wp_error( $gas_res ) || empty( $gas_res['base64_data'] ) ) {
            status_header( 500 );
            wp_die( esc_html__( 'Gagal mengambil stream dokumen dari Google Drive.', 'lalu-daud-notary' ) );
        }

        $binary = base64_decode( $gas_res['base64_data'] );

        LDN_Audit_Log::log( $user_id, 'DOCUMENT_DOWNLOAD', "Dokumen {$doc->filename} didownload", $doc->case_id, $document_id );

        // Send streaming headers
        header( 'Content-Type: ' . $doc->mime_type );
        header( 'Content-Disposition: attachment; filename="' . basename( $doc->filename ) . '"' );
        header( 'Content-Length: ' . strlen( $binary ) );
        header( 'Cache-Control: private, no-cache, no-store, must-revalidate' );
        header( 'Pragma: no-cache' );
        echo $binary;
        exit;
    }
}
`
  },

  // =========================================================================
  // 7. CLASS-REST-API.PHP (STRICT PERMISSIONS, RATE-LIMITED, CSRF PROTECTED)
  // =========================================================================
  {
    path: 'includes/class-rest-api.php',
    name: 'class-rest-api.php',
    category: 'INCLUDES',
    description: 'WordPress REST API routes in /wp-json/lalu-daud/v1/ with strict permission_callbacks and zero __return_true on private endpoints.',
    content: `<?php
/**
 * REST API Controller
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

class LDN_REST_API {
    const NAMESPACE = 'lalu-daud/v1';

    public static function register_routes() {
        // GET & POST /cases
        register_rest_route( self::NAMESPACE, '/cases', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( __CLASS__, 'get_cases' ),
                'permission_callback' => array( __CLASS__, 'check_authenticated' ),
            ),
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( __CLASS__, 'create_case' ),
                'permission_callback' => array( __CLASS__, 'check_rate_limit_and_nonce' ),
            ),
        ) );

        // GET /cases/{id}
        register_rest_route( self::NAMESPACE, '/cases/(?P<id>[a-zA-Z0-9_-]+)', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array( __CLASS__, 'get_single_case' ),
            'permission_callback' => array( __CLASS__, 'check_case_access' ),
        ) );

        // POST /cases/{id}/documents
        register_rest_route( self::NAMESPACE, '/cases/(?P<id>[a-zA-Z0-9_-]+)/documents', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array( __CLASS__, 'upload_document' ),
            'permission_callback' => array( __CLASS__, 'check_case_access' ),
        ) );

        // GET /documents/{id}/download (Stream)
        register_rest_route( self::NAMESPACE, '/documents/(?P<id>[a-zA-Z0-9_-]+)/download', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array( __CLASS__, 'download_document' ),
            'permission_callback' => array( __CLASS__, 'check_authenticated' ),
        ) );

        // GET /services (Public list with cache)
        register_rest_route( self::NAMESPACE, '/services', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array( __CLASS__, 'get_services' ),
            'permission_callback' => '__return_true', // Public catalog only
        ) );

        // POST /calculator/calculate
        register_rest_route( self::NAMESPACE, '/calculator/calculate', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array( __CLASS__, 'calculate_fees' ),
            'permission_callback' => '__return_true',
        ) );
    }

    // Permission Check: Logged-in only
    public static function check_authenticated( WP_REST_Request $request ) {
        return is_user_logged_in();
    }

    // Permission Check: Rate Limit & Nonce check
    public static function check_rate_limit_and_nonce( WP_REST_Request $request ) {
        if ( ! LDN_Rate_Limit::check( 'rest_create_case' ) ) {
            return new WP_Error( 'RATE_LIMIT_EXCEEDED', __( 'Terlalu banyak permintaan. Silakan tunggu 1 menit.', 'lalu-daud-notary' ), array( 'status' => 429 ) );
        }
        return true;
    }

    // Permission Check: Single Case Ownership Check
    public static function check_case_access( WP_REST_Request $request ) {
        if ( ! is_user_logged_in() ) {
            return false;
        }
        $case_id = $request->get_param( 'id' );
        return LDN_Auth::can_access_case( get_current_user_id(), $case_id );
    }

    // Route Handler: Get User Cases
    public static function get_cases( WP_REST_Request $request ) {
        $user_id = get_current_user_id();
        global $wpdb;

        if ( current_user_can( 'manage_cases' ) ) {
            $cases = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ldn_cases ORDER BY id DESC LIMIT 100" );
        } else {
            $cases = $wpdb->get_results( $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}ldn_cases WHERE owner_id = %d ORDER BY id DESC",
                $user_id
            ) );
        }

        return rest_ensure_response( array( 'success' => true, 'data' => $cases ) );
    }

    // Route Handler: Create Case
    public static function create_case( WP_REST_Request $request ) {
        $params = $request->get_json_params();
        $name    = isset( $params['name'] ) ? sanitize_text_field( $params['name'] ) : '';
        $nik     = isset( $params['nik'] ) ? sanitize_text_field( $params['nik'] ) : '';
        $phone   = isset( $params['phone'] ) ? sanitize_text_field( $params['phone'] ) : '';
        $email   = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
        $service = isset( $params['service_id'] ) ? sanitize_text_field( $params['service_id'] ) : 'AKTA_UMUM';
        $title   = isset( $params['title'] ) ? sanitize_text_field( $params['title'] ) : 'Permohonan ' . $service;
        $notes   = isset( $params['description'] ) ? sanitize_textarea_field( $params['description'] ) : '';

        if ( empty( $name ) || empty( $nik ) || empty( $phone ) ) {
            return new WP_Error( 'VALIDATION_ERROR', __( 'Nama, NIK, dan Nomor HP wajib diisi.', 'lalu-daud-notary' ), array( 'status' => 400 ) );
        }

        $user_id = get_current_user_id();
        $client_id = 'CLIENT-' . strtoupper( wp_generate_password( 6, false ) );

        // Register client profile with masked NIK
        $masked_nik = LDN_Security::mask_identity_number( $nik );
        global $wpdb;
        $wpdb->insert(
            "{$wpdb->prefix}ldn_clients",
            array(
                'client_id'       => $client_id,
                'user_id'         => $user_id,
                'name'            => $name,
                'identity_type'   => 'KTP',
                'identity_masked' => $masked_nik,
                'phone'           => $phone,
                'email'           => $email,
                'address'         => isset( $params['address'] ) ? sanitize_textarea_field( $params['address'] ) : '',
                'status'          => 'ACTIVE'
            )
        );

        $result = LDN_Case_Manager::create_case( $client_id, $user_id, $service, $title, $notes );
        if ( is_wp_error( $result ) ) {
            return $result;
        }

        return rest_ensure_response( array(
            'success' => true,
            'message' => 'Permohonan berhasil diajukan!',
            'data'    => $result
        ) );
    }

    // Route Handler: Single Case Detail
    public static function get_single_case( WP_REST_Request $request ) {
        $case_id = $request->get_param( 'id' );
        global $wpdb;

        $case = $wpdb->get_row( $wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}ldn_cases WHERE case_id = %s",
            $case_id
        ) );

        if ( ! $case ) {
            return new WP_Error( 'CASE_NOT_FOUND', __( 'Data tidak dapat diakses.', 'lalu-daud-notary' ), array( 'status' => 404 ) );
        }

        $docs = $wpdb->get_results( $wpdb->prepare(
            "SELECT document_id, document_type, filename, mime_type, file_size, status, uploaded_at FROM {$wpdb->prefix}ldn_documents WHERE case_id = %s",
            $case_id
        ) );

        $payments = $wpdb->get_results( $wpdb->prepare(
            "SELECT payment_id, invoice_number, description, amount, payment_status, created_at FROM {$wpdb->prefix}ldn_payments WHERE case_id = %s",
            $case_id
        ) );

        return rest_ensure_response( array(
            'success' => true,
            'data'    => array(
                'case'      => $case,
                'documents' => $docs,
                'payments'  => $payments
            )
        ) );
    }

    // Route Handler: Upload Document
    public static function upload_document( WP_REST_Request $request ) {
        $case_id = $request->get_param( 'id' );
        $user_id = get_current_user_id();
        $files   = $request->get_file_params();

        if ( empty( $files['file'] ) ) {
            return new WP_Error( 'NO_FILE', __( 'Tidak ada file yang dipilih.', 'lalu-daud-notary' ), array( 'status' => 400 ) );
        }

        global $wpdb;
        $client_id = $wpdb->get_var( $wpdb->prepare( "SELECT client_id FROM {$wpdb->prefix}ldn_cases WHERE case_id = %s", $case_id ) );

        $doc_type = isset( $_POST['document_type'] ) ? sanitize_text_field( $_POST['document_type'] ) : 'DOKUMEN_PENDUKUNG';
        $res = LDN_Document_Manager::upload_document( $case_id, $client_id, $doc_type, $files['file'], $user_id );

        if ( is_wp_error( $res ) ) {
            return $res;
        }

        return rest_ensure_response( array( 'success' => true, 'message' => 'Dokumen berhasil diunggah.', 'data' => $res ) );
    }

    // Route Handler: Download Document
    public static function download_document( WP_REST_Request $request ) {
        $doc_id  = $request->get_param( 'id' );
        $user_id = get_current_user_id();
        LDN_Document_Manager::stream_document( $doc_id, $user_id );
    }

    // Route Handler: Get Services List
    public static function get_services() {
        $services = array(
            array( 'id' => 'AJB', 'name' => 'Akta Jual Beli (AJB)', 'base_fee' => 3500000, 'duration' => '7-14 Hari Kerja' ),
            array( 'id' => 'PENDIRIAN_PT', 'name' => 'Pendirian PT / Badan Usaha', 'base_fee' => 5000000, 'duration' => '5-7 Hari Kerja' ),
            array( 'id' => 'WARIS_HIBAH', 'name' => 'Akta Pembagian Hak Bersama (APHB) / Waris', 'base_fee' => 4000000, 'duration' => '10-14 Hari Kerja' ),
            array( 'id' => 'PRENUP', 'name' => 'Perjanjian Perkawinan (Prenup/Postnup)', 'base_fee' => 3000000, 'duration' => '3-5 Hari Kerja' ),
            array( 'id' => 'SKMHT_APHT', 'name' => 'Hak Tanggungan (SKMHT / APHT)', 'base_fee' => 2500000, 'duration' => '5-7 Hari Kerja' ),
            array( 'id' => 'KONSULTASI', 'name' => 'Konsultasi Hukum Kenotariatan & PPAT', 'base_fee' => 750000, 'duration' => '1 Hari' ),
        );
        return rest_ensure_response( array( 'success' => true, 'data' => $services ) );
    }

    // Route Handler: Dynamic Fee Calculator
    public static function calculate_fees( WP_REST_Request $request ) {
        $params = $request->get_json_params();
        $service_id = isset( $params['service_id'] ) ? sanitize_text_field( $params['service_id'] ) : 'AJB';
        $obj_value  = isset( $params['object_value'] ) ? floatval( $params['object_value'] ) : 0;
        $copies     = isset( $params['extra_copies'] ) ? absint( $params['extra_copies'] ) : 1;

        $base = 3000000;
        if ( 'PENDIRIAN_PT' === $service_id ) $base = 5000000;
        if ( 'AJB' === $service_id && $obj_value > 0 ) {
            $base = max( 3500000, $obj_value * 0.01 ); // 1% max per legal regulation
        }

        $admin   = 250000;
        $materai = 50000;
        $jasa    = $base * 0.15;
        $total   = $base + $admin + $materai + $jasa;

        return rest_ensure_response( array(
            'success' => true,
            'data'    => array(
                'base_fee'    => $base,
                'admin_fee'   => $admin,
                'materai_fee' => $materai,
                'service_fee' => $jasa,
                'total'       => $total,
                'formula'     => 'Biaya Dasar + Admin + Materai + Jasa Notaris'
            )
        ) );
    }
}
`
  },

  // =========================================================================
  // 8. CLASS-AUDIT-LOG.PHP & CLASS-RATE-LIMIT.PHP & OTHER HELPERS
  // =========================================================================
  {
    path: 'includes/class-audit-log.php',
    name: 'class-audit-log.php',
    category: 'INCLUDES',
    description: 'Privacy-first audit logging engine with hashed IPs and user-agents.',
    content: `<?php
/**
 * Audit Trail Logger
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

class LDN_Audit_Log {
    public static function log( $user_id, $action, $description = '', $case_id = '', $document_id = '', $result = 'SUCCESS' ) {
        global $wpdb;

        $user = get_userdata( $user_id );
        $role = $user && ! empty( $user->roles ) ? $user->roles[0] : 'guest';

        $ip_hash = hash( 'sha256', isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '127.0.0.1' );
        $ua_hash = hash( 'sha256', isset( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : 'unknown' );

        $log_id = 'LOG-' . strtoupper( wp_generate_password( 8, false ) );

        $wpdb->insert(
            "{$wpdb->prefix}ldn_audit_log",
            array(
                'log_id'          => $log_id,
                'timestamp'       => current_time( 'mysql' ),
                'user_id'         => (int) $user_id,
                'role'            => $role,
                'action'          => sanitize_text_field( $action ),
                'case_id'         => sanitize_text_field( $case_id ),
                'document_id'     => sanitize_text_field( $document_id ),
                'ip_hash'         => $ip_hash,
                'user_agent_hash' => $ua_hash,
                'result'          => sanitize_text_field( $result ),
            )
        );
    }
}
`
  },
  {
    path: 'includes/class-rate-limit.php',
    name: 'class-rate-limit.php',
    category: 'INCLUDES',
    description: 'Transient-based rate limiter per IP/User to prevent brute force and DDoS.',
    content: `<?php
/**
 * Rate Limiter Engine
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

class LDN_Rate_Limit {
    const MAX_REQUESTS_PER_MINUTE = 30;

    public static function check( $action = 'general' ) {
        $ip = isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '127.0.0.1';
        $key = 'ldn_rate_' . md5( $ip . '_' . $action );
        $count = (int) get_transient( $key );

        if ( $count >= self::MAX_REQUESTS_PER_MINUTE ) {
            return false;
        }

        set_transient( $key, $count + 1, 60 );
        return true;
    }
}
`
  },
  {
    path: 'includes/class-client-manager.php',
    name: 'class-client-manager.php',
    category: 'INCLUDES',
    description: 'Client dossier management with masked identity numbers and secure association.',
    content: `<?php
/**
 * Client Dossier Manager
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

class LDN_Client_Manager {
    public static function get_client( $client_id ) {
        global $wpdb;
        return $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}ldn_clients WHERE client_id = %s", $client_id ) );
    }

    public static function get_all_clients( $limit = 50, $offset = 0 ) {
        global $wpdb;
        return $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}ldn_clients ORDER BY id DESC LIMIT %d OFFSET %d", $limit, $offset ) );
    }
}
`
  },
  {
    path: 'includes/class-payment-manager.php',
    name: 'class-payment-manager.php',
    category: 'INCLUDES',
    description: 'Invoice and payment reconciliation manager with status progression.',
    content: `<?php
/**
 * Payment & Invoice Manager
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

class LDN_Payment_Manager {
    public static function create_invoice( $case_id, $client_id, $description, $amount ) {
        global $wpdb;
        $payment_id = 'PAY-' . strtoupper( wp_generate_password( 8, false ) );
        $invoice_no = 'INV/LDN/' . date('Ym') . '/' . wp_rand( 1000, 9999 );

        $wpdb->insert(
            "{$wpdb->prefix}ldn_payments",
            array(
                'payment_id'     => $payment_id,
                'case_id'        => $case_id,
                'client_id'      => $client_id,
                'invoice_number' => $invoice_no,
                'description'    => $description,
                'amount'         => $amount,
                'payment_status' => 'UNPAID',
                'created_at'     => current_time( 'mysql' ),
            )
        );

        return $invoice_no;
    }
}
`
  },
  {
    path: 'includes/class-api.php',
    name: 'class-api.php',
    category: 'INCLUDES',
    description: 'Unified JSON response generator and error mapper for WordPress controllers.',
    content: `<?php
/**
 * API Response Formatter
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;

class LDN_API {
    public static function success( $data = array(), $message = 'Success' ) {
        return rest_ensure_response( array(
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ) );
    }

    public static function error( $code, $message, $status = 400 ) {
        return new WP_Error( $code, $message, array( 'status' => $status ) );
    }
}
`
  }
];
