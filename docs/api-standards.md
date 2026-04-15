# API Standards

This document defines API calls and server-state conventions for the consistent integration, strong typing, and clear separation of concerns.

---

## Contents

1. [Core principles](#1-core-principles)
2. [Standard API flow](#2-standard-api-flow)
3. [Shared Axios instance](#3-shared-axios-instance)
4. [Base `Service` class](#4-base-service-class)
5. [Feature services](#5-feature-services)
6. [Request and response typing](#6-request-and-response-typing)
7. [React Query](#7-react-query)
8. [Component usage](#8-component-usage)
9. [Error handling](#9-error-handling)
10. [Authentication](#10-authentication)
11. [File organization](#11-file-organization)

---

## 1. Core Principles

- Do not call APIs directly from pages or UI components.
- Route all API calls through service classes that extend the shared base `Service`.
- Use the shared Axios instance for every service.
- Keep API logic (services), server-state orchestration (hooks), and UI separate.
- Type all request and response payloads.

---

## 2. Standard API Flow

Use this pipeline everywhere unless there is a strong, documented exception:

**UI → service method → shared Axios instance**

---

## 3. Shared Axios Instance

Use a single shared Axios instance for all HTTP traffic.

### Pattern

```ts
export const instanceApi: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  timeout: 60000,
});
```

### Rules

- Set `baseURL` from project config (`getApiBaseUrl()`), not per service.
- Set `withCredentials` according to the project auth strategy.
- Keep `timeout` and other global defaults on this instance only.
- Avoid extra Axios instances in feature code unless explicitly required.
- Centralize shared headers, interceptors, and cross-cutting behavior here.

---

## 4. Base Service Class

Every feature service extends the shared abstract `Service` class.

### Pattern

```ts
import { instanceApi } from "../config";

export abstract class Service {
  protected abstract apiPath: string;
  protected instanceApi = instanceApi;
}
```

### Rules

- Each service defines its own `apiPath`.
- Child services inherit `instanceApi`; do not duplicate Axios setup.
- Keep the base class small: shared API behavior only.

---

## 5. Feature Services

Services own direct HTTP communication for a domain or module.

### Rules

- One service per domain (e.g. auth, customer, orders).
- Extend `Service`; no UI or React Query code inside service files.
- Expose clear, typed methods that align with backend endpoints.

### Naming examples

- `auth-service.ts`
- `customer-service.ts`
- `order-service.ts`

### Example

```ts
export class CustomerService extends Service {
  protected apiPath = "customer";

  async getCertificateUrl(customerId: string): Promise<string> {
    const response = await this.instanceApi.get<string>(
      `/${this.apiPath}/${customerId}/certificate-url`,
    );
    return response.data;
  }
}
```

---

## 6. Request and Response Typing

- Define request types for creates, updates, and filters.
- Define response types (or reuse shared entities) for every method.
- Prefer shared types under `types/` (e.g. `types/api/`) over repeated inline shapes.

### Naming examples

- `GetOrdersParams`, `CreateOrderRequest`, `UpdateProfileRequest`
- `CustomerProfileResponse`

---

## 7. Component Usage

- Do not import Axios or `instanceApi` in UI files.
- Do not embed raw endpoint paths in components.
- Handle loading, empty, and error states in the UI; keep HTTP execution in services.

---

## 8. Error Handling

- Handle HTTP details near the API layer; show user-friendly messages in the UI.
- Do not surface raw technical errors to users unless intentional.
- Centralize auth/session/network handling where possible.
- Avoid duplicating error-mapping logic across many hooks or components.

---

## 10. Authentication

- Configure cookies/headers for auth on the shared Axios instance or shared API layer.
- Do not re-implement auth in each service method.
- Services stay focused on endpoints, not full auth flows.

---

## 11. File Organization

Suggested layout:

```text
src/
  config/
    api.ts
  services/
    service.ts
    auth-service.ts
    customer-service.ts
    order-service.ts
  types/
    api/
      common.ts
      auth.ts
      customer.ts
      order.ts
```

Adjust names to match the repo as it evolves; keep the same separation of concerns.
