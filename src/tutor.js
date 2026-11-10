/* ===== AI 튜터 =====
 * 1) 내장 튜터 (항상 동작 · 인터넷 불필요): 코드 점검, 블록 설명, 단계별 미션
 * 2) Claude 채팅 (선택): 선생님 API 키 또는 중계 서버 주소를 넣으면 자유 질문
 */
(function () {
  I18N.add({
    tutor_tab: ['AI 튜터', 'AI Tutor', 'AI チューター', 'AI 导师', 'Tutor IA'],
    tutor_btn: ['AI 튜터', 'AI tutor', 'AI チューター', 'AI 导师', 'Tutor IA'],
    tutor_check: ['🔍 내 코드 점검', '🔍 Check my code', '🔍 コードを点検', '🔍 检查我的代码', '🔍 Revisar mi código'],
    tutor_explain: ['💡 블록 설명', '💡 Explain block', '💡 ブロック説明', '💡 积木说明', '💡 Explicar bloque'],
    tutor_missions: ['🎯 미션', '🎯 Missions', '🎯 ミッション', '🎯 任务', '🎯 Misiones'],
    tutor_chat: ['💬 질문하기', '💬 Ask', '💬 質問する', '💬 提问', '💬 Preguntar'],
    tutor_settings: ['⚙ AI 연결', '⚙ AI connection', '⚙ AI 接続', '⚙ AI 连接', '⚙ Conexión IA'],
    tutor_hello: ['안녕하세요! 저는 위두 메이커스 AI 튜터예요. 코드를 점검하거나, 블록을 눌러 설명을 듣거나, 미션에 도전해 보세요.', 'Hi! I am the WeDo Makers AI tutor. I can check your code, explain a block you click, or give you missions.', 'こんにちは！WeDo Makers の AI チューターです。コードの点検、ブロックの説明、ミッションをお手伝いします。', '你好！我是 WeDo 创客 AI 导师。我可以检查代码、解释你点击的积木，或给你任务挑战。', '¡Hola! Soy el tutor IA de WeDo Makers. Puedo revisar tu código, explicar el bloque que pulses o darte misiones.'],
    tutor_ok: ['문제를 찾지 못했어요 👍 실행해서 로봇이 생각대로 움직이는지 확인해 보세요.', 'No problems found 👍 Run it and check the robot moves as you planned.', '問題は見つかりませんでした 👍 実行してロボットが思い通りに動くか確かめよう。', '没有发现问题 👍 运行一下，看看机器人是否按你的想法移动。', 'No encontré problemas 👍 Ejecútalo y mira si el robot se mueve como pensabas.'],
    tutor_show: ['블록 보기', 'Show block', 'ブロックを見る', '查看积木', 'Ver bloque'],
    tutor_open_learn: ['학습 창 열기', 'Open Teach window', '学習ウィンドウを開く', '打开训练窗口', 'Abrir aprendizaje'],
    tutor_select_hint: ['블록 화면에서 블록을 하나 누르면 무엇을 하는 블록인지 알려 줄게요.', 'Click any block in the block area and I will explain what it does.', 'ブロックをひとつクリックすると、何をするブロックか説明します。', '在积木区点击一个积木，我会告诉你它的作用。', 'Pulsa un bloque y te explico qué hace.'],
    tutor_in_python: ['Python으로 쓰면', 'In Python', 'Python で書くと', '用 Python 写是', 'En Python'],
    tutor_category: ['분류', 'Category', '分類', '分类', 'Categoría'],
    // 점검 메시지
    c_no_hat: ['실행할 이벤트 블록이 없어요. <b>이벤트</b>에서 <b>▶ 실행 버튼을 누를 때</b> 블록을 꺼내고 그 아래에 블록을 붙이세요.', 'There is no event block. Take <b>when ▶ Run is clicked</b> from <b>Events</b> and attach blocks under it.', 'イベントブロックがありません。<b>イベント</b>から<b>▶ 実行ボタンが押されたとき</b>を出して、下にブロックをつなごう。', '没有事件积木。从<b>事件</b>拖出<b>当 ▶ 运行 被点击</b>，再把积木接在下面。', 'No hay bloque de evento. Saca <b>al hacer clic en ▶ Ejecutar</b> de <b>Eventos</b> y une bloques debajo.'],
    c_orphans: ['연결되지 않은 블록이 {n}개 있어요(흐리게 보이는 블록). 이벤트 블록 아래에 붙여야 실행돼요.', '{n} block(s) are not connected (shown faded). They only run when attached under an event block.', 'つながっていないブロックが {n} 個あります（うすく見えるもの）。イベントの下につなぐと動きます。', '有 {n} 个积木没有连接（显示为淡色）。要接在事件积木下面才会运行。', 'Hay {n} bloque(s) sin conectar (se ven tenues). Solo funcionan unidos bajo un evento.'],
    c_empty_hat: ['<b>{name}</b> 아래에 아무 블록도 없어요.', 'Nothing is attached under <b>{name}</b>.', '<b>{name}</b> の下にブロックがありません。', '<b>{name}</b> 下面没有积木。', 'No hay nada bajo <b>{name}</b>.'],
    c_motor_never_off: ['모터를 켜는 블록은 있는데 끄는 블록이 없어요. 정지 버튼을 누를 때까지 계속 돌아요. 일부러 그런 게 아니라면 <b>모터 끄기</b>나 <b>○초 동안 켜기</b>를 써 보세요.', 'You turn a motor on but never off — it spins until you press Stop. If that is not on purpose, use <b>turn motor off</b> or <b>on for ○ seconds</b>.', 'モーターをオンにしていますがオフにしていません。停止を押すまで回り続けます。わざとでなければ<b>オフ</b>や<b>○秒オン</b>を使おう。', '有开启马达的积木但没有关闭，会一直转到你按停止。如果不是故意的，试试<b>关闭马达</b>或<b>开启○秒</b>。', 'Enciendes un motor pero nunca lo apagas: gira hasta pulsar Detener. Si no es a propósito, usa <b>apagar motor</b> o <b>encender durante ○ s</b>.'],
    c_var_unset: ['변수 <b>{name}</b>의 값을 읽지만 처음 값을 넣는 블록이 없어요. 시작할 때 <b>{name}를 0로 설정</b>을 넣어 보세요.', 'Variable <b>{name}</b> is read but never set. Add <b>set {name} to 0</b> at the start.', '変数 <b>{name}</b> を読んでいますが、最初に値を入れていません。最初に <b>{name} を 0 にする</b> を入れよう。', '读取了变量 <b>{name}</b>，但从未给它赋初值。在开始处加上<b>将 {name} 设为 0</b>。', 'Lees la variable <b>{name}</b> pero nunca le das valor. Añade <b>fijar {name} a 0</b> al principio.'],
    c_power_range: ['모터 파워는 0~100 사이여야 해요. 지금 <b>{v}</b>이 들어 있어요.', 'Motor power must be between 0 and 100 — it is <b>{v}</b> now.', 'モーターのパワーは 0〜100 です。いまは <b>{v}</b> です。', '马达功率应在 0~100 之间，现在是 <b>{v}</b>。', 'La potencia debe estar entre 0 y 100; ahora es <b>{v}</b>.'],
    c_learn_untrained: ['<b>학습한 사물</b> 블록을 쓰는데 아직 학습시키지 않았어요. AI 학습 창에서 사진을 모으고 <b>학습시키기</b>를 누르세요.', 'You use <b>learned object</b> blocks but nothing is trained yet. Collect photos in the Teach window and press <b>Train</b>.', '<b>学習した物</b>ブロックを使っていますが、まだ学習していません。学習ウィンドウで写真を集めて<b>学習させる</b>を押そう。', '使用了<b>学习的物体</b>积木，但还没有训练。请在训练窗口收集照片并按<b>开始训练</b>。', 'Usas bloques de <b>objeto aprendido</b> pero aún no hay entrenamiento. Reúne fotos y pulsa <b>Entrenar</b>.'],
    c_learn_no_bg: ['학습한 클래스에 <b>배경(아무것도 없음)</b>이 없어요. 물건이 없을 때도 AI가 아무 클래스나 고를 수 있어요. 배경 사진도 학습시켜 보세요.', 'There is no <b>Background (nothing)</b> class with photos. Without it the AI must pick some class even when nothing is there.', '<b>背景（なにもない）</b>クラスに写真がありません。物がないときも AI はどれかを選んでしまいます。', '<b>背景（什么都没有）</b>类别没有照片。没有物体时 AI 也会随便选一个类别。', 'No hay fotos en la clase <b>Fondo (nada)</b>. Sin ella, la IA elegirá alguna clase aunque no haya nada.'],
    c_no_dist: ['<b>거리 센서</b> 블록을 쓰는데 허브에 거리 센서가 연결되어 있지 않아요.', 'You use <b>distance</b> blocks but no distance sensor is plugged into the hub.', '<b>距離センサー</b>のブロックを使っていますが、ハブに距離センサーがつながっていません。', '使用了<b>距离传感器</b>积木，但集线器上没有连接距离传感器。', 'Usas bloques de <b>distancia</b> pero no hay sensor de distancia conectado.'],
    c_no_tilt: ['<b>기울기</b> 블록을 쓰는데 허브에 기울기 센서가 연결되어 있지 않아요.', 'You use <b>tilt</b> blocks but no tilt sensor is plugged into the hub.', '<b>傾き</b>のブロックを使っていますが、ハブに傾きセンサーがつながっていません。', '使用了<b>倾斜</b>积木，但集线器上没有连接倾斜传感器。', 'Usas bloques de <b>inclinación</b> pero no hay sensor de inclinación conectado.'],
    c_no_motor: ['<b>포트 {p}</b>에 모터가 없어요. 블록의 포트 번호와 실제로 꽂은 포트를 맞춰 보세요.', 'There is no motor on <b>port {p}</b>. Match the port in the block with where the motor is plugged in.', '<b>ポート{p}</b> にモーターがありません。ブロックのポート番号を実際にさした場所に合わせよう。', '<b>端口 {p}</b> 上没有马达。请让积木里的端口号和实际插的端口一致。', 'No hay motor en el <b>puerto {p}</b>. Haz coincidir el puerto del bloque con donde está enchufado.'],
    c_cam_https: ['AI 카메라는 https 주소에서만 켜져요. GitHub Pages 주소로 열어 주세요.', 'The AI camera only works on an https address — open the GitHub Pages address.', 'AI カメラは https のアドレスでだけ使えます。GitHub Pages のアドレスで開こう。', 'AI 摄像头只能在 https 地址下使用，请用 GitHub Pages 地址打开。', 'La cámara IA solo funciona en https: abre la dirección de GitHub Pages.'],
    c_sim: ['허브가 연결되지 않아 <b>가상 허브</b>로 실행돼요. 실제 로봇을 움직이려면 <b>허브 연결</b>을 누르세요.', 'No hub is connected, so programs run on the <b>virtual hub</b>. Press <b>Connect hub</b> to move the real robot.', 'ハブ未接続なので<b>仮想ハブ</b>で動きます。本物を動かすには<b>ハブに接続</b>を押そう。', '未连接集线器，会在<b>虚拟集线器</b>上运行。要控制真实机器人请按<b>连接集线器</b>。', 'No hay hub: se usa el <b>hub virtual</b>. Pulsa <b>Conectar hub</b> para mover el robot real.'],
    c_key_twice: ['<b>{k}</b> 키 이벤트가 {n}개 있어요. 키를 누르면 모두 함께 실행돼요.', 'There are {n} events for the <b>{k}</b> key; they all run together.', '<b>{k}</b> キーのイベントが {n} 個あります。押すと全部いっしょに動きます。', '<b>{k}</b> 键有 {n} 个事件，按下时会同时运行。', 'Hay {n} eventos para la tecla <b>{k}</b>; se ejecutan juntos.'],
    // 블록 분류 설명
    cd_event: ['프로그램이 <b>언제 시작할지</b> 정하는 모자 블록이에요. 아래에 붙인 블록들이 차례로 실행돼요.', 'A hat block that decides <b>when</b> the blocks under it start.', 'プログラムが<b>いつ始まるか</b>を決める帽子ブロック。下のブロックが順に動きます。', '决定程序<b>何时开始</b>的帽子积木，下面的积木依次运行。', 'Bloque sombrero que decide <b>cuándo</b> empiezan los bloques de debajo.'],
    cd_motor: ['WeDo <b>모터</b>를 돌리거나 멈추고, 빠르기(파워)와 방향을 정해요.', 'Spins or stops the WeDo <b>motor</b> and sets its power and direction.', 'WeDo の<b>モーター</b>を回したり止めたり、パワーと向きを決めます。', '让 WeDo <b>马达</b>转动或停止，并设置功率和方向。', 'Hace girar o para el <b>motor</b> WeDo y fija potencia y dirección.'],
    cd_light: ['허브의 <b>불빛(LED)</b> 색을 바꿔요.', 'Changes the color of the hub <b>light (LED)</b>.', 'ハブの<b>ライト（LED）</b>の色を変えます。', '改变集线器<b>灯（LED）</b>的颜色。', 'Cambia el color de la <b>luz (LED)</b> del hub.'],
    cd_sound: ['허브 스피커로 <b>소리</b>를 내요.', 'Plays <b>sounds</b> on the hub speaker.', 'ハブのスピーカーで<b>音</b>を鳴らします。', '用集线器扬声器播放<b>声音</b>。', 'Reproduce <b>sonidos</b> en el altavoz del hub.'],
    cd_sensor: ['거리·기울기·버튼·키보드·타이머 같은 <b>센서 값</b>을 읽어요. 둥근 블록은 숫자, 뾰족한 블록은 참/거짓이에요.', 'Reads <b>sensor values</b> such as distance, tilt, button, keyboard and timer. Round = number, pointed = true/false.', '距離・傾き・ボタン・キーボード・タイマーなどの<b>センサー値</b>を読みます。丸は数、とがった形は真/偽。', '读取距离、倾斜、按钮、键盘、计时器等<b>传感器值</b>。圆形是数字，尖形是真/假。', 'Lee <b>valores de sensores</b>: distancia, inclinación, botón, teclado, temporizador. Redondo = número, puntiagudo = verdadero/falso.'],
    cd_cam: ['PC 카메라로 <b>몸·손·사물·색</b>을 알아보는 AI 카메라 블록이에요. 좌표는 x 0(왼쪽)~100(오른쪽), y 0(아래)~100(위).', 'AI camera blocks that recognize <b>body, hands, objects and colors</b> with the PC camera. x 0 (left)–100 (right), y 0 (bottom)–100 (top).', 'PC のカメラで<b>体・手・物・色</b>を見分ける AI カメラブロック。x 0(左)〜100(右)、y 0(下)〜100(上)。', '用电脑摄像头识别<b>身体、手、物体和颜色</b>的 AI 积木。x 0(左)~100(右)，y 0(下)~100(上)。', 'Bloques de cámara IA que reconocen <b>cuerpo, manos, objetos y colores</b>. x 0 (izq.)–100 (der.), y 0 (abajo)–100 (arriba).'],
    cd_learn: ['내가 <b>가르친 사물</b>을 AI가 알아봐요. AI 학습 창에서 먼저 학습시켜야 해요.', 'Recognizes <b>objects you taught</b>. Train them first in the Teach window.', '<b>自分で教えた物</b>を AI が見分けます。先に学習ウィンドウで学習させよう。', 'AI 识别<b>你教过的物体</b>。请先在训练窗口中训练。', 'Reconoce <b>objetos que enseñaste</b>. Entrénalos primero.'],
    cd_control: ['<b>기다리기·반복·만약</b>처럼 실행 순서를 정해요. 반복은 한 바퀴에 1/30초씩 돌아요.', 'Controls the order: <b>wait, repeat, if</b>. Each loop turn takes 1/30 s.', '<b>待つ・くり返し・もし</b>など実行の順番を決めます。くり返しは 1 回 1/30 秒。', '控制执行顺序，如<b>等待、重复、如果</b>。循环每圈 1/30 秒。', 'Controla el orden: <b>esperar, repetir, si</b>. Cada vuelta dura 1/30 s.'],
    cd_op: ['<b>계산과 비교</b>를 해요. 숫자를 더하거나, 두 값을 비교하거나, 무작위 수를 만들어요.', 'Does <b>math and comparisons</b>: add numbers, compare values, pick random numbers.', '<b>計算と比較</b>をします。たし算、くらべる、ランダムな数など。', '进行<b>计算和比较</b>：加法、比较大小、随机数。', 'Hace <b>cálculos y comparaciones</b>: sumar, comparar, números al azar.'],
    cd_var: ['<b>변수</b>는 숫자를 담아 두는 상자예요. 값을 넣고, 바꾸고, 읽을 수 있어요.', 'A <b>variable</b> is a box that holds a number. You can set it, change it and read it.', '<b>変数</b>は数を入れておく箱。入れる・変える・読むができます。', '<b>变量</b>是存放数字的盒子，可以设置、改变和读取。', 'Una <b>variable</b> es una caja que guarda un número: puedes fijarla, cambiarla y leerla.'],
    cd_out: ['값을 <b>콘솔</b>에 보여 줘서 프로그램이 어떻게 돌아가는지 확인할 수 있어요.', 'Shows values in the <b>console</b> so you can see what your program is doing.', '値を<b>コンソール</b>に表示して、プログラムの動きを確かめられます。', '把值显示在<b>控制台</b>，方便查看程序在做什么。', 'Muestra valores en la <b>consola</b> para ver qué hace tu programa.'],
    // 미션
    m_done: ['미션 성공! 🎉', 'Mission complete! 🎉', 'ミッション成功！🎉', '任务完成！🎉', '¡Misión cumplida! 🎉'],
    m_check: ['확인하기', 'Check', 'チェック', '检查', 'Comprobar'],
    m_not_yet: ['아직이에요. 힌트를 보세요.', 'Not yet — look at the hints.', 'まだです。ヒントを見よう。', '还没有，看看提示吧。', 'Todavía no: mira las pistas.'],
    m_hint: ['힌트', 'Hint', 'ヒント', '提示', 'Pista'],
    m1_t: ['1. 파란 불빛 켜기', '1. Blue light', '1. 青いライト', '1. 点亮蓝灯', '1. Luz azul'],
    m1_g: ['실행하면 허브 불빛이 <b>파랑</b>으로 켜지게 하세요.', 'Make the hub light turn <b>blue</b> when you press Run.', '実行するとハブのライトが<b>青</b>になるようにしよう。', '按运行后让集线器灯变成<b>蓝色</b>。', 'Haz que la luz del hub se ponga <b>azul</b> al ejecutar.'],
    m1_h: ['이벤트 → <b>▶ 실행 버튼을 누를 때</b> · 불빛 → <b>허브 불빛을 ○으로 켜기</b>에서 파랑 고르기', 'Events → <b>when ▶ Run is clicked</b> · Light → <b>set hub light to ○</b>, choose blue', 'イベント → <b>▶ 実行ボタンが押されたとき</b> ・ ライト → <b>ハブのライトを ○ にする</b> で青', '事件 → <b>当 ▶ 运行 被点击</b> · 灯光 → <b>将集线器灯设为 ○</b> 选蓝', 'Eventos → <b>al hacer clic en ▶ Ejecutar</b> · Luz → <b>encender luz en ○</b>, elige azul'],
    m2_t: ['2. 모터 2초 돌리기', '2. Motor for 2 seconds', '2. モーターを2秒', '2. 马达转 2 秒', '2. Motor 2 segundos'],
    m2_g: ['실행하면 모터가 <b>2초 동안</b> 돌고 멈추게 하세요.', 'Make the motor spin for <b>2 seconds</b> and stop.', '実行するとモーターが<b>2秒</b>回って止まるようにしよう。', '让马达转<b>2 秒</b>后停下。', 'Haz que el motor gire <b>2 segundos</b> y pare.'],
    m2_h: ['모터 → <b>○ 모터를 ○초 동안 켜기</b> · 숫자 칸에 2', 'Motors → <b>turn motor on for ○ seconds</b> · type 2', 'モーター → <b>○ のモーターを ○ 秒オン</b> ・ 数に 2', '马达 → <b>○ 马达开启 ○ 秒</b> · 填 2', 'Motores → <b>encender motor durante ○ s</b> · escribe 2'],
    m3_t: ['3. 거리 경보기', '3. Distance alarm', '3. 距離警報機', '3. 距离报警器', '3. Alarma de distancia'],
    m3_g: ['무언가 <b>가까이(30보다 작게)</b> 오면 불빛을 빨강으로, 아니면 초록으로 바꾸세요. 계속 확인해야 해요.', 'If something comes <b>close (less than 30)</b> make the light red, otherwise green — keep checking.', '何かが<b>近く（30より小さい）</b>に来たら赤、そうでなければ緑。ずっと調べ続けよう。', '有东西<b>靠近（小于 30）</b>时灯变红，否则变绿，要一直检查。', 'Si algo se <b>acerca (menos de 30)</b>, luz roja; si no, verde. Comprueba siempre.'],
    m3_h: ['제어 → <b>무한 반복하기</b> 안에 <b>만약 / 아니면</b> · 센서 → <b>거리 센서 값 &lt; 30</b>', 'Control → <b>forever</b> with <b>if / else</b> inside · Sensors → <b>distance &lt; 30</b>', '制御 → <b>ずっと</b>の中に<b>もし／でなければ</b> ・ センサー → <b>距離 &lt; 30</b>', '控制 → <b>重复执行</b>里放<b>如果 / 否则</b> · 传感器 → <b>距离 &lt; 30</b>', 'Control → <b>por siempre</b> con <b>si / si no</b> · Sensores → <b>distancia &lt; 30</b>'],
    m4_t: ['4. 키보드 리모컨', '4. Keyboard remote', '4. キーボードリモコン', '4. 键盘遥控', '4. Mando con teclado'],
    m4_g: ['<b>↑ 키</b>를 누르면 모터가 켜지고, <b>스페이스</b>를 누르면 꺼지게 하세요.', 'Make <b>↑</b> turn the motor on and <b>space</b> turn it off.', '<b>↑</b>でモーターオン、<b>スペース</b>でオフにしよう。', '按<b>↑</b>开启马达，按<b>空格</b>关闭。', 'Haz que <b>↑</b> encienda el motor y <b>espacio</b> lo apague.'],
    m4_h: ['이벤트 → <b>키보드 ○ 키를 누를 때</b> 블록 2개 · 모터 → <b>켜기</b>, <b>끄기</b>', 'Events → two <b>when ○ key is pressed</b> blocks · Motors → <b>on</b>, <b>off</b>', 'イベント → <b>○ キーが押されたとき</b>を2つ ・ モーター → <b>オン</b>、<b>オフ</b>', '事件 → 两个<b>当按下键盘 ○ 键</b> · 马达 → <b>开启</b>、<b>关闭</b>', 'Eventos → dos bloques <b>al pulsar la tecla ○</b> · Motores → <b>encender</b>, <b>apagar</b>'],
    m5_t: ['5. 손 들면 출발 (AI)', '5. Raise your hand (AI)', '5. 手を上げたら発進（AI）', '5. 举手出发（AI）', '5. Levanta la mano (IA)'],
    m5_g: ['카메라 앞에서 <b>오른팔을 들면</b> 모터가 켜지게 하세요.', 'Make the motor start when you <b>raise your right arm</b> in front of the camera.', 'カメラの前で<b>右腕を上げたら</b>モーターがオンになるようにしよう。', '在摄像头前<b>举起右臂</b>时启动马达。', 'Haz que el motor arranque al <b>levantar el brazo derecho</b> ante la cámara.'],
    m5_h: ['이벤트 → <b>○ 이 될 때</b> · AI 카메라 → <b>오른팔을 들었는가?</b> · 모터 → <b>켜기</b>', 'Events → <b>when ○</b> · AI Camera → <b>right arm raised?</b> · Motors → <b>on</b>', 'イベント → <b>○ になったとき</b> ・ AI カメラ → <b>右腕を上げている？</b> ・ モーター → <b>オン</b>', '事件 → <b>当 ○</b> · AI 摄像头 → <b>举起了右臂？</b> · 马达 → <b>开启</b>', 'Eventos → <b>cuando ○</b> · Cámara IA → <b>¿brazo derecho levantado?</b> · Motores → <b>encender</b>'],
    m6_t: ['6. 내가 가르친 사물 (AI 학습)', '6. My own object (AI learning)', '6. 自分で教えた物（AI 学習）', '6. 我教的物体（AI 学习）', '6. Mi propio objeto (IA)'],
    m6_g: ['물건 하나를 AI에게 가르치고, 그 물건을 보여 주면 <b>소리</b>가 나게 하세요.', 'Teach the AI one object and make a <b>sound</b> play when you show it.', '物をひとつ AI に教えて、それを見せると<b>音</b>が鳴るようにしよう。', '教 AI 认识一个物体，展示它时发出<b>声音</b>。', 'Enseña un objeto a la IA y haz que suene un <b>sonido</b> al mostrarlo.'],
    m6_h: ['AI 카메라 → <b>🧠 AI 학습하기</b>로 학습 · 이벤트 → <b>○ 이 될 때</b> + <b>학습한 사물이 ○ 인가?</b> · 소리 블록', 'AI Camera → <b>🧠 Teach the AI</b> · Events → <b>when ○</b> + <b>learned object is ○?</b> · a sound block', 'AI カメラ → <b>🧠 AI に教える</b> ・ イベント → <b>○ になったとき</b> + <b>学習した物が ○？</b> ・ 音ブロック', 'AI 摄像头 → <b>🧠 训练 AI</b> · 事件 → <b>当 ○</b> + <b>学习的物体是 ○？</b> · 声音积木', 'Cámara IA → <b>🧠 Enseñar a la IA</b> · Eventos → <b>cuando ○</b> + <b>¿objeto aprendido es ○?</b> · un bloque de sonido'],
    // 채팅
    chat_ph: ['로봇이나 코드에 대해 물어보세요… (Enter 보내기)', 'Ask about your robot or code… (Enter to send)', 'ロボットやコードについて質問しよう…（Enter で送信）', '问问机器人或代码的问题…（Enter 发送）', 'Pregunta sobre tu robot o código… (Enter para enviar)'],
    chat_send: ['보내기', 'Send', '送信', '发送', 'Enviar'],
    chat_thinking: ['생각하는 중…', 'Thinking…', '考え中…', '思考中…', 'Pensando…'],
    chat_off: ['자유 질문은 <b>AI 연결</b>을 켜야 쓸 수 있어요. 선생님께 부탁하세요. 그동안 <b>코드 점검 · 블록 설명 · 미션</b>은 언제든 쓸 수 있어요.', 'Free questions need the <b>AI connection</b> — ask your teacher to set it up. <b>Check code · Explain · Missions</b> always work.', '自由な質問には<b>AI 接続</b>が必要です。先生にたのもう。<b>点検・説明・ミッション</b>はいつでも使えます。', '自由提问需要开启 <b>AI 连接</b>，请老师设置。<b>检查代码 · 积木说明 · 任务</b>随时可用。', 'Las preguntas libres necesitan la <b>conexión IA</b>; pide a tu profe que la active. <b>Revisar · Explicar · Misiones</b> siempre funcionan.'],
    chat_err: ['AI에 연결하지 못했어요', 'Could not reach the AI', 'AI に接続できませんでした', '无法连接 AI', 'No se pudo conectar con la IA'],
    chat_clear: ['대화 지우기', 'Clear chat', '会話を消す', '清除对话', 'Borrar chat'],
    chat_ask_code: ['내 코드 봐 줘', 'Look at my code', 'コードを見て', '帮我看看代码', 'Mira mi código'],
    chat_ask_error: ['오류가 났어요', 'I got an error', 'エラーが出た', '出错了', 'Me salió un error'],
    chat_ask_idea: ['만들기 아이디어', 'Project idea', '作品のアイデア', '作品创意', 'Idea de proyecto'],
    chat_q_code: ['지금 내 코드를 보고, 잘한 점 하나와 고치면 좋을 점 하나를 알려 줘.', 'Look at my current code and tell me one good thing and one thing to improve.', 'いまのコードを見て、よいところとなおすとよいところをひとつずつ教えて。', '看看我现在的代码，告诉我一个优点和一个可以改进的地方。', 'Mira mi código y dime una cosa buena y una para mejorar.'],
    chat_q_error: ['콘솔에 나온 오류가 무슨 뜻인지, 어떻게 고치면 되는지 알려 줘.', 'What does the error in the console mean and how can I fix it?', 'コンソールのエラーの意味と、なおし方を教えて。', '控制台里的错误是什么意思？怎么改？', '¿Qué significa el error de la consola y cómo lo arreglo?'],
    chat_q_idea: ['지금 쓸 수 있는 센서와 블록으로 만들 수 있는 재미있는 로봇 아이디어를 하나 알려 줘.', 'Give me one fun robot idea I can build with the sensors and blocks I have now.', 'いま使えるセンサーとブロックで作れる楽しいロボットのアイデアをひとつ教えて。', '用我现在能用的传感器和积木，给我一个有趣的机器人创意。', 'Dame una idea divertida de robot con los sensores y bloques que tengo.'],
    // 설정
    set_title: ['AI 튜터 연결 설정 (선생님용)', 'AI tutor connection (for teachers)', 'AI チューター接続設定（先生用）', 'AI 导师连接设置（教师用）', 'Conexión del tutor IA (para docentes)'],
    set_desc: ['코드 점검·블록 설명·미션은 인터넷 없이 항상 동작합니다. 학생이 <b>자유롭게 질문</b>하게 하려면 Claude에 연결하세요.', 'Code check, explanations and missions always work offline. Connect Claude to let students <b>ask free questions</b>.', '点検・説明・ミッションはオフラインでも常に動きます。生徒が<b>自由に質問</b>できるようにするには Claude に接続します。', '代码检查、积木说明和任务离线也能用。若要让学生<b>自由提问</b>，请连接 Claude。', 'Revisar, explicar y misiones funcionan sin internet. Conecta Claude para que el alumnado <b>pregunte libremente</b>.'],
    set_mode_off: ['연결 안 함 (내장 튜터만)', 'Off (built-in tutor only)', '接続しない（内蔵チューターのみ）', '不连接（仅内置导师）', 'Desactivado (solo tutor integrado)'],
    set_mode_key: ['Claude API 키 (이 PC에서만)', 'Claude API key (this PC only)', 'Claude API キー（この PC のみ）', 'Claude API 密钥（仅本机）', 'Clave API de Claude (solo este PC)'],
    set_mode_relay: ['중계 서버 주소 (교실 전체 추천)', 'Relay server URL (recommended for classes)', '中継サーバー（クラス全体におすすめ）', '中转服务器地址（推荐全班使用）', 'URL de servidor intermedio (recomendado en clase)'],
    set_key: ['API 키', 'API key', 'API キー', 'API 密钥', 'Clave API'],
    set_relay: ['중계 서버 주소', 'Relay URL', '中継サーバー URL', '中转服务器地址', 'URL del servidor'],
    set_model: ['모델', 'Model', 'モデル', '模型', 'Modelo'],
    set_m_fast: ['빠르고 저렴 (Haiku)', 'Fast & low cost (Haiku)', '速くて安い（Haiku）', '快速低价（Haiku）', 'Rápido y barato (Haiku)'],
    set_m_smart: ['더 똑똑함 (Sonnet)', 'Smarter (Sonnet)', 'より賢い（Sonnet）', '更聪明（Sonnet）', 'Más listo (Sonnet)'],
    set_warn: ['⚠ API 키는 이 브라우저에만 저장됩니다. 여러 학생이 함께 쓰는 PC에서는 키가 노출될 수 있으니 <b>중계 서버</b>를 쓰세요. 사용한 만큼 Anthropic API 요금이 나옵니다.', '⚠ The key is stored only in this browser. On shared PCs it can be exposed — use a <b>relay server</b>. Usage is billed to your Anthropic API account.', '⚠ キーはこのブラウザにだけ保存されます。共用 PC では漏れるおそれがあるので<b>中継サーバー</b>を使ってください。使った分だけ API 料金がかかります。', '⚠ 密钥只保存在此浏览器中。多人共用电脑可能泄露，请使用<b>中转服务器</b>。按用量计费。', '⚠ La clave solo se guarda en este navegador. En PCs compartidos puede filtrarse: usa un <b>servidor intermedio</b>. El uso se cobra en tu cuenta de la API.'],
    set_relay_help: ['중계 서버 만드는 법은 저장소의 <code>relay/README.md</code>를 보세요 (Cloudflare Workers 무료).', 'See <code>relay/README.md</code> in the repository for how to make a relay (Cloudflare Workers, free tier).', '中継サーバーの作り方はリポジトリの <code>relay/README.md</code> を見てください（Cloudflare Workers 無料枠）。', '中转服务器的搭建方法见仓库中的 <code>relay/README.md</code>（Cloudflare Workers 免费）。', 'Cómo crear el servidor: <code>relay/README.md</code> del repositorio (Cloudflare Workers, gratis).'],
    set_test: ['연결 시험', 'Test connection', '接続テスト', '测试连接', 'Probar conexión'],
    set_save: ['저장', 'Save', '保存', '保存', 'Guardar'],
    set_ok: ['연결 성공!', 'Connected!', '接続成功！', '连接成功！', '¡Conectado!'],
    set_on: ['AI 연결됨', 'AI connected', 'AI 接続中', 'AI 已连接', 'IA conectada'],
    set_off: ['내장 튜터', 'Built-in tutor', '内蔵チューター', '内置导师', 'Tutor integrado']
  });

  const CAT_BY_PREFIX = [
    [/^wedo_when_/, 'event', 'cat_event'], [/^wedo_motor_/, 'motor', 'cat_motor'], [/^wedo_light_/, 'light', 'cat_light'],
    [/^wedo_sound_/, 'sound', 'cat_sound'], [/^wedo_cam_learned_/, 'learn', 'cat_cam'], [/^wedo_cam_/, 'cam', 'cat_cam'],
    [/^wedo_(distance|tilt|button|key_pressed|timer|reset_timer)/, 'sensor', 'cat_sensor'],
    [/^(wedo_wait|wedo_forever|wedo_stop|controls_)/, 'control', 'cat_control'],
    [/^(math_|logic_|text)/, 'op', 'cat_op'], [/^variables_|^math_change/, 'var', 'cat_var'], [/^wedo_print/, 'out', 'cat_out']
  ];
  function categoryOf(type) {
    if (/^variables_|^math_change$/.test(type)) return ['var', 'cat_var'];
    for (const [re, k, cat] of CAT_BY_PREFIX) if (re.test(type)) return [k, cat];
    return ['op', 'cat_op'];
  }
  const fill = (s, p) => s.replace(/\{(\w+)\}/g, (_, k) => (p && p[k] !== undefined ? p[k] : ''));

  class Tutor {
    constructor(ctx) {
      this.ctx = ctx; // { ws(), hub, cam, rt, pySrc(), logs(), lang() }
      this.chat = [];
      this.cfg = this._loadCfg();
    }
    /* ---------- 설정 ---------- */
    _loadCfg() {
      try { return Object.assign({ mode: 'off', key: '', relay: '', model: 'fast' }, JSON.parse(localStorage.getItem('wedomakers-tutor') || '{}')); }
      catch (e) { return { mode: 'off', key: '', relay: '', model: 'fast' }; }
    }
    saveCfg(c) { this.cfg = Object.assign(this.cfg, c); try { localStorage.setItem('wedomakers-tutor', JSON.stringify(this.cfg)); } catch (e) {} }
    get online() { return (this.cfg.mode === 'key' && this.cfg.key) || (this.cfg.mode === 'relay' && this.cfg.relay); }

    /* ---------- 코드 점검 ---------- */
    check() {
      const ws = this.ctx.ws(), hub = this.ctx.hub, cam = this.ctx.cam;
      const out = [];
      const all = ws.getAllBlocks(false);
      const on = all.filter((b) => b.isEnabled() && !b.isShadow());
      const tops = ws.getTopBlocks(false).filter((b) => b.isEnabled());
      const hats = tops.filter((b) => window.WEDO_HATS.includes(b.type));
      if (!hats.length) out.push({ lv: 'err', html: t('c_no_hat') });
      const orphans = all.filter((b) => !b.isEnabled() && !b.isShadow() && !b.getParent());
      if (orphans.length) out.push({ lv: 'warn', html: fill(t('c_orphans'), { n: orphans.length }), id: orphans[0].id });
      hats.forEach((h) => { if (!h.getNextBlock()) out.push({ lv: 'warn', html: fill(t('c_empty_hat'), { name: h.toString().slice(0, 40) }), id: h.id }); });
      const types = new Set(on.map((b) => b.type));
      if (types.has('wedo_motor_on') && !['wedo_motor_off', 'wedo_stop', 'wedo_motor_on_for'].some((x) => types.has(x)))
        out.push({ lv: 'tip', html: t('c_motor_never_off'), id: on.find((b) => b.type === 'wedo_motor_on').id });
      // 변수: 읽기만 하고 넣지 않음
      ws.getAllVariables().forEach((v) => {
        const uses = on.filter((b) => b.getField('VAR') && b.getFieldValue('VAR') === v.getId());
        if (uses.some((b) => b.type === 'variables_get') && !uses.some((b) => b.type === 'variables_set'))
          out.push({ lv: 'warn', html: fill(t('c_var_unset'), { name: esc(v.name) }), id: uses[0].id });
      });
      // 파워 범위
      on.filter((b) => b.type === 'wedo_motor_power').forEach((b) => {
        const tgt = b.getInputTargetBlock('POWER');
        if (tgt && tgt.type === 'math_number') { const v = Number(tgt.getFieldValue('NUM')); if (v < 0 || v > 100) out.push({ lv: 'warn', html: fill(t('c_power_range'), { v }), id: b.id }); }
      });
      // AI 학습
      if ([...types].some((x) => /^wedo_cam_learned_/.test(x))) {
        if (!cam.model) out.push({ lv: 'err', html: t('c_learn_untrained'), action: 'learn' });
        else if (!cam.classes.some((c) => c.samples.length >= 3 && /배경|background|背景|fondo|nada|なにも/i.test(c.name)))
          out.push({ lv: 'tip', html: t('c_learn_no_bg'), action: 'learn' });
      }
      if ([...types].some((x) => window.WEDO_CAM.CAM_MODE[x]) && !window.isSecureContext) out.push({ lv: 'err', html: t('c_cam_https') });
      // 허브 장치
      if (hub.connected) {
        const ports = Object.values(hub.state.ports);
        if ([...types].some((x) => /^wedo_(distance|when_distance)/.test(x)) && !ports.includes(35)) out.push({ lv: 'warn', html: t('c_no_dist') });
        if ([...types].some((x) => /^wedo_(tilt|when_tilt)/.test(x)) && !ports.includes(34)) out.push({ lv: 'warn', html: t('c_no_tilt') });
        const usedPorts = new Set(on.filter((b) => /^wedo_motor_/.test(b.type)).map((b) => b.getFieldValue('PORT')).filter((p) => p === '1' || p === '2'));
        usedPorts.forEach((p) => { if (hub.state.ports[p] !== 1) out.push({ lv: 'warn', html: fill(t('c_no_motor'), { p }) }); });
      } else if (hats.length) out.push({ lv: 'tip', html: t('c_sim') });
      // 같은 키 이벤트 여러 개
      const keyCount = {};
      tops.filter((b) => b.type === 'wedo_when_key').forEach((b) => { const k = b.getFieldValue('KEY'); keyCount[k] = (keyCount[k] || 0) + 1; });
      Object.entries(keyCount).forEach(([k, n]) => { if (n > 1) out.push({ lv: 'tip', html: fill(t('c_key_twice'), { k: k.length === 1 ? k.toUpperCase() : t('k_' + k), n }) }); });
      if (!out.some((o) => o.lv !== 'tip')) out.push({ lv: 'ok', html: t('tutor_ok') });
      return out;
    }

    /* ---------- 블록 설명 ---------- */
    explain(block) {
      if (!block) return null;
      const [k, cat] = categoryOf(block.type);
      let py = '';
      try {
        const G = python.pythonGenerator;
        G.init(block.workspace);
        let code = G.blockToCode(block, true);
        if (Array.isArray(code)) code = code[0];
        py = String(code || '').split('\n').filter((l) => l.trim() && !l.startsWith('@') && !/^\s*global /.test(l)).slice(0, 4).join('\n');
        G.finish('');
      } catch (e) { py = ''; }
      return { k, cat: t(cat), desc: t('cd_' + k), text: block.toString(), py, colour: block.getColour() };
    }

    /* ---------- 미션 ---------- */
    missions() {
      const ws = this.ctx.ws();
      const chainOf = (hat) => hat.getDescendants(false).filter((b) => b.isEnabled());
      const hats = (type) => ws.getTopBlocks(false).filter((b) => b.type === type && b.isEnabled());
      const any = (list, fn) => list.some(fn);
      const field = (b, f, v) => b.getFieldValue(f) === v;
      const num = (b, input) => { const c = b.getInputTargetBlock(input); return c && c.type === 'math_number' ? Number(c.getFieldValue('NUM')) : NaN; };
      return [
        { id: 'm1', check: () => any(hats('wedo_when_start'), (h) => any(chainOf(h), (b) => b.type === 'wedo_light_color' && field(b, 'COLOR', 'BLUE'))) },
        { id: 'm2', check: () => any(hats('wedo_when_start'), (h) => any(chainOf(h), (b) => b.type === 'wedo_motor_on_for' && num(b, 'SECS') === 2)) },
        { id: 'm3', check: () => any(hats('wedo_when_start'), (h) => { const c = chainOf(h); return any(c, (b) => b.type === 'wedo_forever') && any(c, (b) => b.type === 'controls_if') && any(c, (b) => b.type === 'wedo_distance_cmp' || b.type === 'wedo_distance') && any(c, (b) => b.type === 'wedo_light_color' && field(b, 'COLOR', 'RED')) && any(c, (b) => b.type === 'wedo_light_color' && field(b, 'COLOR', 'GREEN')); }) },
        { id: 'm4', check: () => { const ks = hats('wedo_when_key'); return any(ks, (h) => field(h, 'KEY', 'up') && any(chainOf(h), (b) => b.type === 'wedo_motor_on' || b.type === 'wedo_motor_on_for')) && any(ks, (h) => field(h, 'KEY', 'space') && any(chainOf(h), (b) => b.type === 'wedo_motor_off')); } },
        { id: 'm5', check: () => any(hats('wedo_when_cond'), (h) => any(chainOf(h), (b) => b.type === 'wedo_cam_arm_up' && field(b, 'SIDE', 'RIGHT')) && any(chainOf(h), (b) => b.type === 'wedo_motor_on' || b.type === 'wedo_motor_on_for')) },
        { id: 'm6', check: () => !!this.ctx.cam.model && any(hats('wedo_when_cond'), (h) => any(chainOf(h), (b) => b.type === 'wedo_cam_learned_is') && any(chainOf(h), (b) => /^wedo_sound_(note|tone)$/.test(b.type))) }
      ];
    }

    /* ---------- Claude 채팅 ---------- */
    _system() {
      const langName = { ko: '한국어', en: 'English', ja: '日本語', zh: '简体中文', es: 'Español' }[I18N.lang] || 'English';
      return [
        'You are the friendly AI tutor inside "WeDo Makers", a block-coding web app for LEGO WeDo 2.0 robots used by elementary and middle school students.',
        `Always answer in ${langName}. Use short sentences and simple words a 10-year-old understands. Keep answers under about 120 words unless asked for more.`,
        'Teach, do not just solve: first give a hint or ask a guiding question; give the full block steps only if the student asks again or is clearly stuck.',
        'Refer to blocks by the exact names shown in the app in the student\'s language (they appear in the student\'s program context). You may also show the matching Python line from the app\'s wedo2 library.',
        'App facts: events start programs ("when Run is clicked", hub button, keyboard key, distance, tilt, "when <condition>"). Motor ports are 1 and 2; power 0-100; direction clockwise/counterclockwise. Hub light colors, sounds. Sensors: distance 0-100, tilt, hub button, keyboard, timer. Loops run one turn per 1/30 s. AI camera: skeleton (person, arm raised, body part x/y, elbow angle, shoulder tilt), hand gestures and finger count, 15 COCO objects, colors red/green/blue/yellow, plus objects and colors the student taught in the "Teach the AI" window (nearest-neighbour on image features; confidence >= 60% counts). Coordinates: x 0 (left) to 100 (right), y 0 (bottom) to 100 (top), -1 when not seen. A virtual hub is used when no real hub is connected.',
        'Stay on topic (robots, coding, sensors, AI, science and making). Be encouraging and age-appropriate. Never ask for personal information. If asked about something unsafe or unrelated, kindly steer back to the project.'
      ].join('\n');
    }
    _context() {
      const hub = this.ctx.hub, cam = this.ctx.cam;
      const devName = { 1: 'motor', 34: 'tilt sensor', 35: 'distance sensor' };
      const portTxt = hub.connected ? [1, 2].map((p) => `port ${p}: ${devName[hub.state.ports[p]] || 'empty'}`).join(', ') : 'not connected (virtual hub)';
      const learn = cam.classes.length ? `taught classes: ${cam.classes.map((c) => `${c.name}(${c.samples.length} photos)`).join(', ')}; trained: ${!!cam.model}` : 'no taught objects';
      const colors = cam.learnedColors.length ? `taught colors: ${cam.learnedColors.map((c) => c.name).join(', ')}` : '';
      const logs = this.ctx.logs().slice(-12).join('\n');
      return `[Student's current program as Python (generated from blocks)]\n${this.ctx.pySrc().slice(0, 6000)}\n\n[Hub] ${portTxt}\n[AI camera] ${cam.on ? 'on' : 'off'}; ${learn}; ${colors}\n[Recent console]\n${logs || '(empty)'}`;
    }
    async ask(question) {
      if (!this.online) throw new Error('offline');
      const msgs = this.chat.slice(-8).map((m) => ({ role: m.role, content: m.text }));
      const first = `${this._context()}\n\n[Question]\n${question}`;
      msgs.push({ role: 'user', content: first });
      const body = {
        model: this.cfg.model === 'smart' ? 'claude-sonnet-5-5' : 'claude-haiku-5-5',
        max_tokens: 700, system: this._system(), messages: msgs
      };
      let res;
      if (this.cfg.mode === 'key') {
        res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-api-key': this.cfg.key.trim(), 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
          body: JSON.stringify(body)
        });
      } else {
        res = await fetch(this.cfg.relay.trim(), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data.error && (data.error.message || data.error)) || `HTTP ${res.status}`);
      const text = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim();
      this.chat.push({ role: 'user', text: question }, { role: 'assistant', text });
      return text;
    }
  }

  // 아주 작은 마크다운 → HTML (안전하게 이스케이프한 뒤 굵게·코드·목록만)
  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function md(src) {
    const parts = String(src).split(/```(?:\w+)?\n?([\s\S]*?)```/g);
    return parts.map((p, i) => {
      if (i % 2) return `<pre><code>${esc(p.replace(/\n$/, ''))}</code></pre>`;
      let h = esc(p).replace(/`([^`\n]+)`/g, '<code>$1</code>').replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>');
      const lines = h.split('\n'); let out = '', list = null;
      lines.forEach((l) => {
        const m = /^\s*(?:[-*•]|\d+[.)])\s+(.*)/.exec(l);
        if (m) { if (!list) { out += '<ul>'; list = true; } out += `<li>${m[1]}</li>`; }
        else { if (list) { out += '</ul>'; list = null; } if (l.trim()) out += `<p>${l}</p>`; }
      });
      if (list) out += '</ul>';
      return out;
    }).join('');
  }

  window.WeTutor = { Tutor, md, fill };
})();
