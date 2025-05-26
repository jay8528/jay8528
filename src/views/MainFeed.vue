<template>
  <div class="feed-wrapper" ref="feedWrapper">
    <div class="feed-inner" ref="feedInner">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        class="snap-card"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import axios from '@/plugins/axios'
import PostCard from '@/components/PostCard.vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const posts = ref([])
const feedWrapper = ref(null)
const feedInner   = ref(null)

onMounted(async () => {
  const { data } = await axios.get('/api/posts/')
  posts.value = data
  await nextTick()

  const wrapper = feedWrapper.value
  const inner   = feedInner.value
  const totalWidth = inner.scrollWidth
  const viewWidth  = window.innerWidth

  gsap.to(inner, {
    x: () => -(totalWidth - viewWidth),
    ease: 'none',
    force3D: true,
    scrollTrigger: {
      trigger: wrapper,
      start: 'top top',
      end: () => `+=${totalWidth - viewWidth}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      snap: {
        snapTo: (value) => {
          const sectionCount = posts.value.length
          const step = sectionCount > 1 ? 1 / (sectionCount - 1) : 1
          return Math.round(value / step) * step
        },
        duration: 0.1,
        ease: "power1.out"
      }
    }
  })
})
</script>

<style scoped>
.feed-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  transform: translateZ(0);
  will-change: transform;
}

.feed-inner {
  display: flex;
  flex-direction: row;
  width: max-content;
  gap: 24px;
  padding: 0 16px;
}

.snap-card {
  flex: 0 0 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
</style>