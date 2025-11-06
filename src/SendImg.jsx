// SendImg.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";
import styles from "./SendImg.module.css"
import SendButton from "./img/send_button.png"

export default function SendImg() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedImage = location.state?.image || "";

  const [imageBase64, setImageBase64] = useState(passedImage);
  const [toName, setToName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (key) {
      emailjs.init(key);
    } else {
      console.warn("VITE_EMAILJS_PUBLIC_KEY is not set. EmailJS init skipped.");
    }
  }, []);

  // 이미지 dataURL을 받아서 캔버스에 그려 리사이즈+압축한 base64 반환
  const compressDataUrl = async (dataUrl, maxSize = 800, targetKB = 40) => {
	return new Promise((resolve, reject) => {
		if (!dataUrl) return resolve("");

		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
		console.log("압축 시작");
		let width = img.width;
		let height = img.height;

		// 크기 조정
		if (width > height) {
			if (width > maxSize) {
			height = Math.round((height * maxSize) / width);
			width = maxSize;
			}
		} else {
			if (height > maxSize) {
			width = Math.round((width * maxSize) / height);
			height = maxSize;
			}
		}

		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, width, height);

		let quality = 0.9;
		let base64 = canvas.toDataURL("image/jpeg", quality);

		// 50KB 이하 될 때까지 압축 반복
		while (base64.length / 1024 > targetKB && quality > 0.1) {
			quality -= 0.05;
			base64 = canvas.toDataURL("image/jpeg", quality);
		}

		resolve(base64);
		};
		img.onerror = (err) => reject(err);
		img.src = dataUrl;
	});
	};


  // passedImage를 압축해서 EmailJS로 전송
  const handleSubmit = async (e) => {
	e.preventDefault();
	if (!passedImage) {
		alert("보낼 이미지가 없습니다.");
		return;
	}
	setBusy(true);

	try {
		// 압축이 완료될 때까지 기다림 (await 꼭 붙여야 함)
		console.log("🌀 이미지 압축 중...");
		const compressed = await compressDataUrl(passedImage, 800, 40); // 40KB 목표
		const finalBase64 = compressed || passedImage;
		console.log(
		`✅ 압축 완료 (${(finalBase64.length / 1024).toFixed(1)}KB)`
		);

		await emailjs.send(
		"service_5t7jk0r",
		"template_i0w95xf",
		{
			from_name: "animalcrossing-photo",
			to_name: toName,
			to_email: toEmail,
			time: new Date().toLocaleString("ko-KR"),
			image_base64: finalBase64,
			subject: `New photo from animalcrossing-photo`,
		}
		);

		alert("✅ 이메일 전송 완료!");
		navigate("/gallery");
		} catch (err) {
			console.error("전송 실패:", err);
			console.error("🔍 상세 오류 코드:", err.status, err.text);
			alert(`❌ 이메일 전송 실패 (${err.status || "no status"})`);
		} finally {
			setBusy(false);
		}
	};


  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>사진 보내기</h2>
        {imageBase64 && (
          <img src={imageBase64} alt="preview" className={styles.imgPreview} />
        )}
        <input
          type="text"
          placeholder="받는 사람 이름"
          value={toName}
          onChange={(e) => setToName(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="email"
          placeholder="받는 사람 이메일"
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          <img src={SendButton} alt="이메일 보내기 버튼 사진" />
        </button>
      </form>
    </div>
  );
}
