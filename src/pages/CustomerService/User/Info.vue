<template>
  <div class="container">
    <ASpace v-if="userStore.createdAt" class="content" direction="vertical" size="large" fill>
      <ACard :title="$t(`userInfo.info`)">
        <ADescriptions :column="{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }" bordered>
          <ADescriptionsItem
            v-for="item of [
              { key: 'id', label: 'form.id' },
              { key: 'nickname', label: 'form.nickname' },
              { key: 'isBan', label: 'form.userStatus' },
              { key: 'vipLevelId', label: 'form.userLevel' },
              { key: 'phoneNumber', label: 'form.phoneNumber' },
              { key: 'email', label: 'form.email' },
              { key: 'cpf', label: 'form.cpf' },
            ]"
            :key="item.key"
            :label="$t(item.label)"
          >
            <CheckObjectKeyExist :object="userStore" :object-key="item.key">
              <template v-if="item.key === 'isBan'" #content>
                <span>
                  {{
                  userStore[item.key]
                  ? $t('userInfo.status.ban')
                  : $t('userInfo.status.normal')
                  }}
                </span>
              </template>
            </CheckObjectKeyExist>
          </ADescriptionsItem>
        </ADescriptions>
      </ACard>
      <ACard :title="$t(`userInfo.userTag`)">
        <ASpace wrap fill>
          <ATag v-for="tag in userStore.tagList" :key="tag">
            {{
            $t(`userTag.${tag}`)
            }}
          </ATag>
        </ASpace>
      </ACard>
      <ACard>
        <ASpace direction="vertical" :size="24" fill>
          <ADescriptions :column="{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }" bordered>
            <ADescriptionsItem
              v-for="item of [
                'affiliateName',
                'channelName',
                'referralUserId',
                'referralUserCount',
              ]"
              :key="item"
              :label="$t(`form.${item}`)"
            >
              <CheckObjectKeyExist :object="userStore" :object-key="item" />
            </ADescriptionsItem>
          </ADescriptions>
          <ADescriptions :column="{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 4 }" bordered>
            <ADescriptionsItem
              v-for="item of [
                { key: 'currentSignInIp', title: 'lastSignInIp' },
                { key: 'currentSignInAt', title: 'lastSignInAt' },
                { key: 'registerIp', title: 'registerIp' },
                { key: 'createdAt', title: 'createdAt' },
                { key: 'currentSignInDevice', title: 'lastSignInAtDevice' },
              ]"
              :key="item.key"
              :label="$t(`form.${item.title}`)"
            >
              <CheckObjectKeyExist :object="userStore" :object-key="item.key" />
            </ADescriptionsItem>
          </ADescriptions>
        </ASpace>
      </ACard>
      <!--      <ACard :title="$t('userInfo.action')">-->
      <!--        <ASpace :size="16">-->
      <!--          <AButton type="outline">{{ $t('userInfo.action.suspend') }}</AButton>-->
      <!--          <AButton type="outline">{{-->
      <!--            $t('userInfo.action.resendSMSCode')-->
      <!--          }}</AButton>-->
      <!--          <AButton type="outline">{{-->
      <!--            $t('userInfo.action.resendEmailCode')-->
      <!--          }}</AButton>-->
      <!--          <AButton type="outline">{{ $t('userInfo.action.edit') }}</AButton>-->
      <!--        </ASpace>-->
      <!--      </ACard>-->
    </ASpace>
    <AEmpty v-else :description="$t('empty.noUsers')" class="empty-content" />
  </div>
</template>

<script lang="ts" setup>
import { useMeStore } from '@/store'
import CheckObjectKeyExist from '@/components/Components/CheckObjectKeyExist.vue'

const userStore = useMeStore()
</script>

<style scoped lang="less"></style>
