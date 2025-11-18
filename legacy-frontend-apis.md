# Legacy Frontend API Inventory

Source: files in `frontend/src/services/*`.  
Base URL configured in `frontend/src/services/api.ts` → `http://3.6.115.190:3001/api/v1` with shared Axios instance, JWT bearer injection, and refresh-token retry logic.

## `authService.ts`
| Method | Path | Notes |
| --- | --- | --- |
| `POST /auth/login` | Username/password login, returns tokens + user profile |
| `POST /auth/register` | Member self-registration |
| `POST /auth/refresh` | Refresh access token using `refreshToken` |
| `POST /auth/logout` | Server-side logout & token revocation |
| `GET /auth/profile` | Fetch authenticated user profile |
| `POST /auth/change-password` | Change password (requires current password) |
| `POST /auth/forgot-password` | Request password reset link |
| `POST /auth/reset-password` | Reset password with token |
| `POST /auth/verify-email` | Send verification email |
| `GET /auth/verify-email/:token` | Confirm email |

## `membersService.ts`
| Method | Path | Notes |
| --- | --- | --- |
| `GET /members` | List members (supports query params: page, status, etc.) |
| `GET /members/:id` | Member detail |
| `POST /members` | Create member |
| `PUT /members/:id` | Update member |
| `DELETE /members/:id` | Delete member |
| `POST /members/:id/dependents` | Add dependent |
| `GET /members/:id/dependents` | List dependents |

## `claimsService.ts`
| Method | Path | Notes |
| --- | --- | --- |
| `GET /claims` | List claims (filters supported) |
| `GET /claims/:id` | Claim detail |
| `POST /claims` | Submit claim |
| `PUT /claims/:id/approve` | Approve / update claim decision |

## `contributionsService.ts`
| Method | Path | Notes |
| --- | --- | --- |
| `GET /contributions/invoices` | List invoices |
| `GET /contributions/invoices/:id` | Invoice detail |
| `GET /contributions/plans` | Contribution/membership plans |

## `loansService.ts`
| Method | Path | Notes |
| --- | --- | --- |
| `GET /loans` | List loans |
| `GET /loans/:id` | Loan detail |
| `POST /loans` | Submit loan application |
| `PUT /loans/:id/approve` | Approve loan |

## `meetingsService.ts`
| Method | Path | Notes |
| --- | --- | --- |
| `GET /meetings` | List meetings |
| `GET /meetings/:id` | Meeting detail |
| `POST /meetings` | Create meeting |
| `PUT /meetings/:id` | Update meeting |

## `paymentsService.ts`
| Method | Path | Notes |
| --- | --- | --- |
| `GET /payments` | List payments |
| `GET /payments/:id` | Payment detail |
| `POST /payments` | Record payment |

## `auditService.ts`
| Method | Path | Notes |
| --- | --- | --- |
| `GET /audit/logs` | Query audit logs |

## `reportsService.ts`
| Method | Path | Notes |
| --- | --- | --- |
| `GET /reports/summary` | Summary dashboard metrics |
| `GET /reports/contributions` | Contributions-specific report |

> Frontend-specific behavior such as Redux persistence, interceptors, and error handling lives in `frontend/src/services/api.ts` and `frontend/src/store/*`. All functionality above has been migrated or is being reimplemented inside `next-front-end`. This document keeps a snapshot of the legacy API usage before removing the old CRA code.

