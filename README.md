# muti

该项目通过模块划分为多个子项目，子项目之间相互独立，可单独构建打包

基于Vue-cli 3的Service插件针对不同的环境扩展/修改内部的 webpack 配置，实现多项目打包

## 背景
主要解决项目迭代到后期体积增大，构建打包缓慢，业务耦合较深。

## Usage

src/module文件为子项目存放位置

子项目可以单独构建
```
yarn dev projectA

yarn build projectA
```

也可同时构建多个子项目
```
yarn dev projectA projectB

yarn build projectA projectB
```

子项目如有二级目录则用 / 或者 _ 分割
```
yarn dev activities_actA

yarn dev activities/actA
```
如果想一次性构建所有子项目，可以使用 all 参数
```
yarn build all
```
