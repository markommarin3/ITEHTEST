<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vozilo;
use App\Models\Rezervacija;
use App\Models\Filijala;
use App\Models\KategorijaVozila;
use App\Models\Placanje;
use App\Models\Recenzija;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Filijale
        $b1 = Filijala::create(['ime' => 'Beograd Centar', 'adresa' => 'Kneza Miloša 10', 'grad' => 'Beograd']);
        $b2 = Filijala::create(['ime' => 'Novi Sad - Aerodrom', 'adresa' => 'Bulevar Oslobođenja 5', 'grad' => 'Novi Sad']);
        $b3 = Filijala::create(['ime' => 'Niš Jug', 'adresa' => 'Vojvode Mišića 2', 'grad' => 'Niš']);

        // Kategorije
        $c1 = KategorijaVozila::create(['naziv' => 'EKO', 'cenaPoDanu' => 35.00]);
        $c2 = KategorijaVozila::create(['naziv' => 'SUV', 'cenaPoDanu' => 85.00]);
        $c3 = KategorijaVozila::create(['naziv' => 'LUX', 'cenaPoDanu' => 150.00]);
        $c4 = KategorijaVozila::create(['naziv' => 'GRADSKI', 'cenaPoDanu' => 25.00]);
        $c5 = KategorijaVozila::create(['naziv' => 'KOMBI', 'cenaPoDanu' => 95.00]);

        // Korisnici
        User::create([
            'ime' => 'Marko Admin',
            'email' => 'admin@iteh.rs',
            'sifra' => bcrypt('admin123'),
            'uloga' => 'ADMINISTRATOR',
            'telefon' => '0641234567',
        ]);

        User::create([
            'ime' => 'Luka Sluzbenik',
            'email' => 'sluzbenik@iteh.rs',
            'sifra' => bcrypt('sluzbenik123'),
            'uloga' => 'SLUZBENIK',
            'telefon' => '0647654321',
            'filijalaId' => $b2->id,
        ]);

        User::create([
            'ime' => 'Sara Sluzbenik',
            'email' => 'sara@iteh.rs',
            'sifra' => bcrypt('sluzbenik123'),
            'uloga' => 'SLUZBENIK',
            'telefon' => '063112233',
            'filijalaId' => $b3->id,
        ]);

        $k1 = User::create([
            'ime' => 'Petar Klijent',
            'email' => 'klijent@iteh.rs',
            'sifra' => bcrypt('klijent123'),
            'uloga' => 'KLIJENT',
            'telefon' => '062998877',
        ]);

        $k2 = User::create([
            'ime' => 'Jovana Klijent',
            'email' => 'jovana@iteh.rs',
            'sifra' => bcrypt('klijent123'),
            'uloga' => 'KLIJENT',
            'telefon' => '062111222',
        ]);

        $k3 = User::create([
            'ime' => 'Nikola Klijent',
            'email' => 'nikola@iteh.rs',
            'sifra' => bcrypt('klijent123'),
            'uloga' => 'KLIJENT',
            'telefon' => '062333444',
        ]);

        $k4 = User::create([
            'ime' => 'Milica Klijent',
            'email' => 'milica@iteh.rs',
            'sifra' => bcrypt('klijent123'),
            'uloga' => 'KLIJENT',
            'telefon' => '062555666',
        ]);

        $k5 = User::create([
            'ime' => 'Stefan Klijent',
            'email' => 'stefan@iteh.rs',
            'sifra' => bcrypt('klijent123'),
            'uloga' => 'KLIJENT',
            'telefon' => '062777888',
        ]);

        // Vozila
        
        //  LUX 
        Vozilo::create([
            'filijalaId' => $b1->id, 'kategorijaId' => $c3->id,
            'marka' => 'BMW', 'model' => 'Serija 7', 'registracioniBroj' => 'BG-777-AA',
            'cenaPoDanu' => 180.00, 'status' => 'DOSTUPNO', 'godiste' => 2023,
            'gorivo' => 'Dizel', 'menjac' => 'Automatski', 'sedista' => 5,
            'image_url' => 'https://www.topgear.com/sites/default/files/2023/08/P90492179_highRes_bmw-i7-xdrive60-m-sp%20%281%29.jpg'
        ]);
        Vozilo::create([
            'filijalaId' => $b2->id, 'kategorijaId' => $c3->id,
            'marka' => 'Audi', 'model' => 'A8 L', 'registracioniBroj' => 'NS-888-LL',
            'cenaPoDanu' => 200.00, 'status' => 'DOSTUPNO', 'godiste' => 2024,
            'gorivo' => 'Benzin', 'menjac' => 'Automatski', 'sedista' => 4,
            'image_url' => 'https://cdn.motor1.com/images/mgl/WBxv3/s1/2022-audi-a8-l-horch.jpg'
        ]);
        Vozilo::create([
            'filijalaId' => $b2->id, 'kategorijaId' => $c3->id,
            'marka' => 'Porsche', 'model' => 'Taycan', 'registracioniBroj' => 'NS-911-EV',
            'cenaPoDanu' => 250.00, 'status' => 'DOSTUPNO', 'godiste' => 2024,
            'gorivo' => 'Električno', 'menjac' => 'Automatski', 'sedista' => 4,
            'image_url' => 'https://carwow-uk-wp-3.imgix.net/1_Taycan_Turbo_GT_with_WP_Driving_1024x683_A5_RGB.jpg'
        ]);

        //  SUV 
        Vozilo::create([
            'filijalaId' => $b1->id, 'kategorijaId' => $c2->id,
            'marka' => 'Mercedes', 'model' => 'GLE Coupe', 'registracioniBroj' => 'BG-111-SUV',
            'cenaPoDanu' => 120.00, 'status' => 'DOSTUPNO', 'godiste' => 2022,
            'gorivo' => 'Hibrid', 'menjac' => 'Automatski', 'sedista' => 5,
            'image_url' => 'https://mediacloud.carbuyer.co.uk/image/private/s--X-WVjvBW--/f_auto,t_content-image-full-desktop@1/v1608198949/autoexpress/2020/12/GLE-Coupe-front-tracking.jpg'
        ]);
        Vozilo::create([
            'filijalaId' => $b3->id, 'kategorijaId' => $c2->id,
            'marka' => 'Toyota', 'model' => 'Land Cruiser', 'registracioniBroj' => 'NI-444-LC',
            'cenaPoDanu' => 110.00, 'status' => 'DOSTUPNO', 'godiste' => 2021,
            'gorivo' => 'Dizel', 'menjac' => 'Automatski', 'sedista' => 7,
            'image_url' => 'https://global.toyota/pages/news/images/2024/04/18/1330/001.jpg'
        ]);

        //  EKO 
        Vozilo::create([
            'filijalaId' => $b1->id, 'kategorijaId' => $c1->id,
            'marka' => 'Volkswagen', 'model' => 'Golf 8', 'registracioniBroj' => 'BG-123-VW',
            'cenaPoDanu' => 45.00, 'status' => 'DOSTUPNO', 'godiste' => 2022,
            'gorivo' => 'Benzin', 'menjac' => 'Automatski', 'sedista' => 5,
            'image_url' => 'https://cdn.nezavisne.com/2024/01/750x450/20240124115540_812564.jpg'
        ]);
        Vozilo::create([
            'filijalaId' => $b2->id, 'kategorijaId' => $c1->id,
            'marka' => 'Skoda', 'model' => 'Octavia', 'registracioniBroj' => 'NS-456-SK',
            'cenaPoDanu' => 50.00, 'status' => 'DOSTUPNO', 'godiste' => 2023,
            'gorivo' => 'Benzin', 'menjac' => 'Manuelni', 'sedista' => 5,
            'image_url' => 'https://img.prodajemauto.rs/blog/12/24a9b914820b58b1ac55fa6c9b2fb85bcad095cbf2ac1c066f13d85add8df0b8-1715783560656-38270.webp?w=1200'
        ]);
        Vozilo::create([
            'filijalaId' => $b1->id, 'kategorijaId' => $c1->id,
            'marka' => 'Tesla', 'model' => 'Model 3', 'registracioniBroj' => 'BG-EV-TES',
            'cenaPoDanu' => 100.00, 'status' => 'DOSTUPNO', 'godiste' => 2023,
            'gorivo' => 'Električno', 'menjac' => 'Automatski', 'sedista' => 5,
            'image_url' => 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800'
        ]);

        //  GRADSKI 
        Vozilo::create([
            'filijalaId' => $b1->id, 'kategorijaId' => $c4->id,
            'marka' => 'Fiat', 'model' => '500', 'registracioniBroj' => 'BG-222-FT',
            'cenaPoDanu' => 30.00, 'status' => 'DOSTUPNO', 'godiste' => 2021,
            'gorivo' => 'Benzin', 'menjac' => 'Manuelni', 'sedista' => 4,
            'image_url' => 'https://www.b92.net/data/images/2024-04-01/12849_01_f.jpg'
        ]);
        Vozilo::create([
            'filijalaId' => $b3->id, 'kategorijaId' => $c4->id,
            'marka' => 'Toyota', 'model' => 'Yaris', 'registracioniBroj' => 'NI-112-TY',
            'cenaPoDanu' => 35.00, 'status' => 'DOSTUPNO', 'godiste' => 2022,
            'gorivo' => 'Hibrid', 'menjac' => 'Automatski', 'sedista' => 5,
            'image_url' => 'https://www.b92.net/data/images/2024-04-09/15785_toyota-yaris-2024-1600-01_f.jpg'
        ]);

        //  KOMBI 
        Vozilo::create([
            'filijalaId' => $b1->id, 'kategorijaId' => $c5->id,
            'marka' => 'Mercedes', 'model' => 'V-Class', 'registracioniBroj' => 'BG-VIP-V',
            'cenaPoDanu' => 150.00, 'status' => 'DOSTUPNO', 'godiste' => 2023,
            'gorivo' => 'Dizel', 'menjac' => 'Automatski', 'sedista' => 8,
            'image_url' => 'https://www.topgear.com/sites/default/files/cars-car/image/2024/11/Mercedes_VClass__0002.jpg'
        ]);
        Vozilo::create([
            'filijalaId' => $b2->id, 'kategorijaId' => $c5->id,
            'marka' => 'Volkswagen', 'model' => 'Transporter', 'registracioniBroj' => 'NS-987-VW',
            'cenaPoDanu' => 90.00, 'status' => 'DOSTUPNO', 'godiste' => 2021,
            'gorivo' => 'Dizel', 'menjac' => 'Manuelni', 'sedista' => 9,
            'image_url' => 'https://images.cdn.autocar.co.uk/sites/autocar.co.uk/files/styles/gallery_slide/public/1-volkswagen-transporter-2022-road-test-review-lead.jpg?itok=JGUfVler'
        ]);

        // Test Rezervacije
        $res = Rezervacija::create([
            'korisnikId' => $k1->id,
            'voziloId' => 6, // Golf 8
            'filijalaPreuzimanjaId' => $b1->id,
            'filijalaVracanjaId' => $b1->id,
            'vremePreuzimanja' => now()->addDays(2),
            'vremeVracanja' => now()->addDays(5),
            'ukupnaCena' => 360.00,
            'status' => 'CEKA',
            'napomene' => 'Molim vas za čist auto.'
        ]);

        Placanje::create([
            'rezervacijaId' => $res->id,
            'iznos' => 360.00,
            'status' => 'CEKA'
        ]);

        // Test Recenzije
        Recenzija::create([
            'korisnikId' => $k1->id,
            'voziloId' => 1,
            'ocena' => 5,
            'komentar' => 'Savršen BMW, prezadovoljan sam uslugom!'
        ]);

        Recenzija::create([
            'korisnikId' => $k2->id,
            'voziloId' => 2, // Audi A8 L
            'ocena' => 4,
            'komentar' => 'Malo veći za grad, ali veoma udoban i moćan.'
        ]);
    }
}
