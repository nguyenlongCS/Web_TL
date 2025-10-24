<template>
  <section class="page-section">
    <div class="container">
      <h2>Liên hệ</h2>
      
      <div class="contact-container">
        <div class="map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4609544062434!2d106.68427161420098!3d10.775061061969923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9a4b7d5%3A0x4b2f68cfab6e4fb!2zVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2s!4v1697000000000"
            width="100%" 
            height="100%" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy"
          ></iframe>
        </div>

        <form class="contact-form" @submit.prevent="handleSubmit">
          <h3 style="color: #e63946; margin-bottom: 20px;">Gửi thông tin liên hệ</h3>
          <input 
            v-model="formData.name"
            type="text" 
            placeholder="Họ tên *" 
            required
          >
          <input 
            v-model="formData.email"
            type="email" 
            placeholder="Email *" 
            required
          >
          <input 
            v-model="formData.phone"
            type="tel" 
            placeholder="Số điện thoại *" 
            required
          >
          <input 
            v-model="formData.subject"
            type="text" 
            placeholder="Chủ đề"
          >
          <textarea 
            v-model="formData.message"
            placeholder="Nội dung tin nhắn *" 
            required 
            rows="5"
          ></textarea>
          <button type="submit">Gửi tin nhắn</button>
          <p style="font-size: 12px; color: #6b7280; margin-top: 10px; text-align: center;">
            (* Thông tin bắt buộc)
          </p>
        </form>
      </div>

      <div class="contact-info-grid">
        <div class="info-card">
          <h3>Địa chỉ showroom</h3>
          <p>
            123 Nguyễn Văn Cừ, Quận 1<br>
            TP. Hồ Chí Minh, Việt Nam<br>
            <strong>Giờ mở cửa:</strong><br>
            Thứ 2 - Chủ nhật: 8:00 - 20:00
          </p>
        </div>

        <div class="info-card">
          <h3>Thông tin liên hệ</h3>
          <p>
            <strong>Hotline:</strong> 0999 999 999<br>
            <strong>Email:</strong> thanhluan@gmail.com<br>
            <strong>Website:</strong> www.amthanh.vn<br>
            <strong>Zalo:</strong> 0999 999 999
          </p>
        </div>

        <div class="info-card">
          <h3>Dịch vụ khách hàng</h3>
          <p>
            <strong>Tư vấn miễn phí:</strong> 24/7<br>
            <strong>Bảo hành:</strong> 12-36 tháng<br>
            <strong>Lắp đặt tận nơi:</strong> TP.HCM & lân cận<br>
            <strong>Hỗ trợ kỹ thuật:</strong> Trọn đời
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const handleSubmit = () => {
  alert('Form đã gửi (mock)')
  formData.value = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  }
}
</script>

<style scoped>
.contact-container {
    display: flex;
    gap: 30px;
    align-items: flex-start;
}

.map {
    flex: 1;
    height: 400px;
    border-radius: 8px;
    overflow: hidden;
}

.contact-form {
    flex: 1;
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.contact-form input, 
.contact-form textarea {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    font-size: 14px;
}

.contact-form textarea {
    resize: vertical;
    min-height: 100px;
}

.contact-form button {
    background: #e63946;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    width: 100%;
    font-size: 16px;
    transition: background 0.3s;
}

.contact-form button:hover {
    background: #d00000;
}

.contact-info-grid {
    margin-top: 50px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.info-card {
    text-align: center;
    padding: 30px;
    background: #f8f9fa;
    border-radius: 8px;
}

.info-card h3 {
    color: #e63946;
    margin-bottom: 15px;
}

.info-card p {
    color: #6b7280;
    line-height: 1.6;
}
</style>