# Quán Phở Góc Phố

Game nấu ăn góc nhìn thứ nhất chạy trên trình duyệt. Bạn đứng sau quầy, làm đúng món khách gọi rồi phục vụ thật nhanh. Game chơi được trên cả điện thoại (cảm ứng) lẫn PC (chuột và bàn phím).

- 60 màn, chia thành 6 món. Cứ 10 màn mở khóa một món mới: **Phở bò → Gỏi cuốn → Bún thang → Bún chả → Cơm tấm → Bún bò Huế**
- Nhiều khách cùng lúc (2–4 chỗ). Khách gọi món chính, đồ uống, hoặc cả hai
- 6 loại đồ uống: trà đá, nhân trần, nước vối, coca, nước chanh, sữa đậu nành
- Mỗi màn 90 giây. Đạt mục tiêu doanh thu để qua màn, được 1–3 sao
- Độ khó tăng dần theo từng màn và từng món
- Không cần thư viện hay file ảnh, âm thanh nào: hình vẽ bằng Canvas 2D, âm thanh tạo bằng Web Audio

## Chạy game

Mở trực tiếp file `index.html` bằng trình duyệt là chơi được, không cần cài gì.

Nếu muốn chạy qua server cục bộ (ví dụ để thử trên điện thoại cùng mạng Wi-Fi):

```bash
python3 -m http.server 8000
# rồi mở http://localhost:8000 (hoặc http://<IP-máy-tính>:8000 trên điện thoại)
```

Muốn đưa lên mạng thì bật **GitHub Pages** cho repo: Settings → Pages → chọn nhánh `main` và thư mục `/ (root)`.

## Điều khiển

| Hành động | Điện thoại | PC |
|---|---|---|
| Thêm nguyên liệu | Chạm khay | Phím `1`–`0` hoặc click |
| Lấy đồ uống | Chạm khay nước | Phím `A` `S` `D` `F` `G` `H` |
| Tự giao đúng khách | Nút **PHỤC VỤ** | `Enter` / `Space` |
| Giao cho một khách cụ thể | Chạm vào khách | `Q` `W` `E` `R` |
| Đổ bát / bỏ ly | Nút **ĐỔ BỎ** / chạm ly đang cầm | `X` / click ly |
| Tạm dừng | Nút ⏸ | `P` hoặc `Esc` |

## Cấu trúc thư mục

```
index.html        Trang chính, nạp CSS và các file JS theo thứ tự
css/style.css     Tắt zoom, cuộn, bôi đen chữ… để chạm nhanh như app
js/core.js        Canvas, hàm tiện ích (clamp, easing, random có seed, vẽ hình cơ bản)
js/shapes.js      Các "kiểu hình" vẽ nguyên liệu: sợi, lát, viên, lá, vòng, rưới sốt…
js/dishes.js      Dữ liệu 6 món ăn (CHAPTERS) và nguyên liệu của từng món
js/drinks.js      Dữ liệu và hình vẽ đồ uống
js/audio.js       Hiệu ứng âm thanh bằng Web Audio và rung
js/state.js       Cấu hình độ khó theo màn (levelCfg), sao đã đạt, trạng thái game
js/layout.js      Bố cục màn hình ngang/dọc, vị trí khay và chỗ ngồi
js/game.js        Luật chơi: sinh khách, thêm món, phục vụ, tính tiền, kết thúc màn
js/input.js       Xử lý chạm/chuột/bàn phím (pointerdown + hàng đợi input)
js/render.js      Vẽ cảnh, khách, phiếu gọi món, khay, thanh trên cùng, các màn hình phủ
js/main.js        Vòng lặp game (requestAnimationFrame)
```

Các file JS là script thường (không phải ES module) và dùng chung phạm vi toàn cục, nên **thứ tự `<script>` trong `index.html` phải giữ nguyên**.

## Thêm món mới

Mở `js/dishes.js` và thêm một khối vào mảng `CHAPTERS`. Món mới sẽ tự thành chương tiếp theo (10 màn) và tự hiện trong màn hình chọn màn.

```js
{ id: 'banhxeo', name: 'Bánh xèo', short: 'bánh xèo', container: 'plate', price: 35000,
  mainsMin: 1, mainsMax: 2,
  desc: 'Mô tả ngắn hiện ở bảng giới thiệu món.',
  base: [...],   // nguyên liệu bắt buộc
  mains: [...],  // món chính, chọn ngẫu nhiên từ mainsMin đến mainsMax
  opt: [...],    // topping tùy chọn
  ing: [         // đúng 10 nguyên liệu, theo thứ tự base → mains → opt
    I('vo', 'Vỏ bánh', 0, 'paper', ['#f4c542', 'rgba(200,140,40,.3)'], [1, 1], [0, 0, 1]),
    I('tom', 'Tôm', 2, 'shrimp', ['#f4845f', '#ffe0d0'], [4, 3], [0, -.3, .3]),
    // ...
  ] },
```

Tham số của `I(id, tên, lớp vẽ, kiểu hình, màu, [số miếng trong bát, số miếng ở khay], [vị trí u, v, độ rải], thêm)`:

- **lớp vẽ**: số nhỏ vẽ trước (nằm dưới), ví dụ nước dùng là 0, topping là 4–6
- **kiểu hình**: một trong các key của `SH` trong `js/shapes.js`: `fill`, `paper`, `rice`, `strands`, `shreds`, `slices`, `balls`, `rings`, `chili`, `leaves`, `sprouts`, `wedge`, `shrimp`, `dots`, `dollop`, `patty`, `sticks`, `caps`, `egg`, `rib`, `cubes`, `discs`, `drizzle`
- **vị trí**: `u`, `v` trong khoảng -1..1 tính từ tâm bát, độ rải càng lớn thì miếng càng tản ra
- **thêm**: `{ size: 1.2 }` để phóng to miếng, `{ steam: 1 }` để bát bốc khói, `{ len: 2 }` cho sợi dài hơn

## Chỉnh độ khó

Toàn bộ độ khó nằm trong hàm `levelCfg(lv)` ở `js/state.js`:

| Thuộc tính | Ý nghĩa |
|---|---|
| `seats` | Số chỗ ngồi (2 → 3 → 4) |
| `target` | Mục tiêu doanh thu của màn |
| `optMax`, `mainsMax` | Số topping và món chính tối đa mỗi phiếu |
| `drinks` | Số loại nước đã mở khóa |
| `drinkP` | Tỉ lệ khách gọi nước |
| `patience` | Hệ số kiên nhẫn của khách (nhỏ hơn = khó hơn) |
| `gap` | Thời gian nghỉ giữa hai lượt khách |

Thời gian mỗi màn là hằng số `LEVEL_TIME` (mặc định 90 giây).

## Lưu tiến độ

Số sao của từng màn được lưu trong `localStorage` (khóa `pho_stars`) của trình duyệt. Muốn chơi lại từ đầu thì xóa dữ liệu trang hoặc chạy `localStorage.removeItem('pho_stars')` trong console.
