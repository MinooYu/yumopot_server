<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use App\Models\users;
use Illuminate\Http\Request;
use App\Http\Controllers\basicfunc;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = users::all();
		return $users;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
		$userinfo = new users();
		$userinfo->userHash = (string)Str::uuid();
		$userinfo->username = $request->username;
		$userinfo->password = $request->password;
		$userinfo->save();
		return $userinfo;
    }

    /**
     * Display the specified resource.
     */
    public function show($userHash)
    {
        $userInfo = users::where('userHash', $userHash)->get();
		return $userInfo;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, users $users)
    {
        //
    }

	public function userAuth(Request $request)
    {
		$result = null;
		try {
			$setting = [['username', '=', $request->username],['password', '=', $request->password]];
			$userHashdir = users::where($setting)->get();
			$values = $userHashdir[0];

			$result = [
				'result' => true,
				'userHash' => $values->userHash,
				'username' => $values->username,
				'updated_at' => $values->updated_at,
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
     * Remove the specified resource from storage.
     */
    public function destroy(users $users)
    {
        //
    }
}
