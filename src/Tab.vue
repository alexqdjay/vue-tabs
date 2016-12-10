<template>
<li :class="{'active': tabData.active, 'loading': tabData.loading}">{{tabData.meta.title}}<span class="btn-close" @click.stop="close">&times;</span></li>
</template>
<script>
export default {
    props: {
        tabData: Object
    },
    methods: {
        close () {
            this.$emit('close', this.tabData)
        }
    }
}
</script>