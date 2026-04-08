import { ApiClient } from '../api/ApiClient';

export abstract class BaseService {
  constructor(protected client: ApiClient) {}
}
