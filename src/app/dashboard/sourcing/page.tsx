'use client';

import { useMemo, useState } from 'react';

type Period = 'day' | 'week' | 'month' | '3months' | '6months' | 'year';

type Item = { id: string; name: string; category: string; age: string; interest: string; family: string; spend: string; search: number; competition: number; rising: number; cpc: number; sales: number; reviews: string; platforms: string[] };

const PERIODS: Record<Period, string> = { day: '당일', week: '지난 1주일', month: '지난 1개월', '3months': '지난 3개월', '6months': '지난 6개월', year: '지난 1년' };
const PLATFORMS = ['네이버스마트스토어', '쿠팡', '아마존', '알리바바', '1633', '테무', '알리익스프레스'];
const SPENDS = ['1만원 미만', '1-5만원', '5-10만원', '10만원-30만원', '30만원 이상'];
const DATA: Item[] = [
  { id:'1', name:'저당 전기밥솥', category:'주방>조리기기>밥솥', age:'40-44', interest:'헬스케어', family:'자녀 2명 이상', spend:'10만원-30만원', search:121300, competition:290, rising:95, cpc:820, sales:4, reviews:'4.5★ 이상 73%', platforms:['쿠팡','네이버스마트스토어','아마존'] },
  { id:'2', name:'무선 차량용 청소기', category:'생활/가전>청소기>차량용', age:'30-34', interest:'자동차', family:'1인/싱글', spend:'5-10만원', search:95500, competition:480, rising:92, cpc:640, sales:8, reviews:'4.5★ 이상 61%', platforms:['쿠팡','테무','알리익스프레스'] },
  { id:'3', name:'반려동물 자동급수기', category:'반려동물>급식기>급수기', age:'25-29', interest:'반려동물', family:'신혼/부부', spend:'1-5만원', search:67800, competition:510, rising:88, cpc:560, sales:23, reviews:'리뷰 100개 미만 47%', platforms:['쿠팡','1633','테무'] },
];

export default function Page() {
  const [period, setPeriod] = useState<Period>('month');
  const [category, setCategory] = useState('전체');
  const [age, setAge] = useState('전체');
  const [interest, setInterest] = useState('전체');
  const [family, setFamily] = useState('전체');
  const [spend, setSpend] = useState('전체');
  const [platforms, setPlatforms] = useState<string[]>(['네이버스마트스토어', '쿠팡']);

  const filtered = useMemo(() => DATA.filter((d) =>
    (category === '전체' || d.category.includes(category)) &&
    (age === '전체' || d.age === age) &&
    (interest === '전체' || d.interest === interest) &&
    (family === '전체' || d.family === family) &&
    (spend === '전체' || d.spend === spend) &&
    (platforms.length === 0 || platforms.some((p) => d.platforms.includes(p)))
  ).sort((a, b) => b.search - a.search), [category, age, interest, family, spend, platforms]);

  const options = (arr: string[]) => ['전체', ...Array.from(new Set(arr))];

  return <div className="max-w-7xl mx-auto flex flex-col gap-6">
    <div><h1 className="text-2xl font-bold text-white">이커머스 제품 소싱 인텔리전스</h1></div>
    <div className="bg-[#111118] border border-[#242434] rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
      <select className="bg-[#1a1a24] p-2 rounded" value={period} onChange={(e) => setPeriod(e.target.value as Period)}>{Object.entries(PERIODS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select>
      <select className="bg-[#1a1a24] p-2 rounded" value={category} onChange={(e)=>setCategory(e.target.value)}>{options(DATA.map(d=>d.category.split('>')[0])).map(v => <option key={v}>{v}</option>)}</select>
      <select className="bg-[#1a1a24] p-2 rounded" value={age} onChange={(e)=>setAge(e.target.value)}>{options(DATA.map(d=>d.age)).map(v => <option key={v}>{v}</option>)}</select>
      <select className="bg-[#1a1a24] p-2 rounded" value={interest} onChange={(e)=>setInterest(e.target.value)}>{options(DATA.map(d=>d.interest)).map(v => <option key={v}>{v}</option>)}</select>
      <select className="bg-[#1a1a24] p-2 rounded" value={family} onChange={(e)=>setFamily(e.target.value)}>{options(DATA.map(d=>d.family)).map(v => <option key={v}>{v}</option>)}</select>
      <select className="bg-[#1a1a24] p-2 rounded" value={spend} onChange={(e)=>setSpend(e.target.value)}>{['전체', ...SPENDS].map(v => <option key={v}>{v}</option>)}</select>
    </div>
    <div className="flex gap-2 flex-wrap">{PLATFORMS.map((p)=><button key={p} onClick={()=>setPlatforms((prev)=>prev.includes(p)?prev.filter(x=>x!==p):[...prev,p])} className={`px-3 py-1 rounded ${platforms.includes(p)?'bg-pink-600':'bg-slate-700'}`}>{p}</button>)}</div>
    <div className="text-sm text-slate-400">분석 기간: {PERIODS[period]} · 결과 {filtered.length}건</div>
    <table className="w-full text-sm"><thead><tr><th>월검색량 순위</th><th>상품명</th><th>경쟁포화도</th><th>최근 라이징</th><th>평균 CPC</th><th>판매량순위</th><th>리뷰수 분포</th></tr></thead><tbody>{filtered.map((d, i)=><tr key={d.id}><td>#{i+1} ({d.search.toLocaleString()})</td><td>{d.name}</td><td>{d.competition}개</td><td>{d.rising}</td><td>₩{d.cpc}</td><td>TOP {d.sales}</td><td>{d.reviews}</td></tr>)}</tbody></table>
  </div>;
}
