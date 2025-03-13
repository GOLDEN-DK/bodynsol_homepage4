/**
 * 날짜 문자열을 포맷팅하는 함수
 * @param dateString ISO 형식의 날짜 문자열
 * @returns 포맷팅된 날짜 문자열 (YYYY-MM-DD)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    return "날짜 없음";
  }

  // 날짜를 YYYY-MM-DD 형식으로 포맷팅
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * 숫자에 천 단위 구분자를 추가하는 함수
 * @param num 포맷팅할 숫자
 * @returns 천 단위 구분자가 추가된 문자열
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR");
}

/**
 * 가격을 포맷팅하는 함수
 * @param price 가격
 * @param currency 통화 기호 (기본값: '₩')
 * @returns 포맷팅된 가격 문자열
 */
export function formatPrice(
  price: number | null | undefined,
  currency: string = "₩"
): string {
  if (price === null || price === undefined) {
    return "문의 요망";
  }

  return `${currency} ${formatNumber(price)}`;
}

/**
 * 문자열을 주어진 길이로 자르는 함수
 * @param text 원본 문자열
 * @param maxLength 최대 길이
 * @param suffix 접미사 (기본값: '...')
 * @returns 잘린 문자열
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + suffix;
}

/**
 * 슬러그를 생성하는 함수
 * @param text 원본 문자열
 * @returns 슬러그 문자열
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
