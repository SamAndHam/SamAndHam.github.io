---
layout: post
title:  "Memory in Linux"
date:   2019-09-12 11:37:52 +0800
categories: Linux
---

This will be first in the series of articles to come that will be written in attempt to better understand memory in Linux.

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
