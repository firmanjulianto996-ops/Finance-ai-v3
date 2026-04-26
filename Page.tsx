"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Wallet, ArrowDownCircle, ArrowUpCircle, Bot } from "lucide-react";

type Transaction = {
  id: number;
  type: "income" | "expense";
  desc: string;
  amount: number;
  category: string;
  date: string;
};

const initialTransactions: Transaction[] = [
  {
    id: 1,
    type: "income",
    desc: "Gaji",
    amount: 5000000,
    category: "income",
    date: new Date().toISOString()
  },
  {
    id: 2,
    type: "expense",
    desc: "Makan siang",
    amount: 45000,
    category: "makan",
    date: new Date().toISOString()
  }
];

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(n);

function guessCategory(desc: string) {
  const text = desc.toLowerCase();
  if (text.includes("gaji") || text.includes("bonus")) return "income";
  if (text.includes("makan") || text.includes("kopi") || text.includes("food")) return "makan";
  if (text.includes("grab") || text.includes("gojek") || text.includes("bensin")) return "transport";
  if (text.includes("netflix") || text.includes("spotify")) return "langganan";
  return "lainnya";
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  const income = useMemo(
    () => transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0),
    [transactions]
  );

  const expense = useMemo(
    () => transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0),
    [transactions]
  );

  const balance = income - expense;

  const aiInsight = useMemo(() => {
    if (!transactions.length) return "Belum ada data transaksi.";
    if (expense > income) return "Pengeluaran kamu lebih besar dari pemasukan - ini harus segera dibenerin.";
    if (expense > income * 0.6) return "Cash flow masih aman, tapi pengeluaran kamu udah cukup tinggi.";
    return "Kondisi uang kamu lumayan sehat - tinggal jaga pengeluaran tetap terkendali.";
  }, [transactions, income, expense]);

  function addTransaction() {
    const parsedAmount = Number(amount);
    if (!desc.trim() || !parsedAmount || parsedAmount <= 0) return;

    const category = type === "income" ? "income" : guessCategory(desc);

    const newTx: Transaction = {
      id: Date.now(),
      type,
      desc,
      amount: parsedAmount,
      category,
      date: new Date().toISOString()
    };

    setTransactions([newTx, ...transactions]);
    setDesc("");
    setAmount("");
    setType("expense");
  }

  function deleteTransaction(id: number) {
    setTransactions(transactions.filter(t => t.id !== id));
  }

  const budget = [
    { name: "Makan", spent: 780000, limit: 1500000 },
    { name: "Transport", spent: 320000, limit: 500000 },
    { name: "Langganan", spent: 150000, limit: 300000 }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Finance AI App</h1>
          <p className="text-slate-400 mt-2">Dashboard uang pribadi yang siap disambung AI dan Telegram.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Card icon={<Wallet />} label="Saldo" value={formatIDR(balance)} />
          <Card icon={<ArrowUpCircle />} label="Pemasukan" value={formatIDR(income)} />
          <Card icon={<ArrowDownCircle />} label="Pengeluaran" value={formatIDR(expense)} />
          <Card icon={<Bot />} label="Insight AI" value="Aktif" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xl font-semibold">Tambah Transaksi</h2>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Deskripsi"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              placeholder="Nominal"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "income" | "expense")}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            >
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
            </select>
            <button
              onClick={addTransaction}
              className="w-full bg-indigo-600 hover:bg-indigo-500 transition rounded-xl px-4 py-3 font-semibold flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Simpan
            </button>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-sm text-slate-400">AI Insight</p>
              <p className="mt-2 text-sm leading-6">{aiInsight}</p>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Budget Bulanan</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {budget.map((b) => (
                <div key={b.name} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex justify-between text-sm">
                    <span>{b.name}</span>
                    <span>{Math.round((b.spent / b.limit) * 100)}%</span>
                  </div>
                  <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500"
                      style={{ width: `${Math.min((b.spent / b.limit) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {formatIDR(b.spent)} / {formatIDR(b.limit)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-xl font-semibold mb-4">Daftar Transaksi</h2>
          <div className="space-y-3">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-semibold">{t.desc}</p>
                  <p className="text-sm text-slate-400">
                    {t.category} - {new Date(t.date).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="text-right">
                  <p className={t.type === "income" ? "text-emerald-400" : "text-rose-400"}>
                    {t.type === "income" ? "+" : "-"} {formatIDR(t.amount)}
                  </p>
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mt-2"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-3 text-slate-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold mt-3">{value}</p>
    </div>
  );
}
