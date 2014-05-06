#!/bin/bash
# websiteのソースから node-webkitアプリケーションを作成します
#
# (作成しなくても、index.htmlをローカル実行することでウェブサイトの閲覧と実行は可能)
# siteapp/src直下で実行してください
zip serialLEDProgrammerWeb.nw * && mv serialLEDProgrammerWeb.nw ../build

#### 以下 node-webkitのメモ ####
# QuickStart
# https://github.com/rogerwang/node-webkit#downloads

# preBuildバイナリ
# http://dl.node-webkit.org/v0.8.6/node-webkit-v0.8.6-osx-ia32.zip

# サンプルアプリ
# https://github.com/zcbenz/nw-sample-apps

# 参考記事
# http://shokai.org/blog/archives/8586
####
