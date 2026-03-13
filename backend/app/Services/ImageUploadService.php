<?php

namespace App\Services;
use ImageKit\ImageKit;

class ImageUploadService
{
    protected ImageKit $imageKit;
    public function __construct(ImageKit $imageKit)
    {
        $this->imageKit = $imageKit;
    }
    public function uploadFile($file, $filename, $folder)
    {
        try {
            $response = $this->imageKit->uploadFile([
                'file' => $file,
                'fileName' => $filename,
                'folder' => $folder,
            ]);
            return $response;
        } catch (\Exception $e) {
            throw new \Exception('Failed to upload file: ' . $e->getMessage());
        }
    }
}