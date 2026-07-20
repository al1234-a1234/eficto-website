"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PlusIcon, TrashIcon, CheckIcon, ArrowUpIcon, ArrowDownIcon } from "@/components/icons";
import type { MenuCategory, MenuItem } from "@/lib/types";

function byOrder<T extends { sort_order: number }>(a: T, b: T) {
  return a.sort_order - b.sort_order;
}

const inputClass =
  "w-full rounded-lg border border-eficto-gold/30 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-eficto-gold";

export function MenuManager({
  initialCategories,
  initialItems,
}: {
  initialCategories: MenuCategory[];
  initialItems: MenuItem[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [items, setItems] = useState(initialItems);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryAr, setNewCategoryAr] = useState("");
  const [newCategoryEn, setNewCategoryEn] = useState("");

  const supabase = createClient();

  async function addCategory() {
    const nameAr = newCategoryAr.trim();
    if (!nameAr) return;
    const sortOrder = categories.length > 0 ? Math.max(...categories.map((c) => c.sort_order)) + 1 : 0;
    const { data } = await supabase
      .from("eficto_menu_categories")
      .insert({ name_ar: nameAr, name_en: newCategoryEn.trim() || null, sort_order: sortOrder })
      .select()
      .single();
    if (data) setCategories((prev) => [...prev, data]);
    setNewCategoryAr("");
    setNewCategoryEn("");
    setAddingCategory(false);
  }

  async function updateCategory(id: string, patch: Partial<MenuCategory>) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    await supabase.from("eficto_menu_categories").update(patch).eq("id", id);
  }

  async function deleteCategory(id: string) {
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    if (!confirm(`حذف قسم "${category.name_ar}" وكل أصنافه؟`)) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setItems((prev) => prev.filter((i) => i.category_id !== id));
    await supabase.from("eficto_menu_categories").delete().eq("id", id);
  }

  async function moveCategory(id: string, dir: "up" | "down") {
    const sorted = [...categories].sort(byOrder);
    const idx = sorted.findIndex((c) => c.id === id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (idx === -1 || swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    setCategories((prev) =>
      prev.map((c) => (c.id === a.id ? { ...c, sort_order: b.sort_order } : c.id === b.id ? { ...c, sort_order: a.sort_order } : c))
    );
    await Promise.all([
      supabase.from("eficto_menu_categories").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("eficto_menu_categories").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
  }

  async function addItem(categoryId: string, draft: { name_ar: string; name_en: string; price_sar: string; description_ar: string }) {
    const nameAr = draft.name_ar.trim();
    const price = parseFloat(draft.price_sar);
    if (!nameAr || Number.isNaN(price)) return;
    const categoryItems = items.filter((i) => i.category_id === categoryId);
    const sortOrder = categoryItems.length > 0 ? Math.max(...categoryItems.map((i) => i.sort_order)) + 1 : 0;
    const { data } = await supabase
      .from("eficto_menu_items")
      .insert({
        category_id: categoryId,
        name_ar: nameAr,
        name_en: draft.name_en.trim() || null,
        description_ar: draft.description_ar.trim() || null,
        price_sar: price,
        sort_order: sortOrder,
      })
      .select()
      .single();
    if (data) setItems((prev) => [...prev, data]);
  }

  async function updateItem(id: string, patch: Partial<MenuItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    await supabase.from("eficto_menu_items").update(patch).eq("id", id);
  }

  async function deleteItem(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    if (!confirm(`حذف صنف "${item.name_ar}"؟`)) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await supabase.from("eficto_menu_items").delete().eq("id", id);
  }

  async function moveItem(id: string, categoryId: string, dir: "up" | "down") {
    const sorted = items.filter((i) => i.category_id === categoryId).sort(byOrder);
    const idx = sorted.findIndex((i) => i.id === id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (idx === -1 || swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    setItems((prev) =>
      prev.map((i) => (i.id === a.id ? { ...i, sort_order: b.sort_order } : i.id === b.id ? { ...i, sort_order: a.sort_order } : i))
    );
    await Promise.all([
      supabase.from("eficto_menu_items").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("eficto_menu_items").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
  }

  const sortedCategories = [...categories].sort(byOrder);

  return (
    <div className="mt-6 space-y-6">
      {sortedCategories.map((category, catIdx) => (
        <CategoryCard
          key={category.id}
          category={category}
          items={items.filter((i) => i.category_id === category.id).sort(byOrder)}
          isFirst={catIdx === 0}
          isLast={catIdx === sortedCategories.length - 1}
          onUpdateCategory={(patch) => updateCategory(category.id, patch)}
          onDeleteCategory={() => deleteCategory(category.id)}
          onMoveCategory={(dir) => moveCategory(category.id, dir)}
          onAddItem={(draft) => addItem(category.id, draft)}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
          onMoveItem={(id, dir) => moveItem(id, category.id, dir)}
        />
      ))}

      {categories.length === 0 && (
        <p className="rounded-2xl border border-eficto-gold/25 bg-white p-8 text-center text-sm text-eficto-green-dark/50 shadow-premium">
          لا يوجد أقسام بعد — ابدأ بإضافة أول قسم لقائمتك
        </p>
      )}

      {addingCategory ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-eficto-gold/30 bg-white p-5 shadow-premium sm:flex-row sm:items-center">
          <input
            value={newCategoryAr}
            onChange={(e) => setNewCategoryAr(e.target.value)}
            placeholder="اسم القسم بالعربي (مثال: المقبلات)"
            className={inputClass + " sm:max-w-xs"}
            autoFocus
          />
          <input
            value={newCategoryEn}
            onChange={(e) => setNewCategoryEn(e.target.value)}
            placeholder="Name in English (اختياري)"
            dir="ltr"
            className={inputClass + " sm:max-w-xs"}
          />
          <div className="flex gap-2">
            <button
              onClick={addCategory}
              className="rounded-full bg-eficto-green px-5 py-2 text-sm text-eficto-cream transition-transform hover:scale-105"
            >
              إضافة
            </button>
            <button
              onClick={() => setAddingCategory(false)}
              className="rounded-full border border-eficto-gold/30 px-5 py-2 text-sm text-eficto-green-dark/70"
            >
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingCategory(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-eficto-gold/40 bg-white/60 py-5 text-sm text-eficto-green-dark/70 transition-colors hover:border-eficto-gold hover:text-eficto-green-dark"
        >
          <PlusIcon className="h-4 w-4" />
          إضافة قسم جديد
        </button>
      )}
    </div>
  );
}

function CategoryCard({
  category,
  items,
  isFirst,
  isLast,
  onUpdateCategory,
  onDeleteCategory,
  onMoveCategory,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onMoveItem,
}: {
  category: MenuCategory;
  items: MenuItem[];
  isFirst: boolean;
  isLast: boolean;
  onUpdateCategory: (patch: Partial<MenuCategory>) => void;
  onDeleteCategory: () => void;
  onMoveCategory: (dir: "up" | "down") => void;
  onAddItem: (draft: { name_ar: string; name_en: string; price_sar: string; description_ar: string }) => void;
  onUpdateItem: (id: string, patch: Partial<MenuItem>) => void;
  onDeleteItem: (id: string) => void;
  onMoveItem: (id: string, dir: "up" | "down") => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [nameAr, setNameAr] = useState(category.name_ar);
  const [nameEn, setNameEn] = useState(category.name_en ?? "");
  const [addingItem, setAddingItem] = useState(false);
  const [draft, setDraft] = useState({ name_ar: "", name_en: "", price_sar: "", description_ar: "" });

  function saveName() {
    onUpdateCategory({ name_ar: nameAr.trim() || category.name_ar, name_en: nameEn.trim() || null });
    setEditingName(false);
  }

  function submitItem() {
    onAddItem(draft);
    setDraft({ name_ar: "", name_en: "", price_sar: "", description_ar: "" });
    setAddingItem(false);
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border shadow-premium ${
        category.active ? "border-eficto-gold/25 bg-white" : "border-eficto-gold/15 bg-white/50"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-eficto-gold/15 bg-eficto-cream/40 px-5 py-4">
        {editingName ? (
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <input value={nameAr} onChange={(e) => setNameAr(e.target.value)} className={inputClass + " max-w-[180px]"} autoFocus />
            <input
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              dir="ltr"
              placeholder="English"
              className={inputClass + " max-w-[180px]"}
            />
            <button onClick={saveName} className="rounded-full bg-eficto-green p-2 text-eficto-cream">
              <CheckIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button onClick={() => setEditingName(true)} className="text-right">
            <h2 className="font-serif text-lg text-eficto-green-dark">{category.name_ar}</h2>
            {category.name_en && <p className="text-xs text-eficto-green-dark/50">{category.name_en}</p>}
          </button>
        )}

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onMoveCategory("up")}
            disabled={isFirst}
            className="rounded-lg p-1.5 text-eficto-green-dark/50 transition-colors hover:bg-eficto-gold/10 disabled:opacity-30"
            aria-label="نقل لأعلى"
          >
            <ArrowUpIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onMoveCategory("down")}
            disabled={isLast}
            className="rounded-lg p-1.5 text-eficto-green-dark/50 transition-colors hover:bg-eficto-gold/10 disabled:opacity-30"
            aria-label="نقل لأسفل"
          >
            <ArrowDownIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onUpdateCategory({ active: !category.active })}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
              category.active ? "bg-eficto-green/10 text-eficto-green" : "bg-eficto-alert/10 text-eficto-alert"
            }`}
          >
            {category.active ? "ظاهر بالقائمة" : "مخفي"}
          </button>
          <button
            onClick={onDeleteCategory}
            className="rounded-lg p-1.5 text-eficto-alert/70 transition-colors hover:bg-eficto-alert/10"
            aria-label="حذف القسم"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-eficto-gold/10 px-5">
        {items.map((item, idx) => (
          <ItemRow
            key={item.id}
            item={item}
            isFirst={idx === 0}
            isLast={idx === items.length - 1}
            onUpdate={(patch) => onUpdateItem(item.id, patch)}
            onDelete={() => onDeleteItem(item.id)}
            onMove={(dir) => onMoveItem(item.id, dir)}
          />
        ))}
        {items.length === 0 && !addingItem && (
          <p className="py-6 text-center text-sm text-eficto-green-dark/40">لا يوجد أصناف بهذا القسم بعد</p>
        )}
      </div>

      <div className="border-t border-eficto-gold/10 px-5 py-4">
        {addingItem ? (
          <div className="space-y-2.5">
            <div className="grid gap-2.5 sm:grid-cols-2">
              <input
                value={draft.name_ar}
                onChange={(e) => setDraft((d) => ({ ...d, name_ar: e.target.value }))}
                placeholder="اسم الصنف بالعربي"
                className={inputClass}
                autoFocus
              />
              <input
                value={draft.name_en}
                onChange={(e) => setDraft((d) => ({ ...d, name_en: e.target.value }))}
                placeholder="Name in English (اختياري)"
                dir="ltr"
                className={inputClass}
              />
            </div>
            <input
              value={draft.description_ar}
              onChange={(e) => setDraft((d) => ({ ...d, description_ar: e.target.value }))}
              placeholder="وصف مختصر (اختياري)"
              className={inputClass}
            />
            <div className="flex flex-wrap items-center gap-2.5">
              <input
                value={draft.price_sar}
                onChange={(e) => setDraft((d) => ({ ...d, price_sar: e.target.value }))}
                placeholder="السعر"
                inputMode="decimal"
                dir="ltr"
                className={inputClass + " max-w-[120px]"}
              />
              <button onClick={submitItem} className="rounded-full bg-eficto-green px-5 py-2 text-sm text-eficto-cream">
                إضافة الصنف
              </button>
              <button
                onClick={() => setAddingItem(false)}
                className="rounded-full border border-eficto-gold/30 px-5 py-2 text-sm text-eficto-green-dark/70"
              >
                إلغاء
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingItem(true)}
            className="flex items-center gap-2 text-sm text-eficto-green transition-colors hover:text-eficto-green-dark"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            إضافة صنف
          </button>
        )}
      </div>
    </div>
  );
}

function ItemRow({
  item,
  isFirst,
  isLast,
  onUpdate,
  onDelete,
  onMove,
}: {
  item: MenuItem;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (patch: Partial<MenuItem>) => void;
  onDelete: () => void;
  onMove: (dir: "up" | "down") => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name_ar: item.name_ar,
    name_en: item.name_en ?? "",
    description_ar: item.description_ar ?? "",
    price_sar: String(item.price_sar),
  });

  function save() {
    const price = parseFloat(draft.price_sar);
    onUpdate({
      name_ar: draft.name_ar.trim() || item.name_ar,
      name_en: draft.name_en.trim() || null,
      description_ar: draft.description_ar.trim() || null,
      price_sar: Number.isNaN(price) ? item.price_sar : price,
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="space-y-2.5 py-4">
        <div className="grid gap-2.5 sm:grid-cols-2">
          <input
            value={draft.name_ar}
            onChange={(e) => setDraft((d) => ({ ...d, name_ar: e.target.value }))}
            className={inputClass}
            autoFocus
          />
          <input
            value={draft.name_en}
            onChange={(e) => setDraft((d) => ({ ...d, name_en: e.target.value }))}
            dir="ltr"
            placeholder="Name in English"
            className={inputClass}
          />
        </div>
        <input
          value={draft.description_ar}
          onChange={(e) => setDraft((d) => ({ ...d, description_ar: e.target.value }))}
          placeholder="وصف مختصر"
          className={inputClass}
        />
        <div className="flex items-center gap-2.5">
          <input
            value={draft.price_sar}
            onChange={(e) => setDraft((d) => ({ ...d, price_sar: e.target.value }))}
            inputMode="decimal"
            dir="ltr"
            className={inputClass + " max-w-[120px]"}
          />
          <button onClick={save} className="rounded-full bg-eficto-green px-5 py-2 text-sm text-eficto-cream">
            حفظ
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-full border border-eficto-gold/30 px-5 py-2 text-sm text-eficto-green-dark/70"
          >
            إلغاء
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3.5">
      <button onClick={() => setEditing(true)} className="min-w-0 flex-1 text-right">
        <p className="flex items-center gap-2 text-sm text-eficto-green-dark">
          {item.name_ar}
          {item.is_featured && (
            <span className="rounded-full bg-eficto-gold/20 px-2 py-0.5 text-[10px] text-eficto-gold-deep">مميز</span>
          )}
          {!item.active && (
            <span className="rounded-full bg-eficto-alert/10 px-2 py-0.5 text-[10px] text-eficto-alert">مخفي</span>
          )}
        </p>
        {item.description_ar && <p className="mt-0.5 text-xs text-eficto-green-dark/50">{item.description_ar}</p>}
      </button>

      <div className="flex shrink-0 items-center gap-1.5">
        <span dir="ltr" className="ml-1 text-sm text-eficto-gold-deep">
          {item.price_sar} ر.س
        </span>
        <button
          onClick={() => onMove("up")}
          disabled={isFirst}
          className="rounded-lg p-1.5 text-eficto-green-dark/40 transition-colors hover:bg-eficto-gold/10 disabled:opacity-30"
          aria-label="نقل لأعلى"
        >
          <ArrowUpIcon className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onMove("down")}
          disabled={isLast}
          className="rounded-lg p-1.5 text-eficto-green-dark/40 transition-colors hover:bg-eficto-gold/10 disabled:opacity-30"
          aria-label="نقل لأسفل"
        >
          <ArrowDownIcon className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onUpdate({ is_featured: !item.is_featured })}
          className={`rounded-lg px-2 py-1.5 text-xs transition-colors ${
            item.is_featured ? "bg-eficto-gold/20 text-eficto-gold-deep" : "text-eficto-green-dark/40 hover:bg-eficto-gold/10"
          }`}
        >
          مميز
        </button>
        <button
          onClick={() => onUpdate({ active: !item.active })}
          className={`rounded-lg px-2 py-1.5 text-xs transition-colors ${
            item.active ? "text-eficto-green-dark/40 hover:bg-eficto-gold/10" : "bg-eficto-alert/10 text-eficto-alert"
          }`}
        >
          {item.active ? "إخفاء" : "إظهار"}
        </button>
        <button onClick={onDelete} className="rounded-lg p-1.5 text-eficto-alert/70 transition-colors hover:bg-eficto-alert/10">
          <TrashIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
