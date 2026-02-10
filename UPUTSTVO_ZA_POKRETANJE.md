# 📋 Uputstvo za pokretanje aplikacije za iznajmljivanje vozila

Ovaj dokument sadrži **tačna korak-po-korak uputstva** za pokretanje projekta na novom računaru nakon kloniranja sa Git-a.

---

## 1. Šta ti treba pre početka

Na računaru moraju biti instalirani:

| Program | Verzija | Gde preuzeti |
|---------|---------|--------------|
| **PHP** | 8.2 ili noviji | https://windows.php.net/download/ ili XAMPP (https://www.apachefriends.org/) |
| **Composer** | Najnovija | https://getcomposer.org/download/ |
| **Node.js** | 18 ili noviji | https://nodejs.org/ |
| **Git** | Najnovija | https://git-scm.com/ |

**Provera:** Otvori Command Prompt ili PowerShell i ukucaj:
```
php -v
composer -v
node -v
npm -v
```
Sve komande treba da odgovore verzijom. Ako nešto ne radi, instaliraj program pre nastavka.

---

## 2. Kloniranje projekta sa Git-a

Otvori terminal u folderu gde želiš da bude projekat (npr. `D:\Projekti`) i ukucaj:

```
git clone <URL_TVOG_REPOZITORIJUMA>
cd ITEHPROBA
```

*(Zameni `<URL_TVOG_REPOZITORIJUMA>` sa stvarnom Git adresom, npr. `https://github.com/korisnik/ITEHPROBA.git`)*

---

## 3. Backend (Laravel) – podešavanje

### Korak 3.1: Otvori terminal u folderu backend-a

```
cd iznajmljivanjevozila-backend
```

### Korak 3.2: Instaliraj PHP zavisnosti

```
composer install
```

*(Može trajati nekoliko minuta dok se preuzimaju paketi.)*

### Korak 3.3: Kreiraj .env fajl

```
copy .env.example .env
```

*(Na Linux/Mac: `cp .env.example .env`)*

### Korak 3.4: Generiši aplikacioni ključ

```
php artisan key:generate
```

### Korak 3.5: Kreiraj SQLite bazu

**Windows (CMD):**
```
type nul > database\database.sqlite
```

**Windows (PowerShell):**
```
New-Item -Path database\database.sqlite -ItemType File -Force
```

**Linux/Mac:**
```
touch database/database.sqlite
```

### Korak 3.6: Pokreni migracije (kreira tabele)

```
php artisan migrate
```

### Korak 3.7: Ubaci test podatke (opciono, ali preporučeno)

```
php artisan db:seed
```

Ovo kreira test korisnike, vozila, filijale itd.

### Korak 3.8: Poveži storage za dokumente (za upload dokumenata)

```
php artisan storage:link
```

### Korak 3.9: Pokreni Laravel server

```
php artisan serve
```

*(Na nekim sistemima može trebati i `php artisan config:cache` ako se pojave greške sa .env – ali obično nije potrebno.)*

Treba da vidiš:
```
Laravel development server started: http://127.0.0.1:8000
```

**Backend je sada aktivan na http://localhost:8000.** Ostavi ovaj terminal otvoren.

---

## 4. Frontend (React) – podešavanje

### Korak 4.1: Otvori NOVI terminal

*(Backend mora da ostane pokrenut u prvom terminalu.)*

### Korak 4.2: Pređi u root projekta i zatim u frontend folder

```
cd iznajmljivanjevozila-frontend
```

*(Ako si već u `iznajmljivanjevozila-backend`, prvo ukucaj `cd ..` pa onda `cd iznajmljivanjevozila-frontend`.)*

### Korak 4.3: Instaliraj npm zavisnosti

```
npm install
```

### Korak 4.4: Pokreni React dev server

```
npm run dev
```

Treba da vidiš nešto poput:
```
VITE v7.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

**Frontend je sada aktivan na http://localhost:5173** (ili 5174 ako je 5173 zauzet).

---

## 5. Korišćenje aplikacije

1. Otvori pregledač i idi na **http://localhost:5173** (ili port koji je Vite prikazao).
2. Moraš imati **oba servera pokrenuta** – backend (port 8000) i frontend (port 5173).

### Test nalozi (ako si pokrenuo `php artisan db:seed`):

| Uloga | Email | Šifra |
|-------|-------|-------|
| Administrator | admin@iteh.rs | admin123 |
| Službenik | sluzbenik@iteh.rs | sluzbenik123 |
| Klijent | klijent@iteh.rs | klijent123 |

---

## 6. Rešavanje problema

### „Failed to open stream: vendor/autoload.php”
- Nisi pokrenuo `composer install` u backend folderu. Vrati se na Korak 3.2.

### „SQLSTATE: could not find driver”
- PHP nema uključen SQLite. U `php.ini` ukloni `;` ispred `extension=sqlite` (ili `extension=pdo_sqlite`), pa ponovo pokreni server.

### „Port 8000 is already in use”
- Nešto drugi koristi port 8000. Možeš pokrenuti Laravel na drugom portu:
  ```
  php artisan serve --port=8001
  ```
  Zatim u frontend kodu zameni sve `http://localhost:8000` sa `http://localhost:8001` (ili napravi `.env` u frontendu sa `VITE_API_URL=http://localhost:8001` ako postoji takva varijabla).

### Frontend ne može da se poveže na API
- Proveri da li backend radi na http://localhost:8000.
- U pregledaču otvori http://localhost:8000/api/vehicles – treba da dobiješ JSON odgovor (možda prazan niz `[]`).

### „npm ERR!“ ili greške pri `npm install`
- Proveri da li imaš Node.js 18+ (`node -v`).
- Pokušaj: `npm cache clean --force` pa ponovo `npm install`.

---

## 7. Brzi pregled komandi (copy-paste)

**Terminal 1 – Backend:**
```
cd iznajmljivanjevozila-backend
composer install
copy .env.example .env
php artisan key:generate
type nul > database\database.sqlite
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```
*(Ako koristiš PowerShell: umesto `type nul > ...` ukucaj `New-Item -Path database\database.sqlite -ItemType File -Force`)*

**Terminal 2 – Frontend:**
```
cd iznajmljivanjevozila-frontend
npm install
npm run dev
```

Zatim u pregledaču otvori: **http://localhost:5173** (ili port koji Vite prikaže).

---

*Uputstvo ažurirano: februar 2026.*
