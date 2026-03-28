<?php

namespace App\Services;

use GuzzleHttp\Client as HttpClient;
use Illuminate\Support\Facades\Cache;
use Spatie\Dropbox\TokenProvider;

class AutoRefreshingDropBoxTokenService implements TokenProvider
{
    private string $key;
    private string $secret;
    private string $refreshToken;

    public function __construct()
    {
        $this->key = config('filesystems.disks.dropbox.app_key');
        $this->secret = config('filesystems.disks.dropbox.app_secret');
        $this->refreshToken = config('filesystems.disks.dropbox.refresh_token');
    }

    public function getToken(): string
    {
        return Cache::remember('dropbox_access_token', 14000, function () {
            return $this->fetchAccessToken();
        });
    }

    private function fetchAccessToken(): string
    {
        $client = new HttpClient();
        $response = $client->request('POST', 'https://api.dropbox.com/oauth2/token', [
            'auth' => [$this->key, $this->secret],
            'form_params' => [
                'grant_type' => 'refresh_token',
                'refresh_token' => $this->refreshToken,
            ],
        ]);

        return json_decode($response->getBody(), true)['access_token'];
    }
}