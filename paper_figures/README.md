# Paper Figures

Figuras estaticas en SVG, generadas en Python puro a partir de los CSV procesados
del proyecto. Esta carpeta no toca el frontend: existe para producir graficos
limpios, exportables y reutilizables en documentos, presentaciones o un futuro
working paper.

## Figuras incluidas

- `01_serie_historica.svg`
- `02_barras_provincia.svg`
- `03_scatter_desviacion.svg`

## Fuente de datos

- `data/processed/cruce1_serie_nacional.csv`
- `data/processed/cruce1_barras_provincia.csv`
- `data/processed/cruce2_scatter_provincia.csv`

## Como regenerarlas

Desde la raiz del repo:

```bash
python3 paper_figures/generate_figures.py
```

Si quieres usar el runtime ya verificado en esta maquina:

```bash
/Users/mackbookandres/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 paper_figures/generate_figures.py
```

Los SVG se guardan en `paper_figures/output/`.

## Nota editorial

Las figuras buscan un equilibrio entre claridad academica y continuidad visual con
el proyecto web. No replican cada efecto del frontend; traducen los mismos
hallazgos a un lenguaje mas estable para PDF, DOCX o paper.
