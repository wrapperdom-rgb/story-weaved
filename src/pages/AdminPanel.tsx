import { useState, useEffect, useCallback } from "react";
import { useGalleryStore, type GalleryItem } from "@/store/galleryStore";
import { Trash2, Edit2, Plus, Save, X, ArrowLeft, Upload, ImageIcon, GripVertical, ArrowUp, ArrowDown, Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const ADMIN_EMAIL = "wrapperdom@gmail.com";
const ADMIN_PASSWORD = "mvstr2026";

const ASPECT_RATIOS = [
  { value: "original", label: "ORIGINAL" },
  { value: "1:1", label: "1:1" },
  { value: "4:5", label: "4:5" },
  { value: "3:4", label: "3:4" },
  { value: "9:16", label: "9:16" },
];

const AdminLoginForm = ({ onAuth }: { onAuth: () => void }) => {
  const [password, setPassword] = useState("");
  const { user } = useAuth();

  const isAdminUser = user?.email === ADMIN_EMAIL;

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-sm w-full space-y-6 text-center">
          <h1 className="text-sm font-bold tracking-[0.3em] text-foreground">ADMIN ACCESS</h1>
          <p className="text-[10px] tracking-wider text-muted-foreground">
            {user ? "YOU DON'T HAVE ADMIN ACCESS" : "SIGN IN WITH ADMIN ACCOUNT FIRST"}
          </p>
          <a href="/sign-in" className="inline-block px-4 py-3 text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            {user ? "SWITCH ACCOUNT" : "SIGN IN"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-sm w-full space-y-6">
        <h1 className="text-sm font-bold tracking-[0.3em] text-foreground text-center">ADMIN ACCESS</h1>
        <p className="text-[10px] tracking-wider text-muted-foreground text-center">SIGNED IN AS {user.email}</p>
        <form onSubmit={(e) => { e.preventDefault(); if (password === ADMIN_PASSWORD) onAuth(); else toast.error("Incorrect password"); }} className="space-y-3">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password" className="w-full px-4 py-3 text-xs font-mono tracking-wider bg-background text-foreground border border-border focus:border-foreground focus:outline-none transition-colors" />
          <button type="submit" className="w-full px-4 py-3 text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity">ENTER</button>
        </form>
      </div>
    </div>
  );
};

const AddItemForm = ({
  onAdd,
  onCancel,
}: {
  onAdd: (item: { file: File; prompt: string; isFree: boolean }) => Promise<void>;
  onCancel: () => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async () => {
    if (!file || !prompt) {
      toast.error("Image and prompt are required");
      return;
    }
    setSaving(true);
    await onAdd({ file, prompt, isFree });
    setSaving(false);
  };

  return (
    <div className="border-b border-border p-6 bg-secondary">
      <div className="max-w-2xl mx-auto space-y-3">
        <h3 className="text-xs font-bold tracking-wider text-foreground">ADD NEW ITEM</h3>
        <label className="flex items-center gap-3 w-full px-4 py-3 text-xs font-mono bg-background text-foreground border border-border hover:border-foreground transition-colors cursor-pointer">
          {preview ? (
            <img src={preview} alt="" className="w-10 h-10 object-cover border border-border" />
          ) : (
            <ImageIcon size={16} className="text-muted-foreground" />
          )}
          <span className="text-muted-foreground tracking-wider">
            {preview ? "IMAGE SELECTED — CLICK TO CHANGE" : "CLICK TO UPLOAD IMAGE"}
          </span>
          <Upload size={14} className="ml-auto text-muted-foreground" />
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="AI Prompt" rows={3} className="w-full px-4 py-3 text-xs font-mono bg-background text-foreground border border-border focus:border-foreground focus:outline-none resize-none" />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs tracking-wider text-foreground cursor-pointer">
            <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="accent-foreground" />
            FREE PROMPT
          </label>
          <div className="flex gap-2">
            <button onClick={onCancel} className="px-4 py-2 text-xs font-bold tracking-wider text-foreground border border-border hover:bg-accent transition-colors">CANCEL</button>
            <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-1 px-4 py-2 text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving && <Loader2 size={12} className="animate-spin" />}
              {saving ? "UPLOADING..." : "SAVE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GalleryItemRow = ({ item, index, totalItems, onEdit, onDelete, onMoveUp, onMoveDown }: {
  item: GalleryItem; index: number; totalItems: number;
  onEdit: (item: GalleryItem) => void; onDelete: (id: string) => void;
  onMoveUp: (index: number) => void; onMoveDown: (index: number) => void;
}) => (
  <div className="flex gap-4 p-4 hover:bg-secondary/50 transition-colors">
    <div className="flex flex-col gap-1 flex-shrink-0 justify-center">
      <button onClick={() => onMoveUp(index)} disabled={index === 0} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"><ArrowUp size={12} /></button>
      <GripVertical size={14} className="text-muted-foreground mx-auto" />
      <button onClick={() => onMoveDown(index)} disabled={index === totalItems - 1} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"><ArrowDown size={12} /></button>
    </div>
    <img src={item.src} alt="" className="w-20 h-20 object-cover flex-shrink-0 border border-border" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        {item.isFree && <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider bg-primary text-primary-foreground">FREE</span>}
        <span className="text-[10px] text-muted-foreground tracking-wider">#{index + 1}</span>
      </div>
      <p className="text-[11px] text-foreground line-clamp-2 font-mono">{item.prompt}</p>
    </div>
    <div className="flex flex-col gap-1 flex-shrink-0">
      <button onClick={() => onEdit(item)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"><Edit2 size={14} /></button>
      <button onClick={() => onDelete(item.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-accent transition-colors"><Trash2 size={14} /></button>
    </div>
  </div>
);

const EditModal = ({ item, onSave, onClose }: {
  item: GalleryItem;
  onSave: (id: string, updates: Partial<GalleryItem> & { file?: File }) => Promise<void>;
  onClose: () => void;
}) => {
  const [editForm, setEditForm] = useState({ prompt: item.prompt, isFree: item.isFree, src: item.src });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(item.src);
  const [saving, setSaving] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(item.id, { prompt: editForm.prompt, isFree: editForm.isFree, ...(file ? { file } : {}) });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background border border-border max-w-lg w-full p-6 space-y-4 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-wider text-foreground">EDIT ITEM</h3>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground"><X size={16} /></button>
        </div>
        <img src={preview} alt="" className="w-full h-48 object-cover border border-border" />
        <label className="flex items-center gap-2 w-full px-3 py-2 text-xs font-mono bg-secondary text-foreground border border-border hover:border-foreground transition-colors cursor-pointer">
          <Upload size={12} className="text-muted-foreground" />
          <span className="text-[10px] tracking-wider text-muted-foreground">CHANGE IMAGE</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
        <textarea value={editForm.prompt} onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })} className="w-full px-3 py-2 text-xs font-mono bg-background text-foreground border border-border focus:border-foreground focus:outline-none resize-none" rows={4} />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs tracking-wider text-foreground cursor-pointer">
            <input type="checkbox" checked={editForm.isFree} onChange={(e) => setEditForm({ ...editForm, isFree: e.target.checked })} className="accent-foreground" />
            FREE PROMPT
          </label>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 px-4 py-2 text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving && <Loader2 size={12} className="animate-spin" />}
            <Save size={14} />
            {saving ? "SAVING..." : "SAVE"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { items, loading, fetchItems, removeItem, updateItem, addItem, reorderItems } = useGalleryStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (authenticated) fetchItems(); }, [authenticated, fetchItems]);

  const handleAdd = async (newItem: { file: File; prompt: string; isFree: boolean }) => {
    if (!user) { toast.error("You must be signed in"); return; }
    await addItem({ file: newItem.file, prompt: newItem.prompt, isFree: newItem.isFree, sortOrder: 0 });
    setShowAddForm(false);
    toast.success("Item added");
  };

  const handleDelete = async (id: string) => {
    if (!user) { toast.error("You must be signed in"); return; }
    await removeItem(id);
    setConfirmDelete(null);
    toast.success("Item removed");
  };

  const handleSaveEdit = async (id: string, updates: Partial<GalleryItem> & { file?: File }) => {
    if (!user) { toast.error("You must be signed in"); return; }
    await updateItem(id, updates);
    toast.success("Item updated");
  };

  const handleMoveUp = useCallback((index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    reorderItems(newItems.map((item, i) => ({ ...item, sortOrder: i + 1 })));
  }, [items, reorderItems]);

  const handleMoveDown = useCallback((index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    reorderItems(newItems.map((item, i) => ({ ...item, sortOrder: i + 1 })));
  }, [items, reorderItems]);

  if (!authenticated) return <AdminLoginForm onAuth={() => setAuthenticated(true)} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-background z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="p-2 text-foreground hover:bg-accent transition-colors"><ArrowLeft size={16} /></button>
          <h1 className="text-sm font-bold tracking-[0.3em] text-foreground">ADMIN PANEL</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] tracking-wider text-muted-foreground">{items.length} ITEMS</span>
          <button onClick={() => navigate("/")} className="flex items-center gap-1 px-3 py-2 text-xs font-bold tracking-wider text-foreground border border-border hover:bg-accent transition-colors"><Eye size={14} />PREVIEW</button>
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1 px-3 py-2 text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity"><Plus size={14} />ADD</button>
        </div>
      </div>

      {showAddForm && <AddItemForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />}

      {loading && items.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="text-xs tracking-wider text-muted-foreground animate-pulse">LOADING...</div>
        </div>
      )}

      <div className="divide-y divide-border">
        {items.map((item, index) => (
          <div key={item.id} className="relative">
            <GalleryItemRow item={item} index={index} totalItems={items.length} onEdit={setEditingItem} onDelete={(id) => setConfirmDelete(id)} onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} />
            {confirmDelete === item.id && (
              <div className="absolute inset-0 bg-background/95 flex items-center justify-center gap-3 z-10">
                <span className="text-xs tracking-wider text-foreground">DELETE THIS ITEM?</span>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 text-xs font-bold tracking-wider bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity">YES</button>
                <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 text-xs font-bold tracking-wider border border-border text-foreground hover:bg-accent transition-colors">NO</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingItem && <EditModal item={editingItem} onSave={handleSaveEdit} onClose={() => setEditingItem(null)} />}
    </div>
  );
};

export default AdminPanel;
