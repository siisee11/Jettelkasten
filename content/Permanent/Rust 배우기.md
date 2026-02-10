---
tags:
  - public
created: '2024-03-03T13:53:55.000Z'
updated: '2024-03-03T13:53:55.000Z'
---
## 설치 및 실행

[Installation](https://www.rust-lang.org/tools/install)

[Getting Started](https://www.rust-lang.org/learn/get-started)

# 러스트 배우기 책

* 너무 알만한건 빼고 간략하게 옮겨적었습니다.
* 타겟 독자
	* 책을 다 읽어보는 걸 추천하지만, 너무 쉽거나 자세한 내용들은 읽기 싫다 하시는 분
	* 프로그래밍언어 좀 써보신 분
	* ( + 시스템 프로그래밍에 대한 지식이 있는 분 )

# First project 
[Guessing Game](https://doc.rust-lang.org/book/ch02-00-guessing-game-tutorial.html#programming-a-guessing-game)
* let, mut, match 에 대한 기본 개념
* 어차피 나중에 다 나옴

# Common Programming Concepts

* Variables and mutability
	* Rust는 기본적으로 immutable
	* mutable하게 쓰려면 mut 지시자 붙혀야함
* Constant
	* 전역적으로 사용가능
	* 정의시 타입 무조건 명시
	* 절대 못바꿈
	* Runtime에 알 수 있는 수로 정의 못함.
* Shadowing
	* 같은 변수이름을 쓸 수 있게 해주는 것
	* 재선언시 타입도 변경 가능
```
	let x = 5; let x = x + 1;
```

### [Data Types](https://doc.rust-lang.org/book/ch03-02-data-types.html)

* Scalar Type
	* 하나의 값을 표현하는 타입
	* intergers, floating-point numbers, Booleans, and characters
	* 각각 타입들은 링크 타고 가서 더 자세히 보면됨.
* Compound Type
	* 여려개의 값을 하나로 묶은 타입
	* tuples, arrays
	* Tuples
		* Fixed size
		* unit = empty tuple
	* Arrays
		* 모든 element 가 같은 타입
		* Fixed length
		* array는 데이터를 heap이 아닌 stack에 할당하고 싶을때 유용함.

### [Functions](https://doc.rust-lang.org/book/ch03-03-how-functions-work.html)

펑션은  Statement와 Exmpressions로 이루어져있음.
* Statements : 뭔가하고 값을 리턴하지 않는 지시문
	* 예) Assignment 구문
		* 참고로 c랑 ruby는 assignment 구문도 값을 리턴한다고 한다.
* Expressions: 결과값을 내뱉는 지시문
	* Expression은 semicolon이 없다.
	* function의 결과값은 마지막 expression의 결과값


### [Control Flow](https://doc.rust-lang.org/book/ch03-05-control-flow.html#control-flow)

* 전형적인 If 문
	* 조건은 bool이어야함.
* 삼항연산자로 사용
```
let number = if condition { 5 } else { 6 };
```

* loop 
	* break로 탈출
	* break value 로 value 리턴 가능
	* loop label로 이중 중첩 loop disambiguate
* while
	* 전형적인 while문
* looping collection
	* `for element in a`
	* 가장 safe해서 가장 많이 쓰임

### [Understanding Ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html#understanding-ownership)

Ownership은 러스트의 유니크한 특성. 오너십으로 인해서 garbage collector 없이 메모리를 효율적으로 관리할 수 있음.

### [What Is Ownership?](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#what-is-ownership)

메모리 관리방법
1. 가비지 컬렉터
2. 직접 관리 (alloc, free)
3. Ownership

> Stack 과 Heap의 차이
> 1. Stack: fixed size, compile time에 알 수 있음.
> 	1. 할당 빠름
> 	2. 접근 빠름
> 2. Heap: Runtime에 할당요청함.
> 	1. 공간 찾아야해서 느림
> 	2. 접근도 느림 (포인터 따라가야함)
> 
> Heap에 있는 데이터를 추적하고, 중복을 적게하고, 사용하지 않는 데이터를 제거하는 것이 ownership이 하는 일이다.


#### [Ownership Rules](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#ownership-rules)
- Each value in Rust has an _owner_.
- There can only be one owner at a time.
- When the owner goes out of scope, the value will be dropped.

#### String Type
known size인 타입들 말고 새로운 String Type을 배우면서 ownership을 익히자.

* string (대소문자 주의, string literal이라고 한다.) 은 모든 상황에서 쓸 수 없다.
	* string은 immutable하고
	* 문자열을 쓸때 항상 미리 길이를 알 수 없기 때문.
* 그럴때 String Type을 사용
	* String 은 mutable하며 길이가 가변이다.

**왜 이런 차이가 날까?**

#### [Memory and Allocation](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#memory-and-allocation)
* string literal은 컴파일타임에 크기를 안다. 당연히 빠르고 효율적이다.
* String은 미지의 문자열, 크기 변화를 가능하게 하기위해 Heap에 할당된다.
	* 이는 런타임에 메모리가 할당된다는것과
	* 사용이 끝난후 메모리를 돌려줘야한다는 뜻임.

* 메모리 반환에서 러스트는 다른 접근 방식을 취함
	* "메모리를 소유한 변수가 scope밖으로 나가면 회수한다."
		* (당연하기함)
	* 변수가 스코프 밖으로 나가면 Rust는 스페셜 함수인 drop을 호출한다.

#### [Variables and Data Interacting with Move](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#variables-and-data-interacting-with-move)
좀 복잡한 경우를 보자.
```rust
let s1 = String::from("hello"); 
let s2 = s1;
```

* `s2 = s1` 에서 일어나는일
	* Stack에 저장된 pointer, length, capacity가 복사된다.
	* Heap에 저장된 실제 데이터는 복사되지않는다.
* 이렇게되면 지금 Heap에 저장된 데이터에 대해서 s1과 s2 둘 다 오너십을 가지므로 스코프에서 벗어날때 double free가 발생할 것.
* 이를 위해 Rust에서는 s1을 더 이상 valid하지 않다고 판단함.
* Rust에서는 이걸 **move**라고 부름
	* `s1 moved into s2`

#### [Variables and Data Interacting with Clone](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#variables-and-data-interacting-with-clone)
데이터도 deepcopy 하고 싶을땐 어떻게 하느냐?
`clone` 사용

#### [Stack-Only Data: Copy](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#stack-only-data-copy)
```rust
let x = 5; 
let y = x;
```

Stack only copy는 그냥 진짜 복사됨.
`Copy`라는 trait가 있는데 이걸 구현한 타입은 move대신 copy된다.

#### [Ownership and Functions](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#ownership-and-functions)
함수에 인자로 넘겨주는것은 assignment와 같이 동작한다.
```rust
fn main() {
    let s = String::from("hello");  // s comes into scope

    takes_ownership(s);             // s's value moves into the function...
                                    // ... and so is no longer valid here

    let x = 5;                      // x comes into scope

    makes_copy(x);                  // x would move into the function,
                                    // but i32 is Copy, so it's okay to still
                                    // use x afterward

} // Here, x goes out of scope, then s. But because s's value was moved, nothing
  // special happens.

fn takes_ownership(some_string: String) { // some_string comes into scope
    println!("{}", some_string);
} // Here, some_string goes out of scope and `drop` is called. The backing
  // memory is freed.

fn makes_copy(some_integer: i32) { // some_integer comes into scope
    println!("{}", some_integer);
} // Here, some_integer goes out of scope. Nothing special happens.
```

#### [Return Values and Scope](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#return-values-and-scope)
Return value도 같은 방식으로 오너십을 주고 받는다.
```rust
fn main() {
    let s1 = gives_ownership();         // gives_ownership moves its return
                                        // value into s1

    let s2 = String::from("hello");     // s2 comes into scope

    let s3 = takes_and_gives_back(s2);  // s2 is moved into
                                        // takes_and_gives_back, which also
                                        // moves its return value into s3
} // Here, s3 goes out of scope and is dropped. s2 was moved, so nothing
  // happens. s1 goes out of scope and is dropped.

fn gives_ownership() -> String {             // gives_ownership will move its
                                             // return value into the function
                                             // that calls it

    let some_string = String::from("yours"); // some_string comes into scope

    some_string                              // some_string is returned and
                                             // moves out to the calling
                                             // function
}

// This function takes a String and returns one
fn takes_and_gives_back(a_string: String) -> String { // a_string comes into
                                                      // scope

    a_string  // a_string is returned and moves out to the calling function
}
```

함수 왔다갔다 거릴 때 마다 오너십을 주고 받아야되는데, 인자가 많아지면 너무 귀찮아진다.

## [References and Borrowing](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#references-and-borrowing)
* 값을 넘기고 다시 받는 대신에 reference라는 것을 사용할 수 있음.
* reference는 pointer와 비슷한 개념이지만, reference는 항상 valid한 데이터를 가르키는게 보장된다. (레퍼런스의 생존 주기동안)
* reference를 **"데이터를 소유하지는 않고 가르키는 참조체"** 라고 이해하면 될듯하다. (그림을 보고 오는게 직빵이다.)

```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

* 이런식으로 reference를 만들어 원본을 가르키게 하는걸 **borrowing** 이라고 한다.
* 빌린거라서 스코프가 끝났다고 버리면 안된다. 돌려줘야한다.

### [Mutable References](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#mutable-references)

* Reference도 기본적으로 immutable이다. 빌린걸로 수정할 수 없다.
* `mut&` 로 mutable reference로 빌려야한다.
* 제약: mutable reference는 하나만 가능하다. (mut + imut 도 x)
	* 이 제약은 또 다른 언어들과 많이달라서 혼동 스럽다.
	* 이 제약은 컴파일 타임에 data race를 찾아내기 위해 존재한다.
	* Data race는 **악**한 놈인데, Runtime에서 발생하면 찾기가 더럽게 어렵다.
	* (멀코컴 생각이 나는구만)
	* 러스트는 이 제약으로 컴파일타임에 data race를 찾아서 방지한다.
* 멀티플 immutable ref는 가능하다.
	* 왜? 쓰는 놈만 없으면 동시에 읽는건 괜찮지.

* 이런 제약들이 불편해보일 수 는 있지만,
	* 미리 잡아내고, 어디에서 발생하는지 정확하게 알려준다.
	* (컴파일 타임에 잡을 수 있다면 축복인 애들이 많다)

### [Dangling References](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#dangling-references)

* 포인터가 있는 언어들에 있는 문제.
* 이미 free된 곳을 가르키는 포인터
* 러스트는? 없다. 컴파일러가 잡아준다.

댕글링 예시인데, 이걸 컴파일하면 에러가 뜬다.
1. s 스트링 생성
2. s의 reference 생성
3. s의 스코프가 끝나면서 s가 drop
4. drop 된 s의 reference는 valid하지 않다.
```rust
fn dangle() -> &String { // dangle returns a reference to a String

    let s = String::from("hello"); // s is a new String

    &s // we return a reference to the String, s
} // Here, s goes out of scope, and is dropped. Its memory goes away.
  // Danger!
```

### [The Rules of References](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#the-rules-of-references)

레퍼런스의 규칙이다.
- 1개의 mutable reference, 여러개의 immutable reference만 있을 수 있다.
- reference는 항상 valid 해야한다.

## [The Slice Type](https://doc.rust-lang.org/book/ch04-03-slices.html#the-slice-type)

다른 Reference 타입으로는 `slice`가 있음.

* 어떤 컬렉션 (element의 모음)에서 일부분을 가르키는 레퍼런스.
* 레퍼런스니까 역시 ownership을 갖지 않음.

전체에 대한 레퍼런스가 필요하지 않을 때가 있다.
어떤 문장에서 첫 단어(스페이스로 구분)를 찾아내는 문제가 있다고 하자.

#### 시도
space의 인덱스를 찾아와서 인덱스로 잘라내자.
```rust
fn first_word(s: &String) -> usize {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return i;
        }
    }

    s.len()
}
```

* s에서 스페이스의 인덱스를 찾아내서 잘 반환하는 함수이다. 근데 이게 문제가 될 수 있을까?
* s와 &s는 엄연히 다르기 때문에 s가 나중에 변한다해도 &s로 구한 값이 여전히 유요한지 알 방법이 없다.
* 아래 코드에서 `s.clear()`이후에 word는 아무 쓸모 없는 값이 된다. (컴파일러는 물론 이런 문제를 찾을 수 없다.)

```rust
fn main() {
    let mut s = String::from("hello world");

    let word = first_word(&s); // word will get the value 5

    s.clear(); // this empties the String, making it equal to ""

    // word still has the value 5 here, but there's no more string that
    // we could meaningfully use the value 5 with. word is now totally invalid!
}
```

* 따라서 위의 코드는 오류에 너무 취약하다.

### [String Slices](https://doc.rust-lang.org/book/ch04-03-slices.html#string-slices)

이런 문제를 해결해줄 수 있는게 String Slices다.
* String Slices 는 part of String의 reference 이다.

```rust
let s = String::from("hello world"); 
let hello = &s[0..5]; 
let world = &s[6..11];
```

first_word 함수가 String Slice(&str로 표현)를 리턴하게 수정하자.
```rust
fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}
```

이제 문제가 되었던 코드를 실행하면 컴파일 에러가 발생한다.
```rust
fn main() {
    let mut s = String::from("hello world");

    let word = first_word(&s);

    s.clear(); // error!

    println!("the first word is: {}", word);
}
```

* `s`에 대해서 word는 immutable reference이고 `s.clear()`는 s의 값을 바꾸는 걸 보아하니 내부적으로 mutable reference를 사용한다.
* word는 `s.clear()`이후에 사용되므로 `s.clear()`가 불릴 시점에 valid하다.
* 따라서 reference 룰에 의해 에러다.

#### [String Literals as Slices](https://doc.rust-lang.org/book/ch04-03-slices.html#string-literals-as-slices)

우리가 처음에 다뤘던 string literal 이 이제와서 보면 binary(실행파일)에 대한 Slice Reference라는 걸 깨달을 수 있다.
```rust
let s = "Hello, world!";
```

"Hello, world!"라는 값은 바이너리 어딘가에 적혀있을것이고, s는 그 부분을 가르키고 있는것.

#### [String Slices as Parameters](https://doc.rust-lang.org/book/ch04-03-slices.html#string-slices-as-parameters)

* 마지막으로, 좀 치는 Rustacean(러스트 개발자 애칭?)은 함수의 인자를 String Slice로 할것이다.
* *deref coercions* 의 이득을 볼수 있기 때문이라는데,,, 나중에 다룬다고 하고
* 좀 더 flexibility가 증가한다고 보면 될것 같다.

위에서 아래로 변경
```rust
fn first_word(s: &String) -> &str {
```
```rust
fn first_word(s: &str) -> &str {
```


# [Using Structs to Structure Related Data](https://doc.rust-lang.org/book/ch05-00-structs.html#using-structs-to-structure-related-data)

Structure는 우리가 아는 그 스트럭쳐랑 개념은 비슷.
Structure와 이 다음장의 Enum 은 프로그램의 새 타입을 지정하는 베이스이고, 이를 이용해서 Rust의 강력한 컴파일타임 타입체킹의 이점을 취할 수 있다.

## [Defining and Instantiating Structs](https://doc.rust-lang.org/book/ch05-01-defining-structs.html#defining-and-instantiating-structs)

* Structure는 tuple과 유사하게 관련된 값들을 모다놓은 구조이다.
* OOP의 클래스를 생각하면 될듯

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
```
많이 본듯한 생김새

이 Struct를 실체화 하는 것을 instantce를 만든다 라고 한다.

```rust
fn main() {
    let user1 = User {
        active: true,
        username: String::from("someusername123"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };
}
```

* mutable로 instance를 만들 수도 있는데, 이 경우에 특정 field만 mutable로 하는것은 불가능하다.

### [Creating Instances from Other Instances with Struct Update Syntax](https://doc.rust-lang.org/book/ch05-01-defining-structs.html#creating-instances-from-other-instances-with-struct-update-syntax)

Javascript에서 많이 보던것
```rust
fn main() {
    // --snip--

    let user2 = User {
        email: String::from("another@example.com"),
        ..user1
    };
}
```

Struct update 에서 ownership은 assignment에서와 같다.
* 위의 예시에서 username이 user2로 moved 되므로 user1은 더이상 valid하지 않다.
* 만약, active와 sign_in_count만 user1에서 받았다면 이건 copy니까 user1도 여전히 valid하다.

### [Unit-Like Structs Without Any Fields](https://doc.rust-lang.org/book/ch05-01-defining-structs.html#unit-like-structs-without-any-fields)

아무것도 없는 Struct. Empty tuple인 unit과 유사함.
* 나중에 trait 다룰 때 사용됨

## [An Example Program Using Structs](https://doc.rust-lang.org/book/ch05-02-example-structs.html#an-example-program-using-structs)

지금까지 배운걸로 사각형 넓이 구하기를 만들어본다.

위의 함수 만드는 부분은 스킵하고 (코드 쭉 따라가면 알만함.)
### [Adding Useful Functionality with Derived Traits](https://doc.rust-lang.org/book/ch05-02-example-structs.html#adding-useful-functionality-with-derived-traits)

Rectangle Struct 를 출력하고 싶으면 어떻게 해야할까?
```rust
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!("rect1 is {}", rect1);
}
```

`#[derive(Debug)]` 이 지시자를 통해 Debug trait 를 주고 `{:#?}`로 출력.
```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!("rect1 is {:#?}", rect1);
}
```

혹은 `dbg!` 메크로로 출력 (dbg! 메크로는 ownership을 가져가고 돌려줌)
```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let scale = 2;
    let rect1 = Rectangle {
        width: dbg!(30 * scale),
        height: 50,
    };

    dbg!(&rect1);
}
```

(자세한건 읽어보자)

## [Method Syntax](https://doc.rust-lang.org/book/ch05-03-method-syntax.html#method-syntax)

method는 function과 유사하지만, struct 안에 정의 되어 있음

### [Defining Methods](https://doc.rust-lang.org/book/ch05-03-method-syntax.html#defining-methods)

코드로 대신
```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        rect1.area()
    );
}
```

* `area()`의 인자가 `&self`인데 이건 `self: &Self` 의 줄임 표현이다. 
* Self 타입은 impl 블록의 대상 Type과 같다.
* 메소드의 첫번째 인자는 Self Type의 self 여야 한다.
	* mutable ref, immutable ref, ownership move (rare) 다 가능
* method는 dot(.) 오퍼레이터로 접근

>  [Where’s the `->` Operator?](https://doc.rust-lang.org/book/ch05-03-method-syntax.html#wheres-the---operator)
>  C 계열에 익숙하면 -> 오퍼레이터로 접근하는 것도 익숙한데, Rust에서는 사용하지 않는다.
>  Reference에서 method를 사용하더라도 dot 오퍼레이터로 동작함.
>  Rust는 _automatic referencing and dereferencing_ 이라고 이를 자동으로 변환해서 dot으로만 접근 할 수 있도록 해준다.
>  이게 가능한 이유는 self 파라메터에 대한 룰이 명확하기 때문이다.

### [Associated Functions](https://doc.rust-lang.org/book/ch05-03-method-syntax.html#associated-functions)

* impl 블록안에 정의된 함수를 associated functions라고 부름.
* associated function 중에 self가 필요없는 애들이 있는데, `String::from` 이 그 예시
* 보통 instance를 만드는 constructor들이다.

```rust
impl Rectangle {
    fn square(size: u32) -> Self {
        Self {
            width: size,
            height: size,
        }
    }
}
```

# [Enums and Pattern Matching](https://doc.rust-lang.org/book/ch06-00-enums.html#enums-and-pattern-matching)

## [Defining an Enum](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html#defining-an-enum)

여타 다른 언어의 enum과 뜻 유사

```rust
enum IpAddrKind { V4, V6, }
```

### [Enum Values](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html#enum-values)

* 아래와 같이 사용함.
```rust
let four = IpAddrKind::V4;
let six = IpAddrKind::V6;
```

* Enum 안에 데이터를 넣을 수도 있음. (struct로 만드는거보다 깔끔함)
```rust
enum IpAddr {
	V4(String),
	V6(String),
}

let home = IpAddr::V4(String::from("127.0.0.1"));
let loopback = IpAddr::V6(String::from("::1"));
```
* enum의 이름이 enum instance를 만드는 함수라는 것을 알 수 있음.
* `IpAddr::V4()` 는 String argument를 받아서 `IpAddr` 타입의 instance를 리턴함.

* Enum 이 struct 보다 좋은 점이 또 있는데, 모든 variant가 다른 타입의 data를 가질 수 있다는 것.

```rust
enum IpAddr {
	V4(u8, u8, u8, u8),
	V6(String),
}

let home = IpAddr::V4(127, 0, 0, 1);

let loopback = IpAddr::V6(String::from("::1"));
```

나머지는 본문 읽기

### [The `Option` Enum and Its Advantages Over Null Values](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html#the-option-enum-and-its-advantages-over-null-values)

`Option`은 standard library에 정의된 자주 사용하는 enum이다.

* Non-empty List에서 첫 값을 가져오면 가져오겠지만, Empty List에 첫 값을 요청하면 아무것도 돌려받지 못한다. Rust에서는 이 모든 케이스를 다루도록 강제된다.
* Rust에는 다른 프로그래밍 언어에 있는 Null이 없다.
* 널의 inventor인 Tony Hoare은 2009년에 [Enum and Its Advantages Over Null Values](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html#the-option-enum-and-its-advantages-over-null-values)프리젠테이션에서 이렇게 말함.
	* 완벽하게 safe한 reference를 만들고 싶었는데
	* null reference를 두면 매우 쉽다는 유혹을 떨쳐내지 못해서
	* 수십년간 많은 에러, 취약성, 시스템 크래시등을 발생시켰다.
* Null의 컨셉(지금 값이 유효하지 않거나 없다)은 유용하다, 대신 구현의 방법에 따라 오류에 취약할 뿐이다.
* 그래서 Rust는 Option enum을 통해서 null의 컨셉을 표현한다.

```rust
enum Option<T> { None, Some(T), }
```

* Option은 None으로 null의 상태를 표현하고 Some으로 유효한 값을 표현한다. 
* 그럼 null을 쓰는 것 대비 뭐가 다른가??
	* Option 값은 실제로 사용할 수 없다. 실제로 사용하기 위해서는 Option의 값을 실제 값으로 바꿔서 사용해야한다.
	* 그러기위해서는 사용하기전에 유효하지 않을 경우를 핸들링을 필수로 해줘야한다.
	* 그래서 Option 타입이 아니면 null이 아닌 것을 확신할 수 있다.


## [The `match` Control Flow Construct](https://doc.rust-lang.org/book/ch06-02-match.html#the-match-control-flow-construct)

Rust 는 **`match`** 라는 아주 강력한 컨트롤 플로우 구조가 있다. **`match`** 는 패턴에 매칭되는 코드를 실행시킨다.
(switch case랑 비슷)

* match 의 경우를 'arm' 이라고 부르는데 이 arm의 수 제한은 없다.
* 처음 매칭되는 arm을 실행한다.
* arm 의 코드는 expression이다. 이 결과 값은 match expression의 결과값이 된다.

### [Patterns That Bind to Values](https://doc.rust-lang.org/book/ch06-02-match.html#patterns-that-bind-to-values)

Enum의 데이터도 match 문에서 사용할 수 있다. 
```rust
fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        }
    }
}
```

### [Matching with `Option<T>`](https://doc.rust-lang.org/book/ch06-02-match.html#matching-with-optiont)

위의 특성을 이용해서 `Option<T>` 를 사용하는 예제를 보자.

`Option<i32>` 에 1을 더하는 코드를 작성하면 아래처럼 작성할 수 있다.

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
	match x {
		None => None,
		Some(i) => Some(i + 1),
	}
}

let five = Some(5);
let six = plus_one(five);
let none = plus_one(None);
```


### [Matches Are Exhaustive](https://doc.rust-lang.org/book/ch06-02-match.html#matches-are-exhaustive)

위 예제에서 볼 수 있듯, match는 모든 경우를 다 철저하게 다뤄야한다. 그렇지 않으면 컴파일 오류를 낸다.
아래 코드는 컴파일 오류를 냄.
```rust
    fn plus_one(x: Option<i32>) -> Option<i32> {
        match x {
            Some(i) => Some(i + 1),
        }
    }
```

이렇게 철저하게 다루게 함으로써 null인 경우를 계속 트래킹해서 예상치 못한 상황을 컴파일타임에 제거할 수 있다.

### [Catch-all Patterns and the `_` Placeholder](https://doc.rust-lang.org/book/ch06-02-match.html#catch-all-patterns-and-the-_-placeholder)

switch case 의 default와 유사하게 other 구문이 있다. other 에서 associated value(enum안의 데이터)를 사용하지 않을 경우에는 _ (underscore)를 쓰면된다.

## [Concise Control Flow with `if let`](https://doc.rust-lang.org/book/ch06-03-if-let.html#concise-control-flow-with-if-let)

`if let` 문법은 `if`와 `let`을 섞어서 좀더 간결하게 만들어준다.

* match 를 사용 (이거 `Option<u8>` 타입도 아닌데 왜 match 하는거지? )
```rust
let config_max = Some(3u8);
match config_max {
	Some(max) => println!("The maximum is configured to be {}", max),
	_ => (),
}
```

* if let 사용
```rust
let config_max = Some(3u8);
if let Some(max) = config_max {
	println!("The maximum is configured to be {}", max);
}
```

* `if let` 은 간결함을 주지만 `match`의 철저한 패턴매칭을 포기한다.
* `match`쓰다가 간결함이 간절하면 써보자.

> 예전에 flutter 할 때 dartz 라는 패키지를 사용하면서 `match`에 대해서 맛보기를 해봐서 조금 익숙했던 듯 

# [Managing Growing Projects with Packages, Crates, and Modules](https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html#managing-growing-projects-with-packages-crates-and-modules)

큰 코드를 짜면서, 코드를 정리하고, 나눠서 모듈화하고, 추상화하고 등의 일이 필요하게 될 것인데 그 테크닉에 대해서 다룬다.

Rust는 모듈 시스템이라고 불리는 기능이 잘 되어있다. 자세히 다룰꺼니 일단 영어로...
- **Packages:** A Cargo feature that lets you build, test, and share crates
- **Crates:** A tree of modules that produces a library or executable
- **Modules** and **use:** Let you control the organization, scope, and privacy of paths
- **Paths:** A way of naming an item, such as a struct, function, or module

## [Packages and Crates](https://doc.rust-lang.org/book/ch07-01-packages-and-crates.html#packages-and-crates)

#### Crate
컴파일러가 취급하는 가장 작은 코드 단위. (?)

* Binary crate 와 library crate 가 있음.
* Binary crate 는 컴파일해서 실행시킬 수 있고, main이 있다.
* Library crate 는 main 함수가 없고, 컴파일한다고 실행파일이 되지 않음. 대신 다른 곳에서 사용될 기능들을 제공함.
* Rustacean이 crate라고하면 대부분 Library임.

#### Package
패키지는 하나 이상 crate의 모음.
* Cargo.toml 파일이 있고 crate를 어떻게 빌드해야하는지 적혀있음
* 패키지는 여러개의 binary crate를 가질 수 있지만 library crate는 하나만 가능하다.
* 패키지는 적어도 하나의 crate를 가지고 있어야한다.

`cargo new <package name>` 으로 패키지를 만들 수 있고,

`src/main.rs` 는 `package name`을 가지는 binary crate의 루트가 되고,
`src/lib.rs` 는 `package name`을 가지는 library crate의 루트가 되고,
`src/bin` 의 파일들은 여러개의 binary crate가 된다

## [Defining Modules to Control Scope and Privacy](https://doc.rust-lang.org/book/ch07-02-defining-modules-to-control-scope-and-privacy.html#defining-modules-to-control-scope-and-privacy)

모듈 시스템을 구성하는 다른 요소들을 배울껀데, 일단 코드를 organizing 을 도와줄 몇가지 룰에 대해 알아보자.

### [Modules Cheat Sheet](https://doc.rust-lang.org/book/ch07-02-defining-modules-to-control-scope-and-privacy.html#modules-cheat-sheet)

module, path, `use` keyword, `pub` keyword가 컴파일러에서 어떻게 동작하는 지, 대부분의 개발자들이 코드를 어떻게 organize하는 지를 몇가지 룰을 통해서 알아보자.

* **Crate root 에서 시작한다.** 컴파일러가 컴파일 할 때 crate root file을 처음으로 본다.
* **모듈을 선언한다** `mod garden` 으로 module을 선언해놓으면 컴파일러는 아래를 살펴본다.
	* 모듈이 선언된 { }
	* `src/garden.rs`
	* `src/garden/mod.rs` 
* **서브 모듈을 선언한다.** crate root 말고 다른 곳에서 submodule을 선언할 수 있다. 예를 들어 `mod vegetable`을 `src/garden.rs` 에서 선언하면 컴파일러는 다음 파일들을 본다.
	* 모듈이 선언된 { }
	* `src/garden/vegetable.rs`
	* `src/garden/vegetable/mod.rs`
* **modules 안의 코드로의 Path.**  같은 crate안의 코드를 path를 통해 참조 할 수 있다. `create::garden::vegetables::Asparagus`
* **Private vs Public**: 모듈의 코드는 상위 모듈로 부터 기본적으로 private이다. 모듈을 public 하게 만드려면 `pub mod` 로 선언해야한다.
* **The `use` keyword**: Scope안에서 `use`키워드는 `path`의 숏컷을 만들어준다. `use crate::garden::vegetables::Asparagus;` 로 숏컷을 만들고 그 스코프 안에서는 `Asparagus` 로 사용할 수 있음.

위 룰들이 적용된 간단한 예시를 보자.

```
backyard
├── Cargo.lock
├── Cargo.toml
└── src
    ├── garden
    │   └── vegetables.rs
    ├── garden.rs
    └── main.rs
```

src/main.rs
```rust
use crate::garden::vegetables::Asparagus;

pub mod garden;

fn main() {
    let plant = Asparagus {};
    println!("I'm growing {:?}!", plant);
}
```

src/garden.rs
```rust
pub mod vegetables;
```

src/garden/vegetable.rs
```rust
#[derive(Debug)]
pub struct Asparagus {}
```

### [Grouping Related Code in Modules](https://doc.rust-lang.org/book/ch07-02-defining-modules-to-control-scope-and-privacy.html#grouping-related-code-in-modules)

Modules 은 코드를 정리하여 가독성을 높히고 재사용성을 높힌다. 또 Modules는 privacy를 컨트롤할 수 있게 해준다.

모듈화를 레스토랑을 예시로 알아보자. 레스토랑에는 front of house(서빙, 고객응대, 바텐더, 주문)과 back of house(쉐프, 요리, 설거지, 매니저)가 있다. 

`restaurant` 라이브러리를 만들어보자. `cargo new restaurant --lib`로 만들고 `src/lib.rs`를 수정해서 front_of_house 부분을 만들어보자.
```rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}

        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}

        fn serve_order() {}

        fn take_payment() {}
    }
}
```

이렇게 모듈을 정의함으로써 관련된 정의들을 묶을 수 있다.

이 상태에서 Module Tree는 이렇게 생겼다.
```
crate
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment
```

* front_of_house is **parent** of hosting
* hosting is child of** child**
* hosting and serving are **sibling**

## [Paths for Referring to an Item in the Module Tree](https://doc.rust-lang.org/book/ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html#paths-for-referring-to-an-item-in-the-module-tree)

함수를 부르기 위해서는 그 함수의 `path`를 알아야한다. path는 두가지 형식이 있다.

1. `absolute path` crate root로 부터의 절대 경로. crate 의 이름이나 crate로 시작함.
2. `relative path` 현재 모듈에서부터의 경로

Rust에서는 보통 코드를 서로 독립적으로 분리하려고 하므로 코드를 다른 모듈로 이동할때 기존 경로를 안바꿔도 되는 absolute path를 선호한다.
예를 들어 아래에서 `eat_at_restaurant` 함수를 다른 모듈로 옮긴다면, relative path는 변경되어야한다.

```rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // Absolute path
    crate::front_of_house::hosting::add_to_waitlist();

    // Relative path
    front_of_house::hosting::add_to_waitlist();
}
```

위의 코드를 컴파일해보면 `hosting`이 private 이라는 에러가 발생한다. 
child module의 아이템은 부모에게 private이며, 자식은 부모의 item을 사용할 수 있다.
이게 Rust Module system의 방식인데, 구체적인 구현은 숨기는 것이다. 바깥쪽(추상적인) 부분을 안정적으로 놔두면서 안쪽(구현체)를 맘대로 바꿀 수 있다.

### [Exposing Paths with the `pub` Keyword](https://doc.rust-lang.org/book/ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html#exposing-paths-with-the-pub-keyword)

아까 private 이라는 에러가 발생했는데, path의 모듈과 함수에 `pub`키워드를 붙혀서 public 으로 만들 수 있다.


Enum과 Struct 를 public으로 만들고, super 지시자로 부모의 아이템에 접근하는 방식은 책을 보자.


## [Bringing Paths into Scope with the `use` Keyword](https://doc.rust-lang.org/book/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#bringing-paths-into-scope-with-the-use-keyword)

매번 path를 적는건 귀찮고 반복적임. -> `use` 키워드를 쓰면됨 (유사 import)

`use`를 사용하므로써 해당 이름을 선언된 스코프 내에서 valid하게 한다.


### [Creating Idiomatic `use` Paths](https://doc.rust-lang.org/book/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#creating-idiomatic-use-paths)

* **관용적으로 use 키워드를 함수까지 명시하지 않는다.** :  use의 의미는 함수를 사용하기 위해 그 함수이 모듈을 명시한다는 의미로 쓰인다. 함수까지 명시하게 되면 그 함수가 어디로부터 왔는지 명확하지가 않다.
* 예) 아래처럼 사용하지 않음.
```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use crate::front_of_house::hosting::add_to_waitlist;

pub fn eat_at_restaurant() {
    add_to_waitlist();
}
```


* **관용적으로 struct, enums은 전체 path를 명시한다.** 
```rust
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();
    map.insert(1, 2);
}
```

### [Re-exporting Names with `pub use`](https://doc.rust-lang.org/book/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#re-exporting-names-with-pub-use)

`pub use` : (아직 언제 쓰는지 잘 모르겠음) 좀 더 깔끔하게 내부 함수를 export하기 위해서?

### [Using External Packages](https://doc.rust-lang.org/book/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#using-external-packages)

Guessing game 만들때 외부의 'rand' crate를 사용한 적이 있다. [crates.io](https://crates.io/) (npm 같은거)에 crate들이 올라와 있고,

`Cargo.toml` 의 dependency에 명시해서 사용할 수 있다.

## [Separating Modules into Different Files](https://doc.rust-lang.org/book/ch07-05-separating-modules-into-different-files.html#separating-modules-into-different-files)

모듈을 여러 파일로 나눠서 관리하는 방법.


# [Common Collections](https://doc.rust-lang.org/book/ch08-00-common-collections.html#common-collections)

Collection 이라고 부르는 유용한 structure가 있다. Collection은 heap에 저장되고, 그래서 Compile time에 size가 known일 필요가 없다.
콜랙션마다 할 수 있는 일과 비용이 다르기 때문에 잘 선택해서 사용하는것은 개발자의 스킬이다. 대표적으로 사용하는 _vector, string, hash map_ 에 대해 다룬다.

## [Storing Lists of Values with Vectors](https://doc.rust-lang.org/book/ch08-01-vectors.html#storing-lists-of-values-with-vectors)

벡터 타입은 다른 언어의 vector 나 list와 유사하다. 가변 array. 사용법도 유사하다.

* 생성
```rust
let v: Vec<i32> = Vec::new();

let v = vec![1, 2, 3];
```

`vec!` 는 macro이고 생성과 함께 initialize 해준다.

* 업데이트
```rust
let mut v = Vec::new();

v.push(5);
v.push(6);
```

* Read
```rust
let v = vec![1, 2, 3, 4, 5];

let third: &i32 = &v[2];
println!("The third element is {third}");

let third: Option<&i32> = v.get(2);
match third {
	Some(third) => println!("The third element is {third}"),
	None => println!("There is no third element."),
}
```

두가지 경우는 프로그래머의 의도에 따라서 다르게 한다.
1. index로 읽는 경우: 인덱스 밖을 참조할 때 패닉을 내기 위해서.
2. `get`으로 읽는 경우, 인덱스 밖을 읽을 때 오류를 처리하기 위해서.

* immutable & mutable error
```rust
let mut v = vec![1, 2, 3, 4, 5];

let first = &v[0];

v.push(6);

println!("The first element is: {first}");
```

위 경우는 immutable ref와 mutable ref(`v.push`)가 공존하므로 컴파일 에러를 낸다.

### [Iterating over the Values in a Vector](https://doc.rust-lang.org/book/ch08-01-vectors.html#iterating-over-the-values-in-a-vector)

for in 으로 iterate 하세요

```rust
let v = vec![100, 32, 57];
for i in &v {
	println!("{i}");
}
```


## [Storing UTF-8 Encoded Text with Strings](https://doc.rust-lang.org/book/ch08-02-strings.html#storing-utf-8-encoded-text-with-strings)

TODO:



# [Error Handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html#error-handling)

Rust에서는 Error 를 _recoverable, unrecoverable_ 에러로 구분한다. 
* Recoverable: 유저에게 오류를 보여주거나, 재시도 등을 해줄 수 있는 경우
* Unrecoverable: 일어나면 안되는 오류, 바로 프로그램을 스톱해야되는 경우

## [Unrecoverable Errors with `panic!`](https://doc.rust-lang.org/book/ch09-01-unrecoverable-errors-with-panic.html#unrecoverable-errors-with-panic)

Unrecoverable Error에는 panic! 매크로를 호출한다.
`panic!` 패닉 메크로는 프로그램을 죽여버린다. (패닉 메세지 출력, unwind, 스택정리, 종료)

## [Recoverable Errors with `Result`](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html#recoverable-errors-with-result)

Recoverable Error는 Result enum을 사용해서 처리한다.
성공하면 OK에 값을 답고, 실패하면 Err에 Error를 담아서 반환한다.

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

`match`를 조합해서 에러일 때를 핸들링 할 수 있다.

```rust
use std::fs::File;

fn main() {
    let greeting_file_result = File::open("hello.txt");

    let greeting_file = match greeting_file_result {
        Ok(file) => file,
        Err(error) => panic!("Problem opening the file: {:?}", error),
    };
}
```

또, 중첩 match 문으로 error에 따라 처리를 다르게 할 수도 있다.

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let greeting_file_result = File::open("hello.txt");

    let greeting_file = match greeting_file_result {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {:?}", e),
            },
            other_error => {
                panic!("Problem opening the file: {:?}", other_error);
            }
        },
    };
}
```

너무 보일러플레이트가 많아서 코드가 복잡해진다. 이를 위해 rust는 `unwrap`과 `expect` 문을 제공한다.

`unwrap`은 Result가 성공일땐 성공 값, 실패일 때는 패닉을 일으킨다.
`expect`는 unwrap과 같은데 panic을 일으킬 때 출력할 메세지를 입력할 수 있다.

`expect`가 더 많은 정보를 주기 때문에 보통 `expect`를 사용한다.

### [Propagating Errors](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html#propagating-errors)

다른 언어에서도 에러가 발생하면 바로 처리안하고 caller한테 책임을 전가하는 것들이 있다. (rethrow)
에러가 발생한 곳에서 처리를 안하고 조상들에게 처리를 할 수 있도록 넘겨주는 것을 `propagating errors`라고 한다.

아래는 file을 열어서 username을 읽는 함수의 예제 코드이다.
```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let username_file_result = File::open("hello.txt");

    let mut username_file = match username_file_result {
        Ok(file) => file,
        Err(e) => return Err(e),
    };

    let mut username = String::new();

    match username_file.read_to_string(&mut username) {
        Ok(_) => Ok(username),
        Err(e) => Err(e),
    }
}
```

위 함수의 리턴 값을 보면 그냥 username(String)이 아니라 Result enum을 반환한다. 이 함수 내에서 발생하는 `std::io::Error` 를 그대로 caller에게 넘겨 주겠다는 것이다.

첫번째 match 문에서는 `return`을 명시해서 바로 함수가 종료하도록 하였고, 두번째 match문은 마지막 expression이기 때문에 따로 `return`을 명시하지 않았다.


#### [A Shortcut for Propagating Errors: the `?` Operator](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html#a-shortcut-for-propagating-errors-the--operator)

위의 코드의 의도는 명확하지만, 코드가 너무 읽기 어렵고 길다. (+ 매번 짜기 귀찮다.) Rust는 `?` 오퍼레이터를 제공해서 이 문제를 해결한다.

같은 함수를 `?`를 사용해서 정리하면 아래와 같음.
```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username_file = File::open("hello.txt")?;
    let mut username = String::new();
    username_file.read_to_string(&mut username)?;
    Ok(username)
}
```

* `?`는 **값이 OK면 OK의 값을 반환, Err면 Error 값으로 함수를 리턴** 하는 것임을 알 수 있다.

* `?`는 `match`를 사용할 때에 비해 한가지 일을 더 자동으로 해준다. Error의 타입을 알아서 변환해 주는 건데, 함수가 리턴하고자 하는 에러 타입이 From Trait를 구현했다면 `?`가 리턴하는 에러타입을 함수가 리턴하고자하는 타입으로 변환해준다.
	* (아직 Trait를 배우지 않아서 와닿지는 않을것)
	* 예를 들어 위의 함수가 OurError 라는 Custom Error를 리턴하도록 변경되고, `impl From<io::Error> for OurError` 를 구현해서 OurError.from(io::Error)가 구현되어 있다면, 따로 형변환 없이도 OurError를 리턴한다는 것이다.

* `?` 는 연속으로 쓸 수도 있다.

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username = String::new();

    File::open("hello.txt")?.read_to_string(&mut username)?;

    Ok(username)
}
```

* `?`는 Option enum에도 쓸 수 있다.
* `?`를 사용한 함수는 Result(나 Option에 썻다면 Option)를 리턴해야한다.
* 메인도 Result를 반환 할 수 있음. C와 같이 정상적으로 종료되면 (OK를 반환하면) 0을 반환하면서 종료, 그 외에는 integer를 반환하며 종료.
	* `Box<dyn Error>> `는[“Using Trait Objects that Allow for Values of Different Types”](https://doc.rust-lang.org/book/ch17-02-trait-objects.html#using-trait-objects-that-allow-for-values-of-different-types)에서 자세히 배움.
```rust
use std::error::Error;
use std::fs::File;

fn main() -> Result<(), Box<dyn Error>> {
    let greeting_file = File::open("hello.txt")?;

    Ok(())
}
```


## [To `panic!` or Not to `panic!`](https://doc.rust-lang.org/book/ch09-03-to-panic-or-not-to-panic.html#to-panic-or-not-to-panic)

언제 패닉을 일으키고 언제 Result를 반환할까?

사실 프로그래머의 의도에 따라서 이긴 한데, 그래도 보통 어떤 상황에서 어떤 방식을 취하는 지에 대한 내용이다.

### [Examples, Prototype Code, and Tests](https://doc.rust-lang.org/book/ch09-03-to-panic-or-not-to-panic.html#examples-prototype-code-and-tests)

에러 핸들링이 중요하지 않고, 보여주고자 하는 코드를 간결하게 보여줘야할때.

### [Cases in Which You Have More Information Than the Compiler](https://doc.rust-lang.org/book/ch09-03-to-panic-or-not-to-panic.html#cases-in-which-you-have-more-information-than-the-compiler)

이건 좀 흥미로운 부분인데, 컴파일러보다 사람이 더 잘 알 때, 즉 사람이 봤을때 절대 일어나면 안되는 상황에는 패닉을 일으킨다.

예를 들어, "127.0.0.1"을 IpAddr로 파싱하는 상황에서 컴파일러는 parse()에서 에러가 날 수도 있다고 생각하지만 (Result를 리턴하기 때문), 사람이 보기에 parse()에서 에러가 나는건 말이 안된다. 이럴땐 `expect`를 호출한다.
```rust
use std::net::IpAddr;

let home: IpAddr = "127.0.0.1"
	.parse()
	.expect("Hardcoded IP address should be valid");
```

### [Creating Custom Types for Validation](https://doc.rust-lang.org/book/ch09-03-to-panic-or-not-to-panic.html#creating-custom-types-for-validation)

타입을 만들어서 오류를 제어하자. 다른언어에서 constructor에서 validation을 하는 것과 유사한 방식.

```rust
pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 || value > 100 {
            panic!("Guess value must be between 1 and 100, got {}.", value);
        }

        Guess { value }
    }

    pub fn value(&self) -> i32 {
        self.value
    }
}
```

# [Generic Types, Traits, and Lifetimes](https://doc.rust-lang.org/book/ch10-00-generics.html#generic-types-traits-and-lifetimes)

Rust에서 중요한 개념들이다.

## [Generic Data Types](https://doc.rust-lang.org/book/ch10-01-syntax.html#generic-data-types)

이건 타 언어에서도 많이 나오고, 사실 거의 유사하다.

* Function, Enum, Method 에 사용한다.
* 아래는 예시
```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}

fn main() {
    let p = Point { x: 5, y: 10 };

    println!("p.x = {}", p.x());
}
```

* 하나의 타입에만 method를 구현할 수도 있다.
```rust
impl Point<f32> {
    fn distance_from_origin(&self) -> f32 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}
```

* 쓰까 리턴도 할 수 있다. (유즈케이스는 모르겠음)
```rust
struct Point<X1, Y1> {
    x: X1,
    y: Y1,
}

impl<X1, Y1> Point<X1, Y1> {
    fn mixup<X2, Y2>(self, other: Point<X2, Y2>) -> Point<X1, Y2> {
        Point {
            x: self.x,
            y: other.y,
        }
    }
}
```

### [Performance of Code Using Generics](https://doc.rust-lang.org/book/ch10-01-syntax.html#performance-of-code-using-generics)

Generic을 이용하면 뭔가 정해지지 않았기 때문에 Runtime cost가 늘어날거 같은데?

Generic은 Runtime cost를 증가시키지 않는다. Rust는 `monomorphization`을 Generic code에 컴파일 타임에 적용해서 이를 해결한다.

`monomorphization`은 이름은 어렵긴한데, 우리가 Generic을 만드는 방식의 반대라고 보면 된다.

우리는 타입만 다르고 로직이 같은 것을 Generic으로 묶는다.
컴파일러는 Generic을 사용하는 타입마다 같은 로직을 복사해서 새로운 함수를 만든다.

## [Traits: Defining Shared Behavior](https://doc.rust-lang.org/book/ch10-02-traits.html#traits-defining-shared-behavior)

Trait는 다른 언어의 Interface와 유사하다. (따라서 설명은 많이 생략한다..)

* 선언
```rust
pub trait Summary { 
	fn summarize(&self) -> String; 
}
```


### [Implementing a Trait on a Type](https://doc.rust-lang.org/book/ch10-02-traits.html#implementing-a-trait-on-a-type)

* Type에 Trait를 구현하는 법 (`impl Trait for Type`)
```rust
pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}
```

* Default implementation을 작성할 수 있다.

```rust
pub trait Summary {
    fn summarize(&self) -> String {
        String::from("(Read more...)")
    }
}
```

* Default implementation에서 같은 Trait의 다른 method를 호출 할 수 있다.
```rust
pub trait Summary {
    fn summarize_author(&self) -> String;

    fn summarize(&self) -> String {
        format!("(Read more from {}...)", self.summarize_author())
    }
}
```

### [Traits as Parameters](https://doc.rust-lang.org/book/ch10-02-traits.html#traits-as-parameters)

Trait를 함수 파라메터로 쓸 수 있다. Trait를 구현한 타입만이 함수의 파라메터로 들어 올 수 있다.

```rust
pub fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}
```

#### [Trait Bound Syntax](https://doc.rust-lang.org/book/ch10-02-traits.html#trait-bound-syntax)

`impl Trait`는 아래처럼 생긴 Trait Bound의 sugar syntax이다.

```rust
pub fn notify<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}
```

#### [Specifying Multiple Trait Bounds with the `+` Syntax](https://doc.rust-lang.org/book/ch10-02-traits.html#specifying-multiple-trait-bounds-with-the--syntax)

`+` 로 여러개의 Trait Bound를 설정할 수 있다.

```rust
pub fn notify(item: &(impl Summary + Display)) {}

pub fn notify<T: Summary + Display>(item: &T) {}
```

#### [Clearer Trait Bounds with `where` Clauses](https://doc.rust-lang.org/book/ch10-02-traits.html#clearer-trait-bounds-with-where-clauses)

함수 정의부만 봐도 헷갈리고 어지럽다. `where` 구문으로 정리할 수 있다. 다른 언어에도 유사하게 있다. (C#)

* before
```rust
fn some_function<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) -> i32 {
```

* after
```rust
fn some_function<T, U>(t: &T, u: &U) -> i32
where
    T: Display + Clone,
    U: Clone + Debug,
{
```

### [Returning Types that Implement Traits](https://doc.rust-lang.org/book/ch10-02-traits.html#returning-types-that-implement-traits)

Trait를 구현한 타입을 리턴할 수 있다.

```rust
fn returns_summarizable() -> impl Summary {
    Tweet {
        username: String::from("horse_ebooks"),
        content: String::from(
            "of course, as you probably already know, people",
        ),
        reply: false,
        retweet: false,
    }
}
```

유의할 점은 Trait를 구현한 다른 타입을 리턴할 수 없다는 것이다. 아래 코드는 컴파일 안된다. 이 경우도 챕터 17 ([“Using Trait Objects That Allow for Values of Different Types”](https://doc.rust-lang.org/book/ch17-02-trait-objects.html#using-trait-objects-that-allow-for-values-of-different-types)) 에서 다룬다.

```rust
fn returns_summarizable(switch: bool) -> impl Summary {
    if switch {
        NewsArticle {
            headline: String::from(
                "Penguins win the Stanley Cup Championship!",
            ),
            location: String::from("Pittsburgh, PA, USA"),
            author: String::from("Iceburgh"),
            content: String::from(
                "The Pittsburgh Penguins once again are the best \
                 hockey team in the NHL.",
            ),
        }
    } else {
        Tweet {
            username: String::from("horse_ebooks"),
            content: String::from(
                "of course, as you probably already know, people",
            ),
            reply: false,
            retweet: false,
        }
    }
}
```

### [Using Trait Bounds to Conditionally Implement Methods](https://doc.rust-lang.org/book/ch10-02-traits.html#using-trait-bounds-to-conditionally-implement-methods)

"제너릭 타입을 쓰는 어떤 타입에 대해서, 제너릭의 타입 중에 어떤 Trait를 구현한 타입들에게만 함수를 구현하고 싶다" 하면 Trait Bound를 활용해 조건적으로 구현할 수 있다.

```rust
use std::fmt::Display;

struct Pair<T> {
    x: T,
    y: T,
}

impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self { x, y }
    }
}

impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {}", self.x);
        } else {
            println!("The largest member is y = {}", self.y);
        }
    }
}
```

T 중에 Display와 PartialOrd를 구현한 T만이 Pair 타입의 cmp_display method를 가진다.

> 이전에 Display Trait를 구현한 standard library는 ToString Trait를 구현했었다.
> 그건 `impl<T: Display> ToString for T { // --snip-- }` 이런 식으로 Display를 구현한 타입에 대해서 ToString Trait가 구현되어 있기 때문이다.


## [Validating References with Lifetimes](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html#validating-references-with-lifetimes)

Generic의 일종인 Lifetime에 대해서 배워보자.

Lifetime은 Rust에 있는 독특한 컨셉이기 때문에, 익숙하지 않다.

모든 레퍼런스는 lifetime이 있다. 대부분은 inferred 되기 때문에 프로그래머가 관여하지 않아도 된다. 하지만 몇몇 경우에는 lifetime을 explicit하게 명시해야 될 때가 있다.

### [Preventing Dangling References with Lifetimes](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html#preventing-dangling-references-with-lifetimes)

Lifetime의 정의를 Dangling Reference를 통해서 알아보자.

```rust
fn main() {
    let r;

    {
        let x = 5;
        r = &x;
    }

    println!("r: {}", r);
}
```

위의 코드는 dangling reference의 예시로 컴파일이 되지 않는다. println! 구문에서 r이 참조하는 변수가 이미 사라졌기 때문이다.

### [The Borrow Checker](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html#the-borrow-checker)

컴파일러는 이걸 어떻게 알고 컴파일 에러를 내뱉을까? 

컴파일러는 borrow checker를 가지고 있어서 lifetime 을 가지고 모든 borrows가 유효한지를 판별한다.

Lifetime은 문자 그대로 그 변수가 살아 있는 시간이다. 위 코드에 주석으로 lifetime을 표시해보자.

```rust
fn main() {
    let r;                // ---------+-- 'a
                          //          |
    {                     //          |
        let x = 5;        // -+-- 'b  |
        r = &x;           //  |       |
    }                     // -+       |
                          //          |
    println!("r: {}", r); //          |
}                         // ---------+
```

Lifetime의 annotation은 보통 ' (apostrophe) 로 시작하고 전부 소문자이다. 
위에서 r의 lifetime은 'a 이고 메인의 처음부터 끝까지 살아있다.
x의 lifetime은 'b 이고 내부 블록에서만 살아 있다.

x의 reference인 r의 lifetime이 x의 lifetime보다 기니까 이건 유효하지 않다.


### [Generic Lifetimes in Functions](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html#generic-lifetimes-in-functions)

함수에서 Lifetime을 명시해야되는 경우와 명시하는 방법에 대해서 알아보자.

```rust
fn main() {
    let string1 = String::from("abcd");
    let string2 = "xyz";

    let result = longest(string1.as_str(), string2);
    println!("The longest string is {}", result);
}
```

우리는 두개의 문자열 중 더 긴 문자열을 찾아서 출력하고자 한다.

아래와 같이 함수를 작성할 것이다. (함수 내에서 값을 수정하지 않을 것이므로 &str을 파라메터로 받는다.)
```rust
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

이 함수는 두개의 borrowed value(reference)를 받아서 borrowed value를 돌려준다. 하지만 둘 중 어떤 borrowed value를 돌려줄 지는 모른다.

문제 없어보이는 함수지만 컴파일 해보면 아래와 같은 에러가 발생한다.
```bash
$ cargo run
   Compiling chapter10 v0.1.0 (file:///projects/chapter10)
error[E0106]: missing lifetime specifier
 --> src/main.rs:9:33
  |
9 | fn longest(x: &str, y: &str) -> &str {
  |               ----     ----     ^ expected named lifetime parameter
  |
  = help: this function's return type contains a borrowed value, but the signature does not say whether it is borrowed from `x` or `y`
help: consider introducing a named lifetime parameter
  |
9 | fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
  |           ++++     ++          ++          ++

For more information about this error, try `rustc --explain E0106`.
error: could not compile `chapter10` due to previous error
```

이 컴파일 에러가 발생하는 이유는, Rust가 메모리 관리를 위해서 reference의 생명 주기를 추적할 수 있어야하기 때문이다.

그런데 위 함수에서는 x가 리턴될지 y가 리턴될지 아무도 (심지어 프로그래머도) 모르기 때문에 반환값의 lifetime을 정할 수 없다.

이런 경우를 위해 lifetime을 명시적으로 선언할 수 있는 Lifetime Annotation이 필요하다.

### [Lifetime Annotation Syntax](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html#lifetime-annotation-syntax)

레퍼런스 기호 다음에 lifetime을 명시한다.

```rust
&i32        // a reference
&'a i32     // a reference with an explicit lifetime
&'a mut i32 // a mutable reference with an explicit lifetime
```

위의 `longest` 함수를 수정해보자.

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

이제 이 longest 함수의 결과값은 함수 파라메터의 결과값과 그 생명 주기를 같이 한다. 즉, 두 파라메터 중 하나의 생명주기가 끝나면 이 함수의 결과값의 생명도 끝난다.

결국, Lifetime syntax는 함수 파라메터와 리턴값의 lifetime의 관계를 이어주는 것이다.

### [Lifetime Annotations in Struct Definitions](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html#lifetime-annotations-in-struct-definitions)

struct가 reference를 가지는 경우에 우리는 lifetime annotation을 추가해주어야한다.

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("Could not find a '.'");
    let i = ImportantExcerpt {
        part: first_sentence,
    };
}
```

`ImportantExcerpt` 는 String reference를 가지는 struct이다. 만약 이 reference가 수명을 다하면 ImportantExcerpt도 수명을 다해야한다.

### [Lifetime Elision](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html#lifetime-elision)

Reference에 대해서 struct와 function을 정의할때 lifetime을 명시해야함을 배웠다. 

그런데 이전에 사용했던 아래 함수는 reference를 받아서 reference를 반환하는 함수인데 lifetime을 명시하지 않고 있다.

```rust
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}

```

예전에는 lifetime을 명시했어야했다. 하지만 예측 가능한 패턴이 계속 중복되어 사용되는것을 보고 이를 `lifetime elision rules` 로 정의해서 해당 경우에는 explicit하게 lifetime을 명시하지 않아도 되도록 하였다.

달리 말하면, 컴파일러가 input(파라메터), output(리턴값)에 대해서 lifetime을 모두 확정할 수 있으면 굳이 명시안해도 넘어가겠다는 것.

컴파일러가 이를 확인하는 세가지 룰은 아래와 같다.
1. 파라메터에 대해서 lifetime을 부여한다. (파라메터마다 다른 lifetime 부여)
2. 인풋 파라메터가 하나면, output(리턴값)에도 같은 lifetime을 부여한다.
3. 인풋 파라메터가 여러개고, 그 중 하나가 &self 이거나 &mute self 이면 output에 self와 같은 lifetime을 부여한다.

위의 함수 (first_word) 가지고 우리가 컴파일러가 되어서 수행해보자.

#### Example 1

1. 1번 룰
```rust
fn first_word<'a>(s: &'a str) -> &str {
```

2. 2번룰
```rust
fn first_word<'a>(s: &'a str) -> &'a str {
```

컴파일러는 모든 파라메터의 lifetime을 정의하는데 성공했다. 따라서 이 경우는 explicit한 lifetime 명시가 필요하지 않다.


#### Example 2

````rust
fn longest(x: &str, y: &str) -> &str {
````

1. 1번룰
```rust
fn longest<'a, 'b>(x: &'a str, y: &'b str) -> &str {
```

2. 적용할 룰 없음

룰을 다 적용했는데, 아직 output paramenter의 lifetime을 알 수 없다. 따라서 이 경우는 explicit한 lifetime 명시가 필요하다.


### [Lifetime Annotations in Method Definitions](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html#lifetime-annotations-in-method-definitions)

위의 경우들은 함수에 Lifetime annotation을 적용한 경우였고, Method에 적용하는 것도 같은 방식으로 적용된다.

근데 보통 lifetime elision rules의 1번, 3번 룰에 따라 다 정해지므로 굳이 명시할 필요가 없다.

### [The Static Lifetime](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html#the-static-lifetime)

Lifetime 중에 스페셜한 Static Lifetime이 있다. 
의미는 **'프로그램 내내 살아있는 레퍼런스'** 라는 뜻.

## [Generic Type Parameters, Trait Bounds, and Lifetimes Together](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html#generic-type-parameters-trait-bounds-and-lifetimes-together)

모든걸 짬뽕한 코드이다.

```rust
use std::fmt::Display;

fn longest_with_an_announcement<'a, T>(
    x: &'a str,
    y: &'a str,
    ann: T,
) -> &'a str
where
    T: Display,
{
    println!("Announcement! {}", ann);
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```


# [Writing Automated Tests](https://doc.rust-lang.org/book/ch11-00-testing.html#writing-automated-tests)

프로그램의 버그가 있다는걸 보여주기는 쉽지만, 완전무결함을 보여주기는 어렵다. 그럼에도 Rust는 Correctness를 가장 중요한 것으로 보고 이를 위해 많은 것을 제공한다.

일단 Robust Type system이 있고 타입 시스템이 다 잡지 못하는 것은 automated software test 작성을 지원해서 잡도록 도와준다.

예를 들어 2를 더하는 함수가 있으면, Type system은 문자열이 들어오는 경우를 막아주긴 하겠지만, 더하기 2가 아니라 더하기 3으로 잘못 코딩한건 잡아줄 수 없다.


## [How to Write Tests](https://doc.rust-lang.org/book/ch11-01-writing-tests.html#how-to-write-tests)

Rust의 test는 non-test 코드가 기대대로 동작하는지를 판별하는 function이다. test function의 body는 아래와 같은 3부분을 가진다.
(뭐 대다수의 다른 테스트 프레임워크와 같다)

1. 데이터나 초기 상태 셋업
2. 코드 돌리기
3. 기대한 값인지 확인하기

### [The Anatomy of a Test Function](https://doc.rust-lang.org/book/ch11-01-writing-tests.html#the-anatomy-of-a-test-function)

Rust의 테스트는 **`test` attribute가 annotated된 함수** 이다. 

함수에 `#[test]` 어노테이션을 붙히면 test function이 된다.

`cargo test` 커맨드로 어노테이션이 붙은 함수를 실행할 수 있다.

프로젝트를 만들어보면서 더 자세히 알아보자.

```bash
$ cargo new adder --lib
     Created library `adder` project
$ cd adder
$ cargo test
```

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
```

자세한 내용(assert 메크로 라든가, 사용법, should_panic 등..)은 특별할게 없으므로 생략

## [Controlling How Tests Are Run](https://doc.rust-lang.org/book/ch11-02-running-tests.html#controlling-how-tests-are-run)

기본적으로 `cargo test`는 모든 테스트 함수를 병렬적으로 실행함.

command line argument로 test의 실행 방법을 조정할 수 있음.

#### concurrency control (쓰레드 수 조정)

```bash
$ cargo test -- --test-threads=1
```

#### pass 된 테스트의 프린트도 출력

```bash
$ cargo test -- --show-output
```

#### Subset of test만 실행

```rust
pub fn add_two(a: i32) -> i32 {
    a + 2
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn add_two_and_two() {
        assert_eq!(4, add_two(2));
    }

    #[test]
    fn add_three_and_two() {
        assert_eq!(5, add_two(3));
    }

    #[test]
    fn one_hundred() {
        assert_eq!(102, add_two(100));
    }
}
```

* one_hunred 테스트만 진행
```bash
$ cargo test one_hundred
```
* add 가 포함된 테스트만 실행 (add_two_and_two, add_three_and_two)
```
$ cargo test add
```


## [Test Organization](https://doc.rust-lang.org/book/ch11-03-test-organization.html#test-organization)

테스트를 구분하는 건 보통, unit test 와 integration test로 구분함.

* Unit test
	* 작고 더 집중적이며, 하나의 모듈을 독립적으로 테스트한다.
	* private interface도 테스트 할 수 있음
* Integration test
	* 외부로 공개된 API를 위한 테스트
	* 


### [Unit Tests](https://doc.rust-lang.org/book/ch11-03-test-organization.html#unit-tests)

유닛테스트는 코드의 한 부분을 다른 부분과 고립해서 테스트하는 것.
Rust에서는 보통 테스트 하려는 파일에 unit test를 집어넣는다.
컨벤션은 각 파일에 `tests`라는 모듈을 만들고 `cfg(test)`로 어노테이션하고 그안에 테스트 함수들을 적는것.

`cfg(test)`가 붙은 모듈은 `cargo test`에서만 컴파일된다.

예)
```rust
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
```

#### [Testing Private Functions](https://doc.rust-lang.org/book/ch11-03-test-organization.html#testing-private-functions)

private function을 테스트 해야하는 지는 커뮤니티에서 논쟁이 있다. 다른 언어에서는 private function을 테스트하기 어렵거나 불가능한데, Rust에서는 할 수 있다.

```rust
pub fn add_two(a: i32) -> i32 {
    internal_adder(a, 2)
}

fn internal_adder(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn internal() {
        assert_eq!(4, internal_adder(2, 2));
    }
}
```

Rust의 테스트코드는 뭐 제3의 테스트 라이브러리가 아니라 Rust의 function이다. 
[“Paths for Referring to an Item in the Module Tree”](https://doc.rust-lang.org/book/ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html) 에서 다룬 규칙이 그대로 적용되고, 따라서 자식은 조상의 items을 사용할 수 있으니 tests 모듈은 super의 함수를 사용할 수 있다.

### [Integration Tests](https://doc.rust-lang.org/book/ch11-03-test-organization.html#integration-tests)

Rust에서 Integration tests는 우리의 Library 밖에 있는 것이다. 풀어쓰면, 외부에서 접근할 수 있는 부분을 테스트하는 것이다.
이 테스트의 목적은 우리 라이브러리가 다른 외부 코드들과 잘 작동할 수 있는 지를 테스트하는 것이다.
Integration tests를 위해서 test라는 폴더가 필요하다.

#### [The _tests_ Directory](https://doc.rust-lang.org/book/ch11-03-test-organization.html#the-tests-directory)

```
adder
├── Cargo.lock
├── Cargo.toml
├── src
│   └── lib.rs
└── tests
    └── integration_test.rs
```

test/integration_test.rs 에 아래와 같은 테스트를 추가한다.
```rust
use adder;

#[test]
fn it_adds_two() {
    assert_eq!(4, adder::add_two(2));
}
```

특정 integration test만 수행하고 싶다면
```bash
cargo test --test integration_test
```

#### [Submodules in Integration Tests](https://doc.rust-lang.org/book/ch11-03-test-organization.html#submodules-in-integration-tests)

Test의 setup 같은 공통된 로직을 정의하고 사용하기.

#### [Integration Tests for Binary Crates](https://doc.rust-lang.org/book/ch11-03-test-organization.html#integration-tests-for-binary-crates)

Binary는 그 자체로 실행되어야하기 때문에 integration test 할 수 없다.
그래서 보통 library를 하나 만들고 그걸 binary crate root에서 실행함으로써 integration test도 진행한다.

# [An I/O Project: Building a Command Line Program](https://doc.rust-lang.org/book/ch12-00-an-io-project.html#an-io-project-building-a-command-line-program)

드디어... CLI 만들기 

grep 이라는 linux의 근본 프로그램을 만들어 볼 것 이다. Rust 커뮤니티 맴버 중 한명이 빠른 버전의 grep인 `ripgrep`을 만들었는데, 이 것 보다는 간단한 버전으로 만들것이다. 

## [Accepting Command Line Arguments](https://doc.rust-lang.org/book/ch12-01-accepting-command-line-arguments.html#accepting-command-line-arguments)

```bash
$ cargo new minigrep 
	Created binary (application) `minigrep` project 
$ cd minigrep
```

일단 우리 프로그램이 2개의 argument를 받아서 실행하도록 할 것이다.
```console
$ cargo run -- searchstring example-filename.txt
```

### [Reading the Argument Values](https://doc.rust-lang.org/book/ch12-01-accepting-command-line-arguments.html#reading-the-argument-values)

`std::env::args` 함수를 사용해서 argument 를 받을 것이다.

```rust
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    dbg!(args);
}
```

* 실행해보면 argument가 출력된다.
```console
cargo run -- searchstring example-filename.txt
    Finished dev [unoptimized + debuginfo] target(s) in 0.02s
     Running `target/debug/minigrep searchstring example-filename.txt`
[src/main.rs:5] args = [
    "target/debug/minigrep",
    "searchstring",
    "example-filename.txt",
]
```

### [Saving the Argument Values in Variables](https://doc.rust-lang.org/book/ch12-01-accepting-command-line-arguments.html#saving-the-argument-values-in-variables)

```rust
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();

    let query = &args[1];
    let file_path = &args[2];

    println!("Searching for {}", query);
    println!("In file {}", file_path);
}
```

## [Reading a File](https://doc.rust-lang.org/book/ch12-02-reading-a-file.html#reading-a-file)

일단 예시 파일을 준비하자. (프로젝트 루트/poem.txt)
```
I'm nobody! Who are you? Are you nobody, too? Then there's a pair of us - don't tell! They'd banish us, you know. How dreary to be somebody! How public, like a frog To tell your name the livelong day To an admiring bog!
```

파일을 읽는 부분을 추가한다.
```rust
use std::env;
use std::fs;

fn main() {
    // --snip--
    println!("In file {}", file_path);

    let contents = fs::read_to_string(file_path)
        .expect("Should have been able to read the file");

    println!("With text:\n{contents}");
}
```

> https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer VSCode라면 extension의 도움을 받자

```console
cargo run -- the poem.txt
```


## [Refactoring to Improve Modularity and Error Handling](https://doc.rust-lang.org/book/ch12-03-improving-error-handling-and-modularity.html#refactoring-to-improve-modularity-and-error-handling)

지금 상태에서 4가지 고칠 부분이 있다.
1. main에서 두가지 역할을 수행한다. (argument parsing, read file)
	1. 기능마다 함수를 분리해서 하나의 함수가 하나의 기능에 책임을 지게하는 것이 좋다.
2. arguments(query, file_path)는 프로그램의 configurable variable이고 `contents`변수는 프로그램의 로직에 관여되어 있다. 목적에 따라 변수를 구조화해서 scope를 주고 각각의 목적을 더 명확하게 하면 좋다.
3. `expect`에서 항상 같은 (거의 의미없는) 오류 메세지를 출력한다.
	1. 에러가 발생할 이유가 너무 많은데도!
4. 에러가 발생했을때 여기저기서 처리가 되어서, 에러 핸들링을 유지 관리하기 어렵다.
	1. 에러 핸들링을 하는 코드를 한곳에 두자.

### [Separation of Concerns for Binary Projects](https://doc.rust-lang.org/book/ch12-03-improving-error-handling-and-modularity.html#separation-of-concerns-for-binary-projects)

`main.rs`가 커지는 것을 막기 위해서 아래와 같은 가이드가 있다.

- Split your program into a _main.rs_ and a _lib.rs_ and move your program’s logic to _lib.rs_.
- As long as your command line parsing logic is small, it can remain in _main.rs_.
- When the command line parsing logic starts getting complicated, extract it from _main.rs_ and move it to _lib.rs_.

`main`의 책임을 아래와 같이 제한한다.

- Calling the command line parsing logic with the argument values
- Setting up any other configuration
- Calling a `run` function in _lib.rs_
- Handling the error if `run` returns an error

#### [Extracting the Argument Parser](https://doc.rust-lang.org/book/ch12-03-improving-error-handling-and-modularity.html#extracting-the-argument-parser)

Parsing 하는 부분을 함수로 분리

```rust
fn main() {
    let args: Vec<String> = env::args().collect();

    let (query, file_path) = parse_config(&args);

    // --snip--
}

fn parse_config(args: &[String]) -> (&str, &str) {
    let query = &args[1];
    let file_path = &args[2];

    (query, file_path)
}
```

#### [Grouping Configuration Values](https://doc.rust-lang.org/book/ch12-03-improving-error-handling-and-modularity.html#grouping-configuration-values)

Configuration value들은 같은 목적으로 사용되기 때문에 tuple로 쓰기 보다는 struct로 묶어 주자.

```rust
fn main() {
    let args: Vec<String> = env::args().collect();

    let config = parse_config(&args);

    println!("Searching for {}", config.query);
    println!("In file {}", config.file_path);

    let contents = fs::read_to_string(config.file_path)
        .expect("Should have been able to read the file");

    // --snip--
}

struct Config {
    query: String,
    file_path: String,
}

fn parse_config(args: &[String]) -> Config {
    let query = args[1].clone();
    let file_path = args[2].clone();

    Config { query, file_path }
}
```

`parse_config` 에서 ownership 문제를 해결하기 위해서 `clone`을 사용했다. `clone`은 당연히 성능면에서 안좋지만, 한번밖에 안일어나기도 하고 데이터가 작기도하니 성능과 개발용이성 사이의 trade-off로 생각하면 된다.
물론, 고수가 되면 더 효율적인 해결법으로 코딩할 수 있을 것이다.


#### [Creating a Constructor for `Config`](https://doc.rust-lang.org/book/ch12-03-improving-error-handling-and-modularity.html#creating-a-constructor-for-config)

`parse_config`는 결국 Config를 만드는 것이므로 construct로 분리해주는 편이 좋다. String이 `String::new`로 인스턴스를 생성하는 것과 톤을 맞추는 것이다.

```rust
fn main() {
    let args: Vec<String> = env::args().collect();

    let config = Config::new(&args);

    // --snip--
}

// --snip--

impl Config {
    fn new(args: &[String]) -> Config {
        let query = args[1].clone();
        let file_path = args[2].clone();

        Config { query, file_path }
    }
}```

### [Fixing the Error Handling](https://doc.rust-lang.org/book/ch12-03-improving-error-handling-and-modularity.html#fixing-the-error-handling)

argument의 수가 2가 아닐때 panic이 난다. panic의 기본 메세지(index out of...)은 개발자 친화적이지 유저가 봐야할 메세지는 아니다. 이를 처리하자.

#### [Improving the Error Message](https://doc.rust-lang.org/book/ch12-03-improving-error-handling-and-modularity.html#improving-the-error-message)

```rust
// --snip--
fn new(args: &[String]) -> Config {
	if args.len() < 3 {
		panic!("not enough arguments");
	}
	// --snip--
```

사실 이렇게 한다고해도 에러메세지가 좀 더 좋아지긴 하지만, panic은 여전히 promgrammer 친화적이다.

#### [Returning a `Result` Instead of Calling `panic!`](https://doc.rust-lang.org/book/ch12-03-improving-error-handling-and-modularity.html#returning-a-result-instead-of-calling-panic)

Panic 대신 Handling을 하기 위해 Result를 반환하도록 하자.

```rust
impl Config {
    fn build(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }

        let query = args[1].clone();
        let file_path = args[2].clone();

        Ok(Config { query, file_path })
    }
}
```

#### [Calling `Config::build` and Handling Errors](https://doc.rust-lang.org/book/ch12-03-improving-error-handling-and-modularity.html#calling-configbuild-and-handling-errors)

```rust
use std::process;

fn main() {
    let args: Vec<String> = env::args().collect();

    let config = Config::build(&args).unwrap_or_else(|err| {
        println!("Problem parsing arguments: {err}");
        process::exit(1);
    });

    // --snip--

```

`unwrap_or_else`은 OK인 상황에서는 `unwrap`과 같이 OK의 값을 반환하고 Err인 경우에 err 를 처리하는 closure를 실행한다.  closure는 익명의 함수로 callback 함수와 유사하다. (나중에 자세히 다룬다)

### [Extracting Logic from `main`](https://doc.rust-lang.org/book/ch12-03-improving-error-handling-and-modularity.html#extracting-logic-from-main)

마지막으로 이제 로직을 main에서 빼내자. 로직부분을 `run`함수로 추출하자.

```rust
fn main() {
    // --snip--

    println!("Searching for {}", config.query);
    println!("In file {}", config.file_path);

    run(config);
}

fn run(config: Config) {
    let contents = fs::read_to_string(config.file_path)
        .expect("Should have been able to read the file");

    println!("With text:\n{contents}");
}

// --snip--

```

#### [Returning Errors from the `run` Function](https://doc.rust-lang.org/book/ch12-03-improving-error-handling-and-modularity.html#returning-errors-from-the-run-function)

run이 Result를 반환하게 하여 main에서 유저 친화적으로 에러를 핸들링할 수 있도록 하자.

```rust
use std::error::Error;

// --snip--

fn run(config: Config) -> Result<(), Box<dyn Error>> {
    let contents = fs::read_to_string(config.file_path)?;

    println!("With text:\n{contents}");

    Ok(())
}
```

#### [Handling Errors Returned from `run` in `main`](https://doc.rust-lang.org/book/ch12-03-improving-error-handling-and-modularity.html#handling-errors-returned-from-run-in-main)

반환된 결과(에러)를 메인에서 처리하자.

```rust
fn main() {
    // --snip--

    println!("Searching for {}", config.query);
    println!("In file {}", config.file_path);

    if let Err(e) = run(config) {
        println!("Application error: {e}");
        process::exit(1);
    }
}
```

### [Splitting Code into a Library Crate](https://doc.rust-lang.org/book/ch12-03-improving-error-handling-and-modularity.html#splitting-code-into-a-library-crate)

진짜 마지막으로 library로 코드를 분리하자.

pub 키워드가 붙은것을 유의

`src/lib.rs`

```rust
use std::error::Error;
use std::fs;

pub struct Config {
    pub query: String,
    pub file_path: String,
}

impl Config {
    pub fn build(args: &[String]) -> Result<Config, &'static str> {
        // --snip--
    }
}

pub fn run(config: Config) -> Result<(), Box<dyn Error>> {
    // --snip--
}
```

`src/main.rs`

```rust
use std::env;
use std::process;

use minigrep::Config;

fn main() {
    // --snip--
    if let Err(e) = minigrep::run(config) {
        // --snip--
    }
}
```

## [Developing the Library’s Functionality with Test-Driven Development](https://doc.rust-lang.org/book/ch12-04-testing-the-librarys-functionality.html#developing-the-librarys-functionality-with-test-driven-development)

이제, 코드들을 열심히 분리했으니 test 코드를 짜기 수월해졌다.

TDD 방식으로 minigrep의 searching logic을 구현해볼 것이다.

1. 우리 의도에 맞게 실패하는 테스트 코드를 작성한다.
2. 테스트를 통과하도록끔만 코드를 업데이트한다.
3. 테스트가 통과하도록 유지하면서 리펙토링한다.
4. 1번부터 다시한다.

### [Writing a Failing Test](https://doc.rust-lang.org/book/ch12-04-testing-the-librarys-functionality.html#writing-a-failing-test)

searcing에 대해서 실패하는 테스트 코드를 짜보자.

`src/lib.rs`

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn one_result() {
        let query = "duct";
        let contents = "\
Rust:
safe, fast, productive.
Pick three.";

        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }
}
```

컴파일이 되면서 테스트가 실패하도록 search 함수를 작성한다.
반환값은 contents 레퍼런스와 관계가 있으니 lifetime annotation을 작성해준다.

```rust
pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> { 
	vec![] 
}
```


`cargo test`로 실패하는지 확인한다.

### [Writing Code to Pass the Test](https://doc.rust-lang.org/book/ch12-04-testing-the-librarys-functionality.html#writing-code-to-pass-the-test)

로직을 작성한다. (작성하면서 계속 테스트 돌리면서 작성한다)

```rust
pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let mut results = Vec::new();

    for line in contents.lines() {
        if line.contains(query) {
            results.push(line);
        }
    }

    results
}
```

test를 통과하는것을 확인하자

#### [Using the `search` Function in the `run` Function](https://doc.rust-lang.org/book/ch12-04-testing-the-librarys-functionality.html#using-the-search-function-in-the-run-function)

메인 로직에서 새로 만든 search 함수를 호출한다.

```rust
pub fn run(config: Config) -> Result<(), Box<dyn Error>> {
    let contents = fs::read_to_string(config.file_path)?;

    for line in search(&config.query, &contents) {
        println!("{line}");
    }

    Ok(())
}
```

이제 돌려보자
```console
cargo run -- frog poem.txt
```

## [Working with Environment Variables](https://doc.rust-lang.org/book/ch12-05-working-with-environment-variables.html#working-with-environment-variables)

마지막으로 Environment variable을 활용하는 방법에 대해 알아보자.

사용자가 Environment variable을 설정해서 case-insensitive search를 설정할 수 있도록 하자.

### [Writing a Failing Test for the Case-Insensitive `search` Function](https://doc.rust-lang.org/book/ch12-05-working-with-environment-variables.html#writing-a-failing-test-for-the-case-insensitive-search-function)

먼저 새로운 테스트를 추가한다.

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn case_sensitive() {
        let query = "duct";
        let contents = "\
Rust:
safe, fast, productive.
Pick three.
Duct tape.";

        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }

    #[test]
    fn case_insensitive() {
        let query = "rUsT";
        let contents = "\
Rust:
safe, fast, productive.
Pick three.
Trust me.";

        assert_eq!(
            vec!["Rust:", "Trust me."],
            search_case_insensitive(query, contents)
        );
    }
}
```

원래 있던 테스트도 Case에 대한 예시를 추가했다.

```rust
pub fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> { 
	vec![] 
}
```


### [Implementing the `search_case_insensitive` Function](https://doc.rust-lang.org/book/ch12-05-working-with-environment-variables.html#implementing-the-search_case_insensitive-function)

```rust
pub fn search_case_insensitive<'a>(
    query: &str,
    contents: &'a str,
) -> Vec<&'a str> {
    let query = query.to_lowercase();
    let mut results = Vec::new();

    for line in contents.lines() {
        if line.to_lowercase().contains(&query) {
            results.push(line);
        }
    }

    results
}
```

Config에 따라 다른 함수를 호출

```rust
pub struct Config {
    pub query: String,
    pub file_path: String,
    pub ignore_case: bool,
}

pub fn run(config: Config) -> Result<(), Box<dyn Error>> {
    let contents = fs::read_to_string(config.file_path)?;

    let results = if config.ignore_case {
        search_case_insensitive(&config.query, &contents)
    } else {
        search(&config.query, &contents)
    };

    for line in results {
        println!("{line}");
    }

    Ok(())
}
```

ignore_case 는 환경변수에서 읽어온다.

```rust
use std::env;
// --snip--

impl Config {
    pub fn build(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }

        let query = args[1].clone();
        let file_path = args[2].clone();

        let ignore_case = env::var("IGNORE_CASE").is_ok();

        Ok(Config {
            query,
            file_path,
            ignore_case,
        })
    }
}
```

```console
$ cargo run -- to poem.txt
$ IGNORE_CASE=1 cargo run -- to poem.txt
```

## [Writing Error Messages to Standard Error Instead of Standard Output](https://doc.rust-lang.org/book/ch12-06-writing-to-stderr-instead-of-stdout.html#writing-error-messages-to-standard-error-instead-of-standard-output)

진짜 진짜 마지막으로 Error 메세지를 Standard Error 로 내보내는 것을 하자. 터미널에는 보통 두개의 output 채널이 있다. _stdout, stderr_ 이다.
이건 error 메세지를 무시한채로 output 메세지만 따로 저장하고자 함을 위함이다.

### [Checking Where Errors Are Written](https://doc.rust-lang.org/book/ch12-06-writing-to-stderr-instead-of-stdout.html#checking-where-errors-are-written)

```console
cargo run > output.txt
```

우리 프로그램의 아웃풋을 파이프라이닝해서 file로 저장하면, error 메세지가 파일에 포함됨을 알 수 있다.
(`>`는 stdout을 파이프라이닝 한다는 뜻이다.)

### [Printing Errors to Standard Error](https://doc.rust-lang.org/book/ch12-06-writing-to-stderr-instead-of-stdout.html#printing-errors-to-standard-error)

```rust
fn main() {
    let args: Vec<String> = env::args().collect();

    let config = Config::build(&args).unwrap_or_else(|err| {
        eprintln!("Problem parsing arguments: {err}");
        process::exit(1);
    });

    if let Err(e) = minigrep::run(config) {
        eprintln!("Application error: {e}");
        process::exit(1);
    }
}
```

`eprintln`으로 stderr로 출력할 수 있다.

# [Functional Language Features: Iterators and Closures](https://doc.rust-lang.org/book/ch13-00-functional-features.html#functional-language-features-iterators-and-closures)

Rust의 디자인은 선조 언어들과 기술들에 영향을 많이 받았다. 그 중 큰 영향을 받은건 함수형 프로그래밍이다.

여기서 함수형 프로그래밍을 다루진 않고, 영향을 받은 Rust의 문법들을 살펴볼 것이다.

## [Closures: Anonymous Functions that Capture Their Environment](https://doc.rust-lang.org/book/ch13-01-closures.html#closures-anonymous-functions-that-capture-their-environment)

Closure는 익명(함수의 이름이 없는)함수이고 그 함수가 선언된 scope의 값들을 capture할 수(가지고 올 수) 있다.

### [Capturing the Environment with Closures](https://doc.rust-lang.org/book/ch13-01-closures.html#capturing-the-environment-with-closures)

Closure가 환경을 캡쳐한다는 게 당최 무슨 소리인지 예시를 통해 알아보자.

어떤 회사가 티셔츠를 증정하는데, 선호하는 색을 입력하면 그 색의 옷을 주고, 아니면 가장 재고가 많은 색의 옷을 주는 프로그램이다.

```rust
#[derive(Debug, PartialEq, Copy, Clone)]
enum ShirtColor {
    Red,
    Blue,
}

struct Inventory {
    shirts: Vec<ShirtColor>,
}

impl Inventory {
    fn giveaway(&self, user_preference: Option<ShirtColor>) -> ShirtColor {
        user_preference.unwrap_or_else(|| self.most_stocked())
    }

    fn most_stocked(&self) -> ShirtColor {
        let mut num_red = 0;
        let mut num_blue = 0;

        for color in &self.shirts {
            match color {
                ShirtColor::Red => num_red += 1,
                ShirtColor::Blue => num_blue += 1,
            }
        }
        if num_red > num_blue {
            ShirtColor::Red
        } else {
            ShirtColor::Blue
        }
    }
}

fn main() {
    let store = Inventory {
        shirts: vec![ShirtColor::Blue, ShirtColor::Red, ShirtColor::Blue],
    };

    let user_pref1 = Some(ShirtColor::Red);
    let giveaway1 = store.giveaway(user_pref1);
    println!(
        "The user with preference {:?} gets {:?}",
        user_pref1, giveaway1
    );

    let user_pref2 = None;
    let giveaway2 = store.giveaway(user_pref2);
    println!(
        "The user with preference {:?} gets {:?}",
        user_pref2, giveaway2
    );
}
```

여기서 아래 부분에 집중하자.

```rust
user_preference.unwrap_or_else(|| self.most_stocked())
```

`unwrap_or_else`는 성공하면 value를 실패하면 넘겨준 closure를 실행시킨다.

`||`는 closure의 parameter 부분이고 그 이후가 실행부이다. 
( `| a, b | closure(a,b))` 이런 식으로 선언)

`most_stocked`가 선언된 환경, `self Inventory` 인스턴스를 캡쳐해서 코드가 실행될 때 넘겨준다.

(사실 예제가 잘 이해안됨. `method`라 self에 대한 reference를 받기 때문에 self를 사용할 수 있는거 아닌가?)

#### 다른 예시

closure의 다른 예시를 살펴보자.

```rust
fn main() {
    let x = 4;

    let equal_to_x = |z| z == x;

    let y = 4;

    assert!(equal_to_x(y));
}
```

* 위의 equal_to_x 클로져는 x의 값을 캡쳐하기 때문에 클로져의 파라메터로 x를 넘겨주지 않아도 사용할 수 있다.
* 함수로 정의하면 함수 내부 스코프에서는 x에 대해 모르므로 컴파일 에러난다.

```rust
fn main() {
    let x = 4;

    fn equal_to_x(z: i32) -> bool { z == x }

    let y = 4;

    assert!(equal_to_x(y));
}
```


### [Closure Type Inference and Annotation](https://doc.rust-lang.org/book/ch13-01-closures.html#closure-type-inference-and-annotation)

함수와 Closure는 더 많은 다른 점이 있다.

* 클로져는 Type을 명시할 필요가 거의 없다. 클로져는 밖으로 공개되는 것이 아니라 유즈케이스로 부터 타입을 유추하면 되기 때문.
	* 선언 방식이 자유롭다.
```rust
fn  add_one_v1   (x: u32) -> u32 { x + 1 }
let add_one_v2 = |x: u32| -> u32 { x + 1 };
let add_one_v3 = |x|             { x + 1 };
let add_one_v4 = |x|               x + 1  ;
```

### [Capturing References or Moving Ownership](https://doc.rust-lang.org/book/ch13-01-closures.html#capturing-references-or-moving-ownership)

Closure는 환경으로부터 세가지 방법으로 값을 캡쳐한다. (함수의 파라메터와 같은 방법)
1. borrowing immutably
2. borrowing mutably
3. taking ownership

* Immutable reference를 캡쳐

```rust
fn main() {
    let list = vec![1, 2, 3];
    println!("Before defining closure: {:?}", list);

    let only_borrows = || println!("From closure: {:?}", list);

    println!("Before calling closure: {:?}", list);
    only_borrows();
    println!("After calling closure: {:?}", list);
}
```

* mutable reference 캡쳐
```rust
fn main() {
    let mut list = vec![1, 2, 3];
    println!("Before defining closure: {:?}", list);

    let mut borrows_mutably = || list.push(7);

    borrows_mutably();
    println!("After calling closure: {:?}", list);
}
```

* move (take ownership)
	* 보통 쓸일은 없는데
	* 다른 쓰레드한테 일시킬때, ownership을 넘겨주어야, 값의 소유권을 가지고 있는 애가 값을 사용하는 애보다 먼저 끝날 일을 없앨 수 있다.

```rust
use std::thread;

fn main() {
    let list = vec![1, 2, 3];
    println!("Before defining closure: {:?}", list);

    thread::spawn(move || println!("From thread: {:?}", list))
        .join()
        .unwrap();
}
```

### [Moving Captured Values Out of Closures and the `Fn` Traits](https://doc.rust-lang.org/book/ch13-01-closures.html#moving-captured-values-out-of-closures-and-the-fn-traits)

Closure가 정의된 곳에서 environment의 값들을 캡쳐하고, Closure가 evaluated (사용)될때, Closure의 body(내용)에서 이 값들에 뭔가 일이 생긴다.
이 뭔가의 일은 이 중 하나다.
* capture된 값을 closure 밖으로 내보낸다.
* capture된 값을 변화시킨다.
* 위의 둘 중 아무것도 안한다.

Closure가 값을 캡쳐하고 다루는 방식에 따라서 closure가 어떤 trait를 구현할 지가 달라진다.

Closure는 아래 3개의 `Fn` Trait 중 하나를 **자동으로** 구현하게 된다.

1. `FnOnce` 한번 불릴 수 있는 클로져. capture된 값을 closure 밖으로 내보내는(move) 경우.  한번만 불려야하는 클로져는 이 Trait만 구현한다.
2. `FnMut` captured value를 move 하지 않지만 mutate(변형)하는 경우. 한번 이상 불릴 수 있음.
3. `Fn` move하지 않고, mutate하지 않고, 혹은 capture조차 하지 않는 closure. 무한으로 불려도 되고, **심지어 동시에 불려도 된다**.

`unwrap_or_else` 메크로를 예시로 보자.
```rust
impl<T> Option<T> {
    pub fn unwrap_or_else<F>(self, f: F) -> T
    where
        F: FnOnce() -> T
    {
        match self {
            Some(x) => x,
            None => f(),
        }
    }
}
```

`unwrap_or_else`에 부여되는 closure는 `FnOnce` TraitBound를 가지고, 이것은 딱 한번만 부를 수 있다는 제약 조건이다.

실제로 body에서 한 번의 `f`가 불린다.

모든 closure는 `FnOnce`를 구현하기 때문에, `unwrap_or_else`는 많은 종류의 closure를 받을 수 있는 것이다.

#### 다른예시
`sort_by_key` 의 예시를 보자.

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let mut list = [
        Rectangle { width: 10, height: 1 },
        Rectangle { width: 3, height: 5 },
        Rectangle { width: 7, height: 12 },
    ];

    list.sort_by_key(|r| r.width);
    println!("{:#?}", list);
}
```

`sort_by_key`는 `FnMut` closure를 받도록 정의되어 있다. 그 이유는 slice의 각 아이템에 대해서 한번씩 불려야하기 때문이다.
body에서 환경의 value 를 move, mute, capture하지 않았기 때문에 Trait bound 요구사항을 만족한다.

만약 아래와 같은 코드 상황에서는 어떨까?
```rust
// --strip
    let mut sort_operations = vec![];
    let value = String::from("by key called");

    list.sort_by_key(|r| {
        sort_operations.push(value);
        r.width
    });
    println!("{:#?}", list);
}
```

closure의 body를 보자.
```rust
        sort_operations.push(value);
```

이 부분에서 클로져 안으로 가져온 `value`의 ownership을 sort_operations로 넘긴다.
이 클로져는 한번은 실행되겠지만, 두번째는 이미 closure가 capture한 `value`의 ownership을 넘겼기 때문에 룰에 위반된다. 따라서 이 클로져는 `FnOnce` Trait만 구현할 수 있다.
하지만 `sort_by_key`의 클로져는 `FnMut`구현을 필요로 하기 때문에 이는 컴파일 실패한다.

```console
$ cargo run
   Compiling rectangles v0.1.0 (file:///projects/rectangles)
error[E0507]: cannot move out of `value`, a captured variable in an `FnMut` closure
  --> src/main.rs:18:30
   |
15 |     let value = String::from("by key called");
   |         ----- captured outer variable
16 |
17 |     list.sort_by_key(|r| {
   |                      --- captured by this `FnMut` closure
18 |         sort_operations.push(value);
   |                              ^^^^^ move occurs because `value` has type `String`, which does not implement the `Copy` trait

For more information about this error, try `rustc --explain E0507`.
error: could not compile `rectangles` due to previous error
```

## [Processing a Series of Items with Iterators](https://doc.rust-lang.org/book/ch13-02-iterators.html#processing-a-series-of-items-with-iterators)

Iterator pattern은 items의 시쿼스에 대해 같은 일을 수행할 때 좋다.
Iterator는 다음 item을 어떻게 돌껀지에 대한 로직과 언제 끝날지에 대해 책임진다.

Rust에서 iterators는 _lazy_ 하다. 그 뜻은 누군가 iterator를 consume하기 전까지 효과가 없다는 것이다.

### [The `Iterator` Trait and the `next` Method](https://doc.rust-lang.org/book/ch13-02-iterators.html#the-iterator-trait-and-the-next-method)

모든 iterator는 Iterator Trait를 구현한다.
```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;

    // methods with default implementations elided
}
```

새로운 문법이 있는데, `Type Item`과 `Self::Item` 이다.
이를 _associated type_ 이라고 하고, 나중에 배운다. 
지금은 _Iterator를 구현할때 Item type도 선언해야한다_ 라고 생각하면 된다.

iterator가 어떻게 돌아가나 사용해보자.
```rust
#[test]
fn iterator_demonstration() {
	let v1 = vec![1, 2, 3];

	let mut v1_iter = v1.iter();

	assert_eq!(v1_iter.next(), Some(&1));
	assert_eq!(v1_iter.next(), Some(&2));
	assert_eq!(v1_iter.next(), Some(&3));
	assert_eq!(v1_iter.next(), None);
}
```

* 여기서 `v1_iter`를 mutable로 선언한것을 눈여겨보자. 그 이유는 `next` method가 iterator의 내부 state를 업데이트해서 시퀀스를 추적하기 때문이다. `next`를 호출함으로써 아이템을 소모하기 때문에, 다른 말로 이 코드가 iterator를 _consume_ 한다고 표현한다.

* `next`에서 받는게 immutable 이다. ownership을 받고 싶다면 `into_iter`, mutable reference를 받고 싶으면 `iter_mut`를 사용하자.

### [Methods that Consume the Iterator](https://doc.rust-lang.org/book/ch13-02-iterators.html#methods-that-consume-the-iterator)

Iterator의 next를 부르는 method를 _consuming adaptors_ 라고 한다.

그 예시로 `sum`메소드가 있다.
```rust
    #[test]
    fn iterator_sum() {
        let v1 = vec![1, 2, 3];

        let v1_iter = v1.iter();

        let total: i32 = v1_iter.sum();

        assert_eq!(total, 6);
    }
```

### [Methods that Produce Other Iterators](https://doc.rust-lang.org/book/ch13-02-iterators.html#methods-that-produce-other-iterators)

_Iterator adaptors_ 는 Iterator를 consume하는 대신에 원본에 수정을 가한 다른 iterator를 만들어 내는 메소드이다.

```rust
let v1: Vec<i32> = vec![1, 2, 3];
v1.iter().map(|x| x + 1);
```

참고로 위 코드는 `warning: unused `Map` that must be used` Warning이 뜬다. 이유는 iterator는 consumer가 없으면 아무 효과가 없기 때문이다.


### [Using Closures that Capture Their Environment](https://doc.rust-lang.org/book/ch13-02-iterators.html#using-closures-that-capture-their-environment)

스킵


## [Improving Our I/O Project](https://doc.rust-lang.org/book/ch13-03-improving-our-io-project.html#improving-our-io-project)

이전 챕터에서 작성했던 Command Line Program을 Iterator를 사용해서 더욱 개선 시킨다.

### [Removing a `clone` Using an Iterator](https://doc.rust-lang.org/book/ch13-03-improving-our-io-project.html#removing-a-clone-using-an-iterator)

```rust
impl Config {
    pub fn build(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }

        let query = args[1].clone();
        let file_path = args[2].clone();

        let ignore_case = env::var("IGNORE_CASE").is_ok();

        Ok(Config {
            query,
            file_path,
            ignore_case,
        })
    }
}
```

위의 코드처럼 `clone` 을 사용했었다. `clone`은 비효율적이기 때문에, 이제 없애 보고자한다.

> Config를 리턴하기 위해서 Config가 fields의 ownership을 가져야했지만, String에 대한 ownership은 args가 가지고 있어서 clone 했었음.

이제 우리는 iterator로 ownership을 가져올 수 있으므로 이를 활용해서 해결해보자.

#### [Using the Returned Iterator Directly](https://doc.rust-lang.org/book/ch13-03-improving-our-io-project.html#using-the-returned-iterator-directly)

`main.rs`에서 build할 때 iterator를 그대로 넘겨주도록한다.
```rust
fn main() {
    let config = Config::build(env::args()).unwrap_or_else(|err| {
        eprintln!("Problem parsing arguments: {err}");
        process::exit(1);
    });

    // --snip--
}
```

`build`함수 선언부도 업데이트 해야한다.
```rust
impl Config {
    pub fn build(
        mut args: impl Iterator<Item = String>,
    ) -> Result<Config, &'static str> {
        // --snip--
```

#### [Using `Iterator` Trait Methods Instead of Indexing](https://doc.rust-lang.org/book/ch13-03-improving-our-io-project.html#using-iterator-trait-methods-instead-of-indexing)

이제 함수 body를 업데이트 해보자. `arg`의 소유권을 가져왔기 때문에 arg 에서 나온 value들의 소유권도 그대로 가지고 있고, 따라서 Config도 field들의 소유권을 가진다.

```rust
impl Config {
    pub fn build(
        mut args: impl Iterator<Item = String>,
    ) -> Result<Config, &'static str> {
        args.next();

        let query = match args.next() {
            Some(arg) => arg,
            None => return Err("Didn't get a query string"),
        };

        let file_path = match args.next() {
            Some(arg) => arg,
            None => return Err("Didn't get a file path"),
        };

        let ignore_case = env::var("IGNORE_CASE").is_ok();

        Ok(Config {
            query,
            file_path,
            ignore_case,
        })
    }
}
```

### [Making Code Clearer with Iterator Adaptors](https://doc.rust-lang.org/book/ch13-03-improving-our-io-project.html#making-code-clearer-with-iterator-adaptors)

`search` 함수도 더 깔끔하게 만들어보자. 아래가 원본이다.

```rust
pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let mut results = Vec::new();

    for line in contents.lines() {
        if line.contains(query) {
            results.push(line);
        }
    }

    results
}
```

필터를 사용해서 정리하자.
```rust
pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents
        .lines()
        .filter(|line| line.contains(query))
        .collect()
}
```

훨씬 깔끔하다.

### [Choosing Between Loops or Iterators](https://doc.rust-lang.org/book/ch13-03-improving-our-io-project.html#choosing-between-loops-or-iterators)

그러면 이제 루프를 쓰는 버전이 좋은지, Iterator 를 쓰는 스타일이 좋은 지에 대해 질문을 제시할 수 있다.
대부분의 Rust 개발자는 iterator 스타일을 선호한다.
처음에는 약간 거북할 수는 있어도, iterator adaptor를 많이 알게될 수록 더 이해하기 쉬워진다.

loop를 좀 더 추상화한 iterator를 사용하면서 더 집중해야할 부분에 집중하자.

근데 진짜 이 두가지 방식이 동일할까? Loop가 좀 더 빠를거 같은데 아닌가?

## [Comparing Performance: Loops vs. Iterators](https://doc.rust-lang.org/book/ch13-04-performance.html#comparing-performance-loops-vs-iterators)

새로 구현한 `search` 와 loop version에 대해 밴치마크를 돌려봤다. 
```console
test bench_search_for  ... bench:  19,620,300 ns/iter (+/- 915,700)
test bench_search_iter ... bench:  19,234,900 ns/iter (+/- 657,200)
```

거의 동일한 성능이다.

컴파일러가 iterator의 high-level abstraction을 loop와 거의 같은 코드로 만든다. Iterator는 러스트의 _zero-cost abstractions_ 중의 하나이다. 런타임에 비용을 추가 하지 않는 abstraction이라는 것이다.

오디오를 decoding 하는 코드가 여기 있다. iterator를 많이 사용했다.
```rust
let buffer: &mut [i32];
let coefficients: [i64; 12];
let qlp_shift: i16;

for i in 12..buffer.len() {
    let prediction = coefficients.iter()
		 .zip(&buffer[i - 12..i])
		 .map(|(&c, &s)| c * s as i64)
		 .sum::<i64>() >> qlp_shift;
    let delta = buffer[i];
    buffer[i] = prediction as i32 + delta;
}
```

컴파일러가 컴파일해서 Assembly code를 만들 때 그 결과물은 우리가 직접 손으로 짤 코드(우리가 어셈블리 개 고수라면)랑 동일하다.

`loop unrolling`이라는 최적화 기법을 통해서 루프조차 없애고 그냥 반복적인 코드로 바꿔버린다.

# [More About Cargo and Crates.io](https://doc.rust-lang.org/book/ch14-00-more-about-cargo.html#more-about-cargo-and-cratesio)
