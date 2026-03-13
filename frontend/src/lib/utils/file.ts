export function formatFileSize(
    size: number,
    unit: "KB" | "MB" | "GB"
): string {
    const converter = {
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
    }
    const convertedSize = size / converter[unit];
    return `${convertedSize.toFixed(2)} ${unit}`;
}

type Options = {
    sizeUnit?: "KB" | "MB" | "GB";
}

export function getFileDetail(file: File, options?: Options) {
    const fileName = file.name.split(".").slice(0, -1).join(".");
    const fileExtension = file.name.split(".").slice(-1)[0];
    const fileSize = file.size;
    return {
        fileName,
        fileExtension,
        fileSize: formatFileSize(fileSize, options?.sizeUnit || "MB")
    };
}