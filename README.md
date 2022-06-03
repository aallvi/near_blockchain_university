# Universidad Publica en Blockchain

El objetivo de este proyecto es que toda persona de esta institucion pueda presentar su titulo en cualquier parte del mundo sin tener que pasar por procesos burotraticos para validar su titulo. Lo anterior, gracias a guardar la informacion en la blockchain

Por otro lado, la universidad posee registros transparentes sobre las carreras, sus titulados y matriculados

## Como funciona

Dividimos las funciones en 3 partes

### 1.Funciones para la Universidad:

* `setCarrera`

 la universidad crea una carrera y la graba en la blockchain

```sh
near call dev-1654210739011-71072308198195 setCarrera '{"nombre_carrera":"Arte", "semestres":10, "tipo":"profesional"}' --accountId uchile.testnet
```

Es necesario enviar en --accountId uchile.testnet ya que es la cuenta de la universidad, y solo esta puede grabar carreras. ( se puede cambiar desde el codigo)


* `setFinalizado`

La universidad certifica que un alumno previamente matriculado finalizo la carrera en cuestion

```sh
near call dev-1654210739011-71072308198195 setFinalizado '{"cuenta":"uchile.testnet","nombre_carrera":"arte"}' --accountId uchile.testnet
```

Es necesario enviar la cuenta de near testnet y el nombre de la carrera. El nombre de la carrera debe coincidir con la que previamente registro el alumno.


### 2.Funciones para la Alumnos:

* `setAlumno`

El alumno que desee matricularse debe ejecutar el siguiente comando

```sh
near call dev-1654210739011-71072308198195 setAlumno '{"nombre":"seba", "edad":19, "nombre_carrera":"arte"}' --accountId aallvi.testnet --amount 10
```

En donde el nombre debe tener mas de 3 caracteres, la edad debe ser mayor a 17, la carrera a la cual quiere ingresar debe ser previamente creada por la institucion.
En accountId debe ir la cuenta testnet del alumno que se va a matricular
El costo de ingresar a la carrera es de 10 near


### 3.Funciones publicas:

* `getAlumnos`

Consulta por todos los alumnos

```sh
near view dev-1654210739011-71072308198195 getAlumnos
```


* `getAlumno`

Consulta por 1 alumno en particular enviando su cuenta testnet

```sh
near view dev-1654210739011-71072308198195 getAlumno '{"cuenta":"uchile.testnet"}'
```

* `getCarreras`

Consulta por todas las carreras disponibles 

```sh
near view ddev-1654210739011-71072308198195 getCarreras
```

* `getCarrera`

Consulta por una carrera en particular enviando el nombre de esta

```sh
near view dev-1654210739011-71072308198195 getCarrera '{"nombre_carrera":"arte"}'
```



## Uso

### Compilando y desplegando

Lo primero que debemos hacer es instalar las dependencias necesarias para que el proyecto funcione.

```sh
npm install
```

ó

```sh
yarn install
```

Una vez hecho esto, podemos compilar el código.

```sh
npm run build
```

ó

```sh
yarn build
```

El contrato compilado en WebAssembly se guarda en la carpeta `AssemblyScript/build/release/`. Ahora solo es necesario desplegarlo en una cuenta de desarrollo.

```sh
near dev-deploy build/release/contrato.wasm
```

### Usando variables de entorno

Una vez compilado y desplegado tu proyecto, vamos a requerir identificar la cuenta neardev. Esta la puedes encontrar en el archivo `AssemblyScript/neardev/neardev`. Podemos almacenar este contrato en una variable de entorno ejecutando lo siguiente en la consola, y sustituyendo por tu cuenta de desarrollo:

```sh
export CONTRATO=dev-0000000000000-000000000
```

Haciendo esto, podemos comprobar que la variable `CONTRATO` tiene almacenada nuestra cuenta dev.

```sh
echo $CONTRATO
```

### Métodos

Lo primero que debemos hacer es registrar al menos un usuario en el contrato. Para esto utilizamos el método `setParticipante`. Este método requiere que se pague 1 NEAR para poder ser ejecutado. El método registra a la persona que lo está ejecutando como participante.

```sh
near call $CONTRATO setParticipante '{"nombre":"Nombre Participante","edad":18}' --accountId tucuenta.testnet --amount 1
```

Ahora que tenemos al menos 1 participante, podemos utilizar los métodos de lectura. `getParticipante` nos traerá la información específica de un participante dependiendo la cuenta que le enviemos como parámetro. Por otro lado, `getParticipantes` nos trae la lista de todos los participantes registrados.

```sh
near view $CONTRATO getParticipante '{"cuenta":"cuenta.testnet"}'
```

```sh
near view $CONTRATO getParticipantes
```

Por último, si queremos marcar como certificado a uno de los participantes registrados, podemos hacer uso del método `setCertificado`. Este método tiene una restricción en la que, si tu cuenta no es `aklassen.testnet` especificamente no te permitirá ejecutarlo. Esta es una forma de agregar una restricción a cuentas específicas. Puedes modificar esta cuenta en el código del contrato. Además, el método transfiere una compensación de 5 NEAR al participante por haber logrado su certificación.

```sh
near call $CONTRATO setCertificado '{"cuenta":"cuenta.testnet"}' --accountId cuenta.testnet
```

