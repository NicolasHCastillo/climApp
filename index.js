const {
    leerInput,
    inquirerMenu, 
    inquirerPausa, 
    listarLugares
} = require('./helpers/inquirer');
const Busquedas = require('./models/busqueda');
require('dotenv').config()
console.clear();
const main =async()=>{
    const busquedas = new Busquedas()

    let option = Number()

    do{
        option = await inquirerMenu()
        switch(option){
            case 1:
                //mostrar mensaje
                const termino = await leerInput('Ciudad: ')
                const lugares = await busquedas.ciudad(termino)
                //buscar lugares
                const idSelect = await listarLugares(lugares)
                if (idSelect === '0') continue
                //seleccionar un lugar
                const lugarSelect = lugares.find(el => el.id === idSelect)

                //gauradr en db 

                busquedas.agregarHistorial(lugarSelect.nombre)


                //clima
                const temp = await busquedas.climaLugar(lugarSelect.lat, lugarSelect.lng)
                //mostrar resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad: ' + lugarSelect.nombre.green);
                console.log('Lat: ' + `${lugarSelect.lat}`.green);
                console.log('Lon: ' + `${lugarSelect.lng}`.green);
                console.log('Temperatura: '+temp.temp);
                console.log('Maxima: '+ temp.max);
                console.log('Minima: '+temp.min);
                console.log('Descripcion: '+temp.desc.green);
            break
            case 2:
                busquedas.historialCapitalizado.forEach((el, i)=>{
                    const idx = `${i + 1}`.green
                    console.log(`${idx} ${el}`);
                })
            break
        }
        if(option != 0) await inquirerPausa()
    }while(option != 0)
}

main()