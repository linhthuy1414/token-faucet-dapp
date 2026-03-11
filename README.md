# Token Faucet DApp

Một dự án blockchain nhỏ mô phỏng ứng dụng faucet token trên mạng thử nghiệm.

## Chức năng hiện có

- Kết nối ví mô phỏng
- Nhận `10 TEST` cho mỗi lượt bấm
- Giới hạn thời gian chờ giữa các lần nhận
- Hiển thị số dư token hiện tại
- Lưu lịch sử nhận token trên trình duyệt
- Có smart contract faucet viết bằng Solidity

## Công nghệ sử dụng

- HTML
- CSS
- JavaScript
- Solidity

## Cấu trúc thư mục

```text
token-faucet-dapp/
├── contracts/
│   └── TestTokenFaucet.sol
├── index.html
├── style.css
├── script.js
└── README.md
```

## Cách chạy bản giao diện

1. Tải mã nguồn về máy
2. Mở file `index.html` bằng trình duyệt

## Hướng phát triển tiếp

- Kết nối MetaMask thật
- Dùng Ethers.js để gọi contract faucet
- Thêm phân biệt nhiều mạng thử nghiệm
- Hiển thị hash giao dịch thật
- Triển khai contract lên testnet

## Gợi ý trưng bày trên GitHub

Ông chủ nên mở demo, bấm nhận token vài lần, rồi chụp ảnh giao diện có lịch sử giao dịch để thêm vào README.
