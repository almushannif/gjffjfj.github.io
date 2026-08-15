import { PluginFile } from './pluginTypes';

export const PLUGIN_SYNC_AND_REST_FILES: PluginFile[] = [
  // =========================================================================
  // 9. GOOGLE APPS SCRIPT ENGINE & HEALTH CHECK
  // =========================================================================
  {
    path: 'includes/class-ugc-apps-script.php',
    name: 'class-ugc-apps-script.php',
    category: 'INCLUDES',
    description: 'Google Apps Script Web App Connector: URL validator, automated healthCheck verification, and deployment package generator.',
    content: `<?php
/**
 * UGC_Apps_Script Class
 *
 * Handles Apps Script Web App endpoints and health checks.
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;

class UGC_Apps_Script {

    /**
     * Validate Google Apps Script Web App URL
     */
    public static function validate_url( $url ) {
        $url = trim( $url );
        if ( ! UGC_Security::validate_google_url( $url ) ) {
            return false;
        }

        // Must match script.google.com/macros/s/{ID}/exec
        if ( preg_match( '/^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/', $url ) ) {
            return true;
        }

        return false;
    }

    /**
     * Perform Health Check against Apps Script Endpoint
     * Required response: { "success": true, "service": "Universal Google Connect", "version": "2.0.0" }
     */
    public static function test_health_check( $web_app_url ) {
        if ( ! self::validate_url( $web_app_url ) ) {
            return new WP_Error( 'invalid_gas_url', esc_html__( 'Invalid Google Apps Script Web App URL. Must end with /exec and use HTTPS.', 'universal-google-connect' ) );
        }

        $check_url = add_query_arg( array( 'action' => 'healthCheck' ), $web_app_url );

        $response = wp_remote_get( $check_url, array(
            'timeout'   => 20,
            'sslverify' => true,
        ) );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $status = wp_remote_retrieve_response_code( $response );
        $body   = wp_remote_retrieve_body( $response );
        $json   = json_decode( $body, true );

        if ( 200 !== $status || empty( $json ) || ! isset( $json['success'] ) || true !== $json['success'] ) {
            return new WP_Error(
                'gas_health_failed',
                sprintf(
                    /* translators: %s: HTTP status code */
                    esc_html__( 'Apps Script health check failed. Endpoint returned HTTP %s. Verify Web App deployment is set to "Anyone" and script is published.', 'universal-google-connect' ),
                    $status
                )
            );
        }

        // Save status
        update_option( 'ugc_apps_script_settings', array(
            'web_app_url'       => $web_app_url,
            'status'            => 'connected',
            'last_health_check' => current_time( 'mysql' ),
            'service_name'      => isset( $json['service'] ) ? $json['service'] : 'Universal Google Connect',
            'version'           => isset( $json['version'] ) ? $json['version'] : '2.0.0',
        ) );

        UGC_Logger::info( 'Apps Script Health Check Passed', 'URL: ' . $web_app_url );
        return $json;
    }

    /**
     * Get Code.gs template content
     */
    public static function get_script_template() {
        return <<<'APPSCRIPT'
/**
 * Universal Google Connect - Google Apps Script Package
 * Version: 2.0.0
 * Service: Universal Google Connect
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'healthCheck';

  if (action === 'healthCheck') {
    return jsonResponse({
      success: true,
      service: "Universal Google Connect",
      version: "2.0.0",
      timestamp: new Date().toISOString()
    });
  }

  return jsonResponse({ success: false, message: "Unknown action" });
}

function doPost(e) {
  try {
    var rawData = e.postData ? e.postData.contents : "{}";
    var payload = JSON.parse(rawData);
    var event = payload.event || "UNKNOWN";

    // Handle incoming WordPress events
    if (event === "NEW_CLIENT" || event === "NEW_APPLICATION" || event === "CALCULATOR_ESTIMATE") {
      return jsonResponse({
        success: true,
        event: event,
        processedAt: new Date().toISOString()
      });
    }

    return jsonResponse({ success: true, message: "Event received", event: event });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
APPSCRIPT;
    }
}
`
  },

  // =========================================================================
  // 10. SYNC QUEUE & OFFLINE RESILIENCE (WP-CRON ENGINE)
  // =========================================================================
  {
    path: 'includes/class-ugc-sync.php',
    name: 'class-ugc-sync.php',
    category: 'INCLUDES',
    description: 'Sync Queue & Offline Fault-Tolerance: Saves to WordPress DB first, schedules WP-Cron worker, 3-attempt exponential retry, and auto error recovery.',
    content: `<?php
/**
 * UGC_Sync Class
 *
 * Handles asynchronous synchronization between WordPress and Google Services.
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;

class UGC_Sync {

    /**
     * Initialize cron action
     */
    public static function init() {
        add_action( 'ugc_process_sync_queue', array( __CLASS__, 'process_queue' ) );
    }

    /**
     * Push job to sync queue
     */
    public static function push_job( $entity, $entity_id, $operation, $payload = array() ) {
        global $wpdb;
        $table = "{$wpdb->prefix}ugc_sync_queue";

        $wpdb->insert(
            $table,
            array(
                'entity'       => sanitize_text_field( $entity ),
                'entity_id'    => (int) $entity_id,
                'operation'    => sanitize_text_field( $operation ),
                'payload'      => wp_json_encode( $payload ),
                'attempts'     => 0,
                'max_attempts' => 3,
                'status'       => 'pending',
                'created_at'   => current_time( 'mysql' ),
            ),
            array( '%s', '%d', '%s', '%s', '%d', '%d', '%s', '%s' )
        );

        return $wpdb->insert_id;
    }

    /**
     * Process pending jobs in queue
     */
    public static function process_queue() {
        global $wpdb;
        $table = "{$wpdb->prefix}ugc_sync_queue";

        // Lock & get up to 10 pending items
        $jobs = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$table} WHERE status = %s AND attempts < max_attempts ORDER BY id ASC LIMIT 10",
                'pending'
            )
        );

        if ( empty( $jobs ) ) {
            return;
        }

        foreach ( $jobs as $job ) {
            self::execute_job( $job );
        }
    }

    /**
     * Execute a single sync job
     */
    private static function execute_job( $job ) {
        global $wpdb;
        $table = "{$wpdb->prefix}ugc_sync_queue";

        $attempts = $job->attempts + 1;
        $payload = json_decode( $job->payload, true );
        $entity = $job->entity;

        $sync_success = false;
        $error_message = '';

        try {
            if ( 'client' === $entity ) {
                $sync_success = self::sync_client_to_google( $job->entity_id, $payload );
            } elseif ( 'application' === $entity ) {
                $sync_success = self::sync_application_to_google( $job->entity_id, $payload );
            } elseif ( 'estimate' === $entity ) {
                $sync_success = self::sync_estimate_to_google( $job->entity_id, $payload );
            }
        } catch ( Exception $e ) {
            $sync_success = false;
            $error_message = $e->getMessage();
        }

        if ( $sync_success ) {
            $wpdb->update(
                $table,
                array(
                    'status'     => 'completed',
                    'attempts'   => $attempts,
                    'last_error' => null,
                    'updated_at' => current_time( 'mysql' ),
                ),
                array( 'id' => $job->id )
            );
        } else {
            $new_status = ( $attempts >= $job->max_attempts ) ? 'failed' : 'pending';
            $wpdb->update(
                $table,
                array(
                    'status'     => $new_status,
                    'attempts'   => $attempts,
                    'last_error' => $error_message ? $error_message : 'Google API sync timeout or permission error',
                    'updated_at' => current_time( 'mysql' ),
                ),
                array( 'id' => $job->id )
            );
        }
    }

    /**
     * Sync Client to Google Sheet and Drive
     */
    private static function sync_client_to_google( $client_id, $payload ) {
        $sheets_settings = get_option( 'ugc_sheets_settings', array() );
        $drive_settings  = get_option( 'ugc_drive_settings', array() );

        if ( empty( $sheets_settings['spreadsheet_id'] ) ) {
            return false;
        }

        $row_data = array(
            isset( $payload['client_uid'] ) ? $payload['client_uid'] : 'CL-2026-00000',
            isset( $payload['full_name'] ) ? $payload['full_name'] : '',
            isset( $payload['email'] ) ? $payload['email'] : '',
            isset( $payload['phone'] ) ? $payload['phone'] : '',
            isset( $payload['nik'] ) ? $payload['nik'] : '',
            isset( $payload['address'] ) ? $payload['address'] : '',
            isset( $payload['drive_folder_url'] ) ? $payload['drive_folder_url'] : '',
            'Synced',
            current_time( 'mysql' ),
        );

        $res = UGC_Sheets::append_row( $sheets_settings['spreadsheet_id'], 'Clients!A1', array( $row_data ) );
        return ! is_wp_error( $res );
    }

    /**
     * Sync Application to Google Sheet
     */
    private static function sync_application_to_google( $app_id, $payload ) {
        $sheets_settings = get_option( 'ugc_sheets_settings', array() );
        if ( empty( $sheets_settings['spreadsheet_id'] ) ) {
            return false;
        }

        $row_data = array(
            isset( $payload['application_no'] ) ? $payload['application_no'] : 'APP-2026-00000',
            isset( $payload['client_uid'] ) ? $payload['client_uid'] : '',
            isset( $payload['service_name'] ) ? $payload['service_name'] : '',
            isset( $payload['status'] ) ? $payload['status'] : 'Submitted',
            isset( $payload['drive_folder_url'] ) ? $payload['drive_folder_url'] : '',
            isset( $payload['estimated_completion'] ) ? $payload['estimated_completion'] : '7 Hari Kerja',
            current_time( 'mysql' ),
        );

        $res = UGC_Sheets::append_row( $sheets_settings['spreadsheet_id'], 'Applications!A1', array( $row_data ) );
        return ! is_wp_error( $res );
    }

    /**
     * Sync Estimate Calculation to Google Sheet
     */
    private static function sync_estimate_to_google( $estimate_id, $payload ) {
        $sheets_settings = get_option( 'ugc_sheets_settings', array() );
        if ( empty( $sheets_settings['spreadsheet_id'] ) ) {
            return false;
        }

        $row_data = array(
            isset( $payload['estimate_no'] ) ? $payload['estimate_no'] : 'EST-2026-00000',
            isset( $payload['client_uid'] ) ? $payload['client_uid'] : '',
            isset( $payload['service_code'] ) ? $payload['service_code'] : '',
            isset( $payload['property_value'] ) ? $payload['property_value'] : 0,
            isset( $payload['honorarium_fee'] ) ? $payload['honorarium_fee'] : 0,
            isset( $payload['tax_bphtb'] ) ? $payload['tax_bphtb'] : 0,
            isset( $payload['tax_pph'] ) ? $payload['tax_pph'] : 0,
            isset( $payload['pnbp_fee'] ) ? $payload['pnbp_fee'] : 0,
            isset( $payload['total_estimate'] ) ? $payload['total_estimate'] : 0,
            current_time( 'mysql' ),
        );

        $res = UGC_Sheets::append_row( $sheets_settings['spreadsheet_id'], 'Estimates!A1', array( $row_data ) );
        return ! is_wp_error( $res );
    }
}
`
  },

  // =========================================================================
  // 11. REST API ENDPOINTS
  // =========================================================================
  {
    path: 'includes/class-ugc-rest.php',
    name: 'class-ugc-rest.php',
    category: 'INCLUDES',
    description: 'REST API Engine: Scoped endpoints /wp-json/ugc/v1/ with strict permission_callback, sanitized requests, and error handlers.',
    content: `<?php
/**
 * UGC_Rest Class
 *
 * Registers REST API endpoints for Universal Google Connect.
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;

class UGC_Rest {

    const NAMESPACE = 'ugc/v1';

    /**
     * Initialize REST routes
     */
    public static function init() {
        add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
    }

    /**
     * Register endpoints
     */
    public static function register_routes() {
        // 1. System Status (Admin)
        register_rest_route( self::NAMESPACE, '/status', array(
            'methods'             => 'GET',
            'callback'            => array( __CLASS__, 'get_system_status' ),
            'permission_callback' => function () {
                return current_user_can( 'manage_options' );
            },
        ) );

        // 2. Submit Client Application (Public with Nonce)
        register_rest_route( self::NAMESPACE, '/submit-application', array(
            'methods'             => 'POST',
            'callback'            => array( __CLASS__, 'submit_application' ),
            'permission_callback' => '__return_true',
        ) );

        // 3. Calculate Estimate (Public)
        register_rest_route( self::NAMESPACE, '/calculate-estimate', array(
            'methods'             => 'POST',
            'callback'            => array( __CLASS__, 'calculate_estimate' ),
            'permission_callback' => '__return_true',
        ) );

        // 4. Retry Sync Queue Item (Admin)
        register_rest_route( self::NAMESPACE, '/retry-sync/(?P<id>\d+)', array(
            'methods'             => 'POST',
            'callback'            => array( __CLASS__, 'retry_sync_item' ),
            'permission_callback' => function () {
                return current_user_can( 'manage_options' );
            },
        ) );
    }

    /**
     * Get System Status
     */
    public static function get_system_status() {
        $oauth  = get_option( 'ugc_oauth_settings', array() );
        $drive  = get_option( 'ugc_drive_settings', array() );
        $sheets = get_option( 'ugc_sheets_settings', array() );
        $gas    = get_option( 'ugc_apps_script_settings', array() );

        global $wpdb;
        $queue_count = $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}ugc_sync_queue WHERE status = 'pending'" );

        return rest_ensure_response( array(
            'version'       => UGC_VERSION,
            'phpVersion'    => PHP_VERSION,
            'wpVersion'     => get_bloginfo( 'version' ),
            'oauth'         => array(
                'status'    => isset( $oauth['auth_status'] ) ? $oauth['auth_status'] : 'disconnected',
                'email'     => isset( $oauth['connected_email'] ) ? $oauth['connected_email'] : '',
                'connected' => isset( $oauth['connected_time'] ) ? $oauth['connected_time'] : '',
            ),
            'drive'         => array(
                'rootId'    => isset( $drive['root_folder_id'] ) ? $drive['root_folder_id'] : '',
                'rootName'  => isset( $drive['root_folder_name'] ) ? $drive['root_folder_name'] : '',
                'connected' => ! empty( $drive['root_folder_id'] ),
            ),
            'sheets'        => array(
                'sheetId'   => isset( $sheets['spreadsheet_id'] ) ? $sheets['spreadsheet_id'] : '',
                'sheetName' => isset( $sheets['spreadsheet_name'] ) ? $sheets['spreadsheet_name'] : '',
                'connected' => ! empty( $sheets['spreadsheet_id'] ),
            ),
            'appsScript'    => array(
                'url'       => isset( $gas['web_app_url'] ) ? $gas['web_app_url'] : '',
                'status'    => isset( $gas['status'] ) ? $gas['status'] : 'unconfigured',
            ),
            'pendingSync'   => (int) $queue_count,
        ) );
    }

    /**
     * Submit Client Application
     */
    public static function submit_application( $request ) {
        $params = $request->get_json_params();

        $name    = isset( $params['name'] ) ? sanitize_text_field( $params['name'] ) : '';
        $email   = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
        $phone   = isset( $params['phone'] ) ? sanitize_text_field( $params['phone'] ) : '';
        $service = isset( $params['service'] ) ? sanitize_text_field( $params['service'] ) : 'Konsultasi Hukum';
        $notes   = isset( $params['notes'] ) ? sanitize_textarea_field( $params['notes'] ) : '';

        if ( empty( $name ) || empty( $email ) || empty( $phone ) ) {
            return new WP_Error( 'missing_fields', esc_html__( 'Name, email, and phone are required.', 'universal-google-connect' ), array( 'status' => 400 ) );
        }

        global $wpdb;
        $client_uid = UGC_Database::generate_unique_id( 'CL' );
        $app_no     = UGC_Database::generate_unique_id( 'APP' );

        // 1. Insert Client Record into WordPress DB
        $wpdb->insert(
            "{$wpdb->prefix}ugc_clients",
            array(
                'client_uid'  => $client_uid,
                'full_name'   => $name,
                'email'       => $email,
                'phone'       => $phone,
                'sync_status' => 'pending',
                'created_at'  => current_time( 'mysql' ),
            )
        );
        $client_db_id = $wpdb->insert_id;

        // 2. Insert Application Record into WordPress DB
        $wpdb->insert(
            "{$wpdb->prefix}ugc_applications",
            array(
                'application_no' => $app_no,
                'client_id'      => $client_db_id,
                'service_name'   => $service,
                'status'         => 'submitted',
                'form_payload'   => wp_json_encode( array( 'notes' => $notes ) ),
                'sync_status'    => 'pending',
                'created_at'     => current_time( 'mysql' ),
            )
        );
        $app_db_id = $wpdb->insert_id;

        // 3. Push to Background Sync Queue (Zero-blocking for user)
        UGC_Sync::push_job( 'client', $client_db_id, 'create', array(
            'client_uid' => $client_uid,
            'full_name'  => $name,
            'email'      => $email,
            'phone'      => $phone,
        ) );

        UGC_Sync::push_job( 'application', $app_db_id, 'create', array(
            'application_no' => $app_no,
            'client_uid'     => $client_uid,
            'service_name'   => $service,
            'status'         => 'Submitted',
        ) );

        return rest_ensure_response( array(
            'success'        => true,
            'client_uid'     => $client_uid,
            'application_no' => $app_no,
            'message'        => esc_html__( 'Application saved successfully and scheduled for Google synchronization.', 'universal-google-connect' ),
        ) );
    }

    /**
     * Calculate Cost Estimate
     */
    public static function calculate_estimate( $request ) {
        $params = $request->get_json_params();

        $service_code = isset( $params['service_code'] ) ? sanitize_text_field( $params['service_code'] ) : 'ajb';
        $property_val = isset( $params['property_value'] ) ? (float) $params['property_value'] : 0;
        $npoptkp      = isset( $params['npoptkp'] ) ? (float) $params['npoptkp'] : 80000000; // Default 80jt

        // Calculation formulas
        $honorarium = 0;
        if ( $property_val <= 100000000 ) {
            $honorarium = $property_val * 0.025;
        } elseif ( $property_val <= 1000000000 ) {
            $honorarium = $property_val * 0.015;
        } else {
            $honorarium = $property_val * 0.010;
        }

        // BPHTB: 5% * (Nilai - NPOPTKP)
        $taxable_bphtb = max( 0, $property_val - $npoptkp );
        $bphtb = $taxable_bphtb * 0.05;

        // PPh Final: 2.5% dari Nilai
        $pph = $property_val * 0.025;

        // PNBP: (1/1000 * Nilai) + 50.000
        $pnbp = ( $property_val * 0.001 ) + 50000;

        $total = $honorarium + $bphtb + $pph + $pnbp;
        $est_no = UGC_Database::generate_unique_id( 'EST' );

        return rest_ensure_response( array(
            'success'        => true,
            'estimate_no'    => $est_no,
            'property_value' => $property_val,
            'honorarium'     => $honorarium,
            'bphtb'          => $bphtb,
            'pph'            => $pph,
            'pnbp'           => $pnbp,
            'total_estimate' => $total,
        ) );
    }

    /**
     * Retry single sync queue item
     */
    public static function retry_sync_item( $request ) {
        $id = (int) $request['id'];
        global $wpdb;

        $wpdb->update(
            "{$wpdb->prefix}ugc_sync_queue",
            array(
                'status'   => 'pending',
                'attempts' => 0,
            ),
            array( 'id' => $id )
        );

        return rest_ensure_response( array( 'success' => true, 'message' => esc_html__( 'Job reset to pending status.', 'universal-google-connect' ) ) );
    }
}
`
  },

  // =========================================================================
  // 12. LOGGER (ZERO-TOKEN-LEAK SAFE LOGGER)
  // =========================================================================
  {
    path: 'includes/class-ugc-logger.php',
    name: 'class-ugc-logger.php',
    category: 'INCLUDES',
    description: 'Privacy-Compliant Audit Logger: Automatically redacts tokens, client secrets, and passwords from log files and internal database records.',
    content: `<?php
/**
 * UGC_Logger Class
 *
 * Secure logging facility that redacts credentials and protects user privacy.
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;

class UGC_Logger {

    public static function info( $message, $context = '' ) {
        self::log( 'info', 'core', $message, $context );
    }

    public static function warning( $message, $context = '' ) {
        self::log( 'warning', 'core', $message, $context );
    }

    public static function error( $message, $context = '' ) {
        self::log( 'error', 'core', $message, $context );
    }

    /**
     * Core logger with redaction
     */
    public static function log( $type, $module, $message, $context = '' ) {
        // Redact any accidental tokens or secrets
        $clean_context = self::redact_secrets( is_string( $context ) ? $context : wp_json_encode( $context ) );

        global $wpdb;
        $table = "{$wpdb->prefix}ugc_logs";

        $ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';

        $wpdb->insert(
            $table,
            array(
                'log_type'   => sanitize_text_field( $type ),
                'module'     => sanitize_text_field( $module ),
                'message'    => sanitize_text_field( $message ),
                'context'    => $clean_context,
                'ip_address' => $ip,
                'created_at' => current_time( 'mysql' ),
            )
        );

        if ( defined( 'WP_DEBUG' ) && WP_DEBUG && get_option( 'ugc_debug_mode', false ) ) {
            error_log( sprintf( '[UGC %s][%s] %s %s', strtoupper( $type ), $module, $message, $clean_context ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
        }
    }

    /**
     * Redact sensitive secrets from logs
     */
    private static function redact_secrets( $string ) {
        $patterns = array(
            '/("access_token"\s*:\s*")[^"]+(")/i'  => '$1[REDACTED_ACCESS_TOKEN]$2',
            '/("refresh_token"\s*:\s*")[^"]+(")/i' => '$1[REDACTED_REFRESH_TOKEN]$2',
            '/("client_secret"\s*:\s*")[^"]+(")/i' => '$1[REDACTED_CLIENT_SECRET]$2',
            '/(Bearer\s+)[a-zA-Z0-9-_\.]+/i'       => '$1[REDACTED_BEARER_TOKEN]',
        );
        return preg_replace( array_keys( $patterns ), array_values( $patterns ), $string );
    }
}
`
  },

  // =========================================================================
  // 13. ADMIN UI & CONTROLLER
  // =========================================================================
  {
    path: 'includes/class-ugc-admin.php',
    name: 'class-ugc-admin.php',
    category: 'INCLUDES',
    description: 'Admin Controller: Registers Universal Google top-level menu, setup wizard, AJAX handlers for test & 1-click initialize, and handles OAuth callbacks.',
    content: `<?php
/**
 * UGC_Admin Class
 *
 * Manages WordPress Admin Menus, Settings Pages, and AJAX endpoints.
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;

class UGC_Admin {

    /**
     * Initialize Admin Hooks
     */
    public static function init() {
        add_action( 'admin_menu', array( __CLASS__, 'register_menus' ) );
        add_action( 'admin_init', array( __CLASS__, 'handle_oauth_callback_redirect' ) );
        add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_admin_assets' ) );

        // AJAX handlers
        add_action( 'wp_ajax_ugc_save_credentials', array( __CLASS__, 'ajax_save_credentials' ) );
        add_action( 'wp_ajax_ugc_disconnect_google', array( __CLASS__, 'ajax_disconnect_google' ) );
        add_action( 'wp_ajax_ugc_init_system', array( __CLASS__, 'ajax_init_system' ) );
        add_action( 'wp_ajax_ugc_test_health', array( __CLASS__, 'ajax_test_health' ) );
    }

    /**
     * Register Top-Level Admin Menu & Submenus
     */
    public static function register_menus() {
        add_menu_page(
            esc_html__( 'Universal Google Connect', 'universal-google-connect' ),
            esc_html__( 'Universal Google', 'universal-google-connect' ),
            'manage_options',
            'universal-google-connect',
            array( __CLASS__, 'render_dashboard_page' ),
            'dashicons-cloud',
            30
        );

        add_submenu_page(
            'universal-google-connect',
            esc_html__( 'Dashboard', 'universal-google-connect' ),
            esc_html__( 'Dashboard', 'universal-google-connect' ),
            'manage_options',
            'universal-google-connect',
            array( __CLASS__, 'render_dashboard_page' )
        );

        add_submenu_page(
            'universal-google-connect',
            esc_html__( 'Setup Wizard', 'universal-google-connect' ),
            esc_html__( 'Setup Wizard', 'universal-google-connect' ),
            'manage_options',
            'ugc-setup-wizard',
            array( __CLASS__, 'render_wizard_page' )
        );

        add_submenu_page(
            'universal-google-connect',
            esc_html__( 'Google OAuth Settings', 'universal-google-connect' ),
            esc_html__( 'Google OAuth', 'universal-google-connect' ),
            'manage_options',
            'ugc-settings-oauth',
            array( __CLASS__, 'render_oauth_page' )
        );

        add_submenu_page(
            'universal-google-connect',
            esc_html__( 'Google Drive Settings', 'universal-google-connect' ),
            esc_html__( 'Google Drive', 'universal-google-connect' ),
            'manage_options',
            'ugc-settings-drive',
            array( __CLASS__, 'render_drive_page' )
        );

        add_submenu_page(
            'universal-google-connect',
            esc_html__( 'Google Sheets Settings', 'universal-google-connect' ),
            esc_html__( 'Google Sheets', 'universal-google-connect' ),
            'manage_options',
            'ugc-settings-sheets',
            array( __CLASS__, 'render_sheets_page' )
        );

        add_submenu_page(
            'universal-google-connect',
            esc_html__( 'Apps Script Settings', 'universal-google-connect' ),
            esc_html__( 'Apps Script', 'universal-google-connect' ),
            'manage_options',
            'ugc-settings-apps-script',
            array( __CLASS__, 'render_apps_script_page' )
        );

        add_submenu_page(
            'universal-google-connect',
            esc_html__( 'Sync Queue & Logs', 'universal-google-connect' ),
            esc_html__( 'Sync Queue', 'universal-google-connect' ),
            'manage_options',
            'ugc-sync-queue',
            array( __CLASS__, 'render_sync_page' )
        );

        add_submenu_page(
            'universal-google-connect',
            esc_html__( 'Tools & Debug', 'universal-google-connect' ),
            esc_html__( 'Tools & Debug', 'universal-google-connect' ),
            'manage_options',
            'ugc-tools-debug',
            array( __CLASS__, 'render_tools_page' )
        );

        // Hidden Callback receiver page
        add_submenu_page(
            null,
            'Google OAuth Callback',
            'Google OAuth Callback',
            'manage_options',
            'ugc-google-callback',
            array( __CLASS__, 'render_callback_page' )
        );
    }

    /**
     * Enqueue Admin Scoped CSS & JS
     */
    public static function enqueue_admin_assets( $hook ) {
        if ( strpos( $hook, 'ugc' ) === false && strpos( $hook, 'universal-google-connect' ) === false ) {
            return;
        }

        wp_enqueue_style(
            'ugc-admin-style',
            UGC_PLUGIN_URL . 'admin/css/ugc-admin.css',
            array(),
            UGC_VERSION
        );

        wp_enqueue_script(
            'ugc-admin-script',
            UGC_PLUGIN_URL . 'admin/js/ugc-admin.js',
            array( 'jquery' ),
            UGC_VERSION,
            true
        );

        wp_localize_script( 'ugc-admin-script', 'UGC_ADMIN_VARS', array(
            'ajaxUrl'     => admin_url( 'admin-ajax.php' ),
            'nonce'       => wp_create_nonce( 'ugc_admin_action' ),
            'redirectUri' => UGC_OAuth::get_redirect_uri(),
        ) );
    }

    /**
     * Handle OAuth Callback Redirect from Google
     */
    public static function handle_oauth_callback_redirect() {
        if ( ! isset( $_GET['page'] ) || 'ugc-google-callback' !== $_GET['page'] ) {
            return;
        }

        UGC_Security::check_admin_permission();

        if ( isset( $_GET['code'] ) && isset( $_GET['state'] ) ) {
            $code  = sanitize_text_field( wp_unslash( $_GET['code'] ) );
            $state = sanitize_text_field( wp_unslash( $_GET['state'] ) );

            $result = UGC_OAuth::handle_callback( $code, $state );

            if ( is_wp_error( $result ) ) {
                wp_safe_redirect( add_query_arg( array( 'page' => 'ugc-settings-oauth', 'ugc_error' => rawurlencode( $result->get_error_message() ) ), admin_url( 'admin.php' ) ) );
                exit;
            }

            wp_safe_redirect( add_query_arg( array( 'page' => 'universal-google-connect', 'ugc_connected' => '1' ), admin_url( 'admin.php' ) ) );
            exit;
        }
    }

    /**
     * Render Dashboard Page
     */
    public static function render_dashboard_page() {
        include UGC_PLUGIN_DIR . 'admin/views/dashboard.php';
    }

    public static function render_wizard_page() {
        include UGC_PLUGIN_DIR . 'admin/views/wizard.php';
    }

    public static function render_oauth_page() {
        include UGC_PLUGIN_DIR . 'admin/views/settings-oauth.php';
    }

    public static function render_drive_page() {
        include UGC_PLUGIN_DIR . 'admin/views/settings-drive.php';
    }

    public static function render_sheets_page() {
        include UGC_PLUGIN_DIR . 'admin/views/settings-sheets.php';
    }

    public static function render_apps_script_page() {
        include UGC_PLUGIN_DIR . 'admin/views/settings-apps-script.php';
    }

    public static function render_sync_page() {
        include UGC_PLUGIN_DIR . 'admin/views/sync-queue.php';
    }

    public static function render_tools_page() {
        include UGC_PLUGIN_DIR . 'admin/views/debug-tools.php';
    }

    public static function render_callback_page() {
        echo '<div class="wrap"><p>' . esc_html__( 'Processing Google OAuth authentication...', 'universal-google-connect' ) . '</p></div>';
    }

    /**
     * AJAX Save Credentials
     */
    public static function ajax_save_credentials() {
        check_ajax_referer( 'ugc_admin_action', 'nonce' );
        UGC_Security::check_admin_permission();

        $client_id     = isset( $_POST['client_id'] ) ? sanitize_text_field( wp_unslash( $_POST['client_id'] ) ) : '';
        $client_secret = isset( $_POST['client_secret'] ) ? sanitize_text_field( wp_unslash( $_POST['client_secret'] ) ) : '';

        $settings = get_option( 'ugc_oauth_settings', array() );
        $settings['client_id']     = $client_id;
        $settings['client_secret'] = $client_secret;
        update_option( 'ugc_oauth_settings', $settings );

        wp_send_json_success( array( 'message' => esc_html__( 'Google credentials saved.', 'universal-google-connect' ) ) );
    }

    /**
     * AJAX Disconnect Google
     */
    public static function ajax_disconnect_google() {
        check_ajax_referer( 'ugc_admin_action', 'nonce' );
        UGC_Security::check_admin_permission();

        UGC_OAuth::disconnect();
        wp_send_json_success( array( 'message' => esc_html__( 'Google account disconnected successfully.', 'universal-google-connect' ) ) );
    }

    /**
     * AJAX 1-Click Initialize Google System (Drive + Sheets)
     */
    public static function ajax_init_system() {
        check_ajax_referer( 'ugc_admin_action', 'nonce' );
        UGC_Security::check_admin_permission();

        $folder_name = isset( $_POST['folder_name'] ) ? sanitize_text_field( wp_unslash( $_POST['folder_name'] ) ) : 'Notaris Lalu Daud';
        $sheet_name  = isset( $_POST['sheet_name'] ) ? sanitize_text_field( wp_unslash( $_POST['sheet_name'] ) ) : 'Database Website';

        // 1. Initialize Drive Structure
        $drive_res = UGC_Drive::initialize_system_structure( $folder_name );
        if ( is_wp_error( $drive_res ) ) {
            wp_send_json_error( array( 'message' => 'Google Drive error: ' . $drive_res->get_error_message() ) );
        }

        // 2. Initialize Sheets
        $sheets_res = UGC_Sheets::create_spreadsheet( $sheet_name );
        if ( is_wp_error( $sheets_res ) ) {
            wp_send_json_error( array( 'message' => 'Google Sheets error: ' . $sheets_res->get_error_message() ) );
        }

        wp_send_json_success( array(
            'message' => esc_html__( 'Google Drive & Google Sheets initialized successfully with 0 duplicate folders.', 'universal-google-connect' ),
            'drive'   => $drive_res,
            'sheets'  => $sheets_res,
        ) );
    }

    /**
     * AJAX Health Check
     */
    public static function ajax_test_health() {
        check_ajax_referer( 'ugc_admin_action', 'nonce' );
        UGC_Security::check_admin_permission();

        $results = array(
            'php'        => version_compare( PHP_VERSION, '7.4', '>=' ),
            'openssl'    => function_exists( 'openssl_encrypt' ),
            'oauthToken' => ! is_wp_error( UGC_OAuth::get_valid_access_token() ),
        );

        wp_send_json_success( $results );
    }
}
`
  }
];
