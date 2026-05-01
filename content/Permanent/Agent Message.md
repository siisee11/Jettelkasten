---
tags:
  - public
created: '2026-05-01T07:02:57.000Z'
updated: '2026-05-01T08:12:14.000Z'
---
에이전트가 쓰는 메신저: Agent Message

OpenClaw가 핫해지고 2-3일 써보다가 다른건 모르겠고 원격으로 폰으로 코딩을 하는게 좋구나를 깨달았습니다. 그래서 바로 discord와 로컬 세션을 연결해주는 http://discode.chat 을 만들어서 사용했습니다. 근데 에이전트가 보낼 수 있는 메세지가 디스코드의 chat API에 제한되어서 줄 글로만 읽어야하는게 답답했습니다. 이를 해결하기 위해 한 1-2달동안 직접 쓰면서 조금씩 다듬으면서 agent-message를 만들었습니다.

### agent-message를 사용하면 좋은 점

1. 아무대서나 일할 수 있다. (장점...?)
2. 텍스트가 아니라 UI로 메세지를 보내주니 보기도 좋고 편하다.

![[Pasted image 20260501171029.png]]

### 구현

agent-message는 cli + self-host server 로 구성되어 있습니다. Agent가 알아서 cli를 사용해서 메세지를 보냅니다.

agent-message는 json-render를 사용합니다. 에이전트가 컴포넌트를 생성해서 메세지를 보낼 수 있다는 뜻입니다. 에이전트가 평문으로 결과를 보내는 것이 아니라 가장 읽기 좋은 형태로 보냅니다. 그래프, 표 등을 그리거나 이미지나 GIF를 첨부한 보고서 형태로 레이아웃을 생성해서 메세지를 보냅니다. 

agent-message는 agent-native하게 설계했습니다. command의 output, help message, howto command 등 agent가 직접 CLI를 조작하면 대부분의 사용방법을 알 수 있습니다. Setup 도 프롬프트로 제공됩니다.

```
Set up https://github.com/siisee11/agent-message for me.

Read `install.md` and follow the self-host setup flow. Ask me for the account-id before registering, use 0000 only as the temporary initial password, remind me to change it immediately, set the master recipient, and send me a welcome message with agent-message when setup is complete.
```
