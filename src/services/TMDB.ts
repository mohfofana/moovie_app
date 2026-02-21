import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_KEY, TMDB_API_BASE_URL } from "@/utils/config";

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({ baseUrl: TMDB_API_BASE_URL }),

  endpoints: (builder) => ({
    getShows: builder.query({
      query: ({
        category,
        type,
        searchQuery,
        page,
        showSimilarShows,
        id,
      }: {
        category: string | undefined;
        type?: string;
        page?: number;
        searchQuery?: string;
        showSimilarShows?: boolean;
        id?: number;
      }) => {
        const locale =
          typeof window !== "undefined"
            ? localStorage.getItem("locale") || "fr"
            : "fr";
        const language = locale === "en" ? "en-US" : "fr-FR";

        if (searchQuery) {
          return `search/${category}?api_key=${API_KEY}&query=${searchQuery}&page=${page}&language=${language}`;
        }

        if (showSimilarShows) {
          return `${category}/${id}/similar?api_key=${API_KEY}&language=${language}`;
        }

        return `${category}/${type}?api_key=${API_KEY}&page=${page}&language=${language}`;
      },
    }),

    getShow: builder.query({
      query: ({ category, id }: { category: string; id: number }) => {
        const locale =
          typeof window !== "undefined"
            ? localStorage.getItem("locale") || "fr"
            : "fr";
        const language = locale === "en" ? "en-US" : "fr-FR";
        return `${category}/${id}?append_to_response=videos,credits&api_key=${API_KEY}&language=${language}`;
      },
    }),
  }),
});

export const { useGetShowsQuery, useGetShowQuery } = tmdbApi;
