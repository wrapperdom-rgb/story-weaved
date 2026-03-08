import { useState, useEffect, useCallback } from "react";
import { useGalleryStore, type GalleryItem } from "@/store/galleryStore";
import { Trash2, Edit2, Plus, Save, X, ArrowLeft, Upload, ImageIcon, GripVertical, ArrowUp, ArrowDown, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const ADMIN_PASSWORD = "mvstr2026";

const AdminLoginForm = ({ onAuth }: { onAuth: () => void }) => {
  const [password, setPassword] = useState("");

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
              onAuth();
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
};

const AddItemForm = ({
  onAdd,
  onCancel,
}: {
  onAdd: (item: { src: string; prompt: string; isFree: boolean }) => void;
  onCancel: () => void;
}) => {
  const [newItem, setNewItem] = useState({ src: "", prompt: "", isFree: false });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewItem({ ...newItem, src: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!newItem.src || !newItem.prompt) {
      toast.error("Image and prompt are required");
      return;
    }
    onAdd(newItem);
    setNewItem({ src: "", prompt: "", isFree: false });
  };

  return (
    <div className="border-b border-border p-6 bg-secondary">
      <div className="max-w-2xl mx-auto space-y-3">
        <h3 className="text-xs font-bold tracking-wider text-foreground">ADD NEW ITEM</h3>
        <label className="flex items-center gap-3 w-full px-4 py-3 text-xs font-mono bg-background text-foreground border border-border hover:border-foreground transition-colors cursor-pointer">
          {newItem.src ? (
            <img src={newItem.src} alt="" className="w-10 h-10 object-cover border border-border" />
          ) : (
            <ImageIcon size={16} className="text-muted-foreground" />
          )}
          <span className="text-muted-foreground tracking-wider">
            {newItem.src ? "IMAGE SELECTED — CLICK TO CHANGE" : "CLICK TO UPLOAD IMAGE"}
          </span>
          <Upload size={14} className="ml-auto text-muted-foreground" />
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
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
              onClick={onCancel}
              className="px-4 py-2 text-xs font-bold tracking-wider text-foreground border border-border hover:bg-accent transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GalleryItemRow = ({
  item,
  index,
  totalItems,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  item: GalleryItem;
  index: number;
  totalItems: number;
  onEdit: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}) => (
  <div className="flex gap-4 p-4 hover:bg-secondary/50 transition-colors">
    <div className="flex flex-col gap-1 flex-shrink-0 justify-center">
      <button
        onClick={() => onMoveUp(index)}
        disabled={index === 0}
        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
      >
        <ArrowUp size={12} />
      </button>
      <GripVertical size={14} className="text-muted-foreground mx-auto" />
      <button
        onClick={() => onMoveDown(index)}
        disabled={index === totalItems - 1}
        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
      >
        <ArrowDown size={12} />
      </button>
    </div>

    <img
      src={item.src}
      alt=""
      className="w-20 h-20 object-cover flex-shrink-0 border border-border"
    />

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        {item.isFree && (
          <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider bg-primary text-primary-foreground">
            FREE
          </span>
        )}
        <span className="text-[10px] text-muted-foreground tracking-wider">
          #{index + 1}
        </span>
      </div>
      <p className="text-[11px] text-foreground line-clamp-2 font-mono">{item.prompt}</p>
    </div>

    <div className="flex flex-col gap-1 flex-shrink-0">
      <button
        onClick={() => onEdit(item)}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <Edit2 size={14} />
      </button>
      <button
        onClick={() => onDelete(item.id)}
        className="p-2 text-muted-foreground hover:text-destructive hover:bg-accent transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);

const EditModal = ({
  item,
  onSave,
  onClose,
}: {
  item: GalleryItem;
  onSave: (id: string, updates: Partial<GalleryItem>) => void;
  onClose: () => void;
}) => {
  const [editForm, setEditForm] = useState({
    prompt: item.prompt,
    isFree: item.isFree,
    src: item.src,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditForm({ ...editForm, src: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background border border-border max-w-lg w-full p-6 space-y-4 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-wider text-foreground">EDIT ITEM</h3>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        </div>

        <img src={editForm.src} alt="" className="w-full h-48 object-cover border border-border" />

        <label className="flex items-center gap-2 w-full px-3 py-2 text-xs font-mono bg-secondary text-foreground border border-border hover:border-foreground transition-colors cursor-pointer">
          <Upload size={12} className="text-muted-foreground" />
          <span className="text-[10px] tracking-wider text-muted-foreground">CHANGE IMAGE</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>

        <textarea
          value={editForm.prompt}
          onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
          className="w-full px-3 py-2 text-xs font-mono bg-background text-foreground border border-border focus:border-foreground focus:outline-none resize-none"
          rows={4}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs tracking-wider text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={editForm.isFree}
              onChange={(e) => setEditForm({ ...editForm, isFree: e.target.checked })}
              className="accent-foreground"
            />
            FREE PROMPT
          </label>
          <button
            onClick={() => {
              onSave(item.id, editForm);
              onClose();
            }}
            className="flex items-center gap-1 px-4 py-2 text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Save size={14} />
            SAVE
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

  useEffect(() => {
    if (authenticated) {
      fetchItems();
    }
  }, [authenticated, fetchItems]);

  const handleAdd = async (newItem: { src: string; prompt: string; isFree: boolean }) => {
    if (!user) {
      toast.error("You must be signed in to manage gallery items");
      return;
    }
    await addItem({ ...newItem, sortOrder: 0 });
    setShowAddForm(false);
    toast.success("Item added");
  };

  const handleDelete = async (id: string) => {
    if (!user) {
      toast.error("You must be signed in to manage gallery items");
      return;
    }
    await removeItem(id);
    setConfirmDelete(null);
    toast.success("Item removed");
  };

  const handleSaveEdit = async (id: string, updates: Partial<GalleryItem>) => {
    if (!user) {
      toast.error("You must be signed in to manage gallery items");
      return;
    }
    await updateItem(id, updates);
    toast.success("Item updated");
  };

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index === 0) return;
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      const reordered = newItems.map((item, i) => ({ ...item, sortOrder: i + 1 }));
      reorderItems(reordered);
    },
    [items, reorderItems]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index === items.length - 1) return;
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      const reordered = newItems.map((item, i) => ({ ...item, sortOrder: i + 1 }));
      reorderItems(reordered);
    },
    [items, reorderItems]
  );

  if (!authenticated) {
    return <AdminLoginForm onAuth={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-background z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 text-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-sm font-bold tracking-[0.3em] text-foreground">ADMIN PANEL</h1>
        </div>
        <div className="flex items-center gap-3">
          {!user && (
            <span className="text-[10px] tracking-wider text-destructive font-bold">
              SIGN IN REQUIRED FOR CHANGES
            </span>
          )}
          <span className="text-[10px] tracking-wider text-muted-foreground">
            {items.length} ITEMS
          </span>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 px-3 py-2 text-xs font-bold tracking-wider text-foreground border border-border hover:bg-accent transition-colors"
          >
            <Eye size={14} />
            PREVIEW
          </button>
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
      {showAddForm && <AddItemForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />}

      {/* Loading */}
      {loading && items.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="text-xs tracking-wider text-muted-foreground animate-pulse">LOADING...</div>
        </div>
      )}

      {/* Item List */}
      <div className="divide-y divide-border">
        {items.map((item, index) => (
          <div key={item.id} className="relative">
            <GalleryItemRow
              item={item}
              index={index}
              totalItems={items.length}
              onEdit={setEditingItem}
              onDelete={(id) => setConfirmDelete(id)}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />

            {/* Delete confirmation */}
            {confirmDelete === item.id && (
              <div className="absolute inset-0 bg-background/95 flex items-center justify-center gap-3 z-10">
                <span className="text-xs tracking-wider text-foreground">DELETE THIS ITEM?</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 text-xs font-bold tracking-wider bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
                >
                  YES
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-3 py-1.5 text-xs font-bold tracking-wider border border-border text-foreground hover:bg-accent transition-colors"
                >
                  NO
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <EditModal
          item={editingItem}
          onSave={handleSaveEdit}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
