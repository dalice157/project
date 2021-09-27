import organizationData from './organizationData'
import pathMapToStructuredData from './webPageData'
import webSiteData from './webSiteData'

const getStructuredData = (path) => [
  ...organizationData,
  ...webSiteData,
  ...pathMapToStructuredData(path)
]

export default getStructuredData
