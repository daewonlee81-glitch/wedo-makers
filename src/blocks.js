/* ===== WeDo 2.0 워드블럭 정의 + JavaScript/Python 생성기 ===== */
(function () {
  const JS = javascript.javascriptGenerator, JO = javascript.Order;
  const PY = python.pythonGenerator, PO = python.Order;

  const C = {
    event: '#f5b800', motor: '#1e88e5', light: '#8a55d7', sound: '#d65cd6',
    sensor: '#2bb3d9', control: '#ff9f1a', out: '#6b7c8f'
  };
  window.WEDO_COLORS = C;

  const PORTS = [['포트 1', '1'], ['포트 2', '2']];
  const MPORTS = [['포트 1', '1'], ['포트 2', '2'], ['모든 포트', '0']];
  const COLORS = [
    ['빨강', 'RED'], ['주황', 'ORANGE'], ['노랑', 'YELLOW'], ['초록', 'GREEN'], ['하늘', 'CYAN'],
    ['파랑', 'BLUE'], ['보라', 'PURPLE'], ['분홍', 'PINK'], ['흰색', 'WHITE']
  ];
  const NOTES = [
    ['도 (C4)', '262'], ['레 (D4)', '294'], ['미 (E4)', '330'], ['파 (F4)', '349'],
    ['솔 (G4)', '392'], ['라 (A4)', '440'], ['시 (B4)', '494'], ['높은 도 (C5)', '523']
  ];
  const TILTS = [['위쪽', 'UP'], ['아래쪽', 'DOWN'], ['왼쪽', 'LEFT'], ['오른쪽', 'RIGHT']];
  const TILTS_ANY = TILTS.concat([['아무 방향', 'ANY']]);
  const KEYS = [['스페이스', 'space'], ['↑ 위 화살표', 'up'], ['↓ 아래 화살표', 'down'], ['← 왼쪽 화살표', 'left'], ['→ 오른쪽 화살표', 'right'], ['엔터', 'enter'], ['아무', 'any']]
    .concat('abcdefghijklmnopqrstuvwxyz'.split('').map((c) => [c.toUpperCase(), c]))
    .concat('0123456789'.split('').map((c) => [c, c]));
  const C_KEY = '#e0703a';
  window.WEDO_KEYS = KEYS;
  const NUM = (name) => ({ type: 'input_value', name, check: 'Number' });
  const st = (o) => Object.assign({ previousStatement: null, nextStatement: null }, o);

  Blockly.common.defineBlocksWithJsonArray([
    // ---------- 이벤트 (모자 블록) ----------
    { type: 'wedo_when_start', message0: '▶  실행 버튼을 누를 때', nextStatement: null, colour: C.event, tooltip: '실행 버튼을 누르면 아래 블록들이 실행됩니다.' },
    { type: 'wedo_when_button', message0: '허브 버튼을 누를 때', nextStatement: null, colour: C.event, tooltip: 'WeDo 허브의 초록 버튼을 누를 때마다 실행됩니다.' },
    { type: 'wedo_when_distance', message0: '거리 센서 값이 %1 %2 이 될 때',
      args0: [{ type: 'field_dropdown', name: 'OP', options: [['<', 'LT'], ['>', 'GT']] }, { type: 'field_number', name: 'VAL', value: 30, min: 0, max: 100 }],
      nextStatement: null, colour: C.event, tooltip: '조건이 거짓→참으로 바뀌는 순간 실행됩니다. (값 범위 0~100)' },
    { type: 'wedo_when_tilt', message0: '허브가 %1 으로 기울어질 때',
      args0: [{ type: 'field_dropdown', name: 'DIR', options: TILTS_ANY }], nextStatement: null, colour: C.event,
      tooltip: '기울기 센서가 해당 방향으로 기울어지는 순간 실행됩니다.' },

    { type: 'wedo_when_key', message0: '키보드 %1 키를 누를 때', args0: [{ type: 'field_dropdown', name: 'KEY', options: KEYS }],
      nextStatement: null, colour: C.event, tooltip: 'PC 키보드의 키를 누를 때마다 실행됩니다. (한/영 상관없이 동작)' },

    // ---------- 모터 ----------
    st({ type: 'wedo_motor_on_for', message0: '%1 모터를 %2 초 동안 켜기', args0: [{ type: 'field_dropdown', name: 'PORT', options: MPORTS }, NUM('SECS')], colour: C.motor }),
    st({ type: 'wedo_motor_on', message0: '%1 모터 켜기', args0: [{ type: 'field_dropdown', name: 'PORT', options: MPORTS }], colour: C.motor }),
    st({ type: 'wedo_motor_off', message0: '%1 모터 끄기', args0: [{ type: 'field_dropdown', name: 'PORT', options: MPORTS }], colour: C.motor }),
    st({ type: 'wedo_motor_power', message0: '%1 모터 파워를 %2 %% 로 정하기', args0: [{ type: 'field_dropdown', name: 'PORT', options: MPORTS }, NUM('POWER')], colour: C.motor, tooltip: '0 ~ 100' }),
    st({ type: 'wedo_motor_dir', message0: '%1 모터 방향을 %2 으로 정하기',
      args0: [{ type: 'field_dropdown', name: 'PORT', options: MPORTS }, { type: 'field_dropdown', name: 'DIR', options: [['↻ 시계방향', '1'], ['↺ 반시계방향', '-1']] }], colour: C.motor }),
    st({ type: 'wedo_motor_reverse', message0: '%1 모터 방향 바꾸기', args0: [{ type: 'field_dropdown', name: 'PORT', options: MPORTS }], colour: C.motor }),

    // ---------- 불빛 ----------
    st({ type: 'wedo_light_color', message0: '허브 불빛을 %1 으로 켜기', args0: [{ type: 'field_dropdown', name: 'COLOR', options: COLORS }], colour: C.light }),
    st({ type: 'wedo_light_rgb', message0: '허브 불빛을 R %1 G %2 B %3 으로 켜기', args0: [NUM('R'), NUM('G'), NUM('B')], inputsInline: true, colour: C.light, tooltip: '각 값 0 ~ 255' }),
    st({ type: 'wedo_light_off', message0: '허브 불빛 끄기', colour: C.light }),

    // ---------- 소리 ----------
    st({ type: 'wedo_sound_note', message0: '%1 음을 %2 초 동안 연주하기', args0: [{ type: 'field_dropdown', name: 'NOTE', options: NOTES }, NUM('SECS')], colour: C.sound }),
    st({ type: 'wedo_sound_tone', message0: '%1 Hz 소리를 %2 초 동안 연주하기', args0: [NUM('FREQ'), NUM('SECS')], inputsInline: true, colour: C.sound }),
    st({ type: 'wedo_sound_stop', message0: '소리 끄기', colour: C.sound }),

    // ---------- 센서 ----------
    { type: 'wedo_distance', message0: '거리 센서 값', output: 'Number', colour: C.sensor, tooltip: '0(가까움) ~ 100(멂)' },
    { type: 'wedo_distance_cmp', message0: '거리 센서 값 %1 %2', args0: [{ type: 'field_dropdown', name: 'OP', options: [['<', 'LT'], ['>', 'GT']] }, NUM('VAL')], inputsInline: true, output: 'Boolean', colour: C.sensor },
    { type: 'wedo_tilt_is', message0: '허브가 %1 으로 기울어졌는가?', args0: [{ type: 'field_dropdown', name: 'DIR', options: TILTS_ANY }], output: 'Boolean', colour: C.sensor },
    { type: 'wedo_tilt_angle', message0: '%1 기울기 각도', args0: [{ type: 'field_dropdown', name: 'DIR', options: TILTS }], output: 'Number', colour: C.sensor },
    { type: 'wedo_button', message0: '허브 버튼이 눌렸는가?', output: 'Boolean', colour: C.sensor },
    { type: 'wedo_key_pressed', message0: '키보드 %1 키가 눌렸는가?', args0: [{ type: 'field_dropdown', name: 'KEY', options: KEYS }], output: 'Boolean', colour: C.sensor },
    { type: 'wedo_timer', message0: '타이머 (초)', output: 'Number', colour: C.sensor },
    st({ type: 'wedo_reset_timer', message0: '타이머 초기화', colour: C.sensor }),

    // ---------- 제어 ----------
    st({ type: 'wedo_wait', message0: '%1 초 기다리기', args0: [NUM('SECS')], colour: C.control }),
    st({ type: 'wedo_wait_until', message0: '%1 이 될 때까지 기다리기', args0: [{ type: 'input_value', name: 'COND', check: 'Boolean' }], colour: C.control }),
    { type: 'wedo_forever', message0: '무한 반복하기 %1 %2', args0: [{ type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }], previousStatement: null, colour: C.control },
    { type: 'wedo_stop', message0: '■ 모든 프로그램 멈추기', previousStatement: null, colour: C.control },

    // ---------- 출력 ----------
    st({ type: 'wedo_print', message0: '%1 콘솔에 출력하기', args0: [{ type: 'input_value', name: 'TEXT' }], colour: C.out })
  ]);

  // 한글 변수 이름을 그대로 쓰도록 (Python 3 · JavaScript 모두 유니코드 식별자 허용)
  Blockly.Names.prototype.safeName = function (name) {
    if (!name) return Blockly.Msg.UNNAMED_KEY || 'unnamed';
    let s = String(name).trim().replace(/\s+/g, '_').replace(/[^\p{L}\p{N}_]/gu, '_');
    if (/^\p{N}/u.test(s)) s = 'my_' + s;
    return s;
  };

  const HATS = ['wedo_when_start', 'wedo_when_button', 'wedo_when_distance', 'wedo_when_tilt', 'wedo_when_key'];
  window.WEDO_HATS = HATS;
  HATS.forEach((t) => {
    const def = Blockly.Blocks[t];
    const init = def.init;
    def.init = function () { init.call(this); this.suppressPrefixSuffix = true; this.hat = 'cap'; };
  });

  // 모자 블록은 뒤따르는 블록을 함수 몸체로 감싸므로 기본 연결 처리를 막는다
  [JS, PY].forEach((G) => {
    const orig = G.scrub_;
    G.scrub_ = function (block, code, thisOnly) {
      if (HATS.includes(block.type)) return code;
      return orig.call(this, block, code, thisOnly);
    };
  });
  const bodyOf = (block, G) => {
    const next = block.getNextBlock();
    let body = next ? G.blockToCode(next) : '';
    if (Array.isArray(body)) body = body[0];
    return body;
  };

  const v = (G, O, b, name, dflt) => G.valueToCode(b, name, O) || dflt;

  /* ======================= JavaScript (실행용) ======================= */
  const J = JS.forBlock;
  const jsHat = (reg) => function (b, G) {
    const body = G.prefixLines(bodyOf(b, G), G.INDENT);
    return `${reg}(async (__t) => {\n${body}});\n`;
  };
  J.wedo_when_start = jsHat('W.onStart');
  J.wedo_when_button = jsHat('W.onButton');
  J.wedo_when_distance = function (b, G) {
    const op = b.getFieldValue('OP') === 'LT' ? '<' : '>';
    const body = G.prefixLines(bodyOf(b, G), G.INDENT);
    return `W.when(() => W.distance() ${op} ${Number(b.getFieldValue('VAL'))}, async (__t) => {\n${body}});\n`;
  };
  J.wedo_when_tilt = function (b, G) {
    const body = G.prefixLines(bodyOf(b, G), G.INDENT);
    return `W.when(() => W.isTilted('${b.getFieldValue('DIR')}'), async (__t) => {\n${body}});\n`;
  };
  J.wedo_when_key = function (b, G) {
    const body = G.prefixLines(bodyOf(b, G), G.INDENT);
    return `W.onKey('${b.getFieldValue('KEY')}', async (__t) => {\n${body}});\n`;
  };
  J.wedo_key_pressed = (b) => [`W.isKeyPressed('${b.getFieldValue('KEY')}')`, JO.FUNCTION_CALL];
  J.wedo_motor_on_for = (b, G) => `await W.motorOnFor(${b.getFieldValue('PORT')}, ${v(G, JO.NONE, b, 'SECS', '1')});\n`;
  J.wedo_motor_on = (b) => `await W.motorOn(${b.getFieldValue('PORT')});\n`;
  J.wedo_motor_off = (b) => `await W.motorOff(${b.getFieldValue('PORT')});\n`;
  J.wedo_motor_power = (b, G) => `await W.motorPower(${b.getFieldValue('PORT')}, ${v(G, JO.NONE, b, 'POWER', '100')});\n`;
  J.wedo_motor_dir = (b) => `await W.motorDirection(${b.getFieldValue('PORT')}, ${b.getFieldValue('DIR')});\n`;
  J.wedo_motor_reverse = (b) => `await W.motorReverse(${b.getFieldValue('PORT')});\n`;
  J.wedo_light_color = (b) => `await W.lightColor('${b.getFieldValue('COLOR')}');\n`;
  J.wedo_light_rgb = (b, G) => `await W.lightRGB(${v(G, JO.NONE, b, 'R', '0')}, ${v(G, JO.NONE, b, 'G', '0')}, ${v(G, JO.NONE, b, 'B', '0')});\n`;
  J.wedo_light_off = () => `await W.lightOff();\n`;
  J.wedo_sound_note = (b, G) => `await W.playTone(${b.getFieldValue('NOTE')}, ${v(G, JO.NONE, b, 'SECS', '0.5')});\n`;
  J.wedo_sound_tone = (b, G) => `await W.playTone(${v(G, JO.NONE, b, 'FREQ', '440')}, ${v(G, JO.NONE, b, 'SECS', '0.5')});\n`;
  J.wedo_sound_stop = () => `await W.stopSound();\n`;
  J.wedo_distance = () => ['W.distance()', JO.FUNCTION_CALL];
  J.wedo_distance_cmp = (b, G) => [`(W.distance() ${b.getFieldValue('OP') === 'LT' ? '<' : '>'} ${v(G, JO.RELATIONAL, b, 'VAL', '0')})`, JO.ATOMIC];
  J.wedo_tilt_is = (b) => [`W.isTilted('${b.getFieldValue('DIR')}')`, JO.FUNCTION_CALL];
  J.wedo_tilt_angle = (b) => [`W.tiltAngle('${b.getFieldValue('DIR')}')`, JO.FUNCTION_CALL];
  J.wedo_button = () => ['W.isButtonPressed()', JO.FUNCTION_CALL];
  J.wedo_timer = () => ['W.timer()', JO.FUNCTION_CALL];
  J.wedo_reset_timer = () => 'W.resetTimer();\n';
  J.wedo_wait = (b, G) => `await W.wait(${v(G, JO.NONE, b, 'SECS', '1')});\n`;
  J.wedo_wait_until = (b, G) => `await W.waitUntil(() => ${v(G, JO.NONE, b, 'COND', 'false')});\n`;
  J.wedo_forever = (b, G) => `while (true) {\n${G.INDENT}await W.tick();\n${G.statementToCode(b, 'DO')}}\n`;
  J.wedo_stop = () => 'W.stopAll();\nreturn;\n';
  J.wedo_print = (b, G) => `W.print(${v(G, JO.NONE, b, 'TEXT', "''")});\n`;

  /* ======================= Python (보기/내보내기용) ======================= */
  PY.INDENT = '    ';
  const P = PY.forBlock;
  PY.addReservedWords('wedo2,on_start,on_button,on_key,is_key_pressed,when,run,motor_on,motor_off,motor_on_for,motor_power,' +
    'motor_direction,motor_reverse,light_color,light_rgb,light_off,play_tone,stop_sound,distance,is_tilted,' +
    'tilt_angle,is_button_pressed,timer,reset_timer,wait,wait_until,stop_all,ALL,UP,DOWN,LEFT,RIGHT,ANY,' +
    'CLOCKWISE,COUNTERCLOCKWISE,' + COLORS.map((c) => c[1]).join(','));
  let hatSeq = 0;
  const pyGlobals = (b, G) => {
    const names = b.workspace.getAllVariables().map((x) => G.nameDB_.getName(x.getId(), Blockly.Names.NameType.VARIABLE));
    return names.length ? `${G.INDENT}global ${names.join(', ')}\n` : '';
  };
  const pyHat = (deco, fname) => function (b, G) {
    hatSeq++;
    const body = G.prefixLines(bodyOf(b, G), G.INDENT) || `${G.INDENT}pass\n`;
    return `@${deco}\ndef ${fname}_${hatSeq}():\n${pyGlobals(b, G)}${body}\n`;
  };
  P.wedo_when_start = pyHat('on_start', 'when_started');
  P.wedo_when_button = pyHat('on_button', 'when_button');
  P.wedo_when_distance = function (b, G) {
    const op = b.getFieldValue('OP') === 'LT' ? '<' : '>';
    return pyHat(`when(lambda: distance() ${op} ${Number(b.getFieldValue('VAL'))})`, 'when_distance')(b, G);
  };
  P.wedo_when_tilt = function (b, G) {
    return pyHat(`when(lambda: is_tilted(${b.getFieldValue('DIR')}))`, 'when_tilted')(b, G);
  };
  P.wedo_when_key = function (b, G) {
    return pyHat(`on_key('${b.getFieldValue('KEY')}')`, 'when_key')(b, G);
  };
  P.wedo_key_pressed = (b) => [`is_key_pressed('${b.getFieldValue('KEY')}')`, PO.FUNCTION_CALL];
  const pp = (p) => (p === '0' ? 'ALL' : p);
  P.wedo_motor_on_for = (b, G) => `motor_on_for(${pp(b.getFieldValue('PORT'))}, ${v(G, PO.NONE, b, 'SECS', '1')})\n`;
  P.wedo_motor_on = (b) => `motor_on(${pp(b.getFieldValue('PORT'))})\n`;
  P.wedo_motor_off = (b) => `motor_off(${pp(b.getFieldValue('PORT'))})\n`;
  P.wedo_motor_power = (b, G) => `motor_power(${pp(b.getFieldValue('PORT'))}, ${v(G, PO.NONE, b, 'POWER', '100')})\n`;
  P.wedo_motor_dir = (b) => `motor_direction(${pp(b.getFieldValue('PORT'))}, ${b.getFieldValue('DIR') === '1' ? 'CLOCKWISE' : 'COUNTERCLOCKWISE'})\n`;
  P.wedo_motor_reverse = (b) => `motor_reverse(${pp(b.getFieldValue('PORT'))})\n`;
  P.wedo_light_color = (b) => `light_color(${b.getFieldValue('COLOR')})\n`;
  P.wedo_light_rgb = (b, G) => `light_rgb(${v(G, PO.NONE, b, 'R', '0')}, ${v(G, PO.NONE, b, 'G', '0')}, ${v(G, PO.NONE, b, 'B', '0')})\n`;
  P.wedo_light_off = () => 'light_off()\n';
  P.wedo_sound_note = (b, G) => `play_tone(${b.getFieldValue('NOTE')}, ${v(G, PO.NONE, b, 'SECS', '0.5')})\n`;
  P.wedo_sound_tone = (b, G) => `play_tone(${v(G, PO.NONE, b, 'FREQ', '440')}, ${v(G, PO.NONE, b, 'SECS', '0.5')})\n`;
  P.wedo_sound_stop = () => 'stop_sound()\n';
  P.wedo_distance = () => ['distance()', PO.FUNCTION_CALL];
  P.wedo_distance_cmp = (b, G) => [`distance() ${b.getFieldValue('OP') === 'LT' ? '<' : '>'} ${v(G, PO.RELATIONAL, b, 'VAL', '0')}`, PO.RELATIONAL];
  P.wedo_tilt_is = (b) => [`is_tilted(${b.getFieldValue('DIR')})`, PO.FUNCTION_CALL];
  P.wedo_tilt_angle = (b) => [`tilt_angle(${b.getFieldValue('DIR')})`, PO.FUNCTION_CALL];
  P.wedo_button = () => ['is_button_pressed()', PO.FUNCTION_CALL];
  P.wedo_timer = () => ['timer()', PO.FUNCTION_CALL];
  P.wedo_reset_timer = () => 'reset_timer()\n';
  P.wedo_wait = (b, G) => `wait(${v(G, PO.NONE, b, 'SECS', '1')})\n`;
  P.wedo_wait_until = (b, G) => `wait_until(lambda: ${v(G, PO.NONE, b, 'COND', 'False')})\n`;
  P.wedo_forever = (b, G) => `while True:\n${G.statementToCode(b, 'DO') || G.INDENT + 'pass\n'}`;
  P.wedo_stop = () => 'stop_all()\n';
  P.wedo_print = (b, G) => `print(${v(G, PO.NONE, b, 'TEXT', "''")})\n`;

  window.WEDO_GEN = {
    resetSeq() { hatSeq = 0; },
    NOTES, COLORS
  };
})();
