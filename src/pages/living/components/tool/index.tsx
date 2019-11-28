/**
 * 组件模板
 * 使用时修改 `Temp` 为对应的组件名
 */
import { View, Image, Text } from '@tarojs/components';

import './index.scss';
import classnames from 'classnames';
import { useState } from '@tarojs/taro';
import IconPlay from './image/播放.png';
import IconPause from './image/暂停.png';
import IconFront from './image/翻转镜头.png';
import IconFlash from './image/闪光灯打开.png';
import IconFlashPause from './image/闪光灯关闭.png';
import IconCamera from './image/摄像头.png';
import IconVoice from './image/声音.png';
import IconMute from './image/静音.png';
import IconBeauty from './image/美颜.png';
import IconLog from './image/日志.png';

export interface ToolProps {
  livePusherContext: any,
  rtmp: string,
  orientation: string,
  toggleMute: () => void,
  toggleBeauty: () => void,
  toggleLog: () => void,
  toggleCamera: () => void,
}

export default function Temp(props: ToolProps) {
  const { livePusherContext, rtmp, toggleMute, toggleBeauty, toggleLog, toggleCamera, orientation } = props;
  const [isPushing, setIsPushing] = useState(true);
  const [isFront, setIsFront] = useState(true);
  const [isFlash, setIsFlash] = useState(false);
  const [isCamera, setIsCamera] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [isBeauty, setIsBeauty] = useState(true);
  const [isLog, setIsLog] = useState(false);

  const toolList = [
    {
      status: isPushing,
      text: '开始',
      textActive: '停止',
      icon: IconPlay,
      iconActive: IconPause,
      func: () => {
        if (isPushing) {
          if (rtmp) {
            livePusherContext.stop()
          } else {
            livePusherContext.stopPreview()
          }
        } else {
          if (rtmp) {
            livePusherContext.start()
          } else {
            livePusherContext.startPreview()
          }
        }
        setIsPushing(!isPushing);
      }
    },
    {
      status: isFront,
      text: '前后置',
      textActive: '前后置',
      icon: IconFront,
      iconActive: IconFront,
      func: () => {
        livePusherContext.switchCamera()
        setIsFront(!isFront);
      }
    },
    {
      status: isFlash,
      text: '闪光灯 关',
      textActive: '闪光灯 开',
      icon: IconFlashPause,
      iconActive: IconFlash,
      func: () => {
        livePusherContext.toggleTorch()
        setIsFlash(!isFlash);
      }
    },
    {
      status: isCamera,
      text: '摄像头 关',
      textActive: '摄像头 开',
      icon: IconCamera,
      iconActive: IconCamera,
      func: () => {
        toggleCamera()
        setIsCamera(!isCamera);
      }
    },
    {
      status: isMute,
      text: '声 关音',
      textActive: '声音 开',
      icon: IconVoice,
      iconActive: IconMute,
      func: () => {
        toggleMute()
        setIsMute(!isMute);
      }
    },
    {
      status: isBeauty,
      text: '美颜 关',
      textActive: '美颜 开',
      icon: IconBeauty,
      iconActive: IconBeauty,
      func: () => {
        toggleBeauty()
        setIsBeauty(!isBeauty);
      }
    },
    {
      status: isLog,
      text: '日志 关',
      textActive: '日志 开',
      icon: IconLog,
      iconActive: IconLog,
      func: () => {
        toggleLog()
        setIsLog(!isLog);
      }
    },
  ];

  return <View className={classnames(
    "tool", { 'vertical': orientation === 'vertical' }, { 'horizontal': orientation === 'horizontal' }
  )}>
    {
      toolList.map(item => {
        return <View className="tool-item"  key={item.text} onClick={item.func}>
          <Image className="icon" src={item.status ? item.iconActive : item.icon} />
          <Text className="text">{item.status ? item.textActive : item.text}</Text>
        </View>
      })
    }
  </View>;
}

Temp.options = {
  addGlobalClass: true,
};
