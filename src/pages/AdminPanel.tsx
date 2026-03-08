import { useState } from "react";
import { useGalleryStore, type GalleryItem } from "@/store/galleryStore";
import { Trash2, Edit2, Plus, Save, X, ArrowLeft, Upload, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ADMIN_PASSWORD = "mvstr2026";

const AdminPanel = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<GalleryItem>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ src: "", prompt: "", isFree: false });

  const { items, removeItem, updateItem, addItem } = useGalleryStore();
  const navigate = useNavigate();

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-sm w-full space-y-6">
          <h1 className="text-sm font-bold tracking-[0.3em] text-foreground text-center">
            ADMIN ACCESS
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password === ADMIN_PASSWORD) {
                setAuthenticated(true);
              } else {
                toast.error("Incorrect password");
              }
            }}
            className="space-y-3"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 text-xs font-mono tracking-wider bg-background text-foreground border border-border focus:border-foreground focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              ENTER
            </button>
          </form>
        </div>
      </div>
    );
  }

  const startEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setEditForm({ prompt: item.prompt, isFree: item.isFree, src: item.src });
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      updateItem(editingId, editForm);
      setEditingId(null);
      setEditForm({});
      toast.success("Item updated");
    }
  };

  const handleDelete = (id: string) => {
    removeItem(id);
    toast.success("Item removed");
  };

  const handleAdd = () => {
    if (!newItem.src || !newItem.prompt) {
      toast.error("Image URL and prompt are required");
      return;
    }
    addItem(newItem);
    setNewItem({ src: "", prompt: "", isFree: false });
    setShowAddForm(false);
    toast.success("Item added");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 text-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-sm font-bold tracking-[0.3em] text-foreground">ADMIN PANEL</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-wider text-muted-foreground">
            {items.length} ITEMS
          </span>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 px-3 py-2 text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            ADD
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="border-b border-border p-6 bg-secondary">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-xs font-bold tracking-wider text-foreground">ADD NEW ITEM</h3>
            <input
              type="text"
              value={newItem.src}
              onChange={(e) => setNewItem({ ...newItem, src: e.target.value })}
              placeholder="Image URL (paste external URL or asset path)"
              className="w-full px-4 py-3 text-xs font-mono bg-background text-foreground border border-border focus:border-foreground focus:outline-none"
            />
            <textarea
              value={newItem.prompt}
              onChange={(e) => setNewItem({ ...newItem, prompt: e.target.value })}
              placeholder="AI Prompt"
              rows={3}
              className="w-full px-4 py-3 text-xs font-mono bg-background text-foreground border border-border focus:border-foreground focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs tracking-wider text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={newItem.isFree}
                  onChange={(e) => setNewItem({ ...newItem, isFree: e.target.checked })}
                  className="accent-foreground"
                />
                FREE PROMPT
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-bold tracking-wider text-foreground border border-border hover:bg-accent transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item List */}
      <div className="divide-y divide-border">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 hover:bg-secondary/50 transition-colors">
            <img
              src={item.src}
              alt=""
              className="w-20 h-20 object-cover flex-shrink-0 border border-border"
            />

            {editingId === item.id ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={editForm.src || ""}
                  onChange={(e) => setEditForm({ ...editForm, src: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono bg-background text-foreground border border-border focus:border-foreground focus:outline-none"
                  placeholder="Image URL"
                />
                <textarea
                  value={editForm.prompt || ""}
                  onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono bg-background text-foreground border border-border focus:border-foreground focus:outline-none resize-none"
                  rows={2}
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-[10px] tracking-wider text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.isFree || false}
                      onChange={(e) => setEditForm({ ...editForm, isFree: e.target.checked })}
                      className="accent-foreground"
                    />
                    FREE
                  </label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setEditingId(null); setEditForm({}); }}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <button
                      onClick={saveEdit}
                      className="p-2 text-foreground hover:bg-accent transition-colors"
                    >
                      <Save size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {item.isFree && (
                    <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider bg-primary text-primary-foreground">
                      FREE
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground tracking-wider">
                    ID: {item.id}
                  </span>
                </div>
                <p className="text-[11px] text-foreground line-clamp-2 font-mono">
                  {item.prompt}
                </p>
              </div>
            )}

            {editingId !== item.id && (
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button
                  onClick={() => startEdit(item)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-accent transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
