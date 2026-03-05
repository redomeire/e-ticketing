<?php

namespace App\Http\Controllers;

abstract class Controller
{
    //
    public function sendResponse($data, $message = 'Success')
    {
        $response = [
            'success' => true,
            'data' => $data,
            'message' => $message,
        ];

        return response()->json($response, 200);
    }

    public function sendError($errorMessage, $errors = [], $code = 404)
    {
        $response = [
            'success' => false,
            'message' => $errorMessage,
        ];

        if (!empty($errors)) {
            $response['error'] = $errors;
        }

        return response()->json($response, $code);
    }
}
