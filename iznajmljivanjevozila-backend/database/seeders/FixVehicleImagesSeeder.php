<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vozilo;

class FixVehicleImagesSeeder extends Seeder
{
    public function run(): void
    {
        // Golf 8
        $v2 = Vozilo::find(2);
        if ($v2) {
            $v2->image_url = 'https://image.stern.de/34392470/t/8F/v3/w1440/r1.7778/-/vw-golf-8-gti--mj-2024--1.jpg';
            $v2->save();
        }

        // Fiat 500
        $v5 = Vozilo::find(5);
        if ($v5) {
            $v5->image_url = 'https://www.topgear.com/sites/default/files/cars-car/image/2021/05/fiat_500_la-prima_020.jpg?w=1280&h=720';
            $v5->save();
        }

        // Audi A6
        $v4 = Vozilo::find(4);
        if ($v4) {
            $v4->image_url = 'https://assets.adac.de/image/upload/v1/Autodatenbank/Fahrzeugbilder/im02704-1-audi-a6.jpg';
            $v4->save();
        }
    }
}
