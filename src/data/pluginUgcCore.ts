import { PluginFile } from './pluginTypes';

export const PLUGIN_CORE_FILES: PluginFile[] = [
  // =========================================================================
  // 1. ROOT PLUGIN BOOTSTRAPPER (SAFE ZERO-DEPENDENCY BOOTSTRAP)
  // =========================================================================
  {
    path: 'universal-google-connect.php',
    name: 'universal-google-connect.php',
    category: 'CORE',
    description: 'Main WordPress Plugin Header, Version Guards, Safe Autoloader, Lifecycle Hooks (Zero API calls on activation)',
    content: `<?php
/**
 * Plugin Name: Universal Google Connect
 * Plugin URI: https://laludaud.com/universal-google-connect
 * Description: Universal Google Drive, Google Sheets, and Google Apps Script integration for WordPress with Direct OAuth 2.0.
 * Version: 2.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: Lalu Daud Digital System
 * Author URI: https://laludaud.com
 * Text Domain: universal-google-connect
 * Domain Path: /languages
 * License: GPLv2 or later
 * 
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;

// -----------------------------------------------------------------------------
// 1. DEFINE CONSTANTS
// -----------------------------------------------------------------------------
define( 'UGC_VERSION', '2.0.0' );
define( 'UGC_DB_VERSION', '2.0.0' );
define( 'UGC_PLUGIN_FILE', __FILE__ );
define( 'UGC_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'UGC_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'UGC_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

// -----------------------------------------------------------------------------
// 2. ENVIRONMENT & COMPATIBILITY CHECK (SAFE GUARDS)
// -----------------------------------------------------------------------------
function ugc_check_system_requirements() {
    $errors = array();

    // Check PHP Version (Minimum 7.4, recommended 8.1+)
    if ( version_compare( PHP_VERSION, '7.4', '<' ) ) {
        $errors[] = sprintf(
            /* translators: %s: Current PHP Version */
            esc_html__( 'Universal Google Connect requires PHP version 7.4 or higher. Your server is running PHP %s.', 'universal-google-connect' ),
            PHP_VERSION
        );
    }

    // Check WordPress Version
    global $wp_version;
    if ( version_compare( $wp_version, '6.0', '<' ) ) {
        $errors[] = sprintf(
            /* translators: %s: Current WordPress Version */
            esc_html__( 'Universal Google Connect requires WordPress version 6.0 or higher. Your site is running WordPress %s.', 'universal-google-connect' ),
            $wp_version
        );
    }

    // Check OpenSSL for secure OAuth token encryption
    if ( ! function_exists( 'openssl_encrypt' ) ) {
        $errors[] = esc_html__( 'The OpenSSL PHP extension is required for secure token encryption.', 'universal-google-connect' );
    }

    return $errors;
}

// -----------------------------------------------------------------------------
// 3. SAFE AUTOLOADER (GUARDED - NO CRASHES)
// -----------------------------------------------------------------------------
spl_autoload_register( function ( $class ) {
    $prefix = 'UGC_';
    $base_dir = UGC_PLUGIN_DIR . 'includes/';

    $len = strlen( $prefix );
    if ( strncmp( $prefix, $class, $len ) !== 0 ) {
        return;
    }

    $relative_class = substr( $class, $len );
    $file_name = 'class-ugc-' . strtolower( str_replace( '_', '-', $relative_class ) ) . '.php';
    $file = $base_dir . $file_name;

    if ( file_exists( $file ) ) {
        require_once $file;
    }
} );

// -----------------------------------------------------------------------------
// 4. ZERO DEPENDENCY ACTIVATION & DEACTIVATION HOOKS
// -----------------------------------------------------------------------------
register_activation_hook( __FILE__, 'ugc_activate_plugin' );
register_deactivation_hook( __FILE__, 'ugc_deactivate_plugin' );

/**
 * Activation Hook: Only sets up database tables & default options.
 * CRITICAL RULE: NO Google API / OAuth requests during activation!
 */
function ugc_activate_plugin() {
    $req_errors = ugc_check_system_requirements();
    if ( ! empty( $req_errors ) ) {
        deactivate_plugins( plugin_basename( __FILE__ ) );
        wp_die(
            wp_kses_post( implode( '<br>', $req_errors ) ),
            esc_html__( 'Plugin Activation Error', 'universal-google-connect' ),
            array( 'back_link' => true )
        );
    }

    // Load Database installer
    if ( file_exists( UGC_PLUGIN_DIR . 'includes/class-ugc-database.php' ) ) {
        require_once UGC_PLUGIN_DIR . 'includes/class-ugc-database.php';
        UGC_Database::install_tables();
    }

    // Setup Default Options if not present
    if ( ! get_option( 'ugc_oauth_settings' ) ) {
        update_option( 'ugc_oauth_settings', array(
            'client_id'         => '',
            'client_secret'     => '',
            'auth_status'       => 'disconnected',
            'connected_email'   => '',
            'connected_name'    => '',
            'connected_time'    => '',
            'token_expires_at'  => 0,
        ) );
    }

    if ( ! get_option( 'ugc_drive_settings' ) ) {
        update_option( 'ugc_drive_settings', array(
            'root_folder_id'    => '',
            'root_folder_name'  => 'Notaris Lalu Daud',
            'auto_structure'    => true,
            'folders'           => array(),
        ) );
    }

    if ( ! get_option( 'ugc_sheets_settings' ) ) {
        update_option( 'ugc_sheets_settings', array(
            'spreadsheet_id'    => '',
            'spreadsheet_name'  => 'Database Website',
            'spreadsheet_url'   => '',
            'worksheets'        => array(),
            'auto_sync'         => true,
        ) );
    }

    if ( ! get_option( 'ugc_apps_script_settings' ) ) {
        update_option( 'ugc_apps_script_settings', array(
            'web_app_url'       => '',
            'status'            => 'unconfigured',
            'last_health_check' => '',
        ) );
    }

    // Schedule background sync worker via WP-Cron
    if ( ! wp_next_scheduled( 'ugc_process_sync_queue' ) ) {
        wp_schedule_event( time(), 'every_five_minutes', 'ugc_process_sync_queue' );
    }

    update_option( 'ugc_version', UGC_VERSION );
}

/**
 * Deactivation Hook: Clears scheduled cron jobs. Does NOT delete user data.
 */
function ugc_deactivate_plugin() {
    $timestamp = wp_next_scheduled( 'ugc_process_sync_queue' );
    if ( $timestamp ) {
        wp_unschedule_event( $timestamp, 'ugc_process_sync_queue' );
    }
}

// -----------------------------------------------------------------------------
// 5. BOOTSTRAP PLUGIN
// -----------------------------------------------------------------------------
function ugc_run_plugin() {
    $req_errors = ugc_check_system_requirements();
    if ( ! empty( $req_errors ) ) {
        add_action( 'admin_notices', function () use ( $req_errors ) {
            ?>
            <div class="notice notice-error is-dismissible">
                <p><strong><?php esc_html_e( 'Universal Google Connect Warning:', 'universal-google-connect' ); ?></strong></p>
                <p><?php echo wp_kses_post( implode( '<br>', $req_errors ) ); ?></p>
            </div>
            <?php
        } );
        return;
    }

    // Initialize Plugin Singleton
    if ( class_exists( 'UGC_Plugin' ) ) {
        UGC_Plugin::get_instance();
    }
}
add_action( 'plugins_loaded', 'ugc_run_plugin' );
`
  },

  // =========================================================================
  // 2. UNINSTALL LIFECYCLE (SAFE UNINSTALL)
  // =========================================================================
  {
    path: 'uninstall.php',
    name: 'uninstall.php',
    category: 'CORE',
    description: 'Safe Uninstall Script: Preserves client data, documents, and estimates by default unless explicitly chosen in admin tools.',
    content: `<?php
/**
 * Universal Google Connect Uninstall
 * 
 * Fired when the plugin is uninstalled via WordPress Admin.
 * Default policy: KEEP DATA intact to prevent accidental data loss.
 *
 * @package UniversalGoogleConnect
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

// Check if user explicitly requested complete data purge
$purge_data = get_option( 'ugc_purge_data_on_uninstall', '0' );

if ( '1' === $purge_data ) {
    global $wpdb;

    // Drop plugin internal tables
    $tables = array(
        "{$wpdb->prefix}ugc_connections",
        "{$wpdb->prefix}ugc_clients",
        "{$wpdb->prefix}ugc_services",
        "{$wpdb->prefix}ugc_applications",
        "{$wpdb->prefix}ugc_documents",
        "{$wpdb->prefix}ugc_estimates",
        "{$wpdb->prefix}ugc_sync_queue",
        "{$wpdb->prefix}ugc_logs",
    );

    foreach ( $tables as $table ) {
        $wpdb->query( "DROP TABLE IF EXISTS {$table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
    }

    // Delete options
    delete_option( 'ugc_oauth_settings' );
    delete_option( 'ugc_drive_settings' );
    delete_option( 'ugc_sheets_settings' );
    delete_option( 'ugc_apps_script_settings' );
    delete_option( 'ugc_version' );
    delete_option( 'ugc_db_version' );
    delete_option( 'ugc_purge_data_on_uninstall' );
    delete_option( 'ugc_debug_mode' );
    delete_transient( 'ugc_oauth_state' );
}
`
  },

  // =========================================================================
  // 3. CORE PLUGIN ORCHESTRATOR
  // =========================================================================
  {
    path: 'includes/class-ugc-plugin.php',
    name: 'class-ugc-plugin.php',
    category: 'INCLUDES',
    description: 'Central Plugin Singleton: Initializes modules, sets up cron schedules, hooks REST API and admin views.',
    content: `<?php
/**
 * UGC_Plugin Class
 *
 * Main Orchestrator for Universal Google Connect.
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;

class UGC_Plugin {

    /**
     * Singleton instance
     * @var UGC_Plugin|null
     */
    private static $instance = null;

    /**
     * Get singleton instance
     * @return UGC_Plugin
     */
    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        $this->register_cron_intervals();
        $this->init_modules();
        $this->init_hooks();
    }

    /**
     * Custom cron interval for sync queue
     */
    private function register_cron_intervals() {
        add_filter( 'cron_schedules', function ( $schedules ) {
            if ( ! isset( $schedules['every_five_minutes'] ) ) {
                $schedules['every_five_minutes'] = array(
                    'interval' => 300,
                    'display'  => esc_html__( 'Every 5 Minutes', 'universal-google-connect' ),
                );
            }
            return $schedules;
        } );
    }

    /**
     * Initialize decoupled sub-modules
     */
    private function init_modules() {
        // Initialize Security & Encryption
        UGC_Security::init();

        // Initialize REST API endpoints
        UGC_Rest::init();

        // Initialize WP-Cron background worker
        UGC_Sync::init();

        // Initialize Admin UI & Menu if in admin dashboard
        if ( is_admin() ) {
            UGC_Admin::init();
        }

        // Initialize Shortcodes
        add_shortcode( 'ugc_google_connect', array( $this, 'render_shortcode' ) );
    }

    /**
     * Register global action & filter hooks
     */
    private function init_hooks() {
        add_action( 'init', array( $this, 'load_textdomain' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'register_frontend_assets' ) );
    }

    /**
     * Load localization textdomain
     */
    public function load_textdomain() {
        load_plugin_textdomain(
            'universal-google-connect',
            false,
            dirname( UGC_PLUGIN_BASENAME ) . '/languages/'
        );
    }

    /**
     * Register scoped frontend scripts & styles
     */
    public function register_frontend_assets() {
        wp_register_style(
            'ugc-frontend-style',
            UGC_PLUGIN_URL . 'public/css/ugc-public.css',
            array(),
            UGC_VERSION
        );

        wp_register_script(
            'ugc-frontend-script',
            UGC_PLUGIN_URL . 'public/js/ugc-public.js',
            array( 'jquery' ),
            UGC_VERSION,
            true
        );

        wp_localize_script( 'ugc-frontend-script', 'UGC_VARS', array(
            'ajaxUrl'  => admin_url( 'admin-ajax.php' ),
            'restUrl'  => rest_url( 'ugc/v1/' ),
            'nonce'    => wp_create_nonce( 'ugc_frontend_nonce' ),
        ) );
    }

    /**
     * Frontend Shortcode render [ugc_google_connect]
     */
    public function render_shortcode( $atts ) {
        wp_enqueue_style( 'ugc-frontend-style' );
        wp_enqueue_script( 'ugc-frontend-script' );

        ob_start();
        $template_file = UGC_PLUGIN_DIR . 'templates/shortcode-client-submission.php';
        if ( file_exists( $template_file ) ) {
            include $template_file;
        } else {
            echo '<div class="ugc-frontend"><p>' . esc_html__( 'Universal Google Connect shortcode active.', 'universal-google-connect' ) . '</p></div>';
        }
        return ob_get_clean();
    }
}
`
  },

  // =========================================================================
  // 4. DATABASE LAYER (DBDELTA INSTALLER & REPOSITORY)
  // =========================================================================
  {
    path: 'includes/class-ugc-database.php',
    name: 'class-ugc-database.php',
    category: 'INCLUDES',
    description: 'Internal WordPress Database Engine: dbDelta schema creation for clients, services, applications, documents, estimates, sync queue, and audit logs.',
    content: `<?php
/**
 * UGC_Database Class
 *
 * Handles WordPress internal database tables with dbDelta() and safe prepared queries.
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;

class UGC_Database {

    /**
     * Install / Upgrade database tables
     */
    public static function install_tables() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        // 1. Connections Table
        $table_connections = "{$wpdb->prefix}ugc_connections";
        $sql_connections = "CREATE TABLE {$table_connections} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            provider varchar(50) NOT NULL DEFAULT 'google',
            account_email varchar(191) NOT NULL DEFAULT '',
            account_name varchar(191) NOT NULL DEFAULT '',
            access_token text NULL,
            refresh_token text NULL,
            token_type varchar(50) DEFAULT 'Bearer',
            expires_at bigint(20) unsigned DEFAULT 0,
            scopes text NULL,
            status varchar(50) NOT NULL DEFAULT 'disconnected',
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY provider (provider),
            KEY status (status)
        ) {$charset_collate};";
        dbDelta( $sql_connections );

        // 2. Clients Table
        $table_clients = "{$wpdb->prefix}ugc_clients";
        $sql_clients = "CREATE TABLE {$table_clients} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            client_uid varchar(64) NOT NULL,
            full_name varchar(191) NOT NULL,
            email varchar(191) NOT NULL,
            phone varchar(64) NOT NULL,
            nik varchar(32) DEFAULT '',
            address text DEFAULT '',
            drive_folder_id varchar(191) DEFAULT '',
            drive_folder_url text DEFAULT '',
            google_sheet_row int(11) DEFAULT 0,
            sync_status varchar(50) NOT NULL DEFAULT 'pending',
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            UNIQUE KEY client_uid (client_uid),
            KEY email (email),
            KEY sync_status (sync_status)
        ) {$charset_collate};";
        dbDelta( $sql_clients );

        // 3. Services Table
        $table_services = "{$wpdb->prefix}ugc_services";
        $sql_services = "CREATE TABLE {$table_services} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            service_code varchar(64) NOT NULL,
            category varchar(64) NOT NULL DEFAULT 'NOTARIS',
            name varchar(191) NOT NULL,
            description text DEFAULT '',
            base_fee decimal(15,2) NOT NULL DEFAULT 0.00,
            is_active tinyint(1) NOT NULL DEFAULT 1,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            UNIQUE KEY service_code (service_code)
        ) {$charset_collate};";
        dbDelta( $sql_services );

        // 4. Applications Table
        $table_applications = "{$wpdb->prefix}ugc_applications";
        $sql_applications = "CREATE TABLE {$table_applications} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            application_no varchar(64) NOT NULL,
            client_id bigint(20) unsigned NOT NULL,
            service_id bigint(20) unsigned DEFAULT NULL,
            service_name varchar(191) NOT NULL,
            status varchar(50) NOT NULL DEFAULT 'submitted',
            form_payload longtext NULL,
            drive_folder_id varchar(191) DEFAULT '',
            drive_folder_url text DEFAULT '',
            google_sheet_row int(11) DEFAULT 0,
            sync_status varchar(50) NOT NULL DEFAULT 'pending',
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            UNIQUE KEY application_no (application_no),
            KEY client_id (client_id),
            KEY status (status),
            KEY sync_status (sync_status)
        ) {$charset_collate};";
        dbDelta( $sql_applications );

        // 5. Documents Table
        $table_documents = "{$wpdb->prefix}ugc_documents";
        $sql_documents = "CREATE TABLE {$table_documents} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            doc_uid varchar(64) NOT NULL,
            application_id bigint(20) unsigned DEFAULT NULL,
            client_id bigint(20) unsigned DEFAULT NULL,
            title varchar(191) NOT NULL,
            doc_category varchar(64) NOT NULL DEFAULT 'KTP',
            file_name varchar(191) NOT NULL,
            file_size bigint(20) unsigned NOT NULL DEFAULT 0,
            mime_type varchar(100) NOT NULL,
            drive_file_id varchar(191) DEFAULT '',
            drive_view_url text DEFAULT '',
            is_secure_restricted tinyint(1) NOT NULL DEFAULT 1,
            sync_status varchar(50) NOT NULL DEFAULT 'pending',
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            UNIQUE KEY doc_uid (doc_uid),
            KEY application_id (application_id),
            KEY client_id (client_id)
        ) {$charset_collate};";
        dbDelta( $sql_documents );

        // 6. Estimates Table
        $table_estimates = "{$wpdb->prefix}ugc_estimates";
        $sql_estimates = "CREATE TABLE {$table_estimates} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            estimate_no varchar(64) NOT NULL,
            client_id bigint(20) unsigned DEFAULT NULL,
            service_code varchar(64) NOT NULL,
            property_value decimal(15,2) NOT NULL DEFAULT 0.00,
            honorarium_fee decimal(15,2) NOT NULL DEFAULT 0.00,
            tax_bphtb decimal(15,2) NOT NULL DEFAULT 0.00,
            tax_pph decimal(15,2) NOT NULL DEFAULT 0.00,
            pnbp_fee decimal(15,2) NOT NULL DEFAULT 0.00,
            total_estimate decimal(15,2) NOT NULL DEFAULT 0.00,
            notes text DEFAULT '',
            sync_status varchar(50) NOT NULL DEFAULT 'pending',
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            UNIQUE KEY estimate_no (estimate_no)
        ) {$charset_collate};";
        dbDelta( $sql_estimates );

        // 7. Sync Queue Table
        $table_queue = "{$wpdb->prefix}ugc_sync_queue";
        $sql_queue = "CREATE TABLE {$table_queue} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            entity varchar(50) NOT NULL,
            entity_id bigint(20) unsigned NOT NULL,
            operation varchar(50) NOT NULL,
            payload longtext NOT NULL,
            attempts int(11) NOT NULL DEFAULT 0,
            max_attempts int(11) NOT NULL DEFAULT 3,
            status varchar(50) NOT NULL DEFAULT 'pending',
            last_error text NULL,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY status (status),
            KEY entity (entity)
        ) {$charset_collate};";
        dbDelta( $sql_queue );

        // 8. Audit Logs Table
        $table_logs = "{$wpdb->prefix}ugc_logs";
        $sql_logs = "CREATE TABLE {$table_logs} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            log_type varchar(50) NOT NULL DEFAULT 'info',
            module varchar(50) NOT NULL DEFAULT 'core',
            message text NOT NULL,
            context longtext NULL,
            ip_address varchar(100) DEFAULT '',
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY log_type (log_type),
            KEY module (module),
            KEY created_at (created_at)
        ) {$charset_collate};";
        dbDelta( $sql_logs );

        update_option( 'ugc_db_version', UGC_DB_VERSION );
    }

    /**
     * Generate Unique Sequential ID
     * Example: CL-2026-00001, APP-2026-00001, EST-2026-00001
     */
    public static function generate_unique_id( $prefix = 'CL' ) {
        global $wpdb;
        $year = gmdate( 'Y' );
        $rand_suffix = str_pad( (string) wp_rand( 1, 99999 ), 5, '0', STR_PAD_LEFT );
        return sprintf( '%s-%s-%s', $prefix, $year, $rand_suffix );
    }
}
`
  }
];
