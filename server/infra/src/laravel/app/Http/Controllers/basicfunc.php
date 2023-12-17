<?php 
namespace App\Http\Controllers;

class basicfunc {
	function resConversionJson($result, $statusCode=200)
	{
		if(empty($statusCode) || $statusCode < 100 || $statusCode >= 600) {
			$statusCode = 500;
		}
		return response()->json($result, $statusCode, ['Content-Type' => 'application/json'], JSON_UNESCAPED_SLASHES);
	}
}
?>