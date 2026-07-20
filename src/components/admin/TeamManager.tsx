"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PlusIcon, TrashIcon, CheckIcon } from "@/components/icons";
import type { PermissionGroup, StaffMember, StaffPermissions } from "@/lib/types";

const MODULES: { key: keyof StaffPermissions; label: string }[] = [
  { key: "queue", label: "القائمة اليومية (الانتظار والحجوزات)" },
  { key: "customers", label: "العملاء" },
  { key: "reviews", label: "التقييمات" },
  { key: "reports", label: "التقارير" },
];

const inputClass =
  "w-full rounded-lg border border-eficto-gold/30 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-eficto-gold";

async function sha256Hex(text: string) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomPin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function TeamManager({
  initialGroups,
  initialMembers,
}: {
  initialGroups: PermissionGroup[];
  initialMembers: StaffMember[];
}) {
  const [groups, setGroups] = useState(initialGroups);
  const [members, setMembers] = useState(initialMembers);
  const [addingGroup, setAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberGroup, setNewMemberGroup] = useState(initialGroups[0]?.id ?? "");
  const [revealedPin, setRevealedPin] = useState<{ memberId: string; pin: string } | null>(null);

  const supabase = createClient();

  async function addGroup() {
    const name = newGroupName.trim();
    if (!name) return;
    const { data } = await supabase
      .from("eficto_permission_groups")
      .insert({ name, permissions: { queue: true, customers: false, reviews: false, reports: false } })
      .select()
      .single();
    if (data) setGroups((prev) => [...prev, data]);
    setNewGroupName("");
    setAddingGroup(false);
  }

  async function updateGroup(id: string, patch: Partial<PermissionGroup>) {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
    await supabase.from("eficto_permission_groups").update(patch).eq("id", id);
  }

  async function toggleModule(group: PermissionGroup, key: keyof StaffPermissions) {
    const permissions = { ...group.permissions, [key]: !group.permissions[key] };
    await updateGroup(group.id, { permissions });
  }

  async function deleteGroup(id: string) {
    if (members.some((m) => m.permission_group_id === id)) {
      alert("ما تقدر تحذف هذا الدور لأن فيه أعضاء مرتبطين فيه — انقلهم لدور ثاني أولاً");
      return;
    }
    const group = groups.find((g) => g.id === id);
    if (!group || !confirm(`حذف دور "${group.name}"؟`)) return;
    setGroups((prev) => prev.filter((g) => g.id !== id));
    await supabase.from("eficto_permission_groups").delete().eq("id", id);
  }

  async function addMember() {
    const name = newMemberName.trim();
    if (!name || !newMemberGroup) return;
    const pin = randomPin();
    const { data } = await supabase
      .from("eficto_staff_members")
      .insert({ full_name: name, permission_group_id: newMemberGroup, pin_hash: "" })
      .select()
      .single();
    if (data) {
      const pinHash = await sha256Hex(`${data.id}:${pin}`);
      await supabase.from("eficto_staff_members").update({ pin_hash: pinHash }).eq("id", data.id);
      setMembers((prev) => [...prev, data]);
      setRevealedPin({ memberId: data.id, pin });
    }
    setNewMemberName("");
    setAddingMember(false);
  }

  async function updateMember(id: string, patch: Partial<StaffMember>) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    await supabase.from("eficto_staff_members").update(patch).eq("id", id);
  }

  async function resetPin(id: string) {
    const pin = randomPin();
    const pinHash = await sha256Hex(`${id}:${pin}`);
    await supabase.from("eficto_staff_members").update({ pin_hash: pinHash }).eq("id", id);
    setRevealedPin({ memberId: id, pin });
  }

  async function deleteMember(id: string) {
    const member = members.find((m) => m.id === id);
    if (!member || !confirm(`حذف "${member.full_name}" من الطاقم؟`)) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
    await supabase.from("eficto_staff_members").delete().eq("id", id);
  }

  return (
    <div className="mt-6 space-y-10">
      <section>
        <h2 className="font-serif text-lg text-eficto-green-dark">أدوار الصلاحيات</h2>
        <p className="mt-1 text-xs text-eficto-green-dark/50">حدد أي الأقسام يقدر كل دور يشوفها من /staff</p>

        <div className="mt-4 space-y-3">
          {groups.map((group) => (
            <div key={group.id} className="rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-premium">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <input
                  value={group.name}
                  onChange={(e) => setGroups((prev) => prev.map((g) => (g.id === group.id ? { ...g, name: e.target.value } : g)))}
                  onBlur={(e) => updateGroup(group.id, { name: e.target.value.trim() || group.name })}
                  className="max-w-[220px] rounded-lg border border-transparent bg-transparent px-2 py-1 font-serif text-eficto-green-dark outline-none transition-colors focus:border-eficto-gold focus:bg-eficto-cream/40"
                />
                <button
                  onClick={() => deleteGroup(group.id)}
                  className="rounded-lg p-1.5 text-eficto-alert/70 transition-colors hover:bg-eficto-alert/10"
                  aria-label="حذف الدور"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {MODULES.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => toggleModule(group, m.key)}
                    className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                      group.permissions[m.key]
                        ? "bg-eficto-green/10 text-eficto-green"
                        : "border border-eficto-gold/25 text-eficto-green-dark/40"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {addingGroup ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border border-eficto-gold/30 bg-white p-4 shadow-premium">
            <input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="اسم الدور (مثال: مشرف الوردية)"
              className={inputClass + " sm:max-w-xs"}
              autoFocus
            />
            <button onClick={addGroup} className="rounded-full bg-eficto-green px-5 py-2 text-sm text-eficto-cream">
              إضافة
            </button>
            <button
              onClick={() => setAddingGroup(false)}
              className="rounded-full border border-eficto-gold/30 px-5 py-2 text-sm text-eficto-green-dark/70"
            >
              إلغاء
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAddingGroup(true)}
            className="mt-3 flex items-center gap-2 text-sm text-eficto-green transition-colors hover:text-eficto-green-dark"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            دور جديد
          </button>
        )}
      </section>

      <section>
        <h2 className="font-serif text-lg text-eficto-green-dark">أعضاء الطاقم</h2>
        <p className="mt-1 text-xs text-eficto-green-dark/50">
          كل عضو يدخل على /staff باسمه ورمزه الشخصي — بدون رمز مشترك
        </p>

        <div className="mt-4 space-y-3">
          {members.length === 0 && (
            <p className="rounded-2xl border border-eficto-gold/25 bg-white p-8 text-center text-sm text-eficto-green-dark/50 shadow-premium">
              لا يوجد أعضاء بعد
            </p>
          )}
          {members.map((member) => {
            const group = groups.find((g) => g.id === member.permission_group_id);
            return (
              <div key={member.id} className="rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-premium">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-serif text-eficto-green-dark">{member.full_name}</p>
                    {!member.active && (
                      <span className="mt-1 inline-block rounded-full bg-eficto-alert/10 px-2 py-0.5 text-[10px] text-eficto-alert">
                        معطّل
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={member.permission_group_id}
                      onChange={(e) => updateMember(member.id, { permission_group_id: e.target.value })}
                      className="rounded-lg border border-eficto-gold/30 bg-white px-3 py-1.5 text-xs outline-none"
                    >
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => updateMember(member.id, { active: !member.active })}
                      className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                        member.active ? "bg-eficto-green/10 text-eficto-green" : "bg-eficto-alert/10 text-eficto-alert"
                      }`}
                    >
                      {member.active ? "مفعّل" : "معطّل"}
                    </button>
                    <button
                      onClick={() => resetPin(member.id)}
                      className="rounded-full border border-eficto-gold/30 px-3 py-1.5 text-xs text-eficto-green-dark/70 transition-colors hover:border-eficto-gold"
                    >
                      إعادة تعيين الرمز
                    </button>
                    <button
                      onClick={() => deleteMember(member.id)}
                      className="rounded-lg p-1.5 text-eficto-alert/70 transition-colors hover:bg-eficto-alert/10"
                      aria-label="حذف العضو"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {group && (
                  <p className="mt-2 text-xs text-eficto-green-dark/40">
                    الوصول: {MODULES.filter((m) => group.permissions[m.key]).map((m) => m.label).join("، ") || "لا شيء"}
                  </p>
                )}
                {revealedPin?.memberId === member.id && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-eficto-gold/10 px-4 py-2.5 text-sm">
                    <CheckIcon className="h-4 w-4 shrink-0 text-eficto-gold-deep" />
                    <span className="text-eficto-green-dark">
                      الرمز الجديد: <span dir="ltr" className="font-arabic-display tracking-[0.2em] text-eficto-gold-deep">{revealedPin.pin}</span>
                      {" "}— أخبر {member.full_name} به الآن، لن يظهر مرة أخرى
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {addingMember ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border border-eficto-gold/30 bg-white p-4 shadow-premium">
            <input
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="اسم العضو"
              className={inputClass + " sm:max-w-xs"}
              autoFocus
            />
            <select
              value={newMemberGroup}
              onChange={(e) => setNewMemberGroup(e.target.value)}
              className="rounded-lg border border-eficto-gold/30 bg-white px-3 py-2 text-sm outline-none"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <button onClick={addMember} className="rounded-full bg-eficto-green px-5 py-2 text-sm text-eficto-cream">
              إضافة
            </button>
            <button
              onClick={() => setAddingMember(false)}
              className="rounded-full border border-eficto-gold/30 px-5 py-2 text-sm text-eficto-green-dark/70"
            >
              إلغاء
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAddingMember(true)}
            disabled={groups.length === 0}
            className="mt-3 flex items-center gap-2 text-sm text-eficto-green transition-colors hover:text-eficto-green-dark disabled:opacity-40"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            عضو جديد
          </button>
        )}
      </section>
    </div>
  );
}
