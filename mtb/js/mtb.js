/**
 * data.jsのデータに応じてラジオボタンを生成しDOMに追加
 */
window.onload = () => {
  const radiosElement = [];
  for (const [i, c] of contents.entries()) {
      let str = `<tr><th class="">${c.title}</th>`;
    for (const [j, item] of c.items.entries()) {
      let radio = `<div class="form-check form-check-inline ms-1">
        <input class="form-check-input" type="radio" name="flexRadioDefault_${i}" id="${i}_${j}" value="${ item.value }">
        <label class="form-check-label" for="${i}_${j}">${ item.name }</label>
      </div>`;
      if (j === 0) {
        str = `${ str }<td>${ radio }`;
      } else if (j === j.length -1) {
        str = `${ str }${ radio }</td></tr>`;
      } else {
        str = `${ str }${ radio }`;
      }
    }
    radiosElement.push(str);
  }
  $('#data_table').html(radiosElement);
};


/**
 * ラジオボタンのチェック処理
 */
$(function(){
  // インプット要素を取得する
  var inputs = $('input.form-check-input');
  //読み込み時に「:checked」の疑似クラスを持っているinputの値を取得する
  var checked = inputs.filter(':checked').val();
  
  // インプット要素がクリックされたら
  inputs.on('click', function(){

    // クリックされたinputとcheckedを比較
    if($(this).val() === checked) {
      //inputの「:checked」をfalse
      $(this).prop('checked', false);
      // checkedを初期化
      checked = '';
        
    } else {
      // inputの「:checked」をtrue
      $(this).prop('checked', true);
      // inputの値をcheckedに代入
      checked = $(this).val();
    }

    $("#floatingTextarea").val(templateBuider());
  });
  
});

/**
 * ラジオボタンのチェックに応じて文章を生成し返却
 * @returns 文章生成後文字列
 */
const templateBuider = () => {
  str = "";
  for (const [i, c] of contents.entries()) {
    el = $(`input[name="flexRadioDefault_${i}"]:checked`);
    if (el.length == 0) continue;
    // 指定されたDOMのインデックスを取得（forネストのjに相当する部分）
    cIndex = el.attr("id").slice(-1);
    // 上位コンテンツが存在する場合は改行を入れる
    if (str != "") str = str + "\n\n";
    str = str.concat(c.items[cIndex].value);
  }
  return str;
};

/**
 * コピーボタン押下時処理
 */
const cpBtn = document.querySelector('#copy');
cpBtn.addEventListener('click', () => {
  if (!navigator.clipboard) {
    alert("このブラウザは対応していません");
    return;
  }

  navigator.clipboard.writeText($("#floatingTextarea").val()).then(
    () => { alert('文章をコピーしました。'); },
    () => { alert('コピーに失敗しました。'); }
  );
});


/**
 * clearボタン押下時処理
 */
const clearTextArea = () => {
  $('input.form-check-input:checked').prop('checked', false);
  $("#floatingTextarea").val(templateBuider());
};


/**
 * ExcelをHTMLとして出力
 */
const excel2Html = (arr) => {
    // Uint8Array形式のデータをワークブックデータとして読み込む（sheetjsを利用）
  var wb;
  wb = X.read(btoa(arr), {
      type: 'base64',
      cellDates: true,
  });

  // Excelファイル名
  const worksheet = wb.Sheets['重要なお知らせ'];
  // 読み込みたい範囲
  worksheet['!ref'] = 'E2:G100';

  const table = XLSX.utils.sheet_to_html( worksheet, {id: 'stock-data', header: '', footer: '' } );
  document.querySelector('#result').insertAdjacentHTML( 'afterbegin', table);
  $('#stock-data').attr('class', 'table table-bordered mt-2');

  // Tableヘッダ
  thead = `
    <thead><tr>
    <th class="table-secondary">パーツ</th>
    <th class="table-secondary">機種</th>
    <th class="table-secondary">入荷予定</th>
    </tr></thead>
  `;
  $('#stock-data').prepend(thead);
  $('tr > td:empty').parent().remove();
};


/**
 * FORMからXLSXファイルをリード
 */
var X = XLSX;

// ファイル選択時のメイン処理
function handleFile(e) {

  // FileListオブジェクトの配列から、一つ目のFileオブジェクトを取り出す
  var files = e.target.files;
  var f = files[0];

  // ファイルリード（ファイル読み込み後に実行する部分）
  var reader = new FileReader();
  reader.onload = function (e) {
    // ブラウザからのファイルリード結果を変数に保存
    var data = e.target.result;

    // バイナリデータを型つき配列（Uint8Array）に変換
    var arr = fixdata(data);

    // ExcelをHTMLとして出力
    excel2Html(arr);
  };

  // FileオブジェクトをArrayBufferとしてメモリ上に読み込む。（読み込んだらonload部分を実行する）
  reader.readAsArrayBuffer(f);
}


/**
 * バイナリデータを型つき配列（Uint8Array）に変換
 * @param {ArrayBuffer} data
 * @return {Uint8Array} o
 */
function fixdata(data) {
  var o = "",
    l = 0,
    w = 10240;
  for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w,
    l * w + w)));
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
  return o;
}


/**
 * DOMロード時処理
 */
$(function() {
  // ファイル選択欄 選択イベント
  $('#import_excel_data').on('change', function (e) {
    handleFile(e);
    $(this).next('.custom-file-label').html($(this)[0].files[0].name);
  });
});
