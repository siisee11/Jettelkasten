---
tags:
  - public
created: '2024-03-06T09:43:38.000Z'
updated: '2024-03-06T09:43:38.000Z'
---
[[충무로마피아 2차 충무회의]] 의 세미나 내용

[[../Permanent/Rust 배우기|Rust 배우기]] 에 더 자세한 내용이 있음

[Presentation](https://www.canva.com/design/DAF-oG8Mi-g/R2OSgegOC1rJyJZ4KCcQew/edit?utm_content=DAF-oG8Mi-g&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## 1. Compiler 언어

[컴파일언어와 인터프리터 언어](https://youtu.be/e4ax90XmUBc?si=VeftS8HNgSA_p1wY) 

`소스코드 -> 컴파일 -> 머신코드(executable)` 의 개발과정을 거치는 실행하기 위해서 컴파일링이 필요한 언어이다.

컴파일러 언어는 실행파일을 만들기위해 컴파일링을 해야하지만, 실행파일이 만들어진 후에는 실행만 하면 되기 때문에 실행 속도가 빠르다.

C 계열, Java 등의 언어가 있다.

* 다른 방면으로 Interpreter언어가 있는데, 이는 소스코드의 컴파일 과정 없이 interpreter가 소스크드를 바로 해석하여 실행한다. 즉, 실행과정에 interpreter의 개입이 있기 때문에 느리다.

## 2. Mutable

Mutable 과 Immutable

## 3. Ownership

Rust에만 있는 특이한 개념. Ownership은 메모리 관리를 '더 잘' 하기위해서 생겨난 개념이다.

### Why Ownership

'더 잘'을 이해하기 위해서는 다른 언어는 어떤 방식으로 메모리를 관리하는 지 알아야한다.

* C계열: C는 메모리에 대해 아주 low level 인터페이스를 제공한다. `malloc`과 `free` 이다.
	* 문제: malloc을 했으면 free해주어야한다. 만약 실수로 안하게된다면 메모리 누수가 생긴다.
* GC계열: 가비지 콜렉터(GC)가 주기적으로 돌면서 죽어있는 메모리를 수집해서 다시 쓸 수 있는 공간으로 만드는 언어들. 사용자는 메모리의 할당 해제에 신경을 거의 쓰지 않아도 된다.
	* 문제: GC가 돌아야하는 컴퓨팅 비용도 있고, GC가 수집할 수 있는 메모리임을 추적하는데 필요한 메타데이터들도 많다.

실수를 방지하면서, GC도 없앨 방법으로 ownership의 개념이 도입되었다.

### What is Ownership

#### 돌아보기: Stack & Heap

1. Stack
2. Heap

#### Ownership 의 역할

Heap에 할당된 메모리를 추적하고, 중복이 없게하고, 사용이 완료되면 해제하는 것이 ownership의 역할이다.

#### Ownership rules

- Each value in Rust has an _owner_.
- There can only be one owner at a time.
- When the owner goes out of scope, the value will be dropped.

Meaning

1. 값이 생기고 그 값에 대한 owner가 생긴다. (allocation)
2. 한 값에 대한 owner는 한 명 뿐이다. (tracking)
3. owner가 scope 밖으로 나가면 value는 없어진다. (free)

결국 이 룰만 다 지켜지면 메모리의 할당, 추적, 해제를 보장할 수 있다.


### Move
```rust
let s1 = String::from("hello"); 
let s2 = s1;
```

이 시점에 `s1`은 invalidate됨.

### Copy
Stack 에만 존재하는 데이터는 copy됨.
```rust
let x = 5; 
let y = x;
```


### Example Code

```rust
fn main() {
    let s1 = gives_ownership();
    takes_ownership(s1);
    let s2 = String::from("hello");
    let s3 = takes_and_gives_back(s2);
} 

fn takes_ownership(some_string: String) {
    println!("{}", some_string);
}

fn gives_ownership() -> String {
    let some_string = String::from("yours");
    some_string
}

fn takes_and_gives_back(a_string: String) -> String {
    a_string 
}
```


## 4. Reference

원본을 빌리는거기 때문에 borrowing 이라고도 함.

* immutable reference
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

* mutable reference
```rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

* compile error (only one mut ref!!!)
```rust
    let mut s = String::from("hello");

    let r1 = &s; // no problem
    let r2 = &s; // no problem
    let r3 = &mut s; // BIG PROBLEM

    println!("{}, {}, and {}", r1, r2, r3);
```

* Why only one mut ref??

## 5. Null does not existing

* Rust에는 다른 프로그래밍 언어에 있는 Null이 없다.
* 널의 inventor인 Tony Hoare은 2009년에 [Enum and Its Advantages Over Null Values](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html#the-option-enum-and-its-advantages-over-null-values)프리젠테이션에서 이렇게 말함.
	* 완벽하게 safe한 reference를 만들고 싶었는데
	* null reference를 두면 매우 쉽다는 유혹을 떨쳐내지 못해서
	* 수십년간 많은 에러, 취약성, 시스템 크래시등을 발생시켰다.
	
* Null의 컨셉(지금 값이 유효하지 않거나 없다)은 유용하다, 대신 구현의 방법에 따라 오류에 취약할 뿐이다.


### 널의 컨셉을 표현하는 Options

```rust
enum Option<T> { None, Some(T), }
```

* 값이 없으면 None, 있으면 Some값을 가지는 Enum.
* None으로 null의 개념을 표현한다.
* null값과 다르게 Option값은 실제로 사용할 수 없다.
* 옵션값은 사용하기전에 양쪽 모든 경우를 다뤄줘야 한다.

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
	match x {
		None => None,
		Some(i) => Some(i + 1),
	}
}
```


## 6. Lifetime

Reference는 lifetime이 존재하며 이를 명시해줘야하는 경우가 있다.

