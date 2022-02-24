import {
  Chapter,
  ChapterDetails,
  HomeSection,
  LanguageCode,
  Manga,
  MangaStatus,
  MangaTile,
  SearchRequest,
  TagSection,
} from 'paperback-extensions-common'
import { decodeHTML } from 'entities'

export const parseMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
  const titles = [$('.entry-title').text().split(' ')[0]]
  const image = $('.wp-image-163').attr('src')
  const status = MangaStatus.ONGOING //Manga1000 does not provide this info
  const author = $('figcaption').find('strong').next().text()

  return createManga({
    id: mangaId,
    titles: titles,
    image: image ? image : 'https://i.imgur.com/GYUxEX8.png',
    rating: 0,
    status: status,
    author: author,
    // tags: tagSections,
    // desc,
    // hentai
  })
}

export const parseChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
  const chapters: Chapter[] = []
  const chapterLinks = $('td').find('a')

  for (let href of chapterLinks.toArray()) {
    const id = decodeURI(href.attribs.href) //Decode link to chapter
    const chapNum = Number(
      href.children[0].data?.match('【(.*?)】')?.[1].replace(/第|話/g, '')
    )
    chapters.push(
      createChapter({
        id,
        mangaId,
        chapNum,
        langCode: LanguageCode.JAPANESE,
      })
    )
  }

  return chapters
}

export const parseChapterDetails = (
  $: CheerioStatic,
  mangaId: string,
  chapterId: string
): ChapterDetails => {
  const pages = []
  const links = $('.wp-block-image').find('img')

  for (const img of links.toArray()) {
    let page = img.attribs['data-src']
      ? img.attribs['data-src']
      : img.attribs.src
    pages.push(page)
  }
  return createChapterDetails({
    id: chapterId,
    mangaId,
    pages,
    longStrip: false,
  })
}
