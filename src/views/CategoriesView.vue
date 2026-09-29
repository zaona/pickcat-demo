<script setup lang="ts">
/**
 * 分区列表：展示全部社区分区卡片，点击进入对应分区。
 */
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppIcon from '@/components/AppIcon.vue'
import { fetchCategories } from '@/services/categoryService'
import { fetchPosts } from '@/services/postService'
import type { Category } from '@/types'

const router = useRouter()

const loading = ref(true)
const categories = ref<Category[]>([])
const postCountByCategory = ref<Record<string, number>>({})

async function load() {
  loading.value = true
  try {
    const list = await fetchCategories()
    categories.value = list
    const counts = await Promise.all(
      list.map(async (category) => {
        const result = await fetchPosts({
          categoryId: category.id,
          page: 1,
          pageSize: 1,
        })
        return [category.id, result.total] as const
      }),
    )
    postCountByCategory.value = Object.fromEntries(counts)
  } finally {
    loading.value = false
  }
}

function openCategory(category: Category) {
  router.push({ name: 'category', params: { id: category.id } })
}

onMounted(() => {
  void load()
})
</script>

<template>
  <section class="stack-md">
    <header class="page-title">
      <h1>分区</h1>
    </header>

    <div v-if="loading" class="category-card-grid">
      <Card v-for="n in 4" :key="n">
        <template #content>
          <div class="stack-sm">
            <Skeleton width="40%" height="1.5rem" />
            <Skeleton width="100%" height="1rem" />
            <Skeleton width="70%" height="1rem" />
          </div>
        </template>
      </Card>
    </div>

    <Message
      v-else-if="categories.length === 0"
      severity="secondary"
      :closable="false"
    >
      暂无分区。
    </Message>

    <div v-else class="category-card-grid">
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        class="category-card"
        @click="openCategory(category)"
      >
        <span class="category-card-icon" aria-hidden="true">
          <AppIcon :name="category.icon" :size="28" />
        </span>
        <span class="category-card-body">
          <span class="category-card-title">{{ category.name }}</span>
          <span class="category-card-desc muted">{{ category.description }}</span>
          <span class="category-card-meta muted">
            {{ postCountByCategory[category.id] ?? 0 }} 帖
          </span>
        </span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.category-card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gap-card);
}

@media (min-width: 640px) {
  .category-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.category-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  margin: 0;
  padding: 1.1rem 1.15rem;
  border: 1px solid var(--p-content-border-color);
  border-radius: var(--p-content-border-radius);
  background: var(--p-content-background);
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.category-card:hover {
  border-color: color-mix(in srgb, var(--p-primary-color) 45%, var(--p-content-border-color));
  background: color-mix(in srgb, var(--p-primary-color) 6%, var(--p-content-background));
}

.category-card:focus-visible {
  outline: 2px solid var(--p-primary-color);
  outline-offset: 2px;
}

.category-card-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: var(--p-content-border-radius);
  background: color-mix(in srgb, var(--p-primary-color) 12%, transparent);
  color: var(--p-primary-color);
}

.category-card-body {
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 0.35rem;
}

.category-card-title {
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.3;
}

.category-card-desc {
  font-size: 0.9rem;
  line-height: 1.45;
}

.category-card-meta {
  font-size: 0.8rem;
}
</style>
