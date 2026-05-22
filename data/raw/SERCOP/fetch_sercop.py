"""
Consume la API de SERCOP (compraspublicas.gob.ec) para compras de insulina 2015-2024.
Por cada año genera un CSV en este mismo directorio: insulina_YYYY.csv
"""

import csv
import json
import time
import urllib.request
import urllib.error
from pathlib import Path

BASE_URL = "https://datosabiertos.compraspublicas.gob.ec/PLATAFORMA/api/search_ocds"
YEARS = [2021]  # faltó por interrupción previa
OUT_DIR = Path(__file__).parent

FIELDS = ["id", "ocid", "year", "month", "method", "internal_type",
          "region", "locality", "buyer", "suppliers", "amount", "budget", "date",
          "title", "description"]


MAX_RETRIES = 5


def fetch_page(year: int, page: int) -> dict:
    url = f"{BASE_URL}?year={year}&search=insulina&page={page}"
    req = urllib.request.Request(url, headers={"User-Agent": "bootcamp-aldato/1.0"})
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 10 * attempt
                print(f"    429 rate limit — esperando {wait}s (intento {attempt}/{MAX_RETRIES})")
                time.sleep(wait)
            else:
                raise
    raise RuntimeError(f"Máximo de reintentos alcanzado para {year} página {page}")


def fetch_year(year: int) -> list[dict]:
    records = []
    first = fetch_page(year, 1)
    total_pages = first.get("pages", 1)
    records.extend(first.get("data", []))
    print(f"  {year}: {first.get('total', 0)} registros, {total_pages} páginas")

    for page in range(2, total_pages + 1):
        time.sleep(1.5)  # respetar el servidor
        data = fetch_page(year, page)
        records.extend(data.get("data", []))
        print(f"    página {page}/{total_pages} — {len(records)} acumulados")

    return records


def save_csv(year: int, records: list[dict]) -> None:
    out_path = OUT_DIR / f"insulina_{year}.csv"
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(records)
    print(f"  → guardado: {out_path.name} ({len(records)} filas)")


def main() -> None:
    for year in YEARS:
        print(f"\nAño {year}...")
        try:
            records = fetch_year(year)
            save_csv(year, records)
        except urllib.error.URLError as e:
            print(f"  ERROR red año {year}: {e}")
        except Exception as e:
            print(f"  ERROR inesperado año {year}: {e}")
            raise

    print("\nListo. CSVs generados en:", OUT_DIR)


if __name__ == "__main__":
    main()
