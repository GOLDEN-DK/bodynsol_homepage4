import nodemailer from "nodemailer";

// 이메일 설정
const SMTP_CONFIG = {
  host: 'mail.kmamail.or.kr',
  port: 25,
  secure: false,
  auth: {
    user: 'kmaadmin@kmamail.or.kr',
    pass: 'kmakoreano1!'
  }
};

// 수신자 이메일
const RECEIVER_EMAIL = 'ourangel72@gmail.com';

// 이메일 트랜스포터 생성
const transporter = nodemailer.createTransport(SMTP_CONFIG);

interface ApplicationEmailData {
  courseTitle: string;
  scheduleDate: string;
  scheduleTime: string;
  koreanName: string;
  englishName?: string;
  email: string;
  phone: string;
  gender: string;
  age: string;
  occupation: string;
  region: string;
  pilatesExperience: string;
  question?: string;
  paymentMethod: string;
  price?: number | null;
}

export async function sendApplicationEmail(data: ApplicationEmailData) {
  try {
    // 성별 한글 변환
    const genderText = data.gender === 'male' ? '남성' : '여성';
    
    // 결제 방법 한글 변환
    const paymentMethodText = {
      'onsite': '현장결제',
      'card': '카드결제',
      'transfer': '계좌이체'
    }[data.paymentMethod] || data.paymentMethod;

    // 이메일 HTML 내용
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Malgun Gothic', sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; }
          th { background-color: #f8f9fa; text-align: left; padding: 10px; border: 1px solid #dee2e6; width: 30%; }
          td { padding: 10px; border: 1px solid #dee2e6; }
          .footer { margin-top: 20px; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>체험 신청 접수 알림</h2>
            <p>새로운 체험 신청이 접수되었습니다.</p>
          </div>
          
          <div class="content">
            <h3>과정 정보</h3>
            <table>
              <tr>
                <th>과정명</th>
                <td>${data.courseTitle}</td>
              </tr>
              <tr>
                <th>일정</th>
                <td>${data.scheduleDate} ${data.scheduleTime}</td>
              </tr>
              ${data.price ? `
              <tr>
                <th>가격</th>
                <td>${data.price.toLocaleString('ko-KR')}원</td>
              </tr>
              ` : ''}
            </table>
            
            <h3 style="margin-top: 30px;">신청자 정보</h3>
            <table>
              <tr>
                <th>이름 (한글)</th>
                <td>${data.koreanName}</td>
              </tr>
              ${data.englishName ? `
              <tr>
                <th>이름 (영문)</th>
                <td>${data.englishName}</td>
              </tr>
              ` : ''}
              <tr>
                <th>이메일</th>
                <td>${data.email}</td>
              </tr>
              <tr>
                <th>전화번호</th>
                <td>${data.phone}</td>
              </tr>
              <tr>
                <th>성별</th>
                <td>${genderText}</td>
              </tr>
              <tr>
                <th>나이</th>
                <td>${data.age}</td>
              </tr>
              <tr>
                <th>직업/소속</th>
                <td>${data.occupation}</td>
              </tr>
              <tr>
                <th>거주지역</th>
                <td>${data.region}</td>
              </tr>
              <tr>
                <th>필라테스 경험</th>
                <td>${data.pilatesExperience}</td>
              </tr>
              <tr>
                <th>결제 방법</th>
                <td>${paymentMethodText}</td>
              </tr>
              ${data.question ? `
              <tr>
                <th>질문사항</th>
                <td>${data.question}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div class="footer">
            <p>이 메일은 Body & Soul 체험 신청 시스템에서 자동으로 발송되었습니다.</p>
            <p>신청 일시: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 이메일 옵션
    const mailOptions = {
      from: `"Body & Soul 체험신청" <${SMTP_CONFIG.auth.user}>`,
      to: RECEIVER_EMAIL,
      subject: `[체험신청] ${data.koreanName}님 - ${data.courseTitle}`,
      html: htmlContent
    };

    // 이메일 발송
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error };
  }
}