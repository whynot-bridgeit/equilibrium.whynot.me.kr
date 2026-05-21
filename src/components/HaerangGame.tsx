'use client';

import React, { useState, useCallback } from 'react';
import { Trophy, Star, Heart, Flame, MessageCircle, ArrowRight } from 'lucide-react';

// ──────────────────────────────────────────────
// 학습 데이터: 해랑한국어 교습법 순서
// 빈도 기반 배열 (가나다 순 ✗, 학습 효율 순 ✓)
// ──────────────────────────────────────────────
interface CharData {
  char: string;
  sound: string;   // 글자 이름 (예: 미음, 비읍)
  mnemonic: string;
  hint: string;
}

interface LearningStage {
  id: number;
  title: string;
  chars: CharData[];
}

const LEARNING_STAGES: LearningStage[] = [
  {
    id: 1,
    title: "단계 1: 단모음의 기초 (빛의 방향)",
    chars: [
      {
        char: 'ㅣ',
        sound: '이',
        mnemonic: "검지를 세워 입 앞에 세워보세요! (세로의 기운)",
        hint: "Vertical Identity",
      },
      {
        char: 'ㅏ',
        sound: '아',
        mnemonic: "고개를 오른쪽으로! 아침 해가 떠올라요 (밖으로)",
        hint: "Morning Sun / Right",
      },
      {
        char: 'ㅓ',
        sound: '어',
        mnemonic: "고개를 왼쪽으로! 어둑어둑해져요 (안으로)",
        hint: "Darkness / Left",
      },
      {
        char: 'ㅡ',
        sound: '으',
        mnemonic: "검지를 윗니와 아랫니 사이에 가로로! (가로의 기운)",
        hint: "Horizontal Identity",
      },
      {
        char: 'ㅗ',
        sound: '오',
        mnemonic: "고개를 위로! '올려요'(오) 동작을 해보세요",
        hint: "Ascending Focus",
      },
      {
        char: 'ㅜ',
        sound: '우',
        mnemonic: "고개를 아래로! '울어요'(우) 동작을 해보세요",
        hint: "Descending Focus",
      },
    ],
  },
  {
    id: 2,
    title: "단계 2: 입술과 목구멍 소리 (구강 구조 매핑)",
    chars: [
      {
        char: 'ㅇ',
        sound: '이응',
        // 초성: 묵음 / 종성: ng — '으'가 아님
        mnemonic: "목구멍 동그라미 모양이에요. 초성에서는 소리 없고, 종성에서 'ng' 소리가 나요.",
        hint: "Glottal · Initial: silent / Final: ng",
      },
      {
        char: 'ㅎ',
        sound: '히읗',
        mnemonic: "ㅇ에 모자를 씌워(가획) 숨을 더 많이 내보내세요!",
        hint: "Aspiration · 가획 원리",
      },
      {
        char: 'ㅁ',
        sound: '미음',
        mnemonic: "입술을 꾹 다물었다가 떼어보세요. ㅁ 모양 = 입술 모양!",
        hint: "Bilabial · 입술 자질",
      },
      {
        char: 'ㅂ',
        sound: '비읍',
        mnemonic: "ㅁ에서 소리를 더 세게! (가획) 공기가 터져 나와요.",
        hint: "Explosive · 가획 원리",
      },
    ],
  },
];

// 가변적 보상 메시지 (Dopamine RPE > 0 설계: 예측 초과 보상)
const REWARD_MESSAGES = [
  "축하해요! 뇌가 성장 중입니다! 🧠",
  "대단해요! 뉴런이 연결됐어요! ⚡",
  "완벽해요! 소리가 보이나요? ✨",
  "놀랍네요! 신경 회로가 강화됐어요! 🔥",
];

// ──────────────────────────────────────────────
// 메인 컴포넌트
// ──────────────────────────────────────────────
const HaerangGame: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [xp, setXp] = useState(0);
  // streak · hearts: 실제 로직 연동 예정 (현재 초기값 고정)
  const [streak] = useState(5);
  const [hearts] = useState(3);
  const [feedback, setFeedback] = useState("");
  const [showReward, setShowReward] = useState(false);
  // 보상 애니메이션 중 중복 클릭 방지
  const [isAnimating, setIsAnimating] = useState(false);
  const [metacognitionMode, setMetaMode] = useState(false);
  // 메타인지 세션: 사용자가 선택한 글자를 추적
  const [selectedMetaChar, setSelectedMetaChar] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStage = LEARNING_STAGES[stage];
  const currentChar = currentStage.chars[charIndex];
  const progressPercent = ((charIndex + 1) / currentStage.chars.length) * 100;

  // ── 가변적 보상 (Dopamine RPE) ──────────────
  const triggerVariableReward = useCallback(() => {
    const msg = REWARD_MESSAGES[Math.floor(Math.random() * REWARD_MESSAGES.length)];
    setFeedback(msg);
    setShowReward(true);
    // 보상 오버레이는 1500ms 후 소멸 (handleNext의 setTimeout과 동기화)
    setTimeout(() => setShowReward(false), 1500);
  }, []);

  // ── 다음 글자로 이동 ─────────────────────────
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setXp(prev => prev + 10);
    triggerVariableReward();

    // [버그 수정] 보상 애니메이션(1500ms)이 끝난 뒤 글자를 바꿈
    // 기존 코드는 triggerVariableReward()와 setCharIndex()를 동시에 호출해
    // 보상 오버레이가 다음 글자 위에 표시되는 타이밍 버그가 있었음
    setTimeout(() => {
      if (charIndex < currentStage.chars.length - 1) {
        setCharIndex(prev => prev + 1);
      } else {
        setMetaMode(true);
      }
      setIsAnimating(false);
    }, 1500);
  };

  // ── 메타인지 세션 완료 ───────────────────────
  const handleMetaAnswer = () => {
    setMetaMode(false);
    setSelectedMetaChar(null);
    if (stage < LEARNING_STAGES.length - 1) {
      setStage(prev => prev + 1);
      setCharIndex(0);
    } else {
      setIsCompleted(true); // [버그 수정] alert() 대신 완료 화면으로 전환
    }
  };

  // ── 완료 화면 ────────────────────────────────
  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-xl text-center border-2 border-yellow-400">
          <Trophy className="mx-auto text-yellow-500 mb-4" size={72} />
          <h2 className="text-3xl font-bold text-slate-800 mb-3">오늘의 학습 완료!</h2>
          <p className="text-slate-600 leading-relaxed mb-2">
            당신의 뇌는 1시간 전과 다릅니다.<br />
            새로운 신경 연결이 만들어지고 있어요!
          </p>
          <p className="text-blue-600 font-bold text-2xl mb-6">+{xp} XP 획득</p>
          <button
            onClick={() => {
              setStage(0);
              setCharIndex(0);
              setXp(0);
              setIsCompleted(false);
            }}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-white rounded-2xl font-bold text-xl transition-all"
          >
            처음부터 다시 시작
          </button>
        </div>
      </div>
    );
  }

  // ── 메인 학습 화면 ───────────────────────────
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 font-sans">

      {/* 상단 대시보드: Streak(손실 회피) · XP(보상) · Hearts(목숨) */}
      <div className="w-full max-w-md flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 text-orange-500 font-bold">
          <Flame size={24} /> {streak}일째 유지 중
        </div>
        <div className="flex items-center gap-2 text-blue-600 font-bold">
          <Star size={24} fill="currentColor" /> {xp} XP
        </div>
        {/* [버그 수정] hearts를 state로 관리, JSX 하드코딩 제거 */}
        <div className="flex items-center gap-1 text-red-400">
          {Array.from({ length: hearts }).map((_, i) => (
            <Heart key={i} size={20} fill="currentColor" />
          ))}
        </div>
      </div>

      {!metacognitionMode ? (
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">

          {/* 단계명 + 진행도 숫자 */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-slate-400 font-medium text-sm text-left">{currentStage.title}</h2>
            {/* [신규] 단계 내 진행도 표시 */}
            <span className="text-slate-400 text-sm font-semibold shrink-0 ml-2">
              {charIndex + 1} / {currentStage.chars.length}
            </span>
          </div>

          {/* [신규] 진행 바 */}
          <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 자질 문자 시각화
              key={stage-charIndex}: 글자가 바뀔 때마다 DOM 재마운트
              → char-entrance 애니메이션이 매번 처음부터 재실행됨
              [버그 수정] animate-bounce(무한 반복) 제거 */}
          <div className="relative py-12 mb-6 bg-slate-100 rounded-2xl overflow-hidden">
            <span
              key={`${stage}-${charIndex}`}
              className="char-entrance text-9xl font-extrabold text-slate-800 block"
            >
              {currentChar.char}
            </span>
            <p className="text-slate-500 text-lg mt-1 font-medium">[{currentChar.sound}]</p>

            {/* 보상 오버레이: showReward=true 동안만 표시
                [버그 수정] 이제 현재 글자가 화면에 있는 동안만 뜨고
                1500ms 후 사라진 뒤 비로소 다음 글자로 이동 */}
            {showReward && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-500/90 text-white font-bold p-4 text-xl rounded-2xl">
                {feedback}
              </div>
            )}
          </div>

          {/* 신체 기억(Kinesthetic) 가이드 */}
          <div className="mb-8 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500 text-left">
            <p className="text-blue-800 font-semibold mb-1 flex items-center gap-2">
              <MessageCircle size={18} /> 해랑 샘의 팁:
            </p>
            <p className="text-blue-700 leading-relaxed">"{currentChar.mnemonic}"</p>
            <p className="text-blue-400 text-xs mt-1">{currentChar.hint}</p>
          </div>

          {/* [버그 수정] isAnimating 중 disabled 처리 → 중복 클릭 방지 */}
          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            기억했어요! <ArrowRight />
          </button>

          {/* [버그 수정] 미구현 기능은 비활성 상태로 명시 (클릭 가능한 척 하지 않음) */}
          <div className="mt-4 text-slate-300 text-xs flex gap-4 justify-center">
            <span title="추후 지원 예정">🔊 소리 듣기 (준비중)</span>
            <span title="추후 지원 예정">🎥 3D 입 모형 (준비중)</span>
          </div>
        </div>

      ) : (
        /* 메타인지 모니터링: 전전두피질(PFC) 실행 기능 강화
           [버그 수정] 글자 선택이 실제로 추적되고, 선택 전 다음 버튼 비활성화 */
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl text-center border-2 border-green-500">
          <Trophy className="mx-auto text-green-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">학습 성찰 타임</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            방금 배운 글자들 중 발음할 때<br />
            <strong>가장 '놀라웠던' 글자</strong>는 무엇인가요?<br />
            <span className="text-sm text-slate-400">뇌의 어떤 부분이 자극되었는지 느껴보세요.</span>
          </p>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {currentStage.chars.map(c => (
              <button
                key={c.char}
                onClick={() => setSelectedMetaChar(c.char)}
                className={`p-3 rounded-xl font-bold text-2xl transition-all border-2 ${
                  selectedMetaChar === c.char
                    ? 'bg-green-100 text-green-700 border-green-500 scale-105 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-transparent hover:bg-green-50 hover:text-green-600'
                }`}
              >
                {c.char}
                <span className="block text-xs font-normal text-slate-400 mt-1">{c.sound}</span>
              </button>
            ))}
          </div>

          {/* 선택 전에는 버튼 비활성화 + 안내 문구 표시 */}
          <button
            onClick={handleMetaAnswer}
            disabled={!selectedMetaChar}
            className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-xl transition-all"
          >
            {selectedMetaChar
              ? `'${selectedMetaChar}' 선택 완료 → 다음 단계`
              : '위에서 글자를 하나 선택해 주세요'}
          </button>
        </div>
      )}
    </div>
  );
};

export default HaerangGame;
