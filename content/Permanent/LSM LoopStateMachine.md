---
tags:
  - public
created: '2026-03-31T12:16:29.000Z'
updated: '2026-04-22T05:41:21.000Z'
---
글쓰기를 미루다보니 랄프 루프는 이제 구시대 산물이 된 것 같지만, 배우면서 쌓아나간 LSM 개념을 공유하고자 합니다.

---

저의 팀 동료가 LLM이 프론트엔드를 짤 때 상태관리를 못한다며 State와 Action으로 최종 상태가 결정되는 State Machine을 디자인해서 LLM한테 그것을 기반으로 코드를 짜게한 것을 공유해주셨어요.

한창 하네스 엔지니어링과 Ralph Loop에 관심을 가지고 삽질을 하고 있던 터라, State Machine 이라는 개념이 여러 Loop를 정의하는데 쓰일 수 있지 않을까라는 생각이 들었습니다.

Ralph Loop는 끝날때까지 돈다는 개념입니다. 시작 상태에서 완성 상태로 전이하는데, 그 중간에 개발 상태에서 루프를 돕니다. while문 하나 쓰면 될것 처럼 생겼지만, 막상 구현하라고 하면 생각할게 있습니다. 중간에 에러 상태로 빠지면 어떻게 할 것이고, 무한이라고는 했지만 진짜로 무한으로 돌면 안되기 때문에 어느정도 리밋도 주어야합니다.

하나의 코드에 상태관리, 상태전이, AI실행, 이벤트 실행등이 복잡하게 얽혀있으면 엣지케이스들이 발생합니다. 그래서 저는 Engine, Policy, Observer 세개의 구성요소로 책임을 나누어 관리합니다.

Engine은 현재 상태 값에 따라 프로그래밍적으로 실행합니다. 보통 LLM을 호출합니다.
Policy는 Engine의 실행결과에 따라서 어떤 상태로 전이할지를 결정하는 directive를 반환합니다. Directive에 따라서 상태 전이가 일어나고 다시 Engine이 동작합니다.
Observer는 모든 이벤트와 상태전이를 듣고 처리하는 상태에는 관여하지못하는 read-only 구성요소 입니다.

상세 설명과 애니메이션은 https://lsm.spechub.org/ 에 있습니다.

---

이 정의는 상태 기반 모델링 언어인 TLA+로 완벽하게 동작함이 검증될 수 있고, LLM이 TLA+ 스펙 문서를 읽고 프로그램을 작성하면 줄글로 프로그램을 묘사했을 때 보다 더 안정적인 결과물을 얻을 수 있습니다. 제 레파지토리에는 TLA+ 보다 조금 더 상위 언어인 quint를 이용한 스펙 파일들이 있습니다. https://github.com/siisee11/loop-state-machine.spec

---

LSM의 좋은 점은 이 안정성과 구조를 유지하면서 꽤나 확장성 있는 개념이라는 점입니다. 

기본적인 랄프 에이전트를 설계한다면, plan, implement, pr 세개의 state로 구성하면 됩니다.
앤트로픽의 [# Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) 문서에 나온 GANs에서 영감을 받은 구조를 설계한다면, plan, contract, generate, evaluate 네개의 state로 구성하면 됩니다.
Andrej Karpathy의 autoresearch 구조도 setup, baseline, propose, run, adjudication 의 5개의 state로 구성할 수 있습니다.

LSM을 사용하면 어떤 루프든 100% 닫을 수 있습니다.
