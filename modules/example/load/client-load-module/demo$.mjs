class Demo {
  /**
   * Perform add.
   * @param {Number} value1 Value 1
   * @param {Number} value2 Value 2
   * @return {Number} The result
   */
  static add(value1, value2) {
    return value1 + value2;
  }
}
console.log('demo.mjs only load once');
export { Demo };