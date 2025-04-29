---
title: Further Understanding Virtual Memory
date: 2025-04-29
tags: ['operating-system']
authors: ['Maya']
ai: True
draft: false
---
Recently, I found that my understanding of operating systems and memory is somewhat lacking during my learning process, so I decided to study some knowledge about operating systems again, starting with virtual memory:

## What is Virtual Memory?
One of the main functions of an operating system is to **abstract** hardware, providing an interface for software to operate hardware, and virtual memory is the operating system's abstraction of memory, managed by the **operating system**.

If applications directly manipulate physical memory, like in a microcontroller, then almost no multiple programs can run on a single hardware. The programmer of program A does not know which memory program B will use, so A and B will affect each other's memory, which is unacceptable. Therefore, the operating system abstracts virtual memory, making it seem to applications as if they exclusively own all memory.

Since virtual memory is abstracted, its size is not limited by the size of physical memory. For example, on a 32-bit system, there can be $2^{32}$, which is 4G of virtual memory, but the actual memory can be 1G or even just a few hundred K.

## The Role of Virtual Memory

As mentioned earlier, virtual memory can change the perception of memory for processes, allowing multiple processes to operate on memory simultaneously without affecting each other. The operating system can also rearrange, compress, or even swap out the actual memory used by processes to disk, and these operations **will not be perceived** by the applications.

## How Virtual Memory is Implemented

The operating system divides the huge byte array of memory through paging, where the size of a page is generally 4K. The address of each memory byte can be calculated using a page number + an offset within the page. Similarly, physical memory can also be divided into pages of the same size.

Thus, each virtual memory page can have three states:
1. Mapped and stored in physical memory
2. Mapped but not stored in physical memory
3. Not mapped

Here, "mapped" refers to mapping virtual memory to the process's address space. An application must map virtual memory to its own **address space** to operate on it; otherwise, it will trigger a **segmentation fault**. A segmentation fault occurs when an application accesses a virtual memory segment that does not belong to it or accesses a virtual memory segment with an incorrect privilege level.

For applications, the memory usage process is roughly as follows:

1. Request the operating system to map a specified size or location of virtual memory. If successful, the state of this virtual memory is the above state 2.
2. Use the memory. If the operating system discovers that the process is using memory in state 2 but finds that this virtual memory page is not cached in physical memory, it will trigger a page fault interrupt. The corresponding terminal handler of the operating system will then place this virtual memory page into physical memory, converting it to state 1. This process may also involve swapping out virtual memory pages.
3. Release memory. The process requests the operating system to unmap the virtual memory, setting these virtual memories to state 3, allowing the actual data in physical memory to be released.

However, it still hasn't been explained why virtual memory allows multiple processes to run simultaneously. If A and B are both operating on memory 0x114514, why doesn't an error occur?

This is because the operating system maintains a page table for each process. Let's assume that both processes A and B correctly request memory, and the memory corresponding to 0x114514 has virtual memory pages in state 1. One of the table entries records which physical page frame each virtual memory page of the process maps to. For example, A's 0x114514 may correspond to physical memory at 0x1919, while B's 0x114514 may correspond to physical memory at 0x810. 
Of course, the above is just an example to illustrate that the same virtual address in different processes maps to different physical addresses; the actual specific values may not correspond precisely to reality.

## Optimization of Virtual Memory

A brief introduction:
### Multi-level Page Table
In a 32-bit system, the address space is $2^{32}$, which is 4G. If we use 4K pages, each process would need to maintain $2^{32}/2^{12}=1M$ page table entries. If each page table entry occupies 4B, it would require 4M for each process. If it were a 64-bit address space, it would be even more daunting.

Therefore, we introduce multi-level page tables to reduce the number of page table entries that need to be recorded through a hierarchical structure.

## TLB
If every memory access operation requires checking the page table, it would be too slow. Therefore, we also introduced a **Translation Lookaside Buffer** (TLB) to directly cache the most commonly used virtual page mappings, significantly reducing the time overhead of memory access when there is a cache hit.