# xcn

[![version](<https://img.shields.io/npm/v/xcn.svg?logo=npm&logoColor=rgb(0,0,0)&label=版本号&labelColor=rgb(73,73,228)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/xcn) [![issues 提交](<https://img.shields.io/badge/issues-提交-rgb(255,0,63)?logo=github>)](https://github.com/MrMudBean/xcn/issues)

`xcn = mix + class name` 组装 html 元素的 class 属性值，`xcn` 仅是 `mix-cn` 的缩写。

## 安装

```sh
npm install --save xcn@latest
```

## 使用

```ts
import { xcn } from 'xcn';

> xcn('a' , 'b' ,'c');

'a b c'

> xcn('a', { c: false }, true , false ,null , {d: true}, 'b');

'a b d'
```

## 状态

此软件包是 `@mudbean` 生态系统的一部分。
它使用严格的 TypeScript 编写，并通过 Rollup 构建进行验证。
虽然单元测试较少，但 API 稳定，并在生产环境中大量使用。
