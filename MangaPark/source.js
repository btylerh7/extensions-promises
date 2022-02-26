(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Source = void 0;
class Source {
    constructor(cheerio) {
        // <-----------        OPTIONAL METHODS        -----------> //
        /**
         * Manages the ratelimits and the number of requests that can be done per second
         * This is also used to fetch pages when a chapter is downloading
         */
        this.requestManager = createRequestManager({
            requestsPerSecond: 2.5,
            requestTimeout: 5000
        });
        this.cheerio = cheerio;
    }
    /**
     * (OPTIONAL METHOD) This function is called when ANY request is made by the Paperback Application out to the internet.
     * By modifying the parameter and returning it, the user can inject any additional headers, cookies, or anything else
     * a source may need to load correctly.
     * The most common use of this function is to add headers to image requests, since you cannot directly access these requests through
     * the source implementation itself.
     *
     * NOTE: This does **NOT** influence any requests defined in the source implementation. This function will only influence requests
     * which happen behind the scenes and are not defined in your source.
     */
    globalRequestHeaders() { return {}; }
    globalRequestCookies() { return []; }
    /**
     * A stateful source may require user input.
     * By supplying this value to the Source, the app will render your form to the user
     * in the application settings.
     */
    getAppStatefulForm() { return createUserForm({ formElements: [] }); }
    /**
     * When the Advanced Search is rendered to the user, this skeleton defines what
     * fields which will show up to the user, and returned back to the source
     * when the request is made.
     */
    getAdvancedSearchForm() { return createUserForm({ formElements: [] }); }
    /**
     * (OPTIONAL METHOD) Given a manga ID, return a URL which Safari can open in a browser to display.
     * @param mangaId
     */
    getMangaShareUrl(mangaId) { return null; }
    /**
     * If a source is secured by Cloudflare, this method should be filled out.
     * By returning a request to the website, this source will attempt to create a session
     * so that the source can load correctly.
     * Usually the {@link Request} url can simply be the base URL to the source.
     */
    getCloudflareBypassRequest() { return null; }
    /**
     * (OPTIONAL METHOD) A function which communicates with a given source, and returns a list of all possible tags which the source supports.
     * These tags are generic and depend on the source. They could be genres such as 'Isekai, Action, Drama', or they can be
     * listings such as 'Completed, Ongoing'
     * These tags must be tags which can be used in the {@link searchRequest} function to augment the searching capability of the application
     */
    getTags() { return Promise.resolve(null); }
    /**
     * (OPTIONAL METHOD) A function which should scan through the latest updates section of a website, and report back with a list of IDs which have been
     * updated BEFORE the supplied timeframe.
     * This function may have to scan through multiple pages in order to discover the full list of updated manga.
     * Because of this, each batch of IDs should be returned with the mangaUpdatesFoundCallback. The IDs which have been reported for
     * one page, should not be reported again on another page, unless the relevent ID has been detected again. You do not want to persist
     * this internal list between {@link Request} calls
     * @param mangaUpdatesFoundCallback A callback which is used to report a list of manga IDs back to the API
     * @param time This function should find all manga which has been updated between the current time, and this parameter's reported time.
     *             After this time has been passed, the system should stop parsing and return
     */
    filterUpdatedManga(mangaUpdatesFoundCallback, time, ids) { return Promise.resolve(); }
    /**
     * (OPTIONAL METHOD) A function which should readonly allf the available homepage sections for a given source, and return a {@link HomeSection} object.
     * The sectionCallback is to be used for each given section on the website. This may include a 'Latest Updates' section, or a 'Hot Manga' section.
     * It is recommended that before anything else in your source, you first use this sectionCallback and send it {@link HomeSection} objects
     * which are blank, and have not had any requests done on them just yet. This way, you provide the App with the sections to render on screen,
     * which then will be populated with each additional sectionCallback method called. This is optional, but recommended.
     * @param sectionCallback A callback which is run for each independant HomeSection.
     */
    getHomePageSections(sectionCallback) { return Promise.resolve(); }
    /**
     * (OPTIONAL METHOD) This function will take a given homepageSectionId and metadata value, and with this information, should return
     * all of the manga tiles supplied for the given state of parameters. Most commonly, the metadata value will contain some sort of page information,
     * and this request will target the given page. (Incrementing the page in the response so that the next call will return relevent data)
     * @param homepageSectionId The given ID to the homepage defined in {@link getHomePageSections} which this method is to readonly moreata about
     * @param metadata This is a metadata parameter which is filled our in the {@link getHomePageSections}'s return
     * function. Afterwards, if the metadata value returned in the {@link PagedResults} has been modified, the modified version
     * will be supplied to this function instead of the origional {@link getHomePageSections}'s version.
     * This is useful for keeping track of which page a user is on, pagnating to other pages as ViewMore is called multiple times.
     */
    getViewMoreItems(homepageSectionId, metadata) { return Promise.resolve(null); }
    /**
     * (OPTIONAL METHOD) This function is to return the entire library of a manga website, page by page.
     * If there is an additional page which needs to be called, the {@link PagedResults} value should have it's metadata filled out
     * with information needed to continue pulling information from this website.
     * Note that if the metadata value of {@link PagedResults} is undefined, this method will not continue to run when the user
     * attempts to readonly morenformation
     * @param metadata Identifying information as to what the source needs to call in order to readonly theext batch of data
     * of the directory. Usually this is a page counter.
     */
    getWebsiteMangaDirectory(metadata) { return Promise.resolve(null); }
    // <-----------        PROTECTED METHODS        -----------> //
    // Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
    convertTime(timeAgo) {
        var _a;
        let time;
        let trimmed = Number(((_a = /\d*/.exec(timeAgo)) !== null && _a !== void 0 ? _a : [])[0]);
        trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
        if (timeAgo.includes('minutes')) {
            time = new Date(Date.now() - trimmed * 60000);
        }
        else if (timeAgo.includes('hours')) {
            time = new Date(Date.now() - trimmed * 3600000);
        }
        else if (timeAgo.includes('days')) {
            time = new Date(Date.now() - trimmed * 86400000);
        }
        else if (timeAgo.includes('year') || timeAgo.includes('years')) {
            time = new Date(Date.now() - trimmed * 31556952000);
        }
        else {
            time = new Date(Date.now());
        }
        return time;
    }
    /**
     * When a function requires a POST body, it always should be defined as a JsonObject
     * and then passed through this function to ensure that it's encoded properly.
     * @param obj
     */
    urlEncodeObject(obj) {
        let ret = {};
        for (const entry of Object.entries(obj)) {
            ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
        }
        return ret;
    }
}
exports.Source = Source;

},{}],3:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);

},{"./Source":2}],4:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./base"), exports);
__exportStar(require("./models"), exports);
__exportStar(require("./APIWrapper"), exports);

},{"./APIWrapper":1,"./base":3,"./models":25}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],6:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],7:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],8:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageCode = void 0;
var LanguageCode;
(function (LanguageCode) {
    LanguageCode["UNKNOWN"] = "_unknown";
    LanguageCode["BENGALI"] = "bd";
    LanguageCode["BULGARIAN"] = "bg";
    LanguageCode["BRAZILIAN"] = "br";
    LanguageCode["CHINEESE"] = "cn";
    LanguageCode["CZECH"] = "cz";
    LanguageCode["GERMAN"] = "de";
    LanguageCode["DANISH"] = "dk";
    LanguageCode["ENGLISH"] = "gb";
    LanguageCode["SPANISH"] = "es";
    LanguageCode["FINNISH"] = "fi";
    LanguageCode["FRENCH"] = "fr";
    LanguageCode["WELSH"] = "gb";
    LanguageCode["GREEK"] = "gr";
    LanguageCode["CHINEESE_HONGKONG"] = "hk";
    LanguageCode["HUNGARIAN"] = "hu";
    LanguageCode["INDONESIAN"] = "id";
    LanguageCode["ISRELI"] = "il";
    LanguageCode["INDIAN"] = "in";
    LanguageCode["IRAN"] = "ir";
    LanguageCode["ITALIAN"] = "it";
    LanguageCode["JAPANESE"] = "jp";
    LanguageCode["KOREAN"] = "kr";
    LanguageCode["LITHUANIAN"] = "lt";
    LanguageCode["MONGOLIAN"] = "mn";
    LanguageCode["MEXIAN"] = "mx";
    LanguageCode["MALAY"] = "my";
    LanguageCode["DUTCH"] = "nl";
    LanguageCode["NORWEGIAN"] = "no";
    LanguageCode["PHILIPPINE"] = "ph";
    LanguageCode["POLISH"] = "pl";
    LanguageCode["PORTUGUESE"] = "pt";
    LanguageCode["ROMANIAN"] = "ro";
    LanguageCode["RUSSIAN"] = "ru";
    LanguageCode["SANSKRIT"] = "sa";
    LanguageCode["SAMI"] = "si";
    LanguageCode["THAI"] = "th";
    LanguageCode["TURKISH"] = "tr";
    LanguageCode["UKRAINIAN"] = "ua";
    LanguageCode["VIETNAMESE"] = "vn";
})(LanguageCode = exports.LanguageCode || (exports.LanguageCode = {}));

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaStatus = void 0;
var MangaStatus;
(function (MangaStatus) {
    MangaStatus[MangaStatus["ONGOING"] = 1] = "ONGOING";
    MangaStatus[MangaStatus["COMPLETED"] = 0] = "COMPLETED";
})(MangaStatus = exports.MangaStatus || (exports.MangaStatus = {}));

},{}],11:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],12:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],13:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],14:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],15:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],16:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],17:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],18:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],19:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],20:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagType = void 0;
/**
 * An enumerator which {@link SourceTags} uses to define the color of the tag rendered on the website.
 * Five types are available: blue, green, grey, yellow and red, the default one is blue.
 * Common colors are red for (Broken), yellow for (+18), grey for (Country-Proof)
 */
var TagType;
(function (TagType) {
    TagType["BLUE"] = "default";
    TagType["GREEN"] = "success";
    TagType["GREY"] = "info";
    TagType["YELLOW"] = "warning";
    TagType["RED"] = "danger";
})(TagType = exports.TagType || (exports.TagType = {}));

},{}],22:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],23:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],24:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],25:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Chapter"), exports);
__exportStar(require("./ChapterDetails"), exports);
__exportStar(require("./HomeSection"), exports);
__exportStar(require("./Manga"), exports);
__exportStar(require("./MangaTile"), exports);
__exportStar(require("./RequestObject"), exports);
__exportStar(require("./SearchRequest"), exports);
__exportStar(require("./TagSection"), exports);
__exportStar(require("./SourceTag"), exports);
__exportStar(require("./Languages"), exports);
__exportStar(require("./Constants"), exports);
__exportStar(require("./MangaUpdate"), exports);
__exportStar(require("./PagedResults"), exports);
__exportStar(require("./ResponseObject"), exports);
__exportStar(require("./RequestManager"), exports);
__exportStar(require("./RequestHeaders"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./TrackObject"), exports);
__exportStar(require("./OAuth"), exports);
__exportStar(require("./UserForm"), exports);

},{"./Chapter":5,"./ChapterDetails":6,"./Constants":7,"./HomeSection":8,"./Languages":9,"./Manga":10,"./MangaTile":11,"./MangaUpdate":12,"./OAuth":13,"./PagedResults":14,"./RequestHeaders":15,"./RequestManager":16,"./RequestObject":17,"./ResponseObject":18,"./SearchRequest":19,"./SourceInfo":20,"./SourceTag":21,"./TagSection":22,"./TrackObject":23,"./UserForm":24}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaPark = exports.MangaParkInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const MangaParkParser_1 = require("./MangaParkParser");
const MP_DOMAIN = 'https://v2.mangapark.net';
const method = 'GET';
exports.MangaParkInfo = {
    version: '2.0.2',
    name: 'MangaPark',
    icon: 'icon.png',
    author: 'Daniel Kovalevich',
    authorWebsite: 'https://github.com/DanielKovalevich',
    description: 'Extension that pulls manga from MangaPark, includes Advanced Search and Updated manga fetching',
    hentaiSource: false,
    websiteBaseURL: MP_DOMAIN,
    sourceTags: [
        {
            text: "Notifications",
            type: paperback_extensions_common_1.TagType.GREEN
        }
    ]
};
class MangaPark extends paperback_extensions_common_1.Source {
    constructor() {
        super(...arguments);
        this.cookies = [createCookie({ name: 'set', value: 'h=1', domain: MP_DOMAIN })];
    }
    cloudflareBypassRequest() {
        return createRequestObject({
            url: `${MP_DOMAIN}`,
            method,
        });
    }
    async getMangaDetails(mangaId) {
        const detailsRequest = createRequestObject({
            url: `${MP_DOMAIN}/manga/${mangaId}`,
            cookies: this.cookies,
            method,
        });
        const response = await this.requestManager.schedule(detailsRequest, 1);
        const $ = this.cheerio.load(response.data);
        return MangaParkParser_1.parseMangaDetails($, mangaId);
    }
    async getChapters(mangaId) {
        const request = createRequestObject({
            url: `${MP_DOMAIN}/manga/${mangaId}`,
            method,
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        return MangaParkParser_1.parseChapters($, mangaId);
    }
    async getChapterDetails(mangaId, chapterId) {
        const request = createRequestObject({
            url: `${MP_DOMAIN}/manga/${mangaId}/${chapterId}`,
            method,
            cookies: this.cookies
        });
        const response = await this.requestManager.schedule(request, 1);
        return MangaParkParser_1.parseChapterDetails(response.data, mangaId, chapterId);
    }
    async filterUpdatedManga(mangaUpdatesFoundCallback, time, ids) {
        let page = 1;
        let updatedManga = {
            ids: [],
            loadMore: true
        };
        while (updatedManga.loadMore) {
            const request = createRequestObject({
                url: `${MP_DOMAIN}/latest/${page++}`,
                method,
                cookies: this.cookies
            });
            const response = await this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            updatedManga = MangaParkParser_1.parseUpdatedManga($, time, ids);
            if (updatedManga.ids.length > 0) {
                mangaUpdatesFoundCallback(createMangaUpdates({
                    ids: updatedManga.ids
                }));
            }
        }
    }
    async getHomePageSections(sectionCallback) {
        const section1 = createHomeSection({ id: 'popular_titles', title: 'POPULAR MANGA' });
        const section2 = createHomeSection({ id: 'popular_new_titles', title: 'POPULAR MANGA UPDATES' });
        const section3 = createHomeSection({ id: 'recently_updated', title: 'RECENTLY UPDATED TITLES' });
        const sections = [section1, section2, section3];
        const request = createRequestObject({ url: `${MP_DOMAIN}`, method });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        MangaParkParser_1.parseHomeSections($, sections, sectionCallback);
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        let page = metadata?.page ?? 1;
        let param = '';
        if (homepageSectionId === 'popular_titles')
            param = `/genre/${page}`;
        else if (homepageSectionId === 'popular_new_titles')
            param = `/search?orderby=views&page=${page}`;
        else if (homepageSectionId === 'recently_updated')
            param = `/latest/${page}`;
        else
            return Promise.resolve(null);
        const request = createRequestObject({
            url: `${MP_DOMAIN}`,
            method,
            param,
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        const manga = MangaParkParser_1.parseViewMore($, homepageSectionId);
        metadata = manga.length > 0 ? { page: page + 1 } : undefined;
        return createPagedResults({
            results: manga,
            metadata,
        });
    }
    async searchRequest(query, metadata) {
        let page = metadata?.page ?? 1;
        const search = MangaParkParser_1.generateSearch(query);
        const request = createRequestObject({
            url: `${MP_DOMAIN}/search?${search}&page=${page}`,
            method,
            cookies: this.cookies,
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        const manga = MangaParkParser_1.parseSearch($);
        metadata = manga.length > 0 ? { page: page + 1 } : undefined;
        return createPagedResults({
            results: manga,
            metadata,
        });
    }
    async getTags() {
        const request = createRequestObject({
            url: `${MP_DOMAIN}/search?`,
            method,
            cookies: this.cookies,
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        return MangaParkParser_1.parseTags($);
    }
}
exports.MangaPark = MangaPark;

},{"./MangaParkParser":27,"paperback-extensions-common":4}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTags = exports.parseSearch = exports.generateSearch = exports.parseViewMore = exports.parseHomeSections = exports.parseUpdatedManga = exports.parseChapterDetails = exports.parseChapters = exports.parseMangaDetails = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
exports.parseMangaDetails = ($, mangaId) => {
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: [] }),
        createTagSection({ id: '1', label: 'format', tags: [] })];
    const image = $('img', '.manga').attr('src') ?? "";
    const rating = $('i', '#rating').text();
    const tableBody = $('tbody', '.manga');
    const titles = [];
    const title = $('.manga').find('a').first().text();
    titles.push(title.substring(0, title.lastIndexOf(' ')));
    let hentai = false;
    let author = "";
    let artist = "";
    let views = 0;
    let status = paperback_extensions_common_1.MangaStatus.ONGOING;
    for (const row of $('tr', tableBody).toArray()) {
        const elem = $('th', row).html();
        switch (elem) {
            case 'Author(s)':
                author = $('a', row).text();
                break;
            case 'Artist(s)':
                artist = $('a', row).first().text();
                break;
            case 'Popularity': {
                let pop = (/has (\d*(\.?\d*\w)?)/g.exec($('td', row).text()) ?? [])[1];
                if (pop.includes('k')) {
                    pop = pop.replace('k', '');
                    views = Number(pop) * 1000;
                }
                else {
                    views = Number(pop) ?? 0;
                }
                break;
            }
            case 'Alternative': {
                const alts = $('td', row).text().split('  ');
                for (const alt of alts) {
                    const trim = alt.trim().replace(/(;*\t*)/g, '');
                    if (trim != '')
                        titles.push(trim);
                }
                break;
            }
            case 'Genre(s)': {
                for (const genre of $('a', row).toArray()) {
                    const item = $(genre).html() ?? "";
                    const id = $(genre).attr('href')?.split('/').pop() ?? '';
                    const tag = item.replace(/<[a-zA-Z\/][^>]*>/g, "");
                    if (item.includes('Hentai'))
                        hentai = true;
                    tagSections[0].tags.push(createTag({ id: id, label: tag }));
                }
                break;
            }
            case 'Status': {
                const stat = $('td', row).text();
                if (stat.includes('Ongoing'))
                    status = paperback_extensions_common_1.MangaStatus.ONGOING;
                else if (stat.includes('Completed'))
                    status = paperback_extensions_common_1.MangaStatus.COMPLETED;
                break;
            }
            case 'Type': {
                const type = $('td', row).text().split('-')[0].trim();
                let id = '';
                if (type.includes('Manga'))
                    id = 'manga';
                else if (type.includes('Manhwa'))
                    id = 'manhwa';
                else if (type.includes('Manhua'))
                    id = 'manhua';
                else
                    id = 'unknown';
                tagSections[1].tags.push(createTag({ id: id, label: type.trim() }));
            }
        }
    }
    const desc = $('.summary').html() ?? "";
    return createManga({
        id: mangaId,
        titles,
        image: image.replace(/(https:)?\/\//gi, 'https://'),
        rating: Number(rating),
        status,
        artist,
        author,
        tags: tagSections,
        views,
        desc,
        //hentai
        hentai: false
    });
};
exports.parseChapters = ($, mangaId) => {
    const chapters = [];
    for (const elem of $('#list').children('div').toArray()) {
        // streamNum helps me navigate the weird id/class naming scheme
        const streamNum = /(\d+)/g.exec($(elem).attr('id') ?? "")?.[0];
        const group = $(`.ml-1.stream-text-${streamNum}`, elem).text();
        let volume = 1;
        let chapNum = 1;
        const volumes = $('.volume', elem).toArray().reverse();
        for (const vol of volumes) {
            const chapterElem = $('li', vol).toArray().reverse();
            for (const chap of chapterElem) {
                const chapId = $(chap).attr('id')?.replace('b-', 'i');
                let name;
                const nameArr = ($('a', chap).html() ?? "").replace(/(\t*\n*)/g, '').split(':');
                name = nameArr.length > 1 ? nameArr[1].trim() : undefined;
                const time = convertTime($('.time', chap).text().trim());
                chapters.push(createChapter({
                    id: chapId ?? '',
                    mangaId,
                    name,
                    chapNum,
                    volume,
                    time,
                    group,
                    langCode: paperback_extensions_common_1.LanguageCode.ENGLISH
                }));
                chapNum++;
            }
            volume++;
        }
    }
    return chapters;
};
exports.parseChapterDetails = (data, mangaId, chapterId) => {
    const script = JSON.parse(/var _load_pages = (.*);/.exec(data)?.[1] ?? '');
    const pages = [];
    for (const page of script)
        pages.push(page.u);
    return createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages: pages,
        longStrip: false
    });
};
exports.parseUpdatedManga = ($, time, ids) => {
    const manga = [];
    let loadMore = true;
    for (let item of $('.item', '.ls1').toArray()) {
        const id = ($('a', item).first().attr('href') ?? '').split('/').pop() ?? '';
        const mangaTime = $('.time').first().text();
        if (convertTime(mangaTime) > time)
            if (ids.includes(id))
                manga.push(id);
            else
                loadMore = false;
    }
    return {
        ids: manga,
        loadMore,
    };
};
exports.parseHomeSections = ($, sections, sectionCallback) => {
    for (const section of sections)
        sectionCallback(section);
    const popManga = [];
    const newManga = [];
    const updateManga = [];
    for (const item of $('li', '.top').toArray()) {
        const id = ($('.cover', item).attr('href') ?? '').split('/').pop() ?? '';
        const title = $('.cover', item).attr('title') ?? '';
        const image = $('img', item).attr('src') ?? '';
        const subtitle = $('.visited', item).text() ?? '';
        const sIcon = 'clock.fill';
        const sText = $('i', item).text();
        popManga.push(createMangaTile({
            id,
            image: image.replace(/(https:)?\/\//gi, 'https://'),
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
            secondaryText: createIconText({ text: sText, icon: sIcon })
        }));
    }
    for (const item of $('ul', '.mainer').toArray()) {
        for (const elem of $('li', item).toArray()) {
            const id = ($('a', elem).first().attr('href') ?? '').split('/').pop() ?? '';
            const title = $('img', elem).attr('alt') ?? '';
            const image = $('img', elem).attr('src') ?? '';
            const subtitle = $('.visited', elem).text() ?? '';
            newManga.push(createMangaTile({
                id,
                image: image.replace(/(https:)?\/\//gi, 'https://'),
                title: createIconText({ text: title }),
                subtitleText: createIconText({ text: subtitle })
            }));
        }
    }
    for (const item of $('.item', 'article').toArray()) {
        const id = ($('.cover', item).attr('href') ?? '').split('/').pop() ?? '';
        const title = $('.cover', item).attr('title') ?? '';
        const image = $('img', item).attr('src') ?? '';
        const subtitle = $('.visited', item).text() ?? '';
        const sIcon = 'clock.fill';
        const sText = $('li.new', item).first().find('i').last().text() ?? '';
        updateManga.push(createMangaTile({
            id,
            image: image.replace(/(https:)?\/\//gi, 'https://'),
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
            secondaryText: createIconText({ text: sText, icon: sIcon })
        }));
    }
    sections[0].items = popManga;
    sections[1].items = newManga;
    sections[2].items = updateManga;
    for (const section of sections)
        sectionCallback(section);
};
exports.parseViewMore = ($, homepageSectionId) => {
    const manga = [];
    if (homepageSectionId === 'popular_titles') {
        for (const item of $('.item', '.row.mt-2.ls1').toArray()) {
            const id = $('a', item).first().attr('href')?.split('/').pop() ?? '';
            const title = $('a', item).first().attr('title') ?? '';
            const image = $('img', item).attr('src') ?? '';
            const elems = $('small.ml-1', item);
            const rating = $(elems[0]).text().trim();
            const rank = $(elems[1]).text().split('-')[0].trim();
            const chapters = $('span.small', item).text().trim();
            manga.push(createMangaTile({
                id,
                image: image.replace(/(https:)?\/\//gi, 'https://'),
                title: createIconText({ text: title }),
                subtitleText: createIconText({ text: chapters }),
                primaryText: createIconText({ text: rating, icon: 'star.fill' }),
                secondaryText: createIconText({ text: rank, icon: 'chart.bar.fill' })
            }));
        }
    }
    else if (homepageSectionId === 'popular_new_titles') {
        for (const item of $('.item', '.manga-list').toArray()) {
            const id = $('.cover', item).attr('href')?.split('/').pop() ?? '';
            const title = $('.cover', item).attr('title') ?? '';
            const image = $('img', item).attr('src') ?? '';
            const rank = $('[title=rank]', item).text().split('·')[1].trim();
            const rating = $('.rate', item).text().trim();
            const time = $('.justify-content-between', item).first().find('i').text();
            manga.push(createMangaTile({
                id,
                image: image.replace(/(https:)?\/\//gi, 'https://'),
                title: createIconText({ text: title }),
                subtitleText: createIconText({ text: time }),
                primaryText: createIconText({ text: rating, icon: 'star.fill' }),
                secondaryText: createIconText({ text: rank, icon: 'chart.bar.fill' })
            }));
        }
    }
    else if (homepageSectionId === 'recently_updated') {
        for (const item of $('.item', '.ls1').toArray()) {
            const id = $('.cover', item).attr('href')?.split('/').pop() ?? '';
            const title = $('.cover', item).attr('title') ?? '';
            const image = $('img', item).attr('src') ?? '';
            const chapter = $('.visited', item).first().text();
            const time = $('.time', item).first().text();
            manga.push(createMangaTile({
                id,
                image: image.replace(/(https:)?\/\//gi, 'https://'),
                title: createIconText({ text: title }),
                subtitleText: createIconText({ text: chapter }),
                secondaryText: createIconText({ text: time, icon: 'clock.fill' })
            }));
        }
    }
    return manga;
};
exports.generateSearch = (query) => {
    const genres = query.includeGenre?.join(',');
    const excluded = query.excludeGenre?.join(',');
    // will not let you search across more than one format
    const format = query.includeFormat?.[0];
    let status = "";
    switch (query.status) {
        case 0:
            status = 'completed';
            break;
        case 1:
            status = 'ongoing';
            break;
        default: status = '';
    }
    let search = `q=${encodeURI(query.title ?? '')}&`;
    search += `autart=${encodeURI(query.author || query.artist || '')}&`;
    search += `&genres=${genres}&genres-exclude=${excluded}&page=1`;
    search += `&types=${format}&status=${status}&st-ss=1`;
    return search;
};
exports.parseSearch = ($) => {
    const mangaList = $('.manga-list');
    const manga = [];
    for (const item of $('.item', mangaList).toArray()) {
        const id = $('a', item).first().attr('href')?.split('/').pop() ?? '';
        const img = $('img', item);
        const image = $(img).attr('src') ?? '';
        const title = $(img).attr('title') ?? '';
        const rate = $('.rate', item);
        const rating = Number($(rate).find('i').text());
        let author = "";
        for (const field of $('.field', item).toArray()) {
            const elem = $('b', field).first().text();
            if (elem == 'Authors/Artists:') {
                const authorCheerio = $('a', field).first();
                author = $(authorCheerio).text();
            }
        }
        const lastUpdate = $('ul', item).find('i').text();
        manga.push(createMangaTile({
            id,
            image: image.replace(/(https:)?\/\//gi, 'https://'),
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: author }),
            primaryText: createIconText({ text: rating.toString(), icon: 'star.fill' }),
            secondaryText: createIconText({ text: lastUpdate, icon: 'clock.fill' })
        }));
    }
    return manga;
};
exports.parseTags = ($) => {
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: [] }),
        createTagSection({ id: '1', label: 'format', tags: [] })];
    for (let genre of $('span', '[name=genres]').toArray())
        tagSections[0].tags.push(createTag({ id: $(genre).attr('rel') ?? '', label: $(genre).text() }));
    for (let type of $('span', '[name=types]').toArray())
        tagSections[1].tags.push(createTag({ id: $(type).attr('rel') ?? '', label: $(type).text() }));
    return tagSections;
};
const convertTime = (timeAgo) => {
    let time;
    let trimmed = Number(/\d*/.exec(timeAgo)?.[0]);
    trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('minutes')) {
        time = new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('hours')) {
        time = new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('days')) {
        time = new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('year') || timeAgo.includes('years')) {
        time = new Date(Date.now() - trimmed * 31556952000);
    }
    else {
        time = new Date(Date.now());
    }
    return time;
};

},{"paperback-extensions-common":4}]},{},[26])(26)
});
