// src/stores/post.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/plugins/axios.js'

export const usePostStore = defineStore('post', () => {
  const list = ref([])

  async function fetchFeed() {
    const { data } = await axios.get('/api/posts/')
    list.value = data
  }

  // ▶ FormData 를 그대로 받아서 POST
  async function createPost(formData) {
    const { data } = await axios.post('/api/posts/', formData)
    list.value.unshift(data)
  }

  async function likePost(id) {
    await axios.post(`/api/posts/${id}/like/`)
  }

  async function unlikePost(id) {
    await axios.delete(`/api/posts/${id}/unlike/`)
  }

  async function deletePost(id) {
    await axios.delete(`/api/posts/${id}/`)
    list.value = list.value.filter(p => p.id !== id)
  }

  function clear() {
    list.value = []
  }

  return {
    list,
    fetchFeed,
    createPost,
    likePost,
    unlikePost,
    deletePost,
    clear
  }
})
