# AI 튜터 중계 서버 (Cloudflare Workers, 무료)

교실 전체가 AI 튜터의 **자유 질문**을 쓰려면 중계 서버를 하나 만들어 두는 것이 안전합니다.
학생 PC에는 API 키가 없고, 서버가 키를 붙여 Claude에 전달합니다. 모델과 답변 길이도 서버에서 제한합니다.

## 만들기 (약 10분)
1. https://dash.cloudflare.com 가입 → **Workers & Pages → Create → Create Worker** → 이름 예: `wedo-tutor` → Deploy
2. **Edit code** 를 눌러 기존 코드를 지우고 `cloudflare-worker.js` 내용을 붙여 넣은 뒤 **Deploy**
3. **Settings → Variables and Secrets** 에서
   - `ANTHROPIC_API_KEY` — **Secret** 으로 Anthropic API 키 (https://console.anthropic.com 에서 발급)
   - `ALLOWED_ORIGINS` — `https://daewonlee81-glitch.github.io` (위두 메이커스를 여는 주소, 여러 개면 쉼표)
4. (선택) 하루 사용량 제한: **Storage → KV** 에서 네임스페이스를 만들고 Worker 의 **Bindings** 에 이름 `USAGE` 로 연결, 변수 `DAILY_LIMIT` = `500`
5. Worker 주소(예: `https://wedo-tutor.아이디.workers.dev`)를 복사

## 위두 메이커스에 연결
AI 튜터 탭 → 오른쪽 위 **내장 튜터 / AI 연결됨** 버튼 → **중계 서버 주소** 선택 → 주소 붙여 넣기 → **연결 시험** → **저장**

설정은 그 PC의 브라우저에 저장되므로, 교실 PC마다 한 번씩 넣어 주세요.

## 요금
사용한 만큼 Anthropic API 요금이 나옵니다(요금표: https://www.anthropic.com/pricing). 기본 모델은 빠르고 저렴한 Haiku입니다. `DAILY_LIMIT` 으로 하루 최대 질문 수를 막을 수 있습니다.
