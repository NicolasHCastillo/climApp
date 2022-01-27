const fs =require('fs')
const axios = require('axios')

class Busquedas{

    historial = []
    dbPath = './db/database.json'
    constructor(){
        //TODO: leer db si es que existe
        this.leerDB()
    }
    get historialCapitalizado(){
        
        return this.historial.map(el => {
            const palabra = el.split(',')
            const arr = palabra.map((string,i)=> {
                if(i===0){
                    return (string[0].toUpperCase().concat(string.slice(1,string.length)))
                }
                return (' '.concat(string[1].toUpperCase(),string.slice(2,string.length)))
            })
            return ''.concat(arr)            
        })
    }

    get paramsMapbox(){
        return{
            'access_token':process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather(){
        return {
            'appid': process.env.OPENWEATHERMAP_KEY,
            'units':'metric',
            'lang':'es',
        }
    }

    async ciudad( lugar = ''){

        try{
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })
            const resp = await instance.get()
            return resp.data.features.map(el => ({id: el.id, nombre: el.place_name, lng: el.center[0], lat: el.center[1]}))

        }catch(error){
            console.log(error);
            return []
        }
    }

    async climaLugar(lat, lon){
        try{
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsOpenWeather, lat, lon} 
            })
            const res = await instance.get()
            return{
                desc: res.data.weather[0].description,
                min: res.data.main.temp_min,
                max: res.data.main.temp_max,
                temp: res.data.main.temp
            }
        }catch(error){
            console.log('error');
            error.toJSON()
            console.log(error.response);
            return []
        }
    }

    agregarHistorial(lugar = ''){
        //TODO prevenir duplicados
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return
        }
        this.historial.unshift(lugar.toLocaleLowerCase())
        if(this.historial.length === 6){
            this.historial.pop()
        }
        this.guardarDB()
    }
    guardarDB(){
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }
    leerDB(){
        if(!fs.existsSync(this.dbPath)) return
        const data = fs.readFileSync(this.dbPath,{encoding:'utf-8'})
        this.historial =  JSON.parse(data).historial
    }    
}

module.exports = Busquedas