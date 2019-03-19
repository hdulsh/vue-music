<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import Bscroll from 'better-scroll'

  export default {
    name: 'scroll',
    props: { // probeType: 1 滚动的时候会派发scroll事件，会截流。2 滚动的时候实时派发scroll事件，不会截流 。3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
      probeType: {
        type: Number,
        default: 1
      }, // click: true 是否派发click事件，通常判断浏览器派发的click还是betterscroll派发的click，可以用event._constructed，若是bs派发的则为true
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new Bscroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
      },
      enable() { // 启用 better-scroll，默认开启
        this.scroll && this.scroll.enable()
      },
      disable() { // 禁用better-scroll, 如果不加，scroll的高度会高于内容的高度
        this.scroll && this.scroll.disable()
      },
      refresh() { // 强制 scroll 重新计算，当 better-scroll 中的元素发生变化的时候调用此方法
        this.scroll && this.scroll.refresh()
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
