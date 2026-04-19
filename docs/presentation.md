<!--
Prezentacja PiGuard — 15 slajdów.
Format: Marp (marp.app). Eksport:
  npx @marp-team/marp-cli docs/presentation.md -o docs/presentation.pdf
  npx @marp-team/marp-cli docs/presentation.md -o docs/presentation.pptx
  npx @marp-team/marp-cli docs/presentation.md -o docs/presentation.html
-->
---
marp: true
theme: default
paginate: true
header: '**PiGuard** — rodzicielska ochrona sieci'
footer: 'piguard.local · 2026'
style: |
  section { font-family: 'Helvetica', 'Arial', sans-serif; padding: 60px 80px; }
  h1 { color: #2563EB; }
  h2 { color: #1E293B; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; }
  .highlight { background: #DBEAFE; padding: 2px 8px; border-radius: 4px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .box { background: #F8FAFC; border-left: 4px solid #2563EB; padding: 12px 16px; border-radius: 4px; }
  small { color: #64748B; }
---

<!-- _paginate: false -->
<!-- _header: '' -->
<!-- _footer: '' -->

# 🛡️ **PiGuard**

## Rodzicielska ochrona sieci domowej
### oparta na Raspberry Pi, Convex i rzetelnej psychologii

<br>

**Filtr DNS** + **panel rodzica** + **rozmowy, które działają**

<br><br>

<small>Bartłomiej Zimny · Kwiecień 2026</small>

---

## Problem, który rozwiązujemy

**Dzisiejszy 12-latek** spotyka się online z:

- 🎰 reklamami bukmacherów na TikToku
- 💊 ofertą dopalaczy w Telegramie
- 🔞 pornografią jako pierwszym „źródłem edukacji seksualnej"
- ⚠️ społecznościami pro-ana i self-harm
- 🎣 „free Robuxami" z kradzieżą kont i kart rodziców

<br>

> **Blokada to za mało.** Dziecko ominie każdy filtr — jeśli nie stoi za nim rozmowa.

---

## Czego brakuje na rynku

| Rozwiązanie | Blokuje | Rozmawia | Prywatność |
|---|:---:|:---:|:---:|
| Filtr operatora (PL/UK/US) | ✅ | ❌ | ❌ |
| Google Family Link | ✅ | ❌ | ❌ |
| Qustodio / Bark ($) | ✅ | ⚠️ | ❌ |
| **PiGuard** | ✅ | ✅ | ✅ |

<br>

**PiGuard** to jedyne rozwiązanie, które łączy blokadę na poziomie **sieci domowej** z **kompletnym skryptem rodzicielskim** opartym na psychologii rozwojowej.

---

## Architektura

```
┌────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Urządzenia    │     │  Raspberry Pi   │     │  Convex (cloud) │
│  (iOS/Android/ │────▶│  Pi-hole + DNS  │────▶│  block_rules    │
│   PC/TV/…)     │     │  pi-bridge      │     │  dns_logs       │
└────────────────┘     └─────────────────┘     └─────────────────┘
                                                       │
                      ┌────────────────────────────────┤
                      ▼                                ▼
              ┌────────────────┐              ┌────────────────┐
              │  Aplikacja     │              │  Panel admina  │
              │  mobilna       │              │  (Next.js)     │
              │  (Expo)        │              │                │
              └────────────────┘              └────────────────┘
```

**Całość** chodzi w domu. Żadne dane dziecka nie trafiają na serwer zewnętrzny.

---

## 14 kategorii zagrożeń

<div class="grid">
<div>

🔞 **Treści dla dorosłych**
🎰 **Hazard**
💊 **Narkotyki**
🔫 **Broń**
⚠️ **Samookaleczenia**
🩸 **Przemoc i drastyczne treści**
💔 **Aplikacje randkowe**

</div>
<div>

🗯️ **Cyberprzemoc**
🕵️ **VPN / proxy**
🕳️ **Dark web / Tor**
🏴‍☠️ **Piractwo**
📉 **Kryptowaluty wysokiego ryzyka**
🎣 **Oszustwa i phishing**
📱 **Media społecznościowe**

</div>
</div>

<br>

**230 unikalnych domen** ekspandowanych z 21 reguł — rozwijanych w miarę pojawiania się nowych zagrożeń.

---

## Mobile — co widzi rodzic

<div class="grid">
<div>

📡 **Aktywność** — real-time feed zapytań DNS z wszystkich urządzeń w domu

🛡️ **Blokowanie** — toggle per platforma i per kategoria

🔔 **Alerty** — tylko zablokowane próby, historia

💡 **Porady** — konkretne scenariusze rozmów

</div>
<div>

**Convex reactive queries** sprawiają, że zmiany są widoczne **natychmiast** — również między admin a mobile (bez refresha).

**Brak połączenia** z domem? Banner „Away from home network" i placeholdery. Dane dalej się zapisują.

</div>
</div>

---

## Panel admina — zarządzanie rodziną

**Dashboard** — liczniki urządzeń, dzieci, zablokowanych zapytań, aktywnych reguł

**Blocklist** — 21 reguł (kategorie + platformy), toggle, filtr aktywne/nieaktywne

**Dzieci** — profile z kolorami awatarów, edycja, liczniki przypisanych urządzeń

**Urządzenia** — lista po MAC + IP, przypisanie do dziecka

**Harmonogramy** — reguły czasowe per dziecko (np. „bez internetu w dni szkolne 22:00–7:00")

**Obserwowane domeny** — monitor bez blokady (np. Reddit — chcę wiedzieć, nie zabraniać)

---

## Harmonogramy — kontrola czasowa

**Przykład:** 13-letnia Emma
- Pn–Pt: **22:00–07:00** → `block_all`
- Sb–Nd: **00:00–09:00** → `block_all`

<br>

**Przykład:** 11-letni Max
- Codziennie: **21:00–08:00** → `block_categories: ['social_media']`

<br>

> Algorytm działa po stronie **Convex** (cron co minutę) i zmiana jest widoczna w urządzeniu dziecka w ciągu sekund.

---

## Obserwowane domeny — bez zaufania jest pusto

**Zamiast zakazywać wszystkiego**, dodajesz domenę do listy „watched":

- `reddit.com`
- `ask.fm`
- `ngl.link`
- `kick.com`

<br>

Kiedy dziecko wejdzie na stronę — **rodzic dostaje powiadomienie push**. Bez blokady. Bez zdrady zaufania.

**Cel:** zobaczyć wzorzec, a nie karać za jedno kliknięcie.

---

## Scenariusze rozmów — sedno PiGuard

Blokada to łatwe. **Rozmowa po blokadzie** — trudne.

Każda kategoria ma **kompletny skrypt** złożony z:

- 🎯 **Dlaczego to ważne** — mechanizm psychologiczny
- 💬 **Jak zacząć** — komunikat „ja", nie oskarżenie
- 🧒 **Według wieku** — 4 przedziały (6–9, 10–12, 13–15, 16–18) z kontekstem rozwojowym
- 🔄 **Reakcje dziecka** — 5 typowych, każda z parą Try / Avoid
- 🚫 **Czego unikać** — pułapki rodzicielskie
- 🚩 **Czerwone flagi** — z poziomem pilności i „czy specjalista"
- 📋 **Co dalej** — plan na 24–72h

---

## 15 scenariuszy × 2 języki

**15 pełnych scenariuszy** (PL + EN), każdy ~7 sekcji:

<div class="grid">
<div>

🌐 social_media
🔞 adult_content
🎰 gambling
💊 drugs
⚠️ self_harm
🩸 violence_gore
💔 dating
👥 **peer_pressure** ← nowe

</div>
<div>

🔫 weapons
🗯️ cyberbullying_risk
🕵️ proxy_vpn
🕳️ dark_web
🏴‍☠️ piracy
📉 crypto_risky
🎣 scam_phishing

</div>
</div>

<br>

**211 KB** zrecenzowanej psychologicznie treści. Eksportowalne jako pojedynczy JSON (`docs/conversation-scenarios.json`).

---

## Reakcje dzieci — bez iluzji

Każdy scenariusz pokrywa **realne reakcje**, nie fantazje.

<div class="box">

**Hazard → „To moje pieniądze"**

**✓ Try:** „Masz rację, są twoje. Moim zadaniem jest upewnić się, że nie stracisz ich na stronie, która jest prawnie zakazana do 18."

**✗ Avoid:** Zabieranie pieniędzy jako kara.

</div>

<br>

<div class="box">

**Samookaleczenia → „Nie mów tacie"**

**✓ Try:** „Nie podam szczegółów. Ale to jest większe niż my dwoje. Lekarz musi pomóc."

**✗ Avoid:** Obiecywanie pełnej tajemnicy.

</div>

---

## Czerwone flagi — kiedy do specjalisty

Nowa struktura (JSON v2) — **severity + action + referToSpecialist**:

```json
{
  "flag": "Rozdawanie cennych rzeczy.",
  "severity": "critical",
  "action": "Klasyczny sygnał przygotowania do samobójstwa —
             wymaga natychmiastowej oceny psychiatrycznej.",
  "referToSpecialist": true
}
```

**4 poziomy:** `low` → `medium` → `high` → `critical`

Rodzic wie **od razu**, czy radzi sobie sam, czy dzwoni na 116 111 / SOR.

---

## Pełne tłumaczenie PL

<div class="grid">
<div>

### Mobile
- Wszystkie 4 taby
- Scenariusze (15 × 7 sekcji)
- Reakcje dzieci, red flags
- AwayBanner, StatusBadge
- Login, Setup, Relative time

</div>
<div>

### Admin
- Sidebar + Dashboard
- Blocklist, Watched
- Schedule, Dzieci, Urządzenia
- Auth (Login/Signup)

</div>
</div>

<br>

- **~180 kluczy** i18n + pluralizacja polska (`_one`, `_few`, `_many`)
- **PL jako język domyślny** (zgodny z CLAUDE.md)
- **Zero anglicyzmów** w scenariuszach rodzicielskich

---

## Status i następne kroki

### ✅ Zrobione
- Backend (Convex): `block_rules`, `schedules`, `dnsLogs`, `tips`, `children`, `devices`
- Pi-bridge: mock + prawdziwy Pi-hole v6
- Admin: 6 stron + i18n
- Mobile: 4 taby + i18n + scenariusze v2
- JSON scenariuszy: 15 × 2 języki, zrecenzowane psychologicznie

### 🔜 Roadmap
- Push notifications (obserwowane domeny)
- Biometria w mobile (Face ID odblokowywanie panelu)
- Eksport raportów tygodniowych dla rodzica
- Integracja z Family Link / Screen Time
- Analityka postępów rodzica (otwarte scenariusze → zamknięte rozmowy)

---

<!-- _paginate: false -->
<!-- _header: '' -->
<!-- _footer: '' -->

# 💙

## **Dzieci nie potrzebują zakazu.**
## **Potrzebują rozmowy i czasu.**

<br>

**PiGuard** daje rodzicowi **obie rzeczy** — na raz.

<br><br>

<small>
**Repo:** [github.com/jash90/piguard](https://github.com/jash90/piguard)<br>
Dokumentacja: <code>docs/conversation-scenarios.json</code>, <code>docs/presentation.md</code>
</small>
