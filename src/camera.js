/* ===== AI 카메라: 스켈레톤(몸) · 손 모양 · 사물 · 색깔 인식 (MediaPipe Tasks Vision) =====
 * 좌표는 학생이 보기 쉽게 "거울 화면" 기준: x 0(왼쪽) ~ 100(오른쪽), y 0(아래) ~ 100(위).
 * 보이지 않으면 위치·개수는 -1 / 0, 참거짓은 false 를 돌려준다.
 */
(function () {
  const MP_VERSION = '1.2.2';
  // 같은 사이트에 올린 파일을 먼저 쓰고, 없으면 CDN / Google 서버에서 받는다
  const LIB_BASES = ['./vendor/tasks-vision/', `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/`];
  const MODELS = {
    pose: ['./models/pose_landmarker_lite.task', 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'],
    hand: ['./models/gesture_recognizer.task', 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task'],
    object: ['./models/efficientdet_lite0.tflite', 'https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/int8/1/efficientdet_lite0.tflite']
  };
  // MediaPipe 포즈 랜드마크 번호
  const BODY = {
    NOSE: 0, LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12, LEFT_ELBOW: 13, RIGHT_ELBOW: 14,
    LEFT_WRIST: 15, RIGHT_WRIST: 16, LEFT_HIP: 23, RIGHT_HIP: 24, LEFT_KNEE: 25, RIGHT_KNEE: 26, LEFT_ANKLE: 27, RIGHT_ANKLE: 28
  };
  const POSE_LINES = [[11, 12], [11, 13], [13, 15], [12, 14], [14, 16], [11, 23], [12, 24], [23, 24], [23, 25], [25, 27], [24, 26], [26, 28], [0, 11], [0, 12]];
  const HAND_LINES = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
  // HSV 범위 (H 0~360, S·V 0~1)
  const COLOR_RULES = {
    red: (h, s, v) => (h < 15 || h > 340) && s > 0.5 && v > 0.3,
    green: (h, s, v) => h > 85 && h < 160 && s > 0.4 && v > 0.25,
    blue: (h, s, v) => h > 195 && h < 255 && s > 0.45 && v > 0.25,
    yellow: (h, s, v) => h > 42 && h < 68 && s > 0.45 && v > 0.45
  };
  const COLOR_DRAW = { red: '#ff3b30', green: '#34c759', blue: '#0a84ff', yellow: '#ffcc00' };

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const r1 = (x) => Math.round(x * 10) / 10;

  async function firstOk(urls) {
    let lastErr;
    for (const u of urls) {
      try {
        const res = await fetch(u);
        if (res.ok) return { url: u, buf: new Uint8Array(await res.arrayBuffer()) };
        lastErr = new Error(res.status + ' ' + u);
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('download failed');
  }

  class Camera extends EventTarget {
    constructor() {
      super();
      this.video = document.createElement('video');
      this.video.playsInline = true; this.video.muted = true;
      this.stream = null; this.running = false;
      this.want = { pose: false, hand: false, object: false, color: false };
      this.tasks = {}; this.loading = {}; this.errors = {};
      this.vision = null; this.fileset = null;
      this.pose = null; // 33개 랜드마크 (정규화 좌표)
      this.hand = null; // { lm: 21개, gesture }
      this.objects = []; // { name, x, y, w, h, score } (거울 화면 좌표, 0~100)
      this.colors = {};
      this.fps = 0; this._frames = 0; this._fpsT = performance.now();
      this.canvas = null; this.ctx = null;
      this._work = document.createElement('canvas'); this._work.width = 80; this._work.height = 60;
      this._wctx = this._work.getContext('2d', { willReadFrequently: true });
      this._lastTs = 0; this._turn = 0;
    }

    static support() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return 'unsupported';
      if (!window.isSecureContext) return 'insecure';
      return 'ok';
    }
    attach(canvas) { this.canvas = canvas; this.ctx = canvas.getContext('2d'); }
    get on() { return !!this.stream; }

    async start() {
      if (this.stream) return;
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }, audio: false });
      this.video.srcObject = this.stream;
      await this.video.play();
      this.running = true;
      this._emit();
      this._loop();
    }
    stop() {
      this.running = false;
      if (this.stream) this.stream.getTracks().forEach((tr) => tr.stop());
      this.stream = null; this.video.srcObject = null;
      this.pose = null; this.hand = null; this.objects = []; this.colors = {};
      if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this._emit();
    }

    /* --- 모델 준비 --- */
    async _lib() {
      if (this.vision) return this.vision;
      let lastErr;
      for (const base of LIB_BASES) {
        try {
          const mod = await import(base + 'vision_bundle.mjs');
          this.fileset = await mod.FilesetResolver.forVisionTasks(new URL(base + 'wasm', location.href).href);
          this.vision = mod; return mod;
        } catch (e) { lastErr = e; }
      }
      throw lastErr;
    }
    async enable(mode, on = true) {
      this.want[mode] = on;
      this._emit();
      if (!on || mode === 'color' || this.tasks[mode]) return;
      if (this.loading[mode]) return this.loading[mode];
      this.loading[mode] = (async () => {
        try {
          const v = await this._lib();
          const { buf } = await firstOk(MODELS[mode]);
          const make = async (delegate) => {
            const base = { modelAssetBuffer: buf, delegate };
            if (mode === 'pose') return v.PoseLandmarker.createFromOptions(this.fileset, { baseOptions: base, runningMode: 'VIDEO', numPoses: 1 });
            if (mode === 'hand') return v.GestureRecognizer.createFromOptions(this.fileset, { baseOptions: base, runningMode: 'VIDEO', numHands: 1 });
            return v.ObjectDetector.createFromOptions(this.fileset, { baseOptions: base, runningMode: 'VIDEO', scoreThreshold: 0.4, maxResults: 8 });
          };
          try { this.tasks[mode] = await make('GPU'); } catch (e) { this.tasks[mode] = await make('CPU'); }
          delete this.errors[mode];
        } catch (e) {
          this.errors[mode] = e && e.message ? e.message : String(e);
          this.want[mode] = false;
        } finally {
          delete this.loading[mode];
          this._emit();
        }
      })();
      return this.loading[mode];
    }
    isReady(mode) { return mode === 'color' ? this.on : !!(this.on && this.tasks[mode]); }
    status(mode) {
      if (this.errors[mode]) return 'error';
      if (this.loading[mode]) return 'loading';
      if (!this.want[mode]) return 'off';
      return this.isReady(mode) ? 'ready' : 'loading';
    }
    _emit() { this.dispatchEvent(new Event('change')); }

    /* --- 매 프레임 --- */
    _loop() {
      if (!this.running) return;
      const v = this.video;
      if (v.readyState >= 2) {
        const now = performance.now();
        const ts = Math.max(this._lastTs + 1, Math.round(now));
        this._lastTs = ts;
        // 무거운 모델은 번갈아 돌려 화면이 끊기지 않게 한다
        const heavy = ['pose', 'hand', 'object'].filter((m) => this.want[m] && this.tasks[m]);
        const pick = heavy.length ? heavy[this._turn++ % heavy.length] : null;
        try {
          if (pick === 'pose') { const r = this.tasks.pose.detectForVideo(v, ts); this.pose = r.landmarks && r.landmarks[0] ? r.landmarks[0] : null; }
          if (pick === 'hand') {
            const r = this.tasks.hand.recognizeForVideo(v, ts);
            this.hand = r.landmarks && r.landmarks[0] ? { lm: r.landmarks[0], gesture: (r.gestures && r.gestures[0] && r.gestures[0][0] && r.gestures[0][0].categoryName) || 'None' } : null;
          }
          if (pick === 'object') {
            const r = this.tasks.object.detectForVideo(v, ts);
            const W = v.videoWidth || 640, H = v.videoHeight || 480;
            this.objects = (r.detections || []).map((d) => {
              const b = d.boundingBox, c = d.categories[0];
              const cx = (b.originX + b.width / 2) / W, cy = (b.originY + b.height / 2) / H;
              return { name: c.categoryName, score: c.score, x: r1((1 - cx) * 100), y: r1((1 - cy) * 100), w: b.width / W, h: b.height / H, bx: 1 - (b.originX + b.width) / W, by: b.originY / H };
            });
          }
        } catch (e) { /* 프레임 하나 실패는 무시 */ }
        if (!this.want.pose) this.pose = null;
        if (!this.want.hand) this.hand = null;
        if (!this.want.object) this.objects = [];
        if (this.want.color) this._colors(); else this.colors = {};
        this._draw();
        this._frames++;
        if (now - this._fpsT > 1000) { this.fps = this._frames; this._frames = 0; this._fpsT = now; this._emit(); }
      }
      if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(() => this._loop());
      else requestAnimationFrame(() => this._loop());
    }

    _colors() {
      const c = this._wctx, W = 80, H = 60;
      c.save(); c.scale(-1, 1); c.drawImage(this.video, -W, 0, W, H); c.restore(); // 거울
      const px = c.getImageData(0, 0, W, H).data;
      const acc = {}; Object.keys(COLOR_RULES).forEach((k) => (acc[k] = { n: 0, sx: 0, sy: 0 }));
      for (let i = 0, p = 0; i < px.length; i += 4, p++) {
        const r = px[i] / 255, g = px[i + 1] / 255, b = px[i + 2] / 255;
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
        if (mx < 0.2 || d < 0.15) continue;
        let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
        h = (h * 60 + 360) % 360;
        const s = d / mx;
        for (const k in COLOR_RULES) if (COLOR_RULES[k](h, s, mx)) { const a = acc[k]; a.n++; a.sx += p % W; a.sy += (p / W) | 0; }
      }
      const out = {};
      for (const k in acc) {
        const a = acc[k], size = a.n / (W * H) * 100;
        out[k] = size >= 1.5 ? { seen: true, x: r1(a.sx / a.n / (W - 1) * 100), y: r1(100 - a.sy / a.n / (H - 1) * 100), size: r1(size) } : { seen: false, x: -1, y: -1, size: r1(size) };
      }
      this.colors = out;
    }

    _draw() {
      const cv = this.canvas; if (!cv) return;
      const ctx = this.ctx, W = cv.width, H = cv.height;
      ctx.save(); ctx.scale(-1, 1); ctx.drawImage(this.video, -W, 0, W, H); ctx.restore();
      const P = (lm) => [(1 - lm.x) * W, lm.y * H];
      if (this.pose) {
        ctx.lineWidth = Math.max(2, W / 120); ctx.strokeStyle = '#00e5ff'; ctx.lineCap = 'round';
        POSE_LINES.forEach(([a, b]) => {
          const A = this.pose[a], Bp = this.pose[b];
          if ((A.visibility ?? 1) < 0.4 || (Bp.visibility ?? 1) < 0.4) return;
          ctx.beginPath(); ctx.moveTo(...P(A)); ctx.lineTo(...P(Bp)); ctx.stroke();
        });
        ctx.fillStyle = '#fff';
        Object.values(BODY).forEach((i) => { const L = this.pose[i]; if ((L.visibility ?? 1) < 0.4) return; const [x, y] = P(L); ctx.beginPath(); ctx.arc(x, y, Math.max(3, W / 90), 0, 7); ctx.fill(); });
      }
      if (this.hand) {
        ctx.lineWidth = Math.max(2, W / 160); ctx.strokeStyle = '#ffd60a';
        HAND_LINES.forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(...P(this.hand.lm[a])); ctx.lineTo(...P(this.hand.lm[b])); ctx.stroke(); });
        ctx.fillStyle = '#ff9f0a';
        this.hand.lm.forEach((L) => { const [x, y] = P(L); ctx.beginPath(); ctx.arc(x, y, Math.max(2, W / 140), 0, 7); ctx.fill(); });
      }
      ctx.font = `700 ${Math.max(11, W / 28)}px sans-serif`;
      this.objects.forEach((o) => {
        ctx.strokeStyle = '#30d158'; ctx.lineWidth = 2;
        ctx.strokeRect(o.bx * W, o.by * H, o.w * W, o.h * H);
        const label = `${(window.CAM_LABEL && window.CAM_LABEL(o.name)) || o.name} ${Math.round(o.score * 100)}%`;
        const tw = ctx.measureText(label).width + 8;
        ctx.fillStyle = '#30d158'; ctx.fillRect(o.bx * W, o.by * H - 18, tw, 18);
        ctx.fillStyle = '#000'; ctx.fillText(label, o.bx * W + 4, o.by * H - 4);
      });
      Object.entries(this.colors).forEach(([k, c]) => {
        if (!c.seen) return;
        const x = c.x / 100 * W, y = (1 - c.y / 100) * H;
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.fillStyle = COLOR_DRAW[k];
        ctx.beginPath(); ctx.arc(x, y, Math.max(6, W / 30), 0, 7); ctx.fill(); ctx.stroke();
      });
    }

    /* --- 블록이 읽는 값 --- */
    _lm(i) { const L = this.pose && this.pose[i]; return L && (L.visibility ?? 1) >= 0.5 ? L : null; }
    personSeen() { return !!(this._lm(11) || this._lm(12) || this._lm(0)); }
    bodyPos(part, axis) {
      const L = this._lm(BODY[part]); if (!L) return -1;
      return r1(clamp(axis === 'x' ? (1 - L.x) * 100 : (1 - L.y) * 100, 0, 100));
    }
    armUp(side) {
      if (side === 'BOTH') return this.armUp('LEFT') && this.armUp('RIGHT');
      const w = this._lm(BODY[side + '_WRIST']), s = this._lm(BODY[side + '_SHOULDER']);
      return !!(w && s && w.y < s.y - 0.05);
    }
    elbowAngle(side) {
      const s = this._lm(BODY[side + '_SHOULDER']), e = this._lm(BODY[side + '_ELBOW']), w = this._lm(BODY[side + '_WRIST']);
      if (!s || !e || !w) return -1;
      const a = [s.x - e.x, s.y - e.y], b = [w.x - e.x, w.y - e.y];
      const cos = (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b) || 1);
      return Math.round(Math.acos(clamp(cos, -1, 1)) * 180 / Math.PI);
    }
    shoulderTilt() {
      // 화면 오른쪽으로 몸을 기울이면 +, 왼쪽이면 − (도)
      const l = this._lm(11), r = this._lm(12); if (!l || !r) return 0;
      const L = [(1 - l.x), l.y], R = [(1 - r.x), r.y];
      const [a, b] = L[0] < R[0] ? [L, R] : [R, L];
      return Math.round(Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI);
    }
    handSeen() { return !!this.hand; }
    gestureIs(g) { return !!(this.hand && this.hand.gesture === g); }
    fingerCount() {
      if (!this.hand) return 0;
      const lm = this.hand.lm, d = (a, b) => Math.hypot(lm[a].x - lm[b].x, lm[a].y - lm[b].y);
      let n = 0;
      [[8, 6], [12, 10], [16, 14], [20, 18]].forEach(([tip, pip]) => { if (d(tip, 0) > d(pip, 0) * 1.1) n++; });
      if (d(4, 9) > d(3, 9) * 1.12 && d(4, 17) > d(5, 17) * 0.9) n++;
      return n;
    }
    handPos(axis) {
      if (!this.hand) return -1;
      const L = this.hand.lm[9]; // 손바닥 가운데
      return r1(clamp(axis === 'x' ? (1 - L.x) * 100 : (1 - L.y) * 100, 0, 100));
    }
    _objs(name) { return this.objects.filter((o) => name === 'any' || o.name === name).sort((a, b) => b.score - a.score); }
    objectSeen(name) { return this._objs(name).length > 0; }
    objectPos(name, axis) { const o = this._objs(name)[0]; return o ? o[axis] : -1; }
    objectCount(name) { return this._objs(name).length; }
    colorSeen(c) { return !!(this.colors[c] && this.colors[c].seen); }
    colorPos(c, axis) { const v = this.colors[c]; if (!v) return axis === 'size' ? 0 : -1; return v[axis]; }

    summary() {
      return {
        person: this.want.pose ? this.personSeen() : null,
        gesture: this.want.hand ? (this.hand ? this.hand.gesture : null) : undefined,
        fingers: this.want.hand && this.hand ? this.fingerCount() : null,
        objects: this.want.object ? [...new Set(this.objects.map((o) => o.name))] : undefined,
        colors: this.want.color ? Object.keys(this.colors).filter((k) => this.colors[k].seen) : undefined
      };
    }
  }

  window.WeCam = { Camera, BODY };
})();
