$(function() {
	$('#submenu_left').children().children().bind('mouseover', function() {
		$(this).addClass('on');
		$('#submenu_right').show();
		var num = $(this).attr('submenu_id');
		$('#submenu_right').find('[submenu_content="' + num + '"]').show();
	});
	$('#submenu_left').children().children().bind('mouseout', function() {
		$(this).removeClass('on');
		$('#submenu_right').hide();
		$('#submenu_right').children().hide();
	});
	$('#submenu_right').children().bind('mouseover', function() {
		$(this).parent().show();
		var num = $(this).attr('submenu_content');
		$('#submenu_left').children().find('[submenu_id="' + num + '"]').addClass('on');
		$(this).show();
	});
	$('#submenu_right').children().bind('mouseout', function() {
		$(this).parent().hide();
		$(this).hide();
		$('#submenu_left').children().children().removeClass('on');
	});
})
