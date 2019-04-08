//Lizzie M. Guajardo Mozo
//A00818258
//Lab 6

const express = require('express')
const path = require ('path')
const weather = require('./weather.js')

const app = express()

const port = process.env.PORT || 3000 //**

const publicDir = path.join(__dirname, 'public')
app.use(express.static(publicDir))

//http://localhost:3000
app.get('/', function(req,res){
	res.send('<h1>Lab 6 Weather Web Server!<h1>')
})

//Search correcto: http://localhost:3000/weather?search=monterrey
//Search incorrecto: http://localhost:3000/weather?monterrey
app.get('/weather/',function(req,res){
	//ESSTA LINEA PERMITE QUE LLEGUEN REQUEST DE DONDE SEA, AUNQUE SEAN LOCALES
	res.setHeader('Access-Control-Allow-Origin','*');
	if(!req.query.search ){
		return res.send({
			error:"Debes enviar una ciudad"
		})
	}
	else{
		weather.cityWeather(req.query.search,function(error,response){
			if(error){
				return res.send({
					error: error
				})
			}
			else{
				res.send({
					location:response.location,
					weather: response.weather
				})
			}
		})			
	}
})

//Por si se accesa a un pagina que no existe
//http://localhost:3000/aboutasdfasdfasdfadf
app.get('*',function(req,res){
	res.send({
		error: 'Esta ruta no existe'
	})
})

//En el puerto 3000
app.listen(port,function(){
	console.log('up and running')
})


//npm install express 
//Para que cuando actualices se corre automaticamente
//npm install -g nodemon
//nodemon app.js