"""
wedo2.py — LEGO WeDo 2.0 허브를 Python 으로 제어하는 라이브러리
(위두 메이커스에서 생성한 Python 코드를 그대로 실행하기 위한 짝 라이브러리)

필요: Python 3.9+, `pip install bleak`  (키보드 블록을 쓰면 `pip install pynput` 도)
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
]

# ---------------------------------------------------------------- 상수
ALL = 0
CLOCKWISE, COUNTERCLOCKWISE = 1, -1
UP, DOWN, LEFT, RIGHT, ANY = "UP", "DOWN", "LEFT", "RIGHT", "ANY"
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
        _hub.disconnect()
        print("프로그램 종료")
