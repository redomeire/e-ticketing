<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function show()
    {
        try {
            $user = auth()->user();
            $profile = $user->profile;
            return $this->sendResponse($profile, 'Profile retrieved successfully');
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage(), [], 500);
        }
    }
    public function update(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'phone' => 'sometimes|string|max:15',
                    'is_male' => 'sometimes|boolean',
                    'date_of_birth' => 'sometimes|date',
                ]
            );
            if ($validator->fails()) {
                return $this->sendError('Validation Error', $validator->errors(), 422);
            }
            $validated = $validator->validated();

            $user = auth()->user();
            $profile = $user->profile()->update($validated);
            return $this->sendResponse($profile, 'Profile updated successfully');
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage(), [], 500);
        }
    }
    public function destroy()
    {
        try {
            $user = auth()->user();
            $user->profile()->delete();
            return $this->sendResponse(null, 'Profile deleted successfully');
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage(), [], 500);
        }
    }
}
