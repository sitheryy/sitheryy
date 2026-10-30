# kru-khongkhwan-studio

ชุดเครื่องมือทำคลิปแอนิเมชันสอนนาฏศิลป์ไทยของช่อง **ครูของขวัญ TS**
เป็นแบบกระดาษตัดแปะ เขียนด้วยโค้ด 1920×1080 (แนวนอน) มีซับไตเติล ดนตรีไทย และเสียงเอฟเฟกต์

## ใช้กับ Claude (วิธีที่แนะนำ)
เริ่มงานใหม่แล้วพิมพ์ประมาณนี้
> ใช้ /kru-khongkhwan-animation ดึงโค้ดจาก repo sitheryy/sitheryy โฟลเดอร์ kru-khongkhwan-studio แล้วทำเรื่อง ... (แนบสคริป + ไฟล์เสียง)

ถ้าจะใช้รูปเดิม ให้แนบ zip รูป (`images/...`) มาด้วย

## โครงสร้าง
```
engine/              ตัวเครื่องยนต์ ใช้ร่วมกันทุกเรื่อง
  lib.js             ตัวช่วยวาด กระดาษฉีก ป้าย ตัวอักษร
  base.js            ตัวละคร (ขย่ม/โยก/ปากขยับ) พื้นหลัง กล้อง เอฟเฟกต์ ซับไตเติล
  render.mjs         เรนเดอร์ภาพตัวอย่าง (sheet) / ส่ง SFX (events) / เรนเดอร์เฟรม (frames)
  stick.py           ตัดพื้นหลังรูปจาก Google Flow ให้เป็นสติกเกอร์
  make_index.sh      สร้าง site/index.html ในโฟลเดอร์โปรเจกต์
  fonts/             ฟอนต์ Mali
projects/            โค้ดของแต่ละเรื่องที่ทำเสร็จแล้ว (ใช้เป็นแม่แบบ)
  khon-history/      ประวัติโขน (แนวนอน การ์ตูนเล่าเรื่อง ภาพจิตรกรรมไทย)
  khon-time-travel/  ท่องกาลเวลา: วิวัฒนาการโขน
  lakhon-thai-9/     ละครไทย 9 แบบ
  natasin-4-phak/    นาฏศิลป์ 4 ภาค (แนวตั้ง)
```

## ขั้นตอนทำเรื่องใหม่ (ถ้าจะรันเองบน Mac)
ติดตั้งครั้งเดียว:
```
brew install ffmpeg node python
pip3 install numpy pillow opencv-python
npm install playwright && npx playwright install chromium
```
ในโฟลเดอร์โปรเจกต์ใหม่ (คัดลอกจาก `projects/khon-history` แล้วแก้):
```
in/narr.mp3 + in/script.txt                     # เสียงบรรยาย + สคริป
raw/*.jpg                                        # รูปจาก Google Flow (ชื่อไฟล์ตามพร้อมต์)
ffmpeg -i in/narr.mp3 -ac 1 -ar 48000 in/narr.wav
ffmpeg -i in/narr.wav -af silencedetect=n=-38dB:d=0.18 -f null - 2>&1 | grep -o 'silence_\(start\|end\): [0-9.]*' | paste - - | awk '{print $2, $4}' > in/sil.txt
python3 ../../engine/stick.py <ชื่อรูปไม่ต้องมีนามสกุล ...>    # ตัดรูป -> assets/
python3 timing.py                                # แบ่งช่วง + ซับ (แก้ CUTS และ TOTAL ให้ตรงสคริป)
../../engine/make_index.sh                       # สร้างหน้าเว็บ
node render.mjs sheet 5,30,60 check.jpg          # ดูภาพตัวอย่าง
node render.mjs events sfx.json && python3 audio.py   # ดนตรี + เอฟเฟกต์ -> out/mix.wav
node render.mjs frames 0 <จำนวนเฟรม> 0 1          # เฟรม 24fps -> out/frames
ffmpeg -framerate 24 -i out/frames/f%05d.jpg -i out/mix.wav -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -c:a aac -shortest out/video.mp4
```
ในฉากแต่ละเรื่อง (`site/story.js`) จังหวะภาพผูกกับคำในสคริปผ่าน `K('ชื่อช่วง','คำ')`
ตัวอย่างเช่น `K('tale','ดำดิ่ง')` คือเวลาที่ผู้บรรยายพูดคำนั้น
