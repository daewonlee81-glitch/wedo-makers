/* ===== WeDo 2.0 허브 드라이버 (Web Bluetooth) + 시뮬레이터 + 실행 런타임 ===== */
(function () {
  const U = (s) => `0000${s}-1212-efde-1523-785feabcd123`;
  const SVC_DEVICE = U('1523');
  const SVC_IO = U('4f0e');
  const CH = {
    BUTTON: U('1526'), ATTACHED_IO: U('1527'),
    INPUT_VALUES: U('1560'), INPUT_COMMAND: U('1563'), OUTPUT_COMMAND: U('1565')
  };
  const DEV = { MOTOR: 1, PIEZO: 22, LED: 23, TILT: 34, DISTANCE: 35 };
  const DEV_NAME = { 1: '모터', 34: '기울기 센서', 35: '거리 센서' };
  const COLOR_RGB = {
    RED: [255, 0, 0], ORANGE: [255, 70, 0], YELLOW: [255, 190, 0], GREEN: [0, 255, 0], CYAN: [0, 200, 255],
    BLUE: [0, 0, 255], PURPLE: [140, 0, 255], PINK: [255, 0, 110], WHITE: [255, 255, 255]
  };
  const CONNECTED_RGB = [0, 0, 255];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const num = (x, d = 0) => { const n = Number(x); return Number.isFinite(n) ? n : d; };

  /* ---------------- 허브 ---------------- */
  class Hub extends EventTarget {
    constructor() {
      super();
      this.device = null; this.chars = {}; this.queue = Promise.resolve(); this.last = {};
      this.state = {
        connected: false, name: '', battery: null,
        ports: { 1: null, 2: null },
        distance: 50, tiltX: 0, tiltY: 0, button: false,
        motors: { 1: { power: 0 }, 2: { power: 0 } },
        led: [0, 0, 0], tone: 0
      };
    }
    get connected() { return this.state.connected; }
    emit() { this.dispatchEvent(new Event('change')); }

    static support() {
      if (!('bluetooth' in navigator)) return 'unsupported';
      if (!window.isSecureContext) return 'insecure';
      return 'ok';
    }

    async connect() {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SVC_DEVICE] }],
        optionalServices: [SVC_IO, 'battery_service']
      });
      this.device = device;
      device.addEventListener('gattserverdisconnected', () => this._onDisconnect());
      const server = await device.gatt.connect();
      const sDev = await server.getPrimaryService(SVC_DEVICE);
      const sIO = await server.getPrimaryService(SVC_IO);
      this.chars.attached = await sDev.getCharacteristic(CH.ATTACHED_IO);
      this.chars.input = await sIO.getCharacteristic(CH.INPUT_VALUES);
      this.chars.inCmd = await sIO.getCharacteristic(CH.INPUT_COMMAND);
      this.chars.outCmd = await sIO.getCharacteristic(CH.OUTPUT_COMMAND);
      try { this.chars.button = await sDev.getCharacteristic(CH.BUTTON); } catch (e) { this.chars.button = null; }

      this.state.connected = true; this.last = {};
      this.state.name = device.name || 'WeDo 2.0 Hub';
      this.state.ports = { 1: null, 2: null };

      this.chars.input.addEventListener('characteristicvaluechanged', (e) => this._onInput(e.target.value));
      await this.chars.input.startNotifications();
      this.chars.attached.addEventListener('characteristicvaluechanged', (e) => this._onAttached(e.target.value));
      await this.chars.attached.startNotifications();
      if (this.chars.button) {
        this.chars.button.addEventListener('characteristicvaluechanged', (e) => {
          this.state.button = e.target.value.getUint8(0) === 1; this.emit();
        });
        await this.chars.button.startNotifications();
      }
      // 내장 LED 를 RGB 모드로
      await this._write('inCmd', [1, 2, 6, DEV.LED, 1, 1, 0, 0, 0, 0, 0]);
      await this.showConnected();
      this._readBattery(server);
      this.emit();
    }

    async _readBattery(server) {
      try {
        const s = await server.getPrimaryService('battery_service');
        const c = await s.getCharacteristic('battery_level');
        const read = async () => { const v = await c.readValue(); this.state.battery = v.getUint8(0); this.emit(); };
        await read();
        try { c.addEventListener('characteristicvaluechanged', (e) => { this.state.battery = e.target.value.getUint8(0); this.emit(); }); await c.startNotifications(); } catch (e) { /* 알림 미지원 */ }
      } catch (e) { /* 배터리 서비스 없음 */ }
    }

    /* 연결 상태 표시: 블루투스로 연결되어 있으면 허브 LED 를 파랑으로 */
    showConnected() { return this.connected ? this.setLED(...CONNECTED_RGB) : Promise.resolve(); }

    disconnect() { if (this.device && this.device.gatt.connected) this.device.gatt.disconnect(); }

    _onDisconnect() {
      this.state.connected = false; this.state.ports = { 1: null, 2: null }; this.state.battery = null;
      this.chars = {}; this.queue = Promise.resolve();
      this.emit();
      this.dispatchEvent(new Event('disconnected'));
    }

    _onAttached(dv) {
      const port = dv.getUint8(0);
      if (port !== 1 && port !== 2) return;
      const attached = dv.getUint8(1) === 1;
      const type = attached && dv.byteLength > 3 ? dv.getUint8(3) : null;
      this.state.ports[port] = type;
      if (type === DEV.DISTANCE) this._write('inCmd', [1, 2, port, DEV.DISTANCE, 0, 1, 0, 0, 0, 1, 1]);
      if (type === DEV.TILT) this._write('inCmd', [1, 2, port, DEV.TILT, 0, 1, 0, 0, 0, 0, 1]);
      this.emit();
    }

    _onInput(dv) {
      if (dv.byteLength < 3) return;
      const port = dv.getUint8(1);
      const type = this.state.ports[port];
      if (type === DEV.DISTANCE) this.state.distance = dv.getUint8(2) * 10;
      else if (type === DEV.TILT && dv.byteLength >= 4) { this.state.tiltX = dv.getUint8(2); this.state.tiltY = dv.getUint8(3); }
      this.emit();
    }

    _write(which, bytes) {
      const c = this.chars[which];
      if (!c) return Promise.resolve();
      const data = new Uint8Array(bytes);
      this.queue = this.queue.then(() => (c.writeValueWithoutResponse ? c.writeValueWithoutResponse(data) : c.writeValue(data)))
        .catch((e) => console.warn('BLE write 실패', e));
      return this.queue;
    }

    /* 출력 명령: [포트, 명령, 길이, ...값] */
    // 같은 명령을 연달아 보내지 않는다 (무한 반복 안에서 BLE 가 넘치는 것 방지)
    _out(key, bytes) {
      const sig = bytes.join(',');
      if (this.last[key] === sig) return Promise.resolve();
      this.last[key] = sig;
      return this._write('outCmd', bytes);
    }
    setMotor(port, signedPower) {
      this.state.motors[port].power = signedPower; this.emit();
      return this._out('m' + port, [port, 1, 1, signedPower & 0xff]);
    }
    brakeMotor(port) {
      this.state.motors[port].power = 0; this.emit();
      return this._out('m' + port, [port, 1, 1, 127]);
    }
    setLED(r, g, b) {
      this.state.led = [r, g, b]; this.emit();
      return this._out('led', [6, 4, 3, r, g, b]);
    }
    playTone(freq, ms) {
      this.state.tone = freq; this.emit();
      return this._write('outCmd', [5, 2, 4, freq & 0xff, (freq >> 8) & 0xff, ms & 0xff, (ms >> 8) & 0xff]);
    }
    stopTone() {
      this.state.tone = 0; this.emit();
      return this._write('outCmd', [5, 3, 0]);
    }

    /* 기울기 각도 (Scratch WeDo 확장과 같은 해석) */
    tiltAngle(dir) {
      const { tiltX: x, tiltY: y } = this.state;
      switch (dir) {
        case 'UP': return y > 45 ? 256 - y : -y;
        case 'DOWN': return y > 45 ? y - 256 : y;
        case 'LEFT': return x > 45 ? 256 - x : -x;
        case 'RIGHT': return x > 45 ? x - 256 : x;
        default: return 0;
      }
    }
    // 시뮬레이터용: 방향/각도 → 원시값
    simSetTilt(dir, angle = 30) {
      const raw = (a) => (a < 0 ? 256 + a : a);
      this.state.tiltX = 0; this.state.tiltY = 0;
      if (dir === 'UP') this.state.tiltY = raw(-angle);
      if (dir === 'DOWN') this.state.tiltY = raw(angle);
      if (dir === 'LEFT') this.state.tiltX = raw(-angle);
      if (dir === 'RIGHT') this.state.tiltX = raw(angle);
      this.emit();
    }
  }

  /* ---------------- 런타임 (블록 실행) ---------------- */
  class StopSignal extends Error { constructor() { super('stopped'); this.name = 'StopSignal'; } }
  const TILT_THRESHOLD = 15;

  class Runtime extends EventTarget {
    constructor(hub, ui) {
      super();
      this.hub = hub; this.ui = ui;
      this.running = false; this.tid = 0;
      this.mPower = { 1: 100, 2: 100 }; this.mDir = { 1: 1, 2: 1 }; this.mOn = { 1: false, 2: false };
      this.brakeTimers = {};
      this.t0 = performance.now();
      this.handlers = { start: [], button: [], when: [], key: [] };
      this.active = new Set(); this.hlMap = new Map();
      this.keys = new Set(); this.lastKey = '';
    }
    check() { if (!this.running) throw new StopSignal(); }
    // 반복 한 바퀴마다 한 프레임(1/30초) 쉬기 — Scratch 와 같은 속도로 "점점 빨라지기" 같은 동작이 보이도록
    async tick() { this.check(); await sleep(1000 / 30); this.check(); }

    ports(p) { p = num(p); return p === 0 ? [1, 2] : [clamp(p, 1, 2)]; }
    _sendMotor(port) {
      clearTimeout(this.brakeTimers[port]);
      if (!this.mOn[port]) return this.hub.setMotor(port, 0);
      const p = clamp(num(this.mPower[port]), 0, 100);
      const scaled = p === 0 ? 0 : Math.round(10 + (p - 1) * 90 / 99); // 낮은 파워에서도 돌도록 10~100 으로
      return this.hub.setMotor(port, this.mDir[port] * scaled);
    }

    /* --- 블록 API --- */
    async motorOn(p) { this.check(); for (const k of this.ports(p)) { this.mOn[k] = true; await this._sendMotor(k); } }
    async motorOff(p) {
      this.check();
      for (const k of this.ports(p)) {
        this.mOn[k] = false; await this.hub.brakeMotor(k);
        clearTimeout(this.brakeTimers[k]);
        this.brakeTimers[k] = setTimeout(() => { if (!this.mOn[k]) this.hub.setMotor(k, 0); }, 1000);
      }
    }
    async motorOnFor(p, s) { await this.motorOn(p); await this.wait(s); await this.motorOff(p); }
    async motorPower(p, pw) { this.check(); for (const k of this.ports(p)) { this.mPower[k] = clamp(num(pw), 0, 100); if (this.mOn[k]) await this._sendMotor(k); } }
    async motorDirection(p, d) { this.check(); for (const k of this.ports(p)) { this.mDir[k] = num(d) < 0 ? -1 : 1; if (this.mOn[k]) await this._sendMotor(k); } }
    async motorReverse(p) { this.check(); for (const k of this.ports(p)) { this.mDir[k] *= -1; if (this.mOn[k]) await this._sendMotor(k); } }
    async lightColor(name) { this.check(); const c = COLOR_RGB[name] || [0, 0, 0]; await this.hub.setLED(...c); }
    async lightRGB(r, g, b) { this.check(); await this.hub.setLED(...[r, g, b].map((x) => clamp(Math.round(num(x)), 0, 255))); }
    async lightOff() { this.check(); await this.hub.setLED(0, 0, 0); }
    async playTone(f, s) {
      this.check();
      const freq = clamp(Math.round(num(f, 440)), 20, 20000);
      const ms = clamp(Math.round(num(s, 0.5) * 1000), 0, 65535);
      await this.hub.playTone(freq, ms);
      if (!this.hub.connected) this.ui.beep(freq, ms);
      await this.wait(ms / 1000);
      this.hub.state.tone = 0; this.hub.emit();
    }
    async stopSound() { this.check(); await this.hub.stopTone(); }
    distance() { return Math.round(this.hub.state.distance); }
    tiltAngle(dir) { return this.hub.tiltAngle(dir); }
    isTilted(dir) {
      if (dir === 'ANY') return ['UP', 'DOWN', 'LEFT', 'RIGHT'].some((d) => this.hub.tiltAngle(d) >= TILT_THRESHOLD);
      return this.hub.tiltAngle(dir) >= TILT_THRESHOLD;
    }
    isButtonPressed() { return !!this.hub.state.button; }
    isKeyPressed(k) { return k === 'any' ? this.keys.size > 0 : this.keys.has(k); }

    /* --- 키보드: UI 에서 호출 --- */
    keyDown(k) {
      if (this.keys.has(k)) return; // 자동 반복 무시
      this.keys.add(k); this.lastKey = k;
      this.dispatchEvent(new Event('keys'));
      if (!this.running) return;
      this.handlers.key.forEach((h) => { if (h.key === k || h.key === 'any') this._fire(h); });
    }
    keyUp(k) { this.keys.delete(k); this.dispatchEvent(new Event('keys')); }
    clearKeys() { this.keys.clear(); this.dispatchEvent(new Event('keys')); }
    usesKeys() { return this.running && this.handlers.key.length > 0; }
    timer() { return Math.round((performance.now() - this.t0) / 10) / 100; }
    resetTimer() { this.t0 = performance.now(); }
    async wait(s) {
      this.check();
      const end = performance.now() + Math.max(0, num(s)) * 1000;
      while (true) {
        const left = end - performance.now();
        if (left <= 0) break;
        await sleep(Math.min(left, 40)); this.check();
      }
    }
    async waitUntil(fn) { this.check(); while (!fn()) { await sleep(20); this.check(); } }
    print(x) { this.ui.log(typeof x === 'object' ? JSON.stringify(x) : String(x)); }
    stopAll() { this.stop('program'); }

    /* --- 이벤트 등록 --- */
    onStart(fn) { this.handlers.start.push(fn); }
    onButton(fn) { this.handlers.button.push({ fn, busy: false }); }
    onKey(key, fn) { this.handlers.key.push({ key, fn, busy: false }); }
    when(cond, fn) { this.handlers.when.push({ cond, fn, prev: true, busy: false }); }

    hl(id, t) {
      if (!this.running) return;
      const prev = this.hlMap.get(t);
      if (prev && prev !== id) this.ui.highlight(prev, false);
      this.hlMap.set(t, id); this.ui.highlight(id, true);
    }

    async _thread(fn) {
      const t = ++this.tid;
      const p = (async () => {
        try { await fn(t); } catch (e) {
          if (!(e instanceof StopSignal)) { this.ui.log(this.ui.t('err') + ': ' + (e && e.message ? e.message : e), 'err'); this.stop('error'); }
        } finally {
          const id = this.hlMap.get(t); if (id) this.ui.highlight(id, false); this.hlMap.delete(t);
        }
      })();
      this.active.add(p); await p; this.active.delete(p);
      this._maybeFinish();
    }
    _maybeFinish() {
      if (!this.running) return;
      const hasEvents = this.handlers.button.length || this.handlers.when.length || this.handlers.key.length;
      if (!hasEvents && this.active.size === 0) this.stop('done');
    }

    async run(code) {
      if (this.running) { this.stop('restart'); await sleep(120); }
      this.handlers = { start: [], button: [], when: [], key: [] };
      this.mPower = { 1: 100, 2: 100 }; this.mDir = { 1: 1, 2: 1 }; this.mOn = { 1: false, 2: false };
      this.resetTimer(); this.vars = null;
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      let setup;
      try { setup = new AsyncFunction('W', code); } catch (e) { this.ui.log(this.ui.t('code_err') + ': ' + e.message, 'err'); return; }
      this.running = true;
      this.dispatchEvent(new Event('state'));
      try { await setup(this); } catch (e) { this.ui.log(this.ui.t('err') + ': ' + e.message, 'err'); this.stop('error'); return; }
      const total = this.handlers.start.length + this.handlers.button.length + this.handlers.when.length + this.handlers.key.length;
      if (!total) { this.ui.log(this.ui.t('no_events'), 'warn'); this.stop('done'); return; }
      this.handlers.when.forEach((h) => { h.prev = !!safe(h.cond); });
      this.handlers.start.forEach((fn) => this._thread(fn));
      this._poll();
    }
    async _poll() {
      let prevBtn = this.isButtonPressed();
      while (this.running) {
        const btn = this.isButtonPressed();
        if (btn && !prevBtn) this.handlers.button.forEach((h) => this._fire(h));
        prevBtn = btn;
        for (const h of this.handlers.when) {
          const c = !!safe(h.cond);
          if (c && !h.prev) this._fire(h);
          h.prev = c;
        }
        await sleep(25);
      }
    }
    _fire(h) {
      if (h.busy) return;
      h.busy = true;
      this._thread(h.fn).finally(() => { h.busy = false; });
    }
    stop(reason) {
      const was = this.running;
      this.running = false;
      [1, 2].forEach((k) => { this.mOn[k] = false; clearTimeout(this.brakeTimers[k]); this.hub.setMotor(k, 0); });
      this.hub.stopTone();
      this.hub.showConnected(); // 프로그램이 끝나면 다시 '연결됨(파랑)' 표시로
      this.ui.clearHighlights();
      this.hlMap.clear();
      if (was) {
        this.ui.log(this.ui.t(reason === 'done' ? 'end_done' : reason === 'error' ? 'end_error' : 'end_stop'), reason === 'error' ? 'err' : 'sys');
        this.dispatchEvent(new Event('state'));
      }
    }
  }
  function safe(fn) { try { return fn(); } catch (e) { return false; } }

  window.WeDo = { Hub, Runtime, DEV, DEV_NAME, COLOR_RGB };
})();
