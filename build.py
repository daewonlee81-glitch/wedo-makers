import json, pathlib, base64
R = pathlib.Path(__file__).parent
B = R / "node_modules/blockly"
src = (R / "src/index.html").read_text(encoding="utf-8")
blockly = "\n".join((B / f).read_text(encoding="utf-8") for f in
                    ["blockly_compressed.js", "msg/ko.js", "blocks_compressed.js", "javascript_compressed.js", "python_compressed.js"])
py = (R / "src/wedo2.py").read_text(encoding="utf-8")
def safe(js): return js.replace("</script", "<\\/script")
rep = {
    "/*__BLOCKLY__*/": safe(blockly),
    "/*__WEDO2PY__*/": safe(json.dumps(py, ensure_ascii=False)),
    "/*__BLOCKS__*/": safe((R / "src/blocks.js").read_text(encoding="utf-8")),
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
print("ok", len(src) // 1024, "KB")
