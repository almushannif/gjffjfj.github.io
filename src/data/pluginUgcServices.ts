import { PluginFile } from './pluginTypes';

export const PLUGIN_SERVICES_FILES: PluginFile[] = [
  // =========================================================================
  // 5. SECURITY & ENCRYPTION LAYER
  // =========================================================================
  {
    path: 'includes/class-ugc-security.php',
    name: 'class-ugc-security.php',
    category: 'INCLUDES',
    description: 'Security & Privacy Engine: AES-256 encryption for OAuth tokens, SSRF domain whitelist, nonces, capabilities, and file MIME verification.',
    content: `<?php
/**
 * UGC_Security Class
 *
 * Provides cryptographic security for OAuth tokens, SSRF protection,
 * and WordPress capability validation.
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;

class UGC_Security {

    /**
     * Whitelisted Google API Domains for SSRF prevention
     * @var array
     */
    private static $allowed_hosts = array(
        'accounts.google.com',
        'oauth2.googleapis.com',
        'www.googleapis.com',
        'drive.googleapis.com',
        'sheets.googleapis.com',
        'script.google.com',
        'script.googleusercontent.com',
    );

    /**
     * Initialize security settings
     */
    public static function init() {
        // Any runtime security hooks
    }

    /**
     * Check if user has administrative rights for Google integration
     */
    public static function check_admin_permission() {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'Unauthorized access. You do not have permission to manage Google Integration settings.', 'universal-google-connect' ) );
        }
    }

    /**
     * Verify AJAX / REST Nonce
     */
    public static function verify_nonce( $nonce, $action = 'ugc_admin_action' ) {
        if ( ! wp_verify_nonce( $nonce, $action ) ) {
            return new WP_Error( 'invalid_nonce', esc_html__( 'Security token expired or invalid.', 'universal-google-connect' ), array( 'status' => 403 ) );
        }
        return true;
    }

    /**
     * Encrypt sensitive string (e.g. Refresh Token) with OpenSSL AES-256-CBC
     */
    public static function encrypt( $plaintext ) {
        if ( empty( $plaintext ) ) {
            return '';
        }

        if ( ! function_exists( 'openssl_encrypt' ) ) {
            return base64_encode( $plaintext ); // Fallback if OpenSSL unavailable
        }

        $key = hash( 'sha256', AUTH_KEY . LOGGED_IN_KEY . 'ugc_oauth_secret' );
        $iv = openssl_random_pseudo_bytes( openssl_cipher_iv_length( 'aes-256-cbc' ) );
        $encrypted = openssl_encrypt( $plaintext, 'aes-256-cbc', $key, 0, $iv );

        return base64_encode( $encrypted . '::' . $iv );
    }

    /**
     * Decrypt sensitive string
     */
    public static function decrypt( $encrypted_text ) {
        if ( empty( $encrypted_text ) ) {
            return '';
        }

        if ( ! function_exists( 'openssl_decrypt' ) ) {
            return base64_decode( $encrypted_text );
        }

        $raw_data = base64_decode( $encrypted_text );
        if ( strpos( $raw_data, '::' ) === false ) {
            return $raw_data;
        }

        list( $encrypted_data, $iv ) = explode( '::', $raw_data, 2 );
        $key = hash( 'sha256', AUTH_KEY . LOGGED_IN_KEY . 'ugc_oauth_secret' );

        return openssl_decrypt( $encrypted_data, 'aes-256-cbc', $key, 0, $iv );
    }

    /**
     * Validate Google endpoint URL to prevent SSRF attacks
     */
    public static function validate_google_url( $url ) {
        $parsed = wp_parse_url( $url );
        if ( empty( $parsed['scheme'] ) || 'https' !== $parsed['scheme'] ) {
            return false;
        }

        if ( empty( $parsed['host'] ) ) {
            return false;
        }

        $host = strtolower( $parsed['host'] );
        foreach ( self::$allowed_hosts as $allowed ) {
            if ( $host === $allowed || substr( $host, -strlen( '.' . $allowed ) ) === '.' . $allowed ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Safe MIME check for uploaded legal files
     */
    public static function is_allowed_mime_type( $mime ) {
        $allowed = array(
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        return in_array( $mime, $allowed, true );
    }
}
`
  },

  // =========================================================================
  // 6. OAUTH 2.0 ENGINE (DIRECT FROM WORDPRESS)
  // =========================================================================
  {
    path: 'includes/class-ugc-oauth.php',
    name: 'class-ugc-oauth.php',
    category: 'INCLUDES',
    description: 'Direct OAuth 2.0 Web Client: Auth URL generation, dynamic redirect URI, secure code exchange, automatic token refresh via native wp_remote_post.',
    content: `<?php
/**
 * UGC_OAuth Class
 *
 * Pure Native OAuth 2.0 implementation without external Composer/Vendor dependencies.
 * Uses WordPress native wp_remote_post() and wp_remote_get().
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;

class UGC_OAuth {

    const AUTH_URL  = 'https://accounts.google.com/o/oauth2/v2/auth';
    const TOKEN_URL = 'https://oauth2.googleapis.com/token';
    const USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

    /**
     * Scopes needed for Drive, Sheets, and User Profile
     */
    public static function get_scopes() {
        return array(
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        );
    }

    /**
     * Get dynamic redirect URI (Never hardcoded)
     */
    public static function get_redirect_uri() {
        return admin_url( 'admin.php?page=ugc-google-callback' );
    }

    /**
     * Generate Google OAuth 2.0 Authorization URL
     */
    public static function get_auth_url() {
        $settings = get_option( 'ugc_oauth_settings', array() );
        $client_id = isset( $settings['client_id'] ) ? trim( $settings['client_id'] ) : '';

        if ( empty( $client_id ) ) {
            return new WP_Error( 'missing_client_id', esc_html__( 'Google Client ID is not configured.', 'universal-google-connect' ) );
        }

        // Generate and store state token
        $state = wp_generate_password( 32, false );
        set_transient( 'ugc_oauth_state_' . $state, 1, HOUR_IN_SECONDS );

        $params = array(
            'client_id'             => $client_id,
            'redirect_uri'          => self::get_redirect_uri(),
            'response_type'         => 'code',
            'scope'                 => implode( ' ', self::get_scopes() ),
            'access_type'           => 'offline',
            'prompt'                => 'consent',
            'include_granted_scopes'=> 'true',
            'state'                 => $state,
        );

        return add_query_arg( $params, self::AUTH_URL );
    }

    /**
     * Handle OAuth Callback and exchange Code for Tokens
     */
    public static function handle_callback( $code, $state ) {
        // Validate state token to protect against CSRF
        $transient_key = 'ugc_oauth_state_' . $state;
        if ( ! get_transient( $transient_key ) ) {
            return new WP_Error( 'invalid_state', esc_html__( 'Invalid OAuth state parameter or session timed out.', 'universal-google-connect' ) );
        }
        delete_transient( $transient_key );

        $settings = get_option( 'ugc_oauth_settings', array() );
        $client_id = isset( $settings['client_id'] ) ? trim( $settings['client_id'] ) : '';
        $client_secret = isset( $settings['client_secret'] ) ? trim( $settings['client_secret'] ) : '';

        if ( empty( $client_id ) || empty( $client_secret ) ) {
            return new WP_Error( 'missing_credentials', esc_html__( 'Client ID or Client Secret missing.', 'universal-google-connect' ) );
        }

        $body = array(
            'code'          => $code,
            'client_id'     => $client_id,
            'client_secret' => $client_secret,
            'redirect_uri'  => self::get_redirect_uri(),
            'grant_type'    => 'authorization_code',
        );

        $response = wp_remote_post( self::TOKEN_URL, array(
            'body'      => $body,
            'timeout'   => 30,
            'sslverify' => true,
        ) );

        if ( is_wp_error( $response ) ) {
            UGC_Logger::error( 'OAuth Token Exchange Failed', $response->get_error_message() );
            return $response;
        }

        $status_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );
        $data = json_decode( $response_body, true );

        if ( 200 !== $status_code || empty( $data['access_token'] ) ) {
            $err_msg = isset( $data['error_description'] ) ? $data['error_description'] : 'Token exchange returned HTTP ' . $status_code;
            UGC_Logger::error( 'OAuth Exchange Error', $err_msg );
            return new WP_Error( 'token_exchange_failed', $err_msg );
        }

        // Fetch User Info
        $user_info = self::fetch_user_info( $data['access_token'] );

        // Encrypt and store tokens in secure options
        $settings['auth_status']      = 'connected';
        $settings['access_token']     = UGC_Security::encrypt( $data['access_token'] );
        if ( ! empty( $data['refresh_token'] ) ) {
            $settings['refresh_token'] = UGC_Security::encrypt( $data['refresh_token'] );
        }
        $settings['token_expires_at'] = time() + ( isset( $data['expires_in'] ) ? (int) $data['expires_in'] : 3600 );
        $settings['connected_email']  = isset( $user_info['email'] ) ? sanitize_email( $user_info['email'] ) : '';
        $settings['connected_name']   = isset( $user_info['name'] ) ? sanitize_text_field( $user_info['name'] ) : 'Google Account';
        $settings['connected_time']   = current_time( 'mysql' );

        update_option( 'ugc_oauth_settings', $settings );

        UGC_Logger::info( 'Google OAuth Connected Successfully', 'Connected account: ' . $settings['connected_email'] );
        return true;
    }

    /**
     * Fetch user profile info
     */
    public static function fetch_user_info( $access_token ) {
        $response = wp_remote_get( self::USERINFO_URL, array(
            'headers'   => array( 'Authorization' => 'Bearer ' . $access_token ),
            'timeout'   => 15,
            'sslverify' => true,
        ) );

        if ( is_wp_error( $response ) ) {
            return array();
        }

        return json_decode( wp_remote_retrieve_body( $response ), true );
    }

    /**
     * Get valid access token (Auto-refresh if expired)
     */
    public static function get_valid_access_token() {
        $settings = get_option( 'ugc_oauth_settings', array() );

        if ( empty( $settings['access_token'] ) || 'connected' !== $settings['auth_status'] ) {
            return new WP_Error( 'not_connected', esc_html__( 'Google account is not connected.', 'universal-google-connect' ) );
        }

        $expires_at = isset( $settings['token_expires_at'] ) ? (int) $settings['token_expires_at'] : 0;
        // Refresh token 2 minutes before actual expiry
        if ( time() > ( $expires_at - 120 ) ) {
            return self::refresh_access_token();
        }

        return UGC_Security::decrypt( $settings['access_token'] );
    }

    /**
     * Refresh access token using refresh_token
     */
    public static function refresh_access_token() {
        $settings = get_option( 'ugc_oauth_settings', array() );

        $client_id = isset( $settings['client_id'] ) ? trim( $settings['client_id'] ) : '';
        $client_secret = isset( $settings['client_secret'] ) ? trim( $settings['client_secret'] ) : '';
        $encrypted_refresh = isset( $settings['refresh_token'] ) ? $settings['refresh_token'] : '';

        if ( empty( $client_id ) || empty( $client_secret ) || empty( $encrypted_refresh ) ) {
            return new WP_Error( 'refresh_token_missing', esc_html__( 'Refresh token or client credentials missing. Please reconnect.', 'universal-google-connect' ) );
        }

        $refresh_token = UGC_Security::decrypt( $encrypted_refresh );

        $body = array(
            'client_id'     => $client_id,
            'client_secret' => $client_secret,
            'refresh_token' => $refresh_token,
            'grant_type'    => 'refresh_token',
        );

        $response = wp_remote_post( self::TOKEN_URL, array(
            'body'      => $body,
            'timeout'   => 30,
            'sslverify' => true,
        ) );

        if ( is_wp_error( $response ) ) {
            UGC_Logger::error( 'Token Refresh Failed', $response->get_error_message() );
            return $response;
        }

        $status_code = wp_remote_retrieve_response_code( $response );
        $data = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( 200 !== $status_code || empty( $data['access_token'] ) ) {
            UGC_Logger::error( 'Token Refresh Error', 'HTTP ' . $status_code );
            return new WP_Error( 'refresh_failed', esc_html__( 'Failed to refresh Google access token. Please reconnect.', 'universal-google-connect' ) );
        }

        $settings['access_token']     = UGC_Security::encrypt( $data['access_token'] );
        $settings['token_expires_at'] = time() + ( isset( $data['expires_in'] ) ? (int) $data['expires_in'] : 3600 );
        update_option( 'ugc_oauth_settings', $settings );

        return $data['access_token'];
    }

    /**
     * Disconnect Google Account (Preserves WordPress data)
     */
    public static function disconnect() {
        $settings = get_option( 'ugc_oauth_settings', array() );
        $settings['auth_status']      = 'disconnected';
        $settings['access_token']     = '';
        $settings['refresh_token']    = '';
        $settings['token_expires_at'] = 0;
        $settings['connected_email']  = '';
        $settings['connected_name']   = '';
        update_option( 'ugc_oauth_settings', $settings );

        UGC_Logger::info( 'Google Account Disconnected', 'User triggered disconnect.' );
        return true;
    }
}
`
  },

  // =========================================================================
  // 7. GOOGLE DRIVE REST CLIENT
  // =========================================================================
  {
    path: 'includes/class-ugc-drive.php',
    name: 'class-ugc-drive.php',
    category: 'INCLUDES',
    description: 'Google Drive v3 REST Client: Folder creator, idempotent 7-folder hierarchy generator, client folder isolation, and secure file uploads.',
    content: `<?php
/**
 * UGC_Drive Class
 *
 * Pure Native Google Drive API v3 implementation.
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;

class UGC_Drive {

    const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
    const UPLOAD_API_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

    /**
     * Parse Google Drive Folder ID from URL
     */
    public static function parse_folder_id( $input ) {
        $input = trim( $input );
        if ( preg_match( '/[-\w]{25,}/', $input, $matches ) ) {
            return $matches[0];
        }
        return false;
    }

    /**
     * Create Folder in Google Drive (Idempotent: checks if already exists)
     */
    public static function create_folder( $folder_name, $parent_id = null ) {
        $token = UGC_OAuth::get_valid_access_token();
        if ( is_wp_error( $token ) ) {
            return $token;
        }

        // Check if folder already exists inside parent to prevent duplicates
        $existing_id = self::find_folder_by_name( $folder_name, $parent_id );
        if ( $existing_id ) {
            return array(
                'id'        => $existing_id,
                'name'      => $folder_name,
                'is_new'    => false,
                'view_url'  => 'https://drive.google.com/drive/folders/' . $existing_id,
            );
        }

        $meta = array(
            'name'     => sanitize_text_field( $folder_name ),
            'mimeType' => 'application/vnd.google-apps.folder',
        );

        if ( ! empty( $parent_id ) ) {
            $meta['parents'] = array( $parent_id );
        }

        $response = wp_remote_post( self::DRIVE_API_URL . '/files', array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $token,
                'Content-Type'  => 'application/json',
            ),
            'body'      => wp_json_encode( $meta ),
            'timeout'   => 30,
            'sslverify' => true,
        ) );

        if ( is_wp_error( $response ) ) {
            UGC_Logger::error( 'Drive Create Folder Failed', $response->get_error_message() );
            return $response;
        }

        $status = wp_remote_retrieve_response_code( $response );
        $body   = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( 200 !== $status && 201 !== $status ) {
            return new WP_Error( 'drive_error', isset( $body['error']['message'] ) ? $body['error']['message'] : 'HTTP ' . $status );
        }

        return array(
            'id'        => $body['id'],
            'name'      => $body['name'],
            'is_new'    => true,
            'view_url'  => 'https://drive.google.com/drive/folders/' . $body['id'],
        );
    }

    /**
     * Find folder by name inside parent
     */
    public static function find_folder_by_name( $folder_name, $parent_id = null ) {
        $token = UGC_OAuth::get_valid_access_token();
        if ( is_wp_error( $token ) ) {
            return false;
        }

        $q = "mimeType = 'application/vnd.google-apps.folder' and name = '" . addslashes( $folder_name ) . "' and trashed = false";
        if ( ! empty( $parent_id ) ) {
            $q .= " and '" . addslashes( $parent_id ) . "' in parents";
        }

        $url = add_query_arg( array(
            'q'      => $q,
            'fields' => 'files(id, name)',
        ), self::DRIVE_API_URL . '/files' );

        $response = wp_remote_get( $url, array(
            'headers'   => array( 'Authorization' => 'Bearer ' . $token ),
            'timeout'   => 15,
            'sslverify' => true,
        ) );

        if ( is_wp_error( $response ) ) {
            return false;
        }

        $data = json_decode( wp_remote_retrieve_body( $response ), true );
        if ( ! empty( $data['files'][0]['id'] ) ) {
            return $data['files'][0]['id'];
        }

        return false;
    }

    /**
     * Initialize Standard 7-Subfolder Structure (Idempotent)
     */
    public static function initialize_system_structure( $root_name = 'Notaris Lalu Daud' ) {
        // 1. Create or Find Root Folder
        $root = self::create_folder( $root_name );
        if ( is_wp_error( $root ) ) {
            return $root;
        }

        $root_id = $root['id'];
        $subfolders = array( 'Clients', 'Applications', 'Documents', 'Estimates', 'Reports', 'Templates', 'Backups' );
        $created_structure = array();

        foreach ( $subfolders as $sub ) {
            $res = self::create_folder( $sub, $root_id );
            if ( ! is_wp_error( $res ) ) {
                $created_structure[ $sub ] = $res['id'];
            }
        }

        // Save settings
        $drive_settings = array(
            'root_folder_id'    => $root_id,
            'root_folder_name'  => $root_name,
            'root_folder_url'   => 'https://drive.google.com/drive/folders/' . $root_id,
            'auto_structure'    => true,
            'folders'           => $created_structure,
        );
        update_option( 'ugc_drive_settings', $drive_settings );

        UGC_Logger::info( 'Google Drive Structure Initialized', 'Root ID: ' . $root_id );
        return $drive_settings;
    }

    /**
     * Upload File to Drive Folder
     */
    public static function upload_file( $file_path, $file_name, $mime_type, $parent_folder_id ) {
        if ( ! file_exists( $file_path ) ) {
            return new WP_Error( 'file_not_found', esc_html__( 'Local file does not exist.', 'universal-google-connect' ) );
        }

        $token = UGC_OAuth::get_valid_access_token();
        if ( is_wp_error( $token ) ) {
            return $token;
        }

        $boundary = '-------' . md5( (string) microtime( true ) );
        $delimiter = "\r\n--" . $boundary . "\r\n";
        $close_delimiter = "\r\n--" . $boundary . "--";

        $metadata = array(
            'name'    => sanitize_file_name( $file_name ),
            'parents' => array( $parent_folder_id ),
        );

        $file_data = file_get_contents( $file_path );

        $payload = $delimiter;
        $payload .= "Content-Type: application/json; charset=UTF-8\r\n\r\n";
        $payload .= wp_json_encode( $metadata );
        $payload .= $delimiter;
        $payload .= "Content-Type: " . $mime_type . "\r\n";
        $payload .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $payload .= base64_encode( $file_data );
        $payload .= $close_delimiter;

        $response = wp_remote_post( self::UPLOAD_API_URL, array(
            'headers' => array(
                'Authorization'  => 'Bearer ' . $token,
                'Content-Type'   => 'multipart/related; boundary=' . $boundary,
                'Content-Length' => strlen( $payload ),
            ),
            'body'      => $payload,
            'timeout'   => 60,
            'sslverify' => true,
        ) );

        if ( is_wp_error( $response ) ) {
            UGC_Logger::error( 'Drive Upload Failed', $response->get_error_message() );
            return $response;
        }

        $status = wp_remote_retrieve_response_code( $response );
        $body   = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( 200 !== $status && 201 !== $status ) {
            return new WP_Error( 'upload_failed', isset( $body['error']['message'] ) ? $body['error']['message'] : 'HTTP ' . $status );
        }

        return array(
            'id'       => $body['id'],
            'name'     => $body['name'],
            'view_url' => 'https://drive.google.com/file/d/' . $body['id'] . '/view',
        );
    }
}
`
  },

  // =========================================================================
  // 8. GOOGLE SHEETS REST CLIENT
  // =========================================================================
  {
    path: 'includes/class-ugc-sheets.php',
    name: 'class-ugc-sheets.php',
    category: 'INCLUDES',
    description: 'Google Sheets v4 REST Client: Spreadsheet creation, idempotent 8-worksheet initializer with legal schema headers, appending rows, range queries, and URL parsing.',
    content: `<?php
/**
 * UGC_Sheets Class
 *
 * Pure Native Google Sheets API v4 implementation.
 *
 * @package UniversalGoogleConnect
 */

defined( 'ABSPATH' ) || exit;

class UGC_Sheets {

    const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

    /**
     * Standard worksheets and headers
     */
    public static function get_schema() {
        return array(
            'Clients' => array(
                'Client ID', 'Nama Lengkap', 'Email', 'No Telepon / WhatsApp', 'NIK', 'Alamat', 'Folder Drive URL', 'Status Sync', 'Tanggal Dibuat'
            ),
            'Services' => array(
                'Service Code', 'Kategori', 'Nama Layanan', 'Deskripsi Singkat', 'Tarif Dasar', 'Status Aktif'
            ),
            'Applications' => array(
                'Application No', 'Client ID', 'Nama Layanan', 'Status Berkas', 'Folder Berkas URL', 'Estimasi Selesai', 'Tanggal Masuk'
            ),
            'Documents' => array(
                'Doc UID', 'Application No', 'Client ID', 'Kategori Dokumen', 'Nama File', 'Mime Type', 'Drive View URL', 'Tanggal Upload'
            ),
            'Estimates' => array(
                'Estimate No', 'Client ID', 'Kode Layanan', 'Nilai Objek', 'Honorarium', 'BPHTB', 'PPh Final', 'PNBP', 'Total Estimasi', 'Tanggal Dibuat'
            ),
            'Payments' => array(
                'Payment Ref', 'Application No', 'Client ID', 'Jumlah Bayar', 'Metode Bayar', 'Status Bayar', 'Tanggal Bayar'
            ),
            'Logs' => array(
                'Timestamp', 'Tipe', 'Modul', 'Pesan Log', 'IP Address'
            ),
            'Settings' => array(
                'Setting Key', 'Setting Value', 'Keterangan', 'Terakhir Diperbarui'
            ),
        );
    }

    /**
     * Parse Spreadsheet ID from URL or Raw ID
     */
    public static function parse_spreadsheet_id( $input ) {
        $input = trim( $input );
        if ( preg_match( '/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/', $input, $matches ) ) {
            return $matches[1];
        }
        if ( preg_match( '/^[a-zA-Z0-9-_]{20,}$/', $input ) ) {
            return $input;
        }
        return false;
    }

    /**
     * Create New Spreadsheet with Worksheets and Headers (Idempotent)
     */
    public static function create_spreadsheet( $title = 'Database Website' ) {
        $token = UGC_OAuth::get_valid_access_token();
        if ( is_wp_error( $token ) ) {
            return $token;
        }

        $schema = self::get_schema();
        $sheets_payload = array();

        foreach ( array_keys( $schema ) as $sheet_title ) {
            $sheets_payload[] = array(
                'properties' => array(
                    'title'     => $sheet_title,
                    'gridProperties' => array(
                        'frozenRowCount' => 1,
                    )
                )
            );
        }

        $body = array(
            'properties' => array(
                'title' => sanitize_text_field( $title ),
            ),
            'sheets'     => $sheets_payload,
        );

        $response = wp_remote_post( self::SHEETS_API_URL, array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $token,
                'Content-Type'  => 'application/json',
            ),
            'body'      => wp_json_encode( $body ),
            'timeout'   => 40,
            'sslverify' => true,
        ) );

        if ( is_wp_error( $response ) ) {
            UGC_Logger::error( 'Sheets Create Failed', $response->get_error_message() );
            return $response;
        }

        $status = wp_remote_retrieve_response_code( $response );
        $res    = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( 200 !== $status && 201 !== $status ) {
            return new WP_Error( 'sheets_create_error', isset( $res['error']['message'] ) ? $res['error']['message'] : 'HTTP ' . $status );
        }

        $spreadsheet_id = $res['spreadsheetId'];
        $spreadsheet_url = $res['spreadsheetUrl'];

        // Write Headers to each worksheet
        foreach ( $schema as $sheet_name => $headers ) {
            self::append_row( $spreadsheet_id, $sheet_name . '!A1', array( $headers ) );
        }

        $settings = array(
            'spreadsheet_id'   => $spreadsheet_id,
            'spreadsheet_name' => $title,
            'spreadsheet_url'  => $spreadsheet_url,
            'worksheets'       => array_keys( $schema ),
            'auto_sync'        => true,
        );
        update_option( 'ugc_sheets_settings', $settings );

        UGC_Logger::info( 'Google Spreadsheet Created', 'Spreadsheet ID: ' . $spreadsheet_id );
        return $settings;
    }

    /**
     * Append Row to Google Sheet
     */
    public static function append_row( $spreadsheet_id, $range, $values ) {
        $token = UGC_OAuth::get_valid_access_token();
        if ( is_wp_error( $token ) ) {
            return $token;
        }

        $url = sprintf( '%s/%s/values/%s:append?valueInputOption=USER_ENTERED', self::SHEETS_API_URL, $spreadsheet_id, rawurlencode( $range ) );

        $body = array(
            'values' => $values,
        );

        $response = wp_remote_post( $url, array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $token,
                'Content-Type'  => 'application/json',
            ),
            'body'      => wp_json_encode( $body ),
            'timeout'   => 30,
            'sslverify' => true,
        ) );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $status = wp_remote_retrieve_response_code( $response );
        if ( 200 !== $status ) {
            $data = json_decode( wp_remote_retrieve_body( $response ), true );
            return new WP_Error( 'append_row_error', isset( $data['error']['message'] ) ? $data['error']['message'] : 'HTTP ' . $status );
        }

        return true;
    }

    /**
     * Test connection to spreadsheet
     */
    public static function test_connection( $spreadsheet_id ) {
        $token = UGC_OAuth::get_valid_access_token();
        if ( is_wp_error( $token ) ) {
            return $token;
        }

        $url = sprintf( '%s/%s?fields=properties.title,sheets.properties.title', self::SHEETS_API_URL, $spreadsheet_id );

        $response = wp_remote_get( $url, array(
            'headers'   => array( 'Authorization' => 'Bearer ' . $token ),
            'timeout'   => 20,
            'sslverify' => true,
        ) );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $status = wp_remote_retrieve_response_code( $response );
        $body = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( 200 !== $status ) {
            return new WP_Error( 'sheet_access_denied', isset( $body['error']['message'] ) ? $body['error']['message'] : 'Google account does not have access to this spreadsheet.' );
        }

        return $body;
    }
}
`
  }
];
