import {
  isArray,
  isFunction,
  isNumber,
  isString,
  isTrue,
  isUndefined,
} from 'a-type-of-js';

/**
 * 参数的数据类型
 */
export type EnClassNameItem =
  | null
  | number
  | string
  | boolean
  | undefined
  | (() => string)
  | (() => EnClassNameItem[])
  | EnClassNameItem[]
  | Record<string, boolean | undefined>;

/**
 * 使用 infer 判断出当前的数据类型
 *
 * 字符串为具体的字符串值而非 string
 */
export type EnTypeofClassNameItem<T> = T extends null | boolean | undefined
  ? ''
  : T extends readonly [unknown, infer U]
    ? EnTypeofClassNameItem<U> | ''
    : T extends readonly [unknown, infer U, infer V]
      ? EnTypeofClassNameItem<U> | EnTypeofClassNameItem<V>
      : T extends Record<string, boolean | undefined>
        ? keyof T | ''
        : T extends () => string
          ? string
          : T;

/**
 * 递归判断当前返回的数据类型
 */
export type EnXcn<T> = T extends [infer U, ...infer V]
  ? `${U & string}  ${EnXcn<V>}`
  : '';

/**
 *
 * 合并 class
 *
 * merge class name
 *
 */
export function xcn<T extends EnClassNameItem[]>(
  ...classNameList: T
): EnXcn<{ [K in keyof T]: EnTypeofClassNameItem<T[K]> }> {
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

  return (result ?? undefined) as unknown as EnXcn<{
    [K in keyof T]: EnTypeofClassNameItem<T[K]>;
  }>;
}

export default xcn;
