import {
  isArray,
  isFunction,
  isNumber,
  isString,
  isTrue,
  isUndefined,
} from '@mudbean/is';

/**
 * 参数的数据类型
 */
export type ClassNameItem =
  | null
  | number
  | string
  | boolean
  | undefined
  | (() => string)
  | (() => ClassNameItem[])
  | ClassNameItem[]
  | Record<string, boolean | undefined>;

/**
 * 使用 infer 判断出当前的数据类型
 *
 * 字符串为具体的字符串值而非 string
 */
export type TypeofClassNameItem<T> = T extends null | boolean | undefined
  ? ''
  : T extends readonly [unknown, infer U]
    ? TypeofClassNameItem<U> | ''
    : T extends readonly [unknown, infer U, infer V]
      ? TypeofClassNameItem<U> | TypeofClassNameItem<V>
      : T extends Record<string, boolean | undefined>
        ? keyof T | ''
        : T extends () => string
          ? string
          : T;

/**
 * 递归判断当前返回的数据类型
 */
export type XCN<T> = T extends [infer U, ...infer V]
  ? `${U & string}  ${XCN<V>}`
  : '';

/**
 * # 以空格为分隔符拼接字符串
 * @param classNameList 待拼接的字符串
 * @returns string 拼接后的字符串
 * @example
 * ```ts
 * import { xcn } from 'xcn';
 *
 * // 以纯字符串为参数
 * // 'a b c'
 * xcn('a', 'b', 'c');
 *
 * // 剔除多余的空格
 * // 'a b c'
 * xcn('a ', '   b ', 'c ');
 *
 * // 参数可以是字符串数组
 * // 'a b c d e'
 * xcn(['a', 'b'], ['c', 'd'], 'e');
 *
 * // 参数可为可执行返回值为字符串的或字符串数组的函数
 * // 'a b c d e f g'
 * xcn('a', '  b  ', ['c', 'd'] , ()=> 'e', () => ['f', 'g']);
 *
 * // 参数可为简单对象，以键入参，以值为断
 * // 'a b c e g'
 * xcn('a', 'b', {
 *  c: true,
 *  d: false,
 *  e: !0,
 *  f: !1,
 *  g: 1 > 0
 * });
 * ```
 */
export function xcn<T extends ClassNameItem[]>(
  ...classNameList: T
): XCN<{ [K in keyof T]: TypeofClassNameItem<T[K]> }> {
  /**  临时  */
  const template: string[] = [];
  /**  移除空白  */
  const removeBlank = (str: string) =>
    str
      .trim()
      .replace(/undefined/g, ' ')
      .replace(/\s+/g, ' ')
      .split(' ')
      .sort()
      .join(' ');
  /**  混合值  */
  const mergeNewValue = (newValue?: string) => {
    if (isUndefined(newValue) || !isString(newValue)) return;
    const newList = removeBlank(newValue).split(' ');
    if (newList.length) template.push(...newList);
  };
  classNameList.forEach(classNameItem => {
    // 数据为 undefined 或 null 或 false 或 true 或 '' 或 [] 或 {}
    if (!classNameItem || isTrue(classNameItem)) return;
    // 数据为数组类型
    if (isArray(classNameItem))
      classNameItem.forEach(childItem => mergeNewValue(xcn(childItem)));
    // 数据为 string 类型
    else if (isString(classNameItem) || isNumber(classNameItem))
      mergeNewValue(classNameItem.toString());
    // 数据为函数类型
    else if (isFunction(classNameItem)) {
      const result = classNameItem();
      if (isString(result)) mergeNewValue(result);
      else result.forEach(item => mergeNewValue(xcn(item)));
    } else {
      // 数据为 object 类型
      for (const key in classNameItem) {
        if (Object.prototype.hasOwnProperty.call(classNameItem, key)) {
          const element = classNameItem[key];
          if (true === element) mergeNewValue(key);
        }
      }
    }
  });
  const result = removeBlank(
    Array.from(new Set(template)).filter(Boolean).join(' '),
  );

  return (result ?? undefined) as unknown as XCN<{
    [K in keyof T]: TypeofClassNameItem<T[K]>;
  }>;
}

export default xcn;
