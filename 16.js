// Given an array S of n integers, find three integers in S such that the sum is
// closest to a given number, target. Return the sum of the three integers. You
// may assume that each input would have exactly one solution.

// For example, given array S = {-1 2 1 -4}, and target = 1.

// The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
const threeSumClosest = function(nums, target) {
  const n = nums.length
  if (n < 3) throw Error('the length below 3!')

  nums.sort((a, b) => a - b)

  let result = nums[0] + nums[1] + nums[2]
  for (let i = 0; i < n - 2; i++) {
    let lo = i + 1, hi = n - 1
    while (lo < hi) {
      const sum = nums[lo] + nums[hi] + nums[i]
      if (sum === target) return target
      if (sum < target) lo++
      else hi--
      if (Math.abs(target - sum) < Math.abs(target - result)) result = sum
    }
  }
  return result
}

console.log(threeSumClosest([-1, 2, 1, -4], 1))
console.log(threeSumClosest([1,2,5,10,11], 12));
