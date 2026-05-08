export const interviewSteps = ["self_discovery", "concept", "monetization", "execution"] as const;
export type InterviewStep = (typeof interviewSteps)[number];

export const stepQuestions: Record<InterviewStep, string[]> = {
  self_discovery: [
    "당신이 잘 알고 있거나 자주 다루는 주제 3가지는 무엇인가요?",
    "사람들이 당신에게 자주 묻는 주제는 무엇인가요?",
    "어디에서 자연스럽게 촬영할 수 있나요?",
    "얼굴 노출이 가능한가요?",
    "목소리 출연이 가능한가요?",
    "한 달에 몇 번 업로드할 수 있나요?",
    "선호하는 영상 길이는 어느 정도인가요?",
    "타겟 시청자의 연령/성별은 어떻게 되나요?",
    "영상 편집은 직접 하나요, 외주를 고려하나요?",
    "핵심 타깃 고객(연령/상황/문제)을 한 문장으로 설명해 주세요.",
  ],
  concept: ["전환 가능한 숏폼 계정 콘셉트를 설계하기 위한 추가 정보가 있나요?"],
  monetization: [
    "현재 또는 향후 판매할 핵심 제품/서비스(가격대 포함)는 무엇인가요?",
    "현재 판매 중인 상품이 있나요?",
    "앞으로 판매 가능한 상품/서비스는 무엇인가요?",
    "고려 중인 수익화 방식은 무엇인가요?",
    "콘텐츠에 투자 가능한 시간은 어느 정도인가요?",
    "월 예산은 얼마까지 가능한가요?",
    "향후 자체 제작/소싱 계획이 있나요?",
  ],
  execution: ["실행 단계에서 선호하는 브랜딩 스타일이나 참고 계정이 있나요?"],
};

export const agentPrompts = {
  selfDiscoveryAgent: `역할: selfDiscoveryAgent\n질문은 한 번에 하나씩. 답변을 분석해 아래를 JSON으로 반환:\n- core_strengths\n- recommended_content_direction\n- target_audience\n- realistic_operating_difficulty\n- recommended_format\n- filming_environment_advantage\n- one_line_positioning\n- account_basic_info_table`,
  conceptAgent: `역할: conceptAgent\n숏폼 계정 콘셉트를 전환 중심으로 설계하고 JSON으로 반환:\none_sentence_core_message, account_positioning, tone_and_manner, five_content_categories, series_ideas, domestic_reference_accounts, global_reference_accounts, differentiation_points, reasons_to_follow, mood_keywords, directions_to_avoid`,
  monetizationAgent: `역할: monetizationAgent\n현실적인 수익 구조를 설계하고 JSON으로 반환:\ncurrent_situation_analysis, realistic_model, short_term_strategy, mid_term_strategy, long_term_brand_strategy, monthly_resources, content_to_revenue_structure, conversion_funnel, cta_strategy, methods_to_avoid`,
  executionAgent: `역할: executionAgent\n목표: 입력된 타깃 고객과 제품/서비스를 기반으로 숏폼 제작 실행 가이드를 설계한다.\n반드시 아래 키를 모두 포함한 JSON으로 반환:\nprofile_image_direction, nickname_candidates, bio_150_kr,\nshortform_execution_guide,\nfirst_video_ideas,\nscript_structure,\nshortform_production_scripts,\nediting_reference_notes,\nmood_keywords,\nreference_videos,\nhook_examples, cta_examples, filming_guide, lighting_guide, smartphone_settings, thumbnail_copy_structure, hashtag_strategy, upload_routine, calendar_30_days\n\n세부 규칙:\n- shortform_execution_guide: 타깃 인사이트, 제품 메시지, 콘텐츠 전개 순서, 전환 동선을 단계별로 작성\n- shortform_production_scripts: 최소 3개. 각 항목은 title, target_pain_point, 30_45sec_script, b_roll_guide, caption, cta 포함\n- editing_reference_notes: 편집 템포, 자막 스타일, 효과음, 컷 전환, 화면 구성 체크리스트 포함\n- mood_keywords: 8~12개 키워드\n- reference_videos: 최소 5개. 각 항목은 platform, creator_or_channel, video_theme, why_relevant, search_keyword 포함 (실제 URL 대신 검색 키워드 기반 추천)` ,
  masterStrategyAgent: `역할: masterStrategyAgent\n제목은 '숏폼 계정 비즈니스 런칭 전략서'. 아래 섹션을 모두 포함한 마크다운 생성:\naccount direction, core message, target audience, content strategy, differentiation points, monetization model, first content ideas, 30-day content calendar, CTA strategy, branding elements, execution checklist`,
};
