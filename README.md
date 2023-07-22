# Backstage

## Prerequisites

- Node.js v14

## Development Server

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

Locally preview production build:

```bash
yarn preview
```

# 命名規範

## 路由

src/router/routes/系統資料夾名

- 系統資料夾名: 大駝峰 UpperCamel
- 檔名: 小駝峰 lowerCamel
- 檔名範例:
  - `src/router/routes/Operation/modules/user.ts`
  - `src/router/routes/CustomerService/index.ts`

```javascript
/**
 * path: kebab-case
 * name: 大駝峰 UpperCamel
 */

{
  path: '/key-data',
  name: 'KeyData',
}
```

## API

- 檔名: 小駝峰 lowerCamel
- 檔名範例: `src/api/user.ts`

```javascript
/**
 * interface: 大駝峰 UpperCamel
 * 函式名: 小駝峰 lowerCamel
 * 參數名: 小駝峰 lowerCamel
 */

export interface ResetMePasswordParams {
  oldPassword: string
  newPassword: string
  otpCode?: string
}

export function resetMePassword(params: ResetMePasswordParams) {
  return axios.patch('/v1/reset_password', {
    old_password: params.oldPassword,
    new_password: params.newPassword,
    otp_code: params.otpCode
  })
}
```

## Pages

src/pages/系統資料夾名/頁面資料夾名

- 系統資料夾名: 大駝峰 UpperCamel
- 頁面資料夾名: 大駝峰 UpperCamel
- 檔名: 大駝峰 UpperCamel
- 檔名範例: `src/pages/CustomerService/User/Info.vue`

```javascript
/**
 * 引用路徑使用絕對位置 '@/components/...'
 * 引用組件標籤在 template 使用大駝峰 UpperCamel
 * template 中 props name 使用 kebab-case
 */

<LoginBanner
  title-align="start"
  :style-class="isDark ? 'dark' : 'normal'"
/>
// other code ...
import LoginBanner from '@/components/Login/LoginBanner.vue'
```

## Components

src/components/組件資料夾名

- 組件資料夾名: 大駝峰 UpperCamel
- 檔名: 大駝峰 UpperCamel
- 檔名範例: `src/components/Selects/SelectAgent.vue`

# 菜單權限

1. API 取得的菜單 `index: string` 數據組成 `permissionsArray: string[]`
   (`src/store/modules/me/index.ts`)
2. 在路由對應 path 加入 meta `permissions` 屬性。如下範例:
   (`src/router/routes/Configuration/modules/keyData.ts`)
   ```javascript
    {
      path: 'platform-data/daily-total-data',
      name: 'DailyTotalData',
      component: () =>
        import('@/pages/Configuration/KeyData/PlatformData/DailyTotalData.vue'),
      meta: {
        locale: '日总数据',
        requiresAuth: true,
        permissions: ['DailyTotalData.read'], // 加入 permissions
      },
    },
   ```

目前為方便開發，所有菜單權限皆註解中
