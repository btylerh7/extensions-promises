import { Source } from './Source'
import { Manga } from '../models/Manga'
import { Chapter } from '../models/Chapter'
import { MangaTile } from '../models/MangaTile'
import { SearchRequest } from '../models/SearchRequest'
import { RequestObject } from '../models/RequestObject'
import { ChapterDetails } from '../models/ChapterDetails'

export class MangaDex extends Source {
  private hMode: number
  constructor(cheerio: CheerioAPI) {
    super(cheerio)
    this.hMode = 0
  }

  getMangaDetailsRequest(ids: string[]): RequestObject {
    let metadata = { 'ids': ids }
    return createRequestObject(metadata, 'https://mangadex.org/title/', undefined, undefined, undefined, undefined, undefined, undefined, true)
  }

  // TODO: TO BE IMPLEMENTED
  getMangaDetails(data: any, mangaId: string): Manga {
    throw new Error("Method not implemented.");
  }

  // Manga is already formatted at the cache server level
  getMangaDetailsBulk(data: any): Manga[] {
    let manga: Manga[] = []
    /*let unformatedManga = data.result
    for (let u of unformatedManga) {
      let formattedManga: Manga = new Manga(data.id, data.image, data.artist, data.author, data.avgRating, data.content,
        data.covers, data.demographic, data.description, data.follows, data.format, data.genre, data.langFlag, data.langName,
        data.rating, data.status, data.theme, data.titles, data.users, data.views, data.hentai, data.related, data.relatedManga,
        data.lastUpdate)
      manga.push(formattedManga)
    }*/
    return data.result
  }

  getChapterRequest(mangaId: string): RequestObject {
    let metadata = { 'id': mangaId }
    return createRequestObject(metadata, 'https://mangadex.org/api/manga/', [], mangaId, undefined, undefined, undefined, undefined, true)
  }

  getChapters(data: any, mangaId: string) {
    data = data.chapter
    let entries = Object.entries(data)
    let chapters: Chapter[] = []
    for (let entry of entries) {
      let id: string = entry[0]
      let info: any = entry[1]
      chapters.push(createChapter(id,
        mangaId,
        info.title,
        info.chapter,
        info.volume,
        info.group_name,
        0,
        new Date(info.timestamp),
        false,
        info.lang_code))
    }

    return chapters
  }

  getChapterDetailsRequest(mangaId: string, chapId: string): RequestObject {
    throw new Error("Method not implemented.")
  }

  getChapterDetails(data: any, metadata: any): { 'details': ChapterDetails, 'nextPage': boolean } {
    throw new Error("Method not implemented.")
  }

  filterUpdatedMangaRequest(ids: any, time: Date, page: number): RequestObject {
    let metadata = { 'ids': ids, 'referenceTime': time }
    let cookies = [createCookie('mangadex_title_mode', (2).toString(), undefined, undefined, undefined, undefined), createCookie('mangadex_h_mode', this.hMode.toString(), undefined, undefined, undefined, undefined)]
    return createRequestObject(metadata, 'https://mangadex.org/titles/0/', cookies, page.toString(), undefined, undefined, undefined, undefined, true)
  }

  filterUpdatedManga(data: any, metadata: any): { 'updatedMangaIds': string[], 'nextPage': boolean } {
    let $ = this.cheerio.load(data)

    let returnObject: { 'updatedMangaIds': string[], 'nextPage': boolean } = {
      'updatedMangaIds': [],
      'nextPage': true
    }

    for (let elem of $('.manga-entry').toArray()) {
      let id = elem.attribs['data-id']
      if (new Date($(elem).find('time').attr('datetime')?.toString() ?? "") > metadata.referenceTime) {
        if (metadata.ids.includes(id)) {
          returnObject.updatedMangaIds.push(id)
        }
      }
      else {
        returnObject.nextPage = false
        return returnObject
      }
    }

    return returnObject
  }

  getHomePageSectionRequest() {
    let request1 = createRequestObject({}, 'https://mangadex.org', undefined, undefined, undefined, undefined, undefined, undefined, true)
    let request2 = createRequestObject({}, 'https://mangadex.org/updates', undefined, undefined, undefined, undefined, undefined, undefined, true)

    let section1 = createSection('featured_titles', 'FEATURED TITLES', [], undefined)
    let section2 = createSection('new_titles', 'NEW TITLES', [], undefined)
    let section3 = createSection('recently_updated', 'RECENTLY UPDATED TITLES', [], undefined)

    return {
      'featured_new': createHomeRequestObject(request1, [section1, section2]),
      'recently_updated': createHomeRequestObject(request2, [section3])
    }
  }

  getHomePageSections(data: any, key: string, sections: any) {
    let $ = this.cheerio.load(data)
    switch (key) {
      case "featured_new": sections = this.getFeaturedNew($, sections); break
      case "recently_updated": sections = this.getRecentUpdates($, sections); break
    }
    return sections
  }

  getFeaturedNew($: CheerioSelector, section: any) {
    let featuredManga: MangaTile[] = []
    let newManga: MangaTile[] = []

    $("#hled_titles_owl_carousel .large_logo").each(function (i: any, elem: any) {
      let title = $(elem)

      let img = title.find("img").first()
      let links = title.find("a")

      let idStr: any = links.first().attr("href")
      let id = idStr!!.match(/(\d+)(?=\/)/) ?? "-1"

      let caption = title.find(".car-caption p:nth-child(2)")
      let bookmarks = caption.find("span[title=Follows]").text()
      let rating = caption.find("span[title=Rating]").text()
      featuredManga.push(createMangaTile(id[0], img.attr("data-src") ?? " ", createIconText(img.attr("title") ?? " ", undefined), undefined, createIconText(bookmarks, 'bookmark.fill'), createIconText(rating, 'star.fill'), undefined))
    })

    $("#new_titles_owl_carousel .large_logo").each(function (i: any, elem: any) {
      let title = $(elem)

      let img = title.find("img").first()
      let links = title.find("a")

      let idStr: any = links.first().attr("href")
      let id = idStr.match(/(\d+)(?=\/)/)

      let caption = title.find(".car-caption p:nth-child(2)")
      let obj: any = { name: caption.find("a").text(), group: "", time: Date.parse(caption.find("span").attr("title") ?? " "), langCode: "" }
      let updateTime: string = (Date.parse(caption.find("span").attr("title") ?? " ")).toString()
      newManga.push(createMangaTile(id[0], img.attr("data-src") ?? " ", createIconText(img.attr("title") ?? " ", undefined), createIconText(caption.find("a").text(), undefined), undefined, createIconText(updateTime, 'clock.fill'), undefined))
    })
    section[0].items = featuredManga
    section[1].items = newManga
    return section
  }

  getRecentUpdates($: CheerioSelector, section: any) {
    let updates: MangaTile[] = []
    let elem = $('tr', 'tbody').toArray()
    let i = 0
    while (i < elem.length) {
      let hasImg: boolean = false
      let idStr: string = $('a.manga_title', elem[i]).attr('href') ?? ''
      let id: string = (idStr.match(/(\d+)(?=\/)/) ?? '')[0] ?? ''
      let title: string = $('a.manga_title', elem[i]).text() ?? ''
      let image: string = $('img', elem[i]).attr('src') ?? ''

      // in this case: badge will be number of updates
      // that the manga has received within last week
      let badge = 0
      let pIcon = 'eye.fill'
      let sIcon = 'clock.fill'
      let subTitle = ''
      let pText = ''
      let sText = ''

      let first = true
      i++
      while (!hasImg && i < elem.length) {
        // for the manga tile, we only care about the first/latest entry
        if (first && !hasImg) {
          subTitle = $('a', elem[i]).first().text()
          pText = $('.text-center.text-info', elem[i]).text()
          sText = $('time', elem[i]).text().replace('ago', '').trim()
          first = false
        }
        badge++
        i++

        hasImg = $(elem[i]).find('img').length > 0
      }

      updates.push(createMangaTile(id, image, createIconText(title, undefined),  createIconText(subTitle, undefined), createIconText(pText, pIcon), createIconText(sText, sIcon), badge))
    }

    section[2].items = updates
    return section
  }

  getViewMoreRequest(key: string): RequestObject {
    throw new Error("Method not implemented.")
  }

  getViewMoreItems(data: any, key: string, page: number): MangaTile[] {
    throw new Error("Method not implemented.")
  }

  //TODO: NOT FULLY IMPLEMENTED FOR search()
  searchRequest(query: SearchRequest, page: number): RequestObject {
    throw new Error("Method not implemented.");
    /*let search = ''
    return {
      'metadata': {
        'search': search
      },
      'request': {
        'url': 'https://mangadex.org/search?',
        'param': search,
        'config': {
          'headers' : {
            
          },
        },
        'cookies':[
          { 
            'key': '',
            'value': ``
          },
        ]
      }
    }*/
  }

  search(data: any): any {
    throw new Error("Method not implemented.")
  }

  // manga are already formatted at the cache server level
  searchMangaCached(data: any): any {
    return data.result
  }

  getTagsUrl() {
    return {
      'url': 'url'
    }
  }

  // Tags are already formatted at the cache server level
  getTags(data: any) {
    return data.result
  }

}