<?php

/**
 * Add WP Dialog Easy scripts in wp-admin.
 */
add_action( 'admin_enqueue_scripts', 'custom_dialog_embed' );
function custom_dialog_embed(): void {
    // define paths: adjust if necessary.
    $path = trailingslashit(plugin_dir_path(__FILE__)).'vendor/threadi/wp-easy-dialog/';
    $url = trailingslashit(plugin_dir_url(__FILE__)).'vendor/threadi/wp-easy-dialog/';

    // bail if path does not exist.
    if( !file_exists($path) ) {
        return;
    }

    // get assets path.
    $script_asset_path = $path . 'build/index.asset.php';

    // bail if assets does not exist.
    if( !file_exists($script_asset_path) ) {
        return;
    }

    // embed the dialog-components JS-script.
    $script_asset      = require( $script_asset_path );
    wp_enqueue_script(
        'wp-easy-dialog',
        $url . 'build/index.js',
        $script_asset['dependencies'],
        $script_asset['version'],
        true
    );

    // embed the dialog-components CSS-script.
    $admin_css      = $url . 'build/style-index.css';
    $admin_css_path = $path . 'build/style-index.css';
    wp_enqueue_style(
        'wp-easy-dialog',
        $admin_css,
        array( 'wp-components' ),
        filemtime( $admin_css_path )
    );
}