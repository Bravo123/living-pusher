import Taro, { Config, Component } from '@tarojs/taro';
import { View, Text, Input, Button } from '@tarojs/components';
import './index.scss';
import classnames from 'classnames';
import { globalDataSet, globalDataDelete } from '../../lib/globalData';

const initialState = {
  resolutionList: [
    {
      mode: '标清',
      resolution: '480p/1800kbsp',
      modeValue: 'SD',
    },
    {
      mode: '高清',
      resolution: '720p/2700kbsp',
      modeValue: 'HD',
    },
    {
      mode: '超清',
      resolution: '1080p/3000kbsp',
      modeValue: 'FHD',
    },
  ],
  activeResolutionIndex: 0,
  activeOrientationIndex: 0,
  rtmp: '',
};

type State = Readonly<typeof initialState>;

export default class Index extends Component {
  config: Config = {
    navigationBarTitleText: '直播参数设置',
  };

  readonly state: State = initialState;

  componentWillMount() { }

  componentDidMount() { }

  preview() {
    this.storeLiveConfig()
    Taro.navigateTo({
      url: `/pages/living/index`
    })
  }

  startPush() {
    this.storeLiveConfig()
    globalDataDelete('rtmp')
    const { rtmp } = this.state
    if (!rtmp) {
      Taro.showToast({
        title: '请先输入推流地址',
        icon: 'none',
        duration: 2000,
      })
    } else {
      globalDataSet('rtmp', rtmp)
      Taro.navigateTo({
        url: `/pages/living/index`
      })
    }
  }

  storeLiveConfig() {
    const { resolutionList, activeResolutionIndex, activeOrientationIndex } = this.state
    globalDataSet('mode', resolutionList[activeResolutionIndex].modeValue)
    globalDataSet('orientation', activeOrientationIndex ? 'vertical' : 'horizontal')
  }

  getClipData() {
    Taro.getClipboardData({
      success: res => {
        this.setState({
          rtmp: res.data
        })
      }
    })
  }

  scan() {
    // 允许从相机和相册扫码
    Taro.scanCode({}).then(res => {
      this.setState({
        rtmp: res.result
      })
    })
  }

  render() {
    const { resolutionList, activeResolutionIndex, activeOrientationIndex, rtmp } = this.state
    return (
      <View className="container">
        {/* 推流地址 */}
        <View className="block">
          <View className="block-item block-header">
            <Text className="block-item__left-text">推流地址</Text>
            {/* <Text className="block-item__right-text">如何获取推流地址？</Text> */}
          </View>
          <View className="block-item block-body">
            <Input className="block-item__input" value={rtmp} onInput={(e) => {
              this.setState({
                rtmp: e.detail.value,
              })
            }} placeholder="以rtmp开头" />
            <View className="block-item__text" onClick={this.getClipData}>| 粘贴</View>
            <View className="block-item__scan" onClick={this.scan}>扫描</View>
          </View>
        </View>

        {/* 分辨率选择 */}
        <View className="block">
          <View className="block-item block-header">
            <Text className="block-item__left-text">分辨率直播模式</Text>
          </View>
          <View className="block-item block-body block-body-resolution">
            {
              resolutionList.map((resolution, index) => {
                return <View className={classnames(
                  'block-item__item', { 'active': index === activeResolutionIndex }
                )} key={resolution.mode} onClick={() => {
                  this.setState({
                    activeResolutionIndex: index,
                  })
                }}>
                  <View className="block-item__item-mode">{resolution.mode}</View>
                  <View className="block-item__item-resolution">{resolution.resolution}</View>
                </View>
              })
            }
          </View>
        </View>

        {/* 屏幕方向 */}
        <View className="block">
          <View className="block-item block-header">
            <Text className="block-item__left-text">屏幕方向</Text>
          </View>
          <View className="block-item block-body block-body-orientation">
            <View className={classnames(
              'block-item__item', { 'active': 0 === activeOrientationIndex }
            )} onClick={() => { this.setState({ activeOrientationIndex: 0 }) }}>
              <View className="block-item__item-orientation">横屏</View>
            </View>
            <View className={classnames(
              'block-item__item', { 'active': 1 === activeOrientationIndex }
            )} onClick={() => { this.setState({ activeOrientationIndex: 1 }) }}>
              <View className="block-item__item-orientation">竖屏</View>
            </View>
          </View>
        </View>

        <Button className="btn btn-start" onClick={this.startPush}>开始推流</Button>

        <Button className="btn btn-preview" onClick={this.preview}>直接预览</Button>

      </View>
    );
  }
}
