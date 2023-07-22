import Mock from 'mockjs'
import qs from 'query-string'
import setupMock, { successResponseWrap } from '@/utils/setupMock'
import { GetParams } from '@/types/global'

const { Random } = Mock

const data = Mock.mock({
  'data|35': [
    {
      'id|8': /[0-9]/,
      'account|1-3': /[A-Z][a-z][0-9]/,
      'isPhoneVerified|1': [true, false],
      'isKycVerified|1': [true, false],
      'isEmailVerified|1': [true, false],
      lastLoginedAt: Random.datetime(),
      'lastPlaceLoginedAt|1': ['last ip1', 'last ip2'],
      signupAt: Random.datetime(),
      'signupPlaceAt|1': ['sign ip1', 'sign ip2'],
      'promotionCode|1-3': /[A-Z][a-z][0-9]/,
    },
  ],
  meta: {
    total: 50,
    perPage: 20,
    currentPage: 1,
    'lastPage|1-10': 3,
    'firstPage|1-10': 1,
  },
})

setupMock({
  setup() {
    Mock.mock(new RegExp('/v1/admins/users'), (params: GetParams) => {
      const { page = 1, per = 20 } = qs.parseUrl(params.url).query
      const p = page as number
      const ps = per as number
      return successResponseWrap({
        data: data.data.slice((p - 1) * ps, p * ps),
        meta: data.meta,
      })
    })
  },
})
