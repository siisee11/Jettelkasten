---
tags:
  - public
---
# 7 Pilars

## LLM
* LLM wrapper
* Support various llm (openAI, huggingface, cohere, etc...)

## Prompt
* "tell me a joke about {topic}"
* prompt = PromptTemplate(template, input={"topic"})

## Chain
* 요소들을 엮어서 실행가능하게 하는 것.
* ex) LLMChain 은 LLM과 Prompt를 연결함.
```python
llm_chain = LLMChain(prompt, llm)
llm_chain.run("foods")
```

## Agent & Tool
* Agent는 llm을 이용해 목표를 설정하고 목표를 달성할때까지 일을 하는 녀석
* Tool은 Agent가 일들을 수행하기 위해 쓸 수 있는 도구들
	* wikipedia
	* google search
	* math

## Memory
* Chain이나 Agent에게 상태를 추가하는 녀석
* 저장된 정보를 통해 매번 동작하기전에 이전 상태를 통해 현재 상태를 지정할 수 있게 한다.

## Document Loader
* 말 그대로 문서를 로딩해주는 것.
* langchain에는 무수히 많은 문서 타입을 text로 읽어주는 함수들이 있음.

## Indexes
* 로드한 다큐먼트를 구조화 하여 저장하여 나중에 잘 써먹을 수 있게하는 방법
* text spliter
* embedding
* vectorstore



