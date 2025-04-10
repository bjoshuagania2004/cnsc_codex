import { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

export const ReusableFileUpload = ({ fields, onFileChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [dragOverKey, setDragOverKey] = useState(null);

  const handleFileUpdate = (key, files) => {
    if (!files || !files[0]) {
      // Handle deletion/reset
      setUploadedFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[key];
        return newFiles;
      });
      onFileChange?.(key, null);
      return;
    }

    const file = files[0];
    setUploadedFiles((prev) => ({
      ...prev,
      [key]: file,
    }));
    onFileChange?.(key, files);
  };

  const handleDrop = useCallback(
    (e, key) => {
      e.preventDefault();
      setDragOverKey(null);
      const files = e.dataTransfer.files;
      handleFileUpdate(key, files);
    },
    [onFileChange]
  );

  const handleFileInputChange = (key, e) => {
    handleFileUpdate(key, e.target.files);
  };

  const handleDelete = (key) => {
    handleFileUpdate(key, null);
  };
  const triggerFileInput = (key) => {
    const input = document.getElementById(`file-input-${key}`);
    if (input) input.click();
  };

  const isImage = (file) => file && file.type.startsWith("image/");

  const getPreviewUrl = (file) => URL.createObjectURL(file);

  return (
    <div>
      {Object.entries(fields).map(([key, { label, accept }]) => {
        const file = uploadedFiles[key];
        const isDragging = dragOverKey === key;
        const isDisabled = Boolean(file);

        return (
          <div key={key} className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {label}
            </label>

            {!file ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverKey(key);
                }}
                onDragLeave={() => setDragOverKey(null)}
                onDrop={(e) => handleDrop(e, key)}
                onClick={() => !isDisabled && triggerFileInput(key)}
                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg transition cursor-pointer ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <FontAwesomeIcon
                  icon={faCloudUploadAlt}
                  className="text-3xl text-blue-500 mb-2"
                />
                <p className="text-gray-700 text-sm text-center">
                  Drag & drop or{" "}
                  <span className="text-blue-600 underline">
                    click to upload
                  </span>
                </p>
                <input
                  id={`file-input-${key}`}
                  type="file"
                  accept={accept}
                  disabled={isDisabled}
                  onChange={(e) => handleFileInputChange(key, e)}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="mt-3 flex items-center space-x-4 bg-gray-100 p-3 rounded-md shadow-sm">
                {isImage(file) ? (
                  <img
                    src={getPreviewUrl(file)}
                    alt={file.name}
                    className="w-16 h-16 object-cover rounded shadow"
                  />
                ) : (
                  <div className="text-gray-600 text-sm truncate max-w-xs">
                    📄 {file.name}
                  </div>
                )}
                <button
                  onClick={() => handleDelete(key)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete file"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
