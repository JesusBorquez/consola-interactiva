require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, 
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoChecklist
} = require('./helpers/inquirer');
//const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');
// const { mostrarMenu, pausa } = require('./helpers/mensajes');

//console.clear(); 

const main = async() => {
    //console.log('Hola Mundo');

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if( tareasDB ) {  // Cargar Tareas
        tareas.cargarTareasFromArray( tareasDB );
    }

    //await pausa();

    do {
        opt = await inquirerMenu();
        //console.log({ opt });
        //if(opt !=='0') await pausa();
        //const tareas = new Tareas();
        //const tarea = new Tarea('Comprar comida');
        //tareas._listado[tarea.id] = tarea;
        //console.log(tareas);

        switch (opt) {
            case '1':
                // Crear opcion
                const desc = await leerInput('Descripción:');
                //console.log(desc);
                tareas.crearTarea( desc );
            break;
            case '2':
                //console.log( tareas.listadoArr );
                tareas.listadoCompleto();
            break;
            case '3': // Listar tareas completadas
                tareas.listarPendientesCompletadas(true);
            break;
            case '4': // Listar tareas pendientes
                tareas.listarPendientesCompletadas(false);
            break;
            case '5': // completado | pendiente
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
            break;
            case '6': // Borrar tarea
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if ( id !== '0' ) {
                    const ok = await confirmar('Está seguro?');
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada corractamente...');
                    }               
                }
            break;
        }

        guardarDB( tareas.listadoArr );

        await pausa();
    } while( opt !== '0' );

}

main();