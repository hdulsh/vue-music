<template>
  <div class="singer">
    <list-view :data="singers" @select="selectSinger"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
  import ListView from 'src/base/listview/listview'
  import {getSingerList} from 'src/api/singer'
  import {ERR_OK} from 'src/api/config'
  import Singer from 'common/js/singer'
  import {mapMutations} from 'vuex'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    name: 'singer',
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER' // 对应mutation-types中定义的常量
      }),
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        // 为了得到有序列表需要处理map
        let hot = [] // title是热门的歌手
        let ret = [] // title是A-Z的歌手
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      }
    },
    components: {
      ListView
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .singer
    position fixed
    top: 88px
    bottom: 0
    width 100%
</style>
