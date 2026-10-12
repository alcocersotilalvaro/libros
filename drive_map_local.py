#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
drive_map_local.py — Genera `drive_map.json` leyendo directamente la base de datos
local de Google Drive para Escritorio (sin OAuth ni red).

Empareja los archivos reales de la carpeta local de libros con su ID de Google
Drive usando la tabla `items` de DriveFS. Es la vía más fiable cuando la cuenta
de Drive para Escritorio no coincide con la de la API o hay varias cuentas.

Uso:
    python drive_map_local.py                       # autodetecta la cuenta dueña
    python drive_map_local.py --books "G:\\Mi unidad\\libros"
    python drive_map_local.py --account <ID_carpeta_DriveFS>
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import sqlite3
import tempfile
import unicodedata
from pathlib import Path

DRIVEFS_BASE = Path(os.environ["LOCALAPPDATA"]) / "Google" / "DriveFS"
PROJECT_DIR = Path(__file__).resolve().parent
DRIVE_MAP_FILE = PROJECT_DIR / "drive_map.json"
DEFAULT_BOOKS = Path(r"G:\Mi unidad\libros")
SUPPORTED_EXT = {".pdf", ".epub", ".mobi"}


def _norm(s: str) -> str:
    return unicodedata.normalize("NFC", s)


def _copy_db(account_dir: Path) -> Path | None:
    src = account_dir / "metadata_sqlite_db"
    if not src.exists():
        return None
    tmp = Path(tempfile.gettempdir()) / f"drivemap_{account_dir.name}.db"
    shutil.copy2(src, tmp)
    for suffix in ("-wal", "-shm"):
        s = Path(str(src) + suffix)
        if s.exists():
            shutil.copy2(s, Path(str(tmp) + suffix))
    return tmp


def _load_items(db_path: Path) -> dict[str, str]:
    """Devuelve {nombre_normalizado: driveId}, prefiriendo archivos propios."""
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    cur.execute(
        "SELECT local_title, id, is_owner FROM items "
        "WHERE is_folder = 0 AND trashed = 0 AND id IS NOT NULL"
    )
    best: dict[str, tuple[int, str]] = {}
    for title, drive_id, is_owner in cur.fetchall():
        if not title:
            continue
        if Path(title).suffix.lower() not in SUPPORTED_EXT:
            continue
        key = _norm(title)
        score = 1 if is_owner else 0
        if key not in best or score > best[key][0]:
            best[key] = (score, drive_id)
    con.close()
    return {k: v[1] for k, v in best.items()}


def _detect_accounts() -> list[Path]:
    if not DRIVEFS_BASE.exists():
        return []
    return [p for p in DRIVEFS_BASE.iterdir() if p.is_dir() and p.name.isdigit()]


def main():
    ap = argparse.ArgumentParser(description="Genera drive_map.json desde DriveFS local.")
    ap.add_argument("--books", default=str(DEFAULT_BOOKS), help="Carpeta local de libros.")
    ap.add_argument("--account", help="ID de carpeta DriveFS a usar (opcional).")
    args = ap.parse_args()

    books_dir = Path(args.books)
    if not books_dir.exists():
        raise SystemExit(f"No existe la carpeta de libros: {books_dir}")

    # Nombres de archivo locales soportados.
    local_names: set[str] = set()
    for p in books_dir.rglob("*"):
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXT:
            local_names.add(_norm(p.name))
    print(f"Archivos locales soportados: {len(local_names)}")

    accounts = [DRIVEFS_BASE / args.account] if args.account else _detect_accounts()
    if not accounts:
        raise SystemExit("No se encontraron cuentas de Google Drive para Escritorio.")

    # Elegir la cuenta con más coincidencias con la biblioteca local.
    best_account = None
    best_map: dict[str, str] = {}
    best_hits = -1
    for acc in accounts:
        db = _copy_db(acc)
        if not db:
            continue
        items = _load_items(db)
        hits = sum(1 for n in local_names if n in items)
        print(f"  cuenta {acc.name}: {hits} coincidencias con la biblioteca")
        if hits > best_hits:
            best_hits, best_account, best_map = hits, acc, items

    if best_account is None:
        raise SystemExit("No se pudo leer ninguna base de datos de DriveFS.")
    print(f"Cuenta elegida: {best_account.name} ({best_hits} coincidencias)")

    # Mapa final keyed por el nombre de archivo local exacto.
    mapping: dict[str, str] = {}
    for p in books_dir.rglob("*"):
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXT:
            drive_id = best_map.get(_norm(p.name))
            if drive_id:
                mapping[p.name] = drive_id

    with open(DRIVE_MAP_FILE, "w", encoding="utf-8") as f:
        json.dump(mapping, f, ensure_ascii=False, indent=2)
    print(f"\n[OK] {len(mapping)} libros mapeados en {DRIVE_MAP_FILE.name}.")
    print("Ahora ejecuta:  python indexer.py")


if __name__ == "__main__":
    main()
