---
tags:
  - public
created: '2024-02-08T00:53:16.000Z'
updated: '2026-02-09T00:24:29.882Z'
---
[[book|book]] [[network effect]] 
# The Cold Start Problem

# Meercat’s Law

개체수와 개체 증가량에 대한 법칙

미어캣의 수가 Tipping point 이하 일때, 공격을 빠르게 감지하지못해 프레덱터에게 사냥당해 개채수가 감소

미어캣 수가 Tipping point를 넘어가면 사냥당할 확률이 급격하게 낮아져서 개채수 급증

미어캣 수가 ceiling point에 도달하면 먹이 환경 등의 이슈로 더이상 개체가 늘지 않고 이후 줄거나 환경이 개선되면 늘어남

- 네트워크 효과는 긍정적인 면도 있지만 네트워크에 문제가 생기고 Tipping point를 역행할 때 스스로 붕괴하는 anti network effect도 있음

# Cold Start Theory

## The Cold Start Problem

네트워크 효과는 네트워크가 잘 형성되지 않으면 “Anti-network effect”를 발휘한다. 이를 해결하기 위해서는 atomic network를 구축해야한다. atomic network는 가장 작고 안정적인 스스로 클 수 있는 네트워크를 말한다. (Zoom의 경우에는 2명의 참가자 네트워크)

## Tipping Point

Atomic network를 구성하기도 어렵지만, 달랑하나의 Atomic network로는 부족하다. 하지만 네트워크가 커지면 새로운 네트워크는 더 빠르게 tip된다. 예시로, tinder는 University of Southern California에서 시작해서 주변 대학으로, 도시로, 세계로 뻗어나갔다. 도미노라고 생각해라.

하지만 결국 처음에는 아주 작은 승리부터 시작되었다.

## Escape Velocity

Network effect를 강화하고 성장을 유지하는 단계

Network effect가 아니라 3개의 동력으로 움직이는 단계

Acquisition effect; 저비용 고효율 user acquisition (viral growth)

Engaagement Effect; network안의 유저들의 상호작용 증가

Economic Effect; 네트워크가 커지면서 monetization level과 conversion rate가 증가하는것

# Tiny Speck

tiny speck은 Glitch라는 게임을 만드는 회사였는데, 이것이 실패하고 사내에서 활용하던 메신저를 Slack이라는 이름으로 바꾸고 사업에 성공하였다.

### Atomic network

Atomic network란 network효과를 낼 수 있는 (붕괴하지 않고 안정적인) 최소한의 단위를 말함

예를 들면 Zoom은 화상 통화를 목적으로 할때, 한명의 유저는 어떠한 가치도 만들어내지 않지만 두명의 유저가 있다면 동작한다.

Slack은 세명의 유저가 일에 대해 소통하는 것을 Atomic Network의 단위로 잡았음. 이 Atomic 네트워크에서 부터 시작해서 네트워크를 점점 키워가며 더 많은 것을 배움.

### 어떻게 첫발을 내딛는가?

결국 **atomic network**

작은 네트워크는 스스로 붕괴하려는 경향이 강하다.

안정적인 가장 작은 네트워크 (아토믹 네트워크)를 찾아야한다.

**Double-sided network**

네트워크는 보통 “sides”가 있다.

공급자와 수급자

보통 한쪽은 모으기 쉽고 한쪽은 어렵다. 어려운 쪽의 _소수의 사람이 커뮤니티의 대부분의 가치를 만든_다.

이런 Hard side 에게 어필하는 것은 때로는 매우 심플한 Killer product이다.

_줌은 너무 단순하다고 투자자나 전문가에게 혹평을 들었지만,_ 네트워크 효과를 활용해 성공했다

# Anti-network effect [[anti-network effect]]

사실 대부분이 겪을 네트워크 효과는 부정적인 효과이다. “동료 사용자가 없으면 이탈하는 효과”

- Startup Myth
    - 기술자들이 킬러앱을 개발하고 런칭하자마자 네트워크 효과에 의해 하키스틱을 그리며 세계로 뻗어나가는 스토리
- Reality
    - 처음에 반짝 유저가 생기지만 금방 흥미를 잃고 0으로 수렴
    - 그러다가 pushing을 해주면 잠깐씩 떠오르지만 다시 0으로 수렴

### Winner take all dynamic

호로위츠의 조사에 따르면 탑100 마켓플레이스 중 상위 4개가 76퍼의 그로스 레베뉴를 가져감

## What’s enough

How many users does your network need before the product experience becomes good?

X축 - 네트워크의 사이즈

Y축 - engagement metric

Slack - 최초 2000개의 메세지, 세명의 사용자

Uber - ETA 3분 이내

Facebook - 10 friends in 7 days

Zoom - 전화 걸사람과 받을사람 2명

Airbnb - 300개의 리스팅 + 100개의 리뷰

> For new products, it’s important to have a hypothesis for the size of your network even before you begin.

무작정 많은 유저를 네트워크에 포함시키는 것은 위험하다.

슬랙을 예시로 만약 답변을 잘 안하는 사람이 네트워크에 포함된다면 답장 속도가 느려져서 오히려 마이너스가 될 수 있다.

_You need the right people on the network._

같은 팀의 10명이 회사의 무작위 10명보다 좋다

_Density and interconnectedness is key_

# The atomic network

## Credit card (Bank of America)

Fresno 지역을 대상으로 바로 사용할 수 있는 카드 60,000개를 우편으로 보냄 (unsolicited mail)

각 카드는 300 에서 500 불이 들어있었음

작은 상인들 부터 공략했다

> The networked product should be launched in its simplest possible form—not fully featured—so that it has a dead simple value proposition

> “do whatever it takes”—even if it’s unscalable or unprofitable—to get momentum, without worrying about how to scale.

### Forming initial atomic network

_Grow hack_

Paypal : 5$ referral fee

Dropbox : Demo video on hacker news

Uber : Ice cream [https://www.uber.com/newsroom/uber-ice-cream2017/](https://www.uber.com/newsroom/uber-ice-cream2017/)

## Niche network

> The next big thing will start out looking like it’s for a niche network.

니치한 네트워크를 타겟으로 하면 프로덕트가 너와 너의 동료 너의 친구들을 포함하지 않기 때문에 공감하지 못해서 “저평가”하는 경우가 많다

동작하지 않을 것이다. 마켓이 너무 작다. 흥미롭지 않다…

네트워크가 커지게되면 이런생각이 틀렸음이 증명될것

## picking your atomic network

작게 작게 너가 생각하는 거 보다 더 작게

몇 백명 단위

우버 “5pm at the Caltrain station at 5th and King St.”

# The Hard Side

구하기는 어려우나 더 열정적으로 가치를 만들어내는 사람들.

## The Volunteers Who Built Wikipedia

Steven pruitt 는 영어 위키피디아의 1/3을 에디팅했다.

- 이와 같은 관계는 어느 네트워크에나 있다.
- 우버는 수십만의 드라이버가 수천만의 승객을 운반하고
- 유투브는 수백만의 유튜버가 수억의 뷰어에게 컨탠츠를 제공한다.

## Hard side versus Easy side

Hardside는 Easyside보다 가치 생산에 훨씬 많은 노력과 시간을 쓴다.

- 스팀은 게임개발자가 시간과 노력을 들여 가치를 생산
- 우버도 승객보다 운전자가 힘들다

그렇기 때문에 끌어들이기 더 힘들고

consumer는 상대적으로 끌어들이기 저렴하다

> it is imperative to have hypotheses about how a product will cater to these users from day one

아래 문제에 대답해봐라

1. Who is the hard side of your network, and how will they use the product?
2. What is the unique value proposition to the hard side?
3. How do they first hear about the app, and in what context?
4. For users on the hard side, as the network grows, why will they come back more frequently and become more engaged?
5. What makes them sticky to your network such that when a new network emerges, they will retain on your product?

## The Hard Side of Social Content Apps

### “Creators, Synthesizers, and Consumers,” by Bradley Horowitz

- 1% of the user population might start a group (or a thread within a group)
- 10% of the user population might participate actively, and actually author content whether starting a thread or responding to a thread-in-progress
- 100% of the user population benefits from the activities of the above groups (lurkers)

### Content creation pyramid

Communication (snap) → status (instagtam) → talent (TikTok)

Broad & high freq → narrower & once a week freq → even narrower & sparse

### Social feedback loop

컨탠츠 올리고 좋아요 댓글 받고 또 올리고

긍정적 소셜 피드백 루프는 크리에이터/뷰어 네트워크에서 core concept이다

만약 “서비스에 컨탠츠를 제공했는데 아무도 보지않는다면 실망할 것인가?” 에 대한 대답이 yes라면 social feedback loop가 key다

## Wikipedia’s Teeny, Tiny Hard Side

위키피디아의 0.02퍼 사람들은 왜 위키피디아에 글을 올릴까?

유틸리티? 글쓰기 더 편한 곳이 얼마나 많은데

돈? 안주는데?

지루함? 그럴리 없자나

Social Feedback, status, community dynamics

> it’s important to have a thesis for why your product will appeal to them starting on day one.

# Solve a hard problem - tinder

Hardside - 매력적인 사람 (보통 여자)

### 1 gen date app

JDate

소수(여성) 모든 메세지를 받고 다수가 응답을 못받는

소수는 피로해지고 다수는 흥미를 잃음

### 2 gen date app

eHarmony & OKCupid

모종의 장치를 통해 소수(여성)에게 몰리던 메세지를 분산해서 응답받는 사람도 늘어남

### 3 gen date app - tinder

스마트폰의 출현과 함께 등장

{ Facebook 연동으로 trust 줌

위치기반으로 IRL matching 가능성 높힘 }

스와이프를 통해 여성은 자신이 마음에 드는 사람하고만 매칭됨. 너무 매칭이 많다싶으면 스와이프를 하지 않고 현재 메세지에 집중할 수 있음 → hard side에게 더큰 벨류를 제공

## Underutilized

Uber - underutilized car

Airbnb - underutilized house

EBay - underutilized stuff

- Start with these underserved segment

# The killer product

### Zoom - simplicity

심플하다는 것 핵심에만 집중한다는 것은 사실 어려운 일이다.

고객들은 끊임없이 기능을 요구하고 경쟁사들도 수많은 기능들로 무장해온다

networked product는 하나의 뚜렷히 구별되는 기능을 잘하는 것이 특징이다

### Networked product versus everything else

- Experience
    
    networked product는 유저와 유저사이의 인터렉션을 중요시하고
    
    traditioanl product는 유저와 소프트웨어의 인터렉션을 강조한다
    
- Grow
    
    Networked product는 유저를 추가하여 성장하고
    
    Traditional product는 기능을 추가하여 성장한다
    

Example of simplicity

**Snapchat** lets you send photos to friends.

**Dropbox** is a magical folder that syncs your files.

**Uber** lets you hit a button to get a ride.

**Slack** is a chat product for your coworkers

**YouTube** lets you watch videos.

Dead Simple 기능이 누구나 할 수 있을 것 같지만 사실 그 핵심기능은 기술에 기반한다.

> The commonality between all these networked products is that they offered novel ways for people to interact

To drive network effect

1. 제품 그 아이디어 자체로는 간단해야한다
2. 경쟁자가 복제할 수 없는 복잡하고 부유하고 무한한 유저 네트워크를 형성할 수 있어야함

## Why networked product love to be free

Zoom의 pricing 정책

> I wanted Zoom to be free, at least for the basic experience, so that people could see why it was so much better. I first thought, maybe it should be limited based on participants. Maybe 3 attendees could join, but once there were 4, you’d have to pay. But that didn’t feel right. I studied Dropbox’s pricing strategy and wondered, why did they start charging at 2 gigabytes instead of 1? As I thought about it, I realized, it gave you time to use Dropbox more, and the more you used it more likely you will hit the cap and starting paying. I wanted Zoom to be the same way, so I set the limit to be 40 minutes per meeting but you could get the full experience of the product. That way, if the quality was good and you liked it, then you’d eventually pay.

처음에 홈페이지에 다운로드 버튼을 올리고 어떻게 가격을 매겨야할 지 모를때, 스탠포드의 어떤 그룹에서 돈을 내고 싶다고 2000$을 냈다

아토믹 네트워크를 구성하기 안그래도 어려운데, 요금이 있다면 더 구성하기 어렵다

## New Shifts in Behaviors and Computer Platforms

새로운 프로덕트가 생겨나는 곳

- 새로운 기술은 새로운 고객의 행동을 만든다
- 기술의 발전은 새로운 기회를 창출한다
- 사람들의 행동 변화가 일어나는 곳 (팬데믹)

killer product 와 atomic network를 구성했다면 이제 magic moment를 만들 준비가 됐다

# Magic Moments -clubhouse

프로덕트가 코어 벨류를 전달하는 순간

- 클하 초기에는 사람이없었다 종종 방이 없을 때도 있었음
- 이때는 소셜앱의 기초라고 할 수 있는 프로필도 없었고, 팔로우 같은거도 없었다
- 매직모먼트 : 언제 앱을 열든 참가하고 싶은 방이 있다

투자 라운드를 시작하고 100m$에서 1b$ 4b$로 일년안에 가치를 인정받았다

## Story of clubhouse

클럽하우스 이전에 팟캐스트를 하나의 앱에서 제작하여 올릴 수 있는 Talkshow라는 프로덕트를 개발했음

실패의 이유에대해:

앱이 너무 무거웠다. 호스트들이 여러 설정과 해야할 일들이 너무 많다. Hard side (host)의 경험을 nail하지 못했다. 녹화하는 것이기 때문에 듣는 사람은 그만큼의 퀄리티를 기대했고, 결과는 기대에 미치지 못했다

**So,** 클럽하우스는 과정을 간단하게 만들어 호스팅을 lightweight하게 만들었다. 실시간이기때문에 컨탠츠에 대한 기대가 상대적으로 낮았다.

## The Opposite of Magic Moments

매직 모먼트는 멋진 컨셉이지만 실제로 측정할 수 있다면 더 좋을 것이다.

이는 Magic moment의 반대에서부터 시작하는 것으로 할 수 있다.

우버에서는 이런 모먼트를 “Zeroes” 라고 부른다

Zeroes 는 모든 카테고리에 존재하고 유저가 zeroes를 겪으면 이탈한다.

## After the Cold Start Problem

Right feature, right network

→ magic moment (PMF)

→ 매직모먼트는 왓다는 걸 무조건 알 수 있음

# The tipping point

To take over the world, one atomic network is not enough.

아토믹 네트워크가 두개가 되고 여러개가 되다보면 프로덕트가 전체마켓을 향해 빠르게 커지는 “Tipping point”가 온다

## USC Campus, 2012

초기 Tinder가 겪은 데이팅 앱의 문제

- 데이팅앱을 부끄러워하여 바이럴이 힘듬
- 남자 여자 비율을 잘 조율하여 모두 매칭을 받을 수 있어야함
- 앱을 통해 행복해진 사람이있으면 앱을 떠남

이런 난제에 대한 해답은 University of Southern California

USC 학생들을 대상으로 틴더에서 파티를 열었는데, 파티는 완벽하게 준비되었고, 틴더를 다운로드 받아야 참석 할 수 있었다.

매력적인 사람들이 잔뜬 모인 이 파티의 참석자들은 틴더 앱의 “right user”

**most social, most hyperconneted people in USC are all on tinder**

Tinder는 어떻게 one atomic network를 구성하는지 알게되었고, 이제 할일을 다음 네트워크를 만들면 되는 것이었다. 그렇게 다른 학교로 확장하고 다음 네트워크는 항상 더 시작하기 쉬웠다. 그렇게 Tinder는 4,000 다운로드를 찍고 다음달에 15,000 그 다음달엔 500,000 다운로드를 달성했다.

**Do repeatable tactic**

**USC Party → Campus-to-Campus → Cities → International**

## Introducing the Tipping Point

틴더의 초기 핵심은 repeatable startegy를 찾았다는 것이다.

이 strategy는 대학에서 대학으로, 도시로, 나라로 틴더를 이끌었다.

이것이 바로 market 이 Tipping Point에 도달한 때 이다.

### Tipping Point에 관한 Strategies

- “Invite-Only”
    - Viral을 통해 Large network를 빨아오는데 쓰임
- “Come for the Tool, Stay for the Network”
    - Dropbox :
        - 파일을 백업하고 집에 있는 파일과 직장의 파일을 동기화 하기 위해 사용 - Tool
        - 직장동료와 파일을 공유하는 케이스 - Network
- “Flintstoning”
    - submitting links and content until eventually adding automation and community features for scale.
- “Always Be Hustlin”
    - describing the creativity and decentralized set of teams, all with its own strategies that were localized to each region.
    - Tipping point를 도달하기 위해서는 팀은 유연하게 창의적으로 네트워크를 구성해야한다.

## Invite-Only (LinkedIn)

<aside> ⚠️ **S**orry, you need an invite to sign up to this app.

</aside>

Invite-only method 은 뭐에 좋은거?

- hype를 만드는 것 (true)
- 마켓에 나가기전에 한정된 사람들로 테스트하는 것 (true)
- **네트워크 효과를 만들어 내는것 (important)**
    - Copy and paste와 같음
    - 하나의 curated network가 존재하고 이들이 invite한다면 네트워크를 복제하는 효과

LinkedIn (Cofounder, early CEO, Reid Hoffman)

> There are people like Bill Gates who are at the top of the professional hierarchy. He gets more requests for intros than he can deal with, and everyone who knows Gates will be asked for intros to him. At the launch, LinkedIn wouldn’t have made sense for people like Bill Gates. But there’s a mid-tier of successful people who are still building and hustling, who get fewer requests for intros but will actually take the meetings. This middle rank of people is where LinkedIn really worked.[30](https://play.google.com/books/reader?id=-DmuLAAAAEAJ&pg=GBS.PA341.w.0.0.0.4.0.1)

> On the first week of LinkedIn’s launch, employees and investors of the company could invite as many people as they wanted, but you couldn’t sign up from just the website. We intentionally seeded the network with the mid-tier of successful professionals that wanted to take time to connect.

Middle tier 의 curated 된 사람들로 시작해서 Invite-only functionality로 이 네트워크를 copy & paste 했다.

“Invite-only” 는 오래 지속되지는 않았고 LinkedIn의 core network가 탄탄해진 Second week에 맴버쉽을 오픈했다.

### Invite-only examples

- Facebook : require [harvard.edu](http://harvard.edu) email
- Slack : corporate email domains

### The Welcome Experience

Invite-only mechanics provide a better “welcome experience” for new users as well.

### Hype and Exclusivity

Invite-only mechanics are also closely associated with creating buzz on social media.

- Gmail:
    - 유저의 빠른 증가를 수용할 수 없어서 invite only로 제품을 출시
    - 근데 side effect로 사람들이 이것을 더 원하게 되었다.
    - 테크 역사상 최고의 마케팅 중 하나로 꼽히게됨
    - 사람들이 Gmail invitation을 사고 팔기 시작했다.
    - Gmail을 갖는 것은 대부분의 사람이 들어오지 못하는 클럽에 소속된 느낌을 주었다.
    - 지메일을 빨리가지는 것에 대해 확실한 이점이 있었다. 그것은 메일 주소 소유권이다.

### 결론

Invite-only는 물론 위험할 수 있다. 많은 사람들이 몰려올 수 있는데 스스로 그것을 제한하는 것이다.

하지만 networked product라면 이 방법의 이점을 무시할 수 없다. 초기 네트워크가 고밀도로 성장하여 결국 바이럴이되어 유기적으로 성장하게하는 것이 그것이다.

## Curating a High-Quality Network

우버는 리무진 드라이버에게 어떻게 라이더를 대해야되는지 가르쳤음. 이 방법은 스케일하지 않지만 초기의 큐레이트된 네트워크를 만들기 좋았음. 초기에 잘 잡힌 문화는 대체로 퍼져나감

Waitlist와 설문을 같이 받는 것은 사람들을 큐레이트하여 쿠레이트된 집단을 먼저 사용할 수 있게함

## How Invite-Only Products Curate Their Networks

Networked product는 그 안에 누가 있는지, 그들이 왜 있는지, 그들이 어떻게 상호작용하는지가 프로덕트만큼이나 중요하다.

# Come for the Tool, Stay for the Network

> Start with great “tool”—a product experience that is useful even for one user as a utility. Then, over time, pivot the users into a series of use cases that tap into a “network”—the part where you collaborate, share, communicate, or otherwise interact with other users.

### Hipstamatic

2009 hipstamatic이라는 카메라 필터 앱이 출시되고 밀리언 단위의 다운로드를 기록함

사진에 힙스타메틱 필터를 apply하고 다른 소셜앱에 올렸음

1.9달러 유료앱이었음

위 두가지 이유로 경쟁자들이 파고들기 쉬웠음

Hipstamatic이 성공한 그 해, burbn 이라는 브라우저 기반의 여행 프로덕트, 기획하고 사진을 공유하는, 를 만들고 있는 두명의 사람 kevin and mike

몇달을 진행한 후 너무 기능이 복잡함을 깨달음

리포커스를 해서 가장 잘하는 것에 집중해야겠다고 생각

> We wanted to focus on being really good at one thing. We saw mobile photos as an awesome opportunity to try out some new ideas. We spent 1 week prototyping a version that focused solely on photos. It was pretty awful. So we went back to creating a native version of Burbn. We actually got an entire version of Burbn done as an iPhone app, but it felt cluttered and overrun with features. It was really difficult to decide to start from scratch, but we went out on a limb, and basically cut everything in the Burbn app except for its photo, comment, and like capabilities. What remained was Instagram. (We renamed because we felt it better captured what you were doing—an instant telegram of sorts. It also sounded camera-y.)

그렇게 burbn 에서 쳐내고 쳐내서 만든것이 instagram이다.

instagram은 day1부터 네트워크 기능이 있었다.

2010년 10월 런칭하여 런칭 1주일 만에 100,000다운로드를 기록

놀랍게도 첫 몇달간 소셜기능을 주요기능이 아니었다.

무료 hipstamatic 정도로 사람들이 사용한것

그러다가 네트워크에 점점 스며들기 시작

결국에 Tool (filter)는 중요하지 않게되었지만 (80%의 포스팅이 필터를 쓰지 않는다) 인스타그램은 쭉쭉 크고있다.

### Intersection of tool and network

인스타그램 첫화면이 카메라가 아니라 피드인 것

빨간색의 노티 표시도 네트워크를 강조한것

## Underlying Patterns for Tools and Networks

**Create + share with others** (Instagram, YouTube, G Suite, LinkedIn)

**Organize + collaborate with others** (Pinterest, Asana, Dropbox)

**System of record + keep up to date with others** (OpenTable, GitHub)

**Look up + contribute with others** (Zillow, Glassdoor, Yelp)

## Why This Strategy Works, and When It Doesn’t

유저를 툴에서 네트워크로 돌리는 것은 어려울 수 있다

- 툴과 네트워크가 밀접한 관련이 없는 경우
    - 수많은 사진앱이 인스타그램과 같이 피드를 넣으려고 했지만 실패
- 관련이 깊은경우
    - 드랍박스의 경우 공유하는것은 없으면 이상한 기능
    - 자연스럽게 네트워크를 구축가능

# Paying up for launch

성공한다면 빨리 클 수 있는 전략

## coupon

1888년 코카콜라의 코파운더에의해 발명

문제 : 고객에게 홍보하자니 상점에 물건을 안팔고

상점에게 물건을 공급하자니 고객이 없다고 안받고

(Classic Chicken and egg problem)

**marketing legend Claude Hopkins**

“My life in advertising”

> So I devised a plan for making Van Camp’s Milk familiar. In a page ad, I inserted a coupon, good at any store for a ten-cent can. We paid the grocer his retail price. For three weeks we announced that this ad would appear. At the same time we told the story of Van Camp’s Evaporated Milk. We sent copies of these ads to all grocers, and told them that every customer of theirs would receive one of these coupons. It was evident that they must have Van Camp’s Milk. Every coupon meant a ten-cent sale which, if they missed it, would go to a competitor. . . . The result was almost universal distribution, and at once.

### How to solve Chicken and egg problem

“If you have a chicken and egg problem—buy the chicken.”

### Uber case

Uber는 드라이버에게 시간당 fee를 줘서 드라이버를 모집했다.

하지만 이 방법은 돈이 너무 많이 들고 sustainable하지 않기 때문에 feebased로 스무스하게 전환함

Refferal과 World of mouth를 잘 활용함.

## Financial lever for growth

### Right time

You need to nail the killer product, and prove that you can gain an atomic network, before reaching for the financial lever.

## Crypto and Its Use of Economic Incentives

네트워크 참여자에게 인센티브를 줘서

네트워크가 이기면 참여자도 이기는 관계를 만듬

## Partnerships with Larger Companies

결국 이 챕터에서 말하고자 하는 말은 돈을 써서 Tipping point를 빨리 도달할 수 있다면 좋은 전략이고 네트워크가 스스로 성장할 수 있을 때 보상을 낮춰라!

# Flintstoning

Automation 전에 인간 손으로 테스트 해보는 것

네트워크가 스스로 성장하기전에 직접 필요한 부분을 메꿔주는것

### Reddit

레딧의 파운더 steve

> No one wants to live in a ghost town. No one wants to join an empty community. In the early days, it was our job each day to make sure there was good content on the front page. We’d post it ourselves, using dozens of dummy accounts. Otherwise the community might dry up.

### Downside of flintstoning

수동으로 하는 거라 스케일이 일어나지 않음

To scale? manual → automation

## Nintendo switch

닌텐도 스위치는 아무도 새로운 콘솔에 게임을 개발하려고 하지 않기때문에 In-house에서 개발했다 (?)

## Exit Strategy

Flintstoning은 결국 멈춰야한다. 그 때는 창업자의 개입없이도 컨탠츠가 생성되고 네트워크가 유지될 때 이다.

# Always Be Hustlin’ - Uber

A funny viral video might work once or a few times, but it can’t be the only lever to drive growth over the long terms.

### Do things that don’t scale

창업자는 한명 한명 고객을 끌어와야한다

> One of the most common types of advice we give at Y Combinator is to do things that don’t scale. . . . The most common unscalable thing founders have to do at the start is to recruit users manually. Nearly all startups have to. You can’t wait for users to come to you. You have to go out and get them. There are two reasons founders resist going out and recruiting users individually. One is a combination of shyness and laziness. They’d rather sit at home writing code than go out and talk to a bunch of strangers and probably be rejected by most of them. But for a startup to succeed, at least one founder (usually the CEO) will have to spend a lot of time on sales and marketing.

Hustle 로 시작하되 scale하는 법을 익혀서 도입해라

우버의 문화와 허슬

Uber 1.0 Cultural Values

- Make Magic
- Superpumped
- Inside Out
- Be an Owner, Not a Renter
- Optimistic Leadership
- Be Yourself
- Big Bold Bets
- Customer Obsession
- Always Be Hustlin’
- Let Builders Build
- Winning: Champion’s Mindset
- Principled Confrontation
- Meritocracy and Toe-Stepping
- Celebrate Cities

# Escape velocity

## Dropbox

초기에는 제품에 집중, 제품이 좋으면 마케팅이나 세일즈는 필요없이 당연히 고객이 모일것이라는 기술 중심의 사고를 가진 집단

### 세일즈 팀이 생기고

남은 공간이 얼마 없다는 노티를 날리는 걸 추가 → 레베뉴 뻥튀기

유저들 사이에도 가치의 차이가 있음을 발견

> Originally, we thought our mission was trying to serve “everyone on the internet” but we realized that we shouldn’t be fighting every war. Our most valuable users were probably using us for collaboration in businesses and storage, not sharing full-length movies in developing markets.

### HVA LVA

High value actives

네트워크 효과를 일으키는 유저들. 파일을 공유하고 지속적으로 수정하는 사람들

Low value actives

그냥 파일을 저장하기 위한 공간으로 사용하는 사람들

### Focus on HVA

드랍박스는 데이터에 의존해서 우선시할 기능을 정했다. 하지만 이는 잘못된 길로 이끌기도 했다.

### Dropbox mistake

사람들이 많이 저장하는 파일을 알아보기 위해서 랜덤으로 계정 스냅샷을 찍어서 파일 익스텐션의 수를 조사했다. 결과는 당연히 photo였고 드랍박스는 Carousel 같은 사진을 위한 기능과 앱을 우선순위로 두고 개발했다. 하지만 결과는 예상보다 좋지 못했다.

### Prioritize with HVA

HVA는 파일을 공유하고 지속적으로 수정하면서 네트워크 효과를 일으키는 사람이다. 이들이 형성하는 네트워크는 High value network이며 이 네트워크에서 많이 사용되는 익스텐션을 조사하였다.

그것은 바로 docs, spreadsheet, presentation이다.

HVA를 스터디해보니 이들은 직장에서의 사용으로 확장시켰고, 그들이 원하는 보안, 관리자 컨트롤등을 도입

같은 방향의 데이터의 수집이었지만, 어디에 집중하느냐에 따라 결과는 달랐다.

> _Which files did people tend to go back and edit or move, again and again?_

### Mission statement of dropbox

“Unleash the world’s creative energy by designing a more enlightened way of working.”

# The trio of Network effect

- Engagement effect
- Acquisition effect
- Economic effect

네트워크가 주는 이 세가지의 효과는 전통적인 지표들에도 잘 들어맞음

Growth = New + Reactivated - churn

This month actives = Last month actives + growth

Revenue = Average Revenue Per Active user * active user

이들은 서로 따로 동작하는게 아니라 하나가 다른 것들을 끌어올리는 데 도움이되는 관계이다.

## Engagement effect -scurvy

리텐션은 보통 하루에 60퍼 1주일에 30퍼 한달에 15퍼 이렇게 떨어지는데, 이를 거부하고 하루 지날 수록 리텐션이 증가하는 아주 초 희귀케이스는 네트워크 프로덕트에서만 발생한다.

이 희귀 현상을 일으키는 세가지 요소를 알아본다.

### New use case

작은 팀에서 업무용으로 슬랙을 쓰다가 book / netflix / pool party 채널들이 생겨나면서 새로운 유즈 케이스를 만듬

유저들에게 맞는 유즈 케이스를 장려해줘야하는데 그러기위해서는 유저들을 세그멘테이션하는 것이 중요하다.

이 세그먼트들에 따라 각자에 맞는 lever를 사용하여 engagement를 늘려야한다

Dropbox에서 Low value user와 high value user를 구분하고 low value user를 HVU로 바꾸기 위해 sharing syncing 을 강화했다. Education을 통해 이런 기능들을 가르쳤고, 여러 디바이스에서 셋업을 쉽도록 하였다.

## Acquisition effect - paypal

paypal 마피아들이 세운 회사들을 viral growth를 성공해낸 사례가 많다. 그도 그럴것이 paypal이 viral groth를 잘한 대표 사례기 때문이다.

### Predecessor of Paypal

인터넷 송금 전에 PDA라는 기기끼리 돈을 송금하는 것을 아이디어로 시작했었다. PDA를 가지고 있는 사람끼리만 가능하다는 한계를 뛰어넘지 못하고, PDA에서 인터넷으로 눈을 돌렸다.

### Early days of Paypal

Paypal은 지금와서 생각해보면 무조건 성공할, 꼭 필요한 아이디어(인터넷 송금)이지만 Paypal도 초기에는 Killer usecase를 찾지 못했다.

1999년에 인터넷은 아직 초기 단계였고, 사람들이 왜 생소한 인터넷으로 돈을 주고 받아야하는지 필요성을 못느끼고 있는 상황이었다.

그렇게 고민하고 있을때, Ebay의 판매자로 부터 자신의 판매 페이지에 Paypal로 송금하기 버튼을 넣고 싶다고 연락이 왔고, Paypal은 이를 Killer usecase로 삼아서 성장했다.

### What make acquisition effect?

### Viral Marketing vs Viral Growth

흔히 말하는 “viral”이라는 단어 때문에 혼동이 생길 수 있다. 재밌는 영상, 몇만회의 조회수를 기록한 영상, 성격검사 등을 통한 마케팅을 viral marketing이라고 한다. networked product의 viral growth는 이와 다르게 product의 특성과 밀접하게 연관되어 발생한다.

예를 들어 Dropbox는 폴더를 share하는 제품의 특성이 viral growth를 가능케했고, paypal은 송금을 하면 돈을 받기위해 가입해야하는 특성이 많은 연쇄 signup을 가능케 했다. 이는 제품마다 다르다.

## The impact of acquisition effect

“Big bang”처럼 한번에 폭발적인 유저 유입을 하는 것은 리텐션이 담보되지 않으면 결국 새로운 유저 유입보다 churn이 더 커져서 망조를 걷게된다.

하지만 작은 네트워크들에 “landing”하고 그 그룹내에서 “expanding”하고 다른 네트워크로 전파되는 과정으로 유저가 유입된다면, 이들은 더 건강한 네트워크를 형성한다.

## The economic effect

네트워크가 가져오는 경제적 효과

### Network effect of lending

작은 가게에서 외상을 관리하기위해 떼먹는 사람의 이스트를 기록하기 시작했다. 주변가게도 이 리스트를 공유받기 원했으며 주변 가게도 이 리스트를 받아 같이 작성해나가기 시작했다. 이 범위는 더 늘어났고 추가되는 가게가 많아질 수록 리스트도 정교해졌다.

### Efficiency over subsidy

큰 네트워크는 더 효율적으로 사용자들의 경제적 요구를 충족시켜주기 때문에, 기업이 보상으로 줘야하는 돈이 적어진다. 이들이 효율적으로 돈을 벌면 이용자들도 더 싸게 좋은 서비스를 공급받을 수 있다.

### Higher Conversion Rates as the Network Grows

네트워크가 성장하면서 paid유저로 conversion이 덩달아 올라가는 마법

프리미엄 기능은 개인적인 용도보다는 네트워크가 커질수록 더 사용하고 싶게끔 설계되어야한다.

소셜 플렛폼은 소셜 스테이터스를 통해 돈을 번다. 스테이터스는 네트워크에 사람이 많을 때 가치가있다.

틴더의 슈퍼라이크는 라이크를 보내는 사람들 중 띄고 싶을때 사용한다.

포트나이트에서는 이모트를 판매한다. 다른 유저와 달라지기 위한 방법이다.

### The Impact of the Economic Effect

네트워크에 속한 paid 유저가 결국 이기도록 해야한다. 네트워크가 성장하면 속해있는 유저들의 이익도 커지고, 경쟁사들이 따라할 수 없는 경제적가치가 있는 네트워크가 만들어진다.

하지만, 이 세가지의 기둥이 평생 네트워크를 지속시켜주지 않는다. 점점 키우기가 힘들어지고 언젠가 성장이 0에 수렴한다.

# The Ceiling

## Twitch

Justin.tv가 ceiling에 도착해서 이용자 수가 더 늘지 않았다. justin.tv는 수 밀리언의 유저가 있었고 매출도 있었기에 만족할 수 있었지만, 젊고 용맹한 창업자들은 ceiling을 뚫을 방법을 찾아나섰다.

Mobile 라이브 방송 / 저스틴티비 / 트위치 로 팀이 배정되어 천장뚫기 프로젝트가 시작되었다.

**트위치는 기존의 저스틴티비와 어떤점이 달랐을까?**

저스틴티비는 뷰어에 집중했고 트위치는 스트리머에 집중했다.

저스틴티비는 뷰어들이 follwer를 쌓으면서 명성을 얻게 했지만, 트위치는 스트리머의 니즈를 파악해 명성과 더불어 **돈을 벌 수 있는 환경**을 제공했다.

트위치는 **더 작은 유저군과 더 작은 문제에 집중**했다. 저스틴티비는 제너럴한 스트리밍(TV 방송같은)을 제공했고 트위치는 오직 게이밍에만 집중했다. 디테일한 그래픽 요소가 중요하며 화면이 휙휙바뀌는 게이밍 특성을 고려해서 방송화질을 더욱 개선하는 등의 게임 스트리머가 겪는 문제에 집중했다.

트위치는 아주 **작지만 소중한 atomic network를 설정**했다. 바로 스트리머 1명 + 뷰어 1명으로 구성된 네트워크이다. 혼자 게임을 하는 것에 비해 뷰어가 한명있을 때 스트리머들은 특별한 경험을 하게된다. 스트리머들은 이 특별한 경험에 의해 트위치라는 플랫폼에 engage된다. 거기다가 훨씬 더 좋은 점은 뷰어가 여러명이되면 더 특별해진다는 것이다.

트위치는 **게임별로 카테고리를 만들고 스타들을 만들**었다. 카테고리 별로 현재 방송을 하고 있는 스트리머들의 리스트가 떴으며, 좋아요등의 메트릭으로 재밌는 영상을 위로 올렸다. (뷰어들이 좋아하는)재밌는 방송을 하는 스트리머들은 자연스럽게 노출이 올라갔고, 해당 영역에서 star가 될 수 있었다.

## **Introducing the Ceiling**

스타트업의 성장에서 피할 수 없는 것이 바로 Ceiling이다. 여러가지 이유에 의해 Ceiling을 경험하게 되는데, 어쨌든 그 순간은 온다.

- “Saturation”
    - 니치 마켓에서 점점 넓혀가다가 니치한 마켓을 장학하고 나면 성장이 둔해지는 Saturation이 온다.
    - 네트워크가 성장하면서 hard side 유저들이 더 원하는게 많아진다.
    - Curate 한 네트워크에서 점점 퀄리티를 유지하기 어려워지고, 이탈하는 유저가 늘어난다. 서치 알고리즘이나 추천 알고리즘이 뒷받침 되어야한다.

Ceiling을 경험하는 것은 좋은 의미로는 꽤 괜찮게 성장했다는 것이다. 안 좋은 점은 이 Ceiling은 새로운 프로덕트를 만들지 않는한 항상 풀어나가야할 숙제로 남는다는 것이다.

## Rocketing Growth - T2D3
