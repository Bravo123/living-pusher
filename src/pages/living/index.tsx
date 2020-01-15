/**
 * page模板
 * 使用时修改 `Temp` 为对应的page名
 */

import Taro, { Config, Component } from '@tarojs/taro';
import { View, LivePusher } from '@tarojs/components';
import './index.scss';
import Tool from './components/tool';
import Log from './components/log';
import { globalDataGet } from '../../lib/globalData';

const initialState = {
  rtmp: '',
  livePusherContext: {} as any,
  isBeauty: true,
  isMute: false,
  isLog: false,
  enableCamera: true,
  statusList: [] as String[],
  mode: '' as 'SD' | 'HD' | 'FHD',
  orientation: '' as 'vertical' | 'horizontal',
};

// 推到state中的类型，所以state中的初始参数用as的方式来指定类型
type State = Readonly<typeof initialState>;

export default class Temp extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '推流',
  };

  readonly state: State = initialState;

  componentWillMount() {
    const rtmp = globalDataGet('rtmp');
    if (rtmp) {
      this.setState({
        rtmp,
      })
    } else {
      Taro.showToast({
        title: '当前是预览模式',
        icon: 'none'
      })
    }
    this.setState({
      mode: globalDataGet('mode'),
      orientation: globalDataGet('orientation'),
    })
  }

  componentDidMount() {
    this.setState({
      livePusherContext: Taro.createLivePusherContext()
    }, () => {
      if (!this.state.rtmp) {
        this.state.livePusherContext.startPreview()
      }
    })
  }

  componentWillUnmount() {
    this.setState({
      statusList: []
    })
  }

  componentDidShow() {
    Taro.setKeepScreenOn({
      keepScreenOn: true
    });
  }

  componentDidHide() { }

  stateChange(e) {
    const { statusList } = { ...this.state }
    statusList.push(e.detail.message)
    this.setState({
      statusList,
    })
  }

  toggleBeauty() {
    this.setState({
      isBeauty: !this.state.isBeauty
    })
  }

  toggleLog() {
    this.setState({
      isLog: !this.state.isLog
    })
  }

  toggleMute() {
    this.setState({
      isMute: !this.state.isMute
    })
  }

  toggleCamera() {
    console.log('camera')
    this.setState({
      enableCamera: !this.state.enableCamera
    })
  }

  render() {
    const { rtmp, livePusherContext, enableCamera, isBeauty, isMute, isLog, mode, orientation, statusList } = this.state
    return (
      <View className='container'>
        <LivePusher
          className='live-pusher'
          url={rtmp || ''}
          waitingImage='https://314live.image.alimmdn.com/5/1/157138508422.png'
          mode={mode}
          orientation={orientation}
          autopush
          enableCamera={enableCamera}
          beauty={isBeauty ? 9 : 0}
          muted={isMute}
          onStateChange={e => { this.stateChange(e) }}
        />
        <Tool
          rtmp={rtmp}
          orientation={orientation}
          livePusherContext={livePusherContext}
          toggleBeauty={() => { this.toggleBeauty() }}
          toggleLog={() => { this.toggleLog() }}
          toggleMute={() => { this.toggleMute() }}
          toggleCamera={() => { this.toggleCamera() }}
        />
        {isLog && <Log orientation={orientation} LogList={statusList} />}
      </View>
    );
  }
}
