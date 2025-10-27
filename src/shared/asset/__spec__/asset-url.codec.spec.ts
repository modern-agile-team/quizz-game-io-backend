import { faker } from '@faker-js/faker';

import { ENV_KEY } from '@common/app-config/app-config.constant';

import { AssetUrlManager } from '@shared/asset/asset-url.manager';
import { InvalidAssetUrlError } from '@shared/asset/errors/invalid-asset-url.error';

describe(AssetUrlManager.name, () => {
  let manager: typeof AssetUrlManager;

  beforeEach(async () => {
    manager = AssetUrlManager;
  });

  describe(AssetUrlManager.fileNameToUrl.name, () => {
    let fileName: string;

    beforeEach(() => {
      fileName = faker.string.nanoid();
    });

    it('url을 빌드할 수 있다.', () => {
      expect(manager.fileNameToUrl(fileName, 'quizImage')).toBe(
        `${process.env[ENV_KEY.AWS_S3_URL]}/${
          process.env[ENV_KEY.AWS_S3_QUIZ_IMAGE_FILE_PATH]
        }/${fileName}`,
      );
    });
  });

  describe(AssetUrlManager.urlToFileName.name, () => {
    let fileName: string;
    let url: string;

    beforeEach(() => {
      fileName = faker.string.nanoid();
      url = `${process.env[ENV_KEY.AWS_S3_URL]}/${
        process.env[ENV_KEY.AWS_S3_QUIZ_IMAGE_FILE_PATH]
      }/${fileName}`;
    });

    it('url을 파싱할 수 있다.', () => {
      expect(manager.urlToFileName(url, 'quizImage')).toBe(
        url.split('/').pop() as string,
      );
    });

    it('url이 유효하지 않은 경우 유혀하지 않은 url이라는 에러가 발생해야한다.', () => {
      expect(() =>
        manager.urlToFileName(faker.internet.url(), 'quizImage'),
      ).toThrow(InvalidAssetUrlError);
    });
  });

  describe(AssetUrlManager.isValidUrl.name, () => {
    let fileName: string;
    let url: string;

    beforeEach(() => {
      fileName = faker.string.nanoid();
      url = `${process.env[ENV_KEY.AWS_S3_URL]}/${
        process.env[ENV_KEY.AWS_S3_QUIZ_IMAGE_FILE_PATH]
      }/${fileName}`;
    });

    it('유효한 url인 경우 true를 반환해야한다.', () => {
      expect(manager.isValidUrl(url, 'quizImage')).toBe(true);
    });

    it('유효하지 않은 url인 경우 false를 반환해야한다.', () => {
      expect(manager.isValidUrl(faker.internet.url(), 'quizImage')).toBe(false);
    });
  });
});
