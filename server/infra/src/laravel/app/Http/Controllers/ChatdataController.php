<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use App\Models\chatdata;
use Illuminate\Http\Request;
use App\Http\Controllers\basicfunc;

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
		$result = null;
		try {
			$chatdata = new chatdata();
			$chatdata->chatUsername = $request->username;
			$chatdata->chatUserHash = $request->userHash;
			$chatdata->roomid = $request->roomid;
			$chatdata->chattext = $request->chattext;
			$chatdata->save();

			$result = [
				'result' => true,
				'chatdata' => $chatdata,
			];
		} catch(\Exception $e) {
			$result = [
				'result' => false,
				'err' => $e,
			];
		}

		$basicfunc = new basicfunc();
		return $basicfunc->resConversionJson($result);
    }

	public function chatdatawhereroomids(Request $request) {
		$result = null;
		try {
			$setting = [['roomid', '=', $request->roomid]];
			$values = chatdata::where($setting)->get();

			$result = [
				'result' => true,
				'chatdata' => $values,
			];
		} catch(\Exception $e) {
			$result = [
				'result' => false,
				'err' => $e,
			];
		}

		$basicfunc = new basicfunc();
		return $basicfunc->resConversionJson($result);
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
