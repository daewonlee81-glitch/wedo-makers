import json, pathlib, base64
R = pathlib.Path(__file__).parent
B = R / "node_modules/blockly"
src = (R / "src/index.html").read_text(encoding="utf-8")
blockly = "\n".join((B / f).read_text(encoding="utf-8") for f in
                    ["blockly_compressed.js", "blocks_compressed.js", "javascript_compressed.js", "python_compressed.js"])
# Blockly 기본 블록 번역: 각 언어 파일을 따로 객체로 담아 두고, 언어를 바꿀 때 Blockly.Msg 에 덮어쓴다
msgs = "window.BLOCKLY_MSGS = {};\n" + "\n".join(
    f"window.BLOCKLY_MSGS[{json.dumps(code)}] = (function () {{ var root = {{ Blockly: {{ Msg: {{}} }} }}; (function () {{\n"
    + (B / f"msg/{code}.js").read_text(encoding="utf-8").replace("'use strict';", "")
    + "\n}).call(root); return root.Blockly.Msg; })();"
    for code in ["en", "ko", "ja", "zh-hans", "es"])
py = (R / "src/wedo2.py").read_text(encoding="utf-8")
def safe(js): return js.replace("</script", "<\\/script")
rep = {
    "/*__BLOCKLY__*/": safe(blockly),
    "/*__WEDO2PY__*/": safe(json.dumps(py, ensure_ascii=False)),
    "/*__MSGS__*/": safe(msgs),
    "/*__I18N__*/": safe((R / "src/i18n.js").read_text(encoding="utf-8")),
    "/*__BLOCKS__*/": safe((R / "src/blocks.js").read_text(encoding="utf-8")),
    "/*__CAMERA__*/": safe((R / "src/camera.js").read_text(encoding="utf-8")),
    "/*__TUTOR__*/": safe((R / "src/tutor.js").read_text(encoding="utf-8")),
    "/*__HUB__*/": safe((R / "src/hub.js").read_text(encoding="utf-8")),
    "__LOGO__": "data:image/png;base64," + base64.b64encode((R / "assets/logo.png").read_bytes()).decode(),
    "__FAVICON__": "data:image/png;base64," + base64.b64encode((R / "assets/favicon.png").read_bytes()).decode(),
    "/*__APP__*/": safe((R / "src/app.js").read_text(encoding="utf-8")),
}
for k, v in rep.items():
    assert k in src, k
    src = src.replace(k, v)
out = R  # GitHub Pages 는 저장소 루트의 index.html 을 서비스
(out / "index.html").write_text(src, encoding="utf-8")
(out / "wedo2.py").write_text(py, encoding="utf-8")
# AI 카메라: MediaPipe 라이브러리와 모델을 같은 사이트에 함께 올린다 (외부 서버가 막혀도 동작)
import shutil
MP = R / "node_modules/@mediapipe/tasks-vision"
vend = out / "vendor/tasks-vision"
(vend / "wasm").mkdir(parents=True, exist_ok=True)
shutil.copy(MP / "vision_bundle.mjs", vend / "vision_bundle.mjs")
for f in ["vision_wasm_internal.js", "vision_wasm_internal.wasm"]:
    shutil.copy(MP / "wasm" / f, vend / "wasm" / f)
(vend / "LICENSE.txt").write_text("MediaPipe Tasks Vision — Apache License 2.0 — https://github.com/google-ai-edge/mediapipe\n", encoding="utf-8")
if (R / "models").resolve() != (out / "models").resolve():
    shutil.copytree(R / "models", out / "models", dirs_exist_ok=True)
print("ok", len(src) // 1024, "KB")
