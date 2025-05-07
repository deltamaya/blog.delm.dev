---
title: Further Understanding Concurrency Control
date: 2025-05-04
tags: ['operating-system']
authors: ['Maya']
ai: True
draft: false
---
As the development speed of hardware encounters bottlenecks, the performance improvements of single-core processors have become increasingly slower. To achieve better performance gains, we can use multiple CPUs to accelerate computations. However, the introduction of multiple CPUs also brings more problems.

## Shared Memory
When multiple CPUs operate on the same shared memory simultaneously, a critical assumption we often make while writing code becomes invalid—that as long as we don’t modify the memory, it won’t change. If you use code like this:  

```c
if(cond==true){
	assert(cond)
}
```  

In concurrent programs, your `assert` might fail. Here’s a possible scheduling sequence: Thread A finishes reading `cond` and jumps inside the `if` statement, then switches to another thread B, which modifies `cond` to `false` during execution. Finally, the control switches back to A to continue execution.  

Such concurrency conflicts are intolerable—I definitely don’t want my `if` to behave as if it doesn’t exist.  

## Data Race  
Most concurrency issues are caused by Data Races, which occur when multiple threads concurrently access the same memory location, with at least one operation being a write.  

In the example above, the concurrency bug arises because Thread A reads `cond` while B concurrently writes to `cond`.  
To avoid Data Races, mutual exclusion and synchronization between threads must be ensured:  

## Mutual Exclusion  

### Locks  

To avoid this issue, we need a method to enforce mutual exclusion between threads—this method is called a **lock**:  

```c
lock()
// do something
unlock()
```  

Within the locked region, the world becomes quiet—only one thread runs on the computer, so there’s no need to worry about issues caused by shared memory. Here’s a possible lock implementation:  

```c
void lock(){
	while(!ok);
	ok=false;
}
void unlock(){
	ok=true;
}
```  

### Atomic Operations  

However, this implementation has the same problem: what if another thread switches in right after the `while` loop exits?  
The reason the lock fails here is that the `ok` variable it relies on doesn’t support atomic `load` and `store` operations. Ideally, we want to set `ok` to `false` at the exact moment the lock is acquired. To achieve this, hardware provides an atomic operation called **CAS (Compare and Swap)**. With it, modifications to `ok` can be made atomic.  
```c
// returns the value of address
bool compare_and_swap(bool expected, bool target, bool *addr);
void lock(){
    while(!compare_and_swap(true, false, &ok));
}
void unlock(){
    compare_and_swap(false, true, &ok);
}
```  
Here, the CAS instruction checks whether the value pointed to matches `expected`. If they are equal, it swaps `target` and `addr` and returns `true`; otherwise, it does nothing and returns `false`.  
Note that this operation is performed by hardware—no software or OS intervention is needed—and ensures the entire operation is executed without interruption, making this lock implementation correct.  

### Mutex  
With the above spinlock, we can achieve basic mutual exclusion. However, since spinlocks use a busy-wait mechanism, when the thread holding the lock is preempted by the OS scheduler or when lock contention is high, waiting threads continuously consume CPU resources, reducing efficiency. Is there a way to optimize lock performance and reduce CPU waste?  

The solution is to use OS synchronization primitives, such as `std::mutex` in the C++ standard library. When a thread fails to acquire the lock, `std::mutex` makes a system call to put the thread into a waiting state (instead of busy-waiting), and the OS wakes it up when the lock is released.  

Note that the actual implementation of `std::mutex` is more complex—the above is a simplified explanation. In reality, `std::mutex` may rely on primitives like `futex` (Fast Userspace Mutex), performing a brief spin in user mode under low contention before resorting to system calls to put the thread to sleep.  

## Synchronization  
So far, we’ve only addressed mutual exclusion between threads—synchronization issues remain unresolved. **Synchronization** means ensuring that a task starts only after another task completes.  

### Condition Variables  
A simple way to implement synchronization might look like this:  
```c
void func1(){
	// perform operations
	task_done = true;
}

void func2(){
	while(!task_done);
}
```  

But again, this variable isn’t atomic. We can solve this by using locks or switching to atomic variables. If we use a lock, we must release it and continue sleeping when the condition isn’t met. Additionally, if the condition is met, the thread must be woken up. This is the basic idea behind **condition variables**. Fortunately, the C++ standard library provides them:  

```cpp
void func1(){
	std::unique_lock lk(mtx);
	// perform operations
	task_done=true;
	cv.notify_all();
	lk.unlock();
}
void func2(){
	std::unique_lock lk(mtx);
	cv.wait(lk,[]{return task_done;})
}
```  

Whenever `func2` is woken up, it acquires the lock `lk`, checks whether `task` is completed, and blocks again (releasing `lk`) if not. Otherwise, it proceeds with the lock held.  
Note that condition variables and locks are implemented by the threading library or the OS, so we don’t need to worry about the spinlock issues mentioned earlier. Also, `cv.wait` is atomic—it releases the lock while waiting, avoiding deadlocks.  
Another important point is that condition variables can suffer from **spurious wakeups**—they might wake up without a `notify`. Therefore, we must recheck the condition after `wait` or use C++’s predicate overload for `wait`, which handles the loop for us.  

### Producer-Consumer Model  
It’s said that most synchronization problems can be solved using the **producer-consumer model**. A queue can store shared objects for inter-thread operations. Whenever a producer enqueues an object, it `notify`s a consumer. Similarly, after a consumer processes an object, it `notify`s a producer.  

### Semaphores  
Semaphores are a useful abstraction for the producer-consumer model, ideal for representing countable resources. For example, we can treat the number of ready resources in the queue as a semaphore: consumers `P` (acquire) the resource, blocking if the count is `0`, or proceed if it’s greater than `0`. After processing, they `V` (release) a free resource semaphore.  

## Computational Graph Model  

Many computational tasks in programs can be modeled as a **Directed Acyclic Graph (DAG)**, where nodes represent independent tasks and edges denote dependencies (ensuring no cyclic dependencies).  
By performing a topological sort and analyzing the graph’s layers, if a layer contains many parallel tasks (i.e., the graph is wide), the computation has high concurrency potential.  
In such cases, acceleration can be achieved using multithreading or distributed computing—provided hardware resources are sufficient and task granularity is appropriate.