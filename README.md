# Universidad Publica en Blockchain



El objetivo de este proyecto es que toda persona de esta institucion pueda presentar su titulo en cualquier parte del mundo sin tener que pasar por procesos burotraticos para validar su titulo. Lo anterior, gracias a guardar la informacion en la blockchain.

Para esto simplemente debe usar uno de los metodos publicos para consultar la informacion o consultar por el hash de la transaccion del metodo de finalizacion.

Por otro lado, la universidad publica posee registros transparentes sobre las carreras, sus titulados y matriculados.




## Como funciona

Dividimos las funciones en 4 partes


### 1.Funciones para Crear una universidad:


* `setUniversidad`


Creamos una universidad con su nombre y el fundador es la cuenta otorgada, esta es la misma que despues podra crear carreras y titular alumnos en la institucion creada


```sh
near call dev-1654271483503-62728332196406 setUniversidad '{"nombreInstitucion":"Universidad de Chile"}' --accountId valefape.testnet

```

### 2.Funciones para la Universidad:



* `setCarrera`

 la universidad crea una carrera y la graba en la blockchain

```sh
near call dev-1654271483503-62728332196406 setCarrera '{"nombre_carrera":"Arte", "semestres":10, "tipo":"profesional","nombreInstitucion":"Universidad de Chile"}' --accountId valefape.testnet
```

Es necesario enviar en --accountId la misma cuenta que creo la universidad, solo esta puede grabar carreras.




* `setFinalizado`

La universidad certifica que un alumno previamente matriculado finalizo la carrera en cuestion

```sh
near call dev-1654271483503-62728332196406 setFinalizado '{"cuenta":"rocolia.testnet","nombre_carrera":"arte","nombreInstitucion":"Universidad de Chile"}' --accountId uchile.testnet
```

Es necesario enviar la cuenta de near testnet (sera el alumno titulado), el nombre de la carrera y nombre de la institucion. El nombre de la carrera debe coincidir con la que previamente registro el alumno y con la institucion.






### 2.Funciones para la Alumnos:



* `setAlumno`

El alumno que desee matricularse debe ejecutar el siguiente comando

```sh
near call dev-1654271483503-62728332196406 setAlumno '{"nombre":"seba", "edad":19, "nombre_carrera":"arte","nombreInstitucion":"Universidad de Chile"}' --accountId rocolia.testnet --amount 10
```

En donde el nombre debe tener mas de 3 caracteres, la edad debe ser mayor a 17, la carrera a la cual quiere ingresar debe ser previamente creada por la institucion al igual que la misma institucion, debe ser creada previamente.
En accountId debe ir la cuenta testnet del alumno que se va a matricular
El costo de ingresar a la carrera es de 10 near





### 3.Funciones publicas:



* `getAlumnos`

Consulta por todos los alumnos



```sh
near view dev-1654271483503-62728332196406 getAlumnos
```




* `getAlumno`

Consulta por 1 alumno en particular enviando su cuenta testnet

```sh
near view dev-1654271483503-62728332196406 getAlumno '{"cuenta":"uchile.testnet"}'
```



* `getCarreras`

Consulta por todas las carreras disponibles 

```sh
near view dev-1654271483503-62728332196406 getCarreras
```




* `getCarrera`

Consulta por una carrera en particular enviando el nombre de esta

```sh
near view dev-1654271483503-62728332196406 getCarrera '{"nombre_carrera":"arte"}'
```

* `getUniversidades`

Consulta por el estado de las universidades creadas para observar sus estadisticas


```sh
near view dev-1654271483503-62728332196406 getUniversidades
```



## Para probar el contrato

### Compilando y desplegando

Instalamos dependencias

```sh
npm install
```

Una vez hecho esto, podemos compilar el código.

```sh
npm run build
```

y despues 

```sh
near dev-deploy build/release/contrato.wasm
```

Ingresamos al archivo neardev/dev-account y copiamos su interior y lo remplazamos en los siguientes metodos.



## Métodos para probar su uso despues de hacer lo anterior



consultamos por los alumnos y las carreras disponibles (no debiese haber ninguna si es un contrato nuevo)

```sh
near view dev-1654271483503-62728332196406 getAlumnos
```
y

```sh
near view dev-1654271483503-62728332196406 getCarreras
```
creamos una carrera

```sh
near call dev-1654271483503-62728332196406 setCarrera '{"nombre_carrera":"arte", "semestres":6, "tipo":"profesional","nombreInstitucion":"Universidad de Chile"}' --accountId valefape.testnet
```




Vemos las carreras grabadas correctamente

```sh
near view dev-1654271483503-62728332196406 getCarreras
```

matriculamos un alumno, debe tener mas de 17 anos, colocar un nombre de carrera existente, institucion existente y pagar 10 near



```sh
near call dev-1654271483503-62728332196406 setAlumno '{"nombre":"seba", "edad":19, "nombre_carrera":"arte", "nombreInstitucion":"Universidad de Chile"}' --accountId rocolia.testnet --amount 10
```



Observamos los alumnos, las carreras y universidades


```sh
near view dev-1654210739011-71072308198195 getAlumnos
```

```sh
near view ddev-1654210739011-71072308198195 getCarreras
```
```sh
near view dev-1654271483503-62728332196406 getUniversidades
```

titulamos al alumno una vez termine correctamente los estudios


```sh
near call dev-1654271483503-62728332196406 setFinalizado '{"cuenta":"rocolia.testnet","nombre_carrera":"arte", "nombreInstitucion":"Universidad de Chile"}' --accountId valefape.testnet
```


Verificamos que ahora en finalizado = true y aumento el numero de titulados en la carrera en cuestion.

Estadisticas de la universidad tambien cambiaron.

```sh
near view dev-1654210739011-71072308198195 getCarrera '{"nombre_carrera":"arte"}'
```

```sh
near view dev-1654210739011-71072308198195 getAlumno '{"cuenta":"uchile.testnet"}'
```

```sh
near view dev-1654271483503-62728332196406 getUniversidades
```


