사용자 교육과정 페이지를 구현하기 위해 다음의 요구사항을 바탕으로 최적화된 설계 및 개발 방법을 제안해주세요.

1. **교육과정 목록 표시**
   - 관리자 페이지에서 등록된 과정 목록을 썸네일 이미지와 과정명, 일정과 함께 표시
   - 기본적으로 일정이 지나지 않은 과정만 표시하고, 전체과정 옵션 선택 시 지난 과정도 포함하여 표시

2. **과정 상세 페이지**
   - 썸네일 클릭 시 과정 상세 소개 페이지로 이동
   - 상세 페이지에서는 과정의 세부 정보(과정 소개, 커리큘럼, 강사 소개, 비용, 일정 등)를 확인할 수 있도록 구성

3. **과정 신청 기능**
   - 과정 상세 소개 페이지에서 지난 일정을 제외한 현재 가능한 일정 선택 후 신청 가능
   - 신청 시 사용자로부터 다음 정보를 입력받음:
     - 이름(한글), 이름(영문), 전화번호, 이메일, 성별(남자, 여자), 나이, 직업(소속)
     - 거주지역(서울, 경기도, 세종, 대전, 대구, 청주, 부산, 기타)
     - 필라테스 운동기간(없음, 3개월, 6개월, 1년, 2년, 3년, 기타)
     - 질문사항 (옵션)
   - 신청 정보 입력 후 다음 단계에서 결제 방법 선택 및 신청 완료 처리 가능

4. **결제 연동**
   - 과정 정보와 비용을 명확하게 표시하고 결제 시스템과 연동하여 신청 완료 처리

5. **신청 내역 확인 기능**
   - 교육과정 메뉴 내에 '교육 신청 확인' 버튼을 배치
   - 이름, 이메일, 전화번호 입력 시 신청한 과정과 신청 상태 확인 가능

개발은 Next.js 프레임워크, Prisma ORM, Neon Postgres를 사용하여 진행되며, 관리자 페이지에서 관리되는 데이터를 기반으로 동적으로 프론트엔드 페이지를 구성합니다.

위의 내용을 토대로 명확하고 확장 가능한 사용자 교육과정 페이지를 설계하고 구현하는 방법을 구체적으로 제시해 주세요.

