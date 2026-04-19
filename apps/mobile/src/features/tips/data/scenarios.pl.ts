import type { ConversationScenario } from './types'

export const SCENARIOS_PL: ConversationScenario[] = [
  {
    key: 'social_media',
    label: 'Media społecznościowe',
    icon: '📱',
    why: 'Nieskończone przewijanie, porównywanie się i algorytmy wpływają na sen, koncentrację i samoocenę.',
    opening:
      '„Widziałem(-am), że próbowałeś otworzyć Instagrama — chcę porozmawiać, nie żeby cię zrugać, tylko żeby zrozumieć, co cię tam ciągnie."',
    pitfalls: [
      'Nie żądaj telefonu do kontroli bez powodu — to szybko niszczy zaufanie.',
      'Nie moralizuj („za moich czasów…") — zamykają się w ciągu 10 sekund.',
      'Nie skupiaj się na liczbie minut. Skup się na tym, jak ten czas im się KOJARZY.',
    ],
    ageNotes: {
      younger: 'Większość platform ma regułę 13+ nie bez powodu. Ujmij to jako „ta aplikacja jest dla starszych dzieci", nie „jesteś za niedojrzały".',
      tween: 'W tym wieku porównywanie się uderza najmocniej. Spytaj, które posty sprawiają, że czują się dobrze, a które wyczerpani.',
      teen: 'Uznaj, że tam komunikuje się ich grupa znajomych. Negocjuj granice zamiast zakazywać.',
    },
    reactions: [
      {
        label: '„Wszyscy mają"',
        example: 'Upierają się, że wszyscy w klasie korzystają z aplikacji i zostaną wykluczeni.',
        parentResponse:
          '„Wierzę, że tak to wygląda. Zadzwońmy razem do rodziców dwóch kolegów i sprawdźmy, co oni pozwalają — potem zdecydujemy."',
        avoid: 'Nazywanie ich kłamcami lub mówienie „nie obchodzi mnie, co robią inni".',
      },
      {
        label: 'Milczenie / wzruszenie ramion',
        example: 'Milczą albo odpowiadają jednym słowem.',
        parentResponse:
          '„W porządku, nie musimy tego teraz rozwiązywać. Przemyśl to i jutro powiedz, co byłoby dla ciebie sprawiedliwe."',
        avoid: 'Zapełnianie ciszy własnym monologiem.',
      },
      {
        label: 'Złość / trzaśnięcie drzwiami',
        example: '„Kontrolujesz mnie! Nie ufasz mi!"',
        parentResponse:
          '„Widzę, że jesteś wściekły. Nie chcę cię kontrolować — chcę, żebyś był bezpieczny. Zróbmy przerwę i wróćmy do tematu, gdy oboje ochłoniemy."',
        avoid: 'Podnoszenie głosu razem z nim. Eskalacja kończy rozmowę.',
      },
      {
        label: 'Łzy / wstyd',
        example: 'Płaczą albo chowają twarz.',
        parentResponse:
          '„Nie masz kłopotów. Jestem po twojej stronie. Oddychaj — rozwiążemy to razem."',
        avoid: 'Natychmiastowe „naprawianie" uczuć logicznymi argumentami.',
      },
      {
        label: 'Negocjacja',
        example: '„A gdybym używał tylko godzinę, tylko w weekendy?"',
        parentResponse:
          '„To rozsądny początek. Spróbujmy przez dwa tygodnie, potem oboje sprawdzimy — ty powiesz, jak się czułeś, i dostosujemy."',
        avoid: 'Zgadzać się, a potem po cichu zaostrzać reguły.',
      },
    ],
    redFlags: [
      'Tracenie snu na przewijanie aplikacji po północy więcej niż 3 noce w tygodniu.',
      'Gwałtowne spadki nastroju minuty po zamknięciu aplikacji.',
      'Ukrywane, prywatne konta, zablokowane wiadomości od nieznajomych.',
    ],
    followUp: [
      'Zapiszcie ustaloną regułę razem na papierze — nie tylko ustnie.',
      'Umówcie kontrolę po 2 tygodniach w kalendarzu, widoczną dla obu stron.',
      'Zainstaluj jedną wspólną aplikację (np. grę), w którą możecie grać razem — odbudowuje zaufanie.',
    ],
  },
  {
    key: 'adult_content',
    label: 'Treści dla dorosłych',
    icon: '🔞',
    why: 'Wczesna ekspozycja kształtuje wyobrażenia o zgodzie, ciele i relacjach — często w szkodliwy sposób.',
    opening:
      '„Chcę porozmawiać o czymś niezręcznym — spokojnie, jeśli będzie ci wstyd, mnie też. Ważne, żebyś wiedział(-a), że nie masz kłopotów."',
    pitfalls: [
      'Nie pytaj „czy oglądałeś?" w formie tak/nie — zamyka rozmowę.',
      'Nie udawaj, że tego nie ma. Wiedzą, że jest.',
      'Nie używaj wstydu jako broni. Wstyd popycha zachowanie pod ziemię.',
    ],
    ageNotes: {
      younger: 'Wytłumacz: „Niektóre strony pokazują rzeczy dla dorosłych, które nie są dla ciebie — powiedz mi, jeśli coś wyskoczy, nie będziesz miał kłopotów."',
      tween: 'Ciekawość jest normalna. Oddziel „ciekawość ciał" (normalne) od „oglądania porno" (zaburza wyobrażenie o prawdziwej bliskości).',
      teen: 'Rozmawiaj o porno vs. prawdziwe relacje: zgoda, zatrzymywanie się, komunikacja — tego w większości porno nie widać.',
    },
    reactions: [
      {
        label: 'Odwrócenie uwagi / żart',
        example: 'Śmieją się albo obracają w żart.',
        parentResponse:
          '„Wiem, że to niezręczne. Powiem krótko — chcę, żebyś wiedział(-a), że możesz mnie o wszystko zapytać bez oceniania."',
        avoid: 'Irytowanie się, że nie traktują tematu poważnie.',
      },
      {
        label: 'Zawstydzone milczenie',
        example: 'Czerwona twarz, patrzą w podłogę.',
        parentResponse:
          '„Nie musisz nic mówić. Tylko posłuchaj. Jeśli kiedyś będziesz miał pytanie, obiecuję, że nie zrobię z tego dramatu."',
        avoid: 'Wymuszanie kontaktu wzrokowego.',
      },
      {
        label: 'Obronna złość',
        example: '„To obrzydliwe, nigdy bym nie zrobił(-a)!"',
        parentResponse:
          '„Ok. Nie oskarżam cię — mówię tylko, że jeśli kiedyś to się zdarzy, nie stracisz mojego zaufania przez to, że powiesz."',
        avoid: 'Kłócenie się, czy to zrobili czy nie.',
      },
      {
        label: 'Szczere przyznanie',
        example: '„Tak, znajomy mi coś pokazał."',
        parentResponse:
          '„Dzięki, że mi mówisz. Jak to na ciebie wpłynęło? To uczucie jest ważniejsze niż sama treść."',
        avoid: 'Karanie za szczerość — nigdy więcej nie usłyszysz prawdy.',
      },
      {
        label: 'Pytania',
        example: '„Dlaczego ludzie to oglądają?"',
        parentResponse:
          '„Dobre pytanie. Ciekawość jest normalna. Problem w tym, że większość tego pokazuje fałszywą wersję bliskości — bez szacunku, bez zgody. Pogadajmy, jak wygląda prawdziwa relacja."',
        avoid: 'Zbywanie pytania.',
      },
    ],
    redFlags: [
      'Kompulsywne używanie (godziny dziennie, wpływ na szkołę/sen).',
      'Opisywanie brutalnych lub bez-zgody scen jako „normalnych".',
      'Jakakolwiek wzmianka o dorosłym, który zaczyna z dzieckiem rozmowę o tematyce seksualnej w internecie — natychmiast dzwoń na policję.',
    ],
    followUp: [
      'Przenieś urządzenia do wspólnych pomieszczeń (nie sypialni) na jakiś czas, jako „dla nas wszystkich".',
      'Umów wizytę u terapeuty rodzinnego, jeśli temat wraca — są do tego przeszkoleni.',
      'Zostaw otwarte drzwi: „Możesz do tej rozmowy wrócić kiedykolwiek."',
    ],
  },
  {
    key: 'gambling',
    label: 'Hazard',
    icon: '🎰',
    why: 'Strony hazardowe (i skrzynki z nagrodami w grach) wykorzystują te same mechanizmy nagrody w mózgu co kokaina — mózg nastolatka jest szczególnie podatny.',
    opening:
      '„Widziałem(-am), że zablokowała się strona bukmacherska. Nie jestem zły(-a) — chcę zrozumieć. Znajomy ci to wysłał, czy sam(a) byłeś ciekaw(a)?"',
    pitfalls: [
      'Nie myl „gry na umiejętność" z „hazardem" — poker z kolegami to co innego niż kasyno w internecie.',
      'Nie ignoruj skrzynek z nagrodami w grach. Uczą tego samego wzorca.',
      'Nie moralizuj o pieniądzach. Skup się na tym, że hazard jest zaprojektowany, by dawać przyjemność nawet przy przegranej.',
    ],
    ageNotes: {
      younger: 'Ujmij to tak: „Te strony są zaprojektowane, żeby oszukać dorosłych na pieniądze — twój mózg nie ma szans."',
      tween: 'Wytłumacz przewagę kasyna: „Strona zawsze wygrywa długoterminowo. To matematyka, nie szczęście."',
      teen: 'Porozmawiaj o szumie wokół kryptowalut i zakładów bukmacherskich na TikToku — twórcom internetowym płaci się, żeby publicznie przegrywali.',
    },
    reactions: [
      {
        label: '„Tylko patrzyłem"',
        example: 'Upierają się, że nigdy nie postawili zakładu.',
        parentResponse:
          '„Ok. Wierzę, że ciekawość to najczęstszy powód. Pokażę ci, jak te strony są zaprojektowane — to całkiem ciekawe."',
        avoid: 'Oskarżenia bez dowodów.',
      },
      {
        label: '„To moje pieniądze"',
        example: 'Kłócą się o kieszonkowe lub zarobione pieniądze.',
        parentResponse:
          '„Masz rację, są twoje. Moim zadaniem jest upewnić się, że nie stracisz ich na stronie, która jest prawnie zakazana do 18. roku życia."',
        avoid: 'Zabieranie pieniędzy jako kara.',
      },
      {
        label: 'Chwalenie się wygraną',
        example: '„Zamieniłem 5 zł na 40!"',
        parentResponse:
          '„Fajna wygrana. A teraz przez tydzień zapisujmy każdą grę — wygrane i przegrane — na kartce. Zobaczysz realne saldo."',
        avoid: 'Wyśmiewanie lub lekceważenie wygranej. Ukryją przegrane.',
      },
      {
        label: 'Ukrywanie przegranych',
        example: 'Odkrywasz, że stracili znaczną sumę.',
        parentResponse:
          '„Jestem dumny(-a), że nie skłamałeś, gdy zapytałem. Tracenie pieniędzy jest przerażające — zróbmy plan, nie karę."',
        avoid: 'Wyciąganie ich z długu bez rozmowy o nawyku.',
      },
      {
        label: 'Zaprzeczanie mimo dowodów',
        example: 'Historia przeglądarki i zablokowane próby pokazują winę, a oni zaprzeczają.',
        parentResponse:
          '„Pokażę ci, co widziałem(-am) — nie żeby cię osaczyć, tylko bo wolę porozmawiać niż udawać."',
        avoid: 'Prowadzenie ich do kłamstwa, zanim ujawnisz, co wiesz.',
      },
    ],
    redFlags: [
      'Pożyczanie pieniędzy od znajomych lub rodzeństwa wielokrotnie.',
      'Sprzedawanie rzeczy (gry, skiny) żeby finansować konta.',
      'Ukrywanie metod płatności / używanie kart rodziców bez pytania.',
    ],
    followUp: [
      'Zainstaluj Gamban lub inny blokator (nie tylko poziom DNS).',
      'Pomóż ustalić okres odstawienia (30 dni) i nagradzaj kolejne etapy.',
      'Podaj kontakt: Anonimowi Hazardziści (PL), GamCare (UK), lokalne wsparcie dla nastolatków.',
    ],
  },
  {
    key: 'drugs',
    label: 'Narkotyki',
    icon: '💊',
    why: 'Dzieci trafiają na treści o narkotykach (przedstawianie ich jako czegoś normalnego, sprzedaż, dopalacze) na długo przed spotkaniem z nimi w realnym świecie. Rozmowa musi być pierwsza.',
    opening:
      '„Widziałem(-am), że zablokowała się strona o narkotykach. Wolę porozmawiać niż zakładać — czego chciałeś się dowiedzieć?"',
    pitfalls: [
      'Nie używaj straszenia z lat 90. — dzieci mają Google, sprawdzą cię.',
      'Nie wrzucaj marihuany, MDMA i heroiny do jednego worka — tracisz wiarygodność.',
      'Nie karz ciekawości. Karz nieuczciwość.',
    ],
    ageNotes: {
      younger: 'Skup się na lekach: „Bierz tylko to, co my lub lekarz ci damy. Nigdy nie próbuj tego, co podaje kolega."',
      tween: 'Porozmawiaj o wejpowaniu i napojach energetycznych jako nawykach-bramach (realne, nie panika moralna).',
      teen: 'Bądź szczery(-a) co do różnic w ryzyku. „Trawka to nie heroina. Ale rozwijający się mózg reaguje inaczej na wszystko."',
    },
    reactions: [
      {
        label: '„Tylko byłem ciekawy"',
        example: 'Twierdzą, że tylko sprawdzali, a nie brali.',
        parentResponse:
          '„Ok. Czego chciałeś się dowiedzieć? Sprawdźmy razem na rzetelnej stronie o zmniejszaniu szkód, nie u dilera."',
        avoid: 'Zakładanie, że „ciekawy" = „używa".',
      },
      {
        label: '„Znajomy bierze"',
        example: 'Odwracają uwagę na kogoś innego.',
        parentResponse:
          '„Dzięki, że mówisz. Nie idę na niego donosić. Chcę wiedzieć: martwisz się o niego?"',
        avoid: 'Zakazywanie znajomego bez rozmowy.',
      },
      {
        label: 'Przyznanie się do użycia',
        example: '„Spróbowałem raz trawki."',
        parentResponse:
          '„Doceniam, że mi mówisz. Wymagało odwagi. Jak było? Co zrobił(a)byś inaczej?"',
        avoid: 'Natychmiastowa kara — następnej szczerej rozmowy nie będzie.',
      },
      {
        label: 'Złość / wyjście',
        example: '„Oskarżasz mnie, że jestem ćpunem!"',
        parentResponse:
          '„Nie oskarżam. Idź ochłonąć. Jak wrócisz, chętnie usłyszę, co w tym brzmiało jak oskarżenie."',
        avoid: 'Biegnięcie za nim z krzykiem.',
      },
      {
        label: 'Żart / bagatelizowanie',
        example: '„Tato, wszyscy piją, wyluzuj."',
        parentResponse:
          '„Picie to nie to samo, co dopalacze kupione w internecie. Te są produkowane w nielegalnych laboratoriach, bez żadnej kontroli jakości."',
        avoid: 'Dołączanie do żartu i zamykanie tematu.',
      },
    ],
    redFlags: [
      'Niewyjaśniona gotówka lub brak pieniędzy.',
      'Nowa grupa znajomych + tajemniczość + wahania nastroju razem.',
      'Akcesoria znalezione w pokoju lub aucie.',
      'Jakakolwiek wzmianka o opioidach, benzodiazepinach, nieznanych tabletkach — natychmiast do lekarza.',
    ],
    followUp: [
      'Trzymaj leki pod kluczem. Licz tabletki, jeśli trzeba.',
      'Poznaj objawy przedawkowania substancji popularnych w Twojej okolicy. Jeśli to uzasadnione — miej przy sobie nalokson (odtrutka na opioidy).',
      'Skieruj do terapeuty specjalizującego się w pracy z nastolatkami, nie ogólnego.',
    ],
  },
  {
    key: 'self_harm',
    label: 'Samookaleczenia i zaburzenia odżywiania',
    icon: '⚠️',
    why: 'Społeczności promujące samookaleczenia i anoreksję uczą dzieci ukrywania objawów i rywalizowania o skrajność. Próba wejścia to sygnał alarmowy.',
    opening:
      '„Kocham cię. Nie jestem tu, żeby cię ukarać — jestem, bo się martwię. Możesz mi powiedzieć, jak się ostatnio czujesz?"',
    pitfalls: [
      'Nie pytaj „czy się tniesz?" w formie tak/nie — to zaprasza do kłamstwa.',
      'Nie obiecuj tajemnicy, której nie dotrzymasz. Powiedz: „Zawsze powiem drugiemu rodzicowi / lekarzowi, jeśli to poważne. Zawsze."',
      'Nie zostawiaj ich samych po ciężkim wyznaniu przez co najmniej kilka godzin.',
    ],
    ageNotes: {
      younger: 'Prosty język: „Niektóre strony uczą dzieci, jak się krzywdzić. To nigdy nie jest sposób na lepsze samopoczucie — znajdźmy taki, który działa."',
      tween: 'Atak na obraz ciała kulminuje tutaj. Porozmawiaj o filtrach i tym, że NIKT nie wygląda jak zdjęcia na Instagramie.',
      teen: 'Bądź bezpośredni: „Jeśli myślisz o samookaleczaniu albo o niejedzeniu, wolę usłyszeć to od ciebie niż dowiedzieć się później."',
    },
    reactions: [
      {
        label: 'Zaprzeczanie',
        example: '„Nic mi nie jest. Nie rób sceny."',
        parentResponse:
          '„Ok. Słyszę cię. I tak z tobą posiedzę przez chwilę. Nie musisz mówić."',
        avoid: 'Odchodzenie „żeby dać przestrzeń", kiedy faktycznie się boisz.',
      },
      {
        label: 'Płacz / załamanie',
        example: 'Płaczą mocno albo trzęsą się.',
        parentResponse:
          '„Jestem tu. Nie musisz nic wyjaśniać. Oddychajmy razem. Zadzwonimy po pomoc, kiedy będziesz gotowy(-a)."',
        avoid: 'Rozwiązywanie problemu w trakcie łez.',
      },
      {
        label: 'Wyznanie + „nie mów nikomu"',
        example: '„Robię to, ale proszę, nie mów tacie."',
        parentResponse:
          '„Nie podam szczegółów. Ale to jest większe niż my dwoje. Lekarz musi pomóc — widzieli to tysiąc razy."',
        avoid: 'Obiecywanie pełnej tajemnicy.',
      },
      {
        label: 'Chłód / brak emocji',
        example: 'Bez emocji, krótkie odpowiedzi, odcięci.',
        parentResponse:
          '„Umawiam nas na wizytę w tym tygodniu. Nie musisz rozmawiać ze mną, ale musisz z kimś porozmawiać."',
        avoid: 'Mylenie braku emocji z „wszystko ok".',
      },
      {
        label: 'Sugestie samobójcze',
        example: '„Byłoby łatwiej, gdyby mnie nie było."',
        parentResponse:
          '„Dziękuję, że mi zaufałeś. Kocham cię. Teraz idziemy razem zadzwonić na telefon zaufania / na SOR." ZOSTAŃ Z NIMI.',
        avoid: 'Traktowanie tego jako „nastoletnia faza" — traktuj każdą wzmiankę serio.',
      },
    ],
    redFlags: [
      'Długie rękawy lub bandaże w upale.',
      'Szybka zmiana wagi w dowolną stronę.',
      'Rozdawanie cennych rzeczy.',
      'Wyszukiwanie „bezbolesnych metod" albo konkretne wzmianki o zakończeniu życia.',
      'Rytualne liczenie kalorii lub chowanie jedzenia.',
    ],
    followUp: [
      'Usuń środki z domu (żyletki, zapasy leków, broń zamknięta).',
      'Wizyta w tym samym tygodniu u lekarza lub psychologa mającego doświadczenie w pracy z nastolatkami.',
      'Telefon zaufania dla dzieci (116 111 w PL) zapisany w ich telefonie I twoim.',
      'Zadbaj o siebie — znajdź własnego terapeutę. To ciężar nie do uniesienia w pojedynkę.',
    ],
  },
  {
    key: 'violence_gore',
    label: 'Przemoc i drastyczne treści',
    icon: '🩸',
    why: 'Powtarzana ekspozycja na graficzną, prawdziwą przemoc odwrażliwia i prowadzi do natrętnych myśli, lęku i problemów ze snem.',
    opening:
      '„Próbowałeś otworzyć stronę z dość drastycznymi rzeczami. Nie jestem zły(-a). Czasami ludzie oglądają to z ciekawości. Jak się czułeś, jeśli to widziałeś?"',
    pitfalls: [
      'Nie myl fikcyjnej przemocy (gry, horrory) z prawdziwymi stronami pokazującymi drastyczne, autentyczne materiały — mają różne skutki.',
      'Nie reaguj nadmiernie na jednorazową ciekawość. Reaguj na wzorzec.',
    ],
    ageNotes: {
      younger: 'Skup się na „prawdziwe vs. udawane". Młode mózgi nie zawsze je odróżniają.',
      tween: 'To szczyt wieku „wymiany szokujących filmów" między znajomymi. Pytaj, kto wysłał.',
      teen: 'Rozmawiaj szczerze o odwrażliwianiu. „10. raz to nie to samo co 1. — mózg przestaje reagować."',
    },
    reactions: [
      {
        label: '„To tylko mem"',
        example: 'Traktują to jak żart albo prowokacyjny humor.',
        parentResponse:
          '„Kultura memów pcha takie rzeczy mocno. To ich nie czyni nieszkodliwymi. Jak naprawdę się czułeś oglądając to?"',
        avoid: 'Zbywanie humoru jako fałszywego — jest dla nich realny.',
      },
      {
        label: 'Udawanie twardziela',
        example: '„Spoko, nie ruszyło mnie."',
        parentResponse:
          '„Może teraz. Czasem takie rzeczy wracają o 3 w nocy. Jeśli tak się stanie, znajdź mnie."',
        avoid: 'Pouczanie „ty TYLKO myślisz, że jesteś twardy".',
      },
      {
        label: 'Wstrząśnięty',
        example: 'Przyznają, że było okropne i nie mogą o tym zapomnieć.',
        parentResponse:
          '„To ma sens. Takie obrazy zostają. Porozmawiajmy, co pomaga — czasem przechodzi, czasem terapeuta jest pomocny."',
        avoid: 'Bagatelizowanie („to tylko film").',
      },
      {
        label: 'Unikanie tematu',
        example: 'Temat zmienia się za każdym razem, gdy próbujesz.',
        parentResponse:
          'Wracaj raz dziennie przez tydzień, 60-sekundowymi dawkami. „Tylko sprawdzam — głowa w porządku dziś?"',
        avoid: 'Rezygnowanie po jednym uniku.',
      },
      {
        label: 'Udostępnianie / presja rówieśników',
        example: 'Znajomi wysyłają drastyczne filmy w grupowych czatach.',
        parentResponse:
          '„Możesz wyciszyć albo opuścić czat. Nie jesteś im winien reakcji. Chcesz pomóc napisać, co powiedzieć?"',
        avoid: 'Konfiskata telefonu jako „rozwiązanie".',
      },
    ],
    redFlags: [
      'Szukanie coraz bardziej ekstremalnych treści z czasem.',
      'Fascynacja konkretnymi sprawcami lub masowymi aktami przemocy.',
      'Groźby wobec siebie lub innych — natychmiast profesjonalna pomoc.',
      'Zaburzenia snu lub koszmary trwające >2 tygodnie.',
    ],
    followUp: [
      'Wprowadź „dietę informacyjną" — jedno wiarygodne źródło, odrzućcie kanały z drastycznymi i szokującymi treściami.',
      'Jeśli napięcie się utrzymuje — poproś psychologa o ocenę w kierunku lęku lub zespołu stresu pourazowego.',
      'Pokaż, jak blokować / zgłaszać konta w aplikacjach, z których korzystają.',
    ],
  },
  {
    key: 'dating',
    label: 'Aplikacje randkowe',
    icon: '💔',
    why: 'Aplikacje randkowe nie są tworzone dla nieletnich. Drapieżcy, wymuszanie zdjęć intymnych i szokujące treści trafiają tu szczególnie mocno.',
    opening:
      '„Zablokowała się aplikacja randkowa na twoim urządzeniu. Jestem ciekaw(a) — to ty, czy coś się samo zainstalowało? Chcę zrozumieć, nie przesłuchiwać."',
    pitfalls: [
      'Nie zakładaj, że chodzi o seks. Może to samotność albo chęć uwagi.',
      'Nie rób z tego tematu płci/orientacji, chyba że sami to podnoszą — to osobna rozmowa.',
    ],
    ageNotes: {
      younger: 'Aplikacje randkowe są wyraźnie dla dorosłych. Ujmij to jako zasada bezpieczeństwa, nie wstydu.',
      tween: 'Porozmawiaj o podszywaniu się pod inną osobę i wymuszaniu zdjęć intymnych — to zdarza się co tydzień w każdym kraju.',
      teen: 'Porusz luki w weryfikacji wieku. „Te aplikacje kłamią, że są 18+. Dorośli celowo szukają młodych kont."',
    },
    reactions: [
      {
        label: 'Zażenowanie',
        example: 'Czerwoni, chcą skończyć rozmowę.',
        parentResponse:
          '„Ok. Jedno zdanie i kończę: dorośli na tych aplikacjach celowo szukają młodszych kont. Tylko dlatego mi zależy."',
        avoid: 'Przedłużanie niezręczności.',
      },
      {
        label: '„Tylko rozmawiam ze znajomymi"',
        example: 'Twierdzą, że to do socjalizowania, nie randkowania.',
        parentResponse:
          '„Rozumiem. Aplikacje typu Discord czy Snap do tego służą bez problemu z dorosłymi szukającymi nastolatków."',
        avoid: 'Oskarżanie o kłamstwo bez wysłuchania.',
      },
      {
        label: 'Ujawnienie uwodzenia przez dorosłego',
        example: '„Jakaś starsza osoba prosiła mnie o zdjęcia."',
        parentResponse:
          '„Dziękuję, że mi mówisz. Nic złego nie zrobiłeś. Zrobimy zrzuty ekranu wszystkiego i razem zgłosimy — policja / Dyżurnet (PL) / NCMEC (US)."',
        avoid: 'Głośnego panikowania — wewnętrzna panika jest ok.',
      },
      {
        label: 'Zaprzeczenie + wyczyszczenie urządzenia',
        example: 'Później odkrywasz, że aplikacja została ponownie zainstalowana, a historia wyczyszczona.',
        parentResponse:
          '„Widziałem(-am) to znowu. Wolę usłyszeć dlaczego niż udawać. Poszukajmy, jaką potrzebę to wypełnia."',
        avoid: 'Jednorazowe kazanie bez zaadresowania samotności pod spodem.',
      },
    ],
    redFlags: [
      'Tajemniczość wokół jednego konkretnego kontaktu.',
      'Nowe drogie prezenty, których nie kupiłeś.',
      'Nocne pisanie z nieznanym dorosłym.',
      'Presja, żeby spotkać się osobiście „tylko we dwoje".',
      'Jakakolwiek prośba o nagie zdjęcia lub wysłane zdjęcie — zatrzymaj rozmowę, udokumentuj, zgłoś.',
    ],
    followUp: [
      'Włącz systemowe ograniczenia aplikacji na urządzeniu (iOS „Czas przed ekranem" lub Google Family Link), nie tylko blokadę DNS.',
      'Naucz: zrzut ekranu + blokuj + powiedz zaufanej osobie = zawsze bezpieczna reakcja na dziwne wiadomości.',
      'Znaj gdzie zgłosić: Dyżurnet (PL), NCMEC (US), CEOP (UK), lokalna policja — wydział ds. dzieci.',
    ],
  },

  {
    key: 'weapons',
    label: 'Broń',
    icon: '🔫',
    why: 'Ciekawość bronią u nastolatków jest częsta. Problem zaczyna się, gdy z oglądania filmów o strzelaniu przechodzą do szukania „jak zdobyć" lub „jak samemu zrobić".',
    opening:
      '„Zablokowała się strona o broni. Nie zakładam najgorszego — ciekaw(a) jestem, co cię tam zaciekawiło. Film, gra, kolega coś powiedział?"',
    pitfalls: [
      'Nie robi się z dziecka przyszłego sprawcy tylko dlatego, że wchodzi na takie strony. Fascynacja bronią bywa normalnym etapem.',
      'Nie wyśmiewaj — wstyd pcha fascynację do podziemia.',
      'Nie obiecuj „kupimy ci strzelnicę", żeby odwrócić uwagę. Rozmawiaj wprost.',
    ],
    ageNotes: {
      younger: 'Wiele bajek i gier pokazuje broń jako zabawkę. Tłumacz: „W prawdziwym życiu broń zabija. Nie dotyka się, nawet jeśli wygląda na zabawkową."',
      tween: 'To wiek pierwszych filmów „jak rozłożyć pistolet" na YouTube. Zapytaj, czy pomysł pochodzi od kolegów — presja grupy jest kluczowa.',
      teen: 'Porozmawiaj szczerze: „W Polsce broń palna wymaga pozwolenia i psychotestów. Nawet wiatrówka ma ograniczenia wiekowe. Chcesz się nauczyć strzelać legalnie? Pogadajmy o strzelnicy z instruktorem."',
    },
    reactions: [
      {
        label: '„To tylko film / gra"',
        example: 'Bagatelizują — „oglądałem recenzję pistoletu w grze".',
        parentResponse:
          '„Dobra, wierzę. Pokaż mi co konkretnie — zobaczymy razem, czy to kanał o grach, czy już coś innego."',
        avoid: 'Odrzucanie ich wyjaśnienia bez obejrzenia tego, co oglądali.',
      },
      {
        label: 'Fascynacja sprawcami',
        example: 'Wypytują o strzelaniny w szkołach, znają nazwiska napastników.',
        parentResponse:
          '„To mnie niepokoi — nie dlatego, że myślę, że chcesz to zrobić. Dlatego, że chcę zrozumieć, co cię w tym ciągnie. Pogadajmy."',
        avoid: 'Milczenie lub unikanie tematu. Fascynacja sprawcami to sygnał wymagający rozmowy.',
      },
      {
        label: '„Chcę się nauczyć strzelać"',
        example: 'Mówią wprost, że interesuje ich strzelectwo.',
        parentResponse:
          '„To uczciwa prośba. Poszukajmy klubu strzeleckiego, który przyjmuje nastolatków z rodzicem. Lepiej to niż samoukiem z internetu."',
        avoid: 'Automatyczne „nie" bez rozważenia — zepchniesz go do ukradkowego oglądania.',
      },
      {
        label: 'Samemu zrobić broń',
        example: 'Szukają „jak zrobić broń w domu" albo „ghost gun".',
        parentResponse:
          '„Stop. To jest poziom przestępstwa federalnego, nie ciekawostka z internetu. Siadamy i rozmawiamy — co sprawia, że tego szukasz?"',
        avoid: 'Reakcja „a tam, i tak nie zrobi" — to poważny sygnał, potraktuj serio.',
      },
      {
        label: 'Groźby / żartobliwe pogróżki',
        example: '„Jakbym miał broń, to bym rozwalił pół klasy."',
        parentResponse:
          '„Muszę potraktować to, co powiedziałeś, poważnie. Nawet jeśli żartowałeś. Kocham cię — dlatego idziemy teraz porozmawiać z kimś, kto nam pomoże."',
        avoid: 'Śmianie się, przymknięcie oka. Każdą taką wypowiedź traktuj jak prawdziwą.',
      },
    ],
    redFlags: [
      'Fascynacja konkretnymi zamachami, napastnikami, manifestami.',
      'Szukanie „jak zdobyć broń" lub „jak zrobić broń".',
      'Listy osób, które „zasługują".',
      'Połączenie: izolacja społeczna + złość + zainteresowanie bronią = natychmiast profesjonalna pomoc.',
    ],
    followUp: [
      'W domu: zamknij każdą broń (także wiatrówkę, łuk, ostre noże kolekcjonerskie).',
      'Umów wizytę u psychologa — nie jako kara, tylko „chcę, żebyś miał z kim pogadać o trudnych rzeczach".',
      'Rozważ legalne i nadzorowane strzelectwo sportowe, jeśli zainteresowanie jest zdrowe.',
      'W Polsce: w sytuacji realnego zagrożenia — 112 lub lokalny telefon zaufania 116 111.',
    ],
  },

  {
    key: 'cyberbullying_risk',
    label: 'Ryzyko cyberprzemocy',
    icon: '🗯️',
    why: 'Anonimowe pytania i wiadomości (NGL, Tellonym, Ask.fm) są projektowane tak, żeby ludzie pisali to, czego nie powiedzieliby w twarz. Nastolatki odbierają to osobiście — czasami tragicznie.',
    opening:
      '„Widziałem(-am), że korzystałeś z aplikacji, gdzie ludzie piszą anonimowo. Nie po to, żeby ci zabrać — chcę wiedzieć, czy ktoś cię tam dręczy."',
    pitfalls: [
      'Nie mów „po prostu wyłącz". Dla nastolatka to jego świat społeczny.',
      'Nie czytaj wiadomości bez jego wiedzy — stracisz zaufanie.',
      'Nie bagatelizuj — słowa w internecie bolą tak samo jak w klasie, czasem bardziej, bo są trwałe.',
    ],
    ageNotes: {
      younger: 'Wytłumacz prosto: „Są aplikacje, w których ludzie mogą pisać wredne rzeczy i nie wiesz, kto to napisał. Jeśli ktoś cię tam rani, od razu powiedz."',
      tween: 'To najtrudniejszy wiek. Zapytaj wprost: „Czy ktoś kiedykolwiek napisał ci coś, po czym nie chciałeś iść do szkoły?"',
      teen: 'Rozmawiaj o tym, że anonimowe pytania to często ich własna grupa znajomych, nie obcy. Zdrada boli najbardziej.',
    },
    reactions: [
      {
        label: 'Bagatelizowanie',
        example: '„Eee, nikt tego nie czyta na poważnie."',
        parentResponse:
          '„Może. A jednak to zaprojektowane tak, żebyś czytał. Pamiętasz, żebym nie sprawdzała twoich czatów — możesz sam mi powiedzieć, jak to naprawdę odbierasz?"',
        avoid: 'Wmawianie, że to bolesne, skoro mówi, że nie. Zaufaj, że może wrócić do rozmowy.',
      },
      {
        label: 'Przyznanie — „dostaję hejt"',
        example: '„Jeden anonim od dwóch tygodni pisze, że jestem brzydki."',
        parentResponse:
          '„Dziękuję, że mi powiedziałeś. Zapiszmy zrzuty ekranu. Nie dlatego, żeby go od razu ścigać — ale żeby mieć na wypadek, gdyby się nasiliło. I pogadajmy: kogo podejrzewasz?"',
        avoid: 'Natychmiastowa reakcja „idę do szkoły rozmawiać" bez jego zgody — poczuje się zdradzony.',
      },
      {
        label: 'Samoobwinianie',
        example: '„Może miał rację, coś ze mną jest nie tak."',
        parentResponse:
          '„Stop. To jest celowa sztuczka — napisali coś, w co zaczynasz wierzyć. To nie jest prawda o tobie. Pokażę ci kilka osób, które to przeszły, i dlaczego to nie twoja wina."',
        avoid: 'Lekceważące „nie wymyślaj" — potwierdzasz nadawcy, że trafił.',
      },
      {
        label: 'Złość / odwet',
        example: '„Dowiem się, kto to, i zniszczę go."',
        parentResponse:
          '„Rozumiem. Wkurza mnie to tak samo. Ale zemsta nakręci spiralę. Mam lepszy pomysł — pokażę ci, jak zgłosić i zablokować, a my pomyślimy, czy to sprawa dla szkoły."',
        avoid: 'Wspieranie planów zemsty. Dziecko traci kontrolę, ty masz ją zachować.',
      },
      {
        label: 'Wycofanie / milczenie',
        example: 'Nie chce jeść, nie idzie do szkoły, nie patrzy w oczy.',
        parentResponse:
          '„Widzę, że coś jest nie tak. Nie muszę wiedzieć dzisiaj. Ale jutro siądziemy. A do tego czasu telefon zostaje obok ciebie — obiecaj, że mnie obudzisz, jeśli będzie ci ciężko."',
        avoid: 'Zostawianie dziecka samego ze swoim milczeniem przez kilka dni.',
      },
    ],
    redFlags: [
      'Nagła zmiana relacji z konkretną grupą znajomych.',
      'Unikanie szkoły, bóle brzucha/głowy przed wyjściem z domu.',
      'Usuwanie wszystkich zdjęć z sieci społecznościowych.',
      'Wzmianki o „nie warto żyć" lub „i tak wszyscy mnie nienawidzą" — traktuj serio.',
    ],
    followUp: [
      'Razem zgłoście konto/wiadomość w aplikacji i zablokujcie.',
      'Jeśli to uczniowie szkoły — decyzja o rozmowie z wychowawcą zawsze razem z dzieckiem, nie za jego plecami.',
      'Telefon Zaufania dla Dzieci i Młodzieży (116 111) — zapiszcie razem w kontaktach.',
      'Rozważ terapię — cyberprzemoc zostawia podobne ślady jak mobbing w pracy.',
    ],
  },

  {
    key: 'proxy_vpn',
    label: 'VPN i proxy',
    icon: '🕵️',
    why: 'Próba obejścia blokad to sygnał, nie zbrodnia. Dzieciak uczy się myśleć niezależnie — problem w tym, że VPN daje też dostęp do wszystkiego, przed czym chroniłaś rodzinę.',
    opening:
      '„Widzę, że próbowałeś zainstalować VPN. Nie jestem wściekła — ciekawa jestem, co konkretnie chciałeś obejrzeć lub do czego się dostać. Zgadnę: coś, co ci blokuję?"',
    pitfalls: [
      'Nie udawaj, że VPN to narzędzie hakerów. Korzystasz z niego w pracy — bądź uczciwa.',
      'Nie zaostrzaj kar — dziecko zainstaluje lepszy VPN następnym razem.',
      'Nie ignoruj — jeden udany VPN oznacza, że cała blokada DNS jest pomijana.',
    ],
    ageNotes: {
      younger: 'Za wcześnie, żeby rozumiał technicznie. Wystarczy: „Ta aplikacja omija to, co w naszym domu uzgodniliśmy, że oglądamy. Proszę jej nie instaluj bez mojej wiedzy."',
      tween: 'Tłumacz: „VPN to jak przełączanie kanałów przez inny kraj. Legalne, ale u nas w domu używamy zasad, które wspólnie ustaliliśmy."',
      teen: 'Rozmawiaj na równym poziomie: „Wiem, że wiesz, jak to działa. Zamiast wyścigu zbrojeń — powiedz, co chcesz odblokować, i zdecydujemy razem."',
    },
    reactions: [
      {
        label: '„To do prywatności"',
        example: 'Przytaczają argumenty o „prawie do prywatności w internecie".',
        parentResponse:
          '„Prywatność jest ważna, zgoda. Ale tutaj chodzi o obejście zasad, które razem ustaliliśmy. To dwie różne rzeczy. Zacznijmy od tego, co chcesz tak naprawdę zobaczyć."',
        avoid: 'Pouczanie „jeszcze nie masz prywatności". Masz — ale nie ma wolności obchodzenia umów.',
      },
      {
        label: '„Wszyscy mają VPN"',
        example: 'Powołują się na kolegów.',
        parentResponse:
          '„Możliwe. A jednak u nas umawialiśmy się inaczej. Chcesz przekonać mnie do zmiany zasad? Daj konkretne powody — posłucham."',
        avoid: 'Wchodzenie w argument „pokaż mi kto".',
      },
      {
        label: 'Przyznanie konkretnej potrzeby',
        example: '„Chciałem obejrzeć serial niedostępny w Polsce."',
        parentResponse:
          '„Dzięki za szczerość. Sprawdźmy razem, czy ten serial jest legalnie dostępny gdzie indziej — albo ustalmy, pod jakim warunkiem mogę się zgodzić."',
        avoid: 'Odmowa bez rozmowy — stracisz okazję do kompromisu.',
      },
      {
        label: 'Złość na kontrolę',
        example: '„Nie ufasz mi, szpiegujesz mnie!"',
        parentResponse:
          '„Ufam ci. Ale moim zadaniem nie jest zaufać ślepo — tylko pomóc ci nauczyć się granic, żebyś sam je ustawiał za parę lat. Porozmawiajmy o tym, ile kontroli jest dla ciebie okej."',
        avoid: 'Obronna reakcja „bo tak" lub „bo jestem rodzicem".',
      },
      {
        label: 'Potajemna instalacja',
        example: 'Znajdujesz zainstalowany VPN, mimo wcześniejszych rozmów.',
        parentResponse:
          '„Widzę, że zainstalowałeś ponownie. Nie rozmawiamy już o VPN — rozmawiamy o tym, że kłamiesz. To mnie boli bardziej niż aplikacja."',
        avoid: 'Kara za VPN bez odniesienia się do złamanej umowy.',
      },
    ],
    redFlags: [
      'VPN używany łącznie z jedną aplikacją komunikacyjną — może wskazywać na konkretną ukrywaną rozmowę.',
      'Regularne kasowanie historii przeglądarki.',
      'Zarządzanie kilkoma kontami e-mail/Apple ID/Google, o których nie wiesz.',
    ],
    followUp: [
      'Włącz „Screen Time" (iOS) lub Family Link (Android) — blokada instalowania aplikacji bez zgody.',
      'Porozmawiajcie o jednej rzeczy do odblokowania — negocjacja zamiast wyścigu.',
      'Sprawdźcie wspólnie, dlaczego dana strona była zablokowana — może niepotrzebnie.',
    ],
  },

  {
    key: 'dark_web',
    label: 'Dark web i Tor',
    icon: '🕳️',
    why: 'W 99% przypadków zainteresowanie dark webem to popkultura i ciekawość. Pozostały 1% to realne ryzyko — od zakupów substancji, po treści, których nie da się odzobaczyć.',
    opening:
      '„Widziałem(-am), że próbowałeś wejść na Tor. Nie robię z tego afery, ale pogadajmy. Co cię w tym pociąga?"',
    pitfalls: [
      'Nie rób z tego thrillera — dziecko dostanie dokładnie to, czego nie chcesz: ekscytację tajemnicą.',
      'Nie bagatelizuj — „to tylko ciekawość" bywa punktem wyjścia.',
      'Nie blokuj bez rozmowy — następnym krokiem jest nauka, jak blokadę obejść.',
    ],
    ageNotes: {
      younger: 'Nie wchodź w techniczne szczegóły. Wystarczy: „Są miejsca w internecie, gdzie ludzie sprzedają niebezpieczne rzeczy, takie jak narkotyki. To nie dla ciebie."',
      tween: 'Tłumacz spokojnie: „Tor to przeglądarka, która ukrywa, kto z niej korzysta. Sama w sobie nie jest zła — ale 80% rzeczy tam to rynek przestępstw."',
      teen: 'Rozmawiaj z szacunkiem dla inteligencji: „Jeśli naprawdę interesuje cię prywatność online, są bezpieczniejsze drogi. Obejrzyjmy razem dokument o tym, co się tam dzieje — wtedy zdecydujesz."',
    },
    reactions: [
      {
        label: 'Cyberbezpieczeństwo',
        example: '„Uczę się hakingu / etycznego hackingu."',
        parentResponse:
          '„Super temat. Znam kilka legalnych dróg — CTF-y, kursy HackerOne, platforma TryHackMe. Umówimy się: zero Tora, za to realny kurs. Brzmi?"',
        avoid: 'Zbycie pasji — informatyczne bezpieczeństwo to świetna kariera.',
      },
      {
        label: 'Ciekawość po filmie',
        example: '„Oglądałem serial, chciałem sprawdzić, jak to wygląda."',
        parentResponse:
          '„Spoko. Pokażę ci dokument, w którym dziennikarz opisuje, co tam znalazł — bez wchodzenia na żywo. Zaoszczędzisz sobie kilku obrazów, które zostają na lata."',
        avoid: 'Wizualizowanie „to tak straszne, że nie dasz rady". Wyzwanie aktywuje mózg nastolatka.',
      },
      {
        label: 'Zakupy',
        example: 'Wyraźne sygnały, że szuka substancji lub nielegalnych towarów.',
        parentResponse:
          '„Stop. To jest granica, której nie przekraczamy. Musisz wiedzieć: jeśli coś kupisz i wyjdzie — będziesz miał sprawę karną przed osiemnastką. Gadajmy teraz."',
        avoid: 'Oskarżenia bez danych. Jeśli podejrzewasz — zapytaj wprost, nie domyślaj się.',
      },
      {
        label: 'Pokazywanie kolegom',
        example: 'Używa Tora jako „fajnej sztuczki" dla znajomych.',
        parentResponse:
          '„Rozumiem — wygląda super. Problem: jeśli któryś z was kliknie w złe miejsce, ktoś inny będzie mógł mieć twój adres lub zobaczyć coś, czego nie powinien. Znajdźmy lepszy sposób na imponowanie."',
        avoid: 'Przewidywanie najgorszego („zostaniesz aresztowany"). Zamiast tego — konkretny skutek.',
      },
      {
        label: 'Zaprzeczanie',
        example: '„To nie ja, to na pewno aktualizacja."',
        parentResponse:
          '„Pokazuję ci dokładnie, co widziałam i kiedy. Nie oskarżam — proszę o rozmowę. Wolę wiedzieć, niż sobie dopowiadać."',
        avoid: 'Przyjmowanie odpowiedzi „to nie ja" bez rozmowy. Jeśli to nie on — pojawi się znowu.',
      },
    ],
    redFlags: [
      'Zakup portfela kryptowalutowego w połączeniu z Torem.',
      'Konkretne zapytania o „jak kupić [substancja]" lub „jak dostać [towar]".',
      'Izolacja po sesji na Torze — może oznaczać, że zobaczył coś traumatycznego.',
      'Fascynacja manifestami, dokumentami typu „jak zrobić" rzeczy groźne.',
    ],
    followUp: [
      'Zablokuj instalację nowych przeglądarek (iOS: Restrictions; Android: Family Link).',
      'Zaproponuj legalną alternatywę dla prywatności: Brave, ProtonMail, Signal — jeśli to ich cel.',
      'Rozmawiaj o tym raz w miesiącu przez kwartał — temat nie znika po jednej rozmowie.',
      'Jeśli widział coś drastycznego — wizyta u psychologa, obrazy z dark webu zostawiają ślad.',
    ],
  },

  {
    key: 'piracy',
    label: 'Piractwo',
    icon: '🏴‍☠️',
    why: 'Serial, gra, podręcznik — dla dziecka „za darmo z internetu" to naturalny odruch. Problem: strony pirackie to 90% wirusów, fałszywych faktur i kradzieży danych.',
    opening:
      '„Zablokowała się strona z filmami za darmo. Nie zamierzam udawać, że nikt tego nie robi. Ale pogadajmy, dlaczego to nie najlepszy pomysł."',
    pitfalls: [
      'Nie moralizuj „kradniesz artystom". Dziecko odpowie, że Netflix ich zarabia miliardy — i częściowo ma rację.',
      'Nie udawaj, że sam nigdy nie pobrałeś filmu. Bądź uczciwy wobec własnych nawyków.',
      'Nie zaczynaj od argumentu prawnego — zacznij od bezpieczeństwa urządzenia.',
    ],
    ageNotes: {
      younger: 'Krótka zasada: „Nie klikamy w «za darmo» bez pytania. Tam często są wirusy."',
      tween: 'Tłumacz konkretnie: „Strony z piratami zarabiają na reklamach, które instalują wirusy. To nie paranoja — to model biznesowy."',
      teen: 'Porozmawiaj z szacunkiem: „Wiem, że Spotify czy Netflix mogą być drogie. Usiądźmy — sprawdźmy, co faktycznie oglądasz, i czy warto za to zapłacić."',
    },
    reactions: [
      {
        label: 'Pragmatyzm',
        example: '„Nie stać mnie na wszystkie subskrypcje."',
        parentResponse:
          '„Spoko, uczciwy argument. Pokażę ci bibliotekę miejską — mają filmy, książki, gry, często za darmo. I jedną subskrypcję wybierzesz — rozliczymy to z kieszonkowego."',
        avoid: 'Przepisywanie odpowiedzialności na dziecko („nie masz pieniędzy — twój problem").',
      },
      {
        label: '„Wszyscy to robią"',
        example: 'Lista argumentów o kolegach z klasy.',
        parentResponse:
          '„Część pewnie tak. Nadal nie chcę, żeby na naszym routerze pojawiały się wirusy. Wybierzmy jedno źródło legalne i dopilnujemy."',
        avoid: 'Dyskredytowanie kolegów („ich rodzice nie kontrolują").',
      },
      {
        label: 'Podręczniki do szkoły',
        example: 'Ściąga pirackie pdf-y, bo „nie ma innej opcji".',
        parentResponse:
          '„To częsty problem. Sprawdźmy biblioteki cyfrowe szkoły i Z-Library ma legalną alternatywę, Open Library. Pokażę ci, jak z nich korzystać."',
        avoid: 'Udawanie, że podręczniki są tanie. Nie są — dziecko widzi to lepiej niż my.',
      },
      {
        label: 'Złośliwe oprogramowanie',
        example: 'Komputer zwalnia, wyskakują reklamy, „ktoś zmienił mi hasło na TikToku".',
        parentResponse:
          '„Masz złośliwe oprogramowanie. Nic nie klikaj, żadnych „naprawiaczy z internetu". Siadamy razem — restart, skanowanie, zmiana haseł. Nie jesteś pierwszy."',
        avoid: 'Karanie za fakt złapania wirusa. Lepiej przejść przez naprawę razem.',
      },
      {
        label: 'Wstyd',
        example: 'Unikają tematu, bo „wiedzą, że to nielegalne".',
        parentResponse:
          '„Nie jesteś przestępcą. Jesteś nastolatkiem, który chciał obejrzeć serial. Dzięki za szczerość. Zróbmy dwie rzeczy: sprawdźmy, czy coś się zainfekowało, i znajdźmy sposób, żebyś mógł to oglądać bezpiecznie."',
        avoid: 'Używanie wstydu jako dźwigni. Pogłębi tylko ukrywanie.',
      },
    ],
    redFlags: [
      'Komputer wysyła ogromne ilości danych w nocy (możliwy bot w sieci domowej).',
      'Konta bankowe rodziców zaczynają mieć „małe, dziwne" opłaty — karta mogła być ukradziona.',
      'Dziecko zaczyna sprzedawać „tanio" gry/konta w grupach — możliwe, że zostało wciągnięte w obrót.',
    ],
    followUp: [
      'Razem wybierzcie jedną legalną subskrypcję w budżecie.',
      'Zainstaluj bezpłatny skaner antywirusowy i zrób pełny skan.',
      'Zmieńcie hasła do ważnych kont — bank, poczta, Apple ID / Google.',
      'Podpowiedz: biblioteki publiczne, projekt Wolne Lektury, Netflix na bibliotece, legalne kanały YouTube.',
    ],
  },

  {
    key: 'crypto_risky',
    label: 'Ryzykowne kryptowaluty',
    icon: '📉',
    why: 'Filmy „kup tokena, zostań milionerem" są zaprojektowane jak ADHD w pigułce: krótkie, hype, podbijane algorytmem. Nastolatki tracą oszczędności szybciej, niż dorośli w hazardzie.',
    opening:
      '„Widzę, że sprawdzałeś strony o kryptowalutach. Nie zakazuję — chcę zrozumieć. Chcesz inwestować, zarabiać, czy tylko ciekawość?"',
    pitfalls: [
      'Nie udawaj, że kryptowaluty nie istnieją. Kolega w klasie już „zarobił" i mówi o tym codziennie.',
      'Nie zrównuj wszystkiego z oszustwem — są legalne giełdy i są memowe tokeny z reklam TikToka. To nie to samo.',
      'Nie mów „jak stracisz — twoja sprawa". Strata pierwszych 500 zł w wieku 14 lat buduje traumę finansową na lata.',
    ],
    ageNotes: {
      younger: 'Mało prawdopodobne, że dziecko poniżej 10 lat ogląda crypto. Jeśli jednak: „To jak zabawa w kupowanie monopolowych pieniędzy — tylko że te pieniądze są prawdziwe."',
      tween: 'Pokaż realny wykres wybranego memecoina — pomp i -95%. „To jest to, co pokazują influencerzy jako sukces."',
      teen: 'Rozmawiaj jak z dorosłym: „Inwestowanie to nie hazard, jeśli znasz matematykę. Opowiem ci o procencie składanym, ETF-ach i o tym, dlaczego pump.fun to inna liga."',
    },
    reactions: [
      {
        label: '„Znajomy zarobił"',
        example: 'Historia o koledze, który „zrobił 10x".',
        parentResponse:
          '„Może naprawdę. Zapytaj go, ile stracił wcześniej i ile na tym zaraz straci. Ludzie chwalą się wygranymi, nie całym saldem."',
        avoid: 'Nazywanie kolegi kłamcą. Prawdopodobnie ON wierzy w swoją historię.',
      },
      {
        label: 'Chce zacząć inwestować',
        example: '„Mam 500 zł z komunii, chcę kupić Solanę."',
        parentResponse:
          '„Spoko, porozmawiajmy. 10% tej kwoty możesz przeznaczyć na naukę — kupimy razem, dopiszesz do excela, obserwujemy rok. Pozostałe 90% idzie na konto oszczędnościowe — to jest dla ciebie bezpieczna baza."',
        avoid: 'Kategoryczne „nie". Lepiej naucz w kontrolowanych warunkach.',
      },
      {
        label: 'Stracił pieniądze',
        example: 'Przychodzi ze wstydem — „straciłem 800 zł".',
        parentResponse:
          '„Przykro mi. To drogi, ale prawdziwy kurs ekonomii. Usiądź — rozłożymy, co się stało, żebyś wiedział, co zrobić inaczej. Nie płacę za ciebie, ale nauczymy się razem."',
        avoid: 'Pokrywanie straty bez rozmowy. Zyska lekcję „rodzice mnie wyciągną" zamiast lekcji z ryzyka.',
      },
      {
        label: 'Pump & dump / memecoiny',
        example: 'Wchodzi na strony typu pump.fun, kupuje tokeny z reklam.',
        parentResponse:
          '„Chcę, żebyś wiedział: tam zarabia się na ludziach takich jak ty. Twórcy tokenu sprzedają ci coś, co za 3 dni będzie warte zero. Umowa — pokaż mi każdą kolejną, zanim kupisz."',
        avoid: 'Ban na wszystkie krypto. Umiesz zakazać — nie umiesz go nauczyć odróżniać.',
      },
      {
        label: 'Oszustwo',
        example: 'Ktoś w sieci „pomaga" z inwestycją, prosi o przelew na nieznane konto.',
        parentResponse:
          '„Stop. To oszustwo, nie inwestycja. Teraz: nic więcej nie wysyłasz, blokujemy osobę, zgłaszamy do banku i na policji. Nie jesteś głupi — oni są profesjonalistami od oszukiwania."',
        avoid: 'Krzyk i pretensje. Ofiara już ma wstyd, twój krzyk go pogłębi.',
      },
    ],
    redFlags: [
      'Wielogodzinne oglądanie „trading TikToków" z kołataniem serca / wstawaniem w nocy.',
      'Sprzedawanie rzeczy, żeby dorzucić do „inwestycji".',
      'Wzięcie pożyczki (od kolegi, rodzeństwa, z aplikacji) na krypto.',
      'Kontakt z nieznajomą osobą, która „uczy tradingu".',
    ],
    followUp: [
      'Ustalcie tygodniowy limit kwotowy, którym może operować.',
      'Otwórzcie razem rachunek oszczędnościowy ze stopą procentową — zobaczy, że banki dają 5%, nie „100x w tydzień".',
      'Polećcie książkę: „Bogaty ojciec, biedny ojciec" lub kanał Marcina Iwucia — trochę realizmu.',
      'Jeśli już jest poważna strata — nie ukrywaj przed drugim rodzicem, to rodzinna sprawa.',
    ],
  },

  {
    key: 'scam_phishing',
    label: 'Oszustwa i phishing',
    icon: '🎣',
    why: '„Darmowe robuxy, V-Bucksy, Nitro" — to najpopularniejsza przynęta na dzieciaki w Polsce. Tracą nie tylko konta, ale też zapisane karty rodziców.',
    opening:
      '„Zablokowała się strona z „darmowymi" Robuxami. Nie ściągam na ciebie alarmu — ale chcę, żebyś wiedziała, jak to działa. Okej?"',
    pitfalls: [
      'Nie mów „jesteś za mądry, żeby się nabrać". Te strony działają, bo celują w emocje, nie w logikę.',
      'Nie wyśmiewaj po fakcie. Wstyd zamyka rozmowę na następne próby oszustw.',
      'Nie ignoruj sygnału — jeśli raz kliknął w takie coś, prawdopodobnie kliknie znowu.',
    ],
    ageNotes: {
      younger: 'Prosto: „Nikt w internecie nie daje niczego za darmo. Jeśli ktoś obiecuje — to chce czegoś od ciebie. Zawsze pokaż mi, zanim klikniesz."',
      tween: 'Pokaż konkretnie: „Zobacz, to wygląda jak strona Microsoftu. A w pasku adresu jest „rnicrosoft" — z małym r i n, nie m. Tak to wygląda."',
      teen: 'Rozmawiaj jak z dorosłym: „Oszuści nie idą po głupich — idą po szybkich. Zmęczony, w pośpiechu, emocjonalny. Dlatego najlepsza zasada to zawsze spowolnić przed kliknięciem."',
    },
    reactions: [
      {
        label: '„Wiem, że to oszustwo"',
        example: 'Udaje eksperta: „tylko sprawdzałem, jak to wygląda".',
        parentResponse:
          '„Spoko. To pokaż mi, po czym poznałeś — chcę się upewnić, że znasz znaki. Bo następna przynęta będzie lepiej zrobiona."',
        avoid: 'Założenie, że zna się od razu. Test wiedzy to lepszy sposób niż domysł.',
      },
      {
        label: 'Kliknął i wstyd mu',
        example: 'Przyznaje się po fakcie — „podałem login, bo obiecali Robuxy".',
        parentResponse:
          '„Dziękuję, że mówisz. Teraz, szybko: zmieniamy hasło, włączamy dwuskładnikowe, sprawdzamy, co zniknęło. Spokojnie — to się zdarza dorosłym też."',
        avoid: 'Kazanie w stylu „mówiłem ci". Priorytet to zminimalizować szkodę, nie wyładować frustrację.',
      },
      {
        label: 'Karta rodzica zniknęła',
        example: 'W aplikacji gry pojawiła się twoja karta i są zakupy, których nie robiłaś.',
        parentResponse:
          '„Nie jesteś w kłopocie za to, że zaufałeś. Jesteś w rozmowie o tym, jak to się stało i co robimy dalej. Dzwonię do banku, a my razem piszemy zgłoszenie."',
        avoid: 'Obarczanie dziecka odpowiedzialnością finansową. To system nie miał blokad.',
      },
      {
        label: 'Zaprzeczenie',
        example: '„Nie kliknąłem, to aplikacja sama."',
        parentResponse:
          '„Pokazuję ci, że coś zostało zainstalowane. Nie wchodzę w „kto winny" — ważne, żebyśmy to naprawili. Może to była zmyłka, może nie — sprawdzimy."',
        avoid: 'Przesłuchanie w stylu „dopóki nie przyznasz się". Zrób naprawę, potem rozmowę.',
      },
      {
        label: 'Koleżanka została okradziona',
        example: 'Opowiada o przyjaciółce, która straciła konto / pieniądze.',
        parentResponse:
          '„Ojej. Dobrze, że wiesz. Zapytaj ją, czy rodzice już wiedzą — ważne, żeby zablokowali kartę, jeśli w grę wchodziły płatności. Możesz jej pomóc — oto kilka konkretów."',
        avoid: 'Zbycie tematu. To okazja, żeby dziecko nauczyło się reagować, zanim samo trafi.',
      },
    ],
    redFlags: [
      'Dziwne SMS-y od „kuriera" / „banku" / „Netflixa" z linkiem.',
      'Dziecko szuka sposobu na „darmowe rzeczy w internecie" — to wzorzec, nie przypadek.',
      'Zmieniona metoda płatności w sklepie App Store/Google Play.',
      'Kontakt w aplikacjach gry z obcymi, którzy „dają skrzynki" albo „pomagają w tradingu".',
    ],
    followUp: [
      'Włącz na każdym koncie dwuskładnikowe uwierzytelnianie (2FA) — tam, gdzie można.',
      'Usuń zapisaną kartę z kont gier/appstore — zakupy zawsze z pytaniem o hasło.',
      'Jeśli podał dane banku / doszło do przelewu — zgłoś na policję (CBZC — Centralne Biuro Zwalczania Cyberprzestępczości) i do banku.',
      'Zapisz razem zasadę: „Linka nigdy z SMS-a — zawsze wchodzę ręcznie na stronę."',
    ],
  },
]
