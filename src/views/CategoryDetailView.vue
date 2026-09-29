<script setup lang="ts">
/**
 * 分区详情：展示该分区下的帖子列表。
 */
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PostListItem from '@/components/PostListItem.vue'
import AppIcon from '@/components/AppIcon.vue'
import { feedSortOptions, usePostFeed } from '@/composables/usePostFeed'
import { fetchCategoryById } from '@/services/categoryService'
import type { Category } from '@/types'

const route = useRoute()
const router = useRouter()

const categoryId = computed(() => String(route.params.id))
const category = ref<Category | null>(null)
const categoryLoading = ref(true)

const {
  loading,
  posts,
  total,
  page,
  pageSize,
  sort,
  userMap,
  categoryMap,
  onPageChange,
} = usePostFeed({ categoryId })

async function loadCategory() {
  categoryLoading.value = true
  try {
    category.value = await fetchCategoryById(categoryId.value)
  } finally {
    categoryLoading.value = false
  }
}

watch(
  categoryId,
  () => {
    void loadCategory()
  },
  { immediate: true },
)

watch(category, (item) => {
  if (item) {
    document.title = `${item.name} · PICKCAT 社区`
  }
})

function goBack() {
  router.push({ name: 'categories' })
}
</script>

<template>
  <section class="stack-md">
    <header class="stack-sm">
      <Button
        label="返回分区"
        text
        size="small"
        class="back-btn"
        @click="goBack"
      >
        <template #icon="{ class: iconClass }">
          <AppIcon name="reply" :class="iconClass" :size="16" />
        </template>
      </Button>

      <div v-if="categoryLoading" class="stack-sm">
        <Skeleton width="40%" height="1.75rem" />
        <Skeleton width="70%" height="1rem" />
      </div>

      <Message
        v-else-if="!category"
        severity="warn"
        :closable="false"
      >
        分区不存在或已移除。
      </Message>

      <div v-else class="category-header">
        <span class="category-header-icon" aria-hidden="true">
          <AppIcon :name="category.icon" :size="26" />
        </span>
        <div class="stack-sm">
          <h1 class="category-header-title">{{ category.name }}</h1>
          <p class="muted">{{ category.description }}</p>
        </div>
      </div>
    </header>

    <template v-if="category">
      <SelectButton
        v-model="sort"
        :options="feedSortOptions"
        option-label="label"
        option-value="value"
        :allow-empty="false"
      />

      <div v-if="loading" class="post-list">
        <Card v-for="n in 3" :key="n">
          <template #title><Skeleton width="60%" height="1.5rem" /></template>
          <template #content>
            <div class="stack-sm">
              <Skeleton width="100%" height="1rem" />
              <Skeleton width="80%" height="1rem" />
            </div>
          </template>
        </Card>
      </div>

      <Message
        v-else-if="posts.length === 0"
        severity="secondary"
        :closable="false"
      >
        该分区暂无帖子。
      </Message>

      <template v-else>
        <div class="post-list">
          <PostListItem
            v-for="post in posts"
            :key="post.id"
            :post="post"
            :author="userMap.get(post.authorId)"
            :category="categoryMap.get(post.categoryId)"
          />
        </div>

        <Paginator
          :rows="pageSize"
          :total-records="total"
          :first="(page - 1) * pageSize"
          :rows-per-page-options="[5, 10]"
          @page="onPageChange"
        />
      </template>
    </template>
  </section>
</template>

<style scoped>
.back-btn {
  align-self: flex-start;
  padding-inline: 0;
}

.category-header {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
}

.category-header-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--p-content-border-radius);
  background: color-mix(in srgb, var(--p-primary-color) 12%, transparent);
  color: var(--p-primary-color);
}

.category-header-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
}
</style>
