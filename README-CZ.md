1. Obecná nastavení

Dokument používá HTML5 DOCTYPE a jazyk en.

Používá font Raleway z Google Fonts.

Obsahuje Bootstrap 5.3 pro stylování a rozvržení.

Skript custom.js je vložen dole s atributem defer (spustí se po načtení DOM).

2. Hlavička (Header)

Lepivá hlavička (sticky-top) se světlým pozadím a spodním okrajem.

Zobrazuje název SWES Reservation Module.

Obsahuje navigační lištu s kartami odkazujícími na sekce stránky:

Create Reservation

Equipment & History

Calendar

Send Email

3. Hlavní obsah

Sekce 1: Create Reservation

Formulář pro vytvoření rezervace:

Employee ID (text, povinné)

Výběr vybavení (Boots, Vest, Helmet)

Datum rezervace

Tlačítko Reserve

Sekce 2: Equipment & History

Filtry:

Vyhledávání podle ID nebo vybavení

Výběr typu vybavení

Rozsah dat (od – do)

Stav (Returned, Pending, Overdue)

Tlačítko Search pro aplikaci filtrů

Tabulka pro zobrazení rezervací:

Sloupce: ID, Equipment, Status, Reservation Date, Return Date

Dynamická zpráva No data available, pokud nejsou žádná data

Tabulka zabalená v bloku s max-height: 300px; overflow-y: auto pro rolování

Sekce 3: Calendar

Kalendář s navigací po měsících:

Tlačítka předchozí / další měsíc

Zobrazení aktuálního měsíce

Tabulka s dny v týdnu (Sun–Sat) a tbody #calendarBody pro dynamické vyplnění

Sekce 4: Send Email

Formulář pro odeslání e-mailu:

Your Email

Subject

Message

Tlačítko Send

Blok zpětné vazby emailFeedback pro zprávy o úspěchu

4. Patička (Footer)

Tmavé pozadí, světlý text

Centrovaný text s copyrightem: © 2025 Vitalii Baranov

5. Další prvky

<div id="loader" class="loader"></div> – pravděpodobně indikátor načítání

custom.js se stará o:

Přidávání rezervací do tabulky

Filtrování vybavení

Tvorbu kalendáře

Odesílání e-mailů

Interakci s formuláři a tlačítky

Závěr

Tato HTML stránka je modulem pro rezervaci vybavení:

Uživatelé mohou vytvářet rezervace, zobrazovat historii, filtrovat data, sledovat kalendář a odesílat zprávy.

Používá Bootstrap pro responzivitu a styl.

Dynamické funkce (tabulky, kalendář, email) jsou implementovány přes externí JS (custom.js).

JS:
Tento kód implementuje plnohodnotný modul pro správu rezervací:

Přidávání nových rezervací.

Ukládání do localStorage.

Filtrování a vyhledávání.

Zobrazení v tabulce se stavy a tlačítky.

Automatické sledování „Overdue“ (pozdních) rezervací.

Kalendář s zvýrazněním dat rezervací.

Formulář pro odesílání emailů.

Navigační záložky a loader.
