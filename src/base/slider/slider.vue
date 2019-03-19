<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from 'common/js/dom'
  import BScroll from 'better-scroll'

  export default {
    name: 'slider',
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted() { // 初始化BScroll的时机：必须保证组件已经渲染好了，DOM高度已经被撑开
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()

        if (this.autoPlay) {
          this._play()
        }
      }, 20) // 浏览器刷新一般17ms

      window.addEventListener('resize', () => { // 在滚动中，改变视口大小，图片会同时显示两张，因为之前设置好的width都没变
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true) // 如果窗口变和不变时都调用_setSlideWidth()，就会执行两次width += 2 * sliderWidth，这一定是不对的 调用_setSlideWidth()，需要同时传入一个参数，用来判断窗口是否改变了
        this.slider.refresh()
      })
    },
    activated() {
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated() {
      clearTimeout(this.timer)
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods: {
      _setSliderWidth(isResize) { // // 横向滚动初始化bscroll之前要下计算宽度，因为横向不能被自动撑宽
        this.children = this.$refs.sliderGroup.children
        console.log(this.children.length)
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth // 父容器宽度，设置每张图片的宽度都与父容器的宽度相同
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px' // 为每张图片设置宽度
          width += sliderWidth // 计算所有图片的总宽度
        }
        if (this.loop && !isResize) { // loop轮播实现的时候会左右克隆两个DOM，所以长度要增加
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px' // 设置slider-group(内容区的宽度)
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: { // 新版本将snap的属性都当成一个对象来书写
            loop: this.loop, // 循环
            threshold: 0.3,
            speed: 400, // 轮播间隔
            click: true
          }
        })
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          this.currentPageIndex = pageIndex

          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })

        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _play() {
        this.timer = setTimeout(() => {
          this.slider.next()
        }, this.interval)
      } // 自动播放
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
