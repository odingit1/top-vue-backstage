<template>
    <AButton class="px-5" :disabled="disabled" :type="type" @click="onClick">
        <slot name="buttonTitle">
            {{ submitText }}
        </slot>
        <AModal :visible="isOpenPop" :title="title ? title : submitText" :width="width"
            :modal-style="{ 'max-width': '90%' }" :footer="!hideFooter" @before-ok="handleSubmit" @cancel="closePop">
            <slot name="content">
                <json-viewer v-if="isJson" :value="jsonData" copyable boxed sort />
                <span v-else>{{ content }}</span>
            </slot>
        </AModal>
    </AButton>
</template>
  
<script lang="ts" setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['popSubmit', 'clickButton'])
const jsonData = ref({})
const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    request: {
        type: Function,
        default() {
            return false
        },
    },
    submitText: {
        type: String,
        default: '',
    },
    width: {
        type: [String, Number],
        default: 800,
    },
    type: {
        type: String,
        default: 'primary',
    },
    content: {
        type: String,
        default: '',
    },

    hideFooter: {
        type: Boolean,
        default: false,
    },
    isReadyToClose: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
})
const isOpenPop = ref(false)
const isJson = ref(true)
const onClick = async () => {
    try {
        if (typeof JSON.parse(props.content) == 'object') {
            try {
                jsonData.value = JSON.parse(props.content)
            } catch (error) {
                isJson.value = false
            }
        }
    } catch (err) {
        jsonData.value = { content: props.content }
    }
    emit('clickButton')
    isOpenPop.value = true
}
const closePop = () => {
    isOpenPop.value = false
}
const handleSubmit = async (done: (closed: boolean) => void) => {
    emit('popSubmit')
    done(true)
    closePop()
}

watch(
    () => props.isReadyToClose,
    (newVal) => {
        if (newVal) {
            closePop()
        }
    }
)
</script>
  
<style  lang="less">
.jv-container .jv-code.boxed {
    overflow-y: scroll;
    max-height: 620px;
}
</style>
  