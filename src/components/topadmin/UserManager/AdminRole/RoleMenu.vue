<template>
    <DialogForm :title="submitText" :submit-text="submitText" :class="class" :size="size" :status="status"
        :is-ready-to-show="openShow" @click-button="openForm" @pop-submit="SubmitForm()">
        <template #content>
            <ATree v-model:checked-keys="checkedKeys" :only-check-leaf="true" :data="treeData" @check="checkId" checkable>
            </ATree>
        </template>
    </DialogForm>
</template>
    
<script lang="ts" setup>
import { ref, h } from 'vue'
import DialogForm from '@/components/Dialog/DialogForm.vue'

import { Message } from '@arco-design/web-vue'
const visible = ref(false)
const openShow = ref(false)
const checkedKeys = ref([])
const menus = ref<number[]>([])
const menu_id = ref(0)
const emit = defineEmits(['update:value', 'clickButton'])
const props = defineProps({
    submitText: {
        type: String,
        default: '',
    },
    type: {
        type: Number,
        default: 0,
    },
    class: {
        type: String,
        default: '',
    },
    size: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        default: 'normal',
    },
    formDataItem: {
        type: Object,
        default() {
            return {}
        },
    },
    treeData: {
        type: Array,
        default: [],
    }
})

const checkId = (data: Array<number>, checkedKeys: any) => {
    checkedKeys.value = data.concat(checkedKeys.halfCheckedKeys)
    menus.value = data.concat(checkedKeys.halfCheckedKeys)
}
const openForm = () => {
    menus.value = props.formDataItem.menus || []
    checkedKeys.value = props.formDataItem.menus || []

    openShow.value = true
    emit('clickButton')
}
const SubmitForm = async () => {
    emit('update:value', menus.value)
    openShow.value = false
}


</script>
    
<style scoped lang="less"></style>
  
    