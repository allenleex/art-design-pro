import axios from 'axios'

/** 爬虫 API 实例（用于访问外部接口） */
const reptileApiInstance = axios.create({
  baseURL: 'http://106.52.12.212:8000',
  timeout: 15000,
  validateStatus: (status) => status >= 200 && status < 300
})

/**
 * 获取爬虫新闻列表
 * @param params 分页参数 (limit: 每页条数, offset: 偏移量)
 * @returns 新闻列表响应
 */
export async function fetchGetNewsList(params?: Api.Reptile.NewsListParams) {
  try {
    const response = await reptileApiInstance.get<Api.Reptile.NewsResponse>('/api/news', {
      params: params || { limit: 100, offset: 0 }
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('爬虫新闻接口请求失败:', error.message)
      throw new Error(error.response?.data?.message || error.message || '请求失败')
    }
    throw error
  }
}

/**
 * 获取爬虫新闻列表（带自定义配置）
 * @param params 分页参数 (limit: 每页条数, offset: 偏移量)
 * @returns 新闻列表响应
 */
export async function fetchGetNewsListWithConfig(params?: Api.Reptile.NewsListParams) {
  try {
    const response = await reptileApiInstance.get<Api.Reptile.NewsResponse>('/api/news', {
      params: params || { limit: 100, offset: 0 }
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('爬虫新闻接口请求失败:', error.message)
      throw new Error(error.response?.data?.message || error.message || '请求失败')
    }
    throw error
  }
}
