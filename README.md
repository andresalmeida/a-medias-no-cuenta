# A medias no cuenta
## Transición alimentaria, diabetes y el vacío del Estado en el campo ecuatoriano

Historia de datos desarrollada como proyecto final del bootcamp del **Observatorio Al Dato**, en colaboración con **Fundación Datalat** e **Indeciencia**.

El proyecto investiga una pregunta incómoda y concreta: **qué ocurre cuando la modernización alimentaria llega al campo antes que la atención sanitaria**. A partir de datos abiertos de salud, mortalidad, pobreza y compras públicas, la historia muestra cómo la diabetes avanzó en provincias con alta ruralidad mientras la respuesta estatal en insulina fue desigual, tardía o insuficiente.

## La tesis

> La modernización entró al campo como consumo mucho antes de entrar como cuidado.

La hipótesis central del proyecto es que amplias zonas rurales del Ecuador incorporaron patrones de vida urbana —más ultraprocesados, más sedentarismo, más exposición al riesgo metabólico— sin que el Estado expandiera su presencia sanitaria al mismo ritmo. El resultado fue una brecha visible entre carga de enfermedad y capacidad de respuesta pública.

## Qué contiene este repositorio

Este repositorio reúne dos capas del proyecto:

- `data/`: limpieza, estandarización y cruces analíticos.
- `web/`: historia scrolleable desarrollada en React + D3.

No es solo una visualización. Es un proyecto de análisis reproducible con una pieza editorial pública encima.

Repositorio: [andresalmeida/a-medias-no-cuenta](https://github.com/andresalmeida/a-medias-no-cuenta)

## Preguntas que guía la investigación

El proyecto se organiza alrededor de cuatro preguntas:

1. ¿Qué señales tempranas había de transición alimentaria en el campo ecuatoriano?
2. ¿Qué pasó con la mortalidad por diabetes cuando la enfermedad empezó a crecer?
3. ¿La compra pública de insulina siguió el mapa de la necesidad?
4. ¿Hay provincias donde el patrón esperado entre pobreza y mortalidad no se comporta igual?

## Fuentes de datos

### 1. ENSANUT 2018
Fuente: Encuesta Nacional de Salud y Nutrición.

Se usa para:

- prevalencia ponderada de sobrepeso y obesidad en adultos rurales;
- variables de riesgo asociadas a dieta y transición alimentaria;
- contexto narrativo sobre el cambio en hábitos alimentarios.

Hallazgo metodológico importante:

- ENSANUT 2018 **no incluyó biomarcadores de glucosa** comparables con la edición anterior.
- El dato de glucosa elevada en ayunas (`7,1%`) proviene de **STEPS 2018 del MSP**, disponible como cifra agregada y no como microdato público.

### 2. Defunciones Generales INEC 2019–2024
Fuente: Registro Estadístico de Defunciones Generales.

Se usa para:

- filtrar muertes por diabetes (`CIE-10 E10–E14`);
- construir series nacionales;
- agregar mortalidad por provincia;
- analizar el desplazamiento rural → urbano al morir.

### 3. Censo 2022
Fuente: INEC.

Se usa para:

- población provincial como denominador de estandarización;
- porcentaje de hogares/personas con NBI;
- autoidentificación étnica por provincia.

### 4. SERCOP 2015–2024
Fuente: API de compras públicas.

Se usa para:

- consolidar compras públicas de insulina;
- agregar montos por provincia y por año;
- comparar inversión pública con mortalidad.

## Metodología

### Unidad de análisis

El análisis final se sostiene a nivel **provincial**.

Esto no fue una preferencia estética sino una decisión metodológica:

- los microdatos de defunciones no traen una residencia subprovincial confiable y homogénea;
- bajar a cantón o parroquia habría introducido sesgos fuertes hacia lugares de fallecimiento y no necesariamente de residencia;
- por eso la escala defendible del proyecto es provincia.

En otras palabras: se prefirió una escala provincial **metodológicamente defendible** antes que una granularidad aparente pero engañosa.

### Estandarización

Cada fuente trabaja en unidades distintas:

- INEC: muertes absolutas
- SERCOP: montos absolutos en USD
- Censo: población y NBI

Para volver comparables los cruces territoriales se usó población del Censo 2022 como denominador:

```text
tasa_mortalidad_100k = (muertes / población_provincia) * 100000
insulina_usd_per_capita = monto_insulina / población_provincia
```

### Lenguaje inferencial

El proyecto evita sobreactuar relaciones estadísticas.

En el cruce entre pobreza (NBI) y mortalidad por diabetes:

- Spearman: `r = -0,36`, `p = 0,082`
- OLS: `p = 0,187`, `R² = 0,078`

Por eso los resultados se comunican como **tendencias sugerentes**, no como prueba concluyente ni como rechazo formal de hipótesis nula.

## Hallazgos principales

### 1. La transición alimentaria ya estaba instalada

En 2018, el `62%` de los adultos rurales vivía con sobrepeso u obesidad. El problema ya no era exclusivamente urbano.

### 2. El Estado dejó de medir justo cuando más lo necesitaba

La ENSANUT 2018 ya no incluyó biomarcadores públicos de glucosa comparables con la edición anterior. Cuando la enfermedad empezaba a crecer, el país perdió una forma directa de seguirle el rastro.

### 3. La fractura se vuelve visible en 2020

Mientras la mortalidad por diabetes subió con fuerza, las compras públicas de insulina cayeron. Ese cruce marca uno de los puntos narrativos centrales del proyecto.

### 4. La respuesta territorial fue desigual

Hay provincias donde la mortalidad acumulada 2019–2024 es alta y la inversión per cápita en insulina permanece relativamente baja. Ahí aparece la brecha estatal más visible.

### 5. Morir también implica desplazarse

Alrededor de **1 de cada 4** residentes rurales que murieron por diabetes falleció lejos de su lugar de residencia. La enfermedad se complica en el campo y la muerte termina registrada en la ciudad.

### 6. No todas las provincias siguen el patrón esperado

El proyecto identifica provincias con **desviación positiva**: lugares donde, pese a altos niveles de pobreza, la mortalidad observada por diabetes cae por debajo de lo esperable. Eso no prueba protección automática: puede reflejar mejores condiciones locales, transición más lenta o problemas de registro.

## Estructura del proyecto

```text
bootcamp/
├── guiones_storytelling.md
├── data/
│   ├── analisis/
│   │   ├── 01_limpieza_ensanut.ipynb
│   │   ├── 02_limpieza_defunciones.ipynb
│   │   ├── 03_limpieza_censo.ipynb
│   │   ├── 04_sercop_api.ipynb
│   │   ├── 05_cruce_1_barras.ipynb
│   │   └── 06_cruce_2_scatter_desviacion.ipynb
│   ├── processed/
│   └── raw/
└── web/
    ├── public/
    ├── src/
    └── package.json
```

## Archivos procesados clave

Dentro de `data/processed/` destacan estos outputs:

- `ensanut_obesidad_rural_provincia.csv`
- `defunciones_diabetes_serie_nacional.csv`
- `defunciones_diabetes_provincia_total.csv`
- `defunciones_diabetes_provincia_anio.csv`
- `cruce1_barras_provincia.csv`
- `cruce1_serie_nacional.csv`
- `cruce2_scatter_provincia.csv`
- `cruce2_desplazamiento_provincia.csv`
- `sercop_insulina_consolidado.csv`
- `sercop_provincia_total.csv`

## La historia publicada

La experiencia web se organiza como una historia scrolleable en cinco movimientos:

1. `Hero`: la tesis y la distancia entre enfermedad y atención.
2. `El campo que resistía`: el antes, la dieta y la transición alimentaria.
3. `La fractura`: el quiebre temporal entre muertes e insulina.
4. `El vacío del Estado`: la brecha territorial.
5. `Los que resisten`: la anomalía territorial y la desviación positiva.
6. `Cierre`: la síntesis editorial final.

## Stack

Frontend:

- React 18
- D3 7
- Vite 5

Análisis:

- notebooks de Jupyter / ETL en `data/analisis/`

## Datos geoespaciales y peso del repositorio

Los archivos geoespaciales crudos de `data/raw/GEO/` no son necesarios para correr la experiencia web publicada y pueden ocupar espacio innecesario en el repositorio. Por eso el bundle auxiliar del shapefile provincial quedó excluido del control de versiones en `.gitignore`.

Si se necesitara una versión plenamente reproducible de esa capa, puede reincorporarse después con una estrategia más liviana, por ejemplo GeoJSON simplificado o un release de datos aparte.

## Cómo correr la web en local

Desde la carpeta `web/`:

```bash
npm install
npm run dev
```

Para compilar producción:

```bash
npm run build
```

Para revisar el build:

```bash
npm run preview
```

## Estado metodológico

Al cierre de esta versión:

- las cifras públicas principales ya están alineadas con los outputs procesados;
- la cifra pública de inversión quedó en `"$0,20 por persona por año"` para 2019–2024;
- la cifra ENSANUT pública quedó en `62%` de adultos rurales con sobrepeso u obesidad;
- las tasas públicas fueron rotuladas como **acumuladas 2019–2024** cuando corresponde;
- el análisis principal se presenta explícitamente como provincial.

Persisten pendientes residuales razonables para una auditoría futura:

- revisión manual más fina de contratos SERCOP ambiguos;
- afinamiento editorial de algunos claims sobre ruralidad;
- posibles mejoras de claridad en ciertos gráficos.

## Limitaciones

- No se trabaja con microdato bioquímico público de diabetes confirmada para 2018.
- El proyecto habla de ruralidad, pero el cruce principal se resuelve a nivel provincial porque el microdato de residencia no permite bajar de escala sin sesgos fuertes.
- La comparación principal es territorial y provincial, no individual.
- Las relaciones mostradas son asociaciones y tendencias, no pruebas de causalidad.
- Puede existir subregistro de causa de muerte en zonas rurales remotas.
- El cruce entre mortalidad y compras públicas no mide automáticamente acceso efectivo al tratamiento en territorio, sino respuesta estatal observable vía compras.

## Por qué importa

La historia no trata solo de diabetes. Trata de cómo un país puede modernizar el consumo sin modernizar el cuidado en la misma medida. Trata de qué se mide, qué se deja de medir, dónde responde el Estado y dónde llega tarde.

También trata de una pregunta periodística más grande: **qué se ve cuando se cruzan enfermedad, territorio y presupuesto público**.

## Créditos

**Autor:** Andrés Almeida  
**Proyecto:** Bootcamp del Observatorio Al Dato, en colaboración con Fundación Datalat e Indeciencia  
**Fecha:** mayo de 2026

## Licencia y uso

Este repositorio se publica bajo licencia **MIT**.

Eso cubre el código y la estructura técnica del proyecto. Si se reutilizan la metodología, la narrativa, los textos o las visualizaciones en otros contextos públicos, se recomienda citar el proyecto completo y mantener atribución al autor y al bootcamp de origen.
