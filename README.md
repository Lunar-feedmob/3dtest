# 250㎡ 数字样板间

根据上传的 250㎡ 住宅户型图（19800 × 14400mm）生成的 Three.js 3D 数字样板间。
真实比例（1 unit = 1m）、可第一人称进入浏览，效果对标 ArchViz 数字样板间。

第一阶段《建筑空间分析报告》见 [docs/建筑空间分析报告.md](docs/建筑空间分析报告.md)。

## 运行（GitHub Codespaces / 本地）

```bash
npm install
npm run dev        # 浏览器打开 http://localhost:5173
```

构建与预览：

```bash
npm run build      # 产物输出到 dist/（base: './'，可直接静态托管）
npm run preview
```

## 操作

- 第一人称：点击画面锁定鼠标，WASD 移动，鼠标环顾，Shift 快走，Esc 释放
- 顶部按钮 / 切换：第一人称 / 鸟瞰图 / 建筑轴测图 / 2D户型图
- 2D 户型图：点击房间跳转进入对应 3D 位置；可切换「原始户型图」查看上传原图
- 「切换夜晚」：昼夜光照切换（阳光 ↔ 筒灯/灯带/氛围照明）

## 目录结构

```
├── index.html            # 入口页面（UI / 覆盖层）
├── vite.config.js        # base: './'，支持 GitHub Pages
├── package.json
├── public/
│   ├── models/           # 预留 GLB 模型目录
│   └── textures/
│       └── floorplan.png # 原始户型图（2D 视图原图）
├── docs/
│   └── 建筑空间分析报告.md
└── src/
    ├── main.js           # 入口、视角切换、主循环
    ├── scene.js          # 渲染器 / 相机 / SSAO 后处理
    ├── house.js          # 墙体 / 门窗 / 地面 / 天花 / 碰撞体
    ├── furniture.js      # 程序化家具与软装
    ├── controls.js       # 第一人称 + 碰撞
    ├── lighting.js       # 昼夜灯光 / 面光源 / 环境
    ├── materials.js      # PBR 材质 + 程序化纹理/法线
    └── plan.js           # 2D 交互户型图
```

## GitHub Pages 部署

`vite.config.js` 已配置 `base: './'`，所有资源相对路径加载，无后端依赖。

方式一（gh-pages 分支）：

```bash
npm run build
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/* .
git add -A
git commit -m "deploy"
git push origin gh-pages
git checkout main
```

然后在仓库 Settings → Pages 中选择 `gh-pages` 分支根目录即可。

方式二：任何静态托管直接上传 `dist/` 目录内容。

## 历史版本

`project/` 为早期 CDN 版 demo（无构建步骤，`python3 -m http.server` 运行），仅作存档保留。
