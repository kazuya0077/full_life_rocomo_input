/**
 * ロコモ評価 - 詳細データ記録用 GAS (Google Apps Script)
 * 
 * 使用方法:
 * 1. Google スプレッドシートを作成
 * 2. 拡張機能 > Apps Script を開く
 * 3. このコードを貼り付けて保存
 * 4. デプロイ > 新しいデプロイ > ウェブアプリ として公開
 *    - 実行者: 自分
 *    - アクセス: 全員
 * 5. 生成されたURLを spreadsheet.ts の GAS_WEB_APP_URL に設定
 */

function doPost(e) {
  // 1. スプレッドシートの取得 ( 'Results' シートを使用 )
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = 'Results';
  var sheet = ss.getSheetByName(sheetName);
  
  // シートが無ければ作成してヘッダーを追加
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    var headers = [
      '日時', 
      '氏名', 
      '年齢', 
      '性別', 
      '身長(cm)', 
      // 立ち上がりテスト詳細
      '両脚テスト結果',
      '片脚右テスト結果',
      '片脚左テスト結果',
      '立ち上がりスコア', 
      // 2ステップテスト詳細
      '2ステップ1回目(cm)',
      '2ステップ2回目(cm)',
      '2ステップスコア', 
      // ロコモ25詳細 (Q1-Q25)
      'Q1', 'Q2', 'Q3', 'Q4', 'Q5',
      'Q6', 'Q7', 'Q8', 'Q9', 'Q10',
      'Q11', 'Q12', 'Q13', 'Q14', 'Q15',
      'Q16', 'Q17', 'Q18', 'Q19', 'Q20',
      'Q21', 'Q22', 'Q23', 'Q24', 'Q25',
      // 合計と判定
      'ロコモ25合計点',
      '判定レベル'
    ];
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    
    // ヘッダー行のスタイル設定
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
  }
  
  // 2. 受信データのパース
  var params;
  try {
    // データが空の場合のハンドリング
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("データが受信できませんでした");
    }
    params = JSON.parse(e.postData.contents);
  } catch(err) {
    // エラーレスポンス
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error', 
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // 3. ロコモ25のラベルマッピング（質問ごとに異なる）
  var locomo25LabelsMap = {
    // Q1-3: 痛み
    1: ['痛くない', '少し痛い', '中程度痛い', 'かなり痛い', 'ひどく痛い'],
    2: ['痛くない', '少し痛い', '中程度痛い', 'かなり痛い', 'ひどく痛い'],
    3: ['痛くない', '少し痛い', '中程度痛い', 'かなり痛い', 'ひどく痛い'],
    // Q4: 制限
    4: ['制限なし', '少し制限', '中程度制限', 'かなり制限', 'ひどく制限'],
    // Q5-14: 困難度
    5: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    6: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    7: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    8: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    9: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    10: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    11: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    12: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    13: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    14: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    // Q15: 歩行距離
    15: ['2〜3km以上', '1km程度', '300m程度', '100m程度', '10m程度'],
    // Q16-21: 困難度
    16: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    17: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    18: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    19: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    20: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    21: ['困難でない', '少し困難', '中程度困難', 'かなり困難', 'ひどく困難'],
    // Q22-23: 控えている
    22: ['控えていない', '少し控えている', '中程度控えている', 'かなり控えている', '全く控えている'],
    23: ['控えていない', '少し控えている', '中程度控えている', 'かなり控えている', '全く控えている'],
    // Q24-25: 不安
    24: ['不安はない', '少し不安', '中程度不安', 'かなり不安', 'ひどく不安'],
    25: ['不安はない', '少し不安', '中程度不安', 'かなり不安', 'ひどく不安']
  };
  
  // 4. ロコモ25の回答を展開（質問ごとに適切なラベルで）
  var locomo25Answers = params.locomo25Answers || [];
  var q1to25 = [];
  for (var i = 0; i < 25; i++) {
    var answer = locomo25Answers[i];
    var questionNumber = i + 1;
    
    if (answer !== null && answer !== undefined) {
      var labels = locomo25LabelsMap[questionNumber];
      var label = labels && labels[answer] ? labels[answer] : '';
      q1to25.push(answer + '(' + label + ')');
    } else {
      q1to25.push('');
    }
  }
  
  // 5. 立ち上がりテスト結果の日本語変換
  var standUpLabels = {
    '10cm': '10cmから立てる',
    '20cm': '20cmから立てる',
    '30cm': '30cmから立てる',
    '40cm': '40cmから立てる',
    'impossible': '立てない',
    'untested': '未テスト'
  };
  
  var standUpBothLabel = standUpLabels[params.standUpBoth] || params.standUpBoth || '';
  var standUpRightLabel = standUpLabels[params.standUpSingleRight] || params.standUpSingleRight || '';
  var standUpLeftLabel = standUpLabels[params.standUpSingleLeft] || params.standUpSingleLeft || '';
  
  // 6. 行の追加
  try {
    var rowData = [
      params.date,                    // 日時
      params.name,                    // 氏名
      params.age,                     // 年齢
      params.gender,                  // 性別
      params.height,                  // 身長
      // 立ち上がりテスト詳細
      standUpBothLabel,               // 両脚テスト結果
      standUpRightLabel,              // 片脚右テスト結果
      standUpLeftLabel,               // 片脚左テスト結果
      'ロコモ度' + params.standUpScore, // 立ち上がりスコア
      // 2ステップテスト詳細
      params.twoStep1Cm,              // 1回目(cm)
      params.twoStep2Cm,              // 2回目(cm)
      params.twoStepScore,            // 2ステップスコア
    ];
    
    // ロコモ25の25問を追加
    rowData = rowData.concat(q1to25);
    
    // 合計と判定を追加
    rowData.push(params.locomo25Score);  // ロコモ25合計点
    rowData.push('ロコモ度' + params.locomoLevel);  // 判定レベル
    
    sheet.appendRow(rowData);
    
    // 成功レスポンス
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error', 
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GETリクエスト用（テスト確認用）
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'OK',
    message: 'ロコモ評価データ受信API - POST でデータを送信してください',
    version: '2.1 - 質問ごとのラベル対応版'
  })).setMimeType(ContentService.MimeType.JSON);
}
