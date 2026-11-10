"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AgendaItem, Content, Instructor, Logo, Session, Testimonial, Workshop } from "@/lib/types";

type Tab = "progress" | "workshops" | "proof" | "json" | "data";

const TABS: { id: Tab; label: string }[] = [
  { id: "progress", label: "Progress bar" },
  { id: "workshops", label: "Workshops" },
  { id: "proof", label: "Logos & testimonials" },
  { id: "json", label: "All content (JSON)" },
  { id: "data", label: "Submissions" },
];

const blankWorkshop = (): Workshop => ({
  slug: `new-workshop-${Math.random().toString(36).slice(2, 6)}`,
  title: "New workshop",
  tagline: "One-line value prop",
  description: "",
  price: 999,
  duration: "1 live session · 2 hrs",
  schedule: "Dates announced soon",
  level: "Beginner friendly",
  learn: [],
  forWho: [],
  project: "",
  published: false,
});

export default function AdminDashboard({ initial, registrationCount }: { initial: Content; registrationCount: number }) {
  const router = useRouter();
  const [c, setC] = useState<Content>(initial);
  const [tab, setTab] = useState<Tab>("progress");
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "ok" | "err"; msg?: string }>({ kind: "idle" });
  const dirty = JSON.stringify(c) !== JSON.stringify(initial);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    setStatus({ kind: "saving" });
    const res = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      setStatus({ kind: "ok", msg: "Saved — live on the site." });
      router.refresh();
    } else setStatus({ kind: "err", msg: json.error || "Save failed." });
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  const set = <K extends keyof Content>(key: K, value: Content[K]) => setC((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="container py-8">
      <div className="sticky top-0 z-40 -mx-5 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-ink/90 px-5 py-4 backdrop-blur">
        <h1 className="text-xl font-bold">Prodathon admin</h1>
        <div className="flex items-center gap-3">
          {status.kind !== "idle" && (
            <span className={`text-sm ${status.kind === "err" ? "text-red-300" : "text-zinc-400"}`}>
              {status.kind === "saving" ? "Saving…" : status.msg}
            </span>
          )}
          <a href="/" target="_blank" className="btn-ghost btn-sm">View site ↗</a>
          <button onClick={save} disabled={!dirty || status.kind === "saving"} className="btn-primary btn-sm">
            {dirty ? "Save changes" : "Saved"}
          </button>
          <button onClick={logout} className="text-sm text-zinc-500 hover:text-white">Log out</button>
        </div>
      </div>

      <nav className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${tab === t.id ? "bg-white text-ink" : "border border-white/10 text-zinc-300 hover:border-white/30"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "progress" && <ProgressEditor c={c} setC={setC} registrationCount={registrationCount} />}
      {tab === "workshops" && <WorkshopsEditor workshops={c.workshops} onChange={(w) => set("workshops", w)} currency={c.site.currency} />}
      {tab === "proof" && (
        <div className="grid gap-10">
          <LogoEditor title="Partner colleges" items={c.colleges} onChange={(v) => set("colleges", v)} />
          <LogoEditor title="Sponsors" items={c.sponsors} onChange={(v) => set("sponsors", v)} />
          <TestimonialEditor items={c.testimonials} onChange={(v) => set("testimonials", v)} />
        </div>
      )}
      {tab === "json" && <JsonEditor c={c} setC={setC} />}
      {tab === "data" && <DataViewer />}
    </div>
  );
}

// ---------- small form helpers ----------

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-zinc-500">{hint}</span>}
    </label>
  );
}

function Text({ value, onChange, ...rest }: { value: string | undefined; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return <input {...rest} className="field" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
}

function Num({ value, onChange }: { value: number | undefined; onChange: (v: number | undefined) => void }) {
  return (
    <input
      type="number"
      className="field"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
    />
  );
}

function Lines({ value, onChange, rows = 4 }: { value: string[]; onChange: (v: string[]) => void; rows?: number }) {
  return (
    <textarea
      className="field"
      rows={rows}
      value={value.join("\n")}
      onChange={(e) => onChange(e.target.value.split("\n"))}
      onBlur={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
    />
  );
}

function move<T>(arr: T[], i: number, dir: -1 | 1) {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const copy = arr.slice();
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

// ---------- Progress ----------

function ProgressEditor({ c, setC, registrationCount }: { c: Content; setC: React.Dispatch<React.SetStateAction<Content>>; registrationCount: number }) {
  const p = c.progress;
  const up = (patch: Partial<Content["progress"]>) => setC((prev) => ({ ...prev, progress: { ...prev.progress, ...patch } }));
  const count = p.mode === "manual" ? p.manualCount : p.baseline + registrationCount;
  const raw = Math.floor((count / Math.max(1, p.goal)) * 100);
  const shown = Math.min(100, Math.max(p.minDisplayPercent, raw));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="card grid gap-5 p-6 sm:grid-cols-2">
        <Field label="Mode" hint="Auto = baseline + real sign-ups. Manual = you type the count.">
          <select className="field" value={p.mode} onChange={(e) => up({ mode: e.target.value as "auto" | "manual" })}>
            <option value="auto">Auto</option>
            <option value="manual">Manual</option>
          </select>
        </Field>
        <Field label="Goal (registrations)">
          <Num value={p.goal} onChange={(v) => up({ goal: v ?? 1 })} />
        </Field>
        {p.mode === "auto" ? (
          <Field label="Baseline" hint="Added to real sign-ups (e.g. registrations collected offline or via partner colleges).">
            <Num value={p.baseline} onChange={(v) => up({ baseline: v ?? 0 })} />
          </Field>
        ) : (
          <Field label="Manual count">
            <Num value={p.manualCount} onChange={(v) => up({ manualCount: v ?? 0 })} />
          </Field>
        )}
        <Field label="Minimum display %" hint="The bar never shows less than this, so early days read as momentum.">
          <Num value={p.minDisplayPercent} onChange={(v) => up({ minDisplayPercent: v ?? 0 })} />
        </Field>
        <Field label="Label" hint='Use {percent} as placeholder, e.g. "{percent}% to launch".'>
          <Text value={p.label} onChange={(v) => up({ label: v })} />
        </Field>
        <Field label="Event date label" hint='Shown instead of a date. e.g. "Coming Soon" or "March 2027".'>
          <Text value={c.hackathon.dateLabel} onChange={(v) => setC((prev) => ({ ...prev, hackathon: { ...prev.hackathon, dateLabel: v } }))} />
        </Field>
      </div>
      <div className="card p-6">
        <p className="text-sm text-zinc-400">Preview</p>
        <p className="mt-2 font-display text-3xl font-bold text-white">{p.label.replace("{percent}", String(shown))}</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-accent" style={{ width: `${shown}%` }} />
        </div>
        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-zinc-500">Real registrations</dt><dd className="text-white">{registrationCount}</dd></div>
          <div className="flex justify-between"><dt className="text-zinc-500">Counted toward goal</dt><dd className="text-white">{count}</dd></div>
          <div className="flex justify-between"><dt className="text-zinc-500">True %</dt><dd className="text-white">{raw}%</dd></div>
          <div className="flex justify-between"><dt className="text-zinc-500">Displayed %</dt><dd className="text-accent">{shown}%</dd></div>
        </dl>
      </div>
    </div>
  );
}

// ---------- Workshops ----------

function WorkshopsEditor({ workshops, onChange, currency }: { workshops: Workshop[]; onChange: (w: Workshop[]) => void; currency: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const update = (i: number, patch: Partial<Workshop>) => onChange(workshops.map((w, j) => (j === i ? { ...w, ...patch } : w)));

  return (
    <div className="grid gap-3">
      {workshops.map((w, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 p-4">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex-1 text-left">
              <span className="font-semibold text-white">{w.title}</span>
              <span className="ml-3 text-sm text-zinc-500">/{w.slug} · {currency} {w.price}</span>
              {!w.published && <span className="ml-3 rounded-full bg-yellow-500/15 px-2 py-0.5 text-xs text-yellow-200">Hidden</span>}
            </button>
            <button className="btn-ghost btn-sm" onClick={() => onChange(move(workshops, i, -1))} aria-label="Move up">↑</button>
            <button className="btn-ghost btn-sm" onClick={() => onChange(move(workshops, i, 1))} aria-label="Move down">↓</button>
            <button
              className="btn-ghost btn-sm text-red-300"
              onClick={() => confirm(`Delete "${w.title}"? (Takes effect when you save.)`) && onChange(workshops.filter((_, j) => j !== i))}
            >
              Delete
            </button>
          </div>
          {open === i && (
            <div className="grid gap-5 border-t border-line p-5 sm:grid-cols-2">
              <Field label="Title"><Text value={w.title} onChange={(v) => update(i, { title: v })} /></Field>
              <Field label="Slug (URL)" hint="lowercase-with-dashes. Changing it breaks old links.">
                <Text value={w.slug} onChange={(v) => update(i, { slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
              </Field>
              <Field label="Tagline (one line on the tile)"><Text value={w.tagline} onChange={(v) => update(i, { tagline: v })} /></Field>
              <Field label="Tag badge" hint='Optional, e.g. "Most popular"'><Text value={w.tag} onChange={(v) => update(i, { tag: v || undefined })} /></Field>
              <Field label={`Price (${currency})`}><Num value={w.price} onChange={(v) => update(i, { price: v ?? 0 })} /></Field>
              <Field label="Compare-at price" hint="Optional crossed-out price"><Num value={w.compareAtPrice} onChange={(v) => update(i, { compareAtPrice: v })} /></Field>
              <Field label={`EMI per month (${currency})`} hint='Optional. Shows "or X/month with EMI" on the price card.'><Num value={w.emiPerMonth} onChange={(v) => update(i, { emiPerMonth: v })} /></Field>
              <Field label="Duration"><Text value={w.duration} onChange={(v) => update(i, { duration: v })} /></Field>
              <Field label="Schedule"><Text value={w.schedule} onChange={(v) => update(i, { schedule: v })} /></Field>
              <Field label="Level"><Text value={w.level} onChange={(v) => update(i, { level: v })} /></Field>
              <Field label="Image URL" hint="Optional. Put files in /public/workshops and use /workshops/file.jpg, or paste an https URL.">
                <Text value={w.image} onChange={(v) => update(i, { image: v || undefined })} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <textarea className="field" rows={4} value={w.description} onChange={(e) => update(i, { description: e.target.value })} />
                </Field>
              </div>
              <Field label="What you'll learn" hint="One per line"><Lines value={w.learn} onChange={(v) => update(i, { learn: v })} /></Field>
              <Field label="Who it's for" hint="One per line"><Lines value={w.forWho} onChange={(v) => update(i, { forWho: v })} /></Field>
              <div className="sm:col-span-2">
                <Field label="You walk away with (project)"><Text value={w.project} onChange={(v) => update(i, { project: v })} /></Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Tools / stack" hint='One per line, e.g. "Python", "OpenAI API". Shown as chips in the page hero.'>
                  <Lines value={w.tools ?? []} rows={3} onChange={(v) => update(i, { tools: v })} />
                </Field>
              </div>
              <PairsEditor
                title="Stats strip"
                hint='Big numbers under the hero, e.g. "16" / "weeks". Leave empty to hide.'
                aLabel="Value"
                bLabel="Label"
                items={(w.highlights ?? []).map((h) => [h.value, h.label])}
                onChange={(rows) => update(i, { highlights: rows.map(([value, label]) => ({ value, label })) })}
              />
              <PairsEditor
                title="Real-world projects"
                hint="Cards in the Projects section. Leave empty to hide."
                aLabel="Title"
                bLabel="Description"
                items={(w.projects ?? []).map((p) => [p.title, p.body])}
                onChange={(rows) => update(i, { projects: rows.map(([title, body]) => ({ title, body })) })}
              />
              <ComparisonEditor items={w.comparison ?? []} onChange={(v) => update(i, { comparison: v })} />
              <InstructorEditor value={w.instructor} onChange={(v) => update(i, { instructor: v })} />
              <AgendaEditor items={w.agenda ?? []} onChange={(v) => update(i, { agenda: v })} />
              <SessionsEditor items={w.sessions ?? []} onChange={(v) => update(i, { sessions: v })} />
              <label className="flex items-center gap-3 text-sm text-zinc-200">
                <input type="checkbox" checked={w.published} onChange={(e) => update(i, { published: e.target.checked })} className="h-5 w-5 accent-[#5B3DF5]" />
                Published (visible on site and purchasable)
              </label>
            </div>
          )}
        </div>
      ))}
      <button
        className="btn-ghost justify-self-start"
        onClick={() => {
          onChange([...workshops, blankWorkshop()]);
          setOpen(workshops.length);
        }}
      >
        + Add workshop
      </button>
    </div>
  );
}

function SubSection({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line p-4 sm:col-span-2">
      <p className="font-semibold text-white">{title}</p>
      <p className="mb-4 mt-0.5 text-xs text-zinc-500">{hint}</p>
      {children}
    </div>
  );
}

function PairsEditor({
  title, hint, aLabel, bLabel, items, onChange,
}: { title: string; hint: string; aLabel: string; bLabel: string; items: [string, string][]; onChange: (v: [string, string][]) => void }) {
  const up = (i: number, k: 0 | 1, v: string) => onChange(items.map((r, j) => (j === i ? (k === 0 ? [v, r[1]] : [r[0], v]) : r) as [string, string]));
  return (
    <SubSection title={title} hint={hint}>
      <div className="grid gap-3">
        {items.map((r, i) => (
          <div key={i} className="grid items-end gap-3 rounded-xl bg-ink-800/60 p-3 sm:grid-cols-[1fr_2fr_auto]">
            <Field label={aLabel}><Text value={r[0]} onChange={(v) => up(i, 0, v)} /></Field>
            <Field label={bLabel}><Text value={r[1]} onChange={(v) => up(i, 1, v)} /></Field>
            <button className="btn-ghost btn-sm text-red-300" onClick={() => onChange(items.filter((_, j) => j !== i))}>Remove</button>
          </div>
        ))}
        <button className="btn-ghost btn-sm justify-self-start" onClick={() => onChange([...items, ["", ""]])}>+ Add</button>
      </div>
    </SubSection>
  );
}

function ComparisonEditor({ items, onChange }: { items: NonNullable<Workshop["comparison"]>; onChange: (v: NonNullable<Workshop["comparison"]>) => void }) {
  const up = (i: number, patch: Partial<(typeof items)[number]>) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <SubSection title="Comparison table" hint='"How it compares" rows: benefit, what other courses offer, what this program offers. Leave empty to hide.'>
      <div className="grid gap-3">
        {items.map((r, i) => (
          <div key={i} className="grid items-end gap-3 rounded-xl bg-ink-800/60 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <Field label="Benefit"><Text value={r.benefit} onChange={(v) => up(i, { benefit: v })} /></Field>
            <Field label="Other courses"><Text value={r.others} onChange={(v) => up(i, { others: v })} /></Field>
            <Field label="This program"><Text value={r.us} onChange={(v) => up(i, { us: v })} /></Field>
            <button className="btn-ghost btn-sm text-red-300" onClick={() => onChange(items.filter((_, j) => j !== i))}>Remove</button>
          </div>
        ))}
        <button className="btn-ghost btn-sm justify-self-start" onClick={() => onChange([...items, { benefit: "", others: "", us: "" }])}>+ Add row</button>
      </div>
    </SubSection>
  );
}

function InstructorEditor({ value, onChange }: { value: Instructor | undefined; onChange: (v: Instructor | undefined) => void }) {
  const i = value ?? { name: "", role: "" };
  const up = (patch: Partial<Instructor>) => onChange({ ...i, ...patch });
  return (
    <SubSection title="Instructor" hint="The instructor section stays hidden until a name is filled in.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name"><Text value={i.name} onChange={(v) => up({ name: v })} /></Field>
        <Field label="Role" hint='e.g. "Senior ML Engineer"'><Text value={i.role} onChange={(v) => up({ role: v })} /></Field>
        <Field label="Company" hint="Optional"><Text value={i.company} onChange={(v) => up({ company: v || undefined })} /></Field>
        <Field label="Photo URL" hint="Optional. /team/name.jpg or an https URL. Falls back to an initial."><Text value={i.image} onChange={(v) => up({ image: v || undefined })} /></Field>
        <Field label="LinkedIn URL" hint="Optional"><Text value={i.linkedin} onChange={(v) => up({ linkedin: v || undefined })} /></Field>
        <div className="sm:col-span-2">
          <Field label="Short bio" hint="2–3 sentences: what they've built and where.">
            <textarea className="field" rows={3} value={i.bio ?? ""} onChange={(e) => up({ bio: e.target.value || undefined })} />
          </Field>
        </div>
      </div>
    </SubSection>
  );
}

function AgendaEditor({ items, onChange }: { items: AgendaItem[]; onChange: (v: AgendaItem[]) => void }) {
  const up = (i: number, patch: Partial<AgendaItem>) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <SubSection title="Agenda (session by session)" hint="Shown as an accordion. Leave empty to hide the curriculum section.">
      <div className="grid gap-3">
        {items.map((a, i) => (
          <div key={i} className="grid gap-3 rounded-xl bg-ink-800/60 p-3 sm:grid-cols-[1fr_1fr_auto]">
            <Field label={`Session ${i + 1} title`}><Text value={a.title} onChange={(v) => up(i, { title: v })} /></Field>
            <Field label="Topics" hint="One per line"><Lines value={a.topics} rows={3} onChange={(v) => up(i, { topics: v })} /></Field>
            <div className="flex gap-2 self-start sm:pt-6">
              <button className="btn-ghost btn-sm" onClick={() => onChange(move(items, i, -1))} aria-label="Move up">↑</button>
              <button className="btn-ghost btn-sm" onClick={() => onChange(move(items, i, 1))} aria-label="Move down">↓</button>
              <button className="btn-ghost btn-sm text-red-300" onClick={() => onChange(items.filter((_, j) => j !== i))}>Remove</button>
            </div>
          </div>
        ))}
        <button className="btn-ghost btn-sm justify-self-start" onClick={() => onChange([...items, { title: "", topics: [] }])}>+ Add session</button>
      </div>
    </SubSection>
  );
}

function SessionsEditor({ items, onChange }: { items: Session[]; onChange: (v: Session[]) => void }) {
  const up = (i: number, patch: Partial<Session>) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <SubSection
      title="Dates & times (IST)"
      hint='Once a date is added, the page shows a schedule with "Add to calendar" buttons and the price card shows the start date. Empty = the Schedule text above is shown.'
    >
      <div className="grid gap-3">
        {items.map((s, i) => (
          <div key={i} className="grid items-end gap-3 rounded-xl bg-ink-800/60 p-3 sm:grid-cols-[1.2fr_0.7fr_1fr_auto]">
            <Field label="Start (IST)">
              <input type="datetime-local" className="field" value={s.start} onChange={(e) => up(i, { start: e.target.value })} />
            </Field>
            <Field label="Minutes"><Num value={s.durationMins} onChange={(v) => up(i, { durationMins: v ?? 0 })} /></Field>
            <Field label="Label" hint="Optional"><Text value={s.title} onChange={(v) => up(i, { title: v || undefined })} /></Field>
            <button className="btn-ghost btn-sm text-red-300" onClick={() => onChange(items.filter((_, j) => j !== i))}>Remove</button>
          </div>
        ))}
        <button className="btn-ghost btn-sm justify-self-start" onClick={() => onChange([...items, { start: "", durationMins: 120 }])}>+ Add date</button>
      </div>
    </SubSection>
  );
}

// ---------- Logos & testimonials ----------

function LogoEditor({ title, items, onChange }: { title: string; items: Logo[]; onChange: (v: Logo[]) => void }) {
  const up = (i: number, patch: Partial<Logo>) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <section>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-zinc-500">Logo images: put files in /public/logos and use /logos/name.png, or paste an https URL. Without an image, the name is shown.</p>
      <div className="mt-4 grid gap-3">
        {items.map((l, i) => (
          <div key={i} className="card grid items-end gap-3 p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <Field label="Name"><Text value={l.name} onChange={(v) => up(i, { name: v })} /></Field>
            <Field label="Logo image"><Text value={l.image} onChange={(v) => up(i, { image: v || undefined })} /></Field>
            <Field label="Link"><Text value={l.url} onChange={(v) => up(i, { url: v || undefined })} /></Field>
            <button className="btn-ghost btn-sm text-red-300" onClick={() => onChange(items.filter((_, j) => j !== i))}>Remove</button>
          </div>
        ))}
        <button className="btn-ghost btn-sm justify-self-start" onClick={() => onChange([...items, { name: "New" }])}>+ Add</button>
      </div>
    </section>
  );
}

function TestimonialEditor({ items, onChange }: { items: Testimonial[]; onChange: (v: Testimonial[]) => void }) {
  const up = (i: number, patch: Partial<Testimonial>) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <section>
      <h2 className="text-2xl font-bold">Testimonials</h2>
      <p className="mt-1 text-sm text-zinc-500">0 = section hidden · 1 = big featured quote · 2+ = grid. Only use real quotes you have permission to publish.</p>
      <div className="mt-4 grid gap-3">
        {items.map((t, i) => (
          <div key={i} className="card grid gap-3 p-4 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <Field label="Quote"><textarea className="field" rows={2} value={t.quote} onChange={(e) => up(i, { quote: e.target.value })} /></Field>
            </div>
            <Field label="Name"><Text value={t.name} onChange={(v) => up(i, { name: v })} /></Field>
            <Field label="Role / college"><Text value={t.role} onChange={(v) => up(i, { role: v })} /></Field>
            <Field label="Avatar URL"><Text value={t.avatar} onChange={(v) => up(i, { avatar: v || undefined })} /></Field>
            <button className="btn-ghost btn-sm justify-self-start text-red-300" onClick={() => onChange(items.filter((_, j) => j !== i))}>Remove</button>
          </div>
        ))}
        <button className="btn-ghost btn-sm justify-self-start" onClick={() => onChange([...items, { quote: "", name: "", role: "" }])}>+ Add testimonial</button>
      </div>
    </section>
  );
}

// ---------- JSON ----------

function JsonEditor({ c, setC }: { c: Content; setC: (c: Content) => void }) {
  const [text, setText] = useState(() => JSON.stringify(c, null, 2));
  const [err, setErr] = useState("");
  return (
    <div>
      <p className="mb-3 text-sm text-zinc-400">
        Everything on the site: contact info, socials, hackathon format/prizes/rules/FAQ, team, etc. Click <b>Apply</b>, then <b>Save changes</b>.
      </p>
      <textarea className="field min-h-[60vh] font-mono text-xs" spellCheck={false} value={text} onChange={(e) => setText(e.target.value)} />
      {err && <p className="mt-2 text-sm text-red-300">{err}</p>}
      <div className="mt-3 flex gap-3">
        <button
          className="btn-primary btn-sm"
          onClick={() => {
            try {
              setC(JSON.parse(text));
              setErr("");
            } catch (e) {
              setErr(`Invalid JSON: ${(e as Error).message}`);
            }
          }}
        >
          Apply
        </button>
        <button className="btn-ghost btn-sm" onClick={() => setText(JSON.stringify(c, null, 2))}>Reset</button>
      </div>
    </div>
  );
}

// ---------- Submissions ----------

function DataViewer() {
  const [col, setCol] = useState<"registrations" | "enrollments" | "leads">("registrations");
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null);

  useEffect(() => {
    setRows(null);
    fetch(`/api/admin/records?collection=${col}`)
      .then((r) => r.json())
      .then((d) => setRows(Array.isArray(d) ? d : []));
  }, [col]);

  const columns: Record<typeof col, string[]> = {
    registrations: ["createdAt", "name", "email", "college", "phone", "source"],
    enrollments: ["createdAt", "status", "workshopTitle", "amount", "name", "email", "phone", "college", "provider"],
    leads: ["createdAt", "type", "name", "email", "organization", "role", "phone", "message"],
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {(["registrations", "enrollments", "leads"] as const).map((k) => (
          <button key={k} onClick={() => setCol(k)} className={`rounded-full px-4 py-2 text-sm capitalize ${col === k ? "bg-accent text-ink" : "border border-white/10 text-zinc-300"}`}>
            {k}
          </button>
        ))}
        <a href={`/api/admin/records?collection=${col}&format=csv`} className="btn-ghost btn-sm ml-auto">Download CSV</a>
      </div>
      <p className="mt-4 text-sm text-zinc-500">{rows ? `${rows.length} records (newest first)` : "Loading…"}</p>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-ink-800 text-xs uppercase tracking-wider text-zinc-500">
            <tr>{columns[col].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows?.slice(0, 500).map((r, i) => (
              <tr key={i} className="border-t border-line">
                {columns[col].map((h) => (
                  <td key={h} className="max-w-xs truncate px-4 py-3 text-zinc-300" title={String(r[h] ?? "")}>
                    {h === "createdAt" && r[h] ? new Date(String(r[h])).toLocaleString() : String(r[h] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
