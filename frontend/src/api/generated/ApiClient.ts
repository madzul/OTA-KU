/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AuthService } from './services/AuthService';
import { ConnectService } from './services/ConnectService';
import { DetailService } from './services/DetailService';
import { ListService } from './services/ListService';
import { OtpService } from './services/OtpService';
import { ProfileService } from './services/ProfileService';
import { StatusService } from './services/StatusService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class ApiClient {
  public readonly auth: AuthService;
  public readonly connect: ConnectService;
  public readonly detail: DetailService;
  public readonly list: ListService;
  public readonly otp: OtpService;
  public readonly profile: ProfileService;
  public readonly status: StatusService;
  public readonly request: BaseHttpRequest;
  constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
    this.request = new HttpRequest({
      BASE: config?.BASE ?? '',
      VERSION: config?.VERSION ?? '0.0.0',
      WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
      CREDENTIALS: config?.CREDENTIALS ?? 'include',
      TOKEN: config?.TOKEN,
      USERNAME: config?.USERNAME,
      PASSWORD: config?.PASSWORD,
      HEADERS: config?.HEADERS,
      ENCODE_PATH: config?.ENCODE_PATH,
    });
    this.auth = new AuthService(this.request);
    this.connect = new ConnectService(this.request);
    this.detail = new DetailService(this.request);
    this.list = new ListService(this.request);
    this.otp = new OtpService(this.request);
    this.profile = new ProfileService(this.request);
    this.status = new StatusService(this.request);
  }
}

