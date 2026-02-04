
// Google Drive Image IDs
export const IMAGE_IDS = {
  TWO_STEP: '1Ehdh59aAnE8WTl1ux09DUfxl0qj56o1q',
  SQUAT: '1PccA9V5HlFUg-PPvRPUTfRToEzrLjpgl',
  ONE_LEG: '1-fDLR8-zBu8ShoPNEUXvpRmACKP3ty4W',
  LOCOMO_DEGREE: '1lCKgllFm3RsE9PQlZGQmGuxLZSVDuSMk',
  CRITERIA: '1uShW0Fb6Lu0GCHxmRNx8aIn-8FrCDPhu',
  FOOD: '19RGO251loIUZTMFfOham9uVX69r7tUnb',
  STAND_UP: '1tcgeh4MCjzQ57PVwCpaQSkU8LdpxeAMP',
};

// Helper to get viewable URL
// Changed logic to use the thumbnail API which is much more reliable for embedding than the export=view link.
// sz=w1200 ensures high resolution.
export const getDriveImageUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;

export const LOCOMO_25_QUESTIONS = [
  "1. この1ヶ月間に、ひどい痛みがありましたか。",
  "2. この1ヶ月間に、首や背中、腰に痛みがありましたか。",
  "3. この1ヶ月間に、手や足に痛みがありましたか。",
  "4. この1ヶ月間の活動において、痛みによってどの程度制限されましたか。",
  "5. ベッドや寝床から起きたり、横になったりするのはどの程度困難ですか。",
  "6. 腰掛けから立ち上がるのはどの程度困難ですか。",
  "7. 家の中を歩くのはどの程度困難ですか。",
  "8. シャツを着たり脱いだりするのはどの程度困難ですか。",
  "9. ズボンやパンツを着たり脱いだりするのはどの程度困難ですか。",
  "10. トイレで用足しをするのはどの程度困難ですか。",
  "11. お風呂で身体を洗うのはどの程度困難ですか。",
  "12. 階段の昇り降りはどの程度困難ですか。",
  "13. 急ぎ足で歩くのはどの程度困難ですか。",
  "14. 外に出かけるとき、身だしなみを整えるのはどの程度困難ですか。",
  "15. 休まずにどれくらい歩き続けることができますか(もっとも近いものを選んでください)",
  "16. 隣・近所に外出するのはどの程度困難ですか。",
  "17. 2kg程度の買い物(1リットルの牛乳パック2個程度)をして持ち帰ることはどの程度困難ですか。",
  "18. 電車やバスを利用して外出するのはどの程度困難ですか。",
  "19. 家の軽い仕事(食事の準備や後始末、簡単なかたづけなど)は、どの程度困難ですか。",
  "20. 家のやや重い仕事(掃除機の使用、ふとんの上げ下ろしなど)は、どの程度困難ですか。",
  "21. スポーツや踊り(ジョギング、水泳、ゲートボール、ダンスなど)は、どの程度困難ですか。",
  "22. 親しい人や友人とのおつき合いを控えていますか。",
  "23. 地域での活動やイベント、行事への参加を控えていますか。",
  "24. 家の中で転ぶのではないかと不安ですか。",
  "25. 先行き歩けなくなるのではないかと不安ですか。"
];

// ロコモ25の選択肢（質問ごとに異なる）
export const LOCOMO_25_OPTIONS_BY_QUESTION: { [key: number]: { value: number; label: string }[] } = {
  // Q1-3: 痛み
  1: [
    { value: 0, label: "痛くない" },
    { value: 1, label: "少し痛い" },
    { value: 2, label: "中程度痛い" },
    { value: 3, label: "かなり痛い" },
    { value: 4, label: "ひどく痛い" },
  ],
  2: [
    { value: 0, label: "痛くない" },
    { value: 1, label: "少し痛い" },
    { value: 2, label: "中程度痛い" },
    { value: 3, label: "かなり痛い" },
    { value: 4, label: "ひどく痛い" },
  ],
  3: [
    { value: 0, label: "痛くない" },
    { value: 1, label: "少し痛い" },
    { value: 2, label: "中程度痛い" },
    { value: 3, label: "かなり痛い" },
    { value: 4, label: "ひどく痛い" },
  ],
  // Q4: 制限
  4: [
    { value: 0, label: "制限なし" },
    { value: 1, label: "少し制限" },
    { value: 2, label: "中程度制限" },
    { value: 3, label: "かなり制限" },
    { value: 4, label: "ひどく制限" },
  ],
  // Q5-14: 困難度
  5: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  6: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  7: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  8: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  9: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  10: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  11: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  12: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  13: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  14: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  // Q15: 歩行距離
  15: [
    { value: 0, label: "2〜3km以上" },
    { value: 1, label: "1km程度" },
    { value: 2, label: "300m程度" },
    { value: 3, label: "100m程度" },
    { value: 4, label: "10m程度" },
  ],
  // Q16-21: 困難度
  16: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  17: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  18: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  19: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  20: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  21: [
    { value: 0, label: "困難でない" },
    { value: 1, label: "少し困難" },
    { value: 2, label: "中程度困難" },
    { value: 3, label: "かなり困難" },
    { value: 4, label: "ひどく困難" },
  ],
  // Q22-23: 控えている
  22: [
    { value: 0, label: "控えていない" },
    { value: 1, label: "少し控えている" },
    { value: 2, label: "中程度控えている" },
    { value: 3, label: "かなり控えている" },
    { value: 4, label: "全く控えている" },
  ],
  23: [
    { value: 0, label: "控えていない" },
    { value: 1, label: "少し控えている" },
    { value: 2, label: "中程度控えている" },
    { value: 3, label: "かなり控えている" },
    { value: 4, label: "全く控えている" },
  ],
  // Q24-25: 不安
  24: [
    { value: 0, label: "不安はない" },
    { value: 1, label: "少し不安" },
    { value: 2, label: "中程度不安" },
    { value: 3, label: "かなり不安" },
    { value: 4, label: "ひどく不安" },
  ],
  25: [
    { value: 0, label: "不安はない" },
    { value: 1, label: "少し不安" },
    { value: 2, label: "中程度不安" },
    { value: 3, label: "かなり不安" },
    { value: 4, label: "ひどく不安" },
  ],
};

// デフォルトの選択肢（後方互換性のため）
export const LOCOMO_25_OPTIONS = [
  { value: 0, label: "困難でない" },
  { value: 1, label: "少し困難" },
  { value: 2, label: "中程度困難" },
  { value: 3, label: "かなり困難" },
  { value: 4, label: "ひどく困難" },
];

export const STAND_UP_OPTIONS = [
  { score: 8, label: "片脚で10cmから立てる", description: "【非常に良好】 片脚で最も低い台から立てる" },
  { score: 7, label: "片脚で20cmから立てる", description: "【十分な筋力】 片脚で低い台から立てる" },
  { score: 6, label: "片脚で30cmから立てる", description: "【良好】 片脚で中くらいの台から立てる" },
  { score: 5, label: "片脚で40cmから立てる", description: "【問題なし】 片脚で普通の椅子の高さから立てる" },
  { score: 4, label: "両脚で10cmから立てる", description: "【ロコモ度1】 片脚40cmは無理だが、両脚なら10cmから立てる" },
  { score: 3, label: "両脚で20cmから立てる", description: "【ロコモ度1】 両脚で低い台から立てる" },
  { score: 2, label: "両脚で30cmから立てる", description: "【ロコモ度2】 両脚で中くらいの台から立てる" },
  { score: 1, label: "両脚で40cmから立てる", description: "【ロコモ度3】 両脚で普通の椅子の高さからなら立てる" },
  { score: 0, label: "両脚で40cmから立てない", description: "【要相談】 自力での立ち上がりが困難" },
];
