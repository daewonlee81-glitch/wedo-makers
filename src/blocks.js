/* ===== WeDo 2.0 워드블럭 정의 + JavaScript/Python 생성기 ===== */
(function () {
  const JS = javascript.javascriptGenerator, JO = javascript.Order;
  const PY = python.pythonGenerator, PO = python.Order;

  // 글씨가 잘 보이도록: 흰 글씨 블록은 대비 4.5:1 이상, 밝은 블록(이벤트·제어)은 진한 글씨
  const C = {
    event: '#f2b705', motor: '#1f6fd1', light: '#7a4cc8', sound: '#b03aa8',
    sensor: '#0b7fa3', control: '#f08c00', op: '#2b8a3e', variable: '#c8510d', out: '#56657a'
  };
  window.WEDO_COLORS = C;

  const COLOR_KEYS = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'CYAN', 'BLUE', 'PURPLE', 'PINK', 'WHITE'];
  const NOTE_FREQS = ['262', '294', '330', '349', '392', '440', '494', '523'];
  const KEY_IDS = ['space', 'up', 'down', 'left', 'right', 'enter', 'any']
    .concat('abcdefghijklmnopqrstuvwxyz'.split('')).concat('0123456789'.split(''));
  const keyLabel = (k) => (k.length === 1 ? k.toUpperCase() : t('k_' + k));
  const HATS = ['wedo_when_start', 'wedo_when_button', 'wedo_when_distance', 'wedo_when_tilt', 'wedo_when_key'];
  window.WEDO_HATS = HATS;

  // 언어가 바뀔 때마다 다시 정의 (블록 문장·선택지만 바뀌고, 저장 값은 그대로)
  function defineBlocks() {
    const PORTS = [[t('o_port1'), '1'], [t('o_port2'), '2']];
    const MPORTS = PORTS.concat([[t('o_allports'), '0']]);
    const COLORS = COLOR_KEYS.map((k) => [t('c_' + k), k]);
    const NOTES = NOTE_FREQS.map((f) => [t('n_' + f), f]);
    const TILTS = ['UP', 'DOWN', 'LEFT', 'RIGHT'].map((d) => [t('d_' + d), d]);
    const TILTS_ANY = TILTS.concat([[t('d_ANY'), 'ANY']]);
    const KEYS = KEY_IDS.map((k) => [keyLabel(k), k]);
    const OPS = [['<', 'LT'], ['>', 'GT']];
    const NUM = (name) => ({ type: 'input_value', name, check: 'Number' });
    const DD = (name, options) => ({ type: 'field_dropdown', name, options });
    const st = (o) => Object.assign({ previousStatement: null, nextStatement: null }, o);
    window.WEDO_KEYS = KEYS;

    Blockly.common.defineBlocksWithJsonArray([
      { type: 'wedo_when_start', message0: t('b_when_start'), nextStatement: null, colour: C.event },
      { type: 'wedo_when_button', message0: t('b_when_button'), nextStatement: null, colour: C.event },
      { type: 'wedo_when_key', message0: t('b_when_key'), args0: [DD('KEY', KEYS)], nextStatement: null, colour: C.event },
      { type: 'wedo_when_distance', message0: t('b_when_distance'), args0: [DD('OP', OPS), { type: 'field_number', name: 'VAL', value: 30, min: 0, max: 100 }], nextStatement: null, colour: C.event },
      { type: 'wedo_when_tilt', message0: t('b_when_tilt'), args0: [DD('DIR', TILTS_ANY)], nextStatement: null, colour: C.event },
      st({ type: 'wedo_motor_on_for', message0: t('b_motor_on_for'), args0: [DD('PORT', MPORTS), NUM('SECS')], colour: C.motor }),
      st({ type: 'wedo_motor_on', message0: t('b_motor_on'), args0: [DD('PORT', MPORTS)], colour: C.motor }),
      st({ type: 'wedo_motor_off', message0: t('b_motor_off'), args0: [DD('PORT', MPORTS)], colour: C.motor }),
      st({ type: 'wedo_motor_power', message0: t('b_motor_power'), args0: [DD('PORT', MPORTS), NUM('POWER')], colour: C.motor }),
      st({ type: 'wedo_motor_dir', message0: t('b_motor_dir'), args0: [DD('PORT', MPORTS), DD('DIR', [[t('o_cw'), '1'], [t('o_ccw'), '-1']])], colour: C.motor }),
      st({ type: 'wedo_motor_reverse', message0: t('b_motor_reverse'), args0: [DD('PORT', MPORTS)], colour: C.motor }),
      st({ type: 'wedo_light_color', message0: t('b_light_color'), args0: [DD('COLOR', COLORS)], colour: C.light }),
      st({ type: 'wedo_light_rgb', message0: t('b_light_rgb'), args0: [NUM('R'), NUM('G'), NUM('B')], inputsInline: true, colour: C.light }),
      st({ type: 'wedo_light_off', message0: t('b_light_off'), colour: C.light }),
      st({ type: 'wedo_sound_note', message0: t('b_sound_note'), args0: [DD('NOTE', NOTES), NUM('SECS')], colour: C.sound }),
      st({ type: 'wedo_sound_tone', message0: t('b_sound_tone'), args0: [NUM('FREQ'), NUM('SECS')], inputsInline: true, colour: C.sound }),
      st({ type: 'wedo_sound_stop', message0: t('b_sound_stop'), colour: C.sound }),
      { type: 'wedo_distance', message0: t('b_distance'), output: 'Number', colour: C.sensor },
      { type: 'wedo_distance_cmp', message0: t('b_distance_cmp'), args0: [DD('OP', OPS), NUM('VAL')], inputsInline: true, output: 'Boolean', colour: C.sensor },
      { type: 'wedo_tilt_is', message0: t('b_tilt_is'), args0: [DD('DIR', TILTS_ANY)], output: 'Boolean', colour: C.sensor },
      { type: 'wedo_tilt_angle', message0: t('b_tilt_angle'), args0: [DD('DIR', TILTS)], output: 'Number', colour: C.sensor },
      { type: 'wedo_button', message0: t('b_button'), output: 'Boolean', colour: C.sensor },
      { type: 'wedo_key_pressed', message0: t('b_key_pressed'), args0: [DD('KEY', KEYS)], output: 'Boolean', colour: C.sensor },
      { type: 'wedo_timer', message0: t('b_timer'), output: 'Number', colour: C.sensor },
      st({ type: 'wedo_reset_timer', message0: t('b_reset_timer'), colour: C.sensor }),
      st({ type: 'wedo_wait', message0: t('b_wait'), args0: [NUM('SECS')], colour: C.control }),
      st({ type: 'wedo_wait_until', message0: t('b_wait_until'), args0: [{ type: 'input_value', name: 'COND', check: 'Boolean' }], colour: C.control }),
      { type: 'wedo_forever', message0: t('b_forever'), args0: [{ type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }], previousStatement: null, colour: C.control },
      { type: 'wedo_stop', message0: t('b_stop'), previousStatement: null, colour: C.control },
      st({ type: 'wedo_print', message0: t('b_print'), args0: [{ type: 'input_value', name: 'TEXT' }], colour: C.out })
    ]);
    HATS.forEach((type) => {
      const def = Blockly.Blocks[type];
      const init = def.init;
      def.init = function () { init.call(this); this.suppressPrefixSuffix = true; this.hat = 'cap'; };
    });
  }
  defineBlocks();

  // 한글 변수 이름을 그대로 쓰도록 (Python 3 · JavaScript 모두 유니코드 식별자 허용)
  Blockly.Names.prototype.safeName = function (name) {
    if (!name) return Blockly.Msg.UNNAMED_KEY || 'unnamed';
    let s = String(name).trim().replace(/\s+/g, '_').replace(/[^\p{L}\p{N}_]/gu, '_');
    if (/^\p{N}/u.test(s)) s = 'my_' + s;
    return s;
  };

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
    'CLOCKWISE,COUNTERCLOCKWISE,' + COLOR_KEYS.join(','));
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
    defineBlocks, COLOR_KEYS
  };
})();
