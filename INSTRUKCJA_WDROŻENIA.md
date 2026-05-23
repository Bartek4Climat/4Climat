# 4Climat Generator Ofert — Instrukcja wdrożenia

## Co jest w tym folderze

```
index.html          ← główna aplikacja (generator ofert)
manifest.json       ← konfiguracja PWA (ikona, nazwa, kolor)
sw.js               ← service worker (praca offline)
icon-192.png        ← ikona aplikacji (mała)
icon-512.png        ← ikona aplikacji (duża)
netlify.toml        ← konfiguracja hostingu Netlify
```

---

## Krok 1 — Załóż konto na Netlify (bezpłatne)

1. Wejdź na **https://netlify.com**
2. Kliknij **"Sign up"** → zaloguj przez GitHub lub e-mail
3. Po zalogowaniu jesteś na dashboardzie

---

## Krok 2 — Wdróż aplikację (drag & drop, bez kodowania)

1. Na dashboardzie Netlify znajdź sekcję:
   **"Want to deploy a new site without connecting to Git?"**
2. Przeciągnij i upuść **cały folder `4climat-app`** na zaznaczone pole
3. Netlify automatycznie wdroży aplikację w ~10 sekund
4. Otrzymasz adres np. `https://amazing-name-123.netlify.app`

---

## Krok 3 — Własna domena (opcjonalnie)

Możesz ustawić własną subdomenę np. `oferty.4climat.pl`:

1. W Netlify → **Site settings → Domain management**
2. Kliknij **"Add custom domain"**
3. Wpisz `oferty.4climat.pl`
4. U swojego dostawcy domeny dodaj rekord DNS:
   ```
   CNAME  oferty  →  [twoja-nazwa].netlify.app
   ```
5. SSL (https) włączy się automatycznie

---

## Krok 4 — Instalacja jako aplikacja (PWA)

Po wejściu na stronę w Chrome/Edge:

### Na komputerze (Windows/Mac):
- W pasku adresu pojawi się ikona **⊕** lub **"Zainstaluj"**
- Kliknij → aplikacja otworzy się jako osobne okno bez paska przeglądarki
- Ikona pojawi się na pulpicie i w menu Start

### Na telefonie (Android):
- Chrome pokaże baner **"Dodaj do ekranu głównego"**
- Lub: menu Chrome (⋮) → **"Zainstaluj aplikację"**

### Na iPhone (Safari):
- Przycisk udostępniania (□↑) → **"Dodaj do ekranu głównego"**

---

## Aktualizacja aplikacji

Gdy chcesz zaktualizować generator (np. po zmianach cennika):

1. Podmień plik `index.html` na nową wersję
2. W Netlify → **Deploys → Drag & drop** nowy folder
3. Aplikacja zaktualizuje się automatycznie u wszystkich użytkowników

---

## Praca offline

Aplikacja działa bez internetu po pierwszym załadowaniu.
Biblioteki PDF (pdfmake, pdf-lib) są cachowane lokalnie.
Generowanie PDF działa w pełni offline.

---

## Dane klientów i ofert

Wszystkie dane są przechowywane lokalnie w przeglądarce (localStorage).
Nie są wysyłane nigdzie — pełna prywatność.
Przy zmianie komputera lub przeglądarki dane nie przenoszą się automatycznie
(funkcja eksportu/importu jest dostępna w aplikacji).
