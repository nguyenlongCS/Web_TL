<template>
  <footer>
    <div class="container">
      <div class="social-buttons">
        <a href="https://zalo.me/0911322018" target="_blank" class="social-link">
          <img src="@/assets/icons/zalo_logo.png" alt="Zalo" class="icon" />
          Zalo
        </a>
        <a href="#" class="social-link">
          <img src="@/assets/icons/facebook_logo.png" alt="Facebook" class="icon" />
          Facebook
        </a>
        <a href="#" class="social-link">
          <img src="@/assets/icons/messenger_logo.png" alt="Messenger" class="icon" />
          Messenger
        </a>
      </div>

      <div class="contact-info">
        Số điện thoại: 0999999999<br />
        Email: thanhluan@gmail.com
      </div>
    </div>
  </footer>
</template>

<style scoped>
.social-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: opacity 0.2s;
}

.icon {
  width: 24px;
  height: 24px;
}
</style>
