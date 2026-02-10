---
tags:
  - public
created: '2024-03-24T03:22:20.000Z'
updated: '2024-03-24T03:22:20.000Z'
---
[[../Permanent/meetup|meetup]]

With Liner
프로덕션 레벨에서 쓰려면?


# LLM Safety & Security

AIM Intelligence 창업
(LLM 보안 솔루션)

## LLM의 취약점

알려져있듯
- 할루시네이션
- 제일브레이킹
- 트로이젠 어택, RLHF Poisoning

LLM의 특성상
* Safety Training 할때 안본 인풋들에 대해서 어떻게 반응할 지 모른다.
* 우리가 보는 LLM은 빙산의 일각이다

최근에 뜨고 있는 Multi Modal도 
* LLM을 기조에 두고 있기 때문에 똑같은 취약점이 있고
* 더 심하다.


### LLM의 Security를 높히는 방법

* 트레이닝 과정에서 Safety에 관련된 내용도 같이 트레이닝 시킴
	* GPT4 System Card 를 보면 Alignment를 위해서 어떻게 했는지 볼 수 있음
* 별로의 디텍션 모델
	* 오버헤드가 있고
	* 새로운 어텍에 대해서 또 당할듯
* 연구
	* 깨끗한 인풋만 받아서 사전에 문제를 차단

문제
* 상충되는 Objective를 트레이닝하니까 잘 못한다
* Safety Training 케이스가 훨씬 적어서 안 따르는 경우가 있음.

### LLM 어플리케이션 특징

* 좀 더 자동화 되어 있다.
* 더 권한이 있음
* 룰 베이스로 필터 걸기 더 어려움

### Robot + LLM

아직 초기.
시스템 프롬프트에 아시모프 로봇 3원칙을 입력해놨음.

### Keywords

Indirect prompt injection
Microsoft PyRIT
DecodingTrust 벤치마크


## 싸이오닉 AI 박진형

(슬라이드가 없고 말로만 이야기하셔서 거의 이해못함)

* 서비스 관점에서 튜닝이 이야기가 안되고 있다.
* RAG를 하기 위한 Vector가 많아지면 데이터베이스가 바틀넥이 될것
* 튜닝이 필요하다.

## 튜닝 방법
### SFT
Supervised Fine Tuning

### DPO
Direct Preference Optimization
* Reward model을 학습하지 않아도됨.
* 비용효율적임
* Zephyr 모델 나올때 잠깐 봤었는데, 원리는 사실 모르겠음.
* Maywell의 TinyWand 가 DPO를 이용했는데 토이라 살펴볼만하다.

### Keywords
* axolotl 라이브러리
* FuseLLM

### 내가 질문함
(아무도 손안들길래..)

Q. 튜닝하는건 오픈소스로 튜닝하는건가?
예스

Q. 오픈소스로 튜닝한다면 사실 GPU 제약 같은거 때문에 작은 모델을 튜닝하는건데 효용이 어느정도 되나?
지피유 많으면 좋겠지만 제약이 있다. (?)

Q. 어떤 서비스에 주로 사용하는가?
소설형. 리수AI, Character AI


# LLM On Production

그랩(이호연)

Project Pluto 에서 SuperNews를 만들고 있음.
유튜버 뉴욕주민이랑 같이하고 있다고함. (3년전에 자주보던 유튜버였는디)

* LLM 파이프라이닝을 위해 내부툴을 만들어서 쓰고 있음.
* LLM 결국 Evaluation이 중요하다.
* Evaluation 을 위한 툴도 만들어서 쓰고 있음.





