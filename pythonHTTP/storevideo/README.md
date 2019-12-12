save_video.py 存4支camera影片30秒



須進入(tf)環境

video_postprocessing_all.py 一次處理完4部影片 

video_postprocessing.py  須進入(tf)環境

- --input_file 輸入的影片
- --output_file 輸出的影片



不用進入(tf)環境

videoA.sh, videoB.sh, videoC.sh, videoD.sh

- 需使用 source 執行

- 每個shell分別使用 video_postprocessing.py 處理影片