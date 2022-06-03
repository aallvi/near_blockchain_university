import { PersistentUnorderedMap, logging, context, u128, ContractPromiseBatch,  } from 'near-sdk-as'

const TEN_NEAR = u128.from('10000000000000000000000000');

//Creamos una clase de Universidad, Alumno y Carreras

@nearBindgen
class Universidad {
  cuenta: string;
  nombreInstitucion: string;
  totalCarreras: number;
  totalMatriculados: number;
  totalFinalizados: number;

  
  constructor(cuenta: string, nombreInstitucion: string, totalCarreras: number, totalMatriculados:number,  totalFinalizados: number) {
    this.cuenta = cuenta;
    this.nombreInstitucion = nombreInstitucion;
    this.totalCarreras = totalCarreras;
    this.totalMatriculados = totalMatriculados
    this.totalFinalizados = totalFinalizados
  }
}



@nearBindgen
class Alumno {
  cuenta: string;
  nombre: string;
  nombre_carrera: string;
  edad: u32;
  finalizada: bool;
  nombreInstitucion:string

  
  constructor(cuenta: string, nombre: string, edad: u32, nombre_carrera:string, nombreInstitucion:string) {
    this.cuenta = cuenta;
    this.nombre = nombre;
    this.nombre_carrera = nombre_carrera;
    this.edad = edad;
    this.nombreInstitucion = nombreInstitucion
  }
}

@nearBindgen
class Carreras {
  cuenta: string;
  nombre_carrera: string;
  semestres: u32;
  tipo: string;
  titulados:number
  nombreInstitucion:string



  constructor(cuenta: string, nombre_carrera:string,semestres: u32, tipo:string, titulados:number, nombreInstitucion:string) {
    this.cuenta = cuenta;
    this.nombre_carrera = nombre_carrera;
    this.semestres = semestres;
    this.tipo = tipo;
    this.titulados= titulados
    this.nombreInstitucion = nombreInstitucion
  }
}


const alumnos = new PersistentUnorderedMap<string, Alumno>("a");
const carreras = new PersistentUnorderedMap<string, Carreras>("c");
const universidades = new PersistentUnorderedMap<string, Universidad>("u");


// Metodos del contrato

export function setUniversidad(nombreInstitucion: string, ): void {

  
  // la cuenta creadora sera el accountId

  const cuenta = context.sender

  // la inicializamos con 0 titulados, 0 carreras y 0 matriculados

  let totalCarreras = 0
  let totalMatriculados = 0
  let totalFinalizados = 0

  // verificamos que cumpla las siguentes condiciones

  assert(nombreInstitucion.length >= 4, "La carrera debe tener minimo 4 caracteres");

  

  
  let universidad = new Universidad(cuenta, nombreInstitucion, totalCarreras, totalMatriculados, totalFinalizados);
  
  // guardamos la carrera

  universidades.set(nombreInstitucion, universidad);

 
  logging.log("Universidad creada con exito");
 
}





// Creamos una carrera en la universidad

export function setCarrera(nombre_carrera: string, semestres: u32, tipo: string, nombreInstitucion:string ): void {

  // nos aseguramos que quien creo la universidad solo pueda crear carreras y revisamos que la universidad exista
   

  const cuenta = context.sender

 

  let universidad = universidades.get(nombreInstitucion);

  if (universidad && universidad.cuenta == context.sender) {

// la inicializamos con 0 titulados
    let titulados = 0

    // aumentamos total de carreras en la universidad

    universidad.totalCarreras++

  // verificamos que cumpla las siguentes condiciones

  assert(semestres >= 4, "La carrera debe tener minimo 4 semestres");
  assert(nombre_carrera.length >= 3, "El nombre debe contener 3 o más caractéres.");
  assert(tipo == 'profesional' || 'tecnica', "La carrera debe ser profesional o tecnica");
  

  
  let carrera = new Carreras(cuenta, nombre_carrera, semestres, tipo, titulados, nombreInstitucion);
  

  // guardamos la carrera y la universidad le aumentamos la cantidad de carreras

  
  carreras.set(nombre_carrera, carrera);
  universidades.set(nombreInstitucion, universidad);

 
  logging.log("Carrera registrada con exito");



  } else {

    logging.log("No existe la Universidad, o la cuenta testnet utilizada no es la misma con la cual se creo la institucion");
  }


  
 
}






// Un alumno se matricula


export function setAlumno(nombre: string, edad: u32, nombre_carrera: string, nombreInstitucion:string): void {

  const cuenta = context.sender;
  const deposito = context.attachedDeposit;

    // comprobamos que la carrera a la cual quiere ingresar exista y la universidad tambien


   let carrera = carreras.get(nombre_carrera);
  let universidad = universidades.get(nombreInstitucion);
  
  


   if( carrera && universidad  && carrera.nombreInstitucion == nombreInstitucion){
     universidad.totalMatriculados++

    // evaluamo su edad, nombre y el pago que realiza que deben ser 10 near

  assert(edad >= 17, "Debes tener minimo 17 años para comenzar una carrera");
  assert(nombre.length >= 3, "El nombre debe contener 3 o más caractéres.");
  assert(deposito == TEN_NEAR, "Debes de pagar 10 NEAR para empezar una carrera universitaria.");

  let alumno = new Alumno(cuenta, nombre, edad, nombre_carrera, nombreInstitucion);


  // transferimos el pago a la cuenta que creo la universidad


  ContractPromiseBatch.create(universidad.cuenta).transfer(u128.from(10));

  // grabamos el alumno

  alumnos.set(cuenta, alumno);
  universidades.set(nombreInstitucion, universidad);


  
  logging.log("Alumnos registrado con exito");


   } else {
    logging.log("carrera no existe o universidad no existe");
   }


   
}

// funciones para consultar por las universidades

export function getUniversidades(): Universidad[] {
  return universidades.values();
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


export function setFinalizado(cuenta:string, nombre_carrera:string, nombreInstitucion:string): bool {
 
   // en cuenta debemos ingresar el alumno que deseamos matricular
  

  // verificamos que solo la cuenta que creo la universidad pueda titular a la persona
 // buscamos al alumno y que la carrera enviada sea la que estudia

  let alumno = alumnos.get(cuenta);
  let carrera = carreras.get(nombre_carrera);
  let universidad = universidades.get(nombreInstitucion);
 

  if (alumno && alumno.finalizada == false && carrera && alumno.nombre_carrera == nombre_carrera && universidad &&universidad.cuenta == context.sender ) {

    // grabamos que finalizo sus estudios y aumentamos el numero de titulados en la carrera en cuestion y lo grabamos 
    // aumentamos el total de finalizados/titulados en la universidad en cuestion

    alumno.finalizada = true;
    carrera.titulados++
    universidad.totalFinalizados++

  

    alumnos.set(cuenta, alumno);
    carreras.set(nombre_carrera,carrera)
    universidades.set(nombreInstitucion, universidad);

    logging.log(`Alumno Titulado. El participante ha finalizado con exito sus estudios `);

    return true;
  }
  else {
    logging.log("Alumno no encontrado o ya finalizo sus estudios o no estudia esa carrera o no tienes autorizacion para hacer esta accion");
    return false;
  }
}

