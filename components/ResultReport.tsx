
import React from 'react';
import { BasicInfo, CalculationResult, TwoStepTest, YOUTUBE_URL } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface ResultReportProps {
    basicInfo: BasicInfo;
    result: CalculationResult;
    twoStepTest: TwoStepTest;
}

export const ResultReport: React.FC<ResultReportProps> = ({ basicInfo, result, twoStepTest }) => {
    const formattedDate = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(YOUTUBE_URL)}`;

    // ロコモ度の色定義
    const getColorConfig = (degree: number) => {
        switch (degree) {
            case 0: return { bg: 'bg-green-600', text: 'text-green-700', border: 'border-green-600', light: 'bg-green-50', badge: 'bg-green-100 text-green-800' };
            case 1: return { bg: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-500', light: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800' };
            case 2: return { bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-500', light: 'bg-orange-50', badge: 'bg-orange-100 text-orange-800' };
            case 3: return { bg: 'bg-red-600', text: 'text-red-700', border: 'border-red-600', light: 'bg-red-50', badge: 'bg-red-100 text-red-800' };
            default: return { bg: 'bg-gray-500', text: 'text-gray-700', border: 'border-gray-500', light: 'bg-gray-50', badge: 'bg-gray-100 text-gray-800' };
        }
    };

    const finalColor = getColorConfig(result.finalDegree);

    // 判定コメント
    const getComment = (degree: number) => {
        switch (degree) {
            case 0: return "ロコモではありません。\n現在の機能を維持しましょう。";
            case 1: return "移動機能の低下が始まっています。\n筋力・バランス力の維持が必要です。";
            case 2: return "移動機能の低下が進行しています。\n自立した生活のために対策が必要です。";
            case 3: return "社会参加に支障をきたす可能性があります。\n専門医への相談をお勧めします。";
            default: return "";
        }
    };

    // 行のスタイル（最終ロコモ度に該当する行を強調）
    const getRowStyle = (rowDegree: number) => {
        const isFinalDegree = rowDegree === result.finalDegree;
        if (isFinalDegree) {
            return `bg-white border-2 border-${finalColor.border.replace('border-', '')} relative z-10 shadow-lg transform scale-[1.005]`;
        }
        return "bg-slate-50 opacity-60 grayscale border border-gray-200";
    };

    // 個別のセル判定（そのテストの結果がこの行のロコモ度に該当するか）
    const isCellActive = (testDegree: number, rowDegree: number) => {
        return testDegree === rowDegree;
    };

    // 2ステップ計算用の値
    const maxStep = Math.max(twoStepTest.step1Cm, twoStepTest.step2Cm);

    return (
        // A4固定レイアウト (210mm x 297mm)
        <div
            className="bg-white text-slate-800 font-sans box-border relative flex flex-col mx-auto overflow-hidden"
            style={{
                width: '210mm',
                height: '296mm',      // A4 (297mm) よりわずかに小さくして1ページ収めを確実に
                padding: '6mm 8mm',   // 安全マージン
            }}
        >

            {/* 1. ヘッダーエリア */}
            <header className="border-b-2 border-slate-800 pb-1 mb-1 flex justify-between items-end h-[14mm] flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">ロコモチェック結果報告書</h1>
                    <p className="text-[9px] text-slate-500 font-medium mt-0.5 uppercase tracking-wider">Locomotive Syndrome Check Report</p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] text-slate-500 mb-0.5">測定日: {formattedDate}</p>
                    <div className="flex items-baseline gap-2 justify-end">
                        {basicInfo.companyName && <p className="text-xs text-slate-600 max-w-[150px] truncate">{basicInfo.companyName}</p>}
                        <p className="text-xl font-bold text-slate-900 border-b border-slate-300 px-2 min-w-[100px] text-center whitespace-nowrap">
                            {basicInfo.userName} <span className="text-xs font-normal">様</span>
                        </p>
                    </div>
                </div>
            </header>

            {/* 2. 基本情報 (コンパクトに) */}
            <div className="flex gap-4 mb-1.5 text-xs bg-slate-100 rounded px-4 py-1.5 border border-slate-200 h-[7mm] items-center flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500">性別</span>
                    <span className="font-bold text-base">{basicInfo.gender === 'male' ? '男性' : '女性'}</span>
                </div>
                <div className="w-px h-3 bg-slate-300"></div>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500">身長</span>
                    <span className="font-bold text-base">{basicInfo.heightCm} cm</span>
                </div>
            </div>

            {/* 3. メイン結果エリア (Top Summary) */}
            <div className="grid grid-cols-12 gap-2 mb-1.5 h-[40mm] flex-shrink-0">
                {/* 左側: 総合判定 */}
                <div className={`col-span-4 rounded-lg border-2 ${finalColor.border} flex flex-col items-center justify-center relative overflow-hidden bg-white shadow-sm p-1.5`}>
                    <div className={`absolute top-0 left-0 w-full h-1.5 ${finalColor.bg}`}></div>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">総合判定</p>
                    <div className="flex items-baseline my-0.5">
                        <span className="text-xs font-bold text-slate-600 mr-2">ロコモ度</span>
                        <span className={`text-5xl font-black leading-none ${finalColor.text}`}>
                            {result.finalDegree}
                        </span>
                    </div>
                    <div className={`w-full text-center py-0.5 px-1 rounded ${finalColor.light} mt-auto`}>
                        <p className={`text-[9px] font-bold leading-tight whitespace-pre-line ${finalColor.text}`}>{getComment(result.finalDegree)}</p>
                    </div>
                </div>

                {/* 右側: 各テスト結果サマリー */}
                <div className="col-span-8 grid grid-cols-3 gap-2">
                    {/* 立ち上がり */}
                    <div className="flex flex-col border border-slate-200 rounded p-1.5 bg-white shadow-sm justify-between">
                        <div className="text-[10px] font-bold bg-slate-700 text-white text-center py-0.5 rounded-sm mb-1">立ち上がり</div>
                        <div className="text-center">
                            <span className={`text-lg font-black ${getColorConfig(result.standUpDegree).text}`}>
                                ロコモ度 {result.standUpDegree}
                            </span>
                        </div>
                        {/* 理由表示: 文字サイズを小さくして詳細を表示可能に */}
                        <p className="text-[8px] text-slate-600 leading-tight text-center font-medium border-t border-dashed border-slate-200 pt-1 mt-1 break-words">
                            {result.standUpReason}
                        </p>
                    </div>

                    {/* 2ステップ */}
                    <div className="flex flex-col border border-slate-200 rounded p-1.5 bg-white shadow-sm justify-between">
                        <div className="text-[10px] font-bold bg-slate-700 text-white text-center py-0.5 rounded-sm mb-1">2ステップ</div>
                        <div className="text-center flex-grow flex flex-col justify-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <div className="flex flex-col items-center">
                                    <span className="text-[7px] text-slate-500 leading-none mb-0.5">最大2歩幅</span>
                                    <span className="font-mono font-bold text-slate-700 text-xs border-b border-slate-300 px-1">{maxStep}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-2">÷</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-[7px] text-slate-500 leading-none mb-0.5">身長</span>
                                    <span className="font-mono font-bold text-slate-700 text-xs border-b border-slate-300 px-1">{basicInfo.heightCm}</span>
                                </div>
                            </div>
                            <div className="flex items-baseline justify-center">
                                <span className="text-[9px] text-slate-400 mr-1">=</span>
                                <span className={`text-xl font-black leading-none ${getColorConfig(result.twoStepDegree).text}`}>
                                    {result.twoStepValue.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <p className={`text-center font-bold text-[10px] mt-0.5 ${getColorConfig(result.twoStepDegree).text}`}>ロコモ度 {result.twoStepDegree}</p>
                    </div>

                    {/* ロコモ25 */}
                    <div className="flex flex-col border border-slate-200 rounded p-1.5 bg-white shadow-sm justify-between">
                        <div className="text-[10px] font-bold bg-slate-700 text-white text-center py-0.5 rounded-sm mb-1">ロコモ25</div>
                        <div className="text-center">
                            <div className="text-[9px] text-slate-500 mb-0.5">回答合計点</div>
                            <span className={`text-lg font-black ${getColorConfig(result.locomo25Degree).text}`}>
                                {result.locomo25Score}
                            </span>
                            <span className="text-[9px] text-slate-400"> /100</span>
                        </div>
                        <p className={`text-center font-bold text-[10px] mt-0.5 ${getColorConfig(result.locomo25Degree).text}`}>ロコモ度 {result.locomo25Degree}</p>
                    </div>
                </div>
            </div>

            {/* 4. 詳細分析テーブル (マトリクス) */}
            <div className="mb-1 flex-grow flex flex-col min-h-0">
                <div className="flex items-center mb-1 flex-shrink-0">
                    <h3 className="text-xs font-bold text-slate-800 border-l-4 border-blue-600 pl-2">判定基準詳細</h3>
                    <span className="text-[9px] text-slate-500 ml-3">※各テストの結果（チェックマーク）のうち、最も高い度があなたのロコモ度です。</span>
                </div>

                <div className="border border-slate-300 rounded overflow-hidden shadow-sm flex-grow">
                    <table className="w-full text-center border-collapse table-fixed h-full">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700 h-[6mm] border-b border-slate-300 text-[9px] font-bold">
                                <th className="w-[8%] border-r border-slate-300">度</th>
                                <th className="w-[31%] border-r border-slate-300">① 立ち上がりテスト</th>
                                <th className="w-[30%] border-r border-slate-300">② 2ステップ値</th>
                                <th className="w-[31%]">③ ロコモ25</th>
                            </tr>
                        </thead>
                        <tbody className="text-[9px]">
                            {[3, 2, 1, 0].map((degree) => {
                                const isRowActive = degree === result.finalDegree;
                                const rowStyle = getRowStyle(degree);
                                const color = getColorConfig(degree);

                                // 各セルがアクティブかどうか
                                const isStandUpActive = isCellActive(result.standUpDegree, degree);
                                const isTwoStepActive = isCellActive(result.twoStepDegree, degree);
                                const isLocomo25Active = isCellActive(result.locomo25Degree, degree);

                                return (
                                    <tr key={degree} className={`${rowStyle} transition-all duration-300`}>
                                        {/* ロコモ度ラベル */}
                                        <td className={`border-r border-slate-300 font-black text-lg relative ${isRowActive ? color.bg + ' bg-opacity-10 text-' + color.text.split('-')[1] + '-700' : 'text-slate-400'}`}>
                                            {degree}
                                            {isRowActive && (
                                                <div className="absolute top-1 left-0 right-0 bg-red-600 text-white text-[6px] py-0.5 leading-none shadow-md text-center">
                                                    総合判定
                                                </div>
                                            )}
                                        </td>

                                        {/* 立ち上がり */}
                                        <td className={`border-r border-slate-300 px-2 py-1 text-left align-middle relative ${isStandUpActive ? 'bg-yellow-50/50' : ''}`}>
                                            {isStandUpActive && (
                                                <div className="absolute inset-0 border-2 border-red-500 rounded pointer-events-none z-20"></div>
                                            )}
                                            {isStandUpActive && <CheckCircle2 className="w-4 h-4 text-red-600 absolute -top-2 -right-2 bg-white rounded-full z-20" />}

                                            <div className={isStandUpActive ? "font-bold text-slate-900" : ""}>
                                                {degree === 3 && <><span className="block text-[10px] mb-0.5">両脚30cm 不可</span><span className="text-[8px] leading-tight block text-slate-500">（両脚40cm止まり、または不可）</span></>}
                                                {degree === 2 && <><span className="block text-[10px] mb-0.5">両脚20cm 不可</span><span className="text-[8px] leading-tight block text-slate-500">（両脚30cmは可能）</span></>}
                                                {degree === 1 && <><span className="block text-[10px] mb-0.5">片脚40cm 不可</span><span className="text-[8px] leading-tight block text-slate-500">（両脚20cm以下は可能）</span></>}
                                                {degree === 0 && <><span className="block text-[10px] mb-0.5">片脚40cm 可能</span><span className="text-[8px] leading-tight block text-slate-500">（左右両脚とも40cm可能）</span></>}
                                            </div>
                                        </td>

                                        {/* 2ステップ */}
                                        <td className={`border-r border-slate-300 px-2 align-middle font-bold text-[10px] relative ${isTwoStepActive ? 'bg-yellow-50/50' : ''}`}>
                                            {isTwoStepActive && (
                                                <div className="absolute inset-0 border-2 border-red-500 rounded pointer-events-none z-20"></div>
                                            )}
                                            {isTwoStepActive && <CheckCircle2 className="w-4 h-4 text-red-600 absolute -top-2 -right-2 bg-white rounded-full z-20" />}

                                            <div className={isTwoStepActive ? "font-bold text-slate-900" : ""}>
                                                {degree === 3 && "0.9 未満"}
                                                {degree === 2 && "0.9 〜 1.1 未満"}
                                                {degree === 1 && "1.1 〜 1.3 未満"}
                                                {degree === 0 && "1.3 以上"}
                                            </div>
                                        </td>

                                        {/* ロコモ25 */}
                                        <td className={`px-2 align-middle font-bold text-[10px] relative ${isLocomo25Active ? 'bg-yellow-50/50' : ''}`}>
                                            {isLocomo25Active && (
                                                <div className="absolute inset-0 border-2 border-red-500 rounded pointer-events-none z-20"></div>
                                            )}
                                            {isLocomo25Active && <CheckCircle2 className="w-4 h-4 text-red-600 absolute -top-2 -right-2 bg-white rounded-full z-20" />}

                                            <div className={isLocomo25Active ? "font-bold text-slate-900" : ""}>
                                                {degree === 3 && "24点 以上"}
                                                {degree === 2 && "16 〜 23点"}
                                                {degree === 1 && "7 〜 15点"}
                                                {degree === 0 && "6点 以下"}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 5. アドバイス & QR (下部固定サイズ) */}
            <div className="flex gap-3 h-[68mm] mt-auto flex-shrink-0">
                {/* 左側：対策アドバイス */}
                <div className="flex-grow flex flex-col border border-slate-200 rounded-lg p-2 bg-white shadow-sm overflow-hidden">
                    <h3 className="text-xs font-bold text-slate-800 border-l-4 border-green-600 pl-2 mb-2">対策・アドバイス</h3>

                    <div className="flex flex-col gap-2 h-full justify-between">
                        {/* 運動 */}
                        <div className="flex gap-2 h-[55%]">
                            <div className="w-1/2 bg-blue-50 border border-blue-100 rounded p-2">
                                <h4 className="font-bold text-blue-900 mb-1 flex items-center text-[10px]">
                                    <span className="bg-blue-600 text-white w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] mr-1 font-bold">1</span>
                                    片脚立ち
                                </h4>
                                <p className="text-[9px] text-slate-700 leading-relaxed">
                                    床につかない程度に片足を上げ、左右1分間ずつ。<br />
                                    <span className="text-[8px] text-slate-500 mt-0.5 block">※必ず机や壁に手をついて転倒防止。</span>
                                </p>
                            </div>
                            <div className="w-1/2 bg-blue-50 border border-blue-100 rounded p-2">
                                <h4 className="font-bold text-blue-900 mb-1 flex items-center text-[10px]">
                                    <span className="bg-blue-600 text-white w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] mr-1 font-bold">2</span>
                                    スクワット
                                </h4>
                                <p className="text-[9px] text-slate-700 leading-relaxed">
                                    深呼吸するペースで5〜6回。1日3セット。<br />
                                    <span className="text-[8px] text-slate-500 mt-0.5 block">※膝がつま先より前に出ないように。</span>
                                </p>
                            </div>
                        </div>

                        {/* 食事 */}
                        <div className="h-[40%] bg-green-50 border border-green-100 rounded p-2 flex items-center">
                            <div className="mr-2 text-green-600 bg-white p-1 rounded-full border border-green-200 flex-shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-green-900 text-[10px] mb-0.5">食事・栄養のポイント</h4>
                                <p className="text-[9px] text-slate-700 leading-tight">
                                    筋肉や骨を作る<strong>「たんぱく質（肉・魚・卵・大豆）」</strong>と<strong>「カルシウム（乳製品・小魚）」</strong>を意識して摂りましょう。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 右側：動画QR */}
                <div className="w-[30mm] shrink-0 flex flex-col items-center justify-center border border-slate-200 rounded-lg bg-slate-50 p-1.5">
                    <p className="text-[9px] font-bold text-slate-600 mb-1.5 text-center leading-tight">ロコトレ動画<br /><span className="text-[7px] font-normal">(日整会公式)</span></p>
                    <img src={qrCodeUrl} alt="QR Code" className="w-[20mm] h-[20mm] bg-white border border-slate-300 p-0.5 mb-1.5" />
                    <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="text-[8px] text-blue-600 text-center underline break-all leading-tight block">
                        動画を見る
                    </a>
                </div>
            </div>

            {/* フッター */}
            <footer className="mt-0.5 pt-1 text-center border-t border-slate-200 h-[6mm] flex flex-col items-center justify-center flex-shrink-0">
                <p className="text-[8px] text-slate-400 leading-none mb-0.5">
                    ※本レポートは簡易スクリーニング結果です。痛みや不安がある場合は整形外科専門医にご相談ください。
                </p>
                <p className="text-[7px] text-slate-300 leading-none">
                    【 日本整形外科学会:ロコモティブシンドローム予防啓発公式サイト ロコモオンライン 】
                </p>
            </footer>

        </div>
    );
};
