import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      <header className="about-header">
        <h1>Giới thiệu về chúng tôi</h1>
      </header>
      <section className="about-content">
        <h2>Câu chuyện của chúng tôi</h2>
        <p>
          Tại [Tên Công Ty], chúng tôi đam mê mang đến những sản phẩm chất lượng cao, tạo sự khác biệt trong cuộc sống của bạn. Được thành lập vào năm [Năm], hành trình của chúng tôi bắt đầu với sứ mệnh đơn giản: cung cấp những [sản phẩm/dịch vụ] xuất sắc đáp ứng nhu cầu và mong muốn của khách hàng.
        </p>
        <p>
          Đội ngũ tận tâm của chúng tôi làm việc không ngừng để đảm bảo rằng mọi sản phẩm chúng tôi cung cấp đều đạt tiêu chuẩn chất lượng cao nhất. Từ việc chọn lựa nguyên liệu tốt nhất đến việc áp dụng các biện pháp kiểm tra chất lượng nghiêm ngặt, chúng tôi cam kết sự xuất sắc trong mọi khía cạnh của công việc.
        </p>
        <h2>Sứ mệnh của chúng tôi</h2>
        <p>
          Sứ mệnh của chúng tôi là nâng cao trải nghiệm của bạn thông qua các giải pháp sáng tạo và dịch vụ khách hàng không thể nào tốt hơn. Chúng tôi tin tưởng vào việc xây dựng các mối quan hệ lâu dài với khách hàng bằng cách hiểu nhu cầu của họ và vượt qua sự mong đợi. Mỗi ngày, chúng tôi nỗ lực mang đến cho bạn những [sản phẩm/dịch vụ] tốt nhất và một trải nghiệm suôn sẻ từ đầu đến cuối.
        </p>
        <h2>Giá trị của chúng tôi</h2>
        <ul>
          <li><strong>Chân thành:</strong> Chúng tôi tiến hành công việc với sự trung thực và minh bạch, luôn đặt khách hàng lên hàng đầu.</li>
          <li><strong>Sáng tạo:</strong> Chúng tôi chấp nhận sự sáng tạo và cải tiến liên tục để mang lại các giải pháp tiên tiến.</li>
          <li><strong>Chất lượng:</strong> Chúng tôi cam kết duy trì các tiêu chuẩn cao nhất trong mọi việc chúng tôi làm.</li>
          <li><strong>Khách hàng:</strong> Chúng tôi lắng nghe khách hàng và điều chỉnh sản phẩm, dịch vụ của chúng tôi để đáp ứng nhu cầu của họ.</li>
        </ul>
        <h2>Liên hệ với chúng tôi</h2>
        <p>
          Chúng tôi rất vui được nghe từ bạn! Dù bạn có câu hỏi, phản hồi hay chỉ muốn chào hỏi, hãy liên hệ với chúng tôi qua <a href="mailto:info@yourcompany.com">dhbeeply183@dhb.com</a> hoặc theo dõi chúng tôi trên các kênh truyền thông xã hội.
        </p>
      </section>
     
    </div>
  );
};

export default About;
