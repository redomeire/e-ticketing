"use client";
import React, { useEffect } from "react";
import { Card } from "./card";
import { useFormContext } from "react-hook-form";
import useDragNDrop from "@/hooks/use-drag-and-drop";
import { Accept, DropzoneProps } from "react-dropzone";
import Link from "next/link";
import { formatFileSize, getFileDetail } from "@/lib/utils/file";
import { HugeiconsIcon } from "@hugeicons/react";
import { Trash, Upload, Image01Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";

interface Props {
  name?: string;
  withValidation?: boolean;
  withPreview?: boolean;
  cover_image_url?: string; // Tambahkan properti ini
  options?: DropzoneProps;
}

const formatAcceptedFileTypes = (accept: Accept) => {
  return Object.keys(accept)
    .map((key, index, array) => {
      const format = key.replace(/^(image\/|video\/)/, "");
      return index === array.length - 1 && array.length > 1
        ? `or ${format.toUpperCase()}`
        : format.toUpperCase();
    })
    .join(", ");
};

const DropzoneComponent: React.FC<Props> = (props: Props) => {
  const useOptionalFormContext = () => {
    try {
      return useFormContext();
    } catch {
      return null;
    }
  };

  const form = useOptionalFormContext();
  const registration =
    props.withValidation && form && props.name ? form.register(props.name) : {};

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const valueToSet = props.options?.multiple === false
        ? acceptedFiles[0]
        : acceptedFiles;

      form?.setValue(props.name || "", valueToSet, { shouldValidate: true });
      form?.trigger(props.name || "");
    }
  };

  const {
    removeFile,
    getRootProps,
    getInputProps,
    isDragActive,
    previewFile,
    clear,
    files,
  } = useDragNDrop({
    onFilesAdded: onDrop,
    ...props.options,
  });

  useEffect(() => {
    if (form?.formState.isSubmitSuccessful) {
      clear();
    }
  }, [clear, form?.formState.isSubmitSuccessful]);

  // Logic Determinator
  const isMultiple = props.options?.multiple !== false;
  const hasFile = files.length > 0;
  const isFirstFileImage = hasFile && files[0].type.startsWith("image/");

  // Kondisi Baru: Tampilkan preview penuh jika (ada file baru tipe gambar) ATAU (ada URL gambar lama & belum ada file baru)
  const showFullPreview = props.withPreview && !isMultiple && (isFirstFileImage || (!!props.cover_image_url && !hasFile));

  // Tentukan URL mana yang ditampilkan
  const displayImageSrc = hasFile ? previewFile(files[0]) : props.cover_image_url;

  return (
    <Card title="">
      <div className="relative group transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-[#019C98] overflow-hidden">

        {/* Full Image Preview Mode */}
        {showFullPreview && displayImageSrc && (
          <div className="absolute inset-0 z-10 bg-white dark:bg-gray-900">
            <Image
              fill
              src={displayImageSrc}
              alt="Preview"
              className="object-cover"
              unoptimized={displayImageSrc.startsWith('http')} // Untuk menghindari error next/image pada URL luar
            />
            {/* Overlay untuk tombol hapus/ganti */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clear();
                  // Jika ini adalah URL dari database, kamu mungkin ingin memberi tahu form bahwa gambar dihapus
                  if (!hasFile && props.name) {
                    form?.setValue(props.name, null);
                  }
                }}
                className="p-3 bg-white/20 hover:bg-red-500 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-110"
              >
                <HugeiconsIcon icon={Trash} size={24} />
              </button>
            </div>
          </div>
        )}

        <div
          {...getRootProps()}
          className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10 transition-all
          ${isDragActive
              ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
              : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
            }
          ${showFullPreview && displayImageSrc ? "opacity-0" : "opacity-100"}
        `}
        >
          <input name={props.name} {...registration} {...getInputProps()} />

          <div className="dz-message flex flex-col items-center m-0!">
            <div className="mb-5.5 flex justify-center">
              <HugeiconsIcon icon={Upload} size={48} className="text-[#019C98]" />
            </div>

            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90 text-center">
              {isDragActive ? (
                "Drop Files Here"
              ) : (
                <>
                  <span className="text-[#019C98] underline">Click to upload</span> or drag and drop
                </>
              )}
            </h4>

            <span className="text-center mb-5 block w-full text-sm text-gray-700 dark:text-gray-400">
              {props.options?.accept
                ? formatAcceptedFileTypes(props.options.accept)
                : "Supported formats: All"}{" "}
              (max. {formatFileSize(props.options?.maxSize ?? 0, "MB")})
            </span>
          </div>
        </div>
      </div>

      {/* List view hanya muncul jika Multiple Mode atau file baru bukan image */}
      {(isMultiple || (!showFullPreview && hasFile)) && (
        <div className="mt-4">
          <ul className="text-gray-700 dark:text-gray-400 space-y-5 px-5">
            {files.map((file) => {
              const { fileName, fileSize, fileExtension } = getFileDetail(file, {
                sizeUnit: "MB",
              });

              const isImage = file.type.startsWith("image/");
              const showMiniPreview = props.withPreview && isImage;

              return (
                <li
                  key={file.name}
                  className="flex items-center justify-between gap-3 p-2 rounded-lg border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-4 truncate">
                    <div className="shrink-0 w-12 h-12 relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                      {showMiniPreview ? (
                        <Image
                          fill
                          src={previewFile(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HugeiconsIcon
                            icon={isImage ? Image01Icon : Upload}
                            size={20}
                            className="text-gray-400"
                          />
                        </div>
                      )}
                    </div>

                    <div className="truncate">
                      <p className="flex items-center hover:underline hover:text-[#019C98] transition">
                        <Link
                          href={previewFile(file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate font-medium text-sm text-gray-800 dark:text-white/90"
                        >
                          {fileName}
                        </Link>
                        <span className="text-sm">.{fileExtension}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {fileSize} • Complete
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(file)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors group"
                  >
                    <HugeiconsIcon
                      icon={Trash}
                      size={18}
                      className="text-gray-400 group-hover:text-red-500 transition-colors"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default DropzoneComponent;