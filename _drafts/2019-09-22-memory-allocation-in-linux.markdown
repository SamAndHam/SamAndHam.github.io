---
layout: post
title:  "Memory allocation in Linux"
date:   2019-09-12 21:37:52 +0800
categories: Linux
---

This post tries to explore how malloc works internally in Linux


* [Malloc](#Malloc)
  - [Heap](#Heap)
  - [Threshold](#Threshold)
    - brk()/mmap()
  - [Resident or not](#Resident or not)
    - Ensuring residency 

## Malloc

Malloc is a  [ library call ](https://www.humblec.com/who-told-malloc-is-a-system-call/) which implements functions internally to allocate memory through system calls; itself
not a system call. 
Its [definition](https://pubs.opengroup.org/onlinepubs/009695399/functions/malloc.html) leaves its implementation 




### Heap


> cat /proc/${process_id}/status

>Name:   bash\
>Umask:  0022\
> ...\
>VmPeak:    16204 kB\
>VmSize:    16152 kB\
>VmLck:         0 kB\
>VmPin:         0 kB\
>VmHWM:      4132 kB\
>VmRSS:      4132 kB\
> ...

It calls to sbrk() when value for the size of memory to allocate is within the MMAP_THRESHOLD.

malloc_stats
//check process liits
(user prlmit api ) //refer to api interface hands-on linux hard and soft 
cat /proc/$$/status


Each process has its own heap

getpid()
https://github.com/TysonRayJones/CTools/blob/master/memory/memorymeasure.c
$$/ getpid()
sprintf(cmd , /proc/%d/status, getpid());



dynamic memory allocaition/ beyndthebasics/Limits and privilldges 

The size of the virtual memory allocated to the process bash at the time of issuing the command was 16152 kb
but only 4132 kB of the total VmSize was resident in memory



Memory are then mappedd in pages to the virtual memory of each process.

### Threshold


It calls to sbrk() when value for the size of memory to allocate is within the MMAP_THRESHOLD.

Gettiing statistics 
http://man7.org/linux/man-pages/man3/malloc_stats.3.html
malloc_stats


#### brk()/mmap()

brk() expands in arena ( within heap)
mmap() anywhere whitn virtual address space


### Resident or not

to check if memory resisdent or not . mincore()

#### Ensuring residency 
int mlock(const void *addr, size_t len);
int mlockall(int flags);


