import { HttpMethod } from '../../Providers/Enum/HttpMethod'
import { BaseRequest } from './BaseRequest'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ProviderResponse } from '../../Models/ProviderResponse'

export class AxiosRequest extends BaseRequest<AxiosInstance> {
  constructor(private baseURL: string) {
    super()
  }

  public setBaseURL(baseURL: string) {
    this.baseURL = baseURL
    return this
  }

  createInstance(): this {
    if (this.instance) throw new Error('Instance already exists.')

    this.instance = axios.create({
      baseURL: this.baseURL
    })

    return this
  }

  public withHeaders(headers: any): this {
    this.instance.defaults.headers = headers
    return this
  }

  public addHeader(name: string, value: string): this {
    return this.withHeaders({
      ...this.instance.defaults.headers,
      [name]: value
    })
  }

  public getFullEndpoint(): string {
    let endpoint = this.endpoint
    if (this.params) {
      const params = []
      Object.keys(this.params).forEach(key => {
        params.push(`${key}=${this.params[key]}`)
      })

      endpoint += `${endpoint?.includes('?') ? '&' : '?'}${params.join('&')}`
    }

    return endpoint
  }

  public async send<T = any>(method: HttpMethod): Promise<ProviderResponse<T>> {
    try {
      let response: AxiosResponse<T> = null

      switch (method) {
        case HttpMethod.DELETE:
        case HttpMethod.GET:
          response = await this.instance[method.toLocaleLowerCase()](
            this.getFullEndpoint()
          )
          break

        case HttpMethod.PATCH:
        case HttpMethod.POST:
        case HttpMethod.PUT:
          response = await this.instance[method.toLocaleLowerCase()](
            this.getFullEndpoint(),
            this.getPayload()
          )
          break
      }

      return new ProviderResponse(response.status, response.data)
    } catch (e) {
      throw e
    } finally {
      this.clear()
    }
  }
}
