import { PersistentUnorderedMap, logging, context, u128, ContractPromiseBatch,  } from 'near-sdk-as'

const TEN_NEAR = u128.from('10000000000000000000000000');

//Creamos una clase llamada Alumno y Carreras
@nearBindgen
class Alumno {
  cuenta: string;
  nombre: string;
  nombre_carrera: string;
  edad: u32;
  finalizada: bool;

  
  constructor(cuenta: string, nombre: string, edad: u32, nombre_carrera:string,) {
    this.cuenta = cuenta;
    this.nombre = nombre;
    this.nombre_carrera = nombre_carrera;
    this.edad = edad
  }
}

@nearBindgen
class Carreras {
  cuenta: string;
  nombre_carrera: string;
  semestres: u32;
  tipo: string;
  titulados:number



  constructor(cuenta: string, nombre_carrera:string,semestres: u32, tipo:string, titulados:number) {
    this.cuenta = cuenta;
    this.nombre_carrera = nombre_carrera;
    this.semestres = semestres;
    this.tipo = tipo;
    this.titulados= titulados
  }
}


const alumnos = new PersistentUnorderedMap<string, Alumno>("a");
const carreras = new PersistentUnorderedMap<string, Carreras>("c");


// Metodos del contrato

// Creamos una carrera en la universidad

export function setCarrera(nombre_carrera: string, semestres: u32, tipo: string, ): void {

  // nos aseguramos que solo uchile.testnet la cual es la cuenta de la universidad pueda crear una carrera

  assert(context.sender == "uchile.testnet", "No tienes permisos para ejecutar este comando.");

  const cuenta = context.sender

  // la inicializamos con 0 titulados

  let titulados = 0

  // verificamos que cumpla las siguentes condiciones

  assert(semestres >= 4, "La carrera debe tener minimo 4 semestres");
  assert(nombre_carrera.length >= 3, "El nombre debe contener 3 o más caractéres.");
  assert(tipo == 'profesional' || 'tecnica', "La carrera debe ser profesional o tecnica");
  

  
  let carrera = new Carreras(cuenta, nombre_carrera, semestres, tipo, titulados);
  
  // guardamos la carrera

  carreras.set(nombre_carrera, carrera);

 
  logging.log("Carrera registrada con exito");
 
}






// Un alumno se matricula


export function setAlumno(nombre: string, edad: u32, nombre_carrera: string, ): void {

  const cuenta = context.sender;
  const deposito = context.attachedDeposit;

    // comprobamos que la carrera a la cual quiere ingresar exista

   let carrera = carreras.get(nombre_carrera);

   if( carrera ){

    // evaluamo su edad, nombre y el pago que realiza que deben ser 10 near

  assert(edad >= 17, "Debes tener minimo 17 años para comenzar una carrera");
  assert(nombre.length >= 3, "El nombre debe contener 3 o más caractéres.");
  assert(deposito == TEN_NEAR, "Debes de pagar 10 NEAR para empezar una carrera universitaria.");

  let alumno = new Alumno(cuenta, nombre, edad, nombre_carrera);


  // transferimos el pago a la cuenta de la Universidad de Chile


  ContractPromiseBatch.create("uchile.testnet").transfer(u128.from(10));

  // grabamos el alumno

  alumnos.set(cuenta, alumno);

  
  logging.log("Alumnos registrado con exito");


   } else {
    logging.log("carrera no existe");
   }


   
}



// funciones para consultar por un alumno o por todos ellos


export function getAlumno(cuenta: string): Alumno | null {
  return alumnos.get(cuenta);
}


export function getAlumnos(): Alumno[] {
  return alumnos.values();
}

// funciones para consultar por una carrera en particular (para ver sus titulados por ejemplo) o por todas


export function getCarreras(): Carreras[] {
  return carreras.values();
}
export function getCarrera(nombre_carrera: string): Carreras | null{
  return carreras.get(nombre_carrera);
}


// funcion para finalizar estudios


export function setFinalizado(cuenta: string, nombre_carrera:string): bool {
 
  // verificamos que solo la cuenta de la universidad pueda titular a la persona

  assert(context.sender == "uchile.testnet", "No puedes certificar personas");

  // buscamos al alumno y que la carrera enviada sea la que estudia

  let alumno = alumnos.get(cuenta);
  let carrera = carreras.get(nombre_carrera);


  if (alumno && alumno.finalizada == false && carrera && alumno.nombre_carrera == nombre_carrera) {

    // grabamos que finalizo sus estudios y aumentamos el numero de titulados en la carrera en cuestion y lo grabamos 

    alumno.finalizada = true;
    carrera.titulados++

  

    alumnos.set(cuenta, alumno);
    carreras.set(nombre_carrera,carrera)
    logging.log(`Alumno Titulado. El participante ha finalizado con exito sus estudios `);

    return true;
  }
  else {
    logging.log("Alumno no encontrado o ya finalizo sus estudios o no estudia esa carrera.");
    return false;
  }
}

