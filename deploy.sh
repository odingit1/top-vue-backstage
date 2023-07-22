#!/bin/bash

# Deploy date
date=`date +%Y%m%d%H%M%S`
# Deploy confirm code
code="5566"
# Version format
versRe="^([0-9]+\.){2}[0-9]+$"

if [ "$1" != "" ]; then
 echo "開始部署 ${1}：${date}"

 # Deploy PROD
 recentTag=$(git tag --list | grep prod-* | sort --version-sort | tail -1)
 if [ "$1" = "prod" ]; then
   echo "最近的Tag：${recentTag}"
   read -p "PROD 部署版本號 (格式：[0-9]+.[0-9]+.[0-9]+)：" VERS
   if [[ $VERS =~ $versRe ]]; then
     read -p "確定要繼續部署 PROD 作業 (${code}/n)？" CODE
     if [ "$CODE" = "$code" ]; then
       git checkout main
       git pull origin main
       git tag "prod-${VERS}"
       git push origin main --tags
     else
       "▇▇▇▇ 您取消了 PROD 部署作業 ▇▇▇▇"
       exit 0
     fi
   else
     "▇▇▇▇ 版本號格式錯誤，取消 PROD 部署作業 ▇▇▇▇"
     exit 0
   fi
 fi

 echo "▇▇▇▇ 提醒：此階段部署作業尚未完成，請去 GitLab 專案查看 CI/CD Pipelines 的執行狀況，Stages 執行完才算完成。▇▇▇▇"

else
 echo "Command error usage: $0 prod "
fi
