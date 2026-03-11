<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $validater = Validator::make($request->query(), [
                'search' => 'nullable|string|max:255',
                'limit' => 'sometimes|integer|min:1',
                'page' => 'sometimes|integer|min:1',
            ]);
            if ($validater->fails()) {
                return $this->sendError('Validation Error', $validater->errors(), 422);
            }
            $validated = $validater->validated();
            $limit = $validated['limit'] ?? 10;
            $page = $validated['page'] ?? 1;
            $search = $validated['search'];
            $events = null;

            $query = User::select('id', 'name', 'email', 'role', 'is_active', 'created_at');
            if ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            }
            $users = $query->orderBy('created_at', 'asc')->paginate($limit, ['*'], 'page', $page);
            return $this->sendResponse($users, 'Users retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve users', [
                $e->getMessage()
            ], 500);
        }
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
    public function show(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'is_active' => 'sometimes|boolean',
            ]);
            if ($validator->fails()) {
                return $this->sendError('Validation Error', $validator->errors(), 422);
            }
            $validated = $validator->validated();
            $user = User::find($id);
            if (!$user) {
                return $this->sendError('User not found', [], 404);
            }
            if (
                $user->role === 'admin'
                || $user->role === 'superadmin'
            ) {
                return $this->sendError('Cannot update admin user', [], 403);
            }
            if (isset($validated['is_active'])) {
                $user->is_active = $validated['is_active'];
            }
            $user->save();
            return $this->sendResponse($user, 'User updated successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to update user', [
                $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
