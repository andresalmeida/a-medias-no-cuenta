from __future__ import annotations

import csv
from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "processed"
OUT = ROOT / "paper_figures" / "output"

BG = "#f6efe3"
INK = "#231b17"
MUTED = "#6e6258"
GRID = "#d8ccb9"
ACCENT = "#a06b4a"
RED = "#d85240"
BLUE = "#4d8595"
GREEN = "#7a9850"
GRAY = "#8f8478"

SANS = "Outfit, ui-sans-serif, system-ui, sans-serif"
SERIF = "Cormorant Garamond, Georgia, serif"


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def fnum(value: str) -> float:
    if value is None or value == "":
        return 0.0
    return float(value)


def linear_scale(value: float, domain: tuple[float, float], rng: tuple[float, float]) -> float:
    d0, d1 = domain
    r0, r1 = rng
    if d1 == d0:
        return (r0 + r1) / 2
    ratio = (value - d0) / (d1 - d0)
    return r0 + ratio * (r1 - r0)


def fmt_int(value: float) -> str:
    return f"{int(round(value)):,}".replace(",", ".")


def fmt_dec(value: float, digits: int = 1) -> str:
    return f"{value:.{digits}f}".replace(".", ",")


def title_block(title: str, subtitle: str, width: int) -> str:
    return f"""
    <text x="72" y="52" font-family="{SANS}" font-size="11" letter-spacing="0.12em" fill="{ACCENT}">FIGURA</text>
    <text x="72" y="82" font-family="{SERIF}" font-size="30" fill="{INK}">{escape(title)}</text>
    <text x="72" y="106" font-family="{SANS}" font-size="12.5" fill="{MUTED}">{escape(subtitle)}</text>
    <line x1="72" y1="122" x2="{width - 72}" y2="122" stroke="{GRID}" stroke-width="1" />
    """


def footer_note(note: str, width: int, height: int) -> str:
    return f"""
    <line x1="72" y1="{height - 54}" x2="{width - 72}" y2="{height - 54}" stroke="{GRID}" stroke-width="1" />
    <text x="72" y="{height - 30}" font-family="{SANS}" font-size="11" fill="{MUTED}">{escape(note)}</text>
    """


def write_svg(path: Path, width: int, height: int, body: str) -> None:
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" fill="none">
<rect width="{width}" height="{height}" fill="{BG}" />
{body}
</svg>
"""
    path.write_text(svg, encoding="utf-8")


def series_chart() -> None:
    rows = read_csv(DATA / "cruce1_serie_nacional.csv")
    data = [
        {
            "anio": int(r["anio"]),
            "muertes": fnum(r["muertes_diabetes"]),
            "insulina": fnum(r["insulina_usd_total"]),
        }
        for r in rows
    ]

    width, height = 1180, 760
    left, top, right, bottom = 92, 150, 118, 116
    plot_w = width - left - right
    plot_h = height - top - bottom

    x_domain = (min(d["anio"] for d in data), max(d["anio"] for d in data))
    y_left = (0, max(d["muertes"] for d in data) * 1.12)
    y_right = (0, max(d["insulina"] for d in data) * 1.12)

    def x(v: float) -> float:
        return linear_scale(v, x_domain, (left, left + plot_w))

    def y_m(v: float) -> float:
        return linear_scale(v, y_left, (top + plot_h, top))

    def y_i(v: float) -> float:
        return linear_scale(v, y_right, (top + plot_h, top))

    grid = []
    for tick in [0, 1500, 3000, 4500, 6000]:
        yy = y_m(tick)
        grid.append(f'<line x1="{left}" y1="{yy:.1f}" x2="{left + plot_w}" y2="{yy:.1f}" stroke="{GRID}" stroke-width="1" />')
        grid.append(f'<text x="{left - 14}" y="{yy + 4:.1f}" text-anchor="end" font-family="{SANS}" font-size="11" fill="{RED}">{fmt_int(tick)}</text>')

    for tick in [0, 1_500_000, 3_000_000, 4_500_000, 6_000_000]:
        yy = y_i(tick)
        label = "$0" if tick == 0 else f"${tick/1_000_000:.1f}M".replace(".", ",")
        grid.append(f'<text x="{left + plot_w + 14}" y="{yy + 4:.1f}" font-family="{SANS}" font-size="11" fill="{BLUE}">{label}</text>')

    years = []
    for d in data:
        xx = x(d["anio"])
        years.append(f'<line x1="{xx:.1f}" y1="{top + plot_h}" x2="{xx:.1f}" y2="{top + plot_h + 8}" stroke="{GRID}" stroke-width="1" />')
        years.append(f'<text x="{xx:.1f}" y="{top + plot_h + 28}" text-anchor="middle" font-family="{SANS}" font-size="11" fill="{MUTED}">{d["anio"]}</text>')

    deaths_path = " ".join(
        f"{'M' if i == 0 else 'L'} {x(d['anio']):.1f} {y_m(d['muertes']):.1f}"
        for i, d in enumerate(data)
    )
    insulin_points = [d for d in data if d["insulina"] > 0]
    insulin_path = " ".join(
        f"{'M' if i == 0 else 'L'} {x(d['anio']):.1f} {y_i(d['insulina']):.1f}"
        for i, d in enumerate(insulin_points)
    )

    circles = []
    for d in data:
        circles.append(
            f'<circle cx="{x(d["anio"]):.1f}" cy="{y_m(d["muertes"]):.1f}" r="4.5" fill="{RED}" stroke="{BG}" stroke-width="2" />'
        )
    for d in insulin_points:
        circles.append(
            f'<circle cx="{x(d["anio"]):.1f}" cy="{y_i(d["insulina"]):.1f}" r="3.8" fill="{BLUE}" stroke="{BG}" stroke-width="2" />'
        )

    ann_2020 = next(d for d in data if d["anio"] == 2020)
    ann_x = x(ann_2020["anio"]) - 140
    ann_y = y_m(ann_2020["muertes"]) - 104

    body = f"""
    {title_block("Serie histórica nacional", "Muertes por diabetes e insulina comprada, 2013–2024", width)}
    {''.join(grid)}
    {''.join(years)}
    <path d="{deaths_path}" stroke="{RED}" stroke-width="3.2" fill="none" />
    <path d="{insulin_path}" stroke="{BLUE}" stroke-width="2.6" fill="none" stroke-dasharray="8 6" />
    {''.join(circles)}
    <rect x="{ann_x:.1f}" y="{ann_y:.1f}" width="224" height="72" rx="6" fill="#f3e3dc" stroke="#e5b1a6" stroke-width="1" />
    <text x="{ann_x + 14:.1f}" y="{ann_y + 23:.1f}" font-family="{SANS}" font-size="11.5" fill="{RED}" font-weight="700">2020: 6.129 muertes</text>
    <text x="{ann_x + 14:.1f}" y="{ann_y + 44:.1f}" font-family="{SANS}" font-size="10.5" fill="{MUTED}">pico nacional de la serie</text>
    <text x="{ann_x + 14:.1f}" y="{ann_y + 64:.1f}" font-family="{SANS}" font-size="10.5" fill="{BLUE}">insulina: mínimo del período reciente</text>
    <text x="{left}" y="{top - 18}" font-family="{SANS}" font-size="11" letter-spacing="0.12em" fill="{RED}">MUERTES POR DIABETES</text>
    <text x="{width - right}" y="{top - 18}" text-anchor="end" font-family="{SANS}" font-size="11" letter-spacing="0.12em" fill="{BLUE}">COMPRAS PÚBLICAS DE INSULINA (USD)</text>
    {footer_note("Fuente: INEC Defunciones 2013–2024; SERCOP 2015–2024. Elaboración propia.", width, height)}
    """
    write_svg(OUT / "01_serie_historica.svg", width, height, body)


def bars_chart() -> None:
    rows = read_csv(DATA / "cruce1_barras_provincia.csv")
    data = [
        {
            "provincia": r["provincia"].title().replace("De Los", "de los"),
            "mort": fnum(r["tasa_mortalidad_100k"]),
            "ins": fnum(r["insulina_usd_per_capita"]),
            "quadrant": r["cuadrante"],
        }
        for r in rows
    ]

    top = sorted(data, key=lambda d: d["mort"], reverse=True)[:12]

    width, height = 1180, 920
    left, top_m, right, bottom = 240, 150, 120, 96
    plot_w = width - left - right
    row_h = 52

    mort_max = max(d["mort"] for d in top) * 1.05
    ins_max = max(d["ins"] for d in top) * 1.05

    def mort_w(v: float) -> float:
        return linear_scale(v, (0, mort_max), (0, plot_w * 0.72))

    def ins_w(v: float) -> float:
        return linear_scale(v, (0, ins_max), (0, plot_w * 0.24))

    body_parts = [title_block("Brecha territorial", "Mortalidad acumulada e insulina per cápita por provincia", width)]
    body_parts.append(f'<text x="{left}" y="140" font-family="{SANS}" font-size="11" letter-spacing="0.12em" fill="{RED}">MORTALIDAD ACUMULADA POR 100.000 HAB.</text>')
    body_parts.append(f'<text x="{width - right}" y="140" text-anchor="end" font-family="{SANS}" font-size="11" letter-spacing="0.12em" fill="{BLUE}">INSULINA USD PER CÁPITA</text>')

    for i, d in enumerate(top):
        y = top_m + i * row_h
        is_gap = d["quadrant"] == "brecha_critica"
        label_fill = RED if is_gap else INK
        body_parts.append(f'<text x="{left - 16}" y="{y + 22}" text-anchor="end" font-family="{SANS}" font-size="12" fill="{label_fill}" font-weight="{"700" if is_gap else "500"}">{escape(d["provincia"])}</text>')
        body_parts.append(f'<rect x="{left}" y="{y + 8}" width="{mort_w(d["mort"]):.1f}" height="12" rx="6" fill="{RED}" fill-opacity="0.88" />')
        body_parts.append(f'<text x="{left + mort_w(d["mort"]) + 8:.1f}" y="{y + 18}" font-family="{SANS}" font-size="11" fill="{RED}">{fmt_dec(d["mort"])}</text>')
        ins_x = left + plot_w * 0.76
        body_parts.append(f'<rect x="{ins_x:.1f}" y="{y + 8}" width="{ins_w(d["ins"]):.1f}" height="12" rx="6" fill="{BLUE}" fill-opacity="0.88" />')
        body_parts.append(f'<text x="{ins_x + ins_w(d["ins"]) + 8:.1f}" y="{y + 18}" font-family="{SANS}" font-size="11" fill="{BLUE}">{fmt_dec(d["ins"], 2)}</text>')
        body_parts.append(f'<line x1="{left}" y1="{y + 34}" x2="{width - right}" y2="{y + 34}" stroke="{GRID}" stroke-width="0.7" />')

    body_parts.append(f'<text x="{left}" y="{height - 68}" font-family="{SANS}" font-size="11" fill="{MUTED}">Brecha crítica: provincias con mortalidad alta y cobertura pública relativamente baja.</text>')
    body_parts.append(footer_note("Fuente: INEC Defunciones 2019–2024; SERCOP 2019–2024; Censo 2022. Elaboración propia.", width, height))
    write_svg(OUT / "02_barras_provincia.svg", width, height, "".join(body_parts))


def scatter_chart() -> None:
    rows = read_csv(DATA / "cruce2_scatter_provincia.csv")
    data = [
        {
            "provincia": r["provincia"].title().replace("De Los", "de los"),
            "nbi": fnum(r["pct_nbi"]),
            "mort": fnum(r["tasa_mortalidad_100k"]),
            "expected": fnum(r["mortalidad_esperada"]),
            "desv": r["desviacion"],
        }
        for r in rows
    ]

    width, height = 1180, 780
    left, top, right, bottom = 90, 150, 78, 110
    plot_w = width - left - right
    plot_h = height - top - bottom

    x_min = min(d["nbi"] for d in data) - 4
    x_max = max(d["nbi"] for d in data) + 3
    y_max = max(d["mort"] for d in data) + 35

    def x(v: float) -> float:
        return linear_scale(v, (x_min, x_max), (left, left + plot_w))

    def y(v: float) -> float:
        return linear_scale(v, (0, y_max), (top + plot_h, top))

    body_parts = [title_block("Desviación positiva", "Pobreza estructural y mortalidad acumulada por diabetes", width)]

    for tick in [20, 30, 40, 50, 60, 70]:
        xx = x(tick)
        body_parts.append(f'<line x1="{xx:.1f}" y1="{top}" x2="{xx:.1f}" y2="{top + plot_h}" stroke="{GRID}" stroke-width="1" />')
        body_parts.append(f'<text x="{xx:.1f}" y="{top + plot_h + 28}" text-anchor="middle" font-family="{SANS}" font-size="11" fill="{MUTED}">{tick}%</text>')
    for tick in [0, 50, 100, 150, 200, 250, 300, 350]:
        yy = y(tick)
        body_parts.append(f'<line x1="{left}" y1="{yy:.1f}" x2="{left + plot_w}" y2="{yy:.1f}" stroke="{GRID}" stroke-width="1" />')
        body_parts.append(f'<text x="{left - 14}" y="{yy + 4:.1f}" text-anchor="end" font-family="{SANS}" font-size="11" fill="{MUTED}">{tick}</text>')

    sorted_rows = sorted(data, key=lambda d: d["nbi"])
    trend = " ".join(
        f"{'M' if i == 0 else 'L'} {x(d['nbi']):.1f} {y(d['expected']):.1f}"
        for i, d in enumerate(sorted_rows)
    )
    body_parts.append(f'<path d="{trend}" stroke="{ACCENT}" stroke-width="2.2" fill="none" stroke-dasharray="7 5" />')

    label_set = {
        "Galapagos",
        "Canar",
        "Sucumbios",
        "Bolivar",
        "Pichincha",
        "Santa Elena",
        "Guayas",
        "El Oro",
        "Esmeraldas",
        "Loja",
    }

    color_map = {"positiva": GREEN, "negativa": RED, "esperada": GRAY}
    for d in data:
        cx, cy = x(d["nbi"]), y(d["mort"])
        radius = 7.5 if d["desv"] != "esperada" else 5
        opacity = 0.9 if d["desv"] != "esperada" else 0.55
        body_parts.append(
            f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{radius}" fill="{color_map[d["desv"]]}" fill-opacity="{opacity}" stroke="{BG}" stroke-width="1.5" />'
        )
        if d["provincia"] in label_set:
            body_parts.append(
                f'<text x="{cx + 10:.1f}" y="{cy + 4:.1f}" font-family="{SANS}" font-size="11" fill="{color_map[d["desv"]] if d["desv"] != "esperada" else MUTED}" font-weight="{"700" if d["desv"] != "esperada" else "500"}">{escape(d["provincia"])}</text>'
            )

    body_parts.append(f'<text x="{left + plot_w / 2:.1f}" y="{height - 68}" text-anchor="middle" font-family="{SANS}" font-size="11" letter-spacing="0.12em" fill="{MUTED}">% HOGARES CON NBI</text>')
    body_parts.append(f'<text x="28" y="{top + plot_h / 2:.1f}" transform="rotate(-90 28 {top + plot_h / 2:.1f})" text-anchor="middle" font-family="{SANS}" font-size="11" letter-spacing="0.12em" fill="{MUTED}">MORTALIDAD ACUMULADA POR 100.000 HAB.</text>')

    body_parts.append(f'<circle cx="{width - 300}" cy="74" r="5" fill="{GREEN}" /><text x="{width - 286}" y="78" font-family="{SANS}" font-size="11" fill="{MUTED}">Resisten más</text>')
    body_parts.append(f'<circle cx="{width - 196}" cy="74" r="5" fill="{GRAY}" fill-opacity="0.7" /><text x="{width - 182}" y="78" font-family="{SANS}" font-size="11" fill="{MUTED}">Esperadas</text>')
    body_parts.append(f'<circle cx="{width - 94}" cy="74" r="5" fill="{RED}" /><text x="{width - 80}" y="78" font-family="{SANS}" font-size="11" fill="{MUTED}">Mueren más</text>')

    body_parts.append(footer_note("Fuente: INEC Defunciones 2019–2024; Censo 2022 NBI. Elaboración propia.", width, height))
    write_svg(OUT / "03_scatter_desviacion.svg", width, height, "".join(body_parts))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    series_chart()
    bars_chart()
    scatter_chart()
    print(f"Figuras generadas en: {OUT}")


if __name__ == "__main__":
    main()
