const inquirer = require('inquirer');

require('colors')

const menuOptions = [
    {
        type: 'list',
        name: 'option',
        message: '¿Que desea hacer?',
        choices: [
            {
                value:1,
                name:`${'1.'.green} Buscar ciudad`
            },
            {
                value:2,
                name:`${'2.'.green} Historial`
            },
            {
                value:0,
                name:`${'0.'.green} Salir`
            },
        ]
    }
]

const pausaMenu = [
    {
         type: 'input',
         name: 'pausa',
         message: `Presione ${'Enter'.green} para continuar`
    }
]


const inquirerMenu = async()=>{
    console.clear();
    console.log('=============================='.green);
    console.log('     Seleccione una opcion'.green);
    console.log('==============================\n'.green);
    const {option} = await inquirer.prompt(menuOptions)   
    return option
}

const inquirerPausa = async()=>{
    const {pausa} = await inquirer.prompt(pausaMenu)
    console.log('\n');
    return pausa
}

const leerInput = async (message)=>{
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value){
                if(value.length === 0){
                     return 'Por favor ingrese un valor'
                }
                return true
            }
        }
    ]
    const {desc} = await inquirer.prompt(question)
    return desc
}

const listarLugares = async(lugares = [])=>{
    
    const choices = lugares.map((el,i) => {
        const idx = `${i+1}.`.green
        return{
            value: el.id,
            name: `${idx} ${el.nombre}`
        }
    })

    choices.unshift({
        value:'0',
        name: '0'.green + ' Cancelar'
    })
    
    const {id} = await inquirer.prompt([{
        type:'list',
        name:'id',
        message:'Seleccione lugar:',
        choices
    }])
    return id
}

const confirmar = async (message)=>{
    const question = [{
        type: 'confirm',
        name:'ok',
        message
    }]
    const {ok} =await inquirer.prompt(question)
    return ok
}

const mostrarListadoChecklist = async(tareas = [])=>{
    
    const choices = tareas.map((el,i) => {        
        const idx = `${i+1}.`.green
        return{
            value: el.id,
            name: `${idx} ${el.desc}`,
            checked: false
        }
    })
    
    const {ids} = await inquirer.prompt([{
        type:'checkbox',
        name:'ids',
        message:'¿Que tarea desea seleccionar?',
        choices
    }])
    return ids
}

module.exports = {
    inquirerMenu,
    inquirerPausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist 
}