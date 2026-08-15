import { PluginFile } from './pluginTypes';

export const PLUGIN_NOTARY_TEMPLATES_ASSETS_FILES: PluginFile[] = [
  // =========================================================================
  // 1. TEMPLATE: FORM SUBMISSION (SHORTCODE [ldn_application_form])
  // =========================================================================
  {
    path: 'templates/form-submission.php',
    name: 'form-submission.php',
    category: 'TEMPLATES',
    description: 'Public Legal Service Intake Form: Captures Name, NIK, WhatsApp, Email, Service Type, Notes, and passes them to WordPress REST API with HMAC.',
    content: `<?php
/**
 * Frontend Application Submission Form [ldn_application_form]
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;
?>

<div class="ldn-form-container">
    <div class="ldn-form-card">
        <div class="ldn-form-card-header">
            <span class="ldn-badge-tag">Pelayanan Resmi</span>
            <h2>Formulir Pengajuan Layanan Notaris & PPAT</h2>
            <p>Kantor Notaris & PPAT Lalu Daud Nurjadi, S.H., M.Kn. — Mataram, Nusa Tenggara Barat</p>
        </div>

        <form id="ldn-public-submission-form">
            <div class="ldn-grid-2">
                <div class="ldn-field-group">
                    <label for="ldn_input_name">Nama Lengkap (Sesuai KTP) <span class="ldn-req">*</span></label>
                    <input type="text" id="ldn_input_name" name="name" required placeholder="Contoh: Budi Santoso">
                </div>

                <div class="ldn-field-group">
                    <label for="ldn_input_nik">Nomor Induk Kependudukan (NIK) <span class="ldn-req">*</span></label>
                    <input type="text" id="ldn_input_nik" name="nik" maxlength="16" required placeholder="16 digit NIK">
                    <small class="ldn-field-hint">NIK Anda dienkripsi dan dilindungi secara hukum.</small>
                </div>
            </div>

            <div class="ldn-grid-2">
                <div class="ldn-field-group">
                    <label for="ldn_input_phone">Nomor WhatsApp Aktif <span class="ldn-req">*</span></label>
                    <input type="tel" id="ldn_input_phone" name="phone" required placeholder="08123456789">
                </div>

                <div class="ldn-field-group">
                    <label for="ldn_input_email">Alamat Email <span class="ldn-req">*</span></label>
                    <input type="email" id="ldn_input_email" name="email" required placeholder="budi@example.com">
                </div>
            </div>

            <div class="ldn-field-group">
                <label for="ldn_select_service">Jenis Layanan Hukum <span class="ldn-req">*</span></label>
                <select id="ldn_select_service" name="service_id" required>
                    <option value="AJB">Akta Jual Beli (AJB Tanah / Bangunan)</option>
                    <option value="PENDIRIAN_PT">Pendirian PT / CV / Badan Usaha / Yayasan</option>
                    <option value="WARIS_HIBAH">Akta Pembagian Hak Bersama (APHB) / Waris / Hibah</option>
                    <option value="PRENUP">Perjanjian Perkawinan (Prenuptial Agreement)</option>
                    <option value="SKMHT_APHT">Hak Tanggungan (SKMHT & APHT)</option>
                    <option value="KONSULTASI">Konsultasi Hukum Kenotariatan & Pertanahan</option>
                </select>
            </div>

            <div class="ldn-field-group">
                <label for="ldn_input_desc">Uraian Kebutuhan & Catatan Tambahan</label>
                <textarea id="ldn_input_desc" name="description" rows="4" placeholder="Jelaskan objek transaksi, lokasi tanah, atau spesifikasi badan usaha yang ingin didirikan..."></textarea>
            </div>

            <button type="submit" class="ldn-btn-submit-primary" id="ldn-btn-submit-application">
                Kirim Permohonan & Buka Berkas Perkara
            </button>
            <div id="ldn-form-feedback" class="ldn-feedback-msg" style="display:none;"></div>
        </form>
    </div>
</div>
`
  },

  // =========================================================================
  // 2. TEMPLATE: FEE CALCULATOR (SHORTCODE [ldn_fee_calculator])
  // =========================================================================
  {
    path: 'templates/fee-calculator.php',
    name: 'fee-calculator.php',
    category: 'TEMPLATES',
    description: 'Dynamic Notary & PPAT Fee Estimator: Calculates Base Fee + Admin + Materai + Service Fee in real-time.',
    content: `<?php
/**
 * Dynamic Fee Calculator [ldn_fee_calculator]
 *
 * @package LaluDaudNotary
 */

defined( 'ABSPATH' ) || exit;
?>

<div class="ldn-calculator-wrap">
    <div class="ldn-calc-header">
        <h3>Kalkulator Estimasi Biaya Layanan Notaris & PPAT</h3>
        <p>Hitung perkiraan biaya pembuatan akta, legalisasi, dan sertifikasi tanah secara transparan.</p>
    </div>

    <div class="ldn-calc-body">
        <div class="ldn-field-group">
            <label for="ldn_calc_service">Pilih Layanan</label>
            <select id="ldn_calc_service">
                <option value="AJB">Akta Jual Beli (AJB Tanah)</option>
                <option value="PENDIRIAN_PT">Pendirian PT / CV / Yayasan</option>
                <option value="WARIS_HIBAH">Akta Waris / Hibah / APHB</option>
                <option value="PRENUP">Perjanjian Perkawinan (Prenup)</option>
            </select>
        </div>

        <div class="ldn-field-group" id="ldn_calc_val_group">
            <label for="ldn_calc_object_value">Nilai Transaksi / Objek (Rp)</label>
            <input type="number" id="ldn_calc_object_value" value="500000000" step="10000000" placeholder="500000000">
        </div>

        <button type="button" class="ldn-btn-primary" id="ldn-btn-calculate-now">Hitung Estimasi Biaya</button>

        <div class="ldn-calc-result-box" id="ldn-calc-result" style="display:none;">
            <h4>Rincian Estimasi Biaya</h4>
            <div class="ldn-calc-row"><span>Biaya Dasar Akta:</span> <strong id="res-base">Rp 0</strong></div>
            <div class="ldn-calc-row"><span>Biaya Administrasi & Pengecekan:</span> <strong id="res-admin">Rp 250.000</strong></div>
            <div class="ldn-calc-row"><span>Biaya Materai Resmi:</span> <strong id="res-materai">Rp 50.000</strong></div>
            <div class="ldn-calc-row"><span>Jasa Profesional Notaris:</span> <strong id="res-jasa">Rp 0</strong></div>
            <div class="ldn-calc-total-row"><span>Total Estimasi:</span> <strong id="res-total">Rp 0</strong></div>
        </div>
    </div>
</div>
`
  },

  // =========================================================================
  // 3. ASSETS: ADMIN CSS & JS (NAVY & GOLD IDENTITY)
  // =========================================================================
  {
    path: 'assets/css/notary-admin.css',
    name: 'notary-admin.css',
    category: 'ASSETS',
    description: 'Admin CSS: Scoped typography, Navy (#0A192F) and Gold (#D4AF37) branding, and responsive layout.',
    content: `/* Lalu Daud Notary Admin CSS */
.ldn-admin-wrap {
    margin-top: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    color: #1e293b;
}

.ldn-admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.ldn-badge-version {
    font-size: 12px;
    background: #0a192f;
    color: #d4af37;
    padding: 3px 8px;
    border-radius: 12px;
    vertical-align: middle;
    font-weight: 700;
}

.ldn-metric-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.ldn-metric-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
}

.ldn-metric-card.is-highlight { border-left: 4px solid #0a192f; }
.ldn-metric-card.is-warning { border-left: 4px solid #f59e0b; }
.ldn-metric-card.is-gold { border-left: 4px solid #d4af37; }
.ldn-metric-card.is-success { border-left: 4px solid #10b981; }

.ldn-metric-card h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
    color: #0a192f;
}

.ldn-metric-card p {
    margin: 4px 0 0 0;
    font-size: 13px;
    color: #64748b;
}

.ldn-panel {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 24px;
    margin-bottom: 24px;
}

.ldn-status-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
}

.status-submitted { background: #e0f2fe; color: #0284c7; }
.status-verification { background: #fef3c7; color: #d97706; }
.status-processing { background: #f3e8ff; color: #9333ea; }
.status-waiting_signature { background: #fef9c3; color: #ca8a04; }
.status-completed { background: #dcfce7; color: #16a34a; }
.status-active { background: #dcfce7; color: #16a34a; }

.ldn-masked-pill {
    background: #f1f5f9;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 13px;
}
`
  },
  {
    path: 'assets/js/notary-admin.js',
    name: 'notary-admin.js',
    category: 'ASSETS',
    description: 'Admin JS: Handlers for settings save, Google Apps Script connection test, and inline status updates.',
    content: `/* Lalu Daud Notary Admin JS */
(function($) {
    'use strict';

    $(document).ready(function() {
        // Test Google Apps Script Connection
        $('#ldn-btn-test-gas, #ldn-btn-test-conn').on('click', function(e) {
            e.preventDefault();
            var $btn = $(this);
            $btn.prop('disabled', true).text('Menguji Koneksi HMAC...');

            $.post(LDN_ADMIN_VARS.ajaxUrl, {
                action: 'ldn_test_gas_connection',
                nonce: LDN_ADMIN_VARS.nonce
            }, function(res) {
                $btn.prop('disabled', false).text('Test Google Apps Script');
                if (res.success) {
                    alert(res.data.message || 'Koneksi ke Google Apps Script Berhasil!');
                } else {
                    alert('Gagal: ' + (res.data.message || 'Respons tidak valid'));
                }
            });
        });

        // Save Settings Form
        $('#ldn-settings-form').on('submit', function(e) {
            e.preventDefault();
            var $form = $(this);
            var data = $form.serialize() + '&action=ldn_save_settings&nonce=' + LDN_ADMIN_VARS.nonce;

            $.post(LDN_ADMIN_VARS.ajaxUrl, data, function(res) {
                if (res.success) {
                    alert('Pengaturan berhasil disimpan!');
                } else {
                    alert('Gagal menyimpan: ' + (res.data.message || 'Error'));
                }
            });
        });

        // Quick Status Change on Cases List
        $('.ldn-quick-status-change').on('change', function() {
            var caseId = $(this).data('case-id');
            var newStatus = $(this).val();

            $.post(LDN_ADMIN_VARS.ajaxUrl, {
                action: 'ldn_admin_update_case_status',
                nonce: LDN_ADMIN_VARS.nonce,
                case_id: caseId,
                status: newStatus
            }, function(res) {
                if (res.success) {
                    location.reload();
                } else {
                    alert('Gagal memperbarui status: ' + (res.data.message || 'Error'));
                }
            });
        });
    });
})(jQuery);
`
  },

  // =========================================================================
  // 4. ASSETS: CLIENT CSS & JS
  // =========================================================================
  {
    path: 'assets/css/notary-client.css',
    name: 'notary-client.css',
    category: 'ASSETS',
    description: 'Client CSS: Responsive portal layout, 6-step progress bar, document tables, and fee calculator cards.',
    content: `/* Lalu Daud Client Portal & Form CSS */
.ldn-client-wrap, .ldn-form-container, .ldn-calculator-wrap {
    max-width: 1000px;
    margin: 0 auto;
    font-family: inherit;
    box-sizing: border-box;
}

.ldn-client-wrap *, .ldn-form-container *, .ldn-calculator-wrap * {
    box-sizing: border-box;
}

.ldn-form-card, .ldn-case-card, .ldn-calc-body {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 28px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    margin-bottom: 24px;
}

.ldn-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

@media(max-width: 640px) {
    .ldn-grid-2 { grid-template-columns: 1fr; }
}

.ldn-field-group {
    margin-bottom: 16px;
}

.ldn-field-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 6px;
    color: #0a192f;
    font-size: 14px;
}

.ldn-field-group input, .ldn-field-group select, .ldn-field-group textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 15px;
}

.ldn-btn-submit-primary, .ldn-btn-primary {
    background: #0a192f;
    color: #d4af37;
    border: 1px solid #d4af37;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    width: 100%;
    font-size: 15px;
    transition: all 0.2s;
}

.ldn-btn-submit-primary:hover, .ldn-btn-primary:hover {
    background: #1e293b;
    color: #ffffff;
}

/* 6-Stage Progress Bar */
.ldn-progress-timeline {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
    position: relative;
}

.ldn-step-item {
    text-align: center;
    flex: 1;
    position: relative;
}

.ldn-step-dot {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #e2e8f0;
    color: #64748b;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 6px;
}

.ldn-step-item.is-done .ldn-step-dot {
    background: #10b981;
    color: #ffffff;
}

.ldn-step-item.is-active .ldn-step-dot {
    background: #0a192f;
    color: #d4af37;
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
}

.ldn-step-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
}

.ldn-step-item.is-active .ldn-step-label {
    color: #0a192f;
}
`
  },
  {
    path: 'assets/js/notary-client.js',
    name: 'notary-client.js',
    category: 'ASSETS',
    description: 'Client JS: AJAX handlers for public application submission, file uploads to private Drive, and dynamic fee calculation.',
    content: `/* Lalu Daud Client Portal JS */
(function($) {
    'use strict';

    $(document).ready(function() {
        // Public Application Submission
        $('#ldn-public-submission-form').on('submit', function(e) {
            e.preventDefault();
            var $form = $(this);
            var $btn  = $('#ldn-btn-submit-application');
            var $fb   = $('#ldn-form-feedback');

            var payload = {
                name:        $form.find('#ldn_input_name').val(),
                nik:         $form.find('#ldn_input_nik').val(),
                phone:       $form.find('#ldn_input_phone').val(),
                email:       $form.find('#ldn_input_email').val(),
                service_id:  $form.find('#ldn_select_service').val(),
                description: $form.find('#ldn_input_desc').val()
            };

            $btn.prop('disabled', true).text('Mengirim & Mengunci Berkas...');

            $.ajax({
                url: LDN_CLIENT_VARS.restUrl + 'cases',
                method: 'POST',
                data: JSON.stringify(payload),
                contentType: 'application/json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', LDN_CLIENT_VARS.nonce);
                },
                success: function(res) {
                    $btn.prop('disabled', false).text('Kirim Permohonan');
                    $fb.show().removeClass('error').addClass('success').html(
                        '<strong>Permohonan Berhasil Diajukan!</strong><br>Nomor Perkara Anda: <code>' + (res.data ? res.data.case_number : '') + '</code>'
                    );
                    $form[0].reset();
                },
                error: function(xhr) {
                    $btn.prop('disabled', false).text('Kirim Permohonan');
                    $fb.show().removeClass('success').addClass('error').text(
                        'Gagal mengirim: ' + (xhr.responseJSON ? xhr.responseJSON.message : 'Terjadi kesalahan sistem.')
                    );
                }
            });
        });

        // Dynamic Fee Calculator
        $('#ldn-btn-calculate-now').on('click', function(e) {
            e.preventDefault();
            var service = $('#ldn_calc_service').val();
            var objVal  = parseFloat($('#ldn_calc_object_value').val()) || 0;

            $.ajax({
                url: LDN_CLIENT_VARS.restUrl + 'calculator/calculate',
                method: 'POST',
                data: JSON.stringify({ service_id: service, object_value: objVal }),
                contentType: 'application/json',
                success: function(res) {
                    if (res.success && res.data) {
                        $('#res-base').text('Rp ' + res.data.base_fee.toLocaleString('id-ID'));
                        $('#res-admin').text('Rp ' + res.data.admin_fee.toLocaleString('id-ID'));
                        $('#res-materai').text('Rp ' + res.data.materai_fee.toLocaleString('id-ID'));
                        $('#res-jasa').text('Rp ' + res.data.service_fee.toLocaleString('id-ID'));
                        $('#res-total').text('Rp ' + res.data.total.toLocaleString('id-ID'));
                        $('#ldn-calc-result').slideDown();
                    }
                }
            });
        });
    });
})(jQuery);
`
  }
];
