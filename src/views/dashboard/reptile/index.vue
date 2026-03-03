<!-- 爬虫新闻页面 -->
<template>
  <div class="reptile-page">
    <ElCard class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">爬虫新闻</span>
          <ElButton @click="handleRefresh" :loading="loading" type="primary" size="small">
            <template #icon>
              <i class="ri:refresh-line"></i>
            </template>
            刷新
          </ElButton>
        </div>
      </template>

      <div class="empty-state" v-if="!loading && newsList.length === 0">
        <ElEmpty description="暂无数据" />
      </div>

      <div class="news-grid" v-else v-loading="loading" element-loading-text="加载中...">
        <div class="news-card" v-for="item in newsList" :key="item.id">
          <div class="news-header">
            <h3 class="news-title">{{ item.title }}</h3>
          </div>

          <div class="news-meta">
            <ElTag type="success" size="small">{{ item.category }}</ElTag>
            <span class="source">{{ item.source }}</span>
            <span class="date" v-if="item.pub_date">{{ formatDate(item.pub_date) }}</span>
          </div>

          <div class="news-summary" v-if="item.summary">
            <p>{{ truncateText(item.summary, 100) }}</p>
          </div>

          <div class="news-footer">
            <a v-if="item.original_url" :href="item.original_url" target="_blank" class="read-more">
              查看原文 <i class="ri:external-link-line"></i>
            </a>
            <span v-else class="read-more-disabled">暂无原文链接</span>
          </div>
        </div>
      </div>

      <div class="pagination" v-if="totalNews > 0">
        <span>共 {{ totalNews }} 条新闻</span>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { fetchGetNewsList } from '@/api/reptile'

  defineOptions({ name: 'Reptile' })

  const loading = ref(false)
  const newsList = ref<Api.Reptile.NewsListItem[]>([])
  const totalNews = ref(0)

  // 分页参数
  const pageParams = reactive({
    limit: 100,
    offset: 0
  })

  // 获取新闻列表
  const getNewsList = async (params?: Api.Reptile.NewsListParams) => {
    loading.value = true
    try {
      const response = await fetchGetNewsList(params || pageParams)
      newsList.value = response.items || []
      totalNews.value = response.total || 0
    } catch (error) {
      const message = error instanceof Error ? error.message : '获取新闻列表失败'
      console.error(message, error)
      ElMessage.error(message)
      newsList.value = []
      totalNews.value = 0
    } finally {
      loading.value = false
    }
  }

  // 刷新数据
  const handleRefresh = () => {
    getNewsList(pageParams)
  }

  // 格式化日期
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('zh-CN')
    } catch {
      return dateStr
    }
  }

  // 截断文本
  const truncateText = (text: string, length: number) => {
    if (!text) return ''
    return text.length > length ? text.substring(0, length) + '...' : text
  }

  onMounted(() => {
    getNewsList(pageParams)
  })
</script>

<style scoped lang="scss">
  .reptile-page {
    padding: 0;

    .box-card {
      :deep(.el-card__header) {
        padding: 20px;
      }

      :deep(.el-card__body) {
        padding: 20px;
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-size: 18px;
        font-weight: 600;
        color: var(--art-gray-900);
      }
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }

    .news-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
      min-height: 400px;
      margin-bottom: 20px;
    }

    .news-card {
      display: flex;
      flex-direction: column;
      padding: 16px;
      background: var(--default-box-color);
      border: 1px solid var(--el-border-color);
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--el-color-primary-light-5);
        box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
      }

      .news-header {
        margin-bottom: 12px;

        .news-title {
          display: -webkit-box;
          margin: 0;
          overflow: hidden;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.5;
          color: var(--art-gray-900);
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;

          &:hover {
            color: var(--el-color-primary);
          }
        }
      }

      .news-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        margin-bottom: 12px;
        font-size: 12px;
        color: var(--art-gray-600);

        .source {
          padding: 2px 8px;
          background: var(--el-bg-color);
          border-radius: 4px;
        }

        .date {
          padding: 2px 8px;
          background: var(--el-bg-color);
          border-radius: 4px;
        }
      }

      .news-summary {
        flex: 1;
        margin-bottom: 12px;

        p {
          display: -webkit-box;
          margin: 0;
          overflow: hidden;
          font-size: 13px;
          line-height: 1.6;
          color: var(--art-gray-700);
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }

      .news-footer {
        padding-top: 12px;
        border-top: 1px solid var(--el-border-color);

        .read-more {
          display: inline-flex;
          gap: 4px;
          align-items: center;
          font-size: 13px;
          color: var(--el-color-primary);
          text-decoration: none;
          transition: color 0.2s;

          &:hover {
            color: var(--el-color-primary-light-3);
          }

          i {
            font-size: 12px;
          }
        }

        .read-more-disabled {
          font-size: 13px;
          color: var(--art-gray-500);
        }
      }
    }

    .pagination {
      display: flex;
      justify-content: center;
      padding: 16px 0;
      font-size: 14px;
      color: var(--art-gray-600);
      border-top: 1px solid var(--el-border-color);
    }
  }
</style>
