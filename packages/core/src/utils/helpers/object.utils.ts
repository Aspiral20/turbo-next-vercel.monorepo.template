/**
 *  const toNum = regexStringNumber(e.target.value)
 *
 *  '5124s' => '5124'
 *  '51245' => '51245'
 *
 *  const toNum = regexStringNumber(e.target.value, ['+'])
 *
 *  '+37345543524' => '+37345543524'
 **/
export function regexStringNumber(str: string, chars?: Array<string>) {
  const regexNumber = new RegExp("^[\\d\\" + chars?.join('\\') + "]+(\\.?\\d{0,4})")
  const ArrayOfNumbers = str.match(regexNumber)

  const res = ArrayOfNumbers?.join('')
  return res || ''
}


/**
 *
 * getFirstMissingNumber([1, 2, 7, 5]); // → 3
 * getFirstMissingNumber([3, 5, 6]);    // → 1
 * getFirstMissingNumber([1, 2, 3]);    // → 4
 * getFirstMissingNumber([]);           // → 1
 *
 **/
export function getFirstMissingNumber(arr: number[] = []) {
  const set = new Set(arr);

  let n = 1;
  while (set.has(n)) {
    n++;
  }
  return n;
}