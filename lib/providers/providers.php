<?php

class SCP_Provider {
	static $prefix = null;
	static $options = null;
	static $tabs_id = null;

	/**
	 * Returns available providers
	 *
	 * @since 0.7.3
	 *
	 * @return array
	 */
	public static function available_providers() {
		return array( 'facebook', 'vkontakte' );
	}

	/**
	 * Checks if provider is available
	 *
	 * @since 0.7.3
	 *
	 * @return boolean
	 */
	public static function exists( $provider_name ) {
		$providers = self::available_providers();
		return in_array( $provider_name, $providers );
	}

	/**
	 * Instantiate a Social Network provider
	 *
	 * @since 0.7.3
	 *
	 * @param string $provider Provider name (ex. facebook, vkontakte, etc.)
	 * @param string $prefix SCP options prefix (default: 'scp-')
	 * @param array $options Options for specific provider
	 * @return SCP_Provider
	 */
	public static function create( $provider, $prefix, $options ) {
		self::$prefix = $prefix;
		self::$options = $options;
		self::$tabs_id = self::tabs_id();

		// FIXME: Переписать на проверку провайдера в массиве available_providers()
		switch( $provider ) {
			case 'facebook': {
				require_once( dirname( __FILE__ ) . '/facebook.php' );
				return new SCP_Facebook_Provider();
			}
			break;

			case 'vkontakte': {
				require_once( dirname( __FILE__ ) . '/vkontakte.php' );
				return new SCP_VK_Provider();
			}
			break;

			default:
				throw new Exception( "Provider {$provider} is not implemented!" );
		}
	}

	/**
	 * Returns provider status
	 * Should be overridden in specific provider
	 *
	 * @since 0.7.3
	 *
	 * @return boolean
	 */
	public static function is_active() {
		throw new Exception( "Not implemented!" );
	}

	/**
	 * Returns provider options
	 * Should be overridden in specific provider
	 *
	 * @since 0.7.3
	 *
	 * @return array
	 */
	public static function options() {
		throw new Exception( "Not implemented!" );
	}

	/**
	 * Add Tab caption under widget title
	 *
	 * @since 0.7.3
	 *
	 * @param array @args
	 * @return string
	 */
	public static function tab_caption( $args ) {
		return '<li '
			. 'data-index="' . $args['index'] . '" '
			. 'class="' . $args['css_class'] . '" '
			. '><span>' . $args['tab_caption'] . '</span></li>';
	}

	/**
	 * Add Tab caption under widget title with icons for desktop devices
	 *
	 * @since 0.7.4
	 *
	 * @param array @args
	 * @return string
	 */
	public static function tab_caption_desktop_icons( $args ) {
		return '<li '
			. 'data-index="' . $args['index'] . '" '
			. 'class="' . $args['css_class'] . '" '
			. 'style="width:' . sprintf( '%0.2f', floatval( $args['width'] ) ) . '%;" '
			. '><a href="#" title="' . self::clean_tab_caption( $args['tab_caption'] ) . '">'
			. '<i class="fa ' . $args['icon'] . ' ' . $args['icon_size'] . '"></i></a></li>';
	}

	/**
	 * Returns tabs UL identifier to use in providers JS-prepend* functions
	 *
	 * @since 0.7.4
	 *
	 * @return string
	 */
	private static function tabs_id() {
		if ( self::$options[ self::$prefix . 'setting_use_icons_instead_of_labels_in_tabs' ] == 1 ) {
			return '#social-community-popup .scp-icons';
		} else {
			return '#social-community-popup .tabs';
		}
	}

	/**
	 * Abstract method returns a Social Network container
	 * Should be overridden in specific provider
	 *
	 * @since 0.7.3
	 *
	 * @return string
	 */
	public static function container() {
		throw new Exception( "Not implemented!" );
	}

	/**
	 * Removes new lines and uneccessary chars from tab caption
	 *
	 * @since 0.7.4
	 *
	 * @param string $tab_caption
	 *
	 * @return string
	 */
	private static function clean_tab_caption( $tab_caption ) {
		return trim( str_replace( "\r\n", "", $tab_caption ) );
	}
}

