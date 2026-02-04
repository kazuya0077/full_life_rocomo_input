
import React, { useState } from 'react';
import { BasicInfo, StandUpTest, TwoStepTest, Locomo25Answers, StandUpResult } from '../types';
import { Check, AlertCircle, User, Ruler } from 'lucide-react';

interface InputSectionProps {
    step: number; // 現在のステップ (1-4)
    state: {
        basicInfo: BasicInfo;
        standUpTest: StandUpTest;
        twoStepTest: TwoStepTest;
        locomo25Answers: Locomo25Answers;
    };
    onChange: (key: string, value: any) => void;
}

// 立ち上がりテスト用選択肢（「Min = 成功した最も低い台」を明示）
const BOTH_LEG_OPTIONS: { value: StandUpResult; label: string; sub: string }[] = [
    { value: '10cm', label: '10cm', sub: '10cmも余裕で可能' },
    { value: '20cm', label: '20cm', sub: '10cmは立てない' },
    { value: '30cm', label: '30cm', sub: '20cmは立てない' },
    { value: '40cm', label: '40cm', sub: '30cmは立てない' },
    { value: 'impossible', label: '不可', sub: '40cmも立てない' },
];

// 片脚用：片脚は40cmができればロコモ0確定だが、記録として10-30も選べるようにする
const SINGLE_LEG_OPTIONS: { value: StandUpResult; label: string; sub: string }[] = [
    { value: '10cm', label: '10cm', sub: 'さらに低い台もOK' },
    { value: '20cm', label: '20cm', sub: '10cm不可' },
    { value: '30cm', label: '30cm', sub: '20cm不可' },
    { value: '40cm', label: '40cm', sub: '30cm不可' },
    { value: 'impossible', label: '不可', sub: '40cmも不可' },
    { value: 'untested', label: '未実施', sub: '実施せず' },
];

// ロコモ25の質問文リスト
const LOCOMO25_QUESTIONS = [
    "この1ヶ月間に、ひどい痛みがありましたか。", // 1
    "この1ヶ月間に、首や背中、腰に痛みがありましたか。", // 2
    "この1ヶ月間に、手や足に痛みがありましたか。", // 3
    "この1ヶ月間の活動において、痛みによってどの程度制限されましたか。", // 4
    "ベッドや寝床から起きたり、横になったりするのはどの程度困難ですか。", // 5
    "腰掛けから立ち上がるのはどの程度困難ですか。", // 6
    "家の中を歩くのはどの程度困難ですか。", // 7
    "シャツを着たり脱いだりするのはどの程度困難ですか。", // 8
    "ズボンやパンツを着たり脱いだりするのはどの程度困難ですか。", // 9
    "トイレで用足しをするのはどの程度困難ですか。", // 10
    "お風呂で身体を洗うのはどの程度困難ですか。", // 11
    "階段の昇り降りはどの程度困難ですか。", // 12
    "急ぎ足で歩くのはどの程度困難ですか。", // 13
    "外に出かけるとき、身だしなみを整えるのはどの程度困難ですか。", // 14
    "休まずにどれくらい歩き続けることができますか(もっとも近いものを選んでください)", // 15
    "隣・近所に外出するのはどの程度困難ですか。", // 16
    "2kg程度の買い物(1リットルの牛乳パック2個程度)をして持ち帰ることはどの程度困難ですか。", // 17
    "電車やバスを利用して外出するのはどの程度困難ですか。", // 18
    "家の軽い仕事(食事の準備や後始末、簡単なかたづけなど)は、どの程度困難ですか。", // 19
    "家のやや重い仕事(掃除機の使用、ふとんの上げ下ろしなど)は、どの程度困難ですか。", // 20
    "スポーツや踊り(ジョギング、水泳、ゲートボール、ダンスなど)は、どの程度困難ですか。", // 21
    "親しい人や友人とのおつき合いを控えていますか。", // 22
    "地域での活動やイベント、行事への参加を控えていますか。", // 23
    "家の中で転ぶのではないかと不安ですか。", // 24
    "先行き歩けなくなるのではないかと不安ですか。" // 25
];

// ロコモ25の選択肢セット定義
const LOCOMO25_SETS: { [key: string]: string[] } = {
    A: ["痛くない", "少し痛い", "中程度痛い", "かなり痛い", "ひどく痛い"],
    B: ["つらくない", "少しつらい", "中程度つらい", "かなりつらい", "ひどくつらい"],
    B_ALT: ["制限なし", "少し制限", "中程度制限", "かなり制限", "ひどく制限"],
    C: ["困難でない", "少し困難", "中程度困難", "かなり困難", "ひどく困難"],
    D: ["2〜3km以上", "1km程度", "300m程度", "100m程度", "10m程度"],
    E: ["控えていない", "少し控えている", "中程度控えている", "かなり控えている", "全く控えている"],
    F: ["不安はない", "少し不安", "中程度不安", "かなり不安", "ひどく不安"],
};

// 設問番号と選択肢セットの対応
const getQuestionSet = (qIndex: number): string[] => {
    const num = qIndex + 1;
    if (num >= 1 && num <= 3) return LOCOMO25_SETS.A;
    if (num === 4) return LOCOMO25_SETS.B_ALT;
    if (num >= 5 && num <= 14) return LOCOMO25_SETS.C;
    if (num === 15) return LOCOMO25_SETS.D;
    if (num >= 16 && num <= 21) return LOCOMO25_SETS.C;
    if (num >= 22 && num <= 23) return LOCOMO25_SETS.E;
    if (num >= 24 && num <= 25) return LOCOMO25_SETS.F;
    return LOCOMO25_SETS.A; // Fallback
};

export const InputSection: React.FC<InputSectionProps> = ({ step, state, onChange }) => {

    // Basic Info Handlers
    const handleBasicInfoChange = (field: keyof BasicInfo, value: any) => {
        onChange('basicInfo', { ...state.basicInfo, [field]: value });
    };

    // Stand Up Handlers
    const handleStandUpChange = (field: keyof StandUpTest, value: StandUpResult) => {
        onChange('standUpTest', { ...state.standUpTest, [field]: value });
    };

    // Two Step Handlers
    const handleTwoStepChange = (field: keyof TwoStepTest, value: string) => {
        const num = parseFloat(value);
        onChange('twoStepTest', { ...state.twoStepTest, [field]: isNaN(num) ? 0 : num });
    };

    // Locomo 25 Handlers
    const handleLocomo25Answer = (index: number, score: number) => {
        const newAnswers = [...state.locomo25Answers];
        newAnswers[index] = score;
        onChange('locomo25Answers', newAnswers);
    };

    // Locomo 25 Bulk Input Handlers
    const [bulkValue, setBulkValue] = useState<number>(0);

    const fillUnanswered = () => {
        const newAnswers = state.locomo25Answers.map(val => val === null ? bulkValue : val);
        onChange('locomo25Answers', newAnswers);
    };

    const resetAll = () => {
        const newAnswers = Array(25).fill(null);
        onChange('locomo25Answers', newAnswers);
    };

    const sectionClass = "bg-white shadow-lg rounded-2xl p-6 md:p-10 border border-gray-100 transition-all duration-300";
    const inputClassName = "block w-full border border-gray-300 rounded-lg shadow-sm p-4 text-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors";
    const labelClassName = "block text-sm font-bold text-gray-700 mb-2";

    // Selection Button Component for StandUp Test
    const SelectionGrid = ({
        options,
        value,
        onChange,
        colClass = "grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
    }: {
        options: typeof BOTH_LEG_OPTIONS,
        value: StandUpResult,
        onChange: (val: StandUpResult) => void,
        colClass?: string
    }) => (
        <div className={`grid ${colClass} gap-3`}>
            {options.map((opt) => {
                const isSelected = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`
              relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 min-h-[80px]
              ${isSelected
                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md transform scale-[1.02] z-10'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-gray-50'}
            `}
                    >
                        {isSelected && (
                            <div className="absolute top-1 right-1 text-blue-500">
                                <Check className="w-4 h-4" />
                            </div>
                        )}
                        <span className={`text-lg font-bold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>{opt.label}</span>
                        {opt.sub && <span className="text-[10px] text-gray-500 mt-1 leading-tight">{opt.sub}</span>}
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto min-h-[400px] mb-12">

            {/* 1. 基本情報 */}
            {step === 1 && (
                <section className={sectionClass}>
                    <div className="flex items-center mb-8 border-b pb-4">
                        <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">1</div>
                        <h2 className="text-2xl font-bold text-gray-800 ml-4">基本情報</h2>
                        <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">必須</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <label className={labelClassName}>会社名・団体名（任意）</label>
                            <input
                                type="text"
                                className={inputClassName}
                                placeholder="例: 株式会社〇〇"
                                value={state.basicInfo.companyName}
                                onChange={(e) => handleBasicInfoChange('companyName', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>氏名 <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    className={`${inputClassName} pl-12`}
                                    placeholder="例: 山田 太郎"
                                    value={state.basicInfo.userName}
                                    onChange={(e) => handleBasicInfoChange('userName', e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClassName}>年齢（任意）</label>
                            <input
                                type="number"
                                className={inputClassName}
                                placeholder="例: 65"
                                value={state.basicInfo.age || ''}
                                onChange={(e) => handleBasicInfoChange('age', parseInt(e.target.value) || 0)}
                                onWheel={(e) => e.currentTarget.blur()}
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>身長 (cm) <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Ruler className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    className={`${inputClassName} pl-12`}
                                    placeholder="例: 160"
                                    value={state.basicInfo.heightCm || ''}
                                    onChange={(e) => handleBasicInfoChange('heightCm', parseFloat(e.target.value))}
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className={labelClassName}>性別</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`
                  cursor-pointer p-4 rounded-xl border-2 flex items-center justify-center transition-all
                  ${state.basicInfo.gender === 'male' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}
                `}>
                                    <input
                                        type="radio"
                                        value="male"
                                        checked={state.basicInfo.gender === 'male'}
                                        onChange={() => handleBasicInfoChange('gender', 'male')}
                                        className="hidden"
                                    />
                                    男性
                                </label>
                                <label className={`
                  cursor-pointer p-4 rounded-xl border-2 flex items-center justify-center transition-all
                  ${state.basicInfo.gender === 'female' ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}
                `}>
                                    <input
                                        type="radio"
                                        value="female"
                                        checked={state.basicInfo.gender === 'female'}
                                        onChange={() => handleBasicInfoChange('gender', 'female')}
                                        className="hidden"
                                    />
                                    女性
                                </label>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 2. 立ち上がりテスト */}
            {step === 2 && (
                <section className={sectionClass}>
                    <div className="flex items-center mb-6 border-b pb-4">
                        <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">2</div>
                        <h2 className="text-2xl font-bold text-gray-800 ml-4">立ち上がりテスト</h2>
                        <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">必須</span>
                    </div>

                    <div className="mb-6 p-4 bg-yellow-50 text-yellow-900 rounded-xl border border-yellow-200 flex items-start gap-3 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-yellow-600 mt-0.5" />
                        <div>
                            <p className="font-bold mb-1">【重要】入力ルール：「成功した一番低い台」を選ぶ</p>
                            <ul className="list-disc list-inside space-y-1 opacity-90">
                                <li>高い台(40cm)から順に下げていき、<strong>成功した限界の高さ</strong>を選択してください。</li>
                                <li>例：「20cm」を選択した場合、それは<strong>「20cmはできたが、10cmはできなかった」</strong>ことを意味します。</li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* 片脚 */}
                        <div>
                            <div className="flex items-center mb-4">
                                <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded mr-2">Step 1</span>
                                <label className="font-bold text-lg text-gray-800">片脚（左右）</label>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 ml-1">
                                <strong>左右両方の片脚</strong>で40cmから立てれば、その時点で<strong>ロコモ度0</strong>です。
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* 左脚 (Left) */}
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <p className="font-bold text-gray-700 mb-3 text-center border-b border-gray-200 pb-2">左脚 (Left)</p>
                                    <SelectionGrid
                                        options={SINGLE_LEG_OPTIONS}
                                        value={state.standUpTest.singleLeftMin}
                                        onChange={(val) => handleStandUpChange('singleLeftMin', val)}
                                        colClass="grid-cols-3"
                                    />
                                </div>

                                {/* 右脚 (Right) */}
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <p className="font-bold text-gray-700 mb-3 text-center border-b border-gray-200 pb-2">右脚 (Right)</p>
                                    <SelectionGrid
                                        options={SINGLE_LEG_OPTIONS}
                                        value={state.standUpTest.singleRightMin}
                                        onChange={(val) => handleStandUpChange('singleRightMin', val)}
                                        colClass="grid-cols-3"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 両脚 */}
                        <div className="pt-8 border-t border-gray-100">
                            <div className="flex items-center mb-4">
                                <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded mr-2">Step 2</span>
                                <label className="font-bold text-lg text-gray-800">両脚での結果 <span className="text-red-500">*</span></label>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 ml-1">
                                片脚が<strong>どちらか一方でも</strong>難しい場合のみ判定に使用されます。<br />
                                40cm → 30cm → 20cm → 10cm の順に行い、<strong>できた一番低い高さ</strong>を選んでください。
                            </p>

                            <SelectionGrid
                                options={BOTH_LEG_OPTIONS}
                                value={state.standUpTest.bothMin}
                                onChange={(val) => handleStandUpChange('bothMin', val)}
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* 3. 2ステップテスト */}
            {step === 3 && (
                <section className={sectionClass}>
                    <div className="flex items-center mb-6 border-b pb-4">
                        <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">3</div>
                        <h2 className="text-2xl font-bold text-gray-800 ml-4">2ステップテスト</h2>
                        <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">必須</span>
                    </div>

                    <p className="mb-8 text-gray-600">
                        大股で2歩歩いた距離を2回測定し、最大値を記録します。<br />
                        <span className="text-xs text-gray-500">※ バランスを崩さないよう注意して実施してください。</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 bg-white rounded-xl border-2 border-gray-100 shadow-sm hover:border-blue-300 transition-colors">
                            <label className="block text-lg font-bold text-gray-800 mb-2">1回目</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="block w-full text-2xl font-bold border-gray-300 rounded-lg shadow-sm p-4 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 pr-12"
                                    placeholder="0"
                                    value={state.twoStepTest.step1Cm || ''}
                                    onChange={(e) => handleTwoStepChange('step1Cm', e.target.value)}
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">cm</span>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-xl border-2 border-gray-100 shadow-sm hover:border-blue-300 transition-colors">
                            <label className="block text-lg font-bold text-gray-800 mb-2">2回目</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="block w-full text-2xl font-bold border-gray-300 rounded-lg shadow-sm p-4 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 pr-12"
                                    placeholder="0"
                                    value={state.twoStepTest.step2Cm || ''}
                                    onChange={(e) => handleTwoStepChange('step2Cm', e.target.value)}
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">cm</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 4. ロコモ25 */}
            {step === 4 && (
                <section className={sectionClass}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-6 gap-4">
                        <div className="flex items-center">
                            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">4</div>
                            <h2 className="text-2xl font-bold text-gray-800 ml-4">ロコモ25</h2>
                            <span className="ml-4 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">必須</span>
                        </div>

                        {/* 一括入力ツールバー */}
                        <div className="flex flex-wrap items-center gap-2 bg-gray-100 p-2 rounded-lg text-sm w-full md:w-auto">
                            <span className="font-bold text-gray-600 px-2">一括入力:</span>
                            <div className="flex bg-white rounded border border-gray-300 overflow-hidden">
                                {[0, 1, 2, 3, 4].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setBulkValue(val)}
                                        className={`px-3 py-1 text-sm font-bold ${bulkValue === val ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-50'}`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={fillUnanswered}
                                className="bg-white text-blue-700 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50 font-bold transition-colors shadow-sm text-xs"
                            >
                                未回答を {bulkValue} で埋める
                            </button>
                            <button
                                onClick={resetAll}
                                className="text-gray-500 hover:text-red-600 text-xs underline px-2 ml-auto"
                            >
                                リセット
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {Array.from({ length: 25 }, (_, i) => i).map((idx) => {
                            const qNum = idx + 1;
                            const options = getQuestionSet(idx);
                            const isAnswered = state.locomo25Answers[idx] !== null;

                            return (
                                <div key={qNum} className={`p-4 md:p-6 rounded-xl border-2 transition-colors ${isAnswered ? 'bg-white border-gray-100' : 'bg-red-50 border-red-100'}`}>
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-start text-lg">
                                        <span className="bg-slate-700 text-white rounded-md w-7 h-7 flex items-center justify-center mr-3 text-sm flex-shrink-0 mt-0.5">{qNum}</span>
                                        <span>{LOCOMO25_QUESTIONS[idx]}</span>
                                    </h3>

                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 ml-0 md:ml-10">
                                        {options.map((optionLabel, optionIdx) => {
                                            const score = optionIdx; // 0-4点
                                            const isSelected = state.locomo25Answers[idx] === score;

                                            return (
                                                <label key={score} className={`
                          relative flex flex-col items-center justify-center cursor-pointer rounded-lg px-2 py-3 transition-all duration-200 text-center
                          ${isSelected
                                                        ? 'bg-blue-600 text-white shadow-lg transform scale-105 z-10'
                                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}
                        `}>
                                                    <input
                                                        type="radio"
                                                        name={`q${qNum}`}
                                                        value={score}
                                                        checked={isSelected}
                                                        onChange={() => handleLocomo25Answer(idx, score)}
                                                        className="hidden"
                                                    />
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-2 ${isSelected ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                                        {score}点
                                                    </span>
                                                    <span className="text-xs font-bold leading-tight">{optionLabel}</span>
                                                    {isSelected && <Check className="w-4 h-4 absolute top-2 right-2 opacity-50" />}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

        </div>
    );
};
