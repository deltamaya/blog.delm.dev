---
title: RAII与智能指针
date: 2025-02-28
tags:
  - cplusplus
  - stl
authors:
  - Maya
ai: false
draft: false
---
我们都知道C++中的手动内存管理十分麻烦, 所以引入了RAII和智能指针来辅助我们管理内存.


## RAII
**RAII**(Resource Acquisition Is Initialization, 资源获取即初始化),  指的是对象在从创建就应该获取所有所需要的资源, 在销毁时则释放这些资源, 对象对资源的占有时间与对象的生命周期相同. 放到代码层面就是在构造函数中获取所有资源, 在析构函数中释放资源.

使用RAII可以解决我们的一些问题, 比如我们可以在构造函数中`new`一个对象, 在析构函数中`delete`它, 但是这依然是有风险的, 因为我们还是需要手动`new`和`delete`对象, 为了将这个流程自动化, 智能指针就出现了.

## 智能指针
智能指针是一个泛称, 他是指能够自动对对象的内存进行管理的指针, STL中有如下三种特定的智能指针:
### std::unique_ptr
从最简单的开始, `std::unique_ptr`完全的"**拥有**"一个对象, 其他人没有管理这个对象内存的资格.
比如说我们可以写出这样的代码:
```cpp
char* p = new char[1024];
char* other = p;
delete[] p;
delete[] other;
```
上面的代码中, `p`和`other`同时对`new`出的内存进行了管理, 如果我们在程序中多次复制这个指针, 只要有一个进行了`delete`操作, 剩余所有指针都变成了野指针, 而且这个时候我们是不知情的, 没有一个明确的机制能够知道一个指针是不是野指针, 当我们再次访问或者尝试`delete`这个指针的时候, 就会产生use-after-free或者double-free.

`std::unique_ptr`通过删除了拷贝构造函数和赋值操作符禁止对这个指针进行复制, 也就是说有且只有一个`std::unique_ptr`可以指向分配出的内存, 当这个唯一的`std::unique_ptr`离开自己的作用域之后就会自动释放自己管理的内存. 此时没有人能够再引用到释放的这块内存, 保证了安全.

```cpp
{
	auto p = std::make_unique<int>(1);
	auto other = p;// does not compile
}
*p;// 'p' does not exists
```
### std::shared_ptr

如果说`std::unique_ptr`是独占的, 那么`std::shared_ptr`就是**共有**的, 他在每个指向内存块处都维护了一个原子的计数器, 它来记录当前有多少`std::shared_ptr`引用了这块内存, 当我们创建一个新的`std::shared_ptr`的时候, 指向那块内存的计数器就会+1, 而销毁的时候就会-1, 当计数器**归零**的时候就释放这块内存. 

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

看上去很美妙, 但是我们要记住`std::shared_ptr`是**有开销**的, 它持有的**原子计数器**虽然保证了线程安全, 在多个线程同时对它进行操作的时候可以正常工作, 但是原子操作的效率是比较低的, 因此我不是很推荐使用`std::shared_ptr`.
### std::weak_ptr

`std::shared_ptr`依靠计数器来判断是否应该销毁内存, 看上去解决了内存管理的所有问题, 但是如果我们对象之间有循环引用的关系呢?
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
当我们的代码中出现这种情况的时候, `std::shared_ptr`就没有办法正确释放内存了, 比如说这里, a指向的内存有两个引用, a自己和b.next, b指向的内存有两个引用, b自己和a.next. 那么当ab离开作用域之后他们的计数器都-1, 变成了1, a.next和b.next都还引用着有效的内存, 但是此时我们已经访问不到a和b了, 因此这些内存会被泄露.

因此`std::weak_ptr`诞生了, `std::weak_ptr`表示的是一个对象的"**弱引用**", 也就是说只有一个`std::weak_ptr`是不足以维持一个对象继续存活的. 我们可以通过`std::shared_ptr`来创建`std::weak_ptr`, 这并不会增加这个`std::shared_ptr`的计数, 当我们需要引用`std::weak_ptr`指向的对象的时候, 可以使用`lock`方法来暂时将它升级为一个`std::shared_ptr`, 如果之前创建它的`std::shared_ptr`引用归零, 释放内存之后, 它`lock`得到的只是一个空指针, 这样就解决了循环引用的问题.

比如上面的代码中我们可以定义尾节点指向头节点的指针需要是一个`std::weak_ptr`, 那么头节点的引用计数只有1, 当离开作用域的时候, 它会归零导致这个节点的内存被释放, 同时解除`next`节点的引用, 不断迭代之后尾节点被释放.