export const ASSET_URL_CODEC_PORT = Symbol('ASSET_URL_CODEC_PORT');
export const ASSET_URL_CODEC_OPTIONS = Symbol('ASSET_URL_CODEC_OPTIONS');

export type AssetCategory = 'quizImage';

export interface AssetUrlCodecOptions {
  category: AssetCategory;
}

export interface AssetUrlCodecPort {
  buildUrl(fileName: string): string;
  parseUrl(url: string): string;
  isValidUrl(url: string): boolean;
}
