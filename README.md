# ktf-dashboard-vue

基于[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)项目的[permission-control](https://github.com/PanJiaChen/vue-admin-template/tree/permission-control)分支构建的管理后台脚手架，基于 `vue-cli` 进行构建，包含了 Element UI & axios & iconfont & permission control & lint & Echarts等组件。

## 相关项目

- [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

## Build Setup

```bash
# 克隆项目
git clone https://github.com/kivilu/ktf-dashboard-vue.git

# 进入项目目录
cd ktf-dashboard-vue

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

更多信息请参考 [使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)