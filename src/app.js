/* ===== 앱 UI ===== */
(function () {
  const $ = (s) => document.querySelector(s);
  const C = window.WEDO_COLORS;
  const STORE_KEY = 'wedo2-codinglab-project';

  /* ---------- 대화상자 (sandbox 에서도 동작하도록 직접 구현) ---------- */
  const modalBg = $('#modalBg'), modal = $('#modal');
  function openModal(html, onOpen) {
    modal.innerHTML = html; modalBg.classList.add('on');
    if (onOpen) onOpen(modal);
  }
  function closeModal() { modalBg.classList.remove('on'); modal.innerHTML = ''; }
  modalBg.addEventListener('mousedown', (e) => { if (e.target === modalBg) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalBg.classList.contains('on')) closeModal(); });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  Blockly.dialog.setPrompt((msg, dflt, cb) => {
    openModal(`<h3>${esc(msg)}</h3><input type="text" id="pIn" value="${esc(dflt || '')}">
      <div class="actions"><button class="btn" id="pNo">취소</button><button class="btn primary" id="pOk">확인</button></div>`, (m) => {
      const inp = m.querySelector('#pIn'); inp.focus(); inp.select();
      const ok = () => { const v = inp.value; closeModal(); cb(v); };
      m.querySelector('#pOk').onclick = ok;
      m.querySelector('#pNo').onclick = () => { closeModal(); cb(null); };
      inp.onkeydown = (e) => { if (e.key === 'Enter') ok(); };
    });
  });
  Blockly.dialog.setConfirm((msg, cb) => {
    openModal(`<p>${esc(msg)}</p><div class="actions"><button class="btn" id="cNo">취소</button><button class="btn primary" id="cOk">확인</button></div>`, (m) => {
      m.querySelector('#cOk').onclick = () => { closeModal(); cb(true); };
      m.querySelector('#cNo').onclick = () => { closeModal(); cb(false); };
    });
  });
  Blockly.dialog.setAlert((msg, cb) => {
    openModal(`<p>${esc(msg)}</p><div class="actions"><button class="btn primary" id="aOk">확인</button></div>`, (m) => {
      m.querySelector('#aOk').onclick = () => { closeModal(); if (cb) cb(); };
    });
  });

  let toastT;
  function toast(msg, ms = 2600) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), ms);
  }

  /* ---------- 테마 · 도구상자 ---------- */
  ['controls_if', 'controls_repeat_ext', 'controls_whileUntil'].forEach((t) => {
    const o = Blockly.Blocks[t].init;
    Blockly.Blocks[t].init = function () { o.call(this); this.setStyle('loop_blocks'); };
  });
  const theme = Blockly.Theme.defineTheme('wedo', {
    base: Blockly.Themes.Classic,
    blockStyles: {
      logic_blocks: { colourPrimary: '#4fb85a' }, math_blocks: { colourPrimary: '#4fb85a' },
      text_blocks: { colourPrimary: '#4fb85a' }, loop_blocks: { colourPrimary: C.control },
      variable_blocks: { colourPrimary: '#ff7a1a' }, procedure_blocks: { colourPrimary: '#ff6680' }
    },
    componentStyles: {
      workspaceBackgroundColour: '#f4f6fa', toolboxBackgroundColour: '#ffffff', toolboxForegroundColour: '#1d2433',
      flyoutBackgroundColour: '#e9eef5', flyoutOpacity: 1, scrollbarColour: '#c9d2de', scrollbarOpacity: 0.7,
      insertionMarkerColour: '#000', insertionMarkerOpacity: 0.2
    },
    fontStyle: { family: '"Noto Sans KR", system-ui, sans-serif', weight: '600', size: 12 },
    startHats: true
  });
  const n = (v) => ({ shadow: { type: 'math_number', fields: { NUM: v } } });
  const B = (type, inputs, extra) => Object.assign({ kind: 'block', type }, inputs ? { inputs } : {}, extra || {});
  const toolbox = {
    kind: 'categoryToolbox',
    contents: [
      { kind: 'category', name: '이벤트', colour: C.event, contents: [
        B('wedo_when_start'), B('wedo_when_button'), B('wedo_when_key'), B('wedo_when_distance'), B('wedo_when_tilt')] },
      { kind: 'category', name: '모터', colour: C.motor, contents: [
        B('wedo_motor_on_for', { SECS: n(1) }), B('wedo_motor_on'), B('wedo_motor_off'),
        B('wedo_motor_power', { POWER: n(50) }), B('wedo_motor_dir'), B('wedo_motor_reverse')] },
      { kind: 'category', name: '불빛', colour: C.light, contents: [
        B('wedo_light_color'), B('wedo_light_rgb', { R: n(255), G: n(0), B: n(120) }), B('wedo_light_off')] },
      { kind: 'category', name: '소리', colour: C.sound, contents: [
        B('wedo_sound_note', { SECS: n(0.5) }), B('wedo_sound_tone', { FREQ: n(440), SECS: n(0.5) }), B('wedo_sound_stop')] },
      { kind: 'category', name: '센서', colour: C.sensor, contents: [
        B('wedo_distance'), B('wedo_distance_cmp', { VAL: n(30) }), B('wedo_tilt_is'), B('wedo_tilt_angle'),
        B('wedo_button'), B('wedo_key_pressed'), B('wedo_timer'), B('wedo_reset_timer')] },
      { kind: 'category', name: '제어', colour: C.control, contents: [
        B('wedo_wait', { SECS: n(1) }), B('controls_repeat_ext', { TIMES: n(10) }), B('wedo_forever'),
        B('controls_if'), B('controls_if', null, { extraState: { hasElse: true } }),
        B('wedo_wait_until'), B('controls_whileUntil'), B('wedo_stop')] },
      { kind: 'category', name: '연산', colour: '#4fb85a', contents: [
        B('math_number'), B('math_arithmetic', { A: n(1), B: n(1) }), B('math_random_int', { FROM: n(1), TO: n(10) }),
        B('logic_compare', { A: n(0), B: n(0) }), B('logic_operation'), B('logic_negate'), B('logic_boolean'),
        B('math_round', { NUM: n(3.1) }), B('math_modulo', { DIVIDEND: n(10), DIVISOR: n(3) }), B('math_single', { NUM: n(9) }),
        B('text'), B('text_join')] },
      { kind: 'category', name: '변수', colour: '#ff7a1a', custom: 'WEDO_VARIABLE' },
      { kind: 'category', name: '출력', colour: C.out, contents: [
        B('wedo_print', { TEXT: { shadow: { type: 'text', fields: { TEXT: '안녕 WeDo!' } } } })] }
    ]
  };

  const ws = Blockly.inject('blockArea', {
    toolbox, theme, renderer: 'zelos', sounds: false, trashcan: false,
    zoom: { controls: false, wheel: true, startScale: 0.78, maxScale: 2, minScale: 0.35, scaleSpeed: 1.15, pinch: true },
    grid: { spacing: 28, length: 2, colour: '#dbe2ec', snap: false },
    move: { scrollbars: true, drag: true, wheel: false }
  });
  ws.addChangeListener(Blockly.Events.disableOrphans);

  /* ---------- 변수 분류: 숫자를 바로 넣을 수 있게 ---------- */
  ws.registerButtonCallback('WEDO_CREATE_VAR', (btn) => Blockly.Variables.createVariableButtonHandler(btn.getTargetWorkspace(), null, ''));
  ws.registerToolboxCategoryCallback('WEDO_VARIABLE', (w) => {
    const items = [{ kind: 'button', text: '＋ 변수 만들기', callbackkey: 'WEDO_CREATE_VAR' }];
    const vars = w.getAllVariables().sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    if (!vars.length) {
      items.push({ kind: 'label', text: '변수를 만들면 숫자를 저장하고 계산할 수 있어요.' });
      return items;
    }
    const first = { VAR: { id: vars[0].getId() } };
    items.push(
      { kind: 'block', type: 'variables_set', fields: first, inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
      { kind: 'block', type: 'math_change', fields: first, inputs: { DELTA: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
      { kind: 'block', type: 'variables_set', fields: first, inputs: { VALUE: { block: { type: 'wedo_distance' } } } },
      { kind: 'sep', gap: 24 });
    vars.forEach((v) => items.push({ kind: 'block', type: 'variables_get', fields: { VAR: { id: v.getId() } } }));
    return items;
  });
  $('#zIn').onclick = () => ws.zoomCenter(1);
  $('#zOut').onclick = () => ws.zoomCenter(-1);
  $('#zFit').onclick = () => { ws.zoomToFit(); if (ws.scale > 1) ws.setScale(1); ws.scrollCenter(); };

  /* ---------- 예제 프로젝트 ---------- */
  const num = (v) => ({ shadow: { type: 'math_number', fields: { NUM: v } } });
  // chain(a, b, c): a → b → c 로 연결된 블록 묶음
  const chain = (...bs) => { for (let i = bs.length - 2; i >= 0; i--) bs[i].next = { block: bs[i + 1] }; return bs[0]; };
  const ifElse = {
    type: 'controls_if', extraState: { hasElse: true }, inputs: {
      IF0: { block: { type: 'wedo_distance_cmp', fields: { OP: 'LT' }, inputs: { VAL: num(30) } } },
      DO0: { block: chain(
        { type: 'wedo_light_color', fields: { COLOR: 'RED' } },
        { type: 'wedo_motor_on_for', fields: { PORT: '1' }, inputs: { SECS: num(1) } }) },
      ELSE: { block: { type: 'wedo_light_color', fields: { COLOR: 'GREEN' } } }
    }
  };
  const EXAMPLE = {
    blocks: { languageVersion: 0, blocks: [
      chain(
        { type: 'wedo_when_start', x: 40, y: 40 },
        { type: 'wedo_light_color', fields: { COLOR: 'GREEN' } },
        { type: 'wedo_sound_note', fields: { NOTE: '523' }, inputs: { SECS: num(0.2) } },
        { type: 'wedo_forever', inputs: { DO: { block: ifElse } } }),
      chain(
        { type: 'wedo_when_button', x: 470, y: 40 },
        { type: 'wedo_print', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: '버튼을 눌렀어요!' } } } } },
        { type: 'wedo_motor_reverse', fields: { PORT: '0' } })
    ] }
  };

  /* ---------- 저장/불러오기 ---------- */
  function loadJSON(obj, name) {
    ws.clear();
    try { Blockly.serialization.workspaces.load(obj.workspace || obj, ws); }
    catch (e) { toast('프로젝트를 불러오지 못했습니다: ' + e.message); return false; }
    if (name || obj.name) $('#projName').value = name || obj.name;
    setTimeout(() => $('#zFit').onclick(), 30);
    return true;
  }
  function currentProject() {
    return { app: 'wedo2-codinglab', version: 1, name: $('#projName').value, workspace: Blockly.serialization.workspaces.save(ws) };
  }
  function autosave() { try { localStorage.setItem(STORE_KEY, JSON.stringify(currentProject())); } catch (e) { /* 저장소 없음 */ } }
  (function initLoad() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { saved = null; }
    if (saved && saved.workspace) loadJSON(saved);
    else loadJSON(EXAMPLE, '거리 센서 경보기 (예제)');
  })();

  function safeName(s) { return (s || 'wedo').replace(/[\\/:*?"<>|]+/g, '_').trim() || 'wedo'; }
  // claude.ai 아티팩트 안에서는 downloads 기능으로, 일반 웹에서는 링크로 저장
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
        catch (e2) { toast('저장이 취소되었거나 막혔습니다. 복사를 사용하세요.'); return; }
      }
    }
    try {
      const blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast(`${filename} 저장 — 다운로드가 막힌 환경이면 '복사'를 사용하세요.`);
    } catch (e) { toast('이 화면에서는 다운로드가 차단됩니다. 복사를 사용하세요.'); }
  }
  async function copy(text, label) {
    try { await navigator.clipboard.writeText(text); toast(`${label} 복사했습니다.`); }
    catch (e) {
      openModal(`<h3>${esc(label)}</h3><p class="muted">자동 복사가 막혀 있습니다. 아래 내용을 선택해 복사하세요.</p><textarea style="width:100%;height:300px;font-family:monospace">${esc(text)}</textarea><div class="actions"><button class="btn primary" onclick="document.getElementById('modalBg').classList.remove('on')">닫기</button></div>`);
    }
  }
  $('#btnSave').onclick = () => download(safeName($('#projName').value) + '.wedo.json', JSON.stringify(currentProject(), null, 2), 'application/json');
  $('#btnOpen').onclick = () => $('#fileIn').click();
  $('#fileIn').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { const obj = JSON.parse(await f.text()); if (loadJSON(obj, obj.name || f.name.replace(/\.wedo\.json$|\.json$/, ''))) toast('프로젝트를 열었습니다.'); }
    catch (err) { toast('올바른 프로젝트 파일이 아닙니다.'); }
    e.target.value = '';
  };
  $('#btnNew').onclick = () => Blockly.dialog.confirm('지금 작업을 지우고 새 프로젝트를 시작할까요?', (ok) => {
    if (!ok) return;
    ws.clear();
    Blockly.serialization.workspaces.load({ blocks: { languageVersion: 0, blocks: [{ type: 'wedo_when_start', x: 40, y: 40 }] } }, ws);
    $('#projName').value = '새 프로젝트'; ws.scrollCenter();
  });
  $('#projName').addEventListener('change', autosave);

  /* ---------- Python 코드 생성 + 강조 ---------- */
  const PY_KW = new Set('False None True and as break continue def elif else for from global if import in is lambda not or pass return while with'.split(' '));
  const PY_BI = new Set('print range int float str len abs round min max random math'.split(' '));
  const PY_CONST = new Set(['ALL', 'UP', 'DOWN', 'LEFT', 'RIGHT', 'ANY', 'CLOCKWISE', 'COUNTERCLOCKWISE'].concat(window.WEDO_GEN.COLORS.map((c) => c[1])));
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
    const head = `# ${name}\n# 위두 메이커스(WeDo 2.0)에서 블록으로 만든 코드입니다.\n# 실행: pip install bleak  →  이 파일 옆에 wedo2.py 를 두고  python 파일이름.py\n\nfrom wedo2 import *\n`;
    if (!body) body = '# 이벤트 블록(예: ▶ 실행 버튼을 누를 때)을 놓고 블록을 연결해 보세요.';
    return `${head}\n${body}\n\nrun()\n`;
  }
  function genJS() {
    const G = javascript.javascriptGenerator;
    G.STATEMENT_PREFIX = 'W.hl(%1, __t);\n';
    G.INFINITE_LOOP_TRAP = 'await W.tick();\n';
    G.addReservedWords('W,__t');
    try {
      let code = G.workspaceToCode(ws);
      // 변수 모니터: 실행 중 변수 값을 화면에 보여 주기 위한 읽기 함수
      const vs = ws.getAllVariables();
      if (vs.length) {
        G.init(ws); // 이름 표를 다시 만들어 생성 코드와 같은 변수 이름을 얻는다
        const pairs = vs.map((v) => `${JSON.stringify(v.name)}: ${G.nameDB_.getName(v.getId(), Blockly.Names.NameType.VARIABLE)}`);
        code += `\nW.vars = () => ({ ${pairs.join(', ')} });\n`;
      }
      return code;
    } finally { G.STATEMENT_PREFIX = null; G.INFINITE_LOOP_TRAP = null; if (G.nameDB_) G.nameDB_.reset(); G.isInitialized = false; }
  }
  let pySrc = '';
  let genT;
  function refreshCode() {
    clearTimeout(genT);
    genT = setTimeout(() => {
      try { pySrc = genPython(); $('#pyCode').innerHTML = highlightPy(pySrc); }
      catch (e) { $('#pyCode').textContent = '# 코드 생성 오류: ' + e.message; }
    }, 80);
  }
  ws.addChangeListener((e) => {
    if (e.isUiEvent) return;
    refreshCode(); autosave();
  });
  $('#projName').addEventListener('input', refreshCode);
  refreshCode();
  $('#btnCopyPy').onclick = () => copy(pySrc, 'Python 코드를');
  $('#btnSavePy').onclick = () => download(safeName($('#projName').value).replace(/\s+/g, '_') + '.py', pySrc);

  $('#btnPyHelp').onclick = () => openModal(`
    <h3>생성된 Python 코드를 PC에서 실행하기</h3>
    <ol>
      <li>Python 3.9 이상을 설치하고, 터미널에서 <code>pip install bleak</code> 를 실행합니다.</li>
      <li>아래 <b>wedo2.py</b> 라이브러리를 받아 <code>.py 저장</code>으로 받은 파일과 같은 폴더에 둡니다.</li>
      <li>WeDo 허브의 초록 버튼을 눌러 불이 깜빡이게 한 뒤 <code>python 내프로젝트.py</code> 를 실행합니다.</li>
    </ol>
    <p class="muted">블루투스가 있는 Windows · macOS · Linux에서 동작합니다. 웹에서 이미 허브에 연결 중이면 먼저 연결을 끊으세요. <kbd>Ctrl</kbd>+<kbd>C</kbd>로 멈춥니다.</p>
    <div class="actions" style="justify-content:flex-start"><button class="btn primary" id="dlLib">wedo2.py 저장</button><button class="btn" id="cpLib">wedo2.py 복사</button></div>
    <h3 style="margin-top:18px">사용할 수 있는 함수</h3>
    <pre><code>motor_on(1) / motor_off(ALL) / motor_on_for(1, 2)
motor_power(1, 50) / motor_direction(1, CLOCKWISE) / motor_reverse(2)
light_color(RED) / light_rgb(255, 0, 120) / light_off()
play_tone(440, 0.5) / stop_sound()
distance() → 0~100      is_tilted(UP) / tilt_angle(LEFT)
is_button_pressed()     timer() / reset_timer()
is_key_pressed('space')  ← PC 키보드 (pip install pynput 필요)
wait(1) / wait_until(lambda: distance() &lt; 30) / stop_all()

@on_start  @on_button  @on_key('up')  @when(lambda: 조건)   →  마지막 줄에 run()</code></pre>
    <div class="actions"><button class="btn" id="mClose">닫기</button></div>`, (m) => {
    m.querySelector('#dlLib').onclick = () => download('wedo2.py', window.WEDO2_PY);
    m.querySelector('#cpLib').onclick = () => copy(window.WEDO2_PY, 'wedo2.py 를');
    m.querySelector('#mClose').onclick = closeModal;
  });

  $('#btnHelp').onclick = () => openModal(`
    <h3>위두 메이커스 사용법</h3>
    <ol>
      <li><b>허브 연결</b>: WeDo 2.0 허브의 초록 버튼을 누른 뒤 <b>허브 연결</b>을 누르고 목록에서 허브(LPF2 Smart Hub…)를 고릅니다. 연결되면 허브 불빛이 <b style="color:#1e5bff">파랑</b>으로 켜지고, 프로그램이 끝나거나 정지하면 다시 파랑으로 돌아옵니다.</li>
      <li><b>코딩</b>: 왼쪽 분류에서 블록을 끌어와 <b>▶ 실행 버튼을 누를 때</b> 아래에 붙입니다. 오른쪽에 같은 내용의 Python 코드가 바로 보입니다.</li>
      <li><b>실행/정지</b>: 초록 <b>실행</b> 버튼, 빨간 <b>정지</b> 버튼. 실행 중인 블록은 노란 테두리로 표시됩니다.</li>
      <li><b>키보드 신호</b>: <b>키보드 ○ 키를 누를 때</b>(이벤트)와 <b>키보드 ○ 키가 눌렸는가?</b>(센서) 블록으로 PC 키보드를 리모컨처럼 쓸 수 있습니다. 화살표·스페이스·엔터·A~Z·0~9를 쓸 수 있고, 한/영 상태와 관계없이 동작합니다.</li>
      <li><b>변수</b>: <b>변수</b> 분류에서 변수를 만들고 숫자를 넣거나(<code>정하기</code>) 바꿀 수(<code>바꾸기</code>) 있습니다. 실행 중 값은 아래 허브 탭에 표시됩니다.</li>
      <li><b>가상 허브</b>: 허브가 없어도 실행됩니다. 아래 <b>허브</b> 탭에서 거리·기울기·버튼 값을 바꿔 보며 시험하세요.</li>
    </ol>
    <p><b>포트</b>: 허브의 두 연결 단자가 포트 1, 포트 2입니다. 모터·거리 센서·기울기 센서는 아무 포트에 꽂아도 자동으로 인식합니다.</p>
    <p><b>브라우저</b>: 블루투스 연결은 PC/크롬북의 <b>Chrome · Edge</b>에서 <b>https</b> 주소로 열었을 때 동작합니다. (iPhone/iPad Safari는 Web Bluetooth를 지원하지 않습니다.)</p>
    <p class="muted">작업은 이 브라우저에 자동 저장됩니다. 다른 PC로 옮길 때는 상단 <b>저장</b>으로 .wedo.json 파일을 받으세요.</p>
    <div class="actions"><button class="btn primary" id="mClose">확인</button></div>`, (m) => { m.querySelector('#mClose').onclick = closeModal; });

  /* ---------- 콘솔 ---------- */
  let errCount = 0;
  const logs = $('#logs');
  function log(msg, kind) {
    const d = document.createElement('div');
    d.className = 'log ' + (kind || '');
    const t = new Date();
    d.innerHTML = `<span class="t">${t.toTimeString().slice(0, 8)}</span>${esc(msg)}`;
    logs.appendChild(d);
    while (logs.children.length > 500) logs.firstChild.remove();
    const pane = $('#consolePane'); pane.scrollTop = pane.scrollHeight;
    if (kind === 'err' && !$('#consolePane').classList.contains('on')) { errCount++; $('#errCnt').textContent = errCount; $('#errCnt').hidden = false; }
    if (!kind && !$('#consolePane').classList.contains('on')) showTab('consolePane');
  }
  $('#btnClear').onclick = () => { logs.innerHTML = ''; };
  function showTab(id) {
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('on', t.dataset.tab === id));
    document.querySelectorAll('.pane').forEach((p) => p.classList.toggle('on', p.id === id));
    if (id === 'consolePane') { errCount = 0; $('#errCnt').hidden = true; }
  }
  document.querySelectorAll('.tab').forEach((t) => (t.onclick = () => showTab(t.dataset.tab)));

  /* ---------- 소리 (가상 허브) ---------- */
  let actx = null;
  function ensureAudio() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { actx = null; } }
  function beep(freq, ms) {
    if (!actx) return;
    try {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = 'square'; o.frequency.value = freq; g.gain.value = 0.05;
      o.connect(g).connect(actx.destination);
      const t = actx.currentTime; o.start(t); g.gain.setValueAtTime(0.05, t + ms / 1000 - 0.02); g.gain.linearRampToValueAtTime(0, t + ms / 1000); o.stop(t + ms / 1000 + 0.01);
    } catch (e) { /* 무시 */ }
  }

  /* ---------- 허브 + 런타임 ---------- */
  const hub = new WeDo.Hub();
  const highlighted = new Set();
  const ui = {
    log, beep,
    highlight(id, on) {
      if (on) highlighted.add(id); else highlighted.delete(id);
      try { ws.highlightBlock(id, on); } catch (e) { /* 블록이 지워짐 */ }
    },
    clearHighlights() { highlighted.forEach((id) => { try { ws.highlightBlock(id, false); } catch (e) {} }); highlighted.clear(); }
  };
  const rt = new WeDo.Runtime(hub, ui);
  rt.addEventListener('state', () => {
    document.body.classList.toggle('running', rt.running);
    $('#btnStop').disabled = !rt.running;
  });

  $('#btnRun').onclick = () => {
    ensureAudio();
    const code = genJS();
    if (!hub.connected) toast('허브가 연결되지 않아 가상 허브로 실행합니다.', 2000);
    log(`▶ "${$('#projName').value}" 실행` + (hub.connected ? '' : ' (가상 허브)'), 'sys');
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); // 스페이스가 버튼을 누르지 않도록
    rt.run(code);
  };
  $('#btnStop').onclick = () => rt.stop('user');

  const btnConnect = $('#btnConnect');
  btnConnect.onclick = async () => {
    if (hub.connected) { rt.stop('user'); hub.disconnect(); return; }
    const sup = WeDo.Hub.support();
    if (sup !== 'ok') { showBtHelp(sup); return; }
    $('#connLabel').textContent = '연결 중…';
    try {
      await hub.connect();
      log(`허브 연결됨: ${hub.state.name}`, 'sys'); toast('허브에 연결했습니다.');
    } catch (e) {
      if (e && e.name === 'NotFoundError') { /* 사용자가 취소 */ }
      else if (e && (e.name === 'SecurityError' || /permission|policy|allowed/i.test(e.message))) showBtHelp('blocked', e);
      else { log('연결 실패: ' + (e && e.message ? e.message : e), 'err'); toast('연결에 실패했습니다. 허브 버튼을 다시 누르고 시도하세요.'); }
    }
    renderHub();
  };
  hub.addEventListener('disconnected', () => { rt.stop('user'); log('허브 연결이 끊어졌습니다.', 'warn'); toast('허브 연결이 끊어졌습니다.'); });
  function showBtHelp(kind, e) {
    const why = {
      unsupported: '이 브라우저는 Web Bluetooth를 지원하지 않습니다.',
      insecure: '보안 연결(https)이 아닌 주소에서는 블루투스를 쓸 수 없습니다.',
      blocked: '이 화면(미리보기/삽입된 페이지)에서는 브라우저가 블루투스 접근을 막고 있습니다.'
    }[kind];
    openModal(`<h3>블루투스로 허브에 연결할 수 없습니다</h3><p>${why}</p>
      <ul><li>PC·크롬북의 <b>Chrome</b> 또는 <b>Edge</b>를 사용하세요.</li>
      <li>배포한 <b>https</b> 주소(예: GitHub Pages)나 <code>http://localhost</code> 에서 페이지를 직접 여세요.</li>
      <li>그동안에도 <b>가상 허브</b>로 프로그램을 실행해 볼 수 있습니다.</li></ul>
      ${e ? `<p class="muted">(${esc(e.name)}: ${esc(e.message)})</p>` : ''}
      <div class="actions"><button class="btn primary" id="mClose">확인</button></div>`, (m) => { m.querySelector('#mClose').onclick = closeModal; });
  }

  /* ---------- 허브 패널 ---------- */
  const GEAR = '<svg class="gear" viewBox="0 0 24 24" fill="currentColor"><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.6 7.6 0 0 0-1.7-1L15 3.3h-4l-.4 2.6a7.6 7.6 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.6 7.6 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7.6 7.6 0 0 0 1.7-1l2.5 1 2-3.5zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>';
  let lastPortsKey = '';
  function renderPort(p) {
    const s = hub.state, type = s.ports[p], el = $('#port' + p);
    const name = hub.connected ? (type ? (WeDo.DEV_NAME[type] || `장치 #${type}`) : '비어 있음') : '모터 (가상)';
    const key = p + name;
    if (el.dataset.key !== key) {
      el.dataset.key = key;
      el.innerHTML = `<h4>포트 ${p} <span class="muted">${name}</span></h4><div class="motor-vis">${GEAR}<div><div class="val" data-pw>0</div><div class="meter"><i data-bar></i></div></div></div>`;
    }
    const pw = s.motors[p].power;
    const pct = Math.round(Math.abs(pw) === 127 ? 0 : Math.abs(pw));
    el.querySelector('[data-pw]').textContent = pw === 0 ? '정지' : `${pw > 0 ? '↻' : '↺'} ${pct}%`;
    el.querySelector('[data-bar]').style.width = pct + '%';
    const g = el.querySelector('.gear');
    g.classList.toggle('spin', pw !== 0 && Math.abs(pw) !== 127);
    g.classList.toggle('rev', pw < 0);
    g.style.setProperty('--spd', (2.2 - pct / 60).toFixed(2) + 's');
  }
  const TILT_KO = { UP: '위쪽', DOWN: '아래쪽', LEFT: '왼쪽', RIGHT: '오른쪽' };
  function renderHub() {
    const s = hub.state, c = hub.connected;
    btnConnect.classList.toggle('on', c);
    $('#connLabel').textContent = c ? '연결됨 · 끊기' : '허브 연결';
    $('#modeChip').className = 'chip ' + (c ? 'real' : 'sim');
    $('#modeChip').textContent = c ? '실제 허브' : '가상 허브';
    $('#hubName').innerHTML = c ? `<b>${esc(s.name)}</b>` : '허브가 연결되지 않았습니다 — 가상 허브로 실행됩니다.';
    $('#battery').textContent = c && s.battery != null ? `🔋 ${s.battery}%` : '';
    renderPort(1); renderPort(2);
    const [r, g, b] = s.led, lit = r || g || b;
    $('#ledVis').style.background = lit ? `rgb(${r},${g},${b})` : '#20242c';
    $('#ledVis').style.boxShadow = lit ? `0 0 14px rgba(${r},${g},${b},.75)` : 'none';
    $('#ledTxt').textContent = lit ? `RGB ${r}, ${g}, ${b}` : '꺼짐';
    $('#toneTxt').textContent = s.tone ? `♪ ${s.tone} Hz` : '소리 없음';
    $('#btnTxt').textContent = s.button ? '눌림' : '안 눌림';
    $('#simBtn').classList.toggle('on', !!s.button);
    $('#simBtn').disabled = c; $('#simBtn').textContent = c ? '허브의 버튼을 눌러 보세요' : '누르고 있기';
    $('#distTxt').textContent = Math.round(s.distance);
    const dSlider = $('#distSlider');
    dSlider.disabled = c; if (c || document.activeElement !== dSlider) dSlider.value = s.distance;
    const hasDist = !c || Object.values(s.ports).includes(WeDo.DEV.DISTANCE);
    $('#distNote').textContent = c ? (hasDist ? '실제 센서 값' : '거리 센서가 연결되지 않았습니다') : '가상값 — 슬라이더로 바꿔 보세요';
    const dir = ['UP', 'DOWN', 'LEFT', 'RIGHT'].find((d) => hub.tiltAngle(d) >= 15);
    $('#tiltTxt').textContent = dir ? `${TILT_KO[dir]} ${hub.tiltAngle(dir)}°` : '수평';
    document.querySelectorAll('#tiltPad button').forEach((bt) => {
      bt.disabled = c;
      bt.classList.toggle('on', (bt.dataset.d === 'NONE' && !dir) || bt.dataset.d === dir);
    });
  }
  let rq = false;
  hub.addEventListener('change', () => { if (!rq) { rq = true; requestAnimationFrame(() => { rq = false; renderHub(); }); } });
  renderHub();

  // 가상 허브 조작
  $('#distSlider').oninput = (e) => { if (!hub.connected) { hub.state.distance = Number(e.target.value); hub.emit(); } };
  document.querySelectorAll('#tiltPad button').forEach((bt) => (bt.onclick = () => { if (!hub.connected) hub.simSetTilt(bt.dataset.d, 30); }));
  const sb = $('#simBtn');
  const press = (v) => (e) => { if (hub.connected) return; e.preventDefault(); hub.state.button = v; hub.emit(); };
  sb.addEventListener('pointerdown', press(true));
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => sb.addEventListener(ev, press(false)));

  /* ---------- 스플리터 ---------- */
  (function () {
    const sp = $('#splitter'); let drag = false;
    try { const w = localStorage.getItem('wedo2-side-w'); if (w) document.documentElement.style.setProperty('--side-w', w); } catch (e) {}
    sp.addEventListener('pointerdown', (e) => { drag = true; sp.classList.add('drag'); sp.setPointerCapture(e.pointerId); });
    sp.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const w = Math.max(300, Math.min(window.innerWidth * 0.7, window.innerWidth - e.clientX));
      document.documentElement.style.setProperty('--side-w', w + 'px'); Blockly.svgResize(ws);
    });
    sp.addEventListener('pointerup', () => {
      drag = false; sp.classList.remove('drag');
      try { localStorage.setItem('wedo2-side-w', getComputedStyle(document.documentElement).getPropertyValue('--side-w')); } catch (e) {}
    });
    window.addEventListener('resize', () => Blockly.svgResize(ws));
  })();

  // 단축키: Ctrl+Enter 실행, Esc 정지
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); $('#btnRun').click(); }
    else if (e.key === 'Escape' && rt.running && !modalBg.classList.contains('on')) rt.stop('user');
  });

  /* ---------- PC 키보드 → 신호 ---------- */
  // e.code 를 써서 한/영 입력 상태와 관계없이 같은 키로 인식
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
  const KEY_KO = Object.fromEntries(window.WEDO_KEYS);
  rt.addEventListener('keys', () => {
    const down = [...rt.keys].map((k) => KEY_KO[k] || k);
    $('#keyTxt').textContent = down.length ? down.join(' + ') : (rt.lastKey ? `마지막: ${KEY_KO[rt.lastKey] || rt.lastKey}` : '없음');
    $('#keyVis').classList.toggle('on', down.length > 0);
  });

  /* ---------- 변수 모니터 ---------- */
  function renderVars() {
    const box = $('#varList');
    const names = ws.getAllVariables().map((v) => v.name);
    if (!names.length) { box.innerHTML = '<span class="muted">변수 분류에서 변수를 만들면 실행 중 값이 여기 보입니다.</span>'; return; }
    let vals = {};
    try { vals = rt.vars ? rt.vars() : {}; } catch (e) { vals = {}; }
    box.innerHTML = names.map((nm) => {
      const v = vals[nm];
      const shown = v === undefined || v === null ? '–' : typeof v === 'number' ? String(Math.round(v * 1000) / 1000) : String(v);
      return `<span class="var"><b>${esc(nm)}</b>${esc(shown)}</span>`;
    }).join('');
  }
  setInterval(() => { if (rt.running || $('#varList').dataset.dirty) { renderVars(); delete $('#varList').dataset.dirty; } }, 200);
  ws.addChangeListener((e) => { if (e.type === Blockly.Events.VAR_CREATE || e.type === Blockly.Events.VAR_DELETE || e.type === Blockly.Events.VAR_RENAME || e.type === Blockly.Events.FINISHED_LOADING) $('#varList').dataset.dirty = '1'; });
  rt.addEventListener('state', () => { $('#varList').dataset.dirty = '1'; });
  renderVars();

  window.__wedo = { ws, hub, rt, genJS, genPython };
  log('위두 메이커스 준비 완료. 블록을 연결하고 ▶ 실행을 눌러 보세요.', 'sys');
})();
