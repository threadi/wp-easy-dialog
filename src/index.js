/**
 * File to handle easy dialog for WordPress.
 *
 * @package wp-easy-dialog
 */
import './style.scss';
import { Button, Modal } from '@wordpress/components';
import React, {useState} from 'react'

/**
 * Define the easy dialog modal for WordPress.
 *
 * @returns {JSX.Element}
 * @constructor
 */
class Easy_Dialog extends React.Component {
	/**
	 * Run callback until component has been mount.
	 */
	componentDidMount() {
		if( this.props.dialog.callback ) {
			eval( this.props.dialog.callback );
		}
	}

	/**
	 * Output rendered dialog, with title, texts and buttons configured by JSON.
	 *
	 * Prepared possible button-actions:
	 * - closeDialog() => closes the dialog
	 */
	render() {
		let args = this.props;

		/**
		 * Define close action.
		 */
		const closeDialog = () => {
			wp_easy_dialog.unmount();
			wp_easy_dialog = null;
		};

		/**
		 * Define class names.
		 * @type {string}
		 */
		let classNames = "wp-easy-dialog";
		if( this.props.dialog.className ) {
			classNames = "wp-easy-dialog " + this.props.dialog.className;
		}

		return (
			<Modal
				bodyOpenClassName="wp-easy-dialog-on-body"
				className={classNames}
				isDismissible={false}
				onRequestClose={ closeDialog }
				title={args.dialog.title}
				shouldCloseOnClickOutside={false}
				shouldCloseOnEsc={false}
				__experimentalHideHeader={args.dialog.hide_title}
			>
				{args.dialog.texts && args.dialog.texts.map(function(text) {
						return (
							<div key={text} dangerouslySetInnerHTML={{__html: text}} className="wp-easy-dialog-text" />
						)
					}
				)
				}
				{args.dialog.progressbar && args.dialog.progressbar.active && (
					<div
						className="wp-progressbar"
					>
						<progress max="100" id={args.dialog.progressbar.id} value={args.dialog.progressbar.progress}>&nbsp;</progress>
						{args.dialog.progressbar.label_id && <p id={args.dialog.progressbar.label_id}></p>}
					</div>
				)}
				{args.dialog.buttons && args.dialog.buttons.map(function(button) {
						return (
							<Button key={button.text} className={button.className} variant={button.variant} onClick={ () => eval(button.action) } href={button.href}>
								{button.text}
							</Button>
						)
					}
				)
				}
			</Modal>
		)
	}
}

/**
 * Show dialog, initiated by any event.
 *
 * If dialog already exist, it will be closed.
 *
 * @type {null}
 */
let wp_easy_dialog = null;
function add_easy_dialog( dialog ) {
	if( dialog ) {
		if ( wp_easy_dialog ) {
			wp_easy_dialog.unmount();
			wp_easy_dialog = null;
		}
		if( ! top.document.getElementById('wp-easy-dialog-root') ) {
			let root = top.document.createElement('div');
			root.id = 'wp-easy-dialog-root';
			top.document.body.append(root);
		}
		wp_easy_dialog = ReactDOM.createRoot(top.document.getElementById('wp-easy-dialog-root'));
		wp_easy_dialog.render(
			<Easy_Dialog dialog={dialog}/>
		);
	}
}

/**
 * Initialize the Easy Dialog on every element with the class.
 */
function easy_dialog_init() {
	let dialog_links = document.getElementsByClassName('wp-easy-dialog');
	for( let i=0;i<dialog_links.length;i++ ) {
		if( dialog_links[i].dataset.dialog ) {
			dialog_links[i].onclick = function (e) {
				e.preventDefault();
				document.body.dispatchEvent( new CustomEvent( "wp-easy-dialog", { detail: JSON.parse( this.dataset.dialog ) } ) );
			};
		}
	}
}

/**
 * Add events where the dialog should be fired.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	// add listener which could be used to trigger the dialog with given configuration.
	document.body.addEventListener('wp-easy-dialog', function(attr) {
		if( attr.detail ) {
			add_easy_dialog(attr.detail);
		}
	});

	// add listener for reinitialization.
	document.body.addEventListener('wp-easy-dialog-reinit', function(attr) {
		easy_dialog_init();
	});

	// on each element with the class "wp-easy-dialog".
	easy_dialog_init();
})
