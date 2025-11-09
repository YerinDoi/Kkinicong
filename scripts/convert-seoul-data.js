import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, "../행정동좌표.xlsx"); // 업로드된 파일명 그대로
const regionJsonPath = path.join(__dirname, "../src/data/regionData.json"); // 기존 JSON

try {
  console.log("📦 서울시 엑셀 → JSON 변환 중...");

  // 1️⃣ 엑셀 파일 로드
  const workbook = xlsx.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  // 2️⃣ 기존 JSON 불러오기
  const regionData = JSON.parse(fs.readFileSync(regionJsonPath, "utf-8"));

  // 3️⃣ 서울특별시 데이터 생성
  const seoulData = {};

  rows.forEach((row) => {
  const city = row["sd_nm"];
  const district = row["sgg_nm"];
  const dong = row["emd_nm"];
  const lat = parseFloat(row["center_lati"]);
  const lng = parseFloat(row["center_long"]);

  // ✅ 1. '서울특별시'만 처리
  if (city !== "서울특별시") return;

  // ✅ 2. 값 유효성 검사
  if (!district || !dong || isNaN(lat) || isNaN(lng)) return;

  // ✅ 3. seoulData에 누적
  if (!seoulData[district]) seoulData[district] = [];
  seoulData[district].push({ name: dong, lat, lng });
});


  // 4️⃣ 기존 regionData.json에 병합
  regionData["서울특별시"] = seoulData;

  // 5️⃣ 다시 저장
  fs.writeFileSync(regionJsonPath, JSON.stringify(regionData, null, 2), "utf-8");

  console.log("✅ 완료! regionData.json에 서울특별시 데이터가 추가되었습니다.");
} catch (err) {
  console.error("❌ 변환 오류:", err.message);
}
