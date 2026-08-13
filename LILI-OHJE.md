# Näin päivität sivujasi

Sivujen muokkaus tapahtuu selaimessa. Mitään ei tarvitse asentaa.

Muokkausnäkymä on englanniksi, koska sivusto itsekin on englanninkielinen.
Tarvittavia sanoja on noin viisitoista, ja ne on selitetty tässä ohjeessa.

---

## 1. Kirjautuminen

Mene osoitteeseen **thesayce.com/studio** ja kirjaudu sisään sillä
sähköpostiosoitteella, johon kutsu tuli.

Kannattaa tallentaa osoite selaimen kirjanmerkkeihin.

---

## 2. Mitä näet

Vasemmassa reunassa on neljä kohtaa:

| Kohta | Mitä siellä on |
| --- | --- |
| **Homepage** | Etusivu |
| **Case studies** | Asiakastarinat |
| **Other pages** | Muut sivut, esimerkiksi erillinen esittelysivu |
| **Site settings** | Nimi, valikko ja yläreunan painike |

Yläreunan **Presentation** avaa sivuston viereen. Siinä näet muutokset heti,
ja voit napsauttaa tekstiä suoraan sivulta päästäksesi muokkaamaan sitä.
Tämä on helpoin tapa työskennellä.

---

## 3. Tekstin muokkaus ja kappalejako

Tekstikentät toimivat kuten tekstinkäsittelyohjelma.

- **Uusi kappale:** paina rivinvaihtoa eli Enteriä. Kappaleiden väliin tulee
  automaattisesti sopiva tila.
- **Lihavointi:** maalaa teksti ja paina **B**, tai näppäinyhdistelmää Cmd + B.
- **Kursivointi:** maalaa teksti ja paina **I**.
- **Luettelo:** valitse työkalurivin luettelomerkki. Saat joko pallukat tai
  numerot.
- **Linkki:** maalaa teksti, valitse ketjun kuva ja kirjoita osoite.
- **Väliotsikko:** valitse tekstin kohdalla **Normal**-valikosta **Heading**.

Muotoiluja on tarkoituksella vain nämä. Näin teksti pysyy aina saman
näköisenä kuin muukin sivusto, etkä voi vahingossa rikkoa ulkoasua.

---

## 4. Uuden osion lisääminen

Sivu koostuu osioista, jotka ovat allekkain listana kohdassa **Sections**.

1. Avaa **Homepage** tai jokin muu sivu.
2. Vieritä kohtaan **Sections**.
3. Napsauta **Add item**.
4. Valitse osion tyyppi listasta.

Vaihtoehdot ovat:

| Osio | Mihin |
| --- | --- |
| **Hero** | Sivun aloitus: iso otsikko ja kuva |
| **Text section** | Tekstiä, halutessasi otsikko, nostolause ja kuvia |
| **Pullquote** | Yksi lause isolla, omana osionaan |
| **Images** | Yhdestä kolmeen kuvaa |
| **Case study grid** | Asiakastarinakortit |
| **Logo strip** | Rivi asiakkaiden logoja |
| **Contact** | Yhteystiedot sivun lopussa |

**Järjestyksen vaihto:** tartu osion vasemmasta reunasta ja raahaa se
haluamaasi kohtaan.

**Osion poisto:** napsauta osion oikean reunan kolmea pistettä ja valitse
**Remove**.

---

## 5. Kuvat

Kuva lisätään raahaamalla se kuvakenttään tai valitsemalla se koneelta.

Kun kuva on paikallaan, kannattaa käydä napsauttamassa **rajaustyökalua**
(saksien tai neliön kuva). Siinä voi asettaa kuvan tärkeimmän kohdan.
Sivusto rajaa kuvaa eri kokoisiin paikkoihin, ja tämä varmistaa, ettei
esimerkiksi kasvoja jää rajauksen ulkopuolelle.

**Alt text** on lyhyt kuvaus kuvasta. Sen lukevat näkövammaiset
ruudunlukuohjelmat ja hakukoneet. Koristekuvan kohdalla sen voi jättää
tyhjäksi.

---

## 6. Uusi sivu

1. Valitse **Other pages** ja napsauta **+**.
2. Kirjoita otsikko kohtaan **Page title**.
3. Napsauta **Generate** kohdassa **Web address**. Se tekee osoitteen
   otsikon pohjalta.
4. Rakenna sivu osioista kuten edellä.

Jos haluat sivun näkyvän valikkoon, lisää se kohdassa **Site settings** →
**Navigation links**. Linkiksi tulee vinoviiva ja osoite, esimerkiksi
`/about`.

---

## 7. Työversio ja julkaistu versio

Jokaisesta sivusta on kaksi versiota, ja muokkausnäkymän yläreunassa on kytkin
niiden välillä:

| | |
| --- | --- |
| **Published** | Se, minkä sivuston kävijät näkevät juuri nyt |
| **Draft** | Työversio, jonka näet vain sinä |

**Kirjoittaminen onnistuu vain Draft-puolella.** Jos kentät eivät reagoi etkä
saa kirjoitettua mitään, olet Published-puolella. Napsauta silloin **Draft**.
Tämä on Sanityn tapa estää se, että julkaistu sivu muuttuisi vahingossa.

Kun avaat Draftin ensimmäisen kerran, Sanity tekee työversion siitä, mikä on
juuri nyt julkaistuna. Mitään ei siis katoa, vaikka Draft näyttäisi hetken
tyhjältä tai vanhalta. Jos esikatselu näyttää vanhaa versiota, päivitä se
osoiterivin vieressä olevasta nuolesta.

---

## 8. Julkaiseminen

Muutokset tallentuvat itsestään, mutta ne eivät näy sivustolla ennen kuin
painat oikean alakulman **Publish**-painiketta.

Julkaisu näkyy sivustolla muutamassa sekunnissa. Sivustoa ei tarvitse
rakentaa uudelleen eikä kenenkään tarvitse tehdä mitään.

---

## 9. Jos sivusto näyttää oudolta

Kun avaat studion, selaimesi siirtyy esikatselutilaan. Silloin näet sivustolla
myös julkaisemattomat muutokset, ja sivu voi jäädä näyttämään vanhaa versiota.
Se näyttää helposti siltä, kuin tekemäsi työ olisi kadonnut, vaikka kaikki on
tallessa.

Tunnistat esikatselutilan siitä, että tekstissä on näkymättömiä merkkejä: jos
kopioit otsikon ja liität sen vaikka sähköpostiin, siinä on ylimääräisiä
välejä.

Pääset pois esikatselutilasta menemällä osoitteeseen:

```
thesayce.com/api/draft-mode/disable
```

Voit myös avata sivuston yksityisessä selainikkunassa. Silloin näet täsmälleen
sen, minkä kävijätkin näkevät. Tämä on nopein tapa tarkistaa, onko sivustolla
oikeasti jokin vialla vai onko kyse vain esikatselutilasta.

---

## 10. Jos jokin menee pieleen

Mitään ei voi rikkoa pysyvästi.

- **Peruuta viimeisin muutos:** Cmd + Z.
- **Palaa vanhaan versioon:** avaa oikean yläkulman kello tai kolme pistettä
  ja valitse aiempi versio. Sanity tallentaa koko muokkaushistorian.
- **Piilota sivu tai asiakastarina näkyvistä:** valitse kolmesta pisteestä
  **Unpublish**. Sisältö säilyy, mutta se ei näy sivustolla.

Jos jokin näyttää oudolta, älä poista mitään. Ota yhteyttä Elinaan.

---

## Yksi asia ratkaistavaksi

Vanhoilta sivuilta löytyi kaksi osiota, jotka eivät koskaan näkyneet
sivustolla. Ne olivat muokattavissa vanhassa järjestelmässä, mutta niitä ei
ollut kytketty mihinkään, joten kaikki niihin kirjoitettu katosi
näkymättömiin.

Näistä **Question** on nyt käytössä: se on etusivun osio **When to call me**.

Toinen, **What I Do**, on yhä keskeneräinen. Teksti löytyy kohdasta **Other
pages**, sivulta **Unused sections (from the old site)**. Sivu on työversiona
eikä näy sivustolla.

Katso, haluatko viimeistellä sen tekstin ja ottaa sen käyttöön, vai poistaa
sen.
