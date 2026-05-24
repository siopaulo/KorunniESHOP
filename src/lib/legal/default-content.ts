import { LEGAL_OPERATOR as O } from "@/lib/legal/operator";

export const LEGAL_SLUGS = {
  terms: "terms",
  privacy: "privacy",
  cookies: "cookies",
  returns: "returns",
  withdrawal: "withdrawal",
} as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[keyof typeof LEGAL_SLUGS];

export const LEGAL_ROUTE_MAP: Record<LegalSlug, string> = {
  terms: "/obchodni-podminky",
  privacy: "/ochrana-osobnich-udaju",
  cookies: "/cookies",
  returns: "/reklamacni-rad",
  withdrawal: "/odstoupeni-od-smlouvy",
};

export const LEGAL_PAGE_LABELS: Record<LegalSlug, string> = {
  terms: "Obchodní podmínky",
  privacy: "Ochrana osobních údajů",
  cookies: "Zásady cookies",
  returns: "Reklamační řád",
  withdrawal: "Odstoupení od smlouvy",
};

export function getDefaultLegalContent(slug: LegalSlug): { title: string; content: string } {
  const pages: Record<LegalSlug, { title: string; content: string }> = {
    terms: {
      title: LEGAL_PAGE_LABELS.terms,
      content: TERMS_CONTENT,
    },
    privacy: {
      title: LEGAL_PAGE_LABELS.privacy,
      content: PRIVACY_CONTENT,
    },
    cookies: {
      title: LEGAL_PAGE_LABELS.cookies,
      content: COOKIES_CONTENT,
    },
    returns: {
      title: LEGAL_PAGE_LABELS.returns,
      content: RETURNS_CONTENT,
    },
    withdrawal: {
      title: LEGAL_PAGE_LABELS.withdrawal,
      content: WITHDRAWAL_CONTENT,
    },
  };
  return pages[slug];
}

const TERMS_CONTENT = `1. Základní ustanovení

1.1. Tyto obchodní podmínky (dále jen „Obchodní podmínky") upravují vztahy mezi prodávajícím a kupujícím při prodeji zboží prostřednictvím internetového obchodu ${O.shopName} (dále jen „e-shop") dostupného na adrese uvedené v kontaktech e-shopu.

1.2. Prodávajícím je ${O.operator}, IČO: ${O.ico}, se sídlem / místem podnikání: ${O.address}, e-mail: ${O.email}, telefon: ${O.phone} (dále jen „prodávající").

1.3. E-shop ${O.shopName} nabízí ručně vyráběné bylinné produkty (mýdla, šampony, masti, elixíry a související sortiment). Značka vychází z lokality ${O.locality}.

1.4. Kontaktní údaje prodávajícího pro komunikaci s kupujícím jsou uvedeny v e-shopu v sekci Kontakt a v těchto Obchodních podmínkách.

2. Definice

2.1. Kupujícím je fyzická nebo právnická osoba, která prostřednictvím e-shopu uzavírá kupní smlouvu s prodávajícím.

2.2. Spotřebitelem je kupující, který mimo rámec své podnikatelské činnosti nebo samostatného výkonu povolání uzavírá smlouvu s prodávajícím.

2.3. Zbožím jsou produkty nabízené v e-shopu včetně příslušenství a obalu, pokud není uvedeno jinak.

3. Objednávka a uzavření kupní smlouvy

3.1. Prezentace zboží v e-shopu je informativní. Prodávající není povinen uzavřít kupní smlouvu ohledně zboží, které již není skladem.

3.2. Objednávku kupující zadává prostřednictvím nákupního košíku a pokladny. Před odesláním objednávky je kupující povinen zkontrolovat správnost údajů, obsah košíku, cenu včetně dopravy a zvolený způsob platby.

3.3. Odesláním objednávky s tlačítkem „Objednat a zaplatit" (nebo „Objednávka zavazující k platbě") kupující potvrzuje, že se seznámil s těmito Obchodními podmínkami a souhlasí s nimi, a že je seznámil se zpracováním osobních údajů dle zásad ochrany osobních údajů.

3.4. Objednávka je návrhem kupní smlouvy. Kupní smlouva je uzavřena okamžikem potvrzení objednávky prodávajícím e-mailem nebo okamžikem úspěšného zaplacení objednávky, podle toho, co nastane dříve.

3.5. Prodávající je oprávněn objednávku odmítnout nebo zrušit zejména v případě chybně uvedené ceny, nedostupnosti zboží nebo podezření na zneužití e-shopu.

4. Ceny a DPH

4.1. Veškeré ceny zboží v e-shopu jsou uvedeny v českých korunách (CZK).

4.2. Prodávající je ${O.vatPayer}. Pokud je prodávající plátcem DPH, ceny jsou uvedeny včetně DPH, pokud není u konkrétního produktu uvedeno jinak. Pokud prodávající není plátcem DPH, ceny neobsahují DPH a prodávající není oprávněn DPH účtovat.

4.3. Slevy a akční ceny: pokud je u produktu zobrazena sleva, prodávající současně zobrazuje nejnižší cenu, za kterou produkt nabízel v období 30 dnů před poskytnutím slevy, pokud je tato povinnost na prodávajícího kladena.

5. Platební metody

5.1. Platbu lze provést způsoby uvedenými v pokladně e-shopu, zejména:
- platební kartou prostřednictvím platební brány Stripe (po aktivaci),
- bankovním převodem na účet prodávajícího ${O.bankAccount} (pokud je tato možnost v e-shopu aktivní),
- dalšími platebními metodami (např. GoPay), pokud jsou v e-shopu zobrazeny jako dostupné.

5.2. Zboží zůstává ve vlastnictví prodávajícího do úplného zaplacení kupní ceny, není-li dohodnuto jinak.

6. Doprava a dodání zboží

6.1. Náklady na dopru jsou uvedeny v pokladně před odesláním objednávky. Při dosažení hodnoty objednávky stanovené v e-shopu může být doprava poskytnuta zdarma.

6.2. Zboží dodává prodávající prostřednictvím smluvního dopravce (např. Zásilkovna, PPL, Česká pošta — konkrétní dopravce bude uveden v pokladně po aktivaci integrace).

6.3. Dodací lhůta obvykle činí 2–5 pracovních dnů od přijetí platby nebo potvrzení objednávky, pokud není u produktu uvedeno jinak. Prodávající informuje kupujícího o prodlení.

6.4. Nebezpečí škody na věci přechází na kupujícího okamžikem převzetí zboží od dopravce nebo při osobním odběru.

7. Odstoupení od smlouvy (spotřebitel)

7.1. Spotřebitel má právo odstoupit od kupní smlouvy bez udání důvodu ve lhůtě 14 dnů ode dne převzetí zboží.

7.2. Podrobnosti, postup odstoupení a vzorový formulář jsou uvedeny na stránce Odstoupení od smlouvy: ${LEGAL_ROUTE_MAP.withdrawal}.

7.3. Odstoupení nelze uplatnit u zboží, které bylo po dodání nenávratně smíseno s jiným zbožím, u zboží v ochranném obalu, které spotřebitel z obalu vyňal a z hygienických důvodů jej nelze vrátit (např. otevřené kosmetické produkty, masti, šampony), a u dalších výjimek stanovených zákonem.

8. Reklamace a odpovědnost za vady

8.1. Prodávající odpovídá kupujícímu, že zboží při převzetí nemá vady. Reklamace se řídí reklamačním řádem dostupným na ${LEGAL_ROUTE_MAP.returns}.

8.2. Práva z vadného plnění u spotřebitele se řídí občanským zákoníkem.

9. Mimosoudní řešení sporů

9.1. Spotřebitel může podat návrh na mimosoudní řešení sporu určenému subjektu mimosoudního řešení spotřebitelských sporů, kterým je Česká obchodní inspekce (www.coi.cz).

9.2. Spory lze řešit také prostřednictvím platformy ODR Evropské komise: https://ec.europa.eu/consumers/odr

10. Ochrana osobních údajů

10.1. Zpracování osobních údajů se řídí zásadami ochrany osobních údajů dostupnými na ${LEGAL_ROUTE_MAP.privacy}.

11. Závěrečná ustanovení

11.1. Tyto Obchodní podmínky jsou účinné ode dne zveřejnění v e-shopu.

11.2. Prodávající je oprávněn Obchodní podmínky měnit. Pro již uzavřené smlouvy platí verze účinná v okamžiku odeslání objednávky.

11.3. Práva a povinnosti neupravené těmito Obchodními podmínkami se řídí právním řádem České republiky, zejména občanským zákoníkem a zákonem o ochraně spotřebitele.`;

const RETURNS_CONTENT = `1. Úvod

1.1. Tento reklamační řád upravuje postup uplatnění práv z vadného plnění při nákupu zboží v e-shopu ${O.shopName} provozovaném ${O.operator}, IČO ${O.ico}, ${O.address}.

2. Kdo reklamaci vyřizuje

2.1. Reklamaci vyřizuje prodávající na kontaktních údajích:
- e-mail: ${O.email}
- telefon: ${O.phone}
- adresa pro zaslání reklamovaného zboží: ${O.address}

3. Jak reklamaci uplatnit

3.1. Reklamaci uplatněte bez zbytečného odkladu po zjištění vady, nejpozději do 24 měsíců od převzetí zboží (u spotřebitele), pokud nejste podnikatel.

3.2. Reklamaci můžete uplatnit:
- e-mailem na ${O.email},
- písemně na adresu ${O.address},
- prostřednictvím kontaktního formuláře na webu v sekci Kontakt.

3.3. Doporučujeme uvést:
- jméno a kontakt (e-mail, telefon),
- číslo objednávky,
- popis vady a kdy byla zjištěna,
- fotodokumentaci vady a obalu (pokud je to vhodné),
- požadovaný způsob vyřízení (oprava, výměna, sleva, odstoupení).

4. Potvrzení přijetí reklamace

4.1. Prodávající potvrdí přijetí reklamace bez zbytečného odkladu, nejpozději do 3 pracovních dnů, a sdělí registrační číslo reklamace nebo jiný identifikátor.

5. Lhůta pro vyřízení

5.1. Reklamaci vyřídíme do 30 dnů od uplatnění, pokud se s vámi nedohodneme na delší lhůtě. Po marném uplynutí lhůty má spotřebitel právo odstoupit od smlouvy nebo požadovat přiměřenou slevu.

6. Možnosti vyřízení

6.1. Je-li reklamace oprávněná, prodávající dle povahy vady:
- odstraní vadu (oprava), je-li to možné,
- dodá nové bez vadného zboží (výměna),
- poskytne přiměřenou slevu z kupní ceny,
- od kupní smlouvy odstoupí, pokud jde o podstatné porušení smlouvy.

7. Náklady na dopravu

7.1. Při oprávněné reklamaci hradí prodávající náklady spojené s dopravou reklamovaného zboží k prodávajícímu a zpět, pokud se nedohodne jinak.

8. Odstoupení od smlouvy

8.1. Právo odstoupit od smlouvy ve 14denní lhůtě bez udání důvodu upravuje samostatná stránka ${LEGAL_ROUTE_MAP.withdrawal}.

9. Formulář reklamace

9.1. Reklamaci můžete podat i prostřednictvím kontaktního formuláře s předmětem „Reklamace" nebo e-mailem s uvedením údajů podle bodu 3.3.`;

const WITHDRAWAL_CONTENT = `1. Právo odstoupit od smlouvy

1.1. Jste-li spotřebitelem, máte právo odstoupit od kupní smlouvy uzavřené na dálku bez udání důvodu ve lhůtě 14 dnů ode dne převzetí zboží.

1.2. Lhůta pro odstoupení uplyne 14 dnů ode dne, kdy vy nebo vámi určená třetí osoba (jiná než dopravce) převezmete zboží.

2. Jak odstoupit

2.1. Odstoupení můžete učinit jedním z těchto způsobů:
- e-mailem na ${O.email},
- písemně na adresu ${O.address},
- vyplněním vzorového formuláře na stránce ${LEGAL_ROUTE_MAP.withdrawal}/formular.

2.2. Pro dodržení lhůty postačuje odeslat odstoupení před jejím uplynutím.

3. Co uvést v odstoupení

3.1. Uveďte prosím:
- jméno a příjmení,
- e-mail a telefon,
- číslo objednávky a datum objednávky,
- zboží, od jehož smlouvy odstupujete,
- číslo bankovního účtu pro vrácení platby (pokud jste již platili).

4. Vrácení zboží

4.1. Zboží zašlete zpět na adresu ${O.address} nejpozději do 14 dnů od odstoupení.

4.2. Náklady na vrácení zboží hradí kupující, nedohodnete-li se jinak.

4.3. Za snížení hodnoty zboží odpovídáte pouze v rozsahu, v němž ke snížení došlo v důsledku nakládání s tímto zbožím jinak, než je nutné k seznámení se s povahou a vlastnostmi zboží.

5. Vrácení peněz

5.1. Prodávající vrátí všechny platby, které od vás obdržel, včetně nákladů na dodání (kromě dodatečných nákladů, pokud jste zvolili jiný než nejlevnější způsob dodání), do 14 dnů od doručení odstoupení.

5.2. Platbu vrátíme stejným platebním prostředkem, kterým byla uhrazena, není-li dohodnuto jinak.

6. Výjimky z odstoupení

6.1. Právo odstoupit nelze uplatnit mimo jiné u:
- zboží, které bylo po dodání nenávratně smíseno s jiným zbožím,
- zboží v ochranném obalu, které jste z obalu vyňali a z hygienických důvodů jej nelze vrátit (typicky otevřené kosmetické produkty, masti, balzámy, šampony po porušení plombování),
- zboží, které podléhá rychlé zkáze.

7. Vzorový formulář

7.1. Vzorový formulář odstoupení je k dispozici na ${LEGAL_ROUTE_MAP.withdrawal}/formular.`;

export const WITHDRAWAL_FORM_CONTENT = `Vzorový formulář pro odstoupení od smlouvy

(adresát)
${O.operator}
${O.address}
e-mail: ${O.email}

Tímto oznamuji/oznamujeme (*) odstoupení od kupní smlouvy o nákupu tohoto zboží (*):

Číslo objednávky: ___________________________
Datum objednávky: ___________________________
Zboží: _____________________________________

Jméno a příjmení: ___________________________
Adresa: ____________________________________
E-mail: ____________________________________
Telefon: ___________________________________
Číslo účtu pro vrácení platby: _______________

Datum: _____________________________________
Podpis (pouze při písemném podání): __________

(*) Nehodící se škrtněte.`;

const PRIVACY_CONTENT = `1. Správce osobních údajů

1.1. Správcem osobních údajů je ${O.operator}, IČO ${O.ico}, sídlo / místo podnikání ${O.address}, e-mail ${O.email} (dále jen „správce").

1.2. Kontakt pro dotazy a žádosti týkající se ochrany osobních údajů: ${O.email}.

2. Jaké údaje zpracováváme

2.1. V souvislosti s provozem e-shopu ${O.shopName} zpracováváme zejména:
- jméno a příjmení,
- e-mail a telefon,
- fakturační a dodací adresu,
- údaje o objednávce (položky, ceny, stav),
- platební stav a identifikátor platby (neukládáme kompletní údaje platební karty),
- IP adresu a technické logy v rozsahu nezbytném pro bezpečnost,
- cookies dle vašeho souhlasu (viz ${LEGAL_ROUTE_MAP.cookies}),
- obsah zpráv z kontaktního formuláře,
- souhlasy udělené při objednávce nebo registraci.

3. Účely zpracování

3.1. Osobní údaje zpracováváme za účelem:
- vyřízení a plnění objednávky,
- plnění právních povinností (účetnictví, daňové doklady),
- reklamací a komunikace se zákazníkem,
- ochrany práv a oprávněných zájmů správce (prevence zneužití, bezpečnost),
- marketingu — pouze na základě vašeho souhlasu,
- analytiky návštěvnosti — pouze na základě souhlasu s cookies, pokud není nezbytná pro provoz.

4. Právní základy

4.1. Plnění smlouvy (objednávka), plnění právní povinnosti (účetnictví), oprávněný zájem (bezpečnost, reklamace) a souhlas (marketing, neesenciální cookies).

5. Příjemci a zpracovatelé

5.1. Údaje mohou být předány těmto kategoriím příjemců:
- poskytovatel hostingu a infrastruktury,
- Supabase (databáze a autentizace),
- Cloudinary (ukládání obrázků),
- Resend (odesílání e-mailů — po aktivaci),
- Stripe / GoPay (platební brány — po aktivaci),
- dopravci (jméno, adresa, telefon pro doručení),
- účetní / fakturační systém.

5.2. Někteří poskytovatelé mohou zpracovávat údaje mimo EU/EHP. V takovém případě zajišťujeme odpovídající záruky (standardní smluvní doložky EU).

6. Doba uchování

6.1. Údaje o objednávkách a účetních dokladech uchováváme po dobu stanovenou zákonem (typicky 5–10 let dle daňových předpisů).
6.2. Marketingové údaje do odvolání souhlasu.
6.3. Cookies dle nastavení uvedeného v ${LEGAL_ROUTE_MAP.cookies}.

7. Vaše práva

7.1. Máte právo na přístup, opravu, výmaz, omezení zpracování, námitku, přenositelnost údajů a odvolání souhlasu.

7.2. Stížnost můžete podat u Úřadu pro ochranu osobních údajů (www.uoou.cz).

8. Zabezpečení

8.1. Přijímáme přiměřená technická a organizační opatření k ochraně osobních údajů.`;

const COOKIES_CONTENT = `1. Co jsou cookies

1.1. Cookies jsou malé textové soubory ukládané do vašeho prohlížeče. Pomáhají zajistit funkčnost webu, pamatovat si vaše volby nebo měřit návštěvnost.

2. Jak cookies používáme

2.1. Cookies rozdělujeme na:
- nezbytné — nutné pro košík, bezpečnost a základní funkce e-shopu,
- analytické — pomáhají pochopit používání webu (spouštěny až po souhlasu),
- marketingové — pro personalizaci reklam (spouštěny až po souhlasu, pokud budou použity),
- preferenční — pro zapamatování nastavení (spouštěny až po souhlasu, pokud budou použity).

2.2. Nezbytné cookies používáme bez souhlasu. Analytické a marketingové cookies pouze po vašem souhlasu v cookie liště.

2.3. Souhlas můžete kdykoli změnit smazáním cookies v prohlížeči nebo opětovným otevřením nastavení cookies (odkaz v patičce webu).

3. Tlačítka v cookie liště

3.1. Můžete zvolit „Přijmout vše", „Jen nezbytné" nebo upravit preference v „Nastavení". Odmítnutí neesenciálních cookies je stejně snadné jako jejich přijetí.

4. Přehled cookies

| Název | Účel | Poskytovatel | Doba | Typ |
|-------|------|--------------|------|-----|
| korunni-cookie-consent | Uložení volby cookies | ${O.shopName} | 12 měsíců | Nezbytné |
| cart / session | Košík a relace | ${O.shopName} | relace / 30 dní | Nezbytné |
| sb-* / supabase | Autentizace adminu | Supabase | relace | Nezbytné |
| _ga / _gid (placeholder) | Analytika návštěvnosti | Google Analytics (pokud aktivováno) | dle poskytovatele | Analytické |
| marketing_* (placeholder) | Remarketing | dle poskytovatele | dle poskytovatele | Marketingové |

4.1. Konkrétní analytické a marketingové cookies doplníme při aktivaci příslušných služeb. Struktura tabulky zůstává platná.

5. Další informace

5.1. Zpracování osobních údajů související s cookies je popsáno v ${LEGAL_ROUTE_MAP.privacy}.`;

export const TESTIMONIALS_DISCLAIMER = `Reference zobrazené na tomto webu jsou ručně přidávané administrátorem e-shopu ${O.shopName} na základě skutečných zkušeností zákazníků nebo jejich výslovného souhlasu. Neprovádíme automatické ověřování totožnosti autorů. U referencí označených jako „Ověřený zákazník" máme k dispozici doklad o nákupu nebo písemný souhlas autora. Nepoužíváme označení „ověřené recenze" u referencí, které nebyly takto ověřeny.`;
