const LABELS = [
    'アカ討伐数',
    'アカ青箱数',
    'つよ討伐数',
    'つよM箱数',
    'グラ討伐数',
    'グラ青箱数',
    'その他'
];

/**
 * 実行
 */
window.onload = () => {
    $('.js-function-raws').each((i, e) => {
        const Fn = $(e).attr('rel');
        if (Fn === undefined || Fn === null) return;

        const keyLabel = `${Fn}Count`;
        const $count = $(e).children('._count');

        // ラベルテキストの読み込み
        loadLabelByKey(keyLabel, (selected) => {
            const $select = makeLabelSelect(selected);
            $(e).children('._label').append($select);
            $select.on('change', (s) => {
                saveLabelByKey(keyLabel, $select.val());
            });
        })

        // カウンターの読み込み
        loadCountByKey(keyLabel, (count) => $count.text(count));

        // 減算ボタンのクリックリスナー > DBから減算
        const $btnMinus = $(e).find('._btn-minus');
        $btnMinus.on('click', () => {
            minusCountByKey(keyLabel, (v) => $count.text(v));
        });

        // リセットボタンのクリックリスナー > DBから0に
        const $btnReset = $(e).find('._btn-reset');
        $btnReset.on('click', () => {
            resetCountByKey(keyLabel, (v) => $count.text(v));
        });
    });
};


/**
 * セレクトボックスUIを生成する
 * @param {*} str 初期Selected
 */
const makeLabelSelect = (str) => {
    const $select = $('<select></select>');
    $select.append($('<option></option>'));
    LABELS.forEach((label) => {
        const selected = str === label ? ' selected' : '';
        $select.append($(`<option${selected}>${label}</option>`));
    })
    return $select;
};

/**
 * ストレージ保存されている数値を読み込む
 * @param {*} key 
 * @param {*} callback 
 */
const loadCountByKey = (key, callback) => {
    if (chrome.storage === undefined) return;
    chrome.storage.local.get(key, (res) => {
        callback(res[key] || 0);
    });
};

/**
 * 数値を１減らす
 * @param {*} key
 * @param {*} callback
 */
const minusCountByKey = (key, callback) => {
    chrome.storage.local.get(key, (res) => {
        if (res[key] !== undefined && res[key] > 0) {
            res[key]--;
        } else {
            res[key] = 0;
        }
        chrome.storage.local.set(res, () => callback(res[key]));
    });
};

/**
 * 数値を０にする
 * @param {*} key 
 * @param {*} callback 
 */
const resetCountByKey = (key, callback) => {
    const obj = {};
    obj[key] = 0;
    chrome.storage.local.set(obj, () => callback(0));
};

/**
 * ラベルキーに保存されてるテキストを読み込む
 * @param {*} key 
 * @param {*} callback 
 */
const loadLabelByKey = (key, callback) => {
    if (chrome.storage === undefined) {
        callback('');
        return;
    }
    const labelKey = `${key}Label`;
    chrome.storage.local.get(labelKey, (res) => {
        callback(res[labelKey] || '');
    });
};

/**
 * ラベルキーにテキストを保存する
 * @param {*} key 
 * @param {*} val 
 */
const saveLabelByKey = (key, val) => {
    const labelKey = `${key}Label`;
    const obj = {};
    obj[labelKey] = val;
    chrome.storage.local.set(obj);
};
