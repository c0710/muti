<template>
    <div id="app">
        <ul class="ul" v-if="pages.length">
            <li v-for="(item, index) in pages" :key="index">
                <a :href="`/${item.name}`">{{ item.name }}</a>
            </li>
        </ul>
        <div v-else>none</div>
    </div>
</template>

<script>
export default {
    name: 'app',
    data() {
        return {
            pages: process.pages
        };
    },
    components: {}
};
</script>

<style scoped>
#app {
    line-height: 2em;
    text-align: center;
}

a {
    display: inline-block;
    width: 100%;
}
</style>
