//Lizzie M. Guajardo Mozo
//A00818258
//Lab 6
//**
const request = require ('request')

if(process.env.NODE_ENV === 'production'){
	var DARK_SKY_SECRET_KEY = process.env.DARK_SKY_SECRET_KEY
	var MAPBOX_TOKEN = process.env.MAPBOX_TOKEN

}else{
	const credentials = require('./credentials.js')
	var DARK_SKY_SECRET_KEY = credentials.DARK_SKY_SECRET_KEY
	var MAPBOX_TOKEN = credentials.MAPBOX_TOKEN
}
//**

//"Despejado durante el día. Actualmente esta a 4°C. Hay 80% de posibilidad de lluvia."

const coordinatesWeather = function(latitude,longitude,city,callback){
	//  https://api.darksky.net/forecast/[key]/[latitude],[longitude]
	const url = 'https://api.darksky.net/forecast/'+DARK_SKY_SECRET_KEY
	+'/'+latitude+','+longitude+'?lang=es&units=si'
	request({url:url, json:true}, function(error,response){
		if(error){//no se puede acceder a la liga
			callback('Service unavailabe', undefined)
		}
		else if(response.statusCode == 403){//For invalid key
			callback('Not Authorized - Invalid Token', undefined)
		}
		else if(response.statusCode == 400){//For invalid coordinates
			callback(response.body.error, undefined)
		}
		else{
			const data = response.body
			const info = {
				summary: data.hourly.summary,	
				temperature: data.currently.temperature,		
				//multiplicado por 100 para mostrar número como porcentaje	
				rainProb: (data.currently.precipProbability)*100
			}

			const infoToReturn = {
				location: city,
				weather: info.summary+' Actualmente esta a '+info.temperature+'°C. Hay '+info.rainProb
				+'% de posibilidad de lluvia.'
			}
			callback(undefined, infoToReturn)
		}
	})
}



const cityWeather = function(city,callback){
	//https://api.mapbox.com/geocoding/v5/mapbox.places/[City].json?access_token=[token]
	const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+city+'.json?access_token='
	+MAPBOX_TOKEN

	request({url:url, json:true}, function(error,response){
		if(error){//no se puede acceder a la liga
			callback('Service unavailabe', undefined)
		}
		else if(response.body.message == 'Not Authorized - Invalid Token' || response.body.message == 'Not Found'){//Key incorrecta
			callback(response.body.message, undefined)
		}
		else if(response.body.features == ''){//Ciudad sin información
			callback('City not found', undefined)
		}
		else{
			const data = response.body
			const info = 
			{
				longitude : data.features[0].geometry.coordinates[0],
				latitude : data.features[0].geometry.coordinates[1]
			}

			coordinatesWeather(info.latitude,info.longitude,city,function(error,response){
			if(error){
				callback(undefined, error)
			}else{
				callback(undefined, response)
			}
		})
	}

})
}

module.exports = {
  cityWeather: cityWeather,
  coordinatesWeather: coordinatesWeather
}