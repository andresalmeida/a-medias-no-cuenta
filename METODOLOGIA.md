# Apéndice metodológico — "A medias no cuenta"
**Andrés Almeida — Bootcamp Al Dato, mayo 2026**

Este documento describe de forma reproducible los criterios de limpieza, exclusión y estandarización aplicados a cada fuente de datos del proyecto. Permite que cualquier persona replique los outputs públicos a partir de los datos crudos.

---

## 1. Defunciones Generales INEC (2019–2024)

**Fuente:** Microdatos de Defunciones Generales, INEC. Archivos CSV anuales descargados desde el portal de datos abiertos.

**Filtro de causa de muerte:** se retienen únicamente los registros con causa básica de muerte en el rango CIE-10 **E10–E14** (diabetes mellitus tipo 1, tipo 2, malnutrida, otras especificadas, no especificada).

**Nivel de análisis:** provincial. Los microdatos incluyen `prov_res` (provincia de residencia habitual), que es la variable usada para todos los cruces territoriales. Se descartó `prov_fall` (provincia de fallecimiento) porque sesgaría el análisis hacia provincias con hospitales de referencia.

**Limitación estructural:** no existe variable confiable de cantón o parroquia de residencia en los microdatos INEC para el período analizado. `cant_res` no está disponible; `cant_fall` no es equivalente. Por esto el análisis queda a nivel de 24 provincias.

**Problema de codificación INEC 2019:** el archivo de 2019 codifica `area_res`, `area_fall` y `prov_res` con valores numéricos (`1 = urbano`, `2 = rural`; `1–24` = código de provincia), a diferencia de 2020–2024 que usan texto. Se implementó normalización explícita:

```python
def norm_area(s):
    s = str(s).strip()
    if s in ('1', '1.0'): return 'URBANO'
    if s in ('2', '2.0'): return 'RURAL'
    # fallback para texto 2020-2024
    ...

PROV_CODES = {'1': 'AZUAY', '2': 'BOLIVAR', ..., '24': 'SANTA ELENA'}
```

**Problema de encoding Latin-1 (2020–2024):** algunos nombres provinciales contenían el carácter soft hyphen U+00AD (categoría Unicode Cf), invisible en CSV pero que generaba claves duplicadas en el groupby. Se resolvió con un diccionario `PROV_FIX` y una consolidación post-groupby.

**Tasas:** la tasa de mortalidad se expresa como **acumulada 2019–2024 por 100.000 habitantes**, usando población del Censo 2022 como denominador fijo.

```
tasa_acumulada_100k = (muertes_totales_2019_2024 / población_provincia_2022) × 100.000
```

Esta es una tasa acumulada del período completo, no una tasa anual. Los gráficos públicos lo indican explícitamente.

**Hallazgo de desplazamiento rural→urbano:** para el análisis de dónde mueren los residentes rurales, se cruzan `area_res` y `area_fall`. Un residente con `area_res = RURAL` y `area_fall = URBANO` se cuenta como "desplazado". El 27,2% de las muertes rurales por diabetes en el período cae en esta categoría.

---

## 2. SERCOP — Compras públicas de insulina (2015–2024)

**Fuente:** API pública SERCOP (`datosabiertos.compraspublicas.gob.ec`). Se iteraron años 2015–2024 y todas las páginas disponibles con el término de búsqueda `"insulina"`.

**Registros crudos:** 7.226

**Criterios de exclusión aplicados (en orden):**

| Criterio | Registros eliminados | Archivo de trazabilidad |
|----------|----------------------|-------------------------|
| Duplicados exactos (todas las columnas coinciden) | 1.267 | `sercop_excluidos_duplicados.csv` |
| Sin monto (`amount` vacío, nulo o ≤ 0) o sin región | 62 | `sercop_excluidos_sin_datos.csv` |
| Descripción contiene "EXCLUYE HORMONAS SEXUALES E INSULINAS" | 26 | `sercop_excluidos_excluye_insulinas.csv` |
| **Total excluidos** | **1.355** | — |
| **Registros finales** | **5.871** | `sercop_insulina_consolidado.csv` |

**Nota sobre los contratos "excluye insulinas":** son licitaciones de medicamentos por grupo terapéutico que explícitamente indican que la insulina **no** está incluida en ese contrato (ej. "Grupo H Preparados Hormonales Sistémicos, excluye Hormonas Sexuales e Insulinas"). Incluirlos sobreestimaría el gasto real en insulina.

**Nota sobre duplicados:** los 1.267 duplicados exactos corresponden principalmente a registros que aparecen repetidos en la paginación de la API al consultar años con muchos resultados. Son copias byte a byte, no contratos distintos.

**Estandarización:** la insulina per cápita se calcula sobre el período 2019–2024 para ser comparable con las tasas de mortalidad. El denominador es la población provincial del Censo 2022.

```
insulina_per_capita = monto_total_usd_2019_2024 / población_provincia_2022
insulina_per_capita_año = monto_total_usd_2019_2024 / población_total / 6
```

**Cifra pública:** `$0,20` por persona por año es el promedio nacional para el período 2019–2024. Corresponde a `$19.818.199 / 16.884.398 personas / 6 años = $0,196`, redondeado a `$0,20`.

---

## 3. ENSANUT 2018

**Fuente:** Encuesta Nacional de Salud y Nutrición 2018, INEC/MSP. Archivo `1_BDD_ENS2018_f1_personas.csv`.

**Uso en el proyecto:** factores de riesgo (obesidad, sobrepeso en adultos rurales), no prevalencia de diabetes. La ENSANUT 2018, a diferencia de la edición 2012, no incluyó pruebas bioquímicas (glucosa en sangre, HbA1c). Esta ausencia es en sí misma un hallazgo: el Estado dejó de medir la variable más relevante en el momento en que la diabetes rural crecía.

**Filtros aplicados:**
- `area == 'rural'`
- Adultos 19–59 años con variables `dobes19_59` y `dspobes19_59` no nulas
- n = 27.446 observaciones después de filtros

**Ponderación:** todas las prevalencias se calculan con el factor de expansión `fexp` (ponderación muestral), que corrige el diseño muestral complejo de la encuesta. Usar la media simple sobreestima la prevalencia hasta en 2,4 puntos porcentuales.

```python
prev_ponderada = Σ(fexp_i × variable_i) / Σ(fexp_i)
```

**Cifra pública verificada:** `62%` de adultos rurales vivían con sobrepeso u obesidad (variable `dspobes19_59 = 1`). Cálculo directo sobre microdato con fexp: **62,3%**. El copy público redondea a 62%.

---

## 4. Censo 2022 — NBI y Etnia

**Fuente:** INEC, Resultados del Censo de Población y Vivienda 2022. Tablas de NBI (Necesidades Básicas Insatisfechas) y autoidentificación étnica por provincia.

**Variable NBI usada:** porcentaje de hogares con al menos una necesidad básica insatisfecha, a nivel provincial.

**Variable étnica:** porcentaje de población que se autoidentifica como indígena, a nivel provincial.

**Uso:** denominador poblacional para tasas (población total por provincia) y variables independientes en el Cruce 2.

---

## 5. Cruce 1 — Barras dobles por provincia

**Variables:** tasa de mortalidad acumulada 2019–2024 por 100.000 hab. (INEC) vs. insulina per cápita acumulada 2019–2024 en USD (SERCOP).

**Clasificación en cuadrantes:** se usa la mediana de cada variable como punto de corte.

| Cuadrante | Condición |
|-----------|-----------|
| `brecha_critica` | mortalidad > mediana **y** insulina < mediana |
| `alta_cobertura` | mortalidad > mediana **y** insulina ≥ mediana |
| `sobrecobertura` | mortalidad ≤ mediana **y** insulina ≥ mediana |
| `baja_presion` | mortalidad ≤ mediana **y** insulina < mediana |

Provincias en `brecha_critica` (2019–2024): **El Oro, Esmeraldas, Carchi, Cotopaxi**.

---

## 6. Cruce 2 — Scatter provincial NBI vs. mortalidad

**Variables:** NBI provincial (%) vs. tasa de mortalidad acumulada por diabetes 2019–2024 por 100.000 hab.

**n = 24 provincias.**

**Resultados estadísticos:**
- Spearman: r = −0,36, p = 0,082
- OLS: R² = 0,078, p = 0,187

Con n = 24, ninguna correlación alcanza p < 0,05 convencional. **Los resultados se reportan como tendencias sugerentes, no como prueba de hipótesis.** La correlación negativa (más NBI → menos mortalidad en algunas provincias) es contraintuitiva y se discute como desviación positiva.

**Desviación positiva:** provincias con NBI por encima de la mediana nacional pero mortalidad por debajo de la tasa esperada según la regresión. Pueden reflejar resistencia cultural/dietética o sesgo de subregistro (ver sección 7).

---

## 7. Sesgo de subregistro y desviación positiva

La desviación positiva observada en provincias como Bolívar, Cañar o Sucumbíos puede tener dos orígenes no mutuamente excluyentes:

**Hipótesis 1 — Resistencia:** en zonas con mayor persistencia de dieta tradicional andina (papa, maíz, quinua, fréjol) y actividad física elevada por el tipo de trabajo agrícola, la transición alimentaria podría haber avanzado más lentamente, generando menor incidencia real de diabetes.

**Hipótesis 2 — Subregistro:** en comunidades alejadas de centros hospitalarios, los pacientes que mueren en su domicilio o en un puesto de salud sin diagnóstico previo confirmado reciben certificaciones de causa de muerte menos precisas. El médico rural, sin historial clínico ni prueba de glucosa reciente, puede codificar la causa como "insuficiencia cardíaca", "causas mal definidas" (CIE-10 R00–R99) o simplemente no especificar. Esto deprimiría artificialmente la tasa de mortalidad por diabetes en provincias con menor cobertura institucional.

**Implicación:** las provincias con menor mortalidad observada en contextos de alta pobreza merecen investigación de campo, no conclusiones. El dato invita a la pregunta, no la responde.

**Limitación analítica:** el proyecto no puede separar empíricamente ambos efectos con los datos disponibles. Una estimación del subregistro requeriría comparar certificaciones de muerte con encuestas de prevalencia de glucosa en la misma zona, información que no existe en microdato público para Ecuador.

---

## 8. Replicabilidad

El flujo completo de reconstrucción de outputs públicos sigue este orden:

```bash
# 1. Limpiar y agregar SERCOP (genera processed/sercop_*.csv)
python3 data/analisis/rebuild_sercop_cruce1.py

# 2. Limpiar defunciones INEC
jupyter nbconvert --to notebook --execute --inplace data/analisis/02_limpieza_defunciones.ipynb

# 3. Limpiar Censo (NBI + etnia)
jupyter nbconvert --to notebook --execute --inplace data/analisis/03_limpieza_censo.ipynb

# 4. Limpiar ENSANUT
jupyter nbconvert --to notebook --execute --inplace data/analisis/01_limpieza_ensanut.ipynb

# 5. Cruce 1 (barras + serie histórica)
jupyter nbconvert --to notebook --execute --inplace data/analisis/05_cruce_1_barras.ipynb

# 6. Cruce 2 (scatter + desplazamiento)
jupyter nbconvert --to notebook --execute --inplace data/analisis/06_cruce_2_scatter_desviacion.ipynb
```

Los outputs de la web se sirven desde `web/public/data/`. Para sincronizar:

```bash
cp data/processed/cruce1_barras_provincia.csv web/public/data/barras.csv
cp data/processed/cruce2_scatter_provincia.csv web/public/data/scatter.csv
cp data/processed/cruce2_desplazamiento_provincia.csv web/public/data/desplazamiento.csv
# serie.csv se construye en notebook 05 y se copia manualmente
```

---

*Última actualización: 21 de mayo de 2026.*
