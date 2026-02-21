import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type TmdbTitle = {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  popularity?: number;
  media_type: 'movie' | 'tv';
};

type TmdbListResponse = {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbTitle[];
};

@Injectable()
export class TmdbService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>(
      'TMDB_API_BASE_URL',
      'https://api.themoviedb.org/3',
    );
    this.apiKey = this.configService.get<string>('TMDB_API_KEY', '');
  }

  async getTrending(type: 'movie' | 'tv', language?: string): Promise<TmdbListResponse> {
    const lang = language || 'fr-FR';
    const url = `${this.baseUrl}/trending/${type}/week?api_key=${this.apiKey}&language=${lang}`;
    const data = await this.fetchJson<TmdbListResponse>(url);
    return {
      ...data,
      results: (data.results || []).map((item) => ({
        ...item,
        title: item.title || (item as { name?: string }).name || '',
        media_type: type,
      })),
    };
  }

  async search(query: string, type?: 'movie' | 'tv', language?: string): Promise<TmdbListResponse> {
    const lang = language || 'fr-FR';
    const endpoint = type ? `/search/${type}` : '/search/multi';
    const url = `${this.baseUrl}${endpoint}?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&language=${lang}`;
    const data = await this.fetchJson<TmdbListResponse>(url);

    const normalizedResults = (data.results || [])
      .map((item) => {
        const inferredType =
          type ||
          (item.media_type === 'tv'
            ? 'tv'
            : item.media_type === 'movie'
              ? 'movie'
              : undefined);

        if (!inferredType) {
          return null;
        }

        return {
          ...item,
          title: item.title || (item as { name?: string }).name || '',
          media_type: inferredType,
        };
      })
      .filter(Boolean) as TmdbTitle[];

    return {
      ...data,
      results: normalizedResults,
    };
  }

  async getDetails(tmdbId: number, type: 'movie' | 'tv', language?: string) {
    const lang = language || 'fr-FR';
    const url = `${this.baseUrl}/${type}/${tmdbId}?api_key=${this.apiKey}&language=${lang}&append_to_response=credits,videos`;
    return this.fetchJson<any>(url);
  }

  async getTvSeasons(tmdbId: number, language?: string) {
    const lang = language || 'fr-FR';
    const url = `${this.baseUrl}/tv/${tmdbId}?api_key=${this.apiKey}&language=${lang}`;
    const data = await this.fetchJson<any>(url);
    return data?.seasons || [];
  }

  async getTvSeasonDetails(tmdbId: number, seasonNumber: number, language?: string) {
    const lang = language || 'fr-FR';
    const url = `${this.baseUrl}/tv/${tmdbId}/season/${seasonNumber}?api_key=${this.apiKey}&language=${lang}`;
    return this.fetchJson<any>(url);
  }

  private async fetchJson<T>(url: string): Promise<T> {
    if (!this.apiKey) {
      throw new InternalServerErrorException('TMDB_API_KEY is missing');
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new InternalServerErrorException(`TMDB request failed with status ${res.status}`);
    }

    return (await res.json()) as T;
  }
}
