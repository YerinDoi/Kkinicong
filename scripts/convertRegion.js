import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, "../행정동좌표.xlsx");
const regionJsonPath = path.join(__dirname, "../src/data/regionData.json");

try {

  //엑셀 파일 로드
  const workbook = xlsx.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  // 기존 JSON 불러오기
  const regionData = JSON.parse(fs.readFileSync(regionJsonPath, "utf-8"));

  // 새로운 지역 데이터 누적용 객체
  const newRegionData = {};

  rows.forEach((row) => {
    const city = row["sd_nm"];
    const district = row["sgg_nm"];
    const dong = row["emd_nm"];
    const lat = parseFloat(row["center_lati"]);
    const lng = parseFloat(row["center_long"]);

    // 서울, 부산만 처리
    if (!["서울특별시", "부산광역시"].includes(city)) return;

    if (!district || !dong || isNaN(lat) || isNaN(lng)) return;

    // 구조 생성
    if (!newRegionData[city]) newRegionData[city] = {};
    if (!newRegionData[city][district]) newRegionData[city][district] = [];

    newRegionData[city][district].push({ name: dong, lat, lng });
  });

  // 기존 JSON에 병합
  for (const city of Object.keys(newRegionData)) {
    regionData[city] = newRegionData[city];
  }

  // 저장
  fs.writeFileSync(regionJsonPath, JSON.stringify(regionData, null, 2), "utf-8");

  console.log("완료");
} catch (err) {
  console.error(" 변환 오류:", err.message);
}
