/* ===== 다국어: 한국어 · English · 日本語 · 简体中文 · Español ===== */
(function () {
  const LANGS = [['ko', '한국어'], ['en', 'English'], ['ja', '日本語'], ['zh', '简体中文'], ['es', 'Español']];
  const IDX = { ko: 0, en: 1, ja: 2, zh: 3, es: 4 };
  const BLOCKLY_CODE = { ko: 'ko', en: 'en', ja: 'ja', zh: 'zh-hans', es: 'es' };

  // 각 항목: [한국어, English, 日本語, 简体中文, Español]
  const S = {
    /* ---------- 앱 ---------- */
    app_name: ['위두 메이커스', 'WeDo Makers', 'WeDo Makers', 'WeDo Makers', 'WeDo Makers'],
    app_sub: ['WeDo 2.0 워드블럭 + Python', 'WeDo 2.0 Word Blocks + Python', 'WeDo 2.0 ワードブロック + Python', 'WeDo 2.0 文字积木 + Python', 'WeDo 2.0 Bloques + Python'],
    proj_default: ['내 WeDo 프로젝트', 'My WeDo project', 'わたしの WeDo プロジェクト', '我的 WeDo 项目', 'Mi proyecto WeDo'],
    proj_new: ['새 프로젝트', 'New project', '新しいプロジェクト', '新项目', 'Proyecto nuevo'],
    proj_example: ['거리 센서 경보기 (예제)', 'Distance alarm (example)', '距離センサー警報機（例）', '距离报警器（示例）', 'Alarma de distancia (ejemplo)'],
    ex_button_msg: ['버튼을 눌렀어요!', 'Button pressed!', 'ボタンが押されたよ！', '按钮被按下了！', '¡Botón pulsado!'],
    print_default: ['안녕 WeDo!', 'Hello WeDo!', 'こんにちは WeDo!', '你好 WeDo!', '¡Hola WeDo!'],
    btn_new: ['새로', 'New', '新規', '新建', 'Nuevo'],
    btn_open: ['열기', 'Open', '開く', '打开', 'Abrir'],
    btn_save: ['저장', 'Save', '保存', '保存', 'Guardar'],
    btn_connect: ['허브 연결', 'Connect hub', 'ハブに接続', '连接集线器', 'Conectar hub'],
    btn_connecting: ['연결 중…', 'Connecting…', '接続中…', '连接中…', 'Conectando…'],
    btn_connected: ['연결됨 · 끊기', 'Connected · Disconnect', '接続中 · 切断', '已连接 · 断开', 'Conectado · Desconectar'],
    btn_run: ['실행', 'Run', '実行', '运行', 'Ejecutar'],
    btn_stop: ['정지', 'Stop', '停止', '停止', 'Detener'],
    t_help: ['도움말', 'Help', 'ヘルプ', '帮助', 'Ayuda'],
    t_zin: ['확대', 'Zoom in', '拡大', '放大', 'Acercar'],
    t_zout: ['축소', 'Zoom out', '縮小', '缩小', 'Alejar'],
    t_zfit: ['화면에 맞추기', 'Fit to screen', '画面に合わせる', '适合屏幕', 'Ajustar a la pantalla'],
    t_resize: ['드래그해서 위아래 크기 조절 (두 번 클릭: 원래대로)', 'Drag to resize (double-click to reset)', 'ドラッグで高さを調整（ダブルクリックで元に戻す）', '拖动调整高度（双击恢复）', 'Arrastra para cambiar el tamaño (doble clic: restablecer)'],
    lang: ['언어', 'Language', '言語', '语言', 'Idioma'],
    py_title: ['Python 코드', 'Python code', 'Python コード', 'Python 代码', 'Código Python'],
    py_badge: ['자동 생성', 'auto', '自動生成', '自动生成', 'automático'],
    btn_copy: ['복사', 'Copy', 'コピー', '复制', 'Copiar'],
    btn_save_py: ['.py 저장', 'Save .py', '.py 保存', '保存 .py', 'Guardar .py'],
    btn_py_help: ['PC에서 실행', 'Run on PC', 'PC で実行', '在电脑上运行', 'Ejecutar en PC'],
    tab_hub: ['허브', 'Hub', 'ハブ', '集线器', 'Hub'],
    tab_console: ['콘솔', 'Console', 'コンソール', '控制台', 'Consola'],
    btn_clear: ['지우기', 'Clear', 'クリア', '清除', 'Borrar'],
    chip_sim: ['가상 허브', 'Virtual hub', '仮想ハブ', '虚拟集线器', 'Hub virtual'],
    chip_real: ['실제 허브', 'Real hub', '実機ハブ', '真实集线器', 'Hub real'],
    hub_none: ['허브가 연결되지 않았습니다 — 가상 허브로 실행됩니다.', 'No hub connected — programs run on the virtual hub.', 'ハブ未接続 — 仮想ハブで実行します。', '未连接集线器 — 将在虚拟集线器上运行。', 'Sin hub conectado: se ejecuta en el hub virtual.'],
    port: ['포트', 'Port', 'ポート', '端口', 'Puerto'],
    dev_motor: ['모터', 'Motor', 'モーター', '马达', 'Motor'],
    dev_motor_sim: ['모터 (가상)', 'Motor (virtual)', 'モーター（仮想）', '马达（虚拟）', 'Motor (virtual)'],
    dev_tilt: ['기울기 센서', 'Tilt sensor', '傾きセンサー', '倾斜传感器', 'Sensor de inclinación'],
    dev_dist: ['거리 센서', 'Distance sensor', '距離センサー', '距离传感器', 'Sensor de distancia'],
    dev_empty: ['비어 있음', 'Empty', '空き', '空', 'Vacío'],
    dev_unknown: ['장치', 'Device', 'デバイス', '设备', 'Dispositivo'],
    stopped: ['정지', 'Stopped', '停止', '停止', 'Parado'],
    hub_light: ['허브 불빛', 'Hub light', 'ハブのライト', '集线器灯', 'Luz del hub'],
    off: ['꺼짐', 'Off', 'オフ', '关', 'Apagada'],
    no_sound: ['소리 없음', 'No sound', '音なし', '无声音', 'Sin sonido'],
    hub_button: ['허브 버튼', 'Hub button', 'ハブのボタン', '集线器按钮', 'Botón del hub'],
    pressed: ['눌림', 'Pressed', '押されている', '按下', 'Pulsado'],
    released: ['안 눌림', 'Released', '押されていない', '未按下', 'Suelto'],
    hold_btn: ['누르고 있기', 'Press and hold', '押し続ける', '按住', 'Mantener pulsado'],
    press_real_btn: ['허브의 버튼을 눌러 보세요', 'Press the button on the hub', 'ハブのボタンを押してみて', '请按集线器上的按钮', 'Pulsa el botón del hub'],
    dist_sim: ['가상값 — 슬라이더로 바꿔 보세요', 'Virtual value — drag the slider', '仮想値 — スライダーで変えてみよう', '虚拟值 — 拖动滑块试试', 'Valor virtual: mueve el control'],
    dist_real: ['실제 센서 값', 'Live sensor value', '実際のセンサー値', '实时传感器值', 'Valor real del sensor'],
    dist_missing: ['거리 센서가 연결되지 않았습니다', 'No distance sensor connected', '距離センサーが接続されていません', '未连接距离传感器', 'No hay sensor de distancia'],
    level: ['수평', 'Level', '水平', '水平', 'Nivelado'],
    keyboard: ['PC 키보드', 'PC keyboard', 'PC キーボード', '电脑键盘', 'Teclado del PC'],
    key_try: ['키를 눌러 보세요', 'Press a key', 'キーを押してみて', '按一个键试试', 'Pulsa una tecla'],
    none: ['없음', 'None', 'なし', '无', 'Ninguna'],
    last: ['마지막', 'Last', '最後', '最后', 'Última'],
    var_mon: ['변수 모니터', 'Variables', '変数モニター', '变量监视器', 'Variables'],
    var_mon_empty: ['변수 분류에서 변수를 만들면 값이 여기 보입니다.', 'Make a variable in the Variables category to watch it here.', '「変数」で変数を作ると、ここに値が表示されます。', '在“变量”分类中新建变量，值会显示在这里。', 'Crea una variable en «Variables» para verla aquí.'],
    var_create: ['＋ 변수 만들기', '＋ Make a variable', '＋ 変数を作る', '＋ 新建变量', '＋ Crear una variable'],
    var_hint: ['변수를 만들면 숫자를 저장하고 계산할 수 있어요.', 'Make a variable to store and calculate numbers.', '変数を作ると数を覚えて計算できます。', '新建变量后就能保存和计算数字。', 'Crea una variable para guardar y calcular números.'],

    /* 토스트 · 로그 */
    ready: ['위두 메이커스 준비 완료. 블록을 연결하고 ▶ 실행을 눌러 보세요.', 'WeDo Makers is ready. Snap blocks together and press ▶ Run.', '準備完了。ブロックをつないで ▶ 実行 を押そう。', '准备就绪。拼好积木后按 ▶ 运行。', 'WeDo Makers está listo. Une bloques y pulsa ▶ Ejecutar.'],
    run_log: ['실행', 'Run', '実行', '运行', 'Ejecutar'],
    run_sim_suffix: [' (가상 허브)', ' (virtual hub)', '（仮想ハブ）', '（虚拟集线器）', ' (hub virtual)'],
    run_sim_toast: ['허브가 연결되지 않아 가상 허브로 실행합니다.', 'No hub connected — running on the virtual hub.', 'ハブ未接続のため仮想ハブで実行します。', '未连接集线器，将在虚拟集线器上运行。', 'Sin hub: se ejecuta en el hub virtual.'],
    end_done: ['프로그램이 끝났습니다.', 'Program finished.', 'プログラムが終わりました。', '程序已结束。', 'El programa terminó.'],
    end_error: ['오류로 멈췄습니다.', 'Stopped because of an error.', 'エラーで止まりました。', '因错误而停止。', 'Detenido por un error.'],
    end_stop: ['프로그램을 멈췄습니다.', 'Program stopped.', 'プログラムを止めました。', '程序已停止。', 'Programa detenido.'],
    err: ['오류', 'Error', 'エラー', '错误', 'Error'],
    no_events: ['실행할 이벤트 블록이 없습니다. "▶ 실행 버튼을 누를 때" 블록 아래에 블록을 연결하세요.', 'Nothing to run. Attach blocks under "when ▶ Run is clicked".', '実行するイベントがありません。「▶ 実行ボタンが押されたとき」の下にブロックをつないでください。', '没有可运行的事件。请把积木接在“当 ▶ 运行 被点击”下面。', 'No hay nada que ejecutar. Une bloques bajo «al hacer clic en ▶ Ejecutar».'],
    connected_log: ['허브 연결됨', 'Hub connected', 'ハブ接続', '集线器已连接', 'Hub conectado'],
    connected_toast: ['허브에 연결했습니다. (허브 불빛: 파랑)', 'Hub connected. (hub light: blue)', 'ハブに接続しました。（ライト：青）', '已连接集线器。（灯：蓝色）', 'Hub conectado. (luz: azul)'],
    disconnected: ['허브 연결이 끊어졌습니다.', 'Hub disconnected.', 'ハブとの接続が切れました。', '集线器已断开。', 'Hub desconectado.'],
    connect_fail: ['연결에 실패했습니다. 허브 버튼을 다시 누르고 시도하세요.', 'Connection failed. Press the hub button and try again.', '接続に失敗しました。ハブのボタンを押してもう一度。', '连接失败。请按集线器按钮后重试。', 'Error de conexión. Pulsa el botón del hub e inténtalo de nuevo.'],
    saved_as: ['저장했습니다 — 다운로드가 막힌 환경이면 복사를 사용하세요:', 'Saved — if downloads are blocked, use Copy:', '保存しました — ダウンロードできない場合はコピーを使ってください:', '已保存 — 若下载被阻止，请使用复制：', 'Guardado — si la descarga está bloqueada, usa Copiar:'],
    save_blocked: ['저장이 취소되었거나 막혔습니다. 복사를 사용하세요.', 'Saving was cancelled or blocked. Use Copy instead.', '保存がキャンセルまたはブロックされました。コピーを使ってください。', '保存被取消或阻止，请使用复制。', 'Se canceló o bloqueó el guardado. Usa Copiar.'],
    copied: ['복사했습니다.', 'Copied.', 'コピーしました。', '已复制。', 'Copiado.'],
    copy_manual: ['자동 복사가 막혀 있습니다. 아래 내용을 선택해 복사하세요.', 'Automatic copy is blocked. Select the text below and copy it.', '自動コピーできません。下の内容を選択してコピーしてください。', '无法自动复制。请选中下面的内容复制。', 'La copia automática está bloqueada. Selecciona el texto y cópialo.'],
    opened: ['프로젝트를 열었습니다.', 'Project opened.', 'プロジェクトを開きました。', '项目已打开。', 'Proyecto abierto.'],
    open_fail: ['올바른 프로젝트 파일이 아닙니다.', 'This is not a valid project file.', '正しいプロジェクトファイルではありません。', '不是有效的项目文件。', 'No es un archivo de proyecto válido.'],
    confirm_new: ['지금 작업을 지우고 새 프로젝트를 시작할까요?', 'Clear the current work and start a new project?', '今の作業を消して新しいプロジェクトを始めますか？', '清除当前作品并新建项目吗？', '¿Borrar el trabajo actual y empezar un proyecto nuevo?'],
    ok: ['확인', 'OK', 'OK', '确定', 'Aceptar'],
    cancel: ['취소', 'Cancel', 'キャンセル', '取消', 'Cancelar'],
    close: ['닫기', 'Close', '閉じる', '关闭', 'Cerrar'],
    code_err: ['코드 생성 오류', 'Code generation error', 'コード生成エラー', '代码生成错误', 'Error al generar código'],

    /* Python 머리말 */
    py_head1: ['위두 메이커스(WeDo 2.0)에서 블록으로 만든 코드입니다.', 'Made with blocks in WeDo Makers (WeDo 2.0).', 'WeDo Makers（WeDo 2.0）のブロックから作ったコードです。', '由 WeDo Makers（WeDo 2.0）积木生成的代码。', 'Código creado con bloques en WeDo Makers (WeDo 2.0).'],
    py_head2: ['실행: pip install bleak  →  이 파일 옆에 wedo2.py 를 두고  python 파일이름.py', 'Run: pip install bleak  →  put wedo2.py next to this file  →  python this_file.py', '実行: pip install bleak  →  このファイルの横に wedo2.py を置いて  python ファイル名.py', '运行：pip install bleak  →  把 wedo2.py 放在本文件旁  →  python 文件名.py', 'Ejecutar: pip install bleak  →  pon wedo2.py junto a este archivo  →  python archivo.py'],
    py_empty: ['이벤트 블록(예: ▶ 실행 버튼을 누를 때)을 놓고 블록을 연결해 보세요.', 'Add an event block (e.g. "when ▶ Run is clicked") and attach blocks to it.', 'イベントブロック（例：▶ 実行ボタンが押されたとき）を置いてブロックをつなごう。', '放一个事件积木（如“当 ▶ 运行 被点击”）再接上积木。', 'Añade un bloque de evento (p. ej. «al hacer clic en ▶ Ejecutar») y une bloques.'],

    /* ---------- 블록 분류 ---------- */
    cat_event: ['이벤트', 'Events', 'イベント', '事件', 'Eventos'],
    cat_motor: ['모터', 'Motors', 'モーター', '马达', 'Motores'],
    cat_light: ['불빛', 'Light', 'ライト', '灯光', 'Luz'],
    cat_sound: ['소리', 'Sound', '音', '声音', 'Sonido'],
    cat_sensor: ['센서', 'Sensors', 'センサー', '传感器', 'Sensores'],
    cat_control: ['제어', 'Control', '制御', '控制', 'Control'],
    cat_op: ['연산', 'Operators', '演算', '运算', 'Operadores'],
    cat_var: ['변수', 'Variables', '変数', '变量', 'Variables'],
    cat_out: ['출력', 'Output', '出力', '输出', 'Salida'],

    /* ---------- 블록 문장 ---------- */
    b_when_start: ['▶ 실행 버튼을 누를 때', 'when ▶ Run is clicked', '▶ 実行ボタンが押されたとき', '当 ▶ 运行 被点击', 'al hacer clic en ▶ Ejecutar'],
    b_when_button: ['허브 버튼을 누를 때', 'when hub button is pressed', 'ハブのボタンが押されたとき', '当集线器按钮被按下', 'al pulsar el botón del hub'],
    b_when_key: ['키보드 %1 키를 누를 때', 'when %1 key is pressed', 'キーボードの %1 キーが押されたとき', '当按下键盘 %1 键', 'al pulsar la tecla %1'],
    b_when_distance: ['거리 센서 값이 %1 %2 이 될 때', 'when distance %1 %2', '距離センサーの値が %1 %2 になったとき', '当距离传感器值 %1 %2', 'cuando la distancia sea %1 %2'],
    b_when_tilt: ['허브가 %1 으로 기울어질 때', 'when hub is tilted %1', 'ハブが %1 に傾いたとき', '当集线器向 %1 倾斜', 'al inclinar el hub hacia %1'],
    b_motor_on_for: ['%1 모터를 %2 초 동안 켜기', 'turn %1 motor on for %2 seconds', '%1 のモーターを %2 秒オン', '%1 马达开启 %2 秒', 'encender motor %1 durante %2 s'],
    b_motor_on: ['%1 모터 켜기', 'turn %1 motor on', '%1 のモーターをオン', '开启 %1 马达', 'encender motor %1'],
    b_motor_off: ['%1 모터 끄기', 'turn %1 motor off', '%1 のモーターをオフ', '关闭 %1 马达', 'apagar motor %1'],
    b_motor_power: ['%1 모터 파워를 %2 %% 로 정하기', 'set %1 motor power to %2 %%', '%1 のモーターのパワーを %2 %% にする', '将 %1 马达功率设为 %2 %%', 'fijar potencia del motor %1 en %2 %%'],
    b_motor_dir: ['%1 모터 방향을 %2 으로 정하기', 'set %1 motor direction to %2', '%1 のモーターの向きを %2 にする', '将 %1 马达方向设为 %2', 'fijar dirección del motor %1: %2'],
    b_motor_reverse: ['%1 모터 방향 바꾸기', 'reverse %1 motor direction', '%1 のモーターの向きを反対にする', '反转 %1 马达方向', 'invertir dirección del motor %1'],
    b_light_color: ['허브 불빛을 %1 으로 켜기', 'set hub light to %1', 'ハブのライトを %1 にする', '将集线器灯设为 %1', 'encender luz del hub en %1'],
    b_light_rgb: ['허브 불빛을 R %1 G %2 B %3 으로 켜기', 'set hub light to R %1 G %2 B %3', 'ハブのライトを R %1 G %2 B %3 にする', '将集线器灯设为 R %1 G %2 B %3', 'luz del hub en R %1 G %2 B %3'],
    b_light_off: ['허브 불빛 끄기', 'turn hub light off', 'ハブのライトを消す', '关闭集线器灯', 'apagar luz del hub'],
    b_sound_note: ['%1 음을 %2 초 동안 연주하기', 'play note %1 for %2 seconds', '%1 の音を %2 秒鳴らす', '演奏 %1 音 %2 秒', 'tocar nota %1 durante %2 s'],
    b_sound_tone: ['%1 Hz 소리를 %2 초 동안 연주하기', 'play %1 Hz for %2 seconds', '%1 Hz の音を %2 秒鳴らす', '播放 %1 Hz 声音 %2 秒', 'tocar %1 Hz durante %2 s'],
    b_sound_stop: ['소리 끄기', 'stop sound', '音を止める', '停止声音', 'detener sonido'],
    b_distance: ['거리 센서 값', 'distance', '距離センサーの値', '距离传感器值', 'distancia'],
    b_distance_cmp: ['거리 센서 값 %1 %2', 'distance %1 %2', '距離センサーの値 %1 %2', '距离传感器值 %1 %2', 'distancia %1 %2'],
    b_tilt_is: ['허브가 %1 으로 기울어졌는가?', 'hub tilted %1 ?', 'ハブが %1 に傾いている？', '集线器向 %1 倾斜？', '¿hub inclinado hacia %1?'],
    b_tilt_angle: ['%1 기울기 각도', 'tilt angle %1', '%1 の傾き角度', '%1 倾斜角度', 'ángulo de inclinación %1'],
    b_button: ['허브 버튼이 눌렸는가?', 'hub button pressed?', 'ハブのボタンが押されている？', '集线器按钮被按下？', '¿botón del hub pulsado?'],
    b_key_pressed: ['키보드 %1 키가 눌렸는가?', 'key %1 pressed?', '%1 キーが押されている？', '按键 %1 被按下？', '¿tecla %1 pulsada?'],
    b_timer: ['타이머 (초)', 'timer (s)', 'タイマー（秒）', '计时器（秒）', 'temporizador (s)'],
    b_reset_timer: ['타이머 초기화', 'reset timer', 'タイマーをリセット', '重置计时器', 'reiniciar temporizador'],
    b_wait: ['%1 초 기다리기', 'wait %1 seconds', '%1 秒待つ', '等待 %1 秒', 'esperar %1 segundos'],
    b_wait_until: ['%1 이 될 때까지 기다리기', 'wait until %1', '%1 まで待つ', '等待直到 %1', 'esperar hasta que %1'],
    b_forever: ['무한 반복하기 %1 %2', 'forever %1 %2', 'ずっと %1 %2', '重复执行 %1 %2', 'por siempre %1 %2'],
    b_stop: ['■ 모든 프로그램 멈추기', '■ stop all', '■ すべて止める', '■ 全部停止', '■ detener todo'],
    b_print: ['%1 콘솔에 출력하기', 'print %1 to console', '%1 をコンソールに表示', '在控制台输出 %1', 'mostrar %1 en la consola'],

    /* 선택지 */
    o_port1: ['포트 1', 'port 1', 'ポート1', '端口 1', 'puerto 1'],
    o_port2: ['포트 2', 'port 2', 'ポート2', '端口 2', 'puerto 2'],
    o_allports: ['모든 포트', 'all ports', 'すべてのポート', '所有端口', 'todos los puertos'],
    o_cw: ['↻ 시계방향', '↻ clockwise', '↻ 時計回り', '↻ 顺时针', '↻ horario'],
    o_ccw: ['↺ 반시계방향', '↺ counterclockwise', '↺ 反時計回り', '↺ 逆时针', '↺ antihorario'],
    c_RED: ['빨강', 'red', '赤', '红', 'rojo'],
    c_ORANGE: ['주황', 'orange', 'オレンジ', '橙', 'naranja'],
    c_YELLOW: ['노랑', 'yellow', '黄', '黄', 'amarillo'],
    c_GREEN: ['초록', 'green', '緑', '绿', 'verde'],
    c_CYAN: ['하늘', 'cyan', '水色', '青', 'cian'],
    c_BLUE: ['파랑', 'blue', '青', '蓝', 'azul'],
    c_PURPLE: ['보라', 'purple', '紫', '紫', 'morado'],
    c_PINK: ['분홍', 'pink', 'ピンク', '粉', 'rosa'],
    c_WHITE: ['흰색', 'white', '白', '白', 'blanco'],
    n_262: ['도 (C4)', 'C4 (Do)', 'ド (C4)', 'do (C4)', 'Do (C4)'],
    n_294: ['레 (D4)', 'D4 (Re)', 'レ (D4)', 're (D4)', 'Re (D4)'],
    n_330: ['미 (E4)', 'E4 (Mi)', 'ミ (E4)', 'mi (E4)', 'Mi (E4)'],
    n_349: ['파 (F4)', 'F4 (Fa)', 'ファ (F4)', 'fa (F4)', 'Fa (F4)'],
    n_392: ['솔 (G4)', 'G4 (Sol)', 'ソ (G4)', 'sol (G4)', 'Sol (G4)'],
    n_440: ['라 (A4)', 'A4 (La)', 'ラ (A4)', 'la (A4)', 'La (A4)'],
    n_494: ['시 (B4)', 'B4 (Si)', 'シ (B4)', 'si (B4)', 'Si (B4)'],
    n_523: ['높은 도 (C5)', 'C5 (high Do)', '高いド (C5)', '高音 do (C5)', 'Do agudo (C5)'],
    d_UP: ['위쪽', 'up', '上', '上', 'arriba'],
    d_DOWN: ['아래쪽', 'down', '下', '下', 'abajo'],
    d_LEFT: ['왼쪽', 'left', '左', '左', 'izquierda'],
    d_RIGHT: ['오른쪽', 'right', '右', '右', 'derecha'],
    d_ANY: ['아무 방향', 'any', 'どこか', '任意方向', 'cualquiera'],
    k_space: ['스페이스', 'space', 'スペース', '空格', 'espacio'],
    k_up: ['↑ 위 화살표', '↑ up arrow', '↑ 上矢印', '↑ 上箭头', '↑ flecha arriba'],
    k_down: ['↓ 아래 화살표', '↓ down arrow', '↓ 下矢印', '↓ 下箭头', '↓ flecha abajo'],
    k_left: ['← 왼쪽 화살표', '← left arrow', '← 左矢印', '← 左箭头', '← flecha izquierda'],
    k_right: ['→ 오른쪽 화살표', '→ right arrow', '→ 右矢印', '→ 右箭头', '→ flecha derecha'],
    k_enter: ['엔터', 'enter', 'エンター', '回车', 'intro'],
    k_any: ['아무', 'any', 'どれか', '任意', 'cualquier'],

    /* ---------- 대화상자 ---------- */
    bt_title: ['블루투스로 허브에 연결할 수 없습니다', 'Cannot connect to the hub over Bluetooth', 'Bluetooth でハブに接続できません', '无法通过蓝牙连接集线器', 'No se puede conectar al hub por Bluetooth'],
    bt_unsupported: ['이 브라우저는 Web Bluetooth를 지원하지 않습니다.', 'This browser does not support Web Bluetooth.', 'このブラウザは Web Bluetooth に対応していません。', '此浏览器不支持 Web Bluetooth。', 'Este navegador no admite Web Bluetooth.'],
    bt_insecure: ['보안 연결(https)이 아닌 주소에서는 블루투스를 쓸 수 없습니다.', 'Bluetooth only works on secure (https) addresses.', 'https 以外のアドレスでは Bluetooth を使えません。', '只有在安全（https）地址下才能使用蓝牙。', 'Bluetooth solo funciona en direcciones seguras (https).'],
    bt_blocked: ['이 화면(미리보기/삽입된 페이지)에서는 브라우저가 블루투스 접근을 막고 있습니다.', 'The browser blocks Bluetooth in this preview / embedded page.', 'このプレビュー（埋め込みページ）ではブラウザが Bluetooth をブロックしています。', '在此预览/嵌入页面中，浏览器阻止了蓝牙。', 'El navegador bloquea Bluetooth en esta vista previa o página incrustada.'],
    bt_tips: [
      '<li>PC·크롬북의 <b>Chrome</b> 또는 <b>Edge</b>를 사용하세요.</li><li>배포한 <b>https</b> 주소(예: GitHub Pages)나 <code>http://localhost</code> 에서 페이지를 직접 여세요.</li><li>그동안에도 <b>가상 허브</b>로 프로그램을 실행해 볼 수 있습니다.</li>',
      '<li>Use <b>Chrome</b> or <b>Edge</b> on a PC or Chromebook.</li><li>Open the page directly from its <b>https</b> address (e.g. GitHub Pages) or <code>http://localhost</code>.</li><li>Meanwhile you can still run programs on the <b>virtual hub</b>.</li>',
      '<li>PC・Chromebook の <b>Chrome</b> か <b>Edge</b> を使ってください。</li><li>公開した <b>https</b> アドレス（GitHub Pages など）か <code>http://localhost</code> で直接開いてください。</li><li>その間も <b>仮想ハブ</b> でプログラムを試せます。</li>',
      '<li>请在电脑或 Chromebook 上使用 <b>Chrome</b> 或 <b>Edge</b>。</li><li>直接打开部署后的 <b>https</b> 地址（如 GitHub Pages）或 <code>http://localhost</code>。</li><li>在此期间仍可用<b>虚拟集线器</b>运行程序。</li>',
      '<li>Usa <b>Chrome</b> o <b>Edge</b> en un PC o Chromebook.</li><li>Abre la página desde su dirección <b>https</b> (p. ej. GitHub Pages) o <code>http://localhost</code>.</li><li>Mientras tanto puedes usar el <b>hub virtual</b>.</li>'],
    help_title: ['위두 메이커스 사용법', 'How to use WeDo Makers', 'WeDo Makers の使い方', 'WeDo Makers 使用方法', 'Cómo usar WeDo Makers'],
    help_body: [
      `<ol>
<li><b>허브 연결</b>: WeDo 2.0 허브의 초록 버튼을 누른 뒤 <b>허브 연결</b>을 누르고 목록에서 허브를 고릅니다. 연결되면 허브 불빛이 <b style="color:#1e5bff">파랑</b>으로 켜지고, 프로그램이 끝나면 다시 파랑으로 돌아옵니다.</li>
<li><b>코딩</b>: 왼쪽 분류에서 블록을 끌어와 <b>▶ 실행 버튼을 누를 때</b> 아래에 붙입니다. 오른쪽에 같은 내용의 Python 코드가 바로 보입니다.</li>
<li><b>실행/정지</b>: 초록 <b>실행</b>, 빨간 <b>정지</b> 버튼 (<kbd>Ctrl</kbd>+<kbd>Enter</kbd> / <kbd>Esc</kbd>). 반복 블록은 한 바퀴에 1/30초씩 돌아갑니다.</li>
<li><b>변수</b>: <b>변수</b> 분류에서 변수를 만들어 숫자를 넣고 바꿉니다. 블록 화면 오른쪽 위 <b>변수 모니터</b>에 값이 실시간으로 보입니다.</li>
<li><b>키보드 신호</b>: <b>키보드 ○ 키를 누를 때</b> / <b>키가 눌렸는가?</b> 블록으로 PC 키보드를 리모컨처럼 씁니다. 한/영 상태와 관계없이 동작합니다.</li>
<li><b>가상 허브</b>: 허브가 없어도 실행됩니다. 아래 <b>허브</b> 탭에서 거리·기울기·버튼 값을 바꿔 보세요.</li>
</ol><p><b>브라우저</b>: 블루투스 연결은 PC/크롬북의 <b>Chrome · Edge</b>에서 <b>https</b> 주소로 열었을 때 동작합니다.</p>`,
      `<ol>
<li><b>Connect</b>: press the green button on the WeDo 2.0 hub, click <b>Connect hub</b> and pick your hub. When connected the hub light turns <b style="color:#1e5bff">blue</b>, and it goes back to blue when a program ends.</li>
<li><b>Code</b>: drag blocks from the categories on the left and snap them under <b>when ▶ Run is clicked</b>. The matching Python code appears on the right.</li>
<li><b>Run/Stop</b>: the green <b>Run</b> and red <b>Stop</b> buttons (<kbd>Ctrl</kbd>+<kbd>Enter</kbd> / <kbd>Esc</kbd>). Each loop turn takes 1/30 s.</li>
<li><b>Variables</b>: make a variable in <b>Variables</b>, set and change numbers. Live values appear in the <b>Variables</b> monitor at the top right of the block area.</li>
<li><b>Keyboard</b>: use <b>when ○ key is pressed</b> / <b>key pressed?</b> to drive your robot from the PC keyboard.</li>
<li><b>Virtual hub</b>: no hub? Programs still run. Change distance, tilt and button values in the <b>Hub</b> tab.</li>
</ol><p><b>Browser</b>: Bluetooth works in <b>Chrome · Edge</b> on a PC/Chromebook when the page is opened from an <b>https</b> address.</p>`,
      `<ol>
<li><b>接続</b>：WeDo 2.0 ハブの緑のボタンを押し、<b>ハブに接続</b> を押して一覧からハブを選びます。接続するとライトが<b style="color:#1e5bff">青</b>になり、プログラムが終わると青に戻ります。</li>
<li><b>コーディング</b>：左の分類からブロックをドラッグし、<b>▶ 実行ボタンが押されたとき</b> の下につなぎます。右に同じ内容の Python コードが表示されます。</li>
<li><b>実行／停止</b>：緑の<b>実行</b>、赤の<b>停止</b>（<kbd>Ctrl</kbd>+<kbd>Enter</kbd> / <kbd>Esc</kbd>）。くり返しは1回 1/30 秒です。</li>
<li><b>変数</b>：<b>変数</b> で変数を作り、数を入れたり変えたりします。値はブロック画面右上の<b>変数モニター</b>に表示されます。</li>
<li><b>キーボード</b>：<b>○ キーが押されたとき</b>／<b>キーが押されている？</b> で PC のキーボードをリモコンにできます。</li>
<li><b>仮想ハブ</b>：ハブがなくても実行できます。<b>ハブ</b> タブで距離・傾き・ボタンを変えてみましょう。</li>
</ol><p><b>ブラウザ</b>：Bluetooth は PC・Chromebook の <b>Chrome / Edge</b> で <b>https</b> のアドレスから開いたときに使えます。</p>`,
      `<ol>
<li><b>连接</b>：按下 WeDo 2.0 集线器上的绿色按钮，点击<b>连接集线器</b>并选择集线器。连接后集线器灯变为<b style="color:#1e5bff">蓝色</b>，程序结束后也会恢复蓝色。</li>
<li><b>编程</b>：从左侧分类拖出积木，接在<b>当 ▶ 运行 被点击</b>下面。右侧会显示相同内容的 Python 代码。</li>
<li><b>运行／停止</b>：绿色<b>运行</b>、红色<b>停止</b>（<kbd>Ctrl</kbd>+<kbd>Enter</kbd> / <kbd>Esc</kbd>）。循环每转一圈需 1/30 秒。</li>
<li><b>变量</b>：在<b>变量</b>中新建变量，设置和改变数字。数值会实时显示在积木区右上角的<b>变量监视器</b>中。</li>
<li><b>键盘</b>：用<b>当按下键盘 ○ 键</b>／<b>按键被按下？</b>积木，把电脑键盘当作遥控器。</li>
<li><b>虚拟集线器</b>：没有集线器也能运行。可在<b>集线器</b>标签页中改变距离、倾斜和按钮的值。</li>
</ol><p><b>浏览器</b>：在电脑/Chromebook 的 <b>Chrome · Edge</b> 中通过 <b>https</b> 地址打开时才能使用蓝牙。</p>`,
      `<ol>
<li><b>Conectar</b>: pulsa el botón verde del hub WeDo 2.0, haz clic en <b>Conectar hub</b> y elige tu hub. Al conectar, la luz del hub se pone <b style="color:#1e5bff">azul</b> y vuelve a azul cuando termina un programa.</li>
<li><b>Programar</b>: arrastra bloques desde las categorías de la izquierda y únelos bajo <b>al hacer clic en ▶ Ejecutar</b>. El código Python equivalente aparece a la derecha.</li>
<li><b>Ejecutar/Detener</b>: botones verde <b>Ejecutar</b> y rojo <b>Detener</b> (<kbd>Ctrl</kbd>+<kbd>Enter</kbd> / <kbd>Esc</kbd>). Cada vuelta de un bucle dura 1/30 s.</li>
<li><b>Variables</b>: crea una variable en <b>Variables</b> y guarda o cambia números. Los valores se ven en vivo en el monitor de <b>Variables</b>, arriba a la derecha.</li>
<li><b>Teclado</b>: con <b>al pulsar la tecla ○</b> / <b>¿tecla pulsada?</b> puedes manejar el robot con el teclado del PC.</li>
<li><b>Hub virtual</b>: sin hub, los programas también funcionan. Cambia distancia, inclinación y botón en la pestaña <b>Hub</b>.</li>
</ol><p><b>Navegador</b>: Bluetooth funciona en <b>Chrome · Edge</b> en PC/Chromebook abriendo la página desde una dirección <b>https</b>.</p>`],
    pyhelp_title: ['생성된 Python 코드를 PC에서 실행하기', 'Run the generated Python code on a PC', '生成された Python コードを PC で実行する', '在电脑上运行生成的 Python 代码', 'Ejecutar el código Python en un PC'],
    pyhelp_body: [
      '<ol><li>Python 3.9 이상을 설치하고 <code>pip install bleak</code> 를 실행합니다. (키보드 블록을 썼다면 <code>pip install pynput</code> 도)</li><li>아래 <b>wedo2.py</b> 를 받아 <b>.py 저장</b>으로 받은 파일과 같은 폴더에 둡니다.</li><li>허브의 초록 버튼을 누른 뒤 <code>python 내프로젝트.py</code> 를 실행합니다.</li></ol><p class="muted">웹에서 허브에 연결 중이면 먼저 끊으세요. <kbd>Ctrl</kbd>+<kbd>C</kbd>로 멈춥니다.</p>',
      '<ol><li>Install Python 3.9+ and run <code>pip install bleak</code> (plus <code>pip install pynput</code> if you used keyboard blocks).</li><li>Download <b>wedo2.py</b> below and put it in the same folder as the file from <b>Save .py</b>.</li><li>Press the green hub button, then run <code>python my_project.py</code>.</li></ol><p class="muted">Disconnect the hub on the web page first. Stop with <kbd>Ctrl</kbd>+<kbd>C</kbd>.</p>',
      '<ol><li>Python 3.9 以上を入れて <code>pip install bleak</code> を実行します（キーボードブロックを使ったら <code>pip install pynput</code> も）。</li><li>下の <b>wedo2.py</b> を、<b>.py 保存</b> したファイルと同じフォルダに置きます。</li><li>ハブの緑のボタンを押して <code>python my_project.py</code> を実行します。</li></ol><p class="muted">Web でハブに接続中なら先に切断してください。<kbd>Ctrl</kbd>+<kbd>C</kbd> で止まります。</p>',
      '<ol><li>安装 Python 3.9+，运行 <code>pip install bleak</code>（若使用了键盘积木，还需 <code>pip install pynput</code>）。</li><li>下载下方的 <b>wedo2.py</b>，放在与 <b>保存 .py</b> 文件相同的文件夹中。</li><li>按下集线器绿色按钮后运行 <code>python my_project.py</code>。</li></ol><p class="muted">如果网页已连接集线器，请先断开。按 <kbd>Ctrl</kbd>+<kbd>C</kbd> 停止。</p>',
      '<ol><li>Instala Python 3.9+ y ejecuta <code>pip install bleak</code> (y <code>pip install pynput</code> si usaste bloques de teclado).</li><li>Descarga <b>wedo2.py</b> y ponlo en la misma carpeta que el archivo de <b>Guardar .py</b>.</li><li>Pulsa el botón verde del hub y ejecuta <code>python mi_proyecto.py</code>.</li></ol><p class="muted">Desconecta antes el hub de la página web. Detén con <kbd>Ctrl</kbd>+<kbd>C</kbd>.</p>'],
    lib_save: ['wedo2.py 저장', 'Save wedo2.py', 'wedo2.py を保存', '保存 wedo2.py', 'Guardar wedo2.py'],
    lib_copy: ['wedo2.py 복사', 'Copy wedo2.py', 'wedo2.py をコピー', '复制 wedo2.py', 'Copiar wedo2.py'],
    report_btn: ['오류 신고', 'Report a problem', '不具合を報告', '报告问题', 'Informar de un error'],
    report_title: ['오류 신고 · 의견 보내기', 'Report a problem · Send feedback', '不具合の報告・ご意見', '报告问题 · 反馈意见', 'Informar de un error · Opiniones'],
    report_desc: ['오류나 개선 의견은 아래 메일로 보내 주세요. 어떤 블록으로 무엇을 했는지와 화면 캡처를 함께 보내 주시면 빨리 고칠 수 있습니다.', 'Please send problems or ideas to the address below. Describe which blocks you used and attach a screenshot so we can fix it quickly.', '不具合やご意見は下のアドレスへお送りください。使ったブロックと画面キャプチャを添えていただくと早く直せます。', '如遇问题或有建议，请发送到下面的邮箱。说明使用了哪些积木并附上截图，可以更快修复。', 'Envía errores o ideas a la dirección de abajo. Indica qué bloques usaste y adjunta una captura para corregirlo rápido.'],
    report_mail: ['메일 보내기', 'Send e-mail', 'メールを送る', '发送邮件', 'Enviar correo'],
    report_copy_mail: ['메일 주소 복사', 'Copy address', 'アドレスをコピー', '复制邮箱地址', 'Copiar dirección'],
    report_copy_diag: ['진단 정보 복사', 'Copy diagnostics', '診断情報をコピー', '复制诊断信息', 'Copiar diagnóstico'],
    report_diag_note: ['메일 프로그램이 열리지 않으면 주소와 아래 진단 정보를 복사해 직접 보내 주세요.', 'If no mail app opens, copy the address and the diagnostics below and send them yourself.', 'メールアプリが開かない場合は、アドレスと下の診断情報をコピーして送ってください。', '若邮件程序未打开，请复制邮箱地址和下面的诊断信息自行发送。', 'Si no se abre el correo, copia la dirección y el diagnóstico de abajo y envíalos tú.'],
    report_subject: ['오류 신고', 'Problem report', '不具合報告', '问题报告', 'Informe de error'],
    report_body_hint: ['[어떤 상황에서 어떤 문제가 생겼는지 적어 주세요]', '[Describe what you were doing and what went wrong]', '[どんな時にどんな問題が起きたか書いてください]', '[请描述在什么情况下出现了什么问题]', '[Describe qué hacías y qué falló]'],
    report_line: ['오류·의견:', 'Problems & feedback:', '不具合・ご意見:', '问题与反馈：', 'Errores y opiniones:'],

    /* ---------- AI 카메라 ---------- */
    cat_cam: ['AI 카메라', 'AI Camera', 'AI カメラ', 'AI 摄像头', 'Cámara IA'],
    cam_btn: ['AI 카메라', 'AI camera', 'AI カメラ', 'AI 摄像头', 'Cámara IA'],
    cam_title: ['AI 카메라', 'AI camera', 'AI カメラ', 'AI 摄像头', 'Cámara IA'],
    cam_start: ['카메라 켜기', 'Start camera', 'カメラをオン', '打开摄像头', 'Encender cámara'],
    cam_stop: ['카메라 끄기', 'Stop camera', 'カメラをオフ', '关闭摄像头', 'Apagar cámara'],
    cam_m_pose: ['스켈레톤', 'Skeleton', '骨格', '骨架', 'Esqueleto'],
    cam_m_hand: ['손 모양', 'Hand', '手の形', '手势', 'Mano'],
    cam_m_object: ['사물', 'Objects', '物体', '物体', 'Objetos'],
    cam_m_color: ['색깔', 'Colors', '色', '颜色', 'Colores'],
    cam_loading: ['AI 모델 준비 중…', 'Loading AI model…', 'AI モデルを準備中…', '正在加载 AI 模型…', 'Cargando modelo IA…'],
    cam_off: ['카메라가 꺼져 있습니다', 'Camera is off', 'カメラはオフです', '摄像头已关闭', 'La cámara está apagada'],
    cam_wait: ['AI 카메라를 준비하고 있습니다…', 'Getting the AI camera ready…', 'AI カメラを準備しています…', '正在准备 AI 摄像头…', 'Preparando la cámara IA…'],
    cam_ready_log: ['AI 카메라 준비 완료', 'AI camera ready', 'AI カメラの準備完了', 'AI 摄像头已就绪', 'Cámara IA lista'],
    cam_err_model: ['AI 모델을 불러오지 못했습니다', 'Could not load the AI model', 'AI モデルを読み込めませんでした', '无法加载 AI 模型', 'No se pudo cargar el modelo IA'],
    cam_denied: ['카메라를 쓸 수 없습니다. 브라우저 주소창의 카메라 권한을 허용해 주세요.', 'Camera is not available. Allow camera access in the browser address bar.', 'カメラを使えません。アドレスバーでカメラを許可してください。', '无法使用摄像头。请在浏览器地址栏允许摄像头权限。', 'No se puede usar la cámara. Permite el acceso en la barra de direcciones.'],
    cam_unsupported: ['이 브라우저에서는 카메라를 쓸 수 없습니다.', 'This browser cannot use a camera.', 'このブラウザではカメラを使えません。', '此浏览器无法使用摄像头。', 'Este navegador no puede usar la cámara.'],
    cam_insecure: ['카메라는 https 주소에서만 쓸 수 있습니다.', 'The camera only works on https addresses.', 'カメラは https のアドレスでのみ使えます。', '摄像头只能在 https 地址下使用。', 'La cámara solo funciona en direcciones https.'],
    cam_hint: ['카메라 블록을 쓰고 실행하면 자동으로 켜집니다. 좌표: x 0(왼쪽)~100(오른쪽), y 0(아래)~100(위)', 'Turns on automatically when a program uses camera blocks. x 0 (left)–100 (right), y 0 (bottom)–100 (top)', 'カメラブロックを使って実行すると自動でオン。x 0(左)〜100(右)、y 0(下)〜100(上)', '程序使用摄像头积木时会自动打开。x 0(左)~100(右)，y 0(下)~100(上)', 'Se enciende sola si el programa usa bloques de cámara. x 0 (izq.)–100 (der.), y 0 (abajo)–100 (arriba)'],
    cam_person: ['사람', 'Person', '人', '人', 'Persona'],
    cam_fingers: ['손가락', 'Fingers', '指', '手指', 'Dedos'],
    cam_seen: ['보임', 'seen', '見えている', '可见', 'visible'],
    cam_notseen: ['안 보임', 'not seen', '見えない', '不可见', 'no visible'],
    cam_size: ['크기', 'size', '大きさ', '大小', 'tamaño'],
    b_when_cond: ['%1 이 될 때', 'when %1', '%1 になったとき', '当 %1', 'cuando %1'],
    tt_when_cond: ['조건이 거짓→참으로 바뀌는 순간마다 실행됩니다. (AI 카메라·센서 블록을 넣어 보세요)', 'Runs each time the condition changes from false to true. Try camera or sensor blocks.', '条件が偽から真に変わるたびに実行。カメラやセンサーのブロックを入れてみよう。', '每当条件从假变为真时运行。试试放入摄像头或传感器积木。', 'Se ejecuta cada vez que la condición pasa de falso a verdadero.'],
    b_cam_person: ['카메라에 사람이 보이는가?', 'person seen?', 'カメラに人が映っている？', '摄像头看到人？', '¿se ve a una persona?'],
    b_cam_arm_up: ['%1 을 들었는가?', '%1 raised?', '%1 を上げている？', '举起了 %1？', '¿%1 levantado?'],
    b_cam_body_pos: ['%1 의 %2 위치', '%1 position %2', '%1 の %2 座標', '%1 的 %2 位置', 'posición %2 de %1'],
    b_cam_elbow: ['%1 팔꿈치 각도', '%1 elbow angle', '%1 のひじの角度', '%1 肘部角度', 'ángulo del codo %1'],
    b_cam_tilt: ['몸(어깨) 기울기', 'body (shoulder) tilt', '体（肩）の傾き', '身体（肩膀）倾斜', 'inclinación del cuerpo'],
    b_cam_hand_seen: ['손이 보이는가?', 'hand seen?', '手が映っている？', '看到手？', '¿se ve una mano?'],
    b_cam_gesture: ['손 모양이 %1 인가?', 'hand gesture is %1 ?', '手の形が %1 ？', '手势是 %1？', '¿gesto de la mano %1?'],
    b_cam_fingers: ['펼친 손가락 수', 'fingers up', '開いた指の数', '伸出的手指数', 'dedos levantados'],
    b_cam_hand_pos: ['손의 %1 위치', 'hand position %1', '手の %1 座標', '手的 %1 位置', 'posición %1 de la mano'],
    b_cam_object_seen: ['%1 이 보이는가?', '%1 seen?', '%1 が映っている？', '看到 %1？', '¿se ve %1?'],
    b_cam_object_pos: ['%1 의 %2 위치', '%1 position %2', '%1 の %2 座標', '%1 的 %2 位置', 'posición %2 de %1'],
    b_cam_object_count: ['보이는 %1 의 수', 'number of %1', '映っている %1 の数', '看到的 %1 数量', 'número de %1'],
    b_cam_color_seen: ['%1 색이 보이는가?', 'color %1 seen?', '%1 色が映っている？', '看到 %1 色？', '¿se ve el color %1?'],
    b_cam_color_pos: ['%1 색의 %2', 'color %1 %2', '%1 色の %2', '%1 色的 %2', '%2 del color %1'],
    tt_xy: ['x: 0(왼쪽)~100(오른쪽), y: 0(아래)~100(위). 보이지 않으면 -1', 'x: 0 (left)–100 (right), y: 0 (bottom)–100 (top). -1 if not seen', 'x: 0(左)〜100(右)、y: 0(下)〜100(上)。見えないと -1', 'x: 0(左)~100(右)，y: 0(下)~100(上)。看不到时为 -1', 'x: 0 (izq.)–100 (der.), y: 0 (abajo)–100 (arriba). -1 si no se ve'],
    tt_elbow: ['팔을 쭉 펴면 180, 접으면 작아집니다. 보이지 않으면 -1', '180 when the arm is straight, smaller when bent. -1 if not seen', '腕をのばすと 180、曲げると小さくなる。見えないと -1', '手臂伸直为 180，弯曲时变小。看不到时为 -1', '180 con el brazo recto, menos al doblarlo. -1 si no se ve'],
    tt_tilt: ['화면 오른쪽으로 기울이면 +, 왼쪽이면 − (도)', '+ when leaning to the right of the screen, − to the left (degrees)', '画面の右に傾くと +、左は −（度）', '向屏幕右侧倾斜为 +，左侧为 −（度）', '+ al inclinarse a la derecha de la pantalla, − a la izquierda (grados)'],
    o_size: ['크기', 'size', '大きさ', '大小', 'tamaño'],
    side_LEFT: ['왼팔', 'left arm', '左腕', '左臂', 'brazo izquierdo'],
    side_RIGHT: ['오른팔', 'right arm', '右腕', '右臂', 'brazo derecho'],
    side_BOTH: ['두 팔', 'both arms', '両腕', '双臂', 'ambos brazos'],
    bp_NOSE: ['코', 'nose', '鼻', '鼻子', 'nariz'],
    bp_LEFT_WRIST: ['왼손목', 'left wrist', '左手首', '左手腕', 'muñeca izq.'],
    bp_RIGHT_WRIST: ['오른손목', 'right wrist', '右手首', '右手腕', 'muñeca der.'],
    bp_LEFT_ELBOW: ['왼팔꿈치', 'left elbow', '左ひじ', '左肘', 'codo izq.'],
    bp_RIGHT_ELBOW: ['오른팔꿈치', 'right elbow', '右ひじ', '右肘', 'codo der.'],
    bp_LEFT_SHOULDER: ['왼어깨', 'left shoulder', '左肩', '左肩', 'hombro izq.'],
    bp_RIGHT_SHOULDER: ['오른어깨', 'right shoulder', '右肩', '右肩', 'hombro der.'],
    bp_LEFT_HIP: ['왼엉덩이', 'left hip', '左腰', '左髋', 'cadera izq.'],
    bp_RIGHT_HIP: ['오른엉덩이', 'right hip', '右腰', '右髋', 'cadera der.'],
    bp_LEFT_KNEE: ['왼무릎', 'left knee', '左ひざ', '左膝', 'rodilla izq.'],
    bp_RIGHT_KNEE: ['오른무릎', 'right knee', '右ひざ', '右膝', 'rodilla der.'],
    bp_LEFT_ANKLE: ['왼발목', 'left ankle', '左足首', '左脚踝', 'tobillo izq.'],
    bp_RIGHT_ANKLE: ['오른발목', 'right ankle', '右足首', '右脚踝', 'tobillo der.'],
    g_Closed_Fist: ['✊ 주먹', '✊ fist', '✊ グー', '✊ 拳头', '✊ puño'],
    g_Open_Palm: ['✋ 보자기', '✋ open palm', '✋ パー', '✋ 张开手掌', '✋ mano abierta'],
    g_Pointing_Up: ['☝ 검지 위로', '☝ pointing up', '☝ 人さし指を上に', '☝ 食指向上', '☝ índice arriba'],
    g_Thumb_Up: ['👍 엄지 위로', '👍 thumbs up', '👍 グッド', '👍 点赞', '👍 pulgar arriba'],
    g_Thumb_Down: ['👎 엄지 아래로', '👎 thumbs down', '👎 ブー', '👎 拇指向下', '👎 pulgar abajo'],
    g_Victory: ['✌ 브이', '✌ victory', '✌ ピース', '✌ 胜利', '✌ victoria'],
    g_ILoveYou: ['🤟 사랑해', '🤟 I love you', '🤟 アイラブユー', '🤟 我爱你', '🤟 te quiero'],
    g_None: ['없음', 'none', 'なし', '无', 'ninguno'],
    obj_person: ['사람', 'person', '人', '人', 'persona'],
    obj_cup: ['컵', 'cup', 'コップ', '杯子', 'taza'],
    obj_bottle: ['병', 'bottle', 'ボトル', '瓶子', 'botella'],
    obj_sports_ball: ['공', 'ball', 'ボール', '球', 'pelota'],
    obj_cell_phone: ['휴대폰', 'phone', 'スマホ', '手机', 'móvil'],
    obj_book: ['책', 'book', '本', '书', 'libro'],
    obj_scissors: ['가위', 'scissors', 'はさみ', '剪刀', 'tijeras'],
    obj_teddy_bear: ['곰 인형', 'teddy bear', 'くまのぬいぐるみ', '泰迪熊', 'osito'],
    obj_banana: ['바나나', 'banana', 'バナナ', '香蕉', 'plátano'],
    obj_apple: ['사과', 'apple', 'りんご', '苹果', 'manzana'],
    obj_cat: ['고양이', 'cat', 'ねこ', '猫', 'gato'],
    obj_dog: ['강아지', 'dog', 'いぬ', '狗', 'perro'],
    obj_chair: ['의자', 'chair', 'いす', '椅子', 'silla'],
    obj_laptop: ['노트북', 'laptop', 'ノートPC', '笔记本电脑', 'portátil'],
    obj_car: ['자동차', 'car', '車', '汽车', 'coche'],
    obj_any: ['아무 사물', 'any object', '何かの物体', '任意物体', 'cualquier objeto'],
    cc_red: ['빨강', 'red', '赤', '红', 'rojo'],
    cc_green: ['초록', 'green', '緑', '绿', 'verde'],
    cc_blue: ['파랑', 'blue', '青', '蓝', 'azul'],
    cc_yellow: ['노랑', 'yellow', '黄', '黄', 'amarillo'],
    cam_help: [
      '<li><b>AI 카메라</b>: PC 카메라로 <b>스켈레톤(몸)</b>, <b>손 모양</b>, <b>사물</b>, <b>색깔</b>을 인식합니다. <b>AI 카메라</b> 분류의 블록을 쓰고 실행하면 카메라가 자동으로 켜지고, 블록 화면 오른쪽 아래 창에 인식 결과가 그려집니다. <b>○ 이 될 때</b> 이벤트와 함께 쓰면 "오른팔을 들면 모터 켜기" 같은 프로그램을 만들 수 있습니다. 영상은 PC 밖으로 전송되지 않습니다.</li>',
      '<li><b>AI camera</b>: the PC camera recognizes the <b>skeleton (body)</b>, <b>hand gestures</b>, <b>objects</b> and <b>colors</b>. Use blocks from <b>AI Camera</b> and press Run — the camera turns on and the results are drawn in the window at the bottom right. Combine with <b>when ○</b> to make e.g. "raise your right arm to start the motor". Video never leaves your PC.</li>',
      '<li><b>AI カメラ</b>：PC のカメラで<b>骨格（体）</b>・<b>手の形</b>・<b>物体</b>・<b>色</b>を認識します。<b>AI カメラ</b>のブロックを使って実行すると自動でカメラがオンになり、右下のウィンドウに結果が表示されます。<b>○ になったとき</b>と組み合わせて「右腕を上げたらモーターをオン」なども作れます。映像は PC の外に送られません。</li>',
      '<li><b>AI 摄像头</b>：用电脑摄像头识别<b>骨架（身体）</b>、<b>手势</b>、<b>物体</b>和<b>颜色</b>。使用 <b>AI 摄像头</b>分类中的积木并运行，摄像头会自动打开，识别结果显示在右下角窗口中。配合<b>当 ○</b>事件可以做出“举起右臂就启动马达”等程序。视频不会离开你的电脑。</li>',
      '<li><b>Cámara IA</b>: la cámara del PC reconoce el <b>esqueleto (cuerpo)</b>, <b>gestos de la mano</b>, <b>objetos</b> y <b>colores</b>. Usa bloques de <b>Cámara IA</b> y pulsa Ejecutar: la cámara se enciende y el resultado se dibuja en la ventana de abajo a la derecha. Con <b>cuando ○</b> puedes hacer «levanta el brazo derecho para encender el motor». El vídeo no sale de tu PC.</li>'],
    pycam_note: [
      '<p class="muted">AI 카메라 블록을 썼다면 <code>pip install mediapipe opencv-python</code> 도 필요합니다. 처음 실행할 때 AI 모델을 자동으로 받고, 카메라 창은 <kbd>Q</kbd>로 닫습니다.</p>',
      '<p class="muted">If you used AI camera blocks, also run <code>pip install mediapipe opencv-python</code>. Models download on first run; close the camera window with <kbd>Q</kbd>.</p>',
      '<p class="muted">AI カメラのブロックを使ったら <code>pip install mediapipe opencv-python</code> も必要です。初回にモデルを自動で取得し、カメラ画面は <kbd>Q</kbd> で閉じます。</p>',
      '<p class="muted">若使用了 AI 摄像头积木，还需 <code>pip install mediapipe opencv-python</code>。首次运行会自动下载模型，按 <kbd>Q</kbd> 关闭摄像头窗口。</p>',
      '<p class="muted">Si usaste bloques de cámara IA, ejecuta también <code>pip install mediapipe opencv-python</code>. Los modelos se descargan la primera vez; cierra la ventana con <kbd>Q</kbd>.</p>'],

    /* ---------- AI 학습 (사물 학습 · 색 학습) ---------- */
    cam_m_learn: ['학습한 사물', 'Learned objects', '学習した物', '学习的物体', 'Objetos aprendidos'],
    learn_btn: ['🧠 AI 학습하기', '🧠 Teach the AI', '🧠 AI に教える', '🧠 训练 AI', '🧠 Enseñar a la IA'],
    learn_title: ['AI 학습', 'Teach the AI', 'AI 学習', 'AI 训练', 'Enseñar a la IA'],
    learn_tab_obj: ['사물 학습', 'Object learning', '物の学習', '物体学习', 'Aprender objetos'],
    learn_tab_color: ['색 학습', 'Color learning', '色の学習', '颜色学习', 'Aprender colores'],
    learn_tab_guide: ['학습 방법 안내', 'How to teach', '学習のしかた', '训练方法', 'Cómo enseñar'],
    learn_none: ['(먼저 학습하세요)', '(teach first)', '（先に学習）', '（请先训练）', '(enseña primero)'],
    learn_cls_default: ['물건', 'Object', '物', '物体', 'Objeto'],
    learn_cls_bg: ['배경 (아무것도 없음)', 'Background (nothing)', '背景（なにもない）', '背景（什么都没有）', 'Fondo (nada)'],
    learn_add_cls: ['＋ 클래스 추가', '＋ Add class', '＋ クラスを追加', '＋ 添加类别', '＋ Añadir clase'],
    learn_hold: ['누르고 있으면 촬영', 'Hold to record', '押している間撮影', '按住拍摄', 'Mantén para grabar'],
    learn_clear: ['사진 지우기', 'Clear photos', '写真を消す', '清除照片', 'Borrar fotos'],
    learn_delete: ['클래스 삭제', 'Delete class', 'クラスを削除', '删除类别', 'Eliminar clase'],
    learn_cdelete: ['색 삭제', 'Delete color', '色を削除', '删除颜色', 'Eliminar color'],
    learn_photos: ['장', 'photos', '枚', '张', 'fotos'],
    learn_train: ['학습시키기', 'Train', '学習させる', '开始训练', 'Entrenar'],
    learn_trained: ['학습 완료', 'Trained', '学習完了', '训练完成', 'Entrenado'],
    learn_retrain: ['사진이 바뀌었습니다 — 다시 학습시키세요', 'Photos changed — train again', '写真が変わりました — もう一度学習', '照片已更改 — 请重新训练', 'Las fotos cambiaron: vuelve a entrenar'],
    learn_need: ['클래스 2개 이상에 사진을 3장 이상씩 모으면 학습할 수 있어요.', 'Collect at least 3 photos in 2 or more classes to train.', '2つ以上のクラスに3枚以上ずつ集めると学習できます。', '至少 2 个类别、每个 3 张以上照片才能训练。', 'Reúne al menos 3 fotos en 2 o más clases para entrenar.'],
    learn_result: ['지금 보이는 것', 'What the AI sees now', 'いま見えているもの', '现在看到的', 'Lo que ve la IA ahora'],
    learn_test_hint: ['학습시킨 뒤 카메라 앞에 물건을 보여 주면 확신도가 막대로 표시됩니다.', 'After training, show an object to the camera to see the confidence bars.', '学習後、カメラに物を見せると確信度がバーで表示されます。', '训练后把物体给摄像头看，就会显示置信度条。', 'Tras entrenar, enseña un objeto a la cámara para ver las barras de confianza.'],
    learn_cam_needed: ['학습하려면 카메라를 켜세요.', 'Turn on the camera to teach.', '学習するにはカメラをオンにしてください。', '请先打开摄像头再训练。', 'Enciende la cámara para enseñar.'],
    learn_export: ['Python용 학습 파일 저장', 'Save learning file for Python', 'Python 用学習ファイルを保存', '保存 Python 用训练文件', 'Guardar archivo para Python'],
    learn_import: ['학습 파일 불러오기', 'Load learning file', '学習ファイルを読み込む', '载入训练文件', 'Cargar archivo de aprendizaje'],
    learn_saved_note: ['학습 내용은 프로젝트와 함께 저장됩니다.', 'Learning is saved together with the project.', '学習内容はプロジェクトと一緒に保存されます。', '训练内容会和项目一起保存。', 'Lo aprendido se guarda con el proyecto.'],
    learn_color_center: ['가운데 네모에 색 물건을 가득 채우고 누르세요', 'Fill the center box with the colored object, then press', '真ん中の四角に色の物をいっぱいに入れて押してください', '让彩色物体填满中间方框后按下', 'Llena el cuadro central con el objeto de color y pulsa'],
    learn_color_take: ['가운데 색 학습', 'Learn the center color', '真ん中の色を学習', '学习中间的颜色', 'Aprender el color central'],
    learn_color_fail: ['색이 뚜렷하지 않습니다. 흰색·검정·회색은 학습할 수 없어요. 선명한 색 물건을 가까이 대 보세요.', 'Color is not clear. White, black and gray cannot be learned — hold a vivid object closer.', '色がはっきりしません。白・黒・灰色は学習できません。鮮やかな色の物を近づけて。', '颜色不明显。白、黑、灰无法学习，请把鲜艳的物体靠近。', 'El color no es claro. Blanco, negro y gris no se pueden aprender: acerca un objeto de color vivo.'],
    learn_color_name: ['색 이름', 'Color name', '色の名前', '颜色名称', 'Nombre del color'],
    learn_color_default: ['내 색', 'My color', 'わたしの色', '我的颜色', 'Mi color'],
    learn_color_range: ['허용 범위', 'Tolerance', '許容範囲', '容差', 'Tolerancia'],
    learn_color_found: ['화면에서 찾음', 'found on screen', '画面で見つけた', '在画面中找到', 'encontrado'],
    learn_color_missing: ['안 보임', 'not seen', '見えない', '未看到', 'no visible'],
    learn_color_empty: ['아직 학습한 색이 없습니다.', 'No learned colors yet.', 'まだ学習した色はありません。', '还没有学习的颜色。', 'Aún no hay colores aprendidos.'],
    learn_rename: ['이름 바꾸기', 'Rename', '名前を変える', '重命名', 'Renombrar'],
    b_cam_learned_is: ['학습한 사물이 %1 인가?', 'learned object is %1 ?', '学習した物が %1 ？', '学习的物体是 %1？', '¿objeto aprendido es %1?'],
    b_cam_learned_name: ['학습한 사물 이름', 'learned object name', '学習した物の名前', '学习的物体名称', 'nombre del objeto aprendido'],
    b_cam_learned_conf: ['%1 확신도 (%%)', '%1 confidence (%%)', '%1 の確信度（%%）', '%1 置信度（%%）', 'confianza de %1 (%%)'],
    tt_learned: ['AI 학습 창에서 가르친 사물입니다. 확신도 60% 이상일 때 참입니다.', 'An object you taught in the Teach window. True when confidence is 60% or more.', '学習ウィンドウで教えた物です。確信度 60% 以上で真。', '在训练窗口中教过的物体。置信度 60% 以上时为真。', 'Un objeto enseñado en la ventana de aprendizaje. Verdadero con confianza ≥ 60%.'],
    tt_conf: ['0~100. 비슷한 학습 사진 7장 중 몇 장이 이 클래스인지', '0–100: how many of the 7 most similar training photos belong to this class', '0〜100：よく似た学習写真7枚のうち何枚がこのクラスか', '0~100：最相似的 7 张训练照片中有几张属于此类', '0–100: cuántas de las 7 fotos más parecidas son de esta clase'],
    tt_learned_color: ['★ 표시는 색 학습으로 가르친 색입니다.', '★ marks colors you taught in Color learning.', '★ は色の学習で教えた色です。', '★ 表示通过颜色学习教的颜色。', '★ indica colores enseñados en «Aprender colores».'],
    guide_html: [
`<div class="guide">
<h4>🧠 AI는 어떻게 배울까요?</h4>
<p>AI는 사진 한 장을 <b>숫자 1,024개(특징)</b>로 바꿉니다. 학습이란 "이 숫자들은 <b>컵</b>이야" 하고 예시를 많이 알려 주는 것이에요. 새 사진이 들어오면 AI는 <b>가장 비슷한 학습 사진 7장</b>을 찾아 그중 많은 쪽으로 답합니다(최근접 이웃 방법). 그래서 <b>좋은 예시를 많이</b> 줄수록 똑똑해집니다.</p>
<h4>📦 사물 학습 — 5단계</h4>
<ol>
<li><b>무엇을 구분할지 정하기</b> — 예: <i>빨간 컵 / 파란 공 / 배경</i>. <b>배경(아무것도 없음)</b> 클래스는 꼭 두세요. 그래야 물건이 없을 때 "없다"고 답합니다.</li>
<li><b>사진 모으기</b> — 클래스마다 <b>누르고 있으면 촬영</b>을 눌러 30~50장 모읍니다. 물건을 <b>돌리고, 가까이·멀리, 왼쪽·오른쪽</b>으로 움직이며 찍으세요.</li>
<li><b>학습시키기</b> — 버튼을 누르면 바로 학습됩니다.</li>
<li><b>시험하기</b> — 물건을 보여 주며 확신도 막대를 확인합니다. 틀리게 답하면 그 상황의 사진을 <b>더 찍고 다시 학습</b>시키세요.</li>
<li><b>블록으로 쓰기</b> — <code>학습한 사물이 [빨간 컵] 인가?</code> 를 <code>○ 이 될 때</code> 나 <code>만약</code> 에 넣어 로봇을 움직입니다.</li>
</ol>
<p class="tip">💡 <b>잘 배우게 하는 법</b>: 클래스마다 사진 수를 비슷하게 · 실제로 쓸 장소와 조명에서 학습 · 배경은 단순하게 · 손이 함께 찍히면 AI가 "손"을 배울 수 있으니 <b>배경 클래스에도 손을 넣어</b> 찍기</p>
<h4>🎨 색 학습 — 4단계</h4>
<ol>
<li>색 물건(공, 색종이 등)을 카메라 화면 <b>가운데 네모 안에 가득</b> 차게 댑니다.</li>
<li><b>가운데 색 학습</b>을 누르고 이름을 정합니다(예: <i>형광 연두</i>).</li>
<li><b>허용 범위</b>를 조절합니다. 너무 넓으면 비슷한 다른 색까지 잡히고, 너무 좁으면 그림자 진 곳을 놓칩니다. 화면에 동그라미가 물건 위에 잘 붙는지 보며 맞추세요.</li>
<li>블록의 색 목록에 <b>★ 형광 연두</b>가 생깁니다. <code>[★ 형광 연두] 색의 x 위치</code> 로 공을 따라가는 로봇을 만들어 보세요.</li>
</ol>
<p class="tip">💡 흰색·검정·회색은 "색깔"이 없어서 학습이 어렵습니다. 선명한 색일수록 잘 찾고, 조명이 바뀌면 다시 학습하세요.</p>
<h4>🤖 예제 아이디어</h4>
<ul>
<li><b>분류 로봇</b>: <code>학습한 사물이 [빨간 컵] 이 될 때</code> → 포트 1 모터 시계방향 1초, <code>[파란 공]</code> 이면 반시계방향</li>
<li><b>색 따라가기</b>: 무한 반복 — <code>[★ 내 색] 색의 x 위치</code> 가 40보다 작으면 왼쪽, 60보다 크면 오른쪽으로 모터 방향 바꾸기</li>
<li><b>확신도 게이지</b>: <code>모터 파워를 [[물건 1] 확신도] % 로 정하기</code> — AI가 확실할수록 빨리 돕니다</li>
</ul>
<p class="muted">학습 내용은 프로젝트에 함께 저장됩니다. PC에서 Python으로 실행하려면 <b>Python용 학습 파일 저장</b>으로 받은 파일을 .py 파일 옆에 두세요.</p>
</div>`,
`<div class="guide">
<h4>🧠 How does the AI learn?</h4>
<p>The AI turns each photo into <b>1,024 numbers (features)</b>. Teaching means giving many examples: "these numbers are a <b>cup</b>". For a new photo the AI finds the <b>7 most similar training photos</b> and answers with the class most of them belong to (nearest-neighbour method). <b>More good examples</b> make it smarter.</p>
<h4>📦 Object learning — 5 steps</h4>
<ol>
<li><b>Decide what to tell apart</b> — e.g. <i>red cup / blue ball / background</i>. Always keep a <b>Background (nothing)</b> class so the AI can say "nothing is there".</li>
<li><b>Collect photos</b> — for each class, press <b>Hold to record</b> to collect 30–50 photos. <b>Turn</b> the object, move it <b>closer/farther and left/right</b>.</li>
<li><b>Train</b> — press the button; training is instant.</li>
<li><b>Test</b> — show the object and watch the confidence bars. If it is wrong, <b>record more photos</b> of that situation and train again.</li>
<li><b>Use blocks</b> — put <code>learned object is [red cup]?</code> in <code>when ○</code> or <code>if</code> to move the robot.</li>
</ol>
<p class="tip">💡 <b>Tips</b>: similar number of photos per class · teach in the same place and lighting you will use · keep the background simple · if your hand is in the photos the AI may learn "hand", so <b>also record your hand in the Background class</b></p>
<h4>🎨 Color learning — 4 steps</h4>
<ol>
<li>Hold a colored object (ball, paper…) so it <b>fills the center box</b> of the camera view.</li>
<li>Press <b>Learn the center color</b> and give it a name (e.g. <i>neon green</i>).</li>
<li>Adjust the <b>tolerance</b>: too wide picks up similar colors, too narrow misses shadows. Check that the dot sticks to the object.</li>
<li><b>★ neon green</b> appears in the color lists of the blocks. Try <code>color [★ neon green] x</code> to build a ball-following robot.</li>
</ol>
<p class="tip">💡 White, black and gray have no hue, so they are hard to learn. Vivid colors work best; teach again when the lighting changes.</p>
<h4>🤖 Project ideas</h4>
<ul>
<li><b>Sorting robot</b>: <code>when learned object is [red cup]</code> → port 1 motor clockwise 1 s; <code>[blue ball]</code> → counterclockwise</li>
<li><b>Color follower</b>: forever — if <code>color [★ my color] x</code> &lt; 40 turn left, &gt; 60 turn right</li>
<li><b>Confidence gauge</b>: <code>set motor power to [[Object 1] confidence] %</code> — the surer the AI, the faster it spins</li>
</ul>
<p class="muted">Learning is saved with the project. To run with Python on a PC, put the file from <b>Save learning file for Python</b> next to your .py file.</p>
</div>`,
`<div class="guide">
<h4>🧠 AI はどうやって学ぶの？</h4>
<p>AI は写真を <b>1,024 個の数（特徴）</b> に変えます。学習とは「この数は<b>コップ</b>だよ」と例をたくさん教えること。新しい写真が来ると、<b>いちばん似ている学習写真 7 枚</b>を探し、多い方で答えます（最近傍法）。<b>よい例をたくさん</b>見せるほど賢くなります。</p>
<h4>📦 物の学習 — 5 ステップ</h4>
<ol>
<li><b>何を見分けるか決める</b> — 例：<i>赤いコップ／青いボール／背景</i>。<b>背景（なにもない）</b>クラスは必ず作りましょう。</li>
<li><b>写真を集める</b> — クラスごとに<b>押している間撮影</b>で 30〜50 枚。物を<b>回したり、近づけたり遠ざけたり、左右に動かしたり</b>して撮ります。</li>
<li><b>学習させる</b> — ボタンを押すとすぐに学習します。</li>
<li><b>試す</b> — 物を見せて確信度のバーを確認。まちがえたら、その場面の写真を<b>追加してもう一度学習</b>。</li>
<li><b>ブロックで使う</b> — <code>学習した物が [赤いコップ] ？</code> を <code>○ になったとき</code> や <code>もし</code> に入れてロボットを動かします。</li>
</ol>
<p class="tip">💡 <b>コツ</b>：クラスごとの枚数をそろえる・実際に使う場所と明るさで学習・背景はシンプルに・手が写ると AI が「手」を覚えるので<b>背景クラスにも手を入れて</b>撮る</p>
<h4>🎨 色の学習 — 4 ステップ</h4>
<ol>
<li>色のついた物を画面の<b>真ん中の四角いっぱい</b>に入れます。</li>
<li><b>真ん中の色を学習</b>を押して名前をつけます（例：<i>蛍光グリーン</i>）。</li>
<li><b>許容範囲</b>を調整。広すぎると似た色まで、せますぎると影の部分を見のがします。</li>
<li>ブロックの色リストに <b>★ 蛍光グリーン</b> が出ます。<code>[★ 蛍光グリーン] 色の x</code> でボールを追うロボットを作ろう。</li>
</ol>
<p class="tip">💡 白・黒・灰色は色味がないので学習しにくいです。鮮やかな色ほどよく見つかります。明るさが変わったら学習し直しましょう。</p>
<h4>🤖 作品アイデア</h4>
<ul>
<li><b>仕分けロボット</b>：<code>学習した物が [赤いコップ] になったとき</code> → モーター時計回り 1 秒、<code>[青いボール]</code> なら反時計回り</li>
<li><b>色追いかけ</b>：ずっと — <code>[★ わたしの色] 色の x</code> が 40 より小さければ左、60 より大きければ右へ</li>
<li><b>確信度メーター</b>：<code>モーターのパワーを [[物 1] の確信度] % にする</code></li>
</ul>
<p class="muted">学習内容はプロジェクトと一緒に保存されます。PC の Python で動かすときは <b>Python 用学習ファイルを保存</b> したファイルを .py の横に置いてください。</p>
</div>`,
`<div class="guide">
<h4>🧠 AI 是怎样学习的？</h4>
<p>AI 会把每张照片变成 <b>1,024 个数字（特征）</b>。训练就是告诉它很多例子：“这些数字是<b>杯子</b>”。来了新照片，AI 会找出<b>最相似的 7 张训练照片</b>，按多数回答（最近邻方法）。给出<b>越多好例子</b>，它就越聪明。</p>
<h4>📦 物体学习 — 5 步</h4>
<ol>
<li><b>决定要区分什么</b> — 例：<i>红杯子 / 蓝球 / 背景</i>。一定要保留<b>背景（什么都没有）</b>类别。</li>
<li><b>收集照片</b> — 每个类别按住<b>按住拍摄</b>收集 30~50 张。<b>转动</b>物体，<b>远近、左右</b>移动着拍。</li>
<li><b>开始训练</b> — 按下按钮立即完成训练。</li>
<li><b>测试</b> — 展示物体并查看置信度条。答错时，<b>多拍几张那种情况的照片再训练</b>。</li>
<li><b>用积木</b> — 把 <code>学习的物体是 [红杯子]？</code> 放进 <code>当 ○</code> 或 <code>如果</code> 来控制机器人。</li>
</ol>
<p class="tip">💡 <b>技巧</b>：各类别照片数量相近 · 在实际使用的地点和光线下训练 · 背景尽量简单 · 手入镜时 AI 可能学成“手”，所以<b>背景类别里也要拍到手</b></p>
<h4>🎨 颜色学习 — 4 步</h4>
<ol>
<li>把彩色物体<b>填满画面中间的方框</b>。</li>
<li>按<b>学习中间的颜色</b>并命名（例：<i>荧光绿</i>）。</li>
<li>调整<b>容差</b>：太大会抓到相近颜色，太小会漏掉阴影部分。</li>
<li>积木的颜色列表里会出现 <b>★ 荧光绿</b>。试试用 <code>[★ 荧光绿] 色的 x</code> 做追球机器人。</li>
</ol>
<p class="tip">💡 白、黑、灰没有色相，很难学习。越鲜艳越好找；光线变化后请重新学习。</p>
<h4>🤖 作品创意</h4>
<ul>
<li><b>分拣机器人</b>：<code>当 学习的物体是 [红杯子]</code> → 马达顺时针 1 秒，<code>[蓝球]</code> 则逆时针</li>
<li><b>颜色跟随</b>：重复执行 — <code>[★ 我的颜色] 色的 x</code> 小于 40 向左，大于 60 向右</li>
<li><b>置信度仪表</b>：<code>将马达功率设为 [[物体 1] 置信度] %</code></li>
</ul>
<p class="muted">训练内容会和项目一起保存。要在电脑上用 Python 运行，请把<b>保存 Python 用训练文件</b>得到的文件放在 .py 文件旁边。</p>
</div>`,
`<div class="guide">
<h4>🧠 ¿Cómo aprende la IA?</h4>
<p>La IA convierte cada foto en <b>1.024 números (características)</b>. Enseñar es darle muchos ejemplos: «estos números son una <b>taza</b>». Ante una foto nueva busca las <b>7 fotos de entrenamiento más parecidas</b> y responde con la clase mayoritaria (método del vecino más cercano). <b>Más buenos ejemplos</b> la hacen más lista.</p>
<h4>📦 Aprender objetos — 5 pasos</h4>
<ol>
<li><b>Decide qué distinguir</b> — p. ej. <i>taza roja / pelota azul / fondo</i>. Ten siempre una clase <b>Fondo (nada)</b>.</li>
<li><b>Reúne fotos</b> — en cada clase mantén <b>Mantén para grabar</b> y junta 30–50 fotos. <b>Gira</b> el objeto y muévelo <b>cerca/lejos e izquierda/derecha</b>.</li>
<li><b>Entrena</b> — pulsa el botón; es instantáneo.</li>
<li><b>Prueba</b> — enseña el objeto y mira las barras de confianza. Si falla, <b>graba más fotos</b> de esa situación y vuelve a entrenar.</li>
<li><b>Usa bloques</b> — pon <code>¿objeto aprendido es [taza roja]?</code> en <code>cuando ○</code> o <code>si</code> para mover el robot.</li>
</ol>
<p class="tip">💡 <b>Consejos</b>: número de fotos parecido en cada clase · entrena en el lugar y la luz donde lo usarás · fondo sencillo · si sale tu mano la IA puede aprender «mano», así que <b>graba también tu mano en la clase Fondo</b></p>
<h4>🎨 Aprender colores — 4 pasos</h4>
<ol>
<li>Pon un objeto de color de modo que <b>llene el cuadro central</b>.</li>
<li>Pulsa <b>Aprender el color central</b> y ponle nombre (p. ej. <i>verde neón</i>).</li>
<li>Ajusta la <b>tolerancia</b>: muy amplia capta colores parecidos; muy estrecha pierde las sombras.</li>
<li><b>★ verde neón</b> aparece en las listas de color. Prueba <code>x del color [★ verde neón]</code> para un robot que sigue una pelota.</li>
</ol>
<p class="tip">💡 Blanco, negro y gris no tienen tono y cuesta aprenderlos. Los colores vivos funcionan mejor; vuelve a enseñar si cambia la luz.</p>
<h4>🤖 Ideas de proyectos</h4>
<ul>
<li><b>Robot clasificador</b>: <code>cuando ¿objeto aprendido es [taza roja]?</code> → motor horario 1 s; <code>[pelota azul]</code> → antihorario</li>
<li><b>Seguidor de color</b>: por siempre — si <code>x del color [★ mi color]</code> &lt; 40 gira a la izquierda, &gt; 60 a la derecha</li>
<li><b>Medidor de confianza</b>: <code>fijar potencia en [confianza de [Objeto 1]] %</code></li>
</ul>
<p class="muted">Lo aprendido se guarda con el proyecto. Para Python en un PC, pon el archivo de <b>Guardar archivo para Python</b> junto a tu .py.</p>
</div>`],
    funcs: ['사용할 수 있는 함수', 'Available functions', '使える関数', '可用函数', 'Funciones disponibles']
  };

  let lang = 'ko';
  function t(key) {
    const row = S[key];
    if (!row) return key;
    return row[IDX[lang]] || row[0];
  }
  function detect() {
    const fromHash = (location.hash || '').slice(1);
    if (IDX[fromHash] !== undefined) return fromHash;
    try { const s = localStorage.getItem('wedomakers-lang'); if (IDX[s] !== undefined) return s; } catch (e) {}
    const nav = (navigator.language || 'ko').toLowerCase();
    if (nav.startsWith('zh')) return 'zh';
    const two = nav.slice(0, 2);
    return IDX[two] !== undefined ? two : 'en';
  }
  window.I18N = {
    LANGS, BLOCKLY_CODE, t,
    all(key) { return S[key] || []; },
    add(table) { Object.assign(S, table); }, // 다른 파일(튜터 등)이 번역을 덧붙일 때
    get lang() { return lang; },
    set(l) { if (IDX[l] === undefined) return; lang = l; try { localStorage.setItem('wedomakers-lang', l); } catch (e) {} },
    detect
  };
  lang = detect();
  window.t = t;
})();
