<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Log;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): Response
    {
        Log::info("User {$user->id} with role {$user->role} is attempting to update user {$model->id} with role {$model->role}.");
        return in_array($model->role, ['superadmin', 'admin'])
            ? Response::deny('Anda tidak memiliki hak akses untuk mengubah status ini.')
            : Response::allow();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): Response
    {
        Log::info("User {$user->id} with role {$user->role} is attempting to delete user {$model->id} with role {$model->role}.");
        return in_array($model->role, ['superadmin', 'admin'])
            ? Response::deny('Anda tidak memiliki hak akses untuk mengubah status ini.')
            : Response::allow();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        return false;
    }
}
