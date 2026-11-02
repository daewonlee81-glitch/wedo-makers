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
    get lang() { return lang; },
    set(l) { if (IDX[l] === undefined) return; lang = l; try { localStorage.setItem('wedomakers-lang', l); } catch (e) {} },
    detect
  };
  lang = detect();
  window.t = t;
})();
