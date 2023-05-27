# 聚合图床上传工具

聚合图床：[聚合图床 - 免费无限图片上传 (superbed.cn)](https://www.superbed.cn/)

## 安装方法

需要安装 [pnpm](https://pnpm.io/)。

```bash
git clone git@github.com:MoyuScript/super-bed-cli.git
cd super-bed-cli
pnpm install
pnpm link -g
pnpm link -g super-bed-cli
```

自行登录聚合图床账号后，通过抓包找到 Cookie 中的 `token` 字段，然后写入到 `.env` 文件中。

## 使用方法

### 手动上传

```bash
super-bed-cli <image_path1> <image_path2> ...
```

### 配合 Typora

编写该工具主要就是配合 Typora 使用的，教程可以查看：[Upload Images - Typora Support](https://support.typora.io/Upload-Image/#custom)
