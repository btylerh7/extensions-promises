/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */
export interface paths {
  "/api/v1/libraries/{libraryId}/scan": {
    post: operations["scan"];
  };
  "/api/v1/libraries": {
    get: operations["getAll"];
    post: operations["addOne"];
  };
  "/api/v1/libraries/{libraryId}": {
    get: operations["getOne"];
    put: operations["updateOne"];
    delete: operations["deleteOne"];
  };
  "/api/v1/libraries/{libraryId}/metadata/refresh": {
    post: operations["refreshMetadata"];
  };
  "/api/v1/libraries/{libraryId}/analyze": {
    post: operations["analyze"];
  };
  "/api/v1/claim": {
    get: operations["getClaimStatus"];
    post: operations["claimAdmin"];
  };
  "/api/v1/collections": {
    get: operations["getAll_1"];
    post: operations["addOne_1"];
  };
  "/api/v1/collections/{id}/series": {
    get: operations["getSeriesForCollection"];
  };
  "/api/v1/collections/{id}": {
    get: operations["getOne_1"];
    delete: operations["deleteOne_1"];
    patch: operations["updateOne_1"];
  };
  "/api/v1/collections/{id}/thumbnail": {
    get: operations["getCollectionThumbnail"];
  };
  "/api/v1/books": {
    get: operations["getAllBooks"];
  };
  "/api/v1/books/latest": {
    /** Return newly added or updated books. */
    get: operations["getLatestBooks"];
  };
  "/api/v1/books/{bookId}/metadata/refresh": {
    post: operations["refreshMetadata_1"];
  };
  "/api/v1/books/{bookId}/metadata": {
    patch: operations["updateMetadata"];
  };
  "/api/v1/books/{bookId}/analyze": {
    post: operations["analyze_1"];
  };
  "/api/v1/books/{bookId}/pages/{pageNumber}": {
    get: operations["getBookPage"];
  };
  "/api/v1/books/{bookId}/read-progress": {
    delete: operations["deleteReadProgress"];
    patch: operations["markReadProgress"];
  };
  "/api/v1/books/ondeck": {
    /** Return first unread book of series with at least one book read and no books in progress. */
    get: operations["getBooksOnDeck"];
  };
  "/api/v1/books/{bookId}": {
    get: operations["getOneBook"];
  };
  "/api/v1/books/{bookId}/previous": {
    get: operations["getBookSiblingPrevious"];
  };
  "/api/v1/books/{bookId}/next": {
    get: operations["getBookSiblingNext"];
  };
  "/api/v1/books/{bookId}/thumbnail": {
    get: operations["getBookThumbnail"];
  };
  "/api/v1/books/{bookId}/file": {
    /** Download the book file. */
    get: operations["getBookFile"];
  };
  "/api/v1/books/{bookId}/file/*": {
    /** Download the book file. */
    get: operations["getBookFile_1"];
  };
  "/api/v1/books/{bookId}/pages": {
    get: operations["getBookPages"];
  };
  "/api/v1/books/{bookId}/pages/{pageNumber}/thumbnail": {
    get: operations["getBookPageThumbnail"];
  };
  "/api/v1/filesystem": {
    post: operations["getDirectoryListing"];
  };
  "/api/v1/users/{id}": {
    delete: operations["delete"];
    patch: operations["updateUserRoles"];
  };
  "/api/v1/users": {
    get: operations["getAll_2"];
    post: operations["addOne_2"];
  };
  "/api/v1/users/me/password": {
    patch: operations["updatePassword"];
  };
  "/api/v1/users/me": {
    get: operations["getMe"];
  };
  "/api/v1/users/{id}/shared-libraries": {
    patch: operations["updateSharesLibraries"];
  };
  "/api/v1/authors": {
    get: operations["getAuthors"];
  };
  "/api/v1/series/{seriesId}/metadata/refresh": {
    post: operations["refreshMetadata_2"];
  };
  "/api/v1/series/{seriesId}/metadata": {
    patch: operations["updateMetadata_1"];
  };
  "/api/v1/series/{seriesId}/analyze": {
    post: operations["analyze_2"];
  };
  "/api/v1/series/{seriesId}/read-progress": {
    post: operations["markAsRead"];
    delete: operations["markAsUnread"];
  };
  "/api/v1/series/latest": {
    /** Return recently added or updated series. */
    get: operations["getLatestSeries"];
  };
  "/api/v1/series/new": {
    /** Return newly added series. */
    get: operations["getNewSeries"];
  };
  "/api/v1/series/updated": {
    /** Return recently updated series, but not newly added ones. */
    get: operations["getUpdatedSeries"];
  };
  "/api/v1/series/{seriesId}": {
    get: operations["getOneSeries"];
  };
  "/api/v1/series/{seriesId}/thumbnail": {
    get: operations["getSeriesThumbnail"];
  };
  "/api/v1/series/{seriesId}/books": {
    get: operations["getAllBooksBySeries"];
  };
  "/api/v1/series/{seriesId}/collections": {
    get: operations["getAllCollectionsBySeries"];
  };
  "/api/v1/series": {
    get: operations["getAllSeries"];
  };
}

export interface components {
  schemas: {
    LibraryCreationDto: {
      name: string;
      root: string;
      importComicInfoBook?: boolean;
      importComicInfoSeries?: boolean;
      importComicInfoCollection?: boolean;
      importEpubBook?: boolean;
      importEpubSeries?: boolean;
      importLocalArtwork?: boolean;
      scanForceModifiedTime?: boolean;
      scanDeep?: boolean;
    };
    LibraryDto: {
      id?: string;
      name?: string;
      root?: string;
      importComicInfoBook?: boolean;
      importComicInfoSeries?: boolean;
      importComicInfoCollection?: boolean;
      importEpubBook?: boolean;
      importEpubSeries?: boolean;
      importLocalArtwork?: boolean;
      scanForceModifiedTime?: boolean;
      scanDeep?: boolean;
    };
    LibraryUpdateDto: {
      name: string;
      root: string;
      importComicInfoBook?: boolean;
      importComicInfoSeries?: boolean;
      importComicInfoCollection?: boolean;
      importEpubBook?: boolean;
      importEpubSeries?: boolean;
      importLocalArtwork?: boolean;
      scanForceModifiedTime?: boolean;
      scanDeep?: boolean;
    };
    UserDto: {
      id?: string;
      email?: string;
      roles?: string[];
    };
    ClaimStatus: {
      claimed?: boolean;
    };
    CollectionCreationDto: {
      name: string;
      ordered?: boolean;
      seriesIds: string[];
    };
    CollectionDto: {
      id?: string;
      name?: string;
      ordered?: boolean;
      seriesIds?: string[];
      createdDate?: string;
      lastModifiedDate?: string;
      filtered?: boolean;
    };
    PageCollectionDto: {
      totalPages?: number;
      totalElements?: number;
      size?: number;
      content?: components["schemas"]["CollectionDto"][];
      number?: number;
      sort?: components["schemas"]["Sort"];
      first?: boolean;
      numberOfElements?: number;
      pageable?: components["schemas"]["Pageable"];
      last?: boolean;
      empty?: boolean;
    };
    Pageable: {
      offset?: number;
      sort?: components["schemas"]["Sort"];
      pageNumber?: number;
      pageSize?: number;
      paged?: boolean;
      unpaged?: boolean;
    };
    Sort: {
      sorted?: boolean;
      unsorted?: boolean;
      empty?: boolean;
    };
    PageSeriesDto: {
      totalPages?: number;
      totalElements?: number;
      size?: number;
      content?: components["schemas"]["SeriesDto"][];
      number?: number;
      sort?: components["schemas"]["Sort"];
      first?: boolean;
      numberOfElements?: number;
      pageable?: components["schemas"]["Pageable"];
      last?: boolean;
      empty?: boolean;
    };
    SeriesDto: {
      id?: string;
      libraryId?: string;
      name?: string;
      url?: string;
      created?: string;
      lastModified?: string;
      fileLastModified?: string;
      booksCount?: number;
      booksReadCount?: number;
      booksUnreadCount?: number;
      booksInProgressCount?: number;
      metadata?: components["schemas"]["SeriesMetadataDto"];
    };
    SeriesMetadataDto: {
      status?: string;
      statusLock?: boolean;
      created?: string;
      lastModified?: string;
      title?: string;
      titleLock?: boolean;
      titleSort?: string;
      titleSortLock?: boolean;
    };
    CollectionUpdateDto: {
      name?: string;
      ordered?: boolean;
      seriesIds?: string[];
    };
    AuthorDto: {
      name?: string;
      role?: string;
    };
    BookDto: {
      id?: string;
      seriesId?: string;
      libraryId?: string;
      name?: string;
      url?: string;
      number?: number;
      created?: string;
      lastModified?: string;
      fileLastModified?: string;
      sizeBytes?: number;
      size?: string;
      media?: components["schemas"]["MediaDto"];
      metadata?: components["schemas"]["BookMetadataDto"];
      readProgress?: components["schemas"]["ReadProgressDto"];
    };
    BookMetadataDto: {
      title?: string;
      titleLock?: boolean;
      summary?: string;
      summaryLock?: boolean;
      number?: string;
      numberLock?: boolean;
      numberSort?: number;
      numberSortLock?: boolean;
      readingDirection?: string;
      readingDirectionLock?: boolean;
      publisher?: string;
      publisherLock?: boolean;
      ageRating?: number;
      ageRatingLock?: boolean;
      releaseDate?: string;
      releaseDateLock?: boolean;
      authors?: components["schemas"]["AuthorDto"][];
      authorsLock?: boolean;
    };
    MediaDto: {
      status?: string;
      mediaType?: string;
      pagesCount?: number;
      comment?: string;
    };
    PageBookDto: {
      totalPages?: number;
      totalElements?: number;
      size?: number;
      content?: components["schemas"]["BookDto"][];
      number?: number;
      sort?: components["schemas"]["Sort"];
      first?: boolean;
      numberOfElements?: number;
      pageable?: components["schemas"]["Pageable"];
      last?: boolean;
      empty?: boolean;
    };
    ReadProgressDto: {
      page?: number;
      completed?: boolean;
      created?: string;
      lastModified?: string;
    };
    AuthorUpdateDto: {
      name: string;
      role: string;
    };
    /** Metadata fields to update. Set a field to null to unset the metadata. You can omit fields you don't want to update. */
    BookMetadataUpdateDto: {
      title?: string;
      titleLock?: boolean;
      summary?: string;
      summaryLock?: boolean;
      number?: string;
      numberLock?: boolean;
      numberSort?: number;
      numberSortLock?: boolean;
      readingDirectionLock?: boolean;
      publisher?: string;
      publisherLock?: boolean;
      ageRatingLock?: boolean;
      releaseDateLock?: boolean;
      authorsLock?: boolean;
      ageRating?: number;
      readingDirection?:
        | "LEFT_TO_RIGHT"
        | "RIGHT_TO_LEFT"
        | "VERTICAL"
        | "WEBTOON";
      releaseDate?: string;
      authors?: components["schemas"]["AuthorUpdateDto"][];
    };
    /** page can be omitted if completed is set to true. completed can be omitted, and will be set accordingly depending on the page passed and the total number of pages in the book. */
    ReadProgressUpdateDto: {
      page?: number;
      completed?: boolean;
    };
    StreamingResponseBody: { [key: string]: any };
    PageDto: {
      number?: number;
      fileName?: string;
      mediaType?: string;
      width?: number;
      height?: number;
    };
    DirectoryRequestDto: {
      path?: string;
    };
    DirectoryListingDto: {
      parent?: string;
      directories?: components["schemas"]["PathDto"][];
    };
    PathDto: {
      type?: string;
      name?: string;
      path?: string;
    };
    UserCreationDto: {
      email?: string;
      password: string;
      roles?: string[];
    };
    SharedLibraryDto: {
      id?: string;
    };
    UserWithSharedLibrariesDto: {
      id?: string;
      email?: string;
      roles?: string[];
      sharedAllLibraries?: boolean;
      sharedLibraries?: components["schemas"]["SharedLibraryDto"][];
    };
    PasswordUpdateDto: {
      password: string;
    };
    RolesUpdateDto: {
      roles?: string[];
    };
    SharedLibrariesUpdateDto: {
      all?: boolean;
      libraryIds?: string[];
    };
    /** Metadata fields to update. Set a field to null to unset the metadata. You can omit fields you don't want to update. */
    SeriesMetadataUpdateDto: {
      status?: "ENDED" | "ONGOING" | "ABANDONED" | "HIATUS";
      statusLock?: boolean;
      title?: string;
      titleLock?: boolean;
      titleSort?: string;
      titleSortLock?: boolean;
    };
  };
}

export interface operations {
  scan: {
    parameters: {
      path: {
        libraryId: string;
      };
    };
    responses: {
      /** Accepted */
      202: unknown;
    };
  };
  getAll: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["LibraryDto"][];
        };
      };
    };
  };
  addOne: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["LibraryDto"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["LibraryCreationDto"];
      };
    };
  };
  getOne: {
    parameters: {
      path: {
        libraryId: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["LibraryDto"];
        };
      };
    };
  };
  updateOne: {
    parameters: {
      path: {
        libraryId: string;
      };
    };
    responses: {
      /** No Content */
      204: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["LibraryUpdateDto"];
      };
    };
  };
  deleteOne: {
    parameters: {
      path: {
        libraryId: string;
      };
    };
    responses: {
      /** No Content */
      204: never;
    };
  };
  refreshMetadata: {
    parameters: {
      path: {
        libraryId: string;
      };
    };
    responses: {
      /** Accepted */
      202: unknown;
    };
  };
  analyze: {
    parameters: {
      path: {
        libraryId: string;
      };
    };
    responses: {
      /** Accepted */
      202: unknown;
    };
  };
  getClaimStatus: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["ClaimStatus"];
        };
      };
    };
  };
  claimAdmin: {
    parameters: {
      header: {
        "X-Komga-Email": string;
        "X-Komga-Password": string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["UserDto"];
        };
      };
    };
  };
  getAll_1: {
    parameters: {
      query: {
        search?: string;
        library_id?: string[];
        unpaged?: boolean;
        /** Zero-based page index (0..N) */
        page?: number;
        /** The size of the page to be returned */
        size?: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["PageCollectionDto"];
        };
      };
    };
  };
  addOne_1: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["CollectionDto"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionCreationDto"];
      };
    };
  };
  getSeriesForCollection: {
    parameters: {
      path: {
        id: string;
      };
      query: {
        unpaged?: boolean;
        /** Zero-based page index (0..N) */
        page?: number;
        /** The size of the page to be returned */
        size?: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["PageSeriesDto"];
        };
      };
    };
  };
  getOne_1: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["CollectionDto"];
        };
      };
    };
  };
  deleteOne_1: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** No Content */
      204: never;
    };
  };
  updateOne_1: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** No Content */
      204: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionUpdateDto"];
      };
    };
  };
  getCollectionThumbnail: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** default response */
      default: {
        content: {
          "image/jpeg": string;
        };
      };
    };
  };
  getAllBooks: {
    parameters: {
      query: {
        search?: string;
        library_id?: string[];
        media_status?: (
          | "UNKNOWN"
          | "ERROR"
          | "READY"
          | "UNSUPPORTED"
          | "OUTDATED"
        )[];
        read_status?: ("UNREAD" | "READ" | "IN_PROGRESS")[];
        unpaged?: boolean;
        /** Zero-based page index (0..N) */
        page?: number;
        /** The size of the page to be returned */
        size?: number;
        /** Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
        sort?: string[];
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["PageBookDto"];
        };
      };
    };
  };
  /** Return newly added or updated books. */
  getLatestBooks: {
    parameters: {
      query: {
        unpaged?: boolean;
        /** Zero-based page index (0..N) */
        page?: number;
        /** The size of the page to be returned */
        size?: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["PageBookDto"];
        };
      };
    };
  };
  refreshMetadata_1: {
    parameters: {
      path: {
        bookId: string;
      };
    };
    responses: {
      /** Accepted */
      202: unknown;
    };
  };
  updateMetadata: {
    parameters: {
      path: {
        bookId: string;
      };
    };
    responses: {
      /** No Content */
      204: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["BookMetadataUpdateDto"];
      };
    };
  };
  analyze_1: {
    parameters: {
      path: {
        bookId: string;
      };
    };
    responses: {
      /** Accepted */
      202: unknown;
    };
  };
  getBookPage: {
    parameters: {
      path: {
        bookId: string;
        pageNumber: number;
      };
      query: {
        /** Convert the image to the provided format. */
        convert?: "jpeg" | "png";
        /** If set to true, pages will start at index 0. If set to false, pages will start at index 1. */
        zero_based?: boolean;
      };
    };
    responses: {
      /** default response */
      default: {
        content: {
          "image/*": string;
        };
      };
    };
  };
  deleteReadProgress: {
    parameters: {
      path: {
        bookId: string;
      };
    };
    responses: {
      /** No Content */
      204: never;
    };
  };
  markReadProgress: {
    parameters: {
      path: {
        bookId: string;
      };
    };
    responses: {
      /** No Content */
      204: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ReadProgressUpdateDto"];
      };
    };
  };
  /** Return first unread book of series with at least one book read and no books in progress. */
  getBooksOnDeck: {
    parameters: {
      query: {
        /** Zero-based page index (0..N) */
        page?: number;
        /** The size of the page to be returned */
        size?: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["PageBookDto"];
        };
      };
    };
  };
  getOneBook: {
    parameters: {
      path: {
        bookId: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["BookDto"];
        };
      };
    };
  };
  getBookSiblingPrevious: {
    parameters: {
      path: {
        bookId: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["BookDto"];
        };
      };
    };
  };
  getBookSiblingNext: {
    parameters: {
      path: {
        bookId: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["BookDto"];
        };
      };
    };
  };
  getBookThumbnail: {
    parameters: {
      path: {
        bookId: string;
      };
    };
    responses: {
      /** default response */
      default: {
        content: {
          "image/jpeg": string;
        };
      };
    };
  };
  /** Download the book file. */
  getBookFile: {
    parameters: {
      path: {
        bookId: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/octet-stream": components["schemas"]["StreamingResponseBody"];
        };
      };
    };
  };
  /** Download the book file. */
  getBookFile_1: {
    parameters: {
      path: {
        bookId: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/octet-stream": components["schemas"]["StreamingResponseBody"];
        };
      };
    };
  };
  getBookPages: {
    parameters: {
      path: {
        bookId: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["PageDto"][];
        };
      };
    };
  };
  getBookPageThumbnail: {
    parameters: {
      path: {
        bookId: string;
        pageNumber: number;
      };
    };
    responses: {
      /** default response */
      default: {
        content: {
          "image/jpeg": string;
        };
      };
    };
  };
  getDirectoryListing: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["DirectoryListingDto"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["DirectoryRequestDto"];
      };
    };
  };
  delete: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** No Content */
      204: never;
    };
  };
  updateUserRoles: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** No Content */
      204: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RolesUpdateDto"];
      };
    };
  };
  getAll_2: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["UserWithSharedLibrariesDto"][];
        };
      };
    };
  };
  addOne_2: {
    responses: {
      /** Created */
      201: {
        content: {
          "application/json": components["schemas"]["UserDto"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserCreationDto"];
      };
    };
  };
  updatePassword: {
    responses: {
      /** No Content */
      204: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PasswordUpdateDto"];
      };
    };
  };
  getMe: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["UserDto"];
        };
      };
    };
  };
  updateSharesLibraries: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** No Content */
      204: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SharedLibrariesUpdateDto"];
      };
    };
  };
  getAuthors: {
    parameters: {
      query: {
        search?: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": string[];
        };
      };
    };
  };
  refreshMetadata_2: {
    parameters: {
      path: {
        seriesId: string;
      };
    };
    responses: {
      /** Accepted */
      202: unknown;
    };
  };
  updateMetadata_1: {
    parameters: {
      path: {
        seriesId: string;
      };
    };
    responses: {
      /** No Content */
      204: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SeriesMetadataUpdateDto"];
      };
    };
  };
  analyze_2: {
    parameters: {
      path: {
        seriesId: string;
      };
    };
    responses: {
      /** Accepted */
      202: unknown;
    };
  };
  markAsRead: {
    parameters: {
      path: {
        seriesId: string;
      };
    };
    responses: {
      /** No Content */
      204: never;
    };
  };
  markAsUnread: {
    parameters: {
      path: {
        seriesId: string;
      };
    };
    responses: {
      /** No Content */
      204: never;
    };
  };
  /** Return recently added or updated series. */
  getLatestSeries: {
    parameters: {
      query: {
        unpaged?: boolean;
        /** Zero-based page index (0..N) */
        page?: number;
        /** The size of the page to be returned */
        size?: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["PageSeriesDto"];
        };
      };
    };
  };
  /** Return newly added series. */
  getNewSeries: {
    parameters: {
      query: {
        unpaged?: boolean;
        /** Zero-based page index (0..N) */
        page?: number;
        /** The size of the page to be returned */
        size?: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["PageSeriesDto"];
        };
      };
    };
  };
  /** Return recently updated series, but not newly added ones. */
  getUpdatedSeries: {
    parameters: {
      query: {
        unpaged?: boolean;
        /** Zero-based page index (0..N) */
        page?: number;
        /** The size of the page to be returned */
        size?: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["PageSeriesDto"];
        };
      };
    };
  };
  getOneSeries: {
    parameters: {
      path: {
        seriesId: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["SeriesDto"];
        };
      };
    };
  };
  getSeriesThumbnail: {
    parameters: {
      path: {
        seriesId: string;
      };
    };
    responses: {
      /** default response */
      default: {
        content: {
          "image/jpeg": string;
        };
      };
    };
  };
  getAllBooksBySeries: {
    parameters: {
      path: {
        seriesId: string;
      };
      query: {
        media_status?: (
          | "UNKNOWN"
          | "ERROR"
          | "READY"
          | "UNSUPPORTED"
          | "OUTDATED"
        )[];
        read_status?: ("UNREAD" | "READ" | "IN_PROGRESS")[];
        unpaged?: boolean;
        /** Zero-based page index (0..N) */
        page?: number;
        /** The size of the page to be returned */
        size?: number;
        /** Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
        sort?: string[];
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["PageBookDto"];
        };
      };
    };
  };
  getAllCollectionsBySeries: {
    parameters: {
      path: {
        seriesId: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["CollectionDto"][];
        };
      };
    };
  };
  getAllSeries: {
    parameters: {
      query: {
        search?: string;
        library_id?: string[];
        collection_id?: number[];
        status?: ("ENDED" | "ONGOING" | "ABANDONED" | "HIATUS")[];
        read_status?: ("UNREAD" | "READ" | "IN_PROGRESS")[];
        unpaged?: boolean;
        /** Zero-based page index (0..N) */
        page?: number;
        /** The size of the page to be returned */
        size?: number;
        /** Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
        sort?: string[];
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["PageSeriesDto"];
        };
      };
    };
  };
}