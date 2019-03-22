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
      },
      listenScroll: {
        type: Boolean,
        default: false // 要不要监听滚动事件
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
        if (this.listenScroll) {
          let me = this // 箭头函数中代理this
          this.scroll.on('scroll', (pos) => { // 监听scroll事件
            me.$emit('scroll', pos) // 派发一个scroll事件，传递pos位置对象：有x和y属性
          })
        }
      },
      enable() { // 启用 better-scroll，默认开启
        this.scroll && this.scroll.enable()
      },
      disable() { // 禁用better-scroll, 如果不加，scroll的高度会高于内容的高度
        this.scroll && this.scroll.disable()
      },
      refresh() { // 强制 scroll 重新计算，当 better-scroll 中的元素发生变化的时候调用此方法
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        // 滚动到指定的位置；这里使用apply 将传入的参数，传入到this.scrollTo()
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        // 滚动到指定的目标元素
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
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
