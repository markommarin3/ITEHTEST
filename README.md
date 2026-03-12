# Auto Rent - Web aplikacija za iznajmljivanje vozila

Projekat je rađen u okviru predmeta Internet tehnologije. Radi se o web aplikaciji za auto-rent agencije gde klijenti mogu da pregledaju vozila, filtriraju ih i naprave rezervaciju, dok administratori upravljaju flotom i korisnicima kroz poseban panel.

## Tehnologije

Frontend je razvijen u Reactu sa Vite.js, stilizovan Tailwind CSS-om, a za navigaciju je korišćen React Router v6. Pored toga, integrisan je Google Maps API za prikaz lokacija filijala i ExchangeRate-API za konverziju valuta.

Backend je razvijen u PHP 8.2 uz Laravel 10 framework, baza podataka je MySQL, a API dokumentacija je generisana pomoću L5-Swagger paketa.

Za pokretanje i deployment korišćeni su Docker i Docker Compose, a GitHub Actions je podešen za automatsko testiranje koda pri svakom push-u.

## Pokretanje projekta

Da bi se aplikacija pokrenula, potrebno je imati instaliran Docker i Docker Desktop. Nakon toga dovoljno je pokrenuti sledece komande:

    git clone <url-repozitorijuma>
    cd ITEH2
    docker-compose up --build

Aplikacija ce biti dostupna na sledecim adresama:

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:8000>
- Swagger dokumentacija: <http://localhost:8000/api/documentation>

## Struktura projekta

Projekat je organizovan kao monorepo, sto znaci da se frontend i backend nalaze u istom repozitorijumu ali su potpuno odvojene aplikacije.

Folder iznajmljivanjevozila-backend sadrzi Laravel aplikaciju sa kontrolerima u app/Http/Controllers, API rutama u routes/api.php i migracijama baze u database/migrations.

Folder iznajmljivanjevozila-frontend sadrzi React aplikaciju. Unutar src foldera nalaze se components za deljene UI elemente, pages za stranice poput liste vozila, rezervacije, lokacija i admin panela, i App.jsx gde su definisane sve rute.

Fajl docker-compose.yml definise kako se MySQL, backend i frontend pokrecu zajedno, a u .github/workflows se nalazi konfiguracija za CI/CD.

## API dokumentacija

Svi API endpointi su dokumentovani kroz Swagger UI koji je dostupan na adresi <http://localhost:8000/api/documentation>. Dokumentacija se automatski generise iz koda, sto znaci da je uvek azurna. Kroz Swagger interfejs moguce je pregledati sve endpointe i testirati ih direktno u browseru.

## Eksterni API-ji

### ExchangeRate-API

Naziv servisa: ExchangeRate-API (exchangerate-api.com)

Svrha: Posto su sve cene u bazi podataka u EUR, ovaj API omogucava korisnicima da vide cenu u svojoj lokalnoj valuti. Podrzan je prikaz u RSD, USD, GBP, CHF i JPY. Kursevi se kesiraju tokom sesije kako se API ne bi pozivao na svaki klik.

Nacin komunikacije: REST arhitektura, JSON format odgovora.

Osnovni endpoint:

    GET https://v6.exchangerate-api.com/v6/{API_KEY}/latest/EUR

Primer zahteva:

    const response = await fetch('https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/EUR');
    const data = await response.json();
    const cenaURSD = 180 * data.conversion_rates.RSD;
    // Rezultat: 180 x 117.20 = 21,096 RSD

Primer odgovora:

    {
      "result": "success",
      "base_code": "EUR",
      "conversion_rates": {
        "EUR": 1.0,
        "RSD": 117.20,
        "USD": 1.082,
        "GBP": 0.853,
        "CHF": 0.961,
        "JPY": 162.45
      }
    }

### Google Maps Embed API

Naziv servisa: Google Maps Embed API (maps.googleapis.com)

Svrha: Na stranici Lokacije prikazuje se interaktivna Google mapa sa tacknom lokacijom svake filijale. GPS koordinate su sacuvane u bazi podataka i dinamicki se salju API-ju pri ucitavanju stranice. Mapa se automatski prilagodjava velicini ekrana.

Nacin komunikacije: HTTP GET zahtev koji se ugradjuje kao src atribut iframe HTML elementa.

Osnovni endpoint:

    GET https://www.google.com/maps/embed/v1/place?key={API_KEY}&q={GPS_KOORDINATE}&zoom=15

Primer zahteva:

    <iframe
      width="100%"
      height="400"
      loading="lazy"
      src="https://www.google.com/maps/embed/v1/place?key=API_KEY&q=44.8176,20.4633&zoom=15">
    </iframe>

Odgovor: API ne vraca JSON vec direktno renderuje interaktivnu mapu unutar iframe elementa. Na mapi korisnik vidi marker na lokaciji filijale, radno vreme i dugme za navigaciju.

Oba API-ja se pozivaju asinhrono tako da ne usporavaju ucitavanje stranice. Svi API kljucevi su smesteni u .env fajl i nisu izlozeni u kodu.
