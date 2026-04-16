'use client';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { DemographicBreakdown } from '@/types';

const GENDER_COLORS = ['#e91e8c', '#7c3aed', '#06b6d4'];

export function DemographicsPanel({ demo }: { demo: DemographicBreakdown }) {
  const genderData = [
    { name: 'Female', value: demo.gender.female },
    { name: 'Male', value: demo.gender.male },
    { name: 'Other', value: demo.gender.other },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Gender */}
      <div className="bg-[#111118] border border-[#242434] rounded-xl p-4">
        <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">성별</div>
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie
              data={genderData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={50}
              paddingAngle={3}
              dataKey="value"
            >
              {genderData.map((_, i) => (
                <Cell key={i} fill={GENDER_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number) => `${v}%`}
              contentStyle={{ background: '#1a1a24', border: '1px solid #242434', borderRadius: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-1 mt-1">
          {genderData.map((g, i) => (
            <div key={g.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: GENDER_COLORS[i] }}
                />
                <span className="text-slate-300">{g.name}</span>
              </span>
              <span className="text-white font-medium">{g.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Age */}
      <div className="bg-[#111118] border border-[#242434] rounded-xl p-4">
        <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">연령대</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={demo.ageGroups}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            layout="vertical"
          >
            <XAxis type="number" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis dataKey="label" type="category" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={42} />
            <Tooltip
              formatter={(v: number) => `${v}%`}
              contentStyle={{ background: '#1a1a24', border: '1px solid #242434', borderRadius: 8 }}
            />
            <Bar dataKey="pct" fill="#7c3aed" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Countries */}
      <div className="bg-[#111118] border border-[#242434] rounded-xl p-4">
        <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">국가 TOP 5</div>
        <div className="flex flex-col gap-2">
          {demo.topCountries.map((c) => (
            <div key={c.country} className="flex items-center gap-2">
              <span className="text-lg leading-none">{c.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-slate-300 truncate">{c.country}</span>
                  <span className="text-white font-medium shrink-0 ml-1">{c.pct}%</span>
                </div>
                <div className="w-full h-1 bg-[#242434] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(c.pct / demo.topCountries[0].pct) * 100}%`, background: '#e91e8c' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
