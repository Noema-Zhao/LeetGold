import { STATEMENTS } from "./problem-statements";
import { GUIDE_SOLUTIONS } from "./guide-solutions";

export type TopicKey = "hash" | "linked" | "search" | "dp" | "tree" | "graph" | "stack" | "string" | "array";

export type Problem = {
  rank: number;
  id: string;
  title: string;
  difficulty: number;
  frequency: number;
  slug: string;
  topic: TopicKey;
  code: string;
  statement: string;
};

export type Unit = {
  key: TopicKey;
  title: string;
  short: string;
  icon: string;
  color: string;
  shadow: string;
  description: string;
  rule: string;
};

export const UNITS: Unit[] = [
  { key:"hash", title:"哈希与滑动窗口", short:"记忆与区间", icon:"#", color:"#39b96c", shadow:"#16884a", description:"用哈希表把查找降到 O(1)，再让左右指针维护一段始终满足条件的连续区间。", rule:"看到『子串、连续区间、出现次数、两数配对』，优先尝试哈希或滑动窗口。" },
  { key:"linked", title:"链表基础与反转", short:"指针体操", icon:"↝", color:"#6d5ce7", shadow:"#4938b9", description:"链表题的核心不是记答案，而是在修改 next 前保存后继，并善用 dummy 节点统一边界。", rule:"涉及头节点变化先建 dummy；找倒数位置用快慢指针；排序优先归并。" },
  { key:"search", title:"排序、选择与二分", short:"缩小答案空间", icon:"⌕", color:"#e99a2d", shadow:"#b8690f", description:"排序创造单调性，二分每次排除一半区间，快速选择只处理目标所在的一侧。", rule:"能判断一半答案必错时就可以二分；只求第 k 大不必完整排序。" },
  { key:"dp", title:"动态规划", short:"状态与转移", icon:"ƒ", color:"#e75d78", shadow:"#b52f4b", description:"把大问题拆成重复的小状态：先定义 dp 的含义，再写选择、转移与初值。", rule:"写代码前先完整说出：dp[i] 表示什么、从哪里转移、答案在哪里。" },
  { key:"tree", title:"二叉树与递归", short:"层序与返回值", icon:"♧", color:"#347ecb", shadow:"#17558f", description:"BFS 按层扩展，DFS 用返回值向父节点传递信息；递归出口决定算法是否可靠。", rule:"每次递归都问：函数接收什么、返回什么、空节点返回什么。" },
  { key:"graph", title:"回溯与图搜索", short:"选择与撤销", icon:"✣", color:"#16a6a1", shadow:"#08736f", description:"回溯枚举决策树，图搜索访问连通区域；剪枝能让搜索更快。", rule:"固定骨架：做选择 → 递归 → 撤销；网格题记得标记已访问。" },
  { key:"stack", title:"栈、队列与设计", short:"受限访问", icon:"▤", color:"#9a62cb", shadow:"#663a91", description:"栈处理最近未完成的任务，单调队列维护窗口极值，双向链表支撑 LRU。", rule:"看到括号、嵌套、下一个更大值想到栈；窗口极值想到单调队列。" },
  { key:"string", title:"字符串模拟", short:"逐位处理", icon:"Aa", color:"#dd6b3f", shadow:"#a83c1e", description:"按照题意逐字符、逐位模拟，明确指针、进位和非法状态。", rule:"不依赖大整数或黑盒转换；每一步都维护清晰的不变量。" },
  { key:"array", title:"数组与矩阵技巧", short:"边界与坐标", icon:"▦", color:"#517668", shadow:"#304b41", description:"在原地数组和二维矩阵中维护边界、方向和局部不变量。", rule:"先画出下标和边界，再决定双指针、转置翻转或随机采样。" },
];

const RAW = `
3|无重复字符的最长子串|2|1197|longest-substring-without-repeating-characters
146|LRU缓存机制|2|959|lru-cache
206|反转链表|1|754|reverse-linked-list
215|数组中的第K个最大元素|2|604|kth-largest-element-in-an-array
25|K 个一组翻转链表|3|532|reverse-nodes-in-k-group
15|三数之和|2|492|3sum
53|最大子数组和|2|376|maximum-subarray
5|最长回文子串|2|360|longest-palindromic-substring
补充题4|手撕快速排序|2|359|sort-an-array
21|合并两个有序链表|1|333|merge-two-sorted-lists
200|岛屿数量|2|332|number-of-islands
102|二叉树的层序遍历|2|332|binary-tree-level-order-traversal
33|搜索旋转排序数组|2|318|search-in-rotated-sorted-array
1|两数之和|1|306|two-sum
46|全排列|2|300|permutations
88|合并两个有序数组|1|299|merge-sorted-array
20|有效的括号|1|298|valid-parentheses
121|买卖股票的最佳时机|1|280|best-time-to-buy-and-sell-stock
300|最长上升子序列|2|274|longest-increasing-subsequence
92|反转链表 II|2|271|reverse-linked-list-ii
103|二叉树的锯齿形层次遍历|2|270|binary-tree-zigzag-level-order-traversal
236|二叉树的最近公共祖先|2|268|lowest-common-ancestor-of-a-binary-tree
23|合并K个排序链表|3|260|merge-k-sorted-lists
54|螺旋矩阵|2|258|spiral-matrix
141|环形链表|1|256|linked-list-cycle
143|重排链表|2|254|reorder-list
56|合并区间|2|247|merge-intervals
415|字符串相加|1|245|add-strings
72|编辑距离|3|206|edit-distance
160|相交链表|1|202|intersection-of-two-linked-lists
42|接雨水|3|200|trapping-rain-water
1143|最长公共子序列|2|199|longest-common-subsequence
82|删除排序链表中的重复元素 II|2|187|remove-duplicates-from-sorted-list-ii
93|复原IP地址|2|186|restore-ip-addresses
19|删除链表的倒数第N个节点|2|185|remove-nth-node-from-end-of-list
124|二叉树中的最大路径和|3|185|binary-tree-maximum-path-sum
4|寻找两个正序数组的中位数|3|174|median-of-two-sorted-arrays
142|环形链表 II|2|170|linked-list-cycle-ii
165|比较版本号|2|167|compare-version-numbers
199|二叉树的右视图|2|161|binary-tree-right-side-view
704|二分查找|1|153|binary-search
239|滑动窗口最大值|3|153|sliding-window-maximum
22|括号生成|2|152|generate-parentheses
32|最长有效括号|3|150|longest-valid-parentheses
148|排序链表|2|148|sort-list
69|x 的平方根|1|148|sqrtx
94|二叉树的中序遍历|1|144|binary-tree-inorder-traversal
232|用栈实现队列|1|143|implement-queue-using-stacks
31|下一个排列|2|137|next-permutation
76|最小覆盖子串|3|136|minimum-window-substring
8|字符串转换整数 (atoi)|2|134|string-to-integer-atoi
70|爬楼梯|1|133|climbing-stairs
2|两数相加|2|133|add-two-numbers
43|字符串相乘|2|132|multiply-strings
322|零钱兑换|2|132|coin-change
105|从前序与中序遍历序列构造二叉树|2|117|construct-binary-tree-from-preorder-and-inorder-traversal
41|缺失的第一个正数|3|114|first-missing-positive
78|子集|2|108|subsets
151|翻转字符串里的单词|2|106|reverse-words-in-a-string
剑指 Offer 22|链表中倒数第k个节点|1|103|lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof
34|在排序数组中查找元素的第一个和最后一个位置|2|103|find-first-and-last-position-of-element-in-sorted-array
394|字符串解码|2|101|decode-string
129|求根到叶子节点数字之和|2|100|sum-root-to-leaf-numbers
155|最小栈|1|99|min-stack
101|对称二叉树|1|97|symmetric-tree
64|最小路径和|2|96|minimum-path-sum
470|用 Rand7() 实现 Rand10()|2|96|implement-rand10-using-rand7
39|组合总和|2|96|combination-sum
695|岛屿的最大面积|2|94|max-area-of-island
128|最长连续序列|2|93|longest-consecutive-sequence
122|买卖股票的最佳时机 II|1|91|best-time-to-buy-and-sell-stock-ii
104|二叉树的最大深度|1|91|maximum-depth-of-binary-tree
110|平衡二叉树|1|88|balanced-binary-tree
221|最大正方形|2|88|maximal-square
234|回文链表|1|87|palindrome-linked-list
48|旋转图像|2|85|rotate-image
240|搜索二维矩阵 II|2|85|search-a-2d-matrix-ii
152|乘积最大子数组|2|85|maximum-product-subarray
179|最大数|2|84|largest-number
662|二叉树最大宽度|2|84|maximum-width-of-binary-tree
14|最长公共前缀|1|84|longest-common-prefix
98|验证二叉搜索树|2|84|validate-binary-search-tree
144|二叉树的前序遍历|1|84|binary-tree-preorder-traversal
543|二叉树的直径|1|82|diameter-of-binary-tree
560|和为K的子数组|2|80|subarray-sum-equals-k
162|寻找峰值|2|80|find-peak-element
113|路径总和 II|2|78|path-sum-ii
62|不同路径|2|78|unique-paths
198|打家劫舍|2|75|house-robber
209|长度最小的子数组|2|74|minimum-size-subarray-sum
24|两两交换链表中的节点|2|73|swap-nodes-in-pairs
112|路径总和|1|72|path-sum
139|单词拆分|2|71|word-break
718|最长重复子数组|2|70|maximum-length-of-repeated-subarray
83|删除排序链表中的重复元素|1|69|remove-duplicates-from-sorted-list
227|基本计算器 II|2|69|basic-calculator-ii
283|移动零|1|68|move-zeroes
226|翻转二叉树|1|68|invert-binary-tree
169|多数元素|1|68|majority-element
207|课程表|2|67|course-schedule`;

const TOPIC_IDS: Record<TopicKey, string[]> = {
  hash:["3","15","1","76","128","560","209"],
  linked:["206","25","21","92","23","141","143","160","82","19","142","148","2","剑指 Offer 22","234","24","83"],
  search:["215","补充题4","33","88","56","4","704","69","31","41","34","240","179","162","169","283"],
  dp:["53","5","121","300","72","1143","70","322","64","122","221","152","62","198","139","718"],
  tree:["102","103","236","124","199","94","105","129","101","104","110","662","98","144","543","113","112","226"],
  graph:["200","46","93","22","78","39","695","207"],
  stack:["146","20","239","32","232","394","155","227"],
  string:["415","165","8","43","151","14"],
  array:["54","42","48","470"],
};

const topicOf = (id: string) => (Object.keys(TOPIC_IDS) as TopicKey[]).find(key => TOPIC_IDS[key].includes(id)) ?? "array";

const S: Record<string, string> = {
  "3":`class Solution:\n    def lengthOfLongestSubstring(self, s):\n        last, left, ans = {}, 0, 0\n        for right, ch in enumerate(s):\n            if ch in last and last[ch] >= left:\n                left = last[ch] + 1\n            last[ch] = right\n            ans = max(ans, right - left + 1)\n        return ans`,
  "1":`class Solution:\n    def twoSum(self, nums, target):\n        seen = {}\n        for i, x in enumerate(nums):\n            need = target - x\n            if need in seen:\n                return [seen[need], i]\n            seen[x] = i`,
  "15":`class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        nums.sort()\n        ans, n = [], len(nums)\n        for i in range(n - 2):\n            if i and nums[i] == nums[i - 1]:\n                continue\n            if nums[i] > 0:\n                break\n            l, r = i + 1, n - 1\n            while l < r:\n                total = nums[i] + nums[l] + nums[r]\n                if total < 0:\n                    l += 1\n                elif total > 0:\n                    r -= 1\n                else:\n                    ans.append([nums[i], nums[l], nums[r]])\n                    l += 1\n                    r -= 1\n                    while l < r and nums[l] == nums[l - 1]: l += 1\n                    while l < r and nums[r] == nums[r + 1]: r -= 1\n        return ans`,
  "76":`need, window = Counter(t), Counter()\nleft = formed = 0\nfor right, ch in enumerate(s):\n    window[ch] += 1\n    if window[ch] == need[ch]: formed += 1\n    while formed == len(need):\n        update_best(left, right)\n        window[s[left]] -= 1\n        if window[s[left]] < need[s[left]]: formed -= 1\n        left += 1`,
  "128":`values = set(nums)\nbest = 0\nfor x in values:\n    if x - 1 not in values:\n        y = x\n        while y in values: y += 1\n        best = max(best, y - x)\nreturn best`,
  "560":`count = {0: 1}\nprefix = ans = 0\nfor x in nums:\n    prefix += x\n    ans += count.get(prefix - k, 0)\n    count[prefix] = count.get(prefix, 0) + 1\nreturn ans`,
  "209":`left = total = 0\nanswer = inf\nfor right, x in enumerate(nums):\n    total += x\n    while total >= target:\n        answer = min(answer, right - left + 1)\n        total -= nums[left]\n        left += 1\nreturn 0 if answer == inf else answer`,
  "206":`prev, cur = None, head\nwhile cur:\n    nxt = cur.next\n    cur.next = prev\n    prev, cur = cur, nxt\nreturn prev`,
  "21":`dummy = tail = ListNode(0)\nwhile a and b:\n    if a.val <= b.val: tail.next, a = a, a.next\n    else: tail.next, b = b, b.next\n    tail = tail.next\ntail.next = a or b\nreturn dummy.next`,
  "92":`dummy = ListNode(0, head)\npre = move_to(dummy, left - 1)\ncur = pre.next\nfor _ in range(right - left):\n    moving = cur.next\n    cur.next = moving.next\n    moving.next = pre.next\n    pre.next = moving\nreturn dummy.next`,
  "19":`dummy = ListNode(0, head)\nfast = slow = dummy\nfor _ in range(n): fast = fast.next\nwhile fast.next:\n    fast, slow = fast.next, slow.next\nslow.next = slow.next.next\nreturn dummy.next`,
  "141":`slow = fast = head\nwhile fast and fast.next:\n    slow = slow.next\n    fast = fast.next.next\n    if slow is fast: return True\nreturn False`,
  "142":`slow = fast = head\nwhile fast and fast.next:\n    slow, fast = slow.next, fast.next.next\n    if slow is fast:\n        finder = head\n        while finder is not slow:\n            finder, slow = finder.next, slow.next\n        return finder\nreturn None`,
  "160":`p, q = headA, headB\nwhile p is not q:\n    p = p.next if p else headB\n    q = q.next if q else headA\nreturn p`,
  "82":`dummy = ListNode(0, head)\ncur = dummy\nwhile cur.next and cur.next.next:\n    if cur.next.val == cur.next.next.val:\n        value = cur.next.val\n        while cur.next and cur.next.val == value:\n            cur.next = cur.next.next\n    else: cur = cur.next\nreturn dummy.next`,
  "143":`middle = find_middle(head)\nsecond = reverse(middle.next)\nmiddle.next = None\nfirst = head\nwhile second:\n    next1, next2 = first.next, second.next\n    first.next, second.next = second, next1\n    first, second = next1, next2`,
  "25":`dummy = ListNode(0, head)\ngroup_prev = dummy\nwhile kth_exists(group_prev, k):\n    kth = get_kth(group_prev, k)\n    group_next = kth.next\n    reverse_range(group_prev.next, group_next)\n    reconnect_group(group_prev, kth, group_next)\n    group_prev = old_group_head\nreturn dummy.next`,
  "23":`heap = []\nfor index, node in enumerate(lists):\n    if node: heappush(heap, (node.val, index, node))\ndummy = tail = ListNode(0)\nwhile heap:\n    _, index, node = heappop(heap)\n    tail.next = node; tail = node\n    if node.next: heappush(heap, (node.next.val, index, node.next))\nreturn dummy.next`,
  "148":`if not head or not head.next: return head\nmid = split_in_half(head)\nleft = sortList(head)\nright = sortList(mid)\nreturn merge(left, right)`,
  "2":`dummy = tail = ListNode(0)\ncarry = 0\nwhile l1 or l2 or carry:\n    total = value(l1) + value(l2) + carry\n    carry, digit = divmod(total, 10)\n    tail.next = ListNode(digit)\n    tail = tail.next\n    l1, l2 = advance(l1), advance(l2)\nreturn dummy.next`,
  "剑指 Offer 22":`fast = slow = head\nfor _ in range(k): fast = fast.next\nwhile fast:\n    fast = fast.next\n    slow = slow.next\nreturn slow`,
  "234":`slow = fast = head\nwhile fast and fast.next:\n    slow, fast = slow.next, fast.next.next\nsecond = reverse(slow)\nfirst = head\nwhile second:\n    if first.val != second.val: return False\n    first, second = first.next, second.next\nreturn True`,
  "24":`dummy = ListNode(0, head)\npre = dummy\nwhile pre.next and pre.next.next:\n    first, second = pre.next, pre.next.next\n    first.next = second.next\n    second.next = first\n    pre.next = second\n    pre = first\nreturn dummy.next`,
  "83":`cur = head\nwhile cur and cur.next:\n    if cur.val == cur.next.val: cur.next = cur.next.next\n    else: cur = cur.next\nreturn head`,
  "215":`target = len(nums) - k\nleft, right = 0, len(nums) - 1\nwhile left <= right:\n    pivot = partition(nums, left, right)\n    if pivot == target: return nums[pivot]\n    if pivot < target: left = pivot + 1\n    else: right = pivot - 1`,
  "补充题4":`def quick_sort(nums, left, right):\n    if left >= right: return\n    pivot = nums[(left + right) // 2]\n    i, j = left, right\n    while i <= j:\n        while nums[i] < pivot: i += 1\n        while nums[j] > pivot: j -= 1\n        if i <= j:\n            nums[i], nums[j] = nums[j], nums[i]\n            i, j = i + 1, j - 1\n    quick_sort(nums, left, j)\n    quick_sort(nums, i, right)`,
  "33":`left, right = 0, len(nums) - 1\nwhile left <= right:\n    mid = (left + right) // 2\n    if nums[mid] == target: return mid\n    if nums[left] <= nums[mid]:\n        if nums[left] <= target < nums[mid]: right = mid - 1\n        else: left = mid + 1\n    else:\n        if nums[mid] < target <= nums[right]: left = mid + 1\n        else: right = mid - 1\nreturn -1`,
  "704":`left, right = 0, len(nums) - 1\nwhile left <= right:\n    mid = (left + right) // 2\n    if nums[mid] == target: return mid\n    if nums[mid] < target: left = mid + 1\n    else: right = mid - 1\nreturn -1`,
  "69":`left, right, answer = 0, x, 0\nwhile left <= right:\n    mid = (left + right) // 2\n    if mid * mid <= x:\n        answer, left = mid, mid + 1\n    else: right = mid - 1\nreturn answer`,
  "4":`while True:\n    if i == len(a): return b[j + k - 1]\n    if j == len(b): return a[i + k - 1]\n    if k == 1: return min(a[i], b[j])\n    half = k // 2\n    ai = a[i + half - 1] if in_range_a else inf\n    bj = b[j + half - 1] if in_range_b else inf\n    if ai < bj: i, k = i + half, k - half\n    else: j, k = j + half, k - half`,
  "88":`i, j = m - 1, n - 1\nwrite = m + n - 1\nwhile j >= 0:\n    if i >= 0 and nums1[i] > nums2[j]:\n        nums1[write], i = nums1[i], i - 1\n    else:\n        nums1[write], j = nums2[j], j - 1\n    write -= 1`,
  "56":`intervals.sort(key=lambda x: x[0])\nmerged = []\nfor start, end in intervals:\n    if not merged or start > merged[-1][1]:\n        merged.append([start, end])\n    else:\n        merged[-1][1] = max(merged[-1][1], end)\nreturn merged`,
  "31":`i = len(nums) - 2\nwhile i >= 0 and nums[i] >= nums[i + 1]: i -= 1\nif i >= 0:\n    j = len(nums) - 1\n    while nums[j] <= nums[i]: j -= 1\n    nums[i], nums[j] = nums[j], nums[i]\nnums[i + 1:] = reversed(nums[i + 1:])`,
  "41":`n = len(nums)\nfor i in range(n):\n    while 1 <= nums[i] <= n and nums[nums[i]-1] != nums[i]:\n        j = nums[i] - 1\n        nums[i], nums[j] = nums[j], nums[i]\nfor i, x in enumerate(nums):\n    if x != i + 1: return i + 1\nreturn n + 1`,
  "34":`left = lower_bound(nums, target)\nright = lower_bound(nums, target + 1) - 1\nif left == len(nums) or nums[left] != target:\n    return [-1, -1]\nreturn [left, right]`,
  "240":`row, col = 0, len(matrix[0]) - 1\nwhile row < len(matrix) and col >= 0:\n    if matrix[row][col] == target: return True\n    if matrix[row][col] > target: col -= 1\n    else: row += 1\nreturn False`,
  "179":`strings = list(map(str, nums))\nstrings.sort(key=cmp_to_key(lambda a,b: -1 if a+b>b+a else 1))\nanswer = ''.join(strings)\nreturn '0' if answer[0] == '0' else answer`,
  "162":`left, right = 0, len(nums) - 1\nwhile left < right:\n    mid = (left + right) // 2\n    if nums[mid] < nums[mid + 1]: left = mid + 1\n    else: right = mid\nreturn left`,
  "169":`candidate, count = None, 0\nfor x in nums:\n    if count == 0: candidate = x\n    count += 1 if x == candidate else -1\nreturn candidate`,
  "283":`write = 0\nfor read, x in enumerate(nums):\n    if x != 0:\n        nums[write], nums[read] = nums[read], nums[write]\n        write += 1`,
  "53":`current = answer = nums[0]\nfor x in nums[1:]:\n    current = max(x, current + x)\n    answer = max(answer, current)\nreturn answer`,
  "5":`start = end = 0\nfor center in range(len(s)):\n    odd = expand(s, center, center)\n    even = expand(s, center, center + 1)\n    left, right = max(odd, even, key=length)\n    if right - left > end - start:\n        start, end = left, right\nreturn s[start:end + 1]`,
  "121":`lowest, answer = inf, 0\nfor price in prices:\n    lowest = min(lowest, price)\n    answer = max(answer, price - lowest)\nreturn answer`,
  "300":`tails = []\nfor x in nums:\n    index = bisect_left(tails, x)\n    if index == len(tails): tails.append(x)\n    else: tails[index] = x\nreturn len(tails)`,
  "72":`dp = list(range(len(word2) + 1))\nfor i, a in enumerate(word1, 1):\n    diagonal, dp[0] = dp[0], i\n    for j, b in enumerate(word2, 1):\n        old = dp[j]\n        dp[j] = diagonal if a == b else 1 + min(diagonal, dp[j], dp[j-1])\n        diagonal = old\nreturn dp[-1]`,
  "1143":`dp = [0] * (len(b) + 1)\nfor x in a:\n    diagonal = 0\n    for j, y in enumerate(b, 1):\n        old = dp[j]\n        dp[j] = diagonal + 1 if x == y else max(dp[j], dp[j-1])\n        diagonal = old\nreturn dp[-1]`,
  "70":`previous, current = 0, 1\nfor _ in range(n):\n    previous, current = current, previous + current\nreturn current`,
  "322":`dp = [0] + [inf] * amount\nfor value in range(1, amount + 1):\n    for coin in coins:\n        if coin <= value:\n            dp[value] = min(dp[value], dp[value-coin] + 1)\nreturn -1 if dp[amount] == inf else dp[amount]`,
  "64":`for row in range(m):\n    for col in range(n):\n        if row == col == 0: continue\n        top = grid[row-1][col] if row else inf\n        left = grid[row][col-1] if col else inf\n        grid[row][col] += min(top, left)\nreturn grid[-1][-1]`,
  "122":`profit = 0\nfor yesterday, today in zip(prices, prices[1:]):\n    if today > yesterday:\n        profit += today - yesterday\nreturn profit`,
  "221":`dp = [0] * (cols + 1)\nbest = 0\nfor row in matrix:\n    diagonal = 0\n    for j in range(1, cols + 1):\n        old = dp[j]\n        if row[j-1] == '1':\n            dp[j] = 1 + min(dp[j], dp[j-1], diagonal)\n            best = max(best, dp[j])\n        else: dp[j] = 0\n        diagonal = old\nreturn best * best`,
  "152":`maximum = minimum = answer = nums[0]\nfor x in nums[1:]:\n    if x < 0: maximum, minimum = minimum, maximum\n    maximum = max(x, maximum * x)\n    minimum = min(x, minimum * x)\n    answer = max(answer, maximum)\nreturn answer`,
  "62":`dp = [1] * n\nfor _ in range(1, m):\n    for col in range(1, n):\n        dp[col] += dp[col - 1]\nreturn dp[-1]`,
  "198":`skip = take = 0\nfor money in nums:\n    skip, take = max(skip, take), skip + money\nreturn max(skip, take)`,
  "139":`words = set(wordDict)\ndp = [True] + [False] * len(s)\nfor end in range(1, len(s) + 1):\n    for start in range(end):\n        if dp[start] and s[start:end] in words:\n            dp[end] = True\n            break\nreturn dp[-1]`,
  "718":`dp = [0] * (len(b) + 1)\nanswer = 0\nfor x in a:\n    for j in range(len(b), 0, -1):\n        dp[j] = dp[j-1] + 1 if x == b[j-1] else 0\n        answer = max(answer, dp[j])\nreturn answer`,
  "102":`queue = deque([root]) if root else deque()\nanswer = []\nwhile queue:\n    level = []\n    for _ in range(len(queue)):\n        node = queue.popleft(); level.append(node.val)\n        if node.left: queue.append(node.left)\n        if node.right: queue.append(node.right)\n    answer.append(level)\nreturn answer`,
  "103":`levels = level_order(root)\nfor depth in range(len(levels)):\n    if depth % 2: levels[depth].reverse()\nreturn levels`,
  "236":`if not root or root is p or root is q: return root\nleft = lowestCommonAncestor(root.left, p, q)\nright = lowestCommonAncestor(root.right, p, q)\nif left and right: return root\nreturn left or right`,
  "124":`answer = -inf\ndef gain(node):\n    if not node: return 0\n    left = max(0, gain(node.left))\n    right = max(0, gain(node.right))\n    answer = max(answer, node.val + left + right)\n    return node.val + max(left, right)\ngain(root)\nreturn answer`,
  "199":`queue, answer = deque([root]), []\nwhile queue:\n    for index in range(len(queue)):\n        node = queue.popleft()\n        if node.left: queue.append(node.left)\n        if node.right: queue.append(node.right)\n    answer.append(node.val)\nreturn answer`,
  "94":`answer, stack, current = [], [], root\nwhile current or stack:\n    while current:\n        stack.append(current); current = current.left\n    current = stack.pop()\n    answer.append(current.val)\n    current = current.right\nreturn answer`,
  "105":`index = {value:i for i,value in enumerate(inorder)}\ndef build(left, right):\n    if left > right: return None\n    root = TreeNode(preorder.pop(0))\n    mid = index[root.val]\n    root.left = build(left, mid - 1)\n    root.right = build(mid + 1, right)\n    return root\nreturn build(0, len(inorder) - 1)`,
  "129":`def dfs(node, value):\n    if not node: return 0\n    value = value * 10 + node.val\n    if not node.left and not node.right: return value\n    return dfs(node.left, value) + dfs(node.right, value)\nreturn dfs(root, 0)`,
  "101":`def mirror(a, b):\n    if not a or not b: return a is b\n    return a.val == b.val and mirror(a.left,b.right) and mirror(a.right,b.left)\nreturn mirror(root.left, root.right) if root else True`,
  "104":`if not root: return 0\nreturn 1 + max(maxDepth(root.left), maxDepth(root.right))`,
  "110":`def height(node):\n    if not node: return 0\n    left, right = height(node.left), height(node.right)\n    if left == -1 or right == -1 or abs(left-right) > 1: return -1\n    return 1 + max(left, right)\nreturn height(root) != -1`,
  "662":`queue = deque([(root, 0)])\nanswer = 0\nwhile queue:\n    base = queue[0][1]\n    for _ in range(len(queue)):\n        node, index = queue.popleft()\n        if node.left: queue.append((node.left, 2*(index-base)))\n        if node.right: queue.append((node.right, 2*(index-base)+1))\n    answer = max(answer, index - base + 1)\nreturn answer`,
  "98":`def valid(node, low, high):\n    if not node: return True\n    if not low < node.val < high: return False\n    return valid(node.left, low, node.val) and valid(node.right, node.val, high)\nreturn valid(root, -inf, inf)`,
  "144":`if not root: return []\nstack, answer = [root], []\nwhile stack:\n    node = stack.pop(); answer.append(node.val)\n    if node.right: stack.append(node.right)\n    if node.left: stack.append(node.left)\nreturn answer`,
  "543":`answer = 0\ndef depth(node):\n    if not node: return 0\n    left, right = depth(node.left), depth(node.right)\n    answer = max(answer, left + right)\n    return 1 + max(left, right)\ndepth(root)\nreturn answer`,
  "113":`answer, path = [], []\ndef dfs(node, remain):\n    if not node: return\n    path.append(node.val)\n    if not node.left and not node.right and remain == node.val:\n        answer.append(path[:])\n    dfs(node.left, remain-node.val); dfs(node.right, remain-node.val)\n    path.pop()\ndfs(root, targetSum)\nreturn answer`,
  "112":`if not root: return False\nif not root.left and not root.right: return target == root.val\nremain = target - root.val\nreturn hasPathSum(root.left, remain) or hasPathSum(root.right, remain)`,
  "226":`if not root: return None\nroot.left, root.right = invertTree(root.right), invertTree(root.left)\nreturn root`,
  "200":`def flood(row, col):\n    if outside(row,col) or grid[row][col] != '1': return\n    grid[row][col] = '0'\n    for dr, dc in directions: flood(row+dr, col+dc)\nanswer = 0\nfor row, col in every_cell(grid):\n    if grid[row][col] == '1':\n        answer += 1\n        flood(row, col)\nreturn answer`,
  "46":`answer, path = [], []\ndef dfs():\n    if len(path) == len(nums): answer.append(path[:]); return\n    for x in nums:\n        if x in path: continue\n        path.append(x)\n        dfs()\n        path.pop()\ndfs()\nreturn answer`,
  "93":`def dfs(index):\n    if len(path) == 4:\n        if index == len(s): answer.append('.'.join(path))\n        return\n    for end in range(index+1, min(index+3,len(s))+1):\n        part = s[index:end]\n        if invalid_ip_part(part): continue\n        path.append(part); dfs(end); path.pop()\ndfs(0)\nreturn answer`,
  "22":`def dfs(path, left, right):\n    if len(path) == 2*n: answer.append(path); return\n    if left < n: dfs(path + '(', left + 1, right)\n    if right < left: dfs(path + ')', left, right + 1)\ndfs('', 0, 0)\nreturn answer`,
  "78":`answer = []\ndef dfs(index, path):\n    answer.append(path[:])\n    for i in range(index, len(nums)):\n        path.append(nums[i])\n        dfs(i + 1, path)\n        path.pop()\ndfs(0, [])\nreturn answer`,
  "39":`def dfs(start, remain):\n    if remain == 0: answer.append(path[:]); return\n    for i in range(start, len(candidates)):\n        value = candidates[i]\n        if value > remain: break\n        path.append(value)\n        dfs(i, remain - value)\n        path.pop()\ndfs(0, target)`,
  "695":`def area(row, col):\n    if outside(row,col) or grid[row][col] == 0: return 0\n    grid[row][col] = 0\n    return 1 + sum(area(row+dr,col+dc) for dr,dc in directions)\nreturn max(area(r,c) for r,c in every_cell(grid))`,
  "207":`indegree = build_indegree(prerequisites)\nqueue = deque(course for course in courses if indegree[course] == 0)\nstudied = 0\nwhile queue:\n    course = queue.popleft(); studied += 1\n    for nxt in graph[course]:\n        indegree[nxt] -= 1\n        if indegree[nxt] == 0: queue.append(nxt)\nreturn studied == numCourses`,
  "146":`cache = OrderedDict()\ndef get(key):\n    if key not in cache: return -1\n    cache.move_to_end(key)\n    return cache[key]\ndef put(key, value):\n    if key in cache: cache.move_to_end(key)\n    cache[key] = value\n    if len(cache) > capacity: cache.popitem(last=False)`,
  "20":`pairs = {')':'(', ']':'[', '}':'{'}\nstack = []\nfor ch in s:\n    if ch in pairs:\n        if not stack or stack.pop() != pairs[ch]: return False\n    else: stack.append(ch)\nreturn not stack`,
  "239":`queue, answer = deque(), []\nfor i, x in enumerate(nums):\n    while queue and queue[0] <= i-k: queue.popleft()\n    while queue and nums[queue[-1]] <= x: queue.pop()\n    queue.append(i)\n    if i >= k-1: answer.append(nums[queue[0]])\nreturn answer`,
  "32":`stack, answer = [-1], 0\nfor i, ch in enumerate(s):\n    if ch == '(': stack.append(i)\n    else:\n        stack.pop()\n        if not stack: stack.append(i)\n        else: answer = max(answer, i-stack[-1])\nreturn answer`,
  "232":`def push(x): input_stack.append(x)\ndef move():\n    if not output_stack:\n        while input_stack: output_stack.append(input_stack.pop())\ndef pop(): move(); return output_stack.pop()\ndef peek(): move(); return output_stack[-1]\ndef empty(): return not input_stack and not output_stack`,
  "394":`stack, number, text = [], 0, ''\nfor ch in s:\n    if ch.isdigit(): number = number*10 + int(ch)\n    elif ch == '[':\n        stack.append((text, number)); text, number = '', 0\n    elif ch == ']':\n        previous, repeat = stack.pop(); text = previous + repeat*text\n    else: text += ch\nreturn text`,
  "155":`def push(value):\n    stack.append(value)\n    mins.append(value if not mins else min(value, mins[-1]))\ndef pop(): mins.pop(); return stack.pop()\ndef top(): return stack[-1]\ndef getMin(): return mins[-1]`,
  "227":`stack, number, sign = [], 0, '+'\nfor i, ch in enumerate(s + '+'):\n    if ch.isdigit(): number = number*10 + int(ch)\n    elif ch != ' ':\n        apply(stack, sign, number)\n        sign, number = ch, 0\nreturn sum(stack)`,
  "415":`i, j, carry, answer = len(a)-1, len(b)-1, 0, []\nwhile i >= 0 or j >= 0 or carry:\n    x = int(a[i]) if i >= 0 else 0\n    y = int(b[j]) if j >= 0 else 0\n    carry, digit = divmod(x + y + carry, 10)\n    answer.append(str(digit))\n    i, j = i-1, j-1\nreturn ''.join(reversed(answer))`,
  "165":`left, right = version1.split('.'), version2.split('.')\nfor i in range(max(len(left), len(right))):\n    a = int(left[i]) if i < len(left) else 0\n    b = int(right[i]) if i < len(right) else 0\n    if a < b: return -1\n    if a > b: return 1\nreturn 0`,
  "8":`i, sign, value = 0, 1, 0\nwhile i < len(s) and s[i] == ' ': i += 1\nif i < len(s) and s[i] in '+-':\n    sign = -1 if s[i] == '-' else 1; i += 1\nwhile i < len(s) and s[i].isdigit():\n    value = value*10 + int(s[i]); i += 1\nreturn clamp(sign * value, INT_MIN, INT_MAX)`,
  "43":`answer = [0] * (len(a) + len(b))\nfor i in range(len(a)-1, -1, -1):\n    for j in range(len(b)-1, -1, -1):\n        product = int(a[i]) * int(b[j]) + answer[i+j+1]\n        answer[i+j+1] = product % 10\n        answer[i+j] += product // 10\nreturn ''.join(map(str, answer)).lstrip('0') or '0'`,
  "151":`words = s.split()\nwords.reverse()\nreturn ' '.join(words)`,
  "14":`prefix = strings[0]\nfor word in strings[1:]:\n    while not word.startswith(prefix):\n        prefix = prefix[:-1]\n        if not prefix: return ''\nreturn prefix`,
  "54":`top, bottom, left, right = 0, rows-1, 0, cols-1\nwhile top <= bottom and left <= right:\n    visit_top_row(left, right); top += 1\n    visit_right_col(top, bottom); right -= 1\n    if top <= bottom: visit_bottom_row(right, left); bottom -= 1\n    if left <= right: visit_left_col(bottom, top); left += 1\nreturn answer`,
  "42":`left, right = 0, len(height)-1\nleft_max = right_max = water = 0\nwhile left < right:\n    if height[left] < height[right]:\n        left_max = max(left_max, height[left])\n        water += left_max - height[left]; left += 1\n    else:\n        right_max = max(right_max, height[right])\n        water += right_max - height[right]; right -= 1\nreturn water`,
  "48":`n = len(matrix)\nfor row in range(n):\n    for col in range(row+1, n):\n        matrix[row][col], matrix[col][row] = matrix[col][row], matrix[row][col]\nfor row in matrix:\n    row.reverse()`,
  "470":`while True:\n    row = rand7()\n    col = rand7()\n    index = (row - 1) * 7 + col\n    if index <= 40:\n        return 1 + (index - 1) % 10`,
};

export const PROBLEMS: Problem[] = RAW.trim().split("\n").map((line, index) => {
  const [id, title, difficulty, frequency, slug] = line.split("|");
  return { rank:index + 1, id, title, difficulty:Number(difficulty), frequency:Number(frequency), slug, topic:topicOf(id), code:GUIDE_SOLUTIONS[id] ?? S[id], statement:STATEMENTS[id] };
});

export const byTopic = (key: TopicKey) => PROBLEMS.filter(problem => problem.topic === key);

export const difficultyLabel = (level: number) => ["", "简单", "中等", "困难"][level];
