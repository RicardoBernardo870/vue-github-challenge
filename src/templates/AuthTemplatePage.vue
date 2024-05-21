<template>
  <div class="container">
    <div class="form-input-container">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #f5f5f5;
    overflow: hidden;

    .form-input-container {
      width: 100%;
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
</style>
