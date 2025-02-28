---
title: RAII and Smart Pointers
date: 2025-02-28
tags: ['cplusplus', 'stl']
authors: ['Maya']
ai: True
draft: False
---
We all know that manual memory management in C++ is quite troublesome, so RAII and smart pointers were introduced to help us manage memory.

## RAII
**RAII** (Resource Acquisition Is Initialization) refers to the idea that an object should acquire all the resources it needs upon creation and release those resources upon destruction. The duration of the object's ownership of the resources is the same as the object's lifecycle. In terms of code, this means acquiring all resources in the constructor and releasing them in the destructor.

Using RAII can solve some of our problems. For example, we can `new` an object in the constructor and `delete` it in the destructor, but this still carries risks because we still need to manually `new` and `delete` objects. To automate this process, smart pointers were introduced.

## Smart Pointers
Smart pointers are a general term that refers to pointers that can automatically manage the memory of objects. The STL has the following three specific smart pointers:
### std::unique_ptr
Starting with the simplest, `std::unique_ptr` completely "**owns**" an object, and no one else has the right to manage the memory of this object. 
For example, we can write code like this:
```cpp
char* p = new char[1024];
char* other = p;
delete[] p;
delete[] other;
```
In the code above, both `p` and `other` manage the memory allocated by `new`. If we copy this pointer multiple times in the program, as soon as one of them performs a `delete` operation, all remaining pointers become dangling pointers, and at that point, we are unaware of it. There is no clear mechanism to determine whether a pointer is a dangling pointer. When we try to access or `delete` this pointer again, it can lead to use-after-free or double-free errors.

`std::unique_ptr` prevents copying of this pointer by deleting the copy constructor and assignment operator, meaning that there can be only one `std::unique_ptr` pointing to the allocated memory. When this unique `std::unique_ptr` goes out of scope, it automatically releases the memory it manages. At this point, no one can reference the released memory, ensuring safety.

```cpp
{
	auto p = std::make_unique<int>(1);
	auto other = p;// does not compile
}
*p;// 'p' does not exists
```
### std::shared_ptr

If `std::unique_ptr` is exclusive, then `std::shared_ptr` is **shared**. It maintains an atomic counter at each memory block it points to, which records how many `std::shared_ptr` instances are referencing that memory. When we create a new `std::shared_ptr`, the counter pointing to that memory increases by 1, and when it is destroyed, the counter decreases by 1. When the counter **reaches zero**, the memory is released.

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

It looks wonderful, but we must remember that `std::shared_ptr` has **overhead**. The **atomic counter** it holds ensures thread safety, allowing it to work correctly when multiple threads operate on it simultaneously. However, atomic operations are relatively inefficient, so I do not highly recommend using `std::shared_ptr`.
### std::weak_ptr

`std::shared_ptr` relies on the counter to determine whether to destroy the memory, which seems to solve all memory management problems. But what if there are circular references between our objects?
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
When such a situation occurs in our code, `std::shared_ptr` cannot correctly release the memory. For example, here, the memory pointed to by `a` has two references: `a` itself and `b.next`. The memory pointed to by `b` also has two references: `b` itself and `a.next`. When `a` and `b` go out of scope, their counters decrease by 1, becoming 1. `a.next` and `b.next` still reference valid memory, but at this point, we can no longer access `a` and `b`, leading to memory leaks.

Thus, `std::weak_ptr` was born. `std::weak_ptr` represents a "**weak reference**" to an object, meaning that a single `std::weak_ptr` is not enough to keep an object alive. We can create a `std::weak_ptr` from a `std::shared_ptr`, which does not increase the `std::shared_ptr`'s counter. When we need to reference the object pointed to by `std::weak_ptr`, we can use the `lock` method to temporarily upgrade it to a `std::shared_ptr`. If the original `std::shared_ptr` that created it has a counter that reaches zero and releases the memory, the `lock` method will return a null pointer, thus solving the circular reference problem.

For example, in the code above, we can define that the pointer from the tail node to the head node should be a `std::weak_ptr`. This way, the reference count of the head node remains 1. When it goes out of scope, it will reach zero, causing the memory of this node to be released, while simultaneously breaking the reference to the `next` node. After continuous iterations, the tail node will be released.