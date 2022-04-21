/*搜索*/
let list = document.getElementById('list')
let searchInput = document.getElementById('searchInput')
var newDesc = $('.describe').html();
console.log(newDesc)

/*let text = f
 console.log(text.toString())*/
searchInput.addEventListener('keydown', function (event) {
	if (event.keyCode == 13) {
		/*$('#search-icon').click(function() {*/
		$('.describe').html(newDesc);
		var searchText = $('#search-input').val().trim();
		
		if (searchText.length === 0) {
			/*alert('无内容');*/
			list.innerHTML = '<span style="font-size: 12px;color: #c81623">输入框不能为空</span>';
			return false;
		}
		var regExp = new RegExp(searchText, 'gi');
		var newHtml = newDesc.replace(regExp, '<span id="result" style="background:yellow;color:red;">' + searchText + '</span>'
			)
		;
		console.log(searchText)
		if (newHtml.indexOf(searchText) === -1) {
			console.log(newHtml.indexOf(searchText))
			list.innerHTML = '<span style="font-size: 12px;color: #c81623">匹配不到对应的值</span>';
			return false;
		}
		$('.describe').html(newHtml);
		var X = $('#result').offset().top;
		var Y = $('#result').offset().left;
		window.scrollTo(X, Y);
	}
});
$('#search').click(function () {
	
	$('.describe').html(newDesc);
	var searchText = $('#search-input').val().trim();
	
	if (searchText.length == 0) {
		/*alert('无内容');*/
		list.innerHTML = '<span style="font-size: 12px;color: #c81623">输入框不能为空</span>';
		return false;
	}
	var regExp = new RegExp(searchText, 'gi');
	var newHtml = newDesc.replace(regExp, '<span id="result" style="background:yellow;color:red;">' + searchText + '</span>');
	console.log(searchText)
	if (newHtml.indexOf(searchText) === -1) {
		list.innerHTML = '<span style="font-size: 12px;color: #c81623">匹配不到对应的值</span>';
		return false;
	}
	$('.describe').html(newHtml);
	var X = $('#result').offset().top;
	var Y = $('#result').offset().left;
	window.scrollTo(X, Y);
});
searchInput.addEventListener('mouseleave', function () {
	list.innerHTML = '<span style="display: none"></span>';
})
