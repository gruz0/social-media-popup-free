$j = jQuery.noConflict();

$j(document).ready(function() {
	var SCP_PREFIX = 'scp-';

	// Клик по табу и открытие соответствующей вкладки
	$j('#scp_welcome_screen ul.tabs').on('click', 'li:not(.current)', function() {
		$j(this).addClass('current').siblings().removeClass('current')
		.parents('#scp_welcome_screen').find('div.box').eq($j(this).index()).fadeIn(150).siblings('div.box').hide();
	});

	// Add Color Picker
	colorFields = new Array();
	colorFields.push('#scp-setting_overlay_color');
	colorFields.push('#scp-setting_vkontakte_color_background');
	colorFields.push('#scp-setting_vkontakte_color_text');
	colorFields.push('#scp-setting_vkontakte_color_button');

	$j(colorFields.join(',')).wpColorPicker();

	$j('#scp_upload_background_image').click(function() {
		tb_show('Upload a background image', 'media-upload.php?referer=social_media_popup&type=image&TB_iframe=true&post_id=0', false);

		window.scp_restore_send_to_editor = window.send_to_editor;
		window.send_to_editor = function(html) {
			$j('.scp-background-image').html(html);
			var image_src = $j('.scp-background-image img').attr('src');
			$j('#scp_background_image').val(image_src);
			tb_remove();

			window.send_to_editor = window.scp_restore_send_to_editor;
		}

		return false;
	});

	// Сортировка табов соц. сетей
	if ($j('#scp-sortable').length) {
		$j('#scp-sortable').sortable({
			revert: true,
			update: function(event, ui) {
				var networks = [];
				$j('#scp-sortable li').each(function() {
					networks.push($j(this).text());
				});
				$j('#scp-setting_tabs_order').val(networks.join(','));
			}
		});
		$j('ul, li').disableSelection();
	}

	/**
	 * Блокируем или разблокируем поля для ввода значений в зависимости от состояния чекбоксов
	 * "При наступлении каких событий показывать окно плагина".
	 */
	function setRelatedObjectStateDependsOnCheckbox(checkboxSuffix, relatedObjectPrefix) {
		if (typeof(relatedObjectPrefix) == 'undefined') {
			relatedObjectPrefix = '';
		}

		var $checkboxes = $j('.' + SCP_PREFIX + checkboxSuffix);

		if ($checkboxes.length == 0) return;

		$checkboxes.each(function() {
			var $relatedObject = $j('#' + SCP_PREFIX + relatedObjectPrefix + $j(this).val());
			checked = $j(this).is(':checked');

			if (checked) {
				$relatedObject.removeAttr('disabled');
			} else {
				$relatedObject.attr('disabled', 'disabled');
			}

			switch($j(this).val()) {
				case 'after_clicking_on_element': {
					$j('#' + SCP_PREFIX + 'event_hide_element_after_click_on_it').prop('disabled', !checked);
					break;
				}
			}
		});
	}

	/**
	 * Формирует строку со значениями выбранных опций событий отображения окна.
	 * Конечное значение формируется из value-атрибута каждого выбранного чекбокса.
	 *
	 * @param {string} checkboxClassName
	 * @param {string} targetObjectSuffix
	 * @param {string} relatedObjectPrefix
	 */
	function prepareResultStringForEvents(checkboxClassName, targetObjectSuffix, relatedObjectPrefix) {
		var $result      = $j('#' + SCP_PREFIX + targetObjectSuffix);
		var resultString = '';
		var className    = checkboxClassName;

		$j(className).each(function() {
			if ($j(this).is(':checked')) {
				resultString += $j(this).val() + ',';
			}
		});

		$result.val(resultString);

		setRelatedObjectStateDependsOnCheckbox(targetObjectSuffix, relatedObjectPrefix);
	}

	$j('.' + SCP_PREFIX + 'when_should_the_popup_appear').on('click', function() {
		var className = '.' + $j(this).attr('class');
		prepareResultStringForEvents(className, 'when_should_the_popup_appear', 'popup_will_appear_');
	});

	$j('.' + SCP_PREFIX + 'who_should_see_the_popup').on('click', function() {
		var className = '.' + $j(this).attr('class');
		prepareResultStringForEvents(className, 'who_should_see_the_popup');
	});

	$j('.' + SCP_PREFIX + 'setting_facebook_tabs').on('click', function() {
		var className = '.' + $j(this).attr('class');
		prepareResultStringForEvents(className, 'setting_facebook_tabs');
	});

	// Установим состояние текстовых полей и других объектов в зависимости от выбранных чекбоксов
	setRelatedObjectStateDependsOnCheckbox('when_should_the_popup_appear', 'popup_will_appear_');
	setRelatedObjectStateDependsOnCheckbox('who_should_see_the_popup');
});
