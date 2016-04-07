var qs = require('querystring');
var our_query = window.location.search.slice(1);
window.onload = function(){
	var x = qs.parse(our_query);
	console.log(x);
	document.getElementById('content').innerHTML = JSON.stringify(x)
}
