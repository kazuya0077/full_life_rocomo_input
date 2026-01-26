
// ロコモ度の定義 (0, 1, 2, 3)
export type LocomoDegree = 0 | 1 | 2 | 3;

// 基本情報
export interface BasicInfo {
  companyName: string;
  userName: string;
  age: number;
  gender: 'male' | 'female';
  heightCm: number;
}

// 立ち上がりテストの結果値型
export type StandUpResult = '10cm' | '20cm' | '30cm' | '40cm' | 'impossible' | 'untested';

// 立ち上がりテスト
export interface StandUpTest {
  bothMin: StandUpResult;       // 両脚でできた最も低い台
  singleRightMin: StandUpResult; // 片脚(右)でできた最も低い台
  singleLeftMin: StandUpResult;  // 片脚(左)でできた最も低い台
}

// 2ステップテスト
export interface TwoStepTest {
  step1Cm: number;
  step2Cm: number;
}

// ロコモ25 (nullは未回答を表す。値は0-4点)
export type Locomo25Answers = (number | null)[];

// 全体のフォームステート
export interface LocomoState {
  basicInfo: BasicInfo;
  standUpTest: StandUpTest;
  twoStepTest: TwoStepTest;
  locomo25Answers: Locomo25Answers;
}

// 計算結果
export interface CalculationResult {
  standUpDegree: LocomoDegree;
  standUpReason: string;
  twoStepValue: number;
  twoStepDegree: LocomoDegree;
  locomo25Score: number;
  locomo25Degree: LocomoDegree;
  finalDegree: LocomoDegree;
}

export const YOUTUBE_URL = "https://youtu.be/lGlh4LhFWjs?si=ocktY6itxXn13rwh";

export const DIETARY_POINTS = [
  "たんぱく質（肉・魚・卵・大豆製品など）を意識する",
  "カルシウム（牛乳・乳製品・小魚など）を意識する",
  "ビタミンD（魚・きのこなど）を意識する",
  "主食・主菜・副菜をそろえる"
];