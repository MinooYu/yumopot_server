<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class chatdata extends Model
{
    use HasFactory;

	protected $table = 'chatdatas';
	protected $primimary = 'id';
	protected $fillable = ['roomid', 'chattext'];
	public $timestamps = false;
}
