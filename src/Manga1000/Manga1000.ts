/* eslint-disable linebreak-style */
import {
  Chapter,
  ChapterDetails,
  HomeSection,
  LanguageCode,
  Manga,
  MangaUpdates,
  PagedResults,
  SearchRequest,
  Source,
  TagSection,
  Request,
  Response,
  SourceInfo,
  TagType,
} from 'paperback-extensions-common'
import { decodeHTML, encode } from 'entities'
import {
  parseMangaDetails,
  parseChapters,
  parseChapterDetails,
  parseSearchRequest,
} from './Manga1000Parser'

export const M1000_DOMAIN = 'https://mangapro.top'
const headers = {
  'content-type': 'application/x-www-form-urlencoded',
  Referer: `${M1000_DOMAIN}`,
}
const method = 'GET'

export const Manga1000Info: SourceInfo = {
  version: '1.0',
  name: 'Manga1000',
  icon: 'logo.png',
  author: 'btylerh7',
  authorWebsite: 'https://github.com/btylerh7',
  description: 'Extension that pulls manga from Manga1000',
  hentaiSource: false,
  websiteBaseURL: M1000_DOMAIN,
  sourceTags: [
    {
      text: 'Japanese',
      type: TagType.GREY,
    },
  ],
}

export class Manga1000 extends Source {
  readonly cookies = [
    createCookie({
      name: 'isAdult',
      value: '1',
      domain: `https://manga1000.top`,
    }),
  ]
  cloudflareBypassRequest() {
    return createRequestObject({
      url: `${M1000_DOMAIN}`,
      method,
    })
  }
  requestManager = createRequestManager({
    requestsPerSecond: 4,
    requestTimeout: 15000,
  })
  getMangaShareUrl(mangaId: string): string {
    const mangaIdUrl = encodeURI(decodeHTML(mangaId))
    return `${M1000_DOMAIN}/${mangaIdUrl}/`
  }
  async getMangaDetails(mangaId: string): Promise<Manga> {
    const request = createRequestObject({
      url: encodeURI(`${M1000_DOMAIN}/${mangaId}`),
      method,
      cookies: this.cookies,
    })
    const data = await this.requestManager.schedule(request, 1)
    let $ = this.cheerio.load(data.data)

    return parseMangaDetails($, mangaId)
  }
  async getChapters(mangaId: string): Promise<Chapter[]> {
    const request = createRequestObject({
      url: encodeURI(`${M1000_DOMAIN}/${mangaId}`),
      method,
      headers,
    })
    const data = await this.requestManager.schedule(request, 1)
    let $ = this.cheerio.load(data.data)

    return parseChapters($, mangaId)
  }
  async getChapterDetails(
    mangaId: string,
    chapterId: string
  ): Promise<ChapterDetails> {
    const request = createRequestObject({
      url: encodeURI(`${M1000_DOMAIN}/${mangaId}`),
      method,
      headers,
    })
    const data = await this.requestManager.schedule(request, 1)
    let $ = this.cheerio.load(data.data)

    return parseChapterDetails($, mangaId, chapterId)
  }
  async searchRequest(
    query: SearchRequest,
    metadata: any
  ): Promise<PagedResults> {
    let page: number = metadata?.page ?? 1

    const request = createRequestObject({
      url: encodeURI(`${M1000_DOMAIN}/?s=${query}`),
      method,
      headers,
    })
    const data = await this.requestManager.schedule(request, 1)
    let $ = this.cheerio.load(data.data)
    const manga = parseSearchRequest($, query)
    metadata = manga.length > 0 ? { page: page + 1 } : undefined

    return createPagedResults({
      results: manga,
      metadata,
    })
  }
}
