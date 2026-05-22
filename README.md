# A medias no cuenta
### Transición alimentaria, diabetes y el vacío del Estado en el campo ecuatoriano

Historia de datos desarrollada como proyecto final del bootcamp del **Observatorio Al Dato**, en colaboración con **Fundación Datalat** e **Indeciencia** — mayo 2026.

El proyecto investiga una pregunta concreta: **¿qué ocurre cuando la modernización alimentaria llega al campo antes que la atención sanitaria?** A partir de datos abiertos de mortalidad, compras públicas, pobreza y nutrición, muestra cómo la diabetes creció en provincias rurales ecuatorianas mientras la respuesta estatal en insulina fue desigual, tardía o insuficiente.

---

## La tesis

> *La modernización entró al campo como consumo mucho antes de entrar como cuidado.*

Las comunidades rurales ecuatorianas incorporaron patrones de vida urbana —ultraprocesados, sedentarismo, riesgo metabólico— sin que el Estado expandiera su presencia sanitaria al mismo ritmo. El resultado: una brecha visible entre carga de enfermedad y capacidad de respuesta pública.

---

## Hallazgos principales

**1. La transición alimentaria ya estaba instalada**
En 2018, el **62%** de los adultos rurales vivía con sobrepeso u obesidad (ENSANUT 2018, ponderado con factor de expansión `fexp`). El riesgo ya no era exclusivamente urbano.

**2. El Estado dejó de medir justo cuando más lo necesitaba**
La ENSANUT 2018 no incluyó biomarcadores públicos de glucosa, a diferencia de la edición 2012. El único dato disponible de prevalencia directa —7,1% de adultos con glucosa elevada en ayunas— proviene del módulo STEPS 2018 del MSP, publicado solo como informe PDF, sin microdato. Cuando la enfermedad crecía, el instrumento de medición retrocedió.

**3. La fractura se vuelve visible en 2020**
En 2020, las muertes por diabetes subieron **24%** respecto al año anterior (4.940 → 6.129). Ese mismo año, las compras públicas de insulina cayeron **35%** y tocaron su punto más bajo en cinco años.

**4. Catorce centavos que se convirtieron en veinte**
Entre 2019 y 2024, el Estado invirtió en promedio **$0,20 por persona por año** en insulina ($19,8 millones / 16,9 millones de personas / 6 años). En ese mismo período murieron **25.708 personas** de diabetes en Ecuador.

**5. La insulina no sigue el mapa de la necesidad**
Cuatro provincias combinan mortalidad alta con inversión per cápita en insulina por debajo de la mediana nacional: **El Oro, Esmeraldas, Carchi y Cotopaxi**. Ahí se abre la brecha más visible.

**6. Morir implica desplazarse**
**1 de cada 4** residentes rurales que murió de diabetes falleció fuera de su provincia de residencia. La enfermedad se complica en el campo; la muerte queda registrada en la ciudad.

**7. No todas las provincias siguen el patrón esperado**
Ocho provincias muestran *desviación positiva*: mortalidad observada por debajo de lo que su nivel de pobreza haría esperar. Puede reflejar resistencia cultural, dieta más tradicional, o menor capacidad institucional para registrar la causa de muerte. Las dos lecturas interpelan al Estado.

---

## Fuentes de datos

| Fuente | Período | Uso principal |
|--------|---------|---------------|
| ENSANUT 2018 (INEC/MSP) | 2018 | Sobrepeso/obesidad rural, ultraprocesados adolescentes |
| Defunciones Generales INEC | 2019–2024 | Mortalidad CIE-10 E10–E14 por provincia |
| Censo de Población y Vivienda 2022 | 2022 | Denominador poblacional, NBI, etnia |
| SERCOP API compras públicas | 2015–2024 | Compras de insulina por provincia y año |
| STEPS 2018 MSP | 2018 | Prevalencia glucosa elevada (cifra agregada, sin microdato) |

### Limpieza SERCOP — trazabilidad

Los datos de SERCOP requirieron depuración antes de su uso analítico. El script `data/analisis/rebuild_sercop_cruce1.py` reproduce el proceso completo y genera las siguientes tablas de exclusión en `data/processed/`:

| Criterio de exclusión | Registros | Archivo |
|-----------------------|-----------|---------|
| Duplicados exactos (paginación API) | 1.267 | `sercop_excluidos_duplicados.csv` |
| Sin monto válido o sin región | 62 | `sercop_excluidos_sin_datos.csv` |
| Descripción "excluye hormonas sexuales e insulinas" | 26 | `sercop_excluidos_excluye_insulinas.csv` |
| **Total excluidos** | **1.355** | |
| **Registros finales** | **5.871** | `sercop_insulina_consolidado.csv` |

---

## Metodología

El análisis se resuelve a nivel **provincial** (24 unidades). No fue una preferencia de diseño: los microdatos de defunciones del INEC no incluyen cantón de residencia (`cant_res`), solo cantón de fallecimiento (`cant_fall`), que sesgaría el análisis hacia provincias con hospitales de referencia. La escala provincial es la más granular que los datos permiten defender.

**Estandarización:** todo se lleva a tasas por 100.000 habitantes usando población del Censo 2022 como denominador fijo. Las tasas de mortalidad presentadas son **acumuladas 2019–2024**, no anuales.

```
tasa_acumulada_100k = (muertes_2019_2024 / población_provincia_2022) × 100.000
insulina_per_capita = monto_usd_2019_2024 / población_provincia_2022
```

**Lenguaje inferencial:** con n = 24, ningún coeficiente alcanza p < 0,05. Spearman NBI~mortalidad: r = −0,36, p = 0,082; OLS: R² = 0,078, p = 0,187. Los resultados se reportan como tendencias sugerentes, no como prueba de hipótesis.

**Documentación detallada:** ver [`METODOLOGIA.md`](./METODOLOGIA.md) — incluye criterios de exclusión por fuente, fórmulas exactas, notas sobre encoding INEC 2019, discusión de sesgo de subregistro y flujo completo de reproducibilidad.

---

## Estructura del repositorio

```text
bootcamp/
├── README.md
├── METODOLOGIA.md                  ← apéndice metodológico completo
├── AGENTS.md                       ← estado del proyecto, decisiones, pendientes
├── data/
│   ├── analisis/
│   │   ├── rebuild_sercop_cruce1.py   ← script SERCOP (limpieza + cruces)
│   │   ├── 01_limpieza_ensanut.ipynb
│   │   ├── 02_limpieza_defunciones.ipynb
│   │   ├── 03_limpieza_censo.ipynb
│   │   ├── 04_sercop_api.ipynb
│   │   ├── 05_cruce_1_barras.ipynb
│   │   └── 06_cruce_2_scatter_desviacion.ipynb
│   ├── processed/                  ← outputs limpios listos para cruce
│   └── raw/                        ← datos crudos por fuente
└── web/
    ├── public/data/                ← CSVs servidos a la historia web
    ├── src/
    └── package.json
```

---

## Reproducibilidad

Para reconstruir todos los outputs desde los datos crudos:

```bash
# 1. Limpiar SERCOP y reconstruir cruces 1 (también genera tablas de trazabilidad)
python3 data/analisis/rebuild_sercop_cruce1.py

# 2–4. Limpiar fuentes restantes
jupyter nbconvert --to notebook --execute --inplace data/analisis/02_limpieza_defunciones.ipynb
jupyter nbconvert --to notebook --execute --inplace data/analisis/03_limpieza_censo.ipynb
jupyter nbconvert --to notebook --execute --inplace data/analisis/01_limpieza_ensanut.ipynb

# 5–6. Cruces analíticos
jupyter nbconvert --to notebook --execute --inplace data/analisis/05_cruce_1_barras.ipynb
jupyter nbconvert --to notebook --execute --inplace data/analisis/06_cruce_2_scatter_desviacion.ipynb
```

Los CSVs que sirven la web viven en `web/public/data/` y deben sincronizarse manualmente desde `data/processed/` cuando cambian los procesados.

---

## Correr la web en local

```bash
cd web
npm install
npm run dev
```

Para build de producción: `npm run build`. Para previsualizar el build: `npm run preview`.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Historia web | React 18 + D3 7 + Vite 5 |
| Análisis | Python 3 / Jupyter |
| Deploy | GitHub Pages |

---

## Limitaciones

- No existe microdato bioquímico público de diabetes confirmada para Ecuador 2018 (ENSANUT no incluyó glucosa; STEPS solo existe como PDF).
- El análisis es provincial, no parroquial ni cantonal, por limitaciones del microdato INEC.
- Las relaciones mostradas son asociaciones territoriales, no prueba de causalidad.
- Puede existir sesgo de subregistro de causa de muerte en zonas rurales remotas, lo que afecta especialmente la interpretación de la desviación positiva.
- La comparación mortalidad–compras públicas mide respuesta estatal observable, no acceso efectivo al tratamiento en territorio.

---

## Por qué importa

Esta historia no trata solo de diabetes. Trata de cómo un país puede modernizar el consumo sin modernizar el cuidado en la misma medida. Trata de qué se mide, qué se deja de medir, dónde responde el Estado y dónde llega tarde.

También es una pregunta periodística más grande: **qué se ve cuando se cruzan enfermedad, territorio y presupuesto público**.

---

## Créditos

**Autor:** Andrés Almeida  
**Marco:** Bootcamp del Observatorio Al Dato, en colaboración con Fundación Datalat e Indeciencia  
**Fecha:** mayo de 2026

---

## Licencia

Código y estructura técnica bajo licencia **MIT**. Si se reutiliza la metodología, la narrativa o las visualizaciones en contextos públicos, se recomienda citar el proyecto completo con atribución al autor y al bootcamp de origen.
