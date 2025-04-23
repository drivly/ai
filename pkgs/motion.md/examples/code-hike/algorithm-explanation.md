---
title: Understanding Merge Sort
output: merge-sort-algorithm.mp4
fps: 30
resolution:
  width: 1920
  height: 1080
transition: fade
---

layout: intro
background: "#1e1e2e"
voiceover: Welcome to this explanation of the Merge Sort algorithm. We'll explore how this efficient sorting technique works through a step-by-step breakdown.

# Understanding Merge Sort
## A Divide and Conquer Algorithm

---

layout: default
background: "#1e1e2e"
voiceover: Merge Sort is a divide-and-conquer algorithm that breaks down the sorting problem into smaller, more manageable sub-problems.

# Merge Sort Overview

- **Divide**: Split the array into halves recursively
- **Conquer**: Sort each half independently
- **Combine**: Merge the sorted halves into a single sorted array
- **Time Complexity**: O(n log n) in all cases
- **Space Complexity**: O(n) for temporary array

---

layout: slideshow
code: |
  def merge_sort(arr):
      # Base case: arrays with 0 or 1 element are already sorted
      if len(arr) <= 1:
          return arr
      
      # Recursive case: split the array and sort each half
      # To be implemented
language: python
steps:
  - |
    def merge_sort(arr):
        # Base case: arrays with 0 or 1 element are already sorted
        if len(arr) <= 1:
            return arr
        
        # Recursive case: split the array and sort each half
        # To be implemented
  - |
    def merge_sort(arr):
        # Base case: arrays with 0 or 1 element are already sorted
        if len(arr) <= 1:
            return arr
        
        # Recursive case: split the array and sort each half
        mid = len(arr) // 2
        left = merge_sort(arr[:mid])
        right = merge_sort(arr[mid:])
        
        # Merge the sorted halves
        # To be implemented
  - |
    def merge_sort(arr):
        # Base case: arrays with 0 or 1 element are already sorted
        if len(arr) <= 1:
            return arr
        
        # Recursive case: split the array and sort each half
        mid = len(arr) // 2
        left = merge_sort(arr[:mid])
        right = merge_sort(arr[mid:])
        
        # Merge the sorted halves
        return merge(left, right)
        
    def merge(left, right):
        # To be implemented
voiceover: Let's build our Merge Sort algorithm step-by-step. We start with the base case and implement the recursive division process.
---

layout: slideshow
code: |
  def merge(left, right):
      # Function to merge two sorted arrays
      result = []
      
      # Compare elements from both arrays and add the smaller one to result
      # To be implemented
      
      return result
language: python
steps:
  - |
    def merge(left, right):
        # Function to merge two sorted arrays
        result = []
        
        # Compare elements from both arrays and add the smaller one to result
        # To be implemented
        
        return result
  - |
    def merge(left, right):
        # Function to merge two sorted arrays
        result = []
        i = j = 0
        
        # Compare elements from both arrays and add the smaller one to result
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        
        # Add remaining elements
        # To be implemented
        
        return result
  - |
    def merge(left, right):
        # Function to merge two sorted arrays
        result = []
        i = j = 0
        
        # Compare elements from both arrays and add the smaller one to result
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        
        # Add remaining elements
        result.extend(left[i:])
        result.extend(right[j:])
        
        return result
voiceover: Now we'll implement the merge function that combines two sorted arrays into a single sorted array.
---

layout: default
background: "#1e1e2e"
voiceover: Let's trace through the execution of the Merge Sort algorithm on a simple example to understand the process better.

# Example Execution

Sorting the array: `[38, 27, 43, 3, 9, 82, 10]`

1. **Divide**: Split into `[38, 27, 43, 3]` and `[9, 82, 10]`
2. **Continue dividing**: `[38, 27]`, `[43, 3]`, `[9, 82]`, `[10]`
3. **Further**: `[38]`, `[27]`, `[43]`, `[3]`, `[9]`, `[82]`, `[10]`
4. **Merge back**: `[27, 38]`, `[3, 43]`, `[9, 82]`, `[10]`
5. **Continue merging**: `[3, 27, 38, 43]`, `[9, 10, 82]`
6. **Final merge**: `[3, 9, 10, 27, 38, 43, 82]`

---

layout: slideshow
code: |
  # Complete Merge Sort implementation
  def merge_sort(arr):
      if len(arr) <= 1:
          return arr
      
      mid = len(arr) // 2
      left = merge_sort(arr[:mid])
      right = merge_sort(arr[mid:])
      
      return merge(left, right)
      
  def merge(left, right):
      result = []
      i = j = 0
      
      while i < len(left) and j < len(right):
          if left[i] <= right[j]:
              result.append(left[i])
              i += 1
          else:
              result.append(right[j])
              j += 1
      
      result.extend(left[i:])
      result.extend(right[j:])
      
      return result
language: python
steps:
  - |
    # Complete Merge Sort implementation
    def merge_sort(arr):
        if len(arr) <= 1:
            return arr
        
        mid = len(arr) // 2
        left = merge_sort(arr[:mid])
        right = merge_sort(arr[mid:])
        
        return merge(left, right)
        
    def merge(left, right):
        result = []
        i = j = 0
        
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        
        result.extend(left[i:])
        result.extend(right[j:])
        
        return result
  - |
    # Complete Merge Sort implementation
    def merge_sort(arr):
        if len(arr) <= 1:
            return arr
        
        mid = len(arr) // 2
        left = merge_sort(arr[:mid])
        right = merge_sort(arr[mid:])
        
        return merge(left, right)
        
    def merge(left, right):
        result = []
        i = j = 0
        
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        
        result.extend(left[i:])
        result.extend(right[j:])
        
        return result
        
    # Example usage
    arr = [38, 27, 43, 3, 9, 82, 10]
    sorted_arr = merge_sort(arr)
    print("Original array:", arr)
    print("Sorted array:", sorted_arr)
  - |
    # Optimized Merge Sort implementation with in-place merging
    def merge_sort(arr):
        if len(arr) <= 1:
            return arr
        
        # Create a temporary array for merging
        temp = [0] * len(arr)
        
        # Call the helper function with indices
        return _merge_sort(arr, temp, 0, len(arr) - 1)
        
    def _merge_sort(arr, temp, left, right):
        if left >= right:
            return arr
        
        # Find middle point
        mid = (left + right) // 2
        
        # Sort first and second halves
        _merge_sort(arr, temp, left, mid)
        _merge_sort(arr, temp, mid + 1, right)
        
        # Merge the sorted halves
        _merge(arr, temp, left, mid, right)
        
        return arr
        
    def _merge(arr, temp, left, mid, right):
        # Copy data to temp arrays
        for i in range(left, right + 1):
            temp[i] = arr[i]
        
        # Merge the temp arrays back
        i, j, k = left, mid + 1, left
        
        while i <= mid and j <= right:
            if temp[i] <= temp[j]:
                arr[k] = temp[i]
                i += 1
            else:
                arr[k] = temp[j]
                j += 1
            k += 1
        
        # Copy the remaining elements
        while i <= mid:
            arr[k] = temp[i]
            i += 1
            k += 1
voiceover: Here's our complete Merge Sort implementation. We can optimize it further by using in-place merging to reduce memory allocation during sorting.
---

layout: cover
background: "#181825"
voiceover: Merge Sort is a powerful and efficient sorting algorithm with guaranteed O(n log n) performance in all cases, making it suitable for large datasets.

# Key Takeaways

- **Divide and conquer** approach breaks down problem into manageable parts
- **Stable sort** that preserves the relative order of equal elements
- **Predictable performance** with O(n log n) time complexity
- **External sorting** applications for data that doesn't fit in memory
- **Trade-off**: Requires O(n) additional space for merging

## Thanks for exploring Merge Sort with us!
