<?php

namespace App\Http\Controllers;

use App\Models\chatdata;
use Illuminate\Http\Request;

class ChatdataController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $chatdata = chatdata::all();
		return $chatdata;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(chatdata $chatdata)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, chatdata $chatdata)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(chatdata $chatdata)
    {
        //
    }
}
