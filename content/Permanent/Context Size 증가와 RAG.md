---
tags:
  - public
---
[[../Permanent/LLM|LLM]] [[RAG]]

[llama index 의 블로그 글](https://www.llamaindex.ai/blog/towards-long-context-rag)을 읽고...

### 큰 컨텍스트를 가진 LLM의 등장과 RAG의 관계

구글의 Gemini 1.5 pro 의 등장과 함께 이제 어마어마한 context를 정보 탐색 손실 없이 사용할 수 있는 날이 왔다. 그러면 RAG는 필요할까?

### Long Context 가 풀어주는 문제

1. Chunking Algorithm 에 대해서 손을 좀 놀 수 있다. 문서 전체가 작으면 다 때려넣거나 혹은 일정 그룹 단위로 때려넣으면 되니까!
2. 하나의 문서에 대해 Retrieval 이나 COT을 설계하는 것을 그만해도 된다. chunk 사이의 관계가 중요한 경우(Comparision등)에 답변하기가 어려웠다. 하지만 이젠 다 때려넣으면 된다!
3. Summarization이 훨씬 쉬워졌다. Context size 때문에 Summarization을 하기 위해서는 sequential refinement or hierarchical summarization 같은 'hack'이 필요했는데 이젠 그냥 한번에 해달라고 하자.
4. 대화 맥락을 추척하기 더 쉬워졌다. Context size 가 작을 때는 대화 맥락도 압축한다던가 했었는데, 그럴 필요 없다.

### RAG가 아직 필요한 문제

1. 10M 토큰도 사실 충분하지 않다. 약 40Mb의 데이터이다. 자잘한 문장, 문단을 어떻게 자를까는 더이상 고민하지 않아도 되겠지만, 기업단위에서 데이터는 Gb, Tb 단위이다.
2. Embedding Model의 context window가 크지 않아서, Retrieval 을 한다면 Retrieval 에 사용되는 chunk는 아직 작다.
3. Cost와 Latency 가 문제다. Context 가 길어지면 당연히 시간도 오래걸리고 돈도 많이든다. (1M Context: 60초, 0.5~2 달러) KV cache로 어느정도 해결할 수 있지만...
4. KV cache 로 1M 을 캐싱한다고 하면 100GB의 지피유 메모리가 필요하다.
5. Seach Engine을 부르는 것도 RAG다.