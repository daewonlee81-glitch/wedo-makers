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
    tutor_chat: ['🤖 AI에게 묻기', '🤖 Ask the AI', '🤖 AI に聞く', '🤖 问 AI', '🤖 Preguntar a la IA'],
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
    // AI 튜터 (이 컴퓨터 안에서 도는 AI — Robomakers_APP 와 같은 방식)
    tt_off: ['AI 엔진 설치하기', 'Install AI engine', 'AIエンジンを入れる', '安装 AI 引擎', 'Instalar motor IA'],
    tt_check: ['🔍 코드 점검', '🔍 Check code', '🔍 コード点検', '🔍 检查代码', '🔍 Revisar código'],
    tt_error: ['❓ 오류 설명', '❓ Explain error', '❓ エラー説明', '❓ 解释错误', '❓ Explicar error'],
    tt_hint: ['💡 힌트', '💡 Hint', '💡 ヒント', '💡 提示', '💡 Pista'],
    tt_ask: ['궁금한 것을 물어보세요 (예: 왜 로봇이 안 멈춰요?)', "Ask a question (e.g. why doesn't my robot stop?)", '質問してみよう（例：どうしてロボットが止まらないの？）', '问个问题吧（例如：为什么机器人停不下来？）', 'Haz una pregunta (p. ej. ¿por qué no se para mi robot?)'],
    tt_send: ['묻기', 'Ask', '質問', '提问', 'Preguntar'],
    tt_privacy: ['🔒 블록과 질문은 이 컴퓨터 밖으로 나가지 않습니다. AI 답이 틀릴 수도 있으니 꼭 실행해서 확인하세요.', '🔒 Your blocks and questions never leave this computer. AI answers can be wrong — always run and check.', '🔒 ブロックと質問はこのパソコンの外に出ません。AIの答えは間違うこともあるので、必ず実行して確かめましょう。', '🔒 积木和问题不会离开这台电脑。AI 的回答可能有错，一定要运行确认。', '🔒 Tus bloques y preguntas no salen de este ordenador. La IA puede equivocarse: ejecuta y comprueba siempre.'],
    tt_ready: ['준비됨 · {0}', 'Ready · {0}', '準備完了 · {0}', '已就绪 · {0}', 'Listo · {0}'],
    tt_loading: ['AI 불러오는 중…', 'Loading AI…', 'AIを読み込み中…', '正在加载 AI…', 'Cargando IA…'],
    tt_none: ['AI 엔진을 아직 설치하지 않았어요. 🔍 코드 점검의 규칙 검사는 AI 없이도 됩니다. 아래에서 엔진을 한 번 설치하면 인터넷 없이 질문할 수 있어요.', 'No AI engine installed yet. The rule checks in 🔍 Check code work without AI. Install an engine once below to ask questions offline.', 'AIエンジンがまだインストールされていません。🔍 コード点検のルールチェックはAIなしでも動きます。下でエンジンを一度インストールすると、オフラインで質問できます。', '还没有安装 AI 引擎。🔍 检查代码中的规则检查不需要 AI 也能用。在下面安装一次引擎后，就能离线提问。', 'Aún no hay un motor de IA instalado. Las revisiones automáticas de 🔍 Revisar código funcionan sin IA. Instala un motor una vez abajo para preguntar sin internet.'],
    tt_setup: ['⚙ AI 엔진 설치 · 선택', '⚙ Install · choose AI engine', '⚙ AIエンジンのインストール・選択', '⚙ 安装 · 选择 AI 引擎', '⚙ Instalar · elegir motor de IA'],
    tt_webllm: ['오픈 AI 모델 (Qwen)', 'Open AI model (Qwen)', 'オープンAIモデル（Qwen）', '开放 AI 模型（Qwen）', 'Modelo de IA abierto (Qwen)'],
    tt_webllm_d: ['모든 언어(한국어 포함). 처음 한 번 받으면 브라우저에 저장되어 인터넷 없이 씁니다. 그래픽(WebGPU)이 되는 Chrome·Edge 필요.', 'All languages. Downloaded once and stored in the browser, then works offline. Needs Chrome or Edge with WebGPU.', 'すべての言語に対応。一度ダウンロードするとブラウザに保存され、オフラインで使えます。WebGPU対応のChrome・Edgeが必要です。', '支持所有语言。下载一次后保存在浏览器中，之后离线可用。需要支持 WebGPU 的 Chrome 或 Edge。', 'Todos los idiomas. Se descarga una vez, se guarda en el navegador y luego funciona sin internet. Necesita Chrome o Edge con WebGPU.'],
    tt_installed: ['설치됨', 'Installed', 'インストール済み', '已安装', 'Instalado'],
    tt_use: ['사용', 'Use', '使う', '使用', 'Usar'],
    tt_remove: ['지우기', 'Delete', '削除', '删除', 'Borrar'],
    tt_install: ['설치', 'Install', 'インストール', '安装', 'Instalar'],
    tt_nogpu: ['이 브라우저는 WebGPU 를 지원하지 않아 쓸 수 없어요. 최신 Chrome 또는 Edge 를 써 주세요.', 'This browser has no WebGPU, so the model cannot run. Use the latest Chrome or Edge.', 'このブラウザはWebGPUに対応していないため使えません。最新のChromeかEdgeを使ってください。', '此浏览器不支持 WebGPU，无法运行模型。请使用最新的 Chrome 或 Edge。', 'Este navegador no tiene WebGPU, así que el modelo no puede funcionar. Usa la última versión de Chrome o Edge.'],
    tt_chrome: ['Chrome 내장 AI (Gemini Nano)', 'Chrome built-in AI (Gemini Nano)', 'Chrome内蔵AI（Gemini Nano）', 'Chrome 内置 AI（Gemini Nano）', 'IA integrada de Chrome (Gemini Nano)'],
    tt_chrome_d: ['Chrome 이 모델을 관리합니다 (약 4 GB, PC 전용).', 'Chrome manages the model (about 4 GB, desktop only).', 'Chromeがモデルを管理します（約4 GB、パソコンのみ）。', '由 Chrome 管理模型（约 4 GB，仅限电脑）。', 'Chrome gestiona el modelo (unos 4 GB, solo ordenador).'],
    tt_chromeNo: ['이 브라우저에는 내장 AI가 없어요 (Chrome 148 이상 PC 필요).', 'This browser has no built-in AI (needs Chrome 148+ on a PC).', 'このブラウザには内蔵AIがありません（パソコンのChrome 148以上が必要）。', '此浏览器没有内置 AI（需要电脑上的 Chrome 148 以上）。', 'Este navegador no tiene IA integrada (necesita Chrome 148+ en un ordenador).'],
    tt_chromeNoLang: ['Chrome 내장 AI는 아직 이 언어를 지원하지 않아요 (영어·일본어·스페인어·독일어·프랑스어만). 오픈 AI 모델을 써 주세요.', 'Chrome built-in AI does not support this language yet (English, Japanese, Spanish, German, French only). Use the open AI model.', 'Chrome内蔵AIはこの言語にまだ対応していません（英語・日本語・スペイン語・ドイツ語・フランス語のみ）。オープンAIモデルを使ってください。', 'Chrome 内置 AI 暂不支持此语言（仅英语、日语、西班牙语、德语、法语）。请使用开放 AI 模型。', 'La IA integrada de Chrome aún no admite este idioma (solo inglés, japonés, español, alemán y francés). Usa el modelo de IA abierto.'],
    tt_needNet: ['설치할 때만 인터넷이 필요합니다. 학교 와이파이가 느리면 한 대에서 먼저 받아 보세요.', 'Internet is needed only while installing. On slow school Wi-Fi, try one computer first.', 'インターネットはインストールのときだけ必要です。学校のWi-Fiが遅いときは、まず1台で試してください。', '只有安装时需要联网。学校 Wi-Fi 较慢时，先在一台电脑上试试。', 'Solo se necesita internet al instalar. Si el Wi-Fi del colegio es lento, prueba primero en un ordenador.'],
    tt_installing: ['받는 중 {0}%', 'Downloading {0}%', 'ダウンロード中 {0}%', '下载中 {0}%', 'Descargando {0}%'],
    tt_failed: ['AI를 쓸 수 없어요: {0}', 'AI is not available: {0}', 'AIを使えません：{0}', '无法使用 AI：{0}', 'La IA no está disponible: {0}'],
    tt_thinking: ['생각하는 중…', 'Thinking…', '考え中…', '思考中…', 'Pensando…'],
    tt_rules: ['자동 점검', 'Automatic checks', '自動チェック', '自动检查', 'Revisión automática'],
    tt_noIssue: ['✅ 규칙 검사에서 문제를 찾지 못했어요.', '✅ The rule checks found no problems.', '✅ ルールチェックでは問題が見つかりませんでした。', '✅ 规则检查没有发现问题。', '✅ La revisión automática no encontró problemas.'],
    tt_noError: ['아직 오류가 없어요. 프로그램을 ▶ 실행해서 멈추면 다시 눌러 보세요.', 'No error yet. Run the program with ▶ and press this again if it stops.', 'まだエラーはありません。▶ 実行して止まったら、もう一度押してください。', '还没有错误。用 ▶ 运行程序，停下来后再按一次。', 'Todavía no hay errores. Ejecuta el programa con ▶ y vuelve a pulsar si se detiene.'],
    tt_lastError: ['마지막 오류: {0}', 'Last error: {0}', '最後のエラー：{0}', '最近的错误：{0}', 'Último error: {0}'],
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
      this.active = null; // 불러온 엔진 (Chrome 또는 Open)
    }
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

    /* ---------- AI 에 줄 글 ---------- */
    context(rules) {
      const hub = this.ctx.hub, cam = this.ctx.cam;
      const devName = { 1: 'motor', 34: 'tilt sensor', 35: 'distance sensor' };
      const hubTxt = hub.connected ? [1, 2].map((p) => `port ${p}: ${devName[hub.state.ports[p]] || 'empty'}`).join(', ') : 'not connected (virtual hub)';
      const { text } = blocksToText(this.ctx.ws());
      const py = this.ctx.pySrc().split('\n').filter((l) => l.trim() && !l.startsWith('#')).slice(0, 45).join('\n');
      const parts = [`Hub: ${hubTxt}`, `Block program:\n${text || '(empty)'}`, `Generated Python (for reference):\n${py}`];
      if (cam.classes.length || cam.learnedColors.length) parts.push(`AI camera: ${cam.on ? 'on' : 'off'}; taught objects: ${cam.classes.map((c) => `${c.name} (${c.samples.length} photos)`).join(', ') || '-'}; trained: ${!!cam.model}; taught colors: ${cam.learnedColors.map((c) => c.name).join(', ') || '-'}`);
      if (rules.length) parts.push('Automatic checks found:\n' + rules.map((r) => '- ' + r).join('\n'));
      const err = this.ctx.lastError();
      if (err) parts.push(`Last error: ${err}`);
      return parts.join('\n\n');
    }
  }

  /* ---------- 블록 → 번호 붙은 글 [L1]… (AI 가 줄 번호로 답하면 그 블록을 표시) ---------- */
  function fieldText(f) { try { const s = f.getText(); return s && s.trim() ? s.trim() : ''; } catch (e) { return ''; } }
  function valueText(b) { try { return b.toString(80, '?').replace(/\s+/g, ' '); } catch (e) { return b.type; } }
  function blocksToText(ws) {
    const lines = [];
    const emit = (b, depth, tokens) => {
      const text = tokens.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      if (text) lines.push({ n: lines.length + 1, id: b.id, depth, text });
    };
    const walk = (b, depth) => {
      for (; b; b = b.getNextBlock()) {
        if (!b.isEnabled()) continue;
        let tokens = [], first = true;
        for (const input of b.inputList) {
          for (const f of input.fieldRow) tokens.push(fieldText(f));
          if (input.type === Blockly.inputs.inputTypes.STATEMENT) {
            emit(b, depth, tokens); tokens = []; first = false;
            walk(input.connection && input.connection.targetBlock(), depth + 1);
          } else if (input.connection && input.connection.targetBlock()) {
            tokens.push('(' + valueText(input.connection.targetBlock()) + ')');
          }
        }
        if (first || tokens.some(Boolean)) emit(b, depth, tokens);
      }
    };
    ws.getTopBlocks(true).filter((b) => window.WEDO_HATS.includes(b.type) && b.isEnabled()).forEach((b) => walk(b, 0));
    return { lines, text: lines.map((l) => `[L${l.n}] ${'  '.repeat(l.depth)}${l.text}`).join('\n') };
  }

  const LANG_NAME = { ko: 'Korean', en: 'English', ja: 'Japanese', zh: 'Simplified Chinese', es: 'Spanish' };
  const FACTS = `Facts about this platform (trust these):
- LEGO WeDo 2.0 hub, programmed with word blocks in "WeDo Makers". The listing shows each block as one line [Ln]. A program starts from an event block (Run clicked, hub button, keyboard key, distance, tilt, "when <condition>").
- Motor ports are 1 and 2 (or all ports). Motor power is 0-100 %. Direction is clockwise / counterclockwise. "turn motor on" keeps spinning until "turn motor off" or Stop.
- The distance sensor gives 0 (near) to 100 (far). Tilt directions: up, down, left, right. The hub light can be set to colors or RGB. Sounds are notes or Hz.
- Every loop turn waits 1/30 s automatically, so "change by 1" in a forever loop takes about 3 s to go from 0 to 100.
- No hub connected = the virtual hub (sliders and buttons on screen) is used instead.
- AI camera (PC webcam): skeleton (person seen, arm raised, body part x/y, elbow angle, shoulder tilt), hand gesture and finger count, 15 objects, colors red/green/blue/yellow, plus objects and colors the student taught in the "Teach the AI" window (true when confidence >= 60 %). x 0 (left) to 100 (right), y 0 (bottom) to 100 (top), -1 when not seen.
- A variable must be set before it is read. Blocks that are not attached under an event block do not run (they look faded).`;
  function systemPrompt(lang) {
    return `You are a friendly, patient coding tutor for children (age 9-15) using the "WeDo Makers" block editor for LEGO WeDo 2.0.
Always answer in ${LANG_NAME[lang] || 'English'}.
Rules:
- Be short: at most 5 short sentences or a short bullet list.
- When you talk about a block, cite its line like [L4] (exactly this format).
- Explain WHY, then say which block to change and how, using the block words from the listing.
- Do not write a whole program. Do not invent blocks or functions. If you are not sure, say so.
${FACTS}`;
  }

  /* ---------- 엔진 ---------- */
  const CHROME_LANGS = ['en', 'ja', 'es', 'de', 'fr'];
  const B = window.RMTutorBench; // 모델 목록 · 비교 시험 (Robomakers_APP 와 공용 tutor-bench.js)
  const WEBLLM = new URL('vendor/web-llm/index.js', location.href).href; // 같은 사이트에 올린 WebLLM 0.2.87
  const Chrome = {
    key: 'chrome',
    async state(lang) {
      if (!('LanguageModel' in self)) return { ok: false, why: 'tt_chromeNo' };
      if (!CHROME_LANGS.includes(lang)) return { ok: false, why: 'tt_chromeNoLang' };
      try { const a = await LanguageModel.availability(this.opts(lang)); return { ok: a !== 'unavailable', installed: a === 'available', a }; }
      catch (e) { return { ok: false, why: 'tt_chromeNo' }; }
    },
    opts(lang) { return { expectedInputs: [{ type: 'text', languages: ['en', lang] }], expectedOutputs: [{ type: 'text', languages: [lang] }] }; },
    async load(lang, progress) {
      this.base = await LanguageModel.create({
        ...this.opts(lang),
        initialPrompts: [{ role: 'system', content: systemPrompt(lang) }],
        monitor(m) { m.addEventListener('downloadprogress', (e) => progress(Math.round((e.loaded || 0) * 100))); }
      });
      this.lang = lang;
    },
    async *ask(user) {
      const s = await this.base.clone();
      let prev = '';
      for await (const chunk of s.promptStreaming(user)) {
        const piece = chunk.startsWith(prev) && prev ? chunk.slice(prev.length) : chunk; // 누적·조각 방식 모두
        prev = chunk.startsWith(prev) ? chunk : prev + chunk;
        yield piece;
      }
      if (s.destroy) s.destroy();
    }
  };
  const Open = {
    key: 'webllm',
    async gpu() {
      if (!navigator.gpu) return null;
      try { const a = await navigator.gpu.requestAdapter(); return a ? { f16: a.features.has('shader-f16') } : null; } catch (e) { return null; }
    },
    async lib() { this._lib = this._lib || (await import(WEBLLM)); return this._lib; },
    async modelId(size) { const g = await this.gpu(); return g ? B.modelId(size, g.f16) : null; },
    async installed(size) {
      const id = await this.modelId(size); if (!id) return false;
      try { return await (await this.lib()).hasModelInCache(id); } catch (e) { return false; }
    },
    async load(size, lang, progress) {
      const id = await this.modelId(size);
      const lib = await this.lib();
      if (this.engine && this.id === id) return;
      if (this.engine && this.engine.unload) this.engine.unload();
      this.engine = await lib.CreateMLCEngine(id, { initProgressCallback: (r) => progress(Math.round((r.progress || 0) * 100), r.text) });
      this.id = id; this.size = size; this.lang = lang;
    },
    unload() { if (this.engine && this.engine.unload) this.engine.unload(); this.engine = null; this.id = null; },
    async remove(size) {
      const id = await this.modelId(size);
      if (id) await (await this.lib()).deleteModelAllInfoInCache(id);
      if (this.id === id) { if (this.engine && this.engine.unload) this.engine.unload(); this.engine = null; this.id = null; }
    },
    async *ask(user, lang) {
      const stream = await this.engine.chat.completions.create({
        messages: [{ role: 'system', content: systemPrompt(lang) }, { role: 'user', content: user }],
        stream: true, temperature: 0.3, max_tokens: 450, ...B.genOpts(this.size)
      });
      for await (const c of stream) yield (c.choices && c.choices[0] && c.choices[0].delta && c.choices[0].delta.content) || '';
    }
  };

  // 모델 비교 시험 예제 (일부러 틀린 곳 하나씩 · expect = 짚어야 할 줄)
  const BENCH_CASES = [
    { title: '가까이 오면 멈추기 — 비교 방향이 반대', expect: [2],
      question: 'The motor should stop when my hand comes close to the distance sensor, but it stops when my hand is far away. Check my block program.',
      listing: `Hub: port 1: motor, port 2: distance sensor\n\nBlock program:\n[L1] ▶ 실행 버튼을 누를 때\n[L2] 거리 센서 값이 > 20 이 될 때\n[L3]   포트 1 모터 끄기` },
    { title: '모터가 멈추지 않음 — 끄기 블록이 없음', expect: [2, 3],
      question: 'My motor never stops. I wanted it to run for 3 seconds. Which block should I change?',
      listing: `Hub: port 1: motor\n\nBlock program:\n[L1] ▶ 실행 버튼을 누를 때\n[L2] 포트 1 모터 켜기\n[L3] 3 초 기다리기\n[L4] 허브 불빛을 빨강 으로 켜기` },
    { title: '변수를 정하지 않음', expect: [4, 2],
      question: 'The motor does not get faster. Check my block program.',
      listing: `Hub: port 1: motor\n\nBlock program:\n[L1] ▶ 실행 버튼을 누를 때\n[L2] 포트 1 모터 켜기\n[L3] 무한 반복하기\n[L4]   포트 1 모터 파워를 (속도) % 로 정하기\n[L5]   속도 를 1 만큼 바꾸기\n\nNote: the variable "속도" is never set to a start value.` },
    { title: '포트 착오 — 모터는 포트 2', expect: [2],
      question: 'Nothing moves when I click Run. Why?',
      listing: `Hub: port 1: distance sensor, port 2: motor\n\nBlock program:\n[L1] ▶ 실행 버튼을 누를 때\n[L2] 포트 1 모터 2 초 동안 켜기\n[L3] 허브 불빛을 초록 으로 켜기` },
    { title: '기울기 방향 착오', expect: [2],
      question: 'The light should turn blue when I tilt the hub to the LEFT, but it happens when I tilt it right. Which block is wrong?',
      listing: `Hub: port 1: tilt sensor\n\nBlock program:\n[L1] ▶ 실행 버튼을 누를 때\n[L2] 허브가 오른쪽 으로 기울어질 때\n[L3]   허브 불빛을 파랑 으로 켜기` },
  ];
  const QUESTION = {
    check: 'Check my block program for mistakes. Explain the most important problem first and which block to change.',
    error: 'My program stopped with the error shown below. Explain in simple words what it means and how to fix it.',
    hint: 'Do not solve it for me. Give me one hint about what to try or improve next in my block program.'
  };
  const tf = (key, ...a) => t(key).replace(/\{(\d)\}/g, (_, i) => (a[i] !== undefined ? a[i] : ''));

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

  window.WeTutor = { Tutor, md, fill, blocksToText, Chrome, Open, QUESTION, tf, systemPrompt, BENCH_CASES };
})();
