#!/usr/bin/env node
// Transform docs/conversation-scenarios.json according to psychological review.
// Run: node scripts/transform-scenarios.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(__dirname, '..')
const SRC = resolve(REPO, 'docs/conversation-scenarios.json')

const devCtxPL = {
  '6–9':   'Myślenie konkretne (Piaget). Dziecko nie odróżnia intencji od działania, nie rozumie sarkazmu. Mów dosłownie, używaj obrazów.',
  '10–12': 'Początek myślenia abstrakcyjnego. Grupa rówieśnicza zyskuje wagę, rośnie potrzeba sprawiedliwości i bycia „jak inni".',
  '13–15': 'Erikson: tożsamość kontra rola. Syndrom osobistej publiczności — dziecko czuje, że każdy je ocenia. Bunt jako praca rozwojowa.',
  '16–18': 'Przednie drogi dopaminergiczne jeszcze dojrzewają. Decyzje emocjonalne; logika dostępna, ale nie pierwsza. Traktuj jak młodego dorosłego, ale miej siatkę bezpieczeństwa.',
}

const devCtxEN = {
  '6–9':   'Concrete thinking (Piaget). The child cannot yet separate intent from action or understand sarcasm. Use literal language and concrete images.',
  '10–12': 'Beginning of abstract thinking. The peer group grows in importance; a strong need for fairness and fitting in.',
  '13–15': 'Erikson: identity vs. role confusion. The "imaginary audience" effect peaks — the teen feels everyone is watching and judging.',
  '16–18': 'Dopaminergic reward pathways still maturing. Emotional over logical decision-making; they CAN reason but emotion leads. Treat as a young adult, but keep a safety net.',
}

// For each scenario's redFlags in current JSON, assess severity + action + referToSpecialist.
// Tuples indexed in the same order the flags appear in the source JSON.
const RF_META = {
  social_media: [
    ['medium', 'Ustalcie wspólnie porę wyłączania telefonu na noc.', 'Agree together on a phone cut-off time for the night.', false],
    ['medium', 'Rozmowa o tym, co konkretnie wywołuje spadek nastroju — konkretne konta do wyciszenia.', 'Talk about which specific accounts trigger the mood drop — mute or unfollow them.', false],
    ['high',   'Prywatne rozmowy z nieznajomymi to sygnał alarmowy — wymaga natychmiastowej rozmowy.', 'Private chats with strangers are a red alert — require immediate conversation.', true],
  ],
  adult_content: [
    ['high',     'Kilka godzin dziennie to już kompulsja — potrzebny specjalista.', 'Several hours a day crosses into compulsion — specialist needed.', true],
    ['high',     'Opisywanie brutalnych scen jako „normalnych" — potrzebna konsultacja psychologiczna.', 'Describing violent scenes as "normal" calls for psychological consultation.', true],
    ['critical', 'Jakakolwiek wzmianka o dorosłym inicjującym rozmowę seksualną — 112 i Dyżurnet natychmiast.', 'Any adult initiating sexual conversation — call police and CyberTipline immediately.', true],
  ],
  gambling: [
    ['high', 'Pożyczki od rówieśników to klasyczny wzorzec uzależnienia — rozmowa + monitoring.', 'Borrowing from peers is a classic addiction pattern — conversation + monitoring.', true],
    ['high', 'Sprzedawanie własności na konta hazardowe — czas na specjalistę od uzależnień.', 'Selling belongings to fund gambling accounts — time for an addiction specialist.', true],
    ['high', 'Ukryte użycie kart rodzica to kradzież, ale też sygnał kompulsji.', 'Hidden use of parents\' cards is theft but also a compulsion signal.', true],
  ],
  drugs: [
    ['medium',   'Rozmowa i monitoring budżetu kieszonkowego.', 'A conversation and pocket-money budgeting.', false],
    ['high',     'Kombinacja ostrzegawcza — wymaga rozmowy + kontaktu ze szkołą.', 'Warning constellation — conversation + school contact.', true],
    ['high',     'Akcesoria związane z używkami w pokoju — wymaga konsultacji z lekarzem rodzinnym.', 'Drug paraphernalia at home — family doctor consultation.', true],
    ['critical', 'Opioidy, benzodiazepiny lub nieznane tabletki — natychmiast do szpitala.', 'Opioids, benzodiazepines, or unknown pills — straight to hospital.', true],
  ],
  self_harm: [
    ['high',     'Rozmowa tego samego dnia + wizyta u psychologa.', 'Same-day conversation and psychologist visit.', true],
    ['high',     'Sprawdźcie stan u lekarza rodzinnego.', 'Check with a family doctor.', true],
    ['critical', 'Klasyczny sygnał przygotowania do samobójstwa — wymaga natychmiastowej oceny psychiatrycznej.', 'Classic pre-suicidal sign — requires immediate psychiatric assessment.', true],
    ['critical', 'Natychmiast 112 / SOR / Telefon Zaufania 116 111.', 'Immediately call emergency services or the crisis line.', true],
    ['critical', 'Wymaga oceny psychiatrycznej (zaburzenia odżywiania).', 'Requires psychiatric assessment (eating disorder).', true],
  ],
  violence_gore: [
    ['medium',   'Rozmowa o mechanizmie odwrażliwiania.', 'Talk about desensitisation.', false],
    ['high',     'Konsultacja psychologiczna.', 'Psychological consultation.', true],
    ['critical', 'Natychmiastowa pomoc profesjonalna.', 'Immediate professional help.', true],
    ['high',     'Terapeuta pracujący z nastolatkami.', 'Therapist experienced with teens.', true],
  ],
  dating: [
    ['high',     'Rozmowa tego samego dnia — bez potępienia.', 'Same-day conversation — without blame.', false],
    ['high',     'Sygnał prób uwodzenia — wymaga konsultacji z psychologiem.', 'Grooming signal — psychologist consultation.', true],
    ['high',     'Blokada aplikacji + rozmowa o granicach.', 'App block + boundaries conversation.', true],
    ['critical', 'Natychmiastowa interwencja i zgłoszenie na policję.', 'Immediate intervention and police report.', true],
    ['critical', 'Zatrzymaj rozmowę, udokumentuj, zgłoś policji i Dyżurnet.pl (NCMEC/CEOP).', 'Stop conversation, document, report to police and CyberTipline.', true],
  ],
  weapons: [
    ['high',     'Konsultacja psychologiczna.', 'Psychological consultation.', true],
    ['critical', 'Natychmiastowa pomoc — psycholog i ewentualnie policja.', 'Immediate help — psychologist and possibly police.', true],
    ['critical', 'Zgłoszenie do szkoły i psychologa tego samego dnia.', 'Report to school and psychologist the same day.', true],
    ['critical', 'Czerwony alarm — kombinacja wymaga natychmiastowej interwencji specjalisty.', 'Red alert — combination requires immediate specialist intervention.', true],
  ],
  cyberbullying_risk: [
    ['high',     'Rozmowa tego samego dnia.', 'Same-day conversation.', false],
    ['high',     'Rozmowa + psycholog szkolny.', 'Conversation + school counsellor.', true],
    ['medium',   'Rozmowa o tym, co się zmieniło w relacjach z rówieśnikami.', 'A conversation about what changed in peer relationships.', false],
    ['critical', 'Natychmiast Telefon Zaufania 116 111 / SOR.', 'Immediately call crisis line or ER.', true],
  ],
  proxy_vpn: [
    ['medium', 'Rozmowa o tym, kogo obejmuje ta konkretna rozmowa.', 'Conversation about who is part of that specific chat.', false],
    ['medium', 'Rozmowa o tym, co jest ukrywane.', 'A conversation about what is being hidden.', false],
    ['high',   'Rozmowa o zaufaniu — nie o aplikacji.', 'A trust conversation — not about the app itself.', false],
  ],
  dark_web: [
    ['high',     'Sygnał planowania zakupu — wymaga rozmowy i ewentualnie specjalisty.', 'Signals a planned purchase — needs conversation and possibly specialist.', true],
    ['critical', 'Natychmiast poważna rozmowa + monitoring.', 'Immediate serious conversation + monitoring.', true],
    ['high',     'Możliwa ekspozycja traumatyczna — wizyta u psychologa.', 'Possible trauma exposure — psychologist visit.', true],
    ['critical', 'Czerwony alarm — fascynacja manifestami wymaga konsultacji.', 'Red alert — fascination with manifestos requires consultation.', true],
  ],
  piracy: [
    ['medium', 'Sprawdź urządzenie pod kątem złośliwego oprogramowania.', 'Check device for malware.', false],
    ['high',   'Zablokuj kartę, zgłoś do banku.', 'Freeze card, report to bank.', true],
    ['high',   'Rozmowa + ewentualne zgłoszenie do szkoły.', 'Conversation + possible report to school.', true],
  ],
  crypto_risky: [
    ['medium',   'Rozmowa o algorytmie i pułapkach reklam.', 'Conversation about algorithm and ad traps.', false],
    ['high',     'Wzorzec kompulsji — możliwy specjalista od uzależnień.', 'Compulsion pattern — possible addiction specialist.', true],
    ['high',     'Interwencja finansowa + rozmowa o długach.', 'Financial intervention + debt conversation.', true],
    ['critical', 'Klasyczny schemat oszustwa — zgłoś do banku i policji.', 'Classic scam pattern — report to bank and police.', true],
  ],
  scam_phishing: [
    ['medium',   'Nauczcie razem rozpoznawać po adresie i tonie.', 'Teach recognition together — by address and tone.', false],
    ['high',     'Rozmowa o emocjonalnych wyzwalaczach.', 'A conversation about emotional triggers.', false],
    ['high',     'Audyt konta, zmiana hasła, kontakt z platformą.', 'Account audit, password change, platform contact.', true],
    ['critical', 'Zgłoś do platformy i na policję (CBZC w PL).', 'Report to platform and cybercrime unit.', true],
  ],
}

function splitAgeNotes(ageNotes, lang) {
  const dev = lang === 'pl' ? devCtxPL : devCtxEN
  const { younger = '', tween = '', teen = '' } = ageNotes || {}
  const teenOlder =
    lang === 'pl'
      ? `Traktuj jak młodego dorosłego: zapytaj, jakiej pomocy chce (jeśli chce). ${teen}`
      : `Treat them as a young adult: ask what kind of help they want (if any). ${teen}`
  const ranges = ['6–9', '10–12', '13–15', '16–18']
  const notes = [younger, tween, teen, teenOlder]
  return ranges.map((r, i) => ({
    range: r,
    note: notes[i],
    developmentalContext: dev[r],
  }))
}

function convertRedFlags(key, oldFlags, lang) {
  const meta = RF_META[key] || []
  return oldFlags.map((flag, i) => {
    const m = meta[i] || ['medium', 'Omów to z dzieckiem i obserwuj.', 'Discuss with the child and observe.', false]
    return {
      flag,
      severity: m[0],
      action: lang === 'pl' ? m[1] : m[2],
      referToSpecialist: m[3],
    }
  })
}

// Rewriting openings as I-messages.
// We preserve the body of the opening but replace accusatory prefixes.
function rewriteOpeningPL(o) {
  const mapping = [
    [/^„Widziałem\(-am\), że próbowałeś otworzyć/,          '„Martwi mnie ekranowy czas — chcę zrozumieć, co ci daje'],
    [/^„Widziałem\(-am\), że próbowałeś wejść na/,          '„Czuję niepokój po tym, co zobaczyłem — chcę zrozumieć, co cię ciągnie do'],
    [/^„Widziałem\(-am\), że korzystałeś z aplikacji/,      '„Martwi mnie jedna aplikacja — chcę wiedzieć, czy u ciebie wszystko jest w porządku, korzystałeś'],
    [/^„Widziałem\(-am\), że zablokowała się/,              '„Chciał(a)bym porozmawiać spokojnie — zauważyłem(-am) zablokowaną'],
    [/^„Widzę, że korzystałeś/,                              '„Chciał(a)bym porozmawiać — zauważyłem(-am), że korzystałeś'],
    [/^„Widzę, że próbowałeś zainstalować/,                  '„Chciał(a)bym spokojnie porozmawiać — zauważyłem(-am) próbę instalacji'],
    [/^„Widzę, że sprawdzałeś/,                              '„Chciał(a)bym porozmawiać — zauważyłem(-am), że sprawdzałeś'],
    [/^„Zablokowała się strona/,                             '„Chcę spokojnie porozmawiać — zauważyłem(-am) zablokowaną stronę'],
    [/^„Próbowałeś otworzyć stronę/,                         '„Zauważyłem(-am) próbę otwarcia strony'],
    [/^„Kocham cię/,                                          '„Kocham cię'],
  ]
  for (const [pat, repl] of mapping) {
    if (pat.test(o)) return o.replace(pat, repl)
  }
  return o
}

function rewriteOpeningEN(o) {
  const mapping = [
    [/^"I saw you tried to open Tor/,       '"Something I saw unsettled me — I want to understand what pulls you to Tor'],
    [/^"I saw you tried to open/,           "\"I've been worried about screen time — I want to understand what pulls you to"],
    [/^"I saw you used/,                    '"One of your apps is on my mind — I want to know if everything is okay for you, you used'],
    [/^"I saw you tried installing/,        "\"Something caught my attention — I'd like to talk calmly about an attempted install of"],
    [/^"I see you checked/,                 '"I\'d like to talk — I noticed you checked'],
    [/^"A betting page got blocked/,        '"I want to talk calmly — a betting page got blocked'],
    [/^"A page about weapons was blocked/,  '"I\'d like to talk without panic — a page about weapons was blocked'],
    [/^"A free-movie site got blocked/,     '"I noticed a blocked free-movie site and I want to talk about it'],
    [/^"A 'free Robux'/,                    '"I noticed a blocked \'free Robux\''],
    [/^"A drug-related page got blocked/,   '"A drug-related page got blocked — I\'d rather talk than guess'],
    [/^"A dating app was blocked/,          "\"A dating app was blocked — I'm curious, not accusing"],
    [/^"You tried to open a site/,          '"I noticed a blocked site with fairly graphic content'],
    [/^"I love you/,                         '"I love you'],
    [/^"I want to talk/,                     '"I want to talk'],
  ]
  for (const [pat, repl] of mapping) {
    if (pat.test(o)) return o.replace(pat, repl)
  }
  return o
}

// Soft fields per scenario (author-written psychology content).
const softPL = {
  social_media: {
    parentSelfRegulation: 'Zanim usiądziesz do rozmowy: trzy głębokie oddechy, szklanka wody, pytanie do siebie — „czy jestem zły(-a) na dziecko, czy na siebie, że pozwoliłem(-am)?". Nie rozmawiaj zmęczony(-a).',
    neurodivergentNote: 'ADHD: krótkie rozmowy (max 5 minut), potem przerwa. ASD: zapowiedz rozmowę dzień wcześniej, unikaj metafor. Lęk uogólniony: nazwij emocję na głos — „widzę, że cię to stresuje".',
    repairAfterConflict: 'Jeśli rozmowa skończyła się trzaśnięciem drzwiami — w ciągu 24h podejdź sam(a): „Zachowałem(-am) się dziś nie tak. Przepraszam, że podniosłem(-am) głos. Nadal chcę porozmawiać, gdy będziesz gotowy(-a)." Nie wracaj do tematu w tej rozmowie.',
    positiveReinforcement: 'Gdy dziecko samo pokaże ci zabawną rolkę albo opowie o twórcy — to kapitał. Zamiast oceniać, powiedz: „Cieszę się, że się tym dzielisz, opowiedz mi więcej."',
    culturalContext: 'W polskich rodzinach często dominuje styl „nie pyskuj rodzicowi". To zamyka rozmowy. Spróbuj: „mogę się mylić, powiedz mi, gdzie" — oddajesz część kontroli, budujesz zaufanie.',
  },
  adult_content: {
    parentSelfRegulation: 'Twoja reakcja fizyczna (zaczerwienienie, napięcie) trafia do dziecka przed słowami. Przećwicz rozmowę przed lustrem. Jeśli czujesz, że palisz się ze wstydu — poczekaj dzień.',
    neurodivergentNote: 'ADHD: przygotuj jedno zdanie kluczowe i trzymaj się go. ASD: używaj jasnych nazw anatomicznych zamiast metafor („pornografia" — nie „takie rzeczy"). Ciche miejsce, minimum bodźców.',
    repairAfterConflict: 'Jeśli dziecko zamknęło się lub wybiegło — NIE podążaj za nim od razu. Zostaw kartkę: „Jestem tu, kiedy będziesz gotowy(-a). Nic, co powiedziałeś(-aś), nie zmieni tego, że cię kocham." Wróć za 2–3 godziny.',
    positiveReinforcement: 'Jeśli dziecko samo zapytało cię o coś związanego z seksualnością — to trofeum. Powiedz: „Cieszę się, że pytasz mnie, a nie Google." Nawet jeśli pytanie cię zaskoczyło.',
    culturalContext: 'W Polsce edukacja seksualna w szkole jest szczątkowa, a pornografia często staje się pierwszym źródłem informacji. Twoja rozmowa MUSI to zastąpić. Polecenia: Grupa Ponton, edukacjaseksualna.pl.',
  },
  gambling: {
    parentSelfRegulation: 'Jeśli sam(a) grywasz w totolotka — zauważ, że dziecko to widzi. Przed rozmową: „Czy moje zachowania hazardowe mogłyby być wzorem?" Szczerość buduje autorytet.',
    neurodivergentNote: 'ADHD: podwyższone ryzyko uzależnienia od dopaminowych pętli (skrzynki z nagrodami, zakłady). Rozmowa profilaktyczna PRZED problemem. ASD: tłumacz matematycznie — procent, przewaga kasyna.',
    repairAfterConflict: 'Po kłótni o pieniądze: krótki SMS — „Zadzwoń, kiedy będziesz gotowy(-a). Nie cofnę się od tego, że muszę pomóc, ale rozmawiam bez krzyku."',
    positiveReinforcement: 'Gdy dziecko przyznaje się do małej straty — to złoto. Nie karz. „Dziękuję, że mówisz. To znaczy, że mi ufasz. Razem to rozwiążemy."',
    culturalContext: 'Hazard w Polsce (LOTTO, bukmacherzy) jest normalizowany reklamami. Obejrzyjcie razem jedną reklamę — policzcie kto faktycznie wygrywa. Pomoc: Anonimowi Hazardziści (PL), bezplatna linia 800 889 880.',
  },
  drugs: {
    parentSelfRegulation: 'Jeśli sam(a) piłeś(-aś) / paliłeś(-aś) w młodości — zdecyduj przed rozmową, ile powiesz. Kłamstwo („nigdy!") podważy wiarygodność, pełna szczerość może być za dużo. Wybierz środek.',
    neurodivergentNote: 'ADHD: 2–4x wyższe ryzyko uzależnień — rozmowa profilaktyczna wcześniej niż u neurotypowych. ASD: trzyma się zasad — oprzyj rozmowę na liczbach, nie metaforach.',
    repairAfterConflict: 'Jeśli dziecko wybiegło po rozmowie — nie dzwoń godzinami. „Jedyne, czego chcę — żebyś wrócił(a) bezpiecznie. Reszta może poczekać." Zapewnij, że nie czeka kara.',
    positiveReinforcement: 'Gdy dziecko ODMÓWI narkotyków w grupie — to egzamin dorosłości. Doceń publicznie (przy rodzeństwie, dziadkach).',
    culturalContext: 'W Polsce dopalacze są sprzedawane przez Telegram i Messengera. Bezpłatna Linia Narkotykowa: 801 199 990 (16:00–21:00). Monar — lokalne ośrodki dla młodzieży.',
  },
  self_harm: {
    parentSelfRegulation: 'To jest rozmowa, w której musisz być w pełni spokojny(-a). Jeśli sam(a) masz historię zaburzeń nastroju — poproś drugiego rodzica / przyjaciela / terapeutę PRZED rozmową.',
    neurodivergentNote: 'ASD: samookaleczenia mogą mieć funkcję regulacji sensorycznej, nie depresyjną — wymaga oceny specjalistycznej. ADHD: impulsywność zwiększa ryzyko — usunięcie narzędzi z zasięgu jest priorytetem.',
    repairAfterConflict: 'Po trudnej rozmowie NIE zostawiaj dziecka samego przez 24h. Bądź w tym samym pomieszczeniu — gotuj obok, czytaj książkę. Obecność ciała > słowa.',
    positiveReinforcement: 'Każde ujawnienie bólu emocjonalnego — nawet szorstkie — nagradzaj zdaniem: „Dziękuję, że mi to powiedziałeś(-aś). To wymagało odwagi." I trzymaj to zdanie. Nic więcej na tym etapie.',
    culturalContext: 'W Polsce psychiatria dziecięca jest w zapaści. Znajdź prywatnego terapeuty JESZCZE dziś (ZnanyLekarz, pomocpsychologiczna.pl). Fundacja Dajemy Dzieciom Siłę — bezpłatnie, 116 111 (24/7).',
  },
  violence_gore: {
    parentSelfRegulation: 'Sprawdź, czy sam(a) nie pokazujesz dziecku drastycznych treści w newsach. „Podsłuchana" przemoc też traumatyzuje. Wyłącz TV przy rozmowach o wojnie czy wypadkach.',
    neurodivergentNote: 'ASD: sensoryczna wrażliwość na drastyczne obrazy może być ekstremalna — pojedyncza ekspozycja = dni niepokoju. ADHD: trudniej odrzucić impuls kliknięcia — ucz „blokowania z wyprzedzeniem".',
    repairAfterConflict: 'Jeśli po rozmowie dziecko ma koszmary — nie bagatelizuj. Wspólny „neutralizator" — delikatny film natury, komedia. Mózg potrzebuje „przepisać" obraz.',
    positiveReinforcement: 'Jeśli dziecko samo wyłączy drastyczne wideo i ci powie — to dojrzałość. „To była trudna decyzja. Jestem z ciebie dumny(-a)." Nie żartuj.',
    culturalContext: 'Polskie media pokazują brutalne sceny bez ostrzeżenia. Przy dziecku do 12 lat — rezygnuj z TV news. Nestero, Junior Media, Papilot zamiast TVN24.',
  },
  dating: {
    parentSelfRegulation: 'Własna historia randkowa wpływa na to, co projektujesz na dziecko. Zadaj sobie: „Czy nie projektuję swoich lęków?" Przygotuj się na odpowiedzi dotyczące orientacji — to osobna rozmowa.',
    neurodivergentNote: 'ASD: trudności z odczytywaniem intencji — dziecko może nie rozumieć manipulacji. Używaj literalnych, konkretnych przykładów. ADHD: szybkie nawiązywanie relacji + impulsywność = podwyższone ryzyko.',
    repairAfterConflict: 'Jeśli dziecko ujawniło uwodzenie, a ty zapanikowałeś(-aś): w ciągu 2 godzin wróć z przeprosinami — „Zareagowałem(-am) strachem. Przepraszam. Teraz słucham bez przerywania."',
    positiveReinforcement: 'Gdy dziecko pokaże ci rozmowę — NAWET jeśli jest tam coś niepokojącego — zacznij od „Dziękuję, że mi ufasz." Dopiero POTEM ocena.',
    culturalContext: 'W Polsce: Dyżurnet.pl (NASK) — bezpłatnie, anonimowo. Dla nastolatków Saferinternet.pl. 116 111 (Telefon Zaufania dla Dzieci) — też do tematów relacji.',
  },
  weapons: {
    parentSelfRegulation: 'Jeśli masz broń w domu (wiatrówka też) — ZAMKNIJ na klucz PRZED rozmową, nie w trakcie. Sprawdź własną historię wyszukiwań.',
    neurodivergentNote: 'Fascynacja bronią u ASD to często mechanika (jak działa, historia) — nie agresja. Odróżnij. ADHD: impulsywność + dostęp = ryzyko, nawet bez intencji.',
    repairAfterConflict: 'Po rozmowie, która zawiodła — nie próbuj „naprawiać" tego samego dnia. Następnego: „Zastanawiam się, co chciał(a)byś mi powiedzieć, ale nie mogłeś(-aś)." Słuchaj.',
    positiveReinforcement: 'Gdy dziecko opowie o kolegi grożącym bronią — traktuj jako dojrzałe obywatelstwo. „Zrobiłeś(-aś) dobrze, że powiedziałeś(-aś). Trudna decyzja."',
    culturalContext: 'W Polsce pozwolenie wymaga 21 lat i testów psychologicznych. Strzelectwo sportowe od 10 lat z instruktorem — legalna droga. Polski Związek Strzelectwa Sportowego.',
  },
  cyberbullying_risk: {
    parentSelfRegulation: 'Własne wspomnienia ze szkoły mogą cię zalać. Jeśli sam(a) byłeś(-aś) ofiarą — uprzedź: „Coś takiego przerabiałem(-am). Może twoje jest inne." Nie projektuj.',
    neurodivergentNote: 'ASD: nie zawsze rozpoznaje docinek / prześladowanie. Pokaż konkretne przykłady i nazwij je. ADHD: impulsywne odpowiedzi w sieci eskalują — naucz pauzy.',
    repairAfterConflict: 'Jeśli dziecko zamknęło się po twojej propozycji rozmowy z wychowawcą — uszanuj przez 24h. Potem: „Nie chciałem(-am) cię zmusić. Zdecydujemy razem, tak?"',
    positiveReinforcement: 'Gdy dziecko PIERWSZE ci powie o hejcie — największa wygrana. „Odważyłeś(-aś) się. To jest coś, z czego jestem najbardziej dumny(-a)."',
    culturalContext: 'Telefon Zaufania dla Dzieci i Młodzieży 116 111 (bezpłatny, 24/7). Stop Cyberprzemocy — NASK. Wychowawca i pedagog szkolny mają obowiązek reakcji (rozporządzenie MEN).',
  },
  proxy_vpn: {
    parentSelfRegulation: 'Jeśli używasz VPN do pracy — bądź uczciwy(-a): „Tak, ja też używam, ale w innym celu." Kłamstwo („VPN to zło") zabija wiarygodność w 10 sekund.',
    neurodivergentNote: 'ADHD: obchodzenie blokad to często sport, nie złośliwość — przekieruj w legalną naukę bezpieczeństwa IT. ASD: trzyma się zasad — jeśli złamie umowę, jest konkretna przyczyna.',
    repairAfterConflict: 'Po kłótni: oddzielcie temat VPN od kłamstwa. „Jestem zły(-a) o kłamstwo, nie o VPN." Granica robi więcej niż kara.',
    positiveReinforcement: 'Gdy dziecko przychodzi „chcę zainstalować VPN żeby X" — to PRZYKŁADNE. „Dzięki, że pytasz. Rozmawiajmy."',
    culturalContext: 'W Polsce VPN jest legalny i popularny. Nie demonizuj — ustalcie wspólne zasady dla konkretnych aplikacji i domen.',
  },
  dark_web: {
    parentSelfRegulation: 'Dark web budzi silne emocje (filmy, stereotypy). Research przed rozmową — rzetelny dokument. Jeśli sam(a) się boisz, dziecko to wyczuje.',
    neurodivergentNote: 'ASD: zainteresowanie Tor może być autentyczną pasją — oddziel ciekawość techniczną od zagrożenia. ADHD: fascynacja „zakazanym" bywa impulsem — legalne alternatywy (CTF).',
    repairAfterConflict: 'Jeśli reakcja była za ostra („chcę cię karać!"): w ciągu doby wróć z przeprosinami. „Przeraziłem(-am) się. To było o mnie, nie o tobie."',
    positiveReinforcement: 'Zainteresowanie cyberbezpieczeństwem to świetna ścieżka kariery. „Dobrze, że cię to ciekawi. Zobacz HackTheBox — legalnie."',
    culturalContext: 'CERT Polska (cert.pl), Sekurak — materiały dla nastolatków. Dragon Sector — polska drużyna CTF światowej klasy.',
  },
  piracy: {
    parentSelfRegulation: 'Bądź uczciwy(-a) — korzystałeś(-aś) z torrentów w młodości? Dziecko wyczuje hipokryzję. Jeśli tak — przyznaj. „Ja też tak robiłem(-am), dlatego wiem, że to nie takie proste."',
    neurodivergentNote: 'ADHD: krótki przeskok „chcę → klikam" — ucz 5-sekundowej pauzy. ASD: literalne rozumienie zasad — tłumacz „to nielegalne" konkretnie, z konsekwencjami.',
    repairAfterConflict: 'Jeśli dziecko wstydzi się złapanego wirusa — unikaj „mówiłem(-am) ci". Skup się na naprawie: „Naprawiamy razem."',
    positiveReinforcement: 'Gdy dziecko samo zaproponuje „kupię legalnie" — doceń (dopłać połowę albo werbalnie). Długoterminowe.',
    culturalContext: 'Biblioteki publiczne (Wolne Lektury, Legimi, Empik Go przez bibliotekę) — bezpłatne, legalne. Epodreczniki.pl — MEN-owe podręczniki za darmo.',
  },
  crypto_risky: {
    parentSelfRegulation: 'Jeśli sam(a) inwestujesz w krypto — bądź szczery(-a) o stratach. Kłamstwo „wszystko idzie super" uczy dziecko tego samego.',
    neurodivergentNote: 'ADHD: dopamina „green candles" uzależnia szybciej — ryzyko kompulsji wyższe. ASD: zainteresowanie matematyką rynku — przekieruj w ETF-y, stopę procentową.',
    repairAfterConflict: 'Po kłótni o stracone pieniądze: nie odcinaj kieszonkowego „za karę" — uczy ukrywania. „Masz następne kieszonkowe. Wybierzemy razem, co z nim."',
    positiveReinforcement: 'Jeśli dziecko przychodzi z decyzją „poczekam" / „nie kupuję" — to DOJRZAŁOŚĆ. „Taka decyzja dorosłego. Widzę."',
    culturalContext: 'KNF publikuje ostrzeżenia. Fundacja Rozwoju Rynku Finansowego, NBP „Finansowy Niezbędnik Ucznia". Marcin Iwuć — książki finansowe po polsku.',
  },
  scam_phishing: {
    parentSelfRegulation: 'Własne próby oszustw (SMS-y o paczkach) pokazuj jako przykłady — włącz dziecko w „odgadywanie". Wspólna analiza buduje nawyk.',
    neurodivergentNote: 'ASD: klik-na-wszystko to zaufanie do komunikatów, nie głupota. Literalnie ucz sygnatur oszustw. ADHD: pośpiech = klik. Dwusekundowa pauza przed każdym linkiem.',
    repairAfterConflict: 'Jeśli dziecko straciło dane / pieniądze — priorytet to ochrona konta, nie frustracja. Po załatwieniu: „Nie jesteś winny(-a). Oni są profesjonalistami."',
    positiveReinforcement: 'Gdy dziecko ROZPOZNA oszustwo — nawet najmniejsze — zauważ. „Dobra robota. Kilka lat temu sam(a) bym się nabrał(a)."',
    culturalContext: 'CERT.pl (incydent@cert.pl) i CBZC (47 72 55 500). Dyżurnet.pl dla treści nielegalnych. Banki — 24/7 infolinia do blokady karty.',
  },
}

const softEN = {
  social_media: {
    parentSelfRegulation: "Before you sit down: 3 deep breaths, a glass of water, and ask yourself — 'Am I angry at my child, or at myself for letting this happen?' Don't have the talk tired.",
    neurodivergentNote: "ADHD: keep it short (max 5 minutes), then pause. ASD: announce the conversation a day in advance, avoid metaphors. Generalised anxiety: name the emotion out loud — 'I can see this is stressing you.'",
    repairAfterConflict: "If the door slammed — within 24h go to them alone: 'I didn't handle this well earlier. I'm sorry I raised my voice. I still want to talk when you're ready.' Do not re-open the topic in that repair conversation.",
    positiveReinforcement: "When your child shows you a funny reel or tells you about a creator on their own — that's GOLD. Instead of judging, say: 'I'm glad you shared that, tell me more.'",
    culturalContext: "In many cultures the dominant style is 'don't talk back to parents' — it closes conversations. Try 'I might be wrong, tell me where' — giving away some control builds trust.",
  },
  adult_content: {
    parentSelfRegulation: 'Your physical reaction (blushing, tension) reaches the child before your words. Rehearse in a mirror. If you are burning with shame — wait a day.',
    neurodivergentNote: "ADHD: prepare one key sentence and stick to it. ASD: use clear anatomical names instead of metaphors ('pornography' — not 'that kind of stuff'). Quiet setting, minimal stimulation.",
    repairAfterConflict: "If the child shut down or ran off — DO NOT chase them immediately. Leave a note: 'I'm here when you're ready. Nothing you said changes that I love you.' Come back in 2–3 hours.",
    positiveReinforcement: "If the child asks you anything about sexuality on their own — that's a trophy. Say: 'I'm glad you asked me, not Google.' Even if the question surprised you.",
    culturalContext: 'In many countries school sex-education is thin, and pornography becomes the first source. Your conversation MUST replace that. Resources: Planned Parenthood (US), NHS (UK), Scarleteen.',
  },
  gambling: {
    parentSelfRegulation: "If you play the lottery — notice your child is watching. Before the talk: 'Could my own gambling be modelling this?' Honesty builds authority.",
    neurodivergentNote: 'ADHD: higher addiction risk via dopamine loops (loot boxes, betting). Preventive conversation BEFORE a problem. ASD: teach mathematically — house edge, expected value.',
    repairAfterConflict: "After a money fight: short SMS — 'Call me when you're ready. I won't back down from helping, but I'll talk without yelling.'",
    positiveReinforcement: "When the child admits a small loss — gold. Don't punish. 'Thank you for telling me. That means you trust me. We'll sort it out together.'",
    culturalContext: 'Gambling is normalised via ads. Watch one ad together, count who wins long-term. Resources: GamCare (UK), NCPG (US 1-800-522-4700).',
  },
  drugs: {
    parentSelfRegulation: "If you drank or smoked in your youth — decide before the talk how much you'll share. A lie ('never!') kills credibility; full honesty may be too much. Choose the middle.",
    neurodivergentNote: 'ADHD: 2–4x higher addiction risk — preventive conversation earlier than for neurotypical peers. ASD: holds tightly to rules — base it on numbers and data.',
    repairAfterConflict: "If the child ran out — don't call them for hours. 'All I want is for you to come back safely. The rest can wait.' Reassure no punishment awaits.",
    positiveReinforcement: "When a child REFUSES drugs in a peer group — an adulthood exam. Praise openly (with siblings, grandparents).",
    culturalContext: "Designer drugs still sold via Telegram. Resources: SAMHSA helpline 1-800-662-HELP (US), FRANK 0300 123 6600 (UK). Find a local adolescent specialist.",
  },
  self_harm: {
    parentSelfRegulation: 'THIS is the conversation where you must be fully calm. If you have your own history of mood disorders — call the other parent, a friend, a therapist BEFORE the talk.',
    neurodivergentNote: 'ASD: self-harm may serve sensory regulation, not depression — requires specialist assessment. ADHD: impulsivity increases risk — removing means is priority #1.',
    repairAfterConflict: 'After a hard self-harm conversation: DO NOT leave the child alone for the next 24h. Same room — cooking nearby, reading. Bodily presence > words.',
    positiveReinforcement: "Every disclosure of emotional pain — even clumsy — reward with: 'Thank you for telling me. That took courage.' Nothing more at this stage.",
    culturalContext: 'Crisis lines: 988 (US), Childline 0800 1111 (UK). Text HOME to 741741 (Crisis Text Line US/UK/CA). Find a private clinician TODAY if public waiting lists are long.',
  },
  violence_gore: {
    parentSelfRegulation: "Check whether you're exposing the child to graphic news or adult conversations. 'Overheard' violence also traumatises. Turn off TV during war/accident talk.",
    neurodivergentNote: 'ASD: sensory sensitivity can be extreme — one exposure = days of anxiety. ADHD: harder to resist the click — discuss pre-emptive blocking together.',
    repairAfterConflict: "If nightmares follow — don't dismiss. Co-watch a 'neutraliser' — gentle nature film, comedy. The brain needs to overwrite.",
    positiveReinforcement: "If the child closes a graphic video on their own and tells you — maturity. 'That was a hard choice. I'm proud of you.' Don't joke.",
    culturalContext: 'Many news sites show unfiltered graphic imagery. For kids under 12 — skip TV news. Use Common Sense Media for ratings; YouTube Kids with whitelist-only.',
  },
  dating: {
    parentSelfRegulation: "Your own dating history shapes what you project. Ask: 'Am I projecting fears?' Be ready for answers touching on orientation — a separate talk.",
    neurodivergentNote: 'ASD: difficulty reading intent — may not realise online manipulation. Use concrete, literal examples. ADHD: fast attachment + impulsivity = elevated risk.',
    repairAfterConflict: "If the child revealed grooming and you panicked — within 2 hours come back: 'I reacted with fear. I'm sorry. I'm ready to listen without interrupting now.'",
    positiveReinforcement: "When the child shows you an online chat — EVEN if something looks off — start with 'Thank you for trusting me.' ONLY THEN assess.",
    culturalContext: 'Report to NCMEC CyberTipline (US 1-800-843-5678), CEOP (UK), or local child-protection police. Teens: Internet Matters, Common Sense Media.',
  },
  weapons: {
    parentSelfRegulation: 'If weapons are in the home (airgun counts) — LOCK before the talk, not during. Check your own search history for anything the child may have spotted.',
    neurodivergentNote: 'ASD: fascination is often mechanics (how it works) — not aggression. Distinguish. ADHD: impulsivity + access = risk even without intent.',
    repairAfterConflict: "After a failed conversation — don't 'fix' it the same day. Next day: 'I wonder what you wanted to tell me but couldn't.' Listen.",
    positiveReinforcement: "When a child reports a peer threatening with a weapon — mature citizenship. 'You did the right thing. That was a hard choice.'",
    culturalContext: 'Firearm access laws vary by country. Interest in shooting sports: certified youth programmes (Boy Scouts shooting in US; supervised clubs from age 10 in EU).',
  },
  cyberbullying_risk: {
    parentSelfRegulation: "Your own school memories may flood you. If you were a victim — warn the child: 'I went through something like this. Your experience may be different.' Don't project.",
    neurodivergentNote: 'ASD: may not recognise teasing/bullying — show concrete examples, name them. ADHD: impulsive online replies escalate — teach the pause.',
    repairAfterConflict: "If the child shuts down after you urged a teacher conversation — respect for 24h. Then: 'I didn't mean to force you. We decide together, okay?'",
    positiveReinforcement: "When the child FIRST tells you about hate — biggest win. 'You dared to. That's what I'm most proud of.'",
    culturalContext: 'Crisis lines: Childline 0800 1111 (UK), 988 (US). StopBullying.gov; Bullying UK. School teachers have mandated reporting duties in most countries.',
  },
  proxy_vpn: {
    parentSelfRegulation: "If you use a VPN at work — be honest: 'Yes, I use one too, but for different reasons.' A lie ('VPNs are evil') kills credibility in 10 seconds.",
    neurodivergentNote: "ADHD: bypassing blocks is often sport — redirect into legal IT security learning. ASD: holds rules tightly; breaking one usually has a concrete cause.",
    repairAfterConflict: "After a fight about a broken agreement: separate VPN from lying. 'I'm upset about the lying, not the VPN.'",
    positiveReinforcement: "When the child says 'I want to install a VPN because X' — EXEMPLARY. 'Thank you for asking. Let's talk.' Pay them with attention.",
    culturalContext: 'VPNs are legal and popular. Set joint rules for specific apps and domains.',
  },
  dark_web: {
    parentSelfRegulation: 'Dark web triggers strong emotions (films, stereotypes). Research before the talk — credible documentary. If you are afraid, the child will sense it.',
    neurodivergentNote: 'ASD: interest in Tor may be genuine, passion-driven, without ill intent. Separate technical curiosity from risk. ADHD: fascination with the forbidden is impulsive — legal alternatives (CTFs).',
    repairAfterConflict: "If reaction was too harsh ('I want to punish you!'): within a day come back with an apology: 'I panicked. That was about me, not you.'",
    positiveReinforcement: "Cybersecurity is a great career track. 'Good that you're curious. Check HackTheBox — same topic, legal.'",
    culturalContext: 'Legal CTF communities: HackTheBox, TryHackMe, PicoCTF. Local CERT sites publish scam notices. Cybersecurity scholarships often exist for teens.',
  },
  piracy: {
    parentSelfRegulation: "Be honest with yourself — did you torrent in your youth? Kids smell hypocrisy. If yes — admit: 'I did it too, that's how I know it's not simple.'",
    neurodivergentNote: "ADHD: short jump 'I want → I click' — teach a 5-second pause. ASD: literal rule reading — explain 'this is illegal' concretely, with consequences.",
    repairAfterConflict: "If the child is ashamed about a virus: avoid 'I told you so'. Focus on the fix: 'We repair together. You aren't the first or last.'",
    positiveReinforcement: "When the child proposes 'I'll buy legally' — reward financially (match half) or verbally. Long-term.",
    culturalContext: 'Public libraries (Libby, Hoopla) — free and legal. Project Gutenberg for classics. Many schools offer digital-library access — show it.',
  },
  crypto_risky: {
    parentSelfRegulation: "If you invest in crypto — be honest about losses. Lying that 'it's all going great' teaches the child to lie too.",
    neurodivergentNote: 'ADHD: dopamine from green candles is especially addictive — compulsion risk several times higher. ASD: passion for market maths — redirect to ETFs and compound interest.',
    repairAfterConflict: "After a fight about lost money: don't cut allowance 'as punishment'. That teaches hiding. 'You still have your next allowance. We'll pick what to do with it together.'",
    positiveReinforcement: "If the child says 'I decided to wait' or 'I won't buy' — MATURITY. 'That's an adult-level decision. I see it.'",
    culturalContext: 'Financial regulators (SEC, FCA, KNF) publish scam warnings. Khan Academy finance module; Investopedia; The Motley Fool (in moderation).',
  },
  scam_phishing: {
    parentSelfRegulation: "Show your own scam attempts (package SMS, bank SMS) as examples — include the child in 'guess which is a scam'. Joint analysis builds the habit.",
    neurodivergentNote: "ASD: click-on-everything isn't stupidity but trust in messages. Literally teach scam signatures. ADHD: hurry = click. Two-second pause before any link.",
    repairAfterConflict: "If the child lost data or money — priority is protecting the account, not venting. After the fix: 'This isn't your fault. They're pros.'",
    positiveReinforcement: "When the child RECOGNISES a scam — even a tiny one — notice it. 'Nice catch. A few years ago I would have fallen for that.'",
    culturalContext: 'Report to FTC (US), Action Fraud (UK), local police cybercrime units. Banks have 24/7 hotlines to freeze cards. Never follow a link from SMS.',
  },
}

function peerPressurePL() {
  return {
    key: 'peer_pressure',
    label: 'Presja rówieśnicza',
    icon: '👥',
    why: 'Dla dzieci 10–14 lat relacje rówieśnicze są rozwojowo ważniejsze niż relacja z rodzicem. To nie patologia — to etap. Ale bez rozmowy dziecko wybiera to, co daje natychmiastową akceptację grupy, nawet jeśli wie, że szkodzi.',
    opening: '„Chciał(a)bym z tobą porozmawiać o czymś, co pamiętam z własnej młodości — jak czasem robiło się coś głupiego, żeby nie być „out". Ciekaw(a) jestem, jak to wygląda u was w klasie."',
    parentSelfRegulation: 'Przypomnij sobie własną najgłupszą decyzję z 13. roku życia — podjętą, żeby zaimponować. Jeśli pamiętasz, łatwiej rozmawiać bez przewagi moralnej.',
    pitfalls: [
      'Nie mów „po prostu ich nie słuchaj" — dla dziecka to rozwojowo niewykonalne.',
      'Nie wyśmiewaj jego grupy znajomych — poczuje atak na siebie.',
      'Nie planuj „pójdę do rodziców tych kolegów" bez zgody dziecka.',
    ],
    ageNotes: [
      { range: '6–9',   note: 'Wciąż rodzina > grupa. Ucz ról: „Przyjaciel to ktoś, kto nadal cię lubi, nawet gdy powiedziałeś «nie»."', developmentalContext: devCtxPL['6–9'] },
      { range: '10–12', note: 'Kluczowy moment — grupa zaczyna górować. Rozmawiaj o konkretnych sytuacjach („co zrobisz, jeśli Kuba cię namówi na X?"). Scenariusze > zakazy.', developmentalContext: devCtxPL['10–12'] },
      { range: '13–15', note: 'Szczyt presji. Zaoferuj „alibi rodzica" — „jeśli chcesz wyjść z imprezy, wyślij mi 🦉, przyjadę i powiem, że to moja wina". To ratuje.', developmentalContext: devCtxPL['13–15'] },
      { range: '16–18', note: 'Rośnie autonomia decyzji, ale impulsywność wciąż wysoka. Rozmawiaj jak z dorosłym: „Jak rozróżniasz przyjaciela od znajomego, który cię używa?"', developmentalContext: devCtxPL['16–18'] },
    ],
    reactions: [
      { label: 'Bagatelizowanie', example: '„U nas nikt do niczego nie zmusza."', parentResponse: '„OK. A ostatnio zrobiłeś(-aś) coś, czego byś nie zrobił(a), gdyby ich nie było? Nawet drobiazgu."', avoid: 'Upierać się, że na pewno jest presja.' },
      { label: 'Złość / obrona grupy', example: '„Oni są moimi znajomymi, nie obgaduj ich!"', parentResponse: '„Nie obgaduję. Pytam o ciebie w tej grupie — jak się tam czujesz jako ty."', avoid: 'Atakowanie konkretnych osób.' },
      { label: 'Ujawnienie sytuacji', example: '„Tomek kazał mi zrobić X, żebym został w paczce."', parentResponse: '„Dziękuję, że mówisz. Pomogę ci znaleźć wyjście — ale najpierw: jak to jest dla ciebie teraz?"', avoid: 'Od razu planować interwencję.' },
      { label: 'Zmęczenie presją', example: '„Już mi się nie chce do nich chodzić."', parentResponse: '„To jest ważna informacja. Nie musisz tłumaczyć. Pomogę zaplanować kolejne dni — albo po prostu mogę być obok."', avoid: '„A nie mówiłem(-am)?"' },
      { label: 'Chce odstawić starego kolegę', example: '„Muszę przestać mówić do Kasi, bo reszta jej nie lubi."', parentResponse: '„Ciężka decyzja. Pomyśl, z czym wrócisz do niej za 5 lat. Nie mówię, co wybrać — ale nie odpuszczaj tego pytania."', avoid: 'Narzucać, że „trzeba być lojalnym".' },
    ],
    neurodivergentNote: 'ASD: dziecko może nie rozpoznawać, że jest używane — ucz konkretnych sygnatur („jeśli robią to zawsze ONI, a nigdy TY — to nie przyjaźń"). ADHD: szybko wpada w „fajność" grupy — pomagaj pauzować przed zgodą.',
    redFlags: [
      { flag: 'Nagłe odcinanie się od starych znajomych.', severity: 'medium', action: 'Rozmowa o tym, co się zmieniło.', referToSpecialist: false },
      { flag: 'Nowa grupa znajomych + gwałtowna zmiana stylu (ubrania, slang, wartości).', severity: 'medium', action: 'Wspólny posiłek z nową grupą — nie jako pułapka, a żeby poznać.', referToSpecialist: false },
      { flag: 'Niewyjaśniona gotówka, papierosy, alkohol.', severity: 'high', action: 'Bezpośrednia rozmowa + kontakt ze szkołą.', referToSpecialist: false },
      { flag: 'Groźby ze strony grupy, jeśli dziecko odmówi.', severity: 'high', action: 'Dokumentuj i zgłoś wychowawcy / pedagogowi szkolnemu.', referToSpecialist: true },
      { flag: 'Dziecko robi rzeczy, których samo się wstydzi — i wciąż wraca do tej grupy.', severity: 'high', action: 'Terapia indywidualna — praca nad samooceną.', referToSpecialist: true },
    ],
    followUp: [
      'Ustalcie „kod ratunkowy" — emotkę / zdanie, po którym rodzic przyjeżdża bez pytań.',
      'Zaproponuj alternatywną grupę — drużyna sportowa, koło, harcerstwo — gdzie tożsamość budują na czymś innym niż „bycie fajnym".',
      'Przez 2 tygodnie 5 minut dziennie „jak ci było dziś z ludźmi?" — bez oceniania.',
      'Jeśli presja trwa > miesiąc i zmienia zachowanie dziecka — konsultacja z psychologiem szkolnym lub prywatnym.',
    ],
    repairAfterConflict: 'Jeśli zaatakowałeś(-aś) jego grupę i trzasnął drzwiami — napisz: „Zabrałem(-am) się za to źle. Twoi znajomi to nie moja sprawa, ale TY jesteś. Wrócimy do tego, gdy będziesz chciał(a)."',
    positiveReinforcement: 'Gdy dziecko powie „dziś odmówiłem(-am), bo nie chciałem(-am)" — to moment. Nie „no widzisz, udało się". Raczej: „To musiało być ciężkie. Jak się z tym teraz czujesz?"',
    culturalContext: 'W polskich szkołach pedagog szkolny ma obowiązek reagować na presję grupy i przemoc psychiczną (rozporządzenie MEN). Jeśli szkoła bagatelizuje — pisemne zgłoszenie do kuratorium oświaty. 116 111 — Telefon Zaufania dla Dzieci i Młodzieży.',
  }
}

function peerPressureEN() {
  return {
    key: 'peer_pressure',
    label: 'Peer pressure',
    icon: '👥',
    why: "For kids aged 10–14, peer relationships are developmentally MORE important than the parent bond. This isn't pathology — it's a stage. But without conversation, a child picks whatever gives immediate group acceptance, even if they know it harms them.",
    opening: '"I\'d like to talk about something I remember from my own teens — how you sometimes did something dumb just so you weren\'t \'out\'. I\'m curious how this looks in your class."',
    parentSelfRegulation: "Recall your own worst decision at age 13, made to impress. If you remember, it's easier to talk without moral high ground.",
    pitfalls: [
      "Don't say 'just don't listen to them' — developmentally impossible at this age.",
      "Don't mock their friend group — they'll feel the attack on themselves.",
      "Don't plan 'I'll call the other parents' without your child's consent.",
    ],
    ageNotes: [
      { range: '6–9',   note: "Family still > group. Teach roles: 'A friend is someone who still likes you after you said no.'", developmentalContext: devCtxEN['6–9'] },
      { range: '10–12', note: "Critical moment — the group starts to dominate. Talk through concrete situations ('What would you do if X pressured you into Y?'). Scenarios > bans.", developmentalContext: devCtxEN['10–12'] },
      { range: '13–15', note: "Peak pressure. Offer a 'parent alibi' — 'If you ever want to leave a party, text me an owl emoji 🦉, I'll pick you up and say it's my fault.' This saves lives.", developmentalContext: devCtxEN['13–15'] },
      { range: '16–18', note: "Autonomous decisions grow, but impulsivity is still high. Talk as with an adult: 'How do you tell a friend from someone who uses you?'", developmentalContext: devCtxEN['16–18'] },
    ],
    reactions: [
      { label: 'Dismissal', example: "'Nobody makes me do anything here.'", parentResponse: "'Okay. Have you recently done something you wouldn\\'t have done if they weren\\'t there? Even a small thing.'", avoid: 'Insisting there definitely is pressure.' },
      { label: 'Anger / defending the group', example: "'They\\'re my friends, don\\'t badmouth them!'", parentResponse: "'I\\'m not badmouthing. I\\'m asking about YOU in that group — how YOU feel there.'", avoid: 'Attacking specific people.' },
      { label: 'Revealing the situation', example: "'Tom told me to do X so I\\'d stay in the group.'", parentResponse: "'Thank you for telling me. I\\'ll help you find a way out — but first: how is this for you right now?'", avoid: 'Jumping to intervention planning.' },
      { label: 'Tired of pressure', example: "'I don\\'t want to hang out with them anymore.'", parentResponse: "'That\\'s important. You don\\'t have to explain. I can help you plan the next days — or I can just be around.'", avoid: "'I told you so.'" },
      { label: 'Wants to drop an old friend', example: "'I have to stop talking to Kate, the rest don\\'t like her.'", parentResponse: "'Hard choice. Think about what you\\'d say to her in 5 years. I won\\'t choose for you — but don\\'t drop the question.'", avoid: "Forcing 'you must be loyal'." },
    ],
    neurodivergentNote: "ASD: the child may not recognise being used — teach concrete signatures ('if THEY always initiate and YOU never — that's not friendship'). ADHD: quickly caught up in 'coolness' — help them pause before agreeing.",
    redFlags: [
      { flag: 'Suddenly cutting off old friends.', severity: 'medium', action: 'Conversation about what changed.', referToSpecialist: false },
      { flag: 'New friend group + sudden style shift (clothes, slang, values).', severity: 'medium', action: 'Shared meal with the new group — not a trap, a chance to meet.', referToSpecialist: false },
      { flag: 'Unexplained cash, cigarettes, alcohol.', severity: 'high', action: 'Direct conversation + school contact.', referToSpecialist: false },
      { flag: 'Group threats if the child refuses.', severity: 'high', action: 'Document and report to teacher / school counsellor.', referToSpecialist: true },
      { flag: "Child does things they're ashamed of — and still returns to the group.", severity: 'high', action: 'Individual therapy — self-esteem work.', referToSpecialist: true },
    ],
    followUp: [
      "Agree on a 'rescue code' — an emoji or phrase after which the parent picks them up, no questions.",
      "Suggest an alternative group — sports team, club, scouts — where identity is built on something other than 'being cool'.",
      "For 2 weeks, 5 minutes a day: 'How were people with you today?' — no judgement.",
      'If pressure lasts > a month and behaviour changes — school counsellor or private psychologist.',
    ],
    repairAfterConflict: "If you attacked their group and the door slammed — write: 'I handled this badly. Your friends aren't my business, but YOU are. We'll come back to this when you want.'",
    positiveReinforcement: "When a child says 'I said no today because I didn't want to' — that's a moment. Not 'see, it worked'. Rather: 'That must have been hard. How are you with it now?'",
    culturalContext: 'School counsellors in most countries have mandated reporting duties for psychological pressure and bullying. If the school minimises — written complaint to the board. Resources: StopBullying.gov, Anti-Bullying Alliance (UK).',
  }
}

function transform() {
  const data = JSON.parse(readFileSync(SRC, 'utf8'))

  for (const lang of ['pl', 'en']) {
    const rewrite = lang === 'pl' ? rewriteOpeningPL : rewriteOpeningEN
    const soft = lang === 'pl' ? softPL : softEN
    const out = []
    for (const s of data.scenarios[lang]) {
      if (s.key === 'peer_pressure') continue
      const meta = soft[s.key] || {
        parentSelfRegulation: '',
        neurodivergentNote: '',
        repairAfterConflict: '',
        positiveReinforcement: '',
        culturalContext: '',
      }
      out.push({
        key: s.key,
        label: s.label,
        icon: s.icon,
        why: s.why,
        opening: rewrite(s.opening),
        parentSelfRegulation: meta.parentSelfRegulation,
        pitfalls: s.pitfalls,
        ageNotes: splitAgeNotes(s.ageNotes, lang),
        reactions: s.reactions,
        neurodivergentNote: meta.neurodivergentNote,
        redFlags: convertRedFlags(s.key, s.redFlags, lang),
        followUp: s.followUp,
        repairAfterConflict: meta.repairAfterConflict,
        positiveReinforcement: meta.positiveReinforcement,
        culturalContext: meta.culturalContext,
      })
    }
    out.push(lang === 'pl' ? peerPressurePL() : peerPressureEN())
    data.scenarios[lang] = out
  }

  data.version = 2
  data.changelog = [
    {
      version: 2,
      changes: [
        'Split ageNotes into 4 concrete ranges (6–9, 10–12, 13–15, 16–18) with developmentalContext.',
        'Converted redFlags to structured objects with severity, action and referToSpecialist.',
        'Rewrote opening lines as I-messages (avoiding accusatory "I saw you…").',
        'Added parentSelfRegulation, neurodivergentNote, repairAfterConflict, positiveReinforcement, culturalContext per scenario.',
        'Added new scenario: peer_pressure.',
        'Localised EN follow-up resources with country-specific helplines.',
      ],
    },
  ]

  writeFileSync(SRC, JSON.stringify(data, null, 2), 'utf8')
  console.log(`Wrote ${SRC}`)
  console.log(`  PL scenarios: ${data.scenarios.pl.length}`)
  console.log(`  EN scenarios: ${data.scenarios.en.length}`)
  console.log(`  Version: ${data.version}`)
}

transform()
