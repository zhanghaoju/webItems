/*点击时动态效果*/
$(function(){
	$('.newsModule').on('click',function(){
		$(this).addClass('animated pulse').siblings('.newsModule').removeClass('pulse');
	})
});
