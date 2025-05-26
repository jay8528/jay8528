// src/stores/follow.js
import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth.js'

export const useFollowStore = defineStore('follow', {
  state: () => ({
    followingIds: new Set(),
  }),
  actions: {
    async loadFollowingIds() {
      const auth = useAuthStore()
      if (!auth.user) return
      const res = await axios.get(`/api/auth/users/${auth.user.id}/following/`)
      this.followingIds = new Set(res.data.map(u => u.id))
    },

    async follow(userId) {
      await axios.post(`/api/auth/users/${userId}/follow/`)
      this.followingIds.add(userId)
      return true
    },

    async unfollow(userId) {
      await axios.delete(`/api/auth/users/${userId}/follow/`)
      this.followingIds.delete(userId)
      return false
    },
  }
})
