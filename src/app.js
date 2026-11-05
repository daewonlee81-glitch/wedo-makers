/* ===== 위두 메이커스 — 앱 UI ===== */
(function () {
  const $ = (s) => document.querySelector(s);
  const C = window.WEDO_COLORS;
  const STORE_KEY = 'wedo2-codinglab-project'; // 이전 버전과 호환 (이름 바꾸지 않음)
  const VERSION = '1.3.0';
  const REPORT_EMAIL = 'robot-league@naver.com';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- 대화상자 (sandbox 에서도 동작하도록 직접 구현) ---------- */
  const modalBg = $('#modalBg'), modal = $('#modal');
  function openModal(html, onOpen) { modal.innerHTML = html; modalBg.classList.add('on'); if (onOpen) onOpen(modal); }
  function closeModal() { modalBg.classList.remove('on'); modal.innerHTML = ''; }
  modalBg.addEventListener('mousedown', (e) => { if (e.target === modalBg) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalBg.classList.contains('on')) closeModal(); });
  const closeBtn = (label) => `<div class="actions"><button class="btn primary" data-close>${esc(label || t('ok'))}</button></div>`;
  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });

  Blockly.dialog.setPrompt((msg, dflt, cb) => {
    openModal(`<h3>${esc(msg)}</h3><input type="text" id="pIn" value="${esc(dflt || '')}">
      <div class="actions"><button class="btn" id="pNo">${t('cancel')}</button><button class="btn primary" id="pOk">${t('ok')}</button></div>`, (m) => {
      const inp = m.querySelector('#pIn'); inp.focus(); inp.select();
      const ok = () => { const v = inp.value; closeModal(); cb(v); };
      m.querySelector('#pOk').onclick = ok;
      m.querySelector('#pNo').onclick = () => { closeModal(); cb(null); };
      inp.onkeydown = (e) => { if (e.key === 'Enter') ok(); };
    });
  });
  Blockly.dialog.setConfirm((msg, cb) => {
    openModal(`<p>${esc(msg)}</p><div class="actions"><button class="btn" id="cNo">${t('cancel')}</button><button class="btn primary" id="cOk">${t('ok')}</button></div>`, (m) => {
      m.querySelector('#cOk').onclick = () => { closeModal(); cb(true); };
      m.querySelector('#cNo').onclick = () => { closeModal(); cb(false); };
    });
  });
  Blockly.dialog.setAlert((msg, cb) => {
    openModal(`<p>${esc(msg)}</p><div class="actions"><button class="btn primary" id="aOk">${t('ok')}</button></div>`, (m) => {
      m.querySelector('#aOk').onclick = () => { closeModal(); if (cb) cb(); };
    });
  });

  let toastT;
  function toast(msg, ms = 2600) {
    const el = $('#toast'); el.textContent = msg; el.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), ms);
  }

  /* ---------- 블록 글씨 가독성 ---------- */
  // 밝은 색 블록(이벤트·제어)은 진한 글씨로, 나머지는 흰 글씨(대비 4.5:1 이상 색상 사용)
  const lum = (hex) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return 0;
    const [r, g, b] = [0, 2, 4].map((i) => { const c = parseInt(m[1].substr(i, 2), 16) / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const origApply = Blockly.BlockSvg.prototype.applyColour;
  Blockly.BlockSvg.prototype.applyColour = function () {
    origApply.call(this);
    const root = this.getSvgRoot && this.getSvgRoot();
    if (root) root.classList.toggle('wm-dark', !this.isShadow() && lum(this.getColour()) > 0.32);
  };

  /* ---------- 테마 ---------- */
  ['controls_if', 'controls_repeat_ext', 'controls_whileUntil'].forEach((type) => {
    const o = Blockly.Blocks[type].init;
    Blockly.Blocks[type].init = function () { o.call(this); this.setStyle('loop_blocks'); };
  });
  const FONT = '"Noto Sans KR", "Noto Sans JP", "Noto Sans SC", system-ui, sans-serif';
  const theme = Blockly.Theme.defineTheme('wedomakers', {
    base: Blockly.Themes.Classic,
    blockStyles: {
      logic_blocks: { colourPrimary: C.op }, math_blocks: { colourPrimary: C.op }, text_blocks: { colourPrimary: C.op },
      loop_blocks: { colourPrimary: C.control }, variable_blocks: { colourPrimary: C.variable }, procedure_blocks: { colourPrimary: '#c2185b' }
    },
    componentStyles: {
      workspaceBackgroundColour: '#f4f6fa', toolboxBackgroundColour: '#ffffff', toolboxForegroundColour: '#1d2433',
      flyoutBackgroundColour: '#e9eef5', flyoutOpacity: 1, scrollbarColour: '#c9d2de', scrollbarOpacity: 0.7,
      insertionMarkerColour: '#000', insertionMarkerOpacity: 0.2
    },
    fontStyle: { family: FONT, weight: '700', size: 13.5 },
    startHats: true
  });

  /* ---------- 도구상자 (언어별) ---------- */
  const n = (v) => ({ shadow: { type: 'math_number', fields: { NUM: v } } });
  const B = (type, inputs, extra) => Object.assign({ kind: 'block', type }, inputs ? { inputs } : {}, extra || {});
  function buildToolbox() {
    return {
      kind: 'categoryToolbox',
      contents: [
        { kind: 'category', name: t('cat_event'), colour: C.event, contents: [
          B('wedo_when_start'), B('wedo_when_button'), B('wedo_when_key'), B('wedo_when_distance'), B('wedo_when_tilt'),
          B('wedo_when_cond', { COND: { block: { type: 'wedo_cam_arm_up', fields: { SIDE: 'RIGHT' } } } })] },
        { kind: 'category', name: t('cat_motor'), colour: C.motor, contents: [
          B('wedo_motor_on_for', { SECS: n(1) }), B('wedo_motor_on'), B('wedo_motor_off'),
          B('wedo_motor_power', { POWER: n(50) }), B('wedo_motor_dir'), B('wedo_motor_reverse')] },
        { kind: 'category', name: t('cat_light'), colour: C.light, contents: [
          B('wedo_light_color'), B('wedo_light_rgb', { R: n(255), G: n(0), B: n(120) }), B('wedo_light_off')] },
        { kind: 'category', name: t('cat_sound'), colour: C.sound, contents: [
          B('wedo_sound_note', { SECS: n(0.5) }), B('wedo_sound_tone', { FREQ: n(440), SECS: n(0.5) }), B('wedo_sound_stop')] },
        { kind: 'category', name: t('cat_sensor'), colour: C.sensor, contents: [
          B('wedo_distance'), B('wedo_distance_cmp', { VAL: n(30) }), B('wedo_tilt_is'), B('wedo_tilt_angle'),
          B('wedo_button'), B('wedo_key_pressed'), B('wedo_timer'), B('wedo_reset_timer')] },
        { kind: 'category', name: t('cat_cam'), colour: C.cam, contents: [
          { kind: 'label', text: '🦴 ' + t('cam_m_pose') },
          B('wedo_cam_person'), B('wedo_cam_arm_up', null, { fields: { SIDE: 'RIGHT' } }), B('wedo_cam_body_pos', null, { fields: { PART: 'RIGHT_WRIST' } }),
          B('wedo_cam_elbow'), B('wedo_cam_tilt'),
          { kind: 'label', text: '✋ ' + t('cam_m_hand') },
          B('wedo_cam_hand_seen'), B('wedo_cam_gesture', null, { fields: { G: 'Thumb_Up' } }), B('wedo_cam_fingers'), B('wedo_cam_hand_pos'),
          { kind: 'label', text: '📦 ' + t('cam_m_object') },
          B('wedo_cam_object_seen', null, { fields: { OBJ: 'cup' } }), B('wedo_cam_object_pos', null, { fields: { OBJ: 'cup' } }), B('wedo_cam_object_count', null, { fields: { OBJ: 'person' } }),
          { kind: 'label', text: '🎨 ' + t('cam_m_color') },
          B('wedo_cam_color_seen'), B('wedo_cam_color_pos'),
          { kind: 'sep', gap: 20 },
          B('wedo_motor_power', { POWER: { block: { type: 'wedo_cam_hand_pos', fields: { AXIS: 'y' } } } }, { fields: { PORT: '1' } }),
          B('wedo_when_cond', { COND: { block: { type: 'wedo_cam_gesture', fields: { G: 'Closed_Fist' } } } })] },
        { kind: 'category', name: t('cat_control'), colour: C.control, contents: [
          B('wedo_wait', { SECS: n(1) }), B('controls_repeat_ext', { TIMES: n(10) }), B('wedo_forever'),
          B('controls_if'), B('controls_if', null, { extraState: { hasElse: true } }),
          B('wedo_wait_until'), B('controls_whileUntil'), B('wedo_stop')] },
        { kind: 'category', name: t('cat_op'), colour: C.op, contents: [
          B('math_number'), B('math_arithmetic', { A: n(1), B: n(1) }), B('math_random_int', { FROM: n(1), TO: n(10) }),
          B('logic_compare', { A: n(0), B: n(0) }), B('logic_operation'), B('logic_negate'), B('logic_boolean'),
          B('math_round', { NUM: n(3.1) }), B('math_modulo', { DIVIDEND: n(10), DIVISOR: n(3) }), B('math_single', { NUM: n(9) }),
          B('text'), B('text_join')] },
        { kind: 'category', name: t('cat_var'), colour: C.variable, custom: 'WEDO_VARIABLE' },
        { kind: 'category', name: t('cat_out'), colour: C.out, contents: [
          B('wedo_print', { TEXT: { shadow: { type: 'text', fields: { TEXT: t('print_default') } } } })] }
      ]
    };
  }

  /* ---------- 작업 공간 (언어를 바꾸면 다시 만든다) ---------- */
  let ws = null;
  let suppressSave = false;
  function applyBlocklyMessages(lang) {
    Object.assign(Blockly.Msg, window.BLOCKLY_MSGS.en, window.BLOCKLY_MSGS[I18N.BLOCKLY_CODE[lang]] || {});
  }
  function createWorkspace(state) {
    if (ws) { suppressSave = true; ws.dispose(); }
    ws = Blockly.inject('blockArea', {
      toolbox: buildToolbox(), theme, renderer: 'zelos', sounds: false, trashcan: false,
      zoom: { controls: false, wheel: true, startScale: 0.8, maxScale: 2, minScale: 0.35, scaleSpeed: 1.15, pinch: true },
      grid: { spacing: 28, length: 2, colour: '#dbe2ec', snap: false },
      move: { scrollbars: true, drag: true, wheel: false }
    });
    ws.addChangeListener(Blockly.Events.disableOrphans);
    // 변수 분류: 숫자를 바로 넣을 수 있게
    ws.registerButtonCallback('WEDO_CREATE_VAR', (btn) => Blockly.Variables.createVariableButtonHandler(btn.getTargetWorkspace(), null, ''));
    ws.registerToolboxCategoryCallback('WEDO_VARIABLE', (w) => {
      const items = [{ kind: 'button', text: t('var_create'), callbackkey: 'WEDO_CREATE_VAR' }];
      const vars = w.getAllVariables().sort((a, b) => a.name.localeCompare(b.name));
      if (!vars.length) { items.push({ kind: 'label', text: t('var_hint') }); return items; }
      const first = { VAR: { id: vars[0].getId() } };
      items.push(
        { kind: 'block', type: 'variables_set', fields: first, inputs: { VALUE: n(0) } },
        { kind: 'block', type: 'math_change', fields: first, inputs: { DELTA: n(1) } },
        { kind: 'block', type: 'variables_set', fields: first, inputs: { VALUE: { block: { type: 'wedo_distance' } } } },
        { kind: 'sep', gap: 24 });
      vars.forEach((v) => items.push({ kind: 'block', type: 'variables_get', fields: { VAR: { id: v.getId() } } }));
      return items;
    });
    ws.addChangeListener((e) => {
      if (e.type === Blockly.Events.VAR_CREATE || e.type === Blockly.Events.VAR_DELETE || e.type === Blockly.Events.VAR_RENAME || e.type === Blockly.Events.FINISHED_LOADING) renderVars();
      if (e.isUiEvent) return;
      refreshCode();
      if (!suppressSave) autosave();
    });
    if (state) {
      try { Blockly.serialization.workspaces.load(state, ws); } catch (e) { toast(e.message); }
    }
    suppressSave = false;
    return ws;
  }
  $('#zIn').onclick = () => ws.zoomCenter(1);
  $('#zOut').onclick = () => ws.zoomCenter(-1);
  $('#zFit').onclick = () => { ws.zoomToFit(); if (ws.scale > 1) ws.setScale(1); ws.scrollCenter(); };

  /* ---------- 예제 ---------- */
  const chain = (...bs) => { for (let i = bs.length - 2; i >= 0; i--) bs[i].next = { block: bs[i + 1] }; return bs[0]; };
  function example() {
    const ifElse = {
      type: 'controls_if', extraState: { hasElse: true }, inputs: {
        IF0: { block: { type: 'wedo_distance_cmp', fields: { OP: 'LT' }, inputs: { VAL: n(30) } } },
        DO0: { block: chain({ type: 'wedo_light_color', fields: { COLOR: 'RED' } }, { type: 'wedo_motor_on_for', fields: { PORT: '1' }, inputs: { SECS: n(1) } }) },
        ELSE: { block: { type: 'wedo_light_color', fields: { COLOR: 'GREEN' } } }
      }
    };
    return { blocks: { languageVersion: 0, blocks: [
      chain({ type: 'wedo_when_start', x: 40, y: 40 }, { type: 'wedo_light_color', fields: { COLOR: 'GREEN' } },
        { type: 'wedo_sound_note', fields: { NOTE: '523' }, inputs: { SECS: n(0.2) } }, { type: 'wedo_forever', inputs: { DO: { block: ifElse } } }),
      chain({ type: 'wedo_when_button', x: 520, y: 40 },
        { type: 'wedo_print', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: t('ex_button_msg') } } } } },
        { type: 'wedo_motor_reverse', fields: { PORT: '0' } })
    ] } };
  }

  /* ---------- 저장/불러오기 ---------- */
  function loadProject(obj, name) {
    createWorkspace(obj.workspace || obj);
    if (name || obj.name) $('#projName').value = name || obj.name;
    setTimeout(() => $('#zFit').onclick(), 30);
    refreshCode(); renderVars();
    return true;
  }
  function currentProject() {
    return { app: 'wedomakers', version: 1, name: $('#projName').value, workspace: Blockly.serialization.workspaces.save(ws) };
  }
  function autosave() { try { localStorage.setItem(STORE_KEY, JSON.stringify(currentProject())); } catch (e) { /* 저장소 없음 */ } }

  function safeName(s) { return (s || 'wedo').replace(/[\\/:*?"<>|]+/g, '_').trim() || 'wedo'; }
  let dlCap;
  async function hostDownloads() {
    if (dlCap !== undefined) return dlCap;
    try { dlCap = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { dlCap = null; }
    return dlCap;
  }
  async function download(filename, text, mime) {
    const cap = await hostDownloads();
    if (cap) {
      try { await cap.save({ filename, data: text }); return; }
      catch (e) {
        try { await cap.save({ filename, data: new Blob([text], { type: mime || 'text/plain' }) }); return; }
        catch (e2) { toast(t('save_blocked')); return; }
      }
    }
    try {
      const blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast(`${t('saved_as')} ${filename}`);
    } catch (e) { toast(t('save_blocked')); }
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast(t('copied')); }
    catch (e) {
      openModal(`<p class="muted">${t('copy_manual')}</p><textarea style="width:100%;height:300px;font-family:monospace">${esc(text)}</textarea>${closeBtn(t('close'))}`);
    }
  }
  $('#btnSave').onclick = () => download(safeName($('#projName').value) + '.wedo.json', JSON.stringify(currentProject(), null, 2), 'application/json');
  $('#btnOpen').onclick = () => $('#fileIn').click();
  $('#fileIn').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { const obj = JSON.parse(await f.text()); loadProject(obj, obj.name || f.name.replace(/\.wedo\.json$|\.json$/, '')); toast(t('opened')); }
    catch (err) { toast(t('open_fail')); }
    e.target.value = '';
  };
  $('#btnNew').onclick = () => Blockly.dialog.confirm(t('confirm_new'), (ok) => {
    if (!ok) return;
    loadProject({ blocks: { languageVersion: 0, blocks: [{ type: 'wedo_when_start', x: 40, y: 40 }] } }, t('proj_new'));
    autosave();
  });
  $('#projName').addEventListener('change', autosave);

  /* ---------- Python 코드 ---------- */
  const PY_KW = new Set('False None True and as break continue def elif else for from global if import in is lambda not or pass return while with'.split(' '));
  const PY_BI = new Set('print range int float str len abs round min max random math'.split(' '));
  const PY_CONST = new Set(['ALL', 'UP', 'DOWN', 'LEFT', 'RIGHT', 'ANY', 'CLOCKWISE', 'COUNTERCLOCKWISE'].concat(window.WEDO_GEN.COLOR_KEYS));
  function highlightPy(src) {
    const re = /(#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(@[\w.]+)|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)\b(\s*\()?/g;
    return src.split('\n').map((line) => {
      let out = '', last = 0, m;
      re.lastIndex = 0;
      while ((m = re.exec(line))) {
        out += esc(line.slice(last, m.index));
        if (m[1]) out += `<span class="tk-c">${esc(m[1])}</span>`;
        else if (m[2]) out += `<span class="tk-s">${esc(m[2])}</span>`;
        else if (m[3]) out += `<span class="tk-d">${esc(m[3])}</span>`;
        else if (m[4]) out += `<span class="tk-n">${m[4]}</span>`;
        else if (m[5]) {
          const w = m[5];
          const cls = PY_KW.has(w) ? 'tk-k' : PY_BI.has(w) ? 'tk-b' : PY_CONST.has(w) ? 'tk-cn' : m[6] ? 'tk-f' : '';
          out += cls ? `<span class="${cls}">${w}</span>` : w;
          if (m[6]) out += esc(m[6]);
        }
        last = re.lastIndex;
      }
      out += esc(line.slice(last));
      return `<span class="l">${out || ' '}</span>`;
    }).join('');
  }
  function genPython() {
    window.WEDO_GEN.resetSeq();
    let body = python.pythonGenerator.workspaceToCode(ws).replace(/\n{3,}/g, '\n\n').trim();
    const name = $('#projName').value.replace(/\n/g, ' ');
    const head = `# ${name}\n# ${t('py_head1')}\n# ${t('py_head2')}\n\nfrom wedo2 import *\n`;
    if (!body) body = '# ' + t('py_empty');
    return `${head}\n${body}\n\nrun()\n`;
  }
  function genJS() {
    const G = javascript.javascriptGenerator;
    G.STATEMENT_PREFIX = 'W.hl(%1, __t);\n';
    G.INFINITE_LOOP_TRAP = 'await W.tick();\n';
    G.addReservedWords('W,__t');
    try {
      let code = G.workspaceToCode(ws);
      // 변수 모니터용 읽기 함수
      const vs = ws.getAllVariables();
      if (vs.length) {
        G.init(ws);
        const pairs = vs.map((v) => `${JSON.stringify(v.name)}: ${G.nameDB_.getName(v.getId(), Blockly.Names.NameType.VARIABLE)}`);
        code += `\nW.vars = () => ({ ${pairs.join(', ')} });\n`;
      }
      return code;
    } finally { G.STATEMENT_PREFIX = null; G.INFINITE_LOOP_TRAP = null; if (G.nameDB_) G.nameDB_.reset(); G.isInitialized = false; }
  }
  let pySrc = '', genT;
  function refreshCode() {
    clearTimeout(genT);
    genT = setTimeout(() => {
      if (!ws) return;
      try { pySrc = genPython(); $('#pyCode').innerHTML = highlightPy(pySrc); }
      catch (e) { $('#pyCode').textContent = `# ${t('code_err')}: ${e.message}`; }
    }, 80);
  }
  $('#projName').addEventListener('input', refreshCode);
  $('#btnCopyPy').onclick = () => copy(pySrc);
  $('#btnSavePy').onclick = () => download(safeName($('#projName').value).replace(/\s+/g, '_') + '.py', pySrc);
  $('#btnPyHelp').onclick = () => openModal(`
    <h3>${t('pyhelp_title')}</h3>${t('pyhelp_body')}${t('pycam_note')}
    <div class="actions" style="justify-content:flex-start"><button class="btn primary" id="dlLib">${t('lib_save')}</button><button class="btn" id="cpLib">${t('lib_copy')}</button></div>
    <h3 style="margin-top:18px">${t('funcs')}</h3>
    <pre><code>motor_on(1) / motor_off(ALL) / motor_on_for(1, 2)
motor_power(1, 50) / motor_direction(1, CLOCKWISE) / motor_reverse(2)
light_color(RED) / light_rgb(255, 0, 120) / light_off()
play_tone(440, 0.5) / stop_sound()
distance()  → 0~100     is_tilted(UP) / tilt_angle(LEFT)
is_button_pressed()     is_key_pressed('space')
timer() / reset_timer()
wait(1) / wait_until(lambda: distance() &lt; 30) / stop_all()

is_person_seen() / is_arm_up(RIGHT) / body_x('NOSE') / elbow_angle(LEFT) / shoulder_tilt()
is_hand_seen() / is_gesture('Thumb_Up') / finger_count() / hand_x() / hand_y()
is_object_seen('cup') / object_x('cup') / object_count('person')
is_color_seen('red') / color_x('red') / color_size('red')

@on_start  @on_button  @on_key('up')  @when(lambda: ...)   →  run()</code></pre>
    ${closeBtn(t('close'))}`, (m) => {
    m.querySelector('#dlLib').onclick = () => download('wedo2.py', window.WEDO2_PY);
    m.querySelector('#cpLib').onclick = () => copy(window.WEDO2_PY);
  });
  $('#btnHelp').onclick = () => openModal(`<h3>${t('help_title')}</h3>${t('help_body')}<ol start="7">${t('cam_help')}</ol>
    <p class="muted">${t('report_line')} <b>${REPORT_EMAIL}</b> · v${VERSION}</p>${closeBtn()}`);

  /* ---------- 오류 신고 ---------- */
  function diagnostics() {
    const lines = [...document.querySelectorAll('#logs .log')].slice(-40).map((d) => d.textContent.replace(/^(\d\d:\d\d:\d\d)/, '$1 '));
    return [
      `WeDo Makers v${VERSION}`,
      `Lang: ${I18N.lang}`,
      `Browser: ${navigator.userAgent}`,
      `Bluetooth: ${'bluetooth' in navigator ? 'yes' : 'no'} · secure: ${window.isSecureContext}`,
      `Hub: ${hub.connected ? hub.state.name + ' · ports ' + JSON.stringify(hub.state.ports) + ' · battery ' + hub.state.battery : 'not connected'}`,
      `Page: ${location.href.split('#')[0]}`,
      `Camera: ${cam.on ? 'on' : 'off'} · ${['pose', 'hand', 'object', 'color'].map((m) => m + '=' + cam.status(m) + (cam.errors[m] ? '(' + cam.errors[m] + ')' : '')).join(' ')}`,
      '', '--- console ---', ...lines
    ].join('\n');
  }
  function openReport() {
    const subject = encodeURIComponent(`[WeDo Makers] ${t('report_subject')}`);
    const diag = diagnostics();
    const body = encodeURIComponent(`${t('report_body_hint')}\n\n\n${diag}`.slice(0, 1800));
    openModal(`<h3>${t('report_title')}</h3>
      <p>${t('report_desc')}</p>
      <p class="mailline"><b>${REPORT_EMAIL}</b></p>
      <div class="actions" style="justify-content:flex-start;flex-wrap:wrap">
        <a class="btn primary" href="mailto:${REPORT_EMAIL}?subject=${subject}&body=${body}">${t('report_mail')}</a>
        <button class="btn" id="cpMail">${t('report_copy_mail')}</button>
        <button class="btn" id="cpDiag">${t('report_copy_diag')}</button>
      </div>
      <p class="muted" style="margin-top:12px">${t('report_diag_note')}</p>
      <pre style="max-height:180px">${esc(diag)}</pre>${closeBtn(t('close'))}`, (m) => {
      m.querySelector('#cpMail').onclick = () => copy(REPORT_EMAIL);
      m.querySelector('#cpDiag').onclick = () => copy(diag);
    });
  }
  $('#btnReport').onclick = openReport;

  /* ---------- 콘솔 ---------- */
  let errCount = 0;
  const logs = $('#logs');
  function log(msg, kind) {
    const d = document.createElement('div');
    d.className = 'log ' + (kind || '');
    d.innerHTML = `<span class="t">${new Date().toTimeString().slice(0, 8)}</span>${esc(msg)}`;
    if (kind === 'err') {
      const a = document.createElement('button'); a.className = 'linkbtn'; a.textContent = t('report_btn'); a.onclick = openReport; d.appendChild(a);
    }
    logs.appendChild(d);
    while (logs.children.length > 500) logs.firstChild.remove();
    const pane = $('#consolePane'); pane.scrollTop = pane.scrollHeight;
    if (kind === 'err' && !pane.classList.contains('on')) { errCount++; $('#errCnt').textContent = errCount; $('#errCnt').hidden = false; }
    if (!kind && !pane.classList.contains('on')) showTab('consolePane');
  }
  $('#btnClear').onclick = () => { logs.innerHTML = ''; };
  function showTab(id) {
    document.querySelectorAll('.tab').forEach((x) => x.classList.toggle('on', x.dataset.tab === id));
    document.querySelectorAll('.pane').forEach((p) => p.classList.toggle('on', p.id === id));
    if (id === 'consolePane') { errCount = 0; $('#errCnt').hidden = true; }
  }
  document.querySelectorAll('.tab').forEach((x) => (x.onclick = () => showTab(x.dataset.tab)));

  /* ---------- 소리 (가상 허브) ---------- */
  let actx = null;
  function ensureAudio() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { actx = null; } }
  function beep(freq, ms) {
    if (!actx) return;
    try {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = 'square'; o.frequency.value = freq; g.gain.value = 0.05;
      o.connect(g).connect(actx.destination);
      const tm = actx.currentTime; o.start(tm); g.gain.setValueAtTime(0.05, tm + ms / 1000 - 0.02); g.gain.linearRampToValueAtTime(0, tm + ms / 1000); o.stop(tm + ms / 1000 + 0.01);
    } catch (e) { /* 무시 */ }
  }

  /* ---------- 허브 + 런타임 ---------- */
  const hub = new WeDo.Hub();
  const highlighted = new Set();
  const ui = {
    log, beep, t,
    highlight(id, on) {
      if (on) highlighted.add(id); else highlighted.delete(id);
      try { ws.highlightBlock(id, on); } catch (e) { /* 블록이 지워짐 */ }
    },
    clearHighlights() { highlighted.forEach((id) => { try { ws.highlightBlock(id, false); } catch (e) {} }); highlighted.clear(); }
  };
  const rt = new WeDo.Runtime(hub, ui);
  const cam = new WeCam.Camera();
  rt.cam = cam;
  rt.addEventListener('state', () => {
    document.body.classList.toggle('running', rt.running);
    $('#btnStop').disabled = !rt.running;
    renderVars();
  });

  // 프로그램에 들어 있는 카메라 블록으로 필요한 기능을 정한다
  function neededCamModes() {
    const set = new Set();
    ws.getAllBlocks(false).forEach((b) => { if (b.isEnabled() && window.WEDO_CAM.CAM_MODE[b.type]) set.add(window.WEDO_CAM.CAM_MODE[b.type]); });
    return [...set];
  }
  async function prepareCamera(modes) {
    if (!modes.length) return true;
    showCamWin(true);
    const sup = WeCam.Camera.support();
    if (sup !== 'ok') { log(t(sup === 'insecure' ? 'cam_insecure' : 'cam_unsupported'), 'err'); return false; }
    try { await cam.start(); } catch (e) { log(t('cam_denied') + ` (${e.name || e})`, 'err'); return false; }
    const todo = modes.filter((m) => !cam.isReady(m));
    if (todo.length) log(t('cam_wait'), 'sys');
    await Promise.all(modes.map((m) => cam.enable(m, true)));
    const failed = modes.filter((m) => cam.errors[m]);
    if (failed.length) { failed.forEach((m) => log(`${t('cam_err_model')} — ${t('cam_m_' + m)}: ${cam.errors[m]}`, 'err')); return false; }
    if (todo.length) log(t('cam_ready_log'), 'sys');
    return true;
  }
  let starting = false;
  $('#btnRun').onclick = async () => {
    if (starting) return;
    ensureAudio();
    const code = genJS();
    const modes = neededCamModes();
    if (modes.length) {
      starting = true;
      try { if (!(await prepareCamera(modes))) return; } finally { starting = false; }
    }
    if (!hub.connected) toast(t('run_sim_toast'), 2000);
    log(`▶ "${$('#projName').value}" ${t('run_log')}` + (hub.connected ? '' : t('run_sim_suffix')), 'sys');
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); // 스페이스가 버튼을 누르지 않도록
    rt.run(code);
  };
  $('#btnStop').onclick = () => rt.stop('user');

  const btnConnect = $('#btnConnect');
  btnConnect.onclick = async () => {
    if (hub.connected) { rt.stop('user'); hub.disconnect(); return; }
    const sup = WeDo.Hub.support();
    if (sup !== 'ok') { showBtHelp(sup); return; }
    $('#connLabel').textContent = t('btn_connecting');
    try {
      await hub.connect();
      log(`${t('connected_log')}: ${hub.state.name}`, 'sys'); toast(t('connected_toast'));
    } catch (e) {
      if (e && e.name === 'NotFoundError') { /* 사용자가 취소 */ }
      else if (e && (e.name === 'SecurityError' || /permission|policy|allowed/i.test(e.message))) showBtHelp('blocked', e);
      else { log(`${t('connect_fail')} (${e && e.message ? e.message : e})`, 'err'); toast(t('connect_fail')); }
    }
    renderHub();
  };
  hub.addEventListener('disconnected', () => { rt.stop('user'); log(t('disconnected'), 'warn'); toast(t('disconnected')); });
  function showBtHelp(kind, e) {
    openModal(`<h3>${t('bt_title')}</h3><p>${t('bt_' + kind)}</p><ul>${t('bt_tips')}</ul>
      ${e ? `<p class="muted">(${esc(e.name)}: ${esc(e.message)})</p>` : ''}${closeBtn()}`);
  }

  /* ---------- 허브 패널 ---------- */
  const GEAR = '<svg class="gear" viewBox="0 0 24 24" fill="currentColor"><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.6 7.6 0 0 0-1.7-1L15 3.3h-4l-.4 2.6a7.6 7.6 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.6 7.6 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7.6 7.6 0 0 0 1.7-1l2.5 1 2-3.5zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>';
  const DEV_KEY = { 1: 'dev_motor', 34: 'dev_tilt', 35: 'dev_dist' };
  function renderPort(p) {
    const s = hub.state, type = s.ports[p], el = $('#port' + p);
    const name = hub.connected ? (type ? (DEV_KEY[type] ? t(DEV_KEY[type]) : `${t('dev_unknown')} #${type}`) : t('dev_empty')) : t('dev_motor_sim');
    const key = I18N.lang + p + name;
    if (el.dataset.key !== key) {
      el.dataset.key = key;
      el.innerHTML = `<h4>${t('port')} ${p} <span class="muted">${esc(name)}</span></h4><div class="motor-vis">${GEAR}<div><div class="val" data-pw>0</div><div class="meter"><i data-bar></i></div></div></div>`;
    }
    const pw = s.motors[p].power;
    const pct = Math.round(Math.abs(pw) === 127 ? 0 : Math.abs(pw));
    el.querySelector('[data-pw]').textContent = pw === 0 || Math.abs(pw) === 127 ? t('stopped') : `${pw > 0 ? '↻' : '↺'} ${pct}%`;
    el.querySelector('[data-bar]').style.width = pct + '%';
    const g = el.querySelector('.gear');
    g.classList.toggle('spin', pw !== 0 && Math.abs(pw) !== 127);
    g.classList.toggle('rev', pw < 0);
    g.style.setProperty('--spd', (2.2 - pct / 60).toFixed(2) + 's');
  }
  function renderHub() {
    const s = hub.state, c = hub.connected;
    btnConnect.classList.toggle('on', c);
    $('#connLabel').textContent = c ? t('btn_connected') : t('btn_connect');
    $('#modeChip').className = 'chip ' + (c ? 'real' : 'sim');
    $('#modeChip').textContent = c ? t('chip_real') : t('chip_sim');
    $('#hubName').innerHTML = c ? `<b>${esc(s.name)}</b>` : esc(t('hub_none'));
    $('#battery').textContent = c && s.battery != null ? `🔋 ${s.battery}%` : '';
    renderPort(1); renderPort(2);
    const [r, g, b] = s.led, lit = r || g || b;
    $('#ledVis').style.background = lit ? `rgb(${r},${g},${b})` : '#20242c';
    $('#ledVis').style.boxShadow = lit ? `0 0 14px rgba(${r},${g},${b},.75)` : 'none';
    $('#ledTxt').textContent = lit ? `RGB ${r}, ${g}, ${b}` : t('off');
    $('#toneTxt').textContent = s.tone ? `♪ ${s.tone} Hz` : t('no_sound');
    $('#btnTxt').textContent = s.button ? t('pressed') : t('released');
    $('#simBtn').classList.toggle('on', !!s.button);
    $('#simBtn').disabled = c; $('#simBtn').textContent = c ? t('press_real_btn') : t('hold_btn');
    $('#distTxt').textContent = Math.round(s.distance);
    const dSlider = $('#distSlider');
    dSlider.disabled = c; if (c || document.activeElement !== dSlider) dSlider.value = s.distance;
    const hasDist = !c || Object.values(s.ports).includes(WeDo.DEV.DISTANCE);
    $('#distNote').textContent = c ? (hasDist ? t('dist_real') : t('dist_missing')) : t('dist_sim');
    const dir = ['UP', 'DOWN', 'LEFT', 'RIGHT'].find((d) => hub.tiltAngle(d) >= 15);
    $('#tiltTxt').textContent = dir ? `${t('d_' + dir)} ${hub.tiltAngle(dir)}°` : t('level');
    document.querySelectorAll('#tiltPad button').forEach((bt) => {
      bt.disabled = c;
      bt.classList.toggle('on', (bt.dataset.d === 'NONE' && !dir) || bt.dataset.d === dir);
    });
  }
  let rq = false;
  hub.addEventListener('change', () => { if (!rq) { rq = true; requestAnimationFrame(() => { rq = false; renderHub(); }); } });

  $('#distSlider').oninput = (e) => { if (!hub.connected) { hub.state.distance = Number(e.target.value); hub.emit(); } };
  document.querySelectorAll('#tiltPad button').forEach((bt) => (bt.onclick = () => { if (!hub.connected) hub.simSetTilt(bt.dataset.d, 30); }));
  const sb = $('#simBtn');
  const press = (v) => (e) => { if (hub.connected) return; e.preventDefault(); hub.state.button = v; hub.emit(); };
  sb.addEventListener('pointerdown', press(true));
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => sb.addEventListener(ev, press(false)));

  /* ---------- AI 카메라 창 ---------- */
  const camWin = $('#camWin');
  cam.attach($('#camCanvas'));
  function showCamWin(on) {
    camWin.hidden = !on;
    $('#btnCam').classList.toggle('on', on);
    try { localStorage.setItem('wedomakers-cam', on ? '1' : ''); } catch (e) {}
  }
  $('#btnCam').onclick = () => showCamWin(camWin.hidden);
  $('#camClose').onclick = () => { showCamWin(false); };
  $('#camPower').onclick = async () => {
    if (cam.on) { cam.stop(); return; }
    const sup = WeCam.Camera.support();
    if (sup !== 'ok') { toast(t(sup === 'insecure' ? 'cam_insecure' : 'cam_unsupported')); return; }
    try { await cam.start(); } catch (e) { toast(t('cam_denied')); log(t('cam_denied') + ` (${e.name || e})`, 'err'); }
  };
  camWin.querySelectorAll('[data-mode]').forEach((cb) => {
    cb.onchange = async () => {
      if (cb.checked && !cam.on) { try { await cam.start(); } catch (e) { cb.checked = false; toast(t('cam_denied')); return; } }
      cam.enable(cb.dataset.mode, cb.checked);
    };
  });
  $('#camSize').onclick = () => {
    const sizes = ['s', 'm', 'l'];
    const cur = sizes.find((x) => camWin.classList.contains('sz-' + x)) || 'm';
    const next = sizes[(sizes.indexOf(cur) + 1) % 3];
    sizes.forEach((x) => camWin.classList.toggle('sz-' + x, x === next));
    try { localStorage.setItem('wedomakers-cam-size', next); } catch (e) {}
  };
  try { const sz = localStorage.getItem('wedomakers-cam-size') || 'm'; camWin.classList.add('sz-' + sz); } catch (e) { camWin.classList.add('sz-m'); }
  // 창 끌어서 옮기기
  (function () {
    const head = $('#camHead'); let sx, sy, ox, oy, drag = false;
    head.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button,select,input')) return;
      drag = true; head.setPointerCapture(e.pointerId);
      const r = camWin.getBoundingClientRect(), pr = $('#blockWrap').getBoundingClientRect();
      sx = e.clientX; sy = e.clientY; ox = r.left - pr.left; oy = r.top - pr.top;
    });
    head.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const pr = $('#blockWrap').getBoundingClientRect(), r = camWin.getBoundingClientRect();
      const x = Math.max(0, Math.min(pr.width - r.width, ox + e.clientX - sx));
      const y = Math.max(0, Math.min(pr.height - 40, oy + e.clientY - sy));
      camWin.style.left = x + 'px'; camWin.style.top = y + 'px'; camWin.style.bottom = 'auto'; camWin.style.right = 'auto';
    });
    head.addEventListener('pointerup', () => { drag = false; });
  })();
  const yes = (b) => (b ? '✓ ' + t('cam_seen') : '– ' + t('cam_notseen'));
  function renderCam() {
    $('#camPower').textContent = cam.on ? t('cam_stop') : t('cam_start');
    $('#camPower').classList.toggle('primary', !cam.on);
    camWin.classList.toggle('live', cam.on);
    camWin.querySelectorAll('[data-mode]').forEach((cb) => {
      const m = cb.dataset.mode, st = cam.status(m);
      cb.checked = !!cam.want[m];
      cb.parentElement.dataset.st = st;
      cb.parentElement.title = st === 'error' ? cam.errors[m] : '';
    });
    const busy = ['pose', 'hand', 'object'].some((m) => cam.status(m) === 'loading');
    $('#camStatus').textContent = !cam.on ? t('cam_off') : busy ? t('cam_loading') : `${cam.fps} fps`;
  }
  function renderCamRead() {
    if (!cam.on) { $('#camRead').innerHTML = `<span class="muted">${esc(t('cam_hint'))}</span>`; return; }
    const out = [];
    if (cam.want.pose) out.push(`<span><b>${t('cam_person')}</b> ${yes(cam.personSeen())}</span>`);
    if (cam.want.hand) out.push(`<span><b>${t('cam_m_hand')}</b> ${cam.hand ? esc(t('g_' + cam.hand.gesture)) : '–'}</span>`, `<span><b>${t('cam_fingers')}</b> ${cam.hand ? cam.fingerCount() : '–'}</span>`);
    if (cam.want.object) { const names = [...new Set(cam.objects.map((o) => window.CAM_LABEL(o.name)))]; out.push(`<span><b>${t('cam_m_object')}</b> ${names.length ? esc(names.join(', ')) : '–'}</span>`); }
    if (cam.want.color) { const cs = Object.keys(cam.colors).filter((k) => cam.colors[k].seen).map((k) => t('cc_' + k)); out.push(`<span><b>${t('cam_m_color')}</b> ${cs.length ? esc(cs.join(', ')) : '–'}</span>`); }
    const html = out.join('');
    if ($('#camRead').innerHTML !== html) $('#camRead').innerHTML = html;
  }
  cam.addEventListener('change', renderCam);
  setInterval(() => { if (cam.on && !camWin.hidden) renderCamRead(); }, 200);
  try { if (localStorage.getItem('wedomakers-cam')) showCamWin(true); } catch (e) {}

  /* ---------- 변수 모니터 (블록 화면 위에 떠 있는 창) ---------- */
  const vm = $('#varMon');
  function fmt(v) {
    if (v === undefined || v === null) return '–';
    if (typeof v === 'number') return String(Math.round(v * 1000) / 1000);
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    return String(v);
  }
  function renderVars() {
    if (!ws) return;
    const names = ws.getAllVariables().map((v) => v.name);
    vm.hidden = names.length === 0;
    if (!names.length) return;
    let vals = {};
    try { vals = rt.vars ? rt.vars() : {}; } catch (e) { vals = {}; }
    const html = names.map((nm) => `<div class="vm-row"><span class="vm-name">${esc(nm)}</span><span class="vm-val">${esc(fmt(vals[nm]))}</span></div>`).join('');
    const list = $('#vmList');
    if (list.innerHTML !== html) list.innerHTML = html;
  }
  setInterval(() => { if (rt.running) renderVars(); }, 100);
  $('#vmFold').onclick = () => {
    vm.classList.toggle('folded');
    $('#vmFold').textContent = vm.classList.contains('folded') ? '+' : '−';
    try { localStorage.setItem('wedomakers-vm-folded', vm.classList.contains('folded') ? '1' : ''); } catch (e) {}
  };
  try { if (localStorage.getItem('wedomakers-vm-folded')) { vm.classList.add('folded'); $('#vmFold').textContent = '+'; } } catch (e) {}

  /* ---------- PC 키보드 → 신호 ---------- */
  function keyName(e) {
    const c = e.code || '';
    if (c === 'Space') return 'space';
    if (c === 'Enter' || c === 'NumpadEnter') return 'enter';
    if (c.startsWith('Arrow')) return c.slice(5).toLowerCase();
    if (/^Key[A-Z]$/.test(c)) return c.slice(3).toLowerCase();
    if (/^(Digit|Numpad)[0-9]$/.test(c)) return c.slice(-1);
    return null;
  }
  const typing = (el) => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) && el.type !== 'range';
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || modalBg.classList.contains('on') || typing(e.target) || document.querySelector('.blocklyWidgetDiv .blocklyHtmlInput')) return;
    const k = keyName(e); if (!k) return;
    rt.keyDown(k);
    if (rt.running) { e.preventDefault(); e.stopPropagation(); } // 실행 중에는 스크롤·블록 삭제 등 기본 동작 막기
  }, true);
  window.addEventListener('keyup', (e) => {
    const k = keyName(e); if (!k) return;
    rt.keyUp(k);
    if (rt.running && !typing(e.target)) e.preventDefault();
  }, true);
  window.addEventListener('blur', () => rt.clearKeys());
  function renderKeys() {
    const label = (k) => (Object.fromEntries(window.WEDO_KEYS)[k] || k);
    const down = [...rt.keys].map(label);
    $('#keyTxt').textContent = down.length ? down.join(' + ') : (rt.lastKey ? `${t('last')}: ${label(rt.lastKey)}` : t('none'));
    $('#keyVis').classList.toggle('on', down.length > 0);
  }
  rt.addEventListener('keys', renderKeys);

  // 단축키: Ctrl+Enter 실행, Esc 정지
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); $('#btnRun').click(); }
    else if (e.key === 'Escape' && rt.running && !modalBg.classList.contains('on')) rt.stop('user');
  });

  /* ---------- 창 크기 조절: 좌우(블록 | 오른쪽 패널) + 위아래(Python | 허브·콘솔) ---------- */
  function makeSplitter(el, onMove, storeKey, cssVar) {
    let drag = false;
    try { const v = localStorage.getItem(storeKey); if (v) document.documentElement.style.setProperty(cssVar, v); } catch (e) {}
    el.addEventListener('pointerdown', (e) => { drag = true; el.classList.add('drag'); document.body.classList.add('resizing'); el.setPointerCapture(e.pointerId); e.preventDefault(); });
    el.addEventListener('pointermove', (e) => { if (drag) { onMove(e); if (ws) Blockly.svgResize(ws); } });
    const end = () => {
      if (!drag) return;
      drag = false; el.classList.remove('drag'); document.body.classList.remove('resizing');
      try { localStorage.setItem(storeKey, getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()); } catch (e) {}
    };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    el.addEventListener('dblclick', () => { document.documentElement.style.removeProperty(cssVar); try { localStorage.removeItem(storeKey); } catch (e) {} if (ws) Blockly.svgResize(ws); });
  }
  makeSplitter($('#splitter'), (e) => {
    const w = Math.max(300, Math.min(window.innerWidth * 0.7, window.innerWidth - e.clientX));
    document.documentElement.style.setProperty('--side-w', w + 'px');
  }, 'wedo2-side-w', '--side-w');
  makeSplitter($('#vsplit'), (e) => {
    const box = $('aside').getBoundingClientRect();
    const h = Math.max(90, Math.min(box.height - 120, e.clientY - box.top));
    document.documentElement.style.setProperty('--py-h', Math.round(h / box.height * 1000) / 10 + '%');
  }, 'wedomakers-py-h', '--py-h');
  window.addEventListener('resize', () => ws && Blockly.svgResize(ws));

  /* ---------- 언어 ---------- */
  const langSel = $('#langSel');
  langSel.innerHTML = I18N.LANGS.map(([code, name]) => `<option value="${code}">${name}</option>`).join('');
  function applyStaticText() {
    document.documentElement.lang = I18N.lang === 'zh' ? 'zh-Hans' : I18N.lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = t(el.dataset.i18nTitle); el.setAttribute('aria-label', el.title); });
    document.title = `${t('app_name')} — ${t('app_sub')}`;
    langSel.value = I18N.lang;
  }
  function setLanguage(lang, first) {
    const state = ws ? Blockly.serialization.workspaces.save(ws) : null;
    I18N.set(lang);
    applyBlocklyMessages(lang);
    window.WEDO_GEN.defineBlocks();
    applyStaticText();
    if (!first) {
      // 프로젝트 이름이 기본 이름(예제·새 프로젝트)이면 새 언어로 바꿔 준다
      const nm = $('#projName').value;
      ['proj_example', 'proj_new', 'proj_default'].forEach((k) => { if (I18N.all(k).includes(nm)) $('#projName').value = t(k); });
      createWorkspace(state);
      refreshCode(); renderHub(); renderKeys(); renderVars(); renderCam(); renderCamRead(); autosave();
    }
  }
  langSel.onchange = () => { rt.stop('user'); setLanguage(langSel.value); };

  /* ---------- 시작 ---------- */
  setLanguage(I18N.lang, true);
  (function initLoad() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { saved = null; }
    if (saved && saved.workspace) loadProject(saved);
    else loadProject(example(), t('proj_example'));
  })();
  renderHub(); renderKeys(); renderVars(); renderCam(); renderCamRead();

  window.__wedo = { get ws() { return ws; }, hub, rt, genJS, genPython, setLanguage };
  log(t('ready'), 'sys');
})();
