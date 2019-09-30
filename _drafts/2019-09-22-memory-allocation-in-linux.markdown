---
layout: post
title:  "Memory allocation in Linux"
date:   2019-09-12 21:37:52 +0800
categories: Linux
---

This post tries to explore how malloc works internally in Linux

## malloc

Malloc is a  [ library call ](https://www.humblec.com/who-told-malloc-is-a-system-call/) which implements functions internally to allocate memory through system calls; itself
not a system call. 
Its [definition](https://pubs.opengroup.org/onlinepubs/009695399/functions/malloc.html) leaves 


### heap
It calls to sbrk() when value for the size of memory to allocate is within the MMAP_THRESHOLD.
//check process liits
(user prlmit api ) //refer to api interface hands-on linux hard and soft 
cat /proc/$$/status



dynamic memory allocaition/ beyndthebasics/Limits and privilldges 

### memory residency

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

The size of the virtual memory allocated to the process bash at the time of issuing the command was 16152 kb
but only 4132 kB of the total VmSize was resident in 



Memory are then mappedd in pages to the virtual memory of each process.


to check if memory resisdent or not . mincore()



Each process has its own heap

Gettiing statistics 
http://man7.org/linux/man-pages/man3/malloc_stats.3.html
malloc_stats
getpid()
https://github.com/TysonRayJones/CTools/blob/master/memory/memorymeasure.c
$$/ getpid()
sprintf(cmd , /proc/%d/status, getpid());

https://github.com/TysonRayJones/CTools/blob/master/memory/memorymeasure.c


### brk()/sbrk()

### mmap()

## locking memory
int mlock(const void *addr, size_t len);
int mlockall(int flags);


* Background reading
	- Heap and Stack
	- limits of a process ( prlimit, getrlimit, setrlimit)
		- mmap and its threshold
	- Memory residency 
		- Resident Set Size (RSS)
		- VmSize
* Reserving memory in Linux
	- /dev/mem
	- Device tree nodes
	- Kernel driver
* Comparing the performance between dynamic allocation vs reserved memory
	- With small amount of memory via malloc
	- With big amount of memory via  malloc
	- Multithreaded situations
