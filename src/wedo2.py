"""
wedo2.py — LEGO WeDo 2.0 허브를 Python 으로 제어하는 라이브러리
(위두 메이커스에서 생성한 Python 코드를 그대로 실행하기 위한 짝 라이브러리)

필요: Python 3.9+, `pip install bleak`
     키보드 블록을 쓰면 `pip install pynput`
     AI 카메라 블록을 쓰면 `pip install mediapipe opencv-python`
사용 예:

    from wedo2 import *

    @on_start
    def main():
        light_color(GREEN)
        motor_on_for(1, 2)

    run()
"""
import asyncio
import sys
import threading
import time

try:
    from bleak import BleakClient, BleakScanner
except ImportError:  # pragma: no cover
    sys.exit("bleak 패키지가 필요합니다.  pip install bleak  를 먼저 실행하세요.")

__all__ = [
    "on_start", "on_button", "on_key", "when", "run", "is_key_pressed",
    "motor_on", "motor_off", "motor_on_for", "motor_power", "motor_direction", "motor_reverse",
    "light_color", "light_rgb", "light_off", "play_tone", "stop_sound",
    "distance", "is_tilted", "tilt_angle", "is_button_pressed", "timer", "reset_timer",
    "wait", "wait_until", "stop_all",
    "ALL", "CLOCKWISE", "COUNTERCLOCKWISE", "UP", "DOWN", "LEFT", "RIGHT", "ANY",
    "RED", "ORANGE", "YELLOW", "GREEN", "CYAN", "BLUE", "PURPLE", "PINK", "WHITE",
    # AI 카메라
    "BOTH", "is_person_seen", "is_arm_up", "body_x", "body_y", "elbow_angle", "shoulder_tilt",
    "is_hand_seen", "is_gesture", "finger_count", "hand_x", "hand_y",
    "is_object_seen", "object_x", "object_y", "object_count",
    "is_color_seen", "color_x", "color_y", "color_size",
    # AI 학습
    "load_learning", "learn_color", "is_learned", "learned_name", "learned_confidence",
]

# ---------------------------------------------------------------- 상수
ALL = 0
CLOCKWISE, COUNTERCLOCKWISE = 1, -1
UP, DOWN, LEFT, RIGHT, ANY = "UP", "DOWN", "LEFT", "RIGHT", "ANY"
BOTH = "BOTH"
RED = (255, 0, 0)
ORANGE = (255, 70, 0)
YELLOW = (255, 190, 0)
GREEN = (0, 255, 0)
CYAN = (0, 200, 255)
BLUE = (0, 0, 255)
PURPLE = (140, 0, 255)
PINK = (255, 0, 110)
WHITE = (255, 255, 255)


def _u(short):
    return f"0000{short}-1212-efde-1523-785feabcd123"


SVC_DEVICE = _u("1523")
CH_BUTTON = _u("1526")
CH_ATTACHED_IO = _u("1527")
CH_INPUT_VALUES = _u("1560")
CH_INPUT_COMMAND = _u("1563")
CH_OUTPUT_COMMAND = _u("1565")
DEV_MOTOR, DEV_LED, DEV_TILT, DEV_DISTANCE = 1, 23, 34, 35
TILT_THRESHOLD = 15


class _Stopped(Exception):
    pass


# ---------------------------------------------------------------- 허브 연결 (백그라운드 이벤트 루프)
class _Hub:
    def __init__(self):
        self.loop = asyncio.new_event_loop()
        self.thread = threading.Thread(target=self.loop.run_forever, daemon=True)
        self.thread.start()
        self.client = None
        self.ports = {1: None, 2: None}
        self.distance = 0
        self.tilt_x = 0
        self.tilt_y = 0
        self.button = False
        self.lock = threading.Lock()
        self.last = {6: [6, 4, 3, 0, 0, 255]}  # 연결 직후 LED 는 파랑

    def call(self, coro, timeout=20):
        return asyncio.run_coroutine_threadsafe(coro, self.loop).result(timeout)

    async def _connect(self, timeout):
        print("WeDo 2.0 허브를 찾는 중… (허브의 초록 버튼을 눌러 주세요)")
        dev = await BleakScanner.find_device_by_filter(
            lambda d, adv: SVC_DEVICE.lower() in [s.lower() for s in (adv.service_uuids or [])],
            timeout=timeout,
        )
        if dev is None:
            raise RuntimeError("허브를 찾지 못했습니다. 허브 버튼을 누르고 다시 실행하세요.")
        self.client = BleakClient(dev)
        await self.client.connect()
        await self.client.start_notify(CH_INPUT_VALUES, self._on_input)
        await self.client.start_notify(CH_ATTACHED_IO, self._on_attached)
        try:
            await self.client.start_notify(CH_BUTTON, self._on_button)
        except Exception:
            pass
        await self._write(CH_INPUT_COMMAND, [1, 2, 6, DEV_LED, 1, 1, 0, 0, 0, 0, 0])  # LED → RGB 모드
        await self._write(CH_OUTPUT_COMMAND, [6, 4, 3, 0, 0, 255])  # 연결됨 표시: 파랑
        await asyncio.sleep(0.5)  # 포트 정보 수신 대기
        print(f"연결됨: {dev.name or dev.address}")

    async def _write(self, char, data):
        await self.client.write_gatt_char(char, bytes(data))

    def _on_attached(self, _sender, data):
        port = data[0]
        if port not in (1, 2):
            return
        dtype = data[3] if data[1] == 1 and len(data) > 3 else None
        self.ports[port] = dtype
        if dtype == DEV_DISTANCE:
            self.loop.create_task(self._write(CH_INPUT_COMMAND, [1, 2, port, DEV_DISTANCE, 0, 1, 0, 0, 0, 1, 1]))
        elif dtype == DEV_TILT:
            self.loop.create_task(self._write(CH_INPUT_COMMAND, [1, 2, port, DEV_TILT, 0, 1, 0, 0, 0, 0, 1]))

    def _on_input(self, _sender, data):
        if len(data) < 3:
            return
        dtype = self.ports.get(data[1])
        if dtype == DEV_DISTANCE:
            self.distance = data[2] * 10
        elif dtype == DEV_TILT and len(data) >= 4:
            self.tilt_x, self.tilt_y = data[2], data[3]

    def _on_button(self, _sender, data):
        self.button = data[0] == 1

    def output(self, data):
        # 모터·LED 는 같은 값이면 다시 보내지 않는다 (반복문 안에서 BLE 과부하 방지)
        key = data[0] if data[0] in (1, 2, 6) else None
        with self.lock:
            if key is not None and self.last.get(key) == list(data):
                return
            if key is not None:
                self.last[key] = list(data)
            self.call(self._write(CH_OUTPUT_COMMAND, data))

    def disconnect(self):
        if self.client and self.client.is_connected:
            try:
                self.call(self.client.disconnect(), timeout=5)
            except Exception:
                pass


_hub = None
_running = threading.Event()
_handlers = {"start": [], "button": [], "when": [], "key": []}
_m_power = {1: 100, 2: 100}
_m_dir = {1: 1, 2: 1}
_m_on = {1: False, 2: False}
_t0 = time.monotonic()
_keys = set()
_key_events = []  # 눌린 키 이름 대기열 (메인 루프에서 처리)
_key_listener = None


def _check():
    if not _running.is_set():
        raise _Stopped()


def _ports(p):
    return [1, 2] if int(p) == 0 else [max(1, min(2, int(p)))]


def _send_motor(port):
    if not _m_on[port]:
        val = 0
    else:
        p = max(0, min(100, float(_m_power[port])))
        val = 0 if p == 0 else round(10 + (p - 1) * 90 / 99)
        val *= _m_dir[port]
    _hub.output([port, 1, 1, int(val) & 0xFF])


# ---------------------------------------------------------------- 블록과 1:1 로 대응하는 함수
def motor_on(port=ALL):
    _check()
    for k in _ports(port):
        _m_on[k] = True
        _send_motor(k)


def motor_off(port=ALL):
    _check()
    for k in _ports(port):
        _m_on[k] = False
        _hub.output([k, 1, 1, 127])  # 브레이크


def motor_on_for(port, seconds):
    motor_on(port)
    wait(seconds)
    motor_off(port)


def motor_power(port, power):
    _check()
    for k in _ports(port):
        _m_power[k] = max(0, min(100, float(power)))
        if _m_on[k]:
            _send_motor(k)


def motor_direction(port, direction):
    _check()
    for k in _ports(port):
        _m_dir[k] = -1 if float(direction) < 0 else 1
        if _m_on[k]:
            _send_motor(k)


def motor_reverse(port=ALL):
    _check()
    for k in _ports(port):
        _m_dir[k] *= -1
        if _m_on[k]:
            _send_motor(k)


def light_rgb(r, g, b):
    _check()
    c = [max(0, min(255, int(round(float(x))))) for x in (r, g, b)]
    _hub.output([6, 4, 3] + c)


def light_color(color):
    light_rgb(*color)


def light_off():
    light_rgb(0, 0, 0)


def play_tone(frequency, seconds):
    _check()
    f = max(20, min(20000, int(round(float(frequency)))))
    ms = max(0, min(65535, int(round(float(seconds) * 1000))))
    _hub.output([5, 2, 4, f & 0xFF, (f >> 8) & 0xFF, ms & 0xFF, (ms >> 8) & 0xFF])
    wait(ms / 1000)


def stop_sound():
    _check()
    _hub.output([5, 3, 0])


def distance():
    return round(_hub.distance)


def tilt_angle(direction):
    x, y = _hub.tilt_x, _hub.tilt_y
    if direction == UP:
        return 256 - y if y > 45 else -y
    if direction == DOWN:
        return y - 256 if y > 45 else y
    if direction == LEFT:
        return 256 - x if x > 45 else -x
    if direction == RIGHT:
        return x - 256 if x > 45 else x
    return 0


def is_tilted(direction=ANY):
    if direction == ANY:
        return any(tilt_angle(d) >= TILT_THRESHOLD for d in (UP, DOWN, LEFT, RIGHT))
    return tilt_angle(direction) >= TILT_THRESHOLD


def is_button_pressed():
    return bool(_hub.button)


# ---------------------------------------------------------------- PC 키보드
def _key_name(key):
    """pynput 키 → 블록에서 쓰는 이름 ('space', 'up', 'a', '1' …). 한/영 상태와 무관하게 동작."""
    from pynput import keyboard as kb
    special = {kb.Key.space: "space", kb.Key.enter: "enter", kb.Key.up: "up",
               kb.Key.down: "down", kb.Key.left: "left", kb.Key.right: "right"}
    if key in special:
        return special[key]
    vk = getattr(key, "vk", None)
    if vk is not None:
        if 65 <= vk <= 90:   # Windows 가상키 A~Z
            return chr(vk).lower()
        if 48 <= vk <= 57:
            return chr(vk)
        if 96 <= vk <= 105:  # 숫자 키패드
            return str(vk - 96)
    ch = getattr(key, "char", None)
    if ch and ch.isascii() and ch.isalnum():
        return ch.lower()
    return None


def _start_keyboard():
    global _key_listener
    if _key_listener is not None:
        return
    try:
        from pynput import keyboard as kb
    except ImportError:
        print("키보드 블록을 쓰려면  pip install pynput  을 먼저 실행하세요.")
        return

    def press(key):
        k = _key_name(key)
        if k and k not in _keys:
            _keys.add(k)
            _key_events.append(k)

    def release(key):
        _keys.discard(_key_name(key))

    _key_listener = kb.Listener(on_press=press, on_release=release)
    _key_listener.daemon = True
    _key_listener.start()


def is_key_pressed(key="any"):
    _start_keyboard()
    return bool(_keys) if key == "any" else key in _keys


def timer():
    return round(time.monotonic() - _t0, 2)


def reset_timer():
    global _t0
    _t0 = time.monotonic()


def wait(seconds):
    _check()
    end = time.monotonic() + max(0.0, float(seconds))
    while True:
        left = end - time.monotonic()
        if left <= 0:
            break
        time.sleep(min(left, 0.04))
        _check()


def wait_until(condition):
    _check()
    while not condition():
        time.sleep(0.02)
        _check()


def stop_all():
    _running.clear()
    raise _Stopped()



# ---------------------------------------------------------------- AI 카메라 (mediapipe + opencv)
# 웹의 위두 메이커스와 같은 규칙: 거울 화면 기준 x 0(왼쪽)~100(오른쪽), y 0(아래)~100(위), 안 보이면 -1
_MODEL_URLS = {
    "pose": "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
    "hand": "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
    "object": "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/int8/1/efficientdet_lite0.tflite",
    "learn": "https://storage.googleapis.com/mediapipe-models/image_embedder/mobilenet_v3_small/float32/1/mobilenet_v3_small.tflite",
}
_KNN_K, _CONF_MIN = 7, 60
_learn_classes = []   # [(name, numpy 배열 N×D)]
_learn_colors = {}    # name → (hue, hue_range, min_s, min_v)
_BODY = {"NOSE": 0, "LEFT_SHOULDER": 11, "RIGHT_SHOULDER": 12, "LEFT_ELBOW": 13, "RIGHT_ELBOW": 14,
         "LEFT_WRIST": 15, "RIGHT_WRIST": 16, "LEFT_HIP": 23, "RIGHT_HIP": 24, "LEFT_KNEE": 25,
         "RIGHT_KNEE": 26, "LEFT_ANKLE": 27, "RIGHT_ANKLE": 28}
_POSE_LINES = [(11, 12), (11, 13), (13, 15), (12, 14), (14, 16), (11, 23), (12, 24), (23, 24),
               (23, 25), (25, 27), (24, 26), (26, 28)]
_HAND_LINES = [(0, 1), (1, 2), (2, 3), (3, 4), (0, 5), (5, 6), (6, 7), (7, 8), (5, 9), (9, 10), (10, 11),
               (11, 12), (9, 13), (13, 14), (14, 15), (15, 16), (13, 17), (17, 18), (18, 19), (19, 20), (0, 17)]
_COLOR_RULES = {  # H 0~360, S·V 0~1
    "red": lambda h, s, v: ((h < 15) | (h > 340)) & (s > 0.5) & (v > 0.3),
    "green": lambda h, s, v: (h > 85) & (h < 160) & (s > 0.4) & (v > 0.25),
    "blue": lambda h, s, v: (h > 195) & (h < 255) & (s > 0.45) & (v > 0.25),
    "yellow": lambda h, s, v: (h > 42) & (h < 68) & (s > 0.45) & (v > 0.45),
}


class _Camera:
    def __init__(self):
        self.lock = threading.Lock()
        self.cap = None
        self.tasks = {}
        self.want = set()
        self.pose = None
        self.hand = None      # (landmarks, gesture)
        self.objects = []     # dict(name, x, y, score, box)
        self.colors = {}
        self.view = None
        self.thread = None
        self.closed = False
        self.done = set()   # 한 번 이상 처리된 기능
        self.pred = None     # (클래스 이름, 확신도 %, {이름: %})

    # --- 준비 ---
    def _libs(self):
        try:
            import cv2  # noqa: F401
            import mediapipe  # noqa: F401
        except ImportError:
            raise SystemExit("AI 카메라 블록을 쓰려면  pip install mediapipe opencv-python  을 먼저 실행하세요.")

    def _model(self, mode):
        import os
        import urllib.request
        folder = os.path.join(os.path.expanduser("~"), ".wedo2_models")
        os.makedirs(folder, exist_ok=True)
        path = os.path.join(folder, _MODEL_URLS[mode].rsplit("/", 1)[1])
        if not os.path.exists(path):
            print(f"AI 모델 받는 중… ({mode})")
            urllib.request.urlretrieve(_MODEL_URLS[mode], path + ".part")
            os.replace(path + ".part", path)
        return path

    def need(self, mode):
        if mode in self.want or self.closed:
            return
        self._libs()
        with self.lock:
            if mode in self.want:
                return
            import cv2
            from mediapipe.tasks import python as mpt
            from mediapipe.tasks.python import vision
            if self.cap is None:
                self.cap = cv2.VideoCapture(0)
                if not self.cap.isOpened():
                    raise RuntimeError("카메라를 열 수 없습니다.")
            if mode != "color":
                base = mpt.BaseOptions(model_asset_path=self._model(mode))
                video = vision.RunningMode.VIDEO
                if mode == "pose":
                    self.tasks[mode] = vision.PoseLandmarker.create_from_options(
                        vision.PoseLandmarkerOptions(base_options=base, running_mode=video, num_poses=1))
                elif mode == "hand":
                    self.tasks[mode] = vision.GestureRecognizer.create_from_options(
                        vision.GestureRecognizerOptions(base_options=base, running_mode=video, num_hands=1))
                elif mode == "learn":
                    self.tasks[mode] = vision.ImageEmbedder.create_from_options(
                        vision.ImageEmbedderOptions(base_options=base, running_mode=video, l2_normalize=True, quantize=False))
                else:
                    self.tasks[mode] = vision.ObjectDetector.create_from_options(
                        vision.ObjectDetectorOptions(base_options=base, running_mode=video,
                                                     score_threshold=0.4, max_results=8))
            self.want.add(mode)
            if self.thread is None:
                self.thread = threading.Thread(target=self._loop, daemon=True)
                self.thread.start()
        # 이 기능의 첫 결과가 나올 때까지 기다린다 (최대 5초)
        end = time.monotonic() + 5
        while mode not in self.done and time.monotonic() < end and not self.closed:
            time.sleep(0.02)

    # --- 매 프레임 ---
    def _loop(self):
        import cv2
        import numpy as np
        import mediapipe as mp
        turn = 0
        last_ts = 0
        while not self.closed:
            ok, frame = self.cap.read()
            if not ok:
                time.sleep(0.02)
                continue
            ts = max(last_ts + 1, int(time.monotonic() * 1000))
            last_ts = ts
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
            heavy = [m for m in ("pose", "hand", "object", "learn") if m in self.want]
            pick = heavy[turn % len(heavy)] if heavy else None
            turn += 1
            try:
                if pick == "pose":
                    r = self.tasks["pose"].detect_for_video(image, ts)
                    self.pose = r.pose_landmarks[0] if r.pose_landmarks else None
                    self.done.add("pose")
                elif pick == "hand":
                    r = self.tasks["hand"].recognize_for_video(image, ts)
                    if r.hand_landmarks:
                        g = r.gestures[0][0].category_name if r.gestures and r.gestures[0] else "None"
                        self.hand = (r.hand_landmarks[0], g)
                    else:
                        self.hand = None
                    self.done.add("hand")
                elif pick == "learn":
                    r = self.tasks["learn"].embed_for_video(image, ts)
                    if r.embeddings:
                        self.pred = _knn(np.asarray(r.embeddings[0].embedding, dtype=np.float32))
                    self.done.add("learn")
                elif pick == "object":
                    r = self.tasks["object"].detect_for_video(image, ts)
                    h, w = frame.shape[:2]
                    objs = []
                    for d in r.detections:
                        b, c = d.bounding_box, d.categories[0]
                        cx, cy = (b.origin_x + b.width / 2) / w, (b.origin_y + b.height / 2) / h
                        objs.append({"name": c.category_name, "score": c.score,
                                     "x": round((1 - cx) * 100, 1), "y": round((1 - cy) * 100, 1),
                                     "box": (b.origin_x, b.origin_y, b.width, b.height)})
                    self.objects = objs
                    self.done.add("object")
            except Exception:  # noqa: BLE001
                pass
            if "color" in self.want or _learn_colors:
                small = cv2.flip(cv2.resize(frame, (80, 60)), 1)
                hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV).astype(np.float32)
                H, S, V = hsv[..., 0] * 2, hsv[..., 1] / 255, hsv[..., 2] / 255
                ys, xs = np.mgrid[0:60, 0:80]
                out = {}
                rules = dict(_COLOR_RULES)
                for nm, (hue, hr, smin, vmin) in _learn_colors.items():
                    dist = np.abs(H - hue) % 360
                    dist = np.minimum(dist, 360 - dist)
                    rules[nm] = (lambda d, r, a, b: (lambda h, s, v: (d <= r) & (s >= a) & (v >= b)))(dist, hr, smin, vmin)
                for k, rule in rules.items():
                    m = rule(H, S, V)
                    n = int(m.sum())
                    size = round(n / 4800 * 100, 1)
                    if size >= 1.5:
                        out[k] = {"seen": True, "x": round(xs[m].mean() / 79 * 100, 1),
                                  "y": round(100 - ys[m].mean() / 59 * 100, 1), "size": size}
                    else:
                        out[k] = {"seen": False, "x": -1, "y": -1, "size": size}
                self.colors = out
                self.done.add("color")
            self.view = self._draw(frame)

    def _draw(self, frame):
        import cv2
        h, w = frame.shape[:2]
        img = cv2.flip(frame, 1)
        P = lambda lm: (int((1 - lm.x) * w), int(lm.y * h))  # noqa: E731
        if self.pose:
            for a, b in _POSE_LINES:
                if self.pose[a].visibility > 0.4 and self.pose[b].visibility > 0.4:
                    cv2.line(img, P(self.pose[a]), P(self.pose[b]), (255, 229, 0), 3)
            for i in _BODY.values():
                if self.pose[i].visibility > 0.4:
                    cv2.circle(img, P(self.pose[i]), 5, (255, 255, 255), -1)
        if self.hand:
            lm = self.hand[0]
            for a, b in _HAND_LINES:
                cv2.line(img, P(lm[a]), P(lm[b]), (10, 214, 255), 2)
            cv2.putText(img, self.hand[1], (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (10, 214, 255), 2)
        if self.pred and self.pred[0]:
            cv2.putText(img, f"{self.pred[0]} {self.pred[1]}%", (10, h - 16), cv2.FONT_HERSHEY_SIMPLEX, 0.9,
                        (237, 58, 124) if self.pred[1] >= _CONF_MIN else (160, 160, 160), 2)
        for o in self.objects:
            x, y, bw, bh = o["box"]
            x = w - x - bw
            cv2.rectangle(img, (int(x), int(y)), (int(x + bw), int(y + bh)), (88, 209, 48), 2)
            cv2.putText(img, f'{o["name"]} {int(o["score"] * 100)}%', (int(x), int(y) - 6),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (88, 209, 48), 2)
        for k, c in self.colors.items():
            if c["seen"]:
                cv2.circle(img, (int(c["x"] / 100 * w), int((1 - c["y"] / 100) * h)), 12, (255, 255, 255), 3)
        return img

    def show(self):
        """메인 스레드에서 부른다 (macOS 는 창을 메인 스레드에서만 그릴 수 있음)."""
        if self.view is None or self.closed:
            return
        import cv2
        cv2.imshow("WeDo Makers - AI Camera (Q: close)", self.view)
        if cv2.waitKey(1) & 0xFF in (ord("q"), ord("Q")):
            self.close()
            _running.clear()

    def close(self):
        self.closed = True
        if self.thread is not None:
            self.thread.join(timeout=1)
        for task in self.tasks.values():
            try:
                task.close()
            except Exception:  # noqa: BLE001
                pass
        self.tasks = {}
        try:
            import cv2
            if self.cap is not None:
                self.cap.release()
            cv2.destroyAllWindows()
        except Exception:  # noqa: BLE001
            pass

    # --- 값 읽기 ---
    def lm(self, part):
        if not self.pose:
            return None
        L = self.pose[_BODY[part]]
        return L if L.visibility >= 0.5 else None


_cam = _Camera()


def _clamp100(v):
    return round(max(0.0, min(100.0, v)), 1)


def is_person_seen():
    _cam.need("pose")
    return any(_cam.lm(p) for p in ("LEFT_SHOULDER", "RIGHT_SHOULDER", "NOSE"))


def body_x(part):
    _cam.need("pose")
    L = _cam.lm(part)
    return _clamp100((1 - L.x) * 100) if L else -1


def body_y(part):
    _cam.need("pose")
    L = _cam.lm(part)
    return _clamp100((1 - L.y) * 100) if L else -1


def is_arm_up(side=RIGHT):
    _cam.need("pose")
    if side == BOTH:
        return is_arm_up(LEFT) and is_arm_up(RIGHT)
    w, s = _cam.lm(side + "_WRIST"), _cam.lm(side + "_SHOULDER")
    return bool(w and s and w.y < s.y - 0.05)


def elbow_angle(side=RIGHT):
    import math
    _cam.need("pose")
    s, e, w = _cam.lm(side + "_SHOULDER"), _cam.lm(side + "_ELBOW"), _cam.lm(side + "_WRIST")
    if not (s and e and w):
        return -1
    a, b = (s.x - e.x, s.y - e.y), (w.x - e.x, w.y - e.y)
    cos = (a[0] * b[0] + a[1] * b[1]) / ((math.hypot(*a) * math.hypot(*b)) or 1)
    return round(math.degrees(math.acos(max(-1.0, min(1.0, cos)))))


def shoulder_tilt():
    """화면 오른쪽으로 몸을 기울이면 +, 왼쪽이면 − (도)"""
    import math
    _cam.need("pose")
    l, r = _cam.lm("LEFT_SHOULDER"), _cam.lm("RIGHT_SHOULDER")
    if not (l and r):
        return 0
    L, R = (1 - l.x, l.y), (1 - r.x, r.y)
    a, b = (L, R) if L[0] < R[0] else (R, L)
    return round(math.degrees(math.atan2(b[1] - a[1], b[0] - a[0])))


def is_hand_seen():
    _cam.need("hand")
    return _cam.hand is not None


def is_gesture(name):
    """'Closed_Fist', 'Open_Palm', 'Pointing_Up', 'Thumb_Up', 'Thumb_Down', 'Victory', 'ILoveYou'"""
    _cam.need("hand")
    return bool(_cam.hand and _cam.hand[1] == name)


def finger_count():
    import math
    _cam.need("hand")
    if not _cam.hand:
        return 0
    lm = _cam.hand[0]
    d = lambda a, b: math.hypot(lm[a].x - lm[b].x, lm[a].y - lm[b].y)  # noqa: E731
    n = sum(1 for tip, pip in ((8, 6), (12, 10), (16, 14), (20, 18)) if d(tip, 0) > d(pip, 0) * 1.1)
    if d(4, 9) > d(3, 9) * 1.12 and d(4, 17) > d(5, 17) * 0.9:
        n += 1
    return n


def hand_x():
    _cam.need("hand")
    return _clamp100((1 - _cam.hand[0][9].x) * 100) if _cam.hand else -1


def hand_y():
    _cam.need("hand")
    return _clamp100((1 - _cam.hand[0][9].y) * 100) if _cam.hand else -1


def _objs(name):
    _cam.need("object")
    return sorted((o for o in _cam.objects if name == "any" or o["name"] == name), key=lambda o: -o["score"])


def is_object_seen(name):
    """COCO 이름: 'person', 'cup', 'bottle', 'sports ball', 'cell phone', 'book' … 또는 'any'"""
    return bool(_objs(name))


def object_x(name):
    o = _objs(name)
    return o[0]["x"] if o else -1


def object_y(name):
    o = _objs(name)
    return o[0]["y"] if o else -1


def object_count(name):
    return len(_objs(name))


def _color(name):
    """기본 색 'red'·'green'·'blue'·'yellow' 또는 learn_color 로 등록한 이름"""
    _cam.need("color")
    return _cam.colors.get(name, {"seen": False, "x": -1, "y": -1, "size": 0})


def is_color_seen(name):
    """'red', 'green', 'blue', 'yellow'"""
    return _color(name)["seen"]


def color_x(name):
    return _color(name)["x"]


def color_y(name):
    return _color(name)["y"]


def color_size(name):
    return _color(name)["size"]



# ---------------------------------------------------------------- AI 학습 (위두 메이커스 '학습 파일'과 같은 형식)
def load_learning(path):
    """위두 메이커스의 'Python용 학습 파일 저장' 으로 받은 .json 을 불러온다 (사물 학습 + 학습한 색)."""
    import base64
    import json
    import os
    import numpy as np
    if not os.path.isabs(path):
        main = sys.modules.get("__main__")
        base = os.path.dirname(os.path.abspath(getattr(main, "__file__", "") or "."))
        if os.path.exists(os.path.join(base, path)):
            path = os.path.join(base, path)
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    _learn_classes.clear()
    for c in data.get("classes", []):
        rows = []
        for b64 in c.get("samples", []):
            v = np.frombuffer(base64.b64decode(b64), dtype=np.int8).astype(np.float32) / 127
            n = float(np.linalg.norm(v)) or 1.0
            rows.append(v / n)
        if len(rows) >= 3:
            _learn_classes.append((c["name"], np.stack(rows)))
    for c in data.get("colors", []):
        learn_color(c["name"], c["h"], c["hr"], c["smin"], c["vmin"])
    print(f"학습 파일을 불러왔습니다: 사물 {len(_learn_classes)}개, 색 {len(data.get('colors', []))}개")


def learn_color(name, hue, hue_range=14, min_s=0.3, min_v=0.2):
    """학습한 색 등록 — hue 0~360, hue_range ±도, min_s·min_v 0~1"""
    _learn_colors[name] = (float(hue), float(hue_range), float(min_s), float(min_v))


def _knn(e):
    import numpy as np
    if not _learn_classes:
        return None
    names, sims = [], []
    for nm, mat in _learn_classes:
        sims.append(mat @ e)
        names += [nm] * len(mat)
    sims = np.concatenate(sims)
    k = min(_KNN_K, len(sims))
    top = np.argsort(-sims)[:k]
    votes, total = {}, {}
    for i in top:
        votes[names[i]] = votes.get(names[i], 0) + 1
        total[names[i]] = total.get(names[i], 0) + float(sims[i])
    best = max(votes, key=lambda n: (votes[n], total[n]))
    scores = {nm: round(votes.get(nm, 0) / k * 100) for nm, _ in _learn_classes}
    return best, scores[best], scores


def is_learned(name):
    """학습한 사물이 name 인가? (확신도 60% 이상)"""
    _cam.need("learn")
    p = _cam.pred
    return bool(p and p[0] == name and p[1] >= _CONF_MIN)


def learned_name():
    _cam.need("learn")
    p = _cam.pred
    return p[0] if p and p[1] >= _CONF_MIN else ""


def learned_confidence(name):
    _cam.need("learn")
    p = _cam.pred
    return p[2].get(name, 0) if p else 0


# ---------------------------------------------------------------- 이벤트 데코레이터
def on_start(fn):
    _handlers["start"].append(fn)
    return fn


def on_button(fn):
    _handlers["button"].append({"fn": fn, "busy": False})
    return fn


def on_key(key):
    """@on_key('space') — PC 키보드의 키를 누를 때마다 실행"""
    def deco(fn):
        _handlers["key"].append({"key": key, "fn": fn, "busy": False})
        return fn
    return deco


def when(condition):
    def deco(fn):
        _handlers["when"].append({"cond": condition, "fn": fn, "busy": False, "prev": True})
        return fn
    return deco


def _thread(fn, holder=None):
    def target():
        try:
            fn()
        except _Stopped:
            pass
        except Exception as e:  # noqa: BLE001
            print(f"오류: {e!r}")
            _running.clear()
        finally:
            if holder is not None:
                holder["busy"] = False

    t = threading.Thread(target=target, daemon=True)
    t.start()
    return t


def _fire(h):
    if h["busy"]:
        return
    h["busy"] = True
    _thread(h["fn"], h)


def _safe(cond):
    try:
        return bool(cond())
    except Exception:  # noqa: BLE001
        return False


def _all_stop():
    for k in (1, 2):
        _m_on[k] = False
        try:
            _hub.output([k, 1, 1, 0])
        except Exception:  # noqa: BLE001
            pass
    try:
        _hub.output([5, 3, 0])
    except Exception:  # noqa: BLE001
        pass


def run(scan_timeout=15):
    """허브에 연결하고 등록된 이벤트 함수들을 실행합니다. Ctrl+C 로 멈춥니다."""
    global _hub
    _hub = _Hub()
    try:
        _hub.call(_hub._connect(scan_timeout), timeout=scan_timeout + 20)
    except Exception as e:  # noqa: BLE001
        print(f"연결 실패: {e}")
        return
    reset_timer()
    if _handlers["key"]:
        _start_keyboard()
    _running.set()
    starts = [_thread(fn) for fn in _handlers["start"]]
    for h in _handlers["when"]:
        h["prev"] = _safe(h["cond"])
    has_events = bool(_handlers["button"] or _handlers["when"] or _handlers["key"])
    prev_btn = is_button_pressed()
    try:
        while _running.is_set():
            btn = is_button_pressed()
            if btn and not prev_btn:
                for h in _handlers["button"]:
                    _fire(h)
            prev_btn = btn
            while _key_events:
                k = _key_events.pop(0)
                for h in _handlers["key"]:
                    if h["key"] in (k, "any"):
                        _fire(h)
            for h in _handlers["when"]:
                c = _safe(h["cond"])
                if c and not h["prev"]:
                    _fire(h)
                h["prev"] = c
            if not has_events and not any(t.is_alive() for t in starts):
                break
            if _cam.thread is not None:
                _cam.show()
            if not _hub.client.is_connected:
                print("허브 연결이 끊어졌습니다.")
                break
            time.sleep(0.025)
    except KeyboardInterrupt:
        print("\n멈춤")
    finally:
        _running.clear()
        time.sleep(0.1)
        _all_stop()
        if _cam.thread is not None:
            _cam.close()
        _hub.disconnect()
        print("프로그램 종료")
