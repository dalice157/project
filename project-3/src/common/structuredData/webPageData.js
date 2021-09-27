import MainPaths from '../LinkPath'

const webPageData = (url, name) => ({
  '@type': 'WebPage',
  url,
  name,
  publisher: '104高年級人力銀行',
})

const pathMapToStructuredData = (path) => {
  const url = `${process.env.BROWSER_BASE_URL}/50talent${path}`
  switch (path) {
    case MainPaths.cService:
    default:
      return [webPageData(url, '50歲以上人才找工作：104嚴選人才職場計畫說明')]
    case MainPaths.cJobs:
      return [webPageData(url, '50歲以上人才找工作：門市店員就業機會')]
    case MainPaths.bService:
      return [webPageData(url, '企業快速補充人力：嚴選人才企業服務介紹')]
  }
}

export default pathMapToStructuredData
