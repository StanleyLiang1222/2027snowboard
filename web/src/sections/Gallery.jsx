import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LOCATIONS } from "../../api/_lib/locations.js";
import { SectionContainer } from "../components/SectionContainer";
import { Lightbox } from "../components/Lightbox";
import {
  deletePhoto,
  fetchGallery,
  getSavedPassword,
  savePassword,
  updateCaption,
  uploadPhoto,
  verifyPassword,
} from "../lib/galleryApi";

const ghostButton =
  "rounded-buttons border border-mist-border/60 px-4 py-1.5 text-sm text-ivory-text hover:bg-obsidian-button focus-visible:outline-2 focus-visible:outline-cobalt disabled:opacity-50";
const primaryButton =
  "rounded-buttons bg-cobalt px-5 py-2 text-sm font-medium text-pure-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt disabled:opacity-50";

export function Gallery() {
  const [data, setData] = useState(null); // { locations, maxPerLocation }
  const [loadError, setLoadError] = useState("");
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0].id);
  const [password, setPassword] = useState(getSavedPassword);
  const [askingPassword, setAskingPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [captionDraft, setCaptionDraft] = useState("");
  const fileInput = useRef(null);

  const editing = Boolean(password);

  const load = useCallback(async () => {
    try {
      setData(await fetchGallery());
      setLoadError("");
    } catch (err) {
      setLoadError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const maxPerLocation = data?.maxPerLocation ?? 10;
  const photos = useMemo(() => data?.locations?.[activeLocation] ?? [], [data, activeLocation]);
  const location = LOCATIONS.find((l) => l.id === activeLocation);

  const handleAuthError = (err) => {
    if (err.status === 401) {
      savePassword("");
      setPassword("");
      setMessage("密碼已失效，請重新輸入");
    } else {
      setMessage(err.message);
    }
  };

  async function submitPassword(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await verifyPassword(passwordInput);
      savePassword(passwordInput);
      setPassword(passwordInput);
      setPasswordInput("");
      setAskingPassword(false);
    } catch (err) {
      setMessage(err.status === 401 ? "密碼錯誤" : err.message);
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    savePassword("");
    setPassword("");
    setEditingId(null);
    setMessage("");
  }

  async function handleFiles(fileList) {
    const files = Array.from(fileList);
    if (fileInput.current) fileInput.current.value = "";
    if (files.length === 0) return;
    const room = maxPerLocation - photos.length;
    if (room <= 0) {
      setMessage(`${location.name}已滿 ${maxPerLocation} 張，請先刪除再上傳`);
      return;
    }
    const batch = files.slice(0, room);
    setBusy(true);
    let done = 0;
    try {
      for (const file of batch) {
        setMessage(`上傳中 ${done + 1} / ${batch.length}…`);
        await uploadPhoto({ location: activeLocation, file, password });
        done += 1;
      }
      setMessage(
        files.length > room
          ? `已上傳 ${done} 張，其餘 ${files.length - room} 張超過每個地點 ${maxPerLocation} 張上限，沒有上傳`
          : `已上傳 ${done} 張`,
      );
    } catch (err) {
      handleAuthError(err);
    } finally {
      setBusy(false);
      await load();
    }
  }

  async function saveCaption(id) {
    setBusy(true);
    try {
      await updateCaption({ id, caption: captionDraft, password });
      setEditingId(null);
      setMessage("說明已更新");
      await load();
    } catch (err) {
      handleAuthError(err);
    } finally {
      setBusy(false);
    }
  }

  async function removePhoto(id) {
    if (!window.confirm("確定要刪除這張照片嗎？刪除後無法復原。")) return;
    setBusy(true);
    try {
      await deletePhoto({ id, password });
      setMessage("已刪除");
      await load();
    } catch (err) {
      handleAuthError(err);
    } finally {
      setBusy(false);
    }
  }

  const totalPhotos = data ? Object.values(data.locations).reduce((n, list) => n + list.length, 0) : 0;

  return (
    <SectionContainer id="gallery" tone="light" eyebrow="Memories" title="旅程精選影像">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ash-text">
          {data ? `共 ${totalPhotos} 張照片，每個地點最多 ${maxPerLocation} 張` : "每個地點最多 10 張照片"}
        </p>
        {editing ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-champagne-gold">編輯模式</span>
            <button type="button" className={ghostButton} onClick={logout}>
              結束編輯
            </button>
          </div>
        ) : (
          <button type="button" className={ghostButton} onClick={() => setAskingPassword((v) => !v)}>
            管理相簿
          </button>
        )}
      </div>

      {askingPassword && !editing && (
        <form onSubmit={submitPassword} className="mb-6 flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="gallery-password">
            管理密碼
          </label>
          <input
            id="gallery-password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="輸入管理密碼"
            className="rounded-inputs border border-mist-border bg-graphite-card px-5 py-2 text-sm text-ivory-text focus-visible:outline-2 focus-visible:outline-cobalt"
          />
          <button type="submit" className={primaryButton} disabled={busy || !passwordInput}>
            進入編輯
          </button>
        </form>
      )}

      {message && (
        <p role="status" className="mb-4 text-sm text-ivory-text">
          {message}
        </p>
      )}

      <div role="tablist" aria-label="選擇地點" className="mb-6 flex flex-wrap gap-2">
        {LOCATIONS.map((l) => {
          const count = data?.locations?.[l.id]?.length ?? 0;
          const active = l.id === activeLocation;
          return (
            <button
              key={l.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => {
                setActiveLocation(l.id);
                setEditingId(null);
              }}
              className={`rounded-tags border px-4 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-cobalt ${
                active
                  ? "border-cobalt bg-cobalt/15 font-medium text-ivory-text"
                  : "border-mist-border/50 text-ash-text hover:text-ivory-text"
              }`}
            >
              {l.name}
              {count > 0 && <span className="ml-1.5 text-xs text-ash-text">{count}</span>}
            </button>
          );
        })}
      </div>

      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-lg font-medium text-ivory-text">{location.name}</p>
        <p className="text-sm text-ash-text">
          {photos.length} / {maxPerLocation}
        </p>
      </div>

      {editing && (
        <div className="mb-5">
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            id="gallery-upload"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <label
            htmlFor="gallery-upload"
            className={`${primaryButton} inline-block cursor-pointer ${
              busy || photos.length >= maxPerLocation ? "pointer-events-none opacity-50" : ""
            }`}
          >
            上傳照片到{location.name}
          </label>
          <span className="ml-3 text-xs text-ash-text">可一次選多張，會自動壓縮；還能上傳 {Math.max(0, maxPerLocation - photos.length)} 張</span>
        </div>
      )}

      {loadError ? (
        <p className="rounded-cards border border-dashed border-slate-border p-6 text-sm text-ash-text">
          相簿暫時無法載入：{loadError}
        </p>
      ) : !data ? (
        <p className="text-sm text-ash-text">載入中…</p>
      ) : photos.length === 0 ? (
        <p className="rounded-cards border border-dashed border-slate-border p-6 text-sm text-ash-text">
          這一天還沒有照片{editing ? "，用上方按鈕上傳" : ""}。
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p, i) => (
            <li key={p.id} className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                aria-label={`放大第 ${i + 1} 張照片${p.caption ? `：${p.caption}` : ""}`}
                className="overflow-hidden rounded-cards focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
              >
                <img
                  src={p.url}
                  alt={p.caption || `${location.name} 第 ${i + 1} 張`}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </button>

              {editingId === p.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveCaption(p.id);
                  }}
                  className="flex flex-col gap-2"
                >
                  <input
                    autoFocus
                    value={captionDraft}
                    maxLength={80}
                    onChange={(e) => setCaptionDraft(e.target.value)}
                    aria-label="照片說明"
                    className="rounded-inputs border border-mist-border bg-graphite-card px-4 py-1.5 text-sm text-ivory-text focus-visible:outline-2 focus-visible:outline-cobalt"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className={ghostButton} disabled={busy}>
                      儲存
                    </button>
                    <button type="button" className={ghostButton} onClick={() => setEditingId(null)}>
                      取消
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="min-h-5 text-sm text-ash-text">{p.caption}</p>
                  {editing && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={ghostButton}
                        disabled={busy}
                        onClick={() => {
                          setEditingId(p.id);
                          setCaptionDraft(p.caption);
                        }}
                      >
                        編輯說明
                      </button>
                      <button type="button" className={ghostButton} disabled={busy} onClick={() => removePhoto(p.id)}>
                        刪除
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {lightboxIndex !== null && photos.length > 0 && (
        <Lightbox
          photos={photos}
          index={Math.min(lightboxIndex, photos.length - 1)}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </SectionContainer>
  );
}
