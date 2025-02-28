---
title: RAII與智能指針
date: 2025-02-28
tags: ['cplusplus', 'stl']
authors: ['Maya']
ai: True
draft: False
---
我们都知道C++中的手动內存管理十分麻煩, 所以引入了RAII和智能指針來輔助我們管理內存。

## RAII
**RAII**(Resource Acquisition Is Initialization, 資源獲取即初始化), 指的是對象在從創建就應該獲取所有所需要的資源, 在銷毀時則釋放這些資源, 對象對資源的佔有時間與對象的生命週期相同。放到代碼層面就是在構造函數中獲取所有資源, 在析構函數中釋放資源。

使用RAII可以解決我們的一些問題, 比如我們可以在構造函數中`new`一個對象, 在析構函數中`delete`它, 但是這依然是有風險的, 因為我們還是需要手動`new`和`delete`對象, 為了將這個流程自動化, 智能指針就出現了。

## 智能指針
智能指針是一個泛稱, 它是指能夠自動對對象的內存進行管理的指針, STL中有如下三種特定的智能指針：
### std::unique_ptr
從最簡單的開始, `std::unique_ptr`完全的"**擁有**"一個對象, 其他人沒有管理這個對象內存的資格。
比如說我們可以寫出這樣的代碼：
```cpp
char* p = new char[1024];
char* other = p;
delete[] p;
delete[] other;
```
上面的代碼中, `p`和`other`同時對`new`出的內存進行了管理, 如果我們在程序中多次複製這個指針, 只要有一個進行了`delete`操作, 剩余所有指針都變成了野指針, 而且這個時候我們是不知情的, 沒有一個明確的機制能夠知道一個指針是不是野指針, 當我們再次訪問或者嘗試`delete`這個指針的時候, 就會產生use-after-free或者double-free。

`std::unique_ptr`通過刪除了拷貝構造函數和賦值操作符禁止對這個指針進行複製, 也就是說有且只有一個`std::unique_ptr`可以指向分配出的內存, 當這個唯一的`std::unique_ptr`離開自己的作用域之後就會自動釋放自己管理的內存。此時沒有人能夠再引用到釋放的這塊內存, 保證了安全。

```cpp
{
	auto p = std::make_unique<int>(1);
	auto other = p;// does not compile
}
*p;// 'p' does not exists
```
### std::shared_ptr

如果說`std::unique_ptr`是獨佔的, 那麼`std::shared_ptr`就是**共有**的, 它在每個指向內存塊處都維護了一個原子的計數器, 它來記錄當前有多少`std::shared_ptr`引用了這塊內存, 當我們創建一個新的`std::shared_ptr`的時候, 指向那塊內存的計數器就會+1, 而銷毀的時候就會-1, 當計數器**歸零**的時候就釋放這塊內存。

```cpp
auto p = std::make_shared<int>(1);
p.use_count();// 1
{
	auto other = p;
	other.use_count();// 2
}
p.use_count();// 1
p.reset();// set p to nullptr, decrease reference counter
p.use_count();// 0
```

看上去很美妙, 但是我們要記住`std::shared_ptr`是**有開銷**的, 它持有的**原子計數器**雖然保證了線程安全, 在多個線程同時對它進行操作的時候可以正常工作, 但是原子操作的效率是比較低的, 因此我不是很推薦使用`std::shared_ptr`。
### std::weak_ptr

`std::shared_ptr`依靠計數器來判斷是否應該銷毀內存, 看上去解決了內存管理的所有問題, 但是如果我們對象之間有循環引用的關係呢？
```cpp
struct Node{
	int val=0;
	std::shared_ptr<Node>next=nullptr;
};
auto a = std::make_shared<Node>(1);
auto b = std::make_shared<Node>(2);
a->next = b;
b->next = a;
```
當我們的代碼中出現這種情況的時候, `std::shared_ptr`就沒有辦法正確釋放內存了, 比如說這裡, a指向的內存有兩個引用, a自己和b.next, b指向的內存有兩個引用, b自己和a.next。那麼當ab離開作用域之後他們的計數器都-1, 變成了1, a.next和b.next都還引用著有效的內存, 但是此時我們已經訪問不到a和b了, 因此這些內存會被泄露。

因此`std::weak_ptr`誕生了, `std::weak_ptr`表示的是一個對象的"**弱引用**", 也就是說只有一個`std::weak_ptr`是不足以維持一個對象繼續存活的。我們可以通過`std::shared_ptr`來創建`std::weak_ptr`, 這並不會增加這個`std::shared_ptr`的計數, 當我們需要引用`std::weak_ptr`指向的對象的時候, 可以使用`lock`方法來暫時將它升級為一個`std::shared_ptr`, 如果之前創建它的`std::shared_ptr`引用歸零, 釋放內存之後, 它`lock`得到的只是空指針, 這樣就解決了循環引用的問題。

比如上面的代碼中我們可以定義尾節點指向頭節點的指針需要是一個`std::weak_ptr`, 那麼頭節點的引用計數只有1, 當離開作用域的時候, 它會歸零導致這個節點的內存被釋放, 同時解除`next`節點的引用, 不斷迭代之後尾節點被釋放。