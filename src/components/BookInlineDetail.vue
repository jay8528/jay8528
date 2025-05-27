 <!-- front\src\components\BookInlineDetail.vue -->
<template>
  <div class="flex flex-col items-center text-center">
    <button
      @click="$emit('back')"
      class="self-start mb-3 text-pink-400"
    >⟵ 뒤로</button>

    <img :src="book.cover_large || book.cover_small" class="w-40 rounded" />
    <h3 class="mt-2 font-bold text-lg">{{ book.title }}</h3>
    <p class="text-sm text-gray-400">{{ book.authors }}</p>

    <!-- 줄여서 5줄 미리보기 -->
    <p
      v-if="book.description"
      class="mt-3 text-sm leading-relaxed line-clamp-5 whitespace-pre-line"
    >{{ book.description }}</p>

    <!-- 액션 -->
    <div class="flex gap-4 mt-5">
      <router-link
        :to="{ name:'BookDetail', params:{ isbn: book.isbn13 }}"
        class="text-pink-400 underline"
      >자세히</router-link>

      <button
        @click="$emit('select', book)"
        class="bg-pink-600 px-4 py-2 rounded"
      >이 책 선택</button>
    </div>
  </div>
</template>

<script setup>
defineProps({ book: Object })
defineEmits(['select', 'back'])
</script>
