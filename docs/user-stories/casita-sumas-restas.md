# HU: Juego "La Casita" — sumas y restas con reagrupación (llevar / pedir)

**Mundo:** Ocean (agrupar junto a `SumsGame`, `CountingGame`, `HundredsGame`)
**Tipo:** Nueva funcionalidad (nuevo juego), reutiliza convenciones de `SumsGame` / `HundredsGame`
**Estado:** Backlog

## Historia de usuario

Como **niño/a que está aprendiendo a sumar y restar con números de dos cifras**,
quiero **resolver cuentas usando el método de "la casita"**, viendo separadas las decenas y las unidades y pudiendo llevarme o pedir prestado un 1 cuando corresponda,
para **entender visualmente el mecanismo de reagrupación en vez de memorizarlo sin comprenderlo**.

Como **niño/a que todavía necesita apoyo de conteo manual**,
quiero **tener palitos (fósforos) sueltos debajo de la casita que pueda arrastrar y agrupar**,
para **contar con material concreto si no puedo resolver la cuenta solo mentalmente**.

## Contexto / motivación

Hoy `SumsGame` (ocean) resuelve sumas y restas simples de un dígito, sin reagrupación, con apoyo visual de bloques (`VisualBlocks`) y opciones múltiples. No cubre el caso pedagógico central de la currícula de 2°/3° grado: sumar o restar números de dos cifras **con acarreo/desacarreo** (ej. 25 + 17, 42 − 18).

El usuario adjuntó un boceto de referencia: una "casita" (techo triangular + cuerpo cuadrado) dividida en dos columnas (decenas | unidades), con dos números apilados dentro (ej. fila superior 5-2, fila inferior 3-1) y, debajo de la casita, grupos de palitos/rayitas sueltas que representan unidades para contar a mano.

## Alcance

**Incluye:**

- Nuevo juego/modo con la estructura visual de "casita" (columnas decenas/unidades) para sumar y restar números de dos cifras.
- Indicador visual del acarreo ("me llevo 1") al sumar y del préstamo ("le pido 1 al vecino") al restar, en la columna de decenas.
- Zona inferior con palitos sueltos, arrastrables, que el niño puede usar libremente para contar/agrupar de a 10.
- Modo suma y modo resta dentro del mismo juego (toggle o alternancia por ronda).
- Feedback de acierto/error y progresión de dificultad.

**No incluye (fuera de alcance de esta HU):**

- Números de tres cifras / centenas (podría ser una HU futura reutilizando este mismo componente).
- Multiplicación/división con casita.
- Modo multijugador o comparación entre niños.

## Criterios de aceptación

1. **Dado** que el niño entra al juego, **cuando** se genera una ronda, **entonces** se muestra una casita con dos números de dos cifras alineados en columnas de decenas y unidades, y el operador (+ o −) visible entre ellos.
2. **Dado** un problema de suma cuya suma de unidades es ≥ 10, **cuando** el niño resuelve la columna de unidades, **entonces** el juego muestra/anima el acarreo de 1 hacia la columna de decenas antes de permitir completar esa columna.
3. **Dado** un problema de resta cuyo dígito de unidades del minuendo es menor al del sustraendo, **cuando** el niño llega a esa columna, **entonces** el juego ofrece la opción de "pedir prestado" a la columna de decenas y refleja visualmente la decena tachada/reducida en 1.
4. **Dado** que el niño no logra resolver una columna solo, **cuando** arrastra palitos desde la bandeja inferior hacia el área de trabajo, **entonces** puede agruparlos y contarlos libremente sin que eso invalide o bloquee su respuesta.
5. **Dado** que hay palitos suficientes para formar un grupo de 10, **cuando** el niño agrupa 10 palitos, **entonces** el juego sugiere (visual o sonoramente) que ese grupo equivale a "una decena", reforzando la relación con el acarreo/préstamo.
6. **Dado** que el niño ingresa una respuesta, **cuando** la valida, **entonces** el juego da feedback inmediato (correcto/incorrecto) y, si es incorrecto, permite reintentar sin perder el estado de los palitos ya agrupados.
7. **Dado** que el niño completa varias rondas correctamente, **cuando** el sistema evalúa el progreso, **entonces** aumenta gradualmente la dificultad (más rondas con acarreo/préstamo, números más grandes dentro del rango de dos cifras).
8. **Dado** un dispositivo táctil de las dimensiones objetivo de la app (tablet/celular), **cuando** el niño interactúa con la casita o los palitos, **entonces** los elementos arrastrables tienen un área táctil suficientemente grande y feedback visual claro de que "agarró" el elemento (siguiendo el estándar de accesibilidad ya usado en otros juegos del mundo Ocean).
9. **Dado** que el niño resuelve la ronda solo con la casita (sin usar palitos), **cuando** valida la respuesta, **entonces** el juego funciona igual de bien sin forzar el uso de los palitos (son un apoyo opcional, no obligatorio).

## Notas técnicas (para quien tome las tareas)

- Seguir la convención de carpeta-por-componente ya usada tras el refactor de `apps/mobile` (`index.ts` + `NombreGame.tsx` + `NombreGame.styles.ts` + `NombreGame.test.tsx` + `components/` + `logic/`), visible en `HundredsGame` y `SumsGame`.
- Reutilizar patrones existentes de `ocean/HundredsGame/logic/decompose.ts` (ya maneja descomposición en decenas/unidades) como posible base para la lógica de acarreo/préstamo, y de `ocean/SumsGame/logic/generateProblem.ts` como base para el generador de problemas.
- Para el arrastre de palitos, revisar qué librería de gestos/drag-and-drop ya está instalada en `apps/mobile` antes de sumar una dependencia nueva.

## Tareas

### 1. Definir mecánica y mockup interactivo de la casita

**Descripción:** A partir del boceto de referencia, definir el layout final: proporciones de la casita, cómo se muestran las dos columnas (decenas/unidades), dónde aparece el indicador de acarreo/préstamo, y cómo se distingue visualmente el modo suma del modo resta. Entregar un mockup (Figma o similar) o una descripción detallada de estados (inicial, con acarreo, con préstamo, correcto, incorrecto).

### 2. Lógica de generación de problemas con reagrupación

**Descripción:** Crear `logic/generateCarryProblem.ts` (o extender `generateProblem.ts`) que genere pares de números de dos cifras para suma y resta, con parámetro de probabilidad de forzar acarreo (suma) o préstamo (resta), respetando que la resta nunca dé resultado negativo. Incluir tests unitarios que verifiquen: rango de operandos, corrección del resultado, y que la proporción de problemas "con reagrupación" respete el parámetro solicitado.

### 3. Componente `Casita` (estructura visual + columnas decenas/unidades)

**Descripción:** Construir el componente visual de la casita con sus dos columnas. Debe recibir el problema (operandos, operación) y renderizar los dígitos correctamente alineados por posición (decenas/unidades), dejando espacio para el indicador de acarreo/préstamo definido en la tarea 1.

### 4. Indicador y animación de acarreo/préstamo

**Descripción:** Implementar la animación/indicador que aparece cuando una columna requiere llevarse o pedir prestado un 1: mostrar el "1" viajando visualmente de la columna de unidades a la de decenas (acarreo) o el tachado/reducción de la decena prestada (préstamo). Debe activarse automáticamente según el problema generado en la tarea 2.

### 5. Componente `PalitosTray` (palitos arrastrables)

**Descripción:** Crear la bandeja inferior de palitos individuales que el niño puede arrastrar hacia un área de trabajo para agrupar y contar. Debe soportar arrastrar de a uno, soltar en el área de conteo, y reconocer visualmente cuando se agrupan 10 (ej. atados o resaltados) como refuerzo del concepto de decena.

### 6. Integración de gestos de arrastre (drag & drop)

**Descripción:** Conectar `PalitosTray` con la interacción táctil real (gesture handler / reanimated, según lo que ya use el proyecto), asegurando áreas táctiles grandes y feedback (escala/sombra) al tomar un palito, siguiendo el criterio de aceptación de accesibilidad táctil.

### 7. Pantalla/orquestador `CasitaGame`

**Descripción:** Crear `CasitaGame.tsx` que orqueste ronda actual, modo suma/resta, estado de la casita, estado de los palitos, validación de respuesta y feedback de acierto/error, siguiendo el patrón de estado ya usado en `SumsGame.tsx` / `HundredsGame.tsx`.

### 8. Sistema de dificultad progresiva

**Descripción:** Implementar el ajuste de dificultad (más frecuencia de acarreo/préstamo y operandos más grandes a medida que el niño acierta rondas seguidas), reutilizando o adaptando el criterio de progresión ya existente en otros juegos del mundo Ocean si lo hay.

### 9. Registrar el juego en el mundo Ocean

**Descripción:** Agregar `CasitaGame` al índice/selector de juegos del mundo Ocean (routing, ícono, nombre visible para el niño), siguiendo cómo están registrados `SumsGame`, `CountingGame`, `CompareGame` y `HundredsGame`.

### 10. Tests de componentes y de interacción

**Descripción:** Cubrir con tests: renderizado correcto de la casita según el problema, aparición del indicador de acarreo/préstamo en los casos correspondientes, y comportamiento de `PalitosTray` (agregar/agrupar/soltar palitos), siguiendo el estilo de tests ya usado (`*.test.tsx` junto a cada componente).

### 11. QA manual en dispositivo/emulador

**Descripción:** Validar manualmente en un dispositivo o emulador táctil real que el arrastre de palitos se siente natural para un niño (sin lag, sin soltar accidental), que la casita es legible en pantallas chicas, y recorrer todos los criterios de aceptación de la HU antes de dar por cerrada la tarea.

## Consideraciones futuras (no en esta HU)

- Extender la casita a números de tres cifras (centenas).
- Sonidos/vocecitas guiando el "me llevo 1" / "le pido prestado 1 al vecino".
- Modo asistido donde el juego arrastra automáticamente los palitos como demostración la primera vez.
