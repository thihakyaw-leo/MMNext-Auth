/* Green Ledger direction: file management is a calm, practical workspace with visible ownership, limits, and feedback. */
import { useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, CloudUpload, FileText, Image as ImageIcon, LoaderCircle, Upload, X } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

async function fileToBase64(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const chunkSize = 0x8000;
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...Array.from(bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length))));
  }
  return btoa(binary);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileStorage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const utils = trpc.useUtils();
  const filesQuery = trpc.files.list.useQuery();
  const uploadMutation = trpc.files.upload.useMutation({
    onSuccess: () => {
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = "";
      void utils.files.list.invalidate();
      toast.success("File uploaded to your secure storage.");
    },
    onError: (error) => toast.error(error.message),
  });

  const selectFile = (file?: File) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) { toast.error("Only JPG, PNG, WebP, and PDF files are supported."); return; }
    if (file.size > MAX_FILE_BYTES) { toast.error("Please choose a file smaller than 8 MB."); return; }
    setSelectedFile(file);
  };

  const upload = async () => {
    if (!selectedFile) return;
    uploadMutation.mutate({
      fileName: selectedFile.name,
      mimeType: selectedFile.type,
      sizeBytes: selectedFile.size,
      contentBase64: await fileToBase64(selectedFile),
    });
  };

  return (
    <main className="storage-shell">
      <header className="storage-header">
        <Link href="/login" className="policy-back"><ArrowLeft size={16} /> Back to sign in</Link>
        <div className="policy-brand"><span className="policy-brand-mark">M</span> MMNext <b>POS</b></div>
      </header>
      <section className="storage-content">
        <div className="storage-kicker"><CloudUpload size={15} /> Workspace file storage</div>
        <h1>Keep your files in reach.</h1>
        <p className="storage-lead">Upload receipts, product images, and workspace documents to secure object storage. Files are private to your signed-in workspace.</p>

        <div className="storage-grid">
          <section className="upload-card" aria-label="Upload a file">
            <div className="upload-card__icon"><Upload size={20} /></div>
            <h2>Upload a file</h2>
            <p>JPG, PNG, WebP, or PDF · 8 MB maximum</p>
            <button type="button" className="drop-zone" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files[0]); }}>
              <input ref={inputRef} hidden type="file" accept={ACCEPTED.join(",")} onChange={(event) => selectFile(event.target.files?.[0])} />
              <CloudUpload size={29} />
              <strong>{selectedFile ? selectedFile.name : "Choose a file or drop it here"}</strong>
              <span>{selectedFile ? formatBytes(selectedFile.size) : "Your upload stays linked to this workspace"}</span>
            </button>
            {selectedFile && <div className="selected-file"><span><FileText size={16} /> Ready to upload</span><button type="button" aria-label="Remove selected file" onClick={() => { setSelectedFile(null); if (inputRef.current) inputRef.current.value = ""; }}><X size={16} /></button></div>}
            <button className="submit-button" type="button" disabled={!selectedFile || uploadMutation.isPending} onClick={upload}><span>{uploadMutation.isPending ? "Uploading securely…" : "Upload to storage"}</span>{uploadMutation.isPending ? <LoaderCircle className="button-spinner-icon" size={17} /> : <ArrowLeft className="upload-arrow" size={17} />}</button>
          </section>

          <section className="files-card" aria-label="Stored files">
            <div className="files-card__heading"><div><div className="storage-kicker">Your workspace</div><h2>Stored files</h2></div><span className="file-count">{filesQuery.data?.length ?? 0}</span></div>
            {filesQuery.isLoading && <div className="files-empty"><LoaderCircle className="spin" size={22} /> Loading files…</div>}
            {filesQuery.isError && <div className="files-empty files-empty--error"><X size={24} /><p>Could not load your files.</p><span>{filesQuery.error.message || "Please refresh and try again."}</span><button type="button" className="text-action" onClick={() => void filesQuery.refetch()}>Try again</button></div>}
            {!filesQuery.isLoading && !filesQuery.isError && !filesQuery.data?.length && <div className="files-empty"><ImageIcon size={24} /><p>No files uploaded yet.</p><span>Your first receipt or product image can live here.</span></div>}
            <div className="file-list">{filesQuery.data?.map((file) => <a className="file-row" href={file.url} target="_blank" rel="noreferrer" key={file.id}><span className="file-row__icon"><FileText size={17} /></span><span className="file-row__meta"><strong>{file.fileName}</strong><small>{file.mimeType} · {formatBytes(file.sizeBytes)}</small></span><CheckCircle2 size={16} /></a>)}</div>
          </section>
        </div>
      </section>
    </main>
  );
}
