興創智慧學程密室逃脫計劃 server 組
===
## IP
* 開頭都是 192.168.50.x

| 機關名稱 | IP 位置 |
| :------: | :-----------: |
| 燈條面具 | 19 |
| 九宮格 | 20 |
| 抽屜 | 40 - 42 (D B C) |
| 門 | 45 - 47 |
| 控制燈 | 49 |
| 大開關 | 50 |
| 接線盒 | 60 |
| 計時器 | 61 |
| 棺材 | 62 |
| RFID | 63 |
| RGB | 70 - 80 |
| Manual_Light | 90 |
| 警示燈 | 91 |
| 齒輪 | 100 |
| 第一間房間監視器 | 200 - 203 |
| 手寫辨識 | 205 |
| 第三間房間監視器 | 207 - 209 |
| 音控 | 210 |
| 計算機 | 211 |
| USB | 218 |
| 螢幕影片 | 212 - 217 | 

192.168.50.225:8000
python -m SimpleHTTPServer


## mongodb

* 檔案放在 /home/mushding-app/mongodb.py 中

| 機關名稱 | 在資料庫中 Collection 的名稱 |
| :------: | :-----------: |
| 抽屜 | db.drawer |
| 門 | db.door |
| USB 影片 | db.usbVideo |
| 計算機 | db.calculator |
| 計時器 | db.timeCounter |
| 第一關總電源 | db.firstRoomPower |
| 第二關手寫辨視 | db.secondRoomWritingCamera |
| 第二關接線盒 | db.secondRoomWireBox |
| 網頁右上角小鈴鐺 | db.notifications |
| 左邊訊息欄 | db.menuList |

## flask
* 檔案放在 /home/mushding-app/app.py 中
### 抽屜 (drawer)
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /checkDrawer | 給前端更新目前狀態 | 資料庫中 db.drawer 的 json 格式 |
| /openDrawer/\<int:index\>/\<int:isOpen\> | 處理前端按下按鈕後的反應 | None |
### 門 (door)
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /checkDoor | 給前端更新目前狀態 | 資料庫中 db.door 的 json 格式 |
| /openDoor/\<int:index\>/\<int:isOpen\> | 處理前端按下按鈕後的反應 | None |
### Usb 影片 (usb)
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /checkUsb | 給前端更新目前狀態 | 資料庫中 db.usbVideo 的 json 格式 |
### 計算機 (calculator)
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /checkCalculator | 給前端更新目前狀態 | 資料庫中 db.calculator 的 json 格式 |
| /getCalculator | 計算機謎題解完開抽屜 | None |
### 計時機 (timeNow)
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /checkTimeNow | 給前端更新目前狀態 | 資料庫中 db.timeCounter 的 json 格式 |
| /checkTimeCounter | 當前端按下更改時間按鈕時去 get 計時器 | None |
### 第一關總電源 (power)
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /checkPower | 給前端更新目前狀態 | 資料庫中 db.firstRoomPower 的 json 格式 |
| /getPower/\<int:index\> | 流程使用 機關會 get 這個網址 | None |
### 第一關 RFID (RFID)
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| set_reset | |  |
### 第一關 攝影機 (camera)
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /killFirstRoomCamera | kill 所有的攝影機追人 process | None |
| /setFirstRoomCamera/\<int:index\> | 看 index 決定四個攝影機的行動 | None |
### 第二關手寫辨識 (writingCamera)
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /checkWritingCamera /\<string:month\>/\<string:date\> | 給前端更新目前狀態 | 資料庫中 db.secondRoomWritingCamera 的 json 格式 |
| /getWritingCamera/\<int:pid\> | 流程使用 機關會 get 這個網址 | None |
### 第二關接線盒 (wireBox)
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /checkWireBox | 給前端更新目前狀態 | 資料庫中 db.secondRoomWireBox 的 json 格式 |
| /resetWireBox/\<int:isOpen\> | 把接線盒中的過關狀態清除 | None |
| /getWireBox | 流程使用 機關會 get 這個網址 | None |
### 第二關棺材 (coffin)
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /resetCoffin/\<int:isOpen\> | 給資料庫清空用 | None |
| /checkCoffin | 給前端更新目前狀態 | 資料庫中 db.secondRoomCoffin 的 json 格式 |
| /getCoffin | 當棺材謎題解完開抽屜 | None |
### 第三關九宮格 (nineBlock)
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /startNineBlock | 當九宮格謎題按扭按下去的流程 | None |
| /checkNineBlock/\<int:iscorrect\> | 當九宮格謎題按扭按「檢查」是不是對的的流程 | None |

### 第三關主流
```
緊急照明燈off{
    1.啟動九宮格按鈕
    2.open說明燈後的崁燈
    3.播放螢幕影片x2
    4.led呼吸燈模式
}

// btn被按下，九宮格run起來
startNineBlock{
    1.led燈條（面具、底下那排）亮白光
    2.齒輪轉
    3.播音效
}

checkNineBlock{
    if(0){
        1.led燈條（面具、底下那排）全部亮紅光
        2.delay(3s)
        3.led燈條全部切回呼吸燈
    }
    else{
        1.led燈條全部亮綠光
        2.AI爆炸影片
        3.開門
     }
}
```


### 螢幕影片檢查
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /checkAllScreenState | ping 213 ~ 220 的 IP | db.screenState |
### 錄影片流程
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /checkStoreVideo/\<string:name\>/\<int:pid\> | 當第一間門打開後，開始算框框 |  |
| /checkMergeVideo | 當 merge Video 算完後 call 去 217 下載影片 |  |
### 一鍵重置系列
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /resetRoomState/\<int:room\> | 重置相對應房間的狀態 | None |
| /resetALLState | 重置「所有」房間的狀態 | None |
### 網頁右上角小鈴鐺 (notifications)
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /checkNotifications | 給前端更新目前狀態 | 資料庫中 db.notifications 的 json 格式 (不包括 \_id 中的資料)|
| /clearNotifications | 清空 notifications | None |
### 左邊訊息欄 (menuList)
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /checkMenuList | 給前端更新左邊訊息欄是否關的 | 資料庫中 db.menuList 的 json 格式 |
| /checkMenuList/\<int:index\> | 更新資料庫中 db.menuList 的值 | 資料庫中 db.menuList 的 json 格式 |
### youtube 點歌
| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /stopPlaying | 更改 isStopState 停止播放 | None |
| /pausePlaying | 更改 isStopState 暫停播放 | None |
| /restartPlaying | 更改 isStopState 重新播放 | None |
| /startPlaying/\<int:index\> | 開始播放相對應的歌 | None |
| /stopContinue | 更改 isContinue 取消循環播放 | None |
| /startContinue | 更改 isContinue 開起循環播放 | None |
| /checkSongIndex | 前端更新播放器目前所有的 State | db.youtubeSongIndex |
| /nextSongIndex/\<int:index\> | 當使用者按下下面播放按扭更新 playNowIndex | None |
| /nextSong | 由 Rpi 呼叫 當 exitEvent callback 時 播放下一首歌 | None |
| /deleteAllSongList | 刪除所有清單中的歌 |  |
| /deleteYoutubeSongList/\<int:index\> | 按下叉叉後刪除對應的歌 |  |
| /downloadYoutubeSongList/\<string:website\> | 下載網址 |  |
| /checkYoutubeSongList | 每 2 秒更新歌單 |  |
### 手機 get
* server 需要回傳給手機的 json 檔

| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /checkAllPhoneState | 回傳其他手機的 Boolean 值 |  |
| /changeAllPhoneState/\<string:name\>/\<int:isRead\> | 更改手機 Boolean 值 |  |

| 手資資料名稱 | 資料型態 | return json 的名稱 |
| :------: | :-----------: | :-----------: |
| B訪談 | 文件 | documentInterviewB |
| C訪談 | 文件 | documentInterviewC |
| D訪談 | 文件 | documentInterviewD |
| C照片(對話紀錄) | 文件 | documentPictureC |
| B日記 | 影片 | videoDiaryB |
| C鋼琴譜 | 影片 | videoPianoSheetC |
| D妹妹照片 | 影片 | videoSisterPictureD |
| 紀錄(影音檔紀錄需到主畫面) | 提示 | tipRecord |
| 帳本提示 | 提示 | tipAccountBook |
| 手電筒 | 提示 | tipFlashLight |
| 方塊提示 | 提示 | tipNineBlock |
| 玩家按讚 | 無用 | likes |


| 網址名稱 | 網址的功能及目的 | return 值 |
| :------: | :-----------: | :-----------: |
| /getFirstRoomPassword| 玩家解完第一間密碼後開門 |  | 
| /getAccountBookChecked | 玩家掃描到錯誤帳本後開起手寫辨識 code |
| /getPlayerHelp | 玩家求救 |  |
| /getLikes | 取得玩家累計按讚數 | jsonify(資料庫) |
| /addLikes | 把資料庫的按讚 +1 |  |


## react
* 檔案都放在 /home/mushding-app/src 中

| 檔案名稱 | 功能及用途 |
| :-----: | :-----: |
| index.js | 一切的起點 |
| App.js | 一切的起點 & 設定 route |
| AudioControl.js | 音效控制頁面 |
| Calculator.js | 計算機控制頁面 |
| CustomizedSnackbars.js | 自定義的 Snackbars 設定 |
| Dashboard.js | 密室主監控畫面頁面 |
| DashboardTemplates.js | 網頁左側及上側的畫面切換時固定 |
| MainListItems.js | 畫面左側選單顯示及設定 route |
| Monitor.js | 密室監視畫面頁面 |
| Notifications.js | 右上角小鈴鐺頁面 |
| OpenDoor.js | 機關門控制頁面 |
| OpenDrawer.js | 抽屜控制頁面 |
| OtherProject.js | 其他機關 GET 頁面 |
| TimeCounter.js | 右上計時器頁面 |
| UsbVideo.js | USB 畫面控制頁面 |
| login | 登入畫面頁面 |
| Stepper | 主畫面流程顯示 |

## 音效
* 檔案放在 (210) Rpi 中

| 音效名稱 | 目的 | 網址 |
| :-------: | :---------: | :----: |
| firstRoomPowerOn | 打開總電源後播放 | /playFirstRoomPowerOn |
| firstRoomRFID | 四個 RFID 解鎖後播放 | /playFirstRoomRFID |
| secondRoomDrawerOpen | 抽屜解鎖後播放 | /playSecondRoomDrawerOpen |
| secondRoomWireBox | 接線盒解鎖後播放 | /playSecondRoomWireBox |
| startAnnoyingSound | 第三間底噪 | /playStartAnnoyingSound |
| thirdRoomAIDefeated | AI 打敗音效 | /playThirdRoomAIDefeated |
| thirdRoomAlert | 剛進入第三間的警告音效 | /playThirdRoomAlert |
| thirdRoomNineBoxScan | 九宮格掃描音效 | /playThirdRoomNineBoxScan |
