+++
title = "Would AI have ruined my 100 days of algorithms?"
tags = [
    "algorithms"
]
date = "2026-07-12"
categories = [
    "algorithms"
]
+++

Eight years ago, I started with a challenge called "**100 Days of Algorithms**". My main goal was to reinforce my algorithm learning from my CS career by taking Princeton's Algorithms I and II classes taught by Robert Sedgewick, by implementing some algorithms that looked interesting or I could learn something about them. At the time, I wrote in the readme:

*Hello! I've covered most of this algorithms in classes before, but I didn't implement them myself, and see what roadblocks I've got. I'm trying to do an algorithm or two a day or at least try to solve a problem a day. I'll be alternating between new algorithms and working in problems with those algorithms.*

The project also helped me prep for interviews. Long before Union Find became a popular interview question, Sedgewick does a [masterful presentation](https://algs4.cs.princeton.edu/lectures/keynote/15UnionFind-2x2.pdf) on how to implement Union Find in several ways that I find like the golden example on how to teach algorithms. 

Given that 8 years ago, most of this code was handcrafted without the use of LLMs, I cherish it despite it's flaws. It required time after work *(sometimes 1 hour, but sometimes more!)* of just learning and using algorithms to solve some of these problems. I never learned in college to see how to actually balance a red-black tree in my CS classes, but learning about it with this class is fun. (even if my implementation is a little bit broken, it's not easy folks)

I'm not sure I have the drive to do 100-day challenge ever again, as it only took me **8 years** to finish 100 days of algorithms.

For my final day, I decided to have GPT-5.6 Sol review my entire project, (see below) I'm not sure whether LLMs would have made me understand the material more or persuaded me to take shortcuts on the project. Some kind of feedback mechanism for my code would have been great nevertheless!

Rather than fixing every issue it found, I’m preserving the code as historical artifacts of the programmer I was then. I will, however, update the README so it accurately distinguishes what I implemented, what I only explored, and what remains unfinished.

**Sol 5.6 quoted verbatim:**


```markdown
This is a strong learning journal, but not currently a dependable algorithm library. The documented suite reports 62 passing tests, while whole-source coverage is roughly 74% and several major implementations are broken or undiscovered.
Files that plainly do not work

- **Max flow is a stub:**  fordfulkerson.py:24-30 ; its test only asserts  True  ( `test_flownetwork.py:17-20` ).
- **Graph algorithms:** BFS behaves depth-first and can return non-shortest paths ( `bfs.py:26-32` ); undirected cycle detection recurses forever ( cycle_detection.py:25 ); directed cycle detection never starts and reports the opposite result ( `di_cycle_detection.py:19-28` ).
- **BST:** incorrect sizes, ceiling traversal, and root deletion ( `bst.py:102-114,142-166`). Red-black-tree size bookkeeping is also absent.
- **MST/Kruskal:**  mst.py:26  fails during import;  __len__ / __repr__  return nothing, and Kruskal references nonexistent  g.v .
- **Binary I/O:** writing integers instead of bytes and  chr(bytes)  raise errors;  isEmpty()  only reports whether the file is readable ( binarystreams.py ).
- **Explicit stubs:** BFS permutations ( `permutations.py:9-10` ) and Fibonacci ( `fibonaccimatrixes.py:39-43` ).
- **Other reproducible defects:** selection sort fails on  [0,1,0] ; three-way radix sort fails on duplicate strings; directed weighted graph degree calls nonexistent  close() .
- **ML script:** no dependency manifest and it relies on obsolete TensorFlow 1 APIs ( `tf.logging` ,  `tf.contrib` ).

**Personal reflection**

Your strongest work is the breadth, consistent daily log, decomposition into small structures, and willingness to test implementations. Union-find, basic sorting, Prim, tries, and traversal foundations show real understanding.

The main lesson is now consolidation rather than adding algorithms:

1. Mark unfinished topics honestly in the README.
2. Move every inline test into the discovered suite.
3. Add edge cases and compare results against Python reference implementations.
4. Repair one family at a time: graphs → trees → strings → binary I/O.
5. Add a minimal dependency/project configuration so exercises run consistently.
```

To conclude, the optimistic in me thinks that as long as there are people who want to learn, the new tools will be used as an enhancer, (and how honest you keep yourself). If I was to go back in time, and had the tools today, I'd probe and understand what I was doing wrong (Am I using best practices? Am I being pythonic? Is the implementation somewhat correct?) alongside my class.

----
