# Universidad Publica en Blockchain



El objetivo de este proyecto es que toda persona de esta institucion pueda presentar su titulo en cualquier parte del mundo sin tener que pasar por procesos burotraticos para validar su titulo. Lo anterior, gracias a guardar la informacion en la blockchain

Por otro lado, la universidad posee registros transparentes sobre las carreras, sus titulados y matriculados.




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



### Métodos para probar su uso despues de hacer lo anterior



consultamos por los alumnos y las carreras disponibles (no debiese haber ninguna si es un contrato nuevo)

```sh
near view dev-1654210739011-71072308198195 getAlumnos
```
y

```sh
near view dev-1654210739011-71072308198195 getCarreras
```
creamos un par de carreras

```sh
near call dev-1654210739011-71072308198195 setCarrera '{"nombre_carrera":"arte", "semestres":6, "tipo":"profesional"}' --accountId uchile.testnet
```

```sh
near call dev-1654210739011-71072308198195 setCarrera '{"nombre_carrera":"redes", "semestres":6, "tipo":"tecnica"}' --accountId uchile.testnet
```


Vemos las carreras grabadas correctamente

```sh
near view dev-1654210739011-71072308198195 getCarreras
```

matriculamos un alumno, debe tener mas de 17 anos, colocar un nombre de carrera existente y pagar 10 near



```sh
near call dev-1654210739011-71072308198195 setAlumno '{"nombre":"seba", "edad":19, "nombre_carrera":"arte"}' --accountId uchile.testnet --amount 10
```



Observamos los alumnos y las carreras


```sh
near view dev-1654210739011-71072308198195 getAlumnos
```

```sh
near view ddev-1654210739011-71072308198195 getCarreras
```

titulamos al alumno una vez termine correctamente los estudios


```sh
near call dev-1654210739011-71072308198195 setFinalizado '{"cuenta":"uchile.testnet","nombre_carrera":"arte"}' --accountId uchile.testnet
```


Verificamos que ahora en finalizado = true y aumento el numero de titulados en la carrera en cuestion.

```sh
near view dev-1654210739011-71072308198195 getCarrera '{"nombre_carrera":"arte"}'
```

```sh
near view dev-1654210739011-71072308198195 getAlumno '{"cuenta":"uchile.testnet"}'
```


