<template>
    <ASelect :model-value="value" :placeholder="$t('label.gameName.placeholder')" allow-clear allow-search
        :loading="isLoading" @input-value-change="inputValueChange" @popup-visible-change="onClick"
        @dropdown-reach-bottom="handleReachBottom" @change="updateValue">
        <AOption v-for="option of (options as GamesOption[])" :key="option.id" :value="option.id" :label="option.name"
            class="option-box" />
        <AOption v-if="showLoardMore && !isEnd" disabled>
            <div class="py-1">Load more
                <IconLoading />
            </div>
        </AOption>
    </ASelect>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { requestHandler } from '@/utils/tool'
// import { queryGames } from '@/api/option'

export interface GamesOption {
    id: number
    name: string
}

const emit = defineEmits(['update:value'])
const props = defineProps({
    value: {
        type: [String, Number],
        default: null,
    },
    parentValue: {
        type: Number,
        default: null,
    },
})

const isLoading = ref(false)
const options = ref([])
const provider = ref<number>(0)
const searchValue = ref<string>('')
const totalPages = ref(0)
const pagination = reactive({
    current: 1,
    pageSize: 100,
})

const isEnd = computed(() => {
    return pagination.current >= totalPages.value
})
const showLoardMore = ref(true)
const onClick = () => {
    if (options.value.length) return
    fetchData()
}
const updateValue = (value: number) => {
    emit('update:value', value)
}
const handleReachBottom = async () => {
    if (isEnd.value) {
        showLoardMore.value = false
        return
    }
    pagination.current++
    loadMore()
}
const inputValueChange = (inputValue: string) => {
    searchValue.value = inputValue
    if (options.value.find((item) => item.name === inputValue) || isEnd.value) {
        return
    }
    loadMore()
}
const loadMore = requestHandler(async () => {
    if (!props.parentValue) return
    // const response = await queryGames({
    //     providerId: props.parentValue,
    //     searchName: searchValue.value,
    //     ...pagination,
    // })
    // response.data.games.forEach((game) => {
    //     if (options.value.find((item) => item.id === game.id)) {
    //         return
    //     }
    //     options.value.push(game)
    // })
})
const fetchData = requestHandler(async () => {
    if (!props.parentValue) return
    // const response = await queryGames({
    //     providerId: props.parentValue,
    //     searchName: searchValue.value,
    //     ...pagination,
    // })
    // provider.value = props.parentValue
    // options.value = response.data.games || []
    // totalPages.value = response.data.meta.totalPages
}, isLoading)

watch(
    () => props.parentValue,
    (newVal) => {
        if (provider.value === newVal || !newVal) return
        options.value = []
        pagination.current = 1
        showLoardMore.value = true
    }
)
</script>
