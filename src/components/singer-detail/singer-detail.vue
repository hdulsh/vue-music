<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail, getSongVkey} from 'src/api/singer'
  import {ERR_OK} from 'src/api/config'
  import {createSong} from 'common/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters([
        'singer' // 拿到getters.js中的singer
      ])
    },
    created() {
      this._getDetail()
    },
    methods: {
      _getDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normallizeSongs(res.data.list)
          }
        })
      },
      _normallizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item // 得到music对象
          getSongVkey(musicData.songmid).then((res) => {
            const songVkey = res.data.items[0].vkey
            if (musicData.songid && musicData.albummid) {
              ret.push(createSong(musicData, songVkey))
            }
          })
        })
        console.log(ret)
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position fixed
    z-index 100
    top 0
    left: 0
    right: 0
    bottom 0
    background: $color-background

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
