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
            $file_content = base64_encode(file_get_contents($file));
            $response = $this->imageKit->uploadFile([
                'file' => $file_content,
                'fileName' => $filename,
                'folder' => $folder,
                'useUniqueFileName' => true,
            ]);
            return $response;
        } catch (\Exception $e) {
            throw new \Exception('Failed to upload file: ' . $e->getMessage());
        }
    }
    public function deleteImage($url)
    {
        try {
            $filename = basename($url);
            $found_image = $this->imageKit->listFiles([
                'name' => $filename,
            ]);
            if (count($found_image->result) > 0) {
                $response = $this->imageKit->deleteFile($found_image->result[0]->fileId);
                return $response;
            } else {
                throw new \Exception('File not found: ' . $filename);
            }
        } catch (\Exception $e) {
            throw new \Exception('Failed to delete file: ' . $e->getMessage());
        }
    }
}