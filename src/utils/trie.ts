/**
 * Trie (Prefix Tree) optimized for string prefix matching.
 * Used for O(L) dictionary lookups instead of O(N) linear scans.
 */
export class Trie {
  private root: Map<string, TrieNode>;

  constructor() {
    this.root = new Map();
  }

  insert(key: string, value: string) {
    let node = this.root;
    for (let i = 0; i < key.length; i++) {
      const char = key[i];
      if (!node.has(char)) {
        node.set(char, { children: new Map(), value: null });
      }
      const nextNode = node.get(char)!;
      node = nextNode.children;
      // Set value at the last node
      if (i === key.length - 1) {
        nextNode.value = value;
      }
    }
  }

  /**
   * Finds the longest matching prefix for the text starting at index 0.
   * Returns { matchedLength: number, value: string | null }
   */
  findLongestMatch(text: string): { matchedLength: number; value: string | null } {
    let node = this.root;
    let longestMatchLen = 0;
    let longestMatchValue: string | null = null;
    let currentLen = 0;

    for (const char of text) {
      if (!node.has(char)) break;

      const currentNode = node.get(char)!;
      currentLen++;

      if (currentNode.value !== null) {
        longestMatchLen = currentLen;
        longestMatchValue = currentNode.value;
      }

      node = currentNode.children;
    }

    return { matchedLength: longestMatchLen, value: longestMatchValue };
  }
}

interface TrieNode {
  children: Map<string, TrieNode>;
  value: string | null;
}
