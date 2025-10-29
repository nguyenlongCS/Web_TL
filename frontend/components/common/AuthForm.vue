<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2 style="color: #e63946; margin-bottom: 30px;">{{ title }}</h2>
      <form @submit.prevent="$emit('submit')">
        <slot></slot>
        <button type="submit" class="btn-submit">{{ submitText }}</button>
      </form>
      <p class="auth-switch">
        {{ switchText }}
        <router-link :to="switchLink">{{ switchLinkText }}</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  submitText: String,
  switchText: String,
  switchLink: String,
  switchLinkText: String
})

defineEmits(['submit'])
</script>

<style>
/* Bỏ scoped để CSS áp dụng cho slot content */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.auth-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #1D3557;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #e63946;
}

.btn-submit {
  width: 100%;
  background: #e63946;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.3s;
  margin-top: 10px;
}

.btn-submit:hover {
  background: #d00000;
}

.auth-switch {
  text-align: center;
  margin-top: 20px;
  color: #6b7280;
  font-size: 14px;
}

.auth-switch a {
  color: #e63946;
  font-weight: 500;
}

.auth-switch a:hover {
  text-decoration: underline;
}
</style>