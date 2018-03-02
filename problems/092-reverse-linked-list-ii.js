// 92. Reverse Linked List II
// Medium 30% locked:false

// Reverse a linked list from position m to n. Do it in-place and in one-pass.

// For example:
// Given 1->2->3->4->5->NULL, m = 2 and n = 4,

// return 1->4->3->2->5->NULL.

// Note:
// Given m, n satisfy the following condition:
// 1 <= m <= n <= length of list.

/**
 * Definition for singly-linked list.
 */
function ListNode(val) {
  this.val = val
  this.next = null
}

const toList = function(array) {
  const head = new ListNode()
  let node = head
  for (let a of array) {
    node.next = new ListNode(a)
    node = node.next
  }
  return head.next
}

ListNode.prototype.toString = function() {
  let s = '', node = this
  while (node) {
    s += (s === '' ? s : '->') + node.val
    node = node.next
  }
  return s
}

/**
 * @param {ListNode} head
 * @param {number} m
 * @param {number} n
 * @return {ListNode}
 */
const reverseBetween = function(head, m, n) {
  if (head == null || m >= n) return head

  const start = new ListNode()
  start.next = head

  let a = start, count = n - m
  while (--m > 0) a = a.next

  let b = a.next
  while (--count >= 0) {
    const t = b.next
    b.next = t.next
    t.next = a.next
    a.next = t
  }

  return start.next
}

;[
  [[1, 2, 3, 4, 5], 2, 4],      // 1->4->3->2->5
].forEach(args => {
  const list = toList(args[0])
  console.log((list || '').toString())
  console.log((reverseBetween(list, args[1], args[2]) || '').toString())
})

// Solution:
// 使用头插法将中间的节点倒置。
// 主要指针的细节。

// Submission Result: Accepted
