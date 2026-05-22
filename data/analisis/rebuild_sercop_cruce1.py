from __future__ import annotations

import csv
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RAW_SERCOP = ROOT / "data" / "raw" / "SERCOP"
PROCESSED = ROOT / "data" / "processed"


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def write_csv(path: Path, rows: list[dict[str, object]], fieldnames: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def normalize_province(name: str) -> str:
    text = (name or "").strip().upper()
    mapping = {
        "CAÑAR": "CANAR",
        "SANTO DOMINGO DE LOS TSACHILAS": "SANTO DOMINGO DE LOS TSACHILAS",
        "LOS RÍOS": "LOS RIOS",
    }
    return mapping.get(text, text.replace("Á", "A").replace("É", "E").replace("Í", "I").replace("Ó", "O").replace("Ú", "U").replace("Ñ", "N"))


def load_clean_sercop() -> tuple[list[dict[str, object]], dict[str, int]]:
    raw_rows: list[dict[str, str]] = []
    for path in sorted(RAW_SERCOP.glob("insulina_*.csv")):
        raw_rows.extend(read_csv(path))

    stats = {
        "raw_rows": len(raw_rows),
        "dropped_missing_amount_or_region": 0,
        "dropped_exact_duplicates": 0,
        "dropped_exclude_insulins": 0,
    }

    deduped: list[dict[str, str]] = []
    seen: set[tuple[tuple[str, str], ...]] = set()
    for row in raw_rows:
        key = tuple(row.items())
        if key in seen:
            stats["dropped_exact_duplicates"] += 1
            continue
        seen.add(key)
        deduped.append(row)

    cleaned: list[dict[str, object]] = []
    for row in deduped:
        if not (row.get("amount") or "").strip() or not (row.get("region") or "").strip():
            stats["dropped_missing_amount_or_region"] += 1
            continue
        amount = float(row["amount"])
        if amount <= 0:
            stats["dropped_missing_amount_or_region"] += 1
            continue
        text_blob = f"{row.get('title', '')} {row.get('description', '')}".upper()
        if "EXCLUYE HORMONAS SEXUALES E INSULINAS" in text_blob:
            stats["dropped_exclude_insulins"] += 1
            continue
        cleaned.append(
            {
                "id": row["id"],
                "ocid": row["ocid"],
                "year": int(row["year"]),
                "month": int(row["month"]),
                "method": row["method"],
                "internal_type": row["internal_type"],
                "region": normalize_province(row["region"]),
                "locality": (row["locality"] or "").strip().upper(),
                "buyer": (row["buyer"] or "").strip().upper(),
                "suppliers": (row["suppliers"] or "").strip().upper(),
                "amount": round(amount, 2),
                "budget": row["budget"],
                "date": row["date"],
                "title": row["title"],
                "description": row["description"],
            }
        )

    return cleaned, stats


def aggregate_sercop(cleaned: list[dict[str, object]]) -> None:
    consolidated_fields = [
        "id",
        "ocid",
        "year",
        "month",
        "method",
        "internal_type",
        "region",
        "locality",
        "buyer",
        "suppliers",
        "amount",
        "budget",
        "date",
        "title",
        "description",
    ]
    write_csv(PROCESSED / "sercop_insulina_consolidado.csv", cleaned, consolidated_fields)

    prov_year: dict[tuple[str, int], list[dict[str, object]]] = {}
    for row in cleaned:
        prov_year.setdefault((row["region"], row["year"]), []).append(row)

    prov_year_rows: list[dict[str, object]] = []
    for (prov, year), items in sorted(prov_year.items()):
        amounts = [float(x["amount"]) for x in items]
        prov_year_rows.append(
            {
                "provincia": prov,
                "year": year,
                "contratos": len(items),
                "monto_total_usd": round(sum(amounts), 2),
                "monto_promedio_usd": round(sum(amounts) / len(amounts), 2),
                "compradores_distintos": len({x["buyer"] for x in items}),
            }
        )
    write_csv(
        PROCESSED / "sercop_provincia_anio.csv",
        prov_year_rows,
        ["provincia", "year", "contratos", "monto_total_usd", "monto_promedio_usd", "compradores_distintos"],
    )

    prov_total: dict[str, list[dict[str, object]]] = {}
    for row in cleaned:
        prov_total.setdefault(row["region"], []).append(row)

    prov_total_rows: list[dict[str, object]] = []
    for prov, items in sorted(prov_total.items()):
        prov_total_rows.append(
            {
                "provincia": prov,
                "contratos_total": len(items),
                "monto_total_usd": round(sum(float(x["amount"]) for x in items), 2),
                "anios_con_datos": len({x["year"] for x in items}),
            }
        )
    prov_total_rows.sort(key=lambda r: float(r["monto_total_usd"]), reverse=True)
    write_csv(
        PROCESSED / "sercop_provincia_total.csv",
        prov_total_rows,
        ["provincia", "contratos_total", "monto_total_usd", "anios_con_datos"],
    )

    nat_year: dict[int, list[dict[str, object]]] = {}
    for row in cleaned:
        nat_year.setdefault(row["year"], []).append(row)

    nat_rows: list[dict[str, object]] = []
    for year, items in sorted(nat_year.items()):
        nat_rows.append(
            {
                "year": year,
                "contratos": len(items),
                "monto_total_usd": round(sum(float(x["amount"]) for x in items), 2),
                "compradores_distintos": len({x["buyer"] for x in items}),
            }
        )
    write_csv(PROCESSED / "sercop_nacional_anio.csv", nat_rows, ["year", "contratos", "monto_total_usd", "compradores_distintos"])


def rebuild_cruce1() -> dict[str, object]:
    defunc = read_csv(PROCESSED / "defunciones_diabetes_provincia_total.csv")
    nbi = read_csv(PROCESSED / "censo_nbi_provincia.csv")
    sercop_year = read_csv(PROCESSED / "sercop_provincia_anio.csv")
    serie = read_csv(PROCESSED / "defunciones_diabetes_serie_nacional.csv")

    defunc_map = {normalize_province(r["provincia"]): int(r["muertes_diabetes_total"]) for r in defunc}
    nbi_map = {
        normalize_province(r["provincia"]): {
            "pob_total": float(r["pob_total"]),
            "pct_nbi": float(r["pct_nbi"]),
            "pct_indigena": float(r["pct_indigena"]),
        }
        for r in nbi
    }

    sercop_19_24: dict[str, dict[str, float]] = {}
    for row in sercop_year:
        year = int(row["year"])
        if year < 2019:
            continue
        prov = normalize_province(row["provincia"])
        agg = sercop_19_24.setdefault(prov, {"monto_usd_19_24": 0.0, "contratos_19_24": 0})
        agg["monto_usd_19_24"] += float(row["monto_total_usd"])
        agg["contratos_19_24"] += int(row["contratos"])

    rows: list[dict[str, object]] = []
    for prov in sorted(defunc_map):
        if prov not in nbi_map:
            continue
        info = nbi_map[prov]
        mort_total = defunc_map[prov]
        ser = sercop_19_24.get(prov, {"monto_usd_19_24": 0.0, "contratos_19_24": 0})
        tasa_acum = round((mort_total / info["pob_total"]) * 100000, 1)
        mort_anual = round(mort_total / 6, 1)
        ins_pc = round(ser["monto_usd_19_24"] / info["pob_total"], 2)
        rows.append(
            {
                "provincia": prov,
                "muertes_diabetes_total": mort_total,
                "muertes_por_anio": mort_anual,
                "pob_total": info["pob_total"],
                "tasa_mortalidad_100k": tasa_acum,
                "monto_usd_19_24": round(ser["monto_usd_19_24"], 2),
                "contratos_19_24": int(ser["contratos_19_24"]),
                "insulina_usd_per_capita": ins_pc,
                "pct_nbi": info["pct_nbi"],
                "pct_indigena": info["pct_indigena"],
            }
        )

    med_mort = sorted(r["tasa_mortalidad_100k"] for r in rows)
    med_ins = sorted(r["insulina_usd_per_capita"] for r in rows)
    n = len(rows)
    med_mort_val = (med_mort[n // 2 - 1] + med_mort[n // 2]) / 2
    med_ins_val = (med_ins[n // 2 - 1] + med_ins[n // 2]) / 2

    for row in rows:
        alta_mort = row["tasa_mortalidad_100k"] > med_mort_val
        alta_ins = row["insulina_usd_per_capita"] > med_ins_val
        if alta_mort and not alta_ins:
            cuadrante = "brecha_critica"
        elif alta_mort and alta_ins:
            cuadrante = "alta_cobertura"
        elif (not alta_mort) and alta_ins:
            cuadrante = "sobrecobertura"
        else:
            cuadrante = "baja_presion"
        row["cuadrante"] = cuadrante

    rows.sort(key=lambda r: float(r["tasa_mortalidad_100k"]), reverse=True)
    write_csv(
        PROCESSED / "cruce1_barras_provincia.csv",
        rows,
        [
            "provincia",
            "muertes_diabetes_total",
            "muertes_por_anio",
            "pob_total",
            "tasa_mortalidad_100k",
            "monto_usd_19_24",
            "contratos_19_24",
            "insulina_usd_per_capita",
            "pct_nbi",
            "pct_indigena",
            "cuadrante",
        ],
    )

    nat_map = {int(r["year"]): float(r["monto_total_usd"]) for r in read_csv(PROCESSED / "sercop_nacional_anio.csv")}
    serie_rows: list[dict[str, object]] = []
    for r in serie:
        year = int(r["anio"])
        serie_rows.append(
            {
                "anio": year,
                "muertes_diabetes": int(r["muertes_diabetes"]),
                "fuente": r["fuente"],
                "insulina_usd_total": round(nat_map[year], 0) if year in nat_map else "",
            }
        )
    write_csv(PROCESSED / "cruce1_serie_nacional.csv", serie_rows, ["anio", "muertes_diabetes", "fuente", "insulina_usd_total"])

    amount_19_24 = sum(float(r["monto_usd_19_24"]) for r in rows)
    pop_total = sum(float(r["pob_total"]) for r in rows)
    return {
        "median_mortality": round(med_mort_val, 1),
        "median_ins_pc": round(med_ins_val, 2),
        "public_insulina_percap_year_2019_2024": round(amount_19_24 / pop_total / 6, 2),
    }


def main() -> None:
    cleaned, stats = load_clean_sercop()
    aggregate_sercop(cleaned)
    cruce_stats = rebuild_cruce1()

    print("SERCOP limpio regenerado")
    print(f"- Registros crudos: {stats['raw_rows']}")
    print(f"- Duplicados exactos eliminados: {stats['dropped_exact_duplicates']}")
    print(f"- Registros sin monto/región eliminados: {stats['dropped_missing_amount_or_region']}")
    print(f"- Registros 'excluye insulinas' eliminados: {stats['dropped_exclude_insulins']}")
    print(f"- Registros finales: {len(cleaned)}")
    print(f"- Mediana mortalidad acumulada 2019-2024: {cruce_stats['median_mortality']}")
    print(f"- Mediana insulina pc 2019-2024: ${cruce_stats['median_ins_pc']}")
    print(f"- Referencia pública insulina pc/año (2019-2024): ${cruce_stats['public_insulina_percap_year_2019_2024']}")


if __name__ == "__main__":
    main()
