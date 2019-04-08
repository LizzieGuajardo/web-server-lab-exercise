let searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener("click", function(){
	var searchTerm = document.getElementById("searchterm").value;
	fetch('https://mini-web-server-lizzieg.herokuapp.com/omdb?search='+searchTerm).then(function(response){
	response.json().then(function(data){
		if(data.error){
			console.log(data.error);
		} else {
			console.log(data);
			console.log(data.title);
			console.log(data.plot);
		}
	});
})
})




/*$.ajax({
	url:'http://localhost:3000/omdb?search=Bandersnatch',
	type: 'GET',
	dataType: 'json',
	success: function(data){
		if(data.error){
			console.log(data.error);
		} else {
			console.log(data);
			console.log(data.title);
			console.log(data.plot);
		}
	},
	error: function(error){
		console.log(error);
	}
})*/