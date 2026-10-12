#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
indexer.py — Escanea la biblioteca local (Google Drive sincronizado),
gestiona duplicados, extrae metadatos, clasifica por temas y genera
`src/data/catalog.json` para la web.

Uso:
    python indexer.py                 # Modo simulación (NO borra nada)
    python indexer.py --delete        # Aplica el borrado de duplicados antiguos
    python indexer.py --books "G:/Mi unidad/libros"

Detección de duplicados:
    - Mismo título + misma edición  -> conserva el más reciente, borra el antiguo.
    - Mismo título, edición distinta -> conserva ambos y los marca como
      "múltiples ediciones" con una reseña comparativa básica.

Opcional — enlaces de Google Drive:
    Si existe `drive_map.json` (nombre_archivo -> driveFileId) junto a este
    script, se generará `driveEmbedUrl` para el visor embebido de la web.
    Ver README para cómo obtener los IDs.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import unicodedata
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path

# ----------------------------------------------------------------------------
# Configuración
# ----------------------------------------------------------------------------

DEFAULT_BOOKS_DIR = Path(r"G:\Mi unidad\libros")
PROJECT_DIR = Path(__file__).resolve().parent
OUTPUT_JSON = PROJECT_DIR / "src" / "data" / "catalog.json"
DRIVE_MAP_FILE = PROJECT_DIR / "drive_map.json"

SUPPORTED_EXT = {".pdf", ".epub", ".mobi"}

# Normalización de nombres de carpeta -> etiqueta de categoría legible
CATEGORY_LABELS = {
    "tic": "TIC & Tecnología",
    "literatura": "Literatura",
    "ilustrados": "Libros Ilustrados",
    "cientificos": "Ciencia",
    "ensayos": "Ensayo",
    "psicología&psiquiatria": "Psicología & Psiquiatría",
    "autoayuda": "Desarrollo Personal",
    "otros": "Otros",
    "biografía": "Biografía",
    "comics": "Cómics",
    "poesía": "Poesía",
    "filosofía": "Filosofía",
    "perú": "Perú",
    "regional": "Regional",
    "historia": "Historia",
    "guerras": "Historia · Guerras",
    "botanica-flora-fauna-genetica": "Naturaleza & Genética",
    "mineria": "Minería",
    "gastronomia": "Gastronomía",
    "medicina": "Medicina",
    "derecho&politica": "Derecho & Política",
    "cine": "Cine",
    "tesis": "Tesis & Académico",
    "educacion": "Educación",
    "boe-reglamentacio-españa": "Legislación (España)",
    "arte": "Arte",
    "economics": "Economía",
    "stadistical&forecasting&maths": "Estadística & Matemáticas",
    "diseño": "Diseño",
    "fotografias": "Fotografía",
    "cambio-climatico": "Cambio Climático",
    "deporte": "Deporte",
    "agricultura": "Agricultura",
    "marketing": "Marketing",
    "libro-blanco": "Libros Blancos",
    "sociologia": "Sociología",
    "startups": "Startups",
    "mba": "MBA & Negocios",
    "feminismo&mujeres&igualdad-genero": "Feminismo & Género",
    "migracion": "Migración",
    "periodismo": "Periodismo",
    "religion": "Religión",
    "inglés": "Inglés",
}

# ----------------------------------------------------------------------------
# Librerías opcionales para metadatos incrustados
# ----------------------------------------------------------------------------

try:
    from pypdf import PdfReader  # type: ignore
    _HAS_PYPDF = True
except Exception:  # pragma: no cover
    _HAS_PYPDF = False

try:
    from ebooklib import epub  # type: ignore
    _HAS_EBOOKLIB = True
except Exception:  # pragma: no cover
    _HAS_EBOOKLIB = False


# ----------------------------------------------------------------------------
# Modelo de datos
# ----------------------------------------------------------------------------

@dataclass
class Book:
    id: str
    title: str
    author: str
    edition: str
    year: str
    category: str
    format: str
    filePath: str          # ruta relativa a la carpeta de libros
    driveEmbedUrl: str
    summary: str
    review: str
    dateAdded: str
    editionsAvailable: int = 1
    _mtime: float = field(default=0.0, repr=False)
    _norm_key: str = field(default="", repr=False)


# ----------------------------------------------------------------------------
# Utilidades de texto
# ----------------------------------------------------------------------------

def strip_accents(text: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFKD", text) if not unicodedata.combining(c)
    )


def normalize_key(text: str) -> str:
    """Clave normalizada para comparar títulos (sin acentos, minúsculas, alfanumérico)."""
    text = strip_accents(text).lower()
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


# Palabras/tokens sin valor informativo que ensucian los nombres de archivo.
_JUNK_TOKENS = (
    r"ocr|pdf|epub|mobi|libgen|z\s?lib|scan(?:eado)?|final|copia|copy|descarga(?:r)?|"
    r"gratis|free|download|v\d{1,2}|vol(?:umen)?\s*final|www\.\S+|\.com\S*|"
    r"dokumen\s*pub"
)
_JUNK_RE = re.compile(rf"\b(?:{_JUNK_TOKENS})\b", re.IGNORECASE)
# Códigos de versión/identificador tipo arXiv o hashes: "2407 18384v2", "a1b2c3d4".
_VERSION_CODE_RE = re.compile(r"\b\d{3,5}[\s.]?\d{3,6}v\d\b|\b[0-9a-f]{8,}\b", re.IGNORECASE)
# Palabras que no se capitalizan en Title Case salvo al inicio.
_MINOR_WORDS = {
    "de", "del", "la", "las", "el", "los", "y", "e", "o", "u", "en", "a", "al",
    "con", "por", "para", "un", "una", "unos", "unas", "su", "sus", "the", "of",
    "and", "in", "on", "for",
}


_ROMAN_RE = re.compile(r"^[ivx]+$", re.IGNORECASE)


def _title_case(text: str) -> str:
    """Title Case respetando minúsculas gramaticales, acrónimos y numerales romanos."""
    words = text.split(" ")
    out = []
    for i, w in enumerate(words):
        if not w:
            continue
        low = w.lower()
        if w.isupper() and len(w) <= 5:  # probable acrónimo (TIC, PDF, ONU...)
            out.append(w)
        elif len(low) >= 2 and _ROMAN_RE.match(low):  # "xxi", "iii" -> "XXI", "III"
            out.append(low.upper())
        elif i > 0 and low in _MINOR_WORDS:
            out.append(low)
        else:
            out.append(low[:1].upper() + low[1:])
    return " ".join(out)


def clean_filename_title(stem: str) -> str:
    """Limpia el nombre de archivo para obtener un título presentable."""
    s = stem.replace("_", " ").replace(".", " ").replace("-", " ")
    s = _VERSION_CODE_RE.sub(" ", s)
    s = re.sub(r"\s+", " ", s).strip()
    # Elimina sufijos/tokens técnicos comunes (descarga, pdf, v2, etc.)
    s = _JUNK_RE.sub(" ", s)
    # Un año suelto al inicio o final (ya se guarda aparte en book.year) no aporta al título.
    s = re.sub(r"^(?:19|20)\d{2}\s+(?=\S)", "", s)
    s = re.sub(r"(?<=\S)\s+(?:19|20)\d{2}$", "", s)
    s = re.sub(r"\s+", " ", s).strip(" -_·")
    if not s:
        return stem
    return _title_case(s)


YEAR_RE = re.compile(r"(?<!\d)(1[5-9]\d{2}|20[0-4]\d)(?!\d)")
EDITION_RE = re.compile(
    r"\b(\d{1,2})\s*(?:ª|a|º|o|st|nd|rd|th)?\s*edici[oó]n\b"
    r"|\bedici[oó]n\s*(\d{1,2})\b"
    r"|\b(\d{1,2})(?:st|nd|rd|th)\s*ed(?:ition)?\b"
    r"|\b(\d{1,2})\s*ed\b",
    re.IGNORECASE,
)


def extract_year(text: str) -> str:
    m = YEAR_RE.findall(text)
    return m[-1] if m else ""


def extract_edition(text: str) -> str:
    m = EDITION_RE.search(text)
    if not m:
        # "nueva edición", "edición revisada", etc.
        alt = re.search(r"\b(nueva|revisada|ampliada|anotada|ilustrada|definitiva)\s+edici[oó]n\b",
                        text, re.IGNORECASE)
        if alt:
            return alt.group(1).capitalize()
        return "1ª edición"
    num = next((g for g in m.groups() if g), None)
    return f"{num}ª edición" if num else "1ª edición"


def _mostly_upper(text: str) -> bool:
    letters = [c for c in text if c.isalpha()]
    return bool(letters) and sum(c.isupper() for c in letters) / len(letters) > 0.7


def guess_author_title(stem: str) -> tuple[str, str]:
    """
    Heurística para separar autor y título de un nombre de archivo.
    Patrones frecuentes:
        "Autor - Título"
        "Apellido, Nombre - Título"
        "Título - AUTOR"
    Ante la ambigüedad "Autor - Título" / "Título - Autor" se asume que el
    fragmento más largo es el título (los títulos suelen ser más largos que el
    nombre del autor).
    """
    raw = stem.replace("_", " ").strip()
    parts = [p.strip(" -_·") for p in re.split(r"\s+-\s+", raw) if p.strip(" -_·")]

    if len(parts) >= 2:
        left, right = parts[0], " - ".join(parts[1:])
        # "Apellido, Nombre - Título" -> autor a la izquierda
        if "," in left and len(left) < 40:
            return clean_filename_title(right), _tidy_author(left)
        # Un lado en MAYÚSCULAS suele ser el autor
        if _mostly_upper(right) and not _mostly_upper(left):
            return clean_filename_title(left), _tidy_author(right)
        if _mostly_upper(left) and not _mostly_upper(right):
            return clean_filename_title(right), _tidy_author(left)
        # El título suele empezar por artículo o número; el autor, no.
        left_is_title = bool(re.match(r"^(el|la|los|las|un|una|unos|unas|the|a)\b|^\d",
                                      left, re.IGNORECASE))
        right_is_title = bool(re.match(r"^(el|la|los|las|un|una|unos|unas|the|a)\b|^\d",
                                       right, re.IGNORECASE))
        if left_is_title and not right_is_title:
            return clean_filename_title(left), _tidy_author(right)
        if right_is_title and not left_is_title:
            return clean_filename_title(right), _tidy_author(left)
        # Heurística por longitud: el título suele ser más largo que el autor
        if len(left) >= len(right):
            return clean_filename_title(left), _tidy_author(right)
        return clean_filename_title(right), _tidy_author(left)

    return clean_filename_title(raw), "Autor desconocido"


def dedup_key(stem: str) -> str:
    """
    Clave de agrupación para detectar duplicados de forma SEGURA.
    Usa el nombre de archivo completo (título + autor) tras eliminar los
    marcadores de año y de edición. Así, dos archivos solo se consideran la
    misma obra si su nombre es prácticamente idéntico, evitando borrar libros
    distintos por error.
    """
    s = stem.replace("_", " ")
    s = EDITION_RE.sub(" ", s)
    s = re.sub(r"\b(nueva|revisada|ampliada|anotada|ilustrada|definitiva)\s+edici[oó]n\b",
               " ", s, flags=re.IGNORECASE)
    s = YEAR_RE.sub(" ", s)
    s = re.sub(r"\b(ocr|pdf|epub|mobi|libgen|z lib|zlib|scan|final|copia|copy)\b",
               " ", s, flags=re.IGNORECASE)
    return normalize_key(s)


def _tidy_author(author: str) -> str:
    a = author.strip(" -_·")
    a = re.sub(r"\s+", " ", a)
    if "," in a:  # "Apellido, Nombre" -> "Nombre Apellido"
        last, _, first = a.partition(",")
        a = f"{first.strip()} {last.strip()}".strip()
    # Normaliza MAYÚSCULAS totales a Capitalización de Título
    if a and a == a.upper():
        a = a.title()
    return a or "Autor desconocido"


# Categorías de tono académico/técnico vs. narrativo/ensayístico, usadas para
# elegir un fallback de autor elegante y una reseña sintética acorde al tono.
_ACADEMIC_CATEGORIES = {
    "Tesis & Académico", "TIC & Tecnología", "Legislación (España)",
    "Libros Blancos", "Educación", "Estadística & Matemáticas", "Medicina",
    "Derecho & Política", "Economía", "MBA & Negocios", "Minería",
    "Naturaleza & Genética", "Agricultura", "Cambio Climático",
}


def author_fallback(category: str) -> str:
    """Clasificación elegante cuando no se detecta autor."""
    if category in _ACADEMIC_CATEGORIES:
        return "Obra Académica / Selección Editorial"
    return "Selección Editorial"


# ----------------------------------------------------------------------------
# Extracción de metadatos incrustados (opcional)
# ----------------------------------------------------------------------------

def read_embedded_metadata(path: Path) -> dict:
    ext = path.suffix.lower()
    try:
        if ext == ".pdf" and _HAS_PYPDF:
            reader = PdfReader(str(path))
            meta = reader.metadata or {}
            return {
                "title": (meta.title or "").strip() if meta.title else "",
                "author": (meta.author or "").strip() if meta.author else "",
            }
        if ext == ".epub" and _HAS_EBOOKLIB:
            book = epub.read_epub(str(path))
            title = book.get_metadata("DC", "title")
            author = book.get_metadata("DC", "creator")
            return {
                "title": title[0][0].strip() if title else "",
                "author": author[0][0].strip() if author else "",
            }
    except Exception:
        return {}
    return {}


# ----------------------------------------------------------------------------
# Clasificación / resúmenes
# ----------------------------------------------------------------------------

def category_from_path(book_path: Path, books_dir: Path) -> str:
    rel = book_path.relative_to(books_dir)
    if len(rel.parts) <= 1:
        return "General"
    folder = rel.parts[0]
    return CATEGORY_LABELS.get(folder.lower(), folder.replace("-", " ").replace("&", " & ").title())


def build_summary(book: "Book") -> str:
    """Genera una sinopsis sintética y variada (no una plantilla única), elegida
    de forma determinista según el título para que cada libro luzca distinto
    pero estable entre regeneraciones del catálogo."""
    is_academic = book.category in _ACADEMIC_CATEGORIES
    has_author = book.author not in ("Selección Editorial", "Obra Académica / Selección Editorial",
                                      "Autor desconocido", "")
    year_txt = f" ({book.year})" if book.year else ""
    who = book.author if has_author else book.author.lower()

    if is_academic:
        templates = [
            "Material de referencia sobre {cat_lower}{year}. Un recurso claro y bien "
            "estructurado para profundizar en la materia, ideal para estudio o consulta.",
            "Documento técnico dedicado a {cat_lower}{year}, con un enfoque práctico "
            "pensado para quien busca fundamentos sólidos y aplicables.",
            "Compendio especializado en {cat_lower}{year}. Aporta una base rigurosa "
            "y actualizada para investigadores, estudiantes y profesionales.",
        ]
    else:
        templates = [
            "Una obra de {cat_lower} que invita a mirar el mundo desde otro ángulo, "
            "con una voz propia y momentos que dejan huella{year}.",
            "Relato de {cat_lower} que combina sensibilidad y ritmo narrativo, "
            "perfecto para perderse una tarde de lectura{year}.",
            "Título de {cat_lower} que despierta la curiosidad desde la primera página "
            "y acompaña con una mirada honesta sobre su tema{year}.",
            "Una propuesta de {cat_lower} pensada para quienes disfrutan descubrir "
            "nuevas perspectivas a través de la lectura{year}.",
        ]

    idx = hashlib.md5((book.title + book.category).encode("utf-8")).hexdigest()
    template = templates[int(idx, 16) % len(templates)]
    # Minúsculas para insertar en la frase, salvo acrónimos (TIC, MBA, BOE...).
    cat_words = book.category.split(" ")
    cat_display = " ".join(w if (w.isupper() and len(w) <= 5) else w.lower() for w in cat_words)
    body = template.format(cat_lower=cat_display, year=year_txt)

    author_line = f"«{book.title}», de {who}." if has_author else f"«{book.title}»."
    return f"{author_line} {body}"


# ----------------------------------------------------------------------------
# Escaneo principal
# ----------------------------------------------------------------------------

def scan_books(books_dir: Path, drive_map: dict) -> list[Book]:
    books: list[Book] = []
    for path in sorted(books_dir.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in SUPPORTED_EXT:
            continue

        stem = path.stem
        embedded = read_embedded_metadata(path)
        title, author = guess_author_title(stem)

        # Prioriza metadatos incrustados si parecen válidos
        if embedded.get("title") and len(embedded["title"]) > 3:
            title = clean_filename_title(embedded["title"])
        if embedded.get("author") and len(embedded["author"]) > 2:
            author = _tidy_author(embedded["author"])

        search_text = f"{stem} {embedded.get('title', '')}"
        year = extract_year(search_text)
        edition = extract_edition(search_text)
        category = category_from_path(path, books_dir)
        rel_path = str(path.relative_to(books_dir)).replace("\\", "/")

        if author == "Autor desconocido":
            author = author_fallback(category)

        stat = path.stat()
        uid = hashlib.md5(rel_path.encode("utf-8")).hexdigest()[:12]

        drive_id = drive_map.get(path.name) or drive_map.get(rel_path)
        embed_url = f"https://drive.google.com/file/d/{drive_id}/preview" if drive_id else ""

        book = Book(
            id=uid,
            title=title,
            author=author,
            edition=edition,
            year=year,
            category=category,
            format=path.suffix.lower().lstrip("."),
            filePath=rel_path,
            driveEmbedUrl=embed_url,
            summary="",
            review="",
            dateAdded=datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc)
            .date()
            .isoformat(),
            _mtime=stat.st_mtime,
            _norm_key=dedup_key(stem),
        )
        book.summary = build_summary(book)
        books.append(book)
    return books


# ----------------------------------------------------------------------------
# Deduplicación
# ----------------------------------------------------------------------------

def deduplicate(books: list[Book], books_dir: Path, do_delete: bool) -> list[Book]:
    """
    Agrupa por título normalizado. Dentro de cada título:
      - Misma edición -> conserva el más reciente, elimina los antiguos.
      - Ediciones distintas -> conserva todas y anota comparativa.
    """
    by_title: dict[str, list[Book]] = {}
    for b in books:
        by_title.setdefault(b._norm_key, []).append(b)

    kept: list[Book] = []
    deleted_count = 0

    for norm_key, group in by_title.items():
        # Sub-agrupa por edición normalizada
        by_edition: dict[str, list[Book]] = {}
        for b in group:
            by_edition.setdefault(normalize_key(b.edition), []).append(b)

        distinct_editions = len(by_edition)

        for edition_group in by_edition.values():
            # Conserva el más reciente de cada edición idéntica
            edition_group.sort(key=lambda x: x._mtime, reverse=True)
            winner = edition_group[0]
            for loser in edition_group[1:]:
                deleted_count += 1
                abs_path = books_dir / loser.filePath
                if do_delete:
                    try:
                        abs_path.unlink()
                        print(f"  [BORRADO] {loser.filePath}")
                    except OSError as e:
                        print(f"  [ERROR al borrar] {loser.filePath}: {e}")
                else:
                    print(f"  [SIMULACIÓN - se borraría] {loser.filePath} "
                          f"(duplicado más antiguo de «{winner.title}»)")
            kept.append(winner)

        # Marca ediciones múltiples + reseña comparativa
        if distinct_editions > 1:
            title_winners = [b for b in kept if b._norm_key == norm_key]
            editions_list = sorted({b.edition for b in title_winners})
            for b in title_winners:
                b.editionsAvailable = distinct_editions
                b.review = (
                    f"Este título cuenta con {distinct_editions} ediciones en la biblioteca "
                    f"({', '.join(editions_list)}). "
                    f"Estás viendo la «{b.edition}»"
                    + (f" del año {b.year}." if b.year else ".")
                    + " Compara las distintas ediciones para elegir tu lectura."
                )

    kept.sort(key=lambda b: (b.category.lower(), b.title.lower()))
    return kept, deleted_count


# ----------------------------------------------------------------------------
# Serialización
# ----------------------------------------------------------------------------

def to_catalog(books: list[Book]) -> dict:
    def clean(b: Book) -> dict:
        d = asdict(b)
        d.pop("_mtime", None)
        d.pop("_norm_key", None)
        return d

    categories = sorted({b.category for b in books})
    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "totalBooks": len(books),
        "categories": categories,
        "books": [clean(b) for b in books],
    }


def load_drive_map() -> dict:
    if DRIVE_MAP_FILE.exists():
        try:
            with open(DRIVE_MAP_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
            print(f"drive_map.json cargado: {len(data)} enlaces de Drive.")
            return data
        except json.JSONDecodeError as e:
            print(f"Aviso: drive_map.json inválido ({e}). Se ignora.")
    return {}


# ----------------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(description="Indexador de la biblioteca personal.")
    parser.add_argument("--books", type=str, default=str(DEFAULT_BOOKS_DIR),
                        help="Ruta a la carpeta de libros.")
    parser.add_argument("--delete", action="store_true",
                        help="Aplica el borrado real de duplicados antiguos "
                             "(por defecto es SIMULACIÓN).")
    args = parser.parse_args()

    books_dir = Path(args.books)
    if not books_dir.exists():
        print(f"ERROR: no existe la carpeta de libros: {books_dir}")
        return 1

    if not _HAS_PYPDF:
        print("Aviso: 'pypdf' no instalado — se usarán solo los nombres de archivo para PDF.")
    if not _HAS_EBOOKLIB:
        print("Aviso: 'ebooklib' no instalado — se usarán solo los nombres de archivo para EPUB.")

    print(f"\nEscaneando: {books_dir}")
    drive_map = load_drive_map()
    books = scan_books(books_dir, drive_map)
    print(f"Encontrados {len(books)} archivos de libros.\n")

    mode = "BORRADO REAL" if args.delete else "SIMULACIÓN (no se borra nada)"
    print(f"Gestionando duplicados — modo: {mode}")
    kept, deleted = deduplicate(books, books_dir, args.delete)
    print(f"\nDuplicados {'borrados' if args.delete else 'detectados'}: {deleted}")
    print(f"Libros finales en el catálogo: {len(kept)}")

    catalog = to_catalog(kept)
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    print(f"\nCatálogo generado: {OUTPUT_JSON}")
    print(f"Categorías: {len(catalog['categories'])}")
    if not args.delete and deleted:
        print("\nSugerencia: ejecuta 'python indexer.py --delete' para aplicar "
              "el borrado de los duplicados antiguos.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
