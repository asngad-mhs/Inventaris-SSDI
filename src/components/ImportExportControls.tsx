import React, { useRef, useState } from 'react';
import { Download, Upload, AlertOctagon, RefreshCw } from 'lucide-react';
import { InventarisItem } from '../types';

interface ImportExportControlsProps {
  onExport: () => void;
  onImport: (importedItems: InventarisItem[]) => void;
  onResetToDefault: () => void;
}

export default function ImportExportControls({
  onExport,
  onImport,
  onResetToDefault
}: ImportExportControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processJSONFile(file);
    }
  };

  const processJSONFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (Array.isArray(parsed)) {
          // Robust structure validation & alignment mapping
          const validData: InventarisItem[] = parsed
            .filter((item: any) => item && typeof item === 'object')
            .map((item: any) => ({
              id: typeof item.id === 'number' ? item.id : Date.now() + Math.random(),
              nama: typeof item.nama === 'string' && item.nama.trim() ? item.nama.trim() : (item.nama_barang || 'Tanpa Nama'),
              kategori: typeof item.kategori === 'string' && item.kategori.trim() ? item.kategori.trim() : (item.kategori_barang || 'Umum'),
              jumlah: typeof item.jumlah === 'number' ? item.jumlah : (parseInt(item.jumlah) || 0),
              kondisi: (item.kondisi === 'Baik' || item.kondisi === 'Rusak') ? item.kondisi : 'Baik'
            }));

          if (validData.length > 0) {
            onImport(validData);
          } else {
            alert('❌ File JSON tidak mengandung data barang yang valid.');
          }
        } else {
          alert('❌ Format JSON harus berupa array barang.');
        }
      } catch (err: any) {
        alert('❌ Gagal membaca file JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave" || e.type === "drop") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/json" || file.name.endsWith('.json')) {
        processJSONFile(file);
      } else {
        alert('❌ Hanya file .json yang diperbolehkan.');
      }
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative p-4 md:p-5 rounded-xl border border-dashed transition-all duration-200 mt-6 ${
        dragActive 
          ? 'border-indigo-500 bg-indigo-50/50' 
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        {dragActive ? (
          <div className="text-center py-2 flex items-center gap-1.5 text-indigo-600 font-medium">
            <Upload className="w-5 h-5 animate-bounce" />
            <span>Lepaskan file JSON untuk mengimpor data langsung...</span>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
              {/* Export Button */}
              <button
                id="exportBtn"
                onClick={onExport}
                className="bg-gray-700 hover:bg-gray-800 active:scale-95 text-white text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 shadow-sm transition duration-150 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              {/* Import Button */}
              <input
                type="file"
                id="importFileInput"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                id="importBtn"
                onClick={handleImportClick}
                className="bg-gray-500 hover:bg-gray-600 active:scale-95 text-white text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 shadow-sm transition duration-150 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
              </button>

              {/* Reset Button */}
              <button
                id="resetDataBtn"
                onClick={onResetToDefault}
                className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 shadow-sm transition duration-150 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset ke Default</span>
              </button>
            </div>

            <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
              <span>💾</span>
              <span>Tersimpan di localStorage</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
