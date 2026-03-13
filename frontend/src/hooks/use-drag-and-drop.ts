import { useCallback, useRef, useState } from "react";
import { useDropzone, DropzoneProps } from "react-dropzone";
import { toast } from "sonner";

interface UseDragNDropProps extends DropzoneProps {
    onFilesAdded: (files: File[]) => void;
}

const useDragNDrop = ({
    onFilesAdded,
    accept,
    multiple = true,
    ...rest
}: UseDragNDropProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const fileObjectUrlMap = useRef(new Map<string, string>());

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setFiles(acceptedFiles);
            onFilesAdded(acceptedFiles);
        },
        [onFilesAdded]
    );

    const removeFile = useCallback(
        (file: File) => {
            const revokedUrl = fileObjectUrlMap.current.get(
                `${file.name}-${file.lastModified}`
            );
            if (revokedUrl) {
                URL.revokeObjectURL(revokedUrl);
                fileObjectUrlMap.current.delete(
                    `${file.name}-${file.lastModified}`
                );
            }
            const updatedFiles = files.filter((f) => f !== file);
            setFiles(updatedFiles);
            onFilesAdded(updatedFiles);
        },
        [files, onFilesAdded]
    );

    const previewFile = (file: File) => {
        if (fileObjectUrlMap.current.has(
            `${file.name}-${file.lastModified}`
        )) {
            return fileObjectUrlMap.current.get(
                `${file.name}-${file.lastModified}`
            )!;
        }
        const objectUrl = URL.createObjectURL(file);
        fileObjectUrlMap.current.set(
            `${file.name}-${file.lastModified}`, objectUrl
        );
        return objectUrl;
    }

    const clear = () => {
        fileObjectUrlMap.current.forEach((url) => URL.revokeObjectURL(url));
        fileObjectUrlMap.current.clear();
        setFiles([]);
    }

    const dropzone = useDropzone({
        onDrop,
        accept,
        multiple,
        onDropRejected(fileRejections) {
            fileRejections.forEach((rejection) => {
                rejection.errors.forEach((error) => {
                    toast.error(error.message);
                });
            });
        },
        ...rest,
    });

    return { ...dropzone, files, removeFile, previewFile, clear };
};

export default useDragNDrop;