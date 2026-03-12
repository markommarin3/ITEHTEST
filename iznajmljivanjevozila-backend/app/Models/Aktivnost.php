<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aktivnost extends Model
{
    protected $table = 'aktivnosti';

    protected $fillable = [
        'korisnikId',
        'akcija',
        'detalji',
        'tip'
    ];

    public function korisnik()
    {
        return $this->belongsTo(User::class, 'korisnikId');
    }
}
