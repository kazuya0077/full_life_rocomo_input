// スプレッドシート送信用のユーティリティ

// GASウェブアプリのURL - full_life_rocomo_input用（質問ごとのラベル対応版）
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxJMhGLCIeWymivw1DPJSv1Wz19bHWO0mVJJulot-RnlSM3RiXVFUwJ_Gd2Xi-jtpJIzw/exec';

export interface SpreadsheetData {
    date: string;           // 日時
    name: string;           // 氏名
    age: number | string;   // 年齢
    gender: string;         // 性別
    height: number;         // 身長

    // 立ち上がりテスト詳細
    standUpBoth: string;         // 両脚テスト結果（10cm/20cm/30cm/40cm/impossible/untested）
    standUpSingleRight: string;  // 片脚右テスト結果
    standUpSingleLeft: string;   // 片脚左テスト結果
    standUpScore: number;        // 立ち上がりスコア（ロコモ度 0-3）

    // 2ステップテスト詳細
    twoStep1Cm: number;     // 1回目の値(cm)
    twoStep2Cm: number;     // 2回目の値(cm)
    twoStepScore: number;   // 2ステップスコア（計算後の値）

    // ロコモ25詳細
    locomo25Answers: (number | null)[];  // 各25問の回答（0-4点、未回答はnull）
    locomo25Score: number;               // ロコモ25合計点数

    locomoLevel: number;    // 判定レベル（最終ロコモ度 0-3）
}

/**
 * スプレッドシートにデータを送信する
 */
export const sendToSpreadsheet = async (data: SpreadsheetData): Promise<{ result: string; error?: string }> => {
    try {
        await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // CORSを回避（GASはno-corsモードが必要な場合がある）
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // no-corsモードの場合、レスポンスは読み取れないため成功とみなす
        // CORSが設定されている場合は以下のコードを使用
        // const result = await response.json();
        // return result;

        return { result: 'success' };
    } catch (error) {
        console.error('スプレッドシート送信エラー:', error);
        return {
            result: 'error',
            error: error instanceof Error ? error.message : '不明なエラー'
        };
    }
};

/**
 * 現在の日時を取得（フォーマット: YYYY/MM/DD HH:mm:ss）
 */
export const getCurrentDateTime = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};
