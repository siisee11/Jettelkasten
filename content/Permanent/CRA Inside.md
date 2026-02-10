---
tags:
  - public
  - programming
created: '2024-07-16T01:50:48.000Z'
updated: '2026-02-09T09:20:34.000Z'
---
# CRA

Create React App는 최신 웹을 만들기 위해서 필요한 도구들을 사용하기 쉽게 묶어놓은 툴

- [[Transcompiler]] 트랜스컴파일러 (babel)
- [[Bundler]] 번들러 


# Babel

Babel is a free and open-source JavaScript transcompiler that is mainly used to convert ECMAScript 2015+ code into backwards-compatible JavaScript code that can be run by older JavaScript engines. It allows web developers to take advantage of the newest features of the language.

새로운 문법이나 확장등을 자바스크립트 엔진으로 돌릴 수 있도록 문법 변환을 해줌.


# Webpack

A bundler is a development tool that combines multiple JavaScript code files into a single file that is production-ready and loadable in the browser.

번들링을 하지 않으면 웹페이지를 로딩할때 무수히 많은 파일을 로딩하게 됨. 이는 네트워크 연결을 많이 필요로 하고 브라우저당 한 도메인에 6개의 연결만 가능하므로 pending time이 생김.

번들러는 모듈간의 dependency를 분석하여 파일을 합쳐줌.
