#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
drive_sync.py — Obtiene los IDs de Google Drive de todos los libros y genera
`drive_map.json` automáticamente (para que el visor embebido funcione en la web).

Recorre recursivamente una carpeta de Google Drive (por nombre o por ID) y crea
un mapa {ruta_relativa: fileId}. Opcionalmente comparte cada archivo como
"cualquiera con el enlace (lector)" para que el visor funcione en el sitio público.

Requisitos (una sola vez):
    pip install -r requirements.txt
    Coloca `drive_credentials.json` (cliente OAuth de escritorio) junto a este script.
    Ver README (sección "Visor de lectura con Google Drive") para el paso a paso.

Uso:
    python drive_sync.py                       # busca la carpeta "libros" en Mi unidad
    python drive_sync.py --folder-name libros  # idem, por nombre
    python drive_sync.py --folder-id <ID>      # usar el ID de la carpeta directamente
    python drive_sync.py --share               # además, comparte cada archivo (público lector)

La primera ejecución abrirá el navegador para autorizar; el token queda en `token.json`.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent
CREDENTIALS_FILE = PROJECT_DIR / "drive_credentials.json"
TOKEN_FILE = PROJECT_DIR / "token.json"
DRIVE_MAP_FILE = PROJECT_DIR / "drive_map.json"

SUPPORTED_EXT = {".pdf", ".epub", ".mobi"}
SCOPES = ["https://www.googleapis.com/auth/drive"]

FOLDER_MIME = "application/vnd.google-apps.folder"


def _require_libs():
    try:
        from google.oauth2.credentials import Credentials  # noqa: F401
        from google_auth_oauthlib.flow import InstalledAppFlow  # noqa: F401
        from google.auth.transport.requests import Request  # noqa: F401
        from googleapiclient.discovery import build  # noqa: F401
    except ImportError:
        print(
            "Faltan dependencias de Google. Instálalas con:\n"
            "    pip install -r requirements.txt\n"
            "(o: pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib)"
        )
        sys.exit(1)


def get_service():
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build

    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDENTIALS_FILE.exists():
                print(
                    f"No se encontró {CREDENTIALS_FILE.name}. Crea un cliente OAuth de "
                    "escritorio en Google Cloud Console, descárgalo como "
                    "'drive_credentials.json' y colócalo junto a este script.\n"
                    "Ver README, sección 'Visor de lectura con Google Drive'."
                )
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_FILE), SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, "w", encoding="utf-8") as f:
            f.write(creds.to_json())
    return build("drive", "v3", credentials=creds)


def find_folder_id(service, name: str) -> str | None:
    q = (
        f"name = '{name}' and mimeType = '{FOLDER_MIME}' and trashed = false"
    )
    resp = (
        service.files()
        .list(q=q, spaces="drive", fields="files(id, name)", pageSize=10)
        .execute()
    )
    files = resp.get("files", [])
    if not files:
        return None
    if len(files) > 1:
        print(f"Aviso: hay {len(files)} carpetas llamadas '{name}'. Usando la primera.")
    return files[0]["id"]


def list_folder(service, folder_id: str, prefix: str, mapping: dict, share: bool):
    """Recorre recursivamente una carpeta acumulando {ruta_relativa: fileId}."""
    page_token = None
    while True:
        resp = (
            service.files()
            .list(
                q=f"'{folder_id}' in parents and trashed = false",
                spaces="drive",
                fields="nextPageToken, files(id, name, mimeType)",
                pageSize=1000,
                pageToken=page_token,
            )
            .execute()
        )
        for f in resp.get("files", []):
            name = f["name"]
            rel = f"{prefix}{name}"
            if f["mimeType"] == FOLDER_MIME:
                list_folder(service, f["id"], rel + "/", mapping, share)
            else:
                ext = Path(name).suffix.lower()
                if ext in SUPPORTED_EXT:
                    mapping[rel] = f["id"]
                    if share:
                        _share_public(service, f["id"], rel)
        page_token = resp.get("nextPageToken")
        if not page_token:
            break


def list_all_files(service, mapping: dict, share: bool):
    """Enumera TODOS los archivos soportados de la cuenta, clave = nombre de archivo.

    Útil cuando los libros no están bajo una única carpeta 'libros'. El indexador
    empareja por nombre de archivo, así que basta con {nombre: fileId}.
    """
    mime_by_ext = {
        ".pdf": "application/pdf",
        ".epub": "application/epub+zip",
    }
    mimes = set(mime_by_ext.values())
    q = "trashed = false and (" + " or ".join(
        f"mimeType = '{m}'" for m in sorted(mimes)
    ) + " or name contains '.mobi')"
    page_token = None
    seen = 0
    while True:
        resp = (
            service.files()
            .list(
                q=q,
                spaces="drive",
                fields="nextPageToken, files(id, name, mimeType)",
                pageSize=1000,
                pageToken=page_token,
            )
            .execute()
        )
        for f in resp.get("files", []):
            name = f["name"]
            if Path(name).suffix.lower() not in SUPPORTED_EXT:
                continue
            seen += 1
            mapping[name] = f["id"]
            if share:
                _share_public(service, f["id"], name)
        page_token = resp.get("nextPageToken")
        if not page_token:
            break
    print(f"Archivos soportados encontrados en la cuenta: {seen}")


def _share_public(service, file_id: str, rel: str):
    from googleapiclient.errors import HttpError

    try:
        service.permissions().create(
            fileId=file_id,
            body={"type": "anyone", "role": "reader"},
            fields="id",
        ).execute()
    except HttpError as e:
        # Ya compartido o sin permiso; continuar sin abortar todo el proceso.
        print(f"  (aviso al compartir '{rel}': {e})")


def main():
    parser = argparse.ArgumentParser(description="Genera drive_map.json desde Google Drive.")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--folder-id", help="ID de la carpeta raíz de los libros en Drive.")
    group.add_argument(
        "--folder-name",
        default="libros",
        help="Nombre de la carpeta raíz a buscar en Drive (por defecto: 'libros').",
    )
    parser.add_argument(
        "--share",
        action="store_true",
        help="Comparte cada archivo como 'cualquiera con el enlace (lector)'.",
    )
    parser.add_argument(
        "--all-files",
        action="store_true",
        help="Mapea TODOS los libros de la cuenta por nombre (ignora la carpeta).",
    )
    args = parser.parse_args()

    _require_libs()
    service = get_service()

    if args.share:
        print("Modo compartir ACTIVADO: cada archivo se marcará como público (lector).")

    mapping: dict[str, str] = {}

    if args.all_files:
        print("Modo --all-files: mapeando TODOS los libros de la cuenta por nombre...")
        list_all_files(service, mapping, args.share)
    else:
        folder_id = args.folder_id
        if not folder_id:
            folder_id = find_folder_id(service, args.folder_name)
            if not folder_id:
                print(
                    f"No se encontró la carpeta '{args.folder_name}' en tu Drive. "
                    "Usa --folder-id con el ID exacto (está en la URL de la carpeta)."
                )
                sys.exit(1)
            print(f"Carpeta '{args.folder_name}' encontrada: {folder_id}")
        print("Recorriendo Drive (puede tardar según la cantidad de archivos)...")
        list_folder(service, folder_id, "", mapping, args.share)

    with open(DRIVE_MAP_FILE, "w", encoding="utf-8") as f:
        json.dump(mapping, f, ensure_ascii=False, indent=2)

    print(f"\n[OK] {len(mapping)} archivos mapeados en {DRIVE_MAP_FILE.name}.")
    print("Ahora ejecuta:  python indexer.py   (y luego recompila/despliega la web)")


if __name__ == "__main__":
    main()
