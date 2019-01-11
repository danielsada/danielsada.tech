+++
title = "Malas prácticas de seguridad en bancos: Banco Santander"
description = "Cuando los bancos que son muy seguros, ya no lo son tanto."
tags = [
    "spanish"
]
date = "2018-12-27"
categories = [
    "spanish"
]
+++

No suelo quejarme mucho, sin embargo, varias cosas me han irritado en cómo los bancos que proclaman ser tan conocedores en ciberseguridad tienden a ser los que más caen en falsedades que solo *aparentan* seguridad. Mas aún, sus malas prácticas suelen llegar al punto que, en lugar de hacer los sistemas más seguros, los hacen más inseguros. No me malinterpreten, – **Santander es de los mejores bancos con los que he tratado y la mayoría de estas críticas no son exclusivas de Santander** – Sin embargo, del querer ver algo mejor llega la crítica.

> "Las críticas no serán agradables, pero son necesarias." - Winston Churchill

## 1. Contraseñas limitadas a **Exactamente** 8 caracteres.

Esto es de lo peor que he visto en el mundo de los bancos. Te forzan a usar una contraseña de **exactamente** 8 dígitos en la cual no se repitan números secuencialmente.

La clave está en el **exactamente** ni menos de 8 ni más de 8. Es pésimo, reduces el rango de ataque de contraseñas a algo trivial. Veamos las políticas de contraseñas.


- Longitud de 8 caracteres alfanuméricos, por ejemplo, SbCg3508.
- No se aceptan caracteres especiales tales como _ñ:/+á*
- Evitar el uso de datos personales como fecha de nacimiento, número de tarjeta, código de cliente, número telefónico, etc.

Bueno, calculando 26 letras mayúsculas, 26 letras minúsculas, y 10 dígitos, tenemos 

62<sup>8</sup> − [ 36<sup>8</sup> + 36<sup>8</sup> +52<sup>8</sup> ] + [ 26<sup>8</sup> + 26<sup>8</sup> + 10<sup>8</sup> ] = 
**159,655,911,367,680 contraseñas posibles**

Y me preguntarán: Daniel, ¿Por qué 159 billones de contraseñas es malo? Bueno una empresa llamada [BetterBuys](https://www.betterbuys.com/estimating-password-cracking-times/), generó un pequeño estudio de cuanto tiempo tardaría en romperse una contraseña.

Ellos establecen que puedes tener hasta 15 millones de descripciones de contraseñas por segundo. Por lo que para probar todas las contraseñas del banco tardarían 4 meses. [ [^0] ] 

[^0]: Better buys. Estimating Password Cracking times. https://www.betterbuys.com/estimating-password-cracking-times/

### 4 meses.

**Pero espera ¡Aún hay más!** 

Esto es con un procesador normal y corriente, si en lugar de usar un procesador, **usas una tarjeta gráfica o una hasheadora  bitcoin**,  [^2] – [^3] – [^4]

Podrías crackear los passwords (asumiendo sha256) en tan solo

## 2 días

Así, que a rezar por que no hackeen la base de datos pronto.

[^2]: Mining hardware comparisons https://en.bitcoin.it/wiki/Mining_hardware_comparison

[^3]: Mining rigs https://1stminingrig.com/nvidia-geforce-gtx-1080-mining-performance-review/

[^4]: M. Sprengers, (2011), “GPU-Based Password Cracking”, Masters thesis. https://www.ru.nl/publish/pages/769526/thesis.pdf


### 2. Desactivar copiar y pegar de su panel principal.

Soy muy partícipe de usar manejadores de contraseñas para guardar todas tus contraseñas, ya sea LastPass o 1Password, sin embargo, me molesta de sobremanera que desactiven copiar y pegar. ¿Qué evitan con esta acción? ¿Que los hackers leet no puedan copiar y pegar nada? No, simplemente afectan al usuario promedio que quiere usar un manejador de contraseñas de su banco. 

Por un lado, entiendo que se evitan que la gente copie y pegue su contraseña en un archivo de notas, pero si su computadora ya está comprometida, el hecho de que este en un archivo, no cambia mucho su situación de seguridad.

### 3. No tener autenticación de 2 factores para entrar.

Me gusta mucho que varios bancos han pasado a tener su autenticación de dos factores en el celular, sin embargo, creo que sería mejor que hubiese la opción de entrar con la autenticación de dos factores, y que además fuera en otra plataforma aparte que la aplicación *in-house* de Santander.

Cabe mencionar que Santander si tiene super token, pero no esta en un estandard internacional de claves de un uso (OTP) y no solo Santander, si no que Banamex y Bancomer también.

## Mis recomendaciones:

### 1. Permitir poner 8 o más caracteres.

Poniendo más de 8 caracteres, eleva la dificultad de desencripción a imposibles en vida humana. Por ejemplo, de poner contraseñas de 9 caracteres, tardaría 4 décadas en hackearse.

### 2. Permitir copiar y pegar en la aplicación.

Es muy útil y seguro para copiar y pegar CLABES, cuentas o todo tipo de números (¡Hasta montos!). Y no hace nada hacia el atacante que quiera vulnerar la página.

### 3. Implementar un algoritmo conocido para autenticación de dos factores.

El usar las plataformas de Google Authenticator o Azure authenticator, haría que vulnerar al banco sea mucho más difícil, dado que no dependen de que hayan programado bien su SuperToken.

Cuiden sus contraseñas y haganlas largas. En la próxima entrega de este blog, escribiré sobre mitos y realidades de las contraseñas. Estoy probando escribir en español de vez en cuando y me gustaría mucho ver sus comentarios aquí abajo.

Como siempre, cabe recalcar que esta página es código abierto, por lo que pueden usar lo que quieran del articulo con crédito.

Si notaste algún error ortográfico, puedes sugerir un cambio [aquí](http://github.com/danielsada/danielsada.tech).

P.S.

Esta infografía de [BetterBuys](https://www.betterbuys.com/estimating-password-cracking-times/) es interesante, pero solo toma los caracteres alfabeticos en minúscula, por lo que no es exactamente lo que queremos demostrar, dado que las claves de Santander tienen minúsculas, mayúsculas y alfanuméricos.

![](https://www.betterbuys.com/estimating-password-cracking-times/assets/images/password_time_and_length.jpg)

Gracias a Gandalf por ayudarme con las mátematicas y en el proceso creativo :)






