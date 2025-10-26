import { Test } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { ENV_KEY } from '@common/app-config/app-config.constant';
import { AppConfigModule } from '@common/app-config/app-config.module';
import { AppConfigService } from '@common/app-config/app-config.service';

import {
  ASSET_URL_CODEC_OPTIONS,
  ASSET_URL_CODEC_PORT,
  AssetUrlCodecOptions,
  AssetUrlCodecPort,
} from '@shared/asset/asset-url-codec.port';
import { AssetUrlCodec } from '@shared/asset/asset-url.codec';
import { InvalidAssetUrlError } from '@shared/asset/errors/invalid-asset-url.error';

describe(AssetUrlCodec.name, () => {
  let codec: AssetUrlCodecPort;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let options: AssetUrlCodecOptions;
  let appConfigService: AppConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [
        {
          provide: ASSET_URL_CODEC_OPTIONS,
          useValue: {
            category: 'quizImage',
          },
        },
        {
          provide: ASSET_URL_CODEC_PORT,
          useClass: AssetUrlCodec,
        },
      ],
    }).compile();

    codec = module.get<AssetUrlCodec>(ASSET_URL_CODEC_PORT);
    options = module.get<AssetUrlCodecOptions>(ASSET_URL_CODEC_OPTIONS);
    appConfigService = module.get<AppConfigService>(AppConfigService);
  });

  describe(AssetUrlCodec.prototype.buildUrl.name, () => {
    let fileName: string;

    beforeEach(() => {
      fileName = faker.string.nanoid();
    });

    it('url을 빌드할 수 있다.', () => {
      expect(codec.buildUrl(fileName)).toBe(
        `${appConfigService.get<string>(ENV_KEY.AWS_S3_URL)}/${appConfigService.get<string>(
          ENV_KEY.AWS_S3_QUIZ_IMAGE_FILE_PATH,
        )}/${fileName}`,
      );
    });
  });

  describe(AssetUrlCodec.prototype.parseUrl.name, () => {
    let fileName: string;
    let url: string;

    beforeEach(() => {
      fileName = faker.string.nanoid();
      url = `${appConfigService.get<string>(ENV_KEY.AWS_S3_URL)}/${appConfigService.get<string>(
        ENV_KEY.AWS_S3_QUIZ_IMAGE_FILE_PATH,
      )}/${fileName}`;
    });

    it('url을 파싱할 수 있다.', () => {
      expect(codec.parseUrl(url)).toBe(url.split('/').pop() as string);
    });

    it('url이 유효하지 않은 경우 유혀하지 않은 url이라는 에러가 발생해야한다.', () => {
      expect(() => codec.parseUrl(faker.internet.url())).toThrow(
        InvalidAssetUrlError,
      );
    });
  });

  describe(AssetUrlCodec.prototype.isValidUrl.name, () => {
    let fileName: string;
    let url: string;

    beforeEach(() => {
      fileName = faker.string.nanoid();
      url = `${appConfigService.get<string>(ENV_KEY.AWS_S3_URL)}/${appConfigService.get<string>(
        ENV_KEY.AWS_S3_QUIZ_IMAGE_FILE_PATH,
      )}/${fileName}`;
    });

    it('유효한 url인 경우 true를 반환해야한다.', () => {
      expect(codec.isValidUrl(url)).toBe(true);
    });

    it('유효하지 않은 url인 경우 false를 반환해야한다.', () => {
      expect(codec.isValidUrl(faker.internet.url())).toBe(false);
    });
  });
});
